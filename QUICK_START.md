# ⚡ Quick Start - 5 Minutes

Démarrez l'application ML RH en 5 minutes chrono !

---

## 🎯 Méthode 1 : Script Automatique (Recommandé)

### Windows
```bash
start.bat
```

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

✅ Le script va automatiquement :
1. Entraîner les modèles si nécessaire
2. Démarrer le backend et le frontend
3. Ouvrir l'application dans votre navigateur

---

## 🐳 Méthode 2 : Docker (Le plus simple)

```bash
# Entraîner les modèles
python train_models.py

# Démarrer avec Docker
docker-compose up --build
```

✅ Accéder à :
- Frontend : http://localhost:3000
- Backend : http://localhost:8000

---

## 🔧 Méthode 3 : Manuel (Plus de contrôle)

### Étape 1 : Entraîner les modèles (1 fois)
```bash
pip install -r backend/requirements.txt
python train_models.py
```

### Étape 2 : Backend (Terminal 1)
```bash
cd backend
uvicorn app.main:app --reload
```

### Étape 3 : Frontend (Terminal 2)
```bash
cd frontend
npm install
npm start
```

---

## 🎉 C'est prêt !

Ouvrez http://localhost:3000 et commencez à utiliser l'application !

### Premiers pas :

1. **Page d'accueil** : Vue d'ensemble des 3 modules
2. **Attrition** : Testez avec les valeurs par défaut
3. **Segmentation** : Identifiez un segment d'employé
4. **Recommandation** : Calculez un score

---

## 🆘 Problèmes ?

**Erreur : Port 8000 déjà utilisé**
```bash
# Changer le port du backend
uvicorn app.main:app --port 8001
```

**Erreur : Modèles non trouvés**
```bash
python train_models.py
```

**Erreur : npm install échoue**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📚 Documentation complète

- 📖 [Guide d'utilisation](GUIDE_UTILISATION.md)
- 🚀 [Guide de déploiement](DEPLOYMENT.md)
- 📋 [README](README.md)

---

**Bon développement ! 🚀**
