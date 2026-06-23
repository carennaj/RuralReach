import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { JOB_STATUS_LABELS } from '../lib/constants'

export default function HomeownerDashboard() {
  const { user, profile } = useAuth()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase
      .from('job_postings')
      .select('*, job_responses(count)')
      .eq('homeowner_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => {
        setJobs(data || [])
        setLoading(false)
      })
  }, [user])

  const open = jobs.filter(j => j.status === 'open').length
  const inProgress = jobs.filter(j => j.status === 'in_progress').length
  const closed = jobs.filter(j => j.status === 'closed').length

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>My Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!</p>
        </div>
        <Link to="/post-job" className="btn btn-primary">+ Post a New Job</Link>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '2rem', gap: '1rem' }}>
        <StatCard label="Open Jobs" value={open} color="var(--green-dark)" />
        <StatCard label="In Progress" value={inProgress} color="var(--orange)" />
        <StatCard label="Closed" value={closed} color="var(--text-muted)" />
      </div>

      {/* Job list */}
      <h2 style={{ marginBottom: '1rem' }}>My Job Postings</h2>

      {loading ? (
        <div className="spinner" />
      ) : jobs.length === 0 ? (
        <div className="empty-state">
          <h3>No jobs posted yet</h3>
          <p>Post your first job to get responses from local providers.</p>
          <Link to="/post-job" className="btn btn-primary" style={{ marginTop: '1rem' }}>Post a Job</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {jobs.map(job => {
            const respCount = job.job_responses?.[0]?.count ?? 0
            return (
              <Link key={job.id} to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ marginBottom: '0.3rem' }}>{job.title}</h3>
                      <div className="tag-list">
                        <span className="tag">{job.category}</span>
                        <span className="tag">📍 {job.zip_code}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <span className={`badge badge-${job.status}`}>{JOB_STATUS_LABELS[job.status]}</span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                        {respCount} response{respCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, color }) {
  return (
    <div className="card" style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '2.25rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.25rem' }}>{label}</div>
    </div>
  )
}
