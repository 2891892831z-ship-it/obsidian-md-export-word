#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "$0")" && pwd)"
runtime_root="$(cd "$script_dir/.." && pwd)"
export_script="$script_dir/md_export_word_template.py"
venv_python="$runtime_root/.venv/bin/python"
input_md="${1:-}"

if [[ -z "$input_md" ]]; then
  input_md="$(
    /usr/bin/osascript -e \
      'POSIX path of (choose file with prompt "选择要导出的 Markdown 文件")'
  )"
fi

if [[ -z "$input_md" ]]; then
  echo "未选择 Markdown 文件，操作已取消。"
  exit 0
fi

if [[ ! -x "$venv_python" ]]; then
  echo "未找到插件私有 Python，请先在 Obsidian 中安装或修复运行时。" >&2
  exit 2
fi

export PYTHONUTF8=1
export PYTHONDONTWRITEBYTECODE=1
export PYTHONUNBUFFERED=1
exec "$venv_python" -B "$export_script" "$input_md"
