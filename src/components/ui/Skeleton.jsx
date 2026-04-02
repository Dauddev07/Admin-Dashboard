export function Skeleton({ width = '100%', height = '1rem', radius = 'var(--radius-md)', className = '', style }) {
  return (
    <span
      aria-hidden
      className={`skeleton-block ${className}`.trim()}
      style={{
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  )
}

export function StatCardSkeleton() {
  return (
    <div className="card card--p-md stat-card">
      <div className="stat-card-skeleton__top">
        <Skeleton width="45%" height="0.75rem" />
        <Skeleton width="40px" height="40px" radius="var(--radius-md)" />
      </div>
      <Skeleton width="55%" height="1.75rem" />
      <Skeleton width="35%" height="0.65rem" style={{ marginTop: '0.5rem' }} />
    </div>
  )
}

export function TableRowSkeleton({ cols = 5 }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="data-table td--skeleton">
          <Skeleton height="0.875rem" />
        </td>
      ))}
    </tr>
  )
}
