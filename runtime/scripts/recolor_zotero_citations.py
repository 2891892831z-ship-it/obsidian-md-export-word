#!/usr/bin/env python3
"""Reapply citation colors to an existing Zotero-enabled Word document.

The source document is never overwritten. A new DOCX copy is created with
in-text ZOTERO_ITEM field results in blue and the ZOTERO_BIBL field result in
black. Field codes remain intact, so Zotero can still refresh the new copy.
"""

from __future__ import annotations

import argparse
import os
import sys
import tempfile
import traceback
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

from lxml import etree

from md_export_word_template import (
    NS,
    W,
    ExportError,
    color_fields,
    configure_console,
    emit_progress,
    field_inventory,
    open_output_document,
    unique_output_path,
    write_failure_log,
)


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="恢复现有 Word 中 Zotero 正文引文的蓝色格式"
    )
    parser.add_argument("docx", type=Path, help="需要处理的 Word 文件")
    parser.add_argument("--output", type=Path, help="新 Word 文件路径")
    parser.add_argument(
        "--no-open",
        action="store_true",
        help="完成后不自动打开新 Word",
    )
    return parser.parse_args()


def validate_field_colors(document: etree._Element) -> dict[str, int]:
    counts = {"ZOTERO_ITEM": 0, "ZOTERO_BIBL": 0}
    colored_runs = {"ZOTERO_ITEM": 0, "ZOTERO_BIBL": 0}
    expected = {"ZOTERO_ITEM": "0000FF", "ZOTERO_BIBL": "000000"}
    errors: list[str] = []

    for field in field_inventory(document):
        code = field["code"].upper()
        kind = next((name for name in expected if name in code), None)
        if not kind:
            continue
        counts[kind] += 1
        for text_node in field["result_nodes"]:
            run = text_node.getparent()
            if run is None or run.tag != W("r"):
                continue
            value = "".join(text_node.itertext())
            if not value:
                continue
            colored_runs[kind] += 1
            color = run.xpath(
                "string(./w:rPr/w:color/@w:val)",
                namespaces=NS,
            ).upper()
            underline = run.xpath(
                "string(./w:rPr/w:u/@w:val)",
                namespaces=NS,
            ).lower()
            if color != expected[kind] or underline not in ("none", "0"):
                errors.append(
                    f"{kind} 字段结果未按预期着色："
                    f"color={color or '(empty)'}，"
                    f"underline={underline or '(empty)'}"
                )

    if counts["ZOTERO_ITEM"] == 0:
        errors.append("未找到可刷新的 ZOTERO_ITEM 正文引文字段")
    elif colored_runs["ZOTERO_ITEM"] == 0:
        errors.append("ZOTERO_ITEM 字段没有可着色的显示文本")
    if errors:
        raise ExportError("\n".join(errors))
    return counts


def recolor_docx(source_path: Path, output_path: Path) -> dict[str, int]:
    parser = etree.XMLParser(remove_blank_text=False, resolve_entities=False)
    replacements: dict[str, bytes] = {}

    with ZipFile(source_path) as source:
        bad = source.testzip()
        if bad:
            raise ExportError(f"源 DOCX ZIP 校验失败：{bad}")
        if "word/document.xml" not in source.namelist():
            raise ExportError("源文件不是有效的 Word DOCX：缺少 document.xml")

        document = etree.fromstring(source.read("word/document.xml"), parser)
        counts = color_fields(document)
        validate_field_colors(document)
        replacements["word/document.xml"] = etree.tostring(
            document,
            xml_declaration=True,
            encoding="UTF-8",
            standalone=True,
        )

        output_path.parent.mkdir(parents=True, exist_ok=True)
        handle = tempfile.NamedTemporaryFile(
            prefix=output_path.stem + "-",
            suffix=".tmp",
            dir=output_path.parent,
            delete=False,
        )
        temp_path = Path(handle.name)
        handle.close()
        try:
            with ZipFile(
                temp_path,
                "w",
                compression=ZIP_DEFLATED,
            ) as target:
                for info in source.infolist():
                    data = replacements.get(info.filename)
                    if data is None:
                        data = source.read(info.filename)
                    target.writestr(info, data)
            os.replace(temp_path, output_path)
        except Exception:
            temp_path.unlink(missing_ok=True)
            raise

    with ZipFile(output_path) as archive:
        bad = archive.testzip()
        if bad:
            output_path.unlink(missing_ok=True)
            raise ExportError(f"输出 DOCX ZIP 校验失败：{bad}")
        document = etree.fromstring(archive.read("word/document.xml"), parser)
        validated = validate_field_colors(document)
    return {
        "ZOTERO_ITEM": validated["ZOTERO_ITEM"],
        "ZOTERO_BIBL": validated["ZOTERO_BIBL"],
        "colored_ZOTERO_ITEM": counts.get("ZOTERO_ITEM", 0),
        "colored_ZOTERO_BIBL": counts.get("ZOTERO_BIBL", 0),
    }


def main() -> int:
    configure_console()
    emit_progress(2, "初始化引文着色")
    args = parse_args()
    source_path = args.docx.expanduser().resolve()
    if not source_path.is_file():
        raise ExportError(f"Word 文件不存在：{source_path}")
    if source_path.suffix.lower() != ".docx":
        raise ExportError(f"输入必须是 .docx 文件：{source_path}")

    output_value = args.output
    requested_output = (
        output_value.expanduser().resolve()
        if output_value
        else source_path.with_name(f"{source_path.stem}-引文蓝色.docx")
    )
    if requested_output == source_path:
        raise ExportError("输出不能覆盖源 Word")
    output_path = unique_output_path(requested_output)

    emit_progress(20, "读取 Word", source_path.name)
    emit_progress(45, "识别 Zotero 域", "正文引文与文末参考文献")
    counts = recolor_docx(source_path, output_path)
    emit_progress(
        85,
        "检查引文颜色",
        f"正文引文域 {counts['ZOTERO_ITEM']}；"
        f"参考文献域 {counts['ZOTERO_BIBL']}",
    )
    print("\n引文着色成功。")
    print(
        f"正文 Zotero 引文域：{counts['ZOTERO_ITEM']} 个（蓝色）；"
        f"参考文献域：{counts['ZOTERO_BIBL']} 个（黑色）。"
    )
    print("Zotero 域已保留；源 Word 未被覆盖。")
    print(f"Word：{output_path}")
    if not args.no_open:
        emit_progress(95, "正在打开 Word", output_path.name)
        try:
            open_output_document(output_path)
        except Exception as exc:
            print(f"无法自动打开 Word：{exc}")
    emit_progress(100, "引文着色完成", output_path.name, level="success")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ExportError as exc:
        emit_progress(100, "引文着色失败", str(exc), level="error")
        error_log = write_failure_log(exc)
        print(f"\n错误：{exc}", file=sys.stderr, flush=True)
        if error_log:
            print(f"错误日志：{error_log}", file=sys.stderr, flush=True)
        raise SystemExit(1)
    except KeyboardInterrupt:
        emit_progress(100, "已取消", "用户中止引文着色", level="warning")
        print("\n已取消。", file=sys.stderr, flush=True)
        raise SystemExit(130)
    except Exception as exc:
        traceback_text = traceback.format_exc()
        emit_progress(100, "引文着色失败", str(exc), level="error")
        error_log = write_failure_log(exc, traceback_text)
        print(f"\n未预期错误：{exc}", file=sys.stderr, flush=True)
        if error_log:
            print(f"错误日志：{error_log}", file=sys.stderr, flush=True)
        raise SystemExit(1)
