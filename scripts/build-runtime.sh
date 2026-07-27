#!/usr/bin/env bash
set -euo pipefail

if [[ $# -lt 3 || $# -gt 4 ]]; then
  echo "Usage: build-runtime.sh <macos-arm64|macos-x64> <pandoc> <pandoc-crossref> [output-dir]" >&2
  exit 2
fi

target="$1"
pandoc_exe="$2"
crossref_exe="$3"
script_dir="$(cd "$(dirname "$0")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
output_root="${4:-$repo_root/dist}"

case "$target" in
  macos-arm64|macos-x64) ;;
  *)
    echo "Unsupported macOS target: $target" >&2
    exit 2
    ;;
esac

output_root="$(
  python3 -c 'import os,sys; print(os.path.abspath(sys.argv[1]))' \
    "$output_root"
)"
case "$output_root/" in
  "$repo_root/"*) ;;
  *)
    echo "The output directory must be inside the repository: $output_root" >&2
    exit 2
    ;;
esac

asset_name="md-export-word-runtime-$target.zip"
checksum_name="SHA256SUMS-$target.txt"
stage="$output_root/runtime-package-$target"
stage_runtime="$stage/runtime"
archive="$output_root/$asset_name"

rm -rf "$stage"
rm -f "$archive" "$output_root/$checksum_name"
mkdir -p "$output_root" "$stage"
cp -R "$repo_root/runtime" "$stage/"
rm -rf \
  "$stage_runtime/.venv" \
  "$stage_runtime/Pandoc&pandoc-crossref"
find "$stage_runtime" -type d -name __pycache__ -prune -exec rm -rf {} +
find "$stage_runtime" -type f -name '*.pyc' -delete
mkdir -p "$stage_runtime/Pandoc&pandoc-crossref"
cp "$pandoc_exe" "$stage_runtime/Pandoc&pandoc-crossref/pandoc"
cp "$crossref_exe" \
  "$stage_runtime/Pandoc&pandoc-crossref/pandoc-crossref"
chmod 755 \
  "$stage_runtime/Pandoc&pandoc-crossref/pandoc" \
  "$stage_runtime/Pandoc&pandoc-crossref/pandoc-crossref" \
  "$stage_runtime/scripts/setup-runtime.sh" \
  "$stage_runtime/scripts/doctor.sh" \
  "$stage_runtime/scripts/MD导出Word模板.command"

python3 - "$stage_runtime" "$target" <<'PY'
import hashlib
import json
import pathlib
import sys

root = pathlib.Path(sys.argv[1])
target = sys.argv[2]
manifest_path = root / "runtime-manifest.json"
manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
manifest["platform"] = target
files = {}
for path in sorted(root.rglob("*")):
    if (
        not path.is_file()
        or path == manifest_path
        or ".venv" in path.parts
        or "__pycache__" in path.parts
        or path.suffix == ".pyc"
    ):
        continue
    relative = path.relative_to(root).as_posix()
    files[relative] = hashlib.sha256(path.read_bytes()).hexdigest()
manifest["files"] = files
manifest_path.write_text(
    json.dumps(manifest, ensure_ascii=False, indent=2) + "\n",
    encoding="utf-8",
)
PY

/usr/bin/ditto -c -k --sequesterRsrc --keepParent \
  "$stage_runtime" "$archive"
archive_hash="$(shasum -a 256 "$archive" | awk '{print $1}')"
printf '%s  %s\n' "$archive_hash" "$asset_name" \
  >"$output_root/$checksum_name"
rm -rf "$stage"

echo "Runtime package: $archive"
echo "SHA256: $archive_hash"
