'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
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
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0f0f0f',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
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
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        backgroundColor: '#0f0f0f',
        color: '#f8fafc',
        fontFamily: 'Poppins, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '4vh 5vw',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '900px',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2rem 1.5rem',
          boxShadow: '0 0 30px rgba(22,163,74,0.8), 0 0 50px rgba(22,163,74,0.5)',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            border: '1px solid #ffffff',
            borderRadius: '0.85rem',
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />

        <h1
          style={{
            color: '#ffffff',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a, 0 0 16px #16a34a',
            marginBottom: '1rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Dashboard
        </h1>

        <p
          style={{
            color: '#4ade80',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: 600,
            marginBottom: '2.5rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Welcome back, {user?.email}
        </p>

        {/* BUTTONS */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem',
            width: '100%',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {buttons.map((btn) => (
            <a
              key={btn.label}
              href={btn.link}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.85rem 1rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '0.9rem',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                minWidth: '140px',
                height: '3.25rem',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '2px solid #ffffff',
                boxShadow: '0 0 15px rgba(255,255,255,0.4)',
                transition: 'all 0.25s ease-in-out',
                textDecoration: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.color = '#000000'
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#ffffff'
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
