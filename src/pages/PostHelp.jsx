import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/shared/Toast'
import { SERVICE_CATEGORIES } from '../lib/constants'

export default function PostHelp() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ bio: '', zipCodesRaw: '', specialties: [] })
  const [existing, setExisting] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('provider_profiles').select('*').eq('user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setExisting(data)
          setForm({ bio: data.bio || '', zipCodesRaw: data.zip_codes?.join(', ') || '', specialties: data.specialties || [] })
        }
        setFetching(false)
      })
  }, [user])

  function toggleSpecialty(cat) {
    setForm(f => ({
      ...f,
      specialties: f.specialties.includes(cat) ? f.specialties.filter(s => s !== cat) : [...f.specialties, cat],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const zipCodes = form.zipCodesRaw.split(',').map(z => z.trim()).filter(Boolean)
    if (zipCodes.length === 0) return setError('Enter at least one zip code you serve.')
    if (form.specialties.length === 0) return setError('Select at least one service category.')
    setError('')
    setLoading(true)

    const payload = { bio: form.bio, zip_codes: zipCodes, specialties: form.specialties }
    const { error } = existing
      ? await supabase.from('provider_profiles').update({ ...payload, updated_at: new Date().toISOString() }).eq('user_id', user.id)
      : await supabase.from('provider_profiles').insert({ user_id: user.id, ...payload })

    setLoading(false)
    if (error) return setError(error.message)
    toast(existing ? 'Listing updated!' : 'Your services are now listed!')
    navigate('/help')
  }

  if (fetching) return <div className="spinner" />

  return (
    <div className="page" style={{ maxWidth: 680 }}>
      <h1 style={{ marginBottom: '0.25rem' }}>{existing ? 'Update Your Listing' : 'Offer Your Services'}</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        {existing
          ? 'Update your bio, service areas, and specialties.'
          : 'Create a public listing so homeowners in your area can find you.'}
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>About You</label>
            <textarea
              value={form.bio}
              onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
              placeholder="Describe your experience, how long you've been in the trade, your work style, and what makes you reliable…"
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Zip Codes You Serve</label>
            <input
              type="text"
              value={form.zipCodesRaw}
              onChange={e => setForm(f => ({ ...f, zipCodesRaw: e.target.value }))}
              placeholder="e.g. 73401, 73402, 73434"
            />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              Separate multiple zip codes with commas
            </span>
          </div>

          <div className="form-group">
            <label>Services You Offer</label>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
              Select all that apply — homeowners will filter by these categories.
            </p>
            <div className="checkbox-grid">
              {SERVICE_CATEGORIES.map(cat => (
                <label key={cat} className={`checkbox-item ${form.specialties.includes(cat) ? 'checked' : ''}`}>
                  <input type="checkbox" checked={form.specialties.includes(cat)} onChange={() => toggleSpecialty(cat)} />
                  {cat}
                </label>
              ))}
            </div>
          </div>

          {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving…' : existing ? 'Update Listing' : 'Post My Services'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>

      <div className="card" style={{ marginTop: '1.5rem', background: 'var(--green-pale)', border: '1px solid var(--border)' }}>
        <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>💡 Tips for a great listing</h3>
        <ul style={{ paddingLeft: '1.25rem', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.8 }}>
          <li>Mention your years of experience and any licenses or certifications</li>
          <li>List all the zip codes you're willing to travel to</li>
          <li>Be specific about what jobs you take on — it helps homeowners trust you</li>
          <li>Respond quickly to job postings to stand out</li>
        </ul>
      </div>
    </div>
  )
}
