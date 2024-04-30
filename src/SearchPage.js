import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function SearchPage() {
  const { term } = useParams();
  const [coolingCenters, setCoolingCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState(null);

  useEffect(() => {
    if (term) {
      //Function to fetch cooling center data from the API based on term
      const fetchCoolingCenters = async () => {
        try {
          const response = await fetch(
            `https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/55/query?outFields=Name&where=LOWER(Name) LIKE '%25${encodeURIComponent(term.toLowerCase())}%25'&f=geojson`
          );
          const data = await response.json();
          setCoolingCenters(data.features.map(feature => feature.properties.Name));
        } catch (error) {
          console.error('Error fetching cooling centers:', error);
        }
      };

      fetchCoolingCenters();
    }
  }, [term]);

  const handleCenterClick = (center) => {
    setSelectedCenter(center);
    // Additional logic for when a center is selected
    console.log(`User selected: ${center}`);
  };

  return (
    <div>
      <h1>Cooling Centers for "{term}"</h1>
      <ul>
        {coolingCenters.map((center, index) => (
          <li key={index}>
            {center}
            <button onClick={() => handleCenterClick(center)}>Select</button>
          </li>
        ))}
      </ul>
      {/* Optionally render more information about the selected center */}
      {selectedCenter && (
        <div>
          <h2>Selected Center:</h2>
          <p>{selectedCenter}</p>
          {/* Additional details about the selected center */}
        </div>
      )}
    </div>
  );
}

export default SearchPage;
