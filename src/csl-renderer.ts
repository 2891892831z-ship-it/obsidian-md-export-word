import CSL from "citeproc";

/** CSL-M layouts are supported by citeproc-js, the processor family used by Zotero. */
export function renderCsl(input, locales) {
  const records=new Map(input.references.map(record=>[String(record.id),record]));
  const engine=new CSL.Engine({
    retrieveLocale(locale) {
      const name=locale.replace(/_/g,"-");
      return locales[name] || locales[Object.keys(locales).find(key=>key.split('-')[0]===name.split('-')[0])] || locales['en-US'];
    },
    retrieveItem(id) {
      if(!records.has(String(id)))throw Error(`Missing CSL record: ${id}`);
      return records.get(String(id));
    }
  },input.style,input.language || "en-US");
  engine.setOutputFormat("html");
  const previous=[];
  const citations=[];
  for(const [index,items] of input.clusters.entries()) {
    const citation={citationID:`md-word-${index}`,citationItems:items,properties:{noteIndex:0}};
    const [,updates]=engine.processCitationCluster(citation,previous,[]);
    for(const [position,html] of updates)citations[position]=html;
    previous.push([citation.citationID,0]);
  }
  const bibliography=engine.makeBibliography();
  if(citations.length!==input.clusters.length || citations.some(value=>!value))throw Error("Incomplete CSL citations");
  if(!bibliography || !bibliography[1].length)throw Error("The selected CSL has no bibliography");
  return {citations,bibliography:bibliography[1]};
}
