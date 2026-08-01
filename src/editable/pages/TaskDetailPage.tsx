import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowUpRight, BadgeCheck, Bookmark, ExternalLink, FileText, Globe, Link2, Mail, MapPin, Phone, ShieldCheck, Sparkles, Tag, UserRound,
} from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { dedupeUrls } from '@/editable/cards/PostCards'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableArticleComments } from '@/editable/components/EditableArticleComments'
import { getTaskTheme, taskThemeStyle } from '@/editable/theme/task-themes'
import { EditableReveal } from '@/editable/shell/EditableReveal'
import { sbmLabel, isUiHiddenTask } from '@/editable/content/global.content'
import { Ads, getSlotSizes } from '@/lib/ads'

const pickRandom = (sizes: string[]) => sizes[Math.floor(Math.random() * sizes.length)]

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = isUiHiddenTask(task) ? [] : (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar', 'cover'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return dedupeUrls([...media, ...images, ...singleImages]).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || ''
}

const escapeHtml = (value: string) => value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')
const safeUrl = (value: string) => (/^https?:\/\//i.test(value) ? value : '#')
const linkifyMarkdown = (value: string) =>
  value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_m, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_m, pre, url) => `${pre}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) =>
  html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_m, attrs) => {
    let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
    if (!/\starget=/i.test(next)) next += ' target="_blank"'
    if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
    return `<a ${next}>`
  })
const sanitizeHtml = (html: string) =>
  hardenLinks(
    html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
      .replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '')
      .replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
      .replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'),
  )
const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const comparable = (value: string) => stripHtml(value).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim()
const leadText = (post: SitePost) => {
  const summary = summaryText(post)
  if (!summary) return ''
  const lead = stripHtml(summary)
  if (!lead) return ''
  const leadKey = comparable(lead)
  return leadKey && comparable(getBody(post)).includes(leadKey) ? '' : lead
}
const tagsOf = (post: SitePost) => (Array.isArray(post.tags) ? post.tags.filter((tag): tag is string => typeof tag === 'string' && !!tag) : [])
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || tagsOf(post)[0] || fallback

export function TaskDetailView({
  task,
  post,
  related,
  comments = [],
}: {
  task: TaskKey
  post: SitePost
  related: SitePost[]
  comments?: Array<{ id: string; name: string; comment: string; createdAt: string }>
}) {
  return (
    <EditableSiteShell>
      <main style={taskThemeStyle(task)} className="min-h-screen bg-[var(--tk-bg)] text-[var(--tk-text)]">
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
      </main>
    </EditableSiteShell>
  )
}

/* ---------------- Shared ---------------- */
function Kicker({ task, children }: { task: TaskKey; children: React.ReactNode }) {
  const theme = getTaskTheme(task)
  return (
    <div className="inline-flex items-center gap-2.5 text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">
      <span>{theme.kicker}</span>
      <span className="h-1 w-1 rounded-full bg-[var(--tk-accent)] opacity-50" />
      <span className="text-[var(--tk-muted)]">{children}</span>
    </div>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  const html = formatPlainText(getBody(post))
  if (!html) return null
  return (
    <div
      className={`article-content max-w-none text-[var(--tk-text)] ${compact ? 'text-[15px] leading-7' : 'text-[1.0625rem] leading-[1.85]'}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}

/* ================================================================ */
/* BOOKMARK DETAIL — asymmetric hero, big domain slab, index rail    */
/* ================================================================ */
function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  const domain = website.replace(/^https?:\/\//, '').replace(/\/$/, '')
  const domainRoot = domain.split('/')[0]
  const category = categoryOf(post, sbmLabel.short)
  const verified = Boolean(website)
  const tags = tagsOf(post).slice(0, 8)
  const lead = leadText(post)
  const sidebarSize = pickRandom(getSlotSizes('sidebar'))

  const stats = [
    { label: 'Collection', value: category, icon: Bookmark },
    { label: 'Domain', value: domainRoot || 'On-shelf', icon: Globe },
    { label: verified ? 'Verified' : 'Curated', value: verified ? 'Direct link' : 'Curator-approved', icon: ShieldCheck },
    { label: 'Type', value: 'Resource', icon: Link2 },
  ]

  return (
    <>
      {/* Asymmetric hero — huge display + right-side resource card */}
      <section className="relative overflow-hidden border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="pointer-events-none absolute -left-40 -top-20 h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle,var(--tk-glow),transparent_65%)]" />
        <div className="pointer-events-none absolute -right-24 top-60 h-64 w-64 rotate-12 rounded-[48px] bg-[var(--tk-accent-soft)] opacity-70" />
        <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-14 px-4 pt-24 pb-20 sm:px-8 lg:grid-cols-[1.35fr_0.65fr] lg:px-[4.5rem] lg:pt-32">
          <EditableReveal>
            <Kicker task="sbm">Curated resource</Kicker>
            <h1 className="editable-display mt-6 max-w-4xl text-balance text-[3rem] font-semibold leading-[0.98] tracking-[-0.03em] sm:text-[4.5rem] lg:text-[6rem]">
              {post.title}
            </h1>
            {lead ? <p className="mt-7 max-w-2xl text-[19px] leading-[1.6] text-[var(--tk-muted)]">{lead}</p> : null}
            <div className="mt-10 flex flex-wrap items-center gap-3">
              {website ? (
                <Link
                  href={website}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]"
                >
                  Visit resource <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-3 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)]">
                <Bookmark className="h-4 w-4" /> More on this shelf
              </Link>
            </div>
          </EditableReveal>

          {/* Right-side "domain slab" card */}
          <EditableReveal index={1}>
            <aside className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-bg)] p-7 shadow-[0_18px_60px_rgba(17,17,17,0.08)]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--tk-accent)] text-white">
                  <Globe className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Destination</p>
                  <p className="editable-display mt-0.5 truncate text-lg font-semibold tracking-[-0.02em]">{domainRoot || 'On-shelf resource'}</p>
                </div>
              </div>
              <div className="mt-5 border-t border-[var(--tk-line)] pt-5 text-[13px] leading-6 text-[var(--tk-muted)]">
                Opens straight to the source. No proxy, no tracking pixel between you and the destination.
              </div>
              {website ? (
                <Link
                  href={website}
                  target="_blank"
                  rel="nofollow noopener noreferrer"
                  className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--tk-accent)] px-5 py-3 text-sm font-medium text-white transition hover:brightness-95"
                >
                  Open <ExternalLink className="h-4 w-4" />
                </Link>
              ) : null}
              <div className="mt-5 grid grid-cols-2 gap-2 text-center">
                {[
                  ['Verified', verified ? 'Yes' : '—'],
                  ['Shelf', category],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[var(--tk-raised)] px-3 py-3">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--tk-muted)]">{label}</p>
                    <p className="mt-1 truncate text-[13px] font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </aside>
          </EditableReveal>
        </div>
      </section>

      {/* 4-column stat rail */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-bg)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] grid-cols-2 divide-x divide-[var(--tk-line)] border-x border-[var(--tk-line)] sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4 px-6 py-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
                <stat.icon className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">{stat.label}</p>
                <p className="mt-1 truncate text-[14px] font-medium text-[var(--tk-text)]">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Body with sticky INDEX rail (not just a card sidebar) */}
      <section className="mx-auto max-w-[var(--editable-container)] px-4 pb-20 pt-20 sm:px-8 lg:grid lg:grid-cols-[240px_minmax(0,1fr)_320px] lg:gap-12 lg:px-[4.5rem]">
        {/* Sticky index rail — left */}
        <nav className="hidden lg:sticky lg:top-24 lg:block lg:self-start">
          <p className="text-[10px] font-medium uppercase tracking-[0.28em] text-[var(--tk-muted)]">On this page</p>
          <ol className="mt-6 grid gap-3 border-l border-[var(--tk-line)] pl-5 text-[13px]">
            <li><a href="#overview" className="text-[var(--tk-text)] transition hover:text-[var(--tk-accent)]">Overview</a></li>
            <li><a href="#details" className="text-[var(--tk-muted)] transition hover:text-[var(--tk-accent)]">What’s inside</a></li>
            {tags.length ? <li><a href="#tags" className="text-[var(--tk-muted)] transition hover:text-[var(--tk-accent)]">Topics</a></li> : null}
            {related.length ? <li><a href="#more" className="text-[var(--tk-muted)] transition hover:text-[var(--tk-accent)]">From this collection</a></li> : null}
          </ol>
        </nav>

        <article className="min-w-0">
          <EditableReveal id="overview">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-8 sm:p-10">
              <div className="flex items-center gap-2 text-[var(--tk-accent)]">
                <Sparkles className="h-4 w-4" />
                <span className="text-[11px] font-medium uppercase tracking-[0.24em]">The curator’s note</span>
              </div>
              <p className="mt-5 text-[17px] leading-[1.7] text-[var(--tk-text)]">
                {lead || `A hand-picked entry on the ${category} shelf. Everything you need is one click away — the resource opens directly to the source.`}
              </p>
            </div>
          </EditableReveal>

          <EditableReveal index={1} id="details" className="mt-16">
            <h2 className="editable-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem]">
              What’s inside this resource
            </h2>
            <div className="mt-8">
              <BodyContent post={post} />
            </div>
          </EditableReveal>

          {tags.length ? (
            <EditableReveal index={2} id="tags" className="mt-14">
              <h3 className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Topics on this shelf</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--tk-line)] bg-[var(--tk-surface)] px-4 py-2 text-[12px] font-medium text-[var(--tk-text)]">
                    <Tag className="h-3.5 w-3.5 text-[var(--tk-accent)]" /> {tag}
                  </span>
                ))}
              </div>
            </EditableReveal>
          ) : null}

          {website ? (
            <EditableReveal index={3} className="mt-16">
              <div className="relative overflow-hidden rounded-[var(--tk-radius)] bg-[var(--tk-text)] p-10 text-white sm:p-14">
                <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-[var(--tk-accent)] opacity-20 blur-3xl" />
                <div className="relative">
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Ready to open</p>
                  <h3 className="editable-display mt-4 max-w-xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem]">
                    Head straight to the source.
                  </h3>
                  <p className="mt-4 max-w-lg text-[15px] leading-[1.6] text-white/70">
                    We keep the shelf tidy. The link opens in a new tab so this page stays here for you.
                  </p>
                  <Link
                    href={website}
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-accent)] px-6 py-3 text-sm font-medium text-white transition hover:brightness-95"
                  >
                    Visit resource <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </EditableReveal>
          ) : null}
        </article>

        {/* Right sidebar — sticky trust panel + ad */}
        <aside className="mt-14 space-y-6 lg:mt-0 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[var(--tk-muted)]">Why it’s on the shelf</p>
            <ul className="mt-4 grid gap-3 text-[13px] leading-6 text-[var(--tk-text)]">
              <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Reviewed by a curator</li>
              <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Verified live domain</li>
              <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> Opens straight to source</li>
              <li className="flex items-start gap-2"><BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-[var(--tk-accent)]" /> No tracking proxy</li>
            </ul>
          </div>

          <div className="rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-bg)] p-6">
            <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--tk-accent)]">Suggest a resource</p>
            <p className="mt-3 text-[13px] leading-6 text-[var(--tk-muted)]">
              Know something that belongs on this shelf? Send it along — curators review submissions weekly.
            </p>
            <Link
              href="/contact"
              className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--tk-text)] hover:text-[var(--tk-accent)]"
            >
              Submit a resource <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <Ads slot="sidebar" size={sidebarSize} showLabel className="w-full" />
        </aside>
      </section>

      {related.length ? (
        <section id="more" className="border-t border-[var(--tk-line)] bg-[var(--tk-surface)]">
          <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">From this collection</p>
                <h2 className="editable-display mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem]">
                  Continue the shelf.
                </h2>
              </div>
              <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--tk-line)] px-5 py-2.5 text-sm font-medium text-[var(--tk-text)] transition hover:border-[var(--tk-text)] hover:bg-[var(--tk-text)] hover:text-white">
                All shelves <ArrowUpRight className="h-4 w-4" />
              </Link>
            </EditableReveal>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item, i) => (
                <EditableReveal key={item.id || item.slug} index={i}>
                  <RelatedResourceCard task="sbm" post={item} />
                </EditableReveal>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

function RelatedResourceCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const href = `${getTaskConfig(task)?.route || `/${task}`}/${post.slug}`
  const image = getImages(post)[0]
  const domain = getField(post, ['website', 'url', 'link']).replace(/^https?:\/\//, '').replace(/\/$/, '')
  return (
    <Link href={href} className="group flex h-full flex-col overflow-hidden rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] transition duration-500 hover:-translate-y-1 hover:border-[var(--tk-text)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--tk-raised)]">
        {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="editable-display line-clamp-2 text-base font-semibold leading-snug tracking-[-0.02em]">{post.title}</h3>
        {domain ? <p className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--tk-accent)]"><Globe className="h-3.5 w-3.5" /> {domain}</p> : null}
      </div>
    </Link>
  )
}

/* ================================================================ */
/* PROFILE DETAIL — split hero, stat bar, tabbed panels, contact rail */
/* ================================================================ */
function ProfileDetail({ post }: { post: SitePost }) {
  const images = getImages(post)
  const avatar = images[0]
  const cover = images[1] || images[0]
  const role = getField(post, ['role', 'designation', 'company'])
  // leadText() dedupes vs the body — do NOT fall back to content.bio, since
  // that path skips the dedup and prints the same paragraph twice.
  const bio = leadText(post)
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const location = getField(post, ['location', 'address', 'city'])
  const focus = categoryOf(post, 'General')
  const initials = (post.title || '').split(/\s+/).slice(0, 2).map((w) => w[0]).join('').toUpperCase() || 'C'
  const tags = tagsOf(post).slice(0, 6)

  const stats = [
    { label: 'Focus', value: focus },
    { label: 'Role', value: role || 'Curator' },
  ]

  return (
    <>
      {/* Split identity hero — dark left rail with avatar + focus, ivory right with bio */}
      <section className="relative overflow-hidden border-b border-[var(--tk-line)]">
        <div className="pointer-events-none absolute inset-0 h-full">
          {cover ? <img src={cover} alt="" className="h-full w-full object-cover opacity-10" /> : null}
        </div>
        <div className="relative mx-auto grid max-w-[var(--editable-container)] gap-0 px-0 sm:px-8 lg:grid-cols-[420px_minmax(0,1fr)] lg:gap-16 lg:px-[4.5rem]">
          {/* Dark identity slab */}
          <EditableReveal className="relative overflow-hidden bg-[var(--tk-text)] px-8 py-14 text-white sm:rounded-b-[var(--tk-radius)] lg:sticky lg:top-24 lg:mt-14 lg:mb-14 lg:h-fit lg:self-start lg:rounded-[var(--tk-radius)] lg:px-10 lg:py-12">
            <div className="pointer-events-none absolute -right-16 -bottom-16 h-56 w-56 rounded-full bg-[var(--tk-accent)] opacity-30 blur-3xl" />
            <div className="relative">
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Curator profile</p>
              <div className="mt-8 flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-white/10 bg-white/5">
                {avatar ? (
                  <img src={avatar} alt="" className="h-full w-full object-cover" />
                ) : (
                  <span className="editable-display text-3xl font-semibold">{initials}</span>
                )}
              </div>
              <h1 className="editable-display mt-6 text-[2rem] font-semibold leading-[1.02] tracking-[-0.02em] sm:text-[2.5rem]">{post.title}</h1>
              {role ? <p className="mt-2 text-[14px] font-medium text-[var(--tk-accent)]">{role}</p> : null}

              <div className="mt-8 space-y-2.5">
                {location ? <IdentityRow icon={MapPin} value={location} /> : null}
                {website ? <IdentityRow icon={Globe} value={website.replace(/^https?:\/\//, '').replace(/\/$/, '')} /> : null}
                {email ? <IdentityRow icon={Mail} value={email} /> : null}
                {phone ? <IdentityRow icon={Phone} value={phone} /> : null}
              </div>

              {tags.length ? (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-white/50">Curates</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span key={tag} className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[11px] font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          </EditableReveal>

          {/* Ivory bio panel */}
          <EditableReveal index={1} className="px-4 pt-14 pb-16 sm:px-0 lg:pt-24">
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Identity · Bio · Contributions</p>
            <h2 className="editable-display mt-6 max-w-3xl text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem] lg:text-[4rem]">
              The person behind these collections.
            </h2>
            {bio ? <p className="mt-8 max-w-2xl text-[17px] leading-[1.7] text-[var(--tk-text)]">{bio}</p> : null}
            <BodyContent post={post} />

            {/* Contact row */}
            <div className="mt-12 flex flex-wrap items-center gap-4">
              {website ? (
                <a href={website} target="_blank" rel="nofollow noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]">
                  Visit site <ExternalLink className="h-4 w-4" />
                </a>
              ) : null}
              {email ? (
                <span className="text-[14px] text-[var(--tk-muted)]">{email}</span>
              ) : null}
              {phone ? (
                <span className="text-[14px] text-[var(--tk-muted)]">{phone}</span>
              ) : null}
            </div>
          </EditableReveal>
        </div>
      </section>

      {/* Big stat rail */}
      <section className="border-b border-[var(--tk-line)] bg-[var(--tk-surface)]">
        <div className="mx-auto grid max-w-[var(--editable-container)] grid-cols-2 gap-px bg-[var(--tk-line)]">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-[var(--tk-surface)] px-6 py-10 text-center">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">{stat.label}</p>
              <p className="editable-display mt-3 truncate text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Their content section — richer than plain empty state */}
      <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
        <EditableReveal>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--tk-accent)]">Their content</p>
              <h2 className="editable-display mt-3 text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem]">
                Collections & resources by {post.title.split(/\s+/)[0]}
              </h2>
            </div>
          </div>
        </EditableReveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <EditableReveal className="rounded-[var(--tk-radius)] border border-dashed border-[var(--tk-line)] bg-[var(--tk-bg)] p-10 sm:p-14">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--tk-accent-soft)] text-[var(--tk-accent)]">
              <Bookmark className="h-5 w-5" />
            </div>
            <p className="editable-display mt-6 text-2xl font-semibold tracking-[-0.02em]">
              Content by this curator will surface here as it&apos;s added to the shelf.
            </p>
            <p className="mt-3 max-w-lg text-[14px] leading-6 text-[var(--tk-muted)]">
              Follow along — every collection they publish will appear in this section, ordered by recency.
            </p>
          </EditableReveal>

          <EditableReveal index={1} className="grid gap-4">
            <div className="rounded-[var(--tk-radius)] border border-[var(--tk-line)] bg-[var(--tk-surface)] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-[var(--tk-muted)]">Signals</p>
              <ul className="mt-4 grid gap-3 text-[13px] leading-6 text-[var(--tk-text)]">
                <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[var(--tk-accent)]" /> {SITE_CONFIG.name} curator</li>
                <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[var(--tk-accent)]" /> Curates verified resources</li>
                <li className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[var(--tk-accent)]" /> Focus: {focus}</li>
              </ul>
            </div>
            <div className="rounded-[var(--tk-radius)] bg-[var(--tk-accent-soft)] p-6">
              <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--tk-accent)]">Want to feature them?</p>
              <p className="mt-3 text-[14px] leading-6 text-[var(--tk-text)]">Reach out about interviews, guest shelves, or partnerships.</p>
              <Link href="/contact" className="mt-4 inline-flex items-center gap-2 text-[13px] font-medium text-[var(--tk-text)] hover:text-[var(--tk-accent)]">
                Contact <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </EditableReveal>
        </div>
      </section>
    </>
  )
}

function IdentityRow({ icon: Icon, value, href }: { icon: typeof Globe; value: string; href?: string }) {
  const inner = (
    <div className="flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white">
        <Icon className="h-4 w-4" />
      </span>
      <p className="truncate text-[13px] font-medium text-white">{value}</p>
    </div>
  )
  return href ? (
    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel={href.startsWith('http') ? 'nofollow noopener noreferrer' : undefined} className="block rounded-lg transition hover:bg-white/5">
      {inner}
    </a>
  ) : (
    <div>{inner}</div>
  )
}

/* -------- Other task detail views (functional) -------- */
function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const images = getImages(post)
  return (
    <>
      <article className="mx-auto max-w-3xl px-4 py-24 sm:px-8">
        <Kicker task="article">{categoryOf(post, 'Article')}</Kicker>
        <h1 className="editable-display mt-6 text-balance text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3.5rem]">{post.title}</h1>
        {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] object-cover" /> : null}
        <div className="mt-8">
          <BodyContent post={post} />
        </div>
        <EditableArticleComments slug={post.slug} comments={comments} />
      </article>
      {related.length ? <RelatedStrip task="article" related={related} /> : null}
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
      <Kicker task="listing">Listing</Kicker>
      <h1 className="editable-display mt-6 text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3.5rem]">{post.title}</h1>
      {images[0] ? <img src={images[0]} alt="" className="mt-10 aspect-[16/9] w-full rounded-[var(--tk-radius)] object-cover" /> : null}
      <div className="mt-8">
        <BodyContent post={post} />
      </div>
      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        {address ? <span>{address}</span> : null}
        {phone ? <a href={`tel:${phone}`}>{phone}</a> : null}
        {email ? <a href={`mailto:${email}`}>{email}</a> : null}
        {website ? <a href={website} target="_blank" rel="nofollow noopener noreferrer">Website</a> : null}
      </div>
      {related.length ? <RelatedStrip task="listing" related={related} /> : null}
    </section>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
      <Kicker task="classified">Notice</Kicker>
      <h1 className="editable-display mt-6 text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3.5rem]">{post.title}</h1>
      <div className="mt-8">
        <BodyContent post={post} />
      </div>
      {related.length ? <RelatedStrip task="classified" related={related} /> : null}
    </section>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  return (
    <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
      <Kicker task="image">Gallery</Kicker>
      <h1 className="editable-display mt-6 text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3.5rem]">{post.title}</h1>
      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {images.map((src, i) => <img key={`${src}-${i}`} src={src} alt="" className="w-full rounded-[var(--tk-radius)] object-cover" />)}
      </div>
      <div className="mt-8">
        <BodyContent post={post} />
      </div>
      {related.length ? <RelatedStrip task="image" related={related} /> : null}
    </section>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <section className="mx-auto max-w-3xl px-4 py-20 sm:px-8">
      <Kicker task="pdf"><FileText className="h-3.5 w-3.5" /> Document</Kicker>
      <h1 className="editable-display mt-6 text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3.5rem]">{post.title}</h1>
      <div className="mt-8">
        <BodyContent post={post} />
      </div>
      {fileUrl ? (
        <a href={fileUrl} target="_blank" rel="nofollow noopener noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[var(--tk-text)] px-5 py-3 text-sm font-medium text-white transition hover:bg-[var(--tk-accent)]">
          Download document
        </a>
      ) : null}
      {related.length ? <RelatedStrip task="pdf" related={related} /> : null}
    </section>
  )
}

function RelatedStrip({ task, related }: { task: TaskKey; related: SitePost[] }) {
  const taskConfig = getTaskConfig(task)
  return (
    <section className="border-t border-[var(--tk-line)] bg-[var(--tk-bg)]">
      <div className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
        <h2 className="editable-display text-[1.75rem] font-semibold tracking-[-0.02em] sm:text-[2rem]">
          More {(taskConfig?.label || 'posts').toLowerCase()}
        </h2>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((item, i) => (
            <EditableReveal key={item.id || item.slug} index={i}>
              <RelatedResourceCard task={task} post={item} />
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// UserRound kept for potential future use in profile cards
void UserRound
