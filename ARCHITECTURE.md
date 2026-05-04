# 🏗️ Architecture de l'Application ML RH

Documentation technique de l'architecture de l'application.

---

## 📐 Vue d'ensemble

```
┌─────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                          │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Attrition   │  │ Segmentation │  │Recommendation│      │
│  │    Page      │  │     Page     │  │     Page     │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              API Client (Axios)                      │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BACKEND (FastAPI)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  API Routes                          │    │
│  │  • POST /api/predict/attrition                       │    │
│  │  • POST /api/predict/segmentation                    │    │
│  │  • POST /api/predict/recommendation                  │    │
│  │  • GET  /api/health                                  │    │
│  │  • GET  /api/metadata                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                              │                                │
│                              ▼                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              ML Models Layer                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────┐  │    │
│  │  │Random Forest │  │   K-Means    │  │ Linear   │  │    │
│  │  │   + SMOTE    │  │    + PCA     │  │Regression│  │    │
│  │  └──────────────┘  └──────────────┘  └──────────┘  │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    MODELS STORAGE                            │
│  • attrition_model.pkl                                       │
│  • segmentation_model.pkl                                    │
│  • recommendation_model.pkl                                  │
│  • metadata.json                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Frontend (React)

### Structure des dossiers

```
frontend/
├── public/
│   └── index.html          # Point d'entrée HTML
├── src/
│   ├── pages/              # Pages de l'application
│   │   ├── Home.js         # Page d'accueil
│   │   ├── AttritionPredictor.js
│   │   ├── Segmentation.js
│   │   └── Recommendation.js
│   ├── App.js              # Composant principal + routing
│   ├── App.css             # Styles globaux
│   ├── index.js            # Point d'entrée React
│   └── index.css           # Styles de base
├── package.json            # Dépendances npm
└── Dockerfile              # Configuration Docker
```

### Technologies utilisées

- **React 18** : Framework UI
- **React Router 6** : Navigation
- **Axios** : Client HTTP
- **CSS3** : Styling (pas de framework CSS pour simplicité)

### Flux de données

1. L'utilisateur remplit un formulaire
2. Les données sont validées côté client
3. Requête HTTP POST vers l'API backend
4. Affichage des résultats avec visualisations

### Composants principaux

**App.js**
- Gestion du routing
- Navigation globale
- Layout de l'application

**Pages**
- Formulaires de saisie
- Gestion de l'état local (useState)
- Appels API (axios)
- Affichage des résultats

---

## 🔧 Backend (FastAPI)

### Structure des dossiers

```
backend/
├── app/
│   ├── main.py             # Point d'entrée API
│   └── models/             # Modèles ML sauvegardés
│       ├── attrition_model.pkl
│       ├── segmentation_model.pkl
│       ├── recommendation_model.pkl
│       └── metadata.json
├── requirements.txt        # Dépendances Python
└── Dockerfile              # Configuration Docker
```

### Technologies utilisées

- **FastAPI** : Framework API moderne et rapide
- **Uvicorn** : Serveur ASGI
- **Pydantic** : Validation des données
- **Scikit-learn** : Modèles ML
- **Pandas** : Manipulation de données
- **Imbalanced-learn** : SMOTE pour équilibrage

### Endpoints API

**GET /**
- Description : Page d'accueil de l'API
- Réponse : Informations sur l'API et les endpoints

**GET /api/health**
- Description : Vérification de l'état de l'API
- Réponse : Status et état des modèles

**POST /api/predict/attrition**
- Description : Prédire le risque d'attrition
- Input : AttritionInput (29 champs)
- Output : { prediction, probability, risk_level, message }

**POST /api/predict/segmentation**
- Description : Segmenter un employé
- Input : SegmentationInput (10 champs)
- Output : { cluster, description, message }

**POST /api/predict/recommendation**
- Description : Score de recommandation
- Input : RecommendationInput (7 champs)
- Output : { score, level, predicted_income, message }

**GET /api/metadata**
- Description : Métadonnées des modèles
- Output : Informations sur les features et modèles

### Flux de traitement

1. Réception de la requête HTTP
2. Validation avec Pydantic
3. Prétraitement des données
4. Prédiction avec le modèle ML
5. Post-traitement des résultats
6. Retour de la réponse JSON

---

## 🤖 Modèles ML

### DSO1 : Prédiction d'Attrition

**Modèle :** Random Forest Classifier + SMOTE

**Pipeline :**
```
Données brutes
    ↓
Label Encoding (variables catégorielles)
    ↓
SMOTE (équilibrage des classes)
    ↓
Random Forest (200 arbres, max_depth=15)
    ↓
Probabilité d'attrition (0-1)
```

**Features :** 29 variables
- Démographiques : Age, Gender, MaritalStatus
- Professionnelles : JobRole, JobLevel, Department
- Satisfaction : JobSatisfaction, WorkLifeBalance
- Rémunération : MonthlyIncome, StockOptionLevel
- Expérience : YearsAtCompany, TotalWorkingYears

**Performance :**
- Accuracy : ~83%
- ROC-AUC : ~0.78
- Recall (classe 1) : Optimisé avec SMOTE

### DSO2 : Segmentation

**Modèle :** K-Means + PCA

**Pipeline :**
```
Données brutes
    ↓
StandardScaler (normalisation)
    ↓
PCA (réduction à 5 composantes)
    ↓
K-Means (4 clusters)
    ↓
Numéro du cluster (0-3)
```

**Features :** 10 variables numériques
- Age, MonthlyIncome
- YearsAtCompany, YearsInCurrentRole
- JobSatisfaction, WorkLifeBalance
- EnvironmentSatisfaction

**Clusters :**
- 0 : Juniors en développement
- 1 : Expérimentés et satisfaits
- 2 : À risque de départ
- 3 : Cadres seniors stables

### DSO3 : Recommandation

**Modèle :** Linear Regression

**Pipeline :**
```
Données brutes
    ↓
StandardScaler (normalisation)
    ↓
Linear Regression
    ↓
Prédiction du salaire
    ↓
Conversion en score (0-100)
```

**Features :** 7 variables
- Age, JobLevel
- TotalWorkingYears, YearsAtCompany
- JobSatisfaction, PerformanceRating
- TrainingTimesLastYear

**Output :**
- Score : 0-100
- Niveau : Faible, Moyen, Bon, Excellent
- Salaire prédit

---

## 🔄 Flux de données complet

### Exemple : Prédiction d'attrition

```
1. FRONTEND
   ┌─────────────────────────────────────┐
   │ Utilisateur remplit le formulaire   │
   │ Age: 35, Department: Sales, etc.    │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ Validation côté client              │
   │ Vérification des types et ranges    │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ axios.post('/api/predict/attrition')│
   │ Envoi des données en JSON           │
   └─────────────────────────────────────┘

2. BACKEND
                    ↓
   ┌─────────────────────────────────────┐
   │ FastAPI reçoit la requête           │
   │ Route: POST /api/predict/attrition  │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ Validation Pydantic                 │
   │ AttritionInput model                │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ Prétraitement                       │
   │ - Label encoding                    │
   │ - Création du vecteur de features   │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ Prédiction ML                       │
   │ model.predict_proba(X)              │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ Post-traitement                     │
   │ - Calcul du risk_level              │
   │ - Génération du message             │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ Réponse JSON                        │
   │ { probability: 0.75, risk: "Élevé" }│
   └─────────────────────────────────────┘

3. FRONTEND
                    ↓
   ┌─────────────────────────────────────┐
   │ Réception de la réponse             │
   │ setResult(response.data)            │
   └─────────────────────────────────────┘
                    ↓
   ┌─────────────────────────────────────┐
   │ Affichage des résultats             │
   │ - Probabilité avec barre de progrès │
   │ - Badge de risque coloré            │
   │ - Recommandations                   │
   └─────────────────────────────────────┘
```

---

## 🐳 Déploiement Docker

### Architecture Docker

```
┌─────────────────────────────────────────┐
│         Docker Compose                  │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Backend Container                │ │
│  │  - Python 3.11                    │ │
│  │  - FastAPI + Uvicorn              │ │
│  │  - Port 8000                      │ │
│  │  - Volume: ./backend:/app         │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │  Frontend Container               │ │
│  │  - Node 18                        │ │
│  │  - React + npm                    │ │
│  │  - Port 3000                      │ │
│  │  - Volume: ./frontend:/app        │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Network: ml-rh-network                │
└─────────────────────────────────────────┘
```

### Avantages

- ✅ Isolation des environnements
- ✅ Reproductibilité
- ✅ Déploiement simplifié
- ✅ Scalabilité facile

---

## 🔐 Sécurité

### Mesures implémentées

1. **CORS** : Configuration des origines autorisées
2. **Validation** : Pydantic pour valider toutes les entrées
3. **Type Safety** : TypeScript-like avec Pydantic
4. **Error Handling** : Gestion des erreurs avec HTTPException

### Recommandations pour la production

1. **HTTPS** : Toujours utiliser HTTPS
2. **Rate Limiting** : Limiter les requêtes par IP
3. **Authentication** : Implémenter JWT
4. **Logging** : Logger toutes les requêtes
5. **Monitoring** : Utiliser Prometheus + Grafana
6. **Secrets** : Utiliser des variables d'environnement

---

## 📊 Performance

### Temps de réponse

- **Prédiction d'attrition** : ~50ms
- **Segmentation** : ~30ms
- **Recommandation** : ~20ms

### Optimisations possibles

1. **Caching** : Redis pour les prédictions fréquentes
2. **Batch Processing** : Traiter plusieurs employés en une fois
3. **Model Compression** : Réduire la taille des modèles
4. **Load Balancing** : Distribuer la charge
5. **CDN** : Pour le frontend

---

## 🔄 Évolutions futures

### Court terme

- [ ] Authentification utilisateur
- [ ] Historique des prédictions
- [ ] Export des résultats (PDF, Excel)
- [ ] Dashboard analytique

### Moyen terme

- [ ] API GraphQL
- [ ] Notifications en temps réel
- [ ] Intégration avec SIRH
- [ ] Mobile app (React Native)

### Long terme

- [ ] Deep Learning models
- [ ] Prédictions en temps réel
- [ ] Recommandations personnalisées
- [ ] A/B testing des modèles

---

## 📚 Ressources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Scikit-learn Documentation](https://scikit-learn.org/)
- [Docker Documentation](https://docs.docker.com/)

---

**Architecture maintenue par l'équipe ML RH** 🏗️
