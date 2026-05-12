import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import AttritionPredictor from './pages/AttritionPredictor';
import Segmentation from './pages/Segmentation';
import Recommendation from './pages/Recommendation';
import Home from './pages/Home';
import AppLogo from './components/AppLogo';
import './icons';  // enregistre tous les icônes FA
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse, faChartBar, faBullseye, faStar,
  faBell, faUser, faBars, faXmark,
  faCode, faServer, faDatabase, faCloud,
  faArrowRight,
} from '@fortawesome/free-solid-svg-icons';import './App.css';

const NAV_ITEMS = [
  { to: '/',               label: 'Accueil',        icon: faHouse,    key: 'home' },
  { to: '/attrition',      label: 'Attrition',      icon: faChartBar, key: 'attrition' },
  { to: '/segmentation',   label: 'Segmentation',   icon: faBullseye, key: 'segmentation' },
  { to: '/recommendation', label: 'Recommandation', icon: faStar,     key: 'recommendation' },
];

const TECH_BADGES = [
  { label: 'FastAPI',  color: '#34C98A', icon: faServer   },
  { label: 'React',    color: '#60C8F5', icon: faCode     },
  { label: 'XGBoost',  color: '#F4607A', icon: faDatabase },
  { label: 'DBSCAN',   color: '#7C6FF7', icon: faBullseye },
  { label: 'Docker',   color: '#F5A623', icon: faCloud    },
];
/* ── Navbar ── */
function Navbar({ drawerOpen, setDrawerOpen }) {
  const location = useLocation();

  return (
    <>
      <nav className="navbar" role="navigation" aria-label="Navigation principale">
        <div className="navbar-inner">

          {/* Logo */}
          <Link to="/" className="nav-logo" onClick={() => setDrawerOpen(false)}>
            <AppLogo size={36} />
            <span className="nav-logo-text">ML RH Platform</span>
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {NAV_ITEMS.map(item => (
              <Link
                key={item.key}
                to={item.to}
                className={location.pathname === item.to ? 'active' : ''}
              >
                <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="nav-right">
            <button className="nav-icon-btn" aria-label="Notifications" title="Notifications">
              <FontAwesomeIcon icon={faBell} />
              <span className="nav-badge" aria-hidden="true" />
            </button>
            <div className="nav-avatar" role="img" aria-label="Profil utilisateur" title="ML RH Team">
              <FontAwesomeIcon icon={faUser} style={{ fontSize: '14px' }} />
            </div>
            <button
              className="nav-hamburger"
              aria-label={drawerOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
              aria-expanded={drawerOpen}
              onClick={() => setDrawerOpen(v => !v)}
            >
              <FontAwesomeIcon icon={drawerOpen ? faXmark : faBars} style={{ fontSize: '18px', color: 'var(--color-muted)' }} />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div
        className={`nav-drawer ${drawerOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Menu mobile"
      >
        <div className="nav-drawer-overlay" onClick={() => setDrawerOpen(false)} aria-hidden="true" />
        <div className="nav-drawer-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
            <AppLogo size={32} />
            <span className="nav-logo-text">ML RH Platform</span>
          </div>
          {NAV_ITEMS.map(item => (
            <Link
              key={item.key}
              to={item.to}
              className={location.pathname === item.to ? 'active' : ''}
              onClick={() => setDrawerOpen(false)}
            >
              <FontAwesomeIcon icon={item.icon} aria-hidden="true" />
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}

/* ── Footer ── */
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <AppLogo size={32} />
            <span className="footer-brand-name">ML RH Platform</span>
          </div>
          <p className="footer-tagline">
            Plateforme d'intelligence artificielle pour la gestion des ressources humaines.
            Prédiction, segmentation et recommandation basées sur des modèles ML entraînés.
          </p>
          <div className="footer-tech-badges">
            {TECH_BADGES.map(b => (
              <span key={b.label} className="tech-badge">
                <FontAwesomeIcon icon={b.icon} style={{ color: b.color, fontSize: '10px' }} aria-hidden="true" />
                {b.label}
              </span>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <div>
          <div className="footer-col-title">Navigation</div>
          <ul className="footer-links">
            {NAV_ITEMS.map(item => (
              <li key={item.key}>
                <Link to={item.to}>
                  <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px', marginRight: '6px', opacity: 0.5 }} aria-hidden="true" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Models */}
        <div>
          <div className="footer-col-title">Modèles ML</div>
          <ul className="footer-links">
            <li><a href="#dso1"><FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px', marginRight: '6px', opacity: 0.5 }} aria-hidden="true" />DSO1 — XGBoost + SMOTE</a></li>
            <li><a href="#dso2"><FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px', marginRight: '6px', opacity: 0.5 }} aria-hidden="true" />DSO2 — DBSCAN + PCA</a></li>
            <li><a href="#dso3"><FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px', marginRight: '6px', opacity: 0.5 }} aria-hidden="true" />DSO3 — Régression Linéaire</a></li>
            <li>
              <a href="https://github.com/Gh162002/machineWeb" target="_blank" rel="noreferrer">
                <FontAwesomeIcon icon={faArrowRight} style={{ fontSize: '10px', marginRight: '6px', opacity: 0.5 }} aria-hidden="true" />
                GitHub Repository
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        © 2026 ML RH Platform — ESPRIT Tunis &nbsp;·&nbsp; Built with ♥ using AI
      </div>
    </footer>
  );
}

/* ── App ── */
function AppContent() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  return (
    <div className="App">
      <Navbar drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} />
      <main className="main-content">
        <Routes>
          <Route path="/"               element={<Home />} />
          <Route path="/attrition"      element={<AttritionPredictor />} />
          <Route path="/segmentation"   element={<Segmentation />} />
          <Route path="/recommendation" element={<Recommendation />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
