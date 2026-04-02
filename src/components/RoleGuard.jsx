import { useAuth } from '../context/AuthContext.jsx'
import { Card } from './ui/Card.jsx'

export function AdminRoute({ children }) {
  const { isAdmin } = useAuth()
  if (!isAdmin) {
    return (
      <div className="access-restricted">
        <Card padding="md">
          <h2 className="card-title">Access restricted</h2>
          <p className="card-subtitle role-hint">
            This area is only available to administrators. Switch role to Admin in Settings to preview the full
            experience.
          </p>
        </Card>
      </div>
    )
  }
  return children
}
