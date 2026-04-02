import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { AppLayout } from './components/layout/AppLayout.jsx'
import { RequireAuth } from './components/RequireAuth.jsx'
import { Skeleton } from './components/ui/Skeleton.jsx'

const LoginPage = lazy(() => import('./pages/LoginPage.jsx'))
const DashboardPage = lazy(() => import('./pages/DashboardPage.jsx'))
const UsersPage = lazy(() => import('./pages/UsersPage.jsx'))
const ProductsPage = lazy(() => import('./pages/ProductsPage.jsx'))
const ActivityPage = lazy(() => import('./pages/ActivityPage.jsx'))
const SettingsPage = lazy(() => import('./pages/SettingsPage.jsx'))
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'))

function PageLoader() {
  return (
    <div className="page-loader">
      <Skeleton height="1.25rem" width="40%" style={{ marginBottom: '1rem' }} />
      <Skeleton height="120px" width="100%" style={{ marginBottom: '1rem' }} />
      <Skeleton height="220px" width="100%" />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route element={<RequireAuth />}>
                  <Route element={<AppLayout />}>
                    <Route index element={<DashboardPage />} />
                    <Route path="users" element={<UsersPage />} />
                    <Route path="products" element={<ProductsPage />} />
                    <Route path="activity" element={<ActivityPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                    <Route path="home" element={<Navigate to="/" replace />} />
                    <Route path="*" element={<NotFoundPage />} />
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}
