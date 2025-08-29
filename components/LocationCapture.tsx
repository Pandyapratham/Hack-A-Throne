'use client';

import { useState } from 'react';

// Define the coordinate type
interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: string;
}

const LocationCapture = () => {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = () => {
    // Check if geolocation is supported
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    const handleSuccess = (position: GeolocationPosition) => {
      const coords: Coordinates = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy,
        timestamp: new Date().toLocaleString()
      };

      setCoordinates(coords);
      setLoading(false);
      console.log('User coordinates:', coords);

      // Store coordinates in localStorage for use elsewhere
      localStorage.setItem('userCoordinates', JSON.stringify(coords));

      // You can also emit a custom event to notify other components
      window.dispatchEvent(new CustomEvent('coordinatesUpdated', { detail: coords }));
    };

    const handleError = (error: GeolocationPositionError) => {
      setLoading(false);

      switch (error.code) {
        case error.PERMISSION_DENIED:
          setError('Location access denied by user');
          break;
        case error.POSITION_UNAVAILABLE:
          setError('Location information is unavailable');
          break;
        case error.TIMEOUT:
          setError('Location request timed out');
          break;
        default:
          setError('An unknown error occurred');
          break;
      }
    };

    navigator.geolocation.getCurrentPosition(handleSuccess, handleError, options);
  };

  const clearLocation = () => {
    setCoordinates(null);
    setError(null);
    // Also clear from localStorage
    localStorage.removeItem('userCoordinates');
  };

  // Function to get stored coordinates (can be called from other components)
  const getStoredCoordinates = (): Coordinates | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('userCoordinates');
    return stored ? JSON.parse(stored) : null;
  };

  // Function to check if coordinates exist
  const hasCoordinates = (): boolean => {
    if (typeof window === 'undefined') return false;
    return getStoredCoordinates() !== null;
  };

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>GPS Location Capture</h2>

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={getLocation}
          disabled={loading}
          style={{
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginRight: '10px'
          }}
        >
          {loading ? 'Getting Location...' : 'Get My Location'}
        </button>

        {coordinates && (
          <button
            onClick={clearLocation}
            style={{
              padding: '10px 20px',
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '5px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Success Display */}
      {coordinates && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '5px',
          color: '#155724',
          marginBottom: '20px'
        }}>
          <h3>Location Captured:</h3>
          <p><strong>Latitude:</strong> {coordinates.latitude}</p>
          <p><strong>Longitude:</strong> {coordinates.longitude}</p>
          <p><strong>Accuracy:</strong> ±{Math.round(coordinates.accuracy)} meters</p>
          <p><strong>Time:</strong> {coordinates.timestamp}</p>

          <div style={{ marginTop: '10px' }}>
            <button
              onClick={() => {
                const coordString = `${coordinates.latitude}, ${coordinates.longitude}`;
                navigator.clipboard.writeText(coordString);
                alert('Coordinates copied to clipboard!');
              }}
              style={{
                padding: '5px 10px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '3px',
                cursor: 'pointer',
                fontSize: '12px',
                marginRight: '5px'
              }}
            >
              Copy Coordinates
            </button>

            <a
              href={`https://maps.google.com/?q=${coordinates.latitude},${coordinates.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding: '5px 10px',
                backgroundColor: '#17a2b8',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '3px',
                fontSize: '12px'
              }}
            >
              View on Map
            </a>
          </div>
        </div>
      )}

      {/* Raw Data Display */}
      {coordinates && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '5px',
          fontSize: '14px'
        }}>
          <h4>Raw Coordinate Data:</h4>
          <pre style={{
            backgroundColor: 'white',
            padding: '10px',
            borderRadius: '3px',
            overflow: 'auto'
          }}>
            {JSON.stringify(coordinates, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

// Export utility functions for use in other components
export const getStoredCoordinates = (): Coordinates | null => {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem('userCoordinates');
  return stored ? JSON.parse(stored) : null;
};

export const hasCoordinates = (): boolean => {
  if (typeof window === 'undefined') return false;
  return getStoredCoordinates() !== null;
};

export const clearStoredCoordinates = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('userCoordinates');
};

export type { Coordinates };

export default LocationCapture;