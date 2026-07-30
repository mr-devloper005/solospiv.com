import type { CSSProperties } from 'react'
import type { TaskKey } from '@/lib/site-config'

/*
  Nivoro-inspired task surfaces.
  Warm ivory, orange accent, olive secondary, deep dark bands.
*/

export type TaskTheme = {
  kicker: string
  note: string
  dark: boolean
  fontDisplay: string
  fontBody: string
  bg: string
  surface: string
  raised: string
  text: string
  muted: string
  line: string
  accent: string
  accentSoft: string
  onAccent: string
  glow: string
  radius: string
}

const DISPLAY_FONT = "'Geist', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"
const BODY_FONT = "'Inter', system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const base = {
  dark: false,
  fontDisplay: DISPLAY_FONT,
  fontBody: BODY_FONT,
  bg: '#fffdfb',
  surface: '#fffdfb',
  raised: '#f5f5f5',
  text: '#111111',
  muted: '#707070',
  line: '#e6e9dd',
  accent: '#ff6d0c',
  accentSoft: '#fff1e6',
  onAccent: '#ffffff',
  glow: 'rgba(255,109,12,0.10)',
  radius: '1rem',
} satisfies Omit<TaskTheme, 'kicker' | 'note'>

export const taskThemes: Record<TaskKey, TaskTheme> = {
  article: { ...base, kicker: 'Articles', note: 'Long-form reading, guides and stories.' },
  listing: { ...base, kicker: 'Directory', note: 'Find, compare and connect.' },
  classified: { ...base, kicker: 'Marketplace', note: 'Time-sensitive offers and notices.' },
  image: { ...base, kicker: 'Visuals', note: 'A gallery of standout images.' },
  sbm: { ...base, kicker: 'Collections', note: 'A curated shelf of bookmarks, links and resources — organized by collection.' },
  pdf: { ...base, kicker: 'Documents', note: 'Downloadable guides and references.' },
  profile: { ...base, kicker: 'Curators', note: 'The people behind the collections.' },
}

export function getTaskTheme(task: TaskKey): TaskTheme {
  return taskThemes[task] || taskThemes.sbm
}

export function taskThemeStyle(task: TaskKey): CSSProperties {
  const t = getTaskTheme(task)
  return {
    '--tk-bg': t.bg,
    '--tk-surface': t.surface,
    '--tk-raised': t.raised,
    '--tk-text': t.text,
    '--tk-muted': t.muted,
    '--tk-line': t.line,
    '--tk-accent': t.accent,
    '--tk-accent-soft': t.accentSoft,
    '--tk-on-accent': t.onAccent,
    '--tk-glow': t.glow,
    '--tk-radius': t.radius,
    '--slot4-accent': t.accent,
    '--slot4-accent-fill': t.accent,
    '--editable-font-display': t.fontDisplay,
    '--editable-font-body': t.fontBody,
    fontFamily: t.fontBody,
  } as CSSProperties
}
