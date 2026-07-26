#!/usr/bin/env python3
"""Export one Obsidian Markdown article to a formatted Word review draft.

Markdown is the only content authority. The program:
1. preflights local images and Zotero citekeys;
2. exports through Pandoc + pandoc-crossref + zotero.lua;
3. applies the confirmed Word typography/layout rules;
4. inserts a live Zotero bibliography field;
5. validates the DOCX package and writes a diagnostic log only on failure.
"""

from __future__ import annotations

import argparse
import copy
import datetime as dt
import hashlib
import html
import json
import os
import re
import sqlite3
import subprocess
import sys
import tempfile
import traceback
import urllib.parse
import urllib.request
from collections import Counter
from pathlib import Path
from typing import Any, Iterable
from zipfile import ZIP_DEFLATED, ZipFile

from lxml import etree


W_NS = "http://schemas.openxmlformats.org/wordprocessingml/2006/main"
R_NS = "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
M_NS = "http://schemas.openxmlformats.org/officeDocument/2006/math"
WP_NS = "http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing"
A_NS = "http://schemas.openxmlformats.org/drawingml/2006/main"
PKG_REL_NS = "http://schemas.openxmlformats.org/package/2006/relationships"
XML_NS = "http://www.w3.org/XML/1998/namespace"

NS = {
    "w": W_NS,
    "r": R_NS,
    "m": M_NS,
    "wp": WP_NS,
    "a": A_NS,
    "pr": PKG_REL_NS,
}


def W(name: str) -> str:
    return f"{{{W_NS}}}{name}"


def R(name: str) -> str:
    return f"{{{R_NS}}}{name}"


def M(name: str) -> str:
    return f"{{{M_NS}}}{name}"


class ExportError(RuntimeError):
    pass


DEFAULT_FORMAT_CONFIG: dict[str, Any] = {
    "preset_name": "当前期刊模板",
    "east_asia_font": "宋体",
    "western_font": "Times New Roman",
    "body_size_pt": 12.0,
    "body_line_spacing": 1.5,
    "body_first_line_chars": 2.0,
    "title_size_pt": 16.0,
    "title_line_spacing": 1.5,
    "heading2_size_pt": 14.0,
    "heading3_size_pt": 12.0,
    "heading_line_spacing": 1.5,
    "table_size_pt": 7.5,
    "table_line_spacing": 1.0,
    "caption_size_pt": 10.5,
    "caption_line_spacing": 1.0,
    "note_size_pt": 7.5,
    "note_line_spacing": 1.5,
    "formula_size_pt": 12.0,
    "margin_cm": 2.54,
}

FORMAT_NUMERIC_LIMITS: dict[str, tuple[float, float]] = {
    "body_size_pt": (5.0, 36.0),
    "body_line_spacing": (0.8, 3.0),
    "body_first_line_chars": (0.0, 4.0),
    "title_size_pt": (5.0, 36.0),
    "title_line_spacing": (0.8, 3.0),
    "heading2_size_pt": (5.0, 36.0),
    "heading3_size_pt": (5.0, 36.0),
    "heading_line_spacing": (0.8, 3.0),
    "table_size_pt": (5.0, 24.0),
    "table_line_spacing": (0.8, 3.0),
    "caption_size_pt": (5.0, 24.0),
    "caption_line_spacing": (0.8, 3.0),
    "note_size_pt": (5.0, 24.0),
    "note_line_spacing": (0.8, 3.0),
    "formula_size_pt": (5.0, 36.0),
    "margin_cm": (1.0, 5.0),
}


def load_format_config(raw_json: str | None) -> dict[str, Any]:
    config = copy.deepcopy(DEFAULT_FORMAT_CONFIG)
    if not raw_json:
        return config
    try:
        supplied = json.loads(raw_json)
    except json.JSONDecodeError as exc:
        raise ExportError(f"格式设置 JSON 无效：{exc}") from exc
    if not isinstance(supplied, dict):
        raise ExportError("格式设置必须是 JSON 对象")

    for key in ("preset_name", "east_asia_font", "western_font"):
        if key not in supplied:
            continue
        value = str(supplied[key]).strip()
        if not value:
            raise ExportError(f"格式设置 {key} 不能为空")
        config[key] = value

    for key, (minimum, maximum) in FORMAT_NUMERIC_LIMITS.items():
        if key not in supplied:
            continue
        try:
            value = float(supplied[key])
        except (TypeError, ValueError) as exc:
            raise ExportError(f"格式设置 {key} 必须是数字") from exc
        if not minimum <= value <= maximum:
            raise ExportError(
                f"格式设置 {key} 超出允许范围 {minimum}–{maximum}：{value}"
            )
        config[key] = value
    return config


def line_twips(multiplier: float) -> int:
    return int(round(multiplier * 240))


def points_twips(points: float) -> int:
    return int(round(points * 20))


def cm_twips(value: float) -> int:
    return int(round(value / 2.54 * 1440))


def content_width_dxa(config: dict[str, Any]) -> int:
    return 11906 - 2 * cm_twips(float(config["margin_cm"]))


def content_width_emu(config: dict[str, Any]) -> int:
    return int(round(content_width_dxa(config) / 1440 * 914400))


def format_config_summary(config: dict[str, Any]) -> str:
    return (
        f"{config['preset_name']}（中文 {config['east_asia_font']}；"
        f"英文/数字 {config['western_font']}；"
        f"正文 {config['body_size_pt']} pt、"
        f"{config['body_line_spacing']} 倍行距、"
        f"首行 {config['body_first_line_chars']} 字；"
        f"表格 {config['table_size_pt']} pt、"
        f"{config['table_line_spacing']} 倍行距；"
        f"图表题 {config['caption_size_pt']} pt；"
        f"图表注 {config['note_size_pt']} pt；"
        f"页边距 {config['margin_cm']} cm）"
    )


def configure_console() -> None:
    for stream in (sys.stdout, sys.stderr):
        try:
            stream.reconfigure(
                encoding="utf-8",
                errors="replace",
                line_buffering=True,
                write_through=True,
            )
        except Exception:
            pass


def emit_progress(
    percent: int,
    stage: str,
    detail: str = "",
    *,
    level: str = "info",
) -> None:
    payload = {
        "percent": max(0, min(100, int(percent))),
        "stage": stage,
        "detail": detail,
        "level": level,
    }
    print(
        "@@MD_EXPORT_PROGRESS@@"
        + json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        flush=True,
    )


def failure_log_path() -> Path:
    configured = os.environ.get("MD_EXPORT_WORD_FAILURE_LOG", "").strip()
    if configured:
        return Path(configured).expanduser().resolve()
    if len(sys.argv) > 1:
        markdown = Path(sys.argv[1]).expanduser().resolve()
        return markdown.with_name(f"{markdown.stem}-导出失败.log.txt")
    return Path.cwd() / "MD导出Word-导出失败.log.txt"


def write_failure_log(exc: BaseException, traceback_text: str = "") -> Path | None:
    try:
        path = failure_log_path()
        path.parent.mkdir(parents=True, exist_ok=True)
        lines = [
            "MD Export Word failure report",
            f"Time: {dt.datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"Error type: {type(exc).__name__}",
            f"Error: {exc}",
            f"Command: {subprocess.list2cmdline(sys.argv)}",
        ]
        if traceback_text:
            lines.extend(["", "Traceback:", traceback_text.rstrip()])
        path.write_text("\n".join(lines) + "\n", encoding="utf-8")
        return path
    except Exception as log_error:
        print(f"无法写入错误日志：{log_error}", file=sys.stderr, flush=True)
        return None


def select_export_mode_gui() -> str | None:
    """Show a small native mode selector when no CLI mode was supplied."""
    if os.name == "nt":
        import ctypes

        message = (
            "请选择 Word 导出模式：\n\n"
            "【是】严格模式\n"
            "用于自己的论文；Zotero 缺少任一 citekey 就停止导出。\n\n"
            "【否】兼容模式\n"
            "用于外来 Markdown；缺失 citekey 保留为醒目占位符，"
            "并写入日志。\n\n"
            "【取消】停止导出。"
        )
        result = ctypes.windll.user32.MessageBoxW(  # type: ignore[attr-defined]
            None,
            message,
            "选择 Markdown → Word 导出模式",
            0x00000003 | 0x00000020 | 0x00010000,
        )
        if result == 6:
            return "strict"
        if result == 7:
            return "compatible"
        return None

    answer = input(
        "选择导出模式：[1] 严格模式 [2] 兼容模式 [Enter] 取消："
    ).strip()
    if answer == "1":
        return "strict"
    if answer == "2":
        return "compatible"
    return None


def sha256_file(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def find_vault_root(start: Path) -> Path:
    for candidate in (start, *start.parents):
        if (candidate / ".obsidian").is_dir():
            return candidate
    raise ExportError(
        f"未找到 Obsidian 库根目录（缺少 .obsidian）：{start}"
    )


def direct(parent: etree._Element, tag: str) -> etree._Element | None:
    for child in parent:
        if child.tag == tag:
            return child
    return None


def get_or_add(parent: etree._Element, tag: str) -> etree._Element:
    found = direct(parent, tag)
    if found is None:
        found = etree.SubElement(parent, tag)
    return found


def remove_direct(parent: etree._Element, tag: str) -> None:
    for child in list(parent):
        if child.tag == tag:
            parent.remove(child)


def set_on_off(parent: etree._Element, name: str, enabled: bool = True) -> None:
    remove_direct(parent, W(name))
    if enabled:
        etree.SubElement(parent, W(name))


def set_fonts(
    rpr: etree._Element,
    *,
    east_asia: str = "宋体",
    western: str = "Times New Roman",
) -> None:
    rfonts = get_or_add(rpr, W("rFonts"))
    for attr in (
        "asciiTheme",
        "hAnsiTheme",
        "eastAsiaTheme",
        "cstheme",
    ):
        rfonts.attrib.pop(W(attr), None)
    rfonts.set(W("ascii"), western)
    rfonts.set(W("hAnsi"), western)
    rfonts.set(W("cs"), western)
    rfonts.set(W("eastAsia"), east_asia)


def set_size(rpr: etree._Element, points: float) -> None:
    value = str(int(round(points * 2)))
    get_or_add(rpr, W("sz")).set(W("val"), value)
    get_or_add(rpr, W("szCs")).set(W("val"), value)


def set_run_visual(
    run: etree._Element,
    *,
    points: float | None,
    color: str | None = None,
    underline: str | None = None,
    east_asia: str | None = None,
    western: str | None = None,
) -> None:
    rpr = get_or_add(run, W("rPr"))
    if run.index(rpr) != 0:
        run.remove(rpr)
        run.insert(0, rpr)
    if east_asia is not None or western is not None:
        set_fonts(
            rpr,
            east_asia=east_asia or "宋体",
            western=western or "Times New Roman",
        )
    if points is not None:
        set_size(rpr, points)
    if color is not None:
        color_node = get_or_add(rpr, W("color"))
        color_node.set(W("val"), color)
        color_node.attrib.pop(W("themeColor"), None)
    if underline is not None:
        get_or_add(rpr, W("u")).set(W("val"), underline)
    rstyle = direct(rpr, W("rStyle"))
    if rstyle is not None and color is not None:
        rpr.remove(rstyle)


def paragraph_text(paragraph: etree._Element) -> str:
    return "".join(
        text or ""
        for text in paragraph.xpath(".//w:t/text()", namespaces=NS)
    ).strip()


def set_paragraph_style(paragraph: etree._Element, style_id: str) -> None:
    ppr = direct(paragraph, W("pPr"))
    if ppr is None:
        ppr = etree.Element(W("pPr"))
        paragraph.insert(0, ppr)
    pstyle = direct(ppr, W("pStyle"))
    if pstyle is None:
        pstyle = etree.Element(W("pStyle"))
        ppr.insert(0, pstyle)
    pstyle.set(W("val"), style_id)


def set_paragraph_format(
    paragraph: etree._Element,
    *,
    alignment: str,
    before: int,
    after: int,
    line: int,
    first_line: int,
    first_line_chars: float | None = None,
    keep_next: bool = False,
    keep_lines: bool = False,
    page_break_before: bool = False,
) -> None:
    ppr = direct(paragraph, W("pPr"))
    if ppr is None:
        ppr = etree.Element(W("pPr"))
        paragraph.insert(0, ppr)

    get_or_add(ppr, W("jc")).set(W("val"), alignment)
    spacing = get_or_add(ppr, W("spacing"))
    spacing.attrib.clear()
    spacing.set(W("before"), str(before))
    spacing.set(W("after"), str(after))
    spacing.set(W("line"), str(line))
    spacing.set(W("lineRule"), "auto")
    indent = get_or_add(ppr, W("ind"))
    indent.attrib.clear()
    indent.set(W("firstLine"), str(first_line))
    if first_line_chars is None:
        first_line_chars = 2.0 if first_line else 0.0
    indent.set(W("firstLineChars"), str(int(round(first_line_chars * 100))))
    set_on_off(ppr, "keepNext", keep_next)
    set_on_off(ppr, "keepLines", keep_lines)
    set_on_off(ppr, "pageBreakBefore", page_break_before)
    set_on_off(ppr, "widowControl", True)


def style_id_map(styles_root: etree._Element) -> dict[str, str]:
    result: dict[str, str] = {}
    for style in styles_root.findall(W("style")):
        name = style.find(W("name"))
        if name is not None and name.get(W("val")):
            result[name.get(W("val"))] = style.get(W("styleId"))
    return result


def get_style_id(styles: dict[str, str], *names: str) -> str:
    for name in names:
        if name in styles:
            return styles[name]
    raise ExportError(f"输出 Word 缺少样式：{names}")


def xml_text_nodes_in_order(root: etree._Element) -> list[etree._Element]:
    return list(root.xpath(".//w:t", namespaces=NS))


def field_inventory(root: etree._Element) -> list[dict[str, Any]]:
    stack: list[dict[str, Any]] = []
    fields: list[dict[str, Any]] = []
    for element in root.iter():
        if element.tag == W("fldChar"):
            kind = element.get(W("fldCharType"))
            if kind == "begin":
                stack.append(
                    {
                        "code": [],
                        "result_nodes": [],
                        "separated": False,
                    }
                )
            elif kind == "separate" and stack:
                stack[-1]["separated"] = True
            elif kind == "end" and stack:
                field = stack.pop()
                field["code"] = "".join(field["code"]).strip()
                fields.append(field)
        elif element.tag == W("instrText") and stack:
            stack[-1]["code"].append(element.text or "")
        elif element.tag == W("t") and stack and stack[-1]["separated"]:
            stack[-1]["result_nodes"].append(element)
    return fields


def protected_text_nodes(
    paragraph: etree._Element,
) -> set[etree._Element]:
    protected: set[etree._Element] = set()
    depth = 0
    for element in paragraph.iter():
        if element.tag == W("fldChar"):
            kind = element.get(W("fldCharType"))
            if kind == "begin":
                depth += 1
            elif kind == "end":
                depth = max(depth - 1, 0)
        elif element.tag == W("t") and depth:
            protected.add(element)
    for hyperlink in paragraph.xpath(".//w:hyperlink[@r:id]", namespaces=NS):
        protected.update(hyperlink.xpath(".//w:t", namespaces=NS))
    return protected


CJK_RE = re.compile(r"[\u3400-\u9fff\u3000-\u303f\uff00-\uffef]")
LATINLIKE_RE = re.compile(r"[A-Za-z0-9δΔαβγΓμµΩ′″]")
UNIT_RE = re.compile(
    r"(?:km|cm|mm|m|g/cm|g|μg/g|µg/g|MPa|kPa|Pa|Ma|ppm|STP|°C)\b",
    re.IGNORECASE,
)
CHINESE_PUNCT = "，。；：？！、）】」』"
OPEN_PUNCT = "（【「『"
CLOSE_PUNCT = "）】」』)]}"


def is_cjk(char: str) -> bool:
    return bool(char and CJK_RE.fullmatch(char))


def is_latinlike(char: str) -> bool:
    return bool(char and LATINLIKE_RE.fullmatch(char))


def normalize_paragraph_text(
    paragraph: etree._Element,
    *,
    role: str,
    skip: bool,
) -> int:
    if skip:
        return 0

    nodes = xml_text_nodes_in_order(paragraph)
    if not nodes:
        return 0
    protected = protected_text_nodes(paragraph)

    items: list[dict[str, Any]] = []
    for node in nodes:
        value = node.text or ""
        for index, char in enumerate(value):
            items.append(
                {
                    "node": node,
                    "index": index,
                    "char": " " if char in ("\u00a0", "\u3000") else char,
                    "protected": node in protected,
                    "delete": False,
                }
            )

    caption_delimiter_index: int | None = None
    plain = "".join(item["char"] for item in items)
    if role in {"image_caption", "table_caption"}:
        caption_match = re.match(
            r"^(图|表)\s*(\d+)\s*[:：]?\s*",
            plain,
        )
        if caption_match:
            kind_start, kind_end = caption_match.span(1)
            number_start, number_end = caption_match.span(2)
            delimiter_candidates = list(
                range(number_end, caption_match.end())
            )
            delimiter_index = next(
                (
                    index
                    for index in delimiter_candidates
                    if items[index]["char"].isspace()
                ),
                delimiter_candidates[0] if delimiter_candidates else None,
            )
            protected_indexes = set(range(kind_start, kind_end))
            protected_indexes.update(range(number_start, number_end))
            if delimiter_index is not None:
                caption_delimiter_index = delimiter_index
                protected_indexes.add(delimiter_index)
                items[delimiter_index]["char"] = " "
            for index in range(caption_match.end()):
                if index not in protected_indexes:
                    items[index]["delete"] = True
            plain = "".join(
                item["char"] for item in items if not item["delete"]
            )

    keep_spaces: set[int] = set()
    if role in {"heading2", "heading3"}:
        match = re.match(r"^\d+(?:\.\d+)*(\s+)", plain)
        if match:
            keep_spaces.add(match.start(1))
    if role in {"image_caption", "table_caption"}:
        if caption_delimiter_index is not None:
            keep_spaces.add(caption_delimiter_index)

    changed = 0
    punctuation_map = {
        ",": "，",
        ";": "；",
        ":": "：",
        "?": "？",
        "!": "！",
    }

    for index, item in enumerate(items):
        if item["protected"]:
            continue
        char = item["char"]
        prev_char = items[index - 1]["char"] if index else ""
        next_char = items[index + 1]["char"] if index + 1 < len(items) else ""

        if char == "(" and (is_cjk(prev_char) or is_cjk(next_char)):
            item["char"] = "（"
            changed += 1
        elif char == ")" and (is_cjk(prev_char) or is_cjk(next_char)):
            item["char"] = "）"
            changed += 1
        elif char in punctuation_map and (
            is_cjk(prev_char) or is_cjk(next_char)
        ):
            item["char"] = punctuation_map[char]
            changed += 1
        elif char == "." and is_cjk(prev_char):
            item["char"] = "。"
            changed += 1

    for index, item in enumerate(items):
        if item["protected"] or item["char"] != " ":
            continue
        if index in keep_spaces:
            continue

        prev_index = index - 1
        while prev_index >= 0 and items[prev_index]["delete"]:
            prev_index -= 1
        next_index = index + 1
        while next_index < len(items) and items[next_index]["char"] == " ":
            next_index += 1
        prev_char = items[prev_index]["char"] if prev_index >= 0 else ""
        next_char = items[next_index]["char"] if next_index < len(items) else ""
        tail = "".join(entry["char"] for entry in items[next_index : next_index + 12])

        remove = False
        if not prev_char or not next_char:
            remove = True
        elif index + 1 < len(items) and items[index + 1]["char"] == " ":
            remove = True
        elif (
            next_char in CHINESE_PUNCT
            or prev_char in OPEN_PUNCT
            or prev_char in CHINESE_PUNCT
            or (prev_char in CLOSE_PUNCT and is_cjk(next_char))
        ):
            remove = True
        elif prev_char.isdigit() and next_char == "%":
            remove = True
        elif prev_char.isdigit() and UNIT_RE.match(tail):
            remove = False
        elif (is_cjk(prev_char) and (is_latinlike(next_char) or next_char.isdigit())):
            remove = True
        elif ((is_latinlike(prev_char) or prev_char.isdigit()) and is_cjk(next_char)):
            remove = True
        elif is_cjk(prev_char) and is_cjk(next_char):
            remove = True

        if remove:
            item["delete"] = True
            changed += 1

    by_node: dict[etree._Element, list[str]] = {
        node: [] for node in nodes
    }
    for item in items:
        if not item["delete"]:
            by_node[item["node"]].append(item["char"])

    for node, chars in by_node.items():
        value = "".join(chars)
        node.text = value
        if value[:1].isspace() or value[-1:].isspace():
            node.set(f"{{{XML_NS}}}space", "preserve")
        else:
            node.attrib.pop(f"{{{XML_NS}}}space", None)
    return changed


def split_quote_runs(
    root: etree._Element,
    *,
    format_config: dict[str, Any],
) -> int:
    quote_chars = set("“”‘’")
    split_count = 0
    runs = list(root.xpath(".//w:r", namespaces=NS))
    for run in runs:
        if run.xpath("./w:instrText|./w:fldChar|./w:drawing", namespaces=NS):
            continue
        text_nodes = run.findall(W("t"))
        if len(text_nodes) != 1:
            continue
        value = text_nodes[0].text or ""
        if not any(char in quote_chars for char in value):
            continue
        groups: list[tuple[str, bool]] = []
        start = 0
        current_quote = value[0] in quote_chars
        for index in range(1, len(value) + 1):
            boundary = index == len(value)
            next_quote = value[index] in quote_chars if not boundary else None
            if boundary or next_quote != current_quote:
                groups.append((value[start:index], current_quote))
                start = index
                current_quote = bool(next_quote)
        if len(groups) == 1:
            rpr = get_or_add(run, W("rPr"))
            set_fonts(
                rpr,
                east_asia=str(format_config["east_asia_font"]),
                western=str(format_config["east_asia_font"]),
            )
            continue

        parent = run.getparent()
        position = parent.index(run)
        replacements: list[etree._Element] = []
        for segment, is_quote in groups:
            clone = copy.deepcopy(run)
            clone_text = clone.find(W("t"))
            clone_text.text = segment
            if segment[:1].isspace() or segment[-1:].isspace():
                clone_text.set(f"{{{XML_NS}}}space", "preserve")
            else:
                clone_text.attrib.pop(f"{{{XML_NS}}}space", None)
            if is_quote:
                rpr = get_or_add(clone, W("rPr"))
                if clone.index(rpr) != 0:
                    clone.remove(rpr)
                    clone.insert(0, rpr)
                set_fonts(
                    rpr,
                    east_asia=str(format_config["east_asia_font"]),
                    western=str(format_config["east_asia_font"]),
                )
            replacements.append(clone)
        parent.remove(run)
        for offset, clone in enumerate(replacements):
            parent.insert(position + offset, clone)
        split_count += 1
    return split_count


def inject_metadata(text: str) -> str:
    lines = text.splitlines()
    if lines and lines[0].strip() == "---":
        for index in range(1, len(lines)):
            if lines[index].strip() == "---":
                additions: list[str] = []
                if not any(
                    re.match(r"^\s*linkReferences\s*:", line)
                    for line in lines[1:index]
                ):
                    additions.append("linkReferences: true")
                if not any(
                    re.match(r"^\s*zotero[-_]client\s*:", line)
                    for line in lines[1:index]
                ):
                    additions.append("zotero-client: zotero")
                lines[index:index] = additions
                return "\n".join(lines) + "\n"
    return (
        "---\n"
        "linkReferences: true\n"
        "zotero-client: zotero\n"
        "---\n\n"
        + text
    )


NOTE_PREFIX_PATTERN = re.compile(
    r"^(?:(?:注|备注)\s*[：:]|(?:notes?)\s*[：:])",
    flags=re.IGNORECASE,
)


def is_note_paragraph_text(text: str) -> bool:
    return bool(NOTE_PREFIX_PATTERN.match(text.strip()))


def visible_markdown_heading(text: str) -> str:
    value = re.sub(r"\s+#+\s*$", "", text.strip())
    return re.sub(r"[*_`~]", "", value).strip()


def suppress_frontmatter_title_when_h1_exists(
    text: str,
) -> tuple[str, str, bool]:
    """Keep the body H1 as the sole exported title.

    Obsidian's frontmatter title remains untouched in the source file. Only
    the temporary export copy drops the scalar ``title:`` entry when a body H1
    exists, preventing Pandoc from emitting both a metadata title and the H1.
    """
    lines = text.splitlines()
    frontmatter_end: int | None = None
    body_start = 0
    if lines and lines[0].strip() == "---":
        for index in range(1, len(lines)):
            if lines[index].strip() == "---":
                frontmatter_end = index
                body_start = index + 1
                break

    document_title = ""
    for line in lines[body_start:]:
        match = re.match(r"^\s*#\s+(.+?)\s*$", line)
        if match:
            document_title = visible_markdown_heading(match.group(1))
            break
    metadata_title = ""
    if frontmatter_end is not None:
        for line in lines[1:frontmatter_end]:
            match = re.match(
                r"^\s*title\s*:\s*(.*?)\s*$",
                line,
                flags=re.IGNORECASE,
            )
            if match and match.group(1) not in ("", "|", ">", "|-", ">-"):
                metadata_title = match.group(1).strip().strip("\"'")
                break
    if not document_title:
        return text, metadata_title, False
    if frontmatter_end is None:
        return text, document_title, False

    removed = False
    for index in range(1, frontmatter_end):
        if re.match(r"^\s*title\s*:", lines[index], flags=re.IGNORECASE):
            del lines[index]
            removed = True
            break
    suffix = "\n" if text.endswith("\n") else ""
    return "\n".join(lines) + suffix, document_title, removed


def count_markdown_note_paragraphs(text: str) -> int:
    lines = text.splitlines()
    in_frontmatter = bool(lines and lines[0].strip() == "---")
    in_fence = False
    count = 0
    for index, line in enumerate(lines):
        if index == 0 and in_frontmatter:
            continue
        if in_frontmatter:
            if line.strip() == "---":
                in_frontmatter = False
            continue
        if re.match(r"^\s*(```+|~~~+)", line):
            in_fence = not in_fence
            continue
        if not in_fence and is_note_paragraph_text(line):
            count += 1
    return count


def convert_obsidian_image_embeds(text: str) -> str:
    pattern = re.compile(r"!\[\[([^\]|]+)(?:\|([^\]]+))?\]\]")

    def replace(match: re.Match[str]) -> str:
        target = match.group(1).strip()
        size = (match.group(2) or "").strip()
        attr = ""
        if size and size.isdigit():
            attr = f'{{width="{size}px"}}'
        return f"![]({target}){attr}"

    return pattern.sub(replace, text)


def normalize_markdown_citation_spacing(text: str) -> tuple[str, int]:
    """Remove ordinary spaces around bracketed citations in prose.

    The source Markdown remains untouched; this operates only on the temporary
    export copy. Fenced code blocks are excluded.
    """
    lines = text.splitlines()
    in_fence = False
    changes = 0
    output: list[str] = []
    fence_pattern = re.compile(r"^\s*(```+|~~~+)")
    for line in lines:
        if fence_pattern.match(line):
            in_fence = not in_fence
            output.append(line)
            continue
        if in_fence:
            output.append(line)
            continue
        line, before_count = re.subn(
            r"(?<=\S)[ \t]+(?=\[@[^\]\r\n]+\])",
            "",
            line,
        )
        line, after_count = re.subn(
            r"(\[@[^\]\r\n]+\])[ \t]+(?=[\u3400-\u9fff，。；：？！、])",
            r"\1",
            line,
        )
        changes += before_count + after_count
        output.append(line)
    return "\n".join(output) + ("\n" if text.endswith("\n") else ""), changes


def strip_static_bibliography(text: str) -> tuple[str, bool]:
    lines = text.splitlines()
    in_frontmatter = bool(lines and lines[0].strip() == "---")
    found = False
    output: list[str] = []
    for index, line in enumerate(lines):
        if index == 0 and in_frontmatter:
            output.append(line)
            continue
        if in_frontmatter:
            output.append(line)
            if line.strip() == "---":
                in_frontmatter = False
            continue
        if re.match(r"^\s*##\s+参考文献\s*$", line):
            output.append("## 参考文献")
            found = True
            break
        output.append(line)
    if not found:
        output.extend(["", "## 参考文献"])
    return "\n".join(output).rstrip() + "\n", found


def previous_nonempty(lines: list[str], index: int) -> str:
    for cursor in range(index - 1, -1, -1):
        if lines[cursor].strip():
            return lines[cursor].strip()
    return ""


def next_nonempty(lines: list[str], index: int) -> str:
    for cursor in range(index + 1, len(lines)):
        if lines[cursor].strip():
            return lines[cursor].strip()
    return ""


def label_numbered_equations(text: str) -> tuple[str, list[int]]:
    lines = text.splitlines()
    delimiter_indexes = [
        index
        for index, line in enumerate(lines)
        if re.match(r"^\$\$(?:\s+\{#eq:[^}]+\})?\s*$", line.strip())
    ]
    if len(delimiter_indexes) % 2:
        raise ExportError("Markdown 行间公式的 $$ 分隔符数量不是偶数")

    assigned: list[int] = []
    for pair in range(0, len(delimiter_indexes), 2):
        opening = delimiter_indexes[pair]
        closing = delimiter_indexes[pair + 1]
        before = previous_nonempty(lines, opening)
        after = next_nonempty(lines, closing)
        existing_label = re.match(
            r"^\$\$\s+\{#eq:[^}]+\}\s*$",
            lines[closing].strip(),
        )
        number: int | None = None
        equation_source = "\n".join(lines[opening + 1 : closing])
        explicit_tags = re.findall(
            r"\\tag\s*\{\s*(\d+)\s*\}", equation_source
        )
        if explicit_tags:
            number = int(explicit_tags[-1])
            for index in range(opening + 1, closing):
                lines[index] = re.sub(
                    r"\\tag\s*\{\s*\d+\s*\}",
                    "",
                    lines[index],
                ).rstrip()
        else:
            match_after = re.match(r"^式[（(](\d+)[）)]中", after)
            if match_after:
                number = int(match_after.group(1))
            else:
                matches_before = re.findall(
                    r"(?:见式|式)[（(](\d+)[）)]", before
                )
                if matches_before:
                    number = int(matches_before[-1])
        if existing_label and number is None:
            number = max(assigned, default=0) + 1
        if number is not None and number not in assigned:
            if not existing_label:
                lines[closing] = f"$$ {{#eq:paperbell-{number}}}"
            assigned.append(number)
    return "\n".join(lines) + "\n", assigned


def prepare_markdown(source: str) -> tuple[str, dict[str, Any]]:
    prepared, document_title, frontmatter_title_suppressed = (
        suppress_frontmatter_title_when_h1_exists(source)
    )
    note_paragraphs = count_markdown_note_paragraphs(prepared)
    prepared = inject_metadata(prepared)
    prepared = convert_obsidian_image_embeds(prepared)
    prepared, citation_space_changes = normalize_markdown_citation_spacing(
        prepared
    )
    prepared, removed_static_refs = strip_static_bibliography(prepared)
    prepared, equation_numbers = label_numbered_equations(prepared)
    return prepared, {
        "static_references_removed": removed_static_refs,
        "equation_numbers": equation_numbers,
        "citation_space_changes": citation_space_changes,
        "document_title": document_title,
        "frontmatter_title_suppressed": frontmatter_title_suppressed,
        "note_paragraphs": note_paragraphs,
    }


def walk_ast(node: Any) -> Iterable[dict[str, Any]]:
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk_ast(value)
    elif isinstance(node, list):
        for value in node:
            yield from walk_ast(value)


def pandoc_ast(
    pandoc: Path,
    markdown: Path,
    *,
    cwd: Path,
    resource_path: str,
) -> dict[str, Any]:
    command = [
        str(pandoc),
        str(markdown),
        "--from",
        "markdown+raw_html+tex_math_dollars",
        "--to",
        "json",
        "--resource-path",
        resource_path,
    ]
    result = subprocess.run(
        command,
        cwd=cwd,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
    )
    if result.returncode:
        raise ExportError(
            "Pandoc 无法解析 Markdown：\n"
            + (result.stderr or result.stdout)
        )
    return json.loads(result.stdout)


def ast_inventory(ast: dict[str, Any]) -> dict[str, Any]:
    citation_clusters = 0
    citekeys: list[str] = []
    image_targets: list[str] = []
    math_count = 0
    display_math_count = 0
    table_count = 0
    headers: list[str] = []

    for node in walk_ast(ast):
        kind = node.get("t")
        content = node.get("c")
        if kind == "Cite":
            # Pandoc parses @fig:..., @tbl:... and @eq:... as Cite nodes
            # before pandoc-crossref handles them.  They are document
            # cross-references, not Zotero citekeys, and must never be sent to
            # Better BibTeX.
            zotero_citations = [
                citation
                for citation in content[0]
                if not re.match(
                    r"^(?:fig|tbl|eq):",
                    citation.get("citationId", ""),
                    re.IGNORECASE,
                )
            ]
            if zotero_citations:
                citation_clusters += 1
                for citation in zotero_citations:
                    citekeys.append(citation["citationId"])
        elif kind == "Image":
            image_targets.append(content[2][0])
        elif kind == "Math":
            math_count += 1
            math_kind = content[0].get("t")
            if math_kind == "DisplayMath":
                display_math_count += 1
        elif kind == "Table":
            table_count += 1
        elif kind == "Header":
            level = content[0]
            text = stringify_inlines(content[2])
            headers.append(f"{level}:{text}")

    return {
        "citation_clusters": citation_clusters,
        "citekeys": sorted(set(citekeys)),
        "image_targets": image_targets,
        "math_count": math_count,
        "display_math_count": display_math_count,
        "table_count": table_count,
        "headers": headers,
    }


def unresolved_citation_cluster_count(
    ast: dict[str, Any],
    missing_citekeys: list[str],
) -> int:
    missing = set(missing_citekeys)
    if not missing:
        return 0
    count = 0
    for node in walk_ast(ast):
        if node.get("t") != "Cite":
            continue
        citations = node.get("c", [[], []])[0]
        zotero_ids = {
            citation.get("citationId", "")
            for citation in citations
            if not re.match(
                r"^(?:fig|tbl|eq):",
                citation.get("citationId", ""),
                re.IGNORECASE,
            )
        }
        if zotero_ids & missing:
            count += 1
    return count


def text_to_inlines(text: str) -> list[dict[str, Any]]:
    inlines: list[dict[str, Any]] = []
    for part in re.split(r"(\s+)", text):
        if not part:
            continue
        if part.isspace():
            inlines.append({"t": "Space"})
        else:
            inlines.append({"t": "Str", "c": part})
    return inlines


def citation_placeholder_text(citations: list[dict[str, Any]]) -> str:
    values: list[str] = []
    author_in_text = len(citations) == 1 and (
        citations[0].get("citationMode", {}).get("t") == "AuthorInText"
    )
    for citation in citations:
        prefix = stringify_inlines(citation.get("citationPrefix", []))
        suffix = stringify_inlines(citation.get("citationSuffix", []))
        value = f"@{citation.get('citationId', '')}"
        if prefix:
            value = f"{prefix} {value}"
        if suffix:
            value = f"{value}, {suffix}"
        values.append(value)
    joined = "; ".join(values)
    return joined if author_in_text else f"[{joined}]"


def split_missing_citations_in_ast(
    ast: dict[str, Any],
    missing_citekeys: list[str],
) -> dict[str, Any]:
    """Keep known citations live while turning only missing items into text."""
    missing = set(missing_citekeys)
    if not missing:
        return ast

    def rewrite(value: Any) -> Any:
        if isinstance(value, list):
            rewritten: list[Any] = []
            for item in value:
                if isinstance(item, dict) and item.get("t") == "Cite":
                    citations = item.get("c", [[], []])[0]
                    unresolved = [
                        citation
                        for citation in citations
                        if citation.get("citationId", "") in missing
                    ]
                    if unresolved:
                        resolved = [
                            citation
                            for citation in citations
                            if citation.get("citationId", "") not in missing
                        ]
                        if resolved:
                            rewritten.append(
                                {
                                    "t": "Cite",
                                    "c": [
                                        resolved,
                                        text_to_inlines(
                                            citation_placeholder_text(resolved)
                                        ),
                                    ],
                                }
                            )
                            rewritten.append({"t": "Space"})
                        rewritten.extend(
                            text_to_inlines(
                                citation_placeholder_text(unresolved)
                            )
                        )
                        continue
                rewritten.append(rewrite(item))
            return rewritten
        if isinstance(value, dict):
            return {key: rewrite(child) for key, child in value.items()}
        return value

    return rewrite(copy.deepcopy(ast))


def stringify_inlines(node: Any) -> str:
    pieces: list[str] = []
    for part in walk_ast(node):
        if part.get("t") == "Str":
            pieces.append(part.get("c", ""))
        elif part.get("t") in ("Space", "SoftBreak", "LineBreak"):
            pieces.append(" ")
    return "".join(pieces).strip()


def resolve_image(
    target: str,
    *,
    vault_root: Path,
    md_parent: Path,
) -> Path | None:
    if re.match(r"^(?:https?|data):", target, re.IGNORECASE):
        return None
    clean = target.split("#", 1)[0].strip().strip("<>")
    clean = urllib.parse.unquote(clean)
    if clean.startswith("file://"):
        clean = urllib.parse.urlparse(clean).path
    path = Path(clean)
    candidates = (
        [path] if path.is_absolute() else [vault_root / path, md_parent / path]
    )
    for candidate in candidates:
        if candidate.is_file():
            return candidate.resolve()
    return candidates[0].resolve()


def check_images(
    targets: list[str],
    *,
    vault_root: Path,
    md_parent: Path,
) -> tuple[list[Path], list[str]]:
    resolved: list[Path] = []
    missing: list[str] = []
    for target in targets:
        path = resolve_image(
            target, vault_root=vault_root, md_parent=md_parent
        )
        if path is None:
            continue
        if not path.is_file():
            missing.append(f"{target} -> {path}")
        else:
            resolved.append(path)
    return resolved, missing


def bbt_fetch_chunk(citekeys: list[str]) -> dict[str, Any]:
    request = {
        "jsonrpc": "2.0",
        "method": "item.pandoc_filter",
        "params": {
            "style": "apa",
            "asCSL": True,
            "citekeys": citekeys,
        },
        "id": 1,
    }
    encoded = urllib.parse.quote(
        json.dumps(request, ensure_ascii=False, separators=(",", ":"))
    )
    url = (
        "http://127.0.0.1:23119/better-bibtex/json-rpc?" + encoded
    )
    try:
        with urllib.request.urlopen(url, timeout=12) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        raise ExportError(
            "无法连接 Zotero Better BibTeX。请先启动 Zotero，并确认 "
            "Better BibTeX JSON-RPC 可用。\n"
            f"原始错误：{exc}"
        ) from exc
    if payload.get("error"):
        raise ExportError(
            "Zotero Better BibTeX 返回错误："
            + str(payload["error"].get("message", payload["error"]))
        )
    return payload.get("result", {})


def check_citekeys(citekeys: list[str]) -> tuple[list[str], list[str]]:
    if not citekeys:
        return [], []
    missing: list[str] = []
    duplicates: list[str] = []
    for start in range(0, len(citekeys), 25):
        chunk = citekeys[start : start + 25]
        result = bbt_fetch_chunk(chunk)
        errors = result.get("errors", {})
        items = result.get("items", {})
        for key in chunk:
            if key in errors:
                if errors[key] == 0:
                    missing.append(key)
                else:
                    duplicates.append(key)
            elif key not in items:
                missing.append(key)
    return missing, duplicates


def bbt_search(citekey: str) -> list[dict[str, Any]]:
    request = {
        "jsonrpc": "2.0",
        "method": "item.search",
        "params": [citekey],
        "id": 1,
    }
    encoded = urllib.parse.quote(
        json.dumps(request, ensure_ascii=False, separators=(",", ":"))
    )
    url = "http://127.0.0.1:23119/better-bibtex/json-rpc?" + encoded
    try:
        with urllib.request.urlopen(url, timeout=12) as response:
            payload = json.loads(response.read().decode("utf-8"))
    except Exception as exc:
        raise ExportError(
            f"无法读取重复 citekey @{citekey} 的 Zotero 条目：{exc}"
        ) from exc
    if payload.get("error"):
        raise ExportError(
            f"查询重复 citekey @{citekey} 失败：{payload['error']}"
        )
    result = payload.get("result", [])
    return result if isinstance(result, list) else []


def zotero_numeric_item_id(uri: str) -> int | None:
    item_key = uri.rstrip("/").rsplit("/", 1)[-1]
    database = Path.home() / "Zotero" / "zotero.sqlite"
    if not database.is_file():
        return None
    connection: sqlite3.Connection | None = None
    try:
        database_uri = database.resolve().as_uri() + "?mode=ro&immutable=1"
        connection = sqlite3.connect(database_uri, uri=True)
        row = connection.execute(
            "SELECT itemID FROM items WHERE key = ?", (item_key,)
        ).fetchone()
        return int(row[0]) if row else None
    except Exception:
        return None
    finally:
        if connection is not None:
            connection.close()


def duplicate_record_fingerprint(record: dict[str, Any]) -> tuple[str, ...]:
    doi = str(record.get("DOI", "")).strip().lower()
    title = re.sub(
        r"\s+",
        " ",
        str(record.get("title", "")).strip().lower(),
    )
    issued = record.get("issued", {})
    date_parts = issued.get("date-parts", []) if isinstance(issued, dict) else []
    year = ""
    if date_parts and date_parts[0]:
        year = str(date_parts[0][0])
    return doi, title, year


def resolve_exact_duplicate_citekeys(
    citekeys: list[str],
) -> dict[str, dict[str, Any]]:
    """Resolve only bibliographically identical duplicate Zotero records.

    The Markdown citekey remains unchanged.  A temporary copy of zotero.lua is
    supplied one chosen record, including its stable Zotero URI, so Word gets a
    normal refreshable field.  Conflicting records remain a hard failure.
    """
    forced: dict[str, dict[str, Any]] = {}
    for citekey in citekeys:
        records = [
            record
            for record in bbt_search(citekey)
            if record.get("citation-key") == citekey
            or record.get("citekey") == citekey
        ]
        if len(records) < 2:
            raise ExportError(
                f"@{citekey} 被报告为重复，但无法取得两个候选条目"
            )
        fingerprints = {
            duplicate_record_fingerprint(record) for record in records
        }
        dois = {fingerprint[0] for fingerprint in fingerprints if fingerprint[0]}
        same_doi = len(dois) == 1 and all(
            fingerprint[0] for fingerprint in fingerprints
        )
        same_title_year = len(
            {(fingerprint[1], fingerprint[2]) for fingerprint in fingerprints}
        ) == 1
        if not (same_doi or same_title_year):
            raise ExportError(
                f"Zotero citekey @{citekey} 对应不同文献，"
                "无法安全自动选择；请先在 Zotero 中修正"
            )

        selected = copy.deepcopy(records[0])
        uri = str(selected.pop("id", "")).strip()
        if not uri.startswith("http://zotero.org/"):
            raise ExportError(
                f"@{citekey} 的候选条目缺少稳定 Zotero URI"
            )
        numeric_id = zotero_numeric_item_id(uri)
        item_key = uri.rstrip("/").rsplit("/", 1)[-1]
        selected.pop("library", None)
        selected.pop("citekey", None)
        selected["id"] = citekey
        authors = selected.get("author", [])
        first_family = ""
        if authors and isinstance(authors[0], dict):
            first_family = str(authors[0].get("family", ""))
        selected["custom"] = {
            "itemID": numeric_id if numeric_id is not None else item_key,
            "uri": uri,
            "author": (first_family + "等") if first_family else "",
        }
        forced[citekey] = selected
    return forced


def make_resolved_zotero_filter(
    source: Path,
    target: Path,
    forced_items: dict[str, dict[str, Any]],
) -> Path:
    if not forced_items:
        return source
    lua = source.read_text(encoding="utf-8")
    marker = "  state.fetched = response.result\n"
    if lua.count(marker) != 1:
        raise ExportError("无法为当前 zotero.lua 注入重复条目解析")
    payload = json.dumps(
        forced_items, ensure_ascii=False, separators=(",", ":")
    )
    if "]==]" in payload:
        raise ExportError("重复条目数据包含无法安全写入 Lua 的定界符")
    injection = (
        marker
        + "  local codex_forced = json.decode([==["
        + payload
        + "]==])\n"
        + "  for citekey, itemData in pairs(codex_forced) do\n"
        + "    state.fetched.errors[citekey] = nil\n"
        + "    state.fetched.items[citekey] = itemData\n"
        + "  end\n"
    )
    target.write_text(lua.replace(marker, injection), encoding="utf-8")
    return target


_MARKDOWN_ESCAPED_PUNCTUATION = re.compile(
    r"""\\([!"#$%&'()*+,\-./:;<=>?@\[\]^_`{|}~\\])"""
)


def script_visible_text(value: str) -> str:
    """Return the text that Pandoc renders inside an HTML sub/sup tag."""
    text = re.sub(r"<[^>]+>", "", value)
    text = _MARKDOWN_ESCAPED_PUNCTUATION.sub(r"\1", text)
    return html.unescape(text)


def source_script_counts(markdown: str) -> dict[str, int]:
    return {
        "subscript_tags": len(
            re.findall(r"(?is)<\s*sub(?:\s+[^>]*)?>", markdown)
        ),
        "superscript_tags": len(
            re.findall(r"(?is)<\s*sup(?:\s+[^>]*)?>", markdown)
        ),
        "subscript_chars": sum(
            len(script_visible_text(value))
            for value in re.findall(
                r"(?is)<\s*sub(?:\s+[^>]*)?>(.*?)<\s*/\s*sub\s*>",
                markdown,
            )
        ),
        "superscript_chars": sum(
            len(script_visible_text(value))
            for value in re.findall(
                r"(?is)<\s*sup(?:\s+[^>]*)?>(.*?)<\s*/\s*sup\s*>",
                markdown,
            )
        ),
    }


def patch_section(
    document_root: etree._Element,
    *,
    format_config: dict[str, Any],
) -> None:
    margin = str(cm_twips(float(format_config["margin_cm"])))
    for sect_pr in document_root.xpath(".//w:sectPr", namespaces=NS):
        pg_sz = get_or_add(sect_pr, W("pgSz"))
        pg_sz.attrib.clear()
        pg_sz.set(W("w"), "11906")
        pg_sz.set(W("h"), "16838")
        pg_mar = get_or_add(sect_pr, W("pgMar"))
        pg_mar.attrib.clear()
        for side in ("top", "right", "bottom", "left"):
            pg_mar.set(W(side), margin)
        pg_mar.set(W("header"), "720")
        pg_mar.set(W("footer"), "720")
        pg_mar.set(W("gutter"), "0")
        pg_num = get_or_add(sect_pr, W("pgNumType"))
        pg_num.set(W("start"), "1")
        remove_direct(sect_pr, W("lnNumType"))
        remove_direct(sect_pr, W("titlePg"))


def patch_settings(settings_root: etree._Element) -> None:
    for tag in ("evenAndOddHeaders", "trackRevisions", "updateFields"):
        remove_direct(settings_root, W(tag))


def insert_bibliography_field(
    document_root: etree._Element,
    *,
    bibliography_style_id: str,
    format_config: dict[str, Any],
) -> bool:
    body = document_root.find(W("body"))
    if body is None:
        raise ExportError("输出 Word 缺少正文 body")
    reference_heading: etree._Element | None = None
    for child in list(body):
        if child.tag == W("p") and paragraph_text(child) == "参考文献":
            reference_heading = child
            break
    if reference_heading is None:
        raise ExportError("输出 Word 中未找到“参考文献”标题")

    children = list(body)
    heading_index = children.index(reference_heading)
    for child in children[heading_index + 1 :]:
        if child.tag != W("sectPr"):
            body.remove(child)

    paragraph = etree.Element(W("p"))
    ppr = etree.SubElement(paragraph, W("pPr"))
    etree.SubElement(ppr, W("pStyle")).set(
        W("val"), bibliography_style_id
    )
    set_paragraph_format(
        paragraph,
        alignment="both",
        before=0,
        after=0,
        line=line_twips(float(format_config["body_line_spacing"])),
        first_line=0,
    )

    begin = etree.SubElement(paragraph, W("r"))
    etree.SubElement(begin, W("fldChar")).set(W("fldCharType"), "begin")
    code_run = etree.SubElement(paragraph, W("r"))
    code = etree.SubElement(code_run, W("instrText"))
    code.set(f"{{{XML_NS}}}space", "preserve")
    code.text = (
        ' ADDIN ZOTERO_BIBL {"uncited":[],"omitted":[],"custom":[]} '
        "CSL_BIBLIOGRAPHY "
    )
    separate = etree.SubElement(paragraph, W("r"))
    etree.SubElement(separate, W("fldChar")).set(
        W("fldCharType"), "separate"
    )
    result_run = etree.SubElement(paragraph, W("r"))
    rpr = etree.SubElement(result_run, W("rPr"))
    set_fonts(
        rpr,
        east_asia=str(format_config["east_asia_font"]),
        western=str(format_config["western_font"]),
    )
    set_size(rpr, float(format_config["body_size_pt"]))
    text = etree.SubElement(result_run, W("t"))
    text.text = "<Bibliography: Do Zotero Refresh>"
    end = etree.SubElement(paragraph, W("r"))
    etree.SubElement(end, W("fldChar")).set(W("fldCharType"), "end")
    body.insert(heading_index + 1, paragraph)
    return True


def set_cell_borders(
    cell: etree._Element,
    *,
    first_row: bool,
    last_row: bool,
) -> None:
    tcpr = direct(cell, W("tcPr"))
    if tcpr is None:
        tcpr = etree.Element(W("tcPr"))
        cell.insert(0, tcpr)
    remove_direct(tcpr, W("tcBorders"))
    borders = etree.SubElement(tcpr, W("tcBorders"))
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        border = etree.SubElement(borders, W(side))
        if side == "top" and first_row:
            border.set(W("val"), "single")
            border.set(W("sz"), "12")
            border.set(W("color"), "000000")
        elif side == "bottom" and (first_row or last_row):
            border.set(W("val"), "single")
            border.set(W("sz"), "6" if first_row and not last_row else "12")
            border.set(W("color"), "000000")
        else:
            border.set(W("val"), "nil")
        border.set(W("space"), "0")


def set_cell_no_borders(cell: etree._Element) -> None:
    tcpr = direct(cell, W("tcPr"))
    if tcpr is None:
        tcpr = etree.Element(W("tcPr"))
        cell.insert(0, tcpr)
    remove_direct(tcpr, W("tcBorders"))
    borders = etree.SubElement(tcpr, W("tcBorders"))
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        border = etree.SubElement(borders, W(side))
        border.set(W("val"), "nil")


def set_table_common(
    table: etree._Element,
    *,
    max_width_dxa: int,
    content_width: bool,
) -> None:
    tblpr = direct(table, W("tblPr"))
    if tblpr is None:
        tblpr = etree.Element(W("tblPr"))
        table.insert(0, tblpr)
    get_or_add(tblpr, W("jc")).set(W("val"), "center")
    width = get_or_add(tblpr, W("tblW"))
    width.attrib.clear()
    width.set(W("type"), "auto" if content_width else "dxa")
    width.set(W("w"), "0" if content_width else str(max_width_dxa))
    get_or_add(tblpr, W("tblLayout")).set(W("type"), "autofit")
    indent = get_or_add(tblpr, W("tblInd"))
    indent.set(W("type"), "dxa")
    indent.set(W("w"), "0")
    remove_direct(tblpr, W("tblBorders"))

    grid = direct(table, W("tblGrid"))
    if grid is not None:
        columns = grid.findall(W("gridCol"))
        widths = [
            int(column.get(W("w"), "0") or "0") for column in columns
        ]
        total = sum(widths)
        if total > max_width_dxa and total:
            scale = max_width_dxa / total
            for column, old_width in zip(columns, widths):
                column.set(W("w"), str(max(1, round(old_width * scale))))


def format_formal_table(
    table: etree._Element,
    *,
    compact_style_id: str,
    max_width_dxa: int,
    format_config: dict[str, Any],
) -> None:
    set_table_common(
        table, max_width_dxa=max_width_dxa, content_width=True
    )
    tblpr = direct(table, W("tblPr"))
    cell_margin = get_or_add(tblpr, W("tblCellMar"))
    cell_margin.clear()
    for side, value in (
        ("top", "60"),
        ("bottom", "60"),
        ("left", "100"),
        ("right", "100"),
    ):
        node = etree.SubElement(cell_margin, W(side))
        node.set(W("w"), value)
        node.set(W("type"), "dxa")

    rows = table.findall(W("tr"))
    for row_index, row in enumerate(rows):
        trpr = direct(row, W("trPr"))
        if trpr is None:
            trpr = etree.Element(W("trPr"))
            row.insert(0, trpr)
        set_on_off(trpr, "cantSplit", True)
        set_on_off(trpr, "tblHeader", row_index == 0)
        for cell in row.findall(W("tc")):
            tcpr = direct(cell, W("tcPr"))
            if tcpr is None:
                tcpr = etree.Element(W("tcPr"))
                cell.insert(0, tcpr)
            get_or_add(tcpr, W("vAlign")).set(W("val"), "center")
            set_cell_borders(
                cell,
                first_row=row_index == 0,
                last_row=row_index == len(rows) - 1,
            )
            for paragraph in cell.iter(W("p")):
                set_paragraph_style(paragraph, compact_style_id)
                set_paragraph_format(
                    paragraph,
                    alignment="center",
                    before=0,
                    after=0,
                    line=line_twips(
                        float(format_config["table_line_spacing"])
                    ),
                    first_line=0,
                    keep_lines=True,
                )
                for run in paragraph.iter(W("r")):
                    if run.find(W("t")) is not None:
                        set_run_visual(
                            run,
                            points=float(format_config["table_size_pt"]),
                            east_asia=str(format_config["east_asia_font"]),
                            western=str(format_config["western_font"]),
                        )


def format_equation_table(
    table: etree._Element,
    *,
    max_width_dxa: int,
    format_config: dict[str, Any],
) -> None:
    set_table_common(
        table, max_width_dxa=max_width_dxa, content_width=False
    )
    tblpr = direct(table, W("tblPr"))
    remove_direct(tblpr, W("tblBorders"))
    borders = etree.SubElement(tblpr, W("tblBorders"))
    for side in ("top", "left", "bottom", "right", "insideH", "insideV"):
        etree.SubElement(borders, W(side)).set(W("val"), "nil")
    rows = table.findall(W("tr"))
    for row in rows:
        trpr = direct(row, W("trPr"))
        if trpr is None:
            trpr = etree.Element(W("trPr"))
            row.insert(0, trpr)
        set_on_off(trpr, "cantSplit", True)
        cells = row.findall(W("tc"))
        for index, cell in enumerate(cells):
            set_cell_no_borders(cell)
            tcpr = direct(cell, W("tcPr"))
            get_or_add(tcpr, W("vAlign")).set(W("val"), "center")
            for paragraph in cell.iter(W("p")):
                set_paragraph_format(
                    paragraph,
                    alignment="right" if index == len(cells) - 1 else "center",
                    before=0,
                    after=0,
                    line=line_twips(
                        float(format_config["body_line_spacing"])
                    ),
                    first_line=0,
                    keep_lines=True,
                )
                if index == len(cells) - 1:
                    for run in paragraph.iter(W("r")):
                        if run.find(W("t")) is not None:
                            set_run_visual(
                                run,
                                points=float(format_config["formula_size_pt"]),
                                east_asia=str(
                                    format_config["east_asia_font"]
                                ),
                                western=str(
                                    format_config["western_font"]
                                ),
                            )


def wrap_numbered_display_equations(
    document_root: etree._Element,
    *,
    max_width_dxa: int,
    format_config: dict[str, Any],
    equation_numbers: list[int] | None = None,
) -> int:
    """Put numbered display equations in a borderless 2-cell layout.

    pandoc-crossref appends two EM QUAD characters and an ASCII ``(n)`` to
    the OMML equation. The first cell contains the centered formula and the
    narrow second cell contains the flush-right number.
    """
    wrapped = 0
    candidates = document_root.xpath(
        ".//w:p[./m:oMathPara]", namespaces=NS
    )
    for paragraph in candidates:
        math = paragraph.find("m:oMathPara/m:oMath", namespaces=NS)
        if math is None:
            continue
        children = list(math)
        split_index: int | None = None
        number = ""
        for index in range(len(children)):
            tail = "".join(
                children_part
                for child in children[index:]
                for children_part in child.xpath(
                    ".//m:t/text()", namespaces=NS
                )
            )
            match = re.fullmatch(r"\s*\((\d+)\)", tail)
            if match:
                split_index = index
                number = match.group(1)
                break
        if split_index is None:
            continue
        for child in children[split_index:]:
            math.remove(child)

        table = etree.Element(W("tbl"))
        tblpr = etree.SubElement(table, W("tblPr"))
        width = etree.SubElement(tblpr, W("tblW"))
        width.set(W("w"), str(max_width_dxa))
        width.set(W("type"), "dxa")
        grid = etree.SubElement(table, W("tblGrid"))
        number_width = 1080
        formula_width = max_width_dxa - number_width
        for column_width in (formula_width, number_width):
            etree.SubElement(grid, W("gridCol")).set(
                W("w"), str(column_width)
            )
        row = etree.SubElement(table, W("tr"))

        cells: list[etree._Element] = []
        for column_width in (formula_width, number_width):
            cell = etree.SubElement(row, W("tc"))
            tcpr = etree.SubElement(cell, W("tcPr"))
            tcw = etree.SubElement(tcpr, W("tcW"))
            tcw.set(W("w"), str(column_width))
            tcw.set(W("type"), "dxa")
            cells.append(cell)

        center_paragraph = etree.SubElement(cells[0], W("p"))
        for child in list(paragraph):
            if child.tag != W("pPr"):
                center_paragraph.append(child)
        display_number = (
            equation_numbers[wrapped]
            if equation_numbers is not None
            and wrapped < len(equation_numbers)
            else int(number)
        )
        number_paragraph = etree.SubElement(cells[1], W("p"))
        number_run = etree.SubElement(number_paragraph, W("r"))
        number_rpr = etree.SubElement(number_run, W("rPr"))
        set_fonts(
            number_rpr,
            east_asia=str(format_config["east_asia_font"]),
            western=str(format_config["western_font"]),
        )
        set_size(number_rpr, float(format_config["formula_size_pt"]))
        etree.SubElement(number_run, W("t")).text = f"（{display_number}）"

        parent = paragraph.getparent()
        parent.replace(paragraph, table)
        wrapped += 1
    return wrapped


def is_equation_layout_table(table: etree._Element) -> bool:
    """Identify pandoc-crossref's 1-row, 2-cell equation-number layout.

    A scientific data table may legitimately contain inline math, so the mere
    presence of OMML is not sufficient to classify it as an equation table.
    """
    rows = table.findall(W("tr"))
    if len(rows) != 1:
        return False
    cells = rows[0].findall(W("tc"))
    return len(cells) == 2 and bool(
        table.xpath(".//m:oMath", namespaces=NS)
    )


def format_math(
    document_root: etree._Element,
    *,
    compact_style_id: str,
    note_style_id: str,
    format_config: dict[str, Any],
) -> None:
    for math_run in document_root.xpath(".//m:r", namespaces=NS):
        points = float(format_config["formula_size_pt"])
        ancestor_tables = math_run.xpath(
            "ancestor::w:tbl[1]", namespaces=NS
        )
        if ancestor_tables and not is_equation_layout_table(
            ancestor_tables[0]
        ):
            points = float(format_config["table_size_pt"])
        ancestor_paragraphs = math_run.xpath(
            "ancestor::w:p[1]", namespaces=NS
        )
        if ancestor_paragraphs:
            paragraph_style = ancestor_paragraphs[0].xpath(
                "./w:pPr/w:pStyle/@w:val", namespaces=NS
            )
            if paragraph_style and paragraph_style[0] in {
                compact_style_id,
                note_style_id,
            }:
                points = (
                    float(format_config["note_size_pt"])
                    if paragraph_style[0] == note_style_id
                    else float(format_config["table_size_pt"])
                )
        w_rpr = direct(math_run, W("rPr"))
        if w_rpr is None:
            w_rpr = etree.Element(W("rPr"))
            insertion = 1 if direct(math_run, M("rPr")) is not None else 0
            math_run.insert(insertion, w_rpr)
        set_fonts(
            w_rpr,
            east_asia=str(format_config["western_font"]),
            western=str(format_config["western_font"]),
        )
        set_size(w_rpr, points)


def resize_inline_images(
    document_root: etree._Element,
    *,
    max_width_emu: int,
) -> int:
    resized = 0
    for inline in document_root.xpath(".//wp:inline", namespaces=NS):
        extent = inline.find("wp:extent", namespaces=NS)
        if extent is None:
            continue
        width = int(extent.get("cx", "0"))
        height = int(extent.get("cy", "0"))
        if width <= 0 or height <= 0 or width <= max_width_emu:
            continue
        scale = max_width_emu / width
        new_width = max_width_emu
        new_height = round(height * scale)
        extent.set("cx", str(new_width))
        extent.set("cy", str(new_height))
        for aext in inline.xpath(".//a:xfrm/a:ext", namespaces=NS):
            aext.set("cx", str(new_width))
            aext.set("cy", str(new_height))
        resized += 1
    return resized


def color_fields(document_root: etree._Element) -> dict[str, int]:
    counts = Counter()
    for field in field_inventory(document_root):
        code = field["code"].upper()
        if "ZOTERO_ITEM" in code:
            counts["ZOTERO_ITEM"] += 1
            for text_node in field["result_nodes"]:
                run = text_node.getparent()
                if run.tag == W("r"):
                    set_run_visual(
                        run,
                        points=None,
                        color="0000FF",
                        underline="none",
                    )
        elif "ZOTERO_BIBL" in code:
            counts["ZOTERO_BIBL"] += 1
            for text_node in field["result_nodes"]:
                run = text_node.getparent()
                if run.tag == W("r"):
                    set_run_visual(
                        run,
                        points=None,
                        color="000000",
                        underline="none",
                    )
        else:
            first = field["code"].split(maxsplit=1)[0] if field["code"] else ""
            counts[first or "(empty)"] += 1
    return dict(counts)


def style_missing_citation_placeholders(
    document_root: etree._Element,
    missing_citekeys: list[str],
) -> dict[str, int]:
    """Make unresolved compatibility-mode citekeys impossible to overlook."""
    counts: Counter[str] = Counter()
    for text_node in document_root.xpath(".//w:t", namespaces=NS):
        value = text_node.text or ""
        matched = [
            citekey
            for citekey in missing_citekeys
            if f"@{citekey}" in value
        ]
        if not matched:
            continue
        run = text_node.getparent()
        if run is None or run.tag != W("r"):
            ancestors = text_node.xpath("ancestor::w:r[1]", namespaces=NS)
            run = ancestors[0] if ancestors else None
        if run is None:
            continue
        set_run_visual(
            run,
            points=None,
            color="C00000",
            underline="single",
        )
        rpr = get_or_add(run, W("rPr"))
        get_or_add(rpr, W("highlight")).set(W("val"), "yellow")
        set_on_off(rpr, "b", True)
        for citekey in matched:
            counts[citekey] += value.count(f"@{citekey}")
    return {citekey: counts[citekey] for citekey in missing_citekeys}


def style_hyperlinks(
    document_root: etree._Element,
    rels_root: etree._Element | None,
) -> dict[str, int]:
    targets: dict[str, tuple[str, str]] = {}
    if rels_root is not None:
        for rel in rels_root:
            targets[rel.get("Id")] = (
                rel.get("Target", ""),
                rel.get("TargetMode", ""),
            )
    counts = Counter()
    for hyperlink in document_root.xpath(".//w:hyperlink", namespaces=NS):
        rel_id = hyperlink.get(R("id"))
        anchor = hyperlink.get(W("anchor"))
        target, mode = targets.get(rel_id, ("", ""))
        internal = bool(anchor) or (
            mode != "External" and not re.match(r"^[a-z]+:", target)
        )
        counts["internal" if internal else "external"] += 1
        if internal:
            text_nodes = hyperlink.xpath(".//w:t", namespaces=NS)
            visible = "".join(node.text or "" for node in text_nodes)
            normalized = re.sub(
                r"^(图|表)\s*(\d+)\s*([a-z](?:[—–-][a-z])?)?$",
                lambda match: (
                    match.group(1)
                    + match.group(2)
                    + (match.group(3) or "")
                ),
                visible,
                flags=re.IGNORECASE,
            )
            if text_nodes and normalized != visible:
                text_nodes[0].text = normalized
                text_nodes[0].attrib.pop(f"{{{XML_NS}}}space", None)
                for node in text_nodes[1:]:
                    node.text = ""
                    node.attrib.pop(f"{{{XML_NS}}}space", None)
                counts["internal_text_normalized"] += 1
        for run in hyperlink.xpath(".//w:r", namespaces=NS):
            set_run_visual(
                run,
                points=None,
                color="000000" if internal else "0000FF",
                underline="none" if internal else "single",
            )
    return dict(counts)


def role_for_paragraph(
    paragraph: etree._Element,
    *,
    style_names: dict[str, str],
    in_highlights: bool,
) -> str:
    ppr = direct(paragraph, W("pPr"))
    style_id = None
    if ppr is not None:
        pstyle = direct(ppr, W("pStyle"))
        style_id = pstyle.get(W("val")) if pstyle is not None else None
    name = style_names.get(style_id, "")
    text = paragraph_text(paragraph)
    if text == "参考文献":
        return "reference_heading"
    if name.lower() in {"heading 1", "title"}:
        return "title"
    if name.lower() == "heading 2":
        return "heading2"
    if name.lower() == "heading 3":
        return "heading3"
    if name == "Image Caption":
        return "image_caption"
    if name == "Table Caption":
        return "table_caption"
    if paragraph.xpath(".//w:drawing|.//w:pict", namespaces=NS):
        return "picture"
    if is_note_paragraph_text(text):
        return "note"
    if text.startswith("关键词：") or text.startswith("关键词:"):
        return "keywords"
    if in_highlights:
        return "highlight_item"
    return "body"


def format_body_paragraphs(
    document_root: etree._Element,
    *,
    styles: dict[str, str],
    format_config: dict[str, Any],
) -> dict[str, int]:
    id_to_name = {value: key for key, value in styles.items()}
    ids = {
        "normal": get_style_id(styles, "Normal"),
        "body": get_style_id(styles, "Body Text"),
        "first": get_style_id(styles, "First Paragraph"),
        "title": get_style_id(styles, "heading 1", "Heading 1"),
        "heading2": get_style_id(styles, "heading 2", "Heading 2"),
        "heading3": get_style_id(styles, "heading 3", "Heading 3"),
        "picture": get_style_id(styles, "图片", "Body Text", "Normal"),
        "image_caption": get_style_id(styles, "Image Caption"),
        "table_caption": get_style_id(styles, "Table Caption"),
        "note": get_style_id(
            styles,
            "Figure Table Note",
            "Body Text",
            "Normal",
            "Compact",
        ),
        "bibliography": get_style_id(styles, "Bibliography"),
    }
    counts = Counter()
    in_highlights = False
    body = document_root.find(W("body"))
    if body is None:
        raise ExportError("输出 Word 缺少 body")

    for paragraph in body.iter(W("p")):
        if paragraph.xpath("ancestor::w:tbl", namespaces=NS):
            continue
        text = paragraph_text(paragraph)
        ppr = direct(paragraph, W("pPr"))
        style_id = None
        if ppr is not None:
            pstyle = direct(ppr, W("pStyle"))
            style_id = pstyle.get(W("val")) if pstyle is not None else None
        style_name = id_to_name.get(style_id, "")
        if style_name.lower() == "heading 2":
            in_highlights = text == "Highlights"
        role = role_for_paragraph(
            paragraph,
            style_names=id_to_name,
            in_highlights=in_highlights and style_name.lower() != "heading 2",
        )
        counts[role] += 1

        if role == "title":
            set_paragraph_style(paragraph, ids["title"])
            set_paragraph_format(
                paragraph,
                alignment="center",
                before=0,
                after=240,
                line=line_twips(float(format_config["title_line_spacing"])),
                first_line=0,
                keep_next=True,
                keep_lines=True,
            )
            size = float(format_config["title_size_pt"])
        elif role in ("heading2", "reference_heading"):
            set_paragraph_style(paragraph, ids["heading2"])
            set_paragraph_format(
                paragraph,
                alignment="left",
                before=240,
                after=120,
                line=line_twips(float(format_config["heading_line_spacing"])),
                first_line=0,
                keep_next=True,
                keep_lines=True,
                page_break_before=role == "reference_heading",
            )
            size = float(format_config["heading2_size_pt"])
        elif role == "heading3":
            set_paragraph_style(paragraph, ids["heading3"])
            set_paragraph_format(
                paragraph,
                alignment="left",
                before=120,
                after=60,
                line=line_twips(float(format_config["heading_line_spacing"])),
                first_line=0,
                keep_next=True,
                keep_lines=True,
            )
            size = float(format_config["heading3_size_pt"])
        elif role == "picture":
            set_paragraph_style(paragraph, ids["picture"])
            set_paragraph_format(
                paragraph,
                alignment="center",
                before=0,
                after=0,
                line=240,
                first_line=0,
                keep_next=True,
                keep_lines=True,
            )
            size = float(format_config["body_size_pt"])
        elif role == "image_caption":
            set_paragraph_style(paragraph, ids["image_caption"])
            set_paragraph_format(
                paragraph,
                alignment="center",
                before=0,
                after=0,
                line=line_twips(float(format_config["caption_line_spacing"])),
                first_line=0,
                keep_lines=True,
            )
            size = float(format_config["caption_size_pt"])
        elif role == "table_caption":
            set_paragraph_style(paragraph, ids["table_caption"])
            set_paragraph_format(
                paragraph,
                alignment="center",
                before=0,
                after=0,
                line=line_twips(float(format_config["caption_line_spacing"])),
                first_line=0,
                keep_next=True,
                keep_lines=True,
            )
            size = float(format_config["caption_size_pt"])
        elif role == "note":
            set_paragraph_style(paragraph, ids["note"])
            set_paragraph_format(
                paragraph,
                alignment="center",
                before=0,
                after=0,
                line=line_twips(float(format_config["note_line_spacing"])),
                first_line=0,
                keep_lines=True,
            )
            size = float(format_config["note_size_pt"])
        elif role in ("keywords", "highlight_item"):
            set_paragraph_style(paragraph, ids["body"])
            set_paragraph_format(
                paragraph,
                alignment="both",
                before=0,
                after=0,
                line=line_twips(float(format_config["body_line_spacing"])),
                first_line=0,
            )
            size = float(format_config["body_size_pt"])
        else:
            if style_name not in ("Body Text", "First Paragraph", "Normal"):
                set_paragraph_style(paragraph, ids["body"])
            set_paragraph_format(
                paragraph,
                alignment="both",
                before=0,
                after=0,
                line=line_twips(float(format_config["body_line_spacing"])),
                first_line=points_twips(
                    float(format_config["body_size_pt"])
                    * float(format_config["body_first_line_chars"])
                ),
                first_line_chars=float(
                    format_config["body_first_line_chars"]
                ),
            )
            size = float(format_config["body_size_pt"])

        # OMML content uses m:t rather than w:t, so ordinary prose around an
        # inline formula can be normalized without touching the formula.
        skip_cleanup = role in {"reference_heading"}
        counts["text_changes"] += normalize_paragraph_text(
            paragraph, role=role, skip=skip_cleanup
        )
        for run in paragraph.iter(W("r")):
            if run.find(W("t")) is not None:
                set_run_visual(
                    run,
                    points=size,
                    east_asia=str(format_config["east_asia_font"]),
                    western=str(format_config["western_font"]),
                )
    return dict(counts)


def patch_docx(
    raw_docx: Path,
    output_docx: Path,
    *,
    source_inventory: dict[str, Any],
    source_scripts: dict[str, int],
    format_config: dict[str, Any],
) -> dict[str, Any]:
    parser = etree.XMLParser(remove_blank_text=False, resolve_entities=False)
    replacements: dict[str, bytes] = {}

    with ZipFile(raw_docx) as source:
        bad = source.testzip()
        if bad:
            raise ExportError(f"Pandoc 输出 DOCX 损坏：{bad}")

        document = etree.fromstring(source.read("word/document.xml"), parser)
        styles_root = etree.fromstring(source.read("word/styles.xml"), parser)
        settings = etree.fromstring(source.read("word/settings.xml"), parser)
        raw_script_baseline = script_run_counts(document)
        rels = None
        if "word/_rels/document.xml.rels" in source.namelist():
            rels = etree.fromstring(
                source.read("word/_rels/document.xml.rels"), parser
            )

        styles = style_id_map(styles_root)
        body_report = format_body_paragraphs(
            document,
            styles=styles,
            format_config=format_config,
        )
        inserted_bibliography = insert_bibliography_field(
            document,
            bibliography_style_id=get_style_id(styles, "Bibliography"),
            format_config=format_config,
        )
        max_width_dxa = content_width_dxa(format_config)
        wrapped_equations = wrap_numbered_display_equations(
            document,
            max_width_dxa=max_width_dxa,
            format_config=format_config,
            equation_numbers=source_inventory.get("equation_numbers", []),
        )

        formal_tables = 0
        equation_tables = 0
        compact_id = get_style_id(styles, "Compact")
        for table in document.xpath(".//w:tbl", namespaces=NS):
            if is_equation_layout_table(table):
                equation_tables += 1
                format_equation_table(
                    table,
                    max_width_dxa=max_width_dxa,
                    format_config=format_config,
                )
            else:
                formal_tables += 1
                format_formal_table(
                    table,
                    compact_style_id=compact_id,
                    max_width_dxa=max_width_dxa,
                    format_config=format_config,
                )

        format_math(
            document,
            compact_style_id=compact_id,
            note_style_id=get_style_id(
                styles,
                "Figure Table Note",
                "Body Text",
                "Normal",
                "Compact",
            ),
            format_config=format_config,
        )
        resized_images = resize_inline_images(
            document,
            max_width_emu=content_width_emu(format_config),
        )
        quote_splits = split_quote_runs(
            document,
            format_config=format_config,
        )
        field_counts = color_fields(document)
        hyperlink_counts = style_hyperlinks(document, rels)
        missing_placeholders = style_missing_citation_placeholders(
            document,
            source_inventory.get("missing_citekeys", []),
        )
        patch_section(document, format_config=format_config)
        patch_settings(settings)

        replacements["word/document.xml"] = etree.tostring(
            document,
            xml_declaration=True,
            encoding="UTF-8",
            standalone=True,
        )
        replacements["word/settings.xml"] = etree.tostring(
            settings,
            xml_declaration=True,
            encoding="UTF-8",
            standalone=True,
        )

        output_docx.parent.mkdir(parents=True, exist_ok=True)
        handle = tempfile.NamedTemporaryFile(
            prefix=output_docx.stem + "-",
            suffix=".tmp",
            dir=output_docx.parent,
            delete=False,
        )
        temp_path = Path(handle.name)
        handle.close()
        try:
            with ZipFile(
                temp_path, "w", compression=ZIP_DEFLATED
            ) as target:
                for info in source.infolist():
                    data = replacements.get(info.filename)
                    if data is None:
                        data = source.read(info.filename)
                    target.writestr(info, data)
            os.replace(temp_path, output_docx)
        except Exception:
            temp_path.unlink(missing_ok=True)
            raise

    validation = validate_docx(
        output_docx,
        source_inventory=source_inventory,
        source_scripts=raw_script_baseline,
        format_config=format_config,
    )
    return {
        "body": body_report,
        "formal_tables": formal_tables,
        "equation_tables": equation_tables,
        "numbered_equations_wrapped": wrapped_equations,
        "resized_images": resized_images,
        "quote_run_splits": quote_splits,
        "raw_script_baseline": raw_script_baseline,
        "fields": field_counts,
        "hyperlinks": hyperlink_counts,
        "missing_citation_placeholders": missing_placeholders,
        "bibliography_inserted": inserted_bibliography,
        "format_config": format_config,
        "validation": validation,
    }


def field_code_counts(document: etree._Element) -> Counter:
    counts = Counter()
    for field in field_inventory(document):
        code = field["code"].upper()
        if "ZOTERO_ITEM" in code:
            counts["ZOTERO_ITEM"] += 1
        elif "ZOTERO_BIBL" in code:
            counts["ZOTERO_BIBL"] += 1
        else:
            key = field["code"].split(maxsplit=1)[0] if field["code"] else ""
            counts[key or "(empty)"] += 1
    return counts


def script_run_counts(document: etree._Element) -> dict[str, int]:
    runs = Counter()
    chars = Counter()
    for run in document.xpath(".//w:r", namespaces=NS):
        vert = run.find("w:rPr/w:vertAlign", namespaces=NS)
        if vert is None:
            continue
        kind = vert.get(W("val"))
        value = "".join(run.xpath(".//w:t/text()", namespaces=NS))
        runs[kind] += 1
        chars[kind] += len(value)
    return {
        "subscript_runs": runs["subscript"],
        "superscript_runs": runs["superscript"],
        "subscript_chars": chars["subscript"],
        "superscript_chars": chars["superscript"],
    }


def validate_table_borders(table: etree._Element) -> list[str]:
    issues: list[str] = []
    rows = table.findall(W("tr"))
    for row_index, row in enumerate(rows):
        for cell in row.findall(W("tc")):
            borders = cell.find("w:tcPr/w:tcBorders", namespaces=NS)
            if borders is None:
                issues.append("单元格缺少显式边框定义")
                continue
            values = {
                child.tag.split("}")[-1]: child.get(W("val"))
                for child in borders
            }
            if any(
                values.get(side) not in ("nil", "none")
                for side in ("left", "right", "insideH", "insideV")
            ):
                issues.append("存在竖线或内部横线")
            if row_index not in (0, len(rows) - 1):
                if values.get("top") not in ("nil", "none") or values.get(
                    "bottom"
                ) not in ("nil", "none"):
                    issues.append("表体中间行存在横线")
    return issues


def validate_docx(
    path: Path,
    *,
    source_inventory: dict[str, Any],
    source_scripts: dict[str, int],
    format_config: dict[str, Any],
) -> dict[str, Any]:
    validation_result: dict[str, Any] | None = None
    validation_errors: list[str] = []
    with ZipFile(path) as archive:
        bad = archive.testzip()
        if bad:
            raise ExportError(f"最终 DOCX ZIP 校验失败：{bad}")
        document = etree.fromstring(archive.read("word/document.xml"))
        settings = etree.fromstring(archive.read("word/settings.xml"))
        styles_root = etree.fromstring(archive.read("word/styles.xml"))
        styles = style_id_map(styles_root)
        fields = field_code_counts(document)
        scripts = script_run_counts(document)
        inline_images = len(
            document.xpath(".//wp:inline", namespaces=NS)
        )
        floating_images = len(
            document.xpath(".//wp:anchor", namespaces=NS)
        )
        math_count = len(document.xpath(".//m:oMath", namespaces=NS))
        tables = document.xpath(".//w:tbl", namespaces=NS)
        equation_tables = [
            table
            for table in tables
            if is_equation_layout_table(table)
        ]
        formal_tables = [table for table in tables if table not in equation_tables]
        sections = document.xpath(".//w:sectPr", namespaces=NS)
        if len(sections) != 1:
            raise ExportError(f"节数量异常：{len(sections)}")
        sect = sections[0]
        pg_sz = sect.find(W("pgSz"))
        pg_mar = sect.find(W("pgMar"))
        caption_half_points = str(
            int(round(float(format_config["caption_size_pt"]) * 2))
        )
        note_half_points = str(
            int(round(float(format_config["note_size_pt"]) * 2))
        )
        table_half_points = str(
            int(round(float(format_config["table_size_pt"]) * 2))
        )
        expected_margin = str(cm_twips(float(format_config["margin_cm"])))

        errors: list[str] = []
        expected_zotero_fields = int(
            source_inventory.get(
                "expected_zotero_fields",
                source_inventory["citation_clusters"],
            )
        )
        if fields["ZOTERO_ITEM"] != expected_zotero_fields:
            errors.append(
                "Zotero 引文域数量不一致："
                f"期望 {expected_zotero_fields}，"
                f"实际 {fields['ZOTERO_ITEM']}"
            )
        if fields["ZOTERO_BIBL"] != 1:
            errors.append(
                f"Zotero Bibliography 域应为 1，实际 {fields['ZOTERO_BIBL']}"
            )
        missing_citekeys = list(
            source_inventory.get("missing_citekeys", [])
        )
        for citekey in missing_citekeys:
            text_nodes = document.xpath(
                ".//w:t[contains(., $needle)]",
                namespaces=NS,
                needle=f"@{citekey}",
            )
            if not text_nodes:
                errors.append(f"缺失引用占位符 @{citekey} 未保留")
                continue
            for text_node in text_nodes:
                runs = text_node.xpath("ancestor::w:r[1]", namespaces=NS)
                if not runs:
                    errors.append(f"缺失引用占位符 @{citekey} 缺少文字运行")
                    break
                run = runs[0]
                color = run.xpath(
                    "string(./w:rPr/w:color/@w:val)", namespaces=NS
                )
                highlight = run.xpath(
                    "string(./w:rPr/w:highlight/@w:val)", namespaces=NS
                )
                underline = run.xpath(
                    "string(./w:rPr/w:u/@w:val)", namespaces=NS
                )
                bold = run.find("w:rPr/w:b", namespaces=NS)
                if (
                    color != "C00000"
                    or highlight != "yellow"
                    or underline != "single"
                    or bold is None
                ):
                    errors.append(
                        f"缺失引用占位符 @{citekey} 未按红字黄底加粗下划线标记"
                    )
                    break
        if inline_images != len(source_inventory["image_targets"]):
            errors.append(
                "图片数量不一致："
                f"期望 {len(source_inventory['image_targets'])}，"
                f"实际 {inline_images}"
            )
        if floating_images:
            errors.append(f"存在 {floating_images} 个浮动图片")
        if len(formal_tables) != source_inventory["table_count"]:
            errors.append(
                "正式表格数量不一致："
                f"期望 {source_inventory['table_count']}，"
                f"实际 {len(formal_tables)}"
            )
        expected_equation_tables = len(
            source_inventory.get("equation_numbers", [])
        )
        if len(equation_tables) != expected_equation_tables:
            errors.append(
                "公式编号布局数量不一致："
                f"期望 {expected_equation_tables}，"
                f"实际 {len(equation_tables)}"
            )
        if math_count != source_inventory["math_count"]:
            errors.append(
                "公式数量不一致："
                f"期望 {source_inventory['math_count']}，实际 {math_count}"
            )
        if source_scripts["subscript_chars"] and (
            scripts["subscript_chars"] != source_scripts["subscript_chars"]
        ):
            errors.append(
                "下标字符数量不一致："
                f"期望 {source_scripts['subscript_chars']}，"
                f"实际 {scripts['subscript_chars']}"
            )
        if source_scripts["superscript_chars"] and (
            scripts["superscript_chars"] != source_scripts["superscript_chars"]
        ):
            errors.append(
                "上标字符数量不一致："
                f"期望 {source_scripts['superscript_chars']}，"
                f"实际 {scripts['superscript_chars']}"
            )

        image_caption_id = get_style_id(styles, "Image Caption")
        table_caption_id = get_style_id(styles, "Table Caption")
        note_style_id = get_style_id(
            styles,
            "Figure Table Note",
            "Body Text",
            "Normal",
            "Compact",
        )
        title_style_id = get_style_id(styles, "heading 1", "Heading 1")
        body_paragraphs = document.xpath(
            ".//w:body//w:p[not(ancestor::w:tbl)]", namespaces=NS
        )
        id_to_name = {value: key for key, value in styles.items()}
        role_specs: dict[str, tuple[float, int]] = {
            "title": (
                float(format_config["title_size_pt"]),
                line_twips(float(format_config["title_line_spacing"])),
            ),
            "heading2": (
                float(format_config["heading2_size_pt"]),
                line_twips(float(format_config["heading_line_spacing"])),
            ),
            "reference_heading": (
                float(format_config["heading2_size_pt"]),
                line_twips(float(format_config["heading_line_spacing"])),
            ),
            "heading3": (
                float(format_config["heading3_size_pt"]),
                line_twips(float(format_config["heading_line_spacing"])),
            ),
            "image_caption": (
                float(format_config["caption_size_pt"]),
                line_twips(float(format_config["caption_line_spacing"])),
            ),
            "table_caption": (
                float(format_config["caption_size_pt"]),
                line_twips(float(format_config["caption_line_spacing"])),
            ),
            "note": (
                float(format_config["note_size_pt"]),
                line_twips(float(format_config["note_line_spacing"])),
            ),
            "keywords": (
                float(format_config["body_size_pt"]),
                line_twips(float(format_config["body_line_spacing"])),
            ),
            "highlight_item": (
                float(format_config["body_size_pt"]),
                line_twips(float(format_config["body_line_spacing"])),
            ),
            "body": (
                float(format_config["body_size_pt"]),
                line_twips(float(format_config["body_line_spacing"])),
            ),
        }
        in_highlights = False
        for paragraph_index, paragraph in enumerate(body_paragraphs, 1):
            pstyle = paragraph.xpath(
                "string(./w:pPr/w:pStyle/@w:val)", namespaces=NS
            )
            style_name = id_to_name.get(pstyle, "")
            text_value = paragraph_text(paragraph)
            if style_name.lower() == "heading 2":
                in_highlights = text_value == "Highlights"
            role = role_for_paragraph(
                paragraph,
                style_names=id_to_name,
                in_highlights=(
                    in_highlights and style_name.lower() != "heading 2"
                ),
            )
            if role == "picture" or not text_value:
                continue
            expected_size, expected_line = role_specs[role]
            expected_half_points = str(int(round(expected_size * 2)))
            run_nodes = paragraph.xpath(".//w:r[w:t]", namespaces=NS)
            for run in run_nodes:
                size = run.xpath(
                    "string(./w:rPr/w:sz/@w:val)", namespaces=NS
                )
                fonts = run.find("w:rPr/w:rFonts", namespaces=NS)
                run_text = "".join(
                    run.xpath(".//w:t/text()", namespaces=NS)
                )
                expected_western_font = (
                    str(format_config["east_asia_font"])
                    if run_text
                    and all(character in "“”‘’" for character in run_text)
                    else str(format_config["western_font"])
                )
                if size != expected_half_points:
                    errors.append(
                        f"段落 {paragraph_index}（{role}）字号不是设置值 "
                        f"{expected_size} pt"
                    )
                    break
                if fonts is None or (
                    fonts.get(W("eastAsia"))
                    != str(format_config["east_asia_font"])
                    or fonts.get(W("ascii"))
                    != expected_western_font
                    or fonts.get(W("hAnsi"))
                    != expected_western_font
                ):
                    errors.append(
                        f"段落 {paragraph_index}（{role}）字体不是设置值"
                    )
                    break
            actual_line = paragraph.xpath(
                "string(./w:pPr/w:spacing/@w:line)", namespaces=NS
            )
            if actual_line != str(expected_line):
                errors.append(
                    f"段落 {paragraph_index}（{role}）行距不是设置值"
                )
            if role == "body" and style_name != "Bibliography":
                expected_chars = str(
                    int(
                        round(
                            float(format_config["body_first_line_chars"])
                            * 100
                        )
                    )
                )
                actual_chars = paragraph.xpath(
                    "string(./w:pPr/w:ind/@w:firstLineChars)",
                    namespaces=NS,
                )
                if actual_chars != expected_chars:
                    errors.append(
                        f"段落 {paragraph_index} 正文首行缩进不是设置值"
                    )
        expected_title = str(source_inventory.get("document_title", ""))
        title_paragraphs = [
            paragraph
            for paragraph in body_paragraphs
            if paragraph_text(paragraph) == expected_title
        ]
        if expected_title and len(title_paragraphs) != 1:
            errors.append(
                "正文题目数量不一致："
                f"期望 1，实际 {len(title_paragraphs)}"
            )
        elif title_paragraphs:
            title_paragraph = title_paragraphs[0]
            title_style = title_paragraph.xpath(
                "string(./w:pPr/w:pStyle/@w:val)", namespaces=NS
            )
            title_alignment = title_paragraph.xpath(
                "string(./w:pPr/w:jc/@w:val)", namespaces=NS
            )
            title_first_line = title_paragraph.xpath(
                "string(./w:pPr/w:ind/@w:firstLine)", namespaces=NS
            )
            if title_style != title_style_id:
                errors.append("正文题目未使用唯一的一级标题样式")
            if title_alignment != "center":
                errors.append("正文题目未居中")
            if title_first_line not in ("", "0"):
                errors.append("正文题目存在首行缩进")

        caption_paragraphs = document.xpath(
            ".//w:p[w:pPr/w:pStyle[@w:val=$image or @w:val=$table]]",
            namespaces=NS,
            image=image_caption_id,
            table=table_caption_id,
        )
        compatible_mode = (
            source_inventory.get("export_mode") == "compatible"
        )
        for index, paragraph in enumerate(caption_paragraphs, 1):
            caption_text = paragraph_text(paragraph)
            caption_pattern = (
                r"^(?:(?:图|表)\d+|"
                r"(?:Fig(?:ure)?\.?|Table)\s*\d+(?:[.:])?)\s+\S"
                if compatible_mode
                else r"^(?:图|表)\d+ \S"
            )
            if not re.match(
                caption_pattern,
                caption_text,
                flags=re.IGNORECASE,
            ):
                errors.append(
                    f"图表题 {index} 的编号或题名格式不符合当前导出模式"
                )
            caption_sizes = paragraph.xpath(
                ".//w:r[w:t]/w:rPr/w:sz/@w:val", namespaces=NS
            )
            if not caption_sizes or any(
                value != caption_half_points for value in caption_sizes
            ):
                errors.append(
                    f"图表题 {index} 字号不是设置值 "
                    f"{format_config['caption_size_pt']} pt"
                )

        note_paragraphs = [
            paragraph
            for paragraph in body_paragraphs
            if is_note_paragraph_text(paragraph_text(paragraph))
        ]
        expected_note_count = int(source_inventory.get("note_paragraphs", 0))
        if len(note_paragraphs) != expected_note_count:
            errors.append(
                "注释段落数量不一致："
                f"期望 {expected_note_count}，实际 {len(note_paragraphs)}"
            )
        for index, paragraph in enumerate(note_paragraphs, 1):
            note_style = paragraph.xpath(
                "string(./w:pPr/w:pStyle/@w:val)", namespaces=NS
            )
            note_alignment = paragraph.xpath(
                "string(./w:pPr/w:jc/@w:val)", namespaces=NS
            )
            note_first_line = paragraph.xpath(
                "string(./w:pPr/w:ind/@w:firstLine)", namespaces=NS
            )
            note_hanging = paragraph.xpath(
                "string(./w:pPr/w:ind/@w:hanging)", namespaces=NS
            )
            if note_style != note_style_id:
                errors.append(f"图表注 {index} 未使用注释样式")
            if note_alignment != "center":
                errors.append(f"图表注 {index} 未居中")
            if note_first_line not in ("", "0") or note_hanging not in (
                "",
                "0",
            ):
                errors.append(f"图表注 {index} 未顶格")
            note_sizes = paragraph.xpath(
                ".//w:r[w:t]/w:rPr/w:sz/@w:val", namespaces=NS
            )
            note_math_sizes = paragraph.xpath(
                ".//m:r/w:rPr/w:sz/@w:val", namespaces=NS
            )
            if note_sizes and any(
                value != note_half_points for value in note_sizes
            ):
                errors.append(
                    f"图表注 {index} 普通文字字号不是设置值 "
                    f"{format_config['note_size_pt']} pt"
                )
            if note_math_sizes and any(
                value != note_half_points for value in note_math_sizes
            ):
                errors.append(
                    f"图表注 {index} 公式字号不是设置值 "
                    f"{format_config['note_size_pt']} pt"
                )

        for index, table in enumerate(formal_tables, 1):
            for paragraph in table.xpath(".//w:p", namespaces=NS):
                line = paragraph.xpath(
                    "string(./w:pPr/w:spacing/@w:line)", namespaces=NS
                )
                if line != str(
                    line_twips(float(format_config["table_line_spacing"]))
                ):
                    errors.append(
                        f"正式表格 {index} 的文字行距不是设置值"
                    )
                    break
                for run in paragraph.xpath(".//w:r[w:t]", namespaces=NS):
                    size = run.xpath(
                        "string(./w:rPr/w:sz/@w:val)", namespaces=NS
                    )
                    fonts = run.find("w:rPr/w:rFonts", namespaces=NS)
                    run_text = "".join(
                        run.xpath(".//w:t/text()", namespaces=NS)
                    )
                    expected_western_font = (
                        str(format_config["east_asia_font"])
                        if run_text
                        and all(
                            character in "“”‘’" for character in run_text
                        )
                        else str(format_config["western_font"])
                    )
                    if size != table_half_points:
                        errors.append(
                            f"正式表格 {index} 的文字字号不是设置值 "
                            f"{format_config['table_size_pt']} pt"
                        )
                        break
                    if fonts is None or (
                        fonts.get(W("eastAsia"))
                        != str(format_config["east_asia_font"])
                        or fonts.get(W("ascii"))
                        != expected_western_font
                        or fonts.get(W("hAnsi"))
                        != expected_western_font
                    ):
                        errors.append(
                            f"正式表格 {index} 的文字字体不是设置值"
                        )
                        break
            table_math_sizes = table.xpath(
                ".//m:r/w:rPr/w:sz/@w:val", namespaces=NS
            )
            if table_math_sizes and any(
                value != table_half_points for value in table_math_sizes
            ):
                errors.append(
                    f"正式表格 {index} 的公式字号不是设置值 "
                    f"{format_config['table_size_pt']} pt"
                )

        for paragraph in document.xpath(".//w:p", namespaces=NS):
            visible_text = paragraph_text(paragraph)
            if re.search(r"\s+<Do Zotero Refresh", visible_text):
                errors.append("存在 Zotero 引文前普通空格")
                break
            if re.search(
                r">\s+[\u3400-\u9fff，。；：？！、]", visible_text
            ):
                errors.append("存在 Zotero 引文后普通空格")
                break
        if pg_sz is None or (
            pg_sz.get(W("w")) != "11906" or pg_sz.get(W("h")) != "16838"
        ):
            errors.append("页面尺寸不是 A4 纵向")
        if pg_mar is None or any(
            pg_mar.get(W(side)) != expected_margin
            for side in ("top", "right", "bottom", "left")
        ):
            errors.append(
                f"页边距不是设置值四边 {format_config['margin_cm']} cm"
            )
        if settings.find(W("trackRevisions")) is not None:
            errors.append("输出意外启用了修订模式")
        update_fields = settings.find(W("updateFields"))
        if update_fields is not None and update_fields.get(W("val")) not in (
            None,
            "0",
            "false",
            "off",
        ):
            errors.append("输出意外启用了打开文档时自动更新全部域")
        if sect.find(W("lnNumType")) is not None:
            errors.append("输出意外启用了行号")

        for index, table in enumerate(formal_tables, 1):
            issues = validate_table_borders(table)
            if issues:
                errors.append(
                    f"正式表格 {index} 三线表校验失败：{sorted(set(issues))}"
                )
        actual_equation_numbers: list[int] = []
        for index, table in enumerate(equation_tables, 1):
            for border in table.xpath(
                ".//w:tcBorders/*|./w:tblPr/w:tblBorders/*",
                namespaces=NS,
            ):
                if border.get(W("val")) not in ("nil", "none"):
                    errors.append(f"公式布局表 {index} 存在可见边框")
                    break
            cells = table.xpath("./w:tr/w:tc", namespaces=NS)
            number_text = (
                "".join(cells[-1].xpath(".//w:t/text()", namespaces=NS))
                if cells
                else ""
            )
            if not re.fullmatch(r"（\d+）", number_text):
                errors.append(
                    f"公式布局表 {index} 的编号不是全角括号格式"
                )
            else:
                actual_equation_numbers.append(
                    int(number_text.removeprefix("（").removesuffix("）"))
                )
        expected_equation_numbers = [
            int(value)
            for value in source_inventory.get("equation_numbers", [])
        ]
        if actual_equation_numbers != expected_equation_numbers:
            errors.append(
                "公式实际编号与 Markdown 不一致："
                f"期望 {expected_equation_numbers}，"
                f"实际 {actual_equation_numbers}"
            )

        max_width_emu = content_width_emu(format_config)
        for extent in document.xpath(".//wp:inline/wp:extent", namespaces=NS):
            if int(extent.get("cx", "0")) > max_width_emu:
                errors.append("存在超过当前版心宽度的图片")
                break

        if errors:
            validation_errors = errors
        else:
            validation_result = {
                "fields": dict(fields),
                "export_mode": source_inventory.get("export_mode", "strict"),
                "missing_citekeys": missing_citekeys,
                "unresolved_citation_clusters": int(
                    source_inventory.get(
                        "unresolved_citation_clusters",
                        0,
                    )
                ),
                "scripts": scripts,
                "inline_images": inline_images,
                "floating_images": floating_images,
                "math_count": math_count,
                "formal_tables": len(formal_tables),
                "equation_tables": len(equation_tables),
                "equation_numbers": actual_equation_numbers,
                "title": {
                    "text": expected_title,
                    "occurrences": len(title_paragraphs),
                },
                "notes": {
                    "expected": expected_note_count,
                    "actual": len(note_paragraphs),
                    "alignment": "center",
                    "first_line_indent": 0,
                    "font_pt": format_config["note_size_pt"],
                },
                "sections": len(sections),
                "page": "A4",
                "margins_cm": format_config["margin_cm"],
                "format_config": format_config,
                "automatic_self_check": "PASS",
            }

    if validation_errors:
        path.unlink(missing_ok=True)
        raise ExportError(
            "严格校验失败，已删除不合格输出：\n- "
            + "\n- ".join(validation_errors)
        )
    if validation_result is None:
        raise ExportError("严格校验未产生结果")
    return validation_result


def safe_output_stem(value: str, fallback: str) -> str:
    stem = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "-", value.strip())
    stem = re.sub(r"[. ]+$", "", stem).strip()
    if not stem:
        stem = fallback.strip()
    if re.fullmatch(
        r"(?:CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])",
        stem,
        flags=re.IGNORECASE,
    ):
        stem += "-文档"
    return stem or "导出文档"


def unique_output_path(requested_path: Path) -> Path:
    if not requested_path.exists():
        return requested_path
    stamp = dt.datetime.now().strftime("%Y%m%d-%H%M%S")
    stamped_stem = f"{requested_path.stem}-{stamp}"
    candidate = requested_path.with_name(
        stamped_stem + requested_path.suffix
    )
    sequence = 2
    while candidate.exists():
        candidate = requested_path.with_name(
            f"{stamped_stem}-{sequence}{requested_path.suffix}"
        )
        sequence += 1
    return candidate


def print_preflight(
    *,
    md_path: Path,
    output_path: Path,
    template: Path,
    format_config: dict[str, Any],
    inventory: dict[str, Any],
    scripts: dict[str, int],
    equation_numbers: list[int],
    image_paths: list[Path],
) -> None:
    print("\n【预检摘要】")
    print(f"Markdown：{md_path}")
    print(f"Word 输出：{output_path}")
    mode_label = (
        "严格模式"
        if inventory.get("export_mode") == "strict"
        else "兼容模式"
    )
    print(f"导出模式：{mode_label}")
    print(f"参考模板：{template.name}")
    print(f"格式方案：{format_config_summary(format_config)}")
    print(f"图片：{len(image_paths)}")
    print(f"正式表格：{inventory['table_count']}")
    if inventory.get("document_title"):
        print(f"正文题目：{inventory['document_title']}（仅导出 1 次）")
    print(f"注释段落：{inventory.get('note_paragraphs', 0)}")
    print(
        "公式："
        f"{inventory['math_count']}（行间 {inventory['display_math_count']}）"
    )
    print(f"公式编号：{equation_numbers or '无'}")
    print(f"Zotero 引文域：{inventory['citation_clusters']}")
    if inventory.get("missing_citekeys"):
        print(
            "缺失 citekey 占位符："
            + "、".join(f"@{key}" for key in inventory["missing_citekeys"])
        )
    print(f"唯一 citekey：{len(inventory['citekeys'])}")
    print(
        "上下标标记："
        f"下标 {scripts['subscript_tags']}，"
        f"上标 {scripts['superscript_tags']}"
    )


def run_pandoc(
    *,
    pandoc: Path,
    crossref: Path,
    true_scripts: Path,
    zotero_filter: Path,
    template: Path,
    input_path: Path,
    input_format: str,
    raw_docx: Path,
    vault_root: Path,
    md_parent: Path,
) -> str:
    resource_path = os.pathsep.join(
        [str(vault_root), str(md_parent)]
    )
    command = [
        str(pandoc),
        str(input_path),
        "--from",
        input_format,
        "--standalone",
        "--lua-filter",
        str(true_scripts),
        "--filter",
        str(crossref),
        "--lua-filter",
        str(zotero_filter),
        "--reference-doc",
        str(template),
        "--resource-path",
        resource_path,
        "-o",
        str(raw_docx),
    ]
    env = os.environ.copy()
    env["PYTHONUTF8"] = "1"
    env["PATH"] = str(crossref.parent) + os.pathsep + env.get("PATH", "")
    result = subprocess.run(
        command,
        cwd=vault_root,
        text=True,
        encoding="utf-8",
        errors="replace",
        capture_output=True,
        env=env,
    )
    combined = "\n".join(
        part.strip()
        for part in (result.stdout, result.stderr)
        if part.strip()
    )
    if result.returncode:
        raise ExportError("Pandoc 导出失败：\n" + combined)
    if not raw_docx.is_file():
        raise ExportError("Pandoc 未生成 Word 文件")
    return combined


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="从 Obsidian Markdown 生成格式化 Word 文档"
    )
    parser.add_argument("markdown", type=Path)
    parser.add_argument("--yes", action="store_true", help="跳过确认")
    parser.add_argument("--no-open", action="store_true", help="不自动打开 Word")
    parser.add_argument("--preflight-only", action="store_true")
    parser.add_argument("--output", type=Path)
    parser.add_argument(
        "--template",
        type=Path,
        help="参考 Word 模板；也可通过 MD_EXPORT_WORD_TEMPLATE 设置",
    )
    parser.add_argument(
        "--format-json",
        help="Word 格式设置 JSON；也可通过 MD_EXPORT_WORD_FORMAT_JSON 设置",
    )
    parser.add_argument(
        "--mode",
        choices=("strict", "compatible"),
        help="strict=严格模式，compatible=兼容模式；省略时弹窗选择",
    )
    return parser.parse_args()


def open_output_document(output_path: Path) -> None:
    if sys.platform == "win32":
        os.startfile(output_path)  # type: ignore[attr-defined]
        return
    if sys.platform == "darwin":
        subprocess.Popen(
            ["/usr/bin/open", str(output_path)],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
        return
    raise ExportError(f"当前系统不支持自动打开 Word：{sys.platform}")


def main() -> int:
    configure_console()
    emit_progress(2, "初始化导出环境")
    args = parse_args()
    script_dir = Path(__file__).resolve().parent
    pandoc_root = script_dir.parent
    pandoc_bin_dir = pandoc_root / "Pandoc&pandoc-crossref"
    executable_suffix = ".exe" if os.name == "nt" else ""
    pandoc = Path(
        os.environ.get(
            "MD_EXPORT_WORD_PANDOC",
            str(pandoc_bin_dir / f"pandoc{executable_suffix}"),
        )
    )
    crossref = Path(
        os.environ.get(
            "MD_EXPORT_WORD_CROSSREF",
            str(
                pandoc_bin_dir
                / f"pandoc-crossref{executable_suffix}"
            ),
        )
    )
    true_scripts = script_dir / "true_scripts.lua"
    zotero_filter = pandoc_root / "zotero.lua"
    template_value = args.template or os.environ.get("MD_EXPORT_WORD_TEMPLATE")
    if template_value:
        template = Path(template_value).expanduser()
        if not template.is_absolute():
            template = pandoc_root / "Word-Template" / template
        template = template.resolve()
    else:
        template = (
            pandoc_root / "Word-Template" / "导出格式模板.docx"
        ).resolve()
    format_config = load_format_config(
        args.format_json or os.environ.get("MD_EXPORT_WORD_FORMAT_JSON")
    )

    for required in (
        pandoc,
        crossref,
        true_scripts,
        zotero_filter,
        template,
    ):
        if not required.is_file():
            raise ExportError(f"缺少必要文件：{required}")

    md_path = args.markdown.expanduser().resolve()
    if not md_path.is_file():
        raise ExportError(f"Markdown 不存在：{md_path}")
    if md_path.suffix.lower() not in (".md", ".markdown"):
        raise ExportError(f"输入必须是 Markdown：{md_path}")

    emit_progress(8, "读取 Markdown", md_path.name)
    mode_was_prompted = args.mode is None
    export_mode = args.mode or select_export_mode_gui()
    if export_mode is None:
        print("已取消导出。")
        return 0
    if mode_was_prompted:
        args.yes = True

    vault_root = find_vault_root(md_path.parent)
    source_hash_before = sha256_file(md_path)
    source = md_path.read_text(encoding="utf-8")
    prepared, prepare_report = prepare_markdown(source)
    scripts = source_script_counts(prepared)
    emit_progress(18, "规范化 Markdown", "标题、图片、引用间距与公式标签")
    output_value = args.output or os.environ.get("MD_EXPORT_WORD_OUTPUT")
    requested_output_path = (
        Path(output_value).expanduser().resolve()
        if output_value
        else md_path.with_name(
            safe_output_stem(
                str(prepare_report.get("document_title", "")),
                md_path.stem,
            )
            + ".docx"
        )
    )
    if requested_output_path.resolve() == md_path.resolve():
        raise ExportError("输出不能覆盖 Markdown")
    output_path = unique_output_path(requested_output_path)

    with tempfile.TemporaryDirectory(prefix="md_word_review_") as temp_name:
        temp_dir = Path(temp_name)
        prepared_md = temp_dir / "prepared.md"
        prepared_md.write_text(prepared, encoding="utf-8")
        resource_path = os.pathsep.join(
            [str(vault_root), str(md_path.parent)]
        )
        emit_progress(26, "解析文档结构", "扫描图片、表格、公式和引用")
        ast = pandoc_ast(
            pandoc,
            prepared_md,
            cwd=vault_root,
            resource_path=resource_path,
        )
        inventory = ast_inventory(ast)
        inventory["equation_numbers"] = prepare_report["equation_numbers"]
        inventory["document_title"] = prepare_report["document_title"]
        inventory["note_paragraphs"] = prepare_report["note_paragraphs"]
        inventory["export_mode"] = export_mode
        image_paths, missing_images = check_images(
            inventory["image_targets"],
            vault_root=vault_root,
            md_parent=md_path.parent,
        )
        if missing_images:
            raise ExportError(
                "发现缺失图片，已停止导出：\n- "
                + "\n- ".join(missing_images)
            )
        emit_progress(
            36,
            "检查文档资源",
            f"图片 {len(image_paths)}；表格 {inventory['table_count']}；"
            f"公式 {inventory['math_count']}",
        )
        emit_progress(42, "检查 Zotero 引用", f"citekey {len(inventory['citekeys'])}")
        missing_keys, duplicate_keys = check_citekeys(
            inventory["citekeys"]
        )
        if missing_keys and export_mode == "strict":
            raise ExportError(
                "严格模式：Zotero 未找到以下 citekey，已停止导出：\n- "
                + "\n- ".join(missing_keys)
            )
        unresolved_clusters = unresolved_citation_cluster_count(
            ast,
            missing_keys,
        )
        inventory["missing_citekeys"] = missing_keys
        inventory["unresolved_citation_clusters"] = unresolved_clusters
        pandoc_input = prepared_md
        pandoc_input_format = "markdown+raw_html+tex_math_dollars"
        inventory["expected_zotero_fields"] = inventory["citation_clusters"]
        if missing_keys:
            compatible_ast = split_missing_citations_in_ast(
                ast,
                missing_keys,
            )
            pandoc_input = temp_dir / "prepared-compatible.json"
            pandoc_input.write_text(
                json.dumps(compatible_ast, ensure_ascii=False),
                encoding="utf-8",
            )
            pandoc_input_format = "json"
            inventory["expected_zotero_fields"] = ast_inventory(
                compatible_ast
            )["citation_clusters"]
            print(
                "\n兼容模式警告：以下 citekey 不在当前 Zotero 库中；"
                "本次将保留为红字、黄底、加粗下划线占位符，"
                "并写入导出日志：\n- "
                + "\n- ".join(missing_keys)
            )
        forced_zotero_items: dict[str, dict[str, Any]] = {}
        effective_zotero_filter = zotero_filter
        if duplicate_keys:
            forced_zotero_items = resolve_exact_duplicate_citekeys(
                duplicate_keys
            )
            effective_zotero_filter = make_resolved_zotero_filter(
                zotero_filter,
                temp_dir / "zotero-resolved.lua",
                forced_zotero_items,
            )
            print(
                "\n警告：以下 citekey 在 Zotero 中存在内容相同的重复条目；"
                "本次已按稳定 Zotero URI 生成可刷新域，未修改 Markdown "
                "或 Zotero。建议后续合并重复条目：\n- "
                + "\n- ".join(duplicate_keys)
            )

        emit_progress(
            52,
            "预检完成",
            f"模式 {export_mode}；缺失 citekey {len(missing_keys)}",
        )
        print_preflight(
            md_path=md_path,
            output_path=output_path,
            template=template,
            format_config=format_config,
            inventory=inventory,
            scripts=scripts,
            equation_numbers=prepare_report["equation_numbers"],
            image_paths=image_paths,
        )
        if args.preflight_only:
            print("\n预检通过，未生成 Word。")
            return 0
        if not args.yes:
            answer = input("\n确认生成 Word？输入 Y 继续：").strip().lower()
            if answer not in ("y", "yes"):
                print("已取消。")
                return 0

        raw_docx = temp_dir / "pandoc-raw.docx"
        emit_progress(60, "生成 Word 初稿", "运行 Pandoc 与 pandoc-crossref")
        pandoc_output = run_pandoc(
            pandoc=pandoc,
            crossref=crossref,
            true_scripts=true_scripts,
            zotero_filter=effective_zotero_filter,
            template=template,
            input_path=pandoc_input,
            input_format=pandoc_input_format,
            raw_docx=raw_docx,
            vault_root=vault_root,
            md_parent=md_path.parent,
        )
        emit_progress(74, "Word 初稿已生成", raw_docx.name)
        emit_progress(78, "处理 Word 格式", "字体、上下标、公式、图表和 Zotero 域")
        format_report = patch_docx(
            raw_docx,
            output_path,
            source_inventory=inventory,
            source_scripts=scripts,
            format_config=format_config,
        )
        format_report["duplicate_citekeys_resolved"] = duplicate_keys
        emit_progress(92, "自动检查 Word", "结构、编号、引用域与格式均已检查")

    emit_progress(96, "确认源文件", "检查导出期间 Markdown 是否发生变化")
    if sha256_file(md_path) != source_hash_before:
        output_path.unlink(missing_ok=True)
        raise ExportError("源 Markdown 在导出过程中发生变化，已删除输出")

    print("\n导出成功。")
    validation = format_report["validation"]
    print(
        "自动自检：PASS（"
        f"模式 {validation['export_mode']}；"
        f"正文题目 {validation['title']['occurrences']} 个；"
        f"注释 {validation['notes']['actual']} 段；"
        f"公式编号 {validation['equation_numbers']}；"
        f"Zotero 引文域 {validation['fields'].get('ZOTERO_ITEM', 0)} 个；"
        f"缺失 citekey 占位符 {len(validation['missing_citekeys'])} 个"
        "）"
    )
    print(f"Word：{output_path}")
    print("日志：成功时不生成；仅在失败时写入导出失败.log.txt。")
    print("说明：首次打开后可在 Zotero 中执行 Refresh。")
    if not args.no_open:
        emit_progress(99, "正在打开 Word", output_path.name)
        try:
            open_output_document(output_path)
        except Exception as exc:
            print(f"无法自动打开 Word：{exc}")
    emit_progress(100, "导出完成", output_path.name, level="success")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ExportError as exc:
        emit_progress(100, "导出失败", str(exc), level="error")
        error_log = write_failure_log(exc)
        print(f"\n错误：{exc}", file=sys.stderr, flush=True)
        if error_log:
            print(f"错误日志：{error_log}", file=sys.stderr, flush=True)
        raise SystemExit(1)
    except KeyboardInterrupt:
        emit_progress(100, "已取消", "用户中止导出", level="warning")
        print("\n已取消。", file=sys.stderr, flush=True)
    except Exception as exc:
        traceback_text = traceback.format_exc()
        emit_progress(100, "导出失败", str(exc), level="error")
        error_log = write_failure_log(exc, traceback_text)
        print(f"\n未预期错误：{exc}", file=sys.stderr, flush=True)
        if error_log:
            print(f"错误日志：{error_log}", file=sys.stderr, flush=True)
        raise SystemExit(1)
        raise SystemExit(130)
