export interface EventSubscription {
  subscriptionid?: string
  eventids: string[]
  maxPolls?: number
  maxKeepalive?: number
}

export interface EventData {
  eventid: string
  eventdata: any
  timestamp: number
}

