import { describe, it, expect } from 'vitest'
import { ProxyUrlBuilder } from '../../../core/shared/application/proxy-url-builder.ts'

describe('ProxyUrlBuilder', () => {
  it('should return the original URL when no proxy is configured', () => {
    const builder = new ProxyUrlBuilder(null)
    expect(builder.build('https://example.com/stream.m3u8')).toBe('https://example.com/stream.m3u8')
  })

  it('should return the original URL when proxy is empty', () => {
    const builder = new ProxyUrlBuilder('')
    expect(builder.build('https://example.com/stream.m3u8')).toBe('https://example.com/stream.m3u8')
  })

  it('should prepend the proxy URL', () => {
    const builder = new ProxyUrlBuilder('https://my-proxy.com')
    expect(builder.build('https://example.com/stream.m3u8')).toBe(
      'https://my-proxy.com/https://example.com/stream.m3u8',
    )
  })

  it('should handle trailing slash in proxy URL', () => {
    const builder = new ProxyUrlBuilder('https://my-proxy.com/')
    expect(builder.build('https://example.com/stream.m3u8')).toBe(
      'https://my-proxy.com/https://example.com/stream.m3u8',
    )
  })

  it('should allow updating the proxy URL', () => {
    const builder = new ProxyUrlBuilder('https://old-proxy.com')
    builder.setBaseUrl('https://new-proxy.com')
    expect(builder.build('https://example.com/stream.m3u8')).toBe(
      'https://new-proxy.com/https://example.com/stream.m3u8',
    )
  })

  it('should clear the proxy when set to null', () => {
    const builder = new ProxyUrlBuilder('https://my-proxy.com')
    builder.setBaseUrl(null)
    expect(builder.build('https://example.com/stream.m3u8')).toBe('https://example.com/stream.m3u8')
  })
})
