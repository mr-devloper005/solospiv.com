'use client'

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react'

type Props = {
  children: ReactNode
  index?: number
  className?: string
  as?: 'div' | 'section' | 'article' | 'header' | 'footer' | 'li' | 'span'
  once?: boolean
  delayMs?: number
  id?: string
}

/*
  IntersectionObserver-based scroll reveal.

  Hidden state is applied only after mount so pages stay
  fully rendered on the server / with JS off (no invisible content).
  index adds a stagger of ~80ms per position.
*/
export function EditableReveal({
  children,
  index = 0,
  className = '',
  as = 'div',
  once = true,
  delayMs,
  id,
}: Props) {
  const ref = useRef<HTMLElement | null>(null)
  const [mounted, setMounted] = useState(false)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    setMounted(true)
    const node = ref.current
    if (!node) return
    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            if (once) observer.disconnect()
          } else if (!once) {
            setRevealed(false)
          }
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [once])

  const Tag = as as ElementType
  const stagger = delayMs ?? Math.min(index * 80, 480)

  return (
    <Tag
      ref={ref}
      id={id}
      className={`${mounted ? 'editable-reveal' : ''} ${className}`}
      data-revealed={revealed ? 'true' : 'false'}
      style={mounted ? { animationDelay: `${stagger}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}

export default EditableReveal
