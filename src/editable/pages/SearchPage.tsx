import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowUpRight, Globe, ListFilter, Search, SlidersHorizontal } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { toPlainText, getEditableDomain } from '@/editable/cards/PostCards'
import { pagesContent } from '@/editable/content/pages.content'
import { isUiHiddenTask, sbmLabel } from '@/editable/content/global.content'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) =>
  typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : ''
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const summaryOf = (post: SitePost) =>
  toPlainText(
    (typeof post.summary === 'string' && post.summary) ||
      compactRaw(getContent(post).description) ||
      compactRaw(getContent(post).excerpt) ||
      compactRaw(getContent(post).body) ||
      '',
  )

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (derivedTask && isUiHiddenTask(derivedTask)) return false
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultRow({ post, order }: { post: SitePost; order: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const taskRoute = task ? SITE_CONFIG.tasks.find((item) => item.key === task)?.route : ''
  const href = `${taskRoute || `/${task || 'sbm'}`}/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const domain = getEditableDomain(post)
  const taskLabel = task === 'sbm' ? sbmLabel.short : SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Resource'

  return (
    <Link
      href={href}
      className="group grid gap-5 p-6 transition hover:bg-[var(--slot4-warm)] sm:grid-cols-[56px_140px_minmax(0,1fr)_auto] sm:items-center sm:p-7"
    >
      <div className="editable-display text-[24px] font-semibold leading-none tracking-[-0.02em] text-[var(--slot4-accent)]">
        {String(order).padStart(2, '0')}
      </div>
      <div className="relative aspect-[4/3] w-[140px] shrink-0 overflow-hidden rounded-[calc(var(--editable-radius-md))] bg-[var(--slot4-media-bg)]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-[var(--slot4-page-text)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
            {taskLabel}
          </span>
          {domain ? <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--slot4-accent)]"><Globe className="h-3.5 w-3.5" /> {domain}</span> : null}
        </div>
        <h3 className="editable-display mt-3 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl">
          {post.title}
        </h3>
        {summary ? <p className="mt-2 line-clamp-2 text-[13px] leading-6 text-[var(--slot4-muted-text)]">{summary}</p> : null}
      </div>
      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border-strong)] px-4 py-2 text-[12px] font-medium text-[var(--slot4-page-text)] transition group-hover:border-[var(--slot4-page-text)] group-hover:bg-[var(--slot4-page-text)] group-hover:text-white">
        Open <ArrowUpRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }>
}) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length
    ? feed.posts
    : useMaster
    ? []
    : SITE_CONFIG.tasks
        .filter((item) => item.enabled && !isUiHiddenTask(item.key))
        .flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const visibleTasks = SITE_CONFIG.tasks.filter((item) => item.enabled && !isUiHiddenTask(item.key))
  const footerAdSize = pickRandom(getSlotSizes('footer'))
  const categoryLabel = category ? CATEGORY_OPTIONS.find((c) => c.slug === category)?.name || category : 'All shelves'
  const activeTaskLabel = task === 'sbm' ? sbmLabel.short : task ? SITE_CONFIG.tasks.find((t) => t.key === task)?.label : 'Any type'

  const popularShelves = CATEGORY_OPTIONS.slice(0, 10)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)] text-[var(--slot4-page-text)]">
        {/* Dark search-first band */}
        <section className="relative overflow-hidden bg-[var(--slot4-dark-bg)] text-white">
          <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(255,109,12,0.35),transparent_65%)]" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(255,109,12,0.20),transparent_65%)]" />
          <div className="relative mx-auto max-w-[var(--editable-container)] px-4 pb-16 pt-24 sm:px-8 lg:px-[4.5rem] lg:pt-32">
            <EditableReveal>
              <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                <Search className="h-3.5 w-3.5" /> {pagesContent.search.hero.badge}
              </p>
              <h1 className="editable-display mt-8 max-w-4xl text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.035em] sm:text-[4.5rem] lg:text-[6rem]">
                Search the shelf.
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-white/70">{pagesContent.search.hero.description}</p>
            </EditableReveal>

            {/* Search bar — big, full-bleed on dark */}
            <EditableReveal index={1} className="mt-10">
              <form action="/search" className="rounded-[var(--editable-radius-lg)] bg-white/[0.06] p-2 backdrop-blur">
                <input type="hidden" name="master" value="1" />
                <div className="grid gap-2 sm:grid-cols-[1.6fr_1fr_1fr_auto]">
                  <label className="flex items-center gap-2 rounded-full bg-white px-5">
                    <Search className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                    <input
                      name="q"
                      defaultValue={query}
                      placeholder={pagesContent.search.hero.placeholder}
                      className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
                    />
                  </label>
                  <label className="flex items-center gap-2 rounded-full bg-white/95 px-5">
                    <SlidersHorizontal className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                    <select name="category" defaultValue={category} className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[var(--slot4-page-text)] outline-none">
                      <option value="">All shelves</option>
                      {CATEGORY_OPTIONS.map((item) => (
                        <option key={item.slug} value={item.slug}>{item.name}</option>
                      ))}
                    </select>
                  </label>
                  <label className="flex items-center gap-2 rounded-full bg-white/95 px-5">
                    <ListFilter className="h-4 w-4 text-[var(--slot4-muted-text)]" />
                    <select name="task" defaultValue={task} className="min-w-0 flex-1 bg-transparent py-4 text-sm text-[var(--slot4-page-text)] outline-none">
                      <option value="">Any type</option>
                      {visibleTasks.map((item) => (
                        <option key={item.key} value={item.key}>{item.key === 'sbm' ? sbmLabel.short : item.label}</option>
                      ))}
                    </select>
                  </label>
                  <button className="inline-flex items-center justify-center rounded-full bg-[var(--slot4-accent)] px-8 py-4 text-sm font-medium text-white transition hover:brightness-95">
                    Search
                  </button>
                </div>
              </form>
            </EditableReveal>

            {/* Popular shelves as chips */}
            <EditableReveal index={2} className="mt-8">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-white/40">Popular shelves</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {popularShelves.map((shelf) => (
                  <Link
                    key={shelf.slug}
                    href={`/search?category=${shelf.slug}&master=1`}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.03] px-3.5 py-1.5 text-[12px] font-medium text-white/80 transition hover:border-[var(--slot4-accent)] hover:text-white"
                  >
                    {shelf.name}
                  </Link>
                ))}
              </div>
            </EditableReveal>
          </div>
        </section>

        {/* Results header + status */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 pt-16 sm:px-8 lg:px-[4.5rem]">
          <EditableReveal className="flex flex-col justify-between gap-4 border-b border-[var(--editable-border)] pb-8 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">
                {results.length} result{results.length === 1 ? '' : 's'}
              </p>
              <h2 className="editable-display mt-3 text-[1.75rem] font-semibold tracking-[-0.02em] sm:text-[2rem]">
                {query ? `Results for “${query}”` : pagesContent.search.resultsTitle}
              </h2>
              <p className="mt-2 text-[13px] text-[var(--slot4-muted-text)]">
                {categoryLabel} · {activeTaskLabel}
              </p>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white">
              Browse the shelf <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>
        </section>

        {/* Results — dense list rows */}
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-14 sm:px-8 lg:px-[4.5rem]">
          {results.length ? (
            <div className="divide-y divide-[var(--editable-border)] rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
              {results.map((post, i) => (
                <EditableReveal key={post.id || post.slug} index={i % 8}>
                  <SearchResultRow post={post} order={i + 1} />
                </EditableReveal>
              ))}
            </div>
          ) : (
            <EditableReveal className="rounded-[var(--editable-radius-lg)] border border-dashed border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <Search className="h-6 w-6" />
              </div>
              <p className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">Nothing matched.</p>
              <p className="mt-3 text-sm text-[var(--slot4-muted-text)]">Try a different keyword or a different shelf.</p>
            </EditableReveal>
          )}
        </section>

        <div className="mx-auto max-w-[var(--editable-container)] px-4 pb-20 sm:px-8 lg:px-[4.5rem]">
          <Ads slot="footer" size={footerAdSize} showLabel className="mx-auto w-full" />
        </div>
      </main>
    </EditableSiteShell>
  )
}
