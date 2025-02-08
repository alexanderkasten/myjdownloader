
import { createSecret, sign, encrypt, decrypt, updateEncryptionToken } from "./utils/crypto"
import { Accounts } from "./namespaces/Accounts"
import { AccountsV2 } from "./namespaces/AccountsV2"
import { Captcha } from "./namespaces/Captcha"
import { DownloadsV2 } from "./namespaces/DownloadsV2"
import { LinkgrabberV2 } from "./namespaces/LinkgrabberV2"
import { Events } from "./namespaces/Events"
import { DownloadEvents } from "./namespaces/DownloadEvents"

class JDownloader {
  private apiUrl = "https://api.jdownloader.org"
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

  // Namespace members
  public accounts: Accounts
  public accountsV2: AccountsV2
  public captcha: Captcha
  public downloadsV2: DownloadsV2
  public linkgrabberV2: LinkgrabberV2
  public events: Events
  public downloadEvents: DownloadEvents

  constructor(
    private email: string,
    private password: string,
  ) {
    this.email = email.toLowerCase()
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
    if (!this.sessionToken || !this.deviceEncryptionToken) {
      throw new Error("Not connected")
    }

    const query = `/t_${encodeURIComponent(this.sessionToken)}_${encodeURIComponent(deviceId)}${action}`

    const json = {
      url: action,
      params,
      rid: this.uniqueRid(),
      apiVer: 1,
    }

    const encrypted = encrypt(JSON.stringify(json), this.deviceEncryptionToken)

    const response = await fetch(this.apiUrl + query, {
      method: "POST",
      headers: {
        "Content-Type": "application/aesjson-jd; charset=utf-8",
      },
      body: encrypted,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(decrypt(error, this.deviceEncryptionToken))
    }

    const data = await response.text()
    try {
      const decrypted = decrypt(data, this.deviceEncryptionToken)
      return JSON.parse(decrypted.replace(/[^\x20-\x7E]/g, ""))
    } catch (error) {
      console.error("Decryption error:", error)
      throw error
    }
  }

  async connect(): Promise<string> {
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

