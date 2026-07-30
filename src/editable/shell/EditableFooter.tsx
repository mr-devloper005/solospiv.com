'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent, isUiHiddenTask, sbmLabel } from '@/editable/content/global.content'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// The Collections column populates from real category slugs → /sbm?category=<slug>.
// Task links that would appear here are filtered through isUiHiddenTask so
// hidden tasks (profile) never surface in the footer.
export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()
  const visibleTasks = SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key))
  const primaryTask = visibleTasks[0]
  const collections = CATEGORY_OPTIONS.slice(0, 8)

  return (
    <footer className="mt-24 bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto grid max-w-[var(--editable-container)] gap-12 px-4 pt-20 pb-10 sm:px-8 lg:grid-cols-[1.3fr_1fr_1fr_1fr] lg:px-[4.5rem]">
        <div className="max-w-md">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-accent)]">
              <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain invert" />
            </span>
            <span className="editable-display text-xl font-semibold tracking-[-0.02em] text-white">{SITE_CONFIG.name}</span>
          </Link>
          <p className="mt-6 text-[15px] leading-7 text-white/60">{globalContent.footer.description}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            {primaryTask ? (
              <Link
                href={primaryTask.route}
                className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-5 py-2.5 text-sm font-medium text-white transition hover:brightness-95"
              >
                Browse {sbmLabel.plural} <ArrowUpRight className="h-4 w-4" />
              </Link>
            ) : null}
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:border-white hover:bg-white/5"
            >
              Submit a resource
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">{globalContent.footer.collectionsTitle}</h3>
          <div className="mt-5 grid gap-2.5">
            {collections.map((category) => (
              <Link
                key={category.slug}
                href={`/sbm?category=${category.slug}`}
                className="inline-flex items-center gap-1.5 text-[14px] font-medium text-white/70 transition hover:text-[var(--slot4-accent)]"
              >
                {category.name}
              </Link>
            ))}
            <Link
              href="/sbm"
              className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-medium text-[var(--slot4-accent)]"
            >
              View all <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {globalContent.footer.columns.map((column) => (
          <div key={column.title}>
            <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-white/50">{column.title}</h3>
            <div className="mt-5 grid gap-2.5">
              {column.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[14px] font-medium text-white/70 transition hover:text-[var(--slot4-accent)]"
                >
                  {link.label}
                </Link>
              ))}
              {column.title === 'Site' ? (
                session ? (
                  <button type="button" onClick={logout} className="text-left text-[14px] font-medium text-white/70 transition hover:text-[var(--slot4-accent)]">
                    Sign out
                  </button>
                ) : (
                  <>
                    <Link href="/login" className="text-[14px] font-medium text-white/70 transition hover:text-[var(--slot4-accent)]">Sign in</Link>
                    <Link href="/signup" className="text-[14px] font-medium text-white/70 transition hover:text-[var(--slot4-accent)]">Sign up</Link>
                  </>
                )
              ) : null}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[var(--editable-container)] flex-col items-center justify-between gap-2 px-4 py-6 text-[12px] text-white/40 sm:flex-row sm:px-8 lg:px-[4.5rem]">
          <p>© {year} {SITE_CONFIG.name}. {globalContent.footer.bottomNote}</p>
          <p>Built for curators.</p>
        </div>
      </div>
    </footer>
  )
}
