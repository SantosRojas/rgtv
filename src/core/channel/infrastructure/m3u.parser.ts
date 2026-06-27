import type { Channel, ChannelOrigin } from '../domain/channel.ts'
import { generateId } from '../../shared/utils/id-generator.ts'
import { ParseError } from '../../shared/domain/errors.ts'

const EXTINF_REGEX = /#EXTINF:(?:-?\d+(?:\.\d+)?)?(?:.*?tvg-logo="([^"]*)")?(?:.*?group-title="([^"]*)")?(?:.*?,)(.*)/
const EXTINF_SIMPLE_REGEX = /#EXTINF:(?:-?\d+(?:\.\d+)?)?(?:.*?,)(.*)/

function detectOrigin(url: string): ChannelOrigin {
  const lower = url.toLowerCase()
  if (lower.includes('iptv-org')) return 'default_iptv_org'
  if (lower.includes('tdtchannels')) return 'default_tdtchannels'
  return 'custom'
}

export function parseM3U(content: string, origin?: ChannelOrigin): Channel[] {
  if (!content || content.trim() === '') {
    throw new ParseError('Empty M3U content')
  }

  const lines = content.split(/\r?\n/)
  const channels: Channel[] = []

  if (!lines[0]?.trim().startsWith('#EXTM3U')) {
    throw new ParseError('Invalid M3U header')
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim()
    if (!line || line.startsWith('#EXTINF:')) continue

    if (line.startsWith('#EXTVLCOPT:')) continue

    const url = line
    if (!url.startsWith('http://') && !url.startsWith('https://')) continue

    const extinfLine = lines[i - 1]
    if (!extinfLine) continue

    const match = extinfLine.match(EXTINF_REGEX) ?? extinfLine.match(EXTINF_SIMPLE_REGEX)
    if (!match) continue

    const name = match[match.length - 1]?.trim()
    if (!name) continue

    const channel: Channel = {
      id: generateId(),
      name,
      logo: match[1] ? match[1].trim() || null : null,
      category: match[2] ? match[2].split(';')[0]!.trim() : 'General',
      url,
      origin: origin ?? detectOrigin(url),
    }

    channels.push(channel)
  }

  return channels
}
