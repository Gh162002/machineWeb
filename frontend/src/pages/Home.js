import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container">
      <div className="page-header">
        <h2>Bienvenue sur la Plateforme ML RH</h2>
        <p>Utilisez l'intelligence artificielle pour optimiser la gestion de vos ressources humaines</p>
      </div>

      <div className="grid grid-3">
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📊</div>
          <h3 style={{ marginBottom: '12px', color: '#111827' }}>Prédiction d'Attrition</h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Identifiez les employés à risque de quitter l'entreprise avec notre modèle XGBoost optimisé.
          </p>
          <Link to="/attrition">
            <button className="btn btn-primary">Essayer maintenant</button>
          </Link>
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            <strong>Modèle :</strong> XGBoost + SMOTE (seuil=0.15)<br />
            <strong>Recall :</strong> 68% | AUC : 0.731
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎯</div>
          <h3 style={{ marginBottom: '12px', color: '#111827' }}>Segmentation</h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Classez vos employés en groupes homogènes et détectez les profils atypiques avec DBSCAN.
          </p>
          <Link to="/segmentation">
            <button className="btn btn-primary">Essayer maintenant</button>
          </Link>
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            <strong>Modèle :</strong> DBSCAN + PCA<br />
            <strong>Silhouette :</strong> 0.54
          </div>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <h3 style={{ marginBottom: '12px', color: '#111827' }}>Recommandation</h3>
          <p style={{ color: '#6b7280', marginBottom: '20px' }}>
            Obtenez un score de recommandation basé sur le profil et la performance de l'employé.
          </p>
          <Link to="/recommendation">
            <button className="btn btn-primary">Essayer maintenant</button>
          </Link>
          <div style={{ marginTop: '16px', fontSize: '14px', color: '#6b7280' }}>
            <strong>Modèle :</strong> Régression Linéaire<br />
            <strong>Score :</strong> 0-100
          </div>
        </div>
      </div>

      <div className="card" style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>📈 À propos du projet</h3>
        <div className="grid grid-2">
          <div>
            <h4 style={{ color: '#667eea', marginBottom: '12px' }}>Objectifs</h4>
            <ul style={{ color: '#374151', lineHeight: '1.8' }}>
              <li><strong>DSO1 :</strong> Prédire les employés à risque d'attrition</li>
              <li><strong>DSO2 :</strong> Segmenter les employés en groupes homogènes</li>
              <li><strong>DSO3 :</strong> Recommander les employés les plus adaptés</li>
            </ul>
          </div>
          <div>
            <h4 style={{ color: '#667eea', marginBottom: '12px' }}>Technologies</h4>
            <ul style={{ color: '#374151', lineHeight: '1.8' }}>
              <li><strong>Backend :</strong> FastAPI + Python</li>
              <li><strong>Frontend :</strong> React + JavaScript</li>
              <li><strong>ML :</strong> Scikit-learn, SMOTE, PCA</li>
              <li><strong>Déploiement :</strong> Docker + Cloud</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">3</div>
          <div className="stat-label">Modèles ML</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">1470</div>
          <div className="stat-label">Employés analysés</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">35</div>
          <div className="stat-label">Features utilisées</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">68%</div>
          <div className="stat-label">Recall DSO1 (XGBoost)</div>
        </div>
      </div>
    </div>
  );
}

export default Home;
