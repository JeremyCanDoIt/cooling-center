import React, { useState, useMemo, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleMap, useJsApiLoader, Circle, Marker } from '@react-google-maps/api';
import { googleMapsConfig } from './config';  // Import your configuration

const containerStyle = {
  width: '900px',
  height: '600px'
};

const mapWrapperStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',  // Full viewport height
};

function Radius() {
  const location = useLocation();
  const coolingCenters = useMemo(() => location.state ? location.state.coolingCenters : [], [location.state]);
  
  // Log the entire coolingCenters array to verify it is passed correctly
  console.log('Cooling Centers:', coolingCenters);

  const [mapRadius, setMapRadius] = useState(1000); // Default radius in meters
  const [center, setCenter] = useState({
    lat: 34.0522,  // Default latitude for Los Angeles
    lng: -118.2437,
    name: 'Default Center'
  });
  const [userLocation, setUserLocation] = useState(null); // User's location
  const [markers, setMarkers] = useState([]); // Array of markers for cooling centers

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

  useEffect(() => {
    if (coolingCenters.length > 0 && isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
  
      const geocodeCenter = (center) => {
        return new Promise((resolve, reject) => {
          geocoder.geocode({ address: center.address }, (results, status) => {
            console.log(`Geocoding status for ${center.name} by address: ${status}`);
            if (status === 'OK' && results && results.length > 0) {
              const location = results[0].geometry.location;
              console.log(`Geocoded ${center.name} by address: ${location.lat()}, ${location.lng()}`);
              resolve({ ...center, lat: location.lat(), lng: location.lng() });
            } else {
              console.error(`Geocode by address was not successful for ${center.name}, trying by name: ${status}`);
              geocoder.geocode({ address: center.name }, (resultsByName, statusByName) => {
                console.log(`Geocoding status for ${center.name} by name: ${statusByName}`);
                if (statusByName === 'OK' && resultsByName && resultsByName.length > 0) {
                  const locationByName = resultsByName[0].geometry.location;
                  console.log(`Geocoded ${center.name} by name: ${locationByName.lat()}, ${locationByName.lng()}`);
                  resolve({ ...center, lat: locationByName.lat(), lng: locationByName.lng() });
                } else {
                  console.error(`Geocode by name was not successful for ${center.name} for the following reason: ${statusByName}`);
                  reject(`Geocode by name was not successful for ${center.name} for the following reason: ${statusByName}`);
                }
              });
            }
          });
        });
      };
  
      const geocodePromises = coolingCenters.map(center => geocodeCenter(center));
  
      Promise.all(geocodePromises)
        .then(centersWithLatLng => {
          console.log('Geocoded Centers:', centersWithLatLng);  // Debugging log
          setMarkers(centersWithLatLng);
          if (centersWithLatLng.length > 0) {
            setCenter(centersWithLatLng[0]);  // Include name in the center state
          }
        })
        .catch(error => console.error('Geocoding error:', error));
    }
  }, [coolingCenters, isLoaded]);
  
  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          console.log('User Location:', position.coords);  // Debugging log
        },
        (error) => {
          console.error('Error: The Geolocation service failed.', error);
        }
      );
    } else {
      console.error('Error: Your browser doesn\'t support geolocation.');
    }
  }, []);

  console.log('Is Loaded:', isLoaded);  // Debugging log
  console.log('Load Error:', loadError);  // Debugging log
  console.log('Center:', center);  // Debugging log
  console.log('Markers:', markers);  // Debugging log

  return isLoaded ? (
    <div style={mapWrapperStyle}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={10}
      >
        <Circle
          center={center}
          options={options}
        />
        {userLocation && (
          <Marker
            position={userLocation}
            label="You"
          />
        )}
        {markers.map((marker, index) => (
          <Marker
            key={index}
            position={{ lat: marker.lat, lng: marker.lng }}
            // label={marker.name}
          />
        ))}
      </GoogleMap>
      {/* <h1>{center.name || 'Information Not Available'}</h1> */}
    </div>
  ) : (
    <div style={mapWrapperStyle}>
      {loadError ? <p>Error loading map</p> : <p>Loading...</p>}
    </div>
  );
}

export default Radius;
