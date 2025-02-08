export interface AccountInfo {
  uuid: string
  username: string
  enabled: boolean
  valid: boolean
  premium: boolean
  unlimited: boolean
  validUntil: number
  trafficLeft: number
  trafficMax: number
}

export interface AccountQuery {
  username?: string
  password?: string
  uuid?: string
}

