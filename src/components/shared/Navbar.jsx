import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function Navbar() {
  const { user, profile, signOut } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  async function handleSignOut() {
    await signOut()
    navigate('/')
  }

  const dashPath = profile?.role === 'provider' ? '/dashboard/provider' : '/dashboard/homeowner'

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
            <NavLink to="/jobs" style={navStyle}>Find Help</NavLink>
            <NavLink to="/diy" style={navStyle}>DIY Assistant</NavLink>
            {user ? (
              <>
                {profile?.role === 'homeowner' && (
                  <NavLink to="/post-job" style={navStyle}>Post a Job</NavLink>
                )}
                <NavLink to={dashPath} style={navStyle}>Dashboard</NavLink>
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

      {/* Mobile drawer */}
      {menuOpen && (
        <div style={styles.drawer}>
          <NavLink to="/jobs" style={drawerNavStyle}>Find Help</NavLink>
          <NavLink to="/diy" style={drawerNavStyle}>DIY Assistant</NavLink>
          {user ? (
            <>
              {profile?.role === 'homeowner' && (
                <NavLink to="/post-job" style={drawerNavStyle}>Post a Job</NavLink>
              )}
              <NavLink to={dashPath} style={drawerNavStyle}>Dashboard</NavLink>
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
        @media (min-width: 701px) {
          .rr-hamburger { display: none !important; }
          .rr-drawer { display: none !important; }
        }
        @media (max-width: 700px) {
          .rr-links { display: none !important; }
          .rr-hamburger { display: block !important; }
        }
      `}</style>
    </>
  )
}

function navStyle({ isActive }) {
  return {
    color: isActive ? 'var(--green-light)' : '#fff',
    fontWeight: 600,
    fontSize: '0.95rem',
    textDecoration: 'none',
  }
}

function drawerNavStyle({ isActive }) {
  return {
    color: isActive ? 'var(--green-light)' : '#fff',
    fontWeight: 600,
    fontSize: '1rem',
    textDecoration: 'none',
    padding: '0.5rem 0',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  }
}

const styles = {
  nav: {
    background: 'var(--green-dark)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  inner: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '0 1.25rem',
    height: 64,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '1.5rem',
  },
  logo: {
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 800,
    textDecoration: 'none',
    letterSpacing: '-0.02em',
    flexShrink: 0,
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
  },
  drawer: {
    background: 'var(--green-dark)',
    position: 'sticky',
    top: 64,
    zIndex: 99,
    padding: '1rem 1.25rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  hamburger: {
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.4rem',
    cursor: 'pointer',
    display: 'none',
  },
  signOutBtn: {
    background: 'none',
    border: '1.5px solid rgba(255,255,255,0.5)',
    color: '#fff',
    borderRadius: 'var(--radius)',
    padding: '0.3rem 0.85rem',
    fontSize: '0.9rem',
    fontWeight: 600,
    cursor: 'pointer',
  },
}
