import type { EventSubscription, EventData } from "../types/events"

export class Events {
  constructor(private callAction: (action: string, deviceId: string, params: any) => Promise<any>) {}

  async subscribe(deviceId: string, subscription: EventSubscription): Promise<string> {
    const params = JSON.stringify(subscription)
    const response = await this.callAction("/events/subscribe", deviceId, [params])
    return response.subscriptionid
  }

  async unsubscribe(deviceId: string, subscriptionId: string): Promise<void> {
    const params = JSON.stringify({ subscriptionid: subscriptionId })
    return this.callAction("/events/unsubscribe", deviceId, [params])
  }

  async setSubscriptionSettings(
    deviceId: string,
    subscriptionId: string,
    settings: Partial<EventSubscription>,
  ): Promise<void> {
    const params = JSON.stringify({
      subscriptionid: subscriptionId,
      ...settings,
    })
    return this.callAction("/events/setSubscriptionSettings", deviceId, [params])
  }

  async poll(deviceId: string, subscriptionId: string): Promise<EventData[]> {
    const params = JSON.stringify({ subscriptionid: subscriptionId })
    return this.callAction("/events/poll", deviceId, [params])
  }
}

