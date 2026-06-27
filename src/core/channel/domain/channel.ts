export type ChannelOrigin = 'default_iptv_org' | 'default_tdtchannels' | 'custom'

export interface Channel {
  id: string
  name: string
  logo: string | null
  url: string
  category: string
  origin: ChannelOrigin
}
