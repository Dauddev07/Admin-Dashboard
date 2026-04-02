import { NavLink } from 'react-router-dom'
import { NAV_ITEMS } from '../../utils/constants.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { NavIcon, ChevronLeftIcon } from '../icons/NavIcons.jsx'

export function Sidebar({ collapsed, onToggleCollapse, mobileOpen, onCloseMobile }) {
  const { user, isAdmin } = useAuth()
  const isMobile = useMediaQuery('(max-width: 900px)')
  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role))
  const effectiveCollapsed = isMobile ? false : collapsed
  const width = effectiveCollapsed ? 'var(--sidebar-w-collapsed)' : 'var(--sidebar-w)'

  return (
    <>
      {isMobile && mobileOpen && (
        <button type="button" className="sidebar-overlay" aria-label="Close menu" onClick={onCloseMobile} />
      )}
      <aside
        className="sidebar"
        style={{
          width,
          transform: isMobile && !mobileOpen ? 'translateX(-100%)' : 'translateX(0)',
        }}
      >
        <div
          className={`sidebar__header ${effectiveCollapsed ? 'sidebar__header--collapsed' : ''} ${isMobile ? 'sidebar__header--mobile' : ''}`.trim()}
        >
          {!effectiveCollapsed && (
            <div className="sidebar__brand-wrap">
              <span className="sidebar__brand">Nexus</span>
              <span className="sidebar__brand-sub">Dashboard</span>
            </div>
          )}
          {!isMobile && (
            <button
              type="button"
              className="sidebar__icon-btn"
              onClick={onToggleCollapse}
              aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <span className={`sidebar__chevron ${collapsed ? 'sidebar__chevron--flipped' : ''}`.trim()}>
                <ChevronLeftIcon />
              </span>
            </button>
          )}
          {isMobile && (
            <>
              <div className="sidebar__brand-wrap">
                <span className="sidebar__brand">Nexus</span>
                <span className="sidebar__brand-sub">Dashboard</span>
              </div>
              <button
                type="button"
                className="sidebar__icon-btn"
                onClick={onCloseMobile}
                aria-label="Close menu"
                title="Close menu"
              >
                ×
              </button>
            </>
          )}
        </div>

        <nav className="sidebar__nav" aria-label="Main">
          <ul className="sidebar__list">
            {items.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/'}
                  onClick={onCloseMobile}
                  title={effectiveCollapsed ? item.label : undefined}
                  className={({ isActive }) =>
                    [
                      'nav-link',
                      effectiveCollapsed && 'nav-link--collapsed',
                      isActive && 'nav-link--active',
                    ]
                      .filter(Boolean)
                      .join(' ')
                  }
                >
                  <NavIcon name={item.icon} />
                  {!effectiveCollapsed && item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          {!effectiveCollapsed && (
            <>
              <div className="sidebar__footer-label">Role</div>
              <div>{isAdmin ? 'Administrator' : 'Standard user'}</div>
            </>
          )}
        </div>
      </aside>
    </>
  )
}
