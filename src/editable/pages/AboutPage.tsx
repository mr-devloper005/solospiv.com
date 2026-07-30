import Link from 'next/link'
import { ArrowUpRight, BookOpen, Compass, Feather, HeartHandshake, Layers, ShieldCheck, Sparkles } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const manifesto = [
  { n: '01', title: 'The shelf comes first', body: 'One accent, one type family, big display. The page steps out of the way of the collection.' },
  { n: '02', title: 'Real people choose', body: 'Curators — not algorithms — decide what belongs on which shelf.' },
  { n: '03', title: 'Open by default', body: 'Every resource opens straight to the source, in a new tab. No proxy, no tracking pixel.' },
  { n: '04', title: 'Kept in shape', body: 'Broken links are pruned weekly. The shelf is only useful if it stays tidy.' },
]

const timeline = [
  { year: 'The idea', title: 'A shelf for the links worth keeping', body: 'Tabs, DMs, half-finished notes — the good links kept getting lost.' },
  { year: 'First shelf', title: 'Curators start small', body: 'A handful of themes, hand-picked links, opened straight to source.' },
  { year: 'Today', title: 'A quiet home', body: 'Curators organize collections; readers open them. That’s the whole product.' },
  { year: 'Next', title: 'More shelves, same shape', body: 'New collections, same commitment to calm, quiet, curated.' },
]

const stats = [
  { value: 'One', label: 'accent color' },
  { value: 'Zero', label: 'trackers between you and the link' },
  { value: 'Weekly', label: 'link-health checks' },
  { value: 'Always', label: 'open to browse' },
]

const principles = [
  { icon: Compass, title: 'Curated, not algorithmic' },
  { icon: ShieldCheck, title: 'Verified, not vibes' },
  { icon: Feather, title: 'Quiet, not loud' },
  { icon: HeartHandshake, title: 'Open, not gated' },
]

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)]">
        {/* Manifesto hero — huge editorial type, no card */}
        <section className="relative overflow-hidden border-b border-[var(--editable-border)]">
          <div className="pointer-events-none absolute inset-x-0 -top-40 h-[520px] bg-[radial-gradient(60%_60%_at_50%_0%,rgba(255,109,12,0.10),transparent_70%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 pb-24 pt-28 sm:px-8 lg:px-[4.5rem] lg:pt-36">
            <EditableReveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                <BookOpen className="h-3.5 w-3.5" /> {pagesContent.about.badge}
              </p>
              <h1 className="editable-display mt-8 max-w-5xl text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6.5rem]">
                A calmer home for <span className="text-[var(--slot4-accent)]">the links worth keeping.</span>
              </h1>
            </EditableReveal>

            <EditableReveal index={1} className="mt-14 grid gap-14 lg:grid-cols-[0.9fr_1.1fr]">
              <p className="text-[19px] leading-[1.6] text-[var(--slot4-muted-text)]">{pagesContent.about.description}</p>
              <div className="grid grid-cols-2 gap-px overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--editable-border)]">
                {stats.map((stat) => (
                  <div key={stat.label} className="bg-[var(--slot4-surface-bg)] px-6 py-8">
                    <p className="editable-display text-[2rem] font-semibold leading-none tracking-[-0.03em] text-[var(--slot4-page-text)]">{stat.value}</p>
                    <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{stat.label}</p>
                  </div>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Manifesto — 4 numbered principles */}
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">The manifesto</p>
                <h2 className="editable-display mt-4 max-w-2xl text-[2.25rem] font-semibold leading-[1.03] tracking-[-0.02em] sm:text-[3rem] lg:text-[3.5rem]">
                  Four rules the shelf lives by.
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                {principles.map((p) => (
                  <span key={p.title} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border-strong)] bg-white px-3 py-1.5 text-[11px] font-medium text-[var(--slot4-page-text)]">
                    <p.icon className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {p.title}
                  </span>
                ))}
              </div>
            </EditableReveal>

            <div className="mt-14 grid gap-px overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--editable-border)] md:grid-cols-2">
              {manifesto.map((item, i) => (
                <EditableReveal
                  key={item.n}
                  index={i}
                  className="group relative bg-[var(--slot4-surface-bg)] p-8 transition hover:bg-[var(--slot4-page-text)] hover:text-white sm:p-10"
                >
                  <div className="flex items-baseline gap-4">
                    <span className="editable-display text-[2.5rem] font-semibold leading-none tracking-[-0.03em] text-[var(--slot4-accent)]">{item.n}</span>
                    <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)] group-hover:text-white/60">Principle</span>
                  </div>
                  <h3 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">{item.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-[var(--slot4-muted-text)] group-hover:text-white/75">{item.body}</p>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline — vertical rail */}
        <section className="border-b border-[var(--editable-border)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">How the shelf grew</p>
              <h2 className="editable-display mt-4 max-w-2xl text-[2.25rem] font-semibold leading-[1.03] tracking-[-0.02em] sm:text-[3rem]">
                A short history in four notes.
              </h2>
            </EditableReveal>

            <div className="mt-14 grid gap-6 lg:grid-cols-[220px_1fr]">
              <div className="hidden lg:block">
                <div className="sticky top-24 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-6">
                  <Layers className="h-6 w-6 text-[var(--slot4-accent)]" />
                  <p className="mt-4 text-[13px] leading-6 text-[var(--slot4-muted-text)]">
                    We didn’t start with a launch date. We started with a question: where do the good links go?
                  </p>
                </div>
              </div>
              <ol className="relative border-l border-[var(--editable-border)] pl-8 lg:pl-10">
                {timeline.map((item, i) => (
                  <EditableReveal key={item.title} index={i} as="li" className="relative pb-14 last:pb-0">
                    <span className="absolute -left-[41px] top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-[10px] font-medium uppercase tracking-[0.14em] text-white lg:-left-[45px]">
                      0{i + 1}
                    </span>
                    <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{item.year}</p>
                    <h3 className="editable-display mt-3 text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem]">{item.title}</h3>
                    <p className="mt-3 max-w-2xl text-[15px] leading-7 text-[var(--slot4-muted-text)]">{item.body}</p>
                  </EditableReveal>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* Pull-quote band */}
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal className="grid gap-14 lg:grid-cols-[0.35fr_0.65fr] lg:items-center">
              <div>
                <Sparkles className="h-6 w-6 text-[var(--slot4-accent)]" />
                <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">The take</p>
              </div>
              <blockquote>
                <p className="editable-display text-balance text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[3rem]">
                  “The internet already has an infinite feed. What it doesn’t have is a well-kept shelf, run by real people, opened by everyone.”
                </p>
                <footer className="mt-8 text-[12px] font-medium uppercase tracking-[0.28em] text-white/50">
                  — The {SITE_CONFIG.name} team
                </footer>
              </blockquote>
            </EditableReveal>
          </div>
        </section>

        {/* Values as three-up cards */}
        <section className="bg-[var(--slot4-page-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">What we hold to</p>
              <h2 className="editable-display mt-4 max-w-2xl text-[2.25rem] font-semibold leading-[1.03] tracking-[-0.02em] sm:text-[3rem]">
                Values, spelled out.
              </h2>
            </EditableReveal>

            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {pagesContent.about.values.map((value, i) => (
                <EditableReveal
                  key={value.title}
                  index={i}
                  className="group flex flex-col justify-between rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 transition hover:border-[var(--slot4-page-text)] hover:shadow-[0_22px_60px_rgba(17,17,17,0.10)]"
                >
                  <div>
                    <span className="editable-display text-[3rem] font-semibold leading-none tracking-[-0.03em] text-[var(--slot4-accent)]">0{i + 1}</span>
                    <h3 className="editable-display mt-6 text-xl font-semibold tracking-[-0.02em]">{value.title}</h3>
                    <p className="mt-3 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{value.description}</p>
                  </div>
                  <ArrowUpRight className="mt-8 h-5 w-5 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
                </EditableReveal>
              ))}
            </div>

            <EditableReveal index={4} className="mt-14 flex flex-col items-start justify-between gap-6 rounded-[var(--editable-radius-lg)] bg-[var(--slot4-warm)] p-10 sm:flex-row sm:items-center sm:p-14">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Say hello</p>
                <p className="editable-display mt-4 max-w-xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2rem]">
                  Suggest a resource, propose a collection, or just come say hello.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]">
                  Contact us <ArrowUpRight className="h-4 w-4" />
                </Link>
                <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-white">
                  Browse the shelf
                </Link>
              </div>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
