import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBullseye, faArrowRight,
  faUsers, faArrowTrendUp, faGauge, faCircleNodes,
  faTriangleExclamation, faObjectGroup, faAward,
  faServer, faCode,
  faChartLine, faBrain,
} from '@fortawesome/free-solid-svg-icons';
import './Home.css';

/* ── Animated counter hook ── */
function useCountUp(target, duration = 1400, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
}

/* ── Intersection observer hook ── */
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, inView];
}

/* ── Feature cards data ── */
const FEATURES = [
  {
    key: 'attrition',
    to: '/attrition',
    faIcon: faTriangleExclamation,
    title: "Prédiction d'Attrition",
    desc: "Identifiez les employés à risque de quitter l'entreprise grâce à XGBoost optimisé avec SMOTE.",
    accent: '#F4607A',
    accentRgb: '244,96,122',
    gradient: 'linear-gradient(135deg, rgba(244,96,122,0.12), rgba(244,96,122,0.04))',
    model: 'XGBoost + SMOTE',
    metric: 'Recall',
    metricValue: 68,
    metricSuffix: '%',
    metric2: 'AUC',
    metric2Value: '0.731',
    delay: '0ms',
  },
  {
    key: 'segmentation',
    to: '/segmentation',
    faIcon: faObjectGroup,
    title: 'Segmentation',
    desc: "Détectez la vraie structure des profils employés avec DBSCAN et réduction dimensionnelle PCA.",
    accent: '#60C8F5',
    accentRgb: '96,200,245',
    gradient: 'linear-gradient(135deg, rgba(96,200,245,0.12), rgba(96,200,245,0.04))',
    model: 'DBSCAN + PCA',
    metric: 'Silhouette',
    metricValue: 54,
    metricSuffix: '%',
    metric2: 'Clusters',
    metric2Value: '5',
    delay: '100ms',
  },
  {
    key: 'recommendation',
    to: '/recommendation',
    faIcon: faAward,
    title: 'Recommandation',
    desc: "Obtenez un score de recommandation basé sur le profil et la performance de l'employé.",
    accent: '#F5A623',
    accentRgb: '245,166,35',
    gradient: 'linear-gradient(135deg, rgba(245,166,35,0.12), rgba(245,166,35,0.04))',
    model: 'Régression Linéaire',
    metric: 'R²',
    metricValue: 89,
    metricSuffix: '%',
    metric2: 'MAE',
    metric2Value: '1177$',
    delay: '200ms',
  },
];

/* ── KPI data ── */
const KPIS = [
  { faIcon: faUsers,        label: 'Employés analysés',   value: 1470, suffix: '',    color: '#7C6FF7', prefix: '' },
  { faIcon: faArrowTrendUp, label: "Taux d'attrition",    value: 16,   suffix: '.1%', color: '#F4607A', prefix: '', trend: '↑' },
  { faIcon: faGauge,        label: 'Score AUC modèle',    value: 731,  suffix: '',    color: '#60C8F5', prefix: '0.', ring: 73.1 },
  { faIcon: faCircleNodes,  label: 'Clusters identifiés', value: 5,    suffix: '',    color: '#34C98A', prefix: '' },
];

/* ── Model performance table ── */
const MODELS = [
  { dso: 'DSO1', name: 'Attrition',      algo: 'XGBoost + SMOTE',      metric: 'Recall cl.1', score: '0.681', status: 'Opérationnel', statusColor: 'var(--color-emerald)' },
  { dso: 'DSO2', name: 'Segmentation',   algo: 'DBSCAN + PCA',         metric: 'Silhouette',  score: '0.539', status: 'Opérationnel', statusColor: 'var(--color-emerald)' },
  { dso: 'DSO3', name: 'Recommandation', algo: 'Régression Linéaire',  metric: 'R²',          score: '0.894', status: 'Opérationnel', statusColor: 'var(--color-emerald)' },
];

/* ── Cluster distribution for bar chart ── */
const CLUSTERS = [
  { label: 'Cluster 0', value: 23,  color: '#6366F1' },
  { label: 'Cluster 1', value: 21,  color: '#38BDF8' },
  { label: 'Cluster 2', value: 26,  color: '#34D399' },
  { label: 'Cluster 3', value: 21,  color: '#F59E0B' },
  { label: 'Outliers',  value: 163, color: '#F43F5E' },
];

/* ── FeatureCard component ── */
function FeatureCard({ feature, inView }) {
  const [hovered, setHovered] = useState(false);
  const progress = inView ? feature.metricValue : 0;

  return (
    <div
      className="feature-card animate-fade-up"
      style={{
        animationDelay: feature.delay,
        borderColor: hovered ? feature.accent : undefined,
        boxShadow: hovered ? `0 8px 32px rgba(${feature.accentRgb},0.18)` : undefined,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon */}
      <div className="feature-card-icon" style={{ background: feature.gradient }}>
        <FontAwesomeIcon icon={feature.faIcon} style={{ color: feature.accent, fontSize: '22px' }} aria-hidden="true" />
      </div>

      {/* Content */}
      <h3 className="feature-card-title">{feature.title}</h3>
      <p className="feature-card-desc">{feature.desc}</p>

      {/* Model badge */}
      <div className="feature-card-model">
        <span className="feature-model-dot" style={{ background: feature.accent }} aria-hidden="true" />
        {feature.model}
      </div>

      {/* Metrics */}
      <div className="feature-card-metrics">
        <div className="feature-metric">
          <span className="feature-metric-label">{feature.metric}</span>
          <span className="feature-metric-value mono" style={{ color: feature.accent }}>
            {feature.metricValue}{feature.metricSuffix}
          </span>
        </div>
        <div className="feature-metric">
          <span className="feature-metric-label">{feature.metric2}</span>
          <span className="feature-metric-value mono" style={{ color: feature.accent }}>
            {feature.metric2Value}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar" style={{ marginTop: '12px' }}>
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${feature.accent}, rgba(${feature.accentRgb},0.6))`,
          }}
        />
      </div>

      {/* CTA */}
      <Link to={feature.to} style={{ display: 'block', marginTop: '20px' }}>
        <button className="btn btn-primary" style={{ width: '100%' }} aria-label={`Accéder à ${feature.title}`}>
          Essayer maintenant
          <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
        </button>
      </Link>
    </div>
  );
}

/* ── KPI Card ── */
function KpiCard({ kpi, inView }) {
  const count = useCountUp(kpi.value, 1400, inView);
  return (
    <div className="kpi-card">
      <div className="kpi-icon">
        <FontAwesomeIcon icon={kpi.faIcon} style={{ color: kpi.color, fontSize: '22px' }} aria-hidden="true" />
      </div>
      <div className="kpi-value mono" style={{ color: kpi.color }}>
        {kpi.prefix}{count.toLocaleString('fr-FR')}{kpi.suffix}
        {kpi.trend && <span className="kpi-trend" aria-label="en hausse">{kpi.trend}</span>}
      </div>
      <div className="kpi-label">{kpi.label}</div>
      {kpi.ring && (
        <svg className="kpi-ring" viewBox="0 0 90 90" aria-hidden="true">
          <circle cx="45" cy="45" r="40" fill="none" stroke="rgba(0,0,0,0.06)" strokeWidth="6" />
          <circle
            cx="45" cy="45" r="40" fill="none"
            stroke={kpi.color} strokeWidth="6" strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={inView ? 251 - (kpi.ring / 100) * 251 : 251}
            style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
        </svg>
      )}
    </div>
  );
}

/* ── Main Home component ── */
export default function Home() {
  const [cardsRef, cardsInView] = useInView(0.1);
  const [statsRef, statsInView] = useInView(0.1);
  const [tableRef, tableInView] = useInView(0.1);

  const maxCluster = Math.max(...CLUSTERS.map(c => c.value));

  return (
    <div className="home">

      {/* ── HERO ── */}
      <section className="hero" aria-labelledby="hero-heading">
        <div className="hero-grid-bg" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />

        <div className="container hero-content">
          {/* Badge */}
          <div className="hero-badge animate-fade-up" aria-label="Technologie utilisée">
            <span className="hero-badge-dot" aria-hidden="true" />
            <FontAwesomeIcon icon={faBrain} aria-hidden="true" style={{ fontSize: '12px' }} />
            Powered by XGBoost + DBSCAN
          </div>

          {/* Headline */}
          <h1 id="hero-heading" className="hero-title animate-fade-up-1">
            Intelligence Artificielle<br />
            <span className="hero-title-gradient">pour les RH</span>
          </h1>

          <p className="hero-subtitle animate-fade-up-2">
            Prédisez les départs, segmentez vos équipes et recommandez les meilleurs profils
            grâce à des modèles ML entraînés sur <span className="mono" style={{ color: 'var(--color-sky)' }}>1 470 employés</span>.
          </p>

          <div className="hero-cta animate-fade-up-3">
            <Link to="/attrition">
              <button className="btn btn-primary" style={{ padding: '13px 28px', fontSize: '15px' }}>
                <FontAwesomeIcon icon={faChartLine} aria-hidden="true" />
                Commencer l'analyse
                <FontAwesomeIcon icon={faArrowRight} aria-hidden="true" />
              </button>
            </Link>
            <a href="https://github.com/Gh162002/machineWeb" target="_blank" rel="noreferrer">
              <button className="btn btn-secondary" style={{ padding: '13px 28px', fontSize: '15px' }}>
                <FontAwesomeIcon icon={faCode} aria-hidden="true" />
                GitHub
              </button>
            </a>
          </div>

          {/* Mini stats row */}
          <div className="hero-stats animate-fade-up-3">
            {[
              { v: '3',     l: 'Modèles ML' },
              { v: '1 470', l: 'Employés' },
              { v: '35',    l: 'Features' },
              { v: '0.731', l: 'AUC Score' },
            ].map(s => (
              <div key={s.l} className="hero-stat">
                <span className="hero-stat-value mono">{s.v}</span>
                <span className="hero-stat-label">{s.l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURE CARDS ── */}
      <section className="section" ref={cardsRef} aria-labelledby="features-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="features-heading" className="section-title">Modules d'Analyse</h2>
            <p className="section-subtitle">Trois objectifs data science complémentaires</p>
          </div>
          <div className="features-grid">
            {FEATURES.map(f => (
              <FeatureCard key={f.key} feature={f} inView={cardsInView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS DASHBOARD ── */}
      <section className="section stats-section" ref={statsRef} aria-labelledby="stats-heading">
        <div className="container">
          <div className="section-header">
            <h2 id="stats-heading" className="section-title">
              Performances du Modèle
              <span className="section-title-line" aria-hidden="true" />
            </h2>
            <p className="section-subtitle">Métriques mesurées sur le jeu de test (294 exemples)</p>
          </div>

          {/* KPI row */}
          <div className="kpi-grid">
            {KPIS.map(k => (
              <KpiCard key={k.label} kpi={k} inView={statsInView} />
            ))}
          </div>

          {/* Charts row */}
          <div className="charts-row">
            {/* Bar chart — cluster distribution */}
            <div className="chart-card" aria-label="Distribution des employés par cluster">
              <h3 className="chart-title">Distribution par cluster DBSCAN</h3>
              <div className="bar-chart">
                {CLUSTERS.map((c, i) => (
                  <div key={c.label} className="bar-item">
                    <div className="bar-label">{c.label}</div>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{
                          width: statsInView ? `${(c.value / maxCluster) * 100}%` : '0%',
                          background: c.color,
                          transitionDelay: `${i * 80}ms`,
                        }}
                        role="progressbar"
                        aria-valuenow={c.value}
                        aria-valuemin={0}
                        aria-valuemax={maxCluster}
                        aria-label={`${c.label}: ${c.value} employés`}
                      />
                    </div>
                    <div className="bar-value mono">{c.value}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut chart — attrition */}
            <div className="chart-card" aria-label="Répartition attrition vs rétention">
              <h3 className="chart-title">Attrition vs Rétention</h3>
              <div className="donut-wrapper">
                <svg viewBox="0 0 120 120" className="donut-svg" aria-hidden="true">
                  {/* Background ring */}
                  <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
                  {/* Retention arc (82%) */}
                  <circle
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke="var(--color-emerald)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray="301.6"
                    strokeDashoffset={statsInView ? 301.6 * 0.18 : 301.6}
                    style={{ transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4,0,0.2,1)', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                  />
                  {/* Attrition arc (18%) */}
                  <circle
                    cx="60" cy="60" r="48"
                    fill="none"
                    stroke="var(--color-rose)"
                    strokeWidth="14"
                    strokeLinecap="round"
                    strokeDasharray="301.6"
                    strokeDashoffset={statsInView ? 301.6 * 0.82 : 301.6}
                    style={{ transition: 'stroke-dashoffset 1.4s 0.2s cubic-bezier(0.4,0,0.2,1)', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                  />
                  <text x="60" y="56" textAnchor="middle" fill="var(--color-heading)" fontSize="14" fontWeight="700" fontFamily="JetBrains Mono">16.1%</text>
                  <text x="60" y="70" textAnchor="middle" fill="var(--color-muted)" fontSize="7" fontFamily="Inter">attrition</text>
                </svg>
                <div className="donut-legend">
                  <div className="donut-legend-item">
                    <span className="donut-dot" style={{ background: 'var(--color-emerald)' }} aria-hidden="true" />
                    <span>Rétention <strong className="mono">83.9%</strong></span>
                  </div>
                  <div className="donut-legend-item">
                    <span className="donut-dot" style={{ background: 'var(--color-rose)' }} aria-hidden="true" />
                    <span>Attrition <strong className="mono">16.1%</strong></span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model performance table */}
          <div className="perf-table-wrapper" ref={tableRef} aria-label="Tableau des performances des modèles">
            <h3 className="chart-title" style={{ marginBottom: '16px' }}>Tableau de Performances</h3>
            <div style={{ overflowX: 'auto' }}>
              <table className="perf-table">
                <thead>
                  <tr>
                    {['DSO', 'Module', 'Algorithme', 'Métrique clé', 'Score', 'Statut'].map(h => (
                      <th key={h} scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MODELS.map((m, i) => (
                    <tr
                      key={m.dso}
                      className={tableInView ? 'row-visible' : ''}
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <td><span className="badge badge-accent">{m.dso}</span></td>
                      <td style={{ fontWeight: 600, color: 'var(--color-heading)' }}>{m.name}</td>
                      <td className="mono" style={{ fontSize: '13px', color: 'var(--color-sky)' }}>{m.algo}</td>
                      <td style={{ color: 'var(--color-muted)', fontSize: '13px' }}>{m.metric}</td>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--color-heading)' }}>{m.score}</td>
                      <td>
                        <span
                          className="status-pill"
                          style={{ background: `${m.statusColor}18`, color: m.statusColor, border: `1px solid ${m.statusColor}40` }}
                        >
                          <span className="status-dot" style={{ background: m.statusColor }} aria-hidden="true" />
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section className="section" aria-labelledby="about-heading">
        <div className="container">
          <div className="about-grid">
            <div className="about-card">
              <h3 id="about-heading" className="about-card-title">
                <FontAwesomeIcon icon={faBullseye} style={{ color: 'var(--color-accent)', fontSize: '18px' }} aria-hidden="true" />
                Objectifs Data Science
              </h3>
              <ul className="about-list">
                <li><span className="about-badge" style={{ background: 'rgba(244,96,122,0.1)', color: '#F4607A' }}>DSO1</span> Prédire les employés à risque d'attrition</li>
                <li><span className="about-badge" style={{ background: 'rgba(96,200,245,0.1)', color: '#60C8F5' }}>DSO2</span> Segmenter les employés en groupes homogènes</li>
                <li><span className="about-badge" style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623' }}>DSO3</span> Recommander les employés les plus adaptés</li>
              </ul>
            </div>
            <div className="about-card">
              <h3 className="about-card-title">
                <FontAwesomeIcon icon={faServer} style={{ color: 'var(--color-accent)', fontSize: '18px' }} aria-hidden="true" />
                Stack Technologique
              </h3>
              <ul className="about-list">
                <li><span className="about-badge" style={{ background: 'rgba(52,201,138,0.1)', color: '#34C98A' }}>Backend</span> FastAPI + Python 3.11</li>
                <li><span className="about-badge" style={{ background: 'rgba(96,200,245,0.1)', color: '#60C8F5' }}>Frontend</span> React 18 + JavaScript</li>
                <li><span className="about-badge" style={{ background: 'rgba(124,111,247,0.1)', color: '#7C6FF7' }}>ML</span> Scikit-learn · XGBoost · SMOTE · DBSCAN</li>
                <li><span className="about-badge" style={{ background: 'rgba(245,166,35,0.1)', color: '#F5A623' }}>Deploy</span> Render + Vercel + Docker</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
