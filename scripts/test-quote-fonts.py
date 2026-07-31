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

    print("Quote font tests passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
