import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { mockRequest } from '../utils/mockApi.js'

const AuthContext = createContext(null)

const SESSION_KEY = 'nexus-session'

/** Demo accounts — passwords are for portfolio demo only, not real security. */
const DEMO_ACCOUNTS = {
  'alex.morgan@acme.io': {
    password: 'demo',
    user: {
      id: 'u1',
      name: 'Alex Morgan',
      email: 'alex.morgan@acme.io',
      role: 'admin',
      avatarUrl: null,
    },
  },
  'demo@acme.io': {
    password: 'demo',
    user: {
      id: 'u2',
      name: 'Demo User',
      email: 'demo@acme.io',
      role: 'user',
      avatarUrl: null,
    },
  },
}

function readSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const { user } = JSON.parse(raw)
    return user?.email ? user : null
  } catch {
    sessionStorage.removeItem(SESSION_KEY)
    return null
  }
}

function writeSession(user) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ user }))
}

export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setUserState(readSession())
    setReady(true)
  }, [])

  const login = useCallback(async (email, password) => {
    await mockRequest(null, { delayMs: 450 })
    const key = email.trim().toLowerCase()
    const account = DEMO_ACCOUNTS[key]
    if (!account || account.password !== password) {
      throw new Error('Invalid email or password')
    }
    const next = { ...account.user }
    writeSession(next)
    setUserState(next)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    setUserState(null)
  }, [])

  const setUser = useCallback((updater) => {
    setUserState((prev) => {
      if (prev == null) return prev
      const next = typeof updater === 'function' ? updater(prev) : updater
      writeSession(next)
      return next
    })
  }, [])

  const setRole = useCallback((role) => {
    setUserState((prev) => {
      if (!prev) return prev
      const next = { ...prev, role }
      writeSession(next)
      return next
    })
  }, [])

  const isAuthenticated = Boolean(user)
  const isAdmin = user?.role === 'admin'

  const value = useMemo(
    () => ({
      user,
      ready,
      isAuthenticated,
      login,
      logout,
      setUser,
      setRole,
      isAdmin,
    }),
    [user, ready, isAuthenticated, login, logout, setUser, setRole, isAdmin],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
