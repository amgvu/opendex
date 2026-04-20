'use client'

import { motion, useScroll, useTransform } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { type ReactNode } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const NAV_LINKS = [
  { href: '/', label: 'Pokédex' },
  { href: '/about', label: 'About' }
]

export function Navbar({ children }: { children?: ReactNode }) {
  const { scrollY } = useScroll()
  const titleHeight = useTransform(scrollY, [0, 48], [44, 0])
  const titleOpacity = useTransform(scrollY, [0, 32], [1, 0])
  const pathname = usePathname()

  return (
    <div className="fixed inset-x-0 top-0 z-30 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl 2xl:max-w-screen-2xl px-4 py-3 2xl:px-6 2xl:py-4">
        <motion.div
          className="overflow-hidden"
          style={{ height: titleHeight, opacity: titleOpacity }}
        >
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
                {NAV_LINKS.map(({ href, label }) => (
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
                ))}
              </nav>
            </div>
            <Button asChild size="sm" variant="outline">
              <a
                href="https://ko-fi.com/amgdev"
                rel="noopener noreferrer"
                target="_blank"
              >
                ☕ Support on Ko-fi
              </a>
            </Button>
          </div>
        </motion.div>
        {children}
      </div>
    </div>
  )
}
