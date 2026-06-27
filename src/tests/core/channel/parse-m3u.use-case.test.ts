import { describe, it, expect } from 'vitest'
import { parseM3U } from '../../../core/channel/infrastructure/m3u.parser.ts'

describe('ParseM3UUseCase', () => {
  it('should parse EXTINF with tvg-logo, group-title and name', () => {
    const content = `#EXTM3U
#EXTINF:-1 tvg-logo="https://example.com/logo.png" group-title="News",CNN
http://example.com/stream1.ts
#EXTINF:-1 group-title="Sports",BBC Sport
http://example.com/stream2.ts`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(2)
    expect(channels[0]?.name).toBe('CNN')
    expect(channels[0]?.category).toBe('News')
    expect(channels[0]?.logo).toBe('https://example.com/logo.png')
    expect(channels[0]?.url).toBe('http://example.com/stream1.ts')
    expect(channels[1]?.name).toBe('BBC Sport')
    expect(channels[1]?.category).toBe('Sports')
    expect(channels[1]?.logo).toBeNull()
  })

  it('should throw on empty content', () => {
    expect(() => parseM3U('')).toThrow('Empty M3U content')
    expect(() => parseM3U('   ')).toThrow('Empty M3U content')
  })

  it('should throw on invalid header', () => {
    expect(() => parseM3U('NOT A VALID HEADER\ncontent')).toThrow('Invalid M3U header')
  })

  it('should default category to General and logo to null when missing', () => {
    const content = `#EXTM3U
#EXTINF:-1,Test Channel
http://example.com/stream.ts`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(1)
    expect(channels[0]?.category).toBe('General')
    expect(channels[0]?.logo).toBeNull()
  })

  it('should ignore non-URL lines', () => {
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

  it('should parse real iptv-org format (no country/language)', () => {
    const content = `#EXTM3U x-tvg-url="https://example.com/guide.xml"
#EXTINF:-1 tvg-id="1Plus1International.ua" tvg-logo="https://i.imgur.com/LOY0rtp.png" group-title="General",1+1 International (576p) [Geo-blocked]
http://example.com/stream1.m3u8
#EXTINF:-1 tvg-id="123tv.de@SD" tvg-logo="https://i.imgur.com/slSUDNX.png" group-title="Shop",1-2-3 TV (270p)
https://example.com/stream2.m3u8`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(2)
    expect(channels[0]?.name).toBe('1+1 International (576p) [Geo-blocked]')
    expect(channels[0]?.category).toBe('General')
    expect(channels[0]?.logo).toBe('https://i.imgur.com/LOY0rtp.png')
    expect(channels[1]?.name).toBe('1-2-3 TV (270p)')
    expect(channels[1]?.category).toBe('Shop')
  })

  it('should parse real tdtchannels format (group-title in Spanish)', () => {
    const content = `#EXTM3U
#EXTINF:-1 tvg-id="La1.TV" tvg-logo="https://example.com/logo.jpg" group-title="Generalistas" tvg-name="La 1",La 1
https://example.com/stream1.m3u8
#EXTINF:-1 tvg-id="Teledeporte.TV" group-title="Deportes" tvg-name="Teledeporte",Teledeporte
https://example.com/stream2.m3u8`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(2)
    expect(channels[0]?.name).toBe('La 1')
    expect(channels[0]?.category).toBe('Generalistas')
    expect(channels[0]?.logo).toBe('https://example.com/logo.jpg')
    expect(channels[1]?.name).toBe('Teledeporte')
    expect(channels[1]?.category).toBe('Deportes')
    expect(channels[1]?.logo).toBeNull()
  })

  it('should handle simple EXTINF with no attributes', () => {
    const content = `#EXTM3U
#EXTINF:-1,Just a Name
https://example.com/stream.ts`

    const channels = parseM3U(content)
    expect(channels).toHaveLength(1)
    expect(channels[0]?.name).toBe('Just a Name')
    expect(channels[0]?.category).toBe('General')
    expect(channels[0]?.logo).toBeNull()
  })
})
