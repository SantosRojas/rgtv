export class ProxyUrlBuilder {
  private baseUrl: string | null

  constructor(baseUrl: string | null) {
    this.baseUrl = baseUrl
  }

  build(streamUrl: string): string {
    if (!this.baseUrl || this.baseUrl.trim() === '') return streamUrl

    const base = this.baseUrl.replace(/\/+$/, '')
    return `${base}/${streamUrl}`
  }

  setBaseUrl(url: string | null) {
    this.baseUrl = url
  }
}
