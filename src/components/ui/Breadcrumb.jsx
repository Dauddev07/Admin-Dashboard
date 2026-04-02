import { Link } from 'react-router-dom'

export function Breadcrumb({ items }) {
  if (!items?.length) return null
  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <ol className="breadcrumb__list">
        {items.map((item, i) => {
          const last = i === items.length - 1
          return (
            <li key={item.to || `${item.label}-${i}`} className="breadcrumb__item">
              {i > 0 && <span className="breadcrumb__sep" aria-hidden>/</span>}
              {last ? (
                <span className="breadcrumb__current">{item.label}</span>
              ) : item.to ? (
                <Link className="breadcrumb__link" to={item.to}>
                  {item.label}
                </Link>
              ) : (
                <span className="breadcrumb__current">{item.label}</span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
