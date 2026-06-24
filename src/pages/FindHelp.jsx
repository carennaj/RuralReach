import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SERVICE_CATEGORIES, JOB_STATUS_LABELS } from '../lib/constants'

export default function FindHelp() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: '', zip_code: '' })

  useEffect(() => {
    fetchJobs()
  }, [filters])

  async function fetchJobs() {
    setLoading(true)
    let q = supabase
      .from('job_postings')
      .select('*, profiles(full_name)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (filters.category) q = q.eq('category', filters.category)
    if (filters.zip_code) q = q.eq('zip_code', filters.zip_code.trim())

    const { data } = await q
    setJobs(data || [])
    setLoading(false)
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Find Help</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse open jobs in your area</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">+ Post a Job</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
        <div className="form-group" style={{ margin: 0, flex: '1 1 200px' }}>
          <label>Category</label>
          <select
            value={filters.category}
            onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
          >
            <option value="">All Categories</option>
            {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ margin: 0, flex: '0 1 180px' }}>
          <label>Zip Code</label>
          <input
            type="text"
            value={filters.zip_code}
            onChange={e => setFilters(f => ({ ...f, zip_code: e.target.value }))}
            placeholder="e.g. 73401"
            maxLength={5}
          />
        </div>
        <button
          className="btn btn-outline btn-sm"
          onClick={() => setFilters({ category: '', zip_code: '' })}
          style={{ marginBottom: '1.1rem' }}
        >
          Clear
        </button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No open jobs found</h3>
          <p>Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map(job => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  )
}

function JobCard({ job }) {
  const ago = timeAgo(job.created_at)
  return (
    <Link to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ transition: 'box-shadow 0.15s', cursor: 'pointer' }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
        onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.3rem' }}>{job.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {job.description}
            </p>
            <div className="tag-list">
              <span className="tag">{job.category}</span>
              <span className="tag">📍 {job.zip_code}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center' }}>
                Posted by {job.profiles?.full_name || 'Homeowner'} · {ago}
              </span>
            </div>
          </div>
          <span className={`badge badge-${job.status}`}>{JOB_STATUS_LABELS[job.status]}</span>
        </div>
      </div>
    </Link>
  )
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
