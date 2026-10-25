#!/usr/bin/env bash
# Vérifie le catalogue cible après init (volume vierge uniquement).
set -euo pipefail

EXPECTED_MENUS=8
EXPECTED_PLATS=19
EXPECTED_LINKS=26

echo "Validating demonstration catalogue for database '${MYSQL_DATABASE}'…"

menus_count="$(mariadb --protocol=socket -uroot -p"${MYSQL_ROOT_PASSWORD}" -N -e \
  "SELECT COUNT(*) FROM \`${MYSQL_DATABASE}\`.menu;")"
plats_count="$(mariadb --protocol=socket -uroot -p"${MYSQL_ROOT_PASSWORD}" -N -e \
  "SELECT COUNT(*) FROM \`${MYSQL_DATABASE}\`.plat;")"
links_count="$(mariadb --protocol=socket -uroot -p"${MYSQL_ROOT_PASSWORD}" -N -e \
  "SELECT COUNT(*) FROM \`${MYSQL_DATABASE}\`.menu_plat;")"
orphans_count="$(mariadb --protocol=socket -uroot -p"${MYSQL_ROOT_PASSWORD}" -N -e \
  "SELECT COUNT(*) FROM \`${MYSQL_DATABASE}\`.plat p
   WHERE NOT EXISTS (SELECT 1 FROM \`${MYSQL_DATABASE}\`.menu_plat mp WHERE mp.plat_id = p.plat_id);")"

ok=1
if [[ "${menus_count}" -ne "${EXPECTED_MENUS}" ]]; then
  echo "ERROR: expected ${EXPECTED_MENUS} menus, found ${menus_count}."
  ok=0
fi
if [[ "${plats_count}" -ne "${EXPECTED_PLATS}" ]]; then
  echo "ERROR: expected ${EXPECTED_PLATS} plats, found ${plats_count}."
  ok=0
fi
if [[ "${links_count}" -ne "${EXPECTED_LINKS}" ]]; then
  echo "ERROR: expected ${EXPECTED_LINKS} menu_plat links, found ${links_count}."
  ok=0
fi
if [[ "${orphans_count}" -ne 0 ]]; then
  echo "ERROR: expected 0 orphan plats, found ${orphans_count}."
  ok=0
fi

if [[ "${ok}" -ne 1 ]]; then
  echo "Catalogue validation failed."
  exit 1
fi

echo "Catalogue validation OK (${menus_count} menus, ${plats_count} plats, ${links_count} links, 0 orphan)."
