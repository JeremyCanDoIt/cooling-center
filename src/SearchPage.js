import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SearchPage from './SearchPage.css'; // Make sure to create this CSS file

function SearchPage1() {
  const { term } = useParams();
  const [coolingCenters, setCcoolingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    if (term) {
      const fetchCoolingCenters = async () => {
        try {
          const response = await fetch(
            `https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/55/query?outFields=Name&where=LOWER(Name) LIKE '%25${encodeURIComponent(term.toLowerCase())}%25'&f=geojson`
          );
          const data = await response.json();
          setCcoolingCenters(data.features.map(feature => feature.properties.Name));
        } catch (error) {
          console.error('Error fetching cooling centers:', error);
        }
      };

      fetchCoolingCenters();
    }
  }, [term]);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    console.log(`User selected: ${center}`);
  };

  return (
    <div>
      <h1>Cooling Centers for "{term}"</h1>
      <div className="grid-container">
        {coolingCenters.map((center, index) => (
          <button key={index} onClick={() => handleCenterClick(center)} className="grid-item">
            {center}
          </button>
        ))}
      </div>
      {selectedCenter && (
        <div>
          <h2>Selected Center:</h2>
          <p>{selectedCenter}</p>
        </div>
      )}
    </div>
  );
}

export default SearchPage1;
