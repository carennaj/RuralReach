import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { SERVICE_CATEGORIES } from '../lib/constants'

export default function ProviderOnboarding() {
  const { user, refreshProfile } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ bio: '', zipCodesRaw: '', specialties: [] })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function toggleSpecialty(cat) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(cat)
        ? f.specialties.filter(s => s !== cat)
        : [...f.specialties, cat],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const zipCodes = form.zipCodesRaw.split(',').map(z => z.trim()).filter(Boolean)
    if (zipCodes.length === 0) return setError('Enter at least one zip code you serve.')
    if (form.specialties.length === 0) return setError('Select at least one service category.')
    setError('')
    setLoading(true)

    const { error } = await supabase.from('provider_profiles').insert({
      user_id: user.id,
      bio: form.bio,
      zip_codes: zipCodes,
      specialties: form.specialties,
    })

    setLoading(false)
    if (error) return setError(error.message)
    await refreshProfile()
    navigate('/dashboard/provider')
  }

  return (
    <div className="page" style={{ maxWidth: 680, paddingTop: '2rem' }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Set up your provider profile</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Tell homeowners about you and what areas you serve.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Bio</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Tell homeowners a bit about your experience and work style…"
              rows={4}
            />
          </div>

          <div className="form-group">
            <label>Zip Codes You Serve</label>
            <input
              type="text"
              value={form.zipCodesRaw}
              onChange={e => setForm(f => ({ ...f, zipCodesRaw: e.target.value }))}
              placeholder="e.g. 73401, 73402, 73403"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Separate multiple zip codes with commas
            </span>
          </div>

          <div className="form-group">
            <label>Service Categories</label>
            <div className="checkbox-grid" style={{ marginTop: '0.5rem' }}>
              {SERVICE_CATEGORIES.map(cat => (
                <label
                  key={cat}
                  className={`checkbox-item ${form.specialties.includes(cat) ? 'checked' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={form.specialties.includes(cat)}
                    onChange={() => toggleSpecialty(cat)}
                  />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving…' : 'Save Profile & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}
