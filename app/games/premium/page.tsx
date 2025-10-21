'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function PremiumGamesPage() {
  const [entries, setEntries] = useState(0)
  const [pot, setPot] = useState(1000000)
  const [timeLeft, setTimeLeft] = useState('')

  // Simulate countdown until event starts
  useEffect(() => {
    const eventStart = new Date('2026-06-01T12:00:00')
    const timer = setInterval(() => {
      const now = new Date().getTime()
      const diff = eventStart.getTime() - now
      if (diff <= 0) {
        setTimeLeft('Event is live!')
        clearInterval(timer)
      } else {
        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((diff / (1000 * 60)) % 60)
        setTimeLeft(`${days}d ${hours}h ${minutes}m`)
      }
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Example fetch for live entries (optional)
  useEffect(() => {
    const fetchEntries = async () => {
      const { data, error } = await supabase
        .from('participants')
        .select('id', { count: 'exact' })
        .eq('game_id', 'WORLD_CUP_2026')
      if (!error && data) setEntries(data.length)
    }
    fetchEntries()
  }, [])

  return (
    <div
      style={{
        backgroundColor: '#0f0f0f',
        color: '#f8fafc',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        paddingTop: '5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 🔥 HERO SECTION */}
      <div
        style={{
          width: '100%',
          maxWidth: '80rem',
          textAlign: 'center',
          padding: '3rem 1rem',
          borderBottom: '2px solid #16a34a',
        }}
      >
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#ffffff',
            textShadow: '0 0 20px #16a34a, 0 0 40px #16a34a',
            marginBottom: '1rem',
          }}
        >
          The Million Pound Game
        </h1>
        <p style={{ color: '#9ca3af', fontSize: '1.2rem', maxWidth: '40rem', margin: '0 auto' }}>
          Once every 4 years. One survivor takes it all.  
          <span style={{ color: '#22c55e', fontWeight: 600 }}>Win up to £1,000,000.</span>
        </p>
        <div style={{ marginTop: '2rem', fontSize: '1.5rem', color: '#4ade80', fontWeight: 700 }}>
          {timeLeft ? `⏳ Starts in: ${timeLeft}` : 'Loading countdown...'}
        </div>
      </div>

      {/* 🧮 STATS BOX */}
      <div
        style={{
          width: '95%',
          maxWidth: '60rem',
          marginTop: '3rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
          boxShadow: '0 0 30px rgba(22,163,74,0.6)',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#4ade80', textTransform: 'uppercase' }}>
          Event Overview
        </h2>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            marginTop: '1.5rem',
            color: '#fff',
            fontSize: '1.1rem',
          }}
        >
          <div>
            <strong style={{ color: '#4ade80' }}>Entry Fee</strong>
            <p>£1,000</p>
          </div>
          <div>
            <strong style={{ color: '#4ade80' }}>Target Prize Pot</strong>
            <p>£1,000,000</p>
          </div>
          <div>
            <strong style={{ color: '#4ade80' }}>Entrants</strong>
            <p>{entries || '0'} / 1,000</p>
          </div>
        </div>

        <button
          style={{
            marginTop: '2rem',
            backgroundColor: '#16a34a',
            border: 'none',
            borderRadius: '9999px',
            padding: '1rem 2.5rem',
            fontSize: '1.2rem',
            fontWeight: 800,
            color: '#0f0f0f',
            cursor: 'pointer',
            textTransform: 'uppercase',
            boxShadow: '0 0 20px rgba(22,163,74,0.7)',
          }}
          onClick={() => alert('Join logic goes here!')}
        >
          Join the Million Pound Game
        </button>
      </div>

      {/* 💸 PRIZE + RULES SECTION */}
      <div
        style={{
          width: '95%',
          maxWidth: '60rem',
          backgroundColor: '#141414',
          border: '1px solid #064e3b',
          borderRadius: '1rem',
          padding: '2rem',
          marginTop: '3rem',
          color: '#fff',
          textAlign: 'left',
          lineHeight: 1.7,
        }}
      >
        <h2 style={{ color: '#4ade80', fontSize: '1.5rem', fontWeight: 800, textTransform: 'uppercase' }}>
          Prize Breakdown
        </h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>🏆 Winner: 90% of total pot (up to £900,000)</li>
          <li>🎖️ Statometrics Platform Fee: 10%</li>
          <li>💰 Prize paid within 7 days of final match</li>
        </ul>

        <h2
          style={{
            color: '#4ade80',
            fontSize: '1.5rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginTop: '2rem',
          }}
        >
          Key Rules
        </h2>
        <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
          <li>Each entrant picks one team per matchday.</li>
          <li>You cannot pick the same team twice.</li>
          <li>Miss a selection? You’re eliminated.</li>
          <li>Event runs from World Cup 2026 opening game to final.</li>
          <li>Includes group and knockout stages.</li>
          <li>All decisions verified by Statometrics moderators.</li>
        </ul>

        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <a
            href="/terms"
            style={{
              color: '#4ade80',
              textDecoration: 'underline',
              fontWeight: 600,
            }}
          >
            View Full Terms & Conditions
          </a>
        </div>
      </div>

      {/* 🏁 FOOTER */}
      <p
        style={{
          marginTop: '3rem',
          color: '#666',
          fontSize: '0.9rem',
          textAlign: 'center',
        }}
      >
        © 2025 Statometrics — The Million Pound Game is a registered competition event.
      </p>
    </div>
  )
}
