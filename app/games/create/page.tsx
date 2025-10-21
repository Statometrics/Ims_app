'use client'

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '4rem',
        minHeight: '100vh',
        backgroundColor: 'var(--color-black)',
        color: 'var(--color-white)',
        fontFamily: 'Orbitron, "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
      }}
    >
      {/* Main Header Section */}
      <header
        style={{
          width: '100%',
          marginBottom: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        {/* Main Title with Football Icons */}
        <h1
          className="glow-green"
          style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            textShadow: '0 0 10px #00ff00, 0 0 20px #00ff00, 0 0 40px #00ff00',
          }}
        >
          <span style={{ color: '#00ff00', textShadow: '0 0 15px #00ff00' }}>⚽</span>
          LAST MAN STANDING
          <span style={{ color: '#00ff00', textShadow: '0 0 15px #00ff00' }}>⚽</span>
        </h1>
        {/* Money Icons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1rem',
            fontSize: '3rem',
            color: '#fde047',
          }}
        >
          <span>💰</span>
          <span>💰</span>
          <span>💰</span>
        </div>
      </header>

      {/* Tagline */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <p
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            maxWidth: '56rem',
            lineHeight: '1.25',
            letterSpacing: '0.5px',
            color: 'var(--color-white)',
          }}
        >
          THE ULTIMATE FOOTBALL SURVIVAL GAME. PICK A WINNING TEAM EACH WEEK.
        </p>

        <p
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            maxWidth: '56rem',
            lineHeight: '1.25',
            letterSpacing: '0.5px',
            color: 'var(--color-white)',
          }}
        >
          LAST MAN STANDING WINS.
        </p>

        <p
          className="pulsing-text btn-glow"
          style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            maxWidth: '56rem',
            lineHeight: '1.25',
            letterSpacing: '0.5px',
            color: 'var(--color-green)',
            animation: 'glow 2s infinite alternate',
          }}
        >
          HAVE YOU GOT THE SKILL TO WIN?
        </p>
      </div>

      {/* Buttons Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          gap: '1.5rem',
          marginTop: '3rem',
        }}
      >
        <a
          href="/signup"
          className="btn-glow"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 2rem',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textAlign: 'center',
            width: '12rem',
            height: '3.5rem',
            backgroundColor: 'transparent',
            color: 'var(--color-white)',
            border: '3px solid var(--color-white)',
            boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            transition: 'all 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-white)'
            e.currentTarget.style.color = 'var(--color-black)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--color-white)'
          }}
        >
          CREATE ACCOUNT
        </a>

        <a
          href="/login"
          className="btn-glow"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem 2rem',
            borderRadius: '9999px',
            fontWeight: 800,
            fontSize: '1rem',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textAlign: 'center',
            width: '12rem',
            height: '3.5rem',
            backgroundColor: 'transparent',
            color: 'var(--color-white)',
            border: '4px solid var(--color-white)',
            boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            transition: 'all 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--color-white)'
            e.currentTarget.style.color = 'var(--color-black)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent'
            e.currentTarget.style.color = 'var(--color-white)'
          }}
        >
          LOGIN
        </a>
      </div>
    </div>
  )
}