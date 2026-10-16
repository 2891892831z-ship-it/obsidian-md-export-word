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
import math
import os
import re
import shutil
import sqlite3
import subprocess
import sys
import tempfile
import traceback
import unicodedata
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
CUSTOM_PROP_NS = (
    "http://schemas.openxmlformats.org/officeDocument/2006/"
    "custom-properties"
)
VT_NS = "http://schemas.openxmlformats.org/officeDocument/2006/"
VT_NS += "docPropsVTypes"
XML_NS = "http://www.w3.org/XML/1998/namespace"

NS = {
    "w": W_NS,
    "r": R_NS,
    "m": M_NS,
    "wp": WP_NS,
    "a": A_NS,
    "pr": PKG_REL_NS,
    "cp": CUSTOM_PROP_NS,
    "vt": VT_NS,
}

CUSTOM_PROPERTY_FMTID = "{D5CDD505-2E9C-101B-9397-08002B2CF9AE}"
ZOTERO_PREF_CHUNK_SIZE = 240
CUSTOM_MARK_STYLE_PREFIX = "MDExportWordMark"
CSS_NAMED_COLORS = {
    "black": "000000",
    "silver": "C0C0C0",
    "gray": "808080",
    "white": "FFFFFF",
    "maroon": "800000",
    "red": "FF0000",
    "purple": "800080",
    "fuchsia": "FF00FF",
    "green": "008000",
    "lime": "00FF00",
    "olive": "808000",
    "yellow": "FFFF00",
    "navy": "000080",
    "blue": "0000FF",
    "teal": "008080",
    "aqua": "00FFFF",
}
MARKDOWN_INPUT_FORMAT = (
    "markdown+raw_html+tex_math_dollars+mark+bracketed_spans"
)


def W(name: str) -> str:
    return f"{{{W_NS}}}{name}"


def R(name: str) -> str:
    return f"{{{R_NS}}}{name}"


def M(name: str) -> str:
    return f"{{{M_NS}}}{name}"


def CP(name: str) -> str:
    return f"{{{CUSTOM_PROP_NS}}}{name}"


def VT(name: str) -> str:
    return f"{{{VT_NS}}}{name}"


class ExportError(RuntimeError):
    pass


DEFAULT_FORMAT_CONFIG: dict[str, Any] = {
    "preset_name": "当前期刊模板",
    "document_language": "zh-CN",
    "include_english_captions": True,
    "east_asia_font": "宋体",
    "western_font": "Times New Roman",
    "body_size_pt": 12.0,
    "body_line_spacing": 1.5,
    "body_first_line_chars": 2.0,
    "title_size_pt": 16.0,
    "title_line_spacing": 1.5,
    "heading2_size_pt": 14.0,
    "heading3_size_pt": 12.0,
    "heading4_size_pt": 12.0,
    "heading_line_spacing": 1.5,
    "table_size_pt": 7.5,
    "table_line_spacing": 1.0,
    "caption_size_pt": 10.5,
    "caption_line_spacing": 1.0,
    "note_size_pt": 7.5,
    "note_line_spacing": 1.0,
    "formula_size_pt": 12.0,
    "margin_cm": 2.54,
    "figure_reflow": False,
}

FORMAT_NUMERIC_LIMITS: dict[str, tuple[float, float]] = {
    "body_size_pt": (5.0, 36.0),
    "body_line_spacing": (0.8, 3.0),
    "body_first_line_chars": (0.0, 4.0),
    "title_size_pt": (5.0, 36.0),
    "title_line_spacing": (0.8, 3.0),
    "heading2_size_pt": (5.0, 36.0),
    "heading3_size_pt": (5.0, 36.0),
    "heading4_size_pt": (5.0, 36.0),
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

    if "document_language" in supplied:
        language = normalize_document_language(str(supplied["document_language"]))
        if language not in {"zh-CN", "en-US"}:
            raise ExportError("格式设置 document_language 必须是 zh-CN 或 en-US")
        config["document_language"] = language

    for key in ("figure_reflow", "include_english_captions"):
        if key in supplied:
            value = supplied[key]
            if not isinstance(value, bool):
                raise ExportError(f"格式设置 {key} 必须是布尔值")
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


def content_height_dxa(config: dict[str, Any]) -> int:
    return 16838 - 2 * cm_twips(float(config["margin_cm"]))


def figure_image_max_height_dxa(config: dict[str, Any]) -> int:
    """Reserve printable height for a caption and a short figure note."""
    reserve = max(
        1440,
        3 * line_twips(float(config["caption_line_spacing"])),
    )
    return max(1440, content_height_dxa(config) - reserve)


def format_config_summary(config: dict[str, Any]) -> str:
    indent_unit = (
        "个半角字符"
        if is_english_document_language(config.get("document_language"))
        else "个全角字"
    )
    return (
        f"{config['preset_name']}（中文 {config['east_asia_font']}；"
        f"英文/数字 {config['western_font']}；"
        f"正文 {config['body_size_pt']} pt、"
        f"{config['body_line_spacing']} 倍行距、"
        f"首行 {config['body_first_line_chars']} {indent_unit}；"
        f"表格 {config['table_size_pt']} pt、"
        f"{config['table_line_spacing']} 倍行距；"
        f"图表题 {config['caption_size_pt']} pt；"
        f"图表注 {config['note_size_pt']} pt、"
        f"{config['note_line_spacing']} 倍行距；"
        f"页边距 {config['margin_cm']} cm；"
        f"图片分页回填 "
        f"{'开启' if config['figure_reflow'] else '关闭'}）"
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
    stage_key: str = "",
    detail_key: str = "",
    params: dict[str, Any] | None = None,
) -> None:
    payload = {
        "percent": max(0, min(100, int(percent))),
        "stage": stage,
        "detail": detail,
        "level": level,
        "stageKey": stage_key,
        "params": dict(params or {}),
    }
    if detail_key:
        payload["detailKey"] = detail_key
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


def normalize_document_language(value: str | None) -> str:
    raw = str(value or "").strip().replace("_", "-")
    if not raw:
        return ""
    parts = [part for part in raw.split("-") if part]
    if not parts or not re.fullmatch(r"[A-Za-z]{2,3}", parts[0]):
        return raw
    normalized = [parts[0].lower()]
    for part in parts[1:]:
        if len(part) == 2 and part.isalpha():
            normalized.append(part.upper())
        elif len(part) == 4 and part.isalpha():
            normalized.append(part.title())
        else:
            normalized.append(part)
    language = "-".join(normalized)
    if language == "en":
        return "en-US"
    if language == "zh":
        return "zh-CN"
    return language


def is_english_document_language(value: str | None) -> bool:
    language = normalize_document_language(value)
    return bool(re.match(r"^en(?:-|$)", language, flags=re.IGNORECASE))


def body_first_line_indent_twips(config: dict[str, Any]) -> int:
    """Return a language-aware physical first-line indent.

    Chinese character units use one em each. English character units use a
    half-em each so a value of 2 means two Latin halfwidth characters rather
    than two fullwidth CJK characters.
    """
    character_width = (
        0.5
        if is_english_document_language(config.get("document_language"))
        else 1.0
    )
    return points_twips(
        float(config["body_size_pt"])
        * float(config["body_first_line_chars"])
        * character_width
    )


def language_aware_format_config(
    format_config: dict[str, Any],
    document_language: str | None,
) -> dict[str, Any]:
    """Use one font in every Word font slot for English documents.

    Word may classify otherwise-ASCII punctuation in refreshed Zotero fields
    through the East Asian font slot.  English documents therefore need the
    configured Western font in all four slots.  Chinese and unspecified
    documents retain the configured East Asian/Western font pairing.
    """
    effective = copy.deepcopy(format_config)
    # The format dialog supplies an explicit manuscript language.  Keep the
    # Markdown ``lang`` metadata only as a backwards-compatible fallback for
    # callers that do not provide the new setting.
    configured = normalize_document_language(format_config.get("document_language"))
    language = configured or normalize_document_language(document_language)
    effective["document_language"] = language
    if is_english_document_language(language):
        effective["east_asia_font"] = str(effective["western_font"])
    return effective


INHERITED_FONT_STYLE_NAMES = frozenset(
    {
        "Normal",
        "Default Paragraph Font",
        "Body Text",
        "First Paragraph",
        "Bibliography",
    }
)


def set_inherited_run_language(
    rpr: etree._Element,
    document_language: str | None,
) -> None:
    language = normalize_document_language(document_language)
    if not language:
        return
    lang = get_or_add(rpr, W("lang"))
    if is_english_document_language(language):
        lang.set(W("val"), language)
        lang.set(W("eastAsia"), language)
    elif re.match(r"^zh(?:-|$)", language, flags=re.IGNORECASE):
        lang.set(W("eastAsia"), language)


def patch_inherited_font_defaults(
    styles_root: etree._Element,
    *,
    document_language: str | None,
    format_config: dict[str, Any],
) -> dict[str, Any]:
    """Patch font inheritance used by Word and refreshed Zotero fields."""
    doc_defaults = direct(styles_root, W("docDefaults"))
    if doc_defaults is None:
        doc_defaults = etree.Element(W("docDefaults"))
        styles_root.insert(0, doc_defaults)
    rpr_default = direct(doc_defaults, W("rPrDefault"))
    if rpr_default is None:
        rpr_default = etree.Element(W("rPrDefault"))
        doc_defaults.insert(0, rpr_default)
    rpr = get_or_add(rpr_default, W("rPr"))
    east_asia = str(format_config["east_asia_font"])
    western = str(format_config["western_font"])
    set_fonts(rpr, east_asia=east_asia, western=western)
    set_inherited_run_language(rpr, document_language)

    patched_styles = 0
    for style in styles_root.findall(W("style")):
        name_node = direct(style, W("name"))
        style_name = name_node.get(W("val"), "") if name_node is not None else ""
        if style_name not in INHERITED_FONT_STYLE_NAMES:
            continue
        style_rpr = get_or_add(style, W("rPr"))
        set_fonts(style_rpr, east_asia=east_asia, western=western)
        set_inherited_run_language(style_rpr, document_language)
        patched_styles += 1

    return {
        "document_language": normalize_document_language(document_language),
        "english_all_western_slots": is_english_document_language(
            document_language
        ),
        "east_asia_font": east_asia,
        "western_font": western,
        "styles_patched": patched_styles,
    }


def normalize_zotero_style_id(value: str | None) -> str:
    style = str(value or "").strip()
    if re.fullmatch(r"https?://[^\s<>\"]+", style) and not style.startswith("http://www.zotero.org/styles/"):
        return style
    prefix = "http://www.zotero.org/styles/"
    if style.startswith(prefix):
        style = style[len(prefix):]
    if style.lower().endswith(".csl"):
        style = Path(style).stem
    if style == "apa7":
        style = "apa"
    if not re.fullmatch(r"[A-Za-z0-9_.-]+", style):
        return "apa"
    return style or "apa"


def zotero_style_uri(value):
    style = normalize_zotero_style_id(value)
    return style if re.match(r"^https?://", style) else f"http://www.zotero.org/styles/{style}"


def selected_csl_metadata(value, vault_root):
    """Read the real CSL ID; filenames are not reliable Zotero style IDs."""
    csl_path = Path(value).expanduser()
    if not csl_path.is_absolute():
        csl_path = vault_root / csl_path
    if not csl_path.is_file():
        raise ExportError(f"所选引用样式不存在：{csl_path}")
    try:
        xml = etree.parse(str(csl_path), etree.XMLParser(resolve_entities=False, no_network=True))
    except etree.XMLSyntaxError as error:
        raise ExportError(f"引用样式 XML 无效：{csl_path}") from error
    ns = {"csl":"http://purl.org/net/xbiblio/csl"}
    style_id = xml.findtext("csl:info/csl:id", namespaces=ns)
    if not style_id or not re.fullmatch(r"https?://[^\s<>\"]+", style_id.strip()):
        raise ExportError(f"引用样式缺少有效 CSL ID：{csl_path}")
    return csl_path.resolve(), style_id.strip()


def zotero_preference_properties(
    custom_root: etree._Element,
) -> list[etree._Element]:
    properties = [
        prop
        for prop in custom_root.findall(CP("property"))
        if re.fullmatch(r"ZOTERO_PREF_\d+", prop.get("name", ""))
    ]
    return sorted(
        properties,
        key=lambda prop: int(prop.get("name", "").rsplit("_", 1)[1]),
    )


def zotero_preference_text(custom_root: etree._Element) -> str:
    chunks: list[str] = []
    for prop in zotero_preference_properties(custom_root):
        value = prop.find(VT("lpwstr"))
        chunks.append(value.text or "" if value is not None else "")
    return "".join(chunks)


def english_zotero_preferences(style_id: str) -> str:
    root = etree.Element("data")
    root.set("data-version", "3")
    root.set("zotero-version", "5.0.89")
    etree.SubElement(root, "session").set("id", "MDExportWord")
    style = etree.SubElement(root, "style")
    style.set("id", zotero_style_uri(style_id))
    style.set("locale", "en-US")
    style.set("hasBibliography", "1")
    style.set("bibliographyStyleHasBeenSet", "0")
    prefs = etree.SubElement(root, "prefs")
    field_type = etree.SubElement(prefs, "pref")
    field_type.set("name", "fieldType")
    field_type.set("value", "Field")
    return etree.tostring(root, encoding="unicode")


def patch_zotero_document_preferences(
    custom_root: etree._Element | None,
    *,
    document_language: str | None,
    style_id: str | None,
    force: bool = False,
) -> dict[str, Any]:
    """Keep Zotero Refresh on an English CSL style for English exports."""
    if not force and not is_english_document_language(document_language):
        return {"patched": False, "reason": "non-English document"}
    target_style = normalize_zotero_style_id(style_id)
    if custom_root is None:
        return {
            "patched": False,
            "reason": "docProps/custom.xml is missing",
            "style_id": target_style,
        }

    original = zotero_preference_text(custom_root)
    if original:
        try:
            preferences = etree.fromstring(original.encode("utf-8"))
        except etree.XMLSyntaxError:
            preferences = etree.fromstring(
                english_zotero_preferences(target_style).encode("utf-8")
            )
    else:
        preferences = etree.fromstring(
            english_zotero_preferences(target_style).encode("utf-8")
        )

    style = preferences.find("style")
    if style is None:
        style = etree.SubElement(preferences, "style")
    style.set("id", zotero_style_uri(target_style))
    style.set("locale", "en-US" if is_english_document_language(document_language) else "zh-CN")
    style.set("hasBibliography", "1")
    style.set("bibliographyStyleHasBeenSet", "0")
    prefs = preferences.find("prefs")
    if prefs is None:
        prefs = etree.SubElement(preferences, "prefs")
    field_type = next(
        (
            node
            for node in prefs.findall("pref")
            if node.get("name") == "fieldType"
        ),
        None,
    )
    if field_type is None:
        field_type = etree.SubElement(prefs, "pref")
        field_type.set("name", "fieldType")
    field_type.set("value", "Field")

    updated = etree.tostring(preferences, encoding="unicode")
    chunks = [
        updated[index:index + ZOTERO_PREF_CHUNK_SIZE]
        for index in range(0, len(updated), ZOTERO_PREF_CHUNK_SIZE)
    ]
    properties = zotero_preference_properties(custom_root)
    next_pid = max(
        (
            int(prop.get("pid", "1"))
            for prop in custom_root.findall(CP("property"))
            if prop.get("pid", "").isdigit()
        ),
        default=1,
    ) + 1
    for index, chunk in enumerate(chunks, start=1):
        if index <= len(properties):
            prop = properties[index - 1]
            for child in list(prop):
                prop.remove(child)
        else:
            prop = etree.SubElement(custom_root, CP("property"))
            prop.set("fmtid", CUSTOM_PROPERTY_FMTID)
            prop.set("pid", str(next_pid))
            next_pid += 1
        prop.set("name", f"ZOTERO_PREF_{index}")
        etree.SubElement(prop, VT("lpwstr")).text = chunk
    for extra in properties[len(chunks):]:
        custom_root.remove(extra)
    return {
        "patched": original != updated,
        "style_id": target_style,
        "chunks": len(chunks),
    }


ZOTERO_FORMATTED_CITATION_RE = re.compile(
    r'(\"formattedCitation\"\s*:\s*\")((?:\\.|[^\"\\])*)(\")'
)


def normalize_english_citation_parentheses(value: str) -> tuple[str, int]:
    updated = value
    count = 0
    for old, new in (
        (r"\\uc0\\u65288{}", "("),
        (r"\\uc0\\u65289{}", ")"),
        (r"\uc0\u65288{}", "("),
        (r"\uc0\u65289{}", ")"),
        (r"\\u65288{}", "("),
        (r"\\u65289{}", ")"),
        (r"\u65288{}", "("),
        (r"\u65289{}", ")"),
        ("（", "("),
        ("）", ")"),
    ):
        occurrences = updated.count(old)
        if occurrences:
            updated = updated.replace(old, new)
            count += occurrences
    return updated, count


def normalize_zotero_formatted_citation(code: str) -> tuple[str, int]:
    replacements = 0

    def replace(match: re.Match[str]) -> str:
        nonlocal replacements
        normalized, count = normalize_english_citation_parentheses(
            match.group(2)
        )
        replacements += count
        return match.group(1) + normalized + match.group(3)

    return ZOTERO_FORMATTED_CITATION_RE.sub(replace, code), replacements


def set_xml_text(node: etree._Element, value: str) -> None:
    node.text = value
    if value[:1].isspace() or value[-1:].isspace():
        node.set(f"{{{XML_NS}}}space", "preserve")
    else:
        node.attrib.pop(f"{{{XML_NS}}}space", None)


def redistribute_field_code(
    code_nodes: list[etree._Element],
    code: str,
) -> None:
    remaining = code
    original_lengths = [len(node.text or "") for node in code_nodes]
    for index, node in enumerate(code_nodes):
        if index == len(code_nodes) - 1:
            chunk = remaining
        else:
            chunk = remaining[:original_lengths[index]]
            remaining = remaining[len(chunk):]
        set_xml_text(node, chunk)


def patch_english_zotero_citation_parentheses(
    document: etree._Element,
    *,
    document_language: str | None,
    western_font: str,
) -> dict[str, int]:
    if not is_english_document_language(document_language):
        return {"fields": 0, "field_code": 0, "display": 0}
    fields_patched = 0
    code_replacements = 0
    display_replacements = 0
    for field in field_inventory(document):
        if "ZOTERO_ITEM" not in field["code"].upper():
            continue
        updated_code, replacements = normalize_zotero_formatted_citation(
            field["code"]
        )
        if replacements:
            redistribute_field_code(field["code_nodes"], updated_code)
            code_replacements += replacements
            fields_patched += 1
        for text_node in field["result_nodes"]:
            value = text_node.text or ""
            normalized = value.replace("（", "(").replace("）", ")")
            if normalized != value:
                display_replacements += (
                    value.count("（") + value.count("）")
                )
                set_xml_text(text_node, normalized)
            if "(" not in normalized and ")" not in normalized:
                continue
            runs = text_node.xpath("ancestor::w:r[1]", namespaces=NS)
            if not runs:
                continue
            rpr = get_or_add(runs[0], W("rPr"))
            set_fonts(rpr, east_asia=western_font, western=western_font)
            fonts = direct(rpr, W("rFonts"))
            if fonts is not None:
                fonts.attrib.pop(W("hint"), None)
    return {
        "fields": fields_patched,
        "field_code": code_replacements,
        "display": display_replacements,
    }


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
    use_character_indent: bool = True,
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
    if use_character_indent:
        if first_line_chars is None:
            first_line_chars = 2.0 if first_line else 0.0
        indent.set(
            W("firstLineChars"),
            str(int(round(first_line_chars * 100))),
        )
    else:
        indent.attrib.pop(W("firstLineChars"), None)
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
                        "code_nodes": [],
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
            stack[-1]["code_nodes"].append(element)
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
    if role in {"heading2", "heading3", "heading4"}:
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


QUOTE_CHARS = frozenset("“”‘’")
OPENING_QUOTE_CHARS = frozenset("“‘")


def is_western_context_character(character: str) -> bool:
    return (
        character.isalnum()
        and unicodedata.east_asian_width(character) not in {"W", "F"}
    )


def nearest_context_character(
    value: str,
    *,
    start: int,
    step: int,
) -> str | None:
    index = start + step
    while 0 <= index < len(value):
        character = value[index]
        if character.isalnum():
            return character
        index += step
    return None


def quote_font_role(value: str, index: int) -> str:
    quote = value[index]
    directions = (1, -1) if quote in OPENING_QUOTE_CHARS else (-1, 1)
    for step in directions:
        context = nearest_context_character(value, start=index, step=step)
        if context is not None:
            return (
                "western"
                if is_western_context_character(context)
                else "east_asia"
            )
    return "east_asia"


def paragraph_text_context(
    run: etree._Element,
    text_node: etree._Element,
) -> tuple[str, str]:
    paragraphs = run.xpath("ancestor::w:p[1]", namespaces=NS)
    if not paragraphs:
        return "", ""
    nodes = paragraphs[0].xpath(".//w:t", namespaces=NS)
    try:
        position = nodes.index(text_node)
    except ValueError:
        return "", ""
    before = "".join((node.text or "") for node in nodes[:position])
    after = "".join((node.text or "") for node in nodes[position + 1 :])
    return before, after


def expected_run_fonts(
    run: etree._Element,
    run_text: str,
    *,
    format_config: dict[str, Any],
) -> tuple[str, str]:
    east_asia = str(format_config["east_asia_font"])
    western = str(format_config["western_font"])
    if not run_text or not all(
        character in QUOTE_CHARS for character in run_text
    ):
        return east_asia, western
    text_node = run.find(W("t"))
    if text_node is None:
        return east_asia, east_asia
    before, after = paragraph_text_context(run, text_node)
    contextual_value = f"{before}{run_text}{after}"
    offset = len(before)
    roles = {
        quote_font_role(contextual_value, offset + index)
        for index in range(len(run_text))
    }
    font = western if roles == {"western"} else east_asia
    return font, font


def split_quote_runs(
    root: etree._Element,
    *,
    format_config: dict[str, Any],
) -> int:
    split_count = 0
    runs = list(root.xpath(".//w:r", namespaces=NS))
    for run in runs:
        if run.xpath("./w:instrText|./w:fldChar|./w:drawing", namespaces=NS):
            continue
        text_nodes = run.findall(W("t"))
        if len(text_nodes) != 1:
            continue
        value = text_nodes[0].text or ""
        if not any(char in QUOTE_CHARS for char in value):
            continue
        before, after = paragraph_text_context(run, text_nodes[0])
        contextual_value = f"{before}{value}{after}"
        offset = len(before)
        roles = [
            (
                quote_font_role(contextual_value, offset + index)
                if character in QUOTE_CHARS
                else None
            )
            for index, character in enumerate(value)
        ]
        groups: list[tuple[str, str | None]] = []
        start = 0
        current_role = roles[0]
        for index in range(1, len(value) + 1):
            boundary = index == len(value)
            next_role = roles[index] if not boundary else None
            if boundary or next_role != current_role:
                groups.append((value[start:index], current_role))
                start = index
                current_role = next_role
        if len(groups) == 1:
            rpr = get_or_add(run, W("rPr"))
            font = (
                str(format_config["western_font"])
                if groups[0][1] == "western"
                else str(format_config["east_asia_font"])
            )
            set_fonts(
                rpr,
                east_asia=font,
                western=font,
            )
            continue

        parent = run.getparent()
        position = parent.index(run)
        replacements: list[etree._Element] = []
        for segment, role in groups:
            clone = copy.deepcopy(run)
            clone_text = clone.find(W("t"))
            clone_text.text = segment
            if segment[:1].isspace() or segment[-1:].isspace():
                clone_text.set(f"{{{XML_NS}}}space", "preserve")
            else:
                clone_text.attrib.pop(f"{{{XML_NS}}}space", None)
            if role is not None:
                rpr = get_or_add(clone, W("rPr"))
                if clone.index(rpr) != 0:
                    clone.remove(rpr)
                    clone.insert(0, rpr)
                font = (
                    str(format_config["western_font"])
                    if role == "western"
                    else str(format_config["east_asia_font"])
                )
                set_fonts(
                    rpr,
                    east_asia=font,
                    western=font,
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
                frontmatter = lines[1:index]
                if not any(
                    re.match(r"^\s*linkReferences\s*:", line)
                    for line in frontmatter
                ):
                    additions.append("linkReferences: true")
                if not any(
                    re.match(r"^\s*zotero[-_]client\s*:", line)
                    for line in frontmatter
                ):
                    additions.append("zotero-client: zotero")
                if not any(
                    re.match(
                        r"^\s*zotero[-_]author[-_]in[-_]text\s*:",
                        line,
                        flags=re.IGNORECASE,
                    )
                    for line in frontmatter
                ):
                    additions.append("zotero-author-in-text: true")
                is_english = any(
                    re.match(
                        r"^\s*lang\s*:\s*[\"']?en(?:[-_][A-Za-z0-9]+)?",
                        line,
                        flags=re.IGNORECASE,
                    )
                    for line in frontmatter
                )
                if is_english and not any(
                    re.match(
                        r"^\s*zotero[-_]csl[-_]style\s*:",
                        line,
                        flags=re.IGNORECASE,
                    )
                    for line in frontmatter
                ):
                    # The Word reference template may carry Chinese Zotero
                    # document preferences.  Give the Zotero filter an
                    # explicit English style so a later Refresh cannot restore
                    # full-width citation parentheses.
                    additions.append("zotero-csl-style: apa")
                lines[index:index] = additions
                return "\n".join(lines) + "\n"
    return (
        "---\n"
        "linkReferences: true\n"
        "zotero-client: zotero\n"
        "zotero-author-in-text: true\n"
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
    """Keep one meaningful document title in the temporary export copy.

    Obsidian's frontmatter title remains untouched in the source file. Only
    the temporary export copy drops the scalar ``title:`` entry when a body H1
    exists, preventing Pandoc from emitting both a metadata title and the H1.
    If the first H1 is an abstract heading, promote the metadata title to the
    document H1 and retain the abstract heading as a section heading.
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
    heading_index: int | None = None
    for index in range(body_start, len(lines)):
        line = lines[index]
        match = re.match(r"^\s*#\s+(.+?)\s*$", line)
        if match:
            document_title = visible_markdown_heading(match.group(1))
            heading_index = index
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

    if (
        heading_index is not None
        and document_title.casefold() in {"摘要", "abstract"}
        and metadata_title
    ):
        section_heading = re.sub(
            r"^(\s*)#(\s+)", r"\1##\2", lines[heading_index], count=1
        )
        lines[heading_index : heading_index + 1] = [
            f"# {metadata_title}",
            "",
            section_heading,
        ]
        document_title = metadata_title

    removed = False
    for index in range(1, frontmatter_end):
        if re.match(r"^\s*title\s*:", lines[index], flags=re.IGNORECASE):
            del lines[index]
            removed = True
            break
    suffix = "\n" if text.endswith("\n") else ""
    return "\n".join(lines) + suffix, document_title, removed


def count_ast_note_paragraphs(ast: dict[str, Any]) -> int:
    return sum(
        1
        for node in walk_ast(ast)
        if node.get("t") in {"Para", "Plain"}
        and is_note_paragraph_text(stringify_inlines(node.get("c", [])))
    )


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
            r"(?<=[\u3400-\u9fff，。；：？！、])[ \t]+(?=\[@[^\]\r\n]+\])",
            "",
            line,
        )
        line, marked_before_count = re.subn(
            r"(?<=[\u3400-\u9fff，。；：？！、])[ \t]+(?=\[\[@[^\]\r\n]+\]\]\{\.mark\})",
            "",
            line,
        )
        line, after_count = re.subn(
            r"(\[@[^\]\r\n]+\])[ \t]+(?=[\u3400-\u9fff，。；：？！、])",
            r"\1",
            line,
        )
        changes += before_count + marked_before_count + after_count
        output.append(line)
    return "\n".join(output) + ("\n" if text.endswith("\n") else ""), changes


def normalize_css_color(value: str) -> str | None:
    """Return a six-digit RGB value for a supported CSS color."""
    candidate = value.strip().lower()
    hex_match = re.fullmatch(r"#([0-9a-f]{3}|[0-9a-f]{6})", candidate)
    if hex_match:
        digits = hex_match.group(1)
        if len(digits) == 3:
            digits = "".join(character * 2 for character in digits)
        return digits.upper()
    rgb_match = re.fullmatch(
        r"rgb\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})\s*\)",
        candidate,
    )
    if rgb_match:
        channels = [int(channel) for channel in rgb_match.groups()]
        if all(0 <= channel <= 255 for channel in channels):
            return "".join(f"{channel:02X}" for channel in channels)
    return CSS_NAMED_COLORS.get(candidate)


def css_mark_background_color(attributes: str) -> str | None:
    """Extract an exact, Word-compatible background color from mark attrs."""
    style_match = re.search(
        r"\bstyle\s*=\s*(?:\"([^\"]*)\"|'([^']*)'|([^\s>]+))",
        attributes,
        flags=re.IGNORECASE,
    )
    if not style_match:
        return None
    style = next(
        (group for group in style_match.groups() if group is not None),
        "",
    )
    colors: list[str] = []
    for declaration in style.split(";"):
        if ":" not in declaration:
            continue
        property_name, property_value = declaration.split(":", 1)
        if property_name.strip().lower() not in {
            "background",
            "background-color",
        }:
            continue
        value = property_value.strip()
        color = normalize_css_color(value)
        if color is None and value:
            color = normalize_css_color(value.split()[0])
        if color is not None:
            colors.append(color)
    return colors[-1] if colors else None


def custom_mark_style_id(color: str) -> str:
    return CUSTOM_MARK_STYLE_PREFIX + color.upper()


def custom_mark_color_from_style_id(style_id: str) -> str | None:
    match = re.fullmatch(
        re.escape(CUSTOM_MARK_STYLE_PREFIX) + r"([0-9A-Fa-f]{6})",
        style_id,
    )
    return match.group(1).upper() if match else None


def normalize_html_mark_highlights(text: str) -> tuple[str, int]:
    """Convert HTML marks to Word-safe Pandoc highlight representations.

    Uncolored ``<mark>`` spans become native ``==mark==`` spans and therefore
    use Word's standard yellow highlighter.  A supported CSS background color
    becomes a Pandoc custom-style span whose exact RGB fill is materialized in
    the final DOCX. Fenced code blocks are intentionally excluded.
    """
    lines = text.splitlines()
    in_fence = False
    changes = 0
    output: list[str] = []
    fence_pattern = re.compile(r"^\s*(```+|~~~+)")
    mark_pattern = re.compile(
        r"<mark\b(?P<attributes>[^>]*)>(?P<content>.*?)</mark>",
        flags=re.IGNORECASE,
    )

    def replace_mark(match: re.Match[str]) -> str:
        content = match.group("content")
        color = css_mark_background_color(match.group("attributes"))
        if color is None:
            return f"[{content}]{{.mark}}"
        return (
            f"[{content}]"
            f'{{custom-style="{custom_mark_style_id(color)}"}}'
        )

    for line in lines:
        if fence_pattern.match(line):
            in_fence = not in_fence
            output.append(line)
            continue
        if in_fence:
            output.append(line)
            continue
        line, line_changes = mark_pattern.subn(replace_mark, line)
        changes += line_changes
        output.append(line)
    return "\n".join(output) + ("\n" if text.endswith("\n") else ""), changes


def normalize_markdown_highlights(text: str) -> tuple[str, int]:
    """Convert Markdown ``==...==`` marks to nestable Pandoc spans.

    Pandoc's mark delimiter parser leaves literal delimiters behind when
    marked text contains a custom HTML-derived span. Bracketed spans support
    the same mark class while allowing nested custom colors. Delimiters inside
    fenced code, inline code, or TeX math are left untouched.
    """
    lines = text.splitlines()
    in_fence = False
    output: list[str] = []
    changes = 0
    fence_pattern = re.compile(r"^\s*(```+|~~~+)")

    for line in lines:
        if fence_pattern.match(line):
            in_fence = not in_fence
            output.append(line)
            continue
        if in_fence:
            output.append(line)
            continue

        delimiters: list[int] = []
        index = 0
        code_ticks = 0
        math_dollars = 0
        while index < len(line):
            if line[index] == "`":
                end = index + 1
                while end < len(line) and line[end] == "`":
                    end += 1
                run_length = end - index
                if code_ticks == 0:
                    code_ticks = run_length
                elif code_ticks == run_length:
                    code_ticks = 0
                index = end
                continue
            if code_ticks:
                index += 1
                continue
            if line[index] == "$":
                end = index + 1
                while end < len(line) and line[end] == "$":
                    end += 1
                run_length = end - index
                if math_dollars == 0:
                    math_dollars = run_length
                elif math_dollars == run_length:
                    math_dollars = 0
                index = end
                continue
            if not math_dollars and line.startswith("==", index):
                delimiters.append(index)
                index += 2
                continue
            index += 1

        if len(delimiters) % 2:
            output.append(line)
            continue

        if not delimiters:
            output.append(line)
            continue

        pieces: list[str] = []
        cursor = 0
        for delimiter_index in range(0, len(delimiters), 2):
            opening = delimiters[delimiter_index]
            closing = delimiters[delimiter_index + 1]
            pieces.append(line[cursor:opening])
            pieces.append("[")
            pieces.append(line[opening + 2:closing])
            pieces.append("]{.mark}")
            cursor = closing + 2
        pieces.append(line[cursor:])
        output.append("".join(pieces))
        changes += len(delimiters)

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
        if re.match(r"^\$\$\s*$", line.strip())
        or re.match(r"^\$\$\s+\{#eq:[^}]+\}\s*$", line.strip())
    ]
    if len(delimiter_indexes) % 2:
        raise ExportError("Markdown 行间公式的 $$ 分隔符数量不是偶数")

    assigned: list[int] = []
    replacements: dict[int, list[str]] = {}
    for pair in range(0, len(delimiter_indexes), 2):
        opening = delimiter_indexes[pair]
        closing = delimiter_indexes[pair + 1]
        before = previous_nonempty(lines, opening)
        inline_label = re.match(
            r"^\$\$\s+\{#eq:([^}]+)\}\s*$",
            lines[closing].strip(),
        )
        standalone_label = None
        if closing + 1 < len(lines):
            standalone_label = re.match(
                r"^\{#eq:([^}]+)\}\s*$",
                lines[closing + 1].strip(),
            )
        existing_label = inline_label or standalone_label
        after_index = closing + 1 if standalone_label else closing
        after = next_nonempty(lines, after_index)
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
        if inline_label:
            replacements[closing] = ["$$", f"{{#eq:{inline_label.group(1)}}}"]
        if number is not None and number not in assigned:
            if not existing_label:
                replacements[closing] = ["$$", f"{{#eq:paperbell-{number}}}"]
            assigned.append(number)

    for closing in sorted(replacements, reverse=True):
        lines[closing : closing + 1] = replacements[closing]
        label_index = closing + 1
        if label_index + 1 >= len(lines) or lines[label_index + 1].strip():
            lines.insert(label_index + 1, "")
    return "\n".join(lines) + "\n", assigned


def prepare_markdown(source: str) -> tuple[str, dict[str, Any]]:
    prepared, document_title, frontmatter_title_suppressed = (
        suppress_frontmatter_title_when_h1_exists(source)
    )
    prepared = inject_metadata(prepared)
    prepared = convert_obsidian_image_embeds(prepared)
    prepared, image_space_changes = normalize_markdown_image_spacing(prepared)
    prepared, html_mark_changes = normalize_html_mark_highlights(prepared)
    prepared, markdown_mark_changes = normalize_markdown_highlights(prepared)
    prepared, citation_space_changes = normalize_markdown_citation_spacing(
        prepared
    )
    prepared, removed_static_refs = strip_static_bibliography(prepared)
    prepared, equation_numbers = label_numbered_equations(prepared)
    return prepared, {
        "static_references_removed": removed_static_refs,
        "equation_numbers": equation_numbers,
        "citation_space_changes": citation_space_changes,
        "image_space_changes": image_space_changes,
        "html_mark_changes": html_mark_changes,
        "markdown_mark_changes": markdown_mark_changes,
        "document_title": document_title,
        "frontmatter_title_suppressed": frontmatter_title_suppressed,
    }


def filter_english_caption_blocks(ast: dict[str, Any], config: dict[str, Any]) -> int:
    """Omit only bilingual EN caption Divs, before citation inventory/filtering.

    Work on Pandoc's parsed tree so code examples and enclosing landscape Divs
    stay intact. English manuscripts always retain their primary captions.
    """
    if config.get("include_english_captions", True) or is_english_document_language(config.get("document_language")):
        return 0
    count = 0

    def visit(value: Any) -> None:
        nonlocal count
        if isinstance(value, list):
            retained = []
            for item in value:
                if isinstance(item, dict) and item.get("t") == "Div":
                    attrs = item["c"][0]
                    style = dict(attrs[2]).get("custom-style", "").strip().casefold()
                    if style in {"figure caption en", "table caption en"}:
                        count += 1
                        continue
                visit(item)
                retained.append(item)
            value[:] = retained
        elif isinstance(value, dict):
            for child in value.values():
                visit(child)

    visit(ast.get("blocks", []))
    return count


def walk_ast(node: Any) -> Iterable[dict[str, Any]]:
    if isinstance(node, dict):
        yield node
        for value in node.values():
            yield from walk_ast(value)
    elif isinstance(node, list):
        for value in node:
            yield from walk_ast(value)


def visible_highlight_inventory(
    ast: dict[str, Any],
) -> tuple[int, Counter[str]]:
    """Count rendered, non-whitespace characters under effective marks.

    Nested Pandoc spans style a text run once; citations, math, images, code,
    and raw OpenXML do not become ordinary marked Word text. Whitespace is
    omitted because the DOCX typography pass may normalize it without
    changing the highlighted content.
    """
    mark_count = 0
    custom_counts: Counter[str] = Counter()
    excluded = {"Cite", "Code", "Image", "Math", "RawInline"}

    def visit(
        node: Any,
        *,
        marked: bool = False,
        custom_color: str | None = None,
    ) -> None:
        nonlocal mark_count
        if isinstance(node, list):
            for value in node:
                visit(value, marked=marked, custom_color=custom_color)
            return
        if not isinstance(node, dict):
            return
        kind = node.get("t")
        if kind in excluded:
            return
        content = node.get("c")
        if kind == "Span" and isinstance(content, list) and len(content) == 2:
            attributes = content[0]
            classes = attributes[1] if isinstance(attributes, list) else []
            key_values = (
                dict(attributes[2])
                if isinstance(attributes, list) and len(attributes) > 2
                else {}
            )
            own_color = custom_mark_color_from_style_id(
                key_values.get("custom-style", "")
            )
            visit(
                content[1],
                marked=marked or "mark" in classes,
                custom_color=own_color or custom_color,
            )
            return
        if kind == "Str":
            length = sum(
                not character.isspace()
                for character in str(content or "")
            )
            if marked:
                mark_count += length
            if custom_color:
                custom_counts[custom_color] += length
            return
        if kind in {"Space", "SoftBreak", "LineBreak"}:
            return
        if isinstance(content, (list, dict)):
            visit(content, marked=marked, custom_color=custom_color)

    visit(ast.get("blocks", []))
    return mark_count, custom_counts


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
        MARKDOWN_INPUT_FORMAT,
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


def load_citekey_aliases(ast: dict[str, Any]) -> dict[str, str]:
    """Read document-local Zotero citekey aliases from Pandoc metadata."""
    meta = ast.get("meta", {})
    entry = meta.get("zotero-citekey-aliases")
    if entry is None:
        return {}
    if (
        not isinstance(entry, dict)
        or entry.get("t") != "MetaMap"
        or not isinstance(entry.get("c"), dict)
    ):
        raise ExportError(
            "zotero-citekey-aliases 必须是 YAML 映射：旧键: 文献库现有键"
        )

    aliases: dict[str, str] = {}
    for source, value in entry["c"].items():
        if not isinstance(source, str) or not source.strip():
            raise ExportError("zotero-citekey-aliases 中存在空旧键")
        if not isinstance(value, dict):
            raise ExportError(
                f"zotero-citekey-aliases 中 @{source} 的目标键格式无效"
            )
        if value.get("t") == "MetaString":
            target = value.get("c")
        elif value.get("t") == "MetaInlines":
            inlines = value.get("c", [])
            target = (
                inlines[0].get("c")
                if len(inlines) == 1 and inlines[0].get("t") == "Str"
                else None
            )
        else:
            target = None
        if not isinstance(target, str) or not target.strip():
            raise ExportError(
                f"zotero-citekey-aliases 中 @{source} 的目标键必须是纯字符串"
            )
        if source == target:
            raise ExportError(f"zotero-citekey-aliases 中 @{source} 指向自身")
        if re.match(r"^(?:fig|tbl|eq|sec|lst):", source, re.IGNORECASE) or re.match(
            r"^(?:fig|tbl|eq|sec|lst):", target, re.IGNORECASE
        ):
            raise ExportError("图、表、公式和章节等交叉引用不能设置为 Zotero citekey 别名")
        aliases[source] = target

    resolved: dict[str, str] = {}
    for source in aliases:
        target = aliases[source]
        seen = {source}
        while target in aliases:
            if target in seen:
                raise ExportError(
                    f"zotero-citekey-aliases 存在循环映射：@{source}"
                )
            seen.add(target)
            target = aliases[target]
        resolved[source] = target
    return resolved


def apply_citekey_aliases(
    ast: dict[str, Any], aliases: dict[str, str]
) -> dict[str, str]:
    """Map only Zotero citation IDs in the export AST; leave Markdown intact."""
    used: dict[str, str] = {}
    if not aliases:
        return used
    for node in walk_ast(ast):
        if node.get("t") != "Cite":
            continue
        for citation in node.get("c", [[], []])[0]:
            source = citation.get("citationId", "")
            if source in aliases:
                citation["citationId"] = aliases[source]
                used[source] = aliases[source]
    ast.get("meta", {}).pop("zotero-citekey-aliases", None)
    return used


def _dedupe_figure_alt_cites(node: Any) -> None:
    # pandoc Figure 节点: c = [attr, caption, blocks]
    # caption 与内部 Image 的 alt 各含同一份 inline(含 Cite),遍历
    # 时同一图题引用被计数两次。清空 Figure 内部所有 Image 的 alt 副本,
    # 只保留 caption 一份;Image 路径字段(c[2])不动,图片统计不受影响。
    if isinstance(node, dict):
        if node.get("t") == "Figure":
            c = node.get("c")
            if isinstance(c, list) and len(c) >= 3:
                def _clear_img_alt(sub: Any) -> None:
                    if isinstance(sub, dict):
                        if sub.get("t") == "Image":
                            cc = sub.get("c")
                            if isinstance(cc, list) and len(cc) >= 2:
                                cc[1] = []
                            return
                        for v in sub.values():
                            _clear_img_alt(v)
                    elif isinstance(sub, list):
                        for v in sub:
                            _clear_img_alt(v)
                _clear_img_alt(c[2])
            return
        for v in node.values():
            _dedupe_figure_alt_cites(v)
    elif isinstance(node, list):
        for v in node:
            _dedupe_figure_alt_cites(v)


def normalize_markdown_image_spacing(text: str) -> tuple[str, int]:
    """Isolate standalone images in the temporary export copy.

    Pandoc needs paragraph boundaries to create figures with visible captions.
    Preserve existing blank lines and skip metadata, code and display math.
    """
    lines = text.splitlines()
    image_lines: set[int] = set()
    fence_char = ""
    fence_length = 0
    in_math = False
    in_metadata = bool(lines and lines[0].strip() == "---")
    image_pattern = re.compile(
        r"^ {0,3}!\[.*\]\(.+\)(?:[ \t]*\{[^}]*\})?[ \t]*$"
    )
    for index, line in enumerate(lines):
        if in_metadata:
            if index and line.strip() in {"---", "..."}:
                in_metadata = False
            continue
        if fence_char:
            if re.fullmatch(
                rf" {{0,3}}{re.escape(fence_char)}{{{fence_length},}}[ \t]*",
                line,
            ):
                fence_char = ""
            continue
        if line.strip() == "$$":
            in_math = not in_math
            continue
        if in_math:
            continue
        fence = re.match(r"^ {0,3}(`{3,}|~{3,})", line)
        if fence:
            fence_char = fence.group(1)[0]
            fence_length = len(fence.group(1))
            continue
        if image_pattern.fullmatch(line):
            image_lines.add(index)

    attached_attributes = {
        index + 1 for index in image_lines
        if index + 1 < len(lines)
        and re.fullmatch(r"[ \t]*\{#fig:[^{}\s]+(?:[ \t]+[^{}]*)?\}[ \t]*", lines[index + 1])
        and lines[index].rstrip().endswith(")")
    }
    output: list[str] = []
    changes = 0
    for index, line in enumerate(lines):
        if index in attached_attributes:
            continue
        if index + 1 in attached_attributes:
            line = line.rstrip() + lines[index + 1].strip()
            changes += 1
        # Insert once per boundary, including between two adjacent images.
        if (
            index
            and (index in image_lines or index - 1 in image_lines
                 or index - 1 in attached_attributes)
            and lines[index - 1].strip()
            and line.strip()
        ):
            output.append("")
            changes += 1
        output.append(line)
    newline = "\r\n" if "\r\n" in text else "\n"
    return newline.join(output) + (newline if text.endswith("\n") else ""), changes


def ast_inventory(ast: dict[str, Any]) -> dict[str, Any]:
    ast = copy.deepcopy(ast)
    _dedupe_figure_alt_cites(ast)
    citation_clusters = 0
    author_in_text_clusters = 0
    citekeys: list[str] = []
    image_targets: list[str] = []
    math_count = 0
    display_math_count = 0
    table_count = 0
    highlight_chars, custom_highlight_chars = visible_highlight_inventory(ast)
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
                    r"^(?:fig|tbl|eq|sec|lst):",
                    citation.get("citationId", ""),
                    re.IGNORECASE,
                )
            ]
            if zotero_citations:
                citation_clusters += 1
                if any(
                    citation.get("citationMode", {}).get("t") == "AuthorInText"
                    for citation in zotero_citations
                ):
                    author_in_text_clusters += 1
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
        "author_in_text_clusters": author_in_text_clusters,
        "citekeys": sorted(set(citekeys)),
        "image_targets": image_targets,
        "math_count": math_count,
        "display_math_count": display_math_count,
        "table_count": table_count,
        "highlight_chars": highlight_chars,
        "custom_highlight_chars": dict(sorted(custom_highlight_chars.items())),
        "headers": headers,
        "document_language": stringify_metadata(
            ast.get("meta", {}).get("lang")
        ),
        "zotero_csl_style": stringify_metadata(
            ast.get("meta", {}).get("zotero-csl-style")
            or ast.get("meta", {}).get("zotero_csl_style")
        ),
        "caption_titles": {
            "figure": stringify_metadata(
                ast.get("meta", {}).get("figureTitle")
            ),
            "table": stringify_metadata(
                ast.get("meta", {}).get("tableTitle")
            ),
        },
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
                r"^(?:fig|tbl|eq|sec|lst):",
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


def stringify_metadata(node: Any) -> str:
    if not isinstance(node, dict):
        return ""
    if node.get("t") == "MetaString":
        return str(node.get("c", "")).strip()
    return stringify_inlines(node)


DEFAULT_CAPTION_TITLES = {
    "figure": ("图", "Fig.", "Figure"),
    "table": ("表", "Table"),
}


def caption_title_candidates(
    source_inventory: dict[str, Any],
    caption_kind: str,
) -> tuple[str, ...]:
    configured = str(
        source_inventory.get("caption_titles", {}).get(caption_kind, "")
    ).strip()
    candidates = [
        configured,
        *DEFAULT_CAPTION_TITLES[caption_kind],
    ]
    return tuple(dict.fromkeys(value for value in candidates if value))


def valid_caption_text(text: str, titles: tuple[str, ...]) -> bool:
    title_pattern = "|".join(
        re.escape(title) for title in sorted(titles, key=len, reverse=True)
    )
    return bool(
        re.match(
            rf"^(?:{title_pattern})\s*\d+(?:[.:：])?\s+\S",
            text,
            flags=re.IGNORECASE,
        )
    )


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


_DIRECT_BBT_OPENER = urllib.request.build_opener(
    urllib.request.ProxyHandler({})
)


def _open_bbt_url(url: str, *, timeout: float = 12.0):
    """Reach Better BibTeX on loopback without using configured HTTP proxies."""
    return _DIRECT_BBT_OPENER.open(url, timeout=timeout)


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
        with _open_bbt_url(url, timeout=12) as response:
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
        resolved_keys = set(items)
        for item in items.values():
            if not isinstance(item, dict):
                continue
            for field in ("id", "citation-key", "citekey"):
                resolved_key = item.get(field)
                if isinstance(resolved_key, str) and resolved_key:
                    resolved_keys.add(resolved_key)
        for key in chunk:
            if key in errors:
                if errors[key] == 0:
                    missing.append(key)
                else:
                    duplicates.append(key)
            elif key not in resolved_keys:
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
        with _open_bbt_url(url, timeout=12) as response:
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
    max_height_emu: int,
) -> dict[str, int]:
    resized = Counter()
    for inline in document_root.xpath(".//wp:inline", namespaces=NS):
        extent = inline.find("wp:extent", namespaces=NS)
        if extent is None:
            continue
        width = int(extent.get("cx", "0"))
        height = int(extent.get("cy", "0"))
        if width <= 0 or height <= 0:
            continue
        width_scale = min(1.0, max_width_emu / width)
        height_scale = min(1.0, max_height_emu / height)
        scale = min(width_scale, height_scale)
        if scale >= 1.0:
            continue
        if width_scale < 1.0:
            resized["width"] += 1
        if height_scale < 1.0:
            resized["height"] += 1
        resized["total"] += 1
        new_width = round(width * scale)
        new_height = round(height * scale)
        extent.set("cx", str(new_width))
        extent.set("cy", str(new_height))
        for aext in inline.xpath(".//a:xfrm/a:ext", namespaces=NS):
            aext.set("cx", str(new_width))
            aext.set("cy", str(new_height))
    return dict(resized)


def paragraph_spacing_value(
    paragraph: etree._Element,
    name: str,
    default: int,
) -> int:
    value = paragraph.xpath(
        f"string(./w:pPr/w:spacing/@w:{name})",
        namespaces=NS,
    )
    try:
        return int(value) if value else default
    except ValueError:
        return default


def paragraph_font_twips(
    paragraph: etree._Element,
    default_points: float,
) -> int:
    values = paragraph.xpath(
        ".//w:rPr/w:sz/@w:val|.//m:r/w:rPr/w:sz/@w:val",
        namespaces=NS,
    )
    sizes: list[int] = []
    for value in values:
        try:
            sizes.append(int(round(float(value) * 10)))
        except (TypeError, ValueError):
            continue
    return max(sizes, default=points_twips(default_points))


def text_em_width(value: str) -> float:
    width = 0.0
    for character in value:
        if character.isspace():
            width += 0.3
        elif ord(character) >= 0x2E80:
            width += 1.0
        elif character.isupper():
            width += 0.65
        elif character.isalnum():
            width += 0.55
        else:
            width += 0.5
    return width


def estimated_paragraph_height_dxa(
    paragraph: etree._Element,
    *,
    max_width_dxa: int,
    format_config: dict[str, Any],
) -> int:
    line = paragraph_spacing_value(
        paragraph,
        "line",
        line_twips(float(format_config["body_line_spacing"])),
    )
    before = paragraph_spacing_value(paragraph, "before", 0)
    after = paragraph_spacing_value(paragraph, "after", 0)
    drawing_heights = [
        round(int(value) / 635)
        for value in paragraph.xpath(
            ".//wp:inline/wp:extent/@cy",
            namespaces=NS,
        )
        if str(value).isdigit()
    ]
    if drawing_heights:
        return before + max(max(drawing_heights), line) + after

    text = "".join(
        paragraph.xpath(".//w:t/text()|.//m:t/text()", namespaces=NS)
    )
    font_twips = paragraph_font_twips(
        paragraph,
        float(format_config["body_size_pt"]),
    )
    capacity = max(1.0, max_width_dxa / max(font_twips, 1))
    lines = max(1, math.ceil(text_em_width(text) / capacity))
    return before + lines * line + after


def estimated_table_height_dxa(
    table: etree._Element,
    *,
    max_width_dxa: int,
    format_config: dict[str, Any],
) -> int:
    height = 0
    for row in table.findall(W("tr")):
        row_height = 0
        for cell in row.findall(W("tc")):
            cell_height = sum(
                estimated_paragraph_height_dxa(
                    paragraph,
                    max_width_dxa=max_width_dxa,
                    format_config=format_config,
                )
                for paragraph in cell.iter(W("p"))
            )
            row_height = max(row_height, cell_height)
        height += max(
            row_height,
            line_twips(float(format_config["table_line_spacing"])),
        )
    return height


def advance_page_position(
    position: int,
    height: int,
    page_height: int,
    *,
    splittable: bool,
) -> int:
    if height <= 0:
        return position
    if position <= 0:
        return height % page_height
    remaining = page_height - position
    if height < remaining:
        return position + height
    if height == remaining:
        return 0
    if splittable:
        return (height - remaining) % page_height
    return height % page_height


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


def set_exact_run_shading(rpr: etree._Element, color: str) -> None:
    """Apply an exact RGB background fill without Word highlight override."""
    remove_direct(rpr, W("highlight"))
    remove_direct(rpr, W("shd"))
    shading = etree.SubElement(rpr, W("shd"))
    shading.set(W("val"), "clear")
    shading.set(W("color"), "auto")
    shading.set(W("fill"), color.upper())


def run_visible_text_length(run: etree._Element) -> int:
    count = len("".join(run.xpath(".//w:t/text()", namespaces=NS)))
    count += len(run.xpath(".//w:tab | .//w:br", namespaces=NS))
    return count


def patch_custom_mark_highlights(
    styles_root: etree._Element,
    document_root: etree._Element,
) -> dict[str, Any]:
    """Materialize custom Markdown mark colors as exact Word run shading."""
    style_colors: dict[str, str] = {}
    for style in styles_root.findall(W("style")):
        style_id = style.get(W("styleId"), "")
        color = custom_mark_color_from_style_id(style_id)
        if color is None:
            name = direct(style, W("name"))
            color = custom_mark_color_from_style_id(
                name.get(W("val"), "") if name is not None else ""
            )
        if color is None:
            continue
        style_colors[style_id] = color
        set_exact_run_shading(get_or_add(style, W("rPr")), color)

    character_counts: Counter[str] = Counter()
    run_counts: Counter[str] = Counter()
    for run in document_root.xpath(".//w:r[w:rPr/w:rStyle]", namespaces=NS):
        rpr = direct(run, W("rPr"))
        if rpr is None:
            continue
        style_node = direct(rpr, W("rStyle"))
        style_id = style_node.get(W("val"), "") if style_node is not None else ""
        color = style_colors.get(style_id)
        if color is None:
            color = custom_mark_color_from_style_id(style_id)
        if color is None:
            continue
        set_exact_run_shading(rpr, color)
        run_counts[color] += 1
        character_counts[color] += run_visible_text_length(run)

    return {
        "styles": dict(sorted(style_colors.items())),
        "runs": dict(sorted(run_counts.items())),
        "characters": dict(sorted(character_counts.items())),
    }


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
    if text in {"参考文献", "References"}:
        return "reference_heading"
    normalized_name = re.sub(r"\s+", "", name).lower()
    if name.lower() in {"heading 1", "title", "标题 1", "标题1"}:
        return "title"
    if normalized_name in {"heading2", "标题2"}:
        return "heading2"
    if normalized_name in {"heading3", "标题3"}:
        return "heading3"
    if re.fullmatch(r"(?:heading|标题)[4-9]", normalized_name):
        return "heading4"
    if name == "Image Caption":
        return "image_caption"
    if name == "Table Caption":
        return "table_caption"
    if valid_caption_text(text, DEFAULT_CAPTION_TITLES["figure"]):
        return "image_caption"
    if valid_caption_text(text, DEFAULT_CAPTION_TITLES["table"]):
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


def paragraph_role_for_reflow(
    paragraph: etree._Element,
    id_to_name: dict[str, str],
) -> str:
    return role_for_paragraph(
        paragraph,
        style_names=id_to_name,
        in_highlights=False,
    )


def is_transparent_body_marker(element: etree._Element) -> bool:
    return etree.QName(element).localname in {
        "bookmarkStart",
        "bookmarkEnd",
        "commentRangeStart",
        "commentRangeEnd",
        "permStart",
        "permEnd",
        "proofErr",
    }


def fit_figure_caption_clusters(document_root, *, styles, format_config):
    """Fit tall images with their rendered captions within printable height."""
    body = document_root.find(W("body"))
    if body is None:
        return {}
    children = list(body)
    names = {value: key for key, value in styles.items()}
    report = Counter()
    for index, paragraph in enumerate(children):
        if paragraph.tag != W("p") or not paragraph.xpath(".//wp:inline", namespaces=NS):
            continue
        end = figure_cluster_end(children, index, names)
        captions = [item for item in children[index + 1:end] if item.tag == W("p")]
        if not captions:
            continue
        caption_height = sum(estimated_paragraph_height_dxa(
            item, max_width_dxa=content_width_dxa(format_config),
            format_config=format_config) for item in captions)
        # Allow one extra caption line for Word's font metrics and line wrapping.
        reserve = caption_height + line_twips(float(format_config["caption_line_spacing"]))
        reserve += paragraph_spacing_value(paragraph, "before", 0)
        reserve += paragraph_spacing_value(paragraph, "after", 0)
        maximum = max(1440, content_height_dxa(format_config) - reserve)
        report.update(resize_inline_images(
            paragraph, max_width_emu=content_width_emu(format_config),
            max_height_emu=maximum * 635))
        set_on_off(get_or_add(paragraph, W("pPr")), "keepNext", True)
    return dict(report)


def figure_cluster_start(
    children: list[etree._Element],
    picture_index: int,
) -> int:
    start = picture_index
    while start > 0 and is_transparent_body_marker(children[start - 1]):
        start -= 1
    return start


def figure_cluster_end(
    children: list[etree._Element],
    start: int,
    id_to_name: dict[str, str],
) -> int:
    end = start + 1
    while end < len(children):
        if is_transparent_body_marker(children[end]):
            end += 1
            continue
        if children[end].tag != W("p"):
            break
        if paragraph_role_for_reflow(children[end], id_to_name) != (
            "image_caption"
        ):
            break
        end += 1
    while end < len(children):
        if is_transparent_body_marker(children[end]):
            end += 1
            continue
        if children[end].tag != W("p"):
            break
        if paragraph_role_for_reflow(children[end], id_to_name) != "note":
            break
        end += 1
    while end < len(children) and is_transparent_body_marker(children[end]):
        end += 1
    return end


CAPTION_SIGNATURE_PATTERNS = {
    "figure": re.compile(
        r"^(?P<prefix>图|fig(?:ure)?\.?)\s*"
        r"(?P<number>\d+(?:[.\-—–]\d+)*(?:[A-Za-z])?)",
        flags=re.IGNORECASE,
    ),
    "table": re.compile(
        r"^(?P<prefix>表|table)\s*"
        r"(?P<number>\d+(?:[.\-—–]\d+)*(?:[A-Za-z])?)",
        flags=re.IGNORECASE,
    ),
}


def caption_signature(
    text: str,
    *,
    caption_kind: str,
) -> tuple[str, str] | None:
    match = CAPTION_SIGNATURE_PATTERNS[caption_kind].match(text.strip())
    if match is None:
        return None
    prefix = match.group("prefix").lower()
    language = "zh" if prefix in {"图", "表"} else "en"
    number = re.sub(r"[—–]", "-", match.group("number")).lower()
    return number, language


def remove_redundant_generated_image_captions(
    document_root: etree._Element,
    *,
    image_caption_style_id: str,
) -> int:
    """Remove Pandoc's alt-text caption when explicit bilingual captions exist.

    Markdown documents often use a descriptive image alt followed by separate
    Chinese and English figure-title paragraphs. Pandoc turns the alt into an
    additional Image Caption. After the explicit title paragraphs are styled,
    a repeated caption language identifies that first paragraph as redundant.
    """
    body = document_root.find(W("body"))
    if body is None:
        return 0
    removed = 0
    children = list(body)
    index = 0
    while index < len(children):
        picture = children[index]
        if not (
            picture.tag == W("p")
            and picture.xpath(".//w:drawing|.//w:pict", namespaces=NS)
        ):
            index += 1
            continue
        captions: list[etree._Element] = []
        cursor = index + 1
        while cursor < len(children):
            if is_transparent_body_marker(children[cursor]):
                cursor += 1
                continue
            if children[cursor].tag != W("p"):
                break
            paragraph = children[cursor]
            style_values = paragraph.xpath(
                "./w:pPr/w:pStyle/@w:val",
                namespaces=NS,
            )
            if not style_values or style_values[0] != image_caption_style_id:
                break
            captions.append(paragraph)
            cursor += 1
        signatures = [
            caption_signature(
                paragraph_text(paragraph),
                caption_kind="figure",
            )
            for paragraph in captions
        ]
        if len(captions) >= 2 and signatures[0] is not None:
            first_number, first_language = signatures[0]
            repeated_language = any(
                signature is not None
                and signature[0] == first_number
                and signature[1] == first_language
                for signature in signatures[1:]
            )
            if repeated_language:
                body.remove(captions[0])
                removed += 1
                children = list(body)
                continue
        index = cursor
    return removed


def eligible_reflow_paragraph(
    element: etree._Element,
    id_to_name: dict[str, str],
) -> bool:
    if element.tag != W("p"):
        return False
    if element.xpath(".//w:drawing|.//w:pict", namespaces=NS):
        return False
    if element.xpath(
        "./w:pPr/w:pageBreakBefore|.//w:br[@w:type='page']",
        namespaces=NS,
    ):
        return False
    if paragraph_role_for_reflow(element, id_to_name) != "body":
        return False
    return bool(
        "".join(
            element.xpath(
                ".//w:t/text()|.//m:t/text()",
                namespaces=NS,
            )
        ).strip()
    )


def reflow_large_figures(
    document_root: etree._Element,
    *,
    styles: dict[str, str],
    format_config: dict[str, Any],
) -> dict[str, Any]:
    """Fill pre-figure gaps with following prose from the same section.

    Only whole top-level body paragraphs move. The first heading, table,
    equation, note, caption, or another picture is a hard boundary.
    """
    if not bool(format_config.get("figure_reflow", False)):
        return {
            "enabled": False,
            "figures_reflowed": 0,
            "paragraphs_moved": 0,
            "estimated_blank_lines_filled": 0,
        }
    body = document_root.find(W("body"))
    if body is None:
        raise ExportError("输出 Word 缺少正文 body")

    id_to_name = {value: key for key, value in styles.items()}
    max_width = content_width_dxa(format_config)
    page_height = content_height_dxa(format_config)
    body_line = line_twips(float(format_config["body_line_spacing"]))
    minimum_gap = max(3 * body_line, 720)
    moved_paragraphs = 0
    filled_height = 0
    reflowed_figures: set[int] = set()
    max_moves = 512

    while moved_paragraphs < max_moves:
        children = list(body)
        position = 0
        changed = False
        index = 0
        while index < len(children):
            element = children[index]
            is_picture = (
                element.tag == W("p")
                and bool(
                    element.xpath(
                        ".//w:drawing|.//w:pict",
                        namespaces=NS,
                    )
                )
            )
            if is_picture:
                cluster_start = figure_cluster_start(children, index)
                cluster_end = figure_cluster_end(
                    children,
                    index,
                    id_to_name,
                )
                cluster_height = sum(
                    estimated_paragraph_height_dxa(
                        item,
                        max_width_dxa=max_width,
                        format_config=format_config,
                    )
                    if item.tag == W("p")
                    else estimated_table_height_dxa(
                        item,
                        max_width_dxa=max_width,
                        format_config=format_config,
                    )
                    for item in children[index:cluster_end]
                )
                remaining = page_height - position if position else page_height
                needs_new_page = (
                    position > 0 and cluster_height > remaining
                )
                candidate = (
                    children[cluster_end]
                    if cluster_end < len(children)
                    else None
                )
                if (
                    needs_new_page
                    and remaining >= minimum_gap
                    and candidate is not None
                    and eligible_reflow_paragraph(candidate, id_to_name)
                ):
                    candidate_height = estimated_paragraph_height_dxa(
                        candidate,
                        max_width_dxa=max_width,
                        format_config=format_config,
                    )
                    body.remove(candidate)
                    body.insert(cluster_start, candidate)
                    moved_paragraphs += 1
                    filled_height += min(remaining, candidate_height)
                    reflowed_figures.add(id(element))
                    changed = True
                    break
                position = advance_page_position(
                    position,
                    cluster_height,
                    page_height,
                    splittable=False,
                )
                index = cluster_end
                continue

            if element.tag == W("p"):
                height = estimated_paragraph_height_dxa(
                    element,
                    max_width_dxa=max_width,
                    format_config=format_config,
                )
                role = paragraph_role_for_reflow(element, id_to_name)
                splittable = role in {
                    "body",
                    "keywords",
                    "highlight_item",
                    "note",
                }
            elif element.tag == W("tbl"):
                height = estimated_table_height_dxa(
                    element,
                    max_width_dxa=max_width,
                    format_config=format_config,
                )
                splittable = True
            else:
                height = 0
                splittable = True
            position = advance_page_position(
                position,
                height,
                page_height,
                splittable=splittable,
            )
            index += 1
        if not changed:
            break

    return {
        "enabled": True,
        "figures_reflowed": len(reflowed_figures),
        "paragraphs_moved": moved_paragraphs,
        "estimated_blank_lines_filled": round(
            filled_height / max(body_line, 1),
            1,
        ),
        "move_limit_reached": moved_paragraphs >= max_moves,
    }


def format_body_paragraphs(
    document_root: etree._Element,
    *,
    styles: dict[str, str],
    format_config: dict[str, Any],
    document_title: str | None = None,
) -> dict[str, int]:
    id_to_name = {value: key for key, value in styles.items()}
    ids = {
        "normal": get_style_id(styles, "Normal"),
        "body": get_style_id(styles, "Body Text"),
        "first": get_style_id(styles, "First Paragraph"),
        "title": get_style_id(
            styles, "heading 1", "Heading 1", "标题 1", "标题1"
        ),
        "heading2": get_style_id(
            styles, "heading 2", "Heading 2", "标题 2", "标题2"
        ),
        "heading3": get_style_id(
            styles, "heading 3", "Heading 3", "标题 3", "标题3"
        ),
        "heading4": get_style_id(
            styles, "heading 4", "Heading 4", "标题 4", "标题4"
        ),
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
        if re.sub(r"\s+", "", style_name).lower() in {
            "heading2",
            "标题2",
        }:
            in_highlights = text == "Highlights"
        role = role_for_paragraph(
            paragraph,
            style_names=id_to_name,
            in_highlights=in_highlights
            and re.sub(r"\s+", "", style_name).lower()
            not in {"heading2", "标题2"},
        )
        if role == "title" and (counts["title"] or (
                document_title is not None and text != document_title)):
            role = "heading2"
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
        elif role == "heading4":
            set_paragraph_style(paragraph, style_id if re.fullmatch(
                r"(?:heading|标题)[5-9]", re.sub(r"\s+", "", style_name).lower()) else ids["heading4"])
            set_paragraph_format(
                paragraph,
                alignment="left",
                before=80,
                after=40,
                line=line_twips(float(format_config["heading_line_spacing"])),
                first_line=0,
                keep_next=True,
                keep_lines=True,
            )
            size = float(format_config["heading4_size_pt"])
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
                first_line=body_first_line_indent_twips(format_config),
                first_line_chars=float(
                    format_config["body_first_line_chars"]
                ),
                use_character_indent=not is_english_document_language(
                    format_config.get("document_language")
                ),
            )
            size = float(format_config["body_size_pt"])

        if role in {"title", "heading2", "heading3", "heading4", "reference_heading"}:
            indent = get_or_add(get_or_add(paragraph, W("pPr")), W("ind"))
            for attribute in ("left", "right", "leftChars", "rightChars"):
                indent.set(W(attribute), "0")

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


def patch_crossref_number_spacing(document, document_language):
    """Use ordinary halfwidth spaces around generated figure/table references."""
    separator = " "
    for link in document.xpath(".//w:hyperlink[@w:anchor]", namespaces=NS):
        anchor = link.get(W("anchor"), "")
        if not re.match(r"^(?:fig|tbl|eq):", anchor):
            continue
        previous = link.getprevious()
        whitespace_nodes = []
        while previous is not None:
            nodes = []
            for node in reversed(previous.xpath(".//w:t", namespaces=NS)):
                if not node.text:
                    continue
                if node.text.isspace():
                    whitespace_nodes.append(node)
                else:
                    nodes.append(node)
                    break
            if nodes:
                node = nodes[-1]
                pattern = r"((?:图|表|式|Fig\.?|Figure|Table|Equation)s?)[\s\u3000]*$"
                if re.search(pattern, node.text):
                    node.text = re.sub(pattern, lambda match: match.group(1) + separator, node.text)
                    node.set("{http://www.w3.org/XML/1998/namespace}space", "preserve")
                    for whitespace in whitespace_nodes:
                        whitespace.text = ""
                break
            previous = previous.getprevious()
    for paragraph in document.xpath(".//w:body/w:p", namespaces=NS):
        nodes = [node for node in paragraph.xpath("./w:r/w:t", namespaces=NS) if node.text]
        if nodes:
            nodes[0].text = re.sub(r"^(图|表)[\s\u3000]*(?=\d)",
                                   lambda match: match.group(1) + separator, nodes[0].text)


def render_csl_multilingual(pandoc, csl_path, language, references, clusters):
    """Use citeproc-js for CSL-M layouts without changing the user's style."""
    runner = Path(__file__).with_name("render_csl.cjs")
    node = os.environ.get("MD_EXPORT_WORD_NODE") or shutil.which("node")
    if not node or not runner.is_file():
        raise ExportError("双语引用处理器未安装完整，请更新 MD Export Word 运行时")
    payload = {"style":Path(csl_path).read_text(encoding="utf-8-sig"),
               "language":language,"references":list(references.values()),"clusters":clusters}
    environment = dict(os.environ, ELECTRON_RUN_AS_NODE="1")
    rendered = subprocess.run([node,str(runner)],input=json.dumps(payload,ensure_ascii=False),
        text=True,encoding="utf-8",capture_output=True,env=environment,timeout=90)
    if rendered.returncode:
        raise ExportError("双语引用处理失败：" + rendered.stderr[-1500:])
    result = json.loads(rendered.stdout)
    html = "".join(f'<div id="md-csl-citation-{i}"><p>{entry}</p></div>'
        for i,entry in enumerate(result["citations"]))
    html += "".join(f'<div id="md-csl-bibliography-{i}">{entry}</div>'
        for i,entry in enumerate(result["bibliography"]))
    parsed = subprocess.run([str(pandoc),"--from=html","--to=json"],input=html,
        text=True,encoding="utf-8",capture_output=True)
    if parsed.returncode:
        raise ExportError("无法解析双语引用格式：" + parsed.stderr)
    entries = {}
    for block in walk_ast(json.loads(parsed.stdout).get("blocks", [])):
        if block.get("t") == "Div" and block["c"][0][0].startswith("md-csl-"):
            entries[block["c"][0][0]] = [inline for paragraph in walk_ast(block["c"][1])
                if paragraph.get("t") in {"Para","Plain"} for inline in paragraph["c"]]
    citations = [entries.get(f"md-csl-citation-{i}",[]) for i in range(len(clusters))]
    bibliography = [entries.get(f"md-csl-bibliography-{i}",[]) for i in range(len(result["bibliography"]))]
    if any(not entry for entry in citations + bibliography):
        raise ExportError("双语引用或参考文献结果不完整")
    return {"citations":citations,"bibliography":bibliography}


def render_zotero_results(raw_docx, pandoc, csl_path, language, temp_dir):
    """Render initial field results from the embedded Zotero CSL records."""
    with ZipFile(raw_docx) as archive:
        document = etree.fromstring(archive.read("word/document.xml"))
    fields = [field for field in field_inventory(document) if "ZOTERO_ITEM" in field["code"]]
    if not fields:
        return {"citations": [], "bibliography": []}
    references, blocks, clusters = {}, [], []
    for field in fields:
        marker = re.search(r"CSL_CITATION\s+", field["code"])
        data, _ = json.JSONDecoder().raw_decode(field["code"][marker.end():].lstrip())
        citations, cluster = [], []
        for item in data["citationItems"]:
            key = "zotero-" + str(item["id"])
            reference = copy.deepcopy(item["itemData"])
            reference["id"] = key
            references[key] = reference
            cluster.append({**{name:item[name] for name in ("prefix","suffix","locator","label","suppress-author") if name in item},"id":key})
            suffix = item.get("suffix", "")
            if item.get("locator"):
                label = {"page": "p.", "chapter": "chap.", "section": "sec."}.get(item.get("label", "page"), item.get("label", "p."))
                suffix = label + " " + str(item["locator"]) + (" " + suffix if suffix else "")
            citations.append({"citationId": key,
                "citationPrefix": [{"t": "Str", "c": item["prefix"]}] if item.get("prefix") else [],
                "citationSuffix": [{"t": "Str", "c": suffix}] if suffix else [],
                "citationMode": {"t": "SuppressAuthor" if item.get("suppress-author") else "NormalCitation"},
                "citationNoteNum": 0, "citationHash": 0})
        blocks.append({"t": "Para", "c": [{"t": "Cite", "c": [citations, []]}]})
        clusters.append(cluster)
    api = json.loads(subprocess.check_output([str(pandoc), "--from=markdown", "--to=json"], input="", text=True, encoding="utf-8"))["pandoc-api-version"]
    refs_path = temp_dir / "citation-records.json"
    refs_path.write_text(json.dumps(list(references.values()), ensure_ascii=False), encoding="utf-8")
    command = [str(pandoc), "--from=json", "--to=json", "--citeproc", "--bibliography=" + str(refs_path), "--metadata=lang:" + language]
    if csl_path:
        command.append("--csl=" + str(csl_path))
    result = subprocess.run(command, input=json.dumps({"pandoc-api-version": api, "meta": {}, "blocks": blocks}),
                            text=True, encoding="utf-8", capture_output=True)
    if result.returncode:
        if csl_path and "Multiple layout elements" in result.stderr:
            return render_csl_multilingual(pandoc,csl_path,language,references,clusters)
        raise ExportError("无法生成作者—年份及参考文献预览：" + result.stderr)
    rendered = json.loads(result.stdout)
    citations = [node["c"][1] for node in walk_ast(rendered.get("blocks", [])) if node.get("t") == "Cite"]
    bibliography = []
    for block in rendered.get("blocks", []):
        if block.get("t") == "Div" and block["c"][0][0] == "refs":
            for entry in block["c"][1]:
                if entry.get("t") == "Div":
                    paragraphs = [n["c"] for n in entry["c"][1] if n.get("t") in {"Para", "Plain"}]
                    if paragraphs:
                        bibliography.append(sum(paragraphs, []))
    if len(citations) != len(fields) or not bibliography:
        raise ExportError("作者—年份或参考文献渲染不完整，已停止导出")
    return {"citations": citations, "bibliography": bibliography}


def apply_zotero_results(document, results, format_config):
    """Populate live Zotero fields without changing their IDs or citation items."""
    if not results:
        return
    def runs(inlines, inherited=None, base_rpr=None):
        output = []
        for inline in inlines:
            kind, content = inline.get("t"), inline.get("c")
            properties = dict(inherited or {})
            if kind in {"Emph", "Strong", "Superscript", "Subscript", "SmallCaps"}:
                properties[kind] = True
                output.extend(runs(content, properties, base_rpr)); continue
            if kind == "Span":
                output.extend(runs(content[1], properties, base_rpr)); continue
            if kind == "Link":
                output.extend(runs(content[1], properties, base_rpr)); continue
            text = str(content) if kind == "Str" else " " if kind in {"Space", "SoftBreak", "LineBreak"} else ""
            if not text:
                continue
            run = etree.Element(W("r"))
            rpr = copy.deepcopy(base_rpr) if base_rpr is not None else etree.Element(W("rPr"))
            run.append(rpr)
            if base_rpr is None:
                set_fonts(rpr, east_asia=str(format_config["east_asia_font"]), western=str(format_config["western_font"]))
                set_size(rpr, float(format_config["body_size_pt"]))
            for key, tag in [("Emph", "i"), ("Strong", "b"), ("SmallCaps", "smallCaps")]:
                if properties.get(key): etree.SubElement(rpr, W(tag))
            for key, value in [("Superscript", "superscript"), ("Subscript", "subscript")]:
                if properties.get(key): etree.SubElement(rpr, W("vertAlign")).set(W("val"), value)
            node = etree.SubElement(run, W("t")); node.text = text; node.set("{" + XML_NS + "}space", "preserve")
            output.append(run)
        return output
    fields = [field for field in field_inventory(document) if "ZOTERO_ITEM" in field["code"]]
    if len(fields) != len(results["citations"]):
        raise ExportError("Zotero 引文域在格式处理后发生变化")
    for field, inlines in zip(fields, results["citations"]):
        old = field["result_nodes"]
        if not old:
            raise ExportError("Zotero 引文域缺少显示结果")
        first_run = old[0].getparent(); parent = first_run.getparent(); index = parent.index(first_run)
        for run in runs(inlines, base_rpr=first_run.find(W("rPr"))): parent.insert(index, run); index += 1
        for node in old: node.text = ""
        marker = re.search(r"CSL_CITATION\s+", field["code"])
        data, _ = json.JSONDecoder().raw_decode(field["code"][marker.end():].lstrip())
        data["properties"]["formattedCitation"] = stringify_inlines(inlines)
        data["properties"]["plainCitation"] = stringify_inlines(inlines)
        field["code_nodes"][0].text = " ADDIN ZOTERO_ITEM CSL_CITATION " + json.dumps(data, ensure_ascii=False)
        for node in field["code_nodes"][1:]: node.text = ""
    bib = next((f for f in field_inventory(document) if "ZOTERO_BIBL" in f["code"]), None)
    if bib and results["bibliography"]:
        original = bib["result_nodes"][0].getparent().getparent()
        body = original.getparent(); index = body.index(original)
        before, after, separated = [], [], False
        for child in original:
            if child.tag == W("pPr"): continue
            if not separated:
                before.append(copy.deepcopy(child))
                if child.xpath("./w:fldChar[@w:fldCharType='separate']", namespaces=NS): separated = True
            elif child.xpath("./w:fldChar[@w:fldCharType='end']", namespaces=NS): after.append(copy.deepcopy(child))
        for i, inlines in enumerate(results["bibliography"]):
            paragraph = etree.Element(W("p")); paragraph.append(copy.deepcopy(original.find(W("pPr"))))
            if i == 0:
                for child in before: paragraph.append(child)
            for run in runs(inlines): paragraph.append(run)
            if i == len(results["bibliography"]) - 1:
                for child in after: paragraph.append(child)
            body.insert(index+i, paragraph)
        body.remove(original)
    if is_english_document_language(format_config.get("document_language")):
        for p in document.xpath("./w:body/w:p", namespaces=NS):
            if paragraph_text(p) == "参考文献":
                nodes = p.xpath(".//w:t", namespaces=NS)
                nodes[0].text = "References"
                for node in nodes[1:]: node.text = ""

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
        custom_properties = None
        if "docProps/custom.xml" in source.namelist():
            custom_properties = etree.fromstring(
                source.read("docProps/custom.xml"), parser
            )
        raw_script_baseline = script_run_counts(document)
        rels = None
        if "word/_rels/document.xml.rels" in source.namelist():
            rels = etree.fromstring(
                source.read("word/_rels/document.xml.rels"), parser
            )

        inherited_font_report = patch_inherited_font_defaults(
            styles_root,
            document_language=source_inventory.get("document_language", ""),
            format_config=format_config,
        )
        styles = style_id_map(styles_root)
        body_report = format_body_paragraphs(
            document,
            styles=styles,
            format_config=format_config,
            document_title=source_inventory.get("document_title"),
        )
        zotero_parenthesis_report = (
            patch_english_zotero_citation_parentheses(
                document,
                document_language=source_inventory.get(
                    "document_language", ""
                ),
                western_font=str(format_config["western_font"]),
            )
        )
        zotero_preferences_report = patch_zotero_document_preferences(
            custom_properties,
            document_language=source_inventory.get("document_language", ""),
            style_id=source_inventory.get("zotero_csl_style", "apa"),
            force=source_inventory.get("citation_style_selected", False),
        )
        duplicate_image_captions_removed = (
            remove_redundant_generated_image_captions(
                document,
                image_caption_style_id=get_style_id(
                    styles,
                    "Image Caption",
                ),
            )
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
        image_resize_report = resize_inline_images(
            document,
            max_width_emu=content_width_emu(format_config),
            max_height_emu=(
                figure_image_max_height_dxa(format_config) * 635
            ),
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
        custom_highlight_report = patch_custom_mark_highlights(
            styles_root,
            document,
        )
        scripts_before_results = script_run_counts(document)
        apply_zotero_results(document, source_inventory.get("citation_results"), format_config)
        cluster_resize = fit_figure_caption_clusters(
            document, styles=styles, format_config=format_config)
        for key, value in cluster_resize.items():
            image_resize_report[key] = image_resize_report.get(key, 0) + value
        figure_reflow_report = reflow_large_figures(
            document, styles=styles, format_config=format_config)
        scripts_after_results = script_run_counts(document)
        for key in raw_script_baseline:
            raw_script_baseline[key] += scripts_after_results.get(key, 0) - scripts_before_results.get(key, 0)
        patch_crossref_number_spacing(document, format_config.get("document_language", ""))
        patch_section(document, format_config=format_config)
        patch_settings(settings)

        replacements["word/document.xml"] = etree.tostring(
            document,
            xml_declaration=True,
            encoding="UTF-8",
            standalone=True,
        )
        replacements["word/styles.xml"] = etree.tostring(
            styles_root,
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
        if custom_properties is not None:
            replacements["docProps/custom.xml"] = etree.tostring(
                custom_properties,
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
        "resized_images": image_resize_report.get("total", 0),
        "image_resize": image_resize_report,
        "duplicate_image_captions_removed": (
            duplicate_image_captions_removed
        ),
        "figure_reflow": figure_reflow_report,
        "quote_run_splits": quote_splits,
        "raw_script_baseline": raw_script_baseline,
        "fields": field_counts,
        "hyperlinks": hyperlink_counts,
        "missing_citation_placeholders": missing_placeholders,
        "bibliography_inserted": inserted_bibliography,
        "inherited_fonts": inherited_font_report,
        "zotero_parentheses": zotero_parenthesis_report,
        "zotero_preferences": zotero_preferences_report,
        "custom_highlights": custom_highlight_report,
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


def zotero_author_prefix_field_count(document: etree._Element) -> int:
    count = 0
    decoder = json.JSONDecoder()
    for field in field_inventory(document):
        code = field["code"]
        if "ZOTERO_ITEM" not in code.upper():
            continue
        if not any("<Do Zotero Refresh" in (node.text or "") for node in field["result_nodes"]):
            continue
        marker = re.search(r"CSL_CITATION\s+", code, flags=re.IGNORECASE)
        if marker is None:
            continue
        try:
            citation, _ = decoder.raw_decode(code[marker.end():].lstrip())
        except json.JSONDecodeError:
            continue
        if any(
            item.get("suppress-author") is True
            for item in citation.get("citationItems", [])
            if isinstance(item, dict)
        ):
            count += 1
    return count


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


def inherited_font_issues(
    styles_root: etree._Element,
    *,
    document_language: str | None,
    format_config: dict[str, Any],
) -> list[str]:
    issues: list[str] = []
    expected = {
        "ascii": str(format_config["western_font"]),
        "hAnsi": str(format_config["western_font"]),
        "cs": str(format_config["western_font"]),
        "eastAsia": str(format_config["east_asia_font"]),
    }

    def check_rpr(label: str, rpr: etree._Element | None) -> None:
        fonts = direct(rpr, W("rFonts")) if rpr is not None else None
        if fonts is None:
            issues.append(f"{label} is missing inherited rFonts")
            return
        actual = {slot: fonts.get(W(slot)) for slot in expected}
        if actual != expected:
            issues.append(
                f"{label} inherited fonts are {actual}, expected {expected}"
            )
        if is_english_document_language(document_language):
            language = normalize_document_language(document_language)
            lang = direct(rpr, W("lang"))
            if lang is None or (
                lang.get(W("val")) != language
                or lang.get(W("eastAsia")) != language
            ):
                issues.append(
                    f"{label} language inheritance is not {language}"
                )

    default_rpr = styles_root.find(
        "w:docDefaults/w:rPrDefault/w:rPr",
        namespaces=NS,
    )
    check_rpr("docDefaults", default_rpr)

    found_styles: set[str] = set()
    for style in styles_root.findall(W("style")):
        name_node = direct(style, W("name"))
        style_name = name_node.get(W("val"), "") if name_node is not None else ""
        if style_name not in INHERITED_FONT_STYLE_NAMES:
            continue
        found_styles.add(style_name)
        check_rpr(f"style {style_name}", direct(style, W("rPr")))
    missing_styles = INHERITED_FONT_STYLE_NAMES - found_styles
    if missing_styles:
        issues.append(
            "Missing inherited-font styles: " + ", ".join(sorted(missing_styles))
        )
    return issues


def zotero_document_preference_issues(
    custom_root: etree._Element | None,
    *,
    document_language: str | None,
    style_id: str | None,
    force: bool = False,
) -> list[str]:
    if not force and not is_english_document_language(document_language):
        return []
    expected_style = normalize_zotero_style_id(style_id)
    if custom_root is None:
        return ["English export is missing docProps/custom.xml"]
    raw = zotero_preference_text(custom_root)
    if not raw:
        return ["English export is missing Zotero document preferences"]
    try:
        preferences = etree.fromstring(raw.encode("utf-8"))
    except etree.XMLSyntaxError:
        return ["English Zotero document preferences are malformed"]
    style = preferences.find("style")
    expected_uri = zotero_style_uri(expected_style)
    issues: list[str] = []
    if style is None or style.get("id") != expected_uri:
        actual = style.get("id") if style is not None else "missing"
        issues.append(
            f"English Zotero style is {actual}, expected {expected_uri}"
        )
    locale = "en-US" if is_english_document_language(document_language) else "zh-CN"
    if style is None or style.get("locale") != locale:
        issues.append(f"Zotero style locale is not {locale}")
    field_types = [
        node.get("value")
        for node in preferences.xpath("./prefs/pref[@name='fieldType']")
    ]
    if field_types != ["Field"]:
        issues.append(
            f"English Zotero fieldType is {field_types or 'missing'}"
        )
    return issues


def english_zotero_parenthesis_issues(
    document: etree._Element,
    *,
    document_language: str | None,
    western_font: str,
) -> list[str]:
    if not is_english_document_language(document_language):
        return []
    issues: list[str] = []
    for index, field in enumerate(field_inventory(document), start=1):
        if "ZOTERO_ITEM" not in field["code"].upper():
            continue
        _, replacements = normalize_zotero_formatted_citation(field["code"])
        if replacements:
            issues.append(
                f"Zotero citation field {index} retains full-width parentheses"
            )
        for text_node in field["result_nodes"]:
            value = text_node.text or ""
            if "（" in value or "）" in value:
                issues.append(
                    f"Zotero citation result {index} retains full-width parentheses"
                )
                break
            if "(" not in value and ")" not in value:
                continue
            runs = text_node.xpath("ancestor::w:r[1]", namespaces=NS)
            fonts = (
                runs[0].find("w:rPr/w:rFonts", namespaces=NS)
                if runs
                else None
            )
            if fonts is None:
                issues.append(
                    f"Zotero citation parentheses {index} lack direct fonts"
                )
                break
            actual = {
                slot: fonts.get(W(slot))
                for slot in ("ascii", "hAnsi", "cs", "eastAsia")
            }
            if any(value != western_font for value in actual.values()):
                issues.append(
                    f"Zotero citation parentheses {index} use {actual}"
                )
                break
            if fonts.get(W("hint")) == "eastAsia":
                issues.append(
                    f"Zotero citation parentheses {index} retain eastAsia hint"
                )
                break
    return issues


def highlighted_character_count(document: etree._Element) -> int:
    count = 0
    for run in document.xpath(
        ".//w:r[w:rPr/w:highlight[not(@w:val='none')]]",
        namespaces=NS,
    ):
        text = "".join(run.xpath(".//w:t/text()", namespaces=NS))
        count += sum(not character.isspace() for character in text)
    return count


def shaded_character_counts(document: etree._Element) -> dict[str, int]:
    counts: Counter[str] = Counter()
    for run in document.xpath(".//w:r[w:rPr/w:shd]", namespaces=NS):
        fill = run.xpath("string(./w:rPr/w:shd/@w:fill)", namespaces=NS)
        if re.fullmatch(r"[0-9A-Fa-f]{6}", fill or ""):
            text = "".join(run.xpath(".//w:t/text()", namespaces=NS))
            counts[fill.upper()] += sum(
                not character.isspace() for character in text
            )
    return dict(sorted(counts.items()))


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
        custom_properties = (
            etree.fromstring(archive.read("docProps/custom.xml"))
            if "docProps/custom.xml" in archive.namelist()
            else None
        )
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
        errors.extend(
            inherited_font_issues(
                styles_root,
                document_language=source_inventory.get(
                    "document_language", ""
                ),
                format_config=format_config,
            )
        )
        errors.extend(
            zotero_document_preference_issues(
                custom_properties,
                document_language=source_inventory.get(
                    "document_language", ""
                ),
                style_id=source_inventory.get("zotero_csl_style", "apa"),
                force=source_inventory.get("citation_style_selected", False),
            )
        )
        errors.extend(
            english_zotero_parenthesis_issues(
                document,
                document_language=source_inventory.get(
                    "document_language", ""
                ),
                western_font=str(format_config["western_font"]),
            )
        )
        expected_highlight_chars = int(
            source_inventory.get("highlight_chars", 0)
        )
        actual_highlight_chars = highlighted_character_count(document)
        if actual_highlight_chars < expected_highlight_chars:
            errors.append(
                "Markdown highlighter count is incomplete: "
                f"expected at least {expected_highlight_chars} highlighted "
                f"characters, found {actual_highlight_chars}"
            )
        if expected_highlight_chars and any(
            "==" in (node.text or "")
            for node in document.xpath(".//w:t", namespaces=NS)
        ):
            errors.append("Literal == highlight markers remain in Word text")
        expected_custom_highlights = {
            str(color).upper(): int(count)
            for color, count in source_inventory.get(
                "custom_highlight_chars", {}
            ).items()
        }
        actual_custom_highlights = shaded_character_counts(document)
        for color, expected_count in expected_custom_highlights.items():
            actual_count = actual_custom_highlights.get(color, 0)
            if actual_count < expected_count:
                errors.append(
                    "Custom Markdown highlight count is incomplete for "
                    f"#{color}: expected at least {expected_count} "
                    f"characters, found {actual_count}"
                )
        if expected_custom_highlights and any(
            "<mark" in (node.text or "").lower()
            for node in document.xpath(".//w:t", namespaces=NS)
        ):
            errors.append("Literal HTML mark tags remain in Word text")
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
        title_style_id = get_style_id(
            styles, "heading 1", "Heading 1", "标题 1", "标题1"
        )
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
            "heading4": (
                float(format_config["heading4_size_pt"]),
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
            if re.sub(r"\s+", "", style_name).lower() in {
                "heading2",
                "标题2",
            }:
                in_highlights = text_value == "Highlights"
            role = role_for_paragraph(
                paragraph,
                style_names=id_to_name,
                in_highlights=(
                    in_highlights
                    and re.sub(r"\s+", "", style_name).lower()
                    not in {"heading2", "标题2"}
                ),
            )
            if role == "picture" or not text_value:
                continue
            if role in {"heading2", "heading3", "heading4", "reference_heading"}:
                if paragraph.xpath("string(w:pPr/w:jc/@w:val)", namespaces=NS) != "left":
                    errors.append(f"章节标题未左对齐：{text_value}")
                if paragraph.xpath("string(w:pPr/w:ind/@w:left)", namespaces=NS) != "0":
                    errors.append(f"章节标题仍有左缩进：{text_value}")
            if role == "title" and text_value != source_inventory.get("document_title", ""):
                errors.append(f"章节标题被误识别为文章总标题：{text_value}")
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
                (
                    expected_east_asia_font,
                    expected_western_font,
                ) = expected_run_fonts(
                    run,
                    run_text,
                    format_config=format_config,
                )
                if size != expected_half_points:
                    errors.append(
                        f"段落 {paragraph_index}（{role}）字号不是设置值 "
                        f"{expected_size} pt"
                    )
                    break
                if fonts is None or (
                    fonts.get(W("eastAsia"))
                    != expected_east_asia_font
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
                english_document = is_english_document_language(
                    format_config.get("document_language")
                )
                expected_first_line = str(
                    body_first_line_indent_twips(format_config)
                )
                actual_first_line = paragraph.xpath(
                    "string(./w:pPr/w:ind/@w:firstLine)",
                    namespaces=NS,
                )
                actual_chars = paragraph.xpath(
                    "string(./w:pPr/w:ind/@w:firstLineChars)",
                    namespaces=NS,
                )
                if actual_first_line != expected_first_line:
                    errors.append(
                        f"段落 {paragraph_index} 正文首行缩进不是设置值"
                    )
                if english_document:
                    if actual_chars not in ("", "0"):
                        errors.append(
                            f"段落 {paragraph_index} 英文正文误用了全角字符缩进"
                        )
                else:
                    expected_chars = str(
                        int(
                            round(
                                float(
                                    format_config["body_first_line_chars"]
                                )
                                * 100
                            )
                        )
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
        for index, paragraph in enumerate(caption_paragraphs, 1):
            caption_text = paragraph_text(paragraph)
            caption_style = paragraph.xpath(
                "string(./w:pPr/w:pStyle/@w:val)", namespaces=NS
            )
            caption_kind = (
                "figure"
                if caption_style == image_caption_id
                else "table"
            )
            accepted_titles = caption_title_candidates(
                source_inventory,
                caption_kind,
            )
            if not valid_caption_text(caption_text, accepted_titles):
                errors.append(
                    f"图表题 {index} 的编号或题名格式不正确："
                    f"{caption_text!r}；允许的题名前缀为 "
                    + " / ".join(accepted_titles)
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
                    (
                        expected_east_asia_font,
                        expected_western_font,
                    ) = expected_run_fonts(
                        run,
                        run_text,
                        format_config=format_config,
                    )
                    if size != table_half_points:
                        errors.append(
                            f"正式表格 {index} 的文字字号不是设置值 "
                            f"{format_config['table_size_pt']} pt"
                        )
                        break
                    if fonts is None or (
                        fonts.get(W("eastAsia"))
                        != expected_east_asia_font
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

        # A space before a manual-refresh field is also legitimate in English
        # prose and bilingual captions; it does not identify an author prefix.
        # Citation field counts and payload checks below validate completeness.
        for paragraph in document.xpath(".//w:p", namespaces=NS):
            visible_text = paragraph_text(paragraph)
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
        max_height_emu = figure_image_max_height_dxa(format_config) * 635
        for extent in document.xpath(".//wp:inline/wp:extent", namespaces=NS):
            if int(extent.get("cy", "0")) > max_height_emu:
                errors.append("存在超过当前版心建议高度的图片")
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
    if inventory.get("citekey_aliases"):
        print(
            "导出期 citekey 映射："
            + "；".join(
                f"@{source} → @{target}"
                for source, target in inventory["citekey_aliases"].items()
            )
        )
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
    # The Zotero Lua filter calls Better BibTeX at 127.0.0.1.  This Pandoc
    # build's mediabag client does not honor NO_PROXY, so remove HTTP proxy
    # variables for its loopback RPC while preserving HTTPS proxy settings.
    for proxy_key in ("HTTP_PROXY", "http_proxy", "ALL_PROXY", "all_proxy"):
        env.pop(proxy_key, None)
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
    emit_progress(
        2,
        "初始化导出环境",
        stage_key="progress.export.init",
    )
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

    emit_progress(
        8,
        "读取 Markdown",
        md_path.name,
        stage_key="progress.export.readMarkdown",
    )
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
    emit_progress(
        18,
        "规范化 Markdown",
        "标题、图片、引用间距与公式标签",
        stage_key="progress.export.normalizeMarkdown",
        detail_key="progress.export.normalizeMarkdownDetail",
    )
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
        emit_progress(
            26,
            "解析文档结构",
            "扫描图片、表格、公式和引用",
            stage_key="progress.export.parseDocument",
            detail_key="progress.export.parseDocumentDetail",
        )
        ast = pandoc_ast(
            pandoc,
            prepared_md,
            cwd=vault_root,
            resource_path=resource_path,
        )
        selected_csl = os.environ.get("MD_EXPORT_WORD_CSL", "").strip()
        selected_style_id = ""
        if selected_csl:
            selected_path, selected_style_id = selected_csl_metadata(selected_csl, vault_root)
            ast.setdefault("meta", {})["csl"] = {"t":"MetaString", "c":str(selected_path)}
            ast["meta"]["zotero-csl-style"] = {"t":"MetaString", "c":selected_style_id}
        else:
            manuscript_csl = stringify_metadata(ast.get("meta", {}).get("csl"))
            # Follow the manuscript's real CSL ID, not the injected APA fallback.
            frontmatter = re.match(r"\A\ufeff?---\r?\n(.*?)\r?\n---", source, re.S)
            explicit_style = bool(frontmatter and re.search(
                r"^zotero[-_]csl[-_]style\s*:", frontmatter.group(1), re.M))
            if manuscript_csl and not explicit_style and not re.match(r"^https?://", manuscript_csl):
                _, selected_style_id = selected_csl_metadata(manuscript_csl, vault_root)
                ast.setdefault("meta", {})["zotero-csl-style"] = {"t":"MetaString", "c":selected_style_id}
        format_config = language_aware_format_config(
            format_config, stringify_metadata(ast.get("meta", {}).get("lang"))
        )
        omitted_english_captions = filter_english_caption_blocks(ast, format_config)
        inventory = ast_inventory(ast)
        inventory["omitted_english_captions"] = omitted_english_captions
        citekey_aliases = load_citekey_aliases(ast)
        used_citekey_aliases = apply_citekey_aliases(ast, citekey_aliases)
        if used_citekey_aliases:
            inventory = ast_inventory(ast)
            inventory["citekey_aliases"] = used_citekey_aliases
        inventory["citation_style_selected"] = bool(selected_style_id)
        inventory["note_paragraphs"] = count_ast_note_paragraphs(ast)
        format_config = language_aware_format_config(
            format_config,
            inventory.get("document_language", ""),
        )
        inventory["equation_numbers"] = prepare_report["equation_numbers"]
        inventory["document_title"] = prepare_report["document_title"]
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
            stage_key="progress.export.checkResources",
            detail_key="progress.export.checkResourcesDetail",
            params={
                "images": len(image_paths),
                "tables": inventory["table_count"],
                "equations": inventory["math_count"],
            },
        )
        emit_progress(
            42,
            "检查 Zotero 引用",
            f"citekey {len(inventory['citekeys'])}",
            stage_key="progress.export.checkCitations",
            detail_key="progress.export.checkCitationsDetail",
            params={"count": len(inventory["citekeys"])},
        )
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
        pandoc_input_format = MARKDOWN_INPUT_FORMAT
        if used_citekey_aliases or omitted_english_captions:
            pandoc_input = temp_dir / "prepared-citekey-aliases.json"
            pandoc_input.write_text(
                json.dumps(ast, ensure_ascii=False),
                encoding="utf-8",
            )
            pandoc_input_format = "json"
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
            stage_key="progress.export.preflight",
            detail_key="progress.export.preflightDetail",
            params={
                "mode": export_mode,
                "missing": len(missing_keys),
            },
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
        emit_progress(
            60,
            "生成 Word 初稿",
            "运行 Pandoc 与 pandoc-crossref",
            stage_key="progress.export.generateDraft",
            detail_key="progress.export.generateDraftDetail",
        )
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
        emit_progress(
            74,
            "Word 初稿已生成",
            raw_docx.name,
            stage_key="progress.export.draftReady",
        )
        emit_progress(
            78,
            "处理 Word 格式",
            "字体、上下标、公式、图表和 Zotero 域",
            stage_key="progress.export.formatDocument",
            detail_key="progress.export.formatDocumentDetail",
        )
        csl_value = stringify_metadata(ast.get("meta", {}).get("csl"))
        csl_path = (vault_root / csl_value).resolve() if csl_value and not re.match(r"^https?://", csl_value) else csl_value
        display_mode = os.environ.get("MD_EXPORT_WORD_CITATION_DISPLAY", "rendered")
        if display_mode not in {"manual", "rendered"}:
            raise ExportError(f"无效引用显示方式：{display_mode}")
        if display_mode == "rendered":
            render_override = os.environ.get("MD_EXPORT_WORD_CSL_RENDER", "").strip()
            if render_override:
                csl_path, _ = selected_csl_metadata(render_override, vault_root)
            try:
                inventory["citation_results"] = render_zotero_results(
                    raw_docx, pandoc, csl_path, str(format_config.get("document_language", "zh-CN")), temp_dir
                )
            except ExportError as error:
                # Zotero's multilingual CSL extensions are not all supported
                # by Pandoc citeproc. Keep intact live fields for Word Refresh.
                emit_progress(78, "引用改由 Word 中的 Zotero 刷新",
                    str(error), level="warning", stage_key="progress.export.citationFallback")
        format_report = patch_docx(
            raw_docx,
            output_path,
            source_inventory=inventory,
            source_scripts=scripts,
            format_config=format_config,
        )
        format_report["duplicate_citekeys_resolved"] = duplicate_keys
        reflow_report = format_report["figure_reflow"]
        emit_progress(
            92,
            "自动检查 Word",
            "图片分页回填 "
            f"{reflow_report['figures_reflowed']} 处；"
            "结构、编号、引用域与格式均已检查",
            stage_key="progress.export.validateDocument",
            detail_key="progress.export.validateDocumentDetail",
            params={
                "reflowed": reflow_report["figures_reflowed"],
            },
        )

    emit_progress(
        96,
        "确认源文件",
        "检查导出期间 Markdown 是否发生变化",
        stage_key="progress.export.verifySource",
        detail_key="progress.export.verifySourceDetail",
    )
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
    reflow_report = format_report["figure_reflow"]
    resize_report = format_report["image_resize"]
    print(
        "图片分页："
        f"纵向缩放 {resize_report.get('height', 0)} 张；"
        f"回填 {reflow_report['figures_reflowed']} 处；"
        f"提前正文 {reflow_report['paragraphs_moved']} 段；"
        "清理重复图名 "
        f"{format_report['duplicate_image_captions_removed']} 个；"
        "原始 Markdown 未修改。"
    )
    print(f"Word：{output_path}")
    print("日志：成功时不生成；仅在失败时写入导出失败.log.txt。")
    print("说明：首次打开后可在 Zotero 中执行 Refresh。")
    if not args.no_open:
        emit_progress(
            99,
            "正在打开 Word",
            output_path.name,
            stage_key="progress.export.openWord",
        )
        try:
            open_output_document(output_path)
        except Exception as exc:
            print(f"无法自动打开 Word：{exc}")
    emit_progress(
        100,
        "导出完成",
        output_path.name,
        level="success",
        stage_key="progress.export.complete",
    )
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except ExportError as exc:
        emit_progress(
            100,
            "导出失败",
            str(exc),
            level="error",
            stage_key="progress.export.failed",
        )
        error_log = write_failure_log(exc)
        print(f"\n错误：{exc}", file=sys.stderr, flush=True)
        if error_log:
            print(f"错误日志：{error_log}", file=sys.stderr, flush=True)
        raise SystemExit(1)
    except KeyboardInterrupt:
        emit_progress(
            100,
            "已取消",
            "用户中止导出",
            level="warning",
            stage_key="progress.export.cancelled",
            detail_key="progress.export.cancelledDetail",
        )
        print("\n已取消。", file=sys.stderr, flush=True)
        raise SystemExit(130)
    except Exception as exc:
        traceback_text = traceback.format_exc()
        emit_progress(
            100,
            "导出失败",
            str(exc),
            level="error",
            stage_key="progress.export.failed",
        )
        error_log = write_failure_log(exc, traceback_text)
        print(f"\n未预期错误：{exc}", file=sys.stderr, flush=True)
        if error_log:
            print(f"错误日志：{error_log}", file=sys.stderr, flush=True)
        raise SystemExit(1)
