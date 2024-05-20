import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './CenterDetails.css';
import { GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api'; // Import DirectionsRenderer

// Define libraries as a constant outside of the component function
const libraries = ['places'];

function CoolingCenterDetail() {
  const location = useLocation();
  const center = location.state ? location.state.center : null;
  const [centerLatLng, setCenterLatLng] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  // Memoize the libraries array to prevent unnecessary re-renders
  const memoizedLibraries = useMemo(() => libraries, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyA5uB3h3JEXkF6wE7Ldt358C9iTY6yh6qo',
    libraries: memoizedLibraries, // Use the memoized libraries array
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.error('Error: The Geolocation service failed.');
        }
      );
    } else {
      console.error('Error: Your browser doesn\'t support geolocation.');
    }
  }, []);

  useEffect(() => {
    if (center && center.address && isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: center.address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          setCenterLatLng({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }, [center, isLoaded]);

  useEffect(() => {
    // Calculate directions when both userLocation and centerLatLng are available
    if (userLocation && centerLatLng) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: centerLatLng,
          travelMode: 'DRIVING'
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [userLocation, centerLatLng]);

  if (!center) {
    return <p>No center details available. Please select a center from the search page.</p>;
  }

  if (loadError) {
    return <p>There was an error loading the Google Maps API: {loadError.message}</p>;
  }

  return (
    <div className="center-detail">
      <h1>{center.name || 'Information Not Available'}</h1>
      <p>Address: {center.address || 'Information Not Available'}</p>
      <p>Description: {center.des || 'Information Not Available'}</p>
      <p>Phone: {center.phone || 'Information Not Available'}</p>
      <p>Use_type: {center.use_type || 'Information Not Available'}</p>
      <p>Hours: {center.hours || 'Information Not Available'}</p>
      {isLoaded && centerLatLng && (
        <GoogleMap
          zoom={18} // Change the zoom level to zoom in very close
          center={centerLatLng}
          mapContainerStyle={{ height: '400px', width: '100%' }}
        >
          <Marker position={centerLatLng} />
          {userLocation && directions && (
            <DirectionsRenderer directions={directions} />
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default CoolingCenterDetail;
