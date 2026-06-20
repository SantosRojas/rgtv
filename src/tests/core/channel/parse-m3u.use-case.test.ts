import { describe, it, expect } from 'vitest'
import { parseM3U } from '../../../core/channel/infrastructure/m3u.parser.ts'

describe('ParseM3UUseCase', () => {
  it('should parse a valid M3U playlist', () => {
    const content = `#EXTM3U
#EXTINF:-1 tvg-logo="https://example.com/logo.png" tvg-country="US" tvg-language="EN" group-title="News",CNN
http://example.com/stream1.ts
#EXTINF:-1 tvg-country="GB" tvg-language="EN" group-title="Sports",BBC Sport
http://example.com/stream2.ts`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(2)
    expect(channels[0]?.name).toBe('CNN')
    expect(channels[0]?.country).toBe('US')
    expect(channels[0]?.category).toBe('News')
    expect(channels[0]?.language).toBe('EN')
    expect(channels[0]?.logo).toBe('https://example.com/logo.png')
    expect(channels[0]?.url).toBe('http://example.com/stream1.ts')
  })

  it('should throw on empty content', () => {
    expect(() => parseM3U('')).toThrow('Empty M3U content')
    expect(() => parseM3U('   ')).toThrow('Empty M3U content')
  })

  it('should throw on invalid header', () => {
    expect(() => parseM3U('NOT A VALID HEADER\ncontent')).toThrow('Invalid M3U header')
  })

  it('should normalize missing fields to defaults', () => {
    const content = `#EXTM3U
#EXTINF:-1,Test Channel
http://example.com/stream.ts`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(1)
    expect(channels[0]?.country).toBe('Unknown')
    expect(channels[0]?.category).toBe('General')
    expect(channels[0]?.language).toBe('Unknown')
    expect(channels[0]?.logo).toBeNull()
    expect(channels[0]?.isFavorite).toBe(false)
  })

  it('should ignore lines that are not URLs', () => {
    const content = `#EXTM3U
#EXTINF:-1,Valid Channel
http://example.com/valid.ts
#EXTINF:-1,Another Valid
https://example.com/another.ts
#EXTVLCOPT:http-user-agent=Mozilla`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(2)
  })

  it('should detect origin from URL', () => {
    const content = `#EXTM3U
#EXTINF:-1,IPTV Channel
https://iptv-org.github.io/iptv/channel.ts`

    const channels = parseM3U(content)
    expect(channels[0]?.origin).toBe('default_iptv_org')
  })

  it('should assign custom origin by default', () => {
    const content = `#EXTM3U
#EXTINF:-1,Custom Channel
https://myserver.com/stream.ts`

    const channels = parseM3U(content, 'custom')
    expect(channels[0]?.origin).toBe('custom')
  })
})
