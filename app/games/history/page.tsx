'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function HistoricalGamesPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [games, setGames] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadHistoricalGames = async () => {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        router.push('/login')
        return
      }
      setUser(user)

      // 1️⃣ Games they created and already finished
      const { data: createdGames, error: createdErr } = await supabase
        .from('games')
        .select('*')
        .eq('created_by', user.id)
        .lt('start_date', new Date().toISOString())

      // 2️⃣ Games they joined that are finished
      const { data: joinedEntries, error: joinedErr } = await supabase
        .from('entries')
        .select('games(*)')
        .eq('user_id', user.id)

      if (createdErr || joinedErr) {
        console.error(createdErr || joinedErr)
        setLoading(false)
        return
      }

      const joinedGames = joinedEntries
        ?.map((e: any) => e.games)
        ?.filter((g: any) => new Date(g.start_date) < new Date()) || []

      // Combine and remove duplicates
      const allGames = [...(createdGames || []), ...joinedGames]
      const uniqueGames = Array.from(new Map(allGames.map(g => [g.id, g])).values())

      setGames(uniqueGames)
      setLoading(false)
    }

    loadHistoricalGames()
  }, [router])

  if (loading) {
    return (
      <div style={{
        backgroundColor: '#0f0f0f',
        color: '#ffffff',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading historical games...
      </div>
    )
  }

  return (
    <div style={{
      backgroundColor: '#0f0f0f',
      color: '#f8fafc',
      fontFamily: 'Poppins, sans-serif',
      minHeight: '100vh',
      paddingTop: '4rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Header */}
      <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          textTransform: 'uppercase',
          textShadow: '0 0 5px #00ff00, 0 0 10px #00ff00, 0 0 15px #00ff00',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem'
        }}>
          <span style={{ color: '#16a34a', textShadow: '0 0 10px #00ff00' }}>⚽</span>
          Historical Games
          <span style={{ color: '#16a34a', textShadow: '0 0 10px #00ff00' }}>⚽</span>
        </h1>
      </header>

      {/* Game Cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5rem',
        width: '90%',
        maxWidth: '40rem'
      }}>
        {games.length > 0 ? (
          games.map((g) => (
            <div key={g.id} style={{
              border: '2px solid #16a34a',
              borderRadius: '1rem',
              padding: '1.5rem',
              backgroundColor: '#1a1a1a',
              boxShadow: '0 0 20px rgba(22,163,74,0.6)'
            }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>{g.name}</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Started: {new Date(g.start_date).toLocaleDateString()}
              </p>
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }}>
                Status: 🏁 Completed
              </p>

              <div style={{
                marginTop: '1rem',
                display: 'flex',
                justifyContent: 'center',
                gap: '1rem'
              }}>
                {/* View Results */}
                <a
                  href={`/game/${g.code}`}
                  style={{
                    padding: '0.75rem 1.5rem',
                    borderRadius: '9999px',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    textTransform: 'uppercase',
                    color: '#ffffff',
                    border: '3px solid #ffffff',
                    boxShadow: '0 0 20px rgba(255,255,255,0.4)',
                    transition: 'all 0.2s ease-in-out'
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
                  View Results
                </a>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: '#9ca3af', fontSize: '1rem', textAlign: 'center' }}>
            You don’t have any completed games yet.
          </p>
        )}
      </div>
    </div>
  )
}
