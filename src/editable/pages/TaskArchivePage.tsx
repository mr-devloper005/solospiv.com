import Link from 'next/link'
import {
  ArrowUpRight, ChevronDown, Compass, Filter, Globe, Layers, Search, Sparkles, UserRound,
} from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { dedupeUrls, getEditableExcerpt, getEditableCategory, getEditableDomain, getEditablePostImage } from '@/editable/cards/PostCards'
import { getTaskConfig, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { sbmLabel } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return dedupeUrls([...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])]).slice(0, 8)
}

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'profile' ? (
          <ProfileArchive posts={posts} pagination={pagination} category={category} basePath={basePath} />
        ) : (
          <BookmarkArchive task={task} posts={posts} pagination={pagination} category={category} basePath={basePath} />
        )}
      </main>
    </EditableSiteShell>
  )
}

/* ============================================================ */
/* SBM archive — magazine-style index with featured slab + list  */
/* ============================================================ */
function BookmarkArchive({
  task,
  posts,
  pagination,
  category,
  basePath,
}: {
  task: TaskKey
  posts: SitePost[]
  pagination: SiteFeedPagination
  category: string
  basePath: string
}) {
  const theme = getTaskTheme(task)
  const voice = taskPageVoices[task]
  const page = pagination.page || 1
  const categoryLabel = category === 'all' ? 'All shelves' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const inFeedSize = pickRandom(getSlotSizes('in-feed'))

  const feature = posts[0]
  const spotlight = posts.slice(1, 4)
  const listRows = posts.slice(4)

  return (
    <>
      {/* Split hero: type-first left, category chips + counter right */}
      <section className="relative overflow-hidden border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,var(--tk-glow),transparent_70%)]" />
        <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-14 px-4 py-24 sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:px-[4.5rem] lg:py-32">
          <EditableReveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
              <Compass className="h-3.5 w-3.5" /> {theme.kicker} · {sbmLabel.plural}
            </p>
            <h1 className="editable-display mt-7 max-w-3xl text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[6rem]">
              {voice?.headline || 'Every collection, every resource.'}
            </h1>
            <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[var(--tk-muted)]">{voice?.description || theme.note}</p>
            <div className="mt-8 flex items-center gap-6 text-[13px] text-[var(--tk-muted)]">
              <span className="inline-flex items-center gap-2">
                <span className="editable-display text-3xl font-semibold text-[var(--tk-text)]">{posts.length}</span>
                <span>on the shelf</span>
              </span>
              <span className="hidden h-6 w-px bg-[var(--tk-line)] sm:block" />
              <span className="hidden sm:inline">Filter: {categoryLabel}</span>
            </div>
          </EditableReveal>

          <EditableReveal index={1} className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-bg)] p-6 shadow-[0_18px_50px_rgba(17,17,17,0.06)]">
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Jump to a shelf</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Link
                href={basePath}
                className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                  category === 'all'
                    ? 'bg-[var(--tk-text)] text-white'
                    : 'border border-[var(--tk-line)] text-[var(--tk-text)] hover:border-[var(--tk-text)]'
                }`}
              >
                All
              </Link>
              {CATEGORY_OPTIONS.slice(0, 18).map((item) => {
                const active = category === item.slug
                return (
                  <Link
                    key={item.slug}
                    href={`${basePath}?category=${item.slug}`}
                    className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[12px] font-medium transition ${
                      active
                        ? 'bg-[var(--tk-accent)] text-white'
                        : 'border border-[var(--tk-line)] text-[var(--tk-muted)] hover:border-[var(--tk-text)] hover:text-[var(--tk-text)]'
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
            <form action={basePath} className="mt-6 border-t border-[var(--tk-line)] pt-5">
              <label className="flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4">
                <Filter className="h-4 w-4 text-[var(--tk-muted)]" />
                <select
                  name="category"
                  defaultValue={category}
                  className="min-w-0 flex-1 bg-transparent py-3 text-sm outline-none"
                  aria-label={voice?.filterLabel || 'Filter'}
                >
                  <option value="all">All shelves</option>
                  {CATEGORY_OPTIONS.map((item) => (
                    <option key={item.slug} value={item.slug}>{item.name}</option>
                  ))}
                </select>
                <button className="rounded-full bg-[var(--tk-text)] px-4 py-1.5 text-xs font-medium text-white transition hover:bg-[var(--tk-accent)]">
                  Apply
                </button>
              </label>
            </form>
          </EditableReveal>
        </div>
      </section>

      {posts.length === 0 ? (
        <EmptyShelf />
      ) : (
        <>
          {/* Featured slab + spotlight column */}
          <section className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
            <div className="mx-auto max-w-[var(--editable-container)] px-4 py-16 sm:px-8 lg:px-[4.5rem]">
              <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
                {feature ? (
                  <EditableReveal>
                    <FeatureSlab post={feature} href={`${basePath}/${feature.slug}` || buildPostUrl(task, feature.slug)} />
                  </EditableReveal>
                ) : null}
                <div className="grid gap-4">
                  {spotlight.map((post, i) => {
                    const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
                    return (
                      <EditableReveal key={post.id || post.slug} index={i + 1}>
                        <SpotlightRow post={post} href={href} index={i + 1} />
                      </EditableReveal>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* Dense index list — magazine style rows */}
          <section className="bg-[var(--tk-bg)]">
            <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">The index</p>
                  <h2 className="editable-display mt-3 text-[2rem] font-semibold tracking-[-0.02em] sm:text-[2.5rem]">
                    Every resource on this shelf.
                  </h2>
                </div>
                <p className="hidden text-sm text-[var(--tk-muted)] sm:block">
                  Page {page} of {pagination.totalPages || 1} · {categoryLabel}
                </p>
              </div>

              <div className="mt-10 divide-y divide-[var(--tk-line)] rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)]">
                {listRows.map((post, index) => {
                  const href = `${basePath}/${post.slug}` || buildPostUrl(task, post.slug)
                  const insertAd = index === 3
                  return (
                    <div key={post.id || post.slug}>
                      <EditableReveal index={index % 8}>
                        <IndexRow post={post} href={href} order={index + 5} />
                      </EditableReveal>
                      {insertAd ? (
                        <div className="border-t border-[var(--tk-line)] bg-[var(--tk-bg)] px-6 py-6">
                          <Ads slot="in-feed" size={inFeedSize} showLabel className="mx-auto w-full" />
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>

              <nav className="mt-14 flex flex-col items-center justify-center gap-3 text-sm sm:flex-row">
                {pagination.hasPrevPage ? (
                  <Link href={pageHref(basePath, category, page - 1)} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition hover:border-[var(--tk-text)] hover:bg-[var(--tk-text)] hover:text-white">
                    ← Previous shelf
                  </Link>
                ) : null}
                <span className="rounded-full bg-[var(--tk-surface)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">
                  Shelf {page} · {pagination.totalPages || 1}
                </span>
                {pagination.hasNextPage ? (
                  <Link href={pageHref(basePath, category, page + 1)} className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition hover:border-[var(--tk-text)] hover:bg-[var(--tk-text)] hover:text-white">
                    Next shelf →
                  </Link>
                ) : null}
              </nav>
            </div>
          </section>
        </>
      )}
    </>
  )
}

function FeatureSlab({ post, href }: { post: SitePost; href: string }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post) || getField(post, ['website', 'url', 'link']).replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-[var(--tk-radius)] bg-[var(--tk-text)]">
      {image ? (
        <img src={image} alt="" className="h-full max-h-[540px] w-full object-cover opacity-45 transition duration-[900ms] group-hover:scale-105" />
      ) : null}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,17,17,0.2),rgba(17,17,17,0.85))]" />
      <div className="absolute inset-0 flex flex-col justify-between p-8 lg:p-12">
        <div className="flex items-center gap-2 text-white/80">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-accent)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-white">
            <Sparkles className="h-3 w-3" /> Editor’s pick
          </span>
          <span className="text-[11px] font-medium uppercase tracking-[0.24em] text-white/60">{category}</span>
        </div>
        <div>
          <h3 className="editable-display max-w-2xl text-3xl font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:text-4xl lg:text-[3rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-lg text-[14px] leading-6 text-white/70">{getEditableExcerpt(post, 160)}</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-[var(--tk-text)] transition group-hover:bg-[var(--tk-accent)] group-hover:text-white">
              Open collection <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
            {domain ? (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 px-3 py-1.5 text-[11px] font-medium text-white/80">
                <Globe className="h-3.5 w-3.5" /> {domain}
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  )
}

function SpotlightRow({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post)
  return (
    <Link href={href} className="group flex gap-4 rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-4 transition hover:-translate-y-0.5 hover:border-[var(--tk-text)]">
      <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[calc(var(--tk-radius)-4px)] bg-[var(--tk-raised)] sm:h-28 sm:w-28">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="editable-display text-[13px] font-semibold text-[var(--tk-accent)]">{String(index).padStart(2, '0')}</span>
            <span className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{category}</span>
          </div>
          <h4 className="editable-display mt-1 line-clamp-2 text-[16px] font-semibold leading-snug tracking-[-0.01em]">{post.title}</h4>
        </div>
        <div className="flex items-center justify-between">
          {domain ? <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--tk-accent)]"><Globe className="h-3 w-3" /> {domain}</span> : <span className="text-[11px] text-[var(--tk-muted)]">Open</span>}
          <ArrowUpRight className="h-4 w-4 text-[var(--tk-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tk-accent)]" />
        </div>
      </div>
    </Link>
  )
}

function IndexRow({ post, href, order }: { post: SitePost; href: string; order: number }) {
  const image = getEditablePostImage(post)
  const category = getEditableCategory(post)
  const domain = getEditableDomain(post) || getField(post, ['website', 'url', 'link']).replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <Link href={href} className="group grid gap-6 p-6 transition hover:bg-[var(--tk-bg)] sm:grid-cols-[64px_120px_minmax(0,1fr)_auto] sm:items-center sm:p-7">
      <div className="editable-display text-[28px] font-semibold leading-none tracking-[-0.02em] text-[var(--tk-accent)]">
        {String(order).padStart(2, '0')}
      </div>
      <div className="relative aspect-[4/3] w-[120px] shrink-0 overflow-hidden rounded-[calc(var(--tk-radius)-4px)] bg-[var(--tk-raised)]">
        {image ? <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">{category}</p>
        <h3 className="editable-display mt-2 line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] sm:text-xl">{post.title}</h3>
        <p className="mt-2 line-clamp-1 text-[13px] leading-6 text-[var(--tk-muted)]">{getEditableExcerpt(post, 160)}</p>
      </div>
      <div className="flex items-center gap-4">
        {domain ? <span className="hidden items-center gap-1.5 text-[11px] font-medium text-[var(--tk-muted)] sm:inline-flex"><Globe className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {domain}</span> : null}
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] px-3.5 py-1.5 text-[11px] font-medium text-[var(--tk-text)] transition group-hover:border-[var(--tk-text)] group-hover:bg-[var(--tk-text)] group-hover:text-white">
          Open <ArrowUpRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

function EmptyShelf() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-32 text-center sm:px-8">
      <EditableReveal className="rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-surface)] p-12">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
          <Search className="h-6 w-6" />
        </div>
        <h2 className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">This shelf hasn’t opened yet.</h2>
        <p className="mt-3 text-sm text-[var(--tk-muted)]">Pick a different collection above, or come back when curators refresh the index.</p>
      </EditableReveal>
    </section>
  )
}

/* ============================================================ */
/* Profile archive — hidden but functional curator directory     */
/* ============================================================ */
function ProfileArchive({ posts, pagination, category, basePath }: { posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const page = pagination.page || 1
  return (
    <>
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto max-w-[var(--editable-container)] px-4 pt-24 pb-14 sm:px-8 lg:px-[4.5rem] lg:pt-32">
          <EditableReveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] bg-[var(--tk-bg)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
              <Layers className="h-3.5 w-3.5" /> Curator directory
            </p>
            <h1 className="editable-display mt-6 max-w-4xl text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3.75rem] lg:text-[5rem]">
              The people behind the shelf.
            </h1>
            <p className="mt-6 max-w-2xl text-[17px] leading-[1.6] text-[var(--tk-muted)]">
              Identity-first directory. Every curator has a page, a focus area, and a set of collections they maintain.
            </p>
          </EditableReveal>
        </div>
      </section>

      <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-24 pt-14 sm:px-8 lg:px-[4.5rem]">
        {posts.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {posts.map((post, index) => {
              const href = `${basePath}/${post.slug}` || buildPostUrl('profile', post.slug)
              return (
                <EditableReveal key={post.id || post.slug} index={index % 6}>
                  <ProfileCard post={post} href={href} />
                </EditableReveal>
              )
            })}
          </div>
        ) : (
          <EmptyShelf />
        )}

        {posts.length ? (
          <nav className="mt-16 flex items-center justify-center gap-3 text-sm">
            {pagination.hasPrevPage ? (
              <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition hover:border-[var(--tk-text)]">
                Previous
              </Link>
            ) : null}
            <span className="rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-5 py-2.5 font-medium text-[var(--tk-muted)]">
              Page {page} of {pagination.totalPages || 1}
            </span>
            {pagination.hasNextPage ? (
              <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[var(--tk-line)] px-5 py-2.5 font-medium transition hover:border-[var(--tk-text)]">
                Next
              </Link>
            ) : null}
          </nav>
        ) : null}
      </section>
    </>
  )
}

function ProfileCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const focus = getEditableCategory(post)
  const initials = (post.title || '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'C'

  return (
    <Link
      href={href}
      className="group relative flex h-full flex-col overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-text)] hover:shadow-[0_22px_60px_rgba(17,17,17,0.12)]"
    >
      <div className="relative h-32 bg-[linear-gradient(135deg,var(--tk-accent-soft),var(--tk-raised))]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_120%,var(--tk-glow),transparent_60%)]" />
      </div>
      <div className="-mt-12 px-6">
        <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-[var(--tk-surface)] bg-[var(--tk-raised)] shadow-[0_10px_30px_rgba(17,17,17,0.08)]">
          {avatar ? (
            <img src={avatar} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="editable-display text-2xl font-semibold">{initials}</span>
          )}
        </div>
      </div>
      <div className="flex flex-1 flex-col px-6 pt-4 pb-6">
        <h2 className="editable-display text-xl font-semibold tracking-[-0.02em]">{post.title}</h2>
        {role ? <p className="mt-1 text-[13px] font-medium text-[var(--tk-accent)]">{role}</p> : null}
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[var(--tk-muted)]">{getEditableExcerpt(post, 130)}</p>
        <div className="mt-5 flex items-center justify-between border-t border-[var(--tk-line)] pt-4">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--tk-accent-soft)] px-3 py-1 text-[11px] font-medium text-[var(--tk-accent)]">
            <UserRound className="h-3 w-3" /> {focus}
          </span>
          <ArrowUpRight className="h-4 w-4 text-[var(--tk-muted)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--tk-accent)]" />
        </div>
      </div>
    </Link>
  )
}

// dropdown icon (kept for imports parity if this file grows again)
void ChevronDown
