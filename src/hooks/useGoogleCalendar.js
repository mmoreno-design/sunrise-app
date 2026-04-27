import { useState, useEffect, useCallback } from 'react';
import { formatDateKey } from '../utils/dateHelpers';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';

let gapiLoaded = false;
let gisLoaded = false;
let tokenClient = null;

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement('script');
    s.src = src;
    s.onload = resolve;
    s.onerror = reject;
    document.head.appendChild(s);
  });
}

export function useGoogleCalendar() {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [events, setEvents] = useState({});
  const [calendars, setCalendars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiReady, setApiReady] = useState(false);

  useEffect(() => {
    if (!CLIENT_ID) return;

    Promise.all([
      loadScript('https://apis.google.com/js/api.js'),
      loadScript('https://accounts.google.com/gsi/client'),
    ]).then(() => {
      window.gapi.load('client', async () => {
        await window.gapi.client.init({
          discoveryDocs: [DISCOVERY_DOC],
        });
        gapiLoaded = true;

        tokenClient = window.google.accounts.oauth2.initTokenClient({
          client_id: CLIENT_ID,
          scope: SCOPES,
          callback: (response) => {
            if (response.error) {
              setError(response.error);
              return;
            }
            setIsSignedIn(true);
            fetchAllEvents();
          },
        });
        gisLoaded = true;
        setApiReady(true);

        // Check for existing token
        const token = sessionStorage.getItem('gapi_token');
        if (token) {
          window.gapi.client.setToken(JSON.parse(token));
          setIsSignedIn(true);
          fetchAllEvents();
        }
      });
    }).catch(e => setError('Failed to load Google API: ' + e.message));
  }, []);

  const signIn = useCallback(() => {
    if (!tokenClient) return;
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }, []);

  const signOut = useCallback(() => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken('');
      sessionStorage.removeItem('gapi_token');
    }
    setIsSignedIn(false);
    setEvents({});
    setCalendars([]);
  }, []);

  const fetchAllEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = window.gapi.client.getToken();
      if (token) sessionStorage.setItem('gapi_token', JSON.stringify(token));

      // Fetch calendar list
      const calResponse = await window.gapi.client.calendar.calendarList.list();
      const calList = calResponse.result.items || [];
      setCalendars(calList);

      // Fetch events for the next 60 days from 30 days ago
      const timeMin = new Date();
      timeMin.setDate(timeMin.getDate() - 30);
      const timeMax = new Date();
      timeMax.setDate(timeMax.getDate() + 60);

      const allEvents = {};
      await Promise.all(
        calList.slice(0, 5).map(async (cal) => {
          try {
            const evResponse = await window.gapi.client.calendar.events.list({
              calendarId: cal.id,
              timeMin: timeMin.toISOString(),
              timeMax: timeMax.toISOString(),
              singleEvents: true,
              orderBy: 'startTime',
              maxResults: 250,
            });

            (evResponse.result.items || []).forEach(event => {
              const start = event.start?.dateTime || event.start?.date;
              if (!start) return;
              const key = formatDateKey(start);
              if (!allEvents[key]) allEvents[key] = [];
              allEvents[key].push({
                ...event,
                calendarColor: cal.backgroundColor || '#4A90D9',
                calendarName: cal.summary,
              });
            });
          } catch (e) {
            console.warn(`Failed to fetch events for ${cal.id}:`, e);
          }
        })
      );

      // Sort events within each day
      Object.keys(allEvents).forEach(key => {
        allEvents[key].sort((a, b) => {
          const aTime = a.start?.dateTime || a.start?.date || '';
          const bTime = b.start?.dateTime || b.start?.date || '';
          return aTime.localeCompare(bTime);
        });
      });

      setEvents(allEvents);
    } catch (e) {
      setError(e.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  }, []);

  const createEvent = useCallback(async (eventData, calendarId = 'primary') => {
    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId,
        resource: eventData,
      });
      await fetchAllEvents();
      return response.result;
    } catch (e) {
      throw new Error(e.result?.error?.message || 'Failed to create event');
    }
  }, [fetchAllEvents]);

  const deleteEvent = useCallback(async (eventId, calendarId = 'primary') => {
    try {
      await window.gapi.client.calendar.events.delete({ calendarId, eventId });
      await fetchAllEvents();
    } catch (e) {
      throw new Error(e.result?.error?.message || 'Failed to delete event');
    }
  }, [fetchAllEvents]);

  return {
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
    hasClientId: !!CLIENT_ID,
  };
}
