# 🚀 Guide de Déploiement - Application ML RH

Ce guide vous accompagne étape par étape pour déployer votre application ML RH en production.

---

## 📋 Prérequis

- Python 3.9+
- Node.js 16+
- Docker & Docker Compose (optionnel mais recommandé)
- Git

---

## 🔧 Installation Locale

### Étape 1 : Cloner le projet

```bash
git clone <votre-repo>
cd ml-rh-app
```

### Étape 2 : Entraîner les modèles

```bash
# Installer les dépendances Python
pip install -r backend/requirements.txt

# Entraîner et sauvegarder les modèles
python train_models.py
```

✅ Les modèles seront sauvegardés dans `backend/app/models/`

### Étape 3 : Démarrer le Backend

```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

✅ API disponible sur : http://localhost:8000

### Étape 4 : Démarrer le Frontend

```bash
cd frontend
npm install
npm start
```

✅ Application disponible sur : http://localhost:3000

---

## 🐳 Déploiement avec Docker

### Option 1 : Docker Compose (Recommandé)

```bash
# Construire et démarrer tous les services
docker-compose up --build

# En arrière-plan
docker-compose up -d --build
```

✅ Backend : http://localhost:8000  
✅ Frontend : http://localhost:3000

### Option 2 : Docker manuel

**Backend :**
```bash
cd backend
docker build -t ml-rh-backend .
docker run -p 8000:8000 ml-rh-backend
```

**Frontend :**
```bash
cd frontend
docker build -t ml-rh-frontend .
docker run -p 3000:3000 ml-rh-frontend
```

---

## ☁️ Déploiement Cloud

### Option A : Render (Recommandé - Gratuit)

#### Backend sur Render

1. Créer un compte sur [Render](https://render.com)
2. Créer un nouveau **Web Service**
3. Connecter votre repo GitHub
4. Configuration :
   - **Build Command :** `pip install -r requirements.txt`
   - **Start Command :** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment :** Python 3.11
   - **Root Directory :** `backend`

#### Frontend sur Render

1. Créer un nouveau **Static Site**
2. Configuration :
   - **Build Command :** `npm install && npm run build`
   - **Publish Directory :** `build`
   - **Root Directory :** `frontend`
3. Ajouter une variable d'environnement :
   - `REACT_APP_API_URL` = URL de votre backend Render

### Option B : Railway

1. Créer un compte sur [Railway](https://railway.app)
2. Créer un nouveau projet
3. Déployer depuis GitHub
4. Railway détectera automatiquement les Dockerfiles

### Option C : Heroku

**Backend :**
```bash
cd backend
heroku create ml-rh-backend
git push heroku main
```

**Frontend :**
```bash
cd frontend
heroku create ml-rh-frontend
heroku buildpacks:set mars/create-react-app
git push heroku main
```

### Option D : Vercel (Frontend uniquement)

```bash
cd frontend
npm install -g vercel
vercel
```

### Option E : AWS / Azure / GCP

Pour les déploiements cloud professionnels :

**AWS :**
- Backend : Elastic Beanstalk ou ECS
- Frontend : S3 + CloudFront
- Base de données : RDS (si nécessaire)

**Azure :**
- Backend : App Service
- Frontend : Static Web Apps
- Base de données : Azure SQL (si nécessaire)

**GCP :**
- Backend : Cloud Run
- Frontend : Firebase Hosting
- Base de données : Cloud SQL (si nécessaire)

---

## 🔐 Configuration de Production

### Variables d'environnement

**Backend (.env) :**
```env
ENVIRONMENT=production
ALLOWED_ORIGINS=https://votre-frontend.com
DEBUG=False
```

**Frontend (.env.production) :**
```env
REACT_APP_API_URL=https://votre-backend.com
```

### Sécurité

1. **CORS :** Modifier `allow_origins` dans `backend/app/main.py`
   ```python
   allow_origins=["https://votre-frontend.com"]
   ```

2. **HTTPS :** Toujours utiliser HTTPS en production

3. **Rate Limiting :** Ajouter un rate limiter (ex: slowapi)

4. **Authentification :** Implémenter JWT si nécessaire

---

## 📊 Monitoring

### Health Check

```bash
curl https://votre-backend.com/api/health
```

### Logs

**Docker :**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Render/Railway :** Consultez les logs dans le dashboard

---

## 🧪 Tests

### Backend

```bash
cd backend
pytest
```

### Frontend

```bash
cd frontend
npm test
```

---

## 🔄 Mise à jour

### Locale

```bash
git pull
python train_models.py  # Si modèles mis à jour
docker-compose up --build
```

### Cloud

Les plateformes comme Render et Railway se mettent à jour automatiquement à chaque push sur GitHub.

---

## 📈 Optimisations

### Performance

1. **Compression :** Activer gzip sur le backend
2. **Caching :** Mettre en cache les prédictions fréquentes
3. **CDN :** Utiliser un CDN pour le frontend
4. **Lazy Loading :** Charger les modèles à la demande

### Scalabilité

1. **Load Balancer :** Distribuer la charge
2. **Horizontal Scaling :** Ajouter des instances
3. **Database :** Utiliser PostgreSQL pour stocker les prédictions
4. **Queue :** Utiliser Celery pour les tâches longues

---

## 🆘 Dépannage

### Erreur : Modèles non trouvés

```bash
python train_models.py
```

### Erreur : CORS

Vérifier `allow_origins` dans `backend/app/main.py`

### Erreur : Port déjà utilisé

```bash
# Changer le port
uvicorn app.main:app --port 8001
```

### Erreur : npm install échoue

```bash
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Support

Pour toute question :
- 📧 Email : support@ml-rh.com
- 📚 Documentation : https://docs.ml-rh.com
- 🐛 Issues : GitHub Issues

---

## ✅ Checklist de Déploiement

- [ ] Modèles entraînés et sauvegardés
- [ ] Tests backend passés
- [ ] Tests frontend passés
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] HTTPS activé
- [ ] Health check fonctionnel
- [ ] Monitoring en place
- [ ] Backup des modèles
- [ ] Documentation à jour

---

**Bon déploiement ! 🚀**
