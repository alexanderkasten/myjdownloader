export interface DownloadPackageInfo {
  uuid: string
  name: string
  status: string
  bytesLoaded: number
  bytesTotal: number
  enabled: boolean
  running: boolean
  speed: number
  eta: number
  finished: boolean
  links: DownloadLinkInfo[]
}

export interface DownloadLinkInfo {
  uuid: string
  url: string
  name: string
  status: string
  bytesLoaded: number
  bytesTotal: number
  enabled: boolean
  running: boolean
  speed: number
  eta: number
  finished: boolean
  packageUUID: string
}

export interface DownloadQuery {
  packageUUIDs?: string[]
  linkIds?: string[]
}


export interface DownloadLinkQueryOptions {
  addedDate?: boolean
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
  origin?: boolean
  priority?: boolean
  running?: boolean
  saveTo?: boolean
  speed?: boolean
  status?: boolean
  url?: boolean
  packageUUID?: boolean
}

export interface DownloadPackageQueryOptions {
  bytesLoaded?: boolean
  bytesTotal?: boolean
  childCount?: boolean
  comment?: boolean
  enabled?: boolean
  eta?: boolean
  finished?: boolean
  hosts?: boolean
  name?: boolean
  priority?: boolean
  running?: boolean
  saveTo?: boolean
  speed?: boolean
  status?: boolean
}

export interface DownloadCleanupOptions {
  mode?: "REMOVE_LINKS_AND_DELETE_FILES" | "REMOVE_LINKS_AND_RECYCLE_FILES" | "REMOVE_LINKS_ONLY"
  selection?: "SELECTED" | "UNSELECTED" | "ALL"
  linkState?: "FAILED" | "FINISHED" | "OFFLINE" | "TODO" | "ALL"
}

export type DownloadPriority = "HIGHEST" | "HIGHER" | "HIGH" | "DEFAULT" | "LOW" | "LOWER" | "LOWEST"

