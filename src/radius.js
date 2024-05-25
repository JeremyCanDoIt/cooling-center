import React, { useState, useMemo } from 'react';
import { GoogleMap, useJsApiLoader, Circle } from '@react-google-maps/api';
import { googleMapsConfig } from './config';  // Import your configuration

const containerStyle = {
  width: '100%',
  height: '400px'
};

const center = {
  lat: 34.0522,  // Example latitude
  lng: -118.2437  // Example longitude
};

function Radius() {
  const [mapRadius, setMapRadius] = useState(1000); // Default radius in meters

  const memoizedLibraries = useMemo(() => googleMapsConfig.libraries, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: googleMapsConfig.apiKey,
    libraries: memoizedLibraries,
    language: googleMapsConfig.language,
    region: googleMapsConfig.region
  });

  const options = {
    strokeColor: '#FF0000',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: '#FF0000',
    fillOpacity: 0.35,
    clickable: false,
    draggable: false,
    editable: false,
    visible: true,
    radius: mapRadius,
    center: center,
    zIndex: 1
  };

  if (loadError) {
    return <div>Error loading maps: {loadError.message}</div>;
  }

  return isLoaded ? (
    <div>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Circle
          center={center}
          options={options}
        />
      </GoogleMap>
      <div>
        <input
          type="range"
          min="100"
          max="5000"
          value={mapRadius}
          onChange={(e) => setMapRadius(Number(e.target.value))}
          step="100"
        />
        <label>{mapRadius} meters</label>
      </div>
    </div>
  ) : <div>Loading...</div>;
}

export default Radius;
