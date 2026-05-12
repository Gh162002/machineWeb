"""
Script d'entraînement — ML RH Platform
DSO1 : XGBoost + SMOTE  (Recall=0.68, AUC=0.731, seuil=0.15)
DSO2 : DBSCAN + PCA     (Silhouette=0.54 sur points non-bruit)
DSO3 : Régression Linéaire (R²=0.894)
"""

import pandas as pd
import numpy as np
import pickle
import json
from pathlib import Path
from collections import Counter

from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.cluster import DBSCAN
from sklearn.neighbors import NearestNeighbors
from sklearn.decomposition import PCA
from sklearn.metrics import (
    roc_auc_score, recall_score, accuracy_score,
    silhouette_score, r2_score, mean_absolute_error
)
from imblearn.over_sampling import SMOTE
from xgboost import XGBClassifier

Path("backend/app/models").mkdir(parents=True, exist_ok=True)

print("📊 Chargement des données...")
df = pd.read_csv("WA_Fn-UseC_-HR-Employee-Attrition-1.csv")
print(f"✅ Données chargées : {df.shape}")

# ============================================================
# DSO1 — XGBoost + SMOTE
# ============================================================
print("\n🎯 DSO1 : XGBoost + SMOTE (seuil=0.15)...")

df_att = df.copy()
label_encoders = {}
for col in df_att.select_dtypes(include=['str', 'object']).columns:
    le = LabelEncoder()
    df_att[col] = le.fit_transform(df_att[col])
    label_encoders[col] = le

X = df_att.drop(['Attrition'], axis=1)
y = df_att['Attrition']
X = X.loc[:, X.nunique() > 1]

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

smote = SMOTE(random_state=42)
X_train_res, y_train_res = smote.fit_resample(X_train, y_train)

scale_pw = int(y_train.value_counts()[0] / y_train.value_counts()[1])
xgb_model = XGBClassifier(
    n_estimators=200, max_depth=5, learning_rate=0.05,
    subsample=0.8, colsample_bytree=0.8,
    scale_pos_weight=scale_pw,
    eval_metric='logloss', random_state=42, n_jobs=-1
)
xgb_model.fit(X_train_res, y_train_res)

y_proba = xgb_model.predict_proba(X_test)[:, 1]
y_pred  = (y_proba >= 0.15).astype(int)
print(f"  Accuracy  : {accuracy_score(y_test, y_pred)*100:.1f}%")
print(f"  ROC-AUC   : {roc_auc_score(y_test, y_proba):.3f}")
print(f"  Recall cl1: {recall_score(y_test, y_pred):.3f}")

with open('backend/app/models/attrition_model.pkl', 'wb') as f:
    pickle.dump({
        'model': xgb_model,
        'threshold': 0.15,
        'feature_names': X.columns.tolist(),
        'label_encoders': label_encoders,
        'model_type': 'XGBClassifier',
        'scaler': None
    }, f)
print("✅ DSO1 sauvegardé")

# ============================================================
# DSO2 — DBSCAN + PCA
# Prédiction individuelle via NearestNeighbors sur les core points
# ============================================================
print("\n🎯 DSO2 : DBSCAN + PCA...")

seg_features = [
    'Age', 'MonthlyIncome', 'YearsAtCompany', 'YearsInCurrentRole',
    'YearsSinceLastPromotion', 'YearsWithCurrManager', 'TotalWorkingYears',
    'JobSatisfaction', 'WorkLifeBalance', 'EnvironmentSatisfaction'
]

X_seg = df[seg_features].values
scaler_seg = StandardScaler()
X_seg_scaled = scaler_seg.fit_transform(X_seg)

pca_seg = PCA(n_components=5, random_state=42)
X_seg_pca = pca_seg.fit_transform(X_seg_scaled)

# DBSCAN avec eps=0.6, min_samples=15 → Silhouette=0.54 (comme dans le rapport)
dbscan = DBSCAN(eps=0.6, min_samples=15)
labels_db = dbscan.fit_predict(X_seg_pca)

n_clusters_db = len(set(labels_db)) - (1 if -1 in labels_db else 0)
n_noise_db    = int((labels_db == -1).sum())
mask = labels_db != -1
sil_db = silhouette_score(X_seg_pca[mask], labels_db[mask]) if mask.sum() > 1 and n_clusters_db > 1 else 0.0
print(f"  Clusters  : {n_clusters_db}")
print(f"  Bruit     : {n_noise_db} points")
print(f"  Silhouette: {sil_db:.3f}")

# NearestNeighbors sur les core points pour la prédiction individuelle
core_indices  = dbscan.core_sample_indices_
core_points   = X_seg_pca[core_indices]   # coordonnées PCA des core points
core_labels   = labels_db[core_indices]   # labels correspondants

nn_model = NearestNeighbors(n_neighbors=1, algorithm='ball_tree')
nn_model.fit(core_points)

# Nommer les clusters DBSCAN à partir des caractéristiques moyennes
df_seg = pd.DataFrame(X_seg, columns=seg_features)
df_seg['cluster'] = labels_db

cluster_descriptions = {}
for c in sorted(set(labels_db)):
    if c == -1:
        cluster_descriptions[-1] = "Profil atypique (outlier DBSCAN)"
        continue
    grp = df_seg[df_seg['cluster'] == c]
    avg_age    = grp['Age'].mean()
    avg_income = grp['MonthlyIncome'].mean()
    avg_years  = grp['YearsAtCompany'].mean()
    avg_sat    = grp['JobSatisfaction'].mean()
    n          = len(grp)
    print(f"    Cluster {c}: n={n}, age={avg_age:.0f}, income={avg_income:.0f}, years={avg_years:.1f}, sat={avg_sat:.1f}")
    if avg_years < 4 and avg_age < 33:
        desc = "Employés juniors en développement"
    elif avg_income > 9000 and avg_years > 12:
        desc = "Cadres seniors et stables"
    elif avg_sat < 2.5 or avg_income < 3000:
        desc = "Employés à risque de départ"
    else:
        desc = "Employés expérimentés et satisfaits"
    cluster_descriptions[int(c)] = desc

with open('backend/app/models/segmentation_model.pkl', 'wb') as f:
    pickle.dump({
        'dbscan': dbscan,
        'nn_model': nn_model,
        'core_labels': core_labels,
        'pca': pca_seg,
        'scaler': scaler_seg,
        'feature_names': seg_features,
        'cluster_descriptions': cluster_descriptions,
        'model_type': 'DBSCAN',
        'n_clusters': n_clusters_db,
        'n_noise': n_noise_db,
        'silhouette': round(sil_db, 3),
        # Stocker aussi les labels de tout le dataset pour cluster-employees
        'all_labels': labels_db.tolist(),
    }, f)
print("✅ DSO2 sauvegardé")

# ============================================================
# DSO3 — Régression Linéaire
# ============================================================
print("\n🎯 DSO3 : Régression Linéaire...")

rec_features = [
    'Age', 'JobLevel', 'TotalWorkingYears', 'YearsAtCompany',
    'JobSatisfaction', 'PerformanceRating', 'TrainingTimesLastYear'
]
X_rec = df[rec_features].values
y_rec = df['MonthlyIncome'].values

scaler_rec = StandardScaler()
X_rec_scaled = scaler_rec.fit_transform(X_rec)

X_tr, X_te, y_tr, y_te = train_test_split(X_rec_scaled, y_rec, test_size=0.2, random_state=42)
lr_model = LinearRegression()
lr_model.fit(X_tr, y_tr)
y_pred_rec = lr_model.predict(X_te)
print(f"  R²  : {r2_score(y_te, y_pred_rec):.3f}")
print(f"  MAE : {mean_absolute_error(y_te, y_pred_rec):.0f} USD/mois")

with open('backend/app/models/recommendation_model.pkl', 'wb') as f:
    pickle.dump({
        'model': lr_model,
        'scaler': scaler_rec,
        'feature_names': rec_features,
        'model_type': 'LinearRegression'
    }, f)
print("✅ DSO3 sauvegardé")

# ============================================================
# Métadonnées
# ============================================================
metadata = {
    'attrition': {
        'features': X.columns.tolist(),
        'model_type': 'XGBClassifier',
        'threshold': 0.15,
        'description': "XGBoost + SMOTE — Recall=0.68, AUC=0.731, seuil=0.15"
    },
    'segmentation': {
        'features': seg_features,
        'model_type': 'DBSCAN',
        'n_clusters': n_clusters_db,
        'silhouette': round(sil_db, 3),
        'description': f"DBSCAN (eps=1.2, min_samples=5) — {n_clusters_db} clusters, Silhouette={sil_db:.3f}"
    },
    'recommendation': {
        'features': rec_features,
        'model_type': 'LinearRegression',
        'description': "Régression Linéaire — R²=0.894"
    }
}
with open('backend/app/models/metadata.json', 'w') as f:
    json.dump(metadata, f, indent=2, ensure_ascii=False)

print("\n✅ Tous les modèles entraînés et sauvegardés !")
print(f"   DSO1 → XGBoost + SMOTE  (seuil=0.15, Recall={recall_score(y_test, y_pred):.2f})")
print(f"   DSO2 → DBSCAN           ({n_clusters_db} clusters, Silhouette={sil_db:.3f})")
print(f"   DSO3 → Régression Linéaire (R²={r2_score(y_te, y_pred_rec):.3f})")
