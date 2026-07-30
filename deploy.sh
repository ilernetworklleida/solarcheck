#!/usr/bin/env bash
# ══════════════════════════════════════════════════════════════════════
#  deploy.sh — solarcheck.proposta.cat  (web corporativa completa)
#
#  Sube el build de Vite (dist/) a la carpeta del subdominio.
#  Usa --delete: la carpeta remota queda EXACTAMENTE igual que dist/,
#  para que no sobrevivan bundles ni paginas de versiones anteriores.
#
#  Uso normal:  bash ~/.claude/bin/deploy-auto.sh <ruta-proyecto>
#               (hace backup remoto + este script + healthcheck)
# ══════════════════════════════════════════════════════════════════════
set -euo pipefail

DOMAIN="solarcheck.proposta.cat"
REMOTE_USER="u862342697"
REMOTE_HOST="185.97.147.162"
REMOTE_PORT="65002"
REMOTE_PATH="/home/${REMOTE_USER}/domains/proposta.cat/public_html/solarcheck/"

HERE="$(cd "$(dirname "$0")" && pwd)"
cd "${HERE}"

# Salvaguarda: este script solo puede escribir en la carpeta de solarcheck.
case "${REMOTE_PATH}" in
  /home/u862342697/domains/proposta.cat/public_html/solarcheck/) ;;
  *) echo "REMOTE_PATH inesperado, abortado" >&2; exit 1 ;;
esac

echo "▸ 1/4 Build"
npm run build

echo "▸ 2/4 Comprobaciones del build"
for file in index.html 404.html assets images CNAME; do
  [ -e "dist/${file}" ] || { echo "   ! falta dist/${file}" >&2; exit 1; }
done
for page in servicios laminas-solares-coche laminas-edificios clearshield-ppf trabajos \
            empresa preguntas-frecuentes contacto presupuesto aviso-legal privacidad cookies; do
  [ -f "dist/${page}/index.html" ] || { echo "   ! falta la pagina dist/${page}/index.html" >&2; exit 1; }
done
grep -q 'solarcheck.proposta.cat' dist/index.html || { echo "   ! el canonical no apunta al dominio" >&2; exit 1; }
echo "   ✓ 13 paginas + 404 + assets"

echo "▸ 3/4 Subiendo a ${DOMAIN}"
rsync -az --delete --no-perms --no-owner --no-group \
  -e "ssh -p ${REMOTE_PORT}" \
  dist/ "${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_PATH}"
ssh -p "${REMOTE_PORT}" "${REMOTE_USER}@${REMOTE_HOST}" "
  find '${REMOTE_PATH}' -type d -exec chmod 755 {} +
  find '${REMOTE_PATH}' -type f -exec chmod 644 {} +
  rm -rf '${REMOTE_PATH}.lscache' 2>/dev/null || true
  curl -s -m 10 -o /dev/null -X PURGE 'https://${DOMAIN}/*' || true
"

echo "▸ 4/4 Verificando"
FAIL=0
for path in / /servicios/ /laminas-solares-coche/ /laminas-edificios/ /clearshield-ppf/ \
            /trabajos/ /empresa/ /preguntas-frecuentes/ /contacto/ /presupuesto/ \
            /aviso-legal/ /privacidad/ /cookies/; do
  CODE="$(curl -s -o /dev/null -w '%{http_code}' -m 20 "https://${DOMAIN}${path}?v=$(date +%s)")"
  [ "${CODE}" = "200" ] || { echo "   ! ${path} -> ${CODE}"; FAIL=1; }
done
[ "${FAIL}" = "0" ] || { echo "Hay rutas que no responden 200" >&2; exit 1; }
echo "   ✓ las 13 rutas responden 200"

echo ""
echo "[OK] Deploy -> https://${DOMAIN}/"
