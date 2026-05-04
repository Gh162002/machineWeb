@echo off
echo 🚀 Démarrage de l'application ML RH
echo ====================================
echo.

REM Vérifier si les modèles existent
if not exist "backend\app\models\attrition_model.pkl" (
    echo ⚠️  Les modèles ML n'ont pas été trouvés.
    echo 📊 Entraînement des modèles en cours...
    python train_models.py
    
    if errorlevel 1 (
        echo ❌ Erreur lors de l'entraînement des modèles
        pause
        exit /b 1
    )
    echo ✅ Modèles entraînés avec succès!
) else (
    echo ✅ Modèles ML trouvés
)

echo.
echo 🐳 Tentative de démarrage avec Docker Compose...
docker-compose up --build

REM Si Docker échoue, démarrer manuellement
if errorlevel 1 (
    echo.
    echo ⚠️  Docker n'est pas disponible
    echo 🔧 Démarrage manuel...
    echo.
    
    REM Backend
    echo 📡 Démarrage du backend...
    start cmd /k "cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload"
    
    REM Attendre 5 secondes
    timeout /t 5 /nobreak > nul
    
    REM Frontend
    echo 🎨 Démarrage du frontend...
    start cmd /k "cd frontend && npm install && npm start"
    
    echo.
    echo ✅ Application démarrée!
    echo 📡 Backend: http://localhost:8000
    echo 🎨 Frontend: http://localhost:3000
    echo.
    echo Fermez les fenêtres de commande pour arrêter l'application
)

pause
