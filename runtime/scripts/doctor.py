#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import json
import platform
import subprocess
import sys
from pathlib import Path


RUNTIME_ROOT = Path(__file__).resolve().parent.parent


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def binary_names(runtime_platform: str) -> tuple[str, str]:
    if runtime_platform == "windows-x64":
        return "pandoc.exe", "pandoc-crossref.exe"
    if runtime_platform in {"macos-arm64", "macos-x64"}:
        return "pandoc", "pandoc-crossref"
    raise RuntimeError(f"Unsupported runtime platform: {runtime_platform}")


def main() -> int:
    failures: list[str] = []
    manifest_path = RUNTIME_ROOT / "runtime-manifest.json"
    if not manifest_path.is_file():
        print("[FAIL] Runtime manifest")
        return 2

    manifest = json.loads(manifest_path.read_text(encoding="utf-8"))
    runtime_platform = str(manifest.get("platform", ""))
    print(
        "[OK] Runtime manifest "
        f"{manifest.get('version', 'unknown')} ({runtime_platform})"
    )

    pandoc_name, crossref_name = binary_names(runtime_platform)
    required = {
        "Python exporter": RUNTIME_ROOT
        / "scripts"
        / "md_export_word_template.py",
        "True-script Lua filter": RUNTIME_ROOT
        / "scripts"
        / "true_scripts.lua",
        "Zotero Lua filter": RUNTIME_ROOT / "zotero.lua",
        "Pandoc": RUNTIME_ROOT
        / "Pandoc&pandoc-crossref"
        / pandoc_name,
        "pandoc-crossref": RUNTIME_ROOT
        / "Pandoc&pandoc-crossref"
        / crossref_name,
    }
    for label, target in required.items():
        if target.is_file():
            print(f"[OK] {label}")
        else:
            failures.append(f"{label}: {target}")
            print(f"[FAIL] {label}")

    templates = [
        path
        for path in (RUNTIME_ROOT / "Word-Template").glob("*.docx")
        if not path.name.startswith("~$")
    ]
    if templates:
        print(f"[OK] Word templates ({len(templates)})")
    else:
        failures.append("No Word template was found")
        print("[FAIL] Word templates")

    files = manifest.get("files", {})
    for relative, expected in files.items():
        target = RUNTIME_ROOT / Path(relative)
        if not target.is_file():
            failures.append(f"Manifest file is missing: {relative}")
            continue
        if sha256_file(target).lower() != str(expected).lower():
            failures.append(f"SHA-256 mismatch: {relative}")
    if files and not any("SHA-256" in item for item in failures):
        print("[OK] Runtime SHA-256")

    try:
        import lxml

        print(
            f"[OK] Python {platform.python_version()}; "
            f"lxml {lxml.__version__}"
        )
    except Exception as exc:
        failures.append(f"Python virtual environment or lxml: {exc}")
        print("[FAIL] Python virtual environment")

    for label, executable in (
        ("Pandoc", required["Pandoc"]),
        ("pandoc-crossref", required["pandoc-crossref"]),
    ):
        if not executable.is_file():
            continue
        result = subprocess.run(
            [str(executable), "--version"],
            text=True,
            encoding="utf-8",
            errors="replace",
            capture_output=True,
            check=False,
        )
        first_line = (result.stdout or result.stderr).splitlines()
        if result.returncode or not first_line:
            failures.append(f"{label} could not run")
        else:
            print(f"[OK] {first_line[0]}")

    if failures:
        print("Doctor failed: " + "; ".join(failures))
        return 2
    print(
        "Doctor passed: runtime files, Python, lxml, Pandoc, and "
        "pandoc-crossref are ready."
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
