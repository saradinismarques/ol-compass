// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GetInspiredPage from './pages/GetInspiredPage';
import AnalyzePage from './pages/AnalyzePage';
import ContextualizePage from './pages/ContextualizePage';
import IdeatePage from './pages/IdeatePage';
import ComparePage from './pages/ComparePage';

import './styles/App.css';
 
function App() {
  const colors = {
    Principle: "#41ffc9",
    Perspective: "#41e092",
    Dimension: "#41c4e0"
  };

  const [savedCaseStudies, setSavedCaseStudies] = useState([]);;
  const [savedComponents, setSavedComponents] = useState([]);
  const [newCaseStudies, setNewCaseStudies] = useState([]);

  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/ol-compass" element={<InitialPage colors={colors}/>} />
          <Route path="/ol-compass/home" element={<HomePage colors={colors}/>} />
          <Route path="/ol-compass/learn" element={<LearnPage colors={colors} savedComponents={savedComponents} setSavedComponents={setSavedComponents} />} />
          <Route path="/ol-compass/get-inspired" element={<GetInspiredPage colors={colors} savedCaseStudies={savedCaseStudies} setSavedCaseStudies={setSavedCaseStudies} newCaseStudies={newCaseStudies} />} />
          <Route path="/ol-compass/analyze" element={<AnalyzePage colors={colors} newCaseStudies={newCaseStudies} setNewCaseStudies={setNewCaseStudies}/>} />
          <Route path="/ol-compass/contextualize" element={<ContextualizePage colors={colors} />} />
          <Route path="/ol-compass/ideate" element={<IdeatePage colors={colors}/>} />
          <Route path="/ol-compass/compare" element={<ComparePage colors={colors}/>} />
        </Routes>
      </main>
    </div>
  );
}

function RouterWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default RouterWrapper;
