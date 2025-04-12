'use client'

import { SessionProvider } from 'next-auth/react'
import { FONT_FAMILY } from '@/config'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={FONT_FAMILY.className}>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
