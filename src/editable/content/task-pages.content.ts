import type { TaskKey } from '@/lib/site-config'

export type TaskPageVoice = {
  eyebrow: string
  headline: string
  description: string
  filterLabel: string
  secondaryNote: string
  chips: string[]
}

export const taskPageVoices = {
  sbm: {
    eyebrow: 'The library',
    headline: 'Every collection, every resource — one quiet shelf.',
    description:
      'Browse curated bookmarks organized by collection. Each entry links straight to the resource — no gatekeeping, no filler.',
    filterLabel: 'Filter by collection',
    secondaryNote: 'Curated. Categorized. Always open.',
    chips: ['Curator picks', 'Verified links', 'Fresh weekly'],
  },
  profile: {
    eyebrow: 'Curator',
    headline: 'The person behind these collections.',
    description: 'Identity, focus areas, and the resources they’ve gathered so far.',
    filterLabel: 'Filter',
    secondaryNote: 'Identity-first, always current.',
    chips: ['Curator', 'Bio', 'Their resources'],
  },
  article: {
    eyebrow: 'Reading',
    headline: 'Long-form notes and guides.',
    description: 'Editorial reads with room to breathe.',
    filterLabel: 'Topic',
    secondaryNote: 'Long-form.',
    chips: ['Long-read'],
  },
  classified: {
    eyebrow: 'Notices',
    headline: 'Time-sensitive posts.',
    description: 'Fast-scan notices and offers.',
    filterLabel: 'Category',
    secondaryNote: 'Fast scan.',
    chips: ['Fast', 'Offers'],
  },
  pdf: {
    eyebrow: 'Documents',
    headline: 'Downloadable guides.',
    description: 'Reports, references, and PDFs.',
    filterLabel: 'Type',
    secondaryNote: 'Documents.',
    chips: ['Guides', 'References'],
  },
  listing: {
    eyebrow: 'Directory',
    headline: 'Discoverable listings.',
    description: 'Compare and connect.',
    filterLabel: 'Category',
    secondaryNote: 'Directory.',
    chips: ['Directory'],
  },
  image: {
    eyebrow: 'Visuals',
    headline: 'Image-led browsing.',
    description: 'A gallery-first surface.',
    filterLabel: 'Category',
    secondaryNote: 'Gallery.',
    chips: ['Gallery'],
  },
} satisfies Record<TaskKey, TaskPageVoice>
