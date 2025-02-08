export class Accounts {
  constructor(private callAction: (action: string, deviceId: string, params: any) => Promise<any>) {}

  async listAccounts(deviceId: string): Promise<any> {
    return this.callAction("/accounts/listAccounts", deviceId, null)
  }

  async addAccount(deviceId: string, username: string, password: string): Promise<void> {
    const params = JSON.stringify({ username, password })
    return this.callAction("/accounts/addAccount", deviceId, [params])
  }

  async removeAccounts(deviceId: string, accountIds: string[]): Promise<void> {
    const params = JSON.stringify({ accountIds })
    return this.callAction("/accounts/removeAccounts", deviceId, [params])
  }

  async enableAccounts(deviceId: string, accountIds: string[]): Promise<void> {
    const params = JSON.stringify({ accountIds })
    return this.callAction("/accounts/enableAccounts", deviceId, [params])
  }

  async disableAccounts(deviceId: string, accountIds: string[]): Promise<void> {
    const params = JSON.stringify({ accountIds })
    return this.callAction("/accounts/disableAccounts", deviceId, [params])
  }
}

