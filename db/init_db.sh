#!/bin/bash
set -e

echo "Starting init-db.sh script..."

while ! mysqladmin ping -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" --silent; do
  echo "Waiting for MySQL server to be available at ${DB_HOST}:${DB_PORT}..."
  sleep 5
done

echo "MySQL server is available. Proceeding with script execution..."

for f in /docker-entrypoint-initdb.d/*.sql; do
  echo "Running $f"
  mysql -h"${DB_HOST}" -P"${DB_PORT}" -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" < "$f"
done

echo "All SQL scripts executed. Starting MySQL server..."

exec docker-entrypoint.sh mysqld
