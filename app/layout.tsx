import './globals.css?v=2' // <-- The version number here will force a refresh
import type { ReactNode } from 'react'

export const metadata = {
  title: 'Last Man Standing',
  description: 'The ultimate football survival game',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}