import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './SearchPage.css'; // Ensure you have this CSS file

function SearchPage1() {
  const { term } = useParams();
  const [coolingCenters, setCoolingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    if (term) {
      const fetchCoolingCenters = async () => {
        try {
          // Fetch additional details
          const response = await fetch(
            `https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/55/query?outFields=Name,addrln1,phones,email,hours&where=LOWER(Name) LIKE '%25${encodeURIComponent(term.toLowerCase())}%25'&f=geojson`
          );
          const data = await response.json();
          setCoolingCenters(data.features.map(feature => ({
            name: feature.properties.Name,
            address: feature.properties.addrln1,
            phone: feature.properties.phones,
            email: feature.properties.email,
            hours: feature.properties.hours
          })));
        } catch (error) {
          console.error('Error fetching cooling centers:', error);
        }
      };

      fetchCoolingCenters();
    }
  }, [term]);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    console.log(`User selected:`, center);
  };

  return (
    <div>
      <h1>Cooling Centers for "{term}"</h1>
      {coolingCenters.length > 0 ? (
        <div className="grid-container">
          {coolingCenters.map((center, index) => (
            <button key={index} onClick={() => handleCenterClick(center)} className="grid-item">
              <div>{center.name}</div>
              <div>{center.address}</div>
              <div>{center.phone}</div>
              <div>{center.email}</div>
              <div>{center.hours}</div>
            </button>
          ))}
        </div>
      ) : (
        <p>No results found.</p>
      )}
      {selectedCenter && (
        <div>
          <h2>Selected Center:</h2>
          <p>Name: {selectedCenter.name}</p>
          <p>Address: {selectedCenter.address}</p>
          <p>Phone: {selectedCenter.phone}</p>
          <p>Email: {selectedCenter.email}</p>
          <p>Hours: {selectedCenter.hours}</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage1;
