import React, { useState } from 'react';
import api from '../api';

function Recommendation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    Age: 35,
    JobLevel: 2,
    TotalWorkingYears: 10,
    YearsAtCompany: 5,
    JobSatisfaction: 4,
    PerformanceRating: 3,
    TrainingTimesLastYear: 3
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
      const response = await api.post('/api/predict/recommendation', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la recommandation');
    } finally {
      setLoading(false);
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'Excellent': return '#10b981';
      case 'Bon': return '#3b82f6';
      case 'Moyen': return '#f59e0b';
      case 'Faible': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getLevelIcon = (level) => {
    switch (level) {
      case 'Excellent': return '🌟';
      case 'Bon': return '👍';
      case 'Moyen': return '👌';
      case 'Faible': return '⚠️';
      default: return '❓';
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>⭐ Recommandation Intelligente</h2>
        <p>Évaluez le potentiel d'un employé avec notre système de scoring</p>
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
              <small style={{ color: '#6b7280', fontSize: '12px' }}>Entre 18 et 65 ans</small>
            </div>

            <div className="form-group">
              <label>Niveau du poste</label>
              <select 
                name="JobLevel" 
                value={formData.JobLevel} 
                onChange={handleChange}
                required
              >
                <option value="1">1 - Junior</option>
                <option value="2">2 - Intermédiaire</option>
                <option value="3">3 - Senior</option>
                <option value="4">4 - Lead</option>
                <option value="5">5 - Directeur</option>
              </select>
            </div>

            <div className="form-group">
              <label>Années d'expérience totales</label>
              <input 
                type="number" 
                name="TotalWorkingYears" 
                value={formData.TotalWorkingYears} 
                onChange={handleChange}
                min="0"
                max="40"
                required 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>Expérience professionnelle totale</small>
            </div>

            <div className="form-group">
              <label>Années dans l'entreprise</label>
              <input 
                type="number" 
                name="YearsAtCompany" 
                value={formData.YearsAtCompany} 
                onChange={handleChange}
                min="0"
                max="40"
                required 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>Ancienneté dans l'entreprise</small>
            </div>

            <div className="form-group">
              <label>Satisfaction au travail</label>
              <select 
                name="JobSatisfaction" 
                value={formData.JobSatisfaction} 
                onChange={handleChange}
                required
              >
                <option value="1">1 - Faible</option>
                <option value="2">2 - Moyenne</option>
                <option value="3">3 - Bonne</option>
                <option value="4">4 - Excellente</option>
              </select>
            </div>

            <div className="form-group">
              <label>Évaluation de performance</label>
              <select 
                name="PerformanceRating" 
                value={formData.PerformanceRating} 
                onChange={handleChange}
                required
              >
                <option value="1">1 - Insuffisant</option>
                <option value="2">2 - Satisfaisant</option>
                <option value="3">3 - Bon</option>
                <option value="4">4 - Excellent</option>
              </select>
            </div>

            <div className="form-group">
              <label>Formations suivies (année dernière)</label>
              <input 
                type="number" 
                name="TrainingTimesLastYear" 
                value={formData.TrainingTimesLastYear} 
                onChange={handleChange}
                min="0"
                max="10"
                required 
              />
              <small style={{ color: '#6b7280', fontSize: '12px' }}>Nombre de formations</small>
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={loading} 
            style={{ marginTop: '24px', width: '100%' }}
          >
            {loading ? 'Calcul en cours...' : '⭐ Calculer le score de recommandation'}
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
            <h3>Score de recommandation</h3>
            <span 
              className="badge" 
              style={{ 
                background: getLevelColor(result.level) + '20',
                color: getLevelColor(result.level),
                fontSize: '16px',
                padding: '8px 16px'
              }}
            >
              {getLevelIcon(result.level)} {result.level}
            </span>
          </div>

          <div className="result-content">
            <div 
              className="card" 
              style={{ 
                background: `linear-gradient(135deg, ${getLevelColor(result.level)}15, ${getLevelColor(result.level)}05)`,
                border: `2px solid ${getLevelColor(result.level)}40`,
                textAlign: 'center',
                padding: '32px'
              }}
            >
              <div style={{ fontSize: '64px', marginBottom: '16px' }}>
                {getLevelIcon(result.level)}
              </div>
              <div style={{ fontSize: '48px', fontWeight: '700', color: getLevelColor(result.level), marginBottom: '8px' }}>
                {result.score.toFixed(1)}/100
              </div>
              <div style={{ fontSize: '18px', color: '#374151' }}>
                Niveau : <strong>{result.level}</strong>
              </div>
            </div>

            <div>
              <span className="result-label">Progression du score</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${result.score}%`,
                    background: `linear-gradient(135deg, ${getLevelColor(result.level)}, ${getLevelColor(result.level)}dd)`
                  }}
                >
                  {result.score.toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="grid grid-2" style={{ marginTop: '20px' }}>
              <div className="result-item">
                <span className="result-label">Salaire prédit</span>
                <span className="result-value" style={{ color: getLevelColor(result.level) }}>
                  ${result.predicted_income.toFixed(0)}
                </span>
              </div>

              <div className="result-item">
                <span className="result-label">Niveau de recommandation</span>
                <span className="result-value" style={{ color: getLevelColor(result.level) }}>
                  {result.level}
                </span>
              </div>
            </div>

            <div className="alert alert-success">
              <strong>✅ {result.message}</strong>
            </div>

            <div className="card" style={{ marginTop: '20px', background: '#f9fafb' }}>
              <h4 style={{ color: '#111827', marginBottom: '12px' }}>💡 Interprétation du score</h4>
              <ul style={{ color: '#374151', lineHeight: '1.8' }}>
                {result.level === 'Excellent' && (
                  <>
                    <li>Employé hautement qualifié et performant</li>
                    <li>Excellent candidat pour des promotions</li>
                    <li>Potentiel de leadership élevé</li>
                    <li>À retenir et développer prioritairement</li>
                  </>
                )}
                {result.level === 'Bon' && (
                  <>
                    <li>Employé compétent avec un bon potentiel</li>
                    <li>Candidat solide pour des responsabilités accrues</li>
                    <li>Bénéficierait de formations ciblées</li>
                    <li>Bon investissement pour l'entreprise</li>
                  </>
                )}
                {result.level === 'Moyen' && (
                  <>
                    <li>Employé avec un potentiel à développer</li>
                    <li>Nécessite un accompagnement et du coaching</li>
                    <li>Opportunités d'amélioration identifiées</li>
                    <li>Plan de développement recommandé</li>
                  </>
                )}
                {result.level === 'Faible' && (
                  <>
                    <li>Employé nécessitant une attention particulière</li>
                    <li>Plan d'amélioration de performance requis</li>
                    <li>Formation et mentorat essentiels</li>
                    <li>Évaluation régulière recommandée</li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="card" style={{ marginTop: '40px' }}>
        <h3 style={{ marginBottom: '16px', color: '#111827' }}>📊 Échelle de notation</h3>
        <div className="grid grid-2">
          <div className="card" style={{ background: 'linear-gradient(135deg, #10b98115, #10b98105)', border: '2px solid #10b98140' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>🌟</div>
            <h4 style={{ color: '#10b981', marginBottom: '8px' }}>Excellent (80-100)</h4>
            <p style={{ fontSize: '14px', color: '#374151' }}>Employé hautement recommandé</p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #3b82f615, #3b82f605)', border: '2px solid #3b82f640' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👍</div>
            <h4 style={{ color: '#3b82f6', marginBottom: '8px' }}>Bon (60-79)</h4>
            <p style={{ fontSize: '14px', color: '#374151' }}>Employé recommandé</p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #f59e0b15, #f59e0b05)', border: '2px solid #f59e0b40' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>👌</div>
            <h4 style={{ color: '#f59e0b', marginBottom: '8px' }}>Moyen (40-59)</h4>
            <p style={{ fontSize: '14px', color: '#374151' }}>Employé avec potentiel</p>
          </div>

          <div className="card" style={{ background: 'linear-gradient(135deg, #ef444415, #ef444405)', border: '2px solid #ef444440' }}>
            <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚠️</div>
            <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>Faible (0-39)</h4>
            <p style={{ fontSize: '14px', color: '#374151' }}>Nécessite développement</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendation;
