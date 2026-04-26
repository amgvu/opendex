import { type ClassValue, clsx } from 'clsx'
import type { SyntheticEvent } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clearBlurOnLoad(e: SyntheticEvent<HTMLImageElement>) {
  if (e.currentTarget.parentElement)
    e.currentTarget.parentElement.style.backgroundImage = 'none'
}
