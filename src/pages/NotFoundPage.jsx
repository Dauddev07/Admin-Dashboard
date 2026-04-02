import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div className="not-found">
      <Card className="not-found__card" padding="lg">
        <div className="not-found__code">404</div>
        <h1 className="not-found__title">Page not found</h1>
        <p className="not-found__desc">
          The page you are looking for does not exist or was moved. Check the URL or return to the dashboard.
        </p>
        <Button type="button" onClick={() => navigate('/')}>
          Back to dashboard
        </Button>
      </Card>
    </div>
  )
}
