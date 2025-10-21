'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session) router.push('/dashboard')
    }
    checkSession()
  }, [router])

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus('loading')
    setMessage('')

    const form = event.currentTarget
    const formData = new FormData(form)
    const email = formData.get('email') as string
    const password = formData.get('password') as string

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      if (!data.session) throw new Error('No session returned from Supabase.')

      setMessage('✅ Login successful! Redirecting...')
      setTimeout(() => router.push('/dashboard'), 800)
    } catch (err: any) {
      console.error('Login error:', err.message)
      setStatus('error')
      setMessage(`❌ ${err.message}`)
    } finally {
      setStatus('idle')
    }
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
        justifyContent: 'flex-start', // ✅ start at same height
        paddingTop: '6rem',           // ✅ match Create Account height
        paddingLeft: '2rem',
        paddingRight: '2rem',
        paddingBottom: '2rem',        // ✅ fixed shorthand conflict
      }}
    >
      {/* Outer Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 0 30px rgba(22,163,74,0.8), 0 0 50px rgba(22,163,74,0.5)',
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

        {/* Header Inside Box */}
        <h2
          style={{
            textAlign: 'center',
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a, 0 0 16px #16a34a', // ✅ same glow as Create Account
            position: 'relative',
            zIndex: 2,
          }}
        >
          Login
        </h2>

        {/* Form */}
        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {[{ id: 'email', label: 'Email Address', type: 'email' },
            { id: 'password', label: 'Password', type: 'password' }].map((field) => (
            <div key={field.id}>
              <label
                htmlFor={field.id}
                style={{
                  display: 'block',
                  textAlign: 'left',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: '#4ade80',
                }}
              >
                {field.label}
              </label>
              <input
                id={field.id}
                name={field.id}
                type={field.type}
                required
                style={{
                  marginTop: '0.25rem',
                  display: 'block',
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #064e3b',
                  borderRadius: '9999px',
                  color: '#0f0f0f',
                  backgroundColor: '#f8fafc',
                  boxSizing: 'border-box',
                }}
              />
            </div>
          ))}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={status === 'loading'}
            style={{
              width: '100%',
              padding: '0.75rem 0',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'uppercase',
              backgroundColor: '#16a34a',
              color: '#0f0f0f',
              marginTop: '0.5rem',
              cursor: 'pointer',
            }}
          >
            {status === 'loading' ? 'Logging In...' : 'Login'}
          </button>
        </form>

        {/* Status Message */}
        {message && (
          <div
            style={{
              marginTop: '1rem',
              padding: '0.75rem',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: status === 'error' ? '#ff3b30' : '#16a34a',
              border: '1px solid',
              borderColor: status === 'error' ? '#ff3b30' : '#16a34a',
              position: 'relative',
              zIndex: 2,
            }}
          >
            {message}
          </div>
        )}

        {/* Sign-up Link */}
        <div
          style={{
            marginTop: '1.5rem',
            fontSize: '0.875rem',
            color: '#4ade80',
            position: 'relative',
            zIndex: 2,
          }}
        >
          Don’t have an account?{' '}
          <a href="/create-account" style={{ textDecoration: 'underline', color: '#16a34a' }}>
            Create one here
          </a>
        </div>
      </div>
    </div>
  )
}
