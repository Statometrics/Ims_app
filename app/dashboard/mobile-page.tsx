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
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
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
        backgroundColor: '#0f0f0f',
        color: '#f8fafc',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: '2rem 1rem',
      }}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2rem 1rem',
          boxShadow: '0 0 25px rgba(22,163,74,0.7)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontSize: '1.5rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a, 0 0 16px #16a34a',
            marginBottom: '1rem',
          }}
        >
          Dashboard
        </h1>
        <p
          style={{
            color: '#4ade80',
            fontSize: '0.95rem',
            fontWeight: 600,
            marginBottom: '2rem',
          }}
        >
          Welcome back, {user?.email}
        </p>

        {/* Buttons stacked vertically for mobile */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
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
                width: '90%',
                maxWidth: '22rem',
                height: '3.5rem',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'uppercase',
                backgroundColor: 'transparent',
                color: '#ffffff',
                border: '2px solid #ffffff',
                boxShadow: '0 0 15px rgba(255,255,255,0.4)',
                transition: 'all 0.25s ease-in-out',
                textDecoration: 'none',
              }}
              onTouchStart={(e) => {
                e.currentTarget.style.backgroundColor = '#ffffff'
                e.currentTarget.style.color = '#000000'
              }}
              onTouchEnd={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#ffffff'
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
