import React, { useState } from 'react';
import api from '../api';

function AttritionPredictor() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    Age: 35,
    BusinessTravel: 'Travel_Rarely',
    DailyRate: 800,
    Department: 'Sales',
    DistanceFromHome: 5,
    Education: 3,
    EducationField: 'Life Sciences',
    EnvironmentSatisfaction: 3,
    Gender: 'Male',
    HourlyRate: 65,
    JobInvolvement: 3,
    JobLevel: 2,
    JobRole: 'Sales Executive',
    JobSatisfaction: 4,
    MaritalStatus: 'Married',
    MonthlyIncome: 5000,
    MonthlyRate: 15000,
    NumCompaniesWorked: 2,
    OverTime: 'No',
    PercentSalaryHike: 15,
    PerformanceRating: 3,
    RelationshipSatisfaction: 3,
    StockOptionLevel: 1,
    TotalWorkingYears: 10,
    TrainingTimesLastYear: 3,
    WorkLifeBalance: 3,
    YearsAtCompany: 5,
    YearsInCurrentRole: 3,
    YearsSinceLastPromotion: 1,
    YearsWithCurrManager: 3
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: isNaN(value) ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/api/predict/attrition', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la prédiction');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'Élevé': return '#dc2626';
      case 'Moyen': return '#f59e0b';
      case 'Faible': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="container">
      <div className="page-header">
        <h2>📊 Prédiction d'Attrition</h2>
        <p>Identifiez les employés à risque de quitter l'entreprise</p>
      </div>

      <div className="card">
        <h3 style={{ marginBottom: '24px', color: '#111827' }}>Informations de l'employé</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-3">
            <div className="form-group">
              <label>Âge</label>
              <input type="number" name="Age" value={formData.Age} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Voyages d'affaires</label>
              <select name="BusinessTravel" value={formData.BusinessTravel} onChange={handleChange}>
                <option value="Non-Travel">Non-Travel</option>
                <option value="Travel_Rarely">Travel_Rarely</option>
                <option value="Travel_Frequently">Travel_Frequently</option>
              </select>
            </div>

            <div className="form-group">
              <label>Département</label>
              <select name="Department" value={formData.Department} onChange={handleChange}>
                <option value="Sales">Sales</option>
                <option value="Research & Development">Research & Development</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="form-group">
              <label>Distance du domicile (km)</label>
              <input type="number" name="DistanceFromHome" value={formData.DistanceFromHome} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Niveau d'éducation (1-5)</label>
              <input type="number" name="Education" min="1" max="5" value={formData.Education} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Domaine d'éducation</label>
              <select name="EducationField" value={formData.EducationField} onChange={handleChange}>
                <option value="Life Sciences">Life Sciences</option>
                <option value="Medical">Medical</option>
                <option value="Marketing">Marketing</option>
                <option value="Technical Degree">Technical Degree</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Genre</label>
              <select name="Gender" value={formData.Gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Niveau du poste (1-5)</label>
              <input type="number" name="JobLevel" min="1" max="5" value={formData.JobLevel} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Rôle</label>
              <select name="JobRole" value={formData.JobRole} onChange={handleChange}>
                <option value="Sales Executive">Sales Executive</option>
                <option value="Research Scientist">Research Scientist</option>
                <option value="Laboratory Technician">Laboratory Technician</option>
                <option value="Manufacturing Director">Manufacturing Director</option>
                <option value="Healthcare Representative">Healthcare Representative</option>
                <option value="Manager">Manager</option>
                <option value="Sales Representative">Sales Representative</option>
                <option value="Research Director">Research Director</option>
                <option value="Human Resources">Human Resources</option>
              </select>
            </div>

            <div className="form-group">
              <label>Satisfaction au travail (1-4)</label>
              <input type="number" name="JobSatisfaction" min="1" max="4" value={formData.JobSatisfaction} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Statut marital</label>
              <select name="MaritalStatus" value={formData.MaritalStatus} onChange={handleChange}>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Revenu mensuel ($)</label>
              <input type="number" name="MonthlyIncome" value={formData.MonthlyIncome} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Heures supplémentaires</label>
              <select name="OverTime" value={formData.OverTime} onChange={handleChange}>
                <option value="No">No</option>
                <option value="Yes">Yes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Années d'expérience totales</label>
              <input type="number" name="TotalWorkingYears" value={formData.TotalWorkingYears} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Années dans l'entreprise</label>
              <input type="number" name="YearsAtCompany" value={formData.YearsAtCompany} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Équilibre vie-travail (1-4)</label>
              <input type="number" name="WorkLifeBalance" min="1" max="4" value={formData.WorkLifeBalance} onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ marginTop: '24px', width: '100%' }}>
            {loading ? 'Analyse en cours...' : '🔍 Prédire le risque d\'attrition'}
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
            <h3>Résultats de la prédiction</h3>
            <span className={`badge ${result.risk_level === 'Élevé' ? 'badge-danger' : result.risk_level === 'Moyen' ? 'badge-warning' : 'badge-success'}`}>
              {result.risk_level}
            </span>
          </div>

          <div className="result-content">
            <div className="result-item">
              <span className="result-label">Probabilité d'attrition</span>
              <span className="result-value" style={{ color: getRiskColor(result.risk_level) }}>
                {(result.probability * 100).toFixed(1)}%
              </span>
            </div>

            <div>
              <span className="result-label">Niveau de risque</span>
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ 
                    width: `${result.probability * 100}%`,
                    background: `linear-gradient(135deg, ${getRiskColor(result.risk_level)}, ${getRiskColor(result.risk_level)}dd)`
                  }}
                >
                  {(result.probability * 100).toFixed(0)}%
                </div>
              </div>
            </div>

            <div className="alert alert-warning">
              <strong>💡 Recommandation :</strong> {result.message}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AttritionPredictor;
