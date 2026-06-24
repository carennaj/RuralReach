import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Navbar from './components/shared/Navbar'
import Footer from './components/shared/Footer'
import ProtectedRoute from './components/shared/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProviderOnboarding from './pages/ProviderOnboarding'
import HomeownerDashboard from './pages/HomeownerDashboard'
import ProviderDashboard from './pages/ProviderDashboard'
import PostJob from './pages/PostJob'
import FindHelp from './pages/FindHelp'
import JobDetail from './pages/JobDetail'
import DIYAssistant from './pages/DIYAssistant'
import NotFound from './pages/NotFound'

export default function App() {
  const { loading } = useAuth()

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><div className="spinner" /></div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/jobs" element={<FindHelp />} />
        <Route path="/jobs/:id" element={<JobDetail />} />
        <Route path="/diy" element={<DIYAssistant />} />

        <Route path="/onboarding" element={
          <ProtectedRoute role="provider"><ProviderOnboarding /></ProtectedRoute>
        } />
        <Route path="/post-job" element={
          <ProtectedRoute role="homeowner"><PostJob /></ProtectedRoute>
        } />
        <Route path="/dashboard/homeowner" element={
          <ProtectedRoute role="homeowner"><HomeownerDashboard /></ProtectedRoute>
        } />
        <Route path="/dashboard/provider" element={
          <ProtectedRoute role="provider"><ProviderDashboard /></ProtectedRoute>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}
