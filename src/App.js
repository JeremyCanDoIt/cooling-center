import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './HomePage';
import SearchPage from './SearchPage';
import CoolingCenterDetail from './CoolingCenterDetail'; 

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/search/:term" element={<SearchPage />} /> 
          <Route path="/center/:centerName" element={<CoolingCenterDetail />} /> 
        </Routes>
      </div>
    </Router>
  );
}

export default App;
