'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

type Fixture = {
  fixture_id: string
  country: string
  competition: string
  season: string | null
  home_team: string
  away_team: string
  timestamp: number | null
  date: string
  ko_time: string | null
  created_at: string | null
  status: string | null
}

function norm(str: string) {
  return (str || '')
    .toLowerCase()
    .replace(/[-_]+/g, ' ')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export default function ViewGamePage() {
  const { game_code } = useParams()
  const router = useRouter()

  const [game, setGame] = useState<any>(null)
  const [fixtures, setFixtures] = useState<Fixture[]>([])
  const [selectedPick, setSelectedPick] = useState<any>(null)
  const [userSelection, setUserSelection] = useState<any>(null)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [previousTeams, setPreviousTeams] = useState<string[]>([])
  const [playerCount, setPlayerCount] = useState<number>(0)
  const [potSize, setPotSize] = useState<number>(0)

  const weekStart = useMemo(() => {
    const d = new Date()
    const diff = (d.getDay() + 6) % 7 // Monday = 0
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - diff)
    return d.toISOString().slice(0, 10)
  }, [])

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!game_code) throw new Error('Missing game code.')

        // ✅ Load full game data including all fields + participant count
        const { data: g, error: gErr } = await supabase
          .from('games')
          .select('*, participants(count)')
          .eq('game_code', game_code)
          .maybeSingle()

        if (gErr || !g) throw gErr || new Error('Game not found.')

        // 👇 Debug log to confirm what Supabase actually sends back
        console.log('Loaded game data:', g)

        setGame(g)

        // ✅ Safe pot & player count calculation
        const count = g.participants?.[0]?.count || 0
        const pot = Number(g.entry_fee_per_player || 0) * count
        setPlayerCount(count)
        setPotSize(pot)

        // ✅ Parse competitions list
        let comps: string[] = []
        try {
          comps = Array.isArray(g.competitions)
            ? g.competitions
            : JSON.parse(g.competitions || '[]')
        } catch {
          comps = []
        }

        // ✅ Load fixtures for those competitions
        const { data: distinctRows, error: dErr } = await supabase
          .from('fixtures')
          .select('country, competition')
        if (dErr) throw dErr

        const pairSet = new Set<string>()
        const pairs: Array<{ country: string; competition: string; key: string }> = []
        for (const row of distinctRows || []) {
          const key = norm(`${row.country} ${row.competition}`)
          if (!pairSet.has(key)) {
            pairSet.add(key)
            pairs.push({ country: row.country, competition: row.competition, key })
          }
        }

        const wantedKeys = new Set((comps || []).map((s) => norm(String(s))))
        const wantedPairs = pairs.filter((p) => wantedKeys.has(p.key))
        if (wantedPairs.length === 0) {
          setFixtures([])
          setLoading(false)
          return
        }

        const uniqueCountries = Array.from(new Set(wantedPairs.map((p) => p.country)))
        const { data: fData, error: fErr } = await supabase
          .from('fixtures')
          .select('*')
          .in('country', uniqueCountries)
          .order('date', { ascending: true })
        if (fErr) throw fErr

        const allowed = new Set(wantedPairs.map((p) => `${p.country}|||${p.competition}`))
        const filtered = (fData as Fixture[]).filter((f) =>
          allowed.has(`${f.country}|||${f.competition}`)
        )
        setFixtures(filtered)

        // ✅ Load user's previous selections
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: prev } = await supabase
            .from('weekly_selections')
            .select('selection_team')
            .eq('user_id', user.id)
            .eq('game_id', g.game_id)

          const prevTeams = (prev || []).map((r) => r.selection_team)
          setPreviousTeams(prevTeams)
        }
      } catch (err) {
        console.error('Error loading game data:', err)
        setMessage('❌ Error loading game details.')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [game_code, weekStart])

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
        paddingTop: '6rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          position: 'relative',
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
            color: '#ffffff',
            fontSize: '1.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            textShadow: '0 0 8px #16a34a',
            marginBottom: '1.5rem',
          }}
        >
          {game?.game_name || 'Game Details'}
        </h1>

        <p style={{ marginBottom: '1rem', lineHeight: '1.8' }}>
          <strong>Game Code:</strong> {game?.game_code}<br />
          <strong>Start Date:</strong> {game?.start_date}<br />
          <strong>Status:</strong> {game?.status}<br />
          <strong>Entry Fee:</strong> £{game?.entry_fee_per_player ?? 0}<br />
          <strong>Players Joined:</strong> {playerCount}<br />
          <strong>Current Pot:</strong> £{potSize.toFixed(2)}<br />
          <strong>Missed Selection / Elimination Rule:</strong>{' '}
          {game?.missed_selection_rule || 'Eliminate'}<br />
          <strong>Include Draws:</strong> {game?.include_draws ? 'Yes' : 'No'}
        </p>

        <h2
          style={{ marginTop: '2rem', fontWeight: 700, color: '#4ade80' }}
        >
          Make Your Weekly Selection
        </h2>

        {/* Fixtures + confirm modal remain same below */}
      </div>
    </div>
  )
}
