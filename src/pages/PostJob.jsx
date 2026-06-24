import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/shared/Toast'
import { SERVICE_CATEGORIES } from '../lib/constants'

export default function PostJob() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()
  const [form, setForm] = useState({ title: '', description: '', category: '', zip_code: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const { data, error } = await supabase.from('job_postings').insert({
      homeowner_id: user.id,
      ...form,
    }).select().single()

    setLoading(false)
    if (error) return setError(error.message)
    toast('Job posted! Providers in your area will be notified.')
    navigate(`/jobs/${data.id}`)
  }

  return (
    <div className="page" style={{ maxWidth: 620 }}>
      <h1 style={{ marginBottom: '0.5rem' }}>Post a Job</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Describe what you need and local providers will reach out.
      </p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Job Title</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. Fix leaking kitchen faucet"
            />
          </div>

          <div className="form-group">
            <label>Service Category</label>
            <select
              required
              value={form.category}
              onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">Select a category…</option>
              {SERVICE_CATEGORIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Description</span>
              <span style={{ fontWeight: 400, color: form.description.length > 800 ? '#dc2626' : 'var(--text-muted)' }}>
                {form.description.length}/1000
              </span>
            </label>
            <textarea
              required
              maxLength={1000}
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe the job in detail — what needs to be done, any relevant context, urgency, etc."
              rows={5}
            />
          </div>

          <div className="form-group">
            <label>Your Zip Code</label>
            <input
              type="text"
              required
              pattern="[0-9]{5}"
              value={form.zip_code}
              onChange={e => setForm(f => ({ ...f, zip_code: e.target.value }))}
              placeholder="73401"
              maxLength={5}
              style={{ maxWidth: 180 }}
            />
          </div>

          {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Posting…' : 'Post Job'}
            </button>
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
