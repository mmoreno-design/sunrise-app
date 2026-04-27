import { useState, useEffect, useCallback, useRef } from 'react';
import { formatDateKey } from '../utils/dateHelpers';

const PCO_APP_ID = import.meta.env.VITE_PCO_APP_ID || '';
const PCO_SECRET = import.meta.env.VITE_PCO_SECRET || '';
const PCO_BASE = 'https://api.planningcenteronline.com/calendar/v2';
const PCO_COLOR = '#6B4FBB';
const CACHE_KEY = 'pco_events_cache';
const REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

function basicAuth() {
  return 'Basic ' + btoa(`${PCO_APP_ID}:${PCO_SECRET}`);
}

function normalizeInstance(instance) {
  const attrs = instance.attributes;
  const startAt = attrs.starts_at;
  const endAt = attrs.ends_at || new Date(new Date(startAt).getTime() + 3600000).toISOString();

  return {
    id: `pco-${instance.id}`,
    summary: attrs.name || 'Untitled',
    start: { dateTime: startAt },
    end: { dateTime: endAt },
    location: attrs.location || '',
    description: attrs.description || '',
    calendarColor: PCO_COLOR,
    calendarName: 'Planning Center',
    _source: 'planningcenter',
  };
}

function groupByDate(instances) {
  const grouped = {};
  for (const event of instances) {
    const key = formatDateKey(event.start.dateTime);
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(event);
  }
  // Sort within each day by start time
  Object.keys(grouped).forEach(key => {
    grouped[key].sort((a, b) => a.start.dateTime.localeCompare(b.start.dateTime));
  });
  return grouped;
}

async function fetchAllInstances() {
  const now = new Date();
  const from = new Date(now);
  from.setDate(from.getDate() - 30);
  const to = new Date(now);
  to.setDate(to.getDate() + 60);

  const params = new URLSearchParams({
    'filter': 'upcoming',
    'order': 'starts_at',
    'per_page': '100',
  });

  const headers = {
    Authorization: basicAuth(),
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${PCO_BASE}/event_instances?${params}`, { headers });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Planning Center API error ${response.status}: ${text.slice(0, 120)}`);
  }

  const json = await response.json();
  const instances = (json.data || []).map(normalizeInstance);

  // Fetch a second page if available
  if (json.meta?.next) {
    const params2 = new URLSearchParams({
      'filter': 'upcoming',
      'order': 'starts_at',
      'per_page': '100',
      'offset': '100',
    });
    try {
      const r2 = await fetch(`${PCO_BASE}/event_instances?${params2}`, { headers });
      if (r2.ok) {
        const j2 = await r2.json();
        instances.push(...(j2.data || []).map(normalizeInstance));
      }
    } catch (_) { /* ignore pagination errors */ }
  }

  // Also get org name from meta
  let orgName = 'Planning Center';
  if (json.meta?.parent?.name) orgName = json.meta.parent.name;

  return { instances, orgName };
}

export function usePlanningCenter() {
  const [events, setEvents] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orgName, setOrgName] = useState('Planning Center');
  const [enabled, setEnabledState] = useState(() => {
    return localStorage.getItem('pco_enabled') !== 'false';
  });
  const intervalRef = useRef(null);

  const hasCredentials = !!(PCO_APP_ID && PCO_SECRET);

  const setEnabled = useCallback((val) => {
    localStorage.setItem('pco_enabled', String(val));
    setEnabledState(val);
  }, []);

  const fetchEvents = useCallback(async (force = false) => {
    if (!hasCredentials || !enabled) return;

    // Check cache
    if (!force) {
      const cached = sessionStorage.getItem(CACHE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Date.now() - parsed.timestamp < REFRESH_INTERVAL) {
          setEvents(parsed.events);
          if (parsed.orgName) setOrgName(parsed.orgName);
          return;
        }
      }
    }

    setLoading(true);
    setError(null);
    try {
      const { instances, orgName: org } = await fetchAllInstances();
      const grouped = groupByDate(instances);
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({
        events: grouped,
        orgName: org,
        timestamp: Date.now(),
      }));
      setEvents(grouped);
      setOrgName(org);
    } catch (e) {
      setError(e.message || 'Failed to fetch Planning Center events');
    } finally {
      setLoading(false);
    }
  }, [hasCredentials, enabled]);

  // Initial fetch + 15-minute refresh
  useEffect(() => {
    fetchEvents();
    intervalRef.current = setInterval(() => fetchEvents(true), REFRESH_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [fetchEvents]);

  // Clear events when disabled
  useEffect(() => {
    if (!enabled) {
      setEvents({});
      setError(null);
    }
  }, [enabled]);

  return {
    events,
    loading,
    error,
    orgName,
    enabled,
    setEnabled,
    hasCredentials,
    refresh: () => fetchEvents(true),
  };
}
