import React, { useState, useEffect } from 'react';
import api from '../api';
import { parseApiError } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faObjectGroup, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

// Palette de couleurs et icônes pour les clusters dynamiques DBSCAN
const CLUSTER_PALETTE = [
  { color: '#3b82f6', icon: '🌱' },
  { color: '#10b981', icon: '⭐' },
  { color: '#ef4444', icon: '⚠️' },
  { color: '#8b5cf6', icon: '👔' },
  { color: '#f59e0b', icon: '🔶' },
  { color: '#06b6d4', icon: '💎' },
  { color: '#ec4899', icon: '🌸' },
  { color: '#84cc16', icon: '🌿' },
];

const OUTLIER_STYLE = { color: 'var(--color-muted)', icon: '🔍' };

function getClusterStyle(cluster) {
  if (cluster === -1) return OUTLIER_STYLE;
  return CLUSTER_PALETTE[cluster % CLUSTER_PALETTE.length];
}

function Segmentation() {
  const [loading, setLoading]                   = useState(false);
  const [result, setResult]                     = useState(null);
  const [error, setError]                       = useState(null);
  const [clusterEmployees, setClusterEmployees] = useState(null);
  const [loadingCluster, setLoadingCluster]     = useState(false);
  const [selectedCluster, setSelectedCluster]   = useState(null);
  const [availableClusters, setAvailableClusters] = useState([]);

  const [formData, setFormData] = useState({
    Age: 35, MonthlyIncome: 5000, YearsAtCompany: 5, YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1, YearsWithCurrManager: 3, TotalWorkingYears: 10,
    JobSatisfaction: 4, WorkLifeBalance: 3, EnvironmentSatisfaction: 3
  });

  // Charger la liste des clusters disponibles au montage
  useEffect(() => {
    api.get('/api/database/cluster-employees?cluster=0')
      .then(res => {
        if (res.data.available_clusters) {
          setAvailableClusters(res.data.available_clusters);
        }
      })
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: Number(value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setResult(null);
    try {
      const response = await api.post('/api/predict/segmentation', formData);
      setResult(response.data);
    } catch (err) {
      setError(parseApiError(err));
    } finally { setLoading(false); }
  };

  const fetchClusterEmployees = async (cluster) => {
    if (selectedCluster === cluster && clusterEmployees) {
      setClusterEmployees(null); setSelectedCluster(null); return;
    }
    setLoadingCluster(true); setSelectedCluster(cluster);
    try {
      const res = await api.get(`/api/database/cluster-employees?cluster=${cluster}`);
      setClusterEmployees(res.data);
      // Mettre à jour la liste des clusters si disponible
      if (res.data.available_clusters && res.data.available_clusters.length > 0) {
        setAvailableClusters(res.data.available_clusters);
      }
    } catch (err) {
      setError(parseApiError(err));
    } finally { setLoadingCluster(false); }
  };

  // Clusters à afficher dans la grille (depuis l'API ou fallback)
  const clustersToShow = availableClusters.length > 0
    ? availableClusters
    : [
        { cluster: 0, count: null, label: 'Employés juniors en développement' },
        { cluster: 1, count: null, label: 'Employés expérimentés et satisfaits' },
        { cluster: 2, count: null, label: 'Employés à risque de départ' },
        { cluster: 3, count: null, label: 'Cadres seniors et stables' },
      ];

  return (
    <div className="container">
      <div className="page-header">
        <h2>
          <FontAwesomeIcon icon={faObjectGroup} style={{ marginRight: '10px' }} aria-hidden="true" />
          Segmentation des Employés
        </h2>
        <p>Détectez la vraie structure des profils employés avec DBSCAN + PCA (Silhouette = 0.54)</p>
      </div>

      {/* Formulaire */}
      <div className="card">
        <h3 style={{ marginBottom: '24px', color: 'var(--color-heading)' }}>Profil de l'employé</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            {[
              { name: 'Age', label: 'Âge', min: 18, max: 65 },
              { name: 'MonthlyIncome', label: 'Revenu mensuel ($)', min: 1000 },
              { name: 'YearsAtCompany', label: "Années dans l'entreprise", min: 0 },
              { name: 'YearsInCurrentRole', label: 'Années dans le rôle actuel', min: 0 },
              { name: 'YearsSinceLastPromotion', label: 'Années depuis la dernière promotion', min: 0 },
              { name: 'YearsWithCurrManager', label: 'Années avec le manager actuel', min: 0 },
              { name: 'TotalWorkingYears', label: "Années d'expérience totales", min: 0 },
              { name: 'JobSatisfaction', label: 'Satisfaction au travail (1-4)', min: 1, max: 4 },
              { name: 'WorkLifeBalance', label: 'Équilibre vie-travail (1-4)', min: 1, max: 4 },
              { name: 'EnvironmentSatisfaction', label: 'Satisfaction environnement (1-4)', min: 1, max: 4 },
            ].map(f => (
              <div className="form-group" key={f.name}>
                <label>{f.label}</label>
                <input type="number" name={f.name} value={formData[f.name]} onChange={handleChange}
                  min={f.min} max={f.max} required />
              </div>
            ))}
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '24px', width: '100%' }}>
            {loading ? 'Analyse en cours...' : '🎯 Identifier le segment'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">❌ {error}</div>}

      {result && (() => {
        const style = getClusterStyle(result.cluster);
        return (
          <div className="result-card">
            <div className="result-header">
              <h3>Résultat de la segmentation</h3>
              <span className="badge" style={{
                background: style.color + '20',
                color: style.color,
                fontSize: '16px',
                padding: '8px 16px'
              }}>
                {style.icon} {result.cluster === -1 ? 'Outlier' : `Cluster ${result.cluster}`}
              </span>
            </div>
            <div className="card" style={{
              background: `linear-gradient(135deg, ${style.color}15, ${style.color}05)`,
              border: `2px solid ${style.color}40`,
              marginTop: '20px'
            }}>
              <h4 style={{ color: style.color, marginBottom: '12px', fontSize: '20px' }}>
                {style.icon} {result.description}
              </h4>
              <p style={{ color: 'var(--color-text)' }}>{result.message}</p>
            </div>
            <div className="alert alert-success" style={{ marginTop: '20px' }}>
              <strong>✅ {result.message}</strong>
            </div>
          </div>
        );
      })()}

      {/* Clusters DBSCAN dynamiques */}
      <div className="card" style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '8px', color: 'var(--color-heading)' }}>
          📊 Clusters DBSCAN — Cliquez pour voir les employés
        </h3>
        <p style={{ color: 'var(--color-muted)', fontSize: '14px', marginBottom: '20px' }}>
          DBSCAN détecte automatiquement la structure et identifie les profils atypiques (cluster -1 = outliers).
          Silhouette Score = <strong>0.54</strong> (vs K-Means = 0.35)
        </p>
        <div className="grid grid-2">
          {clustersToShow.map(({ cluster, count, label }) => {
            const style = getClusterStyle(cluster);
            const isSelected = selectedCluster === cluster;
            return (
              <div key={cluster}>
                <div
                  className="card"
                  onClick={() => fetchClusterEmployees(cluster)}
                  style={{
                    background: `linear-gradient(135deg, ${style.color}15, ${style.color}05)`,
                    border: `2px solid ${isSelected ? style.color : style.color + '40'}`,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    transform: isSelected ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>{style.icon}</div>
                  <h4 style={{ color: style.color, marginBottom: '8px' }}>
                    {cluster === -1 ? 'Outliers' : `Cluster ${cluster}`}
                    {count !== null && (
                      <span style={{ fontSize: '13px', fontWeight: 400, marginLeft: '8px', color: 'var(--color-muted)' }}>
                        ({count} employés)
                      </span>
                    )}
                  </h4>
                  <p style={{ fontSize: '14px', color: 'var(--color-text)', marginBottom: '8px' }}>{label}</p>
                  <span style={{ fontSize: '12px', color: style.color, fontWeight: 600 }}>
                    <FontAwesomeIcon icon={isSelected && clusterEmployees ? faChevronUp : faChevronDown} aria-hidden="true" style={{ marginRight: '4px' }} />
                    {isSelected && clusterEmployees
                      ? `Masquer (${clusterEmployees.total} employés)`
                      : 'Voir les employés'}
                  </span>
                </div>

                {/* Table des employés */}
                {isSelected && clusterEmployees && (
                  <div style={{
                    marginTop: '8px',
                    overflowX: 'auto',
                    border: `1px solid ${style.color}40`,
                    borderRadius: '8px'
                  }}>
                    {loadingCluster ? (
                      <div style={{ padding: '20px', textAlign: 'center' }}>⏳ Chargement...</div>
                    ) : (
                      <>
                        <div style={{
                          padding: '12px 16px',
                          background: style.color + '15',
                          fontWeight: 700,
                          color: style.color
                        }}>
                          {style.icon} {clusterEmployees.total} employés — {clusterEmployees.label}
                        </div>
                        <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                            <thead style={{ position: 'sticky', top: 0, background: 'var(--color-bg-tertiary)' }}>
                              <tr>
                                {['ID', 'Âge', 'Genre', 'Département', 'Rôle', 'Salaire', 'Ancienneté', 'Satisfaction', 'Attrition'].map(h => (
                                  <th key={h} style={{ padding: '8px', textAlign: 'left', color: 'var(--color-text)', fontWeight: 700, borderBottom: '1px solid var(--color-border)' }}>{h}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {clusterEmployees.employees.map((emp, i) => (
                                <tr key={emp.EmployeeNumber} style={{ background: i % 2 === 0 ? 'var(--color-bg-secondary)' : 'var(--color-bg-tertiary)', borderBottom: '1px solid var(--color-border)' }}>
                                  <td style={{ padding: '7px 8px' }}>{emp.EmployeeNumber}</td>
                                  <td style={{ padding: '7px 8px' }}>{emp.Age}</td>
                                  <td style={{ padding: '7px 8px' }}>{emp.Gender}</td>
                                  <td style={{ padding: '7px 8px' }}>{emp.Department}</td>
                                  <td style={{ padding: '7px 8px' }}>{emp.JobRole}</td>
                                  <td style={{ padding: '7px 8px' }}>${emp.MonthlyIncome?.toLocaleString()}</td>
                                  <td style={{ padding: '7px 8px' }}>{emp.YearsAtCompany} ans</td>
                                  <td style={{ padding: '7px 8px' }}>{emp.JobSatisfaction}/4</td>
                                  <td style={{ padding: '7px 8px' }}>
                                    <span style={{
                                      padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700,
                                      background: emp.Attrition === 'Yes' ? '#fee2e2' : '#d1fae5',
                                      color: emp.Attrition === 'Yes' ? '#dc2626' : '#065f46'
                                    }}>
                                      {emp.Attrition}
                                    </span>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Segmentation;
