'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

function useScrollState() {
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    function onScroll() {
      const y = window.scrollY
      if (y > lastY.current && y > 80) setHidden(true)
      else if (y < lastY.current) setHidden(false)
      setScrolled(y > 20)
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { hidden, scrolled }
}

const NAV_LINKS = [
  { href: '/', label: 'Pokédex' },
  { href: '/about', label: 'About' },
  { href: 'https://ko-fi.com/amgdev', label: 'Donate' }
]

export function Navbar({ children }: { children?: ReactNode }) {
  const pathname = usePathname()
  const { hidden, scrolled } = useScrollState()

  return (
    <div
      className={`fixed inset-x-0 top-0 z-30 backdrop-blur-sm transition duration-300 border-b ${scrolled ? 'bg-background border-white/[0.08]' : 'bg-background/80 border-transparent'} ${hidden ? '-translate-y-full xl:translate-y-0' : ''}`}
    >
      <div className="mx-auto max-w-7xl 2xl:max-w-screen-2xl px-4 py-3 2xl:px-6 2xl:py-4">
        <div className="mb-3 2xl:mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Image
                alt="Opendex"
                className="h-6 w-auto"
                height={128}
                src="/opendexball.svg"
                unoptimized
                width={128}
              />
            </Link>
            <nav className="flex items-center gap-3 text-sm">
              {NAV_LINKS.map(({ href, label }) => {
                const external = href.startsWith('http')
                return external ? (
                  <a
                    className="text-muted-foreground transition-colors hover:text-foreground"
                    href={href}
                    key={href}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    {label}
                  </a>
                ) : (
                  <Link
                    className={cn(
                      'transition-colors hover:text-foreground',
                      pathname === href
                        ? 'font-medium text-foreground'
                        : 'text-muted-foreground'
                    )}
                    href={href}
                    key={href}
                  >
                    {label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}
