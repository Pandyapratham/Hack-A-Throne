'use client';

import { useCoordinates } from '../hooks/useCoordinates';

const CoordinateDisplay = () => {
  const { coordinates, hasCoordinates, clearCoordinates, refreshCoordinates } = useCoordinates();

  if (!hasCoordinates) {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '5px', textAlign: 'center' }}>
        <p>No coordinates stored yet. Use the LocationCapture component to get your location first.</p>
        <button 
          onClick={refreshCoordinates}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
      <h3>Stored Coordinates (from another component)</h3>
      <div style={{ marginBottom: '15px' }}>
        <p><strong>Latitude:</strong> {coordinates?.latitude}</p>
        <p><strong>Longitude:</strong> {coordinates?.longitude}</p>
        <p><strong>Accuracy:</strong> ±{coordinates?.accuracy ? Math.round(coordinates.accuracy) : 0} meters</p>
        <p><strong>Captured at:</strong> {coordinates?.timestamp}</p>
      </div>
      
      <div style={{ display: 'flex', gap: '10px' }}>
        <button 
          onClick={refreshCoordinates}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Refresh
        </button>
        
        <button 
          onClick={clearCoordinates}
          style={{
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
};

export default CoordinateDisplay;
