'use client'

import React, { useEffect, useState } from 'react'
import DesktopDashboard from './desktop-page'
import MobileDashboard from './mobile-page'

export default function Dashboard() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768)
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return isMobile ? <MobileDashboard /> : <DesktopDashboard />
}
