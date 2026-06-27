export type ChannelOrigin = 'default_iptv_org' | 'custom'

export interface Channel {
  id: string
  name: string
  logo: string | null
  url: string
  category: string
  origin: ChannelOrigin
}
