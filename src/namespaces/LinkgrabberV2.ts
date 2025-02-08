import type {
  LinkgrabberQueryOptions,
  LinkgrabberPackageQueryOptions,
  AddLinksOptions,
  LinkgrabberPriority,
  CrawledLinkInfo,
  QueryPackagesResponse,
  UrlDisplayTypeStorable,
  GetDownloadUrlsResponse,
} from "../types/linkgrabber"

export class LinkgrabberV2 {
  constructor(private callAction: (action: string, deviceId: string, params: any) => Promise<any>) {}

  private defaultLinkQueryOptions: LinkgrabberQueryOptions = {
    addedDate: true,
    availability: true,
    bytesLoaded: true,
    bytesTotal: true,
    enabled: true,
    name: true,
    packageUUID: true,
    url: true,
    status: true,
    priority: true,
    host: true,
    running: true,
    variants: true,
  }

  private defaultPackageQueryOptions: LinkgrabberPackageQueryOptions = {
    availableOfflineCount: true,
    availableOnlineCount: true,
    bytesTotal: true,
    childCount: true,
    comment: true,
    enabled: true,
    hosts: true,
    name: true,
    saveTo: true,
    uuid: true,
  }

  async queryLinks(deviceId: string, options: LinkgrabberQueryOptions = {}): Promise<CrawledLinkInfo[]> {
    const params = JSON.stringify({ ...this.defaultLinkQueryOptions, ...options })
    return this.callAction("/linkgrabberv2/queryLinks", deviceId, [params])
  }

  async queryPackages(deviceId: string, options: LinkgrabberPackageQueryOptions = {}): Promise<QueryPackagesResponse> {
    const params = JSON.stringify({ ...this.defaultPackageQueryOptions, ...options })
    return this.callAction("/linkgrabberv2/queryPackages", deviceId, [params])
  }

  async addLinks(deviceId: string, links: string[], options: AddLinksOptions = {}): Promise<any> {
    const defaultOptions: AddLinksOptions = {
      autostart: false,
      priority: "DEFAULT",
    }
    const params = JSON.stringify({
      links: links.join(","),
      ...defaultOptions,
      ...options,
    })
    return this.callAction("/linkgrabberv2/addLinks", deviceId, [params])
  }

  async removeLinks(deviceId: string, linkIds: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds })
    return this.callAction("/linkgrabberv2/removeLinks", deviceId, [params])
  }

  async removePackages(deviceId: string, packageIds: string[]): Promise<void> {
    const params = JSON.stringify({ packageIds })
    return this.callAction("/linkgrabberv2/removePackages", deviceId, [params])
  }

  async setEnabled(deviceId: string, linkIds: string[], enabled: boolean): Promise<void> {
    const params = JSON.stringify({ linkIds, enabled })
    return this.callAction("/linkgrabberv2/setEnabled", deviceId, [params])
  }

  async setPriority(deviceId: string, linkIds: string[], priority: LinkgrabberPriority): Promise<void> {
    const params = JSON.stringify({ linkIds, priority })
    return this.callAction("/linkgrabberv2/setPriority", deviceId, [params])
  }

  async startOnlineStatusCheck(deviceId: string, linkIds?: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds })
    return this.callAction("/linkgrabberv2/startOnlineStatusCheck", deviceId, [params])
  }

  async getDownloadUrls(
    deviceId: string,
    linkIds: number[],
    packageIds: number[],
    urlDisplayTypes: UrlDisplayTypeStorable[],
  ): Promise<GetDownloadUrlsResponse> {
    const params = JSON.stringify({ linkIds, packageIds, urlDisplayTypes })
    return this.callAction("/linkgrabberv2/getDownloadUrls", deviceId, [params])
  }

  async moveToDownloadlist(deviceId: string, linkIds?: string[], packageIds?: string[]): Promise<void> {
    const params = JSON.stringify({ linkIds, packageIds })
    return this.callAction("/linkgrabberv2/moveToDownloadlist", deviceId, [params])
  }

  async renameLink(deviceId: string, linkId: string, newName: string): Promise<void> {
    const params = JSON.stringify({ linkId, newName })
    return this.callAction("/linkgrabberv2/renameLink", deviceId, [params])
  }

  async moveLinks(deviceId: string, linkIds: string[], targetPackageId: string): Promise<void> {
    const params = JSON.stringify({ linkIds, targetPackageId })
    return this.callAction("/linkgrabberv2/moveLinks", deviceId, [params])
  }

  async addContainer(deviceId: string, type: string, content: string): Promise<any> {
    const params = JSON.stringify({ type, content })
    return this.callAction("/linkgrabberv2/addContainer", deviceId, [params])
  }
}

