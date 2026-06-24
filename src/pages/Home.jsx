import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function Home() {
  const { user, profile } = useAuth()
  const dashPath = profile?.role === 'provider' ? '/dashboard/provider' : '/dashboard/homeowner'

  return (
    <div>
      {/* Hero */}
      <section style={styles.hero}>
        <div style={styles.heroInner}>
          <h1 style={styles.heroTitle}>
            Local services,<br />rural roots.
          </h1>
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
        </div>
      </section>

      {/* Feature cards */}
      <section style={styles.features}>
        <div className="container">
          <div className="grid-3" style={{ gap: '1.5rem' }}>
            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>🏠</div>
              <h3>Post a Job</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Describe what you need done, add your zip code, and get responses from local providers.
              </p>
              <Link to={user ? '/post-job' : '/signup'} className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Post Now
              </Link>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>🔍</div>
              <h3>Find Local Help</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Browse open jobs in your area. Filter by service type and zip code.
              </p>
              <Link to="/jobs" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Browse Jobs
              </Link>
            </div>

            <div className="card" style={styles.featureCard}>
              <div style={styles.featureIcon}>🤖</div>
              <h3>DIY Assistant</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                Describe any home repair task. Get step-by-step AI guidance and video tutorials.
              </p>
              <Link to="/diy" className="btn btn-secondary btn-sm" style={{ marginTop: '1rem' }}>
                Try It Free
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={styles.howItWorks}>
        <div className="container">
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>How it works</h2>
          <div className="grid-2" style={{ gap: '3rem', alignItems: 'start' }}>
            <div>
              <h3 style={{ color: 'var(--green-dark)', marginBottom: '1rem' }}>For Homeowners</h3>
              {['Sign up and describe your job', 'Get responses from local providers', 'Hire the right person for your needs', 'Or try the DIY Assistant first'].map((step, i) => (
                <div key={i} style={styles.step}>
                  <span style={styles.stepNum}>{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ color: 'var(--green-dark)', marginBottom: '1rem' }}>For Service Providers</h3>
              {['Sign up and create your provider profile', 'Set your service area (zip codes)', 'Browse open jobs in your categories', 'Send a message to interested homeowners'].map((step, i) => (
                <div key={i} style={styles.step}>
                  <span style={styles.stepNum}>{i + 1}</span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

const styles = {
  hero: {
    background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green-mid) 100%)',
    color: '#fff',
    padding: '5rem 1.25rem',
  },
  heroInner: {
    maxWidth: 680,
    margin: '0 auto',
    textAlign: 'center',
  },
  heroTitle: {
    fontSize: 'clamp(2rem, 5vw, 3.25rem)',
    fontWeight: 800,
    lineHeight: 1.15,
    color: '#fff',
    marginBottom: '1.25rem',
  },
  heroSub: {
    fontSize: '1.15rem',
    opacity: 0.9,
    marginBottom: '2rem',
    lineHeight: 1.7,
  },
  heroCtas: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  features: {
    padding: '4rem 0',
  },
  featureCard: {
    textAlign: 'center',
    padding: '2rem',
  },
  featureIcon: {
    fontSize: '2.5rem',
    marginBottom: '0.75rem',
  },
  howItWorks: {
    padding: '4rem 0',
    background: 'var(--surface)',
  },
  step: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '0.85rem',
    marginBottom: '0.85rem',
    fontSize: '0.97rem',
  },
  stepNum: {
    flexShrink: 0,
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--green-pale)',
    color: 'var(--green-dark)',
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.85rem',
  },
}
