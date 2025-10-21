'use client'

import React, { useState, useEffect } from 'react'

// Temporary mock data — will connect to Supabase next
const mockGames = [
  { id: '1', name: 'Premier League Challenge', startDate: '2025-10-14', entryFee: '£10', prizePot: '£120', players: 12 },
  { id: '2', name: 'Weekend Survival Cup', startDate: '2025-10-11', entryFee: '£5', prizePot: '£90', players: 18 },
  { id: '3', name: 'European Masters', startDate: '2025-10-18', entryFee: '£20', prizePot: '£300', players: 15 },
]

export default function OpenGamesPage() {
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setGames(mockGames)
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        color: '#f8fafc',
        fontFamily: 'Poppins, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '4rem',
        paddingBottom: '6rem',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: '3rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00',
          }}
        >
          <span style={{ color: '#16a34a', textShadow: '0 0 10px #00ff00' }}>⚽</span>
          Open Games
          <span style={{ color: '#16a34a', textShadow: '0 0 10px #00ff00' }}>⚽</span>
        </h1>
        <p style={{ color: '#4ade80', marginTop: '1rem', fontWeight: 600 }}>
          Browse and join public competitions before they start!
        </p>
      </header>

      {/* Game List */}
      <div
        style={{
          width: '90%',
          maxWidth: '48rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
        }}
      >
        {loading ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>Loading games...</p>
        ) : games.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#9ca3af' }}>
            No open games available right now.
          </p>
        ) : (
          games.map((game) => (
            <div
              key={game.id}
              style={{
                backgroundColor: '#1a1a1a',
                border: '2px solid #16a34a',
                borderRadius: '1rem',
                padding: '1.5rem 2rem',
                boxShadow:
                  '0 0 25px rgba(22, 163, 74, 0.7), 0 0 40px rgba(22, 163, 74, 0.5)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'transform 0.2s',
              }}
            >
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                {game.name}
              </h2>
              <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>
                🗓 Starts: <span style={{ color: '#f8fafc' }}>{game.startDate}</span>
              </p>
              <p style={{ color: '#9ca3af', marginBottom: '0.25rem' }}>
                💰 Entry Fee: <span style={{ color: '#f8fafc' }}>{game.entryFee}</span>
              </p>
              <p style={{ color: '#9ca3af', marginBottom: '0.5rem' }}>
                🏆 Prize Pot: <span style={{ color: '#f8fafc' }}>{game.prizePot}</span> — 👥{' '}
                {game.players} Players
              </p>

              <a
                href={`/join?code=${game.id}`}
                style={{
                  marginTop: '0.75rem',
                  padding: '0.75rem 2rem',
                  borderRadius: '9999px',
                  fontWeight: 800,
                  fontSize: '1rem',
                  textTransform: 'uppercase',
                  backgroundColor: '#16a34a',
                  color: '#000000',
                  border: 'none',
                  boxShadow: '0 0 25px rgba(22, 163, 74, 0.8)',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease-in-out',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#4ade80'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#16a34a'
                }}
              >
                Join This Game
              </a>
            </div>
          ))
        )}
      </div>

      {/* Back Button */}
      <div style={{ marginTop: '3rem', textAlign: 'center' }}>
        <a
          href="/dashboard"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 3rem',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'uppercase',
            border: '3px solid #ffffff',
            color: '#ffffff',
            backgroundColor: 'transparent',
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
