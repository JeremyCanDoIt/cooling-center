import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './App.css';
import WaveRibbon from './WaveRibbon';

const uvcodemap = {
  "0": "Low",
  "1": "Low",
  "2": "Low",
  "3": "Moderate",
  "4": "Moderate",
  "5": "Moderate",
  "6": "High",
  "7": "High",
  "8": "Very High",
  "9": "Very High",
  "10": "Very High",
  "11": "Extreme"
};





const weatherCodeMap = {
  "0": "Unknown",
      "1000": "Clear, Sunny",
      "1100": "Mostly Clear",
      "1101": "Partly Cloudy",
      "1102": "Mostly Cloudy",
      "1001": "Cloudy",
      "2000": "Fog",
      "2100": "Light Fog",
      "4000": "Drizzle",
      "4001": "Rain",
      "4200": "Light Rain",
      "4201": "Heavy Rain",
      "5000": "Snow",
      "5001": "Flurries",
      "5100": "Light Snow",
      "5101": "Heavy Snow",
      "6000": "Freezing Drizzle",
      "6001": "Freezing Rain",
      "6200": "Light Freezing Rain",
      "6201": "Heavy Freezing Rain",
      "7000": "Ice Pellets",
      "7101": "Heavy Ice Pellets",
      "7102": "Light Ice Pellets",
      "8000": "Thunderstorm"
};

function HomePage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');  
  const [weather, setWeather] = useState({ temp: '', condition: '', time: '' , uv:'', windSpeed:'', Probability_of_precipitation:'', humidity:''});

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.tomorrow.io/v4/weather/realtime?location=Irvine&apikey=KhFP3byInIHIGi5oeDWUywBFECUoDFRR'
        );
        const data = await response.json();
        
        if (!response.ok || data.error) {
          console.error('Error fetching weather data:', data.error || response.status);
          return;
        }
    
        
        if (data && data.data && data.data.values) {
          const currentData = data.data.values;
          setWeather({
            temp: `${currentData.temperature} °C`,
            condition: weatherCodeMap[currentData.weatherCode.toString()] || 'Weather data not available',
            time: new Date(data.data.time).toLocaleTimeString(),
            uv: uvcodemap[currentData.uvIndex],
            windSpeed:`${currentData.windSpeed} m/s`,
            Probability_of_precipitation:`${currentData.precipitationProbability} %`,
            humidity:`${currentData.humidity} %`
          });
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      }
    };
  
    fetchWeather();
  }, []);
  
  
  
  

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
        Temperature: {weather.temp} | Weather: {weather.condition} | Time: {weather.time} | UV:{weather.uv} | windSpeed:{weather.windSpeed} | Probability_of_precipitation:{weather.Probability_of_precipitation}| humidity:{weather.humidity}
      </div>
    </div>
  );
}
//hi
export default HomePage;
