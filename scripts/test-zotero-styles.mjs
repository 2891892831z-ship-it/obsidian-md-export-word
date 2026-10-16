import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import esbuild from "esbuild";
const root=path.resolve(import.meta.dirname,"..");
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),"md-word-styles-test-"));
try {
  const output=path.join(temporary,"styles.test.mjs");
  await esbuild.build({entryPoints:[path.join(root,"tests/zotero-styles.test.ts")],bundle:true,platform:"node",format:"esm",outfile:output,logLevel:"silent"});
  const result=spawnSync(process.execPath,["--test",output],{stdio:"inherit"});
  if(result.error)throw result.error;
  process.exitCode=result.status || 0;
} finally {fs.rmSync(temporary,{recursive:true,force:true});}
