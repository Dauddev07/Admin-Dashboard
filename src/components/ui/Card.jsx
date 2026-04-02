const padClass = {
  sm: 'card--p-sm',
  md: 'card--p-md',
  lg: 'card--p-lg',
}

export function Card({ children, className = '', padding = 'md', style, ...rest }) {
  const p = padClass[padding] || padClass.md
  return (
    <div className={`card ${p} ${className}`.trim()} style={style} {...rest}>
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }) {
  const hasBottom = Boolean(subtitle || action)
  return (
    <div className={`card-header ${!hasBottom ? 'card-header--no-gap' : ''} ${className}`.trim()}>
      <div>
        {title && <h2 className="card-title">{title}</h2>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}
