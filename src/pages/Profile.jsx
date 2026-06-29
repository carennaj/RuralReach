import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/shared/Toast'
import { supabase } from '../lib/supabase'

export default function Profile() {
  const { user, profile } = useAuth()
  const toast = useToast()
  const [name, setName] = useState(profile?.full_name || '')
  const [saving, setSaving] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: name.trim() })
      .eq('id', user.id)
    setSaving(false)
    if (error) toast(error.message, 'error')
    else toast('Profile updated!')
  }

  return (
    <div className="page" style={{ maxWidth: 560 }}>
      <h1 style={{ marginBottom: '0.25rem' }}>My Profile</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Manage your account details</p>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        {/* Avatar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1.75rem' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'var(--green-pale)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: '1.8rem', fontWeight: 800, color: 'var(--green-dark)',
          }}>
            {(name || profile?.full_name || user?.email || '?')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>{profile?.full_name || 'Your Name'}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email}</div>
            <span style={{ fontSize: '0.8rem', background: 'var(--green-pale)', color: 'var(--green-dark)', padding: '0.15rem 0.6rem', borderRadius: 20, fontWeight: 600, marginTop: '0.35rem', display: 'inline-block' }}>
              {profile?.role === 'provider' ? 'Service Provider' : 'Homeowner'}
            </span>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={user?.email || ''} disabled style={{ opacity: 0.6 }} />
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>Email cannot be changed here.</p>
          </div>
          <button type="submit" className="btn btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </form>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '0.75rem' }}>Account Info</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Member since</span>
            <span>{new Date(user?.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-muted)' }}>Account type</span>
            <span style={{ textTransform: 'capitalize' }}>{profile?.role || '—'}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
