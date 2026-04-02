import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'

const ToastContext = createContext(null)

let toastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const timers = useRef(new Map())

  const remove = useCallback((id) => {
    const t = timers.current.get(id)
    if (t) clearTimeout(t)
    timers.current.delete(id)
    setToasts((list) => list.filter((x) => x.id !== id))
  }, [])

  const push = useCallback(
    (message, variant = 'info', durationMs = 4000) => {
      const id = ++toastId
      setToasts((list) => [...list, { id, message, variant }])
      if (durationMs > 0) {
        const tid = setTimeout(() => remove(id), durationMs)
        timers.current.set(id, tid)
      }
      return id
    },
    [remove],
  )

  const success = useCallback((msg) => push(msg, 'success'), [push])
  const error = useCallback((msg) => push(msg, 'error', 5500), [push])

  const value = useMemo(() => ({ push, success, error, remove }), [push, success, error, remove])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-region" aria-live="polite" aria-relevant="additions text">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.variant}`} role="status">
            <p className="toast__msg">{t.message}</p>
            <button type="button" className="toast__close" aria-label="Dismiss" onClick={() => remove(t.id)}>
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
