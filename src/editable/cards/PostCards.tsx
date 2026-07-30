import Link from 'next/link'
import { ArrowUpRight, Globe } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { TaskKey } from '@/lib/site-config'
import { editableDesignContract as dc, editablePalette as pal } from '@/editable/layouts/design-contract'

export function dedupeUrls(urls: Array<string | null | undefined>): string[] {
  return Array.from(
    new Set(
      urls
        .map((url) => (typeof url === 'string' ? url.trim() : ''))
        .filter((url) => url.length > 0),
    ),
  )
}

export function getEditablePostImage(post?: SitePost | null) {
  const media = Array.isArray(post?.media) ? post?.media : []
  const mediaUrl = media.find((item) => typeof item?.url === 'string' && item.url)?.url
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const images = Array.isArray(content.images) ? content.images : []
  const contentImage = images.find((url): url is string => typeof url === 'string' && Boolean(url))
  const logo = typeof content.logo === 'string' ? content.logo : ''
  return mediaUrl || contentImage || logo || '/placeholder.svg?height=900&width=1400'
}

export function toPlainText(value: unknown): string {
  if (typeof value !== 'string') return ''
  return value
    .replace(/<(script|style)[^>]*>[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#0?39;|&apos;/gi, "'")
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

export function getEditableExcerpt(post?: SitePost | null, limit = 150) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}…` : clean
}

export function getEditableCategory(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || 'Collection'
}

export function getEditableDomain(post?: SitePost | null) {
  const content = post?.content && typeof post.content === 'object' ? post.content as Record<string, unknown> : {}
  const value =
    (typeof content.website === 'string' && content.website) ||
    (typeof content.url === 'string' && content.url) ||
    (typeof content.link === 'string' && content.link) ||
    ''
  return value.replace(/^https?:\/\//, '').replace(/\/$/, '')
}

export function postHref(task: TaskKey, post: SitePost, route = `/${task}`) {
  return `${route}/${post.slug}`
}

// Editorial hero card — dark 1f1f1f slab with big display type + orange chip.
export function EditorialFeatureCard({ post, href, label = 'Featured collection' }: { post: SitePost; href: string; label?: string }) {
  return (
    <Link href={href} className={`group block min-w-0 overflow-hidden ${dc.surface.dark} ${dc.motion.lift}`}>
      <div className="relative min-h-[440px] p-8 sm:min-h-[520px] lg:min-h-[600px] lg:p-12">
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,31,31,0.35),rgba(31,31,31,0.92))]" />
        <div className="relative z-10 flex h-full min-h-[380px] flex-col justify-end lg:min-h-[500px]">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-white">
            {label}
          </span>
          <h3 className="editable-display mt-6 max-w-3xl text-4xl font-semibold leading-[1.04] tracking-[-0.03em] text-white sm:text-5xl lg:text-[3.75rem]">
            {post.title}
          </h3>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-white/70 sm:text-base">{getEditableExcerpt(post, 190)}</p>
          <span className="mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
            Open collection <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  )
}

// Compact rail card — ivory surface, hairline border, big number chip.
export function RailPostCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group ${dc.layout.minRailCard} block overflow-hidden ${dc.surface.card} ${dc.motion.lift}`}>
      <div className={`${dc.media.frame} aspect-[4/5]`}>
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-page-text)]">
          No. {String(index + 1).padStart(2, '0')}
        </span>
      </div>
      <div className="p-6">
        <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
        <h3 className={`editable-display mt-3 line-clamp-3 text-xl font-semibold leading-snug tracking-[-0.02em] ${pal.panelText}`}>{post.title}</h3>
        <p className={`mt-3 line-clamp-3 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 130)}</p>
      </div>
    </Link>
  )
}

// Compact index card — a numbered row for a shelf list.
export function CompactIndexCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const domain = getEditableDomain(post)
  return (
    <Link href={href} className={`group block min-w-0 ${dc.surface.soft} p-6 ${dc.motion.lift}`}>
      <div className="flex items-start gap-5">
        <span className="editable-display flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-page-text)] text-lg font-semibold text-white">
          {String(index + 1).padStart(2, '0')}
        </span>
        <div className="min-w-0">
          <p className={`${dc.type.eyebrow}`}>{getEditableCategory(post)}</p>
          <h3 className={`editable-display mt-2 line-clamp-2 text-lg font-semibold leading-tight tracking-[-0.02em] ${pal.panelText}`}>{post.title}</h3>
          <p className={`mt-2 line-clamp-2 text-sm leading-6 ${pal.mutedText}`}>{getEditableExcerpt(post, 110)}</p>
          {domain ? (
            <p className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-[var(--slot4-accent)]">
              <Globe className="h-3.5 w-3.5" /> {domain}
            </p>
          ) : null}
        </div>
      </div>
    </Link>
  )
}

// List-style article card — image left, text right, big display headline.
export function ArticleListCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  return (
    <Link href={href} className={`group grid min-w-0 gap-6 overflow-hidden ${dc.surface.card} p-4 ${dc.motion.lift} sm:grid-cols-[260px_minmax(0,1fr)]`}>
      <div className={`${dc.media.frame} aspect-[16/12] sm:aspect-auto sm:min-h-[220px]`}>
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="min-w-0 p-2 sm:py-6 sm:pr-6">
        <p className={`${dc.type.eyebrow}`}>No. {String(index + 1).padStart(2, '0')} · {getEditableCategory(post)}</p>
        <h2 className={`editable-display mt-3 line-clamp-3 text-2xl font-semibold leading-tight tracking-[-0.02em] ${pal.panelText} sm:text-3xl`}>{post.title}</h2>
        <p className={`mt-4 line-clamp-3 text-[15px] leading-7 ${pal.mutedText}`}>{getEditableExcerpt(post, 190)}</p>
        <span className={`mt-6 inline-flex items-center gap-2 text-sm font-medium ${pal.panelText}`}>
          Open resource <ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </span>
      </div>
    </Link>
  )
}
