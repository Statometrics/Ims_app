'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUserData = async () => {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push('/login')
        return
      }
      setUser(user)

      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      setProfile(userProfile)
      setLoading(false)
    }

    loadUserData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#0f0f0f',
          color: '#ffffff',
          fontFamily: 'Poppins, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading your profile...
      </div>
    )
  }

  const buttonStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.85rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: 800,
    fontSize: '0.95rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    width: '12.5rem',
    height: '3.25rem',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '3px solid #ffffff',
    boxShadow: '0 0 20px rgba(255,255,255,0.5)',
    cursor: 'pointer',
    transition: 'all 0.25s ease-in-out',
  }

  const handleHover = (e: React.MouseEvent<HTMLButtonElement>, hover: boolean) => {
    e.currentTarget.style.backgroundColor = hover ? '#ffffff' : 'transparent'
    e.currentTarget.style.color = hover ? '#000000' : '#ffffff'
    e.currentTarget.style.transform = hover ? 'scale(1.05)' : 'scale(1)'
  }

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
        justifyContent: 'flex-start', // ✅ match login height alignment
        paddingTop: '6rem',           // ✅ start box at same top height
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingBottom: '2rem',
      }}
    >
      {/* Glowing Profile Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '50rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow:
            '0 0 30px rgba(22,163,74,0.8), 0 0 50px rgba(22,163,74,0.5)',
          textAlign: 'center',
        }}
      >
        {/* Inner Thin White Border */}
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

        {/* Header */}
        <h1
          style={{
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a, 0 0 16px #16a34a',
            marginBottom: '1.75rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Profile
        </h1>

        {/* Profile Info */}
        <div
          style={{
            textAlign: 'center',
            color: '#f8fafc',
            lineHeight: '1.8',
            marginBottom: '3rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <p><strong>First Name:</strong> {profile?.first_name || 'N/A'}</p>
          <p><strong>Surname:</strong> {profile?.surname || 'N/A'}</p>
          <p><strong>Username:</strong> {profile?.username || 'N/A'}</p>
          <p><strong>Email:</strong> {user?.email}</p>
          <p><strong>Date of Birth:</strong> {profile?.dob || 'N/A'}</p>
        </div>

        {/* Buttons Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            onClick={() => router.push('/dashboard')}
            style={buttonStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Back to Dashboard
          </button>

          <button
            onClick={() => router.push('/profile/edit')}
            style={buttonStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Edit Account
          </button>

          <button
            onClick={handleLogout}
            style={buttonStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}
