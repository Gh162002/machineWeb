# 🔧 Guide de Dépannage - Application ML RH

Guide pour résoudre les problèmes courants.

---

## 🚨 Problèmes Courants

### 1. Erreur : "Modèles non trouvés"

**Symptôme :**
```
FileNotFoundError: [Errno 2] No such file or directory: 'backend/app/models/attrition_model.pkl'
```

**Solution :**
```bash
# Entraîner les modèles
python train_models.py
```

**Vérification :**
```bash
# Vérifier que les modèles existent
ls backend/app/models/
# Devrait afficher :
# attrition_model.pkl
# segmentation_model.pkl
# recommendation_model.pkl
# metadata.json
```

---

### 2. Erreur : "Port 8000 déjà utilisé"

**Symptôme :**
```
ERROR: [Errno 48] Address already in use
```

**Solution A : Changer le port**
```bash
# Backend sur le port 8001
uvicorn app.main:app --port 8001
```

**Solution B : Tuer le processus**

Windows :
```bash
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

Linux/Mac :
```bash
lsof -ti:8000 | xargs kill -9
```

---

### 3. Erreur : "npm install échoue"

**Symptôme :**
```
npm ERR! code ERESOLVE
npm ERR! ERESOLVE unable to resolve dependency tree
```

**Solution :**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

**Alternative :**
```bash
npm install --legacy-peer-deps
```

---

### 4. Erreur CORS

**Symptôme :**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution :**

Modifier `backend/app/main.py` :
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Ajouter votre URL frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

### 5. Erreur : "Module not found"

**Symptôme (Backend) :**
```
ModuleNotFoundError: No module named 'fastapi'
```

**Solution :**
```bash
cd backend
pip install -r requirements.txt
```

**Symptôme (Frontend) :**
```
Module not found: Can't resolve 'axios'
```

**Solution :**
```bash
cd frontend
npm install
```

---

### 6. Docker : "Cannot connect to Docker daemon"

**Symptôme :**
```
Cannot connect to the Docker daemon at unix:///var/run/docker.sock
```

**Solution :**

Windows :
- Démarrer Docker Desktop

Linux :
```bash
sudo systemctl start docker
sudo usermod -aG docker $USER
# Redémarrer la session
```

Mac :
- Démarrer Docker Desktop

---

### 7. Erreur : "Python version incompatible"

**Symptôme :**
```
ERROR: This package requires Python >=3.9
```

**Solution :**

Vérifier la version :
```bash
python --version
```

Installer Python 3.9+ :
- Windows : https://www.python.org/downloads/
- Linux : `sudo apt install python3.9`
- Mac : `brew install python@3.9`

---

### 8. Frontend : Page blanche

**Symptôme :**
- Page blanche
- Pas d'erreur visible

**Solution :**

1. Ouvrir la console du navigateur (F12)
2. Vérifier les erreurs JavaScript
3. Vérifier que le backend est démarré
4. Vérifier l'URL de l'API dans `.env`

```bash
# frontend/.env
REACT_APP_API_URL=http://localhost:8000
```

---

### 9. Prédictions incorrectes

**Symptôme :**
- Résultats incohérents
- Probabilités étranges

**Solution :**

1. Réentraîner les modèles :
```bash
python train_models.py
```

2. Redémarrer le backend :
```bash
cd backend
uvicorn app.main:app --reload
```

3. Vider le cache du navigateur (Ctrl+Shift+Delete)

---

### 10. Docker Compose échoue

**Symptôme :**
```
ERROR: Service 'backend' failed to build
```

**Solution :**

1. Nettoyer Docker :
```bash
docker-compose down
docker system prune -a
```

2. Reconstruire :
```bash
docker-compose up --build
```

---

### 11. Erreur : "Permission denied"

**Symptôme (Linux/Mac) :**
```
Permission denied: './start.sh'
```

**Solution :**
```bash
chmod +x start.sh
./start.sh
```

---

### 12. Lenteur de l'application

**Symptôme :**
- Prédictions lentes (>5 secondes)
- Interface qui lag

**Solutions :**

1. **Backend :**
   - Vérifier les ressources système (CPU, RAM)
   - Redémarrer le backend
   - Utiliser `--workers 4` avec uvicorn

2. **Frontend :**
   - Vider le cache du navigateur
   - Fermer les onglets inutiles
   - Utiliser le mode production :
   ```bash
   npm run build
   serve -s build
   ```

---

### 13. Erreur : "Cannot read property of undefined"

**Symptôme (Frontend) :**
```
TypeError: Cannot read property 'data' of undefined
```

**Solution :**

1. Vérifier que le backend répond :
```bash
curl http://localhost:8000/api/health
```

2. Vérifier la structure de la réponse API

3. Ajouter des vérifications dans le code :
```javascript
if (response && response.data) {
  setResult(response.data);
}
```

---

### 14. Erreur : "Pickle version incompatible"

**Symptôme :**
```
ValueError: unsupported pickle protocol
```

**Solution :**

Réentraîner les modèles avec la même version de Python :
```bash
python --version  # Vérifier la version
python train_models.py
```

---

### 15. Docker : "No space left on device"

**Symptôme :**
```
ERROR: No space left on device
```

**Solution :**

Nettoyer Docker :
```bash
docker system prune -a --volumes
docker volume prune
```

---

## 🔍 Diagnostic Général

### Vérifier l'état du système

**Backend :**
```bash
# Vérifier que le backend est démarré
curl http://localhost:8000/api/health

# Devrait retourner :
# {"status":"healthy","models_loaded":{...}}
```

**Frontend :**
```bash
# Vérifier que le frontend est accessible
curl http://localhost:3000

# Devrait retourner du HTML
```

**Modèles :**
```bash
# Vérifier que les modèles existent
ls -lh backend/app/models/

# Devrait afficher 4 fichiers
```

---

## 📊 Logs et Debugging

### Backend Logs

**Mode développement :**
```bash
uvicorn app.main:app --reload --log-level debug
```

**Docker :**
```bash
docker-compose logs -f backend
```

### Frontend Logs

**Console du navigateur :**
- Ouvrir DevTools (F12)
- Onglet Console
- Vérifier les erreurs

**Terminal :**
```bash
npm start
# Les erreurs s'affichent dans le terminal
```

---

## 🆘 Obtenir de l'Aide

### Avant de demander de l'aide

1. ✅ Lire ce guide de dépannage
2. ✅ Vérifier les logs d'erreur
3. ✅ Essayer de redémarrer l'application
4. ✅ Vérifier la documentation

### Informations à fournir

Quand vous demandez de l'aide, incluez :

1. **Système d'exploitation** : Windows/Linux/Mac
2. **Versions** :
   ```bash
   python --version
   node --version
   npm --version
   docker --version
   ```
3. **Message d'erreur complet**
4. **Étapes pour reproduire le problème**
5. **Ce que vous avez déjà essayé**

---

## 📚 Ressources Utiles

### Documentation
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Docker Docs](https://docs.docker.com/)
- [Scikit-learn Docs](https://scikit-learn.org/)

### Communauté
- Stack Overflow
- GitHub Issues
- Discord/Slack de la communauté

---

## 🔄 Réinitialisation Complète

Si rien ne fonctionne, réinitialiser complètement :

```bash
# 1. Arrêter tout
docker-compose down
pkill -f uvicorn
pkill -f "npm start"

# 2. Nettoyer
rm -rf backend/app/models/
rm -rf frontend/node_modules/
rm -rf frontend/build/

# 3. Réinstaller
pip install -r backend/requirements.txt
cd frontend && npm install && cd ..

# 4. Réentraîner
python train_models.py

# 5. Redémarrer
docker-compose up --build
```

---

## ✅ Checklist de Vérification

Avant de signaler un bug, vérifier :

- [ ] Python 3.9+ installé
- [ ] Node.js 16+ installé
- [ ] Modèles entraînés (`backend/app/models/` existe)
- [ ] Dépendances installées (backend et frontend)
- [ ] Ports 3000 et 8000 disponibles
- [ ] Backend démarré et accessible
- [ ] Frontend démarré et accessible
- [ ] Pas d'erreurs dans les logs
- [ ] CORS configuré correctement
- [ ] Variables d'environnement configurées

---

**Si le problème persiste, n'hésitez pas à ouvrir une issue sur GitHub ! 🐛**
