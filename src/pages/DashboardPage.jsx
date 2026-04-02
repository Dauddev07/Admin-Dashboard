import { useCallback, useEffect, useMemo, useState, memo } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useAuth } from '../context/AuthContext.jsx'
import { useDebounce } from '../hooks/useDebounce.js'
import { dashboardStats, revenueSeries } from '../data/mockData.js'
import { mockRequest } from '../utils/mockApi.js'
import { formatCurrency, formatNumber } from '../utils/format.js'
import { Card, CardHeader } from '../components/ui/Card.jsx'
import { Button } from '../components/ui/Button.jsx'
import { Breadcrumb } from '../components/ui/Breadcrumb.jsx'
import { StatCardSkeleton } from '../components/ui/Skeleton.jsx'
import { StatIconUsers, StatIconRevenue, StatIconOrders } from '../components/icons/StatIcons.jsx'
import { PageSearchField } from '../components/ui/PageSearchField.jsx'

const STAT_KEYS = ['users', 'revenue', 'orders']

const axisTick = { fill: 'var(--text-secondary)', fontSize: 11 }

/** Custom month ticks — styling lives in CSS (`.chart-x-tick`). */
function MonthAxisTick({ x, y, payload }) {
  if (payload?.value == null) return null
  return (
    <g className="chart-x-tick-wrap" transform={`translate(${x},${y})`}>
      <text dy={14} textAnchor="middle" className="chart-x-tick">
        {payload.value}
      </text>
    </g>
  )
}

const xAxisLabel = {
  value: 'Reporting month',
  position: 'bottom',
  offset: 28,
  style: {
    fill: 'var(--text-heading)',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
  },
}

/** Space for Y ticks + vertical label, X ticks + title, bottom legend row */
const marginArea = { top: 10, right: 14, left: 64, bottom: 78 }
const marginBar = { top: 10, right: 14, left: 52, bottom: 78 }
const legendProps = {
  verticalAlign: 'bottom',
  align: 'center',
  layout: 'horizontal',
  wrapperStyle: { fontSize: 11, paddingTop: 8, width: '100%' },
  iconType: 'circle',
  iconSize: 8,
}

const ChartTooltip = memo(function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="chart-tooltip">
      <div className="chart-tooltip__title">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="chart-tooltip__row">
          {p.name}:{' '}
          {typeof p.value === 'number' && p.dataKey === 'revenue' ? formatCurrency(p.value) : p.value}
        </div>
      ))}
      <div className="chart-tooltip__hint">Hover points for exact values</div>
    </div>
  )
})

const statIcons = {
  users: StatIconUsers,
  revenue: StatIconRevenue,
  orders: StatIconOrders,
}

export default function DashboardPage() {
  const { isAdmin } = useAuth()
  const [pageSearch, setPageSearch] = useState('')
  const debouncedPageSearch = useDebounce(pageSearch, 300)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState(null)
  const [series, setSeries] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [s, r] = await Promise.all([
        mockRequest(dashboardStats, { delayMs: 600, failRate: 0.08 }),
        mockRequest(revenueSeries, { delayMs: 500, failRate: 0.08 }),
      ])
      setStats(s)
      setSeries(r)
    } catch (e) {
      setError(e.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const chartData = useMemo(() => {
    if (!series) return null
    const q = debouncedPageSearch.trim().toLowerCase()
    if (!q) return series
    return series.filter((row) => String(row.name).toLowerCase().includes(q))
  }, [series, debouncedPageSearch])

  const visibleStatKeys = useMemo(() => {
    if (!stats) return STAT_KEYS
    const q = debouncedPageSearch.trim().toLowerCase()
    if (!q) return STAT_KEYS
    return STAT_KEYS.filter((key) => {
      const s = stats[key]
      return `${key} ${s.label}`.toLowerCase().includes(q)
    })
  }, [stats, debouncedPageSearch])

  const items = [{ label: 'Dashboard' }]

  return (
    <div>
      <Breadcrumb items={items} />
      <header className="page-header">
        <div>
          <h1 className="page-title">Dashboard</h1>
          <p className="page-subtitle">
            {isAdmin ? 'Organization overview and performance' : 'Your workspace snapshot (read-only metrics)'}
          </p>
        </div>
      </header>

      <div className="page-search-row">
        <PageSearchField
          id="dashboard-search"
          value={pageSearch}
          onValueChange={setPageSearch}
          placeholder="Filter metrics and charts…"
          ariaLabel="Filter dashboard by metric name or month"
        />
        <p className="page-search-hint">
          Matches <strong>stat titles</strong> (e.g. revenue, orders) and <strong>chart months</strong> (Jan, Feb, …).
        </p>
      </div>

      {error && (
        <Card className="card--border-danger error-banner" padding="sm">
          <p className="error-banner__message">{error}</p>
          <Button type="button" size="sm" onClick={load}>
            Retry
          </Button>
        </Card>
      )}

      <section className="dashboard-stats-grid" aria-label="Key metrics">
        {loading &&
          [1, 2, 3].map((k) => <StatCardSkeleton key={k} />)}
        {!loading && stats && visibleStatKeys.length === 0 && (
          <p className="page-search-empty page-search-empty--span">
            No metrics match your filter. Clear the search or try words like &quot;user&quot;, &quot;revenue&quot;, or
            &quot;order&quot;.
          </p>
        )}
        {!loading &&
          stats &&
          visibleStatKeys.map((key) => {
            const s = stats[key]
            const positive = s.change >= 0
            const Icon = statIcons[key]
            return (
              <Card key={key} className="stat-card" padding="md">
                <div className="stat-card__top">
                  <span className="stat-card__label">{s.label}</span>
                  <span className="stat-card__icon" aria-hidden title={s.label}>
                    <Icon />
                  </span>
                </div>
                <div className="stat-card__value">
                  {key === 'revenue' ? formatCurrency(s.value) : formatNumber(s.value)}
                </div>
                <div className={`stat-card__delta ${positive ? 'stat-card__delta--up' : 'stat-card__delta--down'}`}>
                  {positive ? '↑' : '↓'} {Math.abs(s.change)}%{' '}
                  <span className="stat-card__delta-muted">vs last period</span>
                </div>
              </Card>
            )
          })}
      </section>

      <section className="dashboard-charts-grid" aria-label="Charts">
        <Card className="chart-card" padding="md">
          <CardHeader
            title="Revenue trend"
            subtitle="Last 6 months — hover points for values"
          />
          <p className="chart-card__hint">Hover the series for exact figures (USD).</p>
          <div className="chart-card__body" title="Chart: revenue by month">
            {loading && <div className="chart-skeleton" aria-hidden />}
            {!loading && series && chartData && chartData.length === 0 && (
              <div className="chart-empty">No months match your filter. Try a shorter month label (e.g. Mar) or clear the field.</div>
            )}
            {!loading && series && chartData && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={marginArea}>
                  <defs>
                    <linearGradient id="fillRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.35} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    className="chart-x-axis"
                    tick={<MonthAxisTick />}
                    axisLine={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
                    tickLine={false}
                    tickMargin={4}
                    interval={0}
                    height={36}
                    label={xAxisLabel}
                  />
                  <YAxis
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    tickFormatter={(v) => `$${v / 1000}k`}
                    width={48}
                    label={{
                      value: 'Revenue (USD)',
                      angle: -90,
                      position: 'left',
                      offset: 10,
                      fill: 'var(--text-secondary)',
                      fontSize: 11,
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'var(--accent)', strokeWidth: 1, strokeDasharray: '4 4' }} />
                  <Legend {...legendProps} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    name="Revenue"
                    stroke="var(--chart-1)"
                    fill="url(#fillRev)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="chart-footnote">
            <span className="chart-footnote__label">Axis note</span>
            Abbreviations are calendar months. Totals include all closed revenue in each month.
          </p>
        </Card>

        <Card className="chart-card" padding="md">
          <CardHeader title="Orders by month" subtitle="Order volume per month" />
          <p className="chart-card__hint">Hover bars for order counts.</p>
          <div className="chart-card__body" title="Chart: orders by month">
            {loading && <div className="chart-skeleton" aria-hidden />}
            {!loading && series && chartData && chartData.length === 0 && (
              <div className="chart-empty">No months match your filter. Try a shorter month label (e.g. Mar) or clear the field.</div>
            )}
            {!loading && series && chartData && chartData.length > 0 && (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={marginBar}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
                  <XAxis
                    dataKey="name"
                    className="chart-x-axis"
                    tick={<MonthAxisTick />}
                    axisLine={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
                    tickLine={false}
                    tickMargin={4}
                    interval={0}
                    height={36}
                    label={xAxisLabel}
                  />
                  <YAxis
                    tick={axisTick}
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    width={40}
                    label={{
                      value: 'Orders',
                      angle: -90,
                      position: 'left',
                      offset: 6,
                      fill: 'var(--text-secondary)',
                      fontSize: 11,
                      style: { textAnchor: 'middle' },
                    }}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--accent-muted)' }} />
                  <Legend {...legendProps} />
                  <Bar dataKey="orders" name="Orders" fill="var(--chart-2)" radius={[6, 6, 0, 0]} maxBarSize={48} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="chart-footnote">
            <span className="chart-footnote__label">Axis note</span>
            Same month buckets as the revenue chart so you can compare volume with income.
          </p>
        </Card>
      </section>
    </div>
  )
}
