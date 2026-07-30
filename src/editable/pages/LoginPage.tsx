import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, BadgeCheck, Bookmark, LogIn } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { SITE_CONFIG } from '@/lib/site-config'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Sign in', description: pagesContent.auth.login.metadataDescription })
}

const perks = [
  { icon: Bookmark, label: 'Save resources across sessions' },
  { icon: BadgeCheck, label: 'Curate your own shelves' },
  { icon: LogIn, label: 'Everything syncs from one account' },
]

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)]">
        <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-[var(--editable-container)] items-stretch gap-0 lg:grid-cols-[1fr_0.9fr] lg:gap-0">
          {/* Left: dark identity panel — full-height, layered orange orb */}
          <EditableReveal className="relative order-2 flex flex-col justify-between overflow-hidden bg-[var(--slot4-dark-bg)] px-6 py-14 text-white sm:px-10 lg:order-1 lg:min-h-full lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,109,12,0.55),transparent_65%)]" />
            <div className="pointer-events-none absolute -right-24 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,109,12,0.25),transparent_65%)]" />

            <div className="relative">
              <Link href="/" className="inline-flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-accent)]">
                  <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-5 w-5 object-contain invert" />
                </span>
                <span className="editable-display text-lg font-semibold tracking-[-0.02em]">{SITE_CONFIG.name}</span>
              </Link>

              <p className="mt-16 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {pagesContent.auth.login.badge}
              </p>
              <h1 className="editable-display mt-8 max-w-lg text-balance text-[2.5rem] font-semibold leading-[1] tracking-[-0.03em] sm:text-[3.75rem] lg:text-[4.5rem]">
                {pagesContent.auth.login.title}
              </h1>
              <p className="mt-6 max-w-md text-[16px] leading-[1.6] text-white/70">{pagesContent.auth.login.description}</p>

              <ul className="mt-12 grid gap-3">
                {perks.map((perk, i) => (
                  <EditableReveal key={perk.label} index={i} as="li" className="flex items-center gap-3 text-[13px] text-white/85">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                      <perk.icon className="h-4 w-4 text-[var(--slot4-accent)]" />
                    </span>
                    {perk.label}
                  </EditableReveal>
                ))}
              </ul>
            </div>

            <div className="relative mt-16 border-t border-white/10 pt-6 text-[12px] text-white/50">
              New here?{' '}
              <Link href="/signup" className="font-medium text-white transition hover:text-[var(--slot4-accent)]">
                Create an account →
              </Link>
            </div>
          </EditableReveal>

          {/* Right: form panel with big display + subtle background */}
          <EditableReveal index={1} className="order-1 flex items-center justify-center bg-[var(--slot4-warm)] px-4 py-16 sm:px-8 lg:order-2 lg:px-14">
            <div className="w-full max-w-md">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                Sign in
              </p>
              <h2 className="editable-display mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem]">
                {pagesContent.auth.login.formTitle}
              </h2>
              <p className="mt-3 text-[14px] leading-6 text-[var(--slot4-muted-text)]">
                Use your curator account to open the workspace.
              </p>

              <div className="mt-8 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_22px_60px_rgba(17,17,17,0.06)] sm:p-8">
                <EditableLocalLoginForm />
              </div>

              <div className="mt-6 flex items-center justify-between text-[13px] text-[var(--slot4-muted-text)]">
                <span>
                  New here?{' '}
                  <Link href="/signup" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                    {pagesContent.auth.login.createCta}
                  </Link>
                </span>
                <Link href="/sbm" className="inline-flex items-center gap-1.5 font-medium text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]">
                  Browse the shelf <ArrowUpRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </EditableReveal>
        </section>
      </main>
    </EditableSiteShell>
  )
}
