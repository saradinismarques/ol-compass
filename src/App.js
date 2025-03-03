import React, { useEffect, useContext, useState } from 'react';
import { HashRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import Learn2Page from './pages/Learn2Page';
import GetStartedPage from './pages/GetStartedPage';
import GetInspiredPage from './pages/GetInspiredPage';
import MapPage from './pages/MapPage';
import Map2Page from './pages/Map2Page';
import ContributePage from './pages/ContributePage';
import ContextualizePage from './pages/ContextualizePage';
import ComparePage from './pages/ComparePage';
import './styles/App.css';
import { State, StateContext } from "./State";

function App() {
  const {
    setIsExplanationPage,
  } = useContext(StateContext);

  const [isLandscape, setIsLandscape] = useState(window.matchMedia("(orientation: landscape)").matches);
  const location = useLocation();

  function adjustVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }
  
  // Call once and attach listener
  adjustVH();
  window.addEventListener('resize', adjustVH);
  
  // useEffect(() => {
  //   // Redirect to /ol-compass when the app is loaded (on refresh)
  //   if (location.pathname !== '/ol-compass') {
  //     navigate('/ol-compass', { replace: true });
  //     localStorage.removeItem('showMore');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Run only on the initial mount

  // Effect to handle orientation changes
  useEffect(() => {
    const handleOrientationChange = () => {
      setIsLandscape(window.matchMedia("(orientation: landscape)").matches);
    };

    // Listen for orientation changes
    window.addEventListener("resize", handleOrientationChange);

    // Cleanup listener on unmount
    return () => window.removeEventListener("resize", handleOrientationChange);
  }, []);

  useEffect(() => {
    setIsExplanationPage(true); // Reset to initial state when the page changes
  }, [location.pathname, setIsExplanationPage]);

  // If not in landscape, show warning message
  if (!isLandscape) {
    return (
      <div className="orientation-warning">
        <h2>We don't support portrait mode yet :(</h2>
        <p>Please rotate your device to landscape mode for the best experience!</p>
      </div>
    );
  }

  return (
    <div className="App">
      <main>
        <Routes>
          <Route 
            path="/ol-compass" 
            element={<IntroPage />} 
          />
          <Route 
            path="/home" 
            element={<HomePage />} 
            />
          <Route
            path="/get-started"
            element={<GetStartedPage />
            }
          />
          <Route
            path="/learn"
            element={<LearnPage />}
          />
          <Route
            path="/learn2"
            element={<Learn2Page />}
          />
          <Route
            path="/get-inspired"
            element={<GetInspiredPage />}
          />
          <Route 
            path="/map" 
            element={<MapPage />} 
          />
          <Route 
            path="/map2" 
            element={<Map2Page />} 
          />
          <Route
            path="/contribute"
            element={<ContributePage />}
          />
          <Route
            path="/contextualize"
            element={<ContextualizePage />}
          />
          <Route
            path="/compare"
            element={<ComparePage />}
          /> 
          {/* Catch-all route */}
          <Route path="*" element={<IntroPage />} />
        </Routes>
      </main>
    </div>
  );
}

function RouterWrapper() {
  return (
    <State>
      <Router>
        <App />
      </Router>
    </State>
  );
}

export default RouterWrapper;
