"""Check the export-only bilingual caption option using real Pandoc and OOXML."""
import copy
import argparse
import importlib.util
import json
from pathlib import Path
import subprocess
import tempfile
import zipfile
from lxml import etree

root = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('exporter', root / 'runtime/scripts/md_export_word_template.py')
m = importlib.util.module_from_spec(spec)
spec.loader.exec_module(m)
args = argparse.ArgumentParser()
args.add_argument('--pandoc')
options = args.parse_args()
pandoc = options.pandoc or next((root / 'runtime').rglob('pandoc.exe'), None)
if not pandoc:
    import shutil
    pandoc = shutil.which('pandoc')
assert pandoc, 'Pandoc required for output verification'

source = '''Chinese primary caption

:::: landscape

::: {custom-style="Figure Caption EN"}
English figure translation [@captionOnly]
:::

::: {custom-style="Table Caption EN"}
English table translation
:::

Primary table text

::::

::: {custom-style="Other Style"}
Unrelated English text
:::

```
::: {custom-style="Figure Caption EN"}
Code example
:::
```
'''
ast = json.loads(subprocess.check_output([str(pandoc), '-f', 'markdown', '-t', 'json'], input=source.encode()))
assert m.load_format_config(None)['include_english_captions'] is True
try:
    m.load_format_config('{"include_english_captions":"false"}')
    raise AssertionError('String boolean accepted')
except m.ExportError:
    pass
with tempfile.TemporaryDirectory() as tmp:
    for language, include, expected in [('zh-CN', True, 0), ('zh-CN', False, 2), ('en-US', False, 0)]:
        tree = copy.deepcopy(ast)
        count = m.filter_english_caption_blocks(tree, {'document_language': language, 'include_english_captions': include})
        assert count == expected
        assert ('captionOnly' in m.ast_inventory(tree)['citekeys']) == (expected == 0)
        out = Path(tmp) / 'captions.docx'
        subprocess.run([str(pandoc), '-f', 'json', '-t', 'docx', '-o', str(out)], input=json.dumps(tree).encode(), check=True)
        with zipfile.ZipFile(out) as package:
            doc = etree.fromstring(package.read('word/document.xml'))
        text = ''.join(doc.xpath('//w:t/text()', namespaces=m.NS))
        for caption in ['English figure translation', 'English table translation']:
            assert (caption in text) == (expected == 0)
        for preserved in ['Chinese primary caption', 'Primary table text', 'Unrelated English text', 'Code example']:
            assert preserved in text
        assert any(n.get('t') == 'Div' and 'landscape' in n['c'][0][1] for n in tree['blocks'])
assert ast == json.loads(subprocess.check_output([str(pandoc), '-f', 'markdown', '-t', 'json'], input=source.encode()))
print('English caption option: actual Word output, language guard, nested Divs, code and citation inventory passed.')
