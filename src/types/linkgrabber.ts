export interface CrawledPackageInfo {
  uuid: number
  name: string
  links: CrawledLinkInfo[]
}

export interface CrawledLinkInfo {
  uuid: number
  url: string
  name: string
  packageUUID: string
  online: boolean
  size: number
}

export interface AddLinksQuery {
  links: string
  packageName?: string
  destinationFolder?: string
  extractPassword?: string
  downloadPassword?: string
  priority?: "HIGHEST" | "HIGHER" | "HIGH" | "DEFAULT" | "LOWER"
  autostart?: boolean
}

export interface LinkgrabberQueryOptions {
  addedDate?: boolean
  availability?: boolean
  bytesLoaded?: boolean
  bytesTotal?: boolean
  comment?: boolean
  enabled?: boolean
  eta?: boolean
  extractionStatus?: boolean
  finished?: boolean
  finishedDate?: boolean
  host?: boolean
  name?: boolean
  packageUUID?: boolean
  priority?: boolean
  running?: boolean
  saveTo?: boolean
  speed?: boolean
  status?: boolean
  url?: boolean
  variants?: boolean
}

export interface LinkgrabberPackageQueryOptions {
  availableOfflineCount?: boolean
  availableOnlineCount?: boolean
  availableTempUnknownCount?: boolean
  availableUnknownCount?: boolean
  bytesTotal?: boolean
  childCount?: boolean
  comment?: boolean
  enabled?: boolean
  hosts?: boolean
  name?: boolean
  saveTo?: boolean
  unknownCount?: boolean
  uuid?: boolean
}

export interface AddLinksOptions {
  autostart?: boolean
  deepDecrypt?: boolean
  destinationFolder?: string
  downloadPassword?: string
  extractPassword?: string
  overwritePackagizerRules?: boolean
  packageName?: string
  priority?: "DEFAULT" | "HIGH" | "HIGHER" | "HIGHEST" | "LOW" | "LOWER" | "LOWEST"
}

export type LinkgrabberPriority = "HIGHEST" | "HIGHER" | "HIGH" | "DEFAULT" | "LOW" | "LOWER" | "LOWEST"

export interface CrawledPackageInfo {
  uuid: number
  name: string
  availableOfflineCount: number
  availableOnlineCount: number
  availableTempUnknownCount: number
  availableUnknownCount: number
  bytesTotal: number
  childCount: number
  comment: string
  enabled: boolean
  hosts: string[]
  saveTo: string
  unknownCount: number
}

export interface QueryPackagesResponse {
  data: CrawledPackageInfo[]
  rid: number
}

export type UrlDisplayTypeStorable = "CUSTOM" | "ORIGIN" | "REFERRER"

export interface GetDownloadUrlsResponse {
  [key: string]: number[]
}
