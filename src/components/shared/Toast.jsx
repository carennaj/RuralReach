import { useState, useCallback, createContext, useContext, useEffect } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now()
    setToasts(t => [...t, { id, message, type }])
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500)
  }, [])

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      <div style={{ position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '0.75rem 1.25rem',
            borderRadius: 'var(--radius)',
            background: t.type === 'error' ? '#dc2626' : t.type === 'info' ? '#2563eb' : 'var(--green-dark)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.9rem',
            boxShadow: 'var(--shadow-md)',
            animation: 'slideIn 0.2s ease',
            maxWidth: 320,
          }}>
            {t.type === 'success' ? '✓ ' : t.type === 'error' ? '✕ ' : 'ℹ '}{t.message}
          </div>
        ))}
      </div>
      <style>{`@keyframes slideIn { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
