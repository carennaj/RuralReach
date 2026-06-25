import { useState, useRef, useEffect } from 'react'
import { getDIYGuidance } from '../lib/openai'

const STORAGE_KEY = 'ruralreach_diy_history'

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [] }
  catch { return [] }
}

function saveHistory(history) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20)))
}

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    .replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>')
    .replace(/^[-•]\s(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, m => `<ol>${m}</ol>`)
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
}

export default function DIYAssistant() {
  const [history, setHistory] = useState(loadHistory)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history, loading])

  async function handleSubmit(e) {
    e.preventDefault()
    const task = input.trim()
    if (!task) return
    setInput('')
    setError('')
    setLoading(true)

    const userMsg = { role: 'user', content: task, ts: Date.now() }
    const updated = [...history, userMsg]
    setHistory(updated)

    try {
      const guidance = await getDIYGuidance(task)
      const assistantMsg = { role: 'assistant', content: guidance, task, ts: Date.now() }
      const final = [...updated, assistantMsg]
      setHistory(final)
      saveHistory(final)
    } catch (err) {
      setError('Failed to get guidance. Check your OpenAI API key and try again.')
    }
    setLoading(false)
  }

  function clearHistory() {
    setHistory([])
    localStorage.removeItem(STORAGE_KEY)
  }

  return (
    <div className="page" style={{ maxWidth: 760 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>DIY Assistant 🤖</h1>
          <p style={{ color: 'var(--text-muted)' }}>
            Describe any home repair or maintenance task — get step-by-step guidance and video tutorials.
          </p>
        </div>
        {history.length > 0 && (
          <button className="btn btn-outline btn-sm" onClick={clearHistory}>Clear Chat</button>
        )}
      </div>

      {/* Chat area */}
      <div style={{ minHeight: 300, marginBottom: '1.25rem' }}>
        {history.length === 0 && !loading && (
          <div style={{ padding: '2.5rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🔧</div>
            <p style={{ fontSize: '1rem', marginBottom: '1rem' }}>
              Ask me anything about home repair, maintenance, or improvements.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['Fix a leaking faucet', 'Patch drywall hole', 'Unclog a drain', 'Fix a squeaky door'].map(s => (
                <button key={s} className="btn btn-secondary btn-sm" onClick={() => setInput(s)}>{s}</button>
              ))}
            </div>
          </div>
        )}

        {history.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                <div style={{
                  background: 'var(--green-dark)',
                  color: '#fff',
                  padding: '0.75rem 1.1rem',
                  borderRadius: '12px 12px 2px 12px',
                  maxWidth: '75%',
                  lineHeight: 1.6,
                }}>
                  {msg.content}
                </div>
              </div>
            ) : (
              <div style={{ marginBottom: '1.5rem' }}>
                <div className="card" style={{ borderLeft: '3px solid var(--green-mid)' }}>
                  <div
                    className="prose"
                    dangerouslySetInnerHTML={{ __html: '<p>' + parseMarkdown(msg.content) + '</p>' }}
                  />
                </div>

                {/* YouTube tutorials */}
                <div style={{ marginTop: '1rem' }}>
                  <p style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    📺 Video Tutorials
                  </p>
                  <a
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(msg.task + ' DIY tutorial')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    Search YouTube for "{msg.task}"
                  </a>
                </div>
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: 'var(--text-muted)', padding: '1rem 0' }}>
            <div style={{ width: 20, height: 20, border: '2px solid var(--border)', borderTopColor: 'var(--green-dark)', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Getting step-by-step guidance…
          </div>
        )}

        {error && <p className="error-msg" style={{ marginBottom: '1rem' }}>{error}</p>}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} style={{ position: 'sticky', bottom: 0, background: 'var(--bg)', paddingBottom: '1rem', paddingTop: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Describe your task, e.g. 'how do I fix a dripping faucet?'"
            style={{
              flex: 1,
              padding: '0.75rem 1rem',
              border: '1.5px solid var(--border)',
              borderRadius: 'var(--radius)',
              fontSize: '1rem',
              fontFamily: 'inherit',
            }}
            disabled={loading}
          />
          <button type="submit" className="btn btn-primary" disabled={loading || !input.trim()}>
            Ask
          </button>
        </div>
      </form>
    </div>
  )
}
