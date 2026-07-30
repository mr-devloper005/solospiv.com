import type { CSSProperties } from 'react'

/*
  Nivoro-inspired design contract.
  Ivory surface, warm orange accent, olive secondary, dark deep-black band.
  Radii: 8/12/16 + pill. Type: Geist display + Inter body.
*/

export const editableRootStyle = {
  '--slot4-page-bg': '#fffdfb',
  '--slot4-page-text': '#111111',
  '--slot4-panel-bg': '#f5f5f5',
  '--slot4-surface-bg': '#fffdfb',
  '--slot4-muted-text': '#707070',
  '--slot4-soft-muted-text': '#aeaeae',
  '--slot4-accent': '#ff6d0c',
  '--slot4-accent-fill': '#ff6d0c',
  '--slot4-accent-soft': '#fff1e6',
  '--slot4-accent-secondary': '#465700',
  '--slot4-on-accent': '#ffffff',
  '--slot4-dark-bg': '#1f1f1f',
  '--slot4-dark-alt': '#262626',
  '--slot4-dark-text': '#ffffff',
  '--slot4-media-bg': '#f0eee9',
  '--slot4-cream': '#fffdfb',
  '--slot4-warm': '#f7f5f0',
  '--slot4-lavender': '#fffdfb',
  '--slot4-gray': '#f5f5f5',
  '--slot4-body-gradient': 'none',
  '--editable-page-bg': '#fffdfb',
  '--editable-page-text': '#111111',
  '--editable-container': '1440px',
  '--editable-border': '#e6e9dd',
  '--editable-border-strong': '#d7dbc9',
  '--editable-nav-bg': '#fffdfb',
  '--editable-nav-text': '#111111',
  '--editable-nav-active': '#ff6d0c',
  '--editable-nav-active-text': '#ffffff',
  '--editable-cta-bg': '#111111',
  '--editable-cta-text': '#ffffff',
  '--editable-search-bg': '#f5f5f5',
  '--editable-footer-bg': '#1f1f1f',
  '--editable-footer-text': '#fffdfb',
  '--editable-radius-sm': '8px',
  '--editable-radius-md': '12px',
  '--editable-radius-lg': '16px',
  '--editable-radius-pill': '999px',
} as CSSProperties

export const editablePalette = {
  pageBg: 'bg-[var(--slot4-page-bg)]',
  pageText: 'text-[var(--slot4-page-text)]',
  panelBg: 'bg-[var(--slot4-panel-bg)]',
  panelText: 'text-[var(--slot4-page-text)]',
  surfaceBg: 'bg-[var(--slot4-surface-bg)]',
  surfaceText: 'text-[var(--slot4-page-text)]',
  mutedText: 'text-[var(--slot4-muted-text)]',
  softMutedText: 'text-[var(--slot4-soft-muted-text)]',
  accentText: 'text-[var(--slot4-accent)]',
  accentBg: 'bg-[var(--slot4-accent-fill)]',
  accentSoftBg: 'bg-[var(--slot4-accent-soft)]',
  accentSoftText: 'text-[var(--slot4-accent-soft)]',
  onAccentText: 'text-[var(--slot4-on-accent)]',
  darkBg: 'bg-[var(--slot4-dark-bg)]',
  darkText: 'text-[var(--slot4-dark-text)]',
  mediaBg: 'bg-[var(--slot4-media-bg)]',
  creamBg: 'bg-[var(--slot4-cream)]',
  warmBg: 'bg-[var(--slot4-warm)]',
  lavenderBg: 'bg-[var(--slot4-lavender)]',
  grayBg: 'bg-[var(--slot4-gray)]',
  border: 'border-[var(--editable-border)]',
  darkBorder: 'border-white/10',
  shadow: 'shadow-[0_1px_2px_rgba(17,17,17,0.04)]',
  shadowStrong: 'shadow-[0_18px_60px_rgba(17,17,17,0.10)]',
  overlay: 'bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.72))]',
} as const

export const editableDesignContract = {
  shell: {
    page: `min-h-screen ${editablePalette.pageBg} ${editablePalette.pageText}`,
    section: 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-8 lg:px-[4.5rem]',
    sectionY: 'py-16 sm:py-20 lg:py-24',
  },
  layout: {
    safeGrid: 'grid gap-6 md:grid-cols-2 xl:grid-cols-3',
    featureGrid: 'grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center',
    rail: 'flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
    minRailCard: 'w-[280px] shrink-0 snap-start sm:w-[320px]',
  },
  type: {
    eyebrow:
      'inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]',
    heroTitle:
      'font-[var(--editable-font-display)] text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-6xl lg:text-[5.75rem]',
    sectionTitle:
      'font-[var(--editable-font-display)] text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.75rem] lg:text-[3.25rem]',
    body: 'text-base leading-[1.6] text-[var(--slot4-muted-text)]',
  },
  surface: {
    card:
      'rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_1px_2px_rgba(17,17,17,0.04)]',
    soft:
      'rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]',
    dark:
      'rounded-[var(--editable-radius-lg)] bg-[var(--slot4-dark-bg)] text-[var(--slot4-dark-text)] shadow-[0_20px_60px_rgba(17,17,17,0.20)]',
  },
  button: {
    primary:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-white transition duration-300 hover:bg-[var(--slot4-accent-fill)] hover:text-[var(--slot4-on-accent)] active:scale-[0.98]',
    secondary:
      'inline-flex items-center justify-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-transparent px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition duration-300 hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white active:scale-[0.98]',
    accent:
      'inline-flex items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent-fill)] px-6 py-3 text-sm font-medium text-[var(--slot4-on-accent)] transition duration-300 hover:brightness-95 active:scale-[0.98]',
  },
  media: {
    frame: 'relative overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--slot4-media-bg)]',
    ratio: 'aspect-[4/5]',
  },
  motion: {
    lift: 'transition duration-500 hover:-translate-y-1 hover:shadow-[0_22px_60px_rgba(17,17,17,0.12)]',
    fade: 'transition duration-300 hover:opacity-80',
  },
} as const

export const aiLayoutRules = [
  'Foundation tokens live in editableRootStyle and editable-global.css — theme changes cascade from there.',
  'Homepage structure is in src/editable/sections/HomeSections.tsx.',
  'Wrap public sections in <EditableReveal> for the scroll-in motion.',
  'Use postHref() for all post links so task routes keep working.',
  'Never hardcode brand names — use SITE_CONFIG.name.',
  'Filter hidden tasks with !isUiHiddenTask(task.key) across every public surface.',
] as const
