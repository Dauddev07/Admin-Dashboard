import { useEffect } from 'react'
import { Button } from './Button.jsx'

export function Modal({ open, title, children, onClose, footer, wide = false }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose?.()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="modal-overlay"
      role="presentation"
      onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}
    >
      <div
        className={`modal-panel ${wide ? 'modal-panel--wide' : ''}`.trim()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="modal-header">
          <h2 id="modal-title" className="modal-title">
            {title}
          </h2>
          <button type="button" className="modal-close" aria-label="Close" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

export function ModalActions({ onCancel, onConfirm, confirmLabel = 'Save', loading = false }) {
  return (
    <>
      <Button type="button" variant="secondary" onClick={onCancel} disabled={loading}>
        Cancel
      </Button>
      <Button type="button" onClick={onConfirm} disabled={loading}>
        {loading ? 'Saving…' : confirmLabel}
      </Button>
    </>
  )
}
