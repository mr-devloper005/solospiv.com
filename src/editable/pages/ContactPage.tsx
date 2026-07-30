'use client'

import Link from 'next/link'
import { ArrowUpRight, Bookmark, Clock3, Compass, Mail, MessageSquare, Sparkles, Users2 } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableReveal } from '@/editable/shell/EditableReveal'

const reachOptions = [
  { icon: Bookmark, title: 'Suggest a resource', body: 'A URL, a short note, and which shelf it fits.', tag: 'Common' },
  { icon: Users2, title: 'Become a curator', body: 'Start your own shelf — we help you set the first collection up.', tag: 'Open' },
  { icon: Sparkles, title: 'Partnerships', body: 'Editorial collabs, curated newsletters, guest shelves.', tag: 'Selective' },
  { icon: MessageSquare, title: 'Anything else', body: 'Feedback, corrections, broken links — every note is read.', tag: 'Always' },
]

const facts = [
  { icon: Clock3, label: 'Reply time', value: 'Within 2–3 days' },
  { icon: Compass, label: 'Time zone', value: 'Anywhere on Earth' },
  { icon: Mail, label: 'Prefer email?', value: 'Use the form — same inbox' },
]

export default function ContactPage() {
  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)]">
        {/* Full-bleed hero with big display */}
        <section className="relative overflow-hidden border-b border-[var(--editable-border)] bg-[var(--slot4-warm)]">
          <div className="pointer-events-none absolute -left-40 -top-32 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,rgba(255,109,12,0.12),transparent_65%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 pb-20 pt-28 sm:px-8 lg:px-[4.5rem] lg:pt-32">
            <EditableReveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-white px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                <Mail className="h-3.5 w-3.5" /> {pagesContent.contact.eyebrow}
              </p>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6rem]">
                A note, a link, a question — send it along.
              </h1>
              <p className="mt-8 max-w-2xl text-[19px] leading-[1.6] text-[var(--slot4-muted-text)]">
                {pagesContent.contact.description}
              </p>
            </EditableReveal>

            <div className="mt-14 grid gap-4 sm:grid-cols-3">
              {facts.map((fact, i) => (
                <EditableReveal
                  key={fact.label}
                  index={i}
                  className="flex items-center gap-4 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-white/70 px-5 py-4 backdrop-blur"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                    <fact.icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">{fact.label}</p>
                    <p className="mt-1 text-[13px] font-medium text-[var(--slot4-page-text)]">{fact.value}</p>
                  </div>
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>

        {/* Form-left, options-right — flipped from the previous version */}
        <section className="border-b border-[var(--editable-border)] bg-[var(--slot4-page-bg)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-8 lg:px-[4.5rem]">
            <div className="grid gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
              <EditableReveal className="relative">
                <div className="pointer-events-none absolute -left-6 -top-6 h-32 w-32 rounded-full bg-[var(--slot4-accent-soft)]" />
                <div className="relative rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-8 shadow-[0_22px_60px_rgba(17,17,17,0.08)] sm:p-10">
                  <div className="flex items-center justify-between gap-3">
                    <h2 className="editable-display text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem]">
                      {pagesContent.contact.formTitle}
                    </h2>
                    <span className="rounded-full bg-[var(--slot4-accent-soft)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-accent)]">
                      One inbox
                    </span>
                  </div>
                  <p className="mt-3 text-[14px] leading-6 text-[var(--slot4-muted-text)]">
                    All messages land in the same place. Include a URL if you’re suggesting a resource.
                  </p>
                  <EditableContactLeadForm />
                </div>
              </EditableReveal>

              <EditableReveal index={1} className="space-y-3">
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Reasons people reach out</p>
                <h3 className="editable-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem]">
                  Pick the closest lane — or use the form.
                </h3>

                <div className="mt-6 divide-y divide-[var(--editable-border)] rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
                  {reachOptions.map((option, i) => (
                    <div key={option.title} className="group flex items-start gap-4 p-6 transition hover:bg-[var(--slot4-warm)]">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                        <option.icon className="h-5 w-5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="editable-display text-lg font-semibold tracking-[-0.02em]">{option.title}</h4>
                          <span className="rounded-full border border-[var(--editable-border)] px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--slot4-muted-text)]">
                            {option.tag}
                          </span>
                        </div>
                        <p className="mt-1.5 text-[14px] leading-6 text-[var(--slot4-muted-text)]">{option.body}</p>
                      </div>
                      <span className="editable-display self-center text-[13px] font-semibold text-[var(--slot4-muted-text)] transition group-hover:text-[var(--slot4-accent)]">
                        0{i + 1}
                      </span>
                    </div>
                  ))}
                </div>
              </EditableReveal>
            </div>
          </div>
        </section>

        {/* Dark CTA band */}
        <section className="bg-[var(--slot4-dark-bg)] text-white">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">While you’re here</p>
                <p className="editable-display mt-4 max-w-xl text-[1.75rem] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[2.25rem]">
                  The shelf is open. Have a browse while we get back to you.
                </p>
              </div>
              <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 py-3 text-sm font-medium text-white transition hover:brightness-95">
                Open the shelf <ArrowUpRight className="h-4 w-4" />
              </Link>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
