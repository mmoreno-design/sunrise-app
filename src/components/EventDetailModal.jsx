import { getEventIcon } from '../utils/eventIcons';
import { formatTime, formatDuration } from '../utils/dateHelpers';

export default function EventDetailModal({ event, onClose, onDelete }) {
  if (!event) return null;

  const icon = getEventIcon(event.summary || '');
  const isAllDay = !event.start?.dateTime;
  const startTime = formatTime(event.start?.dateTime || event.start?.date);
  const endTime = event.end?.dateTime ? formatTime(event.end.dateTime) : null;
  const duration = formatDuration(event.start?.dateTime, event.end?.dateTime);
  const color = event.calendarColor || '#4A90D9';
  const hasLocation = !!event.location;
  const mapsUrl = hasLocation
    ? `https://maps.apple.com/?q=${encodeURIComponent(event.location)}`
    : null;

  const startDate = new Date(event.start?.dateTime || event.start?.date);
  const dateStr = startDate.toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div
      className="fixed inset-0 z-50 modal-overlay"
      style={{ background: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="modal-sheet absolute bottom-0 left-0 right-0 rounded-t-2xl overflow-hidden"
        style={{ background: 'var(--bg)', maxHeight: '80vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full" style={{ background: '#e0e0e0' }} />
        </div>

        {/* Color bar */}
        <div className="h-1 mx-4 rounded-full" style={{ background: color }} />

        {/* Content */}
        <div className="overflow-y-auto no-scrollbar" style={{ maxHeight: 'calc(80vh - 60px)' }}>
          <div className="p-5">
            {/* Title */}
            <div className="flex items-start gap-3 mb-4">
              <span className="text-3xl">{icon}</span>
              <h2 className="text-xl font-bold flex-1" style={{ color: 'var(--text-primary)' }}>
                {event.summary || 'Untitled Event'}
              </h2>
            </div>

            {/* Time */}
            <div className="flex items-center gap-3 mb-3">
              <span className="text-lg">🕐</span>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                  {dateStr}
                </p>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {isAllDay ? 'All day' : `${startTime}${endTime ? ` – ${endTime}` : ''} ${duration ? `(${duration})` : ''}`}
                </p>
              </div>
            </div>

            {/* Location */}
            {hasLocation && (
              <div className="flex items-start gap-3 mb-3">
                <span className="text-lg">📍</span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                    {event.location}
                  </p>
                  {mapsUrl && (
                    <a
                      href={mapsUrl}
                      className="text-xs font-medium"
                      style={{ color: 'var(--primary)' }}
                    >
                      Open in Maps →
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Calendar */}
            {event.calendarName && (
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg">📆</span>
                <p className="text-sm" style={{ color: 'var(--text-primary)' }}>
                  {event.calendarName}
                </p>
              </div>
            )}

            {/* Attendees */}
            {event.attendees && event.attendees.length > 0 && (
              <div className="flex items-start gap-3 mb-3">
                <span className="text-lg">👥</span>
                <div className="flex-1">
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    {event.attendees.length} attendees
                  </p>
                  {event.attendees.slice(0, 5).map((att, i) => (
                    <div key={i} className="flex items-center gap-2 py-0.5">
                      <div
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                        style={{ background: color }}
                      >
                        {(att.displayName || att.email || '?')[0].toUpperCase()}
                      </div>
                      <p className="text-sm truncate" style={{ color: 'var(--text-secondary)' }}>
                        {att.displayName || att.email}
                        {att.self && ' (you)'}
                      </p>
                    </div>
                  ))}
                  {event.attendees.length > 5 && (
                    <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>
                      +{event.attendees.length - 5} more
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Description */}
            {event.description && (
              <div className="flex items-start gap-3 mb-3">
                <span className="text-lg">📝</span>
                <p
                  className="text-sm flex-1"
                  style={{ color: 'var(--text-secondary)', whiteSpace: 'pre-wrap' }}
                >
                  {event.description.replace(/<[^>]+>/g, '')}
                </p>
              </div>
            )}

            {/* Meet link */}
            {event.hangoutLink && (
              <a
                href={event.hangoutLink}
                className="flex items-center gap-3 mb-3 p-3 rounded-xl text-sm font-medium"
                style={{ background: 'var(--card-bg)', color: 'var(--primary)' }}
              >
                🎥 Join video meeting
              </a>
            )}
          </div>

          {/* Actions */}
          <div className="px-5 pb-6 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
              style={{ background: 'var(--card-bg)', color: 'var(--text-primary)' }}
            >
              Close
            </button>
            {onDelete && (
              <button
                onClick={() => {
                  if (confirm('Delete this event?')) {
                    onDelete(event);
                    onClose();
                  }
                }}
                className="px-5 py-3 rounded-xl text-sm font-semibold transition-all active:scale-95"
                style={{ background: '#FEE2E2', color: '#DC2626' }}
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
