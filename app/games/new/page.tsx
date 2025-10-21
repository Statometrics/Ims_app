'use client'

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function CreateGamePage() {
  const [form, setForm] = useState({
    game_name: '',
    start_date: '',
    closing_entry_date: '',
    entry_fee_per_player: '',
    min_players: '',
    max_players: '',
    competitions: [] as string[],
    management_type: 'LMS',
    missed_selection_rule: 'Eliminate Player',
    include_draws: false,
    is_public: true,
  })
  const [availableMondays, setAvailableMondays] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [inviteCode, setInviteCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // ✅ Generate next 10 Mondays, skipping current Monday if it's already past closing
  useEffect(() => {
    const mondays: string[] = []
    const today = new Date()
    const start = new Date(today)
    const day = start.getDay()
    const diff = (1 + 7 - day) % 7
    start.setDate(start.getDate() + diff)
    start.setHours(6, 0, 0, 0)

    for (let i = 0; i < 10; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i * 7)
      mondays.push(d.toISOString().split('T')[0])
    }

    const validMondays = mondays.filter((m) => {
      const start = new Date(m)
      const closing = new Date(start)
      closing.setDate(start.getDate() - 1)
      return closing >= today
    })

    setAvailableMondays(validMondays)
    setForm((prev) => ({ ...prev, start_date: validMondays[0] }))
  }, [])

  // ✅ Auto-update closing date (1 day before start)
  useEffect(() => {
    if (form.start_date) {
      const start = new Date(form.start_date)
      const closing = new Date(start)
      closing.setDate(start.getDate() - 1)
      setForm((prev) => ({
        ...prev,
        closing_entry_date: closing.toISOString().split('T')[0],
      }))
    }
  }, [form.start_date])

  // ✅ FIXED Checkbox typing issue
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement
    const { name, value, type, checked } = target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const toggleCompetition = (competition: string) => {
    setForm((prev) => {
      const competitions = prev.competitions.includes(competition)
        ? prev.competitions.filter((c) => c !== competition)
        : [...prev.competitions, competition]
      return { ...prev, competitions }
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setInviteCode(null)

    try {
      if (Number(form.entry_fee_per_player) < 5)
        throw new Error('Entry fee must be at least £5.')
      if (Number(form.min_players) < 2)
        throw new Error('Minimum players must be 2 or more.')
      if (form.competitions.length === 0)
        throw new Error('Please select at least one competition.')

      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not logged in.')

      const generatedCode = Math.random().toString(36).substring(2, 10)

      const payload = {
        created_by: user.id,
        game_name: form.game_name,
        start_date: form.start_date,
        closing_entry_date: form.closing_entry_date,
        entry_fee_per_player: Number(form.entry_fee_per_player),
        min_players: Number(form.min_players),
        max_players: Number(form.max_players),
        competitions: form.competitions,
        management_type: 'LMS',
        missed_selection_rule: form.missed_selection_rule,
        include_draws: form.include_draws,
        game_code: generatedCode,
        status: 'open',
        is_public: form.is_public,
      }

      const { data, error } = await supabase.from('games').insert([payload]).select('*')
      if (error) throw error
      if (!data || !data.length) throw new Error('Game inserted but no data returned')

      setInviteCode(generatedCode)
      setMessage('✅ Game Created!')
    } catch (err: any) {
      console.error('Error creating game:', err)
      setMessage(`❌ ${err?.message ?? JSON.stringify(err) ?? 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const competitionsList = [
    'England Premier League 2025-26',
    'England Championship 2025-26',
    'France Ligue 1 2025-26',
    'Germany Bundesliga 2025-26',
    'Italy Serie A 2025-26',
    'Spain La Liga 2025-26',
  ]

  const inputStyle = {
    width: '95%',
    height: '44px',
    padding: '0 0.75rem',
    borderRadius: '9999px',
    border: '1px solid #064e3b',
    backgroundColor: '#f8fafc',
    color: '#000',
    boxSizing: 'border-box',
  } as React.CSSProperties

  const buttonStyle = {
    width: '95%',
    padding: '0.75rem 0',
    borderRadius: '9999px',
    fontWeight: 800,
    fontSize: '1rem',
    textTransform: 'uppercase',
    backgroundColor: '#16a34a',
    color: '#0f0f0f',
    cursor: 'pointer',
    marginTop: '1.5rem',
    boxSizing: 'border-box',
  } as React.CSSProperties

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
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '44rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2.5rem',
          boxShadow: '0 0 30px rgba(22,163,74,0.8)',
        }}
      >
        <h1
          style={{
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a',
            marginBottom: '1rem',
            textAlign: 'center',
          }}
        >
          Start a Game
        </h1>

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', zIndex: 2 }}
        >
          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Game Name</label>
            <input type="text" name="game_name" value={form.game_name} onChange={handleChange} required style={inputStyle} />
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Start Date</label>
            <select name="start_date" value={form.start_date} onChange={handleChange} required style={inputStyle}>
              {availableMondays.map((d) => (
                <option key={d} value={d}>
                  {new Date(d).toLocaleDateString('en-GB', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Closing Entry Date</label>
            <input type="date" name="closing_entry_date" value={form.closing_entry_date} readOnly style={{ ...inputStyle, opacity: 0.8 }} />
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Entry Fee (£)</label>
            <input type="number" name="entry_fee_per_player" value={form.entry_fee_per_player} onChange={handleChange} required min="0" style={inputStyle} />
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Min Players</label>
            <input type="number" name="min_players" value={form.min_players} onChange={handleChange} required min="2" style={inputStyle} />
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Max Players</label>
            <input type="number" name="max_players" value={form.max_players} onChange={handleChange} required min={form.min_players || 2} style={inputStyle} />
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Missed Selection / Elimination Style</label>
            <select name="missed_selection_rule" value={form.missed_selection_rule} onChange={handleChange} required style={inputStyle}>
              <option value="Eliminate Player">Eliminate Player</option>
              <option value="Next Team Alphabetically">Next Team Alphabetically</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input type="checkbox" name="include_draws" checked={form.include_draws} onChange={handleChange} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            <label style={{ color: '#4ade80', fontWeight: 700 }}>
              Include Draws
              <span style={{ color: '#9ca3af', fontWeight: 400, marginLeft: '0.5rem' }}>
                (Players can select Draws anytime — no rollovers)
              </span>
            </label>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Creating...' : 'Create Game'}
          </button>

          <button
            onClick={() => (window.location.href = '/dashboard')}
            type="button"
            style={{
              ...buttonStyle,
              backgroundColor: 'transparent',
              border: '2px solid #fff',
              color: '#fff',
              boxShadow: '0 0 10px rgba(255,255,255,0.4)',
            }}
          >
            Back to Dashboard
          </button>
        </form>

        {message && (
          <div style={{ marginTop: '2rem', color: message.includes('✅') ? '#16a34a' : '#ff3b30', fontWeight: 700, textAlign: 'center' }}>
            {message.includes('✅') && inviteCode ? (
              <div style={{ marginTop: '1rem', backgroundColor: '#ffffff10', border: '1px solid #ffffff', borderRadius: '0.5rem', padding: '1rem' }}>
                <p style={{ color: '#fff', fontWeight: 700 }}>✅ Game Created Successfully</p>
                <p>
                  <span style={{ color: '#fff' }}>Game Code:</span>{' '}
                  <span
                    style={{
                      display: 'inline-block',
                      border: '1px solid #fff',
                      padding: '0.4rem 1rem',
                      borderRadius: '9999px',
                      backgroundColor: '#0f0f0f',
                      color: '#fff',
                      fontWeight: 600,
                    }}
                  >
                    {inviteCode}
                  </span>
                </p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(inviteCode)
                    setMessage('✅ Game code copied!')
                    setTimeout(() => setMessage('✅ Game Created!'), 1500)
                  }}
                  style={{
                    backgroundColor: 'transparent',
                    border: '2px solid #ffffff',
                    borderRadius: '9999px',
                    padding: '0.5rem 1.25rem',
                    color: '#ffffff',
                    fontWeight: 700,
                    cursor: 'pointer',
                    marginTop: '1rem',
                  }}
                >
                  Copy Game Code
                </button>
              </div>
            ) : (
              message
            )}
          </div>
        )}
      </div>
    </div>
  )
}
