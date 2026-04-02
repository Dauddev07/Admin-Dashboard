import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Card } from '../components/ui/Card.jsx'
import { Input } from '../components/ui/Input.jsx'
import { MoonIcon, SunIcon } from '../components/icons/NavIcons.jsx'

export default function LoginPage() {
  const { user, ready, login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('alex.morgan@acme.io')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const from = location.state?.from
  const redirectPath =
    from?.pathname && from.pathname !== '/login'
      ? `${from.pathname}${from.search || ''}${from.hash || ''}`
      : '/'

  if (ready && user) {
    return <Navigate to={redirectPath} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await login(email, password)
      navigate(redirectPath, { replace: true })
    } catch (err) {
      setError(err.message || 'Sign-in failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-page__top">
        <span className="login-page__brand">Nexus Dashboard</span>
        <button
          type="button"
          className="top-navbar__icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
      </div>

      <div className="login-page__center">
        <Card className="login-card" padding="lg">
          <h1 className="login-card__title">Sign in</h1>
          <p className="login-card__subtitle">Use the demo accounts below — no backend required.</p>

          <form className="login-form" onSubmit={handleSubmit}>
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="login-form__error">{error}</p>}
            <Button type="submit" fullWidth disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign in'}
            </Button>
          </form>

          <div className="login-demo">
            <p className="login-demo__title">Demo credentials</p>
            <ul className="login-demo__list">
              <li>
                <strong>Admin</strong> — alex.morgan@acme.io / <code>demo</code>
              </li>
              <li>
                <strong>Standard user</strong> — demo@acme.io / <code>demo</code>
              </li>
            </ul>
          </div>
        </Card>
      </div>

      <p className="login-page__footer">Portfolio demo · React + Vite</p>
    </div>
  )
}
