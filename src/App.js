import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import CoolingCenterDetail from './CoolingCenterDetail'; // Import your details component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} /> // Home page route
          <Route path="/search/:term" element={<SearchPage />} /> // Search page route
          <Route path="/center/:centerName" element={<CoolingCenterDetail />} /> // Adjusted for center name
        </Routes>
      </div>
    </Router>
  );
}

export default App;
