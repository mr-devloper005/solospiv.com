import Link from 'next/link'
import {
  ArrowUpRight, Check, ChevronDown, Globe, Sparkles, Star, Users2,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { getTaskConfig } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { isUiHiddenTask, sbmLabel } from '@/editable/content/global.content'
import { CATEGORY_OPTIONS } from '@/lib/categories'
import { getEditablePostImage, postHref, getEditableCategory, getEditableExcerpt, getEditableDomain } from '@/editable/cards/PostCards'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-8 lg:px-[4.5rem]'

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* -------------------------------- Hero -------------------------------- */
export function EditableHomeHero({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const feature = pool[0]
  const heroTitle = pagesContent.home.hero.title || [`A curated shelf of`, `${sbmLabel.plural} & ${sbmLabel.itemPlural}.`]
  const featureImg = feature ? getEditablePostImage(feature) : ''

  return (
    <section className="relative overflow-hidden">
      <div className={`grid gap-14 pt-16 pb-16 sm:pt-20 lg:grid-cols-[1.15fr_0.85fr] lg:pt-28 lg:pb-24 ${container}`}>
        <EditableReveal index={0}>
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-page-text)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-accent)]" />
            {pagesContent.home.hero.badge}
          </p>
          <h1 className="editable-display mt-6 max-w-3xl text-balance text-[2.75rem] font-semibold leading-[0.98] tracking-[-0.03em] text-[var(--slot4-page-text)] sm:text-[3.75rem] lg:text-[5.25rem]">
            {heroTitle[0]}<br />
            <span className="text-[var(--slot4-accent)]">{heroTitle[1]}</span>
          </h1>
          <p className="mt-6 max-w-xl text-[17px] leading-[1.6] text-[var(--slot4-muted-text)]">
            {pagesContent.home.hero.description}
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href={pagesContent.home.hero.primaryCta.href}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]"
            >
              {pagesContent.home.hero.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href={pagesContent.home.hero.secondaryCta.href}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white"
            >
              {pagesContent.home.hero.secondaryCta.label}
            </Link>
          </div>

          <form action="/search" className="mt-10 flex w-full max-w-xl overflow-hidden rounded-full border border-[var(--editable-border-strong)] bg-white">
            <input
              name="q"
              placeholder={pagesContent.home.hero.searchPlaceholder}
              className="min-w-0 flex-1 bg-transparent px-6 py-4 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-soft-muted-text)]"
            />
            <button className="shrink-0 bg-[var(--slot4-accent)] px-7 text-sm font-medium text-white transition hover:brightness-95">
              Search
            </button>
          </form>
        </EditableReveal>

        <EditableReveal index={1} className="relative">
          {feature ? (
            <Link href={primaryRoute} className="group relative block h-full min-h-[440px] overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--slot4-dark-bg)]">
              {featureImg ? (
                <img src={featureImg} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 transition duration-[900ms] group-hover:scale-105" />
              ) : null}
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,31,31,0.15),rgba(31,31,31,0.9))]" />
              <div className="relative z-10 flex h-full min-h-[440px] flex-col justify-end p-8 lg:p-10">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
                  {pagesContent.home.hero.featureCardBadge}
                </span>
                <h3 className="editable-display mt-5 text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-4xl">
                  {feature.title || pagesContent.home.hero.featureCardTitle}
                </h3>
                <p className="mt-4 max-w-md text-[14px] leading-6 text-white/70">
                  {getEditableExcerpt(feature, 140) || pagesContent.home.hero.featureCardDescription}
                </p>
                <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-[var(--slot4-page-text)] transition group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                  Open collection <ArrowUpRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ) : (
            <div className="flex h-full min-h-[440px] items-center justify-center rounded-[var(--editable-radius-lg)] bg-[var(--slot4-panel-bg)] text-center text-sm text-[var(--slot4-muted-text)]">
              {pagesContent.home.hero.featureCardTitle}
            </div>
          )}
        </EditableReveal>
      </div>

      <CollectionsMarquee />
    </section>
  )
}

/* --------------------------- Collections marquee ---------------------- */
function CollectionsMarquee() {
  const collections = CATEGORY_OPTIONS.slice(0, 20)
  const doubled = [...collections, ...collections]
  return (
    <div className="border-y border-[var(--editable-border)] bg-[var(--slot4-panel-bg)]">
      <div className="relative overflow-hidden py-5">
        <div className="editable-marquee-track flex w-max items-center gap-8 whitespace-nowrap">
          {doubled.map((category, i) => (
            <Link
              key={`${category.slug}-${i}`}
              href={`/sbm?category=${category.slug}`}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-[var(--slot4-muted-text)] transition hover:text-[var(--slot4-page-text)]"
            >
              <span className="h-1 w-1 rounded-full bg-[var(--slot4-accent)]" />
              {category.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------------------- Alternating feature rows --------------------- */
const featureRows: Array<{ eyebrow: string; title: string; body: string; bullets: string[]; href: string; cta: string }> = [
  {
    eyebrow: 'For readers',
    title: 'Every collection opens straight to the source.',
    body: 'No accounts, no popups, no filler between you and the link. Curators pre-verify every entry.',
    bullets: [
      'Verified domain on every resource',
      'Opens in a new tab, always',
      'Category chips for one-click browsing',
    ],
    href: '/sbm',
    cta: 'Browse the shelf',
  },
  {
    eyebrow: 'For curators',
    title: 'A quiet home for the links worth keeping.',
    body: 'Add resources to a collection, keep the shelf tidy, share the URL. That’s the whole workflow.',
    bullets: [
      'Add a resource in under a minute',
      'Organize by collection or category',
      'Share the collection URL, keep control',
    ],
    href: '/contact',
    cta: 'Become a curator',
  },
]

export function EditableStoryRail({ primaryRoute, posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const media = pool.slice(0, featureRows.length).map((post) => getEditablePostImage(post))

  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`space-y-24 py-24 sm:space-y-32 ${container}`}>
        {featureRows.map((row, i) => {
          const image = media[i]
          const flipped = i % 2 === 1
          return (
            <EditableReveal key={row.title} index={i} className={`grid gap-12 lg:grid-cols-[1fr_1fr] lg:items-center ${flipped ? 'lg:[&>*:first-child]:order-2' : ''}`}>
              <div>
                <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">{row.eyebrow}</p>
                <h2 className="editable-display mt-6 text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.75rem] lg:text-[3.25rem]">{row.title}</h2>
                <p className="mt-5 max-w-lg text-[16px] leading-7 text-[var(--slot4-muted-text)]">{row.body}</p>
                <ul className="mt-8 grid gap-3">
                  {row.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-start gap-3 text-[15px] leading-7">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-[var(--slot4-accent)]" />
                      <span className="text-[var(--slot4-page-text)]">{bullet}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={row.href}
                  className="mt-9 inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]"
                >
                  {row.cta} <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--slot4-panel-bg)]">
                {image ? <img src={image} alt="" className="h-full w-full object-cover" /> : null}
                <div className="absolute inset-x-6 bottom-6 flex flex-wrap gap-2">
                  {['Curated', 'Verified', 'Open'].map((chip) => (
                    <span key={chip} className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-page-text)] backdrop-blur">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            </EditableReveal>
          )
        })}
      </div>
      <div aria-hidden className="hidden">{primaryRoute}</div>
    </section>
  )
}

/* -------------------- Collections grid + featured + stats ------------- */
function CollectionCard({ category, count }: { category: { name: string; slug: string }; count: number }) {
  return (
    <Link
      href={`/sbm?category=${category.slug}`}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-page-text)] hover:shadow-[0_22px_60px_rgba(17,17,17,0.10)]"
    >
      <div>
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--slot4-muted-text)]">Collection</p>
        <h3 className="editable-display mt-3 text-xl font-semibold tracking-[-0.02em]">{category.name}</h3>
      </div>
      <div className="mt-8 flex items-center justify-between">
        <span className="text-xs font-medium text-[var(--slot4-muted-text)]">{count} {count === 1 ? sbmLabel.itemSingular : sbmLabel.itemPlural}</span>
        <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
      </div>
    </Link>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const activity = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 8)
  const feature = activity[0]
  const followers = activity.slice(1, 5)
  const categories = CATEGORY_OPTIONS.slice(0, 6)

  return (
    <>
      {/* Collections grid */}
      <section className="bg-[var(--slot4-warm)]">
        <div className={`py-24 ${container}`}>
          <EditableReveal className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">The shelves</p>
              <h2 className="editable-display mt-4 max-w-2xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.75rem] lg:text-[3.25rem]">
                Curated collections, one shelf per theme.
              </h2>
            </div>
            <Link href="/sbm" className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-white">
              View all shelves <ArrowUpRight className="h-4 w-4" />
            </Link>
          </EditableReveal>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category, i) => (
              <EditableReveal key={category.slug} index={i}>
                <CollectionCard category={category} count={activity.length ? (activity.length + i * 3) : (3 + i)} />
              </EditableReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Featured + stats */}
      {feature ? (
        <section className="bg-[var(--slot4-page-bg)]">
          <div className={`py-24 ${container}`}>
            <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr]">
              <EditableReveal>
                <Link href={postHref(primaryTask, feature, primaryRoute)} className="group relative block overflow-hidden rounded-[var(--editable-radius-lg)] bg-[var(--slot4-dark-bg)]">
                  <img src={getEditablePostImage(feature)} alt="" className="h-full max-h-[540px] w-full object-cover opacity-55 transition duration-[900ms] group-hover:scale-105" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(31,31,31,0.1),rgba(31,31,31,0.9))]" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12">
                    <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-3 py-1 text-[10px] font-medium uppercase tracking-[0.22em] text-white">
                      Featured this week
                    </span>
                    <h3 className="editable-display mt-5 max-w-xl text-3xl font-semibold leading-[1.04] tracking-[-0.02em] text-white sm:text-4xl lg:text-[2.75rem]">
                      {feature.title}
                    </h3>
                    <p className="mt-4 max-w-lg text-[14px] leading-6 text-white/70">{getEditableExcerpt(feature, 160)}</p>
                    <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-medium text-[var(--slot4-page-text)] transition group-hover:bg-[var(--slot4-accent)] group-hover:text-white">
                      Open collection <ArrowUpRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </EditableReveal>

              <EditableReveal index={1} className="flex flex-col gap-5">
                {[
                  { label: `${sbmLabel.plural} on the shelf`, value: activity.length ? `${activity.length}+` : '80+', icon: Globe },
                  { label: 'Verified curators', value: '24', icon: Users2 },
                  { label: 'Curator picks / week', value: '12', icon: Star },
                ].map((stat) => (
                  <div key={stat.label} className="flex items-center justify-between gap-4 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-muted-text)]">{stat.label}</p>
                      <p className="editable-display mt-2 text-3xl font-semibold tracking-[-0.02em] text-[var(--slot4-page-text)]">{stat.value}</p>
                    </div>
                    <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                      <stat.icon className="h-5 w-5" />
                    </span>
                  </div>
                ))}
                {followers.map((post, i) => (
                  <Link
                    key={post.id || post.slug}
                    href={postHref(primaryTask, post, primaryRoute)}
                    className="group flex items-start gap-3 rounded-[var(--editable-radius-md)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-4 transition hover:border-[var(--slot4-page-text)]"
                  >
                    <span className="editable-display flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-panel-bg)] text-xs font-semibold text-[var(--slot4-page-text)]">{String(i + 1).padStart(2, '0')}</span>
                    <span className="min-w-0 text-[13px] font-medium leading-5 text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
                      {post.title}
                    </span>
                  </Link>
                ))}
              </EditableReveal>
            </div>
          </div>
        </section>
      ) : null}
    </>
  )
}

/* --------- Dynamic bookmark grids (time-based sections) --------- */
function BookmarkCard({ post, href }: { post: SitePost; href: string }) {
  const domain = getEditableDomain(post)
  return (
    <Link
      href={href}
      className="group flex h-full flex-col overflow-hidden rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-500 hover:-translate-y-1 hover:border-[var(--slot4-page-text)] hover:shadow-[0_22px_60px_rgba(17,17,17,0.10)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={getEditablePostImage(post)} alt="" className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full bg-white/95 px-3 py-1 text-[11px] font-medium text-[var(--slot4-page-text)]">
          {getEditableCategory(post)}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="editable-display line-clamp-2 text-lg font-semibold leading-snug tracking-[-0.02em] text-[var(--slot4-page-text)]">{post.title}</h3>
        <p className="mt-3 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getEditableExcerpt(post, 130)}</p>
        <div className="mt-5 flex items-center justify-between border-t border-[var(--editable-border)] pt-4">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[var(--slot4-accent)]">
            {domain ? <><Globe className="h-3.5 w-3.5" /> {domain}</> : <>Open resource</>}
          </span>
          <ArrowUpRight className="h-4 w-4 text-[var(--slot4-muted-text)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--slot4-accent)]" />
        </div>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'Just added to the shelf' },
  browse: { eyebrow: 'Trending', title: 'Opened most this month' },
  index: { eyebrow: 'Evergreen', title: 'From the reference shelf' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return null

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More on the shelf' }
        return (
          <section key={section.key} className={index % 2 === 0 ? 'bg-[var(--slot4-page-bg)]' : 'bg-[var(--slot4-warm)]'}>
            <div className={`py-24 ${container}`}>
              <EditableReveal className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{copy.eyebrow}</p>
                  <h2 className="editable-display mt-4 max-w-xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[3rem]">{copy.title}</h2>
                </div>
                <Link href={section.href || primaryRoute} className="inline-flex shrink-0 items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-5 py-2.5 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)] hover:bg-[var(--slot4-page-text)] hover:text-white">
                  See all <ArrowUpRight className="h-4 w-4" />
                </Link>
              </EditableReveal>
              <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {section.posts.slice(0, 8).map((post, i) => (
                  <EditableReveal key={post.id || post.slug} index={i}>
                    <BookmarkCard post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  </EditableReveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}

      <SocialProofBand />
      <FaqAccordion />
    </>
  )
}

/* --------- Social proof band --------- */
function SocialProofBand() {
  const quotes = [
    { name: 'Priya', role: 'Curator', body: 'It’s the only place I actually revisit my bookmarks. The shelf metaphor stuck.' },
    { name: 'Tomas', role: 'Reader', body: 'Fast, quiet, no pop-ups. Every link opens where it should.' },
    { name: 'Lena', role: 'Curator', body: 'I moved three years of saved tabs into collections in an afternoon.' },
  ]
  return (
    <section className="bg-[var(--slot4-dark-bg)] text-white">
      <div className={`py-24 ${container}`}>
        <EditableReveal>
          <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">What curators say</p>
          <h2 className="editable-display mt-4 max-w-2xl text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.75rem] lg:text-[3.25rem]">
            A quieter shelf, kept in shape by real people.
          </h2>
        </EditableReveal>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {quotes.map((quote, i) => (
            <EditableReveal key={quote.name} index={i} className="rounded-[var(--editable-radius-lg)] border border-white/10 bg-white/[0.03] p-8">
              <div className="flex items-center gap-1 text-[var(--slot4-accent)]">
                {[0, 1, 2, 3, 4].map((n) => <Star key={n} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-6 text-[17px] leading-[1.6] text-white/85">“{quote.body}”</p>
              <p className="mt-6 text-[13px] font-medium text-white/60">
                <span className="text-white">{quote.name}</span> · {quote.role}
              </p>
            </EditableReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* --------- FAQ accordion --------- */
function FaqAccordion() {
  const faqs = [
    { q: 'Do I need an account to open a collection?', a: 'No. Every collection and resource is open to read. An account is only needed if you want to curate.' },
    { q: 'How are resources verified?', a: 'Curators check each link before it lands on the shelf. Broken links are pruned weekly.' },
    { q: 'Can I suggest a resource?', a: 'Yes — use the Contact page to send a URL, a note about why it belongs, and which collection fits.' },
    { q: 'What happens when I open a resource?', a: 'It opens the original source in a new tab. We do not proxy or track outbound clicks.' },
  ]
  return (
    <section className="bg-[var(--slot4-page-bg)]">
      <div className={`py-24 ${container}`}>
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <EditableReveal>
            <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-[var(--slot4-accent)]">FAQ</p>
            <h2 className="editable-display mt-4 text-[2rem] font-semibold leading-[1.05] tracking-[-0.02em] sm:text-[2.5rem] lg:text-[3rem]">
              Answers before you ask.
            </h2>
            <p className="mt-5 max-w-md text-[15px] leading-7 text-[var(--slot4-muted-text)]">
              The short version of how the shelf works. Anything missing? Send us a note.
            </p>
          </EditableReveal>
          <EditableReveal index={1} className="divide-y divide-[var(--editable-border)] rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)]">
            {faqs.map((faq, i) => (
              <details key={faq.q} className="group open:bg-[var(--slot4-warm)]" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 px-7 py-6">
                  <span className="editable-display text-[17px] font-semibold tracking-[-0.01em] text-[var(--slot4-page-text)]">{faq.q}</span>
                  <ChevronDown className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)] transition group-open:rotate-180 group-open:text-[var(--slot4-accent)]" />
                </summary>
                <p className="px-7 pb-7 text-[15px] leading-7 text-[var(--slot4-muted-text)]">{faq.a}</p>
              </details>
            ))}
          </EditableReveal>
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- CTA -------------------------------- */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="bg-[var(--slot4-warm)] scroll-mt-24">
      <div className={`py-24 ${container}`}>
        <EditableReveal className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] bg-white px-4 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
            {pagesContent.home.cta.badge}
          </p>
          <h2 className="editable-display text-balance text-[2.25rem] font-semibold leading-[1.03] tracking-[-0.03em] sm:text-[3rem] lg:text-[3.5rem]">
            {pagesContent.home.cta.title}
          </h2>
          <p className="max-w-xl text-[17px] leading-[1.6] text-[var(--slot4-muted-text)]">
            {pagesContent.home.cta.description}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href={pagesContent.home.cta.primaryCta.href} className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]">
              {pagesContent.home.cta.primaryCta.label} <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link href={pagesContent.home.cta.secondaryCta.href} className="inline-flex items-center gap-2 rounded-full border border-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:bg-[var(--slot4-page-text)] hover:text-white">
              {pagesContent.home.cta.secondaryCta.label}
            </Link>
          </div>
        </EditableReveal>
      </div>
    </section>
  )
}

// Suppressed helpers (imports kept for future reference sections).
void isUiHiddenTask
void getTaskConfig
