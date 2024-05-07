import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import WaveRibbon from './WaveRibbon';

// Move weatherCodeMap outside of the component
const weatherCodeMap = {
  "0": "Clear sky",
  "1": "Mainly clear",
  "2": "Partly cloudy",
  "3": "Overcast",
  "45": "Fog",
  "48": "Depositing rime fog",
  "51": "Drizzle: Light",
  "53": "Drizzle: Moderate",
  "55": "Drizzle: Dense intensity",
  "56": "Freezing Drizzle: Light",
  "57": "Freezing Drizzle: Dense intensity",
  "61": "Rain: Slight",
  "63": "Rain: Moderate",
  "65": "Rain: Heavy intensity",
  "66": "Freezing Rain: Light",
  "67": "Freezing Rain: Heavy intensity",
  "71": "Snow fall: Slight",
  "73": "Snow fall: Moderate",
  "75": "Snow fall: Heavy intensity",
  "77": "Snow grains",
  "80": "Rain showers: Slight",
  "81": "Rain showers: Moderate",
  "82": "Rain showers: Violent",
  "85": "Snow showers slight",
  "86": "Snow showers heavy",
  "95": "Thunderstorm: Slight or moderate",
  "96": "Thunderstorm with slight hail",
  "99": "Thunderstorm with heavy hail"
};

function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');  
  const [weather, setWeather] = useState({ temp: '', condition: '', time: '' });

  useEffect(() => {
    const fetchWeather = async () => {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=39.76&longitude=-98.5&current=temperature_2m,rain,weather_code&hourly=temperature_2m&daily=weather_code&timezone=America%2FLos_Angeles`
      );
      const data = await response.json();
      if (data && data.current) {
        setWeather({
          temp: `${data.current.temperature_2m} °C`,
          condition: weatherCodeMap[data.current.weather_code.toString()] || 'Weather data not available',
          time: new Date().toLocaleTimeString()
        });
      }
    };

    fetchWeather();
  }, []); // weatherCodeMap is not in the dependency array because it is constant

  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  const handleSearchSubmit = () => {
    navigate(`/search/${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="App">
      <div className="title">Find a Cooling Center Near You</div>
      <div className="searchBarContainer">
        <input
          className="searchBar"
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
        />
        <button className="searchButton" onClick={handleSearchSubmit}>Search</button>
      </div>
      <WaveRibbon />
      <div className="weatherInfo">
        Temperature: {weather.temp} | Weather: {weather.condition} | Time: {weather.time}
      </div>
    </div>
  );
}

export default HomePage;
