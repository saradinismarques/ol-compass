// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation  } from 'react-router-dom';
import InitialPage from './pages/InitialPage';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';
import GetInspiredPage from './pages/GetInspiredPage';
import AnalyzePage from './pages/AnalyzePage';

import Menu from './components/Menu'

import './styles/App.css';
 
function App() {
  const location = useLocation();
  const isInitialPage = location.pathname === '/';

  const colors = {
    Principle: "#41ffc9",
    Perspective: "#41e092",
    Dimension: "#41c4e0"
  };

  return (
    <div className="App">
      <main>
        <Routes>
          <Route path="/" element={<InitialPage colors={colors}/>} />
          <Route path="/home" element={<HomePage colors={colors}/>} />
          <Route path="/learn" element={<LearnPage colors={colors}/>} />
          <Route path="/get-inspired" element={<GetInspiredPage colors={colors}/>} />
          <Route path="/analyze" element={<AnalyzePage colors={colors}/>} />
        </Routes>
      </main>
      {!isInitialPage && <Menu />}
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
