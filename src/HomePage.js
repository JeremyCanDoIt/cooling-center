import './App.css';
import React, { useState } from 'react';
import WaveRibbon from './WaveRibbon'; //Import the WaveRibbon component

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    //Redirect to the search page with the searchTerm as a query parameter
    window.location.href = `/search/${encodeURIComponent(searchTerm)}`;
  };

  return (
      <div className="App">
        <div className="title">
          Find a Cooling Center Near You
        </div>

        <div className="searchBarContainer">
          <input
            className='searchBar'
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button className="searchButton" onClick={handleSearchSubmit}>Search</button>
        </div>
        
      <WaveRibbon /> {/* Include the WaveRibbon component */}
      </div>
  );
}

export default HomePage;
