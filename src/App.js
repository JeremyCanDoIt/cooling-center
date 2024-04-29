import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SearchPage from './SearchPage';
import HomePage from './HomePage'; //Import the component for the home page

//defines routes
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} /> {/* Route for the home page */}
          <Route path="/search/:term" element={<SearchPage />} /> {/* Route for the search page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
