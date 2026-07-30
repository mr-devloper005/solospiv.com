// ✏️ EDITABLE — theme the ads to match this site. Devs own this file.

import type { AdSkin } from '@/lib/ads/ad-frame'

// Nivoro-inspired warm ivory frame + orange label.
export const adSkin: AdSkin = {
  radius: '16px',
  border: '1px solid #e6e9dd',
  shadow: '0 8px 30px rgba(17,17,17,0.06)',
  background: '#fffdfb',
  labelClassName: 'bg-[#ff6d0c] text-white',
}

export const adSkinBySlot: Partial<Record<string, AdSkin>> = {
  sidebar: { radius: '12px', shadow: 'none', border: '1px solid #e6e9dd', background: '#fffdfb' },
  popup: { radius: '20px' },
  header: { radius: '16px', background: '#f7f5f0' },
  rail: { radius: '12px' },
  feature: { radius: '16px' },
  'in-feed': { radius: '16px', background: '#fffdfb', border: '1px dashed #d7dbc9' },
  footer: { radius: '16px', background: '#fffdfb' },
  interstitial: { radius: '20px', shadow: '0 20px 60px rgba(0,0,0,0.5)' },
  anchor: { radius: '12px', shadow: '0 6px 24px rgba(0,0,0,0.18)' },
}

export function skinFor(slot: string): AdSkin {
  return { ...adSkin, ...(adSkinBySlot[slot] ?? {}) }
}
