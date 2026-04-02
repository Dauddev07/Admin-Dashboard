import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { Skeleton } from './ui/Skeleton.jsx'

function AuthChecking() {
  return (
    <div className="auth-checking" role="status" aria-live="polite" aria-label="Loading session">
      <Skeleton height="2rem" width="40%" style={{ margin: '0 auto 1rem' }} />
      <Skeleton height="8rem" width="100%" style={{ maxWidth: '400px', margin: '0 auto' }} />
    </div>
  )
}

export function RequireAuth() {
  const { user, ready } = useAuth()
  const location = useLocation()

  if (!ready) {
    return <AuthChecking />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
