"""Check heading levels through Pandoc and the Word formatting pass."""
import copy
import importlib.util
import subprocess
import tempfile
from pathlib import Path
from zipfile import ZipFile
from lxml import etree

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('exporter', root / 'runtime/scripts/md_export_word_template.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
pandoc = Path.home() / 'AppData/Local/Pandoc/pandoc.exe'

cases = [
    ('---\ntitle: Thesis\n---\n# 摘要\n\n# 第1章 绪论\n\n## 1.1 背景\n\n### 1.1.1 方法\n\n#### 四级标题\n\n# 参考文献\n',
     [('Thesis', 'Title', '9'), ('摘要', 'Heading1', '0'), ('第1章绪论', 'Heading1', '0'), ('1.1 背景', 'Heading2', '1'), ('1.1.1 方法', 'Heading3', '2'), ('四级标题', 'Heading4', '3'), ('参考文献', 'Heading1', '0')]),
    ('---\ntitle: Article\n---\n# Article\n\n# Introduction\n\n## Methods\n',
     [('Article', 'Title', '9'), ('Introduction', 'Heading1', '0'), ('Methods', 'Heading2', '1')]),
    ('# 摘要\n\n# 第1章 绪论\n', [('摘要', 'Heading1', '0'), ('第1章绪论', 'Heading1', '0')]),
]
with tempfile.TemporaryDirectory() as temporary:
    folder = Path(temporary)
    for source, expected in cases:
        prepared, title, _ = m.suppress_frontmatter_title_when_h1_exists(source)
        md = folder / 'input.md'
        output = folder / 'output.docx'
        md.write_text(prepared, encoding='utf-8')
        subprocess.run([str(pandoc), str(md), '-o', str(output)], check=True, capture_output=True)
        with ZipFile(output) as package:
            document = etree.fromstring(package.read('word/document.xml'))
            styles = m.style_id_map(etree.fromstring(package.read('word/styles.xml')))
        config = copy.deepcopy(m.DEFAULT_FORMAT_CONFIG)
        m.format_body_paragraphs(document, styles=styles, format_config=config, document_title=title)
        paragraphs = document.xpath('./w:body/w:p', namespaces=m.NS)
        actual = [(m.paragraph_text(p), p.xpath('string(w:pPr/w:pStyle/@w:val)', namespaces=m.NS),
                   p.xpath('string(w:pPr/w:outlineLvl/@w:val)', namespaces=m.NS)) for p in paragraphs]
        assert actual == expected, actual
        for paragraph in paragraphs:
            # Re-running the formatter must preserve all outline levels.
            before = paragraph.xpath('string(w:pPr/w:outlineLvl/@w:val)', namespaces=m.NS)
            m.format_body_paragraphs(document, styles=styles, format_config=config, document_title=title)
            assert paragraph.xpath('string(w:pPr/w:outlineLvl/@w:val)', namespaces=m.NS) == before
print('Pandoc + Word styles verified: Title outside outline; H1-H4 retain levels; abstract/chapter/reference headings stay H1; duplicate title exported once.')
