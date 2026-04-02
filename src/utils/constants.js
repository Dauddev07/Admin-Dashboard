export const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'layout', roles: ['admin', 'user'] },
  { to: '/users', label: 'Users', icon: 'users', roles: ['admin'] },
  { to: '/products', label: 'Products', icon: 'package', roles: ['admin', 'user'] },
  { to: '/activity', label: 'Activity', icon: 'activity', roles: ['admin'] },
  { to: '/settings', label: 'Settings', icon: 'settings', roles: ['admin', 'user'] },
]

export const PAGE_SIZE_OPTIONS = [5, 10, 25, 50]
