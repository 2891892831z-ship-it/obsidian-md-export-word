"""Check caption defaults and the normal export branch without producing Word."""
from __future__ import annotations

import argparse
import ast
import importlib.util
import json
from pathlib import Path
import re
import subprocess

root = Path(__file__).resolve().parents[1]
exporter = root / "runtime/scripts/md_export_word_template.py"
spec = importlib.util.spec_from_file_location("caption_exporter", exporter)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

parser = argparse.ArgumentParser()
parser.add_argument("--pandoc", required=True)
parser.add_argument("--crossref", required=True)
args = parser.parse_args()

for language, override, custom in [
    ("zh-CN", "", False), ("zh-TW", "", False), ("en-US", "", False),
    ("en-US", "zh-CN", False), ("zh-CN", "en-US", False),
    ("zh-CN", "", True),
]:
    metadata = f"---\nlang: {language}\n"
    if custom:
        metadata += 'figureTitle: Custom\ntableTitle: Data\ntitleDelim: " - "\n'
    source = metadata + "---\n\n![Caption](unused.png){#fig:test}\n\n" + (
        "See @fig:test and @tbl:test.\n\n---\n\n> Quote\n>\n> ---\n\n"
        "| A | B |\n|---|---|\n| 1 | 2 |\n\n: Values {#tbl:test}\n"
    )
    result = subprocess.run(
        [args.pandoc, "-f", "markdown", "-t", "json"], input=source,
        text=True, encoding="utf-8", capture_output=True, check=True,
    )
    document = json.loads(result.stdout)
    original_metadata = json.loads(json.dumps(document["meta"]))
    def count_rules(node):
        if isinstance(node, dict):
            return int(node.get("t") == "HorizontalRule") + sum(
                count_rules(value) for value in node.values()
            )
        if isinstance(node, list):
            return sum(count_rules(value) for value in node)
        return 0
    assert count_rules(document) == 2
    module.omit_export_horizontal_rules(document)
    assert count_rules(document) == 0
    assert document["meta"] == original_metadata
    assert any(block["t"] == "Table" for block in document["blocks"])
    config = module.language_aware_format_config(
        dict(module.DEFAULT_FORMAT_CONFIG, document_language=override), language
    )
    module.apply_caption_language_defaults(document, config)
    result = subprocess.run(
        [args.pandoc, "-f", "json", "-t", "plain", "--filter", args.crossref],
        input=json.dumps(document), text=True, encoding="utf-8",
        capture_output=True, check=True,
    )
    rendered = re.sub(r"\s", "", result.stdout)
    english = (override or language).startswith("en")
    expected = ("Custom1-Caption", "Data1-Values") if custom else (
        ("Figure1:Caption", "Table1:Values") if english
        else ("图1Caption", "表1Values")
    )
    assert all(text in rendered for text in expected), (expected, result.stdout)

document = {"meta": {"titleDelim": {"t": "MetaString", "c": ""}}}
module.apply_caption_language_defaults(document, {})
assert document["meta"]["titleDelim"]["c"] == ""

# Regression: metadata used to be silently discarded unless aliases/captions
# caused the normal Markdown export branch to switch to JSON.
tree = ast.parse(exporter.read_text(encoding="utf-8"))
parents = {child: node for node in ast.walk(tree) for child in ast.iter_child_nodes(node)}
assignments = [
    node for node in ast.walk(tree) if isinstance(node, ast.Assign)
    and any(isinstance(t, ast.Name) and t.id == "pandoc_input" for t in node.targets)
    and isinstance(node.value, ast.BinOp)
    and isinstance(node.value.right, ast.Constant)
    and node.value.right.value == "prepared-export.json"
]
assert len(assignments) == 1
assert not isinstance(parents[assignments[0]], ast.If)
print("Caption languages, dialog overrides, custom metadata and normal export path passed.")
