"""Targeted regressions for PR #12 and article compatibility."""
import copy
import importlib.util
import os
import tempfile
from types import SimpleNamespace
from unittest.mock import patch
from pathlib import Path
from lxml import etree

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('exporter', root / 'runtime/scripts/md_export_word_template.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)

cases = [
    ('---\ntitle: Article\n---\n# Article\n\n# Background\n\n# Methods\n', 'Article', True),
    ('---\ntitle: Thesis\n---\n# 第1章 绪论\n\n# 第2章 方法\n', 'Thesis', False),
    ('---\ntitle: Thesis\n---\n# Chapter I Introduction\n', 'Thesis', False),
    ('---\ntitle: Article\n---\n# Abstract\n\n# Methods\n', 'Article', True),
    ('---\ntitle: Metadata\n---\n````markdown\n# Chapter 1 Fake\n```\n# Fake again\n````\n<!--\n# Chapter 2 Comment\n-->\n$$\n# Chapter 3 Math\n$$\n# Actual title\n', 'Actual title', True),
]
cases.append(('---\ntitle: Metadata\n---\n```\n<!--\n%%\n$$\n# Fake\n```\n# Actual title\n', 'Actual title', True))
for text, title, suppressed in cases:
    result, actual, removed = m.suppress_frontmatter_title_when_h1_exists(text)
    assert (actual, removed) == (title, suppressed), (actual, removed)
    if suppressed:
        assert '\ntitle:' not in result
    else:
        assert result == text

for title in ['图1-1: 题名', '图 1.2 题名', 'Figure 2–3 Caption', 'Table 3—2 Caption']:
    assert m.valid_caption_text(title, ('图', 'Figure', 'Table')), title
for title in ['图 1- Caption', 'Figure Caption', '图 1-2']:
    assert not m.valid_caption_text(title, ('图', 'Figure', 'Table')), title

citations = [{'citationId': key, 'citationMode': {'t':'NormalCitation'}} for key in ['sec:intro', 'lst:code', 'fig:a', 'tbl:a', 'eq:a', 'real']]
ast = {'meta':{}, 'blocks':[{'t':'Para', 'c':[{'t':'Cite', 'c':[citations, []]}]}]}
assert m.ast_inventory(ast)['citekeys'] == ['real']
assert m.ast_inventory(ast)['citation_clusters'] == 1
crossrefs = copy.deepcopy(ast)
crossrefs['blocks'][0]['c'][0]['c'][0] = citations[:-1]
assert m.ast_inventory(crossrefs)['citation_clusters'] == 0
assert m.unresolved_citation_cluster_count(crossrefs, {'sec:intro','lst:code'}) == 0

# Locale overrides are removed only from the Pandoc child process.
with tempfile.TemporaryDirectory() as temporary:
    folder = Path(temporary)
    output = folder / '输出.docx'
    def fake_run(command, **kwargs):
        assert 'LC_ALL' not in kwargs['env']
        assert 'LC_CTYPE' not in kwargs['env']
        assert kwargs['env']['LANG'] == 'zh_CN.UTF-8'
        assert str(folder / '中文稿件.md') in command
        output.touch()
        return SimpleNamespace(returncode=0, stdout='', stderr='')
    with patch.dict(os.environ, {'LC_ALL':'C.UTF-8', 'LC_CTYPE':'C', 'LANG':'zh_CN.UTF-8'}):
        with patch.object(m.subprocess, 'run', side_effect=fake_run):
            m.run_pandoc(pandoc=folder/'pandoc', crossref=folder/'crossref',
                true_scripts=folder/'scripts.lua', zotero_filter=folder/'zotero.lua',
                template=folder/'template.docx', input_path=folder/'中文稿件.md',
                input_format='markdown', raw_docx=output, vault_root=folder, md_parent=folder)
        assert os.environ['LC_ALL'] == 'C.UTF-8'
        assert os.environ['LC_CTYPE'] == 'C'

def paragraph(label=None, tail=None):
    p = etree.Element(m.W('p'))
    if label:
        bookmark = etree.SubElement(p, m.W('bookmarkStart'))
        bookmark.set(m.W('name'), 'eq:' + label)
    math = etree.SubElement(etree.SubElement(p, '{'+m.NS['m']+'}oMathPara'), '{'+m.NS['m']+'}oMath')
    for value in ['x = y'] + ([tail] if tail else []):
        etree.SubElement(etree.SubElement(math, '{'+m.NS['m']+'}r'), '{'+m.NS['m']+'}t').text = value
    return p

for modes in [('old','new'), ('new','old'), ('new','new')]:
    doc = etree.Element(m.W('document'))
    body = etree.SubElement(doc, m.W('body'))
    unnumbered = paragraph()
    body.append(unnumbered)
    for i, mode in enumerate(modes):
        body.append(paragraph(str(i), '('+str(i+1)+')' if mode=='old' else None))
    assert m.wrap_numbered_display_equations(doc, max_width_dxa=9000,
        format_config=m.DEFAULT_FORMAT_CONFIG, equation_numbers=[3,7]) == 2
    assert unnumbered.getparent() is body
    assert doc.xpath('.//w:tbl/w:tr/w:tc[2]//w:t/text()', namespaces=m.NS) == ['（3）','（7）']
    assert m.wrap_numbered_display_equations(doc, max_width_dxa=9000,
        format_config=m.DEFAULT_FORMAT_CONFIG, equation_numbers=[3,7]) == 0
print('Thesis regressions: title compatibility, code/comment/math exclusion, chapter captions, crossrefs, mixed equation layouts passed.')
