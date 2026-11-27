import { auraSeekerPreorder } from './aura-seeker-preorder'
import { radiantPikachuPreorder } from './radiant-pikachu-preorder'

// A list email the admin Subscribers page can send. audienceSource limits it
// to people who signed up from that source (see campaignAudience in
// server/admin.ts); leave it out to send to everyone subscribed.
export interface ListCampaign {
  id: string
  label: string
  subject: string
  html: string
  text: string
  audienceSource?: string
  audienceLabel?: string
}

// Every list email the admin Subscribers page can send. Add new ones here.
export const CAMPAIGNS: readonly ListCampaign[] = [radiantPikachuPreorder, auraSeekerPreorder]
export type CampaignId = string
export const campaignById = (id: string) => CAMPAIGNS.find((c) => c.id === id)
