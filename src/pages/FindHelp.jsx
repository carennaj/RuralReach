import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SERVICE_CATEGORIES, JOB_STATUS_LABELS } from '../lib/constants'
import { DEMO_JOBS } from '../lib/demoJobs'

export default function FindHelp() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ category: '', zip_code: '', search: '' })

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
    if (filters.search) q = q.ilike('title', `%${filters.search.trim()}%`)

    const { data } = await q
    const real = data || []
    // Show demo jobs to fill empty state (filtered out once real jobs exist)
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
          <h1 style={{ marginBottom: '0.25rem' }}>Find Help</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse open jobs in your area</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">+ Post a Job</Link>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, flex: '2 1 220px' }}>
            <label>Search</label>
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
              placeholder="e.g. fence repair, plumbing…"
            />
          </div>
          <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
            <label>Category</label>
            <select
              value={filters.category}
              onChange={e => setFilters(f => ({ ...f, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, flex: '0 1 150px' }}>
            <label>Zip Code</label>
            <input
              type="text"
              value={filters.zip_code}
              onChange={e => setFilters(f => ({ ...f, zip_code: e.target.value }))}
              placeholder="73401"
              maxLength={5}
            />
          </div>
          {hasFilters && (
            <button className="btn btn-outline btn-sm" onClick={clearFilters} style={{ marginBottom: '1.1rem' }}>
              Clear
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <SkeletonList />
      ) : jobs.length === 0 ? (
        <div className="empty-state" style={{ padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No jobs match your search</h3>
          <p style={{ marginBottom: '1.25rem' }}>Try different keywords, a different category, or clear your filters.</p>
          <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
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
                Posted by {job.profiles?.full_name || 'Homeowner'} · {timeAgo(job.created_at)}
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
          <div style={sk(220, 22, 'var(--border)', 8)} />
          <div style={{ ...sk('80%', 16, 'var(--border)', 6), marginTop: 10 }} />
          <div style={{ ...sk('60%', 16, 'var(--border)', 6), marginTop: 6 }} />
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <div style={sk(70, 24, 'var(--border)', 12)} />
            <div style={sk(80, 24, 'var(--border)', 12)} />
          </div>
        </div>
      ))}
      <style>{`@keyframes shimmer{0%{opacity:.6}50%{opacity:1}100%{opacity:.6}}.skeleton{animation:shimmer 1.4s ease-in-out infinite}`}</style>
    </div>
  )
}

function sk(w, h, bg, radius) {
  return { width: w, height: h, background: bg, borderRadius: radius, className: 'skeleton' }
}

function timeAgo(ts) {
  const diff = Date.now() - new Date(ts).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
