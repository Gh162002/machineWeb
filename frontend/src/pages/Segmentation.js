import React, { useState } from 'react';
import api from '../api';
import { parseApiError } from '../utils';

const CLUSTER_INFO = {
  0: { color: '#3b82f6', icon: '🌱', title: 'Employés juniors en développement',
       characteristics: ["Jeunes employés avec peu d'expérience", "En phase d'apprentissage", "Potentiel de croissance élevé", "Nécessitent un accompagnement"] },
  1: { color: '#10b981', icon: '⭐', title: 'Employés expérimentés et satisfaits',
       characteristics: ["Expérience significative", "Haut niveau de satisfaction", "Stabilité dans l'entreprise", "Contributeurs clés"] },
  2: { color: '#ef4444', icon: '⚠️', title: 'Employés à risque de départ',
       characteristics: ["Signes d'insatisfaction", "Faible engagement", "Risque d'attrition élevé", "Nécessitent une attention particulière"] },
  3: { color: '#8b5cf6', icon: '👔', title: 'Cadres seniors et stables',
       characteristics: ["Longue ancienneté", "Postes de direction", "Très stables", "Mentors potentiels"] }
};

function Segmentation() {
  const [loading, setLoading]           = useState(false);
  const [result, setResult]             = useState(null);
  const [error, setError]               = useState(null);
  const [clusterEmployees, setClusterEmployees] = useState(null);
  const [loadingCluster, setLoadingCluster]     = useState(false);
  const [selectedCluster, setSelectedCluster]   = useState(null);

  const [formData, setFormData] = useState({
    Age: 35, MonthlyIncome: 5000, YearsAtCompany: 5, YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1, YearsWithCurrManager: 3, TotalWorkingYears: 10,
    JobSatisfaction: 4, WorkLifeBalance: 3, EnvironmentSatisfaction: 3
  });

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
    } catch (err) {
      setError(parseApiError(err));
    } finally { setLoadingCluster(false); }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>🎯 Segmentation des Employés</h2>
        <p>Classez les employés en groupes homogènes avec K-Means</p>
      </div>

      {/* Formulaire */}
      <div className="card">
        <h3 style={{ marginBottom: '24px', color: '#111827' }}>Profil de l'employé</h3>
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

      {result && (
        <div className="result-card">
          <div className="result-header">
            <h3>Résultat de la segmentation</h3>
            <span className="badge" style={{ background: CLUSTER_INFO[result.cluster].color + '20', color: CLUSTER_INFO[result.cluster].color, fontSize: '16px', padding: '8px 16px' }}>
              {CLUSTER_INFO[result.cluster].icon} Cluster {result.cluster}
            </span>
          </div>
          <div className="card" style={{ background: `linear-gradient(135deg, ${CLUSTER_INFO[result.cluster].color}15, ${CLUSTER_INFO[result.cluster].color}05)`, border: `2px solid ${CLUSTER_INFO[result.cluster].color}40`, marginTop: '20px' }}>
            <h4 style={{ color: CLUSTER_INFO[result.cluster].color, marginBottom: '12px', fontSize: '20px' }}>
              {CLUSTER_INFO[result.cluster].icon} {CLUSTER_INFO[result.cluster].title}
            </h4>
            <p style={{ color: '#374151', marginBottom: '16px' }}>{result.description}</p>
            <h5 style={{ color: '#111827', marginBottom: '12px' }}>Caractéristiques du segment :</h5>
            <ul style={{ color: '#374151', lineHeight: '1.8' }}>
              {CLUSTER_INFO[result.cluster].characteristics.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </div>
          <div className="alert alert-success" style={{ marginTop: '20px' }}>
            <strong>✅ {result.message}</strong>
          </div>
        </div>
      )}

      {/* Les 4 segments avec bouton pour voir les employés */}
      <div className="card" style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>📊 Les 4 segments — Cliquez pour voir les employés</h3>
        <div className="grid grid-2">
          {[0, 1, 2, 3].map(cluster => (
            <div key={cluster}>
              <div
                className="card"
                onClick={() => fetchClusterEmployees(cluster)}
                style={{
                  background: `linear-gradient(135deg, ${CLUSTER_INFO[cluster].color}15, ${CLUSTER_INFO[cluster].color}05)`,
                  border: `2px solid ${selectedCluster === cluster ? CLUSTER_INFO[cluster].color : CLUSTER_INFO[cluster].color + '40'}`,
                  cursor: 'pointer', transition: 'all 0.2s',
                  transform: selectedCluster === cluster ? 'scale(1.02)' : 'scale(1)'
                }}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>{CLUSTER_INFO[cluster].icon}</div>
                <h4 style={{ color: CLUSTER_INFO[cluster].color, marginBottom: '8px' }}>Cluster {cluster}</h4>
                <p style={{ fontSize: '14px', color: '#374151', marginBottom: '8px' }}>{CLUSTER_INFO[cluster].title}</p>
                <span style={{ fontSize: '12px', color: CLUSTER_INFO[cluster].color, fontWeight: 600 }}>
                  {selectedCluster === cluster && clusterEmployees ? `▲ Masquer (${clusterEmployees.total} employés)` : '▼ Voir les employés'}
                </span>
              </div>

              {/* Table des employés du cluster */}
              {selectedCluster === cluster && clusterEmployees && (
                <div style={{ marginTop: '8px', overflowX: 'auto', border: `1px solid ${CLUSTER_INFO[cluster].color}40`, borderRadius: '8px' }}>
                  {loadingCluster ? (
                    <div style={{ padding: '20px', textAlign: 'center' }}>⏳ Chargement...</div>
                  ) : (
                    <>
                      <div style={{ padding: '12px 16px', background: CLUSTER_INFO[cluster].color + '15', fontWeight: 700, color: CLUSTER_INFO[cluster].color }}>
                        {CLUSTER_INFO[cluster].icon} {clusterEmployees.total} employés dans ce cluster
                      </div>
                      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead style={{ position: 'sticky', top: 0, background: '#f9fafb' }}>
                            <tr>
                              {['ID', 'Âge', 'Genre', 'Département', 'Rôle', 'Salaire', 'Ancienneté', 'Satisfaction', 'Attrition'].map(h => (
                                <th key={h} style={{ padding: '8px', textAlign: 'left', color: '#374151', fontWeight: 700, borderBottom: '1px solid #e5e7eb' }}>{h}</th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {clusterEmployees.employees.map((emp, i) => (
                              <tr key={emp.EmployeeNumber} style={{ background: i % 2 === 0 ? '#fff' : '#f9fafb', borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '7px 8px' }}>{emp.EmployeeNumber}</td>
                                <td style={{ padding: '7px 8px' }}>{emp.Age}</td>
                                <td style={{ padding: '7px 8px' }}>{emp.Gender}</td>
                                <td style={{ padding: '7px 8px' }}>{emp.Department}</td>
                                <td style={{ padding: '7px 8px' }}>{emp.JobRole}</td>
                                <td style={{ padding: '7px 8px' }}>${emp.MonthlyIncome?.toLocaleString()}</td>
                                <td style={{ padding: '7px 8px' }}>{emp.YearsAtCompany} ans</td>
                                <td style={{ padding: '7px 8px' }}>{emp.JobSatisfaction}/4</td>
                                <td style={{ padding: '7px 8px' }}>
                                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', fontWeight: 700, background: emp.Attrition === 'Yes' ? '#fee2e2' : '#d1fae5', color: emp.Attrition === 'Yes' ? '#dc2626' : '#065f46' }}>
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
          ))}
        </div>
      </div>
    </div>
  );
}

export default Segmentation;
