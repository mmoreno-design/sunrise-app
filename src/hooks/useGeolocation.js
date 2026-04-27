import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cached = sessionStorage.getItem('geo');
    if (cached) {
      setLocation(JSON.parse(cached));
      return;
    }

    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        sessionStorage.setItem('geo', JSON.stringify(loc));
        setLocation(loc);
      },
      () => {
        // Default to New York if permission denied
        const fallback = { lat: 40.7128, lon: -74.0060 };
        setLocation(fallback);
      },
      { timeout: 5000 }
    );
  }, []);

  return { location, error };
}
