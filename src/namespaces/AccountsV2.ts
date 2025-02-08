export class AccountsV2 {
  constructor(private callAction: (action: string, deviceId: string, params: any) => Promise<any>) {}

  async listAccounts(deviceId: string): Promise<any> {
    return this.callAction("/accountsv2/listAccounts", deviceId, null)
  }

  async addAccount(deviceId: string, username: string, password: string): Promise<void> {
    const params = JSON.stringify({ username, password })
    return this.callAction("/accountsv2/addAccount", deviceId, [params])
  }

  async removeAccounts(deviceId: string, accountIds: string[]): Promise<void> {
    const params = JSON.stringify({ accountIds })
    return this.callAction("/accountsv2/removeAccounts", deviceId, [params])
  }

  async enableAccounts(deviceId: string, accountIds: string[]): Promise<void> {
    const params = JSON.stringify({ accountIds })
    return this.callAction("/accountsv2/enableAccounts", deviceId, [params])
  }

  async disableAccounts(deviceId: string, accountIds: string[]): Promise<void> {
    const params = JSON.stringify({ accountIds })
    return this.callAction("/accountsv2/disableAccounts", deviceId, [params])
  }
}

