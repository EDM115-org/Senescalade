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

### Structure

### Fonctionnalités

- [ ] Inscription
- [ ] Connexion
- [ ] Interface d'administration
- [ ] Envoi de mail

## Development

Sources to check :

- https://nuxt.com/modules/auto-animate
- https://nuxt.com/modules/test-utils
- https://nuxt.com/modules/nuxt-mail
- https://vite-pwa-org.netlify.app/frameworks/nuxt.html + https://vite-pwa-org.netlify.app/assets-generator/
- Store : https://github.com/data-fair/processings/blob/e6cc8abc336853363e950e3e73c13939d7570eb2/ui/store/pinia.js
- BDD : https://github.com/sidorares/node-mysql2 (base : https://github.com/mysqljs/mysql, image : https://hub.docker.com/_/mysql)

- [ ] Test the dockerfile and docker-compose
