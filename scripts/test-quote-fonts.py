#!/usr/bin/env python3
from __future__ import annotations

import importlib.util
from pathlib import Path

from lxml import etree


ROOT = Path(__file__).resolve().parents[1]
EXPORTER = ROOT / "runtime" / "scripts" / "md_export_word_template.py"


def require(condition: bool, message: str) -> None:
    if not condition:
        raise RuntimeError(message)


def load_exporter():
    spec = importlib.util.spec_from_file_location(
        "md_export_word_template_quote_test",
        EXPORTER,
    )
    require(spec is not None and spec.loader is not None, "Exporter import failed")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def append_run(module, paragraph, text: str):
    run = etree.SubElement(paragraph, module.W("r"))
    text_node = etree.SubElement(run, module.W("t"))
    text_node.text = text
    return run


def run_fonts(module, run) -> dict[str, str | None]:
    fonts = run.find("w:rPr/w:rFonts", namespaces=module.NS)
    require(fonts is not None, "Quote run is missing explicit fonts")
    return {
        slot: fonts.get(module.W(slot))
        for slot in ("ascii", "hAnsi", "cs", "eastAsia")
    }


def styles_fixture(module):
    styles = etree.Element(module.W("styles"), nsmap={"w": module.W_NS})
    defaults = etree.SubElement(styles, module.W("docDefaults"))
    rpr_default = etree.SubElement(defaults, module.W("rPrDefault"))
    rpr = etree.SubElement(rpr_default, module.W("rPr"))
    module.set_fonts(rpr, east_asia="宋体", western="Times New Roman")
    lang = etree.SubElement(rpr, module.W("lang"))
    lang.set(module.W("val"), "en-US")
    lang.set(module.W("eastAsia"), "zh-CN")
    for index, name in enumerate(sorted(module.INHERITED_FONT_STYLE_NAMES)):
        style = etree.SubElement(styles, module.W("style"))
        style.set(module.W("type"), "paragraph")
        style.set(module.W("styleId"), f"fixture{index}")
        etree.SubElement(style, module.W("name")).set(module.W("val"), name)
    return styles


def require_font_slots(module, rpr, expected: dict[str, str]) -> None:
    fonts = rpr.find("w:rFonts", namespaces=module.NS)
    require(fonts is not None, "Inherited rFonts are missing")
    actual = {
        slot: fonts.get(module.W(slot))
        for slot in ("ascii", "hAnsi", "cs", "eastAsia")
    }
    require(actual == expected, f"Unexpected inherited fonts: {actual}")


def require_inherited_font_policy(module) -> None:
    base_config = {
        "east_asia_font": "宋体",
        "western_font": "Times New Roman",
    }
    english_config = module.language_aware_format_config(base_config, "en-US")
    require(
        english_config["east_asia_font"] == "Times New Roman",
        "English documents did not switch every font slot to the Western font",
    )
    english_styles = styles_fixture(module)
    report = module.patch_inherited_font_defaults(
        english_styles,
        document_language="en-US",
        format_config=english_config,
    )
    require(report["english_all_western_slots"], "English override not reported")
    expected_english = {
        "ascii": "Times New Roman",
        "hAnsi": "Times New Roman",
        "cs": "Times New Roman",
        "eastAsia": "Times New Roman",
    }
    inherited = english_styles.xpath(
        "w:docDefaults/w:rPrDefault/w:rPr | w:style/w:rPr",
        namespaces=module.NS,
    )
    require(len(inherited) == 6, "English inherited-font targets are incomplete")
    for rpr in inherited:
        require_font_slots(module, rpr, expected_english)
        lang = rpr.find("w:lang", namespaces=module.NS)
        require(
            lang is not None
            and lang.get(module.W("val")) == "en-US"
            and lang.get(module.W("eastAsia")) == "en-US",
            "English inherited language is not en-US",
        )
    require(
        not module.inherited_font_issues(
            english_styles,
            document_language="en-US",
            format_config=english_config,
        ),
        "English inherited-font validation failed",
    )

    chinese_config = module.language_aware_format_config(base_config, "zh-CN")
    require(
        chinese_config["east_asia_font"] == "宋体",
        "Chinese documents lost the configured East Asian font",
    )
    chinese_styles = styles_fixture(module)
    module.patch_inherited_font_defaults(
        chinese_styles,
        document_language="zh-CN",
        format_config=chinese_config,
    )
    expected_chinese = {
        "ascii": "Times New Roman",
        "hAnsi": "Times New Roman",
        "cs": "Times New Roman",
        "eastAsia": "宋体",
    }
    for rpr in chinese_styles.xpath(
        "w:docDefaults/w:rPrDefault/w:rPr | w:style/w:rPr",
        namespaces=module.NS,
    ):
        require_font_slots(module, rpr, expected_chinese)

    inventory = module.ast_inventory(
        {
            "meta": {"lang": {"t": "MetaString", "c": "en-US"}},
            "blocks": [],
        }
    )
    require(
        inventory["document_language"] == "en-US",
        "Pandoc lang metadata was not inventoried",
    )


def require_zotero_english_policy(module) -> None:
    require(
        "+mark" in module.MARKDOWN_INPUT_FORMAT,
        "Pandoc mark extension is not enabled",
    )
    normalized_marks, mark_changes = module.normalize_html_mark_highlights(
        '<mark style="background-color:#cfe2f3">marked text</mark>\n'
        '<mark>plain mark</mark>\n'
        '```html\n<mark>code sample</mark>\n```\n'
    )
    require(mark_changes == 2, "HTML mark conversion count is incorrect")
    require(
        '[marked text]{custom-style="MDExportWordMarkCFE2F3"}'
        in normalized_marks,
        "Colored HTML mark did not preserve its exact custom color",
    )
    require(
        "[plain mark]{.mark}" in normalized_marks,
        "Uncolored HTML mark was not converted to native highlighting",
    )
    require(
        "<mark>code sample</mark>" in normalized_marks,
        "HTML mark inside a fenced code block was modified",
    )
    highlight_inventory = module.ast_inventory(
        {
            "meta": {},
            "blocks": [
                {
                    "t": "Para",
                    "c": [
                        {
                            "t": "Span",
                            "c": [
                                ["", ["mark"], []],
                                [
                                    {"t": "Str", "c": "highlighted"},
                                    {"t": "Space"},
                                    {"t": "Str", "c": "text"},
                                ],
                            ],
                        }
                    ],
                }
            ],
        }
    )
    require(
        highlight_inventory["highlight_chars"] == len("highlightedtext"),
        "Markdown highlight characters were not inventoried",
    )
    custom_highlight_inventory = module.ast_inventory(
        {
            "meta": {},
            "blocks": [
                {
                    "t": "Para",
                    "c": [
                        {
                            "t": "Span",
                            "c": [
                                [
                                    "",
                                    [],
                                    [
                                        [
                                            "custom-style",
                                            "MDExportWordMarkCFE2F3",
                                        ]
                                    ],
                                ],
                                [{"t": "Str", "c": "blue"}],
                            ],
                        }
                    ],
                }
            ],
        }
    )
    require(
        custom_highlight_inventory["custom_highlight_chars"]
        == {"CFE2F3": len("blue")},
        "Custom Markdown highlight characters were not inventoried by color",
    )

    highlight_styles = etree.fromstring(
        f'''<w:styles xmlns:w="{module.W_NS}">
          <w:style w:type="character"
             w:styleId="MDExportWordMarkCFE2F3">
            <w:name w:val="MDExportWordMarkCFE2F3"/>
          </w:style>
        </w:styles>'''.encode("utf-8")
    )
    highlight_document = etree.fromstring(
        f'''<w:document xmlns:w="{module.W_NS}"><w:body><w:p><w:r>
          <w:rPr><w:rStyle w:val="MDExportWordMarkCFE2F3"/>
            <w:highlight w:val="yellow"/></w:rPr>
          <w:t>blue</w:t>
        </w:r></w:p></w:body></w:document>'''.encode("utf-8")
    )
    shading_report = module.patch_custom_mark_highlights(
        highlight_styles,
        highlight_document,
    )
    require(
        shading_report["characters"] == {"CFE2F3": len("blue")},
        "Custom highlight shading report is incorrect",
    )
    require(
        highlight_document.xpath(
            "string(.//w:rPr/w:shd/@w:fill)", namespaces=module.NS
        )
        == "CFE2F3",
        "Custom highlight was not materialized as exact Word shading",
    )
    require(
        not highlight_document.xpath(".//w:rPr/w:highlight", namespaces=module.NS),
        "Native yellow highlight still overrides the custom color",
    )
    prepared = module.inject_metadata(
        "---\nlang: en-US\ncsl: .pandoc/apa.csl\n---\n\nText.\n"
    )
    require(
        "zotero-csl-style: apa" in prepared,
        "English temporary metadata did not select the APA Zotero style",
    )
    chinese = module.inject_metadata(
        "---\nlang: zh-CN\n---\n\n正文。\n"
    )
    require(
        "zotero-csl-style" not in chinese,
        "Chinese temporary metadata was forced to an English Zotero style",
    )

    custom = etree.Element(
        module.CP("Properties"),
        nsmap={None: module.CUSTOM_PROP_NS, "vt": module.VT_NS},
    )
    old_preferences = (
        '<data data-version="3" zotero-version="9.0.6">'
        '<session id="fixture"/>'
        '<style id="http://www.zotero.org/styles/'
        'JM-Chinese-GB7714-2015-author-date-QN-both" '
        'hasBibliography="1"/>'
        '<prefs><pref name="fieldType" value="Field"/></prefs>'
        '</data>'
    )
    for index, chunk in enumerate(
        (
            old_preferences[: module.ZOTERO_PREF_CHUNK_SIZE],
            old_preferences[module.ZOTERO_PREF_CHUNK_SIZE :],
        ),
        start=1,
    ):
        if not chunk:
            continue
        prop = etree.SubElement(custom, module.CP("property"))
        prop.set("fmtid", module.CUSTOM_PROPERTY_FMTID)
        prop.set("pid", str(index + 1))
        prop.set("name", f"ZOTERO_PREF_{index}")
        etree.SubElement(prop, module.VT("lpwstr")).text = chunk
    report = module.patch_zotero_document_preferences(
        custom,
        document_language="en-US",
        style_id="apa",
    )
    require(report["style_id"] == "apa", "APA style was not reported")
    require(
        not module.zotero_document_preference_issues(
            custom,
            document_language="en-US",
            style_id="apa",
        ),
        "English Zotero document preferences remain invalid",
    )

    document = etree.Element(module.W("document"), nsmap={"w": module.W_NS})
    body = etree.SubElement(document, module.W("body"))
    paragraph = etree.SubElement(body, module.W("p"))
    begin = etree.SubElement(paragraph, module.W("r"))
    etree.SubElement(begin, module.W("fldChar")).set(
        module.W("fldCharType"), "begin"
    )
    instruction = etree.SubElement(paragraph, module.W("r"))
    instruction_text = etree.SubElement(instruction, module.W("instrText"))
    instruction_text.text = (
        r' ADDIN ZOTERO_ITEM CSL_CITATION {'
        r'"properties":{"formattedCitation":"\\uc0\\u65288{}'
        r'Liu et al., 2025\\uc0\\u65289{}"}}'
    )
    separate = etree.SubElement(paragraph, module.W("r"))
    etree.SubElement(separate, module.W("fldChar")).set(
        module.W("fldCharType"), "separate"
    )
    open_run = append_run(module, paragraph, "（")
    open_rpr = etree.SubElement(open_run, module.W("rPr"))
    open_fonts = etree.SubElement(open_rpr, module.W("rFonts"))
    open_fonts.set(module.W("eastAsia"), "宋体")
    open_fonts.set(module.W("hint"), "eastAsia")
    append_run(module, paragraph, "Liu et al., 2025")
    append_run(module, paragraph, "）")
    end = etree.SubElement(paragraph, module.W("r"))
    etree.SubElement(end, module.W("fldChar")).set(
        module.W("fldCharType"), "end"
    )
    citation_report = module.patch_english_zotero_citation_parentheses(
        document,
        document_language="en-US",
        western_font="Times New Roman",
    )
    require(
        citation_report["field_code"] == 2,
        f"Unexpected field-code replacements: {citation_report}",
    )
    require(
        citation_report["display"] == 2,
        f"Unexpected display replacements: {citation_report}",
    )
    require(
        not module.english_zotero_parenthesis_issues(
            document,
            document_language="en-US",
            western_font="Times New Roman",
        ),
        "English Zotero citation parentheses remain invalid",
    )
    visible = "".join(document.xpath(".//w:t/text()", namespaces=module.NS))
    require(
        visible == "(Liu et al., 2025)",
        f"Zotero display parentheses were not normalized: {visible!r}",
    )


def require_quote_fonts(
    module,
    paragraph,
    *,
    expected: dict[str, str],
) -> None:
    runs = paragraph.xpath(".//w:r[w:t]", namespaces=module.NS)
    actual: dict[str, str] = {}
    for run in runs:
        value = "".join(run.xpath("./w:t/text()", namespaces=module.NS))
        if value in module.QUOTE_CHARS:
            fonts = run_fonts(module, run)
            require(
                len(set(fonts.values())) == 1,
                f"Quote {value!r} has mixed font slots: {fonts}",
            )
            actual[value] = fonts["ascii"] or ""
    require(actual == expected, f"Unexpected quote fonts: {actual}")


def main() -> int:
    module = load_exporter()
    require_inherited_font_policy(module)
    require_zotero_english_policy(module)
    config = {
        "east_asia_font": "宋体",
        "western_font": "Times New Roman",
    }

    root = etree.Element(module.W("document"), nsmap={"w": module.W_NS})
    body = etree.SubElement(root, module.W("body"))

    apostrophe = etree.SubElement(body, module.W("p"))
    append_run(module, apostrophe, "China’s and country’s")
    module.split_quote_runs(root, format_config=config)
    apostrophe_quotes = apostrophe.xpath(
        ".//w:r[w:t='’']",
        namespaces=module.NS,
    )
    require(len(apostrophe_quotes) == 2, "English apostrophes were not split")
    for run in apostrophe_quotes:
        fonts = run_fonts(module, run)
        require(
            set(fonts.values()) == {"Times New Roman"},
            f"English apostrophe uses the wrong font: {fonts}",
        )

    english_quotes = etree.SubElement(body, module.W("p"))
    append_run(module, english_quotes, "“China” and ‘country’")
    module.split_quote_runs(english_quotes, format_config=config)
    require_quote_fonts(
        module,
        english_quotes,
        expected={
            "“": "Times New Roman",
            "”": "Times New Roman",
            "‘": "Times New Roman",
            "’": "Times New Roman",
        },
    )

    chinese_quotes = etree.SubElement(body, module.W("p"))
    append_run(module, chinese_quotes, "“中国”与‘盆地’")
    module.split_quote_runs(chinese_quotes, format_config=config)
    require_quote_fonts(
        module,
        chinese_quotes,
        expected={
            "“": "宋体",
            "”": "宋体",
            "‘": "宋体",
            "’": "宋体",
        },
    )

    split_apostrophe = etree.SubElement(body, module.W("p"))
    append_run(module, split_apostrophe, "China")
    append_run(module, split_apostrophe, "’")
    append_run(module, split_apostrophe, "s")
    module.split_quote_runs(split_apostrophe, format_config=config)
    separated_quote = split_apostrophe.xpath(
        ".//w:r[w:t='’']",
        namespaces=module.NS,
    )
    require(len(separated_quote) == 1, "Separated apostrophe run was lost")
    fonts = run_fonts(module, separated_quote[0])
    require(
        set(fonts.values()) == {"Times New Roman"},
        f"Separated English apostrophe uses the wrong font: {fonts}",
    )

    print("Quote, inherited font, and Zotero style tests passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
