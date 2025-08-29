"use client";

import React, { useRef, useState, useEffect } from "react";
import jsQR from "jsqr";
import { fetchEvents, Event } from "../utils/fetchEvents"; // adjust path accordingly
import { addParticipantToEventAttendees, findMatchingEvent } from "../utils/compareQrCode";

interface QRScannerProps {
    onScan: (data: string) => void;
}

function QRScanner(props: QRScannerProps) {
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [data, setData] = useState<string | null>(null);

    const [events, setEvents] = useState<Event[]>([]);  // state to store fetched events

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const intervalRef = useRef<number | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    // Fetch events on component mount
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

        return () => {
            stopScan();
        };
        // eslint-disable-next-line
    }, []);

    function startScan() {
        setError(null);
        setData(null);
        setScanning(true);
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
            setData(code.data);
            stopScan();
            props.onScan(code.data);
        }
        if (code && code.data) {
            const scannedData = code.data.trim();
            setData(scannedData);
            stopScan();

            // Compare with fetched events
            const matchedEvent = findMatchingEvent(scannedData, events);
            if (matchedEvent) {
                alert("Match found:");
                addParticipantToEventAttendees(matchedEvent.event_id, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb')
                // You can call a callback or update UI here
            } else {
                alert("No matching event found");
            }

            props.onScan(scannedData);
        }
    }

    return (
        <div className="flex flex-col items-center max-w-md mx-auto px-4 py-8 bg-white rounded-xl shadow-lg">
            <h2 className="text-lg font-semibold mb-4">QR Code Scanner</h2>
            {!scanning ? (
                <button
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition mb-4"
                    onClick={startScan}
                >
                    Start Scanning
                </button>
            ) : (
                <button
                    className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition mb-4"
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
            {/* Debug: Display count of fetched events */}
            <div className="mt-4 text-sm text-gray-500">
                Fetched events count: {events.length}
            </div>
        </div>
    );
}

export default QRScanner;
