import * as fs from "node:fs/promises";
import * as path from "node:path";
import * as os from "node:os";

function xmlText(value: string): string {
  return value.replace(/&#(x[\da-f]+|\d+);|&(amp|lt|gt|quot|apos);/gi, (_, number, name) => {
    if (number) return String.fromCodePoint(number[0].toLowerCase() === "x" ? parseInt(number.slice(1), 16) : Number(number));
    return ({amp:"&",lt:"<",gt:">",quot:'"',apos:"'"})[name.toLowerCase()];
  });
}

export function styleMetadata(xml: string, file: string) {
  const info = xml.replace(/<!--[\s\S]*?-->/g, "").match(/<info\b[^>]*>([\s\S]*?)<\/info>/)?.[1];
  if (!info) return null;
  const id = xmlText(info.match(/<id\b[^>]*>([^<]+)<\/id>/)?.[1]?.trim() || "");
  const title = xmlText(info.match(/<title\b[^>]*>([^<]+)<\/title>/)?.[1]?.trim() || "");
  if (!/^https?:\/\/\S+$/.test(id) || !title) return null;
  const parentLink = [...info.matchAll(/<link\b([^>]+)\/?\s*>/g)].find(match => /\brel\s*=\s*["']independent-parent["']/.test(match[1]));
  const parent = parentLink ? xmlText(parentLink[1].match(/\bhref\s*=\s*["']([^"']+)["']/)?.[1] || "") : "";
  const locale = xml.match(/<style\b[^>]*\bdefault-locale\s*=\s*["']([^"']+)["']/)?.[1] || "";
  return { id, title, path:file, parent, locale };
}

export async function discoverZoteroStyles(home = os.homedir(), environment = process.env) {
  const profiles = [path.join(home,".zotero","zotero"), path.join(home,"Library","Application Support","Zotero")];
  if (environment.APPDATA) profiles.unshift(path.join(environment.APPDATA,"Zotero","Zotero"));
  const directories = new Set([path.join(home,"Zotero","styles")]);
  for (const base of profiles) {
    try {
      const ini = await fs.readFile(path.join(base,"profiles.ini"),"utf8");
      for (const section of ini.split(/\r?\n\s*\[/)) {
        const profile = section.match(/^Path=(.+)$/m)?.[1]?.trim();
        if (!profile) continue;
        const absolute = /^IsRelative=0\s*$/m.test(section) ? profile : path.resolve(base,profile);
        const prefs = await fs.readFile(path.join(absolute,"prefs.js"),"utf8");
        const raw = prefs.match(/user_pref\("extensions\.zotero\.dataDir",\s*("(?:\\.|[^"\\])*")\s*\)/)?.[1];
        if (raw && !/user_pref\("extensions\.zotero\.useDataDir",\s*false\s*\)/.test(prefs)) directories.add(path.join(JSON.parse(raw),"styles"));
      }
    } catch { /* Default location still works when no profile is available. */ }
  }
  const records = [];
  const scanned = [];
  for (const directory of directories) {
    for (const folder of [directory,path.join(directory,"hidden")]) {
      try {
        const files = (await fs.readdir(folder)).filter(file=>file.toLowerCase().endsWith(".csl"));
        scanned.push(folder);
        const results = await Promise.all(files.map(async file=> {
          try { const full=path.join(folder,file); return styleMetadata(await fs.readFile(full,"utf8"),full); }
          catch { return null; }
        }));
        records.push(...results.filter(Boolean).map(record=>({...record,hidden:folder!==directory})));
      } catch { /* Missing or unreadable style directories are reported by the empty list. */ }
    }
  }
  const byId = new Map(records.map(record=>[record.id,record]));
  const styles = records.filter(record=>!record.hidden).map(record=> {
    let resolved=record;
    const seen=new Set([record.id]);
    while (resolved.parent && byId.has(resolved.parent) && !seen.has(resolved.parent)) {
      seen.add(resolved.parent); resolved=byId.get(resolved.parent);
    }
    return {...record,renderPath:resolved.parent ? "" : resolved.path};
  });
  return {styles:[...new Map(styles.map(style=>[style.id,style])).values()].sort((a,b)=>a.title.localeCompare(b.title)),directories:scanned};
}
