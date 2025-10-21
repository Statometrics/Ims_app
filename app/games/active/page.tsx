'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

type GameRow = {
  game_id: string
  game_code: string
  game_name: string
  start_date: string | null
  closing_entry_date: string | null
  entry_fee_per_player: number | null
  status: string | null
}

export default function ActiveGamesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<any[]>([])
  const [message, setMessage] = useState('')

  const getWeekStart = () => {
    const d = new Date()
    const diff = (d.getDay() + 6) % 7 // Monday = 0
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - diff)
    return d.toISOString().slice(0, 10)
  }

  useEffect(() => {
    const loadUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser()
      if (error || !user) {
        router.push('/login')
        return
      }
      setUser(user)
    }
    loadUser()
  }, [router])

  useEffect(() => {
    const fetchActiveGames = async () => {
      if (!user) return
      setLoading(true)
      setMessage('')

      try {
        console.log('🟢 Starting fetchActiveGames for user:', user.id)

        // 1️⃣ Get all games user is in
        const { data: participation, error: partErr } = await supabase
          .from('participants')
          .select('game_id, eliminated')
          .eq('user_id', user.id)

        if (partErr) throw new Error('Participants fetch error: ' + partErr.message)
        console.log('✅ participation:', participation)

        if (!participation?.length) {
          console.warn('⚠️ No participation records found')
          setRows([])
          setLoading(false)
          return
        }

        const gameIds = participation.map((p) => p.game_id).filter(Boolean)
        if (gameIds.length === 0) {
          console.warn('⚠️ No valid game IDs found')
          setRows([])
          setLoading(false)
          return
        }

        // 2️⃣ Fetch games
        const { data: gamesData, error: gamesErr } = await supabase
          .from('games')
          .select('game_id, game_code, game_name, start_date, closing_entry_date, entry_fee_per_player, status')
          .in('game_id', gameIds)

        if (gamesErr) throw new Error('Games fetch error: ' + gamesErr.message)
        console.log('✅ gamesData:', gamesData)

        // 3️⃣ Count entries
        const { data: allParts, error: allPartsErr } = await supabase
          .from('participants')
          .select('game_id, id')
          .in('game_id', gameIds)

        if (allPartsErr) throw new Error('All participants fetch error: ' + allPartsErr.message)
        console.log('✅ allParts:', allParts)

        const entriesByGame: Record<string, number> = {}
        for (const p of allParts || []) {
          entriesByGame[p.game_id] = (entriesByGame[p.game_id] || 0) + 1
        }

        // 4️⃣ Weekly selections
        const weekStart = getWeekStart()
        const { data: selections, error: selErr } = await supabase
          .from('weekly_selections')
          .select('game_id, status')
          .eq('user_id', user.id)
          .eq('week_start', weekStart)
          .in('game_id', gameIds)

        if (selErr) throw new Error('Selections fetch error: ' + selErr.message)
        console.log('✅ selections:', selections)

        const selByGame: Record<string, any> = {}
        for (const s of selections || []) selByGame[s.game_id] = s

        // 5️⃣ Merge
        const merged = (gamesData || []).map((g: GameRow) => {
          const part = participation.find((p) => p.game_id === g.game_id)
          const eliminated = !!part?.eliminated
          const hasSelection = !!selByGame[g.game_id]
          let weekStatus: string
          let actionLabel: string
          let actionSubtext: string | null = null

          if (eliminated) {
            weekStatus = 'Eliminated'
            actionLabel = 'View Game'
            actionSubtext = 'No action required'
          } else if (hasSelection) {
            weekStatus = 'Selection Made'
            actionLabel = 'View Game'
            actionSubtext = 'No action required'
          } else {
            weekStatus = 'Selection Due'
            actionLabel = 'Make Selection'
          }

          const entries = entriesByGame[g.game_id] || 0
          const pot = (g.entry_fee_per_player || 0) * entries

          return {
            ...g,
            eliminated,
            weekStatus,
            actionLabel,
            actionSubtext,
            entries,
            pot,
          }
        })

        console.log('✅ merged result:', merged)
        setRows(merged)
      } catch (err: any) {
        console.error('❌ Error loading active games:', err)
        setMessage('❌ Error loading active games: ' + (err.message || 'unknown error'))
      } finally {
        setLoading(false)
      }
    }

    fetchActiveGames()
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
        Loading your active games...
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
        <h1
          style={{
            color: '#fff',
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            marginBottom: '1.75rem',
            textShadow: '0 0 8px #16a34a, 0 0 16px #16a34a',
          }}
        >
          Active Games
        </h1>

        {rows.length === 0 ? (
          <p style={{ color: '#aaa' }}>You have no active games at the moment.</p>
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
                <th style={{ padding: '0.75rem' }}>Start Date</th>
                <th style={{ padding: '0.75rem' }}>Entry Fee</th>
                <th style={{ padding: '0.75rem' }}>Entries</th>
                <th style={{ padding: '0.75rem' }}>Pot Size</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Week Status</th>
                <th style={{ padding: '0.75rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((g, i) => {
                const color =
                  g.weekStatus === 'Selection Made'
                    ? '#22c55e'
                    : g.weekStatus === 'Eliminated'
                    ? '#9ca3af'
                    : '#ef4444'

                return (
                  <tr
                    key={g.game_id}
                    style={{
                      borderBottom: '1px solid #333',
                      backgroundColor: i % 2 === 0 ? '#111' : 'transparent',
                    }}
                  >
                    <td style={{ padding: '0.75rem' }}>{g.game_name}</td>
                    <td style={{ padding: '0.75rem' }}>{g.start_date}</td>
                    <td style={{ padding: '0.75rem' }}>£{g.entry_fee_per_player ?? 0}</td>
                    <td style={{ padding: '0.75rem' }}>{g.entries}</td>
                    <td style={{ padding: '0.75rem' }}>£{g.pot}</td>
                    <td style={{ padding: '0.75rem' }}>{g.status}</td>
                    <td style={{ padding: '0.75rem', color, fontWeight: 700 }}>{g.weekStatus}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <button
                        onClick={() => router.push(`/games/${g.game_code}`)}
                        style={{
                          backgroundColor: color,
                          color: '#000',
                          border: 'none',
                          borderRadius: '9999px',
                          padding: '0.5rem 1rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                        }}
                      >
                        {g.actionLabel}
                      </button>
                      {g.actionSubtext && (
                        <div style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '4px' }}>
                          {g.actionSubtext}
                        </div>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {message && (
        <p style={{ marginTop: '1.5rem', color: '#ef4444', fontWeight: 600 }}>{message}</p>
      )}
    </div>
  )
}
