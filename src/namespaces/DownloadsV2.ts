import type {
  DownloadLinkQueryOptions,
  DownloadPackageQueryOptions,
  DownloadCleanupOptions,
  DownloadPriority,
  DownloadPackageInfo,
  DownloadLinkInfo,
} from "../types/downloads"

export class DownloadsV2 {
  constructor(private callAction: (action: string, deviceId: string, params: any) => Promise<any>) {}

  private defaultLinkQueryOptions: DownloadLinkQueryOptions = {
    addedDate: true,
    bytesLoaded: true,
    bytesTotal: true,
    enabled: true,
    finished: true,
    url: true,
    status: true,
    speed: true,
    finishedDate: true,
    priority: true,
    extractionStatus: true,
    host: true,
    origin: true,
    running: true,
  }

  private defaultPackageQueryOptions: DownloadPackageQueryOptions = {
    bytesLoaded: true,
    bytesTotal: true,
    childCount: true,
    comment: true,
    enabled: true,
    eta: true,
    finished: true,
    hosts: true,
    priority: true,
    running: true,
    saveTo: true,
    speed: true,
    status: true,
  }

  async queryLinks(deviceId: string, options: DownloadLinkQueryOptions = {}): Promise<DownloadLinkInfo[]> {
    const params = JSON.stringify({ ...this.defaultLinkQueryOptions, ...options })
    return this.callAction("/downloadsV2/queryLinks", deviceId, [params])
  }

  async queryPackages(
    deviceId: string,
    packageUUIDs?: string[],
    options: DownloadPackageQueryOptions = {},
  ): Promise<DownloadPackageInfo[]> {
    const params = JSON.stringify({
      ...this.defaultPackageQueryOptions,
      ...options,
      packageUUIDs,
    })
    return this.callAction("/downloadsV2/queryPackages", deviceId, [params])
  }

  async removeLinks(deviceId: string, linkIds: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds })
    return this.callAction("/downloadsV2/removeLinks", deviceId, [params])
  }

  async removePackages(deviceId: string, packageIds: string[]): Promise<void> {
    const params = JSON.stringify({ packageIds })
    return this.callAction("/downloadsV2/removePackages", deviceId, [params])
  }

  async start(deviceId: string, linkIds?: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds })
    return this.callAction("/downloadsV2/start", deviceId, [params])
  }

  async stop(deviceId: string, linkIds?: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds })
    return this.callAction("/downloadsV2/stop", deviceId, [params])
  }

  async pause(deviceId: string, linkIds?: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds })
    return this.callAction("/downloadsV2/pause", deviceId, [params])
  }

  async resume(deviceId: string, linkIds?: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds })
    return this.callAction("/downloadsV2/resume", deviceId, [params])
  }

  async setPriority(deviceId: string, linkIds: string[], priority: DownloadPriority): Promise<void> {
    const params = JSON.stringify({ linkIds, priority })
    return this.callAction("/downloadsV2/setPriority", deviceId, [params])
  }

  async cleanUp(deviceId: string, options: DownloadCleanupOptions = {}): Promise<void> {
    const defaultOptions: DownloadCleanupOptions = {
      mode: "REMOVE_LINKS_ONLY",
      selection: "ALL",
      linkState: "FINISHED",
    }
    const params = JSON.stringify({ ...defaultOptions, ...options })
    return this.callAction("/downloadsV2/cleanup", deviceId, [params])
  }
}

