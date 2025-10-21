'use client'

import React, { useState } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function BuyLicense() {
  const router = useRouter()
  const [tier, setTier] = useState<'Bronze' | 'Silver' | 'Gold'>('Bronze')
  const [price, setPrice] = useState(99)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleTierChange = (selected: 'Bronze' | 'Silver' | 'Gold') => {
    setTier(selected)
    if (selected === 'Bronze') setPrice(99)
    if (selected === 'Silver') setPrice(179)
    if (selected === 'Gold') setPrice(249)
  }

  const handlePurchase = async () => {
    setStatus('loading')
    setMessage('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return router.push('/login')

    const { error } = await supabase
      .from('users')
      .update({
        is_licensed: true,
        license_tier: tier,
        license_paid: true,
      })
      .eq('id', user.id)

    if (error) {
      setStatus('error')
      setMessage('❌ Purchase failed. Please try again.')
    } else {
      setStatus('success')
      setMessage(`✅ Licence purchased successfully! You’re now on the ${tier} plan.`)
      setTimeout(() => router.push('/dashboard'), 2500)
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
        justifyContent: 'flex-start',
        paddingTop: '3rem',
      }}
    >
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1
          style={{
            fontSize: '2.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#ffffff',
            textShadow:
              '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px rgba(0,255,0,0.8)',
          }}
        >
          Buy a Licence
        </h1>
        <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>
          Unlock full control and keep 100% of your winnings.
        </p>
      </header>

      {/* Licence Tiers */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { tier: 'Bronze', price: 99, limit: 'up to 50 players / game' },
          { tier: 'Silver', price: 179, limit: 'up to 150 players / game' },
          { tier: 'Gold', price: 249, limit: 'unlimited players' },
        ].map(({ tier: t, price: p, limit }) => (
          <div
            key={t}
            onClick={() => handleTierChange(t as any)}
            style={{
              backgroundColor: tier === t ? '#1a1a1a' : '#111',
              border: tier === t ? '2px solid #16a34a' : '1px solid #4ade80',
              borderRadius: '1rem',
              padding: '1.5rem',
              width: '15rem',
              cursor: 'pointer',
              textAlign: 'center',
              boxShadow:
                '0 0 20px rgba(22,163,74,0.5), 0 0 30px rgba(22,163,74,0.3)',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <h2
              style={{
                fontSize: '1.5rem',
                fontWeight: 800,
                color: '#4ade80',
                marginBottom: '0.5rem',
              }}
            >
              {t}
            </h2>
            <p
              style={{
                fontSize: '2rem',
                fontWeight: 800,
                color: '#ffffff',
                marginBottom: '0.25rem',
              }}
            >
              £{p}
            </p>
            <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>{limit}</p>
          </div>
        ))}
      </div>

      {/* Purchase Button */}
      <button
        onClick={handlePurchase}
        disabled={status === 'loading'}
        style={{
          padding: '1rem 2rem',
          borderRadius: '9999px',
          fontWeight: 800,
          fontSize: '1rem',
          textTransform: 'uppercase',
          backgroundColor: '#16a34a',
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          transition: 'all 0.3s',
          marginBottom: '1.5rem',
        }}
      >
        {status === 'loading' ? 'Processing...' : `Buy ${tier} (£${price})`}
      </button>

      {/* Message */}
      {message && (
        <p
          style={{
            marginTop: '1rem',
            color: status === 'success' ? '#4ade80' : '#f87171',
            fontWeight: 600,
            textAlign: 'center',
          }}
        >
          {message}
        </p>
      )}

      {/* Back to Dashboard */}
      <div style={{ marginTop: '3rem' }}>
        <a
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 2rem',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'uppercase',
            backgroundColor: 'transparent',
            color: '#ffffff',
            border: '3px solid #ffffff',
            boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            transition: 'all 0.3s ease-in-out',
            textDecoration: 'none',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#ffffff'
            e.currentTarget.style.color = '#000000'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = '#ffffff'
          }}
        >
          ← Back to Dashboard
        </a>
      </div>
    </div>
  )
}
