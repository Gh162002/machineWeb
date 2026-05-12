import React, { useState, useEffect } from 'react';
import api from '../api';
import { parseApiError } from '../utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAward, faArrowRight } from '@fortawesome/free-solid-svg-icons';

function Recommendation() {
  const [loading, setLoading]         = useState(false);
  const [result, setResult]           = useState(null);
  const [error, setError]             = useState(null);
  const [topEmployees, setTopEmployees] = useState([]);
  const [loadingTop, setLoadingTop]   = useState(false);
  const [showTop, setShowTop]         = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole]     = useState('');

  const [formData, setFormData] = useState({
    Age: 35, JobLevel: 2, TotalWorkingYears: 10,
    YearsAtCompany: 5, JobSatisfaction: 4, PerformanceRating: 3, TrainingTimesLastYear: 3
  });

  // Charger les rôles disponibles au montage
  useEffect(() => {
    api.get('/api/database/top-recommended?top_n=1')
      .then(res => setAvailableRoles(res.data.available_roles || []))
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
      const response = await api.post('/api/predict/recommendation', formData);
      setResult(response.data);
    } catch (err) {
      setError(parseApiError(err));
    } finally { setLoading(false); }
  };

  const fetchTopRecommended = async () => {
    if (showTop) { setShowTop(false); return; }
    setLoadingTop(true);
    try {
      const url = selectedRole
        ? `/api/database/top-recommended?top_n=5&job_role=${encodeURIComponent(selectedRole)}`
        : '/api/database/top-recommended?top_n=5';
      const res = await api.get(url);
      setTopEmployees(res.data.employees);
      setShowTop(true);
    } catch (err) {
      setError(parseApiError(err));
    } finally { setLoadingTop(false); }
  };

  const getLevelColor = (level) => {
    if (level === 'Excellent') return '#10b981';
    if (level === 'Bon')       return '#3b82f6';
    if (level === 'Moyen')     return '#f59e0b';
    return '#ef4444';
  };

  const getLevelIcon = (level) => {
    if (level === 'Excellent') return '🌟';
    if (level === 'Bon')       return '👍';
    if (level === 'Moyen')     return '👌';
    return '⚠️';
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>
          <FontAwesomeIcon icon={faAward} style={{ marginRight: '10px' }} aria-hidden="true" />
          Recommandation Intelligente
        </h2>
        <p>Évaluez le potentiel d'un employé avec notre système de scoring</p>
      </div>

      {/* Section Top 5 */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-heading)' }}>
          <FontAwesomeIcon icon={faAward} style={{ marginRight: '8px', color: '#F5A623' }} aria-hidden="true" />
          Top 5 Employés Recommandés
        </h3>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          <select
            value={selectedRole}
            onChange={e => setSelectedRole(e.target.value)}
            style={{ padding: '10px 12px', border: '1px solid var(--color-border)', borderRadius: '8px', fontSize: '14px', minWidth: '220px' }}
          >
            <option value="">— Tous les rôles —</option>
            {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <button
            className="btn btn-primary"
            onClick={fetchTopRecommended}
            disabled={loadingTop}
            style={{ minWidth: '200px' }}
          >
            {loadingTop ? '⏳ Chargement...' : showTop ? '🙈 Masquer le Top 5' : '🏆 Voir Top 5 recommandés'}
          </button>
        </div>

        {showTop && topEmployees.length > 0 && (
          <div style={{ marginTop: '20px', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
              <thead>
                <tr style={{ background: '#d1fae5' }}>
                  {['#', 'ID', 'Âge', 'Genre', 'Département', 'Rôle', 'Niveau', 'Expérience', 'Performance', 'Formations', 'Score', 'Niveau Rec.'].map(h => (
                    <th key={h} style={{ padding: '10px 8px', textAlign: 'left', color: '#065f46', fontWeight: 700, borderBottom: '2px solid #6ee7b7' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topEmployees.map((emp, i) => (
                  <tr key={emp.EmployeeNumber} style={{ background: i % 2 === 0 ? 'var(--color-bg-secondary)' : '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
                    <td style={{ padding: '8px', fontWeight: 700, color: '#10b981' }}>{i + 1}</td>
                    <td style={{ padding: '8px' }}>{emp.EmployeeNumber}</td>
                    <td style={{ padding: '8px' }}>{emp.Age}</td>
                    <td style={{ padding: '8px' }}>{emp.Gender}</td>
                    <td style={{ padding: '8px' }}>{emp.Department}</td>
                    <td style={{ padding: '8px' }}>{emp.JobRole}</td>
                    <td style={{ padding: '8px' }}>{emp.JobLevel}</td>
                    <td style={{ padding: '8px' }}>{emp.TotalWorkingYears} ans</td>
                    <td style={{ padding: '8px' }}>{emp.PerformanceRating}/4</td>
                    <td style={{ padding: '8px' }}>{emp.TrainingTimesLastYear}</td>
                    <td style={{ padding: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ flex: 1, height: '8px', background: '#d1fae5', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${emp.recommendation_score}%`, height: '100%', background: getLevelColor(emp.recommendation_level), borderRadius: '4px' }} />
                        </div>
                        <span style={{ fontWeight: 700, color: getLevelColor(emp.recommendation_level), minWidth: '42px' }}>{emp.recommendation_score}</span>
                      </div>
                    </td>
                    <td style={{ padding: '8px' }}>
                      <span style={{ background: getLevelColor(emp.recommendation_level) + '20', color: getLevelColor(emp.recommendation_level), padding: '2px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '12px' }}>
                        {getLevelIcon(emp.recommendation_level)} {emp.recommendation_level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Formulaire individuel */}
      <div className="card">
        <h3 style={{ marginBottom: '24px', color: 'var(--color-heading)' }}>Profil de l'employé</h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-2">
            <div className="form-group">
              <label>Âge</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} min="18" max="65" required />
              <small style={{ color: 'var(--color-muted)', fontSize: '12px' }}>Entre 18 et 65 ans</small>
            </div>
            <div className="form-group">
              <label>Niveau du poste</label>
              <select name="JobLevel" value={formData.JobLevel} onChange={handleChange} required>
                <option value="1">1 - Junior</option>
                <option value="2">2 - Intermédiaire</option>
                <option value="3">3 - Senior</option>
                <option value="4">4 - Lead</option>
                <option value="5">5 - Directeur</option>
              </select>
            </div>
            <div className="form-group">
              <label>Années d'expérience totales</label>
              <input type="number" name="TotalWorkingYears" value={formData.TotalWorkingYears} onChange={handleChange} min="0" max="40" required />
            </div>
            <div className="form-group">
              <label>Années dans l'entreprise</label>
              <input type="number" name="YearsAtCompany" value={formData.YearsAtCompany} onChange={handleChange} min="0" max="40" required />
            </div>
            <div className="form-group">
              <label>Satisfaction au travail</label>
              <select name="JobSatisfaction" value={formData.JobSatisfaction} onChange={handleChange} required>
                <option value="1">1 - Faible</option>
                <option value="2">2 - Moyenne</option>
                <option value="3">3 - Bonne</option>
                <option value="4">4 - Excellente</option>
              </select>
            </div>
            <div className="form-group">
              <label>Évaluation de performance</label>
              <select name="PerformanceRating" value={formData.PerformanceRating} onChange={handleChange} required>
                <option value="1">1 - Insuffisant</option>
                <option value="2">2 - Satisfaisant</option>
                <option value="3">3 - Bon</option>
                <option value="4">4 - Excellent</option>
              </select>
            </div>
            <div className="form-group">
              <label>Formations suivies (année dernière)</label>
              <input type="number" name="TrainingTimesLastYear" value={formData.TrainingTimesLastYear} onChange={handleChange} min="0" max="10" required />
            </div>
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '24px', width: '100%' }}>
            {loading ? 'Calcul en cours...' : '⭐ Calculer le score de recommandation'}
          </button>
        </form>
      </div>

      {error && <div className="alert alert-error">❌ {error}</div>}

      {result && (
        <div className="result-card">
          <div className="result-header">
            <h3>Score de recommandation</h3>
            <span className="badge" style={{ background: getLevelColor(result.level) + '20', color: getLevelColor(result.level), fontSize: '16px', padding: '8px 16px' }}>
              {getLevelIcon(result.level)} {result.level}
            </span>
          </div>
          <div className="result-content">
            <div className="card" style={{ background: `linear-gradient(135deg, ${getLevelColor(result.level)}15, ${getLevelColor(result.level)}05)`, border: `2px solid ${getLevelColor(result.level)}40`, textAlign: 'center', padding: '32px' }}>
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>{getLevelIcon(result.level)}</div>
              <div style={{ fontSize: '48px', fontWeight: '700', color: getLevelColor(result.level), marginBottom: '8px' }}>{result.score.toFixed(1)}/100</div>
              <div style={{ fontSize: '18px', color: 'var(--color-text)' }}>Niveau : <strong>{result.level}</strong></div>
            </div>
            <div>
              <span className="result-label">Progression du score</span>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${result.score}%`, background: `linear-gradient(135deg, ${getLevelColor(result.level)}, ${getLevelColor(result.level)}dd)` }}>
                  {result.score.toFixed(0)}%
                </div>
              </div>
            </div>
            <div className="grid grid-2" style={{ marginTop: '20px' }}>
              <div className="result-item">
                <span className="result-label">Salaire prédit</span>
                <span className="result-value" style={{ color: getLevelColor(result.level) }}>${result.predicted_income.toFixed(0)}</span>
              </div>
              <div className="result-item">
                <span className="result-label">Niveau de recommandation</span>
                <span className="result-value" style={{ color: getLevelColor(result.level) }}>{result.level}</span>
              </div>
            </div>
            <div className="alert alert-success"><strong>✅ {result.message}</strong></div>
          </div>
        </div>
      )}

      {/* Échelle */}
      <div className="card" style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '16px', color: 'var(--color-heading)' }}>📊 Échelle de notation</h3>
        <div className="grid grid-2">
          {[['Excellent', '80-100', '🌟', '#10b981'], ['Bon', '60-79', '👍', '#3b82f6'], ['Moyen', '40-59', '👌', '#f59e0b'], ['Faible', '0-39', '⚠️', '#ef4444']].map(([lvl, range, icon, color]) => (
            <div key={lvl} className="card" style={{ background: `linear-gradient(135deg, ${color}15, ${color}05)`, border: `2px solid ${color}40` }}>
              <div style={{ fontSize: '32px', marginBottom: '8px' }}>{icon}</div>
              <h4 style={{ color, marginBottom: '8px' }}>{lvl} ({range})</h4>
              <p style={{ fontSize: '14px', color: 'var(--color-text)' }}>Employé {lvl === 'Excellent' ? 'hautement recommandé' : lvl === 'Bon' ? 'recommandé' : lvl === 'Moyen' ? 'avec potentiel' : 'à développer'}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Recommendation;
