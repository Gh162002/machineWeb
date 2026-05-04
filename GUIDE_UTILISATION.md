# 📖 Guide d'Utilisation - Application ML RH

Guide complet pour utiliser l'application de Machine Learning RH.

---

## 🎯 Vue d'ensemble

L'application ML RH propose 3 fonctionnalités principales :

1. **📊 Prédiction d'Attrition** - Identifier les employés à risque de départ
2. **🎯 Segmentation** - Classer les employés en groupes homogènes
3. **⭐ Recommandation** - Évaluer le potentiel des employés

---

## 🚀 Démarrage Rapide

### Étape 1 : Entraîner les modèles

```bash
python train_models.py
```

Cette commande va :
- Charger les données RH (`WA_Fn-UseC_-HR-Employee-Attrition-1.csv`)
- Entraîner 3 modèles ML optimisés
- Sauvegarder les modèles dans `backend/app/models/`

**Durée estimée :** 2-3 minutes

### Étape 2 : Lancer l'application

**Option A : Avec Docker (Recommandé)**
```bash
docker-compose up --build
```

**Option B : Manuel**

Terminal 1 (Backend) :
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Terminal 2 (Frontend) :
```bash
cd frontend
npm install
npm start
```

### Étape 3 : Accéder à l'application

- **Frontend :** http://localhost:3000
- **Backend API :** http://localhost:8000
- **Documentation API :** http://localhost:8000/docs

---

## 📊 Module 1 : Prédiction d'Attrition

### Objectif
Prédire la probabilité qu'un employé quitte l'entreprise.

### Comment l'utiliser

1. Accéder à l'onglet **"Attrition"**
2. Remplir le formulaire avec les informations de l'employé
3. Cliquer sur **"Prédire le risque d'attrition"**

### Champs requis

**Informations personnelles :**
- Âge (18-65 ans)
- Genre (Male/Female)
- Statut marital (Single/Married/Divorced)
- Distance du domicile (km)

**Informations professionnelles :**
- Département (Sales, R&D, HR)
- Rôle (Sales Executive, Research Scientist, etc.)
- Niveau du poste (1-5)
- Années d'expérience totales
- Années dans l'entreprise

**Satisfaction et engagement :**
- Satisfaction au travail (1-4)
- Équilibre vie-travail (1-4)
- Satisfaction environnement (1-4)
- Implication au travail (1-4)

**Rémunération :**
- Revenu mensuel ($)
- Augmentation salariale (%)
- Options d'achat d'actions (0-3)

**Autres :**
- Heures supplémentaires (Yes/No)
- Voyages d'affaires (Non-Travel, Travel_Rarely, Travel_Frequently)
- Formations suivies (année dernière)

### Interprétation des résultats

**Probabilité d'attrition :**
- **0-40% (Faible)** : Employé stable, peu de risque de départ
- **40-70% (Moyen)** : Attention requise, surveiller l'engagement
- **70-100% (Élevé)** : Risque important, action immédiate recommandée

**Actions recommandées selon le risque :**

**Risque Faible :**
- Maintenir les conditions actuelles
- Continuer le développement professionnel
- Reconnaissance régulière

**Risque Moyen :**
- Entretien individuel avec le manager
- Évaluer les opportunités de développement
- Vérifier la charge de travail
- Améliorer l'équilibre vie-travail

**Risque Élevé :**
- Entretien urgent avec RH
- Plan de rétention personnalisé
- Révision salariale si justifiée
- Opportunités de promotion
- Amélioration des conditions de travail

### Exemple d'utilisation

**Cas 1 : Employé à risque élevé**
```
Âge: 28
Département: Sales
Heures supplémentaires: Yes
Satisfaction au travail: 1
Années dans l'entreprise: 1
Résultat: 85% de risque → Action immédiate
```

**Cas 2 : Employé stable**
```
Âge: 45
Département: R&D
Heures supplémentaires: No
Satisfaction au travail: 4
Années dans l'entreprise: 15
Résultat: 15% de risque → Situation stable
```

---

## 🎯 Module 2 : Segmentation

### Objectif
Classer les employés en 4 segments homogènes pour mieux comprendre votre organisation.

### Comment l'utiliser

1. Accéder à l'onglet **"Segmentation"**
2. Remplir le formulaire (10 champs seulement)
3. Cliquer sur **"Identifier le segment"**

### Champs requis

- Âge
- Revenu mensuel ($)
- Années dans l'entreprise
- Années dans le rôle actuel
- Années depuis la dernière promotion
- Années avec le manager actuel
- Années d'expérience totales
- Satisfaction au travail (1-4)
- Équilibre vie-travail (1-4)
- Satisfaction environnement (1-4)

### Les 4 segments

**Cluster 0 : 🌱 Employés juniors en développement**
- Jeunes employés avec peu d'expérience
- En phase d'apprentissage
- Potentiel de croissance élevé
- Nécessitent un accompagnement

**Actions recommandées :**
- Programme de mentorat
- Formations régulières
- Feedback fréquent
- Plan de carrière clair

---

**Cluster 1 : ⭐ Employés expérimentés et satisfaits**
- Expérience significative
- Haut niveau de satisfaction
- Stabilité dans l'entreprise
- Contributeurs clés

**Actions recommandées :**
- Reconnaissance et récompenses
- Opportunités de leadership
- Projets stratégiques
- Maintenir l'engagement

---

**Cluster 2 : ⚠️ Employés à risque de départ**
- Signes d'insatisfaction
- Faible engagement
- Risque d'attrition élevé
- Nécessitent une attention particulière

**Actions recommandées :**
- Entretien individuel urgent
- Plan de rétention
- Amélioration des conditions
- Révision salariale

---

**Cluster 3 : 👔 Cadres seniors et stables**
- Longue ancienneté
- Postes de direction
- Très stables
- Mentors potentiels

**Actions recommandées :**
- Rôles de mentorat
- Projets stratégiques
- Succession planning
- Reconnaissance de l'expertise

### Exemple d'utilisation

**Cas : Identifier le segment d'un employé**
```
Âge: 35
Revenu mensuel: 5000
Années dans l'entreprise: 5
Satisfaction au travail: 4
Résultat: Cluster 1 (Employés expérimentés et satisfaits)
```

---

## ⭐ Module 3 : Recommandation

### Objectif
Évaluer le potentiel d'un employé avec un score de 0 à 100.

### Comment l'utiliser

1. Accéder à l'onglet **"Recommandation"**
2. Remplir le formulaire (7 champs seulement)
3. Cliquer sur **"Calculer le score de recommandation"**

### Champs requis

- Âge
- Niveau du poste (1-5)
- Années d'expérience totales
- Années dans l'entreprise
- Satisfaction au travail (1-4)
- Évaluation de performance (1-4)
- Formations suivies (année dernière)

### Échelle de notation

**🌟 Excellent (80-100)**
- Employé hautement qualifié et performant
- Excellent candidat pour des promotions
- Potentiel de leadership élevé
- À retenir et développer prioritairement

**👍 Bon (60-79)**
- Employé compétent avec un bon potentiel
- Candidat solide pour des responsabilités accrues
- Bénéficierait de formations ciblées
- Bon investissement pour l'entreprise

**👌 Moyen (40-59)**
- Employé avec un potentiel à développer
- Nécessite un accompagnement et du coaching
- Opportunités d'amélioration identifiées
- Plan de développement recommandé

**⚠️ Faible (0-39)**
- Employé nécessitant une attention particulière
- Plan d'amélioration de performance requis
- Formation et mentorat essentiels
- Évaluation régulière recommandée

### Exemple d'utilisation

**Cas 1 : Employé à haut potentiel**
```
Âge: 32
Niveau du poste: 3
Années d'expérience: 10
Satisfaction: 4
Performance: 4
Formations: 5
Résultat: Score 85/100 (Excellent)
```

**Cas 2 : Employé à développer**
```
Âge: 25
Niveau du poste: 1
Années d'expérience: 2
Satisfaction: 2
Performance: 2
Formations: 1
Résultat: Score 35/100 (Faible)
```

---

## 🔧 API REST

### Endpoints disponibles

**Health Check**
```bash
GET /api/health
```

**Prédiction d'attrition**
```bash
POST /api/predict/attrition
Content-Type: application/json

{
  "Age": 35,
  "Department": "Sales",
  "JobSatisfaction": 4,
  ...
}
```

**Segmentation**
```bash
POST /api/predict/segmentation
Content-Type: application/json

{
  "Age": 35,
  "MonthlyIncome": 5000,
  "YearsAtCompany": 5,
  ...
}
```

**Recommandation**
```bash
POST /api/predict/recommendation
Content-Type: application/json

{
  "Age": 35,
  "JobLevel": 2,
  "TotalWorkingYears": 10,
  ...
}
```

**Métadonnées**
```bash
GET /api/metadata
```

### Documentation interactive

Accéder à http://localhost:8000/docs pour la documentation Swagger interactive.

---

## 💡 Conseils d'utilisation

### Pour les RH

1. **Prédiction d'attrition :**
   - Analyser régulièrement les employés clés
   - Créer des alertes pour les risques élevés
   - Suivre l'évolution du risque dans le temps

2. **Segmentation :**
   - Adapter les politiques RH par segment
   - Créer des programmes ciblés
   - Optimiser l'allocation des ressources

3. **Recommandation :**
   - Identifier les talents à promouvoir
   - Prioriser les formations
   - Planifier la succession

### Pour les Managers

1. Utiliser la prédiction d'attrition pour anticiper les départs
2. Adapter le management selon le segment
3. Utiliser le score de recommandation pour les promotions

### Pour les Analystes

1. Exporter les résultats via l'API
2. Créer des dashboards personnalisés
3. Analyser les tendances dans le temps

---

## 🆘 FAQ

**Q : Les modèles sont-ils précis ?**
R : Les modèles ont une précision d'environ 83% basée sur les données d'entraînement. Ils doivent être utilisés comme aide à la décision, pas comme décision finale.

**Q : Puis-je entraîner les modèles avec mes propres données ?**
R : Oui ! Remplacez le fichier CSV et relancez `train_models.py`.

**Q : Comment interpréter un score de 50/100 ?**
R : C'est un employé moyen avec du potentiel. Investir dans son développement peut améliorer significativement son score.

**Q : Que faire si un employé a un risque d'attrition élevé ?**
R : Entretien individuel urgent, évaluer les causes, proposer un plan de rétention personnalisé.

**Q : Les données sont-elles sécurisées ?**
R : Les prédictions sont faites en temps réel sans stockage. Pour la production, implémenter des mesures de sécurité supplémentaires.

---

## 📞 Support

Pour toute question ou problème :
- 📧 Email : support@ml-rh.com
- 📚 Documentation technique : README.md
- 🚀 Guide de déploiement : DEPLOYMENT.md

---

**Bonne utilisation ! 🎯**
