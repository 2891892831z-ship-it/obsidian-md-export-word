#!/usr/bin/env python3
"""Regression checks for citation-to-bibliography hyperlinks and bookmarks."""
import copy
import importlib.util
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "exporter", ROOT / "runtime/scripts/md_export_word_template.py"
)
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)

W = module.W


def make_run(text: str):
    run = module.etree.Element(W("r"))
    node = module.etree.SubElement(run, W("t"))
    node.text = text
    node.set("{" + module.XML_NS + "}space", "preserve")
    return run


def run_texts(nodes) -> str:
    if isinstance(nodes, list):
        return "".join(run_texts(item) for item in nodes)
    parts = []
    for node in nodes.xpath(".//w:t", namespaces=module.NS):
        parts.append(node.text or "")
    return "".join(parts)


class BookmarkNameTests(unittest.TestCase):
    def test_sanitization(self):
        self.assertEqual(
            module.citation_bookmark_name("zotero-ABCD1234"), "Ref_zotero_ABCD1234"
        )
        self.assertEqual(module.citation_bookmark_name("a.b/c"), "Ref_a_b_c")
        self.assertLessEqual(len(module.citation_bookmark_name("k" * 80)), 40)


class DelimiterTests(unittest.TestCase):
    def test_reads_delimiter_from_csl(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "style.csl"
            path.write_text(
                '<style xmlns="http://purl.org/net/xbiblio/csl" version="1.0">'
                "<citation><layout delimiter=\"；\">"
                "<text variable=\"citation-number\"/></layout></citation></style>",
                encoding="utf-8",
            )
            self.assertEqual(module.citation_delimiter(path), "；")

    def test_default_without_delimiter(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "style.csl"
            path.write_text(
                '<style xmlns="http://purl.org/net/xbiblio/csl" version="1.0">'
                "<citation><layout><text variable=\"citation-number\"/>"
                "</layout></citation></style>",
                encoding="utf-8",
            )
            self.assertEqual(module.citation_delimiter(path), "; ")

    def test_default_without_file(self):
        self.assertEqual(module.citation_delimiter(None), "; ")
        self.assertEqual(module.citation_delimiter(""), "; ")


class SplitRunsTests(unittest.TestCase):
    def test_single_group_unchanged(self):
        runs = [make_run("（Xu, 1991）")]
        groups = module._split_run_nodes(runs, "; ", 1)
        self.assertEqual(len(groups), 1)
        self.assertIs(groups[0][0], runs[0])

    def test_clean_split_across_runs(self):
        runs = [make_run("（Xu, 1991; "), make_run("Li, 2020）")]
        groups = module._split_run_nodes(runs, "; ", 2)
        self.assertIsNotNone(groups)
        self.assertEqual(run_texts(groups), "（Xu, 1991; Li, 2020）")
        self.assertEqual(run_texts([groups[0][-1]]), "（Xu, 1991; ")
        self.assertEqual(run_texts([groups[1][0]]), "Li, 2020）")

    def test_split_inside_a_single_run(self):
        runs = [make_run("（Xu, 1991; Li, 2020）")]
        groups = module._split_run_nodes(runs, "; ", 2)
        self.assertEqual(len(groups), 2)
        self.assertEqual(run_texts([groups[0][0]]), "（Xu, 1991; ")
        self.assertEqual(run_texts([groups[1][0]]), "Li, 2020）")
        # The original run text stays untouched for the first whole-run copy.
        self.assertEqual(runs[0].find(W("t")).text, "（Xu, 1991; Li, 2020）")

    def test_wrong_delimiter_count_returns_none(self):
        runs = [make_run("（Xu, 1991; Li, 2020; Wang, 2021）")]
        self.assertIsNone(module._split_run_nodes(runs, "; ", 2))
        self.assertIsNone(module._split_run_nodes(runs, "；", 2))


class LinkedCitationTests(unittest.TestCase):
    anchors = {"zotero-1": "Ref_zotero_1", "zotero-2": "Ref_zotero_2"}

    def links(self, nodes):
        return [n for n in nodes if n.tag == W("hyperlink")]

    def test_single_item_gets_hyperlink(self):
        runs = [make_run("（Xu, 1991）")]
        nodes = module.linked_citation_nodes(
            runs, ["zotero-1"], "; ", self.anchors
        )
        links = self.links(nodes)
        self.assertEqual(len(links), 1)
        self.assertEqual(links[0].get(W("anchor")), "Ref_zotero_1")
        self.assertEqual(run_texts([links[0]]), "（Xu, 1991）")

    def test_multi_item_each_linked(self):
        runs = [make_run("（Xu, 1991; "), make_run("Li, 2020）")]
        nodes = module.linked_citation_nodes(
            runs, ["zotero-1", "zotero-2"], "; ", self.anchors
        )
        links = self.links(nodes)
        self.assertEqual(len(links), 2)
        self.assertEqual(links[0].get(W("anchor")), "Ref_zotero_1")
        self.assertEqual(links[1].get(W("anchor")), "Ref_zotero_2")
        self.assertEqual(run_texts(nodes), "（Xu, 1991; Li, 2020）")

    def test_unknown_key_stays_plain(self):
        runs = [make_run("（Xu, 1991）")]
        nodes = module.linked_citation_nodes(runs, ["zotero-9"], "; ", self.anchors)
        self.assertEqual(self.links(nodes), [])
        self.assertEqual(run_texts(nodes), "（Xu, 1991）")

    def test_ambiguous_split_links_to_first(self):
        runs = [make_run("（Xu, 1991; Li, 2020; Wang, 2021）")]
        nodes = module.linked_citation_nodes(
            runs, ["zotero-1", "zotero-2"], "; ", self.anchors
        )
        links = self.links(nodes)
        self.assertEqual(len(links), 1)
        self.assertEqual(links[0].get(W("anchor")), "Ref_zotero_1")
        self.assertEqual(run_texts([links[0]]), "（Xu, 1991; Li, 2020; Wang, 2021）")


class WesternReferenceTests(unittest.TestCase):
    def test_pure_western_entry(self):
        self.assertTrue(
            module.looks_western_reference(
                {
                    "title": "Mantle helium in extensional basins",
                    "container-title": "Nature",
                    "author": [{"family": "Ballentine", "given": "C"}],
                }
            )
        )

    def test_cjk_title_is_not_western(self):
        self.assertFalse(
            module.looks_western_reference(
                {
                    "title": "中国氦气资源成藏规律",
                    "container-title": "天然气地球科学",
                    "author": [{"family": "Ballentine", "given": "C"}],
                }
            )
        )

    def test_cjk_author_is_not_western(self):
        self.assertFalse(
            module.looks_western_reference(
                {
                    "title": "Helium resources in China",
                    "author": [{"family": "李剑", "given": ""}],
                }
            )
        )

    def test_missing_title_is_not_western(self):
        self.assertFalse(module.looks_western_reference({"author": []}))
        self.assertFalse(module.looks_western_reference({"title": "  "}))


if __name__ == "__main__":
    unittest.main()
