#!/usr/bin/env python3
"""Regression checks for figure boundaries and citation inventory."""
import copy
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "exporter", ROOT / "runtime/scripts/md_export_word_template.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class ImageSpacingTests(unittest.TestCase):
    image = "![Caption [@reference]](folder/image.png){#fig:example}"

    def test_boundaries_and_idempotence(self):
        for newline in ("\n", "\r\n"):
            source = newline.join(["Before", self.image, self.image, "After"]) + newline
            expected = newline.join(
                ["Before", "", self.image, "", self.image, "", "After"]
            ) + newline
            self.assertEqual(module.normalize_markdown_image_spacing(source), (expected, 3))
            self.assertEqual(module.normalize_markdown_image_spacing(expected), (expected, 0))

    def test_existing_blank_lines_are_preserved(self):
        for gap in ("\n\n", "\n\n\n", "\n  \n"):
            source = "Before" + gap + self.image + gap + "After"
            self.assertEqual(module.normalize_markdown_image_spacing(source), (source, 0))

    def test_protected_contexts(self):
        for source in (
            "---\nexample: |\n  " + self.image + "\n---\n",
            "````markdown\n" + self.image + "\n```\n" + self.image + "\n````\n",
            "~~~\n" + self.image + "\n~~~\n",
            "$$\n" + self.image + "\n$$\n",
            "Inline " + self.image + " text\n",
            "    " + self.image + "\n",
            "![](image.png) trailing prose\n",
        ):
            self.assertEqual(module.normalize_markdown_image_spacing(source), (source, 0))

    def test_pipeline_converts_wikilinks_before_spacing(self):
        prepared, report = module.prepare_markdown("Before\n![[image.png]]\nAfter\n")
        self.assertIn("Before\n\n![](image.png)\n\nAfter", prepared)
        self.assertEqual(report["image_space_changes"], 2)

    def test_figure_citations_count_once_without_mutating_ast(self):
        cite = {"t": "Cite", "c": [[{"citationId": "reference"}], []]}
        image = {"t": "Image", "c": [["", [], []], [copy.deepcopy(cite)], ["image.png", ""]]}
        ast = {"meta": {}, "blocks": [{"t": "Figure", "c": [
            ["fig:example", [], []],
            [None, [{"t": "Plain", "c": [cite]}]],
            [{"t": "Plain", "c": [image]}],
        ]}]}
        before = copy.deepcopy(ast)
        inventory = module.ast_inventory(ast)
        self.assertEqual(inventory["citation_clusters"], 1)
        self.assertEqual(inventory["citekeys"], ["reference"])
        self.assertEqual(inventory["image_targets"], ["image.png"])
        self.assertEqual(ast, before)


if __name__ == "__main__":
    unittest.main()
