#!/usr/bin/env python3
"""Regression checks for numeric-range tilde escaping."""
import importlib.util
from pathlib import Path
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "exporter", ROOT / "runtime/scripts/md_export_word_template.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class RangeTildeTests(unittest.TestCase):
    def test_numeric_ranges_are_escaped_once(self):
        for source, expected, changes in (
            (
                "氦含量达到 0.05%~0.1%（500~1000 ppm）即具",
                "氦含量达到 0.05%\\~0.1%（500\\~1000 ppm）即具",
                2,
            ),
            (
                "φ 值为（3.43~3.57）和（3.58~4.26）两个区间",
                "φ 值为（3.43\\~3.57）和（3.58\\~4.26）两个区间",
                2,
            ),
            (
                "| 鄂尔多斯盆地 | 0.016%~0.487% | 1800~2000 m |",
                "| 鄂尔多斯盆地 | 0.016%\\~0.487% | 1800\\~2000 m |",
                2,
            ),
        ):
            with self.subTest(source=source):
                self.assertEqual(
                    module.normalize_markdown_range_tildes(source),
                    (expected, changes),
                )
                self.assertEqual(
                    module.normalize_markdown_range_tildes(expected),
                    (expected, 0),
                )

    def test_letter_led_subscripts_are_preserved(self):
        for source in (
            "壳源富氦天然气藏 N~2~-He 耦合关系",
            "面积 3 m~2~ 与 O~2~、CO~2~ 含量",
            "游离氦富集效率（eta~He~）最高",
            "山西组（P~1~s）与本溪组（C~2~b）",
        ):
            with self.subTest(source=source):
                self.assertEqual(
                    module.normalize_markdown_range_tildes(source), (source, 0)
                )

    def test_line_leading_tilde_is_untouched(self):
        source = "~0.1% 起范围的行首波浪号"
        self.assertEqual(
            module.normalize_markdown_range_tildes(source), (source, 0)
        )

    def test_protected_contexts(self):
        for source in (
            "---\nrange: 0.05%~0.1%\n---\n正文 500~1000 ppm\n",
            "```markdown\n0.05%~0.1%（500~1000 ppm）\n```\n",
            "~~~\n500~1000\n~~~\n",
            "$$\n0.05%~0.1%\n$$\n",
            "行内代码 `500~1000` 与 `0.05%~0.1%` 不动\n",
            "行内数学 $a~b$ 不动\n",
            "已转义 0.05%\\~0.1% 不二次转义\n",
        ):
            with self.subTest(source=source):
                prepared, changes = module.normalize_markdown_range_tildes(source)
                self.assertNotIn("\\\\~", prepared)
                if "正文" in source:
                    self.assertIn("500\\~1000", prepared)
                    self.assertEqual(changes, 1)
                else:
                    self.assertEqual((prepared, changes), (source, 0))

    def test_strikeout_context(self):
        # ``~~...~~`` never becomes strikeout under this Pandoc flavour:
        # subscript grabs the tildes first, so escaping the inner range
        # separator neither helps nor harms the rendered output.
        source = "删除线 ~~0.05%~0.1%~~ 尝试\n"
        prepared, changes = module.normalize_markdown_range_tildes(source)
        self.assertIn("~~0.05%\\~0.1%~~", prepared)
        self.assertEqual(changes, 1)

    def test_newlines_are_preserved(self):
        for newline in ("\n", "\r\n"):
            source = newline.join(["a 500~1000", "b 0.05%~0.1%"]) + newline
            expected = newline.join(["a 500\\~1000", "b 0.05%\\~0.1%"]) + newline
            self.assertEqual(
                module.normalize_markdown_range_tildes(source), (expected, 2)
            )

    def test_pipeline_reports_range_tilde_changes(self):
        source = "正文\n\n氦含量 0.05%~0.1%（500~1000 ppm）即具\n"
        prepared, report = module.prepare_markdown(source)
        self.assertIn("0.05%\\~0.1%（500\\~1000", prepared)
        self.assertEqual(report["range_tilde_changes"], 2)


if __name__ == "__main__":
    unittest.main()
