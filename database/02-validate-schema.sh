#!/usr/bin/env bash
# Validates that the application schema was loaded at first container init.
# Runs only on empty data volume (docker-entrypoint-initdb.d).
set -euo pipefail

REQUIRED_TABLES=(
  utilisateur
  menu
  plat
  commande
  avis
  allergene
  horaire
  role
)

echo "Validating MariaDB schema for database '${MYSQL_DATABASE}'…"

missing=0
for table in "${REQUIRED_TABLES[@]}"; do
  count="$(mariadb --protocol=socket -uroot -p"${MYSQL_ROOT_PASSWORD}" -N -e \
    "SELECT COUNT(*) FROM information_schema.tables
     WHERE table_schema = '${MYSQL_DATABASE}' AND table_name = '${table}';")"
  if [[ "${count}" != "1" ]]; then
    echo "ERROR: required table '${table}' is missing in '${MYSQL_DATABASE}'."
    missing=1
  fi
done

if [[ "${missing}" -ne 0 ]]; then
  echo "Schema validation failed."
  exit 1
fi

echo "Schema validation OK (${#REQUIRED_TABLES[@]} required tables present)."
