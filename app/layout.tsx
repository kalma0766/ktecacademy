import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Smartktec Academy | Higher Diploma in Computational Mathematics',
  description: '12-month Higher Diploma in Computational Mathematics — from foundations to advanced AI & ML.',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
