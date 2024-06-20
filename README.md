<center>

# Tab-Magiques

### Application web d'inscription pour l'association Senescalade

Nombre de problèmes (analyse automatique du dernier commit) [![DeepSource](https://app.deepsource.com/gh/EDM115-org/Tab-Magiques.svg/?label=active+issues&show_trend=true&token=WF6hxNEht95_hyiFpZdVK2h6)](https://app.deepsource.com/gh/EDM115-org/Tab-Magiques/)

</center>

## Utilisation

Prérequis :

- Node.js 20
- MySQL 8.0 (8.0.37)
- Docker
- Docker Compose
- Un fichier `.env` à la racine du projet, avec la structure suivante :

```env
DB_HOST=localhost
DB_USER=sae
DB_PASSWORD="UserPassword"
DB_NAME=sae
DB_PORT=3306
DEV_PORT=8000
GMAIL_USER="adresse-email@gmail.com"
GMAIL_PASS="abcd efgh ijkl mnop"
MYSQL_ROOT_PASSWORD="SomethingStrong"
PORT=56860
```

- Un fichier `.prod.env` à la racine du projet, avec la structure suivante :

```env
DB_HOST=db
DB_USER=sae
DB_PASSWORD="UserPassword"
DB_NAME=sae
DB_PORT=3306
DEV_PORT=56860
GMAIL_USER="adresse-email@gmail.com"
GMAIL_PASS="abcd efgh ijkl mnop"
MYSQL_ROOT_PASSWORD="SomethingStrong"
PORT=56860
```

`GMAIL_PASS` : Mot de passe d'application spécifique, voir https://nodemailer.com/usage/using-gmail/ et https://support.google.com/accounts/answer/185833

### Production (Docker)

```bash
git clone https://github.com/EDM115-org/Tab-Magiques.git && cd Tab-Magiques
npm run i
npm run docker-start
```

Accessible à http://localhost/ (port 80 on prod, port 56860 on dev)

> [!CAUTION]
> MySQL est lent à démarrer. Normalement la webapp est sensée attendre que le service MySQL démarre, mais si ce n'est pas le cas, utilisez les commandes suivantes :

```bash
docker compose logs  # vérifiez la mention "[Note] [Entrypoint]: MySQL init process done. Ready for start up."
npm run docker-restart
```

Pour arrêter :

```bash
npm run docker-stop
```

### Développement

```bash
git clone https://github.com/EDM115-org/Tab-Magiques.git && cd Tab-Magiques
```

#### Windows

Ouvrir le MySQL Shell

```sql
\sql
\connect root@localhost
\source "C:\Path\To\Tab-Magiques\db\create_user.sql"
\source "C:\Path\To\Tab-Magiques\db\create_db.sql"
\source "C:\Path\To\Tab-Magiques\db\instantiate_db.sql"
\source "C:\Path\To\Tab-Magiques\db\insert_test.sql"
```

#### Linux

```bash
mysql -u root -p < /path/to/Tab-Magiques/db/create_user.sql
mysql -u root -p < /path/to/Tab-Magiques/db/create_db.sql
mysql -u root -p < /path/to/Tab-Magiques/db/instantiate_db.sql
mysql -u root -p < /path/to/Tab-Magiques/db/insert_test.sql
```

Puis dans un terminal

```bash
npm run i
npm run dev
```

Accessible à http://localhost:8000/

### Build du Dockerfile

Build :

```bash
docker build -t senescalade .
docker run -d --env-file ./.env -p 80:56860 --name senescalade senescalade
```

Run :

```bash
docker start senescalade
```

Publish :

```bash
docker tag senescalade edm115/senescalade:latest
docker push edm115/senescalade:latest
```

## Code

> Explication...

## Tier list des choses à faire

| Priorité | Tâche | État |
| :---: | :---: | :---: |
| **S** | vuelidate dans l'inscription et tous les formulaires + désactiver les boutons | ❌ |
| **S** | export des grimpeurs d'un créneau en pdf **(à améliorer)** | ✅ |
| A | réinscriptions | ❌ |
| A | instructions claires dans le readme | ❌ |
| B | compléter le dashboard | ✅ |
| B | nettoyer le code (props non utilisées, meilleurs tableaux avec indicateurs visuels, ...) | ❌ |
| C | clean les couleurs et images | ❌ |
