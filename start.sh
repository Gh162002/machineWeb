#!/bin/bash

echo "🚀 Démarrage de l'application ML RH"
echo "===================================="
echo ""

# Vérifier si les modèles existent
if [ ! -d "backend/app/models" ] || [ ! -f "backend/app/models/attrition_model.pkl" ]; then
    echo "⚠️  Les modèles ML n'ont pas été trouvés."
    echo "📊 Entraînement des modèles en cours..."
    python train_models.py
    
    if [ $? -eq 0 ]; then
        echo "✅ Modèles entraînés avec succès!"
    else
        echo "❌ Erreur lors de l'entraînement des modèles"
        exit 1
    fi
else
    echo "✅ Modèles ML trouvés"
fi

echo ""
echo "🐳 Démarrage avec Docker Compose..."
docker-compose up --build

# Si Docker n'est pas disponible, démarrer manuellement
if [ $? -ne 0 ]; then
    echo ""
    echo "⚠️  Docker n'est pas disponible"
    echo "🔧 Démarrage manuel..."
    echo ""
    
    # Backend
    echo "📡 Démarrage du backend..."
    cd backend
    pip install -r requirements.txt > /dev/null 2>&1
    uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 &
    BACKEND_PID=$!
    cd ..
    
    # Frontend
    echo "🎨 Démarrage du frontend..."
    cd frontend
    npm install > /dev/null 2>&1
    npm start &
    FRONTEND_PID=$!
    cd ..
    
    echo ""
    echo "✅ Application démarrée!"
    echo "📡 Backend: http://localhost:8000"
    echo "🎨 Frontend: http://localhost:3000"
    echo ""
    echo "Appuyez sur Ctrl+C pour arrêter"
    
    # Attendre l'interruption
    trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
    wait
fi
