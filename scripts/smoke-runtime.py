#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import os
import re
import subprocess
import sys
from pathlib import Path


def sha256_file(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def run_export(
    python: Path,
    exporter: Path,
    fixture: Path,
    env: dict[str, str],
    *extra: str,
    mode: str = "compatible",
) -> int:
    result = subprocess.run(
        [
            str(python),
            "-B",
            str(exporter),
            str(fixture),
            "--yes",
            "--no-open",
            "--mode",
            mode,
            *extra,
        ],
        cwd=exporter.parent,
        env=env,
        check=False,
    )
    return result.returncode


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--pandoc", required=True, type=Path)
    parser.add_argument("--crossref", required=True, type=Path)
    parser.add_argument("--workspace", default=".", type=Path)
    args = parser.parse_args()

    workspace = args.workspace.resolve()
    exporter = (
        workspace / "runtime" / "scripts" / "md_export_word_template.py"
    )
    smoke = workspace / "tests" / "fixtures" / "smoke.md"
    strict_english_caption = (
        workspace / "tests" / "fixtures" / "strict-english-caption.md"
    )
    invalid = workspace / "tests" / "fixtures" / "failure-invalid.md"
    output_dir = workspace / "dist"
    output_dir.mkdir(parents=True, exist_ok=True)
    vault_marker = workspace / ".obsidian"
    created_vault_marker = not vault_marker.exists()
    vault_marker.mkdir(exist_ok=True)

    smoke_word = output_dir / "smoke.docx"
    success_log = output_dir / "smoke-failure.log.txt"
    default_word = smoke.parent / "运行时烟雾测试.docx"
    legacy_word = smoke.parent / "smoke-编辑审阅稿.docx"
    custom_word = output_dir / "custom-output-name.docx"
    strict_log = output_dir / "strict-english-captions.log.txt"
    strict_english_caption_word = (
        output_dir / "strict-english-caption.docx"
    )
    failure_word = output_dir / "must-not-exist.docx"
    failure_log = output_dir / "expected-failure.log.txt"
    generated = [
        smoke_word,
        success_log,
        default_word,
        legacy_word,
        custom_word,
        strict_log,
        strict_english_caption_word,
        failure_word,
        failure_log,
    ]

    for path in generated:
        path.unlink(missing_ok=True)
    for path in output_dir.glob("custom-output-name-*.docx"):
        path.unlink()

    env = os.environ.copy()
    env.update(
        {
            "PYTHONUTF8": "1",
            "PYTHONDONTWRITEBYTECODE": "1",
            "PYTHONUNBUFFERED": "1",
            "MD_EXPORT_WORD_PANDOC": str(args.pandoc.resolve()),
            "MD_EXPORT_WORD_CROSSREF": str(args.crossref.resolve()),
            "MD_EXPORT_WORD_FAILURE_LOG": str(success_log),
        }
    )

    try:
        code = run_export(
            Path(sys.executable),
            exporter,
            smoke,
            env,
            "--output",
            str(smoke_word),
        )
        require(code == 0 and smoke_word.is_file(), "Smoke Word missing")
        require(not success_log.exists(), "Success generated a failure log")

        code = run_export(Path(sys.executable), exporter, smoke, env)
        require(
            code == 0 and default_word.is_file(),
            "Default article-title Word missing",
        )
        require(not legacy_word.exists(), "Legacy output suffix generated")

        env["MD_EXPORT_WORD_OUTPUT"] = str(custom_word)
        code = run_export(Path(sys.executable), exporter, smoke, env)
        require(
            code == 0 and custom_word.is_file(),
            "Custom output name was not honored",
        )
        original_hash = sha256_file(custom_word)
        code = run_export(Path(sys.executable), exporter, smoke, env)
        require(code == 0, "Duplicate-name export failed")
        require(
            sha256_file(custom_word) == original_hash,
            "Existing Word was overwritten",
        )
        timestamped = [
            path
            for path in output_dir.glob("custom-output-name-*.docx")
            if re.fullmatch(
                r"custom-output-name-\d{8}-\d{6}(?:-\d+)?\.docx",
                path.name,
            )
        ]
        require(
            len(timestamped) == 1,
            "Timestamped duplicate Word was not generated exactly once",
        )

        env.pop("MD_EXPORT_WORD_OUTPUT", None)
        env["MD_EXPORT_WORD_FAILURE_LOG"] = str(strict_log)
        code = run_export(
            Path(sys.executable),
            exporter,
            strict_english_caption,
            env,
            "--output",
            str(strict_english_caption_word),
            mode="strict",
        )
        require(
            code == 0 and strict_english_caption_word.is_file(),
            "Strict mode rejected a configured English table caption",
        )
        require(
            not strict_log.exists(),
            "Strict English-caption export generated a failure log",
        )

        env.pop("MD_EXPORT_WORD_OUTPUT", None)
        env["MD_EXPORT_WORD_FAILURE_LOG"] = str(failure_log)
        code = run_export(
            Path(sys.executable),
            exporter,
            invalid,
            env,
            "--output",
            str(failure_word),
        )
        require(code != 0, "Failure fixture unexpectedly succeeded")
        require(failure_log.is_file(), "Failure log was not generated")
        require(not failure_word.exists(), "Failure generated a Word")
        print("Cross-platform runtime smoke test passed.")
        return 0
    finally:
        for path in generated:
            path.unlink(missing_ok=True)
        for path in output_dir.glob("custom-output-name-*.docx"):
            path.unlink()
        if created_vault_marker:
            vault_marker.rmdir()


if __name__ == "__main__":
    raise SystemExit(main())
