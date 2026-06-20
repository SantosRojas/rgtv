export type ChannelOrigin = 'default_iptv_org' | 'default_tdtchannels' | 'custom'

export interface Channel {
  id: string
  name: string
  logo: string | null
  url: string
  country: string
  category: string
  language: string
  isFavorite: boolean
  origin: ChannelOrigin
}
