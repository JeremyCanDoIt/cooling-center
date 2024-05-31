import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './SearchPage.css';

function SearchPage() {
  const { term } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [coolingCenters, setCoolingCenters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [closestCenters, setClosestCenters] = useState([]);
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

    if (term) {
      fetchCoolingCenters();
    }
  }, [term]);

  useEffect(() => {
    const fetchCoolingCentersWithCoordinates = async () => {
      try {
        const response = await fetch(
          `https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/55/query?outFields=Name,addrln1,phones,email,hours,latitude,longitude&where=1=1&f=geojson`
        );
        if (!response.ok) throw new Error('Failed to fetch centers');
        const data = await response.json();
        return data.features.map(feature => ({
          name: feature.properties.Name,
          address: feature.properties.addrln1,
          des: feature.properties.description,
          phone: feature.properties.phones,
          use_type: feature.properties.use_type,
          hours: feature.properties.hours,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0]
        }));
      } catch (error) {
        console.error('Error fetching cooling centers:', error);
        return [];
      }
    };

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of Earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;  // Convert degrees to radians
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distance = R * c; // Distance in km
      return distance;
    };
    
    const findClosestCenters = (userLat, userLon, centers) => {
      return centers
        .map(center => ({
          ...center,
          distance: calculateDistance(userLat, userLon, center.latitude, center.longitude)
        }))
        .sort((a, b) => a.distance - b.distance) // Ascending order for closest centers first
        .slice(0, 9);
    };

    const handleUserLocation = async () => {
      if (location.state && location.state.latitude && location.state.longitude) {
        const centers = await fetchCoolingCentersWithCoordinates();
        console.log("Fetched centers with coordinates:", centers);
        const closest = findClosestCenters(location.state.latitude, location.state.longitude, centers);
        console.log("Closest centers:", closest);
        setClosestCenters(closest);
      }
    };

    handleUserLocation();
  }, [location.state]);

  const handleCenterClick = (center) => {
    console.log(center)
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
      <h1>Cooling Centers for "{term || 'Your Location'}"</h1>
      {closestCenters.length > 0 && (
        <div className="nearest-centers">
          <h2>Closest Cooling Centers to Your Location</h2>
          <div className="grid-container">
            {closestCenters.map((center, index) => (
              <button key={index} onClick={() => handleCenterClick(center)} className="grid-item">
                <div>{center.name}</div>
                <div>{center.address}</div>
                <div>{center.phone}</div>
                <div>{center.hours}</div>
                <div>Distance: {center.distance.toFixed(2)} km</div>
              </button>
            ))}
          </div>
        </div>
      )}
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
      ) : closestCenters.length === 0 && <p>No results found.</p>}
    </div>
  );
}

export default SearchPage;
