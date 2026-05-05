"""
API FastAPI pour les modèles ML RH
"""

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Dict, Any, Optional
import pickle
import numpy as np
import pandas as pd
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
DATA_PATH = Path(__file__).parent.parent.parent / "WA_Fn-UseC_-HR-Employee-Attrition-1.csv"

# Données globales
df_global = None
attrition_model_data = None
segmentation_model_data = None
recommendation_model_data = None
metadata = {}

try:
    with open(MODELS_PATH / "attrition_model.pkl", "rb") as f:
        attrition_model_data = pickle.load(f)

    with open(MODELS_PATH / "segmentation_model.pkl", "rb") as f:
        segmentation_model_data = pickle.load(f)

    with open(MODELS_PATH / "recommendation_model.pkl", "rb") as f:
        recommendation_model_data = pickle.load(f)

    with open(MODELS_PATH / "metadata.json", "r") as f:
        metadata = json.load(f)

    # Charger le CSV pour les vues base de données
    if DATA_PATH.exists():
        df_global = pd.read_csv(DATA_PATH)
        print(f"✅ Dataset chargé : {len(df_global)} employés")
    else:
        print("⚠️ CSV non trouvé, les endpoints /database ne seront pas disponibles")

    print("✅ Tous les modèles chargés avec succès")
except Exception as e:
    print(f"⚠️ Erreur lors du chargement : {e}")

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


# ============================================
# ENDPOINTS BASE DE DONNÉES
# ============================================

def _check_dataset():
    if df_global is None:
        raise HTTPException(status_code=503, detail="Dataset non disponible sur ce serveur.")


@app.get("/api/database/employees")
def get_all_employees(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=5, le=100),
    department: Optional[str] = Query(None),
    attrition: Optional[str] = Query(None)
):
    """
    Visualiser la base de données des employés avec pagination et filtres.
    """
    _check_dataset()
    df = df_global.copy()

    if department:
        df = df[df["Department"] == department]
    if attrition:
        df = df[df["Attrition"] == attrition]

    total = len(df)
    start = (page - 1) * page_size
    end = start + page_size
    page_df = df.iloc[start:end]

    columns = ["EmployeeNumber", "Age", "Gender", "Department", "JobRole",
               "JobLevel", "MonthlyIncome", "YearsAtCompany", "Attrition",
               "JobSatisfaction", "WorkLifeBalance", "OverTime"]

    records = page_df[columns].fillna("").to_dict(orient="records")

    return {
        "total": total,
        "page": page,
        "page_size": page_size,
        "total_pages": (total + page_size - 1) // page_size,
        "employees": records
    }


@app.get("/api/database/top-attrition")
def get_top_attrition(top_n: int = Query(10, ge=1, le=50)):
    """
    DSO1 — Top N employés avec le risque d'attrition le plus élevé.
    Calcule la probabilité d'attrition sur tout le dataset et retourne les plus à risque.
    """
    _check_dataset()
    try:
        df = df_global.copy()
        df_enc = df.copy()

        label_encoders = attrition_model_data["label_encoders"]
        for col, encoder in label_encoders.items():
            if col in df_enc.columns and col != "Attrition":
                try:
                    df_enc[col] = encoder.transform(df_enc[col].astype(str))
                except Exception:
                    df_enc[col] = 0

        feature_names = attrition_model_data["feature_names"]
        # Garder uniquement les colonnes disponibles
        available = [f for f in feature_names if f in df_enc.columns]
        X = df_enc[available].fillna(0).values

        model = attrition_model_data["model"]
        probs = model.predict_proba(X)[:, 1]

        df["attrition_probability"] = probs
        df["risk_level"] = df["attrition_probability"].apply(
            lambda p: "Élevé" if p > 0.7 else "Moyen" if p > 0.4 else "Faible"
        )

        top_df = df.nlargest(top_n, "attrition_probability")

        columns = ["EmployeeNumber", "Age", "Gender", "Department", "JobRole",
                   "MonthlyIncome", "YearsAtCompany", "OverTime",
                   "JobSatisfaction", "WorkLifeBalance", "attrition_probability", "risk_level"]

        records = top_df[columns].fillna("").to_dict(orient="records")
        for r in records:
            r["attrition_probability"] = round(float(r["attrition_probability"]) * 100, 1)

        return {"top_n": top_n, "employees": records}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")


@app.get("/api/database/cluster-employees")
def get_cluster_employees(cluster: int = Query(..., ge=0, le=3)):
    """
    DSO2 — Liste des employés affectés à un cluster donné (0, 1, 2 ou 3).
    """
    _check_dataset()
    try:
        df = df_global.copy()
        feature_names = segmentation_model_data["feature_names"]
        X = df[feature_names].fillna(0).values

        scaler = segmentation_model_data["scaler"]
        pca    = segmentation_model_data["pca"]
        kmeans = segmentation_model_data["kmeans"]

        X_scaled = scaler.transform(X)
        X_pca    = pca.transform(X_scaled)
        clusters = kmeans.predict(X_pca)

        df["cluster"] = clusters
        cluster_df = df[df["cluster"] == cluster]

        cluster_labels = {
            0: "Employés juniors en développement",
            1: "Employés expérimentés et satisfaits",
            2: "Employés à risque de départ",
            3: "Cadres seniors et stables"
        }

        columns = ["EmployeeNumber", "Age", "Gender", "Department", "JobRole",
                   "MonthlyIncome", "YearsAtCompany", "JobSatisfaction",
                   "WorkLifeBalance", "EnvironmentSatisfaction", "Attrition"]

        records = cluster_df[columns].fillna("").to_dict(orient="records")

        return {
            "cluster": cluster,
            "label": cluster_labels.get(cluster, "Inconnu"),
            "total": len(records),
            "employees": records
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")


@app.get("/api/database/top-recommended")
def get_top_recommended(
    top_n: int = Query(5, ge=1, le=20),
    job_role: Optional[str] = Query(None, description="Filtrer par rôle/activité")
):
    """
    DSO3 — Top N employés les plus recommandés pour une activité donnée.
    Calcule le score de recommandation sur tout le dataset.
    """
    _check_dataset()
    try:
        df = df_global.copy()

        if job_role:
            df = df[df["JobRole"].str.lower() == job_role.lower()]
            if df.empty:
                raise HTTPException(status_code=404, detail=f"Aucun employé trouvé pour le rôle '{job_role}'")

        feature_names = recommendation_model_data["feature_names"]
        X = df[feature_names].fillna(0).values

        scaler = recommendation_model_data["scaler"]
        model  = recommendation_model_data["model"]

        X_scaled = scaler.transform(X)
        predicted_incomes = model.predict(X_scaled)

        scores = np.clip((predicted_incomes - 1000) / 190, 0, 100)

        df["recommendation_score"] = scores
        df["predicted_income"]     = predicted_incomes
        df["recommendation_level"] = df["recommendation_score"].apply(
            lambda s: "Excellent" if s >= 80 else "Bon" if s >= 60 else "Moyen" if s >= 40 else "Faible"
        )

        top_df = df.nlargest(top_n, "recommendation_score")

        columns = ["EmployeeNumber", "Age", "Gender", "Department", "JobRole",
                   "JobLevel", "TotalWorkingYears", "YearsAtCompany",
                   "JobSatisfaction", "PerformanceRating", "TrainingTimesLastYear",
                   "MonthlyIncome", "recommendation_score", "predicted_income", "recommendation_level"]

        records = top_df[columns].fillna("").to_dict(orient="records")
        for r in records:
            r["recommendation_score"] = round(float(r["recommendation_score"]), 1)
            r["predicted_income"]     = round(float(r["predicted_income"]), 0)

        job_roles = sorted(df_global["JobRole"].unique().tolist())

        return {
            "top_n": top_n,
            "job_role_filter": job_role,
            "available_roles": job_roles,
            "employees": records
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erreur : {str(e)}")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
