'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function MobileDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return router.push('/login')
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [router])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.25rem',
        fontFamily: 'Poppins, sans-serif',
      }}>
        Loading dashboard...
      </div>
    )
  }

  const buttons = [
    { label: 'START A GAME', link: '/games/new' },
    { label: 'PREMIUM GAME', link: '/games/premium' },
    { label: 'JOIN A GAME', link: '/games/join' },
    { label: 'ACTIVE GAMES', link: '/games/active' },
    { label: 'HISTORICAL GAMES', link: '/games/history' },
    { label: 'PROFILE', link: '/profile' },
  ]

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      color: '#ffffff',
      fontFamily: 'Poppins, sans-serif',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '2rem 1rem',
    }}>
      <h1 style={{
        color: '#16a34a',
        fontSize: '1.6rem',
        fontWeight: 800,
        marginBottom: '1rem',
        textTransform: 'uppercase',
        textAlign: 'center',
        textShadow: '0 0 8px #16a34a, 0 0 16px #16a34a',
      }}>
        Dashboard
      </h1>

      <p style={{
        color: '#4ade80',
        fontSize: '1rem',
        marginBottom: '2rem',
        textAlign: 'center',
      }}>
        Welcome back, {user?.email}
      </p>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        width: '100%',
        maxWidth: '420px',
      }}>
        {buttons.map((btn) => (
          <a
            key={btn.label}
            href={btn.link}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              border: '2px solid #ffffff',
              color: '#ffffff',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              fontSize: '1rem',
              boxShadow: '0 0 12px rgba(255,255,255,0.4)',
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          >
            {btn.label}
          </a>
        ))}
      </div>
    </div>
  )
}
