import React from 'react';
import { useLocation } from 'react-router-dom';
import './CenterDetails.css';

function CoolingCenterDetail() {
  const location = useLocation();
  const center = location.state ? location.state.center : null;

  if (!center) {
    return <p>No center details available. Please select a center from the search page.</p>;
  }

  return (
    <div className="center-detail">
      <h1>{center.name || 'Information Not Available'}</h1>
      <p>Address: {center.address || 'Information Not Available'}</p>
      <p>Phone: {center.phone || 'Information Not Available'}</p>
      <p>Email: {center.email || 'Information Not Available'}</p>
      <p>Hours: {center.hours || 'Information Not Available'}</p>
    </div>
  );
}

export default CoolingCenterDetail;
