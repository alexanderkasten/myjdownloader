
import { createSecret, sign, encrypt, decrypt, updateEncryptionToken } from "./utils/crypto"
import { Accounts } from "./namespaces/Accounts"
import { AccountsV2 } from "./namespaces/AccountsV2"
import { Captcha } from "./namespaces/Captcha"
import { DownloadsV2 } from "./namespaces/DownloadsV2"
import { LinkgrabberV2 } from "./namespaces/LinkgrabberV2"
import { Events } from "./namespaces/Events"
import { DownloadEvents } from "./namespaces/DownloadEvents"

/**
 * A class that provides an interface to interact with JDownloader API.
 * Handles authentication, encryption, and communication with JDownloader servers.
 *
 * @class JDownloader
 *
 *
 * @property {Accounts} accounts - Interface for accounts-related operations
 * @property {AccountsV2} accountsV2 - Interface for accounts-related operations (V2)
 * @property {Captcha} captcha - Interface for captcha-related operations
 * @property {DownloadsV2} downloadsV2 - Interface for download operations (V2)
 * @property {LinkgrabberV2} linkgrabberV2 - Interface for link grabber operations (V2)
 * @property {Events} events - Interface for event handling
 * @property {DownloadEvents} downloadEvents - Interface for download event handling
 *
 * @constructor
 * @param {string} email - The user's email address for authentication
 * @param {string} password - The user's password for authentication
 *
 * @example
 * ```typescript
 * const jd = new JDownloader('user@example.com', 'password');
 * await jd.connect();
 * ```
 */
class JDownloader {
  private appKey = "my_jd_nodeJS_webinterface"
  private serverDomain = "server"
  private deviceDomain = "device"

  private loginSecret: Buffer | null = null
  private deviceSecret: Buffer | null = null
  private serverEncryptionToken: Buffer | null = null
  private deviceEncryptionToken: Buffer | null = null
  private sessionToken: string | null = null
  private regainToken: string | null = null
  private ridCounter = 0
  private connectionType: "my" | "api" = "my" // my or api

  // Namespace members
  public accounts: Accounts
  public accountsV2: AccountsV2
  public captcha: Captcha
  public downloadsV2: DownloadsV2
  public linkgrabberV2: LinkgrabberV2
  public events: Events
  public downloadEvents: DownloadEvents

  constructor(
    private email?: string,
    private password?: string,
    private apiUrl = "https://api.jdownloader.org"
  ) {
    this.email = email?.toLowerCase()
    if (!this.email || !this.password) {
      console.log("No email or password provided. Using direct api mode.");
      this.connectionType = "api";
    }
    // Initialize namespace members with the bound makeRequest method
    this.accounts = new Accounts(this.callAction.bind(this))
    this.accountsV2 = new AccountsV2(this.callAction.bind(this))
    this.captcha = new Captcha(this.callAction.bind(this))
    this.downloadsV2 = new DownloadsV2(this.callAction.bind(this))
    this.linkgrabberV2 = new LinkgrabberV2(this.callAction.bind(this))
    this.events = new Events(this.callAction.bind(this))
    this.downloadEvents = new DownloadEvents(this.callAction.bind(this))
  }

  private uniqueRid(): number {
    this.ridCounter = Date.now()
    return this.ridCounter
  }

  private async callServer(query: string, key: Buffer, params: any = null): Promise<any> {
    let rid = this.uniqueRid()

    if (params) {
      params = encrypt(JSON.stringify(params), key)
      rid = this.ridCounter
    }

    if (query.includes("?")) {
      query += "&"
    } else {
      query += "?"
    }

    query = `${query}rid=${rid}`
    const signature = sign(key, query)
    query += `&signature=${signature}`

    const url = this.apiUrl + query

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/aesjson-jd; charset=utf-8",
      },
      body: params,
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.text()
    try {
      const decrypted = decrypt(data, key)
      return JSON.parse(decrypted.replace(/[^\x20-\x7E]/g, ""))
    } catch (error) {
      console.error("Decryption error:", error)
      throw error
    }
  }

  private async callAction(action: string, deviceId: string, params: any = null): Promise<any> {
    if (this.connectionType === 'my' && (!this.sessionToken || !this.deviceEncryptionToken) ) {
      throw new Error("Not connected")
    }

    const query = this.connectionType === 'api' ? action : `/t_${encodeURIComponent(this.sessionToken ?? '')}_${encodeURIComponent(deviceId)}${action}`

    const json = {
      url: action,
      params,
      rid: this.uniqueRid(),
      apiVer: 1,
    }

    const encrypted = this.connectionType === 'api' ? params[0] : encrypt(JSON.stringify(json), this.deviceEncryptionToken ?? Buffer.from(' '))

    const response = await fetch(this.apiUrl + query, {
      method: "POST",
      headers: {
        "Content-Type": this.connectionType === 'api' ? "application/json; charset=utf-8" : "application/aesjson-jd; charset=utf-8",
      },
      body: encrypted,
    })

    if (!response.ok) {
      const error = await response.text()
      if (this.connectionType === 'api') {
        throw new Error(error)
      }
      throw new Error(decrypt(error, this.deviceEncryptionToken?? Buffer.from('sfdsfdsfdsfdsf')))
    }

    if (this.connectionType === 'api') {
      return response.json()
    }
    const data = await response.text()
    try {
      const decrypted = decrypt(data, this.deviceEncryptionToken?? Buffer.from('sfdsfdsfdsfdsf'))
      return JSON.parse(decrypted.replace(/[^\x20-\x7E]/g, ""))
    } catch (error) {
      console.error("Decryption error:", error)
      throw error
    }
  }

  async connect(): Promise<string> {
    if (!this.email || !this.password) {
      const response = await fetch(this.apiUrl + "/jdcheckjson");
      const data = await response.json();
      console.log(`Connected to JDownloader API with ${data.name} and ID ${data.deviceId}`);
      return data.deviceId;
    }
    this.loginSecret = createSecret(this.email, this.password, this.serverDomain)
    this.deviceSecret = createSecret(this.email, this.password, this.deviceDomain)

    const query = `/my/connect?email=${encodeURIComponent(this.email)}&appkey=${this.appKey}`

    try {
      const response = await this.callServer(query, this.loginSecret)

      this.sessionToken = response.sessiontoken
      this.regainToken = response.regaintoken
      const deviceId = response.deviceid

      this.serverEncryptionToken = updateEncryptionToken(this.loginSecret, this.sessionToken!)
      this.deviceEncryptionToken = updateEncryptionToken(this.deviceSecret, this.sessionToken!)

      console.log("Connected successfully")
      return deviceId
    } catch (error) {
      console.error("Failed to connect:", error)
      throw error
    }
  }

  async disconnect(): Promise<void> {
    if (this.connectionType === "api") {
      console.log("Disconnected successfully")
      return;
    }
    if (!this.sessionToken || !this.serverEncryptionToken) {
      throw new Error("Not connected")
    }

    try {
      const query = `/my/disconnect?sessiontoken=${encodeURIComponent(this.sessionToken)}`
      await this.callServer(query, this.serverEncryptionToken)

      this.sessionToken = null
      this.regainToken = null
      this.serverEncryptionToken = null
      this.deviceEncryptionToken = null

      console.log("Disconnected successfully")
    } catch (error) {
      console.error("Failed to disconnect:", error)
      throw error
    }
  }

  private async makeRequest(endpoint: string, deviceId: string, method = "GET", body: any = null): Promise<any> {
    if (!this.sessionToken) {
      throw new Error("Not connected. Please call connect() first.")
    }

    return this.callAction(endpoint, deviceId, body)
  }

  async listDevices(): Promise<any> {
    if (this.connectionType === "api") {
      const response = await fetch(this.apiUrl + "/jdcheckjson");
      const data = await response.json();
      return {
        list: [{...data, id: data.deviceId}]
      }
    }
    if (!this.sessionToken || !this.serverEncryptionToken) {
      throw new Error("Not connected")
    }

    const query = `/my/listdevices?sessiontoken=${encodeURIComponent(this.sessionToken)}`
    return this.callServer(query, this.serverEncryptionToken)
  }

  // Example method using deviceId
  async getDirectConnectionInfos(deviceId: string): Promise<any> {
    return this.callAction("/device/getDirectConnectionInfos", deviceId, null)
  }
}

export default JDownloader

