import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Check, Sparkles } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { SITE_CONFIG } from '@/lib/site-config'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Create account', description: pagesContent.auth.signup.metadataDescription })
}

const promises = [
  'One account, unlimited shelves',
  'Verified curator status after your first collection',
  'Direct-link resources — no proxy, ever',
  'Weekly link-health checks on your shelves',
  'A quiet UI that stays out of your way',
]

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)]">
        {/* Different from login: single-column stacked hero + form card, ivory bg with side accent list */}
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute -left-32 top-40 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,109,12,0.12),transparent_65%)]" />
          <div className="pointer-events-none absolute -right-40 -top-20 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(70,87,0,0.08),transparent_60%)]" />

          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 pt-28 sm:px-8 lg:px-[4.5rem] lg:pt-32">
            <EditableReveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.auth.signup.badge}
              </p>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6rem]">
                Start your own shelf on {SITE_CONFIG.name}.
              </h1>
              <p className="mt-8 max-w-2xl text-[19px] leading-[1.6] text-[var(--slot4-muted-text)]">
                {pagesContent.auth.signup.description}
              </p>
            </EditableReveal>
          </div>

          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 pt-16 pb-24 sm:px-8 lg:px-[4.5rem]">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              {/* Promises list */}
              <EditableReveal className="rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-8 sm:p-10">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">What you get</p>
                <ul className="mt-8 grid gap-4">
                  {promises.map((promise, i) => (
                    <EditableReveal key={promise} index={i} as="li" className="flex items-start gap-3 text-[15px] leading-7 text-[var(--slot4-page-text)]">
                      <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-white">
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                      {promise}
                    </EditableReveal>
                  ))}
                </ul>

                <div className="mt-10 border-t border-[var(--editable-border)] pt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">Already curating?</p>
                  <Link
                    href="/login"
                    className="mt-3 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--slot4-page-text)] hover:text-[var(--slot4-accent)]"
                  >
                    Sign in instead <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </EditableReveal>

              {/* Form card — big, elevated */}
              <EditableReveal index={1} className="rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_22px_60px_rgba(17,17,17,0.08)] sm:p-10">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem]">
                    {pagesContent.auth.signup.formTitle}
                  </h2>
                  <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                    Free · No card
                  </span>
                </div>
                <p className="mt-3 text-[14px] leading-6 text-[var(--slot4-muted-text)]">
                  Takes under a minute. Your first shelf can be live today.
                </p>
                <EditableLocalSignupForm />
                <p className="mt-6 text-sm text-[var(--slot4-muted-text)]">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-[var(--slot4-accent)] underline-offset-4 hover:underline">
                    {pagesContent.auth.signup.loginCta}
                  </Link>
                </p>
              </EditableReveal>
            </div>
          </div>
        </section>

        {/* Bottom trust band — dark */}
        <section className="border-t border-[var(--editable-border)] bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal className="grid gap-8 sm:grid-cols-3">
              {[
                { k: '01', t: 'Zero trackers', d: 'We don’t proxy your outbound clicks — links open to their real source.' },
                { k: '02', t: 'No infinite feed', d: 'A shelf, not a stream. Curated by real people.' },
                { k: '03', t: 'Yours to leave', d: 'Export your shelves any time. Nothing held hostage.' },
              ].map((item, i) => (
                <EditableReveal key={item.k} index={i} className="border-l border-white/10 pl-6">
                  <p className="editable-display text-3xl font-semibold text-[var(--slot4-accent)]">{item.k}</p>
                  <p className="editable-display mt-4 text-lg font-semibold tracking-[-0.02em]">{item.t}</p>
                  <p className="mt-2 text-[13px] leading-6 text-white/60">{item.d}</p>
                </EditableReveal>
              ))}
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
