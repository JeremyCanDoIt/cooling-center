import './App.css';
import WaveRibbon from './WaveRibbon'; // Import the WaveRibbon component

function App() {
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
  

  
  return (
    <div className="App" style={gradientBackground}>
      <div style={titleStyle}>
        Find a Cooling Center<br/>Near You
      </div>
      
      <input type="text" placeholder="Search..." style={searchBarStyle} />
      
      <WaveRibbon /> {/* Include the WaveRibbon component */}
      
      {/* more stuff??? */}

     
    </div>
  );
}

export default App;
