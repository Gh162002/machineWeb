import React, { useState } from 'react';
import axios from 'axios';

function Segmentation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    Age: 35,
    MonthlyIncome: 5000,
    YearsAtCompany: 5,
    YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 3,
    TotalWorkingYears: 10,
    JobSatisfaction: 4,
    WorkLifeBalance: 3,
    EnvironmentSatisfaction: 3
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('/api/predict/segmentation', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la segmentation');
    } finally {
      setLoading(false);
    }
  };

  const getClusterInfo = (cluster) => {
    const clusterData = {
      0: {
        color: '#3b82f6',
        icon: '🌱',
        title: 'Employés juniors en développement',
        characteristics: [
          'Jeunes employés avec peu d\'expérience',
          'En phase d\'apprentissage',
          'Potentiel de croissance élevé',
          'Nécessitent un accompagnement'
        ]
      },
      1: {
        color: '#10b981',
        icon: '⭐',
        title: 'Employés expérimentés et satisfaits',
        characteristics: [
          'Expérience significative',
          'Haut niveau de satisfaction',
          'Stabilité dans l\'entreprise',
          'Contributeurs clés'
        ]
      },
      2: {
        color: '#ef4444',
        icon: '⚠️',
        title: 'Employés à risque de départ',
        characteristics: [
          'Signes d\'insatisfaction',
          'Faible engagement',
          'Risque d\'attrition élevé',
          'Nécessitent une attention particulière'
        ]
      },
      3: {
        color: '#8b5cf6',
        icon: '👔',
        title: 'Cadres seniors et stables',
        characteristics: [
          'Longue ancienneté',
          'Postes de direction',
          'Très stables',
          'Mentors potentiels'
        ]
      }
    };

    return clusterData[cluster] || clusterData[0];
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>🎯 Segmentation des Employés</h2>
        <p>Classez les employés en groupes homogènes avec K-Means</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px', color: '#111827' }}>Profil de l'employé</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Âge</label>
              <input 
                type="number" 
                name="Age" 
                value={formData.Age} 
                onChange={handleChange} 
                min="18" 
                max="65"
                required 
              />
            </div>

            <div className="form-group">
              <label>Revenu mensuel ($)</label>
              <input 
                type="number" 
                name="MonthlyIncome" 
                value={formData.MonthlyIncome} 
                onChange={handleChange}
                min="1000"
                required 
              />
            </div>

            <div className="form-group">
              <label>Années dans l'entreprise</label>
              <input 
                type="number" 
                name="YearsAtCompany" 
                value={formData.YearsAtCompany} 
                onChange={handleChange}
                min="0"
                required 
              />
            </div>

            <div className="form-group">
              <label>Années dans le rôle actuel</label>
              <input 
                type="number" 
                name="YearsInCurrentRole" 
                value={formData.YearsInCurrentRole} 
                onChange={handleChange}
                min="0"
                required 
              />
            </div>

            <div className="form-group">
              <label>Années depuis la dernière promotion</label>
              <input 
                type="number" 
                name="YearsSinceLastPromotion" 
                value={formData.YearsSinceLastPromotion} 
                onChange={handleChange}
                min="0"
                required 
              />
            </div>

            <div className="form-group">
              <label>Années avec le manager actuel</label>
              <input 
                type="number" 
                name="YearsWithCurrManager" 
                value={formData.YearsWithCurrManager} 
                onChange={handleChange}
                min="0"
                required 
              />
            </div>

            <div className="form-group">
              <label>Années d'expérience totales</label>
              <input 
                type="number" 
                name="TotalWorkingYears" 
                value={formData.TotalWorkingYears} 
                onChange={handleChange}
                min="0"
                required 
              />
            </div>

            <div className="form-group">
              <label>Satisfaction au travail (1-4)</label>
              <input 
                type="number" 
                name="JobSatisfaction" 
                value={formData.JobSatisfaction} 
                onChange={handleChange}
                min="1"
                max="4"
                required 
              />
            </div>

            <div className="form-group">
              <label>Équilibre vie-travail (1-4)</label>
              <input 
                type="number" 
                name="WorkLifeBalance" 
                value={formData.WorkLifeBalance} 
                onChange={handleChange}
                min="1"
                max="4"
                required 
              />
            </div>

            <div className="form-group">
              <label>Satisfaction environnement (1-4)</label>
              <input 
                type="number" 
                name="EnvironmentSatisfaction" 
                value={formData.EnvironmentSatisfaction} 
                onChange={handleChange}
                min="1"
                max="4"
                required 
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ marginTop: '24px', width: '100%' }}
          >
            {loading ? 'Analyse en cours...' : '🎯 Identifier le segment'}
          </button>
        </form>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      {result && (
        <div className="result-card">
          <div className="result-header">
            <h3>Résultat de la segmentation</h3>
            <span 
              className="badge" 
              style={{ 
                background: getClusterInfo(result.cluster).color + '20',
                color: getClusterInfo(result.cluster).color,
                fontSize: '16px',
                padding: '8px 16px'
              }}
            >
              {getClusterInfo(result.cluster).icon} Cluster {result.cluster}
            </span>
          </div>

          <div 
            className="card" 
            style={{ 
              background: `linear-gradient(135deg, ${getClusterInfo(result.cluster).color}15, ${getClusterInfo(result.cluster).color}05)`,
              border: `2px solid ${getClusterInfo(result.cluster).color}40`,
              marginTop: '20px'
            }}
          >
            <h4 style={{ color: getClusterInfo(result.cluster).color, marginBottom: '12px', fontSize: '20px' }}>
              {getClusterInfo(result.cluster).icon} {getClusterInfo(result.cluster).title}
            </h4>
            <p style={{ color: '#374151', marginBottom: '16px' }}>
              {result.description}
            </p>
            
            <h5 style={{ color: '#111827', marginBottom: '12px' }}>Caractéristiques du segment :</h5>
            <ul style={{ color: '#374151', lineHeight: '1.8' }}>
              {getClusterInfo(result.cluster).characteristics.map((char, index) => (
                <li key={index}>{char}</li>
              ))}
            </ul>
          </div>

          <div className="alert alert-success" style={{ marginTop: '20px' }}>
            <strong>✅ {result.message}</strong>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>📊 Les 4 segments identifiés</h3>
        <div className="grid grid-2">
          {[0, 1, 2, 3].map(cluster => (
            <div 
              key={cluster}
              className="card"
              style={{ 
                background: `linear-gradient(135deg, ${getClusterInfo(cluster).color}15, ${getClusterInfo(cluster).color}05)`,
                border: `2px solid ${getClusterInfo(cluster).color}40`
              }}
            >
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                {getClusterInfo(cluster).icon}
              </div>
              <h4 style={{ color: getClusterInfo(cluster).color, marginBottom: '8px' }}>
                Cluster {cluster}
              </h4>
              <p style={{ fontSize: '14px', color: '#374151' }}>
                {getClusterInfo(cluster).title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Segmentation;
