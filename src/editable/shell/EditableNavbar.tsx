'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, Search, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

// Navbar deliberately holds NO task links. Only:
// logo, About, Contact, search icon → /search, auth actions.
// The mobile sheet mirrors it.
export function EditableNavbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()
  const { session, logout } = useEditableLocalAuthSession()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const items = globalContent.nav.primaryLinks

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[var(--slot4-page-bg)]/95 shadow-[0_1px_0_var(--editable-border)] backdrop-blur-md'
          : 'bg-[var(--slot4-page-bg)]/70 backdrop-blur-sm'
      }`}
    >
      <nav className="mx-auto flex min-h-[72px] w-full max-w-[var(--editable-container)] items-center gap-6 px-4 sm:px-8 lg:px-[4.5rem]">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--slot4-page-text)] transition group-hover:bg-[var(--slot4-accent)]">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-9 w-9 object-contain invert" />
          </span>
          <span className="editable-display text-lg font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)]">
            {SITE_CONFIG.name}
          </span>
        </Link>

        <div className="ml-auto hidden items-center gap-1 lg:flex">
          {items.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative rounded-full px-4 py-2 text-[13px] font-medium transition ${
                  active
                    ? 'text-[var(--slot4-page-text)]'
                    : 'text-[var(--slot4-muted-text)] hover:text-[var(--slot4-page-text)]'
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute inset-x-4 -bottom-0.5 h-[2px] rounded-full bg-[var(--slot4-accent)]" />
                ) : null}
              </Link>
            )
          })}
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-2 lg:ml-2">
        
            

            <Link href="/create" className="hidden rounded-full border border-[var(--editable-border)] px-4 py-2 text-[13px] font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white sm:inline-flex">
              Create
            </Link>
            
          {session ? (
            <button
              type="button"
              onClick={logout}
              className="hidden rounded-full border border-[var(--editable-border)] px-4 py-2 text-[13px] font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white sm:inline-flex"
            >
              Sign out
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden rounded-full px-4 py-2 text-[13px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)] sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="hidden rounded-full bg-[var(--slot4-page-text)] px-4 py-2 text-[13px] font-medium text-white transition hover:bg-[var(--slot4-accent)] sm:inline-flex"
              >
                Sign up
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--editable-border)] lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      {open ? (
        <div className="border-t border-[var(--editable-border)] bg-[var(--slot4-page-bg)] px-4 py-5 lg:hidden">
          <div className="grid gap-1">
            {items.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? 'bg-[var(--slot4-page-text)] text-white'
                      : 'text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]'
                  }`}
                >
                  {item.label}
                </Link>
              )
            })}
            <Link
              href="/search"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)] hover:bg-[var(--slot4-panel-bg)]"
            >
              Search
            </Link>
            {session ? (
              <button
                type="button"
                onClick={() => {
                  logout()
                  setOpen(false)
                }}
                className="mt-2 rounded-2xl border border-[var(--editable-border)] px-4 py-3 text-left text-sm font-medium text-[var(--slot4-page-text)]"
              >
                Sign out
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="mt-2 rounded-2xl border border-[var(--editable-border)] px-4 py-3 text-sm font-medium text-[var(--slot4-page-text)]"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl bg-[var(--slot4-page-text)] px-4 py-3 text-sm font-medium text-white"
                >
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      ) : null}
    </header>
  )
}
