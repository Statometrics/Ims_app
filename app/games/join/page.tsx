'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function JoinGamePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState<any[]>([])
  const [selectedGame, setSelectedGame] = useState<any>(null)

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
      setLoading(false)
    }
    loadUser()
  }, [router])

  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return
      try {
        const { data: openGames, error } = await supabase
          .from('games')
          .select('*, participants(count)')
          .eq('status', 'open')

        if (error) throw error

        const enriched = (openGames || []).map((g: any) => ({
          ...g,
          player_count: g.participants?.[0]?.count || 0,
          pot_size: (
            Number(g.entry_fee_per_player || 0) *
            (g.participants?.[0]?.count || 0)
          ).toFixed(2),
        }))

        setGames(enriched)
      } catch (err) {
        console.error('Error fetching games:', err)
        setGames([])
      }
    }
    if (user) fetchGames()
  }, [user])

  if (loading) {
    return (
      <div
        style={{
          backgroundColor: '#0f0f0f',
          color: '#fff',
          fontFamily: 'Poppins, sans-serif',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        Loading join options...
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
        paddingTop: '6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 🔙 JOIN BY CODE BOX */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '44rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2.5rem',
          marginBottom: '3rem',
          boxShadow: '0 0 30px rgba(22,163,74,0.8)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a',
            marginBottom: '1.75rem',
          }}
        >
          Join by Code
        </h2>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (code.trim()) router.push(`/games/confirm/${code.trim()}`)
          }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter invite code"
            style={{
              width: '70%',
              height: '44px',
              padding: '0 0.75rem',
              borderRadius: '9999px',
              border: '1px solid #064e3b',
              backgroundColor: '#f8fafc',
              color: '#000',
              textAlign: 'center',
              fontSize: '1rem',
            }}
          />
          <button
            type="submit"
            style={{
              width: '70%',
              padding: '0.75rem 0',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'uppercase',
              backgroundColor: '#16a34a',
              color: '#0f0f0f',
              cursor: 'pointer',
            }}
          >
            Join Game
          </button>

          <a
            href="/dashboard"
            style={{
              marginTop: '1rem',
              display: 'inline-block',
              border: '2px solid #ffffff',
              borderRadius: '9999px',
              padding: '0.75rem 1.25rem',
              color: '#ffffff',
              fontWeight: 800,
              textTransform: 'uppercase',
              textDecoration: 'none',
              boxShadow: '0 0 10px rgba(255,255,255,0.4)',
              transition: 'all 0.2s ease',
            }}
          >
            Back to Dashboard
          </a>
        </form>
      </div>

      {/* 📋 AVAILABLE GAMES */}
      <div
        style={{
          width: '95%',
          maxWidth: '90rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 0 30px rgba(22,163,74,0.8)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a',
            marginBottom: '1.5rem',
          }}
        >
          Available Games
        </h2>

        {games.length === 0 ? (
          <p style={{ color: '#aaa' }}>No open games available right now.</p>
        ) : (
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              color: '#fff',
              fontSize: '0.95rem',
              textAlign: 'center',
            }}
          >
            <thead>
              <tr style={{ backgroundColor: '#064e3b' }}>
                <th style={{ padding: '0.75rem' }}>Game Name</th>
                <th style={{ padding: '0.75rem' }}>Start</th>
                <th style={{ padding: '0.75rem' }}>Closing</th>
                <th style={{ padding: '0.75rem' }}>Entry Fee</th>
                <th style={{ padding: '0.75rem' }}>Pot (£)</th>
                <th style={{ padding: '0.75rem' }}>Elimination Style</th>
                <th style={{ padding: '0.75rem' }}>Draws Inc?</th>
                <th style={{ padding: '0.75rem' }}>Competitions</th>
                <th style={{ padding: '0.75rem' }}>Join</th>
              </tr>
            </thead>
            <tbody>
              {games.map((g, i) => (
                <tr
                  key={g.game_id || i}
                  style={{
                    borderBottom: '1px solid #333',
                    backgroundColor: i % 2 === 0 ? '#111' : 'transparent',
                  }}
                >
                  <td style={{ padding: '0.75rem' }}>{g.game_name}</td>
                  <td style={{ padding: '0.75rem' }}>{g.start_date}</td>
                  <td style={{ padding: '0.75rem' }}>{g.closing_entry_date}</td>
                  <td style={{ padding: '0.75rem' }}>£{g.entry_fee_per_player}</td>
                  <td style={{ padding: '0.75rem', color: '#4ade80', fontWeight: 700 }}>
                    £{g.pot_size}
                  </td>
                  <td style={{ padding: '0.75rem' }}>{g.missed_selection_rule}</td>
                  <td style={{ padding: '0.75rem' }}>
                    {g.include_draws ? 'Yes' : 'No'}
                  </td>
                  <td
                    style={{
                      padding: '0.75rem',
                      color: '#4ade80',
                      textDecoration: 'underline',
                      cursor: 'pointer',
                    }}
                    onClick={() => setSelectedGame(g)}
                  >
                    Click to View
                  </td>
                  <td style={{ padding: '0.75rem' }}>
                    <button
                      onClick={() =>
                        router.push(`/games/confirm/${g.game_code}`)
                      }
                      style={{
                        backgroundColor: '#16a34a',
                        color: '#000',
                        border: 'none',
                        borderRadius: '9999px',
                        padding: '0.4rem 0.9rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Join
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* 🪟 MODAL POPUP FOR COMPETITIONS */}
      {selectedGame && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSelectedGame(null)}
        >
          <div
            style={{
              backgroundColor: '#1a1a1a',
              border: '2px solid #16a34a',
              borderRadius: '1rem',
              padding: '2rem',
              width: '90%',
              maxWidth: '30rem',
              boxShadow: '0 0 25px rgba(22,163,74,0.8)',
              textAlign: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              style={{
                color: '#4ade80',
                fontWeight: 800,
                marginBottom: '1rem',
                textTransform: 'uppercase',
              }}
            >
              Competitions
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, marginBottom: '1.5rem' }}>
              {selectedGame.competitions?.map((c: string, i: number) => (
                <li key={i} style={{ color: '#fff', padding: '0.3rem 0' }}>
                  {c}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setSelectedGame(null)}
              style={{
                backgroundColor: '#16a34a',
                color: '#000',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.6rem 1.5rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
