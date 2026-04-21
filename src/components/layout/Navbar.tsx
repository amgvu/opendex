'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Pokédex' },
  { href: '/about', label: 'About' },
  { href: 'https://ko-fi.com/amgdev', label: 'Donate' }
]

export function Navbar({ children }: { children?: ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="fixed inset-x-0 top-0 z-30 bg-background/80 backdrop-blur-sm">
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
