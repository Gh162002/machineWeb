"""
Script pour entraîner et sauvegarder les 3 meilleurs modèles ML
Basé sur le notebook ML_fin_DSO_v3.ipynb
"""

import pandas as pd
import numpy as np
import pickle
import json
from pathlib import Path

# Modèles
from sklearn.ensemble import RandomForestClassifier
from sklearn.cluster import KMeans
from sklearn.linear_model import LinearRegression
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from imblearn.over_sampling import SMOTE

# Créer le dossier pour les modèles
Path("backend/app/models").mkdir(parents=True, exist_ok=True)

# Charger les données
print("📊 Chargement des données...")
df = pd.read_csv("WA_Fn-UseC_-HR-Employee-Attrition-1.csv")
print(f"✅ Données chargées : {df.shape}")

# ============================================
# DSO1 : PRÉDICTION D'ATTRITION (Random Forest + SMOTE)
# ============================================
print("\n🎯 DSO1 : Entraînement du modèle d'attrition...")

# Préparation des données
df_attrition = df.copy()

# Encoder les variables catégorielles
label_encoders = {}
categorical_cols = df_attrition.select_dtypes(include=['object']).columns

for col in categorical_cols:
    le = LabelEncoder()
    df_attrition[col] = le.fit_transform(df_attrition[col])
    label_encoders[col] = le

# Séparer features et target
X = df_attrition.drop(['Attrition'], axis=1)
y = df_attrition['Attrition']

# Supprimer les colonnes constantes
X = X.loc[:, X.nunique() > 1]

# Split train/test
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Appliquer SMOTE pour équilibrer les classes
smote = SMOTE(random_state=42)
X_train_smote, y_train_smote = smote.fit_resample(X_train, y_train)

# Entraîner Random Forest optimisé
rf_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=15,
    min_samples_split=10,
    min_samples_leaf=4,
    class_weight='balanced',
    random_state=42,
    n_jobs=-1
)

rf_model.fit(X_train_smote, y_train_smote)

# Sauvegarder le modèle et les métadonnées
model_data = {
    'model': rf_model,
    'feature_names': X.columns.tolist(),
    'label_encoders': label_encoders,
    'scaler': None
}

with open('backend/app/models/attrition_model.pkl', 'wb') as f:
    pickle.dump(model_data, f)

print("✅ Modèle d'attrition sauvegardé")

# ============================================
# DSO2 : SEGMENTATION (K-Means + PCA)
# ============================================
print("\n🎯 DSO2 : Entraînement du modèle de segmentation...")

# Sélectionner les features numériques pour la segmentation
numeric_features = [
    'Age', 'MonthlyIncome', 'YearsAtCompany', 'YearsInCurrentRole',
    'YearsSinceLastPromotion', 'YearsWithCurrManager', 'TotalWorkingYears',
    'JobSatisfaction', 'WorkLifeBalance', 'EnvironmentSatisfaction'
]

X_seg = df[numeric_features].copy()

# Normalisation
scaler_seg = StandardScaler()
X_seg_scaled = scaler_seg.fit_transform(X_seg)

# PCA pour réduction de dimension
pca = PCA(n_components=5)
X_pca = pca.fit_transform(X_seg_scaled)

# K-Means avec 4 clusters
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
clusters = kmeans.fit_predict(X_pca)

# Sauvegarder le modèle
segmentation_data = {
    'kmeans': kmeans,
    'pca': pca,
    'scaler': scaler_seg,
    'feature_names': numeric_features
}

with open('backend/app/models/segmentation_model.pkl', 'wb') as f:
    pickle.dump(segmentation_data, f)

print("✅ Modèle de segmentation sauvegardé")

# ============================================
# DSO3 : RECOMMANDATION (Régression Linéaire)
# ============================================
print("\n🎯 DSO3 : Entraînement du modèle de recommandation...")

# Features pour la recommandation
recommendation_features = [
    'Age', 'JobLevel', 'TotalWorkingYears', 'YearsAtCompany',
    'JobSatisfaction', 'PerformanceRating', 'TrainingTimesLastYear'
]

X_rec = df[recommendation_features].copy()
y_rec = df['MonthlyIncome']  # Prédire le salaire comme proxy de performance

# Normalisation
scaler_rec = StandardScaler()
X_rec_scaled = scaler_rec.fit_transform(X_rec)

# Split
X_train_rec, X_test_rec, y_train_rec, y_test_rec = train_test_split(
    X_rec_scaled, y_rec, test_size=0.2, random_state=42
)

# Entraîner la régression linéaire
lr_model = LinearRegression()
lr_model.fit(X_train_rec, y_train_rec)

# Sauvegarder le modèle
recommendation_data = {
    'model': lr_model,
    'scaler': scaler_rec,
    'feature_names': recommendation_features
}

with open('backend/app/models/recommendation_model.pkl', 'wb') as f:
    pickle.dump(recommendation_data, f)

print("✅ Modèle de recommandation sauvegardé")

# ============================================
# Sauvegarder les métadonnées
# ============================================
metadata = {
    'attrition': {
        'features': X.columns.tolist(),
        'model_type': 'RandomForestClassifier',
        'description': 'Prédiction du risque d\'attrition des employés'
    },
    'segmentation': {
        'features': numeric_features,
        'n_clusters': 4,
        'model_type': 'KMeans',
        'description': 'Segmentation des employés en groupes homogènes'
    },
    'recommendation': {
        'features': recommendation_features,
        'model_type': 'LinearRegression',
        'description': 'Recommandation basée sur la prédiction de performance'
    }
}

with open('backend/app/models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2)

print("\n✅ Tous les modèles ont été entraînés et sauvegardés avec succès!")
print("📁 Modèles disponibles dans : backend/app/models/")
