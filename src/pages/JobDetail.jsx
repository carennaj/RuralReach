import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../components/shared/Toast'
import { JOB_STATUS_LABELS, JOB_STATUS_COLORS } from '../lib/constants'

export default function JobDetail() {
  const { id } = useParams()
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const toast = useToast()

  const [job, setJob] = useState(null)
  const [responses, setResponses] = useState([])
  const [responseMsg, setResponseMsg] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchAll()
  }, [id])

  async function fetchAll() {
    const [{ data: jobData }, { data: respData }] = await Promise.all([
      supabase.from('job_postings').select('*, profiles(full_name)').eq('id', id).single(),
      supabase.from('job_responses').select('*, profiles(full_name)').eq('job_id', id).order('created_at'),
    ])
    setJob(jobData)
    setResponses(respData || [])
    setLoading(false)
  }

  async function handleRespond(e) {
    e.preventDefault()
    if (!responseMsg.trim()) return
    setSubmitting(true)
    setError('')
    const { error } = await supabase.from('job_responses').insert({
      job_id: id,
      provider_id: user.id,
      message: responseMsg.trim(),
    })
    setSubmitting(false)
    if (error) return setError(error.message)
    setResponseMsg('')
    toast('Response sent! The homeowner will be in touch.')
    fetchAll()
  }

  async function updateStatus(newStatus) {
    await supabase.from('job_postings').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', id)
    fetchAll()
  }

  if (loading) return <div className="spinner" />
  if (!job) return <div className="page"><p>Job not found.</p></div>

  const isOwner = user?.id === job.homeowner_id
  const isProvider = profile?.role === 'provider'

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)} style={{ marginBottom: '1.5rem' }}>
        ← Back
      </button>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <h1 style={{ fontSize: '1.5rem' }}>{job.title}</h1>
          <span
            className={`badge badge-${job.status}`}
            style={{ fontSize: '0.85rem' }}
          >
            {JOB_STATUS_LABELS[job.status]}
          </span>
        </div>

        <div className="tag-list" style={{ marginBottom: '1rem' }}>
          <span className="tag">{job.category}</span>
          <span className="tag">📍 {job.zip_code}</span>
        </div>

        <p style={{ lineHeight: 1.7, color: 'var(--text)', marginBottom: '1rem' }}>{job.description}</p>

        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
          Posted by <strong>{job.profiles?.full_name}</strong> · {new Date(job.created_at).toLocaleDateString()}
        </p>

        {/* Status controls for owner */}
        {isOwner && job.status !== 'closed' && (
          <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {job.status === 'open' && (
              <button className="btn btn-orange btn-sm" onClick={() => updateStatus('in_progress')}>
                Mark In Progress
              </button>
            )}
            {job.status === 'in_progress' && (
              <button className="btn btn-secondary btn-sm" onClick={() => updateStatus('closed')}>
                Mark Closed
              </button>
            )}
            <button className="btn btn-danger btn-sm" onClick={() => updateStatus('closed')}>
              Close Job
            </button>
          </div>
        )}
      </div>

      {/* Responses */}
      <h2 style={{ marginBottom: '1rem' }}>
        Responses ({responses.length})
      </h2>

      {responses.length === 0 ? (
        <div className="empty-state" style={{ padding: '2rem', background: 'var(--surface)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
          <p>No responses yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {responses.map(r => (
            <div key={r.id} className="card" style={{ borderLeft: '3px solid var(--green-mid)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <strong>{r.profiles?.full_name || 'Provider'}</strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(r.created_at).toLocaleDateString()}
                </span>
              </div>
              <p style={{ lineHeight: 1.6 }}>{r.message}</p>
            </div>
          ))}
        </div>
      )}

      {/* Response form for providers */}
      {user && isProvider && job.status === 'open' && (
        <div className="card">
          <h3 style={{ marginBottom: '1rem' }}>Send a Response</h3>
          <form onSubmit={handleRespond}>
            <div className="form-group">
              <label>Your Message</label>
              <textarea
                value={responseMsg}
                onChange={e => setResponseMsg(e.target.value)}
                placeholder="Introduce yourself and explain why you're a great fit for this job…"
                rows={4}
                required
              />
            </div>
            {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Sending…' : 'Send Response'}
            </button>
          </form>
        </div>
      )}

      {!user && (
        <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
            Sign in as a service provider to respond to this job.
          </p>
          <button className="btn btn-primary" onClick={() => navigate('/login')}>Sign In</button>
        </div>
      )}
    </div>
  )
}
