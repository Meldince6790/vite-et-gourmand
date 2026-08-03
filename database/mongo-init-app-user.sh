#!/usr/bin/env bash
# Creates the application MongoDB user (readWrite on vite_gourmand).
# Runs only on empty data volume (docker-entrypoint-initdb.d).
set -euo pipefail

: "${MONGO_INITDB_ROOT_USERNAME:?MONGO_INITDB_ROOT_USERNAME is required}"
: "${MONGO_INITDB_ROOT_PASSWORD:?MONGO_INITDB_ROOT_PASSWORD is required}"
: "${MONGO_APP_USERNAME:?MONGO_APP_USERNAME is required}"
: "${MONGO_APP_PASSWORD:?MONGO_APP_PASSWORD is required}"
: "${MONGO_INITDB_DATABASE:?MONGO_INITDB_DATABASE is required}"

echo "Creating MongoDB application user '${MONGO_APP_USERNAME}' on '${MONGO_INITDB_DATABASE}'…"

mongosh --quiet \
  -u "${MONGO_INITDB_ROOT_USERNAME}" \
  -p "${MONGO_INITDB_ROOT_PASSWORD}" \
  --authenticationDatabase admin <<EOF
const dbName = "${MONGO_INITDB_DATABASE}";
const username = "${MONGO_APP_USERNAME}";
const password = "${MONGO_APP_PASSWORD}";
const appDb = db.getSiblingDB(dbName);
appDb.createUser({
  user: username,
  pwd: password,
  roles: [ { role: "readWrite", db: dbName } ]
});
print("MongoDB application user created.");
EOF
