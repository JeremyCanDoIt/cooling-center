import './App.css';
import React, { useState, useEffect } from 'react';
import WaveRibbon from './WaveRibbon'; //Import the WaveRibbon component

function HomePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [weather, setWeather] = useState({ temp: '', windSpeed: '', time: '' });

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    window.location.href = `/search/${encodeURIComponent(searchTerm)}`;
  };

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&current=temperature_2m,wind_speed_10m`);
      const data = await response.json();
      console.log("Weather Data:", data); // Log the API response
      if (data && data.current) {
        setWeather({
          temp: `${data.current.temperature_2m} °C`,
          windSpeed: `${data.current.wind_speed_10m} km/h`,
          time: new Date().toLocaleTimeString() // Display the current time
        });
      }
    };

    fetchWeather();
    // Update time every minute
    const timerId = setInterval(() => {
      setWeather(prevWeather => ({
        ...prevWeather,
        time: new Date().toLocaleTimeString() // Update time
      }));
    }, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(timerId);
  }, []);

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

      {/* Weather display in the top-right corner */}
      <div className="weatherInfo">
        Temperature: {weather.temp} | Wind Speed: {weather.windSpeed} | Time: {weather.time}
      </div>
    </div>
  );
}

export default HomePage;
