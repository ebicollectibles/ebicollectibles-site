import { auraSeekerPreorder } from './aura-seeker-preorder'

// Every list email the admin Subscribers page can send. Add new ones here.
export const CAMPAIGNS = [auraSeekerPreorder] as const
export type CampaignId = (typeof CAMPAIGNS)[number]['id']
export const campaignById = (id: string) => CAMPAIGNS.find((c) => c.id === id)
