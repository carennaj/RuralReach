import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SERVICE_CATEGORIES, JOB_STATUS_LABELS } from '../lib/constants'
import { DEMO_JOBS } from '../lib/demoJobs'

export default function FindJob() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: '', zip_code: '', search: '' })

  useEffect(() => { fetchJobs() }, [filters])

  async function fetchJobs() {
    setLoading(true)
    let q = supabase
      .from('job_postings')
      .select('*, profiles(full_name)')
      .eq('status', 'open')
      .order('created_at', { ascending: false })

    if (filters.category) q = q.eq('category', filters.category)
    if (filters.zip_code) q = q.eq('zip_code', filters.zip_code.trim())
    if (filters.search) q = q.ilike('title', `%${filters.search.trim()}%`)

    const { data } = await q
    const real = data || []
    setJobs(real.length > 0 ? real : filterDemos())
    setLoading(false)
  }

  function filterDemos() {
    let demos = [...DEMO_JOBS]
    if (filters.category) demos = demos.filter(j => j.category === filters.category)
    if (filters.zip_code) demos = demos.filter(j => j.zip_code === filters.zip_code.trim())
    if (filters.search) demos = demos.filter(j => j.title.toLowerCase().includes(filters.search.toLowerCase()))
    return demos
  }

  const clearFilters = () => setFilters({ category: '', zip_code: '', search: '' })
  const hasFilters = filters.category || filters.zip_code || filters.search

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Find a Job</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse job requests posted by homeowners in your area</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">+ Post a Job</Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, flex: '2 1 200px' }}>
            <label>Search</label>
            <input type="text" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} placeholder="e.g. fence repair, plumbing…" />
          </div>
          <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
            <label>Category</label>
            <select value={filters.category} onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}>
              <option value="">All Categories</option>
              {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, flex: '0 1 150px' }}>
            <label>Zip Code</label>
            <input type="text" value={filters.zip_code} onChange={e => setFilters(f => ({ ...f, zip_code: e.target.value }))} placeholder="73401" maxLength={5} />
          </div>
          {hasFilters && <button className="btn btn-outline btn-sm" onClick={clearFilters} style={{ marginBottom: '1.1rem' }}>Clear</button>}
        </div>
      </div>

      {loading ? (
        <SkeletonList />
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No jobs match your search</h3>
          <p style={{ marginBottom: '1.25rem' }}>Try different filters or post a job yourself.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
            <Link to="/post-job" className="btn btn-primary">Post a Job</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map(job => <JobCard key={job.id} job={job} />)}
        </div>
      )}
    </div>
  )
}

function JobCard({ job }) {
  const isDemo = String(job.id).startsWith('demo-')
  return (
    <Link to={isDemo ? '/signup' : `/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ transition: 'box-shadow 0.15s, transform 0.15s', cursor: 'pointer' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'none' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1 }}>
            <h3 style={{ marginBottom: '0.3rem' }}>{job.title}</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.6 }}>
              {job.description}
            </p>
            <div className="tag-list">
              <span className="tag">{job.category}</span>
              <span className="tag">📍 {job.zip_code}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center' }}>
                {job.profiles?.full_name || 'Homeowner'} · {timeAgo(job.created_at)}
              </span>
            </div>
          </div>
          <span className={`badge badge-${job.status}`}>{JOB_STATUS_LABELS[job.status]}</span>
        </div>
      </div>
    </Link>
  )
}

function SkeletonList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="card">
          <span className="skeleton" style={{ display: 'block', width: 220, height: 22, marginBottom: 10 }} />
          <span className="skeleton" style={{ display: 'block', width: '80%', height: 16, marginBottom: 6 }} />
          <span className="skeleton" style={{ display: 'block', width: '60%', height: 16, marginBottom: 12 }} />
          <div style={{ display: 'flex', gap: 8 }}>
            <span className="skeleton" style={{ display: 'block', width: 70, height: 24, borderRadius: 999 }} />
            <span className="skeleton" style={{ display: 'block', width: 80, height: 24, borderRadius: 999 }} />
          </div>
        </div>
      ))}
    </div>
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
