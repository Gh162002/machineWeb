# 🚀 Application Web ML - Gestion RH

[![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-61dafb.svg)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.109-009688.svg)](https://fastapi.tiangolo.com/)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ed.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

Application web complète pour déployer 3 modèles de Machine Learning destinés à la gestion des ressources humaines.

## 🎯 Fonctionnalités

### 📊 DSO1 : Prédiction d'Attrition
Identifiez les employés à risque de quitter l'entreprise avec notre modèle **Random Forest + SMOTE** optimisé.
- ✅ Précision : ~83%
- ✅ ROC-AUC : ~0.78
- ✅ Interprétable avec SHAP

### 🎯 DSO2 : Segmentation des Employés
Classez vos employés en 4 groupes homogènes avec **K-Means + PCA**.
- ✅ 4 segments bien définis
- ✅ Visualisation claire
- ✅ Recommandations par segment

### ⭐ DSO3 : Recommandation Intelligente
Évaluez le potentiel des employés avec un score de 0 à 100 basé sur une **Régression Linéaire**.
- ✅ Score de recommandation
- ✅ Prédiction de performance
- ✅ Interprétation détaillée

---

## ⚡ Démarrage Rapide (5 minutes)

### Option 1 : Script Automatique (Recommandé)

**Windows :**
```bash
start.bat
```

**Linux/Mac :**
```bash
chmod +x start.sh
./start.sh
```

### Option 2 : Docker

```bash
# Entraîner les modèles
python train_models.py

# Démarrer l'application
docker-compose up --build
```

✅ **C'est prêt !**
- Frontend : http://localhost:3000
- Backend : http://localhost:8000
- API Docs : http://localhost:8000/docs

---

## 📁 Structure du Projet

```
ml-rh-app/
├── 📄 Documentation
│   ├── README.md                    # Ce fichier
│   ├── QUICK_START.md               # Démarrage rapide
│   ├── GUIDE_UTILISATION.md         # Guide utilisateur
│   ├── DEPLOYMENT.md                # Guide de déploiement
│   ├── ARCHITECTURE.md              # Documentation technique
│   ├── RESUME_PROJET.md             # Résumé du projet
│   └── CHECKLIST.md                 # Checklist complète
│
├── 🐍 Backend (FastAPI)
│   ├── app/
│   │   ├── main.py                  # API REST
│   │   └── models/                  # Modèles ML (.pkl)
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── 🎨 Frontend (React)
│   ├── src/
│   │   ├── pages/                   # Pages de l'app
│   │   │   ├── Home.js
│   │   │   ├── AttritionPredictor.js
│   │   │   ├── Segmentation.js
│   │   │   └── Recommendation.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── Dockerfile
│   └── .env.example
│
├── 📊 Données & Modèles
│   ├── train_models.py              # Script d'entraînement
│   ├── WA_Fn-UseC_-HR-Employee-Attrition-1.csv
│   └── ML_fin_DSO_v3.ipynb          # Notebook original
│
└── 🐳 DevOps
    ├── docker-compose.yml
    ├── start.bat / start.sh
    └── .gitignore
```

---

## 🛠️ Installation Détaillée

### Prérequis
- Python 3.9+
- Node.js 16+
- pip & npm
- Docker (optionnel)

### Étape 1 : Entraîner les Modèles

```bash
# Installer les dépendances Python
pip install -r backend/requirements.txt

# Entraîner et sauvegarder les modèles
python train_models.py
```

✅ Les modèles seront sauvegardés dans `backend/app/models/`

### Étape 2 : Démarrer le Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ API disponible sur http://localhost:8000

### Étape 3 : Démarrer le Frontend

```bash
cd frontend
npm install
npm start
```

✅ Application disponible sur http://localhost:3000

---

## 🚀 Déploiement

### Déploiement Local avec Docker

```bash
docker-compose up --build
```

### Déploiement Cloud

#### Render (Recommandé - Gratuit)

**Backend :**
1. Créer un Web Service sur [Render](https://render.com)
2. Connecter votre repo GitHub
3. Configuration :
   - Build Command : `pip install -r requirements.txt`
   - Start Command : `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Root Directory : `backend`

**Frontend :**
1. Créer un Static Site sur Render
2. Configuration :
   - Build Command : `npm install && npm run build`
   - Publish Directory : `build`
   - Root Directory : `frontend`
3. Variable d'environnement : `REACT_APP_API_URL` = URL de votre backend

#### Autres Options
- **Railway** : Déploiement automatique depuis GitHub
- **Heroku** : Classique et fiable
- **Vercel** : Parfait pour le frontend
- **AWS/Azure/GCP** : Pour les déploiements d'entreprise

📖 **Guide complet :** Voir [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 📊 API Endpoints

### Health Check
```http
GET /api/health
```

### Prédiction d'Attrition
```http
POST /api/predict/attrition
Content-Type: application/json

{
  "Age": 35,
  "Department": "Sales",
  "JobSatisfaction": 4,
  ...
}
```

### Segmentation
```http
POST /api/predict/segmentation
Content-Type: application/json

{
  "Age": 35,
  "MonthlyIncome": 5000,
  "YearsAtCompany": 5,
  ...
}
```

### Recommandation
```http
POST /api/predict/recommendation
Content-Type: application/json

{
  "Age": 35,
  "JobLevel": 2,
  "TotalWorkingYears": 10,
  ...
}
```

### Métadonnées
```http
GET /api/metadata
```

📖 **Documentation interactive :** http://localhost:8000/docs

---

## 🎓 Documentation

| Document | Description |
|----------|-------------|
| [QUICK_START.md](QUICK_START.md) | Démarrage en 5 minutes |
| [GUIDE_UTILISATION.md](GUIDE_UTILISATION.md) | Guide utilisateur complet |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Guide de déploiement détaillé |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Documentation technique |
| [RESUME_PROJET.md](RESUME_PROJET.md) | Résumé du projet |
| [CHECKLIST.md](CHECKLIST.md) | Checklist de vérification |

---

## 🧪 Tests

### Tester l'API

```bash
# Health check
curl http://localhost:8000/api/health

# Documentation interactive
open http://localhost:8000/docs
```

### Tester le Frontend

1. Ouvrir http://localhost:3000
2. Tester chaque module (Attrition, Segmentation, Recommandation)
3. Vérifier les résultats

---

## 🛡️ Technologies Utilisées

### Backend
- **FastAPI** - Framework API moderne
- **Uvicorn** - Serveur ASGI
- **Pydantic** - Validation des données
- **Scikit-learn** - Modèles ML
- **Pandas** - Manipulation de données
- **Imbalanced-learn** - SMOTE

### Frontend
- **React 18** - Framework UI
- **React Router 6** - Navigation
- **Axios** - Client HTTP
- **CSS3** - Styling moderne

### DevOps
- **Docker** - Conteneurisation
- **Docker Compose** - Orchestration

---

## 📈 Performances

- **Temps de réponse API** : 20-50ms
- **Précision des modèles** : ~83%
- **Taille des modèles** : <10 MB
- **Throughput** : Plusieurs centaines de requêtes/seconde

---

## 🔄 Roadmap

### ✅ Version 1.0 (Actuelle)
- [x] 3 modèles ML déployés
- [x] Interface web complète
- [x] API REST documentée
- [x] Docker support
- [x] Documentation exhaustive

### 🚧 Version 1.1 (Prochaine)
- [ ] Authentification JWT
- [ ] Historique des prédictions
- [ ] Export PDF/Excel
- [ ] Tests unitaires

### 🔮 Version 2.0 (Future)
- [ ] Dashboard analytique
- [ ] Intégration SIRH
- [ ] Mobile app
- [ ] Deep Learning models

---

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 License

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👥 Auteurs

**Équipe ML RH - Projet Data Science**

- **Ons Kochtane** - Random Forest + SHAP
- **Sahar Ouji Boughanmi** - XGBoost + tuning
- **Marwa Labidi** - K-Means + PCA
- **Ghada Mahmoud** - DBSCAN + tuning
- **Amin** - Régression + benchmarking

---

## 📞 Support

Pour toute question ou problème :

- 📧 Email : support@ml-rh.com
- 📚 Documentation : Voir les fichiers `.md`
- 🐛 Issues : [GitHub Issues](https://github.com/votre-repo/issues)

---

## 🙏 Remerciements

- Dataset : [IBM HR Analytics Employee Attrition](https://www.kaggle.com/datasets/pavansubhasht/ibm-hr-analytics-attrition-dataset)
- FastAPI : [Documentation](https://fastapi.tiangolo.com/)
- React : [Documentation](https://react.dev/)
- Scikit-learn : [Documentation](https://scikit-learn.org/)

---

<div align="center">

**Développé avec ❤️ par l'équipe ML RH**

⭐ Si ce projet vous a aidé, n'hésitez pas à lui donner une étoile !

</div>
