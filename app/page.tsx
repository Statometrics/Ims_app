'use client'

import React from 'react'

export default function HomePage() {
  return (
    <div
      style={{
        backgroundColor: '#0b0b0b',
        color: '#f8fafc',
        fontFamily: 'Poppins, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HEADER */}
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1.5rem 3rem',
        }}
      >
        <h2
          style={{
            color: '#16a34a',
            fontWeight: 800,
            fontSize: '1.5rem',
            letterSpacing: '0.5px',
          }}
        >
          ⚽ Last Man Standing
        </h2>
        <nav style={{ display: 'flex', gap: '1.5rem' }}>
          <a href="/create-account" style={{ color: '#f8fafc', textDecoration: 'none' }}>
            Create Account
          </a>
          <a href="/login" style={{ color: '#f8fafc', textDecoration: 'none' }}>
            Login
          </a>
          <a href="/dashboard" style={{ color: '#16a34a', textDecoration: 'none' }}>
            Dashboard
          </a>
        </nav>
      </header>

      {/* HERO */}
      <section
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '4rem 2rem',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            fontSize: '3.2rem',
            fontWeight: 900,
            textTransform: 'uppercase',
            color: '#ffffff',
            textShadow: '0 0 10px #16a34a, 0 0 25px #16a34a',
            marginBottom: '1rem',
          }}
        >
          ⚽ Last Man Standing ⚽
        </h1>

        <p
          style={{
            fontSize: '1.25rem',
            color: '#9ca3af',
            maxWidth: '700px',
            marginBottom: '2.5rem',
            lineHeight: 1.5,
          }}
        >
          Challenge your mates, survive each round, and climb to the top. 
          Skill, stats & strategy decide who’s the <strong>Last Man Standing</strong>.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a
            href="/create-account"
            style={{
              padding: '1rem 2rem',
              borderRadius: '9999px',
              backgroundColor: '#16a34a',
              color: '#000000',
              fontWeight: 800,
              fontSize: '1.1rem',
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            Get Started
          </a>

          <a
            href="/login"
            style={{
              padding: '1rem 2rem',
              borderRadius: '9999px',
              backgroundColor: 'transparent',
              border: '2px solid #ffffff',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.1rem',
              textDecoration: 'none',
              letterSpacing: '0.5px',
            }}
          >
            Login
          </a>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          backgroundColor: '#111',
          padding: '4rem 2rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '2rem',
          textAlign: 'center',
        }}
      >
        {[
          {
            title: 'Start a Game',
            text: 'Host your own competition, set entry fees, and invite your friends to join.',
          },
          {
            title: 'Join Friends',
            text: 'Use your invite link or code to jump into an existing game instantly.',
          },
          {
            title: 'Track Progress',
            text: 'Follow live stats, results, and elimination rounds in real time.',
          },
          {
            title: 'Cash & Glory',
            text: 'Stay in the game and take the pot — last one standing wins it all!',
          },
        ].map((f) => (
          <div
            key={f.title}
            style={{
              backgroundColor: '#1a1a1a',
              border: '1px solid #064e3b',
              borderRadius: '1rem',
              padding: '2rem',
              boxShadow: '0 0 20px rgba(22,163,74,0.2)',
            }}
          >
            <h3 style={{ color: '#16a34a', fontWeight: 700, marginBottom: '1rem' }}>
              {f.title}
            </h3>
            <p style={{ color: '#d1d5db', fontSize: '0.95rem', lineHeight: 1.6 }}>{f.text}</p>
          </div>
        ))}
      </section>

      {/* FOOTER */}
      <footer
        style={{
          backgroundColor: '#000',
          color: '#9ca3af',
          textAlign: 'center',
          padding: '2rem 1rem',
          fontSize: '0.9rem',
          borderTop: '1px solid #222',
        }}
      >
        <p>© {new Date().getFullYear()} Last Man Standing. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem' }}>
          BeGambleAware | Terms & Conditions | Privacy Policy
        </p>
      </footer>
    </div>
  )
}
