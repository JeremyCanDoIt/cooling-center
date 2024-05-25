import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './SearchPage.css';

function SearchPage() {
  const { term } = useParams();
  const navigate = useNavigate();
  const [coolingCenters, setCoolingCenters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

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
    navigate(`/center/details`, { state: { center } });
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleMapRadiusClick = () => {
    navigate('/radius', { state: { coolingCenters } });
  };

  const totalPages = Math.ceil(coolingCenters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCenters = coolingCenters.slice(startIndex, endIndex);

  return (
    <div className="search-page">
      <h1>Cooling Centers for "{term}"</h1>
      {coolingCenters.length > 0 ? (
        <>
          <div className="grid-container">
            {currentCenters.map((center, index) => (
              <button key={index} onClick={() => handleCenterClick(center)} className="grid-item">
                <div>{center.name}</div>
                <div>{center.phone}</div>
                <div>{center.hours}</div>
              </button>
            ))}
          </div>
          <div className="pagination">
            {Array.from({ length: totalPages }, (_, i) => (
              <button key={i} onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
            ))}
          </div>
          <button onClick={handleMapRadiusClick} className="map-radius-button">Map Radius</button>
        </>
      ) : <p>No results found.</p>}
    </div>
  );
}

export default SearchPage;
