'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function EditProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) return router.push('/login')
      setUser(user)

      const { data } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single()

      setProfile(data)
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    setMessage('')

    try {
      const { data: existing } = await supabase
        .from('users')
        .select('auth_user_id')
        .eq('username', profile.username)
        .neq('auth_user_id', user.id)

      if (existing && existing.length > 0) {
        throw new Error('Username already taken.')
      }

      const { error: usernameError } = await supabase
        .from('users')
        .update({ username: profile.username })
        .eq('auth_user_id', user.id)
      if (usernameError) throw usernameError

      if (profile.email && profile.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profile.email,
        })
        if (emailError) throw emailError
        setMessage('✅ Username updated. Check your email to confirm new address.')
      } else {
        setMessage('✅ Username updated successfully.')
      }

      setTimeout(() => router.push('/profile'), 1500)
    } catch (err: any) {
      console.error(err)
      setMessage(`❌ ${err.message}`)
    } finally {
      setSaving(false)
    }
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
        Loading profile...
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
        justifyContent: 'flex-start', // ✅ aligned with Login/Profile
        paddingTop: '6rem',
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingBottom: '2rem',
      }}
    >
      {/* Glowing Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '40rem', // ✅ wider for better spacing
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
          Edit Profile
        </h1>

        {/* Edit Form */}
        <form
          onSubmit={handleSave}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            zIndex: 2,
            maxWidth: '28rem',
            margin: '0 auto',
          }}
        >
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              style={{
                display: 'block',
                color: '#4ade80',
                fontWeight: 700,
                marginBottom: '0.25rem',
              }}
            >
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={profile?.username || ''}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                height: '44px',
                padding: '0 0.75rem',
                borderRadius: '9999px',
                border: '1px solid #064e3b',
                backgroundColor: '#f8fafc',
                color: '#000',
              }}
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              style={{
                display: 'block',
                color: '#4ade80',
                fontWeight: 700,
                marginBottom: '0.25rem',
              }}
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={profile?.email || user?.email || ''}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                height: '44px',
                padding: '0 0.75rem',
                borderRadius: '9999px',
                border: '1px solid #064e3b',
                backgroundColor: '#f8fafc',
                color: '#000',
              }}
            />
          </div>

          {message && (
            <p
              style={{
                textAlign: 'center',
                color: message.includes('❌') ? '#ff3b30' : '#16a34a',
                marginTop: '0.5rem',
                fontWeight: 600,
              }}
            >
              {message}
            </p>
          )}
        </form>

        {/* Buttons Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '1.5rem',
            marginTop: '2.5rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          <button
            type="button"
            onClick={handleSave}
            style={buttonStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          <button
            type="button"
            onClick={() => router.push('/profile')}
            style={buttonStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => router.push('/dashboard')}
            style={buttonStyle}
            onMouseEnter={(e) => handleHover(e, true)}
            onMouseLeave={(e) => handleHover(e, false)}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
