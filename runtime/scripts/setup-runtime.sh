#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
runtime_root="$(cd "$script_dir/.." && pwd)"
venv_python="$runtime_root/.venv/bin/python"
requirements="$runtime_root/requirements.txt"

if [[ ! -f "$requirements" ]]; then
  echo "Missing requirements file: $requirements" >&2
  exit 2
fi

resolve_python() {
  local candidate
  for candidate in python3 python; do
    if command -v "$candidate" >/dev/null 2>&1 &&
      "$candidate" -c \
        'import sys; raise SystemExit(0 if sys.version_info >= (3, 10) else 1)'
    then
      command -v "$candidate"
      return 0
    fi
  done
  return 1
}

if [[ ! -x "$venv_python" ]]; then
  system_python="$(resolve_python || true)"
  if [[ -z "$system_python" ]]; then
    echo "Python 3.10 or newer was not found." >&2
    echo "Install Python from https://www.python.org/downloads/macos/." >&2
    exit 2
  fi
  "$system_python" -m venv "$runtime_root/.venv"
fi

"$venv_python" -m pip install \
  --disable-pip-version-check --upgrade pip
"$venv_python" -m pip install \
  --disable-pip-version-check --requirement "$requirements"
"$venv_python" -c \
  "import lxml; print('Python runtime ready; lxml=' + lxml.__version__)"
