#!/usr/bin/env python3
from __future__ import annotations

import argparse
import hashlib
import os
import re
import subprocess
import sys
from pathlib import Path
from xml.etree import ElementTree as ET
from zipfile import ZIP_DEFLATED, ZipFile


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
WP_NS = (
    "http://schemas.openxmlformats.org/drawingml/2006/"
    "wordprocessingDrawing"
)
W = f"{{{W_NS}}}"
WP = f"{{{WP_NS}}}"


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


def write_zotero_color_fixture(path: Path) -> None:
    content_types = """<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>
"""
    document = f"""<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="{W_NS}">
  <w:body>
    <w:p>
      <w:r><w:fldChar w:fldCharType="begin"/></w:r>
      <w:r><w:instrText xml:space="preserve"> ADDIN ZOTERO_ITEM CSL_CITATION {{}}</w:instrText></w:r>
      <w:r><w:fldChar w:fldCharType="separate"/></w:r>
      <w:r>
        <w:rPr><w:color w:val="000000"/><w:u w:val="single"/></w:rPr>
        <w:t>(Example, 2026)</w:t>
      </w:r>
      <w:r><w:fldChar w:fldCharType="end"/></w:r>
    </w:p>
    <w:p>
      <w:r><w:fldChar w:fldCharType="begin"/></w:r>
      <w:r><w:instrText xml:space="preserve"> ADDIN ZOTERO_BIBL {{}}</w:instrText></w:r>
      <w:r><w:fldChar w:fldCharType="separate"/></w:r>
      <w:r>
        <w:rPr><w:color w:val="0000FF"/><w:u w:val="single"/></w:rPr>
        <w:t>Example reference.</w:t>
      </w:r>
      <w:r><w:fldChar w:fldCharType="end"/></w:r>
    </w:p>
    <w:sectPr/>
  </w:body>
</w:document>
"""
    with ZipFile(path, "w", compression=ZIP_DEFLATED) as archive:
        archive.writestr("[Content_Types].xml", content_types)
        archive.writestr("word/document.xml", document)


def visible_run_format(path: Path, text: str) -> tuple[str, str]:
    with ZipFile(path) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))
    for run in root.iter(W + "r"):
        value = "".join(
            node.text or "" for node in run.iter(W + "t")
        )
        if value != text:
            continue
        properties = run.find(W + "rPr")
        color = ""
        underline = ""
        if properties is not None:
            color_node = properties.find(W + "color")
            underline_node = properties.find(W + "u")
            if color_node is not None:
                color = color_node.get(W + "val", "")
            if underline_node is not None:
                underline = underline_node.get(W + "val", "")
        return color, underline
    raise RuntimeError(f"Fixture text not found: {text}")


def paragraph_style_name(path: Path, text: str) -> str:
    with ZipFile(path) as archive:
        document = ET.fromstring(archive.read("word/document.xml"))
        styles = ET.fromstring(archive.read("word/styles.xml"))
    names: dict[str, str] = {}
    for style in styles.iter(W + "style"):
        name = style.find(W + "name")
        style_id = style.get(W + "styleId", "")
        if name is not None and style_id:
            names[style_id] = name.get(W + "val", "")
    for paragraph in document.iter(W + "p"):
        value = "".join(
            node.text or "" for node in paragraph.iter(W + "t")
        ).strip()
        if value != text:
            continue
        properties = paragraph.find(W + "pPr")
        style = properties.find(W + "pStyle") if properties is not None else None
        style_id = style.get(W + "val", "") if style is not None else ""
        return names.get(style_id, "")
    raise RuntimeError(f"Fixture paragraph not found: {text}")


def figure_reflow_inventory(path: Path) -> dict[str, int]:
    with ZipFile(path) as archive:
        root = ET.fromstring(archive.read("word/document.xml"))
    body = root.find(W + "body")
    if body is None:
        raise RuntimeError("Reflow fixture Word has no body")
    image_index = -1
    moved_index = -1
    boundary_index = -1
    chinese_caption_index = -1
    english_caption_index = -1
    chinese_note_index = -1
    english_note_index = -1
    generated_alt_caption_count = 0
    max_image_height = 0
    for index, element in enumerate(list(body)):
        text = "".join(
            node.text or "" for node in element.iter(W + "t")
        )
        extents = list(element.iter(WP + "extent"))
        if extents:
            image_index = index
            max_image_height = max(
                max_image_height,
                *[
                    int(extent.get("cy", "0"))
                    for extent in extents
                ],
            )
        if "回填段落一应在导出的" in text:
            moved_index = index
        if "边界段落不得移动到上一张图片之前" in text:
            boundary_index = index
        if "图1分页回填测试大图" in text.replace(" ", ""):
            chinese_caption_index = index
        if "Figure1.Largefigureforpage-reflowtesting" in text.replace(
            " ", ""
        ):
            english_caption_index = index
        if "本条中文图注必须始终跟随图片" in text:
            chinese_note_index = index
        if "bilingualcaptionsandfigurenotesmustremain" in text.replace(
            " ", ""
        ).lower():
            english_note_index = index
        if text.replace(" ", "").strip() == "图1分页测试大图":
            generated_alt_caption_count += 1
    return {
        "image_index": image_index,
        "moved_index": moved_index,
        "boundary_index": boundary_index,
        "chinese_caption_index": chinese_caption_index,
        "english_caption_index": english_caption_index,
        "chinese_note_index": chinese_note_index,
        "english_note_index": english_note_index,
        "generated_alt_caption_count": generated_alt_caption_count,
        "max_image_height": max_image_height,
    }


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
    recolor = (
        workspace / "runtime" / "scripts" / "recolor_zotero_citations.py"
    )
    smoke = workspace / "tests" / "fixtures" / "smoke.md"
    strict_english_caption = (
        workspace / "tests" / "fixtures" / "strict-english-caption.md"
    )
    figure_reflow = (
        workspace / "tests" / "fixtures" / "figure-reflow.md"
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
    figure_reflow_word = output_dir / "figure-reflow.docx"
    figure_reflow_log = output_dir / "figure-reflow-failure.log.txt"
    figure_reflow_default_word = output_dir / "figure-reflow-default.docx"
    figure_reflow_default_log = (
        output_dir / "figure-reflow-default-failure.log.txt"
    )
    recolor_source = output_dir / "zotero-color-source.docx"
    recolor_word = output_dir / "zotero-color-output.docx"
    recolor_log = output_dir / "zotero-color-failure.log.txt"
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
        figure_reflow_word,
        figure_reflow_log,
        figure_reflow_default_word,
        figure_reflow_default_log,
        recolor_source,
        recolor_word,
        recolor_log,
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
        heading3 = re.sub(
            r"\s+", "", paragraph_style_name(smoke_word, "1.1 二级节标题")
        ).lower()
        heading4 = re.sub(
            r"\s+", "", paragraph_style_name(smoke_word, "1.1.1 三级节标题")
        ).lower()
        require(
            heading3 in {"heading3", "标题3"},
            f"Markdown ### did not retain Heading 3: {heading3}",
        )
        require(
            heading4 in {"heading4", "标题4"},
            f"Markdown #### did not retain Heading 4: {heading4}",
        )

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

        write_zotero_color_fixture(recolor_source)
        env.pop("MD_EXPORT_WORD_OUTPUT", None)
        env["MD_EXPORT_WORD_FAILURE_LOG"] = str(recolor_log)
        recolor_result = subprocess.run(
            [
                str(Path(sys.executable)),
                "-B",
                str(recolor),
                str(recolor_source),
                "--output",
                str(recolor_word),
                "--no-open",
            ],
            cwd=recolor.parent,
            env=env,
            check=False,
        )
        require(
            recolor_result.returncode == 0 and recolor_word.is_file(),
            "Zotero citation recoloring failed",
        )
        require(
            visible_run_format(recolor_word, "(Example, 2026)")
            == ("0000FF", "none"),
            "ZOTERO_ITEM was not blue without underline",
        )
        require(
            visible_run_format(recolor_word, "Example reference.")
            == ("000000", "none"),
            "ZOTERO_BIBL was not black without underline",
        )
        require(
            not recolor_log.exists(),
            "Successful citation recoloring generated a failure log",
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
        env["MD_EXPORT_WORD_FAILURE_LOG"] = str(
            figure_reflow_default_log
        )
        reflow_source_hash = sha256_file(figure_reflow)
        code = run_export(
            Path(sys.executable),
            exporter,
            figure_reflow,
            env,
            "--output",
            str(figure_reflow_default_word),
        )
        require(
            code == 0 and figure_reflow_default_word.is_file(),
            "Default figure-position Word missing",
        )
        default_reflow = figure_reflow_inventory(
            figure_reflow_default_word
        )
        require(
            default_reflow["image_index"]
            < default_reflow["moved_index"],
            "Default export unexpectedly moved prose before the figure",
        )
        require(
            not figure_reflow_default_log.exists(),
            "Default figure-position export generated a failure log",
        )

        env["MD_EXPORT_WORD_FAILURE_LOG"] = str(figure_reflow_log)
        env["MD_EXPORT_WORD_FORMAT_JSON"] = '{"figure_reflow":true}'
        code = run_export(
            Path(sys.executable),
            exporter,
            figure_reflow,
            env,
            "--output",
            str(figure_reflow_word),
        )
        require(
            code == 0 and figure_reflow_word.is_file(),
            "Figure-reflow Word missing",
        )
        require(
            sha256_file(figure_reflow) == reflow_source_hash,
            "Figure reflow modified the source Markdown",
        )
        reflow = figure_reflow_inventory(figure_reflow_word)
        require(
            0 <= reflow["moved_index"] < reflow["image_index"],
            "Following prose was not moved before the large figure",
        )
        require(
            reflow["boundary_index"] > reflow["image_index"],
            "Figure reflow crossed the next section heading",
        )
        require(
            reflow["image_index"]
            < reflow["chinese_caption_index"]
            < reflow["english_caption_index"]
            < reflow["chinese_note_index"]
            < reflow["english_note_index"],
            "Bilingual figure captions or notes were detached from the image",
        )
        require(
            reflow["generated_alt_caption_count"] == 0,
            "Pandoc's redundant image-alt caption was not removed",
        )
        require(
            0 < reflow["max_image_height"] <= 12518 * 635,
            "Large figure was not capped to printable page height",
        )
        require(
            not figure_reflow_log.exists(),
            "Figure-reflow export generated a failure log",
        )

        env.pop("MD_EXPORT_WORD_FORMAT_JSON", None)
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
