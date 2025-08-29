// hooks/useCoordinates.ts
import { useState, useEffect, useCallback } from 'react';

export interface Coordinates {
    latitude: number;
    longitude: number;
    accuracy?: number;
    timestamp?: number;
}

export interface GeolocationError {
    code: number;
    message: string;
}

const isBrowser = typeof window !== 'undefined';

export const useCoordinates = () => {
    const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<GeolocationError | null>(null);
    const [watchId, setWatchId] = useState<number | null>(null);

    // Get current position once
    const getCurrentPosition = useCallback(() => {
        
        if (!isBrowser || !navigator.geolocation) {
            setError({
                code: 0,
                message: 'Geolocation is not supported by this browser.'
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        
        navigator.geolocation.getCurrentPosition(
            
            (position) => {
                const coords: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                    timestamp: position.timestamp
                };
                
                setCoordinates(coords);
                alert("hello")
                setIsLoading(false);
            },
            (error) => {
                const geoError: GeolocationError = {
                    code: error.code,
                    message: getErrorMessage(error.code)
                };
                setError(geoError);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000 // Cache for 1 minute
            }
        );
        
    }, []);

    // Start watching position changes
    const startWatching = useCallback(() => {
        if (!isBrowser || !navigator.geolocation || watchId !== null) {
            return;
        }

        setError(null);

        const id = navigator.geolocation.watchPosition(
            (position) => {
                const coords: Coordinates = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    // accuracy: position.coords.accuracy,
                    // timestamp: position.timestamp
                };
                setCoordinates(coords);
                setIsLoading(false);
            },
            (error) => {
                const geoError: GeolocationError = {
                    code: error.code,
                    message: getErrorMessage(error.code)
                };
                setError(geoError);
                setIsLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 30000 // Cache for 30 seconds when watching
            }
        );

        setWatchId(id);
    }, [watchId]);

    // Stop watching position changes
    const stopWatching = useCallback(() => {
        if (isBrowser && watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
        }
    }, [watchId]);

    // Clear coordinates and stop watching
    const clearCoordinates = useCallback(() => {
        setCoordinates(null);
        setError(null);
        stopWatching();
    }, [stopWatching]);

    // Auto-cleanup on unmount
    useEffect(() => {
        return () => {
            if (watchId !== null && isBrowser) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [watchId]);

    // Helper function to get user-friendly error messages
    const getErrorMessage = (code: number): string => {
        switch (code) {
            case 1:
                return 'Location access denied by user.';
            case 2:
                return 'Location information is unavailable.';
            case 3:
                return 'Location request timed out.';
            default:
                return 'An unknown error occurred while retrieving location.';
        }
    };

    return {
        coordinates,
        hasCoordinates: coordinates !== null,
        isLoading,
        error,
        isWatching: watchId !== null,
        getCurrentPosition,
        startWatching,
        stopWatching,
        clearCoordinates,
        // Utility function to check if geolocation is supported
        isGeolocationSupported: isBrowser && 'geolocation' in navigator
    };
};
