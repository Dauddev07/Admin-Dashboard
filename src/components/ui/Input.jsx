export function Input({ id, label, error, className = '', ...rest }) {
  const inputId = id || rest.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`field-input ${error ? 'field-input--error' : ''}`.trim()}
        {...rest}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}

export function Textarea({ id, label, error, className = '', rows = 4, ...rest }) {
  const inputId = id || rest.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        className={`field-textarea ${error ? 'field-input--error' : ''}`.trim()}
        {...rest}
      />
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}

export function Select({ id, label, error, children, className = '', ...rest }) {
  const inputId = id || rest.name
  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="field-label">
          {label}
        </label>
      )}
      <select
        id={inputId}
        className={`field-select ${error ? 'field-input--error' : ''}`.trim()}
        {...rest}
      >
        {children}
      </select>
      {error && <p className="field-error">{error}</p>}
    </div>
  )
}
