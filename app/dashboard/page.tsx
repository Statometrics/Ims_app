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
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
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
    <div className="min-h-screen bg-black text-white font-poppins flex flex-col items-center justify-center px-6 py-10">
      <div className="w-full max-w-[380px] bg-neutral-900 border-2 border-green-700 rounded-2xl p-6 shadow-[0_0_25px_rgba(22,163,74,0.6)]">
        <h1 className="text-2xl font-bold text-center text-white mb-1 drop-shadow-[0_0_6px_#16a34a]">
          Dashboard
        </h1>
        <p className="text-center text-green-400 text-sm mb-8">
          Welcome back, {user?.email}
        </p>

        {/* BUTTON STACK */}
        <div className="flex flex-col items-center gap-4 w-full">
          {buttons.map((btn) => (
            <a
              key={btn.label}
              href={btn.link}
              className="
                w-full 
                text-center 
                py-3 
                rounded-full 
                border-2 
                border-white 
                text-sm 
                font-bold 
                uppercase 
                tracking-wide 
                transition-all 
                duration-200 
                ease-in-out 
                hover:bg-white 
                hover:text-black 
                hover:scale-105
              "
            >
              {btn.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
