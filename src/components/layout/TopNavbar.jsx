import { useMemo, useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext.jsx'
import { useTheme } from '../../context/ThemeContext.jsx'
import { formatRelativeTime } from '../../utils/format.js'
import { notificationsSeed } from '../../data/mockData.js'
import { Button } from '../ui/Button.jsx'
import { BellIcon, MenuIcon, MoonIcon, SunIcon } from '../icons/NavIcons.jsx'

export function TopNavbar({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { theme, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const notifRef = useRef(null)
  const profileRef = useRef(null)

  const notifications = useMemo(() => notificationsSeed, [])

  useEffect(() => {
    const onDoc = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false)
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className="top-navbar">
      <button type="button" className="top-navbar__menu-btn" aria-label="Open menu" onClick={onMenuClick}>
        <MenuIcon />
      </button>

      <div className="top-navbar__spacer" aria-hidden />

      <div className="top-navbar__actions">
        <button
          type="button"
          className="top-navbar__icon-btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>

        <div className="top-navbar__rel" ref={notifRef}>
          <button
            type="button"
            className="top-navbar__icon-btn"
            aria-label="Notifications"
            aria-expanded={notifOpen}
            title="View notifications"
            onClick={() => {
              setNotifOpen((v) => !v)
              setProfileOpen(false)
            }}
          >
            <BellIcon />
            {unread > 0 && <span className="top-navbar__dot" aria-hidden />}
          </button>
          {notifOpen && (
            <div className="top-navbar__dropdown">
              <div className="top-navbar__dropdown-title">Notifications</div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`top-navbar__notif-item ${!n.read ? 'top-navbar__notif-item--unread' : ''}`.trim()}
                >
                  <div className="top-navbar__notif-title">{n.title}</div>
                  <div className="top-navbar__notif-body">{n.body}</div>
                  <div className="top-navbar__notif-time">{formatRelativeTime(n.at)}</div>
                </div>
              ))}
              <div className="top-navbar__dropdown-footer">
                <Button type="button" variant="ghost" size="sm" onClick={() => setNotifOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="top-navbar__rel" ref={profileRef}>
          <button
            type="button"
            className="top-navbar__profile"
            aria-expanded={profileOpen}
            title="Account menu"
            onClick={() => {
              setProfileOpen((v) => !v)
              setNotifOpen(false)
            }}
          >
            <span className="top-navbar__avatar">
              {user.name
                .split(' ')
                .map((p) => p[0])
                .join('')
                .slice(0, 2)
                .toUpperCase()}
            </span>
            <span className="top-navbar__profile-name">{user.name}</span>
          </button>
          {profileOpen && (
            <div className="top-navbar__dropdown top-navbar__dropdown--narrow">
              <div className="top-navbar__menu-meta">Signed in as</div>
              <div className="top-navbar__menu-strong">{user.email}</div>
              <div className="top-navbar__menu-divider" />
              <button
                type="button"
                className="top-navbar__menu-item"
                onClick={() => {
                  setProfileOpen(false)
                  logout()
                  navigate('/login', { replace: true })
                }}
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
