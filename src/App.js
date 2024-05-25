import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import TipsPage from './TipsPage';
import SearchPage from './SearchPage';
import CoolingCenterDetail from './CoolingCenterDetail';
import Radius from './radius';  // Import the Radius component

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search/:term" element={<SearchPage />} />
          <Route path="/tips" element={<TipsPage />} />
          <Route path="/center/:centerName" element={<CoolingCenterDetail />} />
          <Route path="/radius" element={<Radius />} />  {/* Add the new route for the Radius page */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
