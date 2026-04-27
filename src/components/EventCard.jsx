import { getEventIcon } from '../utils/eventIcons';
import { formatTime, formatDuration } from '../utils/dateHelpers';

export default function EventCard({ event, onClick }) {
  const icon = getEventIcon(event.summary || '');
  const isAllDay = !event.start?.dateTime;
  const startTime = isAllDay ? 'All day' : formatTime(event.start?.dateTime);
  const duration = isAllDay ? '' : formatDuration(event.start?.dateTime, event.end?.dateTime);
  const color = event.calendarColor || '#4A90D9';
  const hasLocation = !!event.location;
  const attendeeCount = event.attendees?.length || 0;

  // Get first attendee with photo
  const attendeeWithPhoto = event.attendees?.find(a => a.self === false);
  const attendeeInitials = attendeeWithPhoto
    ? (attendeeWithPhoto.displayName || attendeeWithPhoto.email || '?').substring(0, 1).toUpperCase()
    : null;

  return (
    <button
      onClick={() => onClick?.(event)}
      className="event-card w-full flex items-start gap-3 px-4 py-3 text-left"
      style={{ background: 'transparent' }}
    >
      {/* Color bar */}
      <div
        className="w-1 rounded-full flex-shrink-0 mt-0.5"
        style={{ background: color, height: isAllDay ? '20px' : '40px' }}
      />

      {/* Time column */}
      <div className="flex-shrink-0 w-16 text-right">
        <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
          {startTime}
        </p>
        {duration && (
          <p className="text-xs" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
            {duration}
          </p>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <p
              className="text-sm font-semibold leading-snug truncate"
              style={{ color: 'var(--text-primary)' }}
            >
              {icon} {event.summary || 'Untitled'}
            </p>

            {hasLocation && (
              <p className="text-xs mt-0.5 truncate" style={{ color: 'var(--text-secondary)' }}>
                📍 {event.location}
              </p>
            )}

            {attendeeCount > 0 && (
              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                👥 {attendeeCount} {attendeeCount === 1 ? 'attendee' : 'attendees'}
              </p>
            )}
          </div>

          {/* Attendee avatar */}
          {attendeeInitials && (
            <div
              className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
              style={{ background: color }}
            >
              {attendeeInitials}
            </div>
          )}
        </div>
      </div>
    </button>
  );
}
