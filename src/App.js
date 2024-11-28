import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GetStartedPage from './pages/GetStartedPage';
import GetInspiredPage from './pages/GetInspiredPage';
import ContributePage from './pages/ContributePage';
import ContextualizePage from './pages/ContextualizePage';
import IdeatePage from './pages/IdeatePage';
import ComparePage from './pages/ComparePage';
import './styles/App.css';
import { getColorPallete } from './utils/Data.js'; 

function App() {
  const [savedCaseStudies, setSavedCaseStudies] = useState([]);
  const [savedComponents, setSavedComponents] = useState([]);
  const [newCaseStudies, setNewCaseStudies] = useState([]);

  const colors = getColorPallete(2);

  const initialFirstMessage = useMemo(
    () => ({
      getStarted: true,
      learn: true,
      getInspired: true,
      contribute: true,
    }),
    []
  );
  const [firstMessage, setFirstMessage] = useState(initialFirstMessage);
  const [isExplanationPage, setIsExplanationPage] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to /ol-compass when the app is loaded (on refresh)
    if (location.pathname !== '/ol-compass') {
      navigate('/ol-compass', { replace: true });
      localStorage.removeItem('showMore');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on the initial mount

  useEffect(() => {
    setIsExplanationPage(true); // Reset to initial state when the page changes
  }, [location.pathname]);

  return (
    <div className="App">
      <main>
        <Routes>
          <Route 
            path="/ol-compass" 
            element={
              <InitialPage 
                colors={colors}
              />} 
          />
          <Route 
            path="/home" 
            element={
              <HomePage 
                colors={colors}
              />} 
            />
          <Route
            path="/get-started"
            element={
              <GetStartedPage
                colors={colors}
                savedComponents={savedComponents}
                setSavedComponents={setSavedComponents}
                firstMessage={firstMessage.getStarted}
                setFirstMessage={setFirstMessage}
                isExplanationPage={isExplanationPage}
                setIsExplanationPage={setIsExplanationPage}
              />
            }
          />
          <Route
            path="/learn"
            element={
              <LearnPage
                colors={colors}
                savedComponents={savedComponents}
                setSavedComponents={setSavedComponents}
                firstMessage={firstMessage.learn}
                setFirstMessage={setFirstMessage}
                isExplanationPage={isExplanationPage}
                setIsExplanationPage={setIsExplanationPage}
              />
            }
          />
          <Route
            path="/get-inspired"
            element={
              <GetInspiredPage
                colors={colors}
                savedCaseStudies={savedCaseStudies}
                setSavedCaseStudies={setSavedCaseStudies}
                newCaseStudies={newCaseStudies}
                firstMessage={firstMessage.getInspired}
                setFirstMessage={setFirstMessage}
                isExplanationPage={isExplanationPage}
                setIsExplanationPage={setIsExplanationPage}
              />
            }
          />
          <Route
            path="/contribute"
            element={
              <ContributePage
                colors={colors}
                newCaseStudies={newCaseStudies}
                setNewCaseStudies={setNewCaseStudies}
                firstMessage={firstMessage.contribute}
                setFirstMessage={setFirstMessage}
                isExplanationPage={isExplanationPage}
                setIsExplanationPage={setIsExplanationPage}
              />
            }
          />
          <Route
            path="/contextualize"
            element={
              <ContextualizePage
                colors={colors}
                isExplanationPage={isExplanationPage}
                setIsExplanationPage={setIsExplanationPage}
              />
            }
          />
          <Route
            path="/ideate"
            element={
              <IdeatePage
                colors={colors}
                isExplanationPage={isExplanationPage}
                setIsExplanationPage={setIsExplanationPage}
              />
            }
          />
          <Route
            path="/compare"
            element={
              <ComparePage
                colors={colors}
                isExplanationPage={isExplanationPage}
                setIsExplanationPage={setIsExplanationPage}
              />
            }
          />
          {/* Catch-all route */}
          <Route path="*" element={<InitialPage colors={colors}/>} />
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
