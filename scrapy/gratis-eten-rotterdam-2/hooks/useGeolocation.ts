import { useState, useEffect, useCallback } from 'react';
import type { UserLocation } from '../types';

export const useGeolocation = () => {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [locationType, setLocationType] = useState<'gps' | 'manual' | null>(null);

  const getLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocatie wordt niet ondersteund door uw browser.');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setLocation(null); // Reset location on retry
    setLocationType(null);

    const handleSuccess = (position: GeolocationPosition) => {
      setLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy,
      });
      setLocationType('gps');
      setError(null);
      setLoading(false);
    };

    const handleError = (error: GeolocationPositionError) => {
      setError(`Fout bij ophalen locatie: ${error.message}`);
      setLocationType(null);
      setLoading(false);
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    });
  }, []);

  const setManualLocation = useCallback((newLocation: UserLocation) => {
      setLocation(newLocation);
      setLocationType('manual');
      setError(null); // Clear error when setting manually
      setLoading(false);
  }, []);

  useEffect(() => {
    getLocation();
  }, [getLocation]);

  return { location, error, loading, getLocation, setManualLocation, locationType };
};