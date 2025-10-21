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
    is_public: true,
    missed_selection_rule: 'Eliminate',
    include_draws: false,
  })

  const [availableMondays, setAvailableMondays] = useState<string[]>([])
  const [message, setMessage] = useState('')
  const [createdGameDetails, setCreatedGameDetails] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const mondays: string[] = []
    const now = new Date()
    const start = new Date(now)
    const day = start.getDay()
    const diffToMonday = (1 + 7 - day) % 7

    start.setDate(start.getDate() + diffToMonday)
    start.setHours(6, 0, 0, 0)

    if (day === 1 && now.getHours() >= 6) {
      start.setDate(start.getDate() + 7)
    }

    for (let i = 0; i < 10; i++) {
      const d = new Date(start)
      d.setDate(start.getDate() + i * 7)
      mondays.push(d.toISOString().split('T')[0])
    }

    setAvailableMondays(mondays)
    setForm((prev) => ({ ...prev, start_date: mondays[0] }))
  }, [])

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type, checked } = e.target
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
    setCreatedGameDetails(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not logged in.')

      if (Number(form.entry_fee_per_player) < 5)
        throw new Error('Entry fee must be at least £5.')
      if (Number(form.min_players) < 2)
        throw new Error('Minimum players must be 2 or more.')
      if (form.competitions.length === 0)
        throw new Error('Please select at least one competition.')

      const generatedCode = Math.random().toString(36).substring(2, 10)

      const payload = {
        created_by: user.id,
        game_name: form.game_name.trim(),
        start_date: form.start_date,
        closing_entry_date: form.closing_entry_date,
        entry_fee_per_player: Number(form.entry_fee_per_player),
        min_players: Number(form.min_players),
        max_players: form.max_players === '' ? null : Number(form.max_players),
        competitions: form.competitions,
        management_type: 'LMS',
        game_code: generatedCode,
        status: 'open',
        is_public: form.is_public,
        missed_selection_rule: form.missed_selection_rule,
        include_draws: form.include_draws,
      }

      const { error } = await supabase.from('games').insert([payload])
      if (error) throw error

      setCreatedGameDetails({
        ...payload,
        game_code: generatedCode,
      })
      setMessage('✅ Game Created!')
    } catch (err: any) {
      console.error('Error creating game:', err)
      setMessage(`❌ ${err?.message || 'Unexpected error occurred'}`)
    } finally {
      setLoading(false)
    }
  }

  const competitionsList = [
    'England Premier League 2025–26',
    'England Championship 2025–26',
    'France Ligue 1 2025–26',
    'Germany Bundesliga 2025–26',
    'Italy Serie A 2025–26',
    'Spain La Liga 2025–26',
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
  } as React.CSSProperties

  return (
    <div
      style={{
        backgroundColor: '#0f0f0f',
        color: '#f8fafc',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        paddingTop: '4rem',
      }}
    >
      <div
        style={{
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
            color: '#fff',
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a',
            textAlign: 'center',
          }}
        >
          Start a Game
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#9ca3af',
            marginBottom: '1.5rem',
            fontSize: '0.95rem',
          }}
        >
          LMS automatically charges a 10% commission from winnings.
        </p>

        <form
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
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
            <input type="number" name="entry_fee_per_player" value={form.entry_fee_per_player} onChange={handleChange} required min="5" style={inputStyle} />
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
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Missed Selection Rule</label>
            <select name="missed_selection_rule" value={form.missed_selection_rule} onChange={handleChange} style={inputStyle}>
              <option value="Eliminate">Eliminate Player</option>
              <option value="Next Team Alphabetically">Next Team Alphabetically</option>
            </select>
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Include Draws?</label>
            <select
              name="include_draws"
              value={form.include_draws ? 'true' : 'false'}
              onChange={(e) => setForm({ ...form, include_draws: e.target.value === 'true' })}
              style={inputStyle}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
            <small style={{ color: '#9ca3af' }}>
              Including draws means players can select a draw at any time and all games play to conclusion (no rollovers).
            </small>
          </div>

          <div>
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Competitions</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
              {competitionsList.map((comp) => (
                <button
                  key={comp}
                  type="button"
                  onClick={() => toggleCompetition(comp)}
                  style={{
                    padding: '0.75rem',
                    borderRadius: '9999px',
                    border: form.competitions.includes(comp) ? '2px solid #16a34a' : '1px solid #064e3b',
                    backgroundColor: form.competitions.includes(comp) ? '#16a34a' : '#f8fafc',
                    color: '#000',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {comp}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              name="is_public"
              checked={form.is_public}
              onChange={handleChange}
              style={{ width: '18px', height: '18px', cursor: 'pointer' }}
            />
            <label style={{ color: '#4ade80', fontWeight: 700 }}>Make Game Public</label>
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Creating...' : 'Create Game'}
          </button>

          <a
            href="/dashboard"
            style={{
              ...buttonStyle,
              backgroundColor: 'transparent',
              border: '2px solid #ffffff',
              color: '#ffffff',
              textAlign: 'center',
              marginTop: '1rem',
            }}
          >
            Back to Dashboard
          </a>
        </form>

        {/* ✅ BET SLIP STYLE SUCCESS */}
        {message.includes('✅') && createdGameDetails && (
          <div
            style={{
              marginTop: '2rem',
              backgroundColor: '#111',
              border: '2px solid #16a34a',
              borderRadius: '1rem',
              padding: '1.5rem',
              boxShadow: '0 0 15px rgba(22,163,74,0.6)',
              color: '#fff',
            }}
          >
            <h3 style={{ color: '#4ade80', fontWeight: 800, marginBottom: '1rem', textAlign: 'center' }}>
              🧾 Game Created Successfully
            </h3>

            <div style={{ display: 'grid', rowGap: '0.6rem', fontSize: '0.95rem' }}>
              <p>
                <span style={{ color: '#4ade80', fontWeight: 700 }}>Game Code:</span>{' '}
                <span
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#0f0f0f',
                    border: '1px solid #4ade80',
                    borderRadius: '6px',
                    padding: '0.25rem 0.75rem',
                    color: '#fff',
                    fontWeight: 700,
                    letterSpacing: '1px',
                  }}
                >
                  {createdGameDetails.game_code}
                </span>
              </p>
              <p><span style={{ color: '#4ade80' }}>Start Date:</span> {createdGameDetails.start_date}</p>
              <p><span style={{ color: '#4ade80' }}>Entry Fee:</span> £{createdGameDetails.entry_fee_per_player}</p>
              <p><span style={{ color: '#4ade80' }}>Missed Selection Rule:</span> {createdGameDetails.missed_selection_rule}</p>
              <p><span style={{ color: '#4ade80' }}>Include Draws:</span> {createdGameDetails.include_draws ? 'Yes' : 'No'}</p>
              <p><span style={{ color: '#4ade80' }}>Competitions:</span> {createdGameDetails.competitions.join(', ')}</p>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(createdGameDetails.game_code)
                const copyText = document.getElementById('copy-status')
                if (copyText) {
                  copyText.style.opacity = '1'
                  copyText.textContent = '✅ Copied!'
                  setTimeout(() => {
                    copyText.style.opacity = '0'
                  }, 2000)
                }
              }}
              style={{
                width: '100%',
                marginTop: '1rem',
                backgroundColor: '#16a34a',
                border: 'none',
                borderRadius: '9999px',
                padding: '0.75rem',
                color: '#000',
                fontWeight: 800,
                cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              Copy Game Code
            </button>

            <p
              id="copy-status"
              style={{
                color: '#4ade80',
                textAlign: 'center',
                fontWeight: 700,
                marginTop: '0.5rem',
                opacity: 0,
                transition: 'opacity 0.3s ease',
              }}
            ></p>
          </div>
        )}

        {message && !message.includes('✅') && (
          <p
            style={{
              marginTop: '1.5rem',
              color: message.includes('❌') ? '#ff3b30' : '#16a34a',
              textAlign: 'center',
              fontWeight: 700,
            }}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  )
}
