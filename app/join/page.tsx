'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function JoinGamePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [games, setGames] = useState<any[]>([])
  const [sortBy, setSortBy] = useState<string>('start_date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [selectedGame, setSelectedGame] = useState<any>(null)

  // ✅ Load user session
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

  // ✅ Fetch ALL open games (no filters)
  useEffect(() => {
    const fetchGames = async () => {
      if (!user) return

      try {
        const { data: openGames, error } = await supabase
          .from('games')
          .select('*')
          .eq('status', 'open')

        if (error) throw error

        console.log('✅ Basic fetch:', openGames)
        setGames(openGames || [])
      } catch (err) {
        console.error('Error fetching games:', err)
        setGames([])
      }
    }

    if (user) fetchGames()
  }, [user])

  // ✅ Sorting
  const handleSort = (field: string) => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const compareValues = (a: any, b: any, field: string) => {
    const numericFields = ['entry_fee', 'min_players', 'max_players']
    const A = a?.[field]
    const B = b?.[field]
    if (numericFields.includes(field)) {
      const nA = Number(A ?? 0)
      const nB = Number(B ?? 0)
      return nA === nB ? 0 : nA < nB ? -1 : 1
    }
    const sA = (A ?? '').toString()
    const sB = (B ?? '').toString()
    if (sA === sB) return 0
    return sA < sB ? -1 : 1
  }

  const sortedGames = [...games].sort((a, b) => {
    const base = compareValues(a, b, sortBy)
    return sortOrder === 'asc' ? base : -base
  })

  const arrow = (field: string) =>
    sortBy === field ? (sortOrder === 'asc' ? ' ▲' : ' ▼') : ' ↕'

  // ✅ Join game logic
  const joinGame = async (game: any) => {
    if (!user) {
      setMessage('⚠️ Please log in first.')
      return
    }

    const { error } = await supabase
      .from('participants')
      .insert([{ user_id: user.id, game_id: game.id }])

    if (error) {
      setMessage('⚠️ You are already in this game or cannot join.')
      return
    }

    setMessage(`✅ Joined ${game.name || game.game_name} successfully!`)
    setTimeout(() => router.push(`/game/${game.code}`), 800)
  }

  // ✅ Join by invite code
  const handleJoinByCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')
    if (!code.trim()) {
      setMessage('⚠️ Please enter a valid game code.')
      return
    }

    const { data: game, error } = await supabase
      .from('games')
      .select('*')
      .eq('code', code.trim())
      .single()

    if (error || !game) {
      setMessage('❌ Game not found.')
      return
    }

    await joinGame(game)
  }

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
        paddingTop: '4rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* 🔙 Back to Dashboard */}
      <button
        onClick={() => router.push('/dashboard')}
        style={{
          position: 'fixed',
          top: '1.5rem',
          right: '1.5rem',
          backgroundColor: '#16a34a',
          color: '#000',
          border: 'none',
          borderRadius: '9999px',
          padding: '0.6rem 1.2rem',
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(22,163,74,0.6)',
          zIndex: 1000,
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1
          style={{
            fontSize: '3rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#fff',
            textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ color: '#16a34a' }}>⚽</span> Join a Game{' '}
          <span style={{ color: '#16a34a' }}>⚽</span>
        </h1>
      </header>

      {/* JOIN BY CODE */}
      <div
        style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #16a34a',
          borderRadius: '1.5rem',
          padding: '2rem 3rem',
          width: '90%',
          maxWidth: '40rem',
          boxShadow: '0 0 25px rgba(22,163,74,0.6)',
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#4ade80',
            marginBottom: '1rem',
          }}
        >
          JOIN BY CODE
        </h2>
        <form
          onSubmit={handleJoinByCode}
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
              padding: '1rem',
              borderRadius: '9999px',
              border: '1px solid #064e3b',
              width: '60%',
              fontSize: '1.1rem',
              textAlign: 'center',
              backgroundColor: '#f8fafc',
              color: '#000',
            }}
          />
          <button
            type="submit"
            style={{
              width: '60%',
              padding: '1rem',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              backgroundColor: '#16a34a',
              color: '#000',
              border: 'none',
              boxShadow: '0 0 10px rgba(22,163,74,0.6)',
            }}
          >
            Join Game
          </button>
        </form>
      </div>

      {/* FIND A GAME TABLE */}
      <div
        style={{
          backgroundColor: '#1a1a1a',
          border: '2px solid #16a34a',
          borderRadius: '1.5rem',
          padding: '2rem',
          width: '95%',
          maxWidth: '80rem',
          boxShadow: '0 0 25px rgba(22,163,74,0.6)',
          textAlign: 'center',
        }}
      >
        <h2
          style={{
            fontSize: '1.75rem',
            fontWeight: 800,
            color: '#4ade80',
            marginBottom: '1rem',
          }}
        >
          AVAILABLE GAMES
        </h2>

        {sortedGames.length === 0 ? (
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
                <th onClick={() => handleSort('name')} style={{ cursor: 'pointer', padding: '0.75rem' }}>
                  Game Name{arrow('name')}
                </th>
                <th onClick={() => handleSort('start_date')} style={{ cursor: 'pointer', padding: '0.75rem' }}>
                  Start Date{arrow('start_date')}
                </th>
                <th onClick={() => handleSort('closing_date')} style={{ cursor: 'pointer', padding: '0.75rem' }}>
                  Closing Date{arrow('closing_date')}
                </th>
                <th onClick={() => handleSort('entry_fee')} style={{ cursor: 'pointer', padding: '0.75rem' }}>
                  Entry Fee{arrow('entry_fee')}
                </th>
                <th onClick={() => handleSort('min_players')} style={{ cursor: 'pointer', padding: '0.75rem' }}>
                  Players (Min/Max){arrow('min_players')}
                </th>
                <th style={{ padding: '0.75rem' }}>Competitions</th>
                <th style={{ padding: '0.75rem' }}>Join</th>
              </tr>
            </thead>
            <tbody>
              {sortedGames.map((g, i) => (
                <tr key={g.id || i} style={{ borderBottom: '1px solid #333', backgroundColor: i % 2 === 0 ? '#111' : 'transparent' }}>
                  <td style={{ padding: '0.75rem' }}>{g.name || g.game_name || 'Unnamed Game'}</td>
                  <td style={{ padding: '0.75rem' }}>{g.start_date}</td>
                  <td style={{ padding: '0.75rem' }}>{g.closing_date}</td>
                  <td style={{ padding: '0.75rem' }}>£{g.entry_fee}</td>
                  <td style={{ padding: '0.75rem' }}>{g.min_players} / {g.max_players}</td>
                  <td style={{ padding: '0.75rem', color: '#4ade80', textDecoration: 'underline', cursor: 'pointer' }} onClick={() => setSelectedGame(g)}>Click to View</td>
                  <td style={{ padding: '0.75rem' }}>
                    <button onClick={() => joinGame(g)} style={{ backgroundColor: '#16a34a', color: '#000', border: 'none', borderRadius: '9999px', padding: '0.4rem 0.9rem', fontWeight: 700, cursor: 'pointer' }}>Join Game</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {message && (
        <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: '0.5rem', fontWeight: 700, fontSize: '1rem', color: message.startsWith('✅') ? '#22c55e' : '#ef4444', border: `2px solid ${message.startsWith('✅') ? '#22c55e' : '#ef4444'}` }}>{message}</div>
      )}

      {selectedGame && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}>
          <div style={{ backgroundColor: '#1a1a1a', padding: '2rem', borderRadius: '1rem', width: '90%', maxWidth: '28rem', textAlign: 'center', boxShadow: '0 0 20px rgba(22,163,74,0.8)' }}>
            <h3 style={{ fontSize: '1.5rem', color: '#4ade80', marginBottom: '1rem' }}>Competitions for {selectedGame.name || selectedGame.game_name}</h3>
            {selectedGame.competition ? (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {selectedGame.competition.split(',').map((c: string, idx: number) => (
                  <li key={idx} style={{ padding: '0.4rem', borderBottom: '1px solid #333' }}>{c.trim()}</li>
                ))}
              </ul>
            ) : (
              <p style={{ color: '#aaa' }}>No competitions listed.</p>
            )}
            <button onClick={() => setSelectedGame(null)} style={{ marginTop: '1.5rem', backgroundColor: '#16a34a', color: '#000', border: 'none', borderRadius: '9999px', padding: '0.6rem 1.2rem', fontWeight: 700, cursor: 'pointer' }}>Close</button>
          </div>
        </div>
      )}
    </div>
  )
}
