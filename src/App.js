import './App.css';
import { useState, useEffect } from 'react';
import WaveRibbon from './WaveRibbon'; //Import the WaveRibbon component

function App() {
  //css for the page, should probably move this out
  const gradientBackground = {
    background: 'rgb(211,255,253)',
    background: 'linear-gradient(180deg, rgba(211,255,253,1) 0%, rgba(149,241,237,1) 22%, rgba(91,197,219,1) 51%, rgba(94,169,252,1) 100%)'
  };

  const titleStyle = {
    top: '5%',
    left: '5%',
    position: 'fixed', 
    color: 'black',
    fontSize: '4vw',
    fontWeight: 'bold',
    textAlign: 'left',
    maxWidth: '70%',
    margin: '3% 3%'
  };
  
  const searchBarStyle = {
    position: 'fixed', 
    width: '80%',
    top: '35%',
    left: '5%',
    margin: '3% 3%',
    maxWidth: '700px',
    borderRadius: '20px',
    padding: '10px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    fontSize: '1rem',
    border: 'none',
    outline:'none'
 
  };
  

  //declarations of "classes" in js
  const [coolingCenters, setCoolingCenters] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  //using use effect to fetch api
  useEffect(() => {
    //Function to fetch cooling center data from the API
    const fetchCoolingCenters = async () => {
      try {
        const response = await fetch(// only retrieve names right now
          'https://public.gis.lacounty.gov/public/rest/services/LACounty_Dynamic/LMS_Data_Public/MapServer/55/query?outFields=Name&where=1%3D1&f=geojson'
        );
        const data = await response.json();
        setCoolingCenters(data.features.map(feature => feature.properties.Name));
      } catch (error) {
        console.error('Error fetching cooling centers:', error);
      }
    };

    fetchCoolingCenters();
  }, 
  []);

  //dynamic update of search
  const handleSearchChange = event => {
    setSearchTerm(event.target.value);
  };

  //filter the content only by what matches the search bar
  const filteredCoolingCenters = coolingCenters.filter(center =>
    center.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //here is where we actually define the html of the page
  return (

      
      <div className="App" style={gradientBackground}>

    
        <div style={titleStyle}>
          Find a Cooling Center<br/>Near You
        </div>
      
      <input
        type="text"
        placeholder="Search..."
        value={searchTerm}
        style={searchBarStyle} 
        onChange={handleSearchChange}
      />
      
      <div className="cooling-center-list">
        {filteredCoolingCenters.map((center, index) => (
          <div key={index}>{center}</div>
        ))}
      </div>
      
      <WaveRibbon /> {/* Includes the WaveRibbon component */}
    </div>
  );
}

export default App;
//