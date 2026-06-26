import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="page" style={{ textAlign: 'center', paddingTop: '5rem' }}>
      <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌾</div>
      <h1 style={{ marginBottom: '0.5rem' }}>Page not found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
        Looks like you wandered off the beaten path.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="btn btn-primary">Go Home</Link>
        <Link to="/jobs" className="btn btn-outline">Browse Jobs</Link>
        <Link to="/diy" className="btn btn-secondary">DIY Assistant</Link>
      </div>
    </div>
  )
}
