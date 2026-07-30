import { slot4BrandConfig } from '@/editable/theme/brand.config'

// Tasks that are functional (routes / detail views keep working via direct URL)
// but are HIDDEN from every public surface: nav, footer, home sections, search
// filters, create picker, stats/lane counts. Profile is functional but hidden.
export const uiHiddenTaskKeys = ['profile'] as const

export const isUiHiddenTask = (key: string) =>
  (uiHiddenTaskKeys as readonly string[]).includes(key)

// Public label for the sbm task, used across nav/footer/copy.
// Task key + route stay 'sbm' / '/sbm'; only the surface label changes.
export const sbmLabel = {
  short: 'Collections',
  long: 'Curators & Collections',
  singular: 'collection',
  plural: 'collections',
  itemSingular: 'resource',
  itemPlural: 'resources',
} as const

export const globalContent = {
  site: {
    name: slot4BrandConfig.siteName,
    tagline: slot4BrandConfig.tagline || 'A curated shelf of collections and resources',
    domain: slot4BrandConfig.domain,
    baseUrl: slot4BrandConfig.baseUrl,
  },
  nav: {
    tagline: 'A curated shelf of collections and resources',
    primaryLinks: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
    ],
    actions: {
      primary: { label: 'Explore collections', href: '/sbm' },
      secondary: { label: 'Submit a resource', href: '/contact' },
    },
  },
  footer: {
    tagline: 'A curated shelf of collections and resources',
    description:
      `${slot4BrandConfig.siteName} is a quiet home for curated bookmarks, collections, and resources — organized by curators, opened by everyone.`,
    columns: [
      {
        title: 'Discover',
        links: [
          { label: 'All collections', href: '/sbm' },
          { label: 'Search resources', href: '/search' },
          { label: 'Submit a resource', href: '/contact' },
        ],
      },
      {
        title: 'Site',
        links: [
          { label: 'About', href: '/about' },
          { label: 'Contact', href: '/contact' },
        ],
      },
    ],
    // Collections column links (populated by category, filled in at render time)
    collectionsTitle: 'Collections',
    bottomNote: 'Built for curators — read, save, share.',
  },
  commonLabels: {
    readMore: 'Open resource',
    viewAll: 'View all',
    explore: 'Explore',
    latest: 'Fresh',
    related: 'From this collection',
    published: 'Curated',
  },
} as const
