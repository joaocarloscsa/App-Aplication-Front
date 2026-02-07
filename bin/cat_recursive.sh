#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -eq 0 ]; then
  echo "Uso: $0 <arquivo_ou_diretorio> [...]"
  exit 1
fi

# Extensões consideradas "texto-fonte"
EXTENSIONS="php|yaml|yml|md|txt|json|xml|env|sql|ts|tsx|js|jsx"


process_file() {
  local file="$1"

  echo
  echo "===== BEGIN FILE: $file ====="
  cat "$file"
  echo
  echo "===== END FILE: $file ====="
}

process_dir() {
  local dir="$1"

  find "$dir" -type f \
    | grep -E "\.($EXTENSIONS)$" \
    | sort \
    | while read -r file; do
        process_file "$file"
      done
}

for path in "$@"; do
  if [ -f "$path" ]; then
    process_file "$path"
  elif [ -d "$path" ]; then
    process_dir "$path"
  else
    echo "⚠️ Ignorado (não existe ou não é arquivo/diretório): $path" >&2
  fi
done