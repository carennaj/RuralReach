import { Navigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'

export default function ProtectedRoute({ children, role }) {
  const { user, profile, loading } = useAuth()

  if (loading) return <div className="spinner" />

  if (!user) return <Navigate to="/login" state={{ from: window.location.pathname }} replace />

  if (role && profile?.role !== role) {
    const redirect = profile?.role === 'provider' ? '/dashboard/provider' : '/dashboard/homeowner'
    return <Navigate to={redirect} replace />
  }

  return children
}
