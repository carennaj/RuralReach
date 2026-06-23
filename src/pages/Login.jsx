import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const { signIn, profile } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || null
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { data, error } = await signIn(form)
    setLoading(false)
    if (error) return setError(error.message)
    // Redirect to previous page or role-based dashboard
    if (from) navigate(from, { replace: true })
    else navigate(data?.user ? '/' : '/')
  }

  return (
    <div className="page" style={{ maxWidth: 440, paddingTop: '3rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '0.25rem' }}>Welcome back</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Sign in to your RuralReach account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="••••••••"
            />
          </div>

          {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
