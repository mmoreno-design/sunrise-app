import { useState } from 'react';
import { parseNaturalEvent } from '../utils/naturalLanguageParser';
import { formatTime } from '../utils/dateHelpers';

export default function NewEventModal({ onClose, onCreate, defaultDate }) {
  const [title, setTitle] = useState('');
  const [mode, setMode] = useState('natural'); // 'natural' | 'manual'
  const [parsed, setParsed] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Manual mode fields
  const defaultStr = defaultDate
    ? `${defaultDate.getFullYear()}-${String(defaultDate.getMonth()+1).padStart(2,'0')}-${String(defaultDate.getDate()).padStart(2,'0')}`
    : new Date().toISOString().slice(0,10);
  const [manualDate, setManualDate] = useState(defaultStr);
  const [manualStartTime, setManualStartTime] = useState('09:00');
  const [manualEndTime, setManualEndTime] = useState('10:00');
  const [manualTitle, setManualTitle] = useState('');
  const [manualLocation, setManualLocation] = useState('');

  const handleParse = () => {
    if (!title.trim()) return;
    const result = parseNaturalEvent(title);
    setParsed(result);
  };

  const handleCreate = async () => {
    setLoading(true);
    setError('');
    try {
      let eventData;
      if (mode === 'natural' && parsed) {
        eventData = parsed;
      } else if (mode === 'manual') {
        if (!manualTitle.trim()) { setError('Title is required'); setLoading(false); return; }
        const startDT = new Date(`${manualDate}T${manualStartTime}`);
        const endDT = new Date(`${manualDate}T${manualEndTime}`);
        eventData = {
          summary: manualTitle,
          start: { dateTime: startDT.toISOString() },
          end: { dateTime: endDT.toISOString() },
          ...(manualLocation && { location: manualLocation }),
        };
      } else {
        setError('Please parse your event first');
        setLoading(false);
        return;
      }
      await onCreate(eventData);
      onClose();
    } catch (e) {
      setError(e.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 modal-overlay"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-sheet absolute bottom-0 left-0 right-0 rounded-t-2xl"
        style={{ background: 'var(--bg)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 rounded-full" style={{ background: '#e0e0e0' }} />
        </div>

        <div className="px-5 pb-2 flex items-center justify-between">
          <h2 className="text-lg font-bold" style={{ color: 'var(--text-primary)' }}>New Event</h2>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: 'var(--text-secondary)' }}>×</button>
        </div>

        {/* Mode toggle */}
        <div className="px-5 mb-4">
          <div className="flex rounded-xl overflow-hidden" style={{ background: 'var(--card-bg)' }}>
            {['natural', 'manual'].map(m => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className="flex-1 py-2 text-sm font-medium transition-all"
                style={{
                  background: mode === m ? 'var(--primary)' : 'transparent',
                  color: mode === m ? '#fff' : 'var(--text-secondary)',
                  borderRadius: '0.75rem',
                }}
              >
                {m === 'natural' ? '✨ Smart' : '✏️ Manual'}
              </button>
            ))}
          </div>
        </div>

        {mode === 'natural' ? (
          <div className="px-5 pb-safe-bottom">
            <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>
              Try: "Lunch with Lisa tomorrow at noon" or "Call with team next Monday at 2pm"
            </p>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={title}
                onChange={e => { setTitle(e.target.value); setParsed(null); }}
                onKeyDown={e => e.key === 'Enter' && handleParse()}
                placeholder="Describe your event..."
                autoFocus
                className="flex-1 px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  background: 'var(--card-bg)',
                  color: 'var(--text-primary)',
                  border: '1.5px solid transparent',
                }}
                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                onBlur={e => e.target.style.borderColor = 'transparent'}
              />
              <button
                onClick={handleParse}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{ background: 'var(--card-bg)', color: 'var(--primary)' }}
              >
                Parse
              </button>
            </div>

            {parsed && (
              <div className="p-4 rounded-xl mb-4 slide-up" style={{ background: 'var(--card-bg)' }}>
                <p className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  📅 {parsed.summary}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                  {new Date(parsed.start.dateTime).toLocaleDateString('en-US', {
                    weekday: 'short', month: 'short', day: 'numeric'
                  })} · {formatTime(parsed.start.dateTime)} – {formatTime(parsed.end.dateTime)}
                </p>
              </div>
            )}

            {error && (
              <p className="text-xs text-red-500 mb-3">{error}</p>
            )}

            <button
              onClick={handleCreate}
              disabled={!parsed || loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95 mb-6"
              style={{
                background: parsed && !loading ? 'var(--primary)' : '#e0e0e0',
                color: parsed && !loading ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {loading ? 'Creating...' : 'Add to Calendar'}
            </button>
          </div>
        ) : (
          <div className="px-5 pb-safe-bottom">
            <input
              type="text"
              value={manualTitle}
              onChange={e => setManualTitle(e.target.value)}
              placeholder="Event title"
              autoFocus
              className="w-full px-4 py-3 rounded-xl text-sm mb-3 outline-none"
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'transparent'}
            />
            <input
              type="date"
              value={manualDate}
              onChange={e => setManualDate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-sm mb-3 outline-none"
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
            />
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>Start</label>
                <input
                  type="time"
                  value={manualStartTime}
                  onChange={e => setManualStartTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="flex-1">
                <label className="text-xs mb-1 block" style={{ color: 'var(--text-secondary)' }}>End</label>
                <input
                  type="time"
                  value={manualEndTime}
                  onChange={e => setManualEndTime(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
            <input
              type="text"
              value={manualLocation}
              onChange={e => setManualLocation(e.target.value)}
              placeholder="Location (optional)"
              className="w-full px-4 py-3 rounded-xl text-sm mb-3 outline-none"
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)', border: '1.5px solid transparent' }}
              onFocus={e => e.target.style.borderColor = 'var(--primary)'}
              onBlur={e => e.target.style.borderColor = 'transparent'}
            />

            {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

            <button
              onClick={handleCreate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-sm font-semibold transition-all active:scale-95 mb-6"
              style={{ background: 'var(--primary)', color: '#fff' }}
            >
              {loading ? 'Creating...' : 'Add to Calendar'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
