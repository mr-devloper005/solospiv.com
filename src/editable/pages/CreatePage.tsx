'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowUpRight, Bookmark, CheckCircle2, FileText, ImageIcon, Lock, PlusCircle, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'
import { isUiHiddenTask, sbmLabel } from '@/editable/content/global.content'
import { EditableReveal } from '@/editable/shell/EditableReveal'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const taskIcon: Record<string, typeof FileText> = {
  article: FileText,
  listing: Sparkles,
  classified: PlusCircle,
  image: ImageIcon,
  pdf: FileText,
  sbm: Bookmark,
}

const fieldClass =
  'rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-3.5 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-page-text)]'
const areaClass =
  'rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-5 py-4 text-sm text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-page-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  // Hide profile (and any other hidden task) from the picker.
  const enabledTasks = useMemo(
    () => SITE_CONFIG.tasks.filter((task) => task.enabled && !isUiHiddenTask(task.key)),
    []
  )
  const [task, setTask] = useState<TaskKey>((enabledTasks[0]?.key || 'sbm') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const activeTask = enabledTasks.find((item) => item.key === task) || enabledTasks[0]
  const activeLabel = activeTask ? (activeTask.key === 'sbm' ? sbmLabel.itemSingular : activeTask.label.toLowerCase()) : 'resource'

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-warm)]">
          <section className="mx-auto max-w-[var(--editable-container)] px-4 py-24 sm:px-8 lg:px-[4.5rem]">
            <EditableReveal className="grid gap-14 rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-10 sm:p-14 md:grid-cols-[1fr_1.2fr]">
              <div className="flex min-h-[280px] items-center justify-center rounded-[var(--editable-radius-lg)] bg-[var(--slot4-dark-bg)] text-white">
                <Lock className="h-16 w-16 opacity-80" />
              </div>
              <div className="self-center">
                <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
                  {pagesContent.create.locked.badge}
                </p>
                <h1 className="editable-display mt-6 text-balance text-[2.5rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3rem]">
                  {pagesContent.create.locked.title}
                </h1>
                <p className="mt-6 max-w-xl text-[16px] leading-7 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]">
                    Sign in <ArrowUpRight className="h-4 w-4" />
                  </Link>
                  <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border-strong)] px-6 py-3 text-sm font-medium text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-page-text)]">
                    Sign up
                  </Link>
                </div>
              </div>
            </EditableReveal>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-page-bg)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-20 sm:px-8 lg:px-[4.5rem]">
          <EditableReveal>
            <p className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-panel-bg)] px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.24em] text-[var(--slot4-accent)]">
              {pagesContent.create.hero.badge}
            </p>
            <h1 className="editable-display mt-6 max-w-2xl text-balance text-[2.75rem] font-semibold leading-[1.02] tracking-[-0.03em] sm:text-[3.5rem]">
              {pagesContent.create.hero.title}
            </h1>
            <p className="mt-6 max-w-xl text-[16px] leading-7 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>
          </EditableReveal>

          <div className="mt-14 grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <aside className="grid gap-3">
              {enabledTasks.map((item, i) => {
                const Icon = taskIcon[item.key] || FileText
                const active = item.key === task
                const label = item.key === 'sbm' ? sbmLabel.short : item.label
                return (
                  <EditableReveal key={item.key} index={i}>
                    <button
                      type="button"
                      onClick={() => setTask(item.key)}
                      className={`w-full rounded-[var(--editable-radius-lg)] border p-5 text-left transition ${
                        active
                          ? 'border-[var(--slot4-page-text)] bg-[var(--slot4-page-text)] text-white'
                          : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-page-text)]'
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="editable-display mt-4 block text-lg font-semibold tracking-[-0.02em]">{label}</span>
                      <span className={`mt-1 block text-xs leading-6 ${active ? 'text-white/70' : 'text-[var(--slot4-muted-text)]'}`}>
                        {item.description}
                      </span>
                    </button>
                  </EditableReveal>
                )
              })}
            </aside>

            <EditableReveal index={1}>
              <form onSubmit={submit} className="rounded-[var(--editable-radius-lg)] border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-6 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[var(--slot4-muted-text)]">Add a {activeLabel}</p>
                    <h2 className="editable-display mt-2 text-2xl font-semibold tracking-[-0.02em]">{pagesContent.create.formTitle}</h2>
                  </div>
                  <span className="rounded-full bg-[var(--slot4-surface-bg)] px-4 py-2 text-[11px] font-medium text-[var(--slot4-page-text)]">
                    {session.name}
                  </span>
                </div>

                <div className="mt-6 grid gap-4">
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Resource title" required />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="Collection or category" />
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="Destination URL" />
                  </div>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="Preview image URL (optional)" />
                  <textarea className={`${areaClass} min-h-24`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="Short summary — why is this worth the shelf?" required />
                  <textarea className={`${areaClass} min-h-48`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Notes, context, or details for the resource" required />
                </div>

                {created ? (
                  <div className="mt-5 rounded-[var(--editable-radius-md)] border border-[var(--slot4-accent-soft)] bg-[var(--slot4-accent-soft)] p-4 text-[var(--slot4-page-text)]">
                    <p className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle2 className="h-5 w-5 text-[var(--slot4-accent)]" /> {pagesContent.create.successTitle}
                    </p>
                    <p className="mt-1 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                  </div>
                ) : null}

                <button
                  type="submit"
                  className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-page-text)] px-6 py-3.5 text-sm font-medium text-white transition hover:bg-[var(--slot4-accent)]"
                >
                  <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
                </button>
              </form>
            </EditableReveal>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
