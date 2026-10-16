"""Targeted structural checks without starting Word or modifying manuscripts."""
import importlib.util
from pathlib import Path
from lxml import etree

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('exporter_language', root / 'runtime/scripts/md_export_word_template.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
for language, indent, font in [('en-US', 2, 'Times New Roman'), ('zh-CN', 2, '宋体')]:
    config = dict(m.DEFAULT_FORMAT_CONFIG, document_language=language, body_first_line_chars=indent)
    effective = m.language_aware_format_config(config, language)
    assert effective['east_asia_font'] == font
    assert m.body_first_line_indent_twips(effective) == (240 if language == 'en-US' else 480)
    styles = etree.Element(m.W('styles'), nsmap={'w': m.W_NS})
    m.patch_inherited_font_defaults(styles, document_language=language, format_config=effective)
    for fonts in styles.xpath('.//w:rFonts', namespaces=m.NS):
        assert fonts.get(m.W('ascii')) == 'Times New Roman'
        assert fonts.get(m.W('eastAsia')) == font

doc = etree.Element(m.W('document'), nsmap={'w': m.W_NS})
body = etree.SubElement(doc, m.W('body'))
p = etree.SubElement(body, m.W('p'))
for kind, text in [('begin', None), (None, ' ADDIN ZOTERO_ITEM CSL_CITATION {"properties":{"formattedCitation":"（Guo et al., 2024）"}}'), ('separate', None), ('text', '（Guo et al., 2024）'), ('end', None)]:
    run = etree.SubElement(p, m.W('r'))
    if kind == 'text': etree.SubElement(run, m.W('t')).text = text
    elif kind is None: etree.SubElement(run, m.W('instrText')).text = text
    else: etree.SubElement(run, m.W('fldChar')).set(m.W('fldCharType'), kind)
m.patch_english_zotero_citation_parentheses(doc, document_language='en-US', western_font='Times New Roman')
assert ''.join(doc.xpath('.//w:t/text()', namespaces=m.NS)) == '(Guo et al., 2024)'
assert not m.english_zotero_parenthesis_issues(doc, document_language='en-US', western_font='Times New Roman')
config = dict(m.DEFAULT_FORMAT_CONFIG, document_language='en-US', body_first_line_chars=2)
m.set_paragraph_format(p, alignment='both', before=0, after=0, line=360, first_line=m.body_first_line_indent_twips(config))
assert p.find('w:pPr/w:jc', m.NS).get(m.W('val')) == 'both'
assert p.find('w:pPr/w:ind', m.NS).get(m.W('firstLine')) == '240'
print('English/Chinese font inheritance, indentation, justification and Zotero parentheses passed.')
