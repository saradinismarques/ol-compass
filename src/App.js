// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import ContextualizePage from './pages/ContextualizePage';
import GetInspiredPage from './pages/GetInspiredPage';
import AnalyzePage from './pages/AnalyzePage';
import IdeatePage from './pages/IdeatePage';
import ComparePage from './pages/ComparePage';
import EvaluatePage from './pages/EvaluatePage';
import MakeYoursPage from './pages/MakeYoursPage';

import Menu from './components/Menu'

import './styles/App.css';
const basename = process.env.NODE_ENV === 'production' ? '/ol-compass' : '';
 
function App() {

  const location = useLocation();
  const isInitialPage = location.pathname === '/' || location.pathname === '/ol-compass';

  const colors = {
    Principle: "#41ffc9",
    Perspective: "#41e092",
    Dimension: "#41c4e0"
  };

  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/ol-compass" element={<InitialPage colors={colors}/>} />
          <Route path="/ol-compass/home" element={<HomePage colors={colors}/>} />
          <Route path="/ol-compass/learn" element={<LearnPage colors={colors}/>} />
          <Route path="/ol-compass/get-inspired" element={<GetInspiredPage colors={colors}/>} />
          <Route path="/ol-compass/contextualize" element={<ContextualizePage colors={colors}/>} />
          <Route path="/ol-compass/analyze" element={<AnalyzePage colors={colors}/>} />
          <Route path="/ol-compass/ideate" element={<IdeatePage colors={colors}/>} />
          <Route path="/ol-compass/compare" element={<ComparePage colors={colors}/>} />
          <Route path="/ol-compass/evaluate" element={<EvaluatePage colors={colors}/>} />
          <Route path="/ol-compass/make-yours" element={<MakeYoursPage colors={colors}/>} />
        </Routes>
      </main>
      {!isInitialPage && <Menu />}
    </div>
  );
}

function RouterWrapper() {
  return (
    <Router basename={basename}>
      <App />
    </Router>
  );
}

export default RouterWrapper;
