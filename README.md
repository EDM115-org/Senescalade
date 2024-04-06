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

## Code

### Structure

### Fonctionnalités

- [ ] Inscription
- [ ] Connexion
- [ ] Interface d'administration
- [ ] Envoi de mail

## Development

Sources to check :

- https://nuxt.com/modules/pinia
- https://nuxt.com/modules/i18n
- https://nuxt.com/modules/eslint
- https://nuxt.com/modules/vueuse
- https://nuxt.com/modules/auto-animate
- https://nuxt.com/modules/image
- https://nuxt.com/modules/test-utils
- https://nuxt.com/modules/icon
- https://nuxt.com/modules/device
- https://nuxt.com/modules/google-fonts
- https://nuxt.com/modules/lodash
- https://nuxt.com/modules/link-checker
- https://nuxt.com/modules/aos
- https://nuxt.com/modules/nuxt-mail
- https://pwa.nuxtjs.org/setup

- [ ] Test the dockerfile
