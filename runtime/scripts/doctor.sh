#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
runtime_root="$(cd "$script_dir/.." && pwd)"
venv_python="$runtime_root/.venv/bin/python"

if [[ ! -x "$venv_python" ]]; then
  echo "Python virtual environment is not installed." >&2
  exit 2
fi

exec "$venv_python" -B "$script_dir/doctor.py"
