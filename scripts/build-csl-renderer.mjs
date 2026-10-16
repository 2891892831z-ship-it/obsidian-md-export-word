import fs from "node:fs";
import path from "node:path";
import esbuild from "esbuild";
const root=path.resolve(import.meta.dirname,"..");
const folder=path.join(root,"node_modules/citeproc-locales/locales");
const locales=Object.fromEntries(fs.readdirSync(folder).filter(file=>file.endsWith('.xml')).map(file=>[file.replace(/^locales-/,"").replace(/\.xml$/,""),fs.readFileSync(path.join(folder,file),"utf8")]));
await esbuild.build({
  stdin:{contents:`import fs from 'node:fs';import {renderCsl} from './src/csl-renderer';
    const locales=${JSON.stringify(locales)};
    try {process.stdout.write(JSON.stringify(renderCsl(JSON.parse(fs.readFileSync(0,'utf8')),locales)));}
    catch(error){process.stderr.write(String(error.stack || error));process.exitCode=1;}`,
    resolveDir:root,sourcefile:"csl-runner.ts",loader:"ts"},
  bundle:true,platform:"node",format:"cjs",target:"node18",minify:true,legalComments:"inline",
  banner:{js:"/*! citeproc-js 1.4.63, Copyright 2009–2019 Frank Bennett. CPAL-1.0 or AGPL-3.0. https://github.com/Juris-M/citeproc-js ; locales: citeproc-locales 1.0.2, MIT. */"},
  outfile:path.join(root,"runtime/scripts/render_csl.cjs")
});
