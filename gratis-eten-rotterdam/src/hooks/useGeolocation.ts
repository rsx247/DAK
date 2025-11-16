import { useState, useEffect } from 'react';
import { GeolocationState, UserLocation } from '../types';

// Default location: Rotterdam Centraal
const DEFAULT_LOCATION: UserLocation = {
  lat: 51.9225,
  lng: 4.4792,
};

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    location: DEFAULT_LOCATION, // Start with default location immediately
    loading: false, // Don't block rendering
    error: null,
    permissionDenied: false,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({
        location: DEFAULT_LOCATION,
        loading: false,
        error: 'Geolocation wordt niet ondersteund door jouw browser',
        permissionDenied: false,
      });
      return;
    }

    const handleSuccess = (position: GeolocationPosition) => {
      setState({
        location: {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        },
        loading: false,
        error: null,
        permissionDenied: false,
      });
    };

    const handleError = (error: GeolocationPositionError) => {
      let errorMessage = 'Kon locatie niet bepalen';
      let permissionDenied = false;

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = 'Locatietoegang geweigerd. Gebruik standaardlocatie Rotterdam.';
          permissionDenied = true;
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = 'Locatie-informatie niet beschikbaar';
          break;
        case error.TIMEOUT:
          errorMessage = 'Locatieverzoek verlopen';
          break;
      }

      setState({
        location: DEFAULT_LOCATION, // Fallback to Rotterdam Centraal
        loading: false,
        error: errorMessage,
        permissionDenied,
      });
    };

    // Get current position with shorter timeout
    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
      enableHighAccuracy: false,
      timeout: 3000, // Reduced to 3 seconds
      maximumAge: 300000, // 5 minutes
    });
  }, []);

  const requestLocation = () => {
    setState(prev => ({ ...prev, loading: true }));
    
    if (!navigator.geolocation) {
      setState({
        location: DEFAULT_LOCATION,
        loading: false,
        error: 'Geolocation wordt niet ondersteund',
        permissionDenied: false,
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          loading: false,
          error: null,
          permissionDenied: false,
        });
      },
      (error) => {
        setState({
          location: DEFAULT_LOCATION,
          loading: false,
          error: 'Kon locatie niet bepalen',
          permissionDenied: error.code === error.PERMISSION_DENIED,
        });
      }
    );
  };

  return {
    ...state,
    requestLocation,
  };
}





