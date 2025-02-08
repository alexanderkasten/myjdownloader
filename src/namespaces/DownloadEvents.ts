export class DownloadEvents {
  constructor(private callAction: (action: string, deviceId: string, params: any) => Promise<any>) {}

  async publish(
    deviceId: string,
    eventData: {
      eventid: string
      packageUUIDs?: string[]
      linkUUIDs?: string[]
      data?: any
    },
  ): Promise<void> {
    const params = JSON.stringify(eventData)
    return this.callAction("/downloadevents/publish", deviceId, [params])
  }
}

