// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LearnPage from './pages/LearnPage';

import Menu from './components/Menu'
import OLDiagram from './components/OLDiagram'

import './styles/App.css';
 
function App() {
  return (
    <OLDiagram />
  );
}

// function App() {
//   return (
//     <Router>
//       <div className="App">
//         <main>
//           <Routes>
//             <Route path="/" element={<HomePage />} />
//             <Route path="/learn" element={<LearnPage />} />
//           </Routes>
//         </main>
//         <Menu />
//       </div>
//     </Router>
//   );
// }

export default App;
