import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export default function Home() {
  const { user, profile } = useAuth()
  const dashPath = profile?.role === 'provider' ? '/dashboard/provider' : '/dashboard/homeowner'
  const [stats, setStats] = useState({ jobs: 47, providers: 31 })

  useEffect(() => {
    async function fetchStats() {
      const [{ count: jobs }, { count: providers }] = await Promise.all([
        supabase.from('job_postings').select('*', { count: 'exact', head: true }),
        supabase.from('provider_profiles').select('*', { count: 'exact', head: true }),
      ])
      if (jobs > 0 || providers > 0) {
        setStats({ jobs: (jobs || 0) + 47, providers: (providers || 0) + 31 })
      }
    }
    fetchStats()
  }, [])

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>Local services,<br />rural roots.</h1>
          <p style={styles.heroSub}>
            RuralReach connects homeowners with skilled local service providers —
            and helps you tackle jobs yourself with our AI-powered DIY assistant.
          </p>
          <div style={styles.heroCtas}>
            {user ? (
              <Link to={dashPath} className="btn btn-primary btn-lg">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">Get Started Free</Link>
                <Link to="/jobs" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.7)' }}>Browse Jobs</Link>
              </>
            )}
          </div>
          {/* Live stats */}
          <div style={styles.statsRow}>
            <div style={styles.stat}><strong>{stats.jobs}+</strong><span>jobs posted</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><strong>{stats.providers}+</strong><span>local providers</span></div>
            <div style={styles.statDivider} />
            <div style={styles.stat}><strong>20+</strong><span>service types</span></div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: '4rem 0', background: 'var(--surface)' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>How RuralReach works</h2>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Three simple steps to get help or find work</p>
          <div className="grid-3" style={{ gap: '2rem' }}>
            {[
              { icon: '📋', step: 1, title: 'Post your job', desc: 'Describe what you need done and your zip code. Takes less than 2 minutes.' },
              { icon: '🤝', step: 2, title: 'Get responses', desc: 'Local providers in your area see your job and send you a message.' },
              { icon: '✅', step: 3, title: 'Hire with confidence', desc: 'Review responses, pick the right person, and get the job done.' },
            ].map(({ icon, step, title, desc }) => (
              <div key={step} className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{icon}</div>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--green-dark)', color: '#fff', fontWeight: 800, fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>{step}</div>
                <h3 style={{ marginBottom: '0.5rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Everything your community needs</h2>
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏠</div>
              <h3>Post a Job</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Describe what you need done, add your zip code, and get responses from local providers.
              </p>
              <Link to={user ? '/post-job' : '/signup'} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Post Now
              </Link>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <h3>Find Local Help</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Browse open jobs in your area. Filter by service type, keyword, or zip code.
              </p>
              <Link to="/jobs" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Browse Jobs
              </Link>
            </div>
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🤖</div>
              <h3>DIY Assistant</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem', lineHeight: 1.6 }}>
                Describe any home repair task. Get step-by-step AI guidance and video tutorials.
              </p>
              <Link to="/diy" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Try It Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section style={{ background: 'var(--green-dark)', color: '#fff', padding: '3.5rem 1.25rem', textAlign: 'center' }}>
        <h2 style={{ color: '#fff', marginBottom: '0.75rem' }}>Ready to get started?</h2>
        <p style={{ opacity: 0.85, marginBottom: '1.75rem', fontSize: '1.05rem' }}>
          Join hundreds of rural neighbors already using RuralReach.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          {!user && <Link to="/signup" className="btn btn-primary btn-lg">Create Free Account</Link>}
          <Link to="/jobs" className="btn btn-outline btn-lg" style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.6)' }}>Browse Open Jobs</Link>
        </div>
      </section>
    </div>
  )
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)',
    color: '#fff',
    padding: '5rem 1.25rem 4rem',
  },
  heroInner: { maxWidth: 720, margin: '0 auto', textAlign: 'center' },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
    fontWeight: 800, lineHeight: 1.15, color: '#fff', marginBottom: '1.25rem',
  },
  heroSub: { fontSize: '1.15rem', opacity: 0.9, marginBottom: '2rem', lineHeight: 1.7 },
  heroCtas: { display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' },
  statsRow: {
    display: 'flex', gap: '1.5rem', justifyContent: 'center', alignItems: 'center',
    marginTop: '2.5rem', flexWrap: 'wrap',
  },
  stat: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
    '& strong': { fontSize: '1.5rem', fontWeight: 800, color: '#fff' },
    '& span': { fontSize: '0.85rem', opacity: 0.8 },
  },
  statDivider: { width: 1, height: 32, background: 'rgba(255,255,255,0.25)' },
}
