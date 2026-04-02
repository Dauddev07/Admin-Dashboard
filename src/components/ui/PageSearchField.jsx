import { SearchIcon } from '../icons/NavIcons.jsx'

/**
 * Page-scoped search (not global). Place only on pages that filter local data.
 */
export function PageSearchField({
  id = 'page-search',
  value,
  onValueChange,
  placeholder,
  ariaLabel,
  className = '',
}) {
  return (
    <div className={`page-search ${className}`.trim()}>
      <span className="page-search__icon" aria-hidden>
        <SearchIcon />
      </span>
      <input
        id={id}
        type="search"
        className="page-search__input"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
      />
    </div>
  )
}
