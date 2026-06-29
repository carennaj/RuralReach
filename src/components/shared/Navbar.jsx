import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const dashPath = profile?.role === 'provider' ? '/dashboard/provider' : '/dashboard/homeowner'
  const isProvider = profile?.role === 'provider'
  const isHomeowner = profile?.role === 'homeowner'

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>
          <Link to="/" style={styles.logo}>🌾 RuralReach</Link>

          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? '✕' : '☰'}
          </button>

          <div style={styles.links}>
            <NavLink to="/help" style={navStyle}>Find Help</NavLink>
            <NavLink to="/jobs" style={navStyle}>Find a Job</NavLink>
            <NavLink to="/diy" style={navStyle}>DIY Assistant</NavLink>

            {user ? (
              <>
                {isHomeowner && <NavLink to="/post-job" style={navStyle}>Post a Job</NavLink>}
                {isProvider && <NavLink to="/post-help" style={navStyle}>Post Help</NavLink>}
                <NavLink to={dashPath} style={navStyle}>Dashboard</NavLink>
                <NavLink to="/profile" style={navStyle}>Profile</NavLink>
                <button onClick={handleSignOut} style={styles.signOutBtn}>Sign Out</button>
              </>
            ) : (
              <>
                <NavLink to="/login" style={navStyle}>Login</NavLink>
                <Link to="/signup" className="btn btn-primary btn-sm">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div style={styles.drawer}>
          <NavLink to="/help" style={drawerNavStyle}>Find Help</NavLink>
          <NavLink to="/jobs" style={drawerNavStyle}>Find a Job</NavLink>
          <NavLink to="/diy" style={drawerNavStyle}>DIY Assistant</NavLink>
          {user ? (
            <>
              {isHomeowner && <NavLink to="/post-job" style={drawerNavStyle}>Post a Job</NavLink>}
              {isProvider && <NavLink to="/post-help" style={drawerNavStyle}>Post Help</NavLink>}
              <NavLink to={dashPath} style={drawerNavStyle}>Dashboard</NavLink>
              <NavLink to="/profile" style={drawerNavStyle}>Profile</NavLink>
              <button onClick={handleSignOut} style={{ ...styles.signOutBtn, marginTop: '0.5rem', width: '100%' }}>Sign Out</button>
            </>
          ) : (
            <>
              <NavLink to="/login" style={drawerNavStyle}>Login</NavLink>
              <Link to="/signup" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Sign Up</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (max-width: 820px) {
          .rr-links { display: none !important; }
          .rr-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  )
}

function navStyle({ isActive }) {
  return {
    color: isActive ? '#fff' : 'rgba(255,255,255,0.75)',
    fontWeight: 600,
    fontSize: '0.88rem',
    textDecoration: 'none',
    padding: '0.35rem 0.65rem',
    borderRadius: '8px',
    background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
    transition: 'all 0.15s',
    whiteSpace: 'nowrap',
  }
}

function drawerNavStyle({ isActive }) {
  return {
    color: isActive ? '#fff' : 'rgba(255,255,255,0.8)',
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
    padding: '0.65rem 0.75rem',
    borderRadius: '8px',
    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
    display: 'block',
  }
}

const styles = {
  nav: {
    background: 'rgba(27, 94, 59, 0.97)',
    backdropFilter: 'blur(12px)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 1px 0 rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.18)',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 1.5rem',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1rem',
  },
  logo: {
    color: '#fff',
    fontSize: '1.15rem',
    fontWeight: 800,
    textDecoration: 'none',
    letterSpacing: '-0.02em',
    flexShrink: 0,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.15rem',
    flexWrap: 'nowrap',
  },
  drawer: {
    background: 'var(--green-dark)',
    position: 'sticky',
    top: 64,
    zIndex: 99,
    padding: '0.75rem 1.5rem 1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.15rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
    borderTop: '1px solid rgba(255,255,255,0.08)',
  },
  hamburger: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
    display: 'none',
    borderRadius: '8px',
    width: 38,
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  signOutBtn: {
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.2)',
    color: '#fff',
    borderRadius: '8px',
    padding: '0.35rem 0.9rem',
    fontSize: '0.88rem',
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
}
