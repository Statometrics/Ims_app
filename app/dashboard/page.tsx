'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

// Lazy-load desktop and mobile dashboards
const DesktopDashboard = dynamic(() => import('./desktop-page'))
const MobileDashboard = dynamic(() => import('./mobile-page'))

export default function DashboardPage() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  if (isMobile === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Loading dashboard...
      </div>
    )
  }

  return isMobile ? <MobileDashboard /> : <DesktopDashboard />
}

