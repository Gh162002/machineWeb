"""
API FastAPI pour les modèles ML RH
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any
import pickle
import numpy as np
import json
from pathlib import Path

app = FastAPI(
    title="API ML RH",
    description="API pour la prédiction d'attrition, segmentation et recommandation RH",
    version="1.0.0"
)

# Configuration CORS pour permettre les requêtes depuis le frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Charger les modèles au démarrage
MODELS_PATH = Path(__file__).parent / "models"

try:
    with open(MODELS_PATH / "attrition_model.pkl", "rb") as f:
        attrition_model_data = pickle.load(f)
    
    with open(MODELS_PATH / "segmentation_model.pkl", "rb") as f:
        segmentation_model_data = pickle.load(f)
    
    with open(MODELS_PATH / "recommendation_model.pkl", "rb") as f:
        recommendation_model_data = pickle.load(f)
    
    with open(MODELS_PATH / "metadata.json", "r") as f:
        metadata = json.load(f)
    
    print("✅ Tous les modèles chargés avec succès")
except Exception as e:
    print(f"⚠️ Erreur lors du chargement des modèles : {e}")
    print("⚠️ Veuillez exécuter train_models.py d'abord")

# ============================================
# MODÈLES PYDANTIC
# ============================================

class AttritionInput(BaseModel):
    Age: int = Field(..., ge=18, le=65, description="Âge de l'employé")
    BusinessTravel: str = Field(..., description="Fréquence des voyages d'affaires")
    DailyRate: int = Field(..., ge=100, le=1500)
    Department: str = Field(..., description="Département")
    DistanceFromHome: int = Field(..., ge=0, le=30)
    Education: int = Field(..., ge=1, le=5)
    EducationField: str
    EnvironmentSatisfaction: int = Field(..., ge=1, le=4)
    Gender: str
    HourlyRate: int = Field(..., ge=30, le=100)
    JobInvolvement: int = Field(..., ge=1, le=4)
    JobLevel: int = Field(..., ge=1, le=5)
    JobRole: str
    JobSatisfaction: int = Field(..., ge=1, le=4)
    MaritalStatus: str
    MonthlyIncome: int = Field(..., ge=1000, le=20000)
    MonthlyRate: int = Field(..., ge=2000, le=27000)
    NumCompaniesWorked: int = Field(..., ge=0, le=10)
    OverTime: str
    PercentSalaryHike: int = Field(..., ge=10, le=25)
    PerformanceRating: int = Field(..., ge=1, le=4)
    RelationshipSatisfaction: int = Field(..., ge=1, le=4)
    StockOptionLevel: int = Field(..., ge=0, le=3)
    TotalWorkingYears: int = Field(..., ge=0, le=40)
    TrainingTimesLastYear: int = Field(..., ge=0, le=6)
    WorkLifeBalance: int = Field(..., ge=1, le=4)
    YearsAtCompany: int = Field(..., ge=0, le=40)
    YearsInCurrentRole: int = Field(..., ge=0, le=20)
    YearsSinceLastPromotion: int = Field(..., ge=0, le=15)
    YearsWithCurrManager: int = Field(..., ge=0, le=20)

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 35,
                "BusinessTravel": "Travel_Rarely",
                "DailyRate": 800,
                "Department": "Sales",
                "DistanceFromHome": 5,
                "Education": 3,
                "EducationField": "Life Sciences",
                "EnvironmentSatisfaction": 3,
                "Gender": "Male",
                "HourlyRate": 65,
                "JobInvolvement": 3,
                "JobLevel": 2,
                "JobRole": "Sales Executive",
                "JobSatisfaction": 4,
                "MaritalStatus": "Married",
                "MonthlyIncome": 5000,
                "MonthlyRate": 15000,
                "NumCompaniesWorked": 2,
                "OverTime": "No",
                "PercentSalaryHike": 15,
                "PerformanceRating": 3,
                "RelationshipSatisfaction": 3,
                "StockOptionLevel": 1,
                "TotalWorkingYears": 10,
                "TrainingTimesLastYear": 3,
                "WorkLifeBalance": 3,
                "YearsAtCompany": 5,
                "YearsInCurrentRole": 3,
                "YearsSinceLastPromotion": 1,
                "YearsWithCurrManager": 3
            }
        }

class SegmentationInput(BaseModel):
    Age: int
    MonthlyIncome: int
    YearsAtCompany: int
    YearsInCurrentRole: int
    YearsSinceLastPromotion: int
    YearsWithCurrManager: int
    TotalWorkingYears: int
    JobSatisfaction: int
    WorkLifeBalance: int
    EnvironmentSatisfaction: int

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 35,
                "MonthlyIncome": 5000,
                "YearsAtCompany": 5,
                "YearsInCurrentRole": 3,
                "YearsSinceLastPromotion": 1,
                "YearsWithCurrManager": 3,
                "TotalWorkingYears": 10,
                "JobSatisfaction": 4,
                "WorkLifeBalance": 3,
                "EnvironmentSatisfaction": 3
            }
        }

class RecommendationInput(BaseModel):
    Age: int
    JobLevel: int
    TotalWorkingYears: int
    YearsAtCompany: int
    JobSatisfaction: int
    PerformanceRating: int
    TrainingTimesLastYear: int

    class Config:
        json_schema_extra = {
            "example": {
                "Age": 35,
                "JobLevel": 2,
                "TotalWorkingYears": 10,
                "YearsAtCompany": 5,
                "JobSatisfaction": 4,
                "PerformanceRating": 3,
                "TrainingTimesLastYear": 3
            }
        }

# ============================================
# ROUTES API
# ============================================

@app.get("/")
def read_root():
    return {
        "message": "API ML RH - Bienvenue",
        "version": "1.0.0",
        "endpoints": {
            "health": "/api/health",
            "attrition": "/api/predict/attrition",
            "segmentation": "/api/predict/segmentation",
            "recommendation": "/api/predict/recommendation"
        }
    }

@app.get("/api/health")
def health_check():
    """Vérifier l'état de l'API et des modèles"""
    return {
        "status": "healthy",
        "models_loaded": {
            "attrition": attrition_model_data is not None,
            "segmentation": segmentation_model_data is not None,
            "recommendation": recommendation_model_data is not None
        }
    }

@app.post("/api/predict/attrition")
def predict_attrition(data: AttritionInput):
    """
    Prédire le risque d'attrition d'un employé
    Retourne la probabilité de départ (0-1)
    """
    try:
        # Convertir en dictionnaire
        input_dict = data.model_dump()
        
        # Encoder les variables catégorielles
        label_encoders = attrition_model_data['label_encoders']
        for col, encoder in label_encoders.items():
            if col in input_dict and col != 'Attrition':
                try:
                    input_dict[col] = encoder.transform([input_dict[col]])[0]
                except:
                    # Si la valeur n'existe pas dans l'encoder, utiliser la première classe
                    input_dict[col] = 0
        
        # Créer le vecteur de features dans le bon ordre
        feature_names = attrition_model_data['feature_names']
        X = np.array([[input_dict.get(feat, 0) for feat in feature_names]])
        
        # Prédiction
        model = attrition_model_data['model']
        probability = model.predict_proba(X)[0][1]  # Probabilité de la classe 1 (Attrition)
        prediction = int(probability > 0.5)
        
        # Interprétation
        risk_level = "Élevé" if probability > 0.7 else "Moyen" if probability > 0.4 else "Faible"
        
        return {
            "prediction": prediction,
            "probability": float(probability),
            "risk_level": risk_level,
            "message": f"Risque d'attrition : {risk_level} ({probability*100:.1f}%)"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de prédiction : {str(e)}")

@app.post("/api/predict/segmentation")
def predict_segmentation(data: SegmentationInput):
    """
    Segmenter un employé dans un cluster
    Retourne le numéro du cluster et ses caractéristiques
    """
    try:
        # Convertir en array
        input_dict = data.model_dump()
        feature_names = segmentation_model_data['feature_names']
        X = np.array([[input_dict[feat] for feat in feature_names]])
        
        # Normalisation
        scaler = segmentation_model_data['scaler']
        X_scaled = scaler.transform(X)
        
        # PCA
        pca = segmentation_model_data['pca']
        X_pca = pca.transform(X_scaled)
        
        # Prédiction du cluster
        kmeans = segmentation_model_data['kmeans']
        cluster = int(kmeans.predict(X_pca)[0])
        
        # Descriptions des clusters
        cluster_descriptions = {
            0: "Employés juniors en développement",
            1: "Employés expérimentés et satisfaits",
            2: "Employés à risque de départ",
            3: "Cadres seniors et stables"
        }
        
        return {
            "cluster": cluster,
            "description": cluster_descriptions.get(cluster, "Cluster inconnu"),
            "message": f"L'employé appartient au cluster {cluster}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de segmentation : {str(e)}")

@app.post("/api/predict/recommendation")
def predict_recommendation(data: RecommendationInput):
    """
    Recommander un employé basé sur son profil
    Retourne un score de recommandation
    """
    try:
        # Convertir en array
        input_dict = data.model_dump()
        feature_names = recommendation_model_data['feature_names']
        X = np.array([[input_dict[feat] for feat in feature_names]])
        
        # Normalisation
        scaler = recommendation_model_data['scaler']
        X_scaled = scaler.transform(X)
        
        # Prédiction
        model = recommendation_model_data['model']
        predicted_income = float(model.predict(X_scaled)[0])
        
        # Score de recommandation (normalisé 0-100)
        score = min(100, max(0, (predicted_income - 1000) / 190))
        
        # Niveau de recommandation
        if score >= 80:
            level = "Excellent"
        elif score >= 60:
            level = "Bon"
        elif score >= 40:
            level = "Moyen"
        else:
            level = "Faible"
        
        return {
            "score": float(score),
            "level": level,
            "predicted_income": float(predicted_income),
            "message": f"Score de recommandation : {level} ({score:.1f}/100)"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur de recommandation : {str(e)}")

@app.get("/api/metadata")
def get_metadata():
    """Retourner les métadonnées des modèles"""
    return metadata

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
