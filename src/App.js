// src/App.js
import React, { useState, useMemo, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes  } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GetInspiredPage from './pages/GetInspiredPage';
import ContributePage from './pages/ContributePage';
import ContextualizePage from './pages/ContextualizePage';
import IdeatePage from './pages/IdeatePage';
import ComparePage from './pages/ComparePage';
import { useLocation } from 'react-router-dom';
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
  
  const initialfirstMessage = useMemo(() => ({
    learn: true, 
    getInspired: true,
    contribute: true,
  }), []);
  const [firstMessage, setFirstMessage] = useState(initialfirstMessage);

  const [isExplanationPage, setIsExplanationPage] = useState(true);

  // Get the current location (route)
  const location = useLocation();

  // Reset the state when the route changes
  useEffect(() => {
    // Reset to initial state when the page changes
    setIsExplanationPage(true);
  }, [location.pathname]); // Re-run on location (page) change


  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/ol-compass" element={<InitialPage colors={colors}/>} />
          <Route path="/ol-compass/home" element={<HomePage colors={colors}/>} />
          <Route path="/ol-compass/learn" element={<LearnPage colors={colors} savedComponents={savedComponents} setSavedComponents={setSavedComponents} firstMessage={firstMessage.learn} setFirstMessage={setFirstMessage} isExplanationPage={isExplanationPage} setIsExplanationPage={setIsExplanationPage} />} />
          <Route path="/ol-compass/get-inspired" element={<GetInspiredPage colors={colors} savedCaseStudies={savedCaseStudies} setSavedCaseStudies={setSavedCaseStudies} newCaseStudies={newCaseStudies} firstMessage={firstMessage.getInspired} setFirstMessage={setFirstMessage} isExplanationPage={isExplanationPage} setIsExplanationPage={setIsExplanationPage} />} />
          <Route path="/ol-compass/contribute" element={<ContributePage colors={colors} newCaseStudies={newCaseStudies} setNewCaseStudies={setNewCaseStudies} firstMessage={firstMessage.contribute} setFirstMessage={setFirstMessage} isExplanationPage={isExplanationPage} setIsExplanationPage={setIsExplanationPage} />} />
          <Route path="/ol-compass/contextualize" element={<ContextualizePage colors={colors} isExplanationPage={isExplanationPage} setIsExplanationPage={setIsExplanationPage} />} />
          <Route path="/ol-compass/ideate" element={<IdeatePage colors={colors} isExplanationPage={isExplanationPage} setIsExplanationPage={setIsExplanationPage} />} />
          <Route path="/ol-compass/compare" element={<ComparePage colors={colors} isExplanationPage={isExplanationPage} setIsExplanationPage={setIsExplanationPage} />} />
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
