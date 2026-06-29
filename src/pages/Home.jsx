import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const CATEGORIES = [
  { icon: '🔧', label: 'Plumbing' },
  { icon: '⚡', label: 'Electrical' },
  { icon: '❄️', label: 'HVAC' },
  { icon: '🌿', label: 'Landscaping' },
  { icon: '🏗️', label: 'Carpentry' },
  { icon: '🐛', label: 'Pest Control' },
  { icon: '🌳', label: 'Tree Service' },
  { icon: '🎨', label: 'Painting' },
  { icon: '🚜', label: 'Farm Equipment' },
  { icon: '💧', label: 'Well & Septic' },
  { icon: '🏠', label: 'General Repair' },
  { icon: '🛻', label: 'Moving & Hauling' },
]

const TESTIMONIALS = [
  {
    quote: "Found a plumber within 2 hours of posting. He fixed our well pump the same day. Couldn't have asked for better.",
    name: 'Sandra M.',
    location: 'Ardmore, OK',
    role: 'Homeowner',
  },
  {
    quote: "RuralReach helped me find consistent work in my county. I've picked up 6 jobs this month alone.",
    name: 'Dale Hutchins',
    location: 'Sulphur, OK',
    role: 'Electrician',
  },
  {
    quote: "The DIY assistant walked me through fixing my water heater step by step. Saved me $400 in service fees.",
    name: 'Tanya R.',
    location: 'Tishomingo, OK',
    role: 'Homeowner',
  },
]

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
      if ((jobs || 0) + (providers || 0) > 0) {
        setStats({ jobs: (jobs || 0) + 47, providers: (providers || 0) + 31 })
      }
    }
    fetchStats()
  }, [])

  return (
    <div>

      {/* ── Hero ───────────────────────────────────── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroBadge}>🌾 Built for rural communities</div>
          <h1 style={s.heroTitle}>
            Find trusted local help,<br />right in your community.
          </h1>
          <p style={s.heroSub}>
            RuralReach connects homeowners with skilled local service providers across rural America.
            Post a job, get responses, or tackle it yourself with our AI-powered DIY assistant.
          </p>
          <div style={s.heroCtas}>
            {user ? (
              <Link to={dashPath} className="btn btn-primary btn-lg">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">Get Started — It's Free</Link>
                <Link to="/jobs" className="btn btn-lg" style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  Browse Open Jobs
                </Link>
              </>
            )}
          </div>

          {/* Stats bar */}
          <div style={s.statsBar}>
            <div style={s.statItem}>
              <span style={s.statNum}>{stats.jobs}+</span>
              <span style={s.statLabel}>jobs posted</span>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <span style={s.statNum}>{stats.providers}+</span>
              <span style={s.statLabel}>local providers</span>
            </div>
            <div style={s.statDivider} />
            <div style={s.statItem}>
              <span style={s.statNum}>20+</span>
              <span style={s.statLabel}>service types</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── What is RuralReach ─────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--green-mid)', marginBottom: '1rem' }}>What is RuralReach?</p>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '1.25rem', lineHeight: 1.2 }}>
            The local services marketplace built for small towns and rural areas
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
            In rural communities, finding a reliable plumber, electrician, or handyman shouldn't mean
            scrolling through big-city apps that don't serve your area. RuralReach is a platform built
            specifically for small towns — where homeowners post what they need and local providers
            who actually live nearby respond.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/jobs" className="btn btn-secondary">Browse Open Jobs</Link>
            <Link to="/diy" className="btn btn-outline">Try the DIY Assistant</Link>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={s.sectionTag}>Simple process</p>
          <h2 style={s.sectionTitle}>How it works in 3 steps</h2>
          <p style={s.sectionSub}>Get help or find work — no complicated setup required</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            {[
              { icon: '📋', num: '01', title: 'Post your job', desc: 'Describe what you need done, pick a category, and add your zip code. Takes under 2 minutes.' },
              { icon: '📬', num: '02', title: 'Receive responses', desc: 'Local service providers in your zip code see your job and send you a message directly.' },
              { icon: '✅', num: '03', title: 'Hire with confidence', desc: 'Review who responded, choose the right person, and mark the job done when finished.' },
            ].map(({ icon, num, title, desc }) => (
              <div key={num} className="card" style={{ padding: '2rem', position: 'relative', overflow: 'hidden' }}>
                <div style={{ fontSize: '2.25rem', marginBottom: '1rem' }}>{icon}</div>
                <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--border)', position: 'absolute', top: 12, right: 20, lineHeight: 1, userSelect: 'none' }}>{num}</div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1.05rem' }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.7 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── For homeowners vs providers ────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={s.sectionTag}>Two sides of the marketplace</p>
          <h2 style={s.sectionTitle}>Whether you need help or give it</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '2.5rem' }}>

            {/* Homeowners */}
            <div style={{ ...s.splitCard, borderTop: `4px solid var(--green-dark)` }}>
              <div style={s.splitIcon}>🏡</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>For Homeowners</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
                Stop searching online and hoping for the best. Post your job and let local providers come to you.
              </p>
              <ul style={s.featureList}>
                {['Post jobs in under 2 minutes', 'Get responses from local providers', 'Manage all your jobs in one dashboard', 'Use the AI assistant for small fixes'].map(f => (
                  <li key={f} style={s.featureItem}><span style={s.check}>✓</span>{f}</li>
                ))}
              </ul>
              <Link to={user ? '/post-job' : '/signup'} className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
                Post a Job
              </Link>
            </div>

            {/* Providers */}
            <div style={{ ...s.splitCard, borderTop: `4px solid var(--orange)` }}>
              <div style={s.splitIcon}>🛠️</div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>For Service Providers</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: 1.7 }}>
                Find paying work in your area without expensive advertising. Just set your zip codes and specialties.
              </p>
              <ul style={s.featureList}>
                {['Browse jobs that match your skills', 'Set the zip codes you serve', 'Send messages to interested homeowners', 'Track your responses in one place'].map(f => (
                  <li key={f} style={s.featureItem}><span style={s.check}>✓</span>{f}</li>
                ))}
              </ul>
              <Link to={user ? '/dashboard/provider' : '/signup'} className="btn btn-orange" style={{ marginTop: '1.5rem' }}>
                Find Work Near You
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Service categories ─────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={s.sectionTag}>20+ categories</p>
          <h2 style={s.sectionTitle}>Every service your home needs</h2>
          <p style={s.sectionSub}>From plumbing to farm equipment — if it's a job, someone local can do it</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '2rem' }}>
            {CATEGORIES.map(({ icon, label }) => (
              <Link key={label} to={`/jobs`} style={{ textDecoration: 'none' }}>
                <div style={s.catCard}>
                  <span style={{ fontSize: '1.6rem' }}>{icon}</span>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', textAlign: 'center', lineHeight: 1.3 }}>{label}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI DIY Assistant highlight ─────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'linear-gradient(135deg, var(--green-dark) 0%, #1a4d35 100%)', color: '#fff' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'inline-block', background: 'rgba(255,255,255,0.12)', borderRadius: 8, padding: '0.3rem 0.8rem', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.25rem' }}>
              ✨ AI-Powered
            </div>
            <h2 style={{ color: '#fff', fontSize: 'clamp(1.4rem, 3vw, 2rem)', marginBottom: '1rem', lineHeight: 1.25 }}>
              Fix it yourself with the DIY Assistant
            </h2>
            <p style={{ opacity: 0.85, lineHeight: 1.8, marginBottom: '1.5rem', fontSize: '1rem' }}>
              Not every job needs a pro. Describe your problem and our AI assistant gives you
              step-by-step repair guidance, safety tips, and a tool list — instantly.
            </p>
            <ul style={{ listStyle: 'none', marginBottom: '1.75rem' }}>
              {['Step-by-step repair instructions', 'Safety warnings and tool lists', 'Powered by GPT-4o'].map(f => (
                <li key={f} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem', fontSize: '0.95rem', opacity: 0.9 }}>
                  <span style={{ color: 'var(--green-light)', fontWeight: 700 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <Link to="/diy" className="btn btn-lg" style={{ background: '#fff', color: 'var(--green-dark)', fontWeight: 700 }}>
              Try the DIY Assistant →
            </Link>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.07)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.12)', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <div style={{ fontSize: '0.75rem', opacity: 0.5, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Example conversation</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '12px 12px 12px 4px', padding: '0.75rem 1rem', fontSize: '0.9rem', maxWidth: '85%' }}>
                My kitchen faucet keeps dripping even when turned off. How do I fix it?
              </div>
              <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '12px 12px 4px 12px', padding: '0.75rem 1rem', fontSize: '0.9rem', maxWidth: '90%', alignSelf: 'flex-end' }}>
                <strong>Step 1:</strong> Turn off the water supply valves under the sink.<br />
                <strong>Step 2:</strong> Remove the faucet handle — usually a screw under the cap...<br />
                <span style={{ opacity: 0.7, fontSize: '0.82rem' }}>+ full repair guide, tool list & safety tips</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <p style={s.sectionTag}>What neighbors are saying</p>
          <h2 style={s.sectionTitle}>Real stories from real communities</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', marginTop: '2.5rem' }}>
            {TESTIMONIALS.map(({ quote, name, location, role }) => (
              <div key={name} className="card" style={{ padding: '1.75rem' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '1rem', color: 'var(--green-light)' }}>"</div>
                <p style={{ fontSize: '0.97rem', lineHeight: 1.75, color: 'var(--text)', marginBottom: '1.25rem' }}>{quote}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--green-dark)', fontSize: '0.95rem', flexShrink: 0 }}>
                    {name[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{role} · {location}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────── */}
      <section style={{ padding: '5rem 1.5rem', background: 'var(--bg)', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
          <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: '1rem' }}>
            Your community is waiting
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.7, marginBottom: '2rem' }}>
            Join homeowners and local providers across rural America who are already using RuralReach to get things done.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {user ? (
              <Link to={dashPath} className="btn btn-primary btn-lg">Go to Dashboard</Link>
            ) : (
              <>
                <Link to="/signup" className="btn btn-primary btn-lg">Create Free Account</Link>
                <Link to="/jobs" className="btn btn-outline btn-lg">Browse Jobs</Link>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

const s = {
  hero: {
    background: 'linear-gradient(160deg, #0f3d25 0%, var(--green-dark) 50%, var(--green-mid) 100%)',
    color: '#fff',
    padding: 'clamp(3rem, 8vw, 6rem) 1.5rem clamp(2.5rem, 6vw, 5rem)',
  },
  heroInner: { maxWidth: 740, margin: '0 auto', textAlign: 'center' },
  heroBadge: {
    display: 'inline-block',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: 999,
    padding: '0.3rem 1rem',
    fontSize: '0.82rem',
    fontWeight: 600,
    letterSpacing: '0.03em',
    marginBottom: '1.5rem',
  },
  heroTitle: {
    fontSize: 'clamp(1.9rem, 5vw, 3.5rem)',
    fontWeight: 900,
    lineHeight: 1.1,
    color: '#fff',
    marginBottom: '1.25rem',
    letterSpacing: '-0.03em',
  },
  heroSub: {
    fontSize: 'clamp(1rem, 2vw, 1.15rem)',
    opacity: 0.88,
    marginBottom: '2rem',
    lineHeight: 1.75,
    maxWidth: 600,
    margin: '0 auto 2rem',
  },
  heroCtas: { display: 'flex', gap: '0.85rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '0' },
  statsBar: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: '2.75rem',
    flexWrap: 'wrap',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: 16,
    padding: '1.25rem 2rem',
    border: '1px solid rgba(255,255,255,0.12)',
    backdropFilter: 'blur(8px)',
  },
  statItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' },
  statNum: { fontSize: 'clamp(1.25rem, 3vw, 1.75rem)', fontWeight: 900, color: '#fff' },
  statLabel: { fontSize: '0.8rem', opacity: 0.7, fontWeight: 500 },
  statDivider: { width: 1, height: 36, background: 'rgba(255,255,255,0.2)' },
  sectionTag: {
    fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.1em',
    textTransform: 'uppercase', color: 'var(--green-mid)', marginBottom: '0.75rem',
  },
  sectionTitle: {
    fontSize: 'clamp(1.4rem, 3vw, 2rem)', fontWeight: 800,
    letterSpacing: '-0.02em', marginBottom: '0.75rem', lineHeight: 1.2,
  },
  sectionSub: { color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.7 },
  splitCard: {
    background: 'var(--bg)',
    borderRadius: 16,
    padding: '2rem',
    display: 'flex',
    flexDirection: 'column',
  },
  splitIcon: { fontSize: '2.5rem', marginBottom: '1rem' },
  featureList: { listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' },
  featureItem: { display: 'flex', alignItems: 'flex-start', gap: '0.6rem', fontSize: '0.93rem', color: 'var(--text)' },
  check: { color: 'var(--green-dark)', fontWeight: 700, flexShrink: 0 },
  catCard: {
    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
    padding: '1rem 0.75rem', background: 'var(--surface)',
    border: '1.5px solid var(--border)', borderRadius: 12,
    transition: 'all 0.15s', cursor: 'pointer',
    ':hover': { borderColor: 'var(--green-mid)', background: 'var(--green-pale)' },
  },
}
