import { slot4BrandConfig } from '@/editable/theme/brand.config'

export const pagesContent = {
  home: {
    metadata: {
      title: 'Curated collections of bookmarks & resources',
      description:
        'A quiet shelf for curators. Discover collections of bookmarks, links and resources — organized, verified, and open to everyone.',
      openGraphTitle: 'Curated collections of bookmarks & resources',
      openGraphDescription:
        'Discover curated collections of bookmarks and resources.',
      keywords: ['bookmarks', 'collections', 'resources', 'curation', 'link library'],
    },
    hero: {
      badge: 'Curated · Categorized · Always open',
      title: ['A curated shelf of', 'collections & resources.'],
      description:
        'Explore hand-picked bookmarks organized by collection. Everything opens straight to the source — no gatekeeping.',
      primaryCta: { label: 'Browse collections', href: '/sbm' },
      secondaryCta: { label: 'Search resources', href: '/search' },
      searchPlaceholder: 'Search collections, resources, curators…',
      focusLabel: 'Featured',
      featureCardBadge: 'Now on the shelf',
      featureCardTitle: 'The collection everyone is opening this week.',
      featureCardDescription:
        'Fresh curator picks stay on the front page — nothing algorithmic, just what the shelf recommends today.',
    },
    intro: {
      badge: 'How the shelf works',
      title: 'Bookmarks organized by curators, opened by everyone.',
      paragraphs: [
        'The shelf is arranged into collections. Each collection is a shared theme — tools, references, guides, essays — kept small and useful on purpose.',
        'Every entry links out to the real source. Follow a curator to see their next collection, or dip in when you need a quick reference.',
        'No account required to browse. Save your favorites, share the collection URL, come back when the shelf refreshes.',
      ],
      sideBadge: 'What to expect',
      sidePoints: [
        'Curated collections, not endless feeds.',
        'Verified domains — every link opens directly.',
        'Fresh resources added weekly by curators.',
        'Quiet motion, calm typography, big display.',
      ],
      primaryLink: { label: 'Browse the shelf', href: '/sbm' },
      secondaryLink: { label: 'Search resources', href: '/search' },
    },
    cta: {
      badge: 'Start exploring',
      title: 'Open the shelf. Find your next collection.',
      description:
        'A quiet home for curators, collections and resources. Save what matters — the shelf keeps the noise out.',
      primaryCta: { label: 'Browse collections', href: '/sbm' },
      secondaryCta: { label: 'Submit a resource', href: '/contact' },
    },
    taskSection: {
      heading: 'Latest in {label}',
      descriptionSuffix: 'Fresh curator picks, added this week.',
    },
  },
  about: {
    badge: 'About',
    title: 'A calmer home for the links worth keeping.',
    description: `${slot4BrandConfig.siteName} is a quiet, opinionated shelf. Curators organize collections; readers open them. That's the whole product.`,
    paragraphs: [
      'We started this because the good links kept getting lost — buried in tabs, DMs, half-finished notes. A shelf holds them in one place.',
      'The design is deliberately quiet: big typography, warm ivory, one accent. Nothing between you and the resource you came for.',
      'Everything opens to its real source. No trackers between you and the link. No account required to read.',
    ],
    values: [
      {
        title: 'Curated, not algorithmic',
        description: 'Real people choose what belongs on the shelf. No infinite feed, no recommendation loop.',
      },
      {
        title: 'Open by default',
        description: 'Every resource opens to the original source in a new tab. We are the shelf, not the destination.',
      },
      {
        title: 'Quiet by design',
        description: 'One accent, one type family, generous space. The page steps out of the way of the collection.',
      },
    ],
  },
  contact: {
    eyebrow: 'Get in touch',
    title: 'A resource, a collection, or a question — send it along.',
    description:
      'Suggest a link, propose a new collection, or say hello. We read every message and respond quickly.',
    formTitle: 'Send a message',
  },

  search: {
    metadata: {
      title: 'Search the shelf',
      description: 'Search across every collection and every resource on the shelf.',
    },
    hero: {
      badge: 'Search the shelf',
      title: 'Find a collection, a resource, a curator.',
      description:
        'Search across every collection on the shelf. Filter by category and jump straight to the source.',
      placeholder: 'Search by keyword, collection, domain, or topic',
    },
    resultsTitle: 'Fresh on the shelf',
  },
  create: {
    metadata: {
      title: 'Submit to the shelf',
      description: 'Add a resource or propose a collection.',
    },
    locked: {
      badge: 'Curator access',
      title: 'Login to add to the shelf.',
      description:
        'Use your account to open the curator workspace and add a resource or start a new collection.',
    },
    hero: {
      badge: 'Curator workspace',
      title: 'Add a resource to the shelf.',
      description:
        'Give the collection a home. Add a title, a summary, the destination link — the shelf takes care of the rest.',
    },
    formTitle: 'Resource details',
    submitLabel: 'Add to the shelf',
    successTitle: 'Added to the shelf.',
  },
  auth: {
    login: {
      metadataDescription: 'Sign in to your curator account.',
      badge: 'Welcome back',
      title: 'Sign in to your shelf.',
      description: 'Continue curating collections, submitting resources, and organizing your bookmarks.',
      formTitle: 'Sign in',
      submitLabel: 'Continue',
      noAccount: 'No matching account. Create one and come back.',
      success: 'Signed in. One moment…',
      createCta: 'Create an account',
    },
    signup: {
      metadataDescription: 'Create your curator account.',
      badge: 'Become a curator',
      title: 'Start your own shelf.',
      description: 'Create an account to save resources, start collections, and share the shelf.',
      formTitle: 'Create account',
      submitLabel: 'Create account',
      passwordShort: 'Use at least 4 characters.',
      success: 'Account created. One moment…',
      loginCta: 'Sign in instead',
    },
  },
  detailPages: {
    article: {
      relatedTitle: 'From this collection',
      fallbackTitle: 'Article',
    },
    listing: {
      relatedTitle: 'From this collection',
      fallbackTitle: 'Listing',
    },
    image: {
      relatedTitle: 'From this collection',
      fallbackTitle: 'Image',
    },
    profile: {
      relatedTitle: 'Their resources',
      fallbackDescription: 'Curator details will appear here once available.',
      visitButton: 'Visit official site',
    },
  },
} as const
