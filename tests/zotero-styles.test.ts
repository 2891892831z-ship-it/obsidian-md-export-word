import { test } from "node:test";
import assert from "node:assert/strict";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";
import { discoverZoteroStyles, styleMetadata } from "../src/zotero-styles";
import { renderCsl } from "../src/csl-renderer";

test("CSL-M uses each item's layout and produces a real bibliography",async()=>{
  const folder=path.join(process.cwd(),"node_modules/citeproc-locales/locales");
  const locales={};
  for(const name of ['en-US','zh-CN'])locales[name]=await fs.readFile(path.join(folder,`locales-${name}.xml`),'utf8');
  const style=`<style xmlns="http://purl.org/net/xbiblio/csl" version="1.0" class="in-text" default-locale="zh-CN"><info><id>http://example.org/test</id><title>Test</title><updated>2026-01-01T00:00:00+00:00</updated></info>
    <citation><layout locale="en" prefix="（" suffix="）"><text variable="title" prefix="EN-"/></layout><layout prefix="（" suffix="）"><text variable="title" prefix="ZH-"/></layout></citation>
    <bibliography><layout locale="en"><text variable="title"/></layout><layout><text variable="title"/></layout></bibliography></style>`;
  const result=renderCsl({style,language:'zh-CN',references:[{id:'en',type:'book',title:'English',language:'en-US'},{id:'zh',type:'book',title:'中文',language:'zh-CN'}],clusters:[[{id:'en'}],[{id:'zh'}]]},locales);
  assert.deepEqual(result.citations,['（EN-English）','（ZH-中文）']);
  assert.equal(result.bibliography.length,2);
});

test("CSL metadata uses the real ID, XML escapes and dependent parent",()=>{
  const record=styleMetadata('<style><info><title>A &amp; B</title><id>https://example.org/custom</id><link rel="independent-parent" href="http://www.zotero.org/styles/apa"/></info></style>',"custom.csl");
  assert.equal(record?.title,"A & B");
  assert.equal(record?.id,"https://example.org/custom");
  assert.equal(record?.parent,"http://www.zotero.org/styles/apa");
  assert.equal(styleMetadata("<style/>","invalid.csl"),null);
});

test("custom Zotero data directory, hidden parents and reload reflect actual files",async()=>{
  const home=await fs.mkdtemp(path.join(os.tmpdir(),"zotero-style-test-"));
  try {
    const appdata=path.join(home,"appdata");
    const profile=path.join(appdata,"Zotero","Zotero","Profiles","test");
    const data=path.join(home,"custom data");
    await fs.mkdir(profile,{recursive:true});
    await fs.writeFile(path.join(profile,"..","..","profiles.ini"),'[Profile0]\nIsRelative=1\nPath=Profiles/test\n');
    await fs.writeFile(path.join(profile,"prefs.js"),`user_pref("extensions.zotero.dataDir", ${JSON.stringify(data)});`);
    const styles=path.join(data,"styles");
    await fs.mkdir(path.join(styles,"hidden"),{recursive:true});
    const xml=(id,title,parent="")=>`<style><info><id>http://www.zotero.org/styles/${id}</id><title>${title}</title>${parent?`<link href="http://www.zotero.org/styles/${parent}" rel="independent-parent"/>`:""}</info></style>`;
    await fs.writeFile(path.join(styles,"hidden","parent.csl"),xml("parent","Parent"));
    await fs.writeFile(path.join(styles,"journal.csl"),xml("journal","Journal","parent"));
    await fs.writeFile(path.join(styles,"broken.csl"),"<style/>");
    let result=await discoverZoteroStyles(home,{APPDATA:appdata});
    assert.equal(result.styles.length,1);
    assert.equal(result.styles[0].renderPath,path.join(styles,"hidden","parent.csl"));
    await fs.writeFile(path.join(styles,"new.csl"),xml("new","New"));
    result=await discoverZoteroStyles(home,{APPDATA:appdata});
    assert.equal(result.styles.length,2);
  } finally {await fs.rm(home,{recursive:true,force:true});}
});
