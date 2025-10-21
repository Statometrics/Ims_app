'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useParams, useRouter } from 'next/navigation'

export default function ConfirmGamePage() {
  const router = useRouter()
  const { game_code } = useParams()
  const [game, setGame] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState('')

  // ✅ Fetch specific game by code
  useEffect(() => {
    const fetchGame = async () => {
      try {
        const { data, error } = await supabase
          .from('games')
          .select('*')
          .eq('game_code', game_code)
          .single()

        if (error || !data) throw new Error('Game not found.')
        setGame(data)
      } catch (err: any) {
        console.error(err)
        setMessage('❌ Could not load game details.')
      } finally {
        setLoading(false)
      }
    }

    if (game_code) fetchGame()
  }, [game_code])

  const handleConfirm = async () => {
    setMessage('Joining game...')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Please log in.')

      const { error } = await supabase
        .from('participants')
        .insert([{ user_id: user.id, game_id: game.game_id }])

      if (error) throw error
      setMessage('✅ Successfully joined! Redirecting...')
      setTimeout(() => router.push('/games/active'), 1200)
    } catch (err: any) {
      console.error(err)
      setMessage(`❌ ${err.message}`)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#0f0f0f',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'Poppins, sans-serif',
        }}
      >
        Loading game details...
      </div>
    )
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
        paddingTop: '6rem',
        padding: '2rem',
      }}
    >
      {/* OUTER BOX */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '44rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b', // ✅ fixed quote bug
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 0 30px rgba(22,163,74,0.8), 0 0 50px rgba(22,163,74,0.5)',
          textAlign: 'center',
        }}
      >
        {/* Inner border */}
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

        {/* HEADER */}
        <h2
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
          Confirm Joining Game
        </h2>

        {game ? (
          <>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              <strong>Game Name:</strong> {game.game_name}
            </p>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              <strong>Start Date:</strong> {game.start_date}
            </p>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              <strong>Closing Entry Date:</strong> {game.closing_entry_date}
            </p>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              <strong>Entry Fee:</strong>{' '}
              {game.entry_fee_per_player
                ? `£${game.entry_fee_per_player}`
                : 'Free Entry'}
            </p>
            <p style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>
              <strong>Players (Min/Max):</strong>{' '}
              {game.min_players} / {game.max_players}
            </p>
            <p style={{ marginBottom: '2rem', fontSize: '1.1rem' }}>
              <strong>Created By:</strong>{' '}
              {game.created_by_username || 'Unknown'}
            </p>

            {/* PAYMENT METHOD BOX */}
            <div
              style={{
                backgroundColor: '#111',
                border: '1px solid #064e3b',
                borderRadius: '1rem',
                padding: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              <h3
                style={{
                  color: '#4ade80',
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                }}
              >
                Payment Method
              </h3>
              <p style={{ color: '#ccc' }}>
                (This is a placeholder for Stripe or internal wallet
                integration.)
              </p>
            </div>

            <button
              onClick={handleConfirm}
              style={{
                width: '70%',
                padding: '0.85rem 0',
                borderRadius: '9999px',
                fontWeight: 800,
                fontSize: '1rem',
                textTransform: 'uppercase',
                backgroundColor: '#16a34a',
                color: '#0f0f0f',
                cursor: 'pointer',
                boxShadow: '0 0 10px rgba(22,163,74,0.6)',
              }}
            >
              Confirm and Play
            </button>
          </>
        ) : (
          <p>Game details unavailable.</p>
        )}

        {message && (
          <div
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              fontWeight: 700,
              fontSize: '1rem',
              color: message.startsWith('✅') ? '#22c55e' : '#ef4444',
              border: `2px solid ${
                message.startsWith('✅') ? '#22c55e' : '#ef4444'
              }`,
            }}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  )
}
