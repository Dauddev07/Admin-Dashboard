import { useEffect, useMemo, useState } from 'react'
import { activityLogsSeed } from '../data/mockData.js'
import { mockRequest } from '../utils/mockApi.js'
import { formatRelativeTime } from '../utils/format.js'
import { useDebounce } from '../hooks/useDebounce.js'
import { AdminRoute } from '../components/RoleGuard.jsx'
import { Breadcrumb } from '../components/ui/Breadcrumb.jsx'
import { Card, CardHeader } from '../components/ui/Card.jsx'
import { Skeleton } from '../components/ui/Skeleton.jsx'
import { PageSearchField } from '../components/ui/PageSearchField.jsx'

function ActivityContent() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 300)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      setLoading(true)
      const data = await mockRequest(activityLogsSeed, { delayMs: 480 })
      if (!cancelled) {
        setLogs(data)
        setLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const filteredLogs = useMemo(() => {
    const q = debouncedSearch.trim().toLowerCase()
    if (!q) return logs
    return logs.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.actor.toLowerCase().includes(q) ||
        String(log.target).toLowerCase().includes(q),
    )
  }, [logs, debouncedSearch])

  const items = [
    { label: 'Dashboard', to: '/' },
    { label: 'Activity' },
  ]

  return (
    <div>
      <Breadcrumb items={items} />
      <Card padding="md">
        <CardHeader title="Activity log" subtitle="Recent workspace events (mock data)" />
        <div className="page-search-row activity-search">
          <PageSearchField
            id="activity-search"
            value={search}
            onValueChange={setSearch}
            placeholder="Search activity by action, person, or target…"
            ariaLabel="Filter activity log"
          />
        </div>
        <ul className="activity-list">
          {loading &&
            [1, 2, 3, 4, 5].map((k) => (
              <li key={k} className="activity-skeleton-item">
                <Skeleton height="0.85rem" width="55%" />
                <Skeleton height="0.75rem" width="35%" style={{ marginTop: '0.5rem' }} />
              </li>
            ))}
          {!loading && filteredLogs.length === 0 && (
            <li className="page-search-empty activity-list__empty">
              {logs.length === 0
                ? 'No events loaded.'
                : 'No events match your search. Try another keyword or clear the field.'}
            </li>
          )}
          {!loading &&
            filteredLogs.map((log) => (
              <li key={log.id} className="activity-item">
                <div>
                  <div className="activity-item__title">{log.action}</div>
                  <div className="activity-item__meta">
                    <strong>{log.actor}</strong> · {log.target}
                  </div>
                </div>
                <time className="activity-item__time" dateTime={log.at}>
                  {formatRelativeTime(log.at)}
                </time>
              </li>
            ))}
        </ul>
      </Card>
    </div>
  )
}

export default function ActivityPage() {
  return (
    <AdminRoute>
      <ActivityContent />
    </AdminRoute>
  )
}
