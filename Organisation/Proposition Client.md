
# Présentation du projet

### Contexte

Le club d’escalade Senescalade, enrichi par une communauté grandissante de plus de 300 membres, est confronté à un défi logistique significatif dans la gestion des inscriptions et des adhésions. La gestion manuelle actuelle des inscriptions, notamment via la plateforme HelloAsso, se révèle laborieuse et requiert une validation manuelle.

### Problématique

Les solutions existantes, explorées par le club, se sont révélées soit financièrement inaccessibles soit techniquement inadaptées aux besoins spécifiques du club. Aucune solution open-source adéquate n'a été identifiée à ce jour. Ainsi, le besoin d'un outil sur mesure, efficient, et en ligne pour une gestion simplifiée et transparente des inscriptions est clairement identifié.

### Objectif du projet

Mettre en place une application web sur mesure pour automatiser et optimiser le processus d’inscription et de gestion des membres du club.

### Fonctionnalités clés

1. Gestion des Places et Créneaux
  - Affichage en temps réel des places disponibles par créneau de séance et par tranche d’âge.
  - Clôture automatique des inscriptions une fois les places pour un créneau donné épuisées.
2. Gestion des Informations des Adhérents
  - Collecte et gestion des informations personnelles pour la création de licences.
  - Collecte et gestion des coordonnées des contacts associés à chaque adhérent.
3. Gestion de la Base des Membres Inscrits
  - Stockage, consultation et gestion des données des membres inscrits
4. Intégration de Service de Paiement
  - Intégration avec un service externe, ici HelloAsso, pour faciliter les paiements en ligne.

### Contraintes et spécificités

- Gestion de Groupes par Tranches d'Âge
  - Groupes jeunes (-7 ans, U10 → U18) limités à 12 personnes.
  - Groupes adultes (30 personnes max) dont un sous-groupe de 12 débutants max.
- Encadrement
  - 1 encadrant peut superviser jusqu’à 12 débutants.
- Priorités d’Inscription
  - Les membres existants bénéficient d’une période d’inscription prioritaire en juillet, avant l'ouverture générale en août.
- Paiement
  - Les paiements doivent être effectués avant la première séance afin de garantir l’obtention de la licence.
  - Les modalités de paiement seront maintenues via HelloAsso.
- Créneaux Variables
  - Les créneaux de séances sont susceptibles de varier chaque année.
  - Chaque adhérent est limité à un créneau par semaine.

### Présentation de l'équipe

### Proposition de l’équipe Tab Magiques

**Stack technique :**
- Langages de programmation : Python, SQL, HTML, CSS (JS ?)
- Jira (organisation, méthode agile, sprints, backlogs, …)
- GitHub (hébergement de code + suivi de versions)
- Dépendances (probables) : Django, SQLite, Vue.JS/React, Docker ?

**Pourquoi Python ?**  
Pour sa simplicité et sa modularité.

**Pourquoi GitHub et pas GitLab ?**  
Pour pouvoir l’intégrer dans Jira, et utiliser le CI/CD sans avoir à entrer ses coordonnées bancaires.

**Fonctionnalités proposées :**  
L’application Python sera composée de 3 portails :

_Portail Public :_
- Saisie des informations sur le grimpeur
- Traitement des informations (contraintes, créneaux, …)
- Affichage des créneaux disponibles
- Choix d’un créneau
- Affichage du tarif et de la disponibilité
- Si il y a une place : Redirection vers HelloAsso
- Sinon : Placement en liste d’attente
- Transmission des identifiants utilisateur par mail
Gestion en temps réel des files d’attente, possibilité d’annuler l’inscription, 1 file par créneau, gestion de l’envoi des mails

_Portail Utilisateur :_
- Suivi de l’inscription/file d’attente (position)
- Possibilité de modifier ses informations
- On peut se désinscrire

_Portail Administrateur :_
- Intégration Excel ?
- Intégration API FFME ?
- Désinscription des utilisateurs à suppression de la BDD + remboursement
- Possible sauvegarde de la liste des non-inscrits de l’année passée
- Export des adhérents en CSV
- Transfert de statut Admin
- Gestion de plusieurs rôles/comptes admins
- Gestion des adhérent
- Accès à une liste des adhérents par créneau (pour impression
- Changement de créneau
- Gestion manuelle de la liste d’attente possible

### Planning prévisionnel

Date | Objectif
:---: | :---:
06/10/2023 | Proposition Client
27/10/2023 | Veille Technologique
20/11/2023 | Sprint 1
22/12/2023 | Sprint 2 + Recette Client (préversion)
22/04/2024 | Sprint 3
20/05/2024 | Sprint 4
21/06/2024 | Sprint 5 + Recette Client (version finale)

