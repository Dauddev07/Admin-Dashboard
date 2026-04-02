import { useCallback, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar.jsx'
import { TopNavbar } from './TopNavbar.jsx'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isMobile = useMediaQuery('(max-width: 900px)')

  const sidebarOffset = isMobile ? 0 : collapsed ? 72 : 260

  const onToggleCollapse = useCallback(() => setCollapsed((c) => !c), [])
  const onCloseMobile = useCallback(() => setMobileOpen(false), [])

  return (
    <div className="layout-shell">
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
        mobileOpen={mobileOpen}
        onCloseMobile={onCloseMobile}
      />
      <div
        className="layout-main"
        style={{ marginLeft: isMobile ? 0 : sidebarOffset }}
      >
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <TopNavbar onMenuClick={() => setMobileOpen(true)} />
        <main id="main-content" className="layout-content" tabIndex={-1}>
          <Outlet />
        </main>
        <footer className="app-footer">
          <p className="app-footer__inner">
            <span className="app-footer__brand">Nexus Dashboard</span>
            <span className="app-footer__sep" aria-hidden>
              ·
            </span>
            <span>Portfolio demo — data is simulated. Built with React, Vite, and Recharts.</span>
          </p>
        </footer>
      </div>
    </div>
  )
}
