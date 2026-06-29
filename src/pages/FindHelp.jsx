import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { SERVICE_CATEGORIES } from '../lib/constants'

const DEMO_PROVIDERS = [
  { id: 'dp-1', profiles: { full_name: 'Mike Tanner' }, bio: 'Licensed plumber with 12 years experience. I serve rural homeowners across southern Oklahoma. Same-day service available for emergencies.', specialties: ['Plumbing', 'Well & Septic'], zip_codes: ['73401', '73402', '73434'], created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'dp-2', profiles: { full_name: 'Randy Elsworth' }, bio: 'Certified electrician. Residential and farm wiring, panel upgrades, generator hookups. 20+ years in the trade.', specialties: ['Electrical'], zip_codes: ['73401', '73501'], created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'dp-3', profiles: { full_name: 'Dale & Sons Landscaping' }, bio: 'Family-owned lawn and land care service. Mowing, brush clearing, fencing, and tree removal. Free estimates.', specialties: ['Landscaping & Lawn Care', 'Fencing', 'Tree Service'], zip_codes: ['73434', '73401', '73402'], created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'dp-4', profiles: { full_name: 'Gary Hutchins' }, bio: 'General contractor and handyman. 25 years doing everything from roof repairs to full remodels. No job too small.', specialties: ['General Repair / Handyman', 'Roofing', 'Carpentry'], zip_codes: ['73501', '73401'], created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'dp-5', profiles: { full_name: 'CoolAir HVAC Services' }, bio: 'HVAC installation, maintenance, and repair. All makes and models. Emergency service available 7 days a week.', specialties: ['HVAC'], zip_codes: ['73401', '73434', '73501'], created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  { id: 'dp-6', profiles: { full_name: 'Beth Calloway Cleaning' }, bio: 'Residential cleaning, pressure washing, and move-out cleans. Reliable, insured, and locally owned.', specialties: ['Cleaning Services'], zip_codes: ['73434', '73402'], created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
]

export default function FindHelp() {
  const [providers, setProviders] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({ specialty: '', zip_code: '', search: '' })

  useEffect(() => { fetchProviders() }, [filters])

  async function fetchProviders() {
    setLoading(true)
    let q = supabase
      .from('provider_profiles')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })

    if (filters.specialty) q = q.contains('specialties', [filters.specialty])
    if (filters.zip_code) q = q.contains('zip_codes', [filters.zip_code.trim()])

    const { data } = await q
    let real = data || []
    if (filters.search) {
      const s = filters.search.toLowerCase()
      real = real.filter(p => p.profiles?.full_name?.toLowerCase().includes(s) || p.bio?.toLowerCase().includes(s))
    }
    setProviders(real.length > 0 ? real : filterDemos())
    setLoading(false)
  }

  function filterDemos() {
    let demos = [...DEMO_PROVIDERS]
    if (filters.specialty) demos = demos.filter(p => p.specialties.includes(filters.specialty))
    if (filters.zip_code) demos = demos.filter(p => p.zip_codes.includes(filters.zip_code.trim()))
    if (filters.search) {
      const s = filters.search.toLowerCase()
      demos = demos.filter(p => p.profiles.full_name.toLowerCase().includes(s) || p.bio.toLowerCase().includes(s))
    }
    return demos
  }

  const clearFilters = () => setFilters({ specialty: '', zip_code: '', search: '' })
  const hasFilters = filters.specialty || filters.zip_code || filters.search

  return (
    <div className="page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>Find Help</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse local service providers in your area</p>
        </div>
        <Link to="/post-help" className="btn btn-primary">+ Offer Your Services</Link>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div className="form-group" style={{ margin: 0, flex: '2 1 200px' }}>
            <label>Search</label>
            <input type="text" value={filters.search} onChange={e => setFilters(f => ({ ...f, search: e.target.value }))} placeholder="Name, skill, keyword…" />
          </div>
          <div className="form-group" style={{ margin: 0, flex: '1 1 180px' }}>
            <label>Service Type</label>
            <select value={filters.specialty} onChange={e => setFilters(f => ({ ...f, specialty: e.target.value }))}>
              <option value="">All Services</option>
              {SERVICE_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-group" style={{ margin: 0, flex: '0 1 150px' }}>
            <label>Zip Code</label>
            <input type="text" value={filters.zip_code} onChange={e => setFilters(f => ({ ...f, zip_code: e.target.value }))} placeholder="73401" maxLength={5} />
          </div>
          {hasFilters && <button className="btn btn-outline btn-sm" onClick={clearFilters} style={{ marginBottom: '1.1rem' }}>Clear</button>}
        </div>
      </div>

      {loading ? (
        <SkeletonList />
      ) : providers.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>No providers match your search</h3>
          <p style={{ marginBottom: '1.25rem' }}>Try different filters or be the first to offer services in this area.</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
            <Link to="/post-help" className="btn btn-primary">Offer Your Services</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {providers.map(p => <ProviderCard key={p.id} provider={p} />)}
        </div>
      )}
    </div>
  )
}

function ProviderCard({ provider }) {
  const isDemo = String(provider.id).startsWith('dp-')
  const name = provider.profiles?.full_name || 'Local Provider'
  return (
    <Link to={isDemo ? '/signup' : `/providers/${provider.id}`} style={{ textDecoration: 'none' }}>
      <div className="card" style={{ cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-md)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'none' }}
      >
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--green-pale)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'var(--green-dark)', fontSize: '1.1rem', flexShrink: 0 }}>
            {name[0].toUpperCase()}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ marginBottom: '0.25rem' }}>{name}</h3>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {provider.zip_codes?.slice(0, 2).map(z => <span key={z} className="tag">📍 {z}</span>)}
                {provider.zip_codes?.length > 2 && <span className="tag">+{provider.zip_codes.length - 2} more</span>}
              </div>
            </div>
            {provider.bio && (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '0.75rem', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {provider.bio}
              </p>
            )}
            <div className="tag-list">
              {provider.specialties?.slice(0, 4).map(s => <span key={s} className="tag">{s}</span>)}
              {provider.specialties?.length > 4 && <span className="tag">+{provider.specialties.length - 4} more</span>}
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}

function SkeletonList() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="card" style={{ display: 'flex', gap: '1rem' }}>
          <span className="skeleton" style={{ width: 48, height: 48, borderRadius: '50%', flexShrink: 0 }} />
          <div style={{ flex: 1 }}>
            <span className="skeleton" style={{ display: 'block', width: 160, height: 20, marginBottom: 10 }} />
            <span className="skeleton" style={{ display: 'block', width: '80%', height: 16, marginBottom: 6 }} />
            <span className="skeleton" style={{ display: 'block', width: '60%', height: 16, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <span className="skeleton" style={{ display: 'block', width: 70, height: 24, borderRadius: 999 }} />
              <span className="skeleton" style={{ display: 'block', width: 90, height: 24, borderRadius: 999 }} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
