'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useRouter } from 'next/navigation'

export default function MobileDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error || !user) return router.push('/login')
      setUser(user)
      setLoading(false)
    }
    getUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white text-lg font-poppins">
        Loading dashboard...
      </div>
    )
  }

  const buttons = [
    { label: 'START A GAME', link: '/games/new' },
    { label: 'PREMIUM GAME', link: '/games/premium' },
    { label: 'JOIN A GAME', link: '/games/join' },
    { label: 'ACTIVE GAMES', link: '/games/active' },
    { label: 'HISTORICAL GAMES', link: '/games/history' },
    { label: 'PROFILE', link: '/profile' },
  ]

  return (
    <div className="bg-black text-white font-poppins min-h-screen flex flex-col items-center justify-start py-10 px-4">
      <div className="w-full max-w-md bg-neutral-900 border-2 border-green-700 rounded-2xl p-6 shadow-[0_0_20px_rgba(22,163,74,0.6)] text-center">
        <h1 className="text-xl font-extrabold uppercase text-white mb-2 drop-shadow-[0_0_6px_#16a34a]">
          Dashboard
        </h1>
        <p className="text-green-400 font-semibold mb-8">
          Welcome back, {user?.email}
        </p>

        <div className="flex flex-col items-center gap-4">
          {buttons.map((btn) => (
            <a
              key={btn.label}
              href={btn.link}
              className="w-64 py-3 rounded-full font-extrabold text-sm uppercase tracking-wide border-2 border-white hover:bg-white hover:text-black hover:scale-105 transition-all duration-200 ease-in-out"
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
