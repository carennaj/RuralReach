import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { SERVICE_CATEGORIES } from '../lib/constants'

export default function ProviderDashboard() {
  const { user, profile } = useAuth()
  const [providerProfile, setProviderProfile] = useState(null)
  const [matchingJobs, setMatchingJobs] = useState([])
  const [myResponses, setMyResponses] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('jobs') // 'jobs' | 'responses'

  useEffect(() => {
    if (!user) return
    fetchAll()
  }, [user])

  async function fetchAll() {
    const { data: pp } = await supabase
      .from('provider_profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()

    setProviderProfile(pp)

    if (pp) {
      const [{ data: jobs }, { data: responses }] = await Promise.all([
        supabase
          .from('job_postings')
          .select('*, profiles(full_name)')
          .eq('status', 'open')
          .in('category', pp.specialties || [])
          .in('zip_code', pp.zip_codes || [])
          .order('created_at', { ascending: false }),
        supabase
          .from('job_responses')
          .select('*, job_postings(id, title, status, category)')
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false }),
      ])
      setMatchingJobs(jobs || [])
      setMyResponses(responses || [])
    }
    setLoading(false)
  }

  if (loading) return <div className="spinner" />

  if (!providerProfile) {
    return (
      <div className="page" style={{ maxWidth: 520 }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>Complete your provider profile</h2>
          <p style={{ color: 'var(--text-muted)', margin: '1rem 0' }}>
            Set up your service areas and specialties to start seeing matching jobs.
          </p>
          <Link to="/onboarding" className="btn btn-primary">Set Up Profile</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Provider Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back, {profile?.full_name?.split(' ')[0] || 'there'}!</p>
        </div>
        <Link to="/onboarding" className="btn btn-outline btn-sm">Edit Profile</Link>
      </div>

      {/* Profile summary */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '0.75rem' }}>Your Service Profile</h3>
        <div style={{ marginBottom: '0.5rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>ZIP CODES SERVED</span>
          <div className="tag-list" style={{ marginTop: '0.35rem' }}>
            {providerProfile.zip_codes?.map(z => <span key={z} className="tag">📍 {z}</span>)}
          </div>
        </div>
        <div>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.85rem' }}>SPECIALTIES</span>
          <div className="tag-list" style={{ marginTop: '0.35rem' }}>
            {providerProfile.specialties?.map(s => <span key={s} className="tag">{s}</span>)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '1.25rem', borderBottom: '2px solid var(--border)' }}>
        {[['jobs', `Matching Jobs (${matchingJobs.length})`], ['responses', `My Responses (${myResponses.length})`]].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              padding: '0.6rem 1.25rem',
              background: 'none',
              border: 'none',
              borderBottom: `2px solid ${tab === key ? 'var(--green-dark)' : 'transparent'}`,
              marginBottom: -2,
              fontWeight: tab === key ? 700 : 400,
              color: tab === key ? 'var(--green-dark)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === 'jobs' && (
        matchingJobs.length === 0 ? (
          <div className="empty-state">
            <h3>No matching jobs right now</h3>
            <p>Jobs matching your zip codes and specialties will appear here. You can also <Link to="/jobs">browse all open jobs</Link>.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {matchingJobs.map(job => (
              <Link key={job.id} to={`/jobs/${job.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
                  onMouseLeave={e => e.currentTarget.style.boxShadow = 'var(--shadow)'}
                >
                  <h3 style={{ marginBottom: '0.4rem' }}>{job.title}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {job.description}
                  </p>
                  <div className="tag-list">
                    <span className="tag">{job.category}</span>
                    <span className="tag">📍 {job.zip_code}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', alignSelf: 'center' }}>
                      {job.profiles?.full_name}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )
      )}

      {tab === 'responses' && (
        myResponses.length === 0 ? (
          <div className="empty-state">
            <h3>No responses sent yet</h3>
            <p>Browse matching jobs above and send your first response.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {myResponses.map(r => (
              <Link key={r.id} to={`/jobs/${r.job_postings?.id}`} style={{ textDecoration: 'none' }}>
                <div className="card" style={{ cursor: 'pointer', borderLeft: '3px solid var(--green-mid)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <strong>{r.job_postings?.title}</strong>
                    <span className={`badge badge-${r.job_postings?.status}`} style={{ fontSize: '0.75rem' }}>
                      {r.job_postings?.status}
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    {r.message}
                  </p>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Sent {new Date(r.created_at).toLocaleDateString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  )
}
