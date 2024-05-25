import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import './CenterDetails.css';
import { GoogleMap, Marker, useJsApiLoader, DirectionsRenderer } from '@react-google-maps/api'; // Import DirectionsRenderer

// Define libraries as a constant outside of the component function
const libraries = ['places'];

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

function CoolingCenterDetail() {
  const location = useLocation();
  const center = location.state ? location.state.center : null;
  const [centerLatLng, setCenterLatLng] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [weather, setWeather] = useState({ temp: '', condition: '', time: '', uv: '', windSpeed: '', Probability_of_precipitation: '', humidity: '' });

  // Memoize the libraries array to prevent unnecessary re-renders
  const memoizedLibraries = useMemo(() => libraries, []);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyA5uB3h3JEXkF6wE7Ldt358C9iTY6yh6qo',
    libraries: memoizedLibraries, // Use the memoized libraries array
  });

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.error('Error: The Geolocation service failed.');
        }
      );
    } else {
      console.error('Error: Your browser doesn\'t support geolocation.');
    }
  }, []);

  useEffect(() => {
    if (center && center.address && isLoaded) {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ address: center.address }, (results, status) => {
        if (status === 'OK' && results && results.length > 0) {
          const location = results[0].geometry.location;
          setCenterLatLng({ lat: location.lat(), lng: location.lng() });
        } else {
          console.error('Geocode was not successful for the following reason:', status);
        }
      });
    }
  }, [center, isLoaded]);

  useEffect(() => {
    // Calculate directions when both userLocation and centerLatLng are available
    if (userLocation && centerLatLng) {
      const directionsService = new window.google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: centerLatLng,
          travelMode: 'DRIVING'
        },
        (result, status) => {
          if (status === 'OK') {
            setDirections(result);
          } else {
            console.error('Directions request failed due to ' + status);
          }
        }
      );
    }
  }, [userLocation, centerLatLng]);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          'https://api.tomorrow.io/v4/weather/realtime?location=LAs&apikey=KhFP3byInIHIGi5oeDWUywBFECUoDFRR'
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
            uv: uvcodemap[currentData.uvIndex],
            windSpeed: `${currentData.windSpeed} m/s`,
            Probability_of_precipitation: `${currentData.precipitationProbability} %`,
            humidity: `${currentData.humidity} %`,
            time: new Date(data.data.time).toLocaleTimeString()
          });
        }
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      }
    };

    fetchWeather();
    const intervalId = setInterval(() => {
      setWeather(prevWeather => ({
        ...prevWeather,
        time: new Date().toLocaleTimeString()
      }));
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (!center) {
    return <p>No center details available. Please select a center from the search page.</p>;
  }

  if (loadError) {
    return <p>There was an error loading the Google Maps API: {loadError.message}</p>;
  }

  return (
    <div className="center-detail">
      <h1>{center.name || 'Information Not Available'}</h1>
      <p>Address: {center.address || 'Information Not Available'}</p>
      <p>Phone: {center.phone || 'Information Not Available'}</p>
      <p>Hours: {center.hours || 'Information Not Available'}</p>
      <div className="weatherInfo">
        Temperature: {weather.temp} | Weather: {weather.condition} | Time: {weather.time} | UV: {weather.uv} | Wind Speed: {weather.windSpeed} | Probability of Precipitation: {weather.Probability_of_precipitation} | Humidity: {weather.humidity}
      </div>
      {isLoaded && centerLatLng && (
        <GoogleMap
          zoom={18} // Change the zoom level to zoom in very close
          center={centerLatLng}
          mapContainerStyle={{ height: '400px', width: '100%' }}
        >
          <Marker position={centerLatLng} />
          {userLocation && directions && (
            <DirectionsRenderer directions={directions} />
          )}
        </GoogleMap>
      )}
    </div>
  );
}

export default CoolingCenterDetail;
