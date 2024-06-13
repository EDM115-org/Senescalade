<center>

# Tab-Magiques

### Application web d'inscription pour l'association Senescalade

Nombre de problèmes (analyse automatique du dernier commit) [![DeepSource](https://app.deepsource.com/gh/EDM115-org/Tab-Magiques.svg/?label=active+issues&show_trend=true&token=WF6hxNEht95_hyiFpZdVK2h6)](https://app.deepsource.com/gh/EDM115-org/Tab-Magiques/)

</center>

## Utilisation

Prérequis :

- Node.js 20
- MySQL 8.0.35
- Docker
- Docker Compose

### Production (Docker)

```bash
git clone https://github.com/EDM115-org/Tab-Magiques.git && cd Tab-Magiques
npm i
npm run prod-docker
```

### Développement (Windows)

Ouvrir le MySQL Shell

```sql
\sql
\connect root@localhost
CREATE USER 'sae'@'localhost' IDENTIFIED BY 'Senescalade!56';
CREATE DATABASE IF NOT EXISTS sae;
\source "C:\Path\To\Tab-Magiques\db\instantiate_db.sql"
```

Puis dans un powershell

```bash
git clone https://github.com/EDM115-org/Tab-Magiques.git && cd Tab-Magiques
npm i
npm run dev
```

### Build du Dockerfile

```bash
docker build -t tab-magiques .
docker run -d --env-file ./.env -p 56860:56860 --name tab-magiques tab-magiques
docker start tab-magiques
docker logs tab-magiques
docker stop tab-magiques
```

Publish :

```bash
docker tag tab-magiques edm115/tab-magiques:latest
docker push edm115/tab-magiques:latest
```

## Code

### Fonctionnalités

- [ ] Inscription
- [X] Connexion
- [ ] Interface d'administration
- [ ] Envoi de mail

## Dévelopment

### À faire

**Utilisateur**

- [ ] Inscription : date de naissance, planning, formulaire, redirection HelloAsso + champs obligatoires & warnings et désactiver le bouton tant que les champs ne sont pas remplis
- [x] babygrimpe => - de 8 ans
- [x] Date de naissance -> possibilité de l'écrire manuellement
- [ ] Liste d'attente par créneau -> on peut sélectionner un créneau pour lequel on veut être en liste d'attente
- [ ] Visualisation de son numéro de licence
- [ ] Modifications d'informations
- [ ] Affichage du créneau par user
- [ ] Suppression de compte -> pas de suppression user quand on a payé + contacter tresorier@senescalade.bzh

**Admin**

- [ ] Dashboard (nombre de grimpeur, nombre non payé, nombre en liste d'attente)
- [ ] Visibilité des inscriptions (qui a payé ou non, ...)
- [ ] Modification des informations des utilisateurs (ajout de license, un lock ?)
- [ ] Ajout d'admins avec droits restreints
- [ ] Modification de la BDD (GUI, insertion de requêtes custom ?)
- [ ] Export d'un user en CSV => nouveaux grimpeurs depuis le dernier export
- [ ] PDF de la liste des inscrits par créneau
- [ ] Gérer les résinscriptions

**Global**

- [X] Affichage des erreurs de l'API (v-alert)
- [ ] Indicateurs visuels de connexion/chargement (v-skeleton-loader)
- [ ] Envoi de mails
- [X] Mieux gérer le store + cookies/local storage ?
- [X] Routes -> Chargment direct du store à partir du stockage -> éviter d'avoir un user null

**Design**

- [ ] Clean les couleurs
- [ ] Ajout de transitions
- [ ] Images !!!
- [ ] Responsive

**Déploiement**

- [ ] Docker + Docker Compose
- [ ] Vérif de la BDD après un redéploiement
- [ ] Instructions claires
- [ ] Tests

**Module Mail (nodemailer)**
- [ ] https://github.com/maildev/maildev ?
- [ ] Mail mdp oublié
- [ ] Mail pour confirm son mail première connexion
- [ ] Mail liste d'attente
- [ ] Mail de confirmation d'inscription à un crénaux
- [ ] Mail modification mdp administration

### Sources supplémentaires :

- https://nuxt.com/modules/auto-animate
- https://nuxt.com/modules/test-utils
- https://nuxt.com/modules/nuxt-mail
- https://vite-pwa-org.netlify.app/frameworks/nuxt.html + https://vite-pwa-org.netlify.app/assets-generator/
- Store : https://github.com/data-fair/processings/blob/e6cc8abc336853363e950e3e73c13939d7570eb2/ui/store/pinia.js
- BDD : https://github.com/sidorares/node-mysql2 (base : https://github.com/mysqljs/mysql, image : https://hub.docker.com/_/mysql)
