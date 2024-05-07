import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SearchPage.css'; 
function SearchPage1() {
  const { term } = useParams();
  const navigate = useNavigate();
  const [coolingCenters, setCoolingCenters] = useState([]);

  useEffect(() => {
    const fetchCoolingCenters = async () => {
      try {
        const response = await fetch(
          `https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/55/query?outFields=Name,addrln1,phones,email,hours&where=LOWER(Name) LIKE '%${encodeURIComponent(term.toLowerCase())}%'&f=geojson`
        );
        if (!response.ok) throw new Error('Failed to fetch centers');
        const data = await response.json();
        setCoolingCenters(data.features.map(feature => ({
          name: feature.properties.Name, 
          address: feature.properties.addrln1,
          des: feature.properties.description,
          phone: feature.properties.phones,
          use_type: feature.properties.use_type,
          hours: feature.properties.hours
        })));
      } catch (error) {
        console.error('Error fetching cooling centers:', error);
      }
    };

    fetchCoolingCenters();
  }, [term]);

  const handleCenterClick = (center) => {
    console.log("Navigating with:", center.name, center.address, center.des, center.phone, center.use_type, center.hours); // This should log the center object
  navigate(`/center/details`, { state: { center } });
  };

  return (
    <div className="search-page">
      <h1>Cooling Centers for "{term}"</h1>
      {coolingCenters.length > 0 ? (
        <div className="grid-container">
          {coolingCenters.map((center, index) => (
            <button key={index} onClick={() => handleCenterClick(center)} className="grid-item">
              <div>{center.name}</div>
              <div>{center.address}</div>
              <div>{center.phone}</div>
              <div>{center.hours}</div>
            </button>
          ))}
        </div>
      ) : <p>No results found.</p>}
    </div>
  );
}

export default SearchPage1;
