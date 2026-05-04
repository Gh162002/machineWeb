@echo off
echo 🚀 Préparation pour le déploiement sur Render
echo ============================================
echo.

REM Vérifier que les modèles existent
if not exist "backend\app\models\attrition_model.pkl" (
    echo ❌ ERREUR: Les modèles ML n'existent pas!
    echo 📊 Veuillez d'abord exécuter: python train_models.py
    pause
    exit /b 1
)

echo ✅ Modèles ML trouvés

REM Vérifier Git
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git n'est pas installé
    pause
    exit /b 1
)

echo ✅ Git installé

REM Initialiser Git si nécessaire
if not exist ".git" (
    echo 📦 Initialisation du repository Git...
    git init
    git add .
    git commit -m "Initial commit - ML RH Application"
    echo ✅ Repository Git créé
) else (
    echo ✅ Repository Git existe déjà
)

echo.
echo 📋 PROCHAINES ÉTAPES:
echo.
echo 1. Créer un repository sur GitHub:
echo    - Aller sur https://github.com/new
echo    - Nom: machineWeb (ou autre)
echo    - Public ou Private
echo    - NE PAS initialiser avec README
echo.
echo 2. Pousser le code:
echo    git remote add origin https://github.com/VOTRE_USERNAME/machineWeb.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo 3. Déployer sur Render:
echo    - Aller sur https://render.com
echo    - New ^> Web Service
echo    - Connect GitHub repository
echo    - Render détectera automatiquement render.yaml
echo.
echo 4. Configurer les variables d'environnement:
echo    Backend: Aucune variable requise
echo    Frontend: REACT_APP_API_URL = URL_DE_VOTRE_BACKEND
echo.
echo ✅ Préparation terminée!
echo.
pause
