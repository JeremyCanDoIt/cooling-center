import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './CenterDetails.css';
import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';

function CoolingCenterDetail() {
  const location = useLocation();
  const center = location.state ? location.state.center : null;

  // Check if the Google Maps JavaScript API is loaded
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA5uB3h3JEXkF6wE7Ldt358C9iTY6yh6qo' // Replace with your actual API key
  });

  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  if (!center) {
    return <p>No center details available. Please select a center from the search page.</p>;
  }

  return (
    <div className="center-detail">
      <h1>{center.name || 'Information Not Available'}</h1>
      <p>Address: {center.address || 'Information Not Available'}</p>
      <p>Description: {center.des || 'Information Not Available'}</p>
      <p>Phone: {center.phone || 'Information Not Available'}</p>
      <p>Use_type: {center.use_type || 'Information Not Available'}</p>
      <p>Hours: {center.hours || 'Information Not Available'}</p>
      
      {isLoaded && (
        <GoogleMap
          center={{ lat: center.latitude, lng: center.longitude }}
          zoom={14}
          mapContainerStyle={{ height: '400px', width: '100%' }}
        >
          <Marker 
            position={{ lat: center.latitude, lng: center.longitude }}
            onClick={() => setInfoWindowOpen(true)}
          />
          {infoWindowOpen && (
            <InfoWindow 
              position={{ lat: center.latitude, lng: center.longitude }}
              onCloseClick={() => setInfoWindowOpen(false)}
            >
              <div>
                <h3>{center.name}</h3>
                <p>{center.address}</p>
                <p>{center.des}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default CoolingCenterDetail;
