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
DB_PASSWORD=UserPassword
DB_NAME=sae
DB_PORT=3306
DEV_PORT=8000
MYSQL_ROOT_PASSWORD=SomethingStrong
PORT=56860
```

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

### Fonctionnalités

- [ ] Inscription
- [X] Connexion
- [ ] Interface d'administration
- [ ] Envoi de mail

## Dévelopment

### À faire

**Utilisateur**

- [ ] Inscription : date de naissance, planning, formulaire + champs obligatoires & warnings et désactiver le bouton tant que les champs ne sont pas remplis
- [X] babygrimpe => - de 8 ans
- [X] Date de naissance -> possibilité de l'écrire manuellement
- [ ] Liste d'attente par créneau -> on peut sélectionner un créneau pour lequel on veut être en liste d'attente
- [ ] !!!! modification de grimpeur : si file d'attente, on a juste a confirmer et update GrimpeurSeance.isFileDAttente = 0
- [ ] Paiement : sauf file d'attente, quand on revient d'ue file d'aattente tout doit être pré complété et renvoyer à la section paiement
- [X] Visualisation de son numéro de licence
- [ ] Modifications d'informations
- [ ] Affichage du créneau par user
- [ ] Suppression de compte -> pas de suppression user quand on a payé + contacter tresorier@senescalade.bzh

**Admin**

- [ ] Dashboard (nombre de grimpeur, nombre non payé, nombre en liste d'attente)
- [X] Visibilité des inscriptions (qui a payé ou non, ...)
- [ ] Modification des informations des utilisateurs (ajout de license, un lock ?)
- [ ] Ajout d'admins avec droits restreints
- [ ] Modification de la BDD (les boutons sont tous fonctionnel)
- [ ] Export d'un user en CSV => nouveaux grimpeurs depuis le dernier export
- [ ] PDF de la liste des inscrits par créneau
- [ ] Gérer les résinscriptions

**Global**

- [X] Affichage des erreurs de l'API (v-alert)
- [ ] Indicateurs visuels de connexion/chargement (v-skeleton-loader)
- [ ] Envoi de mails
- [X] Mieux gérer le store + cookies/local storage ?
- [X] Routes -> Chargment direct du store à partir du stockage -> éviter d'avoir un user null
- [ ] Simplifier les routes de l'API, `throw createError()` pour les erreurs à la place de return, et sécuriser les calls

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

- [X] https://github.com/maildev/maildev ?
- [X] Mail mdp oublié
- [ ] Mail liste d'attente
- [ ] Mail modification mdp administration

### Infos supplémentaires :

> une licence est valable 1 an : du 1er Septembre au 31 août de l'année suivante ; la saison actuelle est du 1er septembre 2023 au 31 août 2024

> Export CSV : Une ligne par adhérent, 100 lignes maximum par import.

> Type License => FAMILLE = 3e licence ou plus du foyer ...
> c'est là que la logique devient complexe, on peut laisser ça à la main pour l'instant.
> La règle est même nom de famille et/ou même adresse de résidence. À partir de la 3e licence, le tarif famille peut s'appliquer.
> coût Famille < coût Jeune < coût Adulte
> donc pour optimiser, les 2 premières licences JEUNE doivent être crées en premier puis passer les licences ADULTES en FAMILLE si possible, puis les licences JEUNE restantes en FAMILLE. vous pouvez oublier la subtilité de la licence FAMILLE dans un premier temps.
>
> Pour la saison 2023-2024, JEUNE = age < 18 ans au 31 août 2024  <=> date de naissance >= 01/09/2006
> ADULTE = age >= 18 ans au 31 août 2024  <=> date de naissance < 01/09/2006
