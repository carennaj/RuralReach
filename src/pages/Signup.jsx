import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', password: '', role: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.role) return setError('Please select your account type.')
    setError('')
    setLoading(true)
    const { error } = await signUp(form)
    setLoading(false)
    if (error) return setError(error.message)
    if (form.role === 'provider') navigate('/onboarding')
    else navigate('/dashboard/homeowner')
  }

  return (
    <div className="page" style={{ maxWidth: 480, paddingTop: '3rem' }}>
      <div className="card">
        <h1 style={{ marginBottom: '0.25rem' }}>Join RuralReach</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem' }}>
          Create your free account
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
              placeholder="Jane Smith"
            />
          </div>
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
              minLength={6}
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              placeholder="Min. 6 characters"
            />
          </div>

          <div className="form-group">
            <label>I am a…</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[
                { value: 'homeowner', label: '🏠 Homeowner', desc: 'I need services done' },
                { value: 'provider', label: '🔧 Service Provider', desc: 'I offer services' },
              ].map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, role: opt.value }))}
                  style={{
                    flex: 1,
                    padding: '0.85rem',
                    border: `2px solid ${form.role === opt.value ? 'var(--green-dark)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius)',
                    background: form.role === opt.value ? 'var(--green-pale)' : 'var(--surface)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{opt.label}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{opt.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%' }}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <hr className="divider" />
        <p style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
