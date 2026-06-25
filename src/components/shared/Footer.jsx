import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.inner}>
        <div style={styles.brand}>
          <span style={styles.logo}>🌾 RuralReach</span>
          <p style={styles.tagline}>Connecting rural communities with trusted local services.</p>
        </div>
        <div style={styles.links}>
          <div style={styles.col}>
            <strong>Platform</strong>
            <Link to="/jobs">Find Help</Link>
            <Link to="/post-job">Post a Job</Link>
            <Link to="/diy">DIY Assistant</Link>
          </div>
          <div style={styles.col}>
            <strong>Account</strong>
            <Link to="/signup">Sign Up</Link>
            <Link to="/login">Log In</Link>
          </div>
        </div>
      </div>
      <div style={styles.bottom}>
        © {new Date().getFullYear()} RuralReach. Built to serve rural communities.
      </div>
    </footer>
  )
}

const styles = {
  footer: {
    background: 'var(--green-dark)',
    color: 'rgba(255,255,255,0.85)',
    marginTop: '4rem',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '3rem 1.25rem 2rem',
    display: 'flex',
    gap: '3rem',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  brand: { maxWidth: 280 },
  logo: { fontSize: '1.2rem', fontWeight: 800, color: '#fff' },
  tagline: { marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.75, lineHeight: 1.6 },
  links: { display: 'flex', gap: '3rem', flexWrap: 'wrap' },
  col: { display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem',
    '& a': { color: 'rgba(255,255,255,0.75)', textDecoration: 'none' } },
  bottom: {
    borderTop: '1px solid rgba(255,255,255,0.1)',
    padding: '1rem 1.25rem',
    textAlign: 'center',
    fontSize: '0.8rem',
    opacity: 0.6,
    maxWidth: 1100,
    margin: '0 auto',
  },
}
