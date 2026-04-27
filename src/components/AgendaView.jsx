import { useRef, useState, useCallback, useEffect } from 'react';
import EventCard from './EventCard';
import { formatDateKey, friendlyDate, isToday } from '../utils/dateHelpers';

function EmptyState({ date }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 slide-up">
      <div className="text-5xl mb-4" role="img" aria-label="No events">
        {isToday(date) ? '✨' : '🗓️'}
      </div>
      <p className="text-base font-medium text-center" style={{ color: 'var(--text-secondary)' }}>
        {isToday(date) ? 'You\'re free today!' : 'No events this day'}
      </p>
      <p className="text-sm text-center mt-1" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
        Tap + to add an event
      </p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="skeleton w-1 h-10 rounded-full flex-shrink-0" />
      <div className="flex-shrink-0 w-16">
        <div className="skeleton h-3 w-12 ml-auto" />
      </div>
      <div className="flex-1">
        <div className="skeleton h-4 w-3/4 mb-2" />
        <div className="skeleton h-3 w-1/2" />
      </div>
    </div>
  );
}

export default function AgendaView({ selectedDate, events, loading, onEventClick, onRefresh }) {
  const scrollRef = useRef(null);
  const [pullY, setPullY] = useState(0);
  const [isPulling, setIsPulling] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const startYRef = useRef(0);

  const dateKey = formatDateKey(selectedDate);
  const dayEvents = events?.[dateKey] || [];
  const dateLabel = friendlyDate(selectedDate);

  const handleTouchStart = useCallback((e) => {
    if (scrollRef.current?.scrollTop === 0) {
      startYRef.current = e.touches[0].clientY;
      setIsPulling(true);
    }
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (!isPulling) return;
    const delta = e.touches[0].clientY - startYRef.current;
    if (delta > 0) {
      e.preventDefault();
      setPullY(Math.min(delta * 0.5, 60));
    }
  }, [isPulling]);

  const handleTouchEnd = useCallback(async () => {
    if (pullY > 45 && onRefresh && !refreshing) {
      setRefreshing(true);
      setPullY(0);
      setIsPulling(false);
      await onRefresh();
      setRefreshing(false);
    } else {
      setPullY(0);
      setIsPulling(false);
    }
  }, [pullY, onRefresh, refreshing]);

  // Scroll to top when date changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedDate]);

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      {/* Pull indicator */}
      {(pullY > 0 || refreshing) && (
        <div
          className="flex items-center justify-center transition-all"
          style={{ height: refreshing ? 40 : pullY, overflow: 'hidden' }}
        >
          {refreshing ? (
            <div className="ptr-spinner" />
          ) : (
            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              {pullY > 45 ? '↓ Release to refresh' : '↑ Pull to refresh'}
            </p>
          )}
        </div>
      )}

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="flex-1 scroll-container no-scrollbar"
        style={{ overflowY: 'auto' }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Date header */}
        <div className="px-4 pt-3 pb-2 slide-down" key={dateKey + '-header'}>
          <h2 className="text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {dateLabel}
          </h2>
        </div>

        {/* Events list */}
        {loading ? (
          <div className="slide-up">
            {[1, 2, 3].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : dayEvents.length === 0 ? (
          <EmptyState date={selectedDate} />
        ) : (
          <div className="slide-up" key={dateKey}>
            {dayEvents.map((event, idx) => (
              <div key={event.id || idx}>
                <EventCard event={event} onClick={onEventClick} />
                {idx < dayEvents.length - 1 && (
                  <div className="mx-4" style={{ height: 1, background: '#f0f0f0' }} />
                )}
              </div>
            ))}
            <div className="h-4" />
          </div>
        )}
      </div>
    </div>
  );
}
