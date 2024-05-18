#!/bin/bash
source /app/.env
echo "Senescalade - Starting server..."
cd /app/senescalade || exit
if [ "$DB_CREATED" != "true" ]; then
  mysql -u root -e "CREATE USER '$DB_USER'@'$DB_HOST' IDENTIFIED BY '$DB_PASS';"
  mysql -u root -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;"
  mysql -u root -e "GRANT ALL PRIVILEGES ON $DB_NAME.* TO '$DB_USER'@'$DB_HOST';"
  mysql -h "$DB_HOST" -u "$DB_USER" -p"$DB_PASSWORD" "$DB_NAME" </app/db/instantiate_db.sql
  sed -i "s/DB_CREATED=false/DB_CREATED=true/g" /app/.env
  source /app/.env
fi
python manage.py runserver
