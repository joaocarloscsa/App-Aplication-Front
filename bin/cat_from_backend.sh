#!/usr/bin/env bash
# Pode ficar em qualquer diretório (ex: backend/new-docs-http)

set -euo pipefail

if [[ "$#" -eq 0 ]]; then
  echo "ERRO: nenhum arquivo informado."
  echo "Uso: ./cat_from_backend.sh /caminho/absoluto/arquivo1 ..."
  exit 1
fi

for FILE in "$@"; do
  if [[ ! -f "$FILE" ]]; then
    echo "AVISO: arquivo não encontrado ou inválido: $FILE" >&2
    continue
  fi

  echo
  echo "===== BEGIN FILE: $FILE ====="
  cat "$FILE"
  echo "===== END FILE: $FILE ====="
done

