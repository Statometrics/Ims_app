'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function CreateAccountPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    first_name: '',
    surname: '',
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    dob: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setMessage('')

    const { first_name, surname, username, email, password, confirm_password, dob } = form

    try {
      if (password !== confirm_password) throw new Error('Passwords do not match.')

      const safeEmail = email.trim()
      const safePassword = password.trim()

      if (!safePassword || safePassword.length < 6)
        throw new Error('Password must be at least 6 characters long.')

      const { data, error } = await supabase.auth.signUp({
        email: safeEmail,
        password: safePassword,
        options: { data: { first_name, surname, username, dob } },
      })

      if (error) throw error

      setMessage('✅ Account created successfully! Redirecting...')
      setTimeout(() => router.push('/login'), 1200)
    } catch (err: any) {
      console.error('Signup error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const togglePassword = () => setShowPassword((prev) => !prev)

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '44px',
    padding: '0 0.75rem',
    borderRadius: '9999px',
    border: '1px solid #064e3b',
    backgroundColor: '#f8fafc',
    color: '#000',
    boxSizing: 'border-box',
  }

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
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      {/* Outer Glowing Form Box */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '28rem',
          backgroundColor: '#1a1a1a',
          border: '2px solid #064e3b',
          borderRadius: '1rem',
          padding: '2rem',
          boxShadow: '0 0 30px rgba(22,163,74,0.8), 0 0 50px rgba(22,163,74,0.5)',
        }}
      >
        {/* Inner Thin White Border */}
        <div
          style={{
            position: 'absolute',
            top: '8px',
            left: '8px',
            right: '8px',
            bottom: '8px',
            border: '1px solid #ffffff',
            borderRadius: '0.85rem',
            pointerEvents: 'none',
            opacity: 0.4,
          }}
        />

        {/* Actual Form Content */}
        <form onSubmit={handleSubmit} style={{ position: 'relative', zIndex: 2 }}>
          <h2
            style={{
              textAlign: 'center',
              color: '#ffffff',
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '1.5rem',
              textTransform: 'uppercase',
              textShadow: '0 0 8px #16a34a, 0 0 16px #16a34a',
            }}
          >
            Create Account
          </h2>

          {[{ label: 'First Name', name: 'first_name', type: 'text' },
            { label: 'Surname', name: 'surname', type: 'text' },
            { label: 'Username', name: 'username', type: 'text' },
            { label: 'Email Address', name: 'email', type: 'email' }].map((field) => (
            <div key={field.name} style={{ marginBottom: '1rem' }}>
              <label
                htmlFor={field.name}
                style={{ display: 'block', fontWeight: 700, color: '#4ade80' }}
              >
                {field.label}
              </label>
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={(form as any)[field.name]}
                onChange={handleChange}
                required
                style={inputStyle}
              />
            </div>
          ))}

          {/* Password */}
          <div style={{ marginBottom: '1rem', position: 'relative' }}>
            <label
              htmlFor="password"
              style={{ display: 'block', fontWeight: 700, color: '#4ade80' }}
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={form.password}
              onChange={handleChange}
              required
              style={{ ...inputStyle, paddingRight: '3rem' }}
            />
            <button
              type="button"
              onClick={togglePassword}
              style={{
                position: 'absolute',
                right: '0.75rem',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                color: '#064e3b',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.9rem',
              }}
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="confirm_password"
              style={{ display: 'block', fontWeight: 700, color: '#4ade80' }}
            >
              Confirm Password
            </label>
            <input
              id="confirm_password"
              name="confirm_password"
              type={showPassword ? 'text' : 'password'}
              value={form.confirm_password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Date of Birth */}
          <div style={{ marginBottom: '1rem' }}>
            <label
              htmlFor="dob"
              style={{ display: 'block', fontWeight: 700, color: '#4ade80' }}
            >
              Date of Birth
            </label>
            <input
              id="dob"
              name="dob"
              type="date"
              value={form.dob}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Messages */}
          {error && <p style={{ color: '#ff3b30' }}>{error}</p>}
          {message && <p style={{ color: '#16a34a' }}>{message}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem 0',
              borderRadius: '9999px',
              fontWeight: 800,
              fontSize: '1rem',
              textTransform: 'uppercase',
              backgroundColor: '#16a34a',
              color: '#0f0f0f',
            }}
          >
            {loading ? 'Creating...' : 'Create Account'}
          </button>

          <p style={{ textAlign: 'center', marginTop: '1rem', color: '#4ade80' }}>
            Already have an account?{' '}
            <a href="/login" style={{ textDecoration: 'underline', color: '#16a34a' }}>
              Login here
            </a>
          </p>
        </form>
      </div>
    </div>
  )
}
