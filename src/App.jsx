import { useState, useCallback } from 'react';
import MonthStrip from './components/MonthStrip';
import AgendaView from './components/AgendaView';
import BottomNav from './components/BottomNav';
import WeatherBar from './components/WeatherBar';
import EventDetailModal from './components/EventDetailModal';
import NewEventModal from './components/NewEventModal';
import ConnectCalendar from './components/ConnectCalendar';
import SettingsView from './components/SettingsView';
import { useGoogleCalendar } from './hooks/useGoogleCalendar';
import { useWeather } from './hooks/useWeather';
import { useGeolocation } from './hooks/useGeolocation';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('today');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showNewEvent, setShowNewEvent] = useState(false);

  const { location } = useGeolocation();
  const { weather, loading: weatherLoading } = useWeather(location);
  const {
    isSignedIn,
    events,
    calendars,
    loading,
    error,
    apiReady,
    signIn,
    signOut,
    fetchAllEvents,
    createEvent,
    deleteEvent,
    hasClientId,
  } = useGoogleCalendar();

  const handleSelectDate = useCallback((date) => {
    setSelectedDate(date);
    setActiveTab('today');
  }, []);

  const handleTodayTab = useCallback(() => {
    setSelectedDate(new Date());
    setActiveTab('today');
  }, []);

  const handleTabChange = useCallback((tab) => {
    if (tab === 'today') {
      handleTodayTab();
    } else {
      setActiveTab(tab);
    }
  }, [handleTodayTab]);

  const handleEventClick = useCallback((event) => {
    setSelectedEvent(event);
  }, []);

  const handleDeleteEvent = useCallback(async (event) => {
    const calendarId = calendars.find(c => c.summary === event.calendarName)?.id || 'primary';
    await deleteEvent(event.id, calendarId);
  }, [deleteEvent, calendars]);

  const handleCreateEvent = useCallback(async (eventData) => {
    await createEvent(eventData);
  }, [createEvent]);

  const isToday = selectedDate.toDateString() === new Date().toDateString();

  return (
    <div className="flex flex-col h-full" style={{ background: 'var(--bg)' }}>
      {/* Status bar spacer for iPhone notch */}
      <div className="safe-top flex-shrink-0" style={{ background: 'var(--bg)' }} />

      {!isSignedIn ? (
        <ConnectCalendar
          onConnect={signIn}
          hasClientId={hasClientId}
          loading={!apiReady && hasClientId}
        />
      ) : activeTab === 'settings' ? (
        <SettingsView
          isSignedIn={isSignedIn}
          onSignOut={signOut}
          onSignIn={signIn}
          calendars={calendars}
          hasClientId={hasClientId}
        />
      ) : (
        <>
          {isToday && <WeatherBar weather={weather} loading={weatherLoading} />}

          <MonthStrip
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            events={events}
            weather={weather}
          />

          {error && (
            <div className="mx-4 mt-2 px-4 py-2 rounded-xl flex items-center justify-between" style={{ background: '#FEE2E2' }}>
              <p className="text-xs flex-1" style={{ color: '#DC2626' }}>{error}</p>
              <button onClick={fetchAllEvents} className="text-xs font-semibold ml-3" style={{ color: '#DC2626' }}>
                Retry
              </button>
            </div>
          )}

          <AgendaView
            selectedDate={selectedDate}
            events={events}
            loading={loading}
            onEventClick={handleEventClick}
            onRefresh={fetchAllEvents}
          />
        </>
      )}

      <BottomNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onNewEvent={() => setShowNewEvent(true)}
      />

      {selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onDelete={isSignedIn ? handleDeleteEvent : null}
        />
      )}

      {showNewEvent && (
        <NewEventModal
          onClose={() => setShowNewEvent(false)}
          onCreate={handleCreateEvent}
          defaultDate={selectedDate}
        />
      )}
    </div>
  );
}
