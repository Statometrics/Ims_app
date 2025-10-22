'use client'

import { useEffect, useState } from 'react'
import DesktopDashboard from './desktop-page'
import MobileDashboard from './mobile-page'

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return isMobile ? <MobileDashboard /> : <DesktopDashboard />
}
