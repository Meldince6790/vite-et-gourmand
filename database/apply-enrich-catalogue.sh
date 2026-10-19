#!/usr/bin/env bash
# Applique enrich_catalogue_menus.sql sur la MariaDB Docker locale.
# Prérequis : docker compose up (au minimum service mysql healthy).
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT_DIR"

if [[ ! -f .env ]]; then
  echo "ERREUR: fichier .env racine introuvable. Arrêt."
  exit 1
fi

# shellcheck disable=SC1091
set -a
# Charge uniquement les clés nécessaires sans afficher les secrets
source .env
set +a

: "${DB_NAME:?DB_NAME manquant dans .env}"
: "${DB_USER:?DB_USER manquant dans .env}"
: "${DB_PASSWORD:?DB_PASSWORD manquant dans .env}"

MYSQL_STATUS="$(docker compose ps --status running --services 2>/dev/null | grep -c '^mysql$' || true)"
if [[ "$MYSQL_STATUS" != "1" ]]; then
  echo "ERREUR: le service Compose 'mysql' n'est pas démarré."
  echo "Lancez d'abord: docker compose up -d mysql"
  exit 1
fi

echo "Cible confirmée:"
echo "  projet Compose : $(basename "$ROOT_DIR")"
echo "  service        : mysql (réseau Docker interne)"
echo "  base           : ${DB_NAME}"
echo "  utilisateur    : ${DB_USER}"

CONFIRM="${ENRICH_CONFIRM:-}"
if [[ -z "$CONFIRM" ]]; then
  read -r -p "Confirmer l'enrichissement LOCAL sur cette base ? [y/N] " CONFIRM
fi
if [[ "${CONFIRM}" != "y" && "${CONFIRM}" != "Y" ]]; then
  echo "Annulé."
  exit 0
fi

BACKUP_DIR="${ROOT_DIR}/database/backups"
mkdir -p "$BACKUP_DIR"
STAMP="$(date +%Y%m%d-%H%M%S)"
BACKUP_FILE="${BACKUP_DIR}/catalogue-before-enrich-${STAMP}.sql"

echo "Sauvegarde catalogue → ${BACKUP_FILE}"
docker compose exec -T mysql \
  mariadb-dump -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" \
  allergene plat plat_allergene menu menu_plat \
  > "$BACKUP_FILE"

echo "Application de enrich_catalogue_menus.sql…"
docker compose exec -T mysql \
  mariadb -u"${DB_USER}" -p"${DB_PASSWORD}" "${DB_NAME}" \
  < "${ROOT_DIR}/database/enrich_catalogue_menus.sql"

echo "Terminé."
