import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AttritionPredictor from './pages/AttritionPredictor';
import Segmentation from './pages/Segmentation';
import Recommendation from './pages/Recommendation';
import Home from './pages/Home';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="container">
            <div className="nav-brand">
              <h1>🎯 ML RH Platform</h1>
              <p>Intelligence Artificielle pour la Gestion des Ressources Humaines</p>
            </div>
            <div className="nav-links">
              <Link 
                to="/" 
                className={activeTab === 'home' ? 'active' : ''}
                onClick={() => setActiveTab('home')}
              >
                🏠 Accueil
              </Link>
              <Link 
                to="/attrition" 
                className={activeTab === 'attrition' ? 'active' : ''}
                onClick={() => setActiveTab('attrition')}
              >
                📊 Attrition
              </Link>
              <Link 
                to="/segmentation" 
                className={activeTab === 'segmentation' ? 'active' : ''}
                onClick={() => setActiveTab('segmentation')}
              >
                🎯 Segmentation
              </Link>
              <Link 
                to="/recommendation" 
                className={activeTab === 'recommendation' ? 'active' : ''}
                onClick={() => setActiveTab('recommendation')}
              >
                ⭐ Recommandation
              </Link>
            </div>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/attrition" element={<AttritionPredictor />} />
            <Route path="/segmentation" element={<Segmentation />} />
            <Route path="/recommendation" element={<Recommendation />} />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <p>© 2026 ML RH Platform - Projet Data Science</p>
            <p>Développé avec ❤️ par l'équipe ML RH</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
