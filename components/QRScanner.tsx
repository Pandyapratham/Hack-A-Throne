"use client";

import React, { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";
import { fetchEvents, Event } from "../utils/fetchEvents"; // adjust path accordingly
import { addParticipantToEventAttendees, findMatchingEvent } from "../utils/compareQrCode";
import { useCoordinates } from '../hooks/useCoordinates';

interface QRScannerProps {
    onScan: (data: string) => void;
}

function QRScanner(props: QRScannerProps) {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<string | null>(null);

    // Use the updated coordinates hook
    const {
        coordinates,
        hasCoordinates,
        isLoading: coordsLoading,
        error: coordsError,
        getCurrentPosition,
        isGeolocationSupported
    } = useCoordinates();

    const [events, setEvents] = useState<Event[]>([]);  // state to store fetched events

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Fetch events on component mount and get initial position
    useEffect(() => {
        async function loadEvents() {
            try {
                const fetchedEvents = await fetchEvents();
                setEvents(fetchedEvents);
            } catch (err) {
                console.error("Failed to fetch events:", err);
            }
        }

        loadEvents();

        // Get initial location when component mounts
        if (isGeolocationSupported) {
            getCurrentPosition();
        }

        return () => {
            stopScan();
        };
        // eslint-disable-next-line
    }, []);

    function startScan() {
        setError(null);
        setData(null);
        setScanning(true);

        // Get fresh coordinates before starting scan
        if (isGeolocationSupported && !coordsLoading) {
            getCurrentPosition();
        }

        navigator.mediaDevices
            .getUserMedia({ video: { facingMode: "environment" } })
            .then((stream) => {
                streamRef.current = stream;
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
                intervalRef.current = window.setInterval(captureFrame, 500);
            })
            .catch(() => {
                setError("Camera access denied or not available");
                setScanning(false);
            });
    }

    function stopScan() {
        setScanning(false);
        setData(null);
        if (intervalRef.current !== null) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    }

    function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c; 
    }

    function captureFrame() {
        if (!videoRef.current || !canvasRef.current) return;
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);

        if (code && code.data) {
            const scannedData = code.data.trim();
            setData(scannedData);
            stopScan();

            const matchedEvent = findMatchingEvent(scannedData, events);
            if (matchedEvent) {
                console.log("Event matched:", matchedEvent);
                console.log("Has coordinates:", hasCoordinates);
                console.log("Coordinates:", coordinates);

                // Check if we have valid coordinates
                if (!hasCoordinates || !coordinates) {
                    // alert("Location access required. Please enable location services and try again.");
                    // Try to get location again
                    if (isGeolocationSupported) {
                        getCurrentPosition();
                    }
                    return;
                }

                // Extract event coordinates and valid radius
                const eventLat = matchedEvent.location_latitude;
                const eventLng = matchedEvent.location_longitude;
                const validRadius = matchedEvent.valid_radius_meters;
                const userLat = coordinates.latitude;
                const userLng = coordinates.longitude;
                console.log(" userLat:" + userLat + "userLng" + "eventLat" + eventLat + "eventLng" + eventLng)
                // Calculate distance between user and event location
                const distance = calculateDistance(userLat, userLng, eventLat, eventLng);

                console.log(`Distance: ${distance}m, Valid radius: ${validRadius}m`);

                if (distance <= validRadius) {
                    alert("Match found and location verified! You're checked in to the event.");
                    addParticipantToEventAttendees(matchedEvent.event_id, 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa');
                } else {
                    alert(`You must be within ${validRadius}m of the event location. Current distance: ${Math.round(distance)}m`);
                }
            } else {
                alert("No matching event found for this QR code.");
            }

            props.onScan(scannedData);
        }
    }

    // Location status component
    const LocationStatus = () => {
        if (!isGeolocationSupported) {
            return (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    Geolocation is not supported by this browser
                </div>
            );
        }

        if (coordsError) {
            return (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                    Location error: {coordsError.message}
                    <button
                        onClick={getCurrentPosition}
                        className="ml-2 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                    >
                        Retry
                    </button>
                </div>
            );
        }

        if (coordsLoading) {
            return (
                <div className="mt-4 p-3 bg-yellow-100 text-yellow-700 rounded-lg text-sm">
                    Getting your location...
                </div>
            );
        }

        if (hasCoordinates && coordinates) {
            return (
                <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm">
                    Location ready: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                    {coordinates.accuracy && (
                        <div className="text-xs mt-1">
                            Accuracy: ±{Math.round(coordinates.accuracy)}m
                        </div>
                    )}
                    <button
                        onClick={getCurrentPosition}
                        className="ml-2 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                    >
                        Refresh
                    </button>
                </div>
            );
        }

        return (
            <div className="mt-4 p-3 bg-gray-100 text-gray-600 rounded-lg text-sm">
                No location data available
                <button
                    onClick={getCurrentPosition}
                    className="ml-2 px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
                >
                    Get Location
                </button>
            </div>
        );
    };

    return (
        <div className="flex flex-col items-center max-w-md mx-auto px-4 py-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">QR Code Scanner</h2>

            {/* Location Status
            <LocationStatus /> */}

            {!scanning ? (
                <button
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mb-4 mt-4"
                    onClick={startScan}
                    disabled={!isGeolocationSupported}
                >
                    Start Scanning
                </button>
            ) : (
                <button
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mb-4 mt-4"
                    onClick={stopScan}
                >
                    Stop Scanning
                </button>
            )}

            <div className="overflow-hidden rounded-lg bg-gray-100 relative w-full max-w-xs h-64 flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full object-cover"
                    autoPlay
                    playsInline
                    muted
                />
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full hidden"></canvas>
                {scanning && (
                    <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-indigo-700 bg-white rounded px-2 py-1 shadow">
                        Align QR code inside the frame
                    </span>
                )}
            </div>

            {error && <div className="mt-4 text-red-600">{error}</div>}

            {data && (
                <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg w-full font-mono">
                    <span className="font-bold">QR Data:</span>
                    <br />
                    {data}
                </div>
            )}


        </div>
    );
}

export default QRScanner;