import React, { useState, useMemo, useEffect, useContext } from 'react';
import { HashRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import IntroPage from './pages/IntroPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GetStartedPage from './pages/GetStartedPage';
import GetInspiredPage from './pages/GetInspiredPage';
import AnalysePage from './pages/AnalysePage';
import ContributePage from './pages/ContributePage';
import ContextualizePage from './pages/ContextualizePage';
import IdeatePage from './pages/IdeatePage';
import ComparePage from './pages/ComparePage';
import './styles/App.css';
import { State, StateContext } from "./State";

function App() {
  const {
    colors,
    firstMessage,
    setFirstMessage,
    isExplanationPage,
    setIsExplanationPage,
    savedComponents,
    setSavedComponents,
    savedCaseStudies,
    setSavedCaseStudies,
    newCaseStudies,
    setNewCaseStudies,
    GSComponents,
    setGSComponents,
    GSCurrentComponent,
    setGSCurrentComponent,
    LComponents,
    setLComponent,
    GIComponents,
    setGIComponents,
    GICurrentComponents,
    setGICurrentComponents,
  } = useContext(StateContext);

  const location = useLocation();
  const navigate = useNavigate();

  // useEffect(() => {
  //   // Redirect to /ol-compass when the app is loaded (on refresh)
  //   if (location.pathname !== '/ol-compass') {
  //     navigate('/ol-compass', { replace: true });
  //     localStorage.removeItem('showMore');
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []); // Run only on the initial mount

  useEffect(() => {
    setIsExplanationPage(true); // Reset to initial state when the page changes
    setGSComponents([]);
    setGSCurrentComponent([]);
    setLComponent([]);
    setGIComponents([]);
    setGICurrentComponents([]);
  }, [location.pathname]);

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
            path="/get-inspired"
            element={<GetInspiredPage />}
          />
          <Route
            path="/analyse"
            element={<AnalysePage />}
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
            path="/ideate"
            element={<IdeatePage />}
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
