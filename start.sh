#!/bin/sh
. /app/.env
echo "Senescalade - Démarrage du serveur..."
/app/wait-for-it.sh db:3306 --timeout=0 --strict -- node /app/.output/server/index.mjs
