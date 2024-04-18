import './App.css'; //Import  CSS file for styling

// Import  image file
import backgroundImage from "./images/background-asset.png"; // from src folder

function App() {
  // Inline styles to set the background image
  const backgroundStyle = {
    backgroundImage: `url(${backgroundImage})`, // Set the background image
    backgroundSize: 'contain', // Cover the entire container
    backgroundRepeat: 'no-repeat', // Do not repeat the background image
    Height: '100vh', // Set the height to viewport height
    
    display: 'flex', // Flex display for centering content
    justifyContent: 'center', // Center horizontally
    alignItems: 'center', // Center vertically
    color: 'white', // Text color
  };

  return (
    <div className = "background" style={backgroundStyle}>
      <div className="App">
        <header className="App-header">
          {/* content goes here */}
         
        </header>
      </div>
    </div>
  );
}

export default App;

