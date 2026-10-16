"""Regression checks for issues found during bilingual Word page review."""
from pathlib import Path
import importlib.util
from lxml import etree

root=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('exporter',root/'runtime/scripts/md_export_word_template.py')
m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m)

text,_=m.normalize_markdown_citation_spacing('English prose [@existing].\n中文正文 [@existing] 后续正文。\n')
assert 'prose [@existing]' in text
assert '中文正文[@existing]后续正文' in text
for language,label,separator in [('en-US','Table',' '),('zh-CN','图',' ')]:
    document=etree.fromstring(('<w:document xmlns:w="'+m.W_NS+'"><w:body><w:p>'
        '<w:r><w:t>正文 </w:t><w:t>'+label+'</w:t><w:t> </w:t></w:r>'
        '<w:r><w:t> </w:t></w:r><w:hyperlink w:anchor="fig:test"><w:r><w:t>1</w:t></w:r></w:hyperlink>'
        '</w:p></w:body></w:document>').encode())
    m.patch_crossref_number_spacing(document,language)
    assert ''.join(document.xpath('.//w:t/text()',namespaces=m.NS))=='正文 '+label+separator+'1'
    before=etree.tostring(document)
    m.patch_crossref_number_spacing(document,language)
    assert etree.tostring(document)==before

ast={'meta':{},'blocks':[{'t':'Figure','c':[['',[],[]],[None,[{'t':'Plain','c':[
    {'t':'Cite','c':[[{'citationId':'existing','citationMode':{'t':'NormalCitation'}}],[]]}]}]],
    [{'t':'Plain','c':[{'t':'Image','c':[['',[],[]],[{'t':'Cite','c':[[{'citationId':'existing'}],[]]}],['image.png','']]}]}]]}]}
import copy
original=copy.deepcopy(ast)
assert m.ast_inventory(ast)['citation_clusters']==1
assert ast==original
print('English citation spacing, split-run number spacing, idempotence and Figure citation deduplication passed.')

# A long caption must reserve more room than a short caption for the same tall image.
config=copy.deepcopy(m.DEFAULT_FORMAT_CONFIG)
heights=[]
for words in (10,400):
    document=etree.fromstring(('<w:document xmlns:w="'+m.W_NS+'" xmlns:wp="'+m.NS['wp']+'"><w:body>'
        '<w:p><w:r><w:drawing><wp:inline><wp:extent cx="4000000" cy="9000000"/></wp:inline></w:drawing></w:r></w:p>'
        '<w:p><w:pPr><w:pStyle w:val="Caption"/></w:pPr><w:r><w:t>Figure 1: '+('caption '*words)+'</w:t></w:r></w:p>'
        '</w:body></w:document>').encode())
    m.fit_figure_caption_clusters(document,styles={'Image Caption':'Caption'},format_config=config)
    heights.append(int(document.xpath('string(.//wp:extent/@cy)',namespaces=m.NS)))
    assert document.xpath('.//w:body/w:p[1]/w:pPr/w:keepNext',namespaces=m.NS)
assert heights[1]<heights[0]
print('Tall-image sizing accounts for rendered caption length and keeps the caption attached.')

source='正文\n![图题](figure.png)\n{#fig:kept width=80%}\n后文\n'
normalized,_=m.normalize_markdown_image_spacing(source)
assert normalized=='正文\n\n![图题](figure.png){#fig:kept width=80%}\n\n后文\n'
assert m.normalize_markdown_image_spacing(normalized)[0]==normalized
code='```markdown\n'+source+'```\n'
assert m.normalize_markdown_image_spacing(code)[0]==code
print('Next-line figure labels stay attached to images; code blocks and repeated normalization are preserved.')

for language,style_id in [('zh-CN','http://www.zotero.org/styles/nature'),('en-US','https://example.org/custom-style')]:
    custom=etree.Element(m.CP('Properties'))
    m.patch_zotero_document_preferences(custom,document_language=language,style_id=style_id,force=True)
    assert not m.zotero_document_preference_issues(custom,document_language=language,style_id=style_id,force=True)
    prefs=etree.fromstring(m.zotero_preference_text(custom).encode())
    assert prefs.find('style').get('id')==style_id
    assert prefs.find('style').get('locale')==language
print('Selected CSL IDs and locales are preserved in Chinese and English Zotero document preferences.')

document=etree.fromstring(('<w:document xmlns:w="'+m.W_NS+'"><w:body>'+''.join(
    '<w:p><w:pPr><w:pStyle w:val="H1"/><w:ind w:left="480"/></w:pPr><w:r><w:t>'+title+'</w:t></w:r></w:p>'
    for title in ['Article title','Section one','Section two'])+'</w:body></w:document>').encode())
m.format_body_paragraphs(document,styles={'heading 1':'H1','heading 2':'H2','heading 3':'H3','heading 4':'H4','Body Text':'Body','Normal':'Normal',
    'First Paragraph':'First','图片':'Picture','Image Caption':'Caption','Table Caption':'TableCaption','Figure Table Note':'Note','Bibliography':'Bibl'},
    format_config=copy.deepcopy(m.DEFAULT_FORMAT_CONFIG),document_title='Article title')
paragraphs=document.xpath('.//w:body/w:p',namespaces=m.NS)
assert [p.xpath('string(w:pPr/w:jc/@w:val)',namespaces=m.NS) for p in paragraphs]==['center','left','left']
assert all(p.xpath('string(w:pPr/w:ind/@w:left)',namespaces=m.NS)=='0' for p in paragraphs)
print('Only the article title is centered; H1 section headings are left aligned with zero inherited indent.')
