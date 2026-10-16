/*! citeproc-js 1.4.63, Copyright 2009–2019 Frank Bennett. CPAL-1.0 or AGPL-3.0. https://github.com/Juris-M/citeproc-js ; locales: citeproc-locales 1.0.2, MIT. */
var Ge=Object.create;var Le=Object.defineProperty;var Ve=Object.getOwnPropertyDescriptor;var Xe=Object.getOwnPropertyNames;var Je=Object.getPrototypeOf,$e=Object.prototype.hasOwnProperty;var We=(e,t)=>()=>(t||e((t={exports:{}}).exports,t),t.exports);var Ke=(e,t,n,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Xe(t))!$e.call(e,i)&&i!==n&&Le(e,i,{get:()=>t[i],enumerable:!(r=Ve(t,i))||r.enumerable});return e};var Ie=(e,t,n)=>(n=e!=null?Ge(Je(e)):{},Ke(t||!e||!e.__esModule?Le(n,"default",{value:e,enumerable:!0}):n,e));var we=We((Ze,Me)=>{"use strict";var m={PROCESSOR_VERSION:"1.4.61",error:function(e){throw typeof Error>"u"?new Error("citeproc-js error: "+e):"citeproc-js error: "+e},debug:function(e){typeof console>"u"?dump("CSL: "+e+`
`):console.log("citeproc-js warning: "+e)},toLocaleUpperCase(e){var t=this.tmp.lang_array;try{e=e.toLocaleUpperCase(t)}catch{e=e.toUpperCase()}return e},toLocaleLowerCase(e){var t=this.tmp.lang_array;try{e=e.toLocaleLowerCase(t)}catch{e=e.toLowerCase()}return e},LOCATOR_LABELS_REGEXP:new RegExp("^((vrs|sv|subpara|op|subch|add|amend|annot|app|art|bibliog|bk|ch|cl|col|cmt|dec|dept|div|ex|fig|fld|fol|n|hypo|illus|intro|l|no|p|pp|para|pt|pmbl|princ|pub|r|rn|sched|sec|ser|subdiv|subsec|supp|tbl|tit|vol)\\.)\\s+(.*)"),STATUTE_SUBDIV_PLAIN_REGEX:/(?:(?:^| )(?:vrs|sv|subpara|op|subch|add|amend|annot|app|art|bibliog|bk|ch|cl|col|cmt|dec|dept|div|ex|fig|fld|fol|n|hypo|illus|intro|l|no|p|pp|para|pt|pmbl|princ|pub|r|rn|sched|sec|ser|subdiv|subsec|supp|tbl|tit|vol)\. *)/,STATUTE_SUBDIV_PLAIN_REGEX_FRONT:/(?:^\s*[.,;]*\s*(?:vrs|sv|subpara|op|subch|add|amend|annot|app|art|bibliog|bk|ch|cl|col|cmt|dec|dept|div|ex|fig|fld|fol|n|hypo|illus|intro|l|no|p|pp|para|pt|pmbl|princ|pub|r|rn|sched|sec|ser|subdiv|subsec|supp|tbl|tit|vol)\. *)/,STATUTE_SUBDIV_STRINGS:{"vrs.":"verse","sv.":"sub-verbo","subpara.":"subparagraph","op.":"opus","subch.":"subchapter","add.":"addendum","amend.":"amendment","annot.":"annotation","app.":"appendix","art.":"article","bibliog.":"bibliography","bk.":"book","ch.":"chapter","cl.":"clause","col.":"column","cmt.":"comment","dec.":"decision","dept.":"department","ex.":"example","fig.":"figure","fld.":"field","fol.":"folio","n.":"note","hypo.":"hypothetical","illus.":"illustration","intro.":"introduction","l.":"line","no.":"issue","p.":"page","pp.":"page","para.":"paragraph","pt.":"part","pmbl.":"preamble","princ.":"principle","pub.":"publication","r.":"rule","rn.":"randnummer","sched.":"schedule","sec.":"section","ser.":"series,","subdiv.":"subdivision","subsec.":"subsection","supp.":"supplement","tbl.":"table","tit.":"title","vol.":"volume"},STATUTE_SUBDIV_STRINGS_REVERSE:{verse:"vrs.","sub-verbo":"sv.","sub verbo":"sv.",subparagraph:"subpara.",opus:"op.",subchapter:"subch.",addendum:"add.",amendment:"amend.",annotation:"annot.",appendix:"app.",article:"art.",bibliography:"bibliog.",book:"bk.",chapter:"ch.",clause:"cl.",column:"col.",comment:"cmt.",decision:"dec.",department:"dept.",example:"ex.",figure:"fig.",field:"fld.",folio:"fol.",note:"n.",hypothetical:"hypo.",illustration:"illus.",introduction:"intro.",line:"l.",issue:"no.",page:"p.",paragraph:"para.",part:"pt.",preamble:"pmbl.",principle:"princ.",publication:"pub.",rule:"r.",randnummer:"rn.",schedule:"sched.",section:"sec.","series,":"ser.",subdivision:"subdiv.",subsection:"subsec.",supplement:"supp.",table:"tbl.",title:"tit.",volume:"vol."},LOCATOR_LABELS_MAP:{vrs:"verse",sv:"sub-verbo",subpara:"subparagraph",op:"opus",subch:"subchapter",add:"addendum",amend:"amendment",annot:"annotation",app:"appendix",art:"article",bibliog:"bibliography",bk:"book",ch:"chapter",cl:"clause",col:"column",cmt:"comment",dec:"decision",dept:"department",ex:"example",fig:"figure",fld:"field",fol:"folio",n:"note",hypo:"hypothetical",illus:"illustration",intro:"introduction",l:"line",no:"issue",p:"page",pp:"page",para:"paragraph",pt:"part",pmbl:"preamble",princ:"principle",pub:"publication",r:"rule",rn:"randnummer",sched:"schedule",sec:"section",ser:"series,",subdiv:"subdivision",subsec:"subsection",supp:"supplement",tbl:"table",tit:"title",vol:"volume"},MODULE_MACROS:{"juris-pretitle":!0,"juris-title":!0,"juris-pretitle-short":!0,"juris-title-short":!0,"juris-main":!0,"juris-main-short":!0,"juris-tail":!0,"juris-tail-short":!0,"juris-locator":!0},MODULE_TYPES:{legal_case:!0,legislation:!0,bill:!0,hearing:!0,gazette:!0,report:!0,regulation:!0,standard:!0,patent:!0,locator:!0},checkNestedBrace:function(e){e.opt.xclass==="note"?(this.depth=0,this.update=function(n){for(var n=n||"",r=n.split(/([\(\)])/),i=1,s=r.length;i<s;i+=2)r[i]==="("?(this.depth%2===1&&(r[i]="["),this.depth+=1):r[i]===")"&&(this.depth%2===0&&(r[i]="]"),this.depth-=1);var a=r.join("");return a}):this.update=function(t){return t}},MULTI_FIELDS:["event","publisher","publisher-place","event-place","title","container-title","collection-title","authority","genre","title-short","medium","country","jurisdiction","archive","archive-place"],LangPrefsMap:{title:"titles","title-short":"titles",event:"titles",genre:"titles",medium:"titles","container-title":"journals","collection-title":"titles",archive:"journals",publisher:"publishers",authority:"publishers","publisher-place":"places","event-place":"places","archive-place":"places",jurisdiction:"places",number:"places",edition:"places",issue:"places",volume:"places"},AbbreviationSegments:function(){this["container-title"]={},this["collection-title"]={},this["institution-entire"]={},this["institution-part"]={},this.nickname={},this.number={},this.title={},this.place={},this.hereinafter={},this.classic={},this["container-phrase"]={},this["title-phrase"]={}},getAbbrevsDomain:function(e,t,n){var r=null;if(e.opt.availableAbbrevDomains&&t&&t!=="default"){var i=e.locale[e.opt.lang].opts["jurisdiction-preference"],s=null;if(e.locale[n]&&(s=e.locale[n].opts["jurisdiction-preference"]),s){for(var a=s.length-1;a>-1;a--)if(e.opt.availableAbbrevDomains[t].indexOf(s[a])>-1){r=s[a];break}}if(!r&&i){for(var a=i.length-1;a>-1;a--)if(e.opt.availableAbbrevDomains[t].indexOf(i[a])>-1){r=i[a];break}}}return r},FIELD_CATEGORY_REMAP:{title:"title","container-title":"container-title","collection-title":"collection-title",country:"place",number:"number",place:"place",archive:"container-title","title-short":"title",genre:"title",event:"title",medium:"title","archive-place":"place","publisher-place":"place","event-place":"place",jurisdiction:"place","language-name":"place","language-name-original":"place","call-number":"number","chapter-number":"number","collection-number":"number",edition:"number",page:"number",issue:"number",locator:"number","locator-extra":"number","number-of-pages":"number","number-of-volumes":"number",volume:"number","citation-number":"number",publisher:"institution-part"},parseLocator:function(e){if(this.opt.development_extensions.locator_date_and_revision&&e.locator){e.locator=""+e.locator;var t=e.locator.indexOf("|");if(t>-1){var n=e.locator;e.locator=n.slice(0,t),n=n.slice(t+1);var r=n.match(/^([0-9]{4}-[0-9]{2}-[0-9]{2}).*/);r&&(e["locator-date"]=this.fun.dateparser.parseDateToObject(r[1]),n=n.slice(r[1].length)),e["locator-extra"]=n.replace(/^\s+/,"").replace(/\s+$/,"")}}return e.locator&&(e.locator=(""+e.locator).replace(/\s+$/,"")),e},normalizeLocaleStr:function(e){if(e){var t=e.split("-");return t[0]=t[0].toLowerCase(),t[1]&&(t[1]=t[1].toUpperCase()),t.join("-")}},parseNoteFieldHacks:function(e,t,n){if(typeof e.note=="string"){for(var r=[],i=e.note.split(`
`),s=0,a=i.length;s<a;s++){var l=i[s],r=[],o=l.match(m.NOTE_FIELDS_REGEXP);if(o){for(var p=l.split(m.NOTE_FIELDS_REGEXP),f=0,g=p.length-1;f<g;f++)r.push(p[f]),r.push(o[f]);r.push(p[p.length-1]);for(var f=1,g=r.length;f<g&&!(r[f-1].trim()&&(s>0||f>1)&&!r[f-1].match(m.NOTE_FIELD_REGEXP));f+=2)r[f]=`
`+r[f].slice(2,-1).trim()+`
`;i[s]=r.join("")}}i=i.join(`
`).split(`
`);for(var u=0,d={},s=0,a=i.length;s<a;s++){var l=i[s],v=l.match(m.NOTE_FIELD_REGEXP);if(l.trim()){if(!v){if(s===0)continue;u=s;break}}else continue;var h=v[1],S=v[2].replace(/^\s+/,"").replace(/\s+$/,"");if(h==="type")e.type=S,i[s]="";else if(m.DATE_VARIABLES.indexOf(h.replace(/^alt-/,""))>-1)(!e[h]||n)&&(e[h]=m.DateParser.parseDateToArray(S),(!t||t[h]&&this.isDateString(S))&&(i[s]=""));else if(!e[h]){if(m.NAME_VARIABLES.indexOf(h.replace(/^alt-/,""))>-1){d[h]||(d[h]=[]);var c=S.split(/\s*\|\|\s*/);if(c.length===1)d[h].push({literal:c[0]});else if(c.length===2){var _={family:c[0],given:c[1]};m.parseParticles(_),d[h].push(_)}}else e[h]=S;(!t||t[h])&&(i[s]="")}}for(var h in d)e[h]=d[h];if(t){i[u].trim()&&(i[u]=`
`+i[u]);for(var s=u-1;s>-1;s--)i[s].trim()||(i=i.slice(0,s).concat(i.slice(s+1)))}e.note=i.join(`
`).trim()}},checkPrefixSpaceAppend:function(e,s){s||(s="");var n="",r=s.replace(/<[^>]+>/g,"").replace(/["'\u201d\u2019\u00bb\u202f\u00a0 ]+$/g,""),i=r.slice(-1);(r.match(m.ENDSWITH_ROMANESQUE_REGEXP)||m.TERMINAL_PUNCTUATION.slice(0,-1).indexOf(i)>-1||i.match(/[\)\],0-9]/))&&(n=" ");var s=(s+n).replace(/\s+/g," ");return s},checkIgnorePredecessor:function(e,t){var n=!1,r=t.replace(/<[^>]+>/g,"").replace(/["'\u201d\u2019\u00bb\u202f\u00a0 ]+$/g,""),i=r.slice(-1);return m.TERMINAL_PUNCTUATION.slice(0,-1).indexOf(i)>-1&&t.trim().indexOf(" ")>-1?(e.tmp.term_predecessor=!1,!0):!1},checkSuffixSpacePrepend:function(e,t){return t?((t.match(m.STARTSWITH_ROMANESQUE_REGEXP)||["[","("].indexOf(t.slice(0,1))>-1)&&(t=" "+t),t):""},GENDERS:["masculine","feminine"],ERROR_NO_RENDERED_FORM:1,PREVIEW:"Just for laughs.",ASSUME_ALL_ITEMS_REGISTERED:2,START:0,END:1,SINGLETON:2,SEEN:6,SUCCESSOR:3,SUCCESSOR_OF_SUCCESSOR:4,SUPPRESS:5,SINGULAR:0,PLURAL:1,LITERAL:!0,BEFORE:1,AFTER:2,DESCENDING:1,ASCENDING:2,PRIMARY:1,SECONDARY:2,POSITION_FIRST:0,POSITION_SUBSEQUENT:1,POSITION_IBID:2,POSITION_IBID_WITH_LOCATOR:3,POSITION_CONTAINER_SUBSEQUENT:4,POSITION_MAP:{0:0,4:1,1:2,2:3,3:4},POSITION_TEST_VARS:["position","first-reference-note-number","near-note"],AREAS:["citation","citation_sort","bibliography","bibliography_sort","intext"],CITE_FIELDS:["first-reference-note-number","first-container-reference-note-number","locator","locator-extra"],SWAPPING_PUNCTUATION:[".","!","?",":",","],TERMINAL_PUNCTUATION:[":",".",";","!","?"," "],NONE:0,NUMERIC:1,POSITION:2,TRIGRAPH:3,DATE_PARTS:["year","month","day"],DATE_PARTS_ALL:["year","month","day","season"],DATE_PARTS_INTERNAL:["year","month","day","year_end","month_end","day_end"],NAME_PARTS:["non-dropping-particle","family","given","dropping-particle","suffix","literal"],DISAMBIGUATE_OPTIONS:["disambiguate-add-names","disambiguate-add-givenname","disambiguate-add-year-suffix"],GIVENNAME_DISAMBIGUATION_RULES:["all-names","all-names-with-initials","primary-name","primary-name-with-initials","by-cite"],NAME_ATTRIBUTES:["and","delimiter-precedes-last","delimiter-precedes-et-al","initialize-with","initialize","name-as-sort-order","sort-separator","et-al-min","et-al-use-first","et-al-subsequent-min","et-al-subsequent-use-first","form","prefix","suffix","delimiter"],LOOSE:0,STRICT:1,TOLERANT:2,PREFIX_PUNCTUATION:/[.;:]\s*$/,SUFFIX_PUNCTUATION:/^\s*[.;:,\(\)]/,NUMBER_REGEXP:/(?:^\d+|\d+$)/,NAME_INITIAL_REGEXP:/^([A-Z\u0e01-\u0e5b\u00c0-\u017f\u0400-\u042f\u0590-\u05d4\u05d6-\u05ff\u0600-\u06ff\u0370\u0372\u0376\u0386\u0388-\u03ab\u03e2\u03e4\u03e6\u03e8\u03ea\u03ec\u03ee\u03f4\u03f7\u03fd-\u03ff])([a-zA-Z\u0e01-\u0e5b\u00c0-\u017f\u0400-\u052f\u0600-\u06ff\u0370-\u03ff\u1f00-\u1fff]*|)(\.)*/,ROMANESQUE_REGEXP:/[-0-9a-zA-Z\u0e01-\u0e5b\u00c0-\u017f\u0370-\u03ff\u0400-\u052f\u0590-\u05d4\u05d6-\u05ff\u1f00-\u1fff\u0600-\u06ff\u200c\u200d\u200e\u0218\u0219\u021a\u021b\u202a-\u202e]/,ROMANESQUE_NOT_REGEXP:/[^a-zA-Z\u0e01-\u0e5b\u00c0-\u017f\u0370-\u03ff\u0400-\u052f\u0590-\u05d4\u05d6-\u05ff\u1f00-\u1fff\u0600-\u06ff\u200c\u200d\u200e\u0218\u0219\u021a\u021b\u202a-\u202e]/g,STARTSWITH_ROMANESQUE_REGEXP:/^[&a-zA-Z\u0e01-\u0e5b\u00c0-\u017f\u0370-\u03ff\u0400-\u052f\u0590-\u05d4\u05d6-\u05ff\u1f00-\u1fff\u0600-\u06ff\u200c\u200d\u200e\u0218\u0219\u021a\u021b\u202a-\u202e]/,ENDSWITH_ROMANESQUE_REGEXP:/[.;:&a-zA-Z\u0e01-\u0e5b\u00c0-\u017f\u0370-\u03ff\u0400-\u052f\u0590-\u05d4\u05d6-\u05ff\u1f00-\u1fff\u0600-\u06ff\u200c\u200d\u200e\u0218\u0219\u021a\u021b\u202a-\u202e]$/,ALL_ROMANESQUE_REGEXP:/^[a-zA-Z\u0e01-\u0e5b\u00c0-\u017f\u0370-\u03ff\u0400-\u052f\u0590-\u05d4\u05d6-\u05ff\u1f00-\u1fff\u0600-\u06ff\u200c\u200d\u200e\u0218\u0219\u021a\u021b\u202a-\u202e]+$/,VIETNAMESE_SPECIALS:/[\u00c0-\u00c3\u00c8-\u00ca\u00cc\u00cd\u00d2-\u00d5\u00d9\u00da\u00dd\u00e0-\u00e3\u00e8-\u00ea\u00ec\u00ed\u00f2-\u00f5\u00f9\u00fa\u00fd\u0101\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01a0\u01a1\u01af\u01b0\u1ea0-\u1ef9]/,VIETNAMESE_NAMES:/^(?:(?:[.AaBbCcDdEeGgHhIiKkLlMmNnOoPpQqRrSsTtUuVvXxYy \u00c0-\u00c3\u00c8-\u00ca\u00cc\u00cd\u00d2-\u00d5\u00d9\u00da\u00dd\u00e0-\u00e3\u00e8-\u00ea\u00ec\u00ed\u00f2-\u00f5\u00f9\u00fa\u00fd\u0101\u0103\u0110\u0111\u0128\u0129\u0168\u0169\u01a0\u01a1\u01af\u01b0\u1ea0-\u1ef9]{2,6})(\s+|$))+$/,NOTE_FIELDS_REGEXP:/\{:(?:[\-_a-z]+|[A-Z]+):[^\}]+\}/g,NOTE_FIELD_REGEXP:/^([\-_a-z]+|[A-Z]+):\s*([^\}]+)$/,PARTICLE_GIVEN_REGEXP:/^([^ ]+(?:\u02bb |\u2019 | |\' ) *)(.+)$/,PARTICLE_FAMILY_REGEXP:/^([^ ]+(?:\-|\u02bb|\u2019| |\') *)(.+)$/,DISPLAY_CLASSES:["block","left-margin","right-inline","indent"],NAME_VARIABLES:["author","chair","collection-editor","compiler","composer","container-author","contributor","curator","director","editor","editor-translator","editorial-director","executive-producer","guest","host","illustrator","interviewer","narrator","organizer","original-author","performer","producer","recipient","reviewed-author","script-writer","series-creator","translator","commenter"],CREATORS:["author","chair","collection-editor","compiler","composer","container-author","contributor","curator","director","editor","editor-translator","editorial-director","executive-producer","guest","host","illustrator","interviewer","narrator","organizer","original-author","performer","producer","recipient","reviewed-author","script-writer","series-creator","translator","commenter"],NUMERIC_VARIABLES:["call-number","chapter-number","collection-number","division","edition","page","issue","locator","locator-extra","number","number-of-pages","number-of-volumes","part-number","printing-number","section","supplement-number","version","volume","supplement","citation-number"],DATE_VARIABLES:["locator-date","issued","event-date","accessed","original-date","publication-date","available-date","submitted","alt-issued","alt-event"],VARIABLES_WITH_SHORT_FORM:["title","container-title"],TITLE_FIELD_SPLITS:function(e){for(var t=["title","short","main","sub","subjoin"],n={},r=0,i=t.length;r<i;r++)n[t[r]]=e+"title"+(t[r]==="title"?"":"-"+t[r]);return n},demoteNoiseWords:function(e,t,n){var r=e.locale[e.opt.lang].opts["leading-noise-words"];if(t&&n){t=t.split(/\s+/),t.reverse();for(var i=[],s=t.length-1;s>-1&&r.indexOf(t[s].toLowerCase())>-1;s+=-1)i.push(t.pop());t.reverse();var a=t.join(" "),l=i.join(" ");n==="drop"||!l?t=a:n==="demote"&&(t=[a,l].join(", "))}return t},extractTitleAndSubtitle:function(e,t){var n=t?"\u202F":"",r=[""];this.opt.development_extensions.split_container_title&&r.push("container-");for(var i=0,s=r.length;i<s;i++){var a=r[i],l=m.TITLE_FIELD_SPLITS(a),o=[!1];if(e.multi)for(var p in e.multi._keys[l.short])o.push(p);for(var f=0,g=o.length;f<g;f++){var p=o[f],u={};p?(e.multi._keys[l.title]&&(u[l.title]=e.multi._keys[l.title][p]),e.multi._keys[l.short]&&(u[l.short]=e.multi._keys[l.short][p])):(u[l.title]=e[l.title],u[l.short]=e[l.short]),u[l.main]=u[l.title],u[l.sub]=!1;var d=u[l.short];if(u[l.title]){if(d&&d.toLowerCase()===u[l.title].toLowerCase())u[l.main]=u[l.title],u[l.subjoin]="",u[l.sub]="";else if(d){var v=u[l.title].slice(d.replace(/[\?\!]+$/,"").length),h=u[l.title].replace(v.replace(/^[\?\!]+/,""),"").trim(),S=m.TITLE_SPLIT_REGEXP.matchfirst.exec(v);if(S&&h.toLowerCase()===d.toLowerCase())u[l.main]=h,u[l.subjoin]=S[1].replace(/[\?\!]+(\s*)$/,"$1"),u[l.sub]=v.replace(m.TITLE_SPLIT_REGEXP.matchfirst,""),this.opt.development_extensions.force_short_title_casing_alignment&&(u[l.short]=u[l.main]);else{var c=m.TITLE_SPLIT(u[l.title]);c.length==3?(u[l.main]=c[0],u[l.subjoin]=c[1],u[l.sub]=c[2]):(u[l.main]=u[l.title],u[l.subjoin]="",u[l.sub]="")}}else{var c=m.TITLE_SPLIT(u[l.title]);if(c.length==3){if(u[l.main]=c[0],u[l.subjoin]=c[1],u[l.sub]=c[2],this.opt.development_extensions.implicit_short_title&&e.type!=="legal_case"&&!e[l.short]&&!u[l.main].match(/^[\-\.[0-9]+$/)){var _=u[l.subjoin].trim();["?","!"].indexOf(_)===-1&&(_=""),u[l.short]=u[l.main]+_}}else u[l.main]=u[l.title],u[l.subjoin]="",u[l.sub]=""}if(u[l.subjoin]&&u[l.subjoin].match(/([\?\!])/)){var S=u[l.subjoin].match(/(\s*)$/);u[l.main]=u[l.main]+n+u[l.subjoin].trim(),u[l.subjoin]=S[1]}}if(u[l.subjoin]&&(u[l.subjoin].indexOf(":")>-1&&(u[l.subjoin]=n+": "),(u[l.subjoin].indexOf("-")>-1||u[l.subjoin].indexOf("\u2014")>-1)&&(u[l.subjoin]="\u2014")),p)for(var y in u)e.multi._keys[y]||(e.multi._keys[y]={}),e.multi._keys[y][p]=u[y];else for(var y in u)e[y]=u[y]}}},titlecaseSentenceOrNormal:function(e,t,n,r,i){var s=m.TITLE_FIELD_SPLITS(n),a={};if(r&&t.multi?(t.multi._keys[s.title]&&(a[s.title]=t.multi._keys[s.title][r]),t.multi._keys[s.main]&&(a[s.main]=t.multi._keys[s.main][r]),t.multi._keys[s.sub]&&(a[s.sub]=t.multi._keys[s.sub][r]),t.multi._keys[s.subjoin]&&(a[s.subjoin]=t.multi._keys[s.subjoin][r])):(a[s.title]=t[s.title],a[s.main]=t[s.main],a[s.sub]=t[s.sub],a[s.subjoin]=t[s.subjoin]),a[s.main]&&a[s.sub]){var l=a[s.main],o=a[s.subjoin],p=a[s.sub];return i?(l=m.Output.Formatters.sentence(e,l),p=m.Output.Formatters.sentence(e,p)):e.opt.development_extensions.uppercase_subtitles&&(p=m.Output.Formatters["capitalize-first"](e,p)),[l,o,p].join("")}else if(a[s.title]){if(i)return m.Output.Formatters.sentence(e,a[s.title]);if(e.opt.development_extensions.uppercase_subtitles){for(var f=m.TITLE_SPLIT(a[s.title]),g=0,u=f.length;g<u;g+=2)f[g]=m.Output.Formatters["capitalize-first"](e,f[g]);for(var g=1,u=f.length-1;g<u;g+=2){var d=f[g].match(/([:\?\!] )/);if(d){var v=e.opt["default-locale"][0].slice(0,2).toLowerCase()==="fr"?"\u202F":"";f[g]=v+d[1]}(f[g].indexOf("-")>-1||f[g].indexOf("\u2014")>-1)&&(f[g]="\u2014")}return a[s.title]=f.join(""),a[s.title]}else return a[s.title]}else return""},getSafeEscape:function(e){if(["bibliography","citation"].indexOf(e.tmp.area)>-1){var t=[];return e.opt.development_extensions.thin_non_breaking_space_html_hack&&e.opt.mode==="html"&&t.push(function(n){return n.replace(/\u202f/g,'<span style="white-space:nowrap">&thinsp;</span>')}),t.length?function(n){for(var r=0,i=t.length;r<i;r+=1)n=t[r](n);return m.Output.Formats[e.opt.mode].text_escape(n)}:m.Output.Formats[e.opt.mode].text_escape}else return function(n){return n}},SKIP_WORDS:["about","above","across","afore","after","against","al","along","alongside","amid","amidst","among","amongst","anenst","apropos","apud","around","as","aside","astride","at","athwart","atop","barring","before","behind","below","beneath","beside","besides","between","beyond","but","by","circa","despite","down","during","et","except","for","forenenst","from","given","in","inside","into","lest","like","modulo","near","next","notwithstanding","of","off","on","onto","out","over","per","plus","pro","qua","sans","since","than","through"," thru","throughout","thruout","till","to","toward","towards","under","underneath","until","unto","up","upon","versus","vs.","v.","vs","v","via","vis-\xE0-vis","with","within","without","according to","ahead of","apart from","as for","as of","as per","as regards","aside from","back to","because of","close to","due to","except for","far from","inside of","instead of","near to","next to","on to","out from","out of","outside of","prior to","pursuant to","rather than","regardless of","such as","that of","up to","where as","or","yet","so","for","and","nor","a","an","the","de","d'","von","van","c","ca"],FORMAT_KEY_SEQUENCE:["@strip-periods","@font-style","@font-variant","@font-weight","@text-decoration","@vertical-align","@quotes"],INSTITUTION_KEYS:["font-style","font-variant","font-weight","text-decoration","text-case"],SUFFIX_CHARS:"a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z",ROMAN_NUMERALS:[["","i","ii","iii","iv","v","vi","vii","viii","ix"],["","x","xx","xxx","xl","l","lx","lxx","lxxx","xc"],["","c","cc","ccc","cd","d","dc","dcc","dccc","cm"],["","m","mm","mmm","mmmm","mmmmm"]],LANGS:{"af-ZA":"Afrikaans",ar:"Arabic","bg-BG":"Bulgarian","ca-AD":"Catalan","cs-CZ":"Czech","da-DK":"Danish","de-AT":"Austrian","de-CH":"German (CH)","de-DE":"German (DE)","el-GR":"Greek","en-GB":"English (GB)","en-US":"English (US)","es-ES":"Spanish","et-EE":"Estonian",eu:"European","fa-IR":"Persian","fi-FI":"Finnish","fr-CA":"French (CA)","fr-FR":"French (FR)","he-IL":"Hebrew","hr-HR":"Croatian","hu-HU":"Hungarian","is-IS":"Icelandic","it-IT":"Italian","ja-JP":"Japanese","km-KH":"Khmer","ko-KR":"Korean","lt-LT":"Lithuanian","lv-LV":"Latvian","mn-MN":"Mongolian","nb-NO":"Norwegian (Bokm\xE5l)","nl-NL":"Dutch","nn-NO":"Norwegian (Nynorsk)","pl-PL":"Polish","pt-BR":"Portuguese (BR)","pt-PT":"Portuguese (PT)","ro-RO":"Romanian","ru-RU":"Russian","sk-SK":"Slovak","sl-SI":"Slovenian","sr-RS":"Serbian","sv-SE":"Swedish","th-TH":"Thai","tr-TR":"Turkish","uk-UA":"Ukrainian","vi-VN":"Vietnamese","zh-CN":"Chinese (CN)","zh-TW":"Chinese (TW)"},LANG_BASES:{af:"af_ZA",ar:"ar",bg:"bg_BG",ca:"ca_AD",cs:"cs_CZ",da:"da_DK",de:"de_DE",el:"el_GR",en:"en_US",es:"es_ES",et:"et_EE",eu:"eu",fa:"fa_IR",fi:"fi_FI",fr:"fr_FR",he:"he_IL",hr:"hr-HR",hu:"hu_HU",is:"is_IS",it:"it_IT",ja:"ja_JP",km:"km_KH",ko:"ko_KR",lt:"lt_LT",lv:"lv-LV",mn:"mn_MN",nb:"nb_NO",nl:"nl_NL",nn:"nn-NO",pl:"pl_PL",pt:"pt_PT",ro:"ro_RO",ru:"ru_RU",sk:"sk_SK",sl:"sl_SI",sr:"sr_RS",sv:"sv_SE",th:"th_TH",tr:"tr_TR",uk:"uk_UA",vi:"vi_VN",zh:"zh_CN"},SUPERSCRIPTS:{\u00AA:"a","\xB2":"2","\xB3":"3","\xB9":"1",\u00BA:"o",\u02B0:"h",\u02B1:"\u0266",\u02B2:"j",\u02B3:"r",\u02B4:"\u0279",\u02B5:"\u027B",\u02B6:"\u0281",\u02B7:"w",\u02B8:"y",\u02E0:"\u0263",\u02E1:"l",\u02E2:"s",\u02E3:"x",\u02E4:"\u0295","\u1D2C":"A","\u1D2D":"\xC6","\u1D2E":"B","\u1D30":"D","\u1D31":"E","\u1D32":"\u018E","\u1D33":"G","\u1D34":"H","\u1D35":"I","\u1D36":"J","\u1D37":"K","\u1D38":"L","\u1D39":"M","\u1D3A":"N","\u1D3C":"O","\u1D3D":"\u0222","\u1D3E":"P","\u1D3F":"R","\u1D40":"T","\u1D41":"U","\u1D42":"W","\u1D43":"a","\u1D44":"\u0250","\u1D45":"\u0251","\u1D46":"\u1D02","\u1D47":"b","\u1D48":"d","\u1D49":"e","\u1D4A":"\u0259","\u1D4B":"\u025B","\u1D4C":"\u025C","\u1D4D":"g","\u1D4F":"k","\u1D50":"m","\u1D51":"\u014B","\u1D52":"o","\u1D53":"\u0254","\u1D54":"\u1D16","\u1D55":"\u1D17","\u1D56":"p","\u1D57":"t","\u1D58":"u","\u1D59":"\u1D1D","\u1D5A":"\u026F","\u1D5B":"v","\u1D5C":"\u1D25","\u1D5D":"\u03B2","\u1D5E":"\u03B3","\u1D5F":"\u03B4","\u1D60":"\u03C6","\u1D61":"\u03C7","\u2070":"0","\u2071":"i","\u2074":"4","\u2075":"5","\u2076":"6","\u2077":"7","\u2078":"8","\u2079":"9","\u207A":"+","\u207B":"\u2212","\u207C":"=","\u207D":"(","\u207E":")",\u207F:"n","\u2120":"SM","\u2122":"TM","\u3192":"\u4E00","\u3193":"\u4E8C","\u3194":"\u4E09","\u3195":"\u56DB","\u3196":"\u4E0A","\u3197":"\u4E2D","\u3198":"\u4E0B","\u3199":"\u7532","\u319A":"\u4E59","\u319B":"\u4E19","\u319C":"\u4E01","\u319D":"\u5929","\u319E":"\u5730","\u319F":"\u4EBA",\u02C0:"\u0294",\u02C1:"\u0295",\u06E5:"\u0648",\u06E6:"\u064A"},SUPERSCRIPTS_REGEXP:new RegExp("[\xAA\xB2\xB3\xB9\xBA\u02B0\u02B1\u02B2\u02B3\u02B4\u02B5\u02B6\u02B7\u02B8\u02E0\u02E1\u02E2\u02E3\u02E4\u1D2C\u1D2D\u1D2E\u1D30\u1D31\u1D32\u1D33\u1D34\u1D35\u1D36\u1D37\u1D38\u1D39\u1D3A\u1D3C\u1D3D\u1D3E\u1D3F\u1D40\u1D41\u1D42\u1D43\u1D44\u1D45\u1D46\u1D47\u1D48\u1D49\u1D4A\u1D4B\u1D4C\u1D4D\u1D4F\u1D50\u1D51\u1D52\u1D53\u1D54\u1D55\u1D56\u1D57\u1D58\u1D59\u1D5A\u1D5B\u1D5C\u1D5D\u1D5E\u1D5F\u1D60\u1D61\u2070\u2071\u2074\u2075\u2076\u2077\u2078\u2079\u207A\u207B\u207C\u207D\u207E\u207F\u2120\u2122\u3192\u3193\u3194\u3195\u3196\u3197\u3198\u3199\u319A\u319B\u319C\u319D\u319E\u319F\u02C0\u02C1\u06E5\u06E6]","g"),UPDATE_GROUP_CONTEXT_CONDITION:function(e,t,n,r,i){if(e.opt.use_context_condition){var s=e.tmp.group_context.tip;s.condition?(s.condition.termtxt||(s.condition.termtxt=t,s.condition.valueTerm=n),!s.value_seen&&s.condition.test==="comma-safe-numbers-only"&&i&&(s.value_seen=!0,i.match(/^[0-9]/)||(e.tmp.just_did_number=!1))):r&&r.decorations.filter(a=>a[0]==="@vertical-align").length>0||r&&r.strings.suffix?e.tmp.just_did_number=!1:t&&(t.match(/[0-9]$/)?e.tmp.just_did_number=!0:e.tmp.just_did_number=!1)}},EVALUATE_GROUP_CONDITION:function(e,t){if(e.opt.use_context_condition){var n,r=t.condition.test==="comma-safe-numbers-only";if(t.condition.test==="empty-label")n=!t.condition.termtxt;else if(t.condition.test==="empty-label-no-decor")n=!t.condition.termtxt||t.condition.termtxt.indexOf("%s")>-1;else if(["comma-safe","comma-safe-numbers-only"].indexOf(t.condition.test)>-1){var i=t.condition.termtxt,s=!1;t.condition.termtxt&&(s=t.condition.termtxt.slice(0,1).match(m.ALL_ROMANESQUE_REGEXP));var a=e.tmp.just_did_number;a?t.condition.valueTerm?n=!r:i?s?n=!r:["always","after-number"].indexOf(e.opt.require_comma_on_symbol)>-1?n=!0:n=!1:n=!0:t.condition.valueTerm?n=!1:i?s?n=!r:e.opt.require_comma_on_symbol==="always"?n=!0:n=!1:n=!1}if(n)var l=!1;else var l=!0;return t.condition.not&&(l=!l),l}},SYS_OPTIONS:["prioritize_disambiguate_condition","csl_reverse_lookup_support","main_title_from_short_title","uppercase_subtitles","force_short_title_casing_alignment","implicit_short_title","split_container_title"],TITLE_SPLIT_REGEXP:function(){var e=["\\.\\s+","\\!\\s+","\\?\\s+","\\s*::*\\s+","\\s*\u2014\\s*","\\s+\\-\\s+","\\s*\\-\\-\\-*\\s*"];return{match:new RegExp("("+e.join("|")+")","g"),matchfirst:new RegExp("^("+e.join("|")+")"),split:new RegExp("(?:"+e.join("|")+")")}}(),TITLE_SPLIT:function(e){if(!e)return e;for(var t=e.match(m.TITLE_SPLIT_REGEXP.match),n=e.split(m.TITLE_SPLIT_REGEXP.split),r=n.length-2;r>-1;r--)n[r]=n[r].trim(),n[r]&&n[r].slice(-1).toLowerCase()!==n[r].slice(-1)?(n[r]=n[r]+t[r]+n[r+1],n=n.slice(0,r+1).concat(n.slice(r+2))):n=n.slice(0,r+1).concat([t[r]]).concat(n.slice(r+1));return n},GET_COURT_CLASS:function(e,t,n){var r="",i=null,s=t.jurisdiction?t.jurisdiction.split(":")[0]:null,a="court_condition_classes";return n&&(a="court_key_classes"),s&&t.authority&&(typeof t.authority=="string"?i=t.authority:t.authority[0]&&t.authority[0].literal&&(i=t.authority[0].literal)),i&&(this.lang&&e.locale[this.lang].opts[a]&&e.locale[this.lang].opts[a][s]&&e.locale[this.lang].opts[a][s][i]?r=e.locale[this.lang].opts[a][s][i]:e.locale[e.opt["default-locale"][0]].opts[a]&&e.locale[e.opt["default-locale"][0]].opts[a][s]&&e.locale[e.opt["default-locale"][0]].opts[a][s][i]&&(r=e.locale[e.opt["default-locale"][0]].opts[a][s][i])),r},SET_COURT_CLASSES:function(e,t,n,r){for(var i=n.getNodesByName(r,"court-class"),s=0,a=n.numberofnodes(i);s<a;s+=1){var l=i[s],o=n.attributes(l),p=o["@name"],f=o["@country"],g=o["@courts"],u="court_key_classes";if(e.registry&&(u="court_condition_classes"),p&&f&&g){g=g.trim().split(/\s+/),e.locale[t].opts[u]||(e.locale[t].opts[u]={}),e.locale[t].opts[u][f]||(e.locale[t].opts[u][f]={});for(var d=0,v=g.length;d<v;d++)e.locale[t].opts[u][f][g[d]]=p}}},INIT_JURISDICTION_MACROS:function(e,t,n,r){if(t["best-jurisdiction"])return!0;if(!e.sys.retrieveStyleModule||!m.MODULE_MACROS[r]||!t.jurisdiction)return!1;var l=e.getJurisdictionList(t.jurisdiction);if(!e.opt.jurisdictions_seen[l[0]]){var i=e.retrieveAllStyleModules(l);for(var s in i){var a=e.loadStyleModule(s,i[s]);a&&(i[a]||(Object.assign(i,e.retrieveAllStyleModules([a])),e.loadStyleModule(a,i[a],!0)))}}var l=e.getJurisdictionList(t.jurisdiction);e.opt.parallel.enable&&(e.parallel||(e.parallel=new m.Parallel(e)));for(var o=0,p=l.length;o<p;o++){var s=l[o];if(n&&e.juris[s]&&!n["best-jurisdiction"]&&e.juris[s].types.locator&&(t["best-jurisdiction"]=s),e.juris[s]&&e.juris[s].types[t.type])return t["best-jurisdiction"]=s,!0}return!1}};m.XmlJSON=function(e){this.dataObj=e,this.institution={name:"institution",attrs:{"institution-parts":"long",delimiter:", "},children:[{name:"institution-part",attrs:{name:"long"},children:[]}]}};m.XmlJSON.prototype.clean=function(e){return e};m.XmlJSON.prototype.getStyleId=function(e,t){var n="id";t&&(n="title");for(var r="",i=e.children,s=0,a=i.length;s<a;s++)if(i[s].name==="info")for(var l=i[s].children,o=0,p=l.length;o<p;o++)l[o].name===n&&(r=l[o].children[0]);return r};m.XmlJSON.prototype.children=function(e){return e&&e.children.length?e.children.slice():!1};m.XmlJSON.prototype.nodename=function(e){return e?e.name:null};m.XmlJSON.prototype.attributes=function(e){var t={};for(var n in e.attrs)t["@"+n]=e.attrs[n];return t};m.XmlJSON.prototype.content=function(e){var t="";if(!e||!e.children)return t;for(var n=0,r=e.children.length;n<r;n+=1)typeof e.children[n]=="string"&&(t+=e.children[n]);return t};m.XmlJSON.prototype.namespace={};m.XmlJSON.prototype.numberofnodes=function(e){return e&&typeof e.length=="number"?e.length:0};m.XmlJSON.prototype.getAttributeValue=function(e,t,n){var r="";return n&&(t=n+":"+t),e&&e.attrs&&(e.attrs[t]?r=e.attrs[t]:r=""),r};m.XmlJSON.prototype.getNodeValue=function(e,t){var n="";if(t)for(var r=0,i=e.children.length;r<i;r+=1)e.children[r].name===t&&(e.children[r].children.length?n=e.children[r]:n="");else e&&(n=e);return n&&n.children&&n.children.length==1&&typeof n.children[0]=="string"&&(n=n.children[0]),n};m.XmlJSON.prototype.setAttributeOnNodeIdentifiedByNameAttribute=function(e,t,n,r,i){var s,a,l,o,p;r.slice(0,1)==="@"&&(r=r.slice(1));for(var f=0,g=e.children.length;f<g;f+=1)e.children[f].name===t&&e.children[f].attrs.name===n&&(e.children[f].attrs[r]=i)};m.XmlJSON.prototype.deleteNodeByNameAttribute=function(e,t){var n,r;for(n=0,r=e.children.length;n<r;n+=1)!e.children[n]||typeof e.children[n]=="string"||e.children[n].attrs.name==t&&(e.children=e.children.slice(0,n).concat(e.children.slice(n+1)))};m.XmlJSON.prototype.deleteAttribute=function(e,t){var n,r;typeof e.attrs[t]<"u"&&e.attrs.pop(t)};m.XmlJSON.prototype.setAttribute=function(e,t,n){return e.attrs[t]=n,!1};m.XmlJSON.prototype.nodeCopy=function(e,t){if(!t)var t={};if(typeof t=="object"&&typeof t.length>"u")for(var n in e)typeof e[n]=="string"?t[n]=e[n]:typeof e[n]=="object"&&(typeof e[n].length>"u"?t[n]=this.nodeCopy(e[n],{}):t[n]=this.nodeCopy(e[n],[]));else for(var r=0,i=e.length;r<i;r+=1)typeof e[r]=="string"?t[r]=e[r]:t[r]=this.nodeCopy(e[r],{});return t};m.XmlJSON.prototype.getNodesByName=function(e,t,n,r){var i,s,a,l;if(!r)var r=[];if(!e||!e.children)return r;t===e.name&&(n?n===e.attrs.name&&r.push(e):r.push(e));for(var o=0,p=e.children.length;o<p;o+=1)typeof e.children[o]=="object"&&this.getNodesByName(e.children[o],t,n,r);return r};m.XmlJSON.prototype.nodeNameIs=function(e,t){return typeof e>"u"?!1:t==e.name};m.XmlJSON.prototype.makeXml=function(e){return typeof e=="string"&&(e.slice(0,1)==="<"?e=this.jsonStringWalker.walkToObject(e):e=JSON.parse(e)),e};m.XmlJSON.prototype.insertChildNodeAfter=function(e,t,n,r){for(var i=0,s=e.children.length;i<s;i+=1)if(t===e.children[i]){e.children=e.children.slice(0,i).concat([r]).concat(e.children.slice(i+1));break}return e};m.XmlJSON.prototype.insertPublisherAndPlace=function(e){if(e.name==="group"){for(var t=!0,n=["publisher","publisher-place"],r=0,i=e.children.length;r<i;r+=1){var s=n.indexOf(e.children[r].attrs.variable),a=e.children[r].name==="text";if(a&&s>-1&&!e.children[r].attrs.prefix&&!e.children[r].attrs.suffix)n=n.slice(0,s).concat(n.slice(s+1));else{t=!1;break}}t&&!n.length&&(e.attrs["has-publisher-and-publisher-place"]=!0)}for(var r=0,i=e.children.length;r<i;r+=1)typeof e.children[r]=="object"&&this.insertPublisherAndPlace(e.children[r])};m.XmlJSON.prototype.isChildOfSubstitute=function(e){if(e.length>0){var t=e.slice(),n=t.pop();return n==="substitute"?!0:this.isChildOfSubstitute(t)}return!1};m.XmlJSON.prototype.addMissingNameNodes=function(e,t){if(t||(t=[]),e.name==="names"&&!this.isChildOfSubstitute(t)){for(var n=!0,r=0,i=e.children.length;r<i;r++)if(e.children[r].name==="name"){n=!1;break}n&&(e.children=[{name:"name",attrs:{},children:[]}].concat(e.children))}t.push(e.name);for(var r=0,i=e.children.length;r<i;r+=1)typeof e.children[r]=="object"&&this.addMissingNameNodes(e.children[r],t);t.pop()};m.XmlJSON.prototype.addInstitutionNodes=function(e){var t,n,r,i,s,a,l,o,p;if(e.name==="names"){for(var f={},g=-1,u=0,d=e.children.length;u<d;u+=1){if(e.children[u].name=="name"){for(var v in e.children[u].attrs)f[v]=e.children[u].attrs[v];f.delimiter=e.children[u].attrs.delimiter,f.and=e.children[u].attrs.and,g=u;for(var h=0,S=e.children[u].children.length;h<S;h+=1)if(e.children[u].children[h].attrs.name==="family")for(var v in e.children[u].children[h].attrs)f[v]=e.children[u].children[h].attrs[v]}if(e.children[u].name=="institution"){g=-1;break}}if(g>-1){for(var r=this.nodeCopy(this.institution),u=0,d=m.INSTITUTION_KEYS.length;u<d;u+=1){var c=m.INSTITUTION_KEYS[u];typeof f[c]<"u"&&(r.children[0].attrs[c]=f[c]),f.delimiter&&(r.attrs.delimiter=f.delimiter),f.and&&(r.attrs.and=f.and)}e.children=e.children.slice(0,g+1).concat([r]).concat(e.children.slice(g+1))}}for(var u=0,d=e.children.length;u<d;u+=1)typeof e.children[u]!="string"&&this.addInstitutionNodes(e.children[u])};m.XmlJSON.prototype.flagDateMacros=function(e){for(var t=0,n=e.children.length;t<n;t+=1)e.children[t].name==="macro"&&this.inspectDateMacros(e.children[t])&&(e.children[t].attrs["macro-has-date"]="true")};m.XmlJSON.prototype.inspectDateMacros=function(e){if(!e||!e.children)return!1;if(e.name==="date")return!0;for(var t=0,n=e.children.length;t<n;t+=1)if(this.inspectDateMacros(e.children[t]))return!0;return!1};m.stripXmlProcessingInstruction=function(e){return e&&(e=e.replace(/^<\?[^?]+\?>/,""),e=e.replace(/<!--[^>]+-->/g,""),e=e.replace(/^\s+/g,""),e=e.replace(/\s+$/g,""),e)};m.parseXml=function(e){var t=0,n={children:[]},r=[n.children];function i(_){_=_.split(/(?:\r\n|\n|\r)/).join(" ").replace(/>[	 ]+</g,"><").replace(/<\!--.*?-->/g,"");for(var y=_.split("><"),b=null,T=0,O=y.length;T<O;T++)T>0&&(y[T]="<"+y[T]),T<y.length-1&&(y[T]=y[T]+">"),typeof b!="number"&&(y[T].slice(0,7)==="<style "||y[T].slice(0,8)=="<locale ")&&(b=T);y=y.slice(b);for(var T=y.length-2;T>-1;T--)if(y[T].slice(1).indexOf("<")===-1){var L=y[T].slice(0,5);y[T].slice(-2)!=="/>"&&(L==="<term"?y[T+1].slice(0,6)==="</term"&&(y[T]=y[T]+y[T+1],y=y.slice(0,T+1).concat(y.slice(T+2))):["<sing","<mult"].indexOf(L)>-1&&y[T].slice(-2)!=="/>"&&y[T+1].slice(0,1)==="<"&&(y[T]=y[T]+y[T+1],y=y.slice(0,T+1).concat(y.slice(T+2))))}return y}function s(_){return _.split("&amp;").join("&").split("&quot;").join('"').split("&gt;").join(">").split("&lt;").join("<").replace(/&#([0-9]{1,6});/gi,function(y,b){var T=parseInt(b,10);return String.fromCharCode(T)}).replace(/&#x([a-f0-9]{1,6});/gi,function(y,b){var T=parseInt(b,16);return String.fromCharCode(T)})}function a(_){var y=_.match(/([^\'\"=	 ]+)=(?:\"[^\"]*\"|\'[^\']*\')/g);if(y)for(var b=0,T=y.length;b<T;b++)y[b]=y[b].replace(/=.*/,"");return y}function l(_,y){var b=RegExp("^.*[	 ]+"+y+`=("(?:[^"]*)"|'(?:[^']*)').*$`),T=_.match(b);return T?T[1].slice(1,-1):null}function o(_){var y=RegExp("^<([^	 />]+)"),b=_.match(y);return b?b[1]:null}function p(_){var y={};y.name=o(_),y.attrs={};var b=a(_);if(b)for(var T=0,O=b.length;T<O;T++){var L={name:b[T],value:l(_,b[T])};y.attrs[L.name]=s(L.value)}return y.children=[],y}function f(_){var y=_.match(/^.*>([^<]*)<.*$/);return s(y[1])}function g(_){r.slice(-1)[0].push(_)}function u(_){r.push(_.children)}function d(_){var y;if(_.slice(1).indexOf("<")>-1){var b=_.slice(0,_.indexOf(">")+1);y=p(b),y.children=[f(_)],g(y)}else _.slice(-2)==="/>"?(y=p(_),o(_)==="term"&&y.children.push(""),g(y)):_.slice(0,2)==="</"?r.pop():(y=p(_),g(y),u(y))}for(var v=i(e),h=0,S=v.length;h<S;h++){var c=v[h];d(c)}return n.children[0]};m.XmlDOM=function(e){this.dataObj=e,typeof DOMParser>"u"?(DOMParser=function(){},DOMParser.prototype.parseFromString=function(s,a){if(typeof ActiveXObject<"u"){var l=new ActiveXObject("MSXML.DomDocument");return l.async=!1,l.loadXML(s),l}else if(typeof XMLHttpRequest<"u"){var l=new XMLHttpRequest;return a||(a="text/xml"),l.open("GET","data:"+a+";charset=utf-8,"+encodeURIComponent(s),!1),l.overrideMimeType&&l.overrideMimeType(a),l.send(null),l.responseXML}else if(typeof marknote<"u"){var o=new marknote.Parser;return o.parse(s)}},this.hasAttributes=function(s){var a;return s.attributes&&s.attributes.length?a=!0:a=!1,a}):this.hasAttributes=function(s){var a;return s.attributes&&s.attributes.length?a=!0:a=!1,a},this.importNode=function(s,a){var l;return typeof s.importNode>"u"?l=this._importNode(s,a,!0):l=s.importNode(a,!0),l},this._importNode=function(s,a,l){switch(a.nodeType){case 1:var o=s.createElement(a.nodeName);if(a.attributes&&a.attributes.length>0)for(var p=0,f=a.attributes.length;p<f;)o.setAttribute(a.attributes[p].nodeName,a.getAttribute(a.attributes[p++].nodeName));if(l&&a.childNodes&&a.childNodes.length>0)for(var p=0,f=a.childNodes.length;p<f;)o.appendChild(this._importNode(s,a.childNodes[p++],l));return o;case 3:case 4:case 8:}},this.parser=new DOMParser;var t='<docco><institution institution-parts="long" delimiter=", " substitute-use-first="1" use-last="1"><institution-part name="long"/></institution></docco>',n=this.parser.parseFromString(t,"text/xml"),r=n.getElementsByTagName("institution");this.institution=r.item(0);var i=n.getElementsByTagName("institution-part");this.institutionpart=i.item(0),this.ns="http://purl.org/net/xbiblio/csl"};m.XmlDOM.prototype.clean=function(e){return e=e.replace(/<\?[^?]+\?>/g,""),e=e.replace(/<![^>]+>/g,""),e=e.replace(/^\s+/,""),e=e.replace(/\s+$/,""),e=e.replace(/^\n*/,""),e};m.XmlDOM.prototype.getStyleId=function(e,t){var n="",r="id";t&&(r="title");var i=e.getElementsByTagName(r);return i&&i.length&&(i=i.item(0)),i&&(n=i.textContent),n||(n=i.innerText),n||(n=i.innerHTML),n};m.XmlDOM.prototype.children=function(e){var t,n,r,i;if(e){for(i=[],t=e.childNodes,n=0,r=t.length;n<r;n+=1)t[n].nodeName!="#text"&&i.push(t[n]);return i}else return[]};m.XmlDOM.prototype.nodename=function(e){var t=e.nodeName;return t};m.XmlDOM.prototype.attributes=function(e){var t,n,r,i,s,a,l;if(t=new Object,e&&this.hasAttributes(e))for(n=e.attributes,a=0,l=n.length;a<l;a+=1)r=n[a],t["@"+r.name]=r.value;return t};m.XmlDOM.prototype.content=function(e){var t;return typeof e.textContent<"u"?t=e.textContent:typeof e.innerText<"u"?t=e.innerText:t=e.txt,t};m.XmlDOM.prototype.namespace={xml:"http://www.w3.org/XML/1998/namespace"};m.XmlDOM.prototype.numberofnodes=function(e){return e?e.length:0};m.XmlDOM.prototype.getAttributeName=function(e){var t=e.name;return t};m.XmlDOM.prototype.getAttributeValue=function(e,t,n){var r="";return n&&(t=n+":"+t),e&&this.hasAttributes(e)&&e.getAttribute(t)&&(r=e.getAttribute(t)),r};m.XmlDOM.prototype.getNodeValue=function(e,t){var n=null;if(t){var r=e.getElementsByTagName(t);r.length>0&&(typeof r[0].textContent<"u"?n=r[0].textContent:typeof r[0].innerText<"u"?n=r[0].innerText:n=r[0].text)}return n===null&&e&&e.childNodes&&(e.childNodes.length==0||e.childNodes.length==1&&e.firstChild.nodeName=="#text")&&(typeof e.textContent<"u"?n=e.textContent:typeof e.innerText<"u"?n=e.innerText:n=e.text),n===null&&(n=e),n};m.XmlDOM.prototype.setAttributeOnNodeIdentifiedByNameAttribute=function(e,t,n,r,i){var s,a,l,o,p;for(r.slice(0,1)==="@"&&(r=r.slice(1)),o=e.getElementsByTagName(t),s=0,a=o.length;s<a;s+=1)p=o[s],p.getAttribute("name")==n&&p.setAttribute(r,i)};m.XmlDOM.prototype.deleteNodeByNameAttribute=function(e,t){var n,r,i,s;for(s=e.childNodes,n=0,r=s.length;n<r;n+=1)i=s[n],!(!i||i.nodeType==i.TEXT_NODE)&&this.hasAttributes(i)&&i.getAttribute("name")==t&&e.removeChild(s[n])};m.XmlDOM.prototype.deleteAttribute=function(e,t){e.removeAttribute(t)};m.XmlDOM.prototype.setAttribute=function(e,t,n){return e.ownerDocument||(e=e.firstChild),["function","unknown"].indexOf(typeof e.setAttribute)>-1&&e.setAttribute(t,n),!1};m.XmlDOM.prototype.nodeCopy=function(e){var t=e.cloneNode(!0);return t};m.XmlDOM.prototype.getNodesByName=function(e,t,n){var r,i,s,a,l;for(r=[],i=e.getElementsByTagName(t),a=0,l=i.length;a<l;a+=1)s=i.item(a),!(n&&!(this.hasAttributes(s)&&s.getAttribute("name")==n))&&r.push(s);return r};m.XmlDOM.prototype.nodeNameIs=function(e,t){return t==e.nodeName};m.XmlDOM.prototype.makeXml=function(e){var t,n;e||(e="<docco><bogus/></docco>"),e=e.replace(/\s*<\?[^>]*\?>\s*\n*/g,"");var r=this.parser.parseFromString(e,"application/xml");return r.firstChild};m.XmlDOM.prototype.insertChildNodeAfter=function(e,t,n,r){var i,s;return i=this.importNode(t.ownerDocument,r),e.replaceChild(i,t),e};m.XmlDOM.prototype.insertPublisherAndPlace=function(e){for(var t=e.getElementsByTagName("group"),n=0,r=t.length;n<r;n+=1){for(var i=t.item(n),s=[],a=0,l=i.childNodes.length;a<l;a+=1)i.childNodes.item(a).nodeType!==1&&s.push(a);if(i.childNodes.length-s.length===2){for(var o=[],a=0,l=2;a<l;a+=1)if(!(s.indexOf(a)>-1)){for(var p=i.childNodes.item(a),f=[],g=0,u=p.childNodes.length;g<u;g+=1)p.childNodes.item(g).nodeType!==1&&f.push(g);if(p.childNodes.length-f.length===0&&(o.push(p.getAttribute("variable")),p.getAttribute("suffix")||p.getAttribute("prefix"))){o=[];break}}o.indexOf("publisher")>-1&&o.indexOf("publisher-place")>-1&&i.setAttribute("has-publisher-and-publisher-place",!0)}}};m.XmlDOM.prototype.isChildOfSubstitute=function(e){return e.parentNode?e.parentNode.tagName.toLowerCase()==="substitute"?!0:this.isChildOfSubstitute(e.parentNode):!1};m.XmlDOM.prototype.addMissingNameNodes=function(e){for(var t=e.getElementsByTagName("names"),n=0,r=t.length;n<r;n+=1){var i=t.item(n),s=i.getElementsByTagName("name");if((!s||s.length===0)&&!this.isChildOfSubstitute(i)){var a=i.ownerDocument,l=a.createElement("name");i.appendChild(l)}}};m.XmlDOM.prototype.addInstitutionNodes=function(e){var t,n,r,i,s,a,l,o,p,f;for(t=e.getElementsByTagName("names"),p=0,f=t.length;p<f;p+=1)if(n=t.item(p),a=n.getElementsByTagName("name"),a.length!=0&&(r=n.getElementsByTagName("institution"),r.length==0)){i=this.importNode(e.ownerDocument,this.institution),s=i.getElementsByTagName("institution-part").item(0),l=a.item(0),n.insertBefore(i,l.nextSibling);for(var g=0,u=m.INSTITUTION_KEYS.length;g<u;g+=1){var d=m.INSTITUTION_KEYS[g],v=l.getAttribute(d);v&&s.setAttribute(d,v)}for(var h=l.getElementsByTagName("name-part"),g=0,u=h.length;g<u;g+=1)if(h[g].getAttribute("name")==="family")for(var S=0,c=m.INSTITUTION_KEYS.length;S<c;S+=1){var d=m.INSTITUTION_KEYS[S],v=h[g].getAttribute(d);v&&s.setAttribute(d,v)}}};m.XmlDOM.prototype.flagDateMacros=function(e){var t,n,r,i,s=e.getElementsByTagName("macro");for(t=0,n=s.length;t<n;t+=1)r=s.item(t),i=r.getElementsByTagName("date"),i.length&&r.setAttribute("macro-has-date","true")};m.setupXml=function(e){var t={},n=null;return typeof e<"u"?typeof e=="string"?(e=e.replace("^\uFEFF","").replace(/^\s+/,""),e.slice(0,1)==="<"?t=m.parseXml(e):t=JSON.parse(e),n=new m.XmlJSON(t)):typeof e.getAttribute<"u"?n=new m.XmlDOM(e):typeof e.toXMLString<"u"?n=new m.XmlE4X(e):n=new m.XmlJSON(e):m.error("unable to parse XML input"),n||m.error("citeproc-js error: unable to parse CSL style or locale object"),n};m.getSortCompare=function(e){if(m.stringCompare)return m.stringCompare;var t=this,n,r={sensitivity:"base",ignorePunctuation:!0,numeric:!0};e||(e="en-US"),n=function(o,p){return m.toLocaleLowerCase.call(t,o).localeCompare(m.toLocaleLowerCase.call(t,p),e,r)};var i=function(o){return o.replace(/^[\[\]\'\"]*/g,"")},s=function(){return n("[x","x")?function(o,p){return n(i(o),i(p))}:!1},a=s(),l=function(o,p){return a?a(o,p):n(o,p)};return l};m.ambigConfigDiff=function(e,t){var n,r,i,s;if(e.names.length!==t.names.length)return 1;for(n=0,r=e.names.length;n<r;n+=1){if(e.names[n]!==t.names[n])return 1;for(i=0,s=e.givens[n];i<s;i+=1)if(e.givens[n][i]!==t.givens[n][i])return 1}return e.disambiguate!=t.disambiguate||e.year_suffix!==t.year_suffix?1:0};m.cloneAmbigConfig=function(e,t){var n,r,i,s,a,l={};for(l.names=[],l.givens=[],l.year_suffix=!1,l.disambiguate=!1,n=0,r=e.names.length;n<r;n+=1)a=e.names[n],l.names[n]=a;for(n=0,r=e.givens.length;n<r;n+=1){for(a=[],i=0,s=e.givens[n].length;i<s;i+=1)a.push(e.givens[n][i]);l.givens.push(a)}return t?(l.year_suffix=t.year_suffix,l.disambiguate=t.disambiguate):(l.year_suffix=e.year_suffix,l.disambiguate=e.disambiguate),l};m.getAmbigConfig=function(){var e,t;e=this.tmp.disambig_request,e||(e=this.tmp.disambig_settings);var t=m.cloneAmbigConfig(e);return t};m.getMaxVals=function(){return this.tmp.names_max.mystack.slice()};m.getMinVal=function(){return this.tmp["et-al-min"]};m.tokenExec=function(e,t,n){var r,i,s,a;a=!1,r=e.next,i=!1;var l=function(f){return f?(this.tmp.jump.replace("succeed"),e.succeed):(this.tmp.jump.replace("fail"),e.fail)};e.test&&(r=l.call(this,e.test(t,n)));for(var o=0,p=e.execs.length;o<p;o++)s=e.execs[o],i=s.call(e,this,t,n),i&&(r=i);return a&&m.debug(e.name+" ("+e.tokentype+") ---> done"),r};m.expandMacro=function(e,t){var n,r,i,s;n=e.postponed_macro;var a=e.strings.sort_direction;e=new m.Token("group",m.START);var l=!1,o=!1;r=this.cslXml.getNodesByName(this.cslXml.dataObj,"macro",n),r.length&&(o=this.cslXml.getAttributeValue(r[0],"cslid"),l=this.cslXml.getAttributeValue(r[0],"macro-has-date")),l&&(n=n+"@"+this.build.current_default_locale,s=function(g){g.tmp.extension&&(g.tmp["doing-macro-with-date"]=!0)},e.execs.push(s)),this.build.macro_stack.indexOf(n)>-1?m.error('CSL processor error: call to macro "'+n+'" would cause an infinite loop'):this.build.macro_stack.push(n),e.cslid=o,m.MODULE_MACROS[n]&&(e.juris=n,this.opt.update_mode=m.POSITION),m.Node.group.build.call(e,this,t,!0),this.cslXml.getNodeValue(r)||m.error('CSL style error: undefined macro "'+n+'"');var p=m.getMacroTarget.call(this,n);if(p&&(m.buildMacro.call(this,p,r),m.configureMacro.call(this,p)),!this.build.extension){var s=function(u){return function(d,v,h){for(var S=0;S<d.macros[u].length;)S=m.tokenExec.call(d,d.macros[u][S],v,h)}}(n),f=new m.Token("text",m.SINGLETON);f.execs.push(s),t.push(f)}i=new m.Token("group",m.END),i.strings.sort_direction=a,l&&(s=function(g){g.tmp.extension&&(g.tmp["doing-macro-with-date"]=!1)},i.execs.push(s)),e.juris&&(i.juris=n),m.Node.group.build.call(i,this,t,!0),this.build.macro_stack.pop()};m.getMacroTarget=function(e){var t=!1;return this.build.extension?t=this[this.build.root+this.build.extension].tokens:this.macros[e]||(t=[],this.macros[e]=t),t};m.buildMacro=function(e,t){var n=m.makeBuilder(this,e),r;typeof t.length>"u"?r=t:r=t[0],n(r)};m.configureMacro=function(e){this.build.extension||this.configureTokenList(e)};m.XmlToToken=function(e,t,n,r){var i,s,a,l,o,p,f,g;if(i=e.cslXml.nodename(this),!(e.build.skip&&e.build.skip!==i)){if(!i){s=e.cslXml.content(this),s&&(e.build.text=s);return}if(m.Node[e.cslXml.nodename(this)]||m.error('Undefined node name "'+i+'".'),a=[],l=e.cslXml.attributes(this),o=m.setDecorations.call(this,e,l),p=new m.Token(i,t),t!==m.END||i==="if"||i==="else-if"||i==="layout"){for(var f in l)if(l.hasOwnProperty(f)){if(t===m.END&&f!=="@language"&&f!=="@locale")continue;if(l.hasOwnProperty(f))if(m.Attributes[f])try{m.Attributes[f].call(p,e,""+l[f])}catch(d){m.error(f+" attribute: "+d)}else m.debug('warning: undefined attribute "'+f+'" in style')}p.decorations=o,m.DATE_VARIABLES.indexOf(l["@variable"])>-1&&r.push(p.variables)}else t===m.END&&l["@variable"]&&(p.hasVariable=!0,m.DATE_VARIABLES.indexOf(l["@variable"])>-1&&(p.variables=r.pop()));n?g=n:g=e[e.build.area].tokens,m.Node[i].build.call(p,e,g,!0)}};m.DateParser=function(){for(var e=[["\u660E\u6CBB",1867],["\u5927\u6B63",1911],["\u662D\u548C",1925],["\u5E73\u6210",1988]],t={},n=0,r=e.length;n<r;n++){var i=e[n][0],s=e[n][1];t[i]=s}for(var a=[],l={},n=0,r=e.length;n<r;n++){var o=e[n],s=o[0];a.push(s),l[o[0]]=o[1]}var p=a.join("|"),f=new RegExp("(?:"+p+")(?:[0-9]+)"),g=new RegExp("(?:"+p+")(?:[0-9]+)","g"),u=/(\u6708|\u5E74)/g,d=/\u65E5/g,v=/\u301c/g,h="(?:[?0-9]{1,2}%%NUMD%%){0,2}[?0-9]{4}(?![0-9])",S="[?0-9]{4}(?:%%NUMD%%[?0-9]{1,2}){0,2}(?![0-9])",c="[?0-9]{1,3}",_="[%%DATED%%]",y="[?~]",b="[^-/~?0-9]+",T="("+S+"|"+h+"|"+c+"|"+_+"|"+y+"|"+b+")",O=new RegExp(T.replace(/%%NUMD%%/g,"-").replace(/%%DATED%%/g,"-")),L=new RegExp(T.replace(/%%NUMD%%/g,"-").replace(/%%DATED%%/g,"/")),x=new RegExp(T.replace(/%%NUMD%%/g,"/").replace(/%%DATED%%/g,"-")),k="january february march april may june july august september october november december spring summer fall winter spring summer";this.monthStrings=k.split(" "),this.setOrderDayMonth=function(){this.monthGuess=1,this.dayGuess=0},this.setOrderMonthDay=function(){this.monthGuess=0,this.dayGuess=1},this.resetDateParserMonths=function(){this.monthSets=[];for(var N=0,R=this.monthStrings.length;N<R;N++)this.monthSets.push([this.monthStrings[N]]);this.monthAbbrevs=[];for(var N=0,R=this.monthSets.length;N<R;N++){this.monthAbbrevs.push([]);for(var I=0,w=this.monthSets[N].length;I<w;I++)this.monthAbbrevs[N].push(this.monthSets[N][0].slice(0,3))}this.monthRexes=[];for(var N=0,R=this.monthAbbrevs.length;N<R;N++)this.monthRexes.push(new RegExp("(?:"+this.monthAbbrevs[N].join("|")+")"))},this.addDateParserMonths=function(N){if(typeof N=="string"&&(N=N.split(/\s+/)),N.length!==12&&N.length!==16){m.debug("month [+season] list of "+N.length+", expected 12 or 16. Ignoring.");return}for(var R=0,I=N.length;R<I;R++){for(var w=null,A=!1,C=3,j={},U=0,D=this.monthAbbrevs.length;U<D;U++){if(j[U]={},U===R){for(var G=0,B=this.monthAbbrevs[R].length;G<B;G++)if(this.monthAbbrevs[R][G]===N[R].slice(0,this.monthAbbrevs[R][G].length)){A=!0;break}}else for(var G=0,B=this.monthAbbrevs[U].length;G<B;G++)if(w=this.monthAbbrevs[U][G].length,this.monthAbbrevs[U][G]===N[R].slice(0,w)){for(;this.monthSets[U][G].slice(0,w)===N[R].slice(0,w);)if(w>N[R].length||w>this.monthSets[U][G].length){m.debug("unable to disambiguate month string in date parser: "+N[R]);break}else w+=1;C=w,j[U][G]=w}for(var E in j)for(var M in j[E])w=j[E][M],E=parseInt(E,10),M=parseInt(M,10),this.monthAbbrevs[E][M]=this.monthSets[E][M].slice(0,w)}A||(this.monthSets[R].push(N[R]),this.monthAbbrevs[R].push(N[R].slice(0,C)))}this.monthRexes=[],this.monthRexStrs=[];for(var R=0,I=this.monthAbbrevs.length;R<I;R++)this.monthRexes.push(new RegExp("^(?:"+this.monthAbbrevs[R].join("|")+")")),this.monthRexStrs.push("^(?:"+this.monthAbbrevs[R].join("|")+")");if(this.monthAbbrevs.length===18)for(var R=12,I=14;R<I;R++)this.monthRexes[R+4]=new RegExp("^(?:"+this.monthAbbrevs[R].join("|")+")"),this.monthRexStrs[R+4]="^(?:"+this.monthAbbrevs[R].join("|")+")"},this.convertDateObjectToArray=function(N){N["date-parts"]=[],N["date-parts"].push([]);for(var R=0,I,w=0,A=3;w<A&&(I=["year","month","day"][w],!!N[I]);w++)R+=1,N["date-parts"][0].push(N[I]),delete N[I];N["date-parts"].push([]);for(var w=0,A=R;w<A&&(I=["year_end","month_end","day_end"][w],!!N[I]);w++)N["date-parts"][1].push(N[I]),delete N[I];return N["date-parts"][0].length!==N["date-parts"][1].length&&N["date-parts"].pop(),N},this.convertDateObjectToString=function(N){for(var R=[],I=0,w=3;I<w&&N[m.DATE_PARTS_ALL[I]];I+=1)R.push(N[m.DATE_PARTS_ALL[I]]);return R.join("-")},this._parseNumericDate=function(N,R,I,w){I||(I="");for(var A=w.split(R),C=0,j=A.length;C<j;C++)if(A[C].length===4){N["year"+I]=A[C].replace(/^0*/,""),C?A=A.slice(0,C):A=A.slice(1);break}for(var C=0,j=A.length;C<j;C++)A[C]=parseInt(A[C],10);if(A.length===1||A.length===2&&!A[1]){var U=A[0];U&&(N["month"+I]=""+A[0])}else if(A.length===2)if(A[this.monthGuess]>12){var U=A[this.dayGuess],D=A[this.monthGuess];U&&(N["month"+I]=""+U,D&&(N["day"+I]=""+D))}else{var U=A[this.monthGuess],D=A[this.dayGuess];U&&(N["month"+I]=""+U,D&&(N["day"+I]=""+D))}},this.parseDateToObject=function(N){var R=N,I=-1,w=-1,A=!1,C;if(N){if(N=N.replace(/^(.*[0-9])T[0-9].*/,"$1"),N.slice(0,1)==="-"&&(A=!0,N=N.slice(1)),N.match(/^[0-9]{1,3}$/))for(;N.length<4;)N="0"+N;N=""+N,N=N.replace(/\s*[0-9]{2}:[0-9]{2}(?::[0-9]+)/,"");var j=N.match(u);if(j){N=N.replace(/\s+/g,""),N=N.replace(d,""),N=N.replace(u,"-"),N=N.replace(v,"/"),N=N.replace(/\-\//g,"/"),N=N.replace(/-$/g,"");var U=N.split(f);C=[];var D=N.match(g);if(D){for(var G=[],B=0,E=D.length;B<E;B++)G=G.concat(D[B].match(/([^0-9]+)([0-9]+)/).slice(1));for(var B=0,E=U.length;B<E;B++)if(C.push(U[B]),B!==E-1){var M=B*2;C.push(G[M]),C.push(G[M+1])}}else C=U;for(var B=1,E=C.length;B<E;B+=3)C[B+1]=l[C[B]]+parseInt(C[B+1],10),C[B]="";N=C.join(""),N=N.replace(/\s*-\s*$/,"").replace(/\s*-\s*\//,"/"),N=N.replace(/\.\s*$/,""),N=N.replace(/\.(?! )/,""),I=N.indexOf("/"),w=N.indexOf("-")}}N=N.replace(/([A-Za-z])\./g,"$1");var F="",P="",z={},q,H;if(N.slice(0,1)==='"'&&N.slice(-1)==='"')return z.literal=N.slice(1,-1),z;if(I>-1&&w>-1){var V=N.split("/");V.length>3?(q="-",N=N.replace(/\_/g,"-"),H="/",C=N.split(x)):(q="/",N=N.replace(/\_/g,"/"),H="-",C=N.split(L))}else N=N.replace(/\//g,"-"),N=N.replace(/\_/g,"-"),q="-",H="-",C=N.split(O);for(var X=[],B=0,E=C.length;B<E;B++){var j=C[B].match(/^\s*([\-\/]|[^\-\/\~\?0-9]+|[\-~?0-9]+)\s*$/);j&&X.push(j[1])}var K=X.indexOf(q),Q=[],$=!1;K>-1?(Q.push([0,K]),Q.push([K+1,X.length]),$=!0):Q.push([0,X.length]);for(var J="",B=0,E=Q.length;B<E;B++){var ee=Q[B],W=X.slice(ee[0],ee[1]);e:for(var te=0,me=W.length;te<me;te++){var Y=W[te];if(Y.indexOf(H)>-1){this._parseNumericDate(z,H,J,Y);continue}if(Y.match(/[0-9]{4}/)){z["year"+J]=Y.replace(/^0*/,"");continue}(Y==="~"||Y==="?"||Y==="c"||Y.match(/^cir/))&&(z.circa=!0);for(var ne=0,ge=this.monthRexes.length;ne<ge;ne++)if(Y.toLocaleLowerCase().match(this.monthRexes[ne])){z["month"+J]=""+(parseInt(ne,10)+1);continue e}if(Y.match(/^[0-9]+$/)&&(F=Y),Y.toLocaleLowerCase().match(/^bc/)&&F){z["year"+J]=""+F*-1,F="";continue}if(Y.toLocaleLowerCase().match(/^ad/)&&F){z["year"+J]=""+F,F="";continue}if(Y.toLocaleLowerCase().match(/(?:mic|tri|hil|eas)/)&&!z["season"+J]){P=Y;continue}}F&&(z["day"+J]=F,F=""),P&&!z["season"+J]&&(z["season"+J]=P.trim(),P=""),J="_end"}if($)for(var te=0,me=m.DATE_PARTS_ALL.length;te<me;te++){var Z=m.DATE_PARTS_ALL[te];z[Z]&&!z[Z+"_end"]?z[Z+"_end"]=z[Z]:!z[Z]&&z[Z+"_end"]&&(z[Z]=z[Z+"_end"])}(!z.year||z.year&&z.day&&!z.month)&&(z={literal:R});for(var oe=["year","month","day","year_end","month_end","day_end"],B=0,E=oe.length;B<E;B++){var pe=oe[B];typeof z[pe]=="string"&&z[pe].match(/^[0-9]+$/)&&(z[pe]=parseInt(z[pe],10))}return A&&Object.keys(z).indexOf("year")>-1&&(z.year=z.year*-1),z},this.parseDateToArray=function(N){return this.convertDateObjectToArray(this.parseDateToObject(N))},this.parseDateToString=function(N){return this.convertDateObjectToString(this.parseDateToObject(N))},this.parse=function(N){return this.parseDateToObject(N)},this.setOrderMonthDay(),this.resetDateParserMonths()};m.DateParser=new m.DateParser;m.Engine=function(e,t,n,r){var i,s;this.processor_version=m.PROCESSOR_VERSION,this.csl_version="1.0",this.sys=e,typeof Object.assign!="function"&&Object.defineProperty(Object,"assign",{value:function(g){"use strict";if(g==null)throw new TypeError("Cannot convert undefined or null to object");for(var u=Object(g),d=1;d<arguments.length;d++){var v=arguments[d];if(v!=null)for(var h in v)Object.prototype.hasOwnProperty.call(v,h)&&(u[h]=v[h])}return u},writable:!0,configurable:!0}),e.variableWrapper&&(m.VARIABLE_WRAPPER_PREPUNCT_REX=new RegExp("^(["+[" "].concat(m.SWAPPING_PUNCTUATION).join("")+"]*)(.*)")),m.retrieveStyleModule&&(this.sys.retrieveStyleModule=m.retrieveStyleModule),m.getAbbreviation&&(this.sys.getAbbreviation=m.getAbbreviation),this.sys.stringCompare&&(m.stringCompare=this.sys.stringCompare),this.sys.AbbreviationSegments=m.AbbreviationSegments,this.transform=new m.Transform(this),this.setParseNames=function(f){this.opt["parse-names"]=f},this.opt=new m.Engine.Opt,this.tmp=new m.Engine.Tmp,this.build=new m.Engine.Build,this.fun=new m.Engine.Fun(this),this.configure=new m.Engine.Configure,this.citation_sort=new m.Engine.CitationSort,this.bibliography_sort=new m.Engine.BibliographySort,this.citation=new m.Engine.Citation(this),this.bibliography=new m.Engine.Bibliography,this.intext=new m.Engine.InText,this.output=new m.Output.Queue(this),this.dateput=new m.Output.Queue(this),this.cslXml=m.setupXml(t);for(var a in m.SYS_OPTIONS){var l=m.SYS_OPTIONS[a];typeof this.sys[l]=="boolean"&&(this.opt.development_extensions[l]=this.sys[l])}(this.opt.development_extensions.uppercase_subtitles||this.opt.development_extensions.implicit_short_title)&&(this.opt.development_extensions.main_title_from_short_title=!0),this.opt.development_extensions.csl_reverse_lookup_support&&(this.build.cslNodeId=0,this.setCslNodeIds=function(f,g){var u=this.cslXml.children(f);this.cslXml.setAttribute(f,"cslid",this.build.cslNodeId),this.opt.nodenames.push(g),this.build.cslNodeId+=1;for(var d=0,v=this.cslXml.numberofnodes(u);d<v;d+=1)g=this.cslXml.nodename(u[d]),g&&this.setCslNodeIds(u[d],g)},this.setCslNodeIds(this.cslXml.dataObj,"style")),this.cslXml.addMissingNameNodes(this.cslXml.dataObj),this.cslXml.addInstitutionNodes(this.cslXml.dataObj),this.cslXml.insertPublisherAndPlace(this.cslXml.dataObj),this.cslXml.flagDateMacros(this.cslXml.dataObj),i=this.cslXml.attributes(this.cslXml.dataObj),typeof i["@sort-separator"]>"u"&&this.cslXml.setAttribute(this.cslXml.dataObj,"sort-separator",", "),this.opt["initialize-with-hyphen"]=!0,this.setStyleAttributes(),this.opt.xclass=this.cslXml.getAttributeValue(this.cslXml.dataObj,"class"),this.opt.class=this.opt.xclass,this.opt.styleID=this.cslXml.getStyleId(this.cslXml.dataObj),this.opt.styleName=this.cslXml.getStyleId(this.cslXml.dataObj,!0),this.opt.version.slice(0,4)==="1.1m"&&(this.opt.development_extensions.consolidate_legal_items=!0,this.opt.development_extensions.consolidate_container_items=!0,this.opt.development_extensions.main_title_from_short_title=!0,this.opt.development_extensions.expect_and_symbol_form=!0,this.opt.development_extensions.require_explicit_legal_case_title_short=!0,this.opt.development_extensions.force_jurisdiction=!0,this.opt.development_extensions.force_title_abbrev_fallback=!0),n&&(n=n.replace("_","-"),n=m.normalizeLocaleStr(n)),this.opt["default-locale"][0]&&(this.opt["default-locale"][0]=this.opt["default-locale"][0].replace("_","-"),this.opt["default-locale"][0]=m.normalizeLocaleStr(this.opt["default-locale"][0])),n&&r&&(this.opt["default-locale"]=[n]),n&&!r&&this.opt["default-locale"][0]&&(n=this.opt["default-locale"][0]),this.opt["default-locale"].length===0&&(n||(n="en-US"),this.opt["default-locale"].push("en-US")),n||(n=this.opt["default-locale"][0]),s=m.localeResolve(n),this.opt.lang=s.best,this.opt["default-locale"][0]=s.best,this.locale={},this.opt["default-locale-sort"]||(this.opt["default-locale-sort"]=this.opt["default-locale"][0]),"dale|".localeCompare("daleb",this.opt["default-locale-sort"])>-1?this.opt.sort_sep="@":this.opt.sort_sep="|",this.localeConfigure(s);function o(g){var g=g.slice(),u=new RegExp("(?:(?:[?!:]*\\s+|-|^)(?:"+g.join("|")+")(?=[!?:]*\\s+|-|$))","g");return u}this.locale[this.opt.lang].opts["skip-words-regexp"]=o(this.locale[this.opt.lang].opts["skip-words"]),this.output.adjust=new m.Output.Queue.adjust(this.getOpt("punctuation-in-quote")),this.registry=new m.Registry(this),this.macros={},this.build.area="citation";var p=this.cslXml.getNodesByName(this.cslXml.dataObj,this.build.area);this.buildTokenLists(p,this[this.build.area].tokens),this.build.area="bibliography";var p=this.cslXml.getNodesByName(this.cslXml.dataObj,this.build.area);this.buildTokenLists(p,this[this.build.area].tokens),this.build.area="intext";var p=this.cslXml.getNodesByName(this.cslXml.dataObj,this.build.area);this.buildTokenLists(p,this[this.build.area].tokens),this.opt.parallel.enable&&(this.parallel=new m.Parallel(this)),this.juris={},this.configureTokenLists(),this.disambiguate=new m.Disambiguation(this),this.splice_delimiter=!1,this.fun.dateparser=m.DateParser,this.fun.flipflopper=new m.Util.FlipFlopper(this),this.setCloseQuotesArray(),this.fun.ordinalizer.init(this),this.fun.long_ordinalizer.init(this),this.fun.page_mangler=m.Util.PageRangeMangler.getFunction(this,"page"),this.fun.year_mangler=m.Util.PageRangeMangler.getFunction(this,"year"),this.setOutputFormat("html")};m.Engine.prototype.setCloseQuotesArray=function(){var e;e=[],e.push(this.getTerm("close-quote")),e.push(this.getTerm("close-inner-quote")),e.push('"'),e.push("'"),this.opt.close_quotes_array=e};m.makeBuilder=function(e,t){var n=[],r=[];function i(o){r.push(o),m.XmlToToken.call(o,e,m.START,t,n)}function s(){var o=r.pop();m.XmlToToken.call(o,e,m.END,t,n)}function a(o){m.XmlToToken.call(o,e,m.SINGLETON,t,n)}function l(o,p,f){f||(f=[]),o||(o=[]),typeof o.length>"u"&&(o=[o]);for(var g=0;g<o.length;g++){var u=o[g];e.cslXml.nodename(u)!==null&&(p&&e.cslXml.nodename(u)==="date"&&(m.Util.fixDateNode.call(e,p,g,u),u=e.cslXml.children(p)[g]),e.cslXml.numberofnodes(e.cslXml.children(u))?(i(u),l(e.cslXml.children(u),u,f),s()):a(u))}}return l};m.Engine.prototype.buildTokenLists=function(e,t){if(this.cslXml.getNodeValue(e)){var n=m.makeBuilder(this,t),r;typeof e.length>"u"?r=e:r=e[0],n(r)}};m.Engine.prototype.setStyleAttributes=function(){var n,e,t,n={};n.name=this.cslXml.nodename(this.cslXml.dataObj),e=this.cslXml.attributes(this.cslXml.dataObj);for(t in e)e.hasOwnProperty(t)&&m.Attributes[t].call(n,this,e[t])};m.Engine.prototype.getTerm=function(e,t,n,r,i,s){e&&e.match(/[A-Z]/)&&e===e.toUpperCase()&&(m.debug("Warning: term key is in uppercase form: "+e),e=e.toLowerCase());var a;s?a=this.opt["default-locale"][0]:a=this.opt.lang;var l=m.Engine.getField(m.LOOSE,this.locale[a].terms,e,t,n,r);return!l&&e==="range-delimiter"&&(l="\u2013"),typeof l>"u"&&(i===m.STRICT?m.error('Error in getTerm: term "'+e+'" does not exist.'):i===m.TOLERANT&&(l="")),l&&(this.tmp.cite_renders_content=!0),l};m.Engine.prototype.getDate=function(e,t){var n;return t?n=this.opt["default-locale"]:n=this.opt.lang,this.locale[n].dates[e]?this.locale[n].dates[e]:!1};m.Engine.prototype.getOpt=function(e){return typeof this.locale[this.opt.lang].opts[e]<"u"?this.locale[this.opt.lang].opts[e]:!1};m.Engine.prototype.getVariable=function(e,t,n,r){return m.Engine.getField(m.LOOSE,e,t,n,r)};m.Engine.prototype.getDateNum=function(e,t){return typeof e>"u"?0:e[t]};m.Engine.getField=function(e,t,n,r,i,s){var a,l,o,p,f,g;if(a="",typeof t[n]>"u")if(e===m.STRICT)m.error('Error in getField: term "'+n+'" does not exist.');else return;for(s&&t[n][s]?g=t[n][s]:g=t[n],l=[],r==="symbol"?l=["symbol","short"]:r==="verb-short"?l=["verb-short","verb"]:r!=="long"&&(l=[r]),l=l.concat(["long"]),f=l.length,p=0;p<f;p+=1)if(o=l[p],typeof g=="string"||typeof g=="number")a=g;else if(typeof g[o]<"u"){typeof g[o]=="string"||typeof g[o]=="number"?a=g[o]:typeof i=="number"?a=g[o][i]:a=g[o][0];break}return a};m.Engine.prototype.configureTokenLists=function(){var e,t,n;for(n=m.AREAS.length,t=0;t<n;t+=1){e=m.AREAS[t];var r=this[e].tokens;this.configureTokenList(r)}return this.version=m.version,this.state};m.Engine.prototype.configureTokenList=function(e){var t,n,r,i,s,a,l,o;for(t=["year","month","day"],l=e.length-1,s=l;s>-1;s+=-1){if(n=e[s],n.name==="date"&&m.END===n.tokentype&&(r=[]),n.name==="date-part"&&n.strings.name)for(o=t.length,a=0;a<o;a+=1)i=t[a],i===n.strings.name&&r.push(n.strings.name);n.name==="date"&&m.START===n.tokentype&&(r.reverse(),n.dateparts=r),n.next=s+1,n.name&&m.Node[n.name].configure&&m.Node[n.name].configure.call(n,this,s)}};m.Engine.prototype.refetchItems=function(e){for(var t=[],n=0,r=e.length;n<r;n+=1)t.push(this.refetchItem(""+e[n]));return t};m.ITERATION=0;m.Engine.prototype.retrieveItem=function(e){var t,n,r;if(!this.tmp.loadedItemIDs[e])this.tmp.loadedItemIDs[e]=!0;else return this.registry.refhash[e];if(this.opt.development_extensions.normalize_lang_keys_to_lowercase&&typeof this.opt.development_extensions.normalize_lang_keys_to_lowercase=="boolean"){for(var r=0,i=this.opt["default-locale"].length;r<i;r+=1)this.opt["default-locale"][r]=this.opt["default-locale"][r].toLowerCase();for(var r=0,i=this.opt["locale-translit"].length;r<i;r+=1)this.opt["locale-translit"][r]=this.opt["locale-translit"][r].toLowerCase();for(var r=0,i=this.opt["locale-translat"].length;r<i;r+=1)this.opt["locale-translat"][r]=this.opt["locale-translat"][r].toLowerCase();this.opt.development_extensions.normalize_lang_keys_to_lowercase=100}if(m.ITERATION+=1,t=JSON.parse(JSON.stringify(this.sys.retrieveItem(""+e))),this.opt.development_extensions.normalize_lang_keys_to_lowercase){if(t.multi){if(t.multi._keys)for(var s in t.multi._keys)for(var a in t.multi._keys[s])a!==a.toLowerCase()&&(t.multi._keys[s][a.toLowerCase()]=t.multi._keys[s][a],delete t.multi._keys[s][a]);if(t.multi.main)for(var s in t.multi.main)t.multi.main[s]=t.multi.main[s].toLowerCase()}for(var r=0,i=m.NAME_VARIABLES.length;r>i;r+=1){var l=m.NAME_VARIABLES[r];if(t[l]&&t[l].multi)for(var o=0,p=t[l].length;o<p;o+=1){var f=t[l][o];if(f.multi){if(f.multi._key)for(var a in f.multi._key)a!==a.toLowerCase()&&(f.multi._key[a.toLowerCase()]=f.multi._key[a],delete f.multi._key[a]);f.multi.main&&(f.multi.main=f.multi.main.toLowerCase())}}}}if(t.language&&t.language.match(/[><]/)){var n=t.language.match(/(.*?)([<>])(.*)/);n[2]==="<"?(t["language-name"]=n[1],t["language-name-original"]=n[3]):(t["language-name"]=n[3],t["language-name-original"]=n[1]),this.opt.multi_layout?t["language-name-original"]&&(t.language=t["language-name-original"]):t["language-name"]&&(t.language=t["language-name"])}if(t.page){t["page-first"]=t.page;var g=""+t.page,n=g.split(/\s*(?:&|, |-|\u2013)\s*/);n[0].slice(-1)!=="\\"&&(t["page-first"]=n[0])}this.opt.development_extensions.field_hack&&t.note&&m.parseNoteFieldHacks(t,!1,this.opt.development_extensions.allow_field_hack_date_override);for(var a in t)if(m.DATE_VARIABLES.indexOf(a.replace(/^alt-/,""))>-1){var u=t[a];u&&(this.opt.development_extensions.raw_date_parsing&&u.raw&&(!u["date-parts"]||u["date-parts"].length===0)&&(u=this.fun.dateparser.parseDateToObject(u.raw)),t[a]=this.dateParseArray(u))}if(this.opt.development_extensions.consolidate_legal_items&&t.type&&["bill","gazette","legislation","regulation","treaty"].indexOf(t.type)>-1){for(var d,v=["type","title","jurisdiction","genre","volume","container-title"],h=[],r=0,i=v.length;r<i;r+=1)d=v[r],t[d]&&h.push(t[d]);v=["original-date","issued"];for(var r=0,i=v.length;r<i;r+=1)if(d=v[r],t[d]&&t[d].year){var S=t[d].year;h.push(S);break}t.legislation_id=h.join("::")}if(this.bibliography.opt.track_container_items&&this.bibliography.opt.track_container_items.indexOf(t.type)>-1){for(var d,v=["type","container-title","publisher","edition"],c=[],r=0,i=v.length;r<i;r+=1)d=v[r],t[d]&&c.push(t[d]);t.container_id=c.join("::")}if(this.opt.development_extensions.force_jurisdiction&&typeof t.authority=="string"&&(t.authority=[{literal:t.authority,multi:{_key:{}}}],t.multi&&t.multi._keys&&t.multi._keys.authority)){t.authority[0].multi._key={};for(var a in t.multi._keys.authority)t.authority[0].multi._key[a]={literal:t.multi._keys.authority[a]}}if(t["title-short"]||(t["title-short"]=t.shortTitle),this.opt.development_extensions.main_title_from_short_title){var _=this.opt["default-locale"][0].slice(0,2).toLowerCase()==="fr";m.extractTitleAndSubtitle.call(this,t,_)}var y=["bill","legal_case","legislation","gazette","regulation"].indexOf(t.type)>-1;this.opt.development_extensions.force_jurisdiction&&y&&(t.jurisdiction||(t.jurisdiction="us"));var b;if(!y&&t.title&&this.sys.getAbbreviation){var T=!1;t.jurisdiction||(T=!0),this.sys.normalizeAbbrevsKey?b=this.sys.normalizeAbbrevsKey("title",t.title):b=t.title;var O=this.transform.loadAbbreviation(t.jurisdiction,"title",b,t.language);this.transform.abbrevs[O].title&&this.transform.abbrevs[O].title[b]&&(t["title-short"]=this.transform.abbrevs[O].title[b])}if(t["container-title-short"]||(t["container-title-short"]=t.journalAbbreviation),t["container-title"]&&this.sys.getAbbreviation){this.sys.normalizeAbbrevsKey?b=this.sys.normalizeAbbrevsKey(t["container-title"]):b=t["container-title"];var O=this.transform.loadAbbreviation(t.jurisdiction,"container-title",b,t.language);this.transform.abbrevs[O]["container-title"]&&this.transform.abbrevs[O]["container-title"][b]&&(t["container-title-short"]=this.transform.abbrevs[O]["container-title"][b])}if(t.jurisdiction&&(t.country=t.jurisdiction.split(":")[0]),this.registry.refhash[e]){if(JSON.stringify(this.registry.refhash[e])!=JSON.stringify(t)){for(var a in this.registry.refhash[e])delete this.registry.refhash[e][a];this.tmp.taintedItemIDs[t.id]=!0,Object.assign(this.registry.refhash[e],t)}}else this.registry.refhash[e]=t;return this.registry.refhash[e]};m.Engine.prototype.refetchItem=function(e){return this.registry.refhash[e]};m.Engine.prototype.setOpt=function(e,t,n){e.name==="style"||e.name==="cslstyle"?(this.opt.inheritedAttributes[t]=n,this.citation.opt.inheritedAttributes[t]=n,this.bibliography.opt.inheritedAttributes[t]=n):["citation","bibliography"].indexOf(e.name)>-1?this[e.name].opt.inheritedAttributes[t]=n:e.strings[t]=n};m.Engine.prototype.inheritOpt=function(e,t,n,r){if(typeof e.strings[t]<"u")return e.strings[t];var i=this[this.tmp.root].opt.inheritedAttributes[n||t];return typeof i<"u"?i:r};m.Engine.prototype.remapSectionVariable=function(e){for(var t=0,n=e.length;t<n;t+=1){var r=e[t][0],i=e[t][1];if(["bill","gazette","legislation","regulation","treaty"].indexOf(r.type)>-1){if(i.locator){i.locator=i.locator.trim();var s=i.locator.match(m.STATUTE_SUBDIV_PLAIN_REGEX_FRONT);s||(i.label?i.locator=m.STATUTE_SUBDIV_STRINGS_REVERSE[i.label]+" "+i.locator:i.locator="p. "+i.locator)}var a=null;if(r.section){r.section=r.section.trim();var s=r.section.match(m.STATUTE_SUBDIV_PLAIN_REGEX_FRONT);s?a=s[0].trim():(r.section="sec. "+r.section,a="sec.")}if(r.section)if(!i.locator)i.locator=r.section;else{var s=i.locator.match(/^([^ ]*)\s*(.*)/),l=" ";s?(s[1]==="p."&&a!=="p."&&(i.locator=s[2]),["[","(",".",",",";",":","?"].indexOf(i.locator.slice(0,1))>-1&&(l="")):l="",i.locator=r.section+l+i.locator}i.label=""}}};m.Engine.prototype.setNumberLabels=function(e){if(e.number&&["bill","gazette","legislation","regulation","treaty"].indexOf(e.type)>-1&&this.opt.development_extensions.consolidate_legal_items&&!this.tmp.shadow_numbers.number){this.tmp.shadow_numbers.number={},this.tmp.shadow_numbers.number.values=[],this.tmp.shadow_numbers.number.plural=0,this.tmp.shadow_numbers.number.numeric=!1,this.tmp.shadow_numbers.number.label=!1;var t=""+e.number;t=t.split("\\").join("");var n=t.split(/\s+/)[0],r=m.STATUTE_SUBDIV_STRINGS[n];if(r){var i=t.split(m.STATUTE_SUBDIV_PLAIN_REGEX);if(i.length>1){for(var s=[],a=1,l=i.length;a<l;a+=1)s.push(i[a].replace(/\s*$/,"").replace(/^\s*/,""));t=s.join(" ")}else t=i[0];this.tmp.shadow_numbers.number.label=r,this.tmp.shadow_numbers.number.values.push(["Blob",t,!1]),this.tmp.shadow_numbers.number.numeric=!1}else this.tmp.shadow_numbers.number.values.push(["Blob",t,!1]),this.tmp.shadow_numbers.number.numeric=!0}};m.substituteOne=function(e){return function(t,n){return n?e.replace("%%STRING%%",n):""}};m.substituteTwo=function(e){return function(t){var n=e.replace("%%PARAM%%",t);return function(r,i){return i?n.replace("%%STRING%%",i):""}}};m.Mode=function(e){var t,n,r,i,s,a;t={},n=m.Output.Formats[e];for(r in n){if(r.slice(0,1)!=="@"){t[r]=n[r];continue}i=!1,s=n[r],a=r.split("/"),typeof s=="string"&&s.indexOf("%%STRING%%")>-1?s.indexOf("%%PARAM%%")>-1?i=m.substituteTwo(s):i=m.substituteOne(s):typeof s=="boolean"&&!s?i=m.Output.Formatters.passthrough:typeof s=="function"?i=s:m.error("Bad "+e+" config entry for "+r+": "+s),a.length===1?t[a[0]]=i:a.length===2&&(t[a[0]]||(t[a[0]]={}),t[a[0]][a[1]]=i)}return t};m.setDecorations=function(e,t){var n,r,i;n=[];for(i in m.FORMAT_KEY_SEQUENCE){var r=m.FORMAT_KEY_SEQUENCE[i];t[r]&&(n.push([r,t[r]]),delete t[r])}return n};m.Doppeler=function(e,t){var n=new RegExp("("+e+")","g"),r=new RegExp(e,"g");this.split=function(i){t&&(i=t(i));var s=i.match(n);if(!s)return{tags:[],strings:[i]};for(var a=i.split(r),l=s.length-1;l>-1;l--){typeof s[l]=="number"&&(s[l]="");var o=s[l];o==="'"&&a[l+1].length>0&&(a[l+1]=s[l]+a[l+1],s[l]="")}return{tags:s,strings:a,origStrings:a.slice()}},this.join=function(i){for(var s=i.strings.slice(-1),a=i.tags.length-1;a>-1;a--)s.push(i.tags[a]),s.push(i.strings[a]);return s.reverse(),s.join("")}};m.Engine.prototype.normalDecorIsOrphan=function(e,t){if(t[1]==="normal"){var n=!1,r;this.tmp.area==="citation"?r=[this.citation.opt.layout_decorations].concat(e.alldecor):r=e.alldecor;for(var i=r.length-1;i>-1;i+=-1)for(var s=r[i].length-1;s>-1;s+=-1)r[i][s][0]===t[0]&&r[i][s][1]!=="normal"&&(n=!0);if(!n)return!0}return!1};m.Engine.prototype.getCitationLabel=function(e){var t="",n=this.getTrigraphParams(),r=n[0],i=this.getTerm("reference","short",0);typeof i>"u"&&(i="reference"),i=i.replace(".",""),i=i.slice(0,1).toUpperCase()+i.slice(1);for(var s=0,a=m.NAME_VARIABLES.length;s<a;s+=1){var l=m.NAME_VARIABLES[s];if(e[l]){var o=e[l];o.length>n.length?r=n[n.length-1]:r=n[o.length-1];for(var p=0,f=o.length;p<f&&p!==r.authors.length;p+=1){var g=this.nameOutput.getName(o[p],"locale-translit",!0),u=g.name;u&&u.family?(i=u.family,i=i.replace(/^([ \'\u2019a-z]+\s+)/,"")):u&&u.literal&&(i=u.literal);var d=i.toLowerCase().match(/^(a\s+|the\s+|an\s+)/);if(d&&(i=i.slice(d[1].length)),i=i.replace(m.ROMANESQUE_NOT_REGEXP,""),!i)break;i=i.slice(0,r.authors[p]),i.length>1?i=i.slice(0,1).toUpperCase()+i.slice(1).toLowerCase():i.length===1&&(i=i.toUpperCase()),t+=i}break}}if(!t&&e.title){for(var v=this.locale[this.opt.lang].opts["skip-words"],h=e.title.split(/\s+/),s=h.length-1;s>-1;s--)v.indexOf(h[s])>-1&&(h=h.slice(0,s).concat(h.slice(s+1)));var S=h.join("");S=S.slice(0,n[0].authors[0]),S.length>1?S=S.slice(0,1).toUpperCase()+S.slice(1).toLowerCase():S.length===1&&(S=S.toUpperCase()),t=S}var c="0000";return e.issued&&e.issued.year&&(c=""+e.issued.year),c=c.slice(r.year*-1),t=t+c,t};m.Engine.prototype.getTrigraphParams=function(){var e=[],t=this.opt.trigraph.split(":");(!this.opt.trigraph||this.opt.trigraph.slice(0,1)!=="A")&&m.error("Bad trigraph definition: "+this.opt.trigraph);for(var n=0,r=t.length;n<r;n+=1){for(var i=t[n],s={authors:[],year:0},a=0,l=i.length;a<l;a+=1)switch(i.slice(a,a+1)){case"A":s.authors.push(1);break;case"a":s.authors[s.authors.length-1]+=1;break;case"0":s.year+=1;break;default:m.error("Invalid character in trigraph definition: "+this.opt.trigraph)}e.push(s)}return e};m.Engine.prototype.setOutputFormat=function(e){this.opt.mode=e,this.fun.decorate=m.Mode(e),this.output[e]||(this.output[e]={},this.output[e].tmp={})};m.Engine.prototype.getSortFunc=function(){return function(e,t){return e=e.split("-"),t=t.split("-"),e.length<t.length?1:e.length>t.length?-1:(e=e.slice(-1)[0],t=t.slice(-1)[0],e.length<t.length?1:e.length>t.length?-1:0)}};m.Engine.prototype.setLangTagsForCslSort=function(e){var t,n;if(e)for(this.opt["locale-sort"]=[],t=0,n=e.length;t<n;t+=1)this.opt["locale-sort"].push(e[t]);this.opt["locale-sort"].sort(this.getSortFunc())};m.Engine.prototype.setLangTagsForCslTransliteration=function(e){var t,n;if(this.opt["locale-translit"]=[],e)for(t=0,n=e.length;t<n;t+=1)this.opt["locale-translit"].push(e[t]);this.opt["locale-translit"].sort(this.getSortFunc())};m.Engine.prototype.setLangTagsForCslTranslation=function(e){var t,n;if(this.opt["locale-translat"]=[],e)for(t=0,n=e.length;t<n;t+=1)this.opt["locale-translat"].push(e[t]);this.opt["locale-translat"].sort(this.getSortFunc())};m.Engine.prototype.setLangPrefsForCites=function(e,t){var n=this.opt["cite-lang-prefs"];t||(t=function(d){return d.toLowerCase()});for(var r=["Persons","Institutions","Titles","Journals","Publishers","Places"],i=0,s=r.length;i<s;i+=1){var a=t(r[i]),l=r[i].toLowerCase();if(e[a]){for(var o=[];e[a].length>1;)o.push(e[a].pop());var p={orig:1,translit:2,translat:3};for(o.length===2&&p[o[0]]<p[o[1]]&&o.reverse();o.length;)e[a].push(o.pop());for(var f=n[l];f.length;)f.pop();for(var g=0,u=e[a].length;g<u;g+=1)f.push(e[a][g])}}};m.Engine.prototype.setLangPrefsForCiteAffixes=function(e){if(e&&e.length===48){for(var t=this.opt.citeAffixes,n=0,r=["persons","institutions","titles","journals","publishers","places"],i=["translit","orig","translit","translat"],s,a=0,l=r.length;a<l;a+=1)for(var o=0,p=i.length;o<p;o+=1)s="",n%8===4?!t[r[a]]["locale-"+i[o]].prefix&&!t[r[a]]["locale-"+i[o]].suffix&&(s=e[n]?e[n]:"",t[r[a]]["locale-"+i[o]].prefix=s,s=e[n]?e[n+1]:"",t[r[a]]["locale-"+i[o]].suffix=s):(s=e[n]?e[n]:"",t[r[a]]["locale-"+i[o]].prefix=s,s=e[n]?e[n+1]:"",t[r[a]]["locale-"+i[o]].suffix=s),n+=2;this.opt.citeAffixes=t}};m.Engine.prototype.setAutoVietnameseNamesOption=function(e){e?this.opt["auto-vietnamese-names"]=!0:this.opt["auto-vietnamese-names"]=!1};m.Engine.prototype.setAbbreviations=function(e){this.sys.setAbbreviations&&this.sys.setAbbreviations(e)};m.Engine.prototype.setSuppressTrailingPunctuation=function(e){this.citation.opt.suppressTrailingPunctuation=!!e};m.Output={};m.Output.Queue=function(e){this.levelname=["top"],this.state=e,this.queue=[],this.empty=new m.Token("empty");var t={};t.empty=this.empty,this.formats=new m.Stack(t),this.current=new m.Stack(this.queue)};m.Output.Queue.prototype.pop=function(){var e=this.current.value();return e.length?e.pop():e.blobs.pop()};m.Output.Queue.prototype.getToken=function(e){var t=this.formats.value()[e];return t};m.Output.Queue.prototype.mergeTokenStrings=function(e,t){var n,r,i,s;if(n=this.formats.value()[e],r=this.formats.value()[t],i=n,r){n||(n=new m.Token(e,m.SINGLETON),n.decorations=[]),i=new m.Token(e,m.SINGLETON);var s="";for(var s in n.strings)n.strings.hasOwnProperty(s)&&(i.strings[s]=n.strings[s]);for(var s in r.strings)r.strings.hasOwnProperty(s)&&(i.strings[s]=r.strings[s]);i.decorations=n.decorations.concat(r.decorations)}return i};m.Output.Queue.prototype.addToken=function(e,t,n){var r,i;if(r=new m.Token("output"),typeof n=="string"&&(n=this.formats.value()[n]),n&&n.strings){for(i in n.strings)n.strings.hasOwnProperty(i)&&(r.strings[i]=n.strings[i]);r.decorations=n.decorations}typeof t=="string"&&(r.strings.delimiter=t),this.formats.value()[e]=r};m.Output.Queue.prototype.pushFormats=function(e){e||(e={}),e.empty=this.empty,this.formats.push(e)};m.Output.Queue.prototype.popFormats=function(){this.formats.pop()};m.Output.Queue.prototype.startTag=function(e,t){var n={};this.state.tmp["doing-macro-with-date"]&&this.state.tmp.extension&&(t=this.empty,e="empty"),n[e]=t,this.pushFormats(n),this.openLevel(e)};m.Output.Queue.prototype.endTag=function(e){this.closeLevel(e),this.popFormats()};m.Output.Queue.prototype.openLevel=function(e){var t,n;typeof e=="object"?t=new m.Blob(void 0,e):typeof e>"u"?t=new m.Blob(void 0,this.formats.value().empty,"empty"):((!this.formats.value()||!this.formats.value()[e])&&m.error('CSL processor error: call to nonexistent format token "'+e+'"'),t=new m.Blob(void 0,this.formats.value()[e],e)),n=this.current.value(),!this.state.tmp.just_looking&&this.checkNestedBrace&&(t.strings.prefix=this.checkNestedBrace.update(t.strings.prefix)),n.push(t),this.current.push(t)};m.Output.Queue.prototype.closeLevel=function(e){e&&e!==this.current.value().levelname&&m.error("Level mismatch error:  wanted "+e+" but found "+this.current.value().levelname);var t=this.current.pop();!this.state.tmp.just_looking&&this.checkNestedBrace&&(t.strings.suffix=this.checkNestedBrace.update(t.strings.suffix))};m.Output.Queue.prototype.append=function(e,t,n,r,i){var s,a,l,o=!0;if(n&&(r=!0),this.state.tmp["doing-macro-with-date"]&&!n){if(t!=="macro-with-date")return!1;t==="macro-with-date"&&(t="empty")}if(typeof e>"u"||(typeof e=="number"&&(e=""+e),!n&&this.state.tmp.element_trace&&this.state.tmp.element_trace.value()==="suppress-me"))return!1;if(a=!1,t?t==="literal"?(s=!0,o=!1):typeof t=="string"?s=this.formats.value()[t]:s=t:s=this.formats.value().empty,s||m.error("CSL processor error: unknown format token name: "+t),s.strings&&typeof s.strings.delimiter>"u"&&(s.strings.delimiter=""),typeof e=="string"&&e.length&&(e=e.replace(/ ([:;?!\u00bb])/g,"\u202F$1").replace(/\u00ab /g,"\xAB\u202F"),this.last_char_rendered=e.slice(-1),e=e.replace(/\s+'/g," '"),n||(e=e.replace(/^'/g," '")),r?n&&(this.state.tmp.term_predecessor_name=!0):(this.state.tmp.term_predecessor=!0,this.state.tmp.in_cite_predecessor=!0)),a=new m.Blob(e,s),l=this.current.value(),typeof l>"u"&&this.current.mystack.length===0&&(this.current.mystack.push([]),l=this.current.value()),typeof a.blobs=="string"&&(r?n&&(this.state.tmp.term_predecessor_name=!0):(this.state.tmp.term_predecessor=!0,this.state.tmp.in_cite_predecessor=!0)),typeof e=="string"){if(typeof a.blobs=="string"&&a.blobs.slice(0,1)!==" "){for(var p="",f=a.blobs;m.TERMINAL_PUNCTUATION.indexOf(f.slice(0,1))>-1;)p=p+f.slice(0,1),f=f.slice(1);f&&p&&(a.strings.prefix=a.strings.prefix+p,a.blobs=f)}a.strings["text-case"]&&(a.blobs=m.Output.Formatters[a.strings["text-case"]](this.state,e)),this.state.tmp.strip_periods&&!i&&(a.blobs=a.blobs.replace(/\.([^a-z]|$)/g,"$1"));for(var g=a.decorations.length-1;g>-1;g+=-1)a.decorations[g][0]==="@quotes"&&a.decorations[g][1]!=="false"&&(a.punctuation_in_quote=this.state.getOpt("punctuation-in-quote")),a.blobs.match(m.ROMANESQUE_REGEXP)||a.decorations[g][0]==="@font-style"&&(a.decorations=a.decorations.slice(0,g).concat(a.decorations.slice(g+1)));l.push(a),this.state.fun.flipflopper.processTags(a)}else o?l.push(a):l.push(e);return!0};m.Output.Queue.prototype.string=function(e,t,n){var r,i,s,a,l,o=m.getSafeEscape(this.state),p=t.slice(),f=[];if(p.length===0)return f;var g="";n?g=n.strings.delimiter:(e.tmp.count_offset_characters=!1,e.tmp.offset_characters=0),n&&n.new_locale&&(n.old_locale=e.opt.lang,e.opt.lang=n.new_locale);for(var u,d,v,h,r=0,i=p.length;r<i;r+=1){if(u=p[r],u.strings.first_blob&&(e.tmp.count_offset_characters=u.strings.first_blob),typeof u.blobs=="string"){if(typeof u.num=="number")f.push(u);else if(u.blobs){u.particle&&(u.blobs=u.particle+u.blobs,u.particle=""),l=o(u.blobs);var S=l.length;if(!e.tmp.suppress_decorations)for(s=0,a=u.decorations.length;s<a;s+=1)h=u.decorations[s],h[0]!=="@showid"&&(e.normalDecorIsOrphan(u,h)||(l=e.fun.decorate[h[0]][h[1]].call(u,e,l,h[2])));if(l&&l.length){if(l=o(u.strings.prefix)+l+o(u.strings.suffix),e.opt.development_extensions.csl_reverse_lookup_support&&!e.tmp.suppress_decorations)for(s=0,a=u.decorations.length;s<a;s+=1)h=u.decorations[s],h[0]==="@showid"&&(l=e.fun.decorate[h[0]][h[1]].call(u,e,l,h[2]));f.push(l),e.tmp.count_offset_characters&&(e.tmp.offset_characters+=S+u.strings.suffix.length+u.strings.prefix.length)}}}else if(u.blobs.length){var c=e.output.string(e,u.blobs,u);if(n&&c!=="string"&&c.length>1&&u.strings.delimiter)for(var _=!1,s=0,a=c.length;s<a;s++)typeof c[s]!="string"?_=!0:_&&(c[s]=u.strings.delimiter+c[s]);f=f.concat(c)}u.strings.first_blob&&e.registry.registry[u.strings.first_blob]&&(e.registry.registry[u.strings.first_blob].offset=e.tmp.offset_characters,e.tmp.count_offset_characters=!1)}for(r=0,i=f.length-1;r<i;r+=1)typeof f[r].num=="number"&&typeof f[r+1].num=="number"&&!f[r+1].UGLY_DELIMITER_SUPPRESS_HACK&&(f[r].strings.suffix=f[r].strings.suffix+(g||""),f[r+1].successor_prefix="",f[r+1].UGLY_DELIMITER_SUPPRESS_HACK=!0);for(var y=0,r=0,i=f.length;r<i;r+=1)typeof f[r]=="string"&&(y=parseInt(r,10)+1,r<f.length-1&&typeof f[r+1]=="object"&&(g&&!f[r+1].UGLY_DELIMITER_SUPPRESS_HACK&&(f[r]+=o(g)),f[r+1].UGLY_DELIMITER_SUPPRESS_HACK=!0));if(n&&(n.decorations.length||n.strings.suffix))y=f.length;else if(n&&n.strings.prefix){for(var r=0,i=f.length;r<i;r++)if(typeof f[r].num<"u"){y=r,r===0&&(f[r].strings.prefix=n.strings.prefix+f[r].strings.prefix);break}}var b=e.output.renderBlobs(f.slice(0,y),g,!1,n);if(b&&n&&(n.decorations.length||n.strings.suffix||n.strings.prefix)){if(!e.tmp.suppress_decorations)for(var r=0,i=n.decorations.length;r<i;r+=1)h=n.decorations[r],!(["@cite","@bibliography","@display","@showid"].indexOf(h[0])>-1)&&(e.normalDecorIsOrphan(u,h)||h[0]&&typeof b=="string"&&(b=e.fun.decorate[h[0]][h[1]].call(n,e,b,h[2])));if(l=b,d=n.strings.suffix,l&&l.length&&(v=n.strings.prefix,l=o(v)+l+o(d),e.tmp.count_offset_characters&&(e.tmp.offset_characters+=v.length+d.length)),b=l,!e.tmp.suppress_decorations)for(var r=0,i=n.decorations.length;r<i;r+=1)h=n.decorations[r],["@cite","@bibliography","@display","@showid"].indexOf(h[0])!==-1&&typeof b=="string"&&(b=e.fun.decorate[h[0]][h[1]].call(n,e,b,h[2]))}var T=f.slice(y,f.length);return!T.length&&b?f=[b]:T.length&&!b?f=T:b&&T.length&&(f=[b].concat(T)),typeof n>"u"?(this.queue=[],this.current.mystack=[],this.current.mystack.push(this.queue),e.tmp.suppress_decorations&&(f=e.output.renderBlobs(f,void 0,!1))):typeof n=="boolean"&&(f=e.output.renderBlobs(f,void 0,!0)),n&&n.new_locale&&(e.opt.lang=n.old_locale),f};m.Output.Queue.prototype.clearlevel=function(){var e,t,n;for(e=this.current.value(),n=e.blobs.length,t=0;t<n;t+=1)e.blobs.pop()};m.Output.Queue.prototype.renderBlobs=function(e,t,n,r){var i,s,a,l,o,p,f,g,u,d,v,h;if(h=m.getSafeEscape(this.state),t||(t=""),i=this.state,s="",a=[],l="",f=e.length,this.state.tmp.area==="citation"&&!this.state.tmp.just_looking&&f===1&&typeof e[0]=="object"&&r)return e[0].strings.prefix=r.strings.prefix+e[0].strings.prefix,e[0].strings.suffix=e[0].strings.suffix+r.strings.suffix,e[0].decorations=e[0].decorations.concat(r.decorations),e[0].params=r.params,e[0];var S=!0;for(p=0;p<f;p+=1)e[p].checkNext?(e[p].checkNext(e[p+1],S),S=!1):e[p+1]&&e[p+1].splice_prefix?S=!1:S=!0;var c=!0;for(p=e.length-1;p>0;p+=-1)e[p].checkLast?c&&e[p].checkLast(e[p-1])&&(c=!1):c=!0;for(f=e.length,p=0;p<f;p+=1)if(o=e[p],s&&(l=t),typeof o=="string")s+=h(l),s+=o,i.tmp.count_offset_characters&&(i.tmp.offset_characters+=l.length);else if(n)s?s=[s,o]:s=[o];else if(o.status!==m.SUPPRESS){o.particle?d=o.particle+o.num:d=o.formatter.format(o.num,o.gender);var _=d.replace(/<[^>]*>/g,"").length;this.append(d,"empty",!0);var y=this.pop(),b=i.tmp.count_offset_characters;if(d=this.string(i,[y],!1),i.tmp.count_offset_characters=b,o.strings["text-case"]&&(d=m.Output.Formatters[o.strings["text-case"]](this.state,d)),d&&this.state.tmp.strip_periods&&(d=d.replace(/\.([^a-z]|$)/g,"$1")),!i.tmp.suppress_decorations)for(u=o.decorations.length,g=0;g<u;g+=1)v=o.decorations[g],!i.normalDecorIsOrphan(o,v)&&(d=i.fun.decorate[v[0]][v[1]].call(o,i,d,v[2]));d=h(o.strings.prefix)+d+h(o.strings.suffix);var T="";o.status===m.END?T=h(o.range_prefix):o.status===m.SUCCESSOR?T=h(o.successor_prefix):o.status===m.START?p>0&&!o.suppress_splice_prefix?T=h(o.splice_prefix):T="":o.status===m.SEEN&&(T=h(o.splice_prefix)),s+=T,s+=d,i.tmp.count_offset_characters&&(i.tmp.offset_characters+=T.length+o.strings.prefix.length+_+o.strings.suffix.length)}return s};m.Output.Queue.purgeEmptyBlobs=function(e){if(!(typeof e!="object"||typeof e.blobs!="object"||!e.blobs.length))for(var t=e.blobs.length-1;t>-1;t--){m.Output.Queue.purgeEmptyBlobs(e.blobs[t]);var n=e.blobs[t];if(!n||!n.blobs||!n.blobs.length){for(var r=[];e.blobs.length-1>t;)r.push(e.blobs.pop());for(e.blobs.pop();r.length;)e.blobs.push(r.pop())}}};m.Output.Queue.adjust=function(e){var t={";":!0,":":!0},n={".":!0,"!":!0,"?":!0},r={"!":{".":"!","?":"!?",":":"!",",":"!,",";":"!;"},"?":{"!":"?!",".":"?",":":"?",",":"?,",";":"?;"},".":{"!":".!","?":".?",":":".:",",":".,",";":".;"},":":{"!":"!","?":"?",".":":",",":":,",";":":;"},",":{"!":",!","?":",?",":":",:",".":",.",";":",;"},";":{"!":"!","?":"?",":":";",",":";,",".":";"}},i={},s={},a={},l={};for(var o in r)a[o]=!0,l[o]=!0,t[o]||(i[o]=!0),n[o]||(s[o]=!0);l[" "]=!0,l["\xA0"]=!0;var p={};for(var o in r)for(var f in r[o])p[f]||(p[f]={}),p[f][o]=r[o][f];function g(x){return typeof x.num=="number"||x.blobs&&x.blobs.length===1&&typeof x.blobs[0].num=="number"}function u(x){if(typeof x.num=="number")return!0;if(!x.blobs||typeof x.blobs!="object")return!1;if(u(x.blobs[x.blobs.length-1]))return!0}function d(x,k){var N=!1,R=["@font-style","@font-variant","@font-weight","@text-decoration","@vertical-align"];if(k&&R.push("@quotes"),x.decorations){for(var I=0,w=x.decorations.length;I<w;I++)if(R.indexOf(x.decorations[I][0])>-1){N=!0;break}}return N}function v(x){if(x.decorations){for(var k=0,N=x.decorations.length;k<N;k++)if(x.decorations[k][0]==="@quotes"&&x.decorations[k][1]!=="false")return!0}return typeof x.blobs!="object"?!1:v(x.blobs[x.blobs.length-1])}function h(x,k){var N=k.strings.suffix.slice(-1);!N&&typeof k.blobs=="string"&&(N=k.blobs.slice(-1));var R=p[x][N];return R&&R.length===1?!0:typeof k.blobs!="object"?!1:!!h(x,k.blobs[k.blobs.length-1])}function S(x,k){if(!a[k])return!1;if(typeof x.blobs=="string")return x.blobs.slice(-1)===k;var N=x.blobs[x.blobs.length-1];if(N){var R=N.strings.suffix.slice(-1);return R?N.strings.suffix.slice(-1)==k:S(N,k)}else return!1}function c(x,k,N,R,I){var w=k==="blobs"?x:x.strings,A=R==="blobs"?N:N.strings,C=w[k].slice(-1),j=A[R].slice(0,1);function U(){A[R]=A[R].slice(1)}function D(){w[k]=w[k].slice(0,-1)}function G(X){A[R]=X+A[R]}function B(X){w[k]+=X}var E=I?D:U;function M(){return p[j]}function F(){return r[C]}var P=I?F:M;function z(){var X=r[C][j];typeof X=="string"?(D(),U(),G(X)):(G(C),D())}function q(){var X=p[j][C];typeof X=="string"?(D(),U(),B(X)):(B(j),U())}var H=I?z:q,V=C===j;V?E():P()&&H()}function _(x){if(x.blobs&&typeof x.blobs=="string"){a[x.strings.suffix.slice(0,1)]&&x.strings.suffix.slice(0,1)===x.blobs.slice(-1)&&(x.strings.suffix=x.strings.suffix.slice(1));return}else if(typeof x!="object"||typeof x.blobs!="object"||!x.blobs.length)return;for(var k=d(x,!0),N=x.blobs.length-1;N>-1;N--){this.upward(x.blobs[N]);var R=x.strings,I=x.blobs[N].strings;if(N===0){R.prefix.slice(-1)===" "&&I.prefix.slice(0,1)===" "&&(I.prefix=I.prefix.slice(1));var w=I.prefix.slice(0,1);!k&&l[w]&&!R.prefix&&(R.prefix+=w,I.prefix=I.prefix.slice(1))}if(N===x.blobs.length-1){var w=I.suffix.slice(-1);!k&&[" "].indexOf(w)>-1&&(R.suffix.slice(0,1)!==w&&(R.suffix=w+R.suffix),I.suffix=I.suffix.slice(0,-1))}R.delimiter&&N>0&&l[R.delimiter.slice(-1)]&&R.delimiter.slice(-1)===I.prefix.slice(0,1)&&(I.prefix=I.prefix.slice(1))}}function y(x){if(!(typeof x!="object"||typeof x.blobs!="object"||!x.blobs.length)){for(var k=x.blobs.length-1;k>-1;k--)if(this.leftward(x.blobs[k]),k<x.blobs.length-1&&!x.strings.delimiter){var N=x.blobs[k],R=N.strings.suffix.slice(-1),I=x.blobs[k+1],w=I.strings.prefix.slice(0,1),A=d(N)||d(I),C=typeof R=="number"||typeof w=="number";if(!A&&!C&&a[w]&&!C){var j=w===N.strings.suffix.slice(-1),U=!N.strings.suffix&&typeof N.blobs=="string"&&N.blobs.slice(-1)===w;!j&&!U?c(N,"suffix",I,"prefix"):I.strings.prefix=I.strings.prefix.slice(1)}}}}function b(x){if(x.blobs&&typeof x.blobs=="string"){a[x.strings.suffix.slice(0,1)]&&x.strings.suffix.slice(0,1)===x.blobs.slice(-1)&&(x.strings.suffix=x.strings.suffix.slice(1));return}else if(typeof x!="object"||typeof x.blobs!="object"||!x.blobs.length)return;for(var k=x.strings,N=!1,R=0,I=x.blobs.length;R<I;R++)if(g(x.blobs[R])){N=!0;break}if(k.delimiter&&a[k.delimiter.slice(0,1)]){for(var w=k.delimiter.slice(0,1),R=x.blobs.length-2;R>-1;R--){var A=x.blobs[R].strings;A.suffix.slice(-1)!==w&&(A.suffix+=w)}k.delimiter=k.delimiter.slice(1)}for(var R=x.blobs.length-1;R>-1;R--){var C=x.blobs[R],A=x.blobs[R].strings,j=d(C,!0),U=g(C);if(R===x.blobs.length-1){var D=k.suffix.slice(0,1),G=!1;a[D]&&(G=h(D,C),!G&&e&&(G=v(C))),G&&a[D]&&(u(C)||(typeof C.blobs=="string"?c(C,"blobs",x,"suffix"):c(C,"suffix",x,"suffix"),k.suffix.slice(0,1)==="."&&(A.suffix+=k.suffix.slice(0,1),k.suffix=k.suffix.slice(1)))),A.suffix.slice(-1)==="\xA0"&&k.suffix.slice(0,1)===" "&&(k.suffix=k.suffix.slice(1)),l[A.suffix.slice(0,1)]&&(typeof C.blobs=="string"&&C.blobs.slice(-1)===A.suffix.slice(0,1)&&(A.suffix=A.suffix.slice(1)),A.suffix.slice(-1)===k.suffix.slice(0,1)&&(k.suffix=k.suffix.slice(0,-1))),S(x,x.strings.suffix.slice(0,1))&&(x.strings.suffix=x.strings.suffix.slice(1))}else if(k.delimiter)l[k.delimiter.slice(0,1)]&&k.delimiter.slice(0,1)===A.suffix.slice(-1)&&(x.blobs[R].strings.suffix=x.blobs[R].strings.suffix.slice(0,-1));else{var B=x.blobs[R+1].strings;!g(C)&&!j&&l[A.suffix.slice(-1)]&&A.suffix.slice(-1)===B.prefix.slice(0,1)&&(B.prefix=B.prefix.slice(1))}!U&&!j&&a[A.suffix.slice(0,1)]&&typeof C.blobs=="string"&&c(C,"blobs",C,"suffix"),this.downward(x.blobs[R])}}function T(x){var k=x.strings.suffix.slice(0,1);if(typeof x.blobs=="string")for(;i[k];)c(x,"blobs",x,"suffix"),k=x.strings.suffix.slice(0,1);else for(;i[k];)c(x.blobs[x.blobs.length-1],"suffix",x,"suffix"),k=x.strings.suffix.slice(0,1)}function O(x){if(typeof x.blobs=="string")for(var k=x.blobs.slice(-1);s[k];)c(x,"blobs",x,"suffix",!0),k=x.blobs.slice(-1);else for(var k=x.blobs[x.blobs.length-1].strings.suffix.slice(-1);s[k];)c(x.blobs[x.blobs.length-1],"suffix",x,"suffix",!0),k=x.blobs[x.blobs.length-1].strings.suffix.slice(-1)}function L(x){if(!(typeof x!="object"||typeof x.blobs!="object"||!x.blobs.length)){for(var k,N=0,R=x.blobs.length;N<R;N++){for(var I=x.blobs[N],w=!1,A=0,C=I.decorations.length;A<C;A++){var j=I.decorations[A];j[0]==="@quotes"&&j[1]!=="false"&&(w=!0)}w&&(e?T(I):O(I)),k=this.fix(x.blobs[N]),I.blobs&&typeof I.blobs=="string"&&(k=I.blobs.slice(-1))}return k}}this.upward=_,this.leftward=y,this.downward=b,this.fix=L};m.Engine.Opt=function(){this.parallel={enable:!1},this.has_disambiguate=!1,this.mode="html",this.dates={},this.jurisdictions_seen={},this.suppressedJurisdictions={},this.inheritedAttributes={},this["locale-sort"]=[],this["locale-translit"]=[],this["locale-translat"]=[],this.citeAffixes={persons:{"locale-orig":{prefix:"",suffix:""},"locale-translit":{prefix:"",suffix:""},"locale-translat":{prefix:"",suffix:""}},institutions:{"locale-orig":{prefix:"",suffix:""},"locale-translit":{prefix:"",suffix:""},"locale-translat":{prefix:"",suffix:""}},titles:{"locale-orig":{prefix:"",suffix:""},"locale-translit":{prefix:"",suffix:""},"locale-translat":{prefix:"",suffix:""}},journals:{"locale-orig":{prefix:"",suffix:""},"locale-translit":{prefix:"",suffix:""},"locale-translat":{prefix:"",suffix:""}},publishers:{"locale-orig":{prefix:"",suffix:""},"locale-translit":{prefix:"",suffix:""},"locale-translat":{prefix:"",suffix:""}},places:{"locale-orig":{prefix:"",suffix:""},"locale-translit":{prefix:"",suffix:""},"locale-translat":{prefix:"",suffix:""}}},this["default-locale"]=[],this.update_mode=m.NONE,this.bib_mode=m.NONE,this.sort_citations=!1,this["et-al-min"]=0,this["et-al-use-first"]=1,this["et-al-use-last"]=!1,this["et-al-subsequent-min"]=!1,this["et-al-subsequent-use-first"]=!1,this["demote-non-dropping-particle"]="display-and-sort",this["parse-names"]=!0,this.citation_number_slug=!1,this.trigraph="Aaaa00:AaAa00:AaAA00:AAAA00",this.nodenames=[],this.gender={},this["cite-lang-prefs"]={persons:["orig"],institutions:["orig"],titles:["orig"],journals:["orig"],publishers:["orig"],places:["orig"],number:["orig"]},this.has_layout_locale=!1,this.disable_duplicate_year_suppression=[],this.use_context_condition=!1,this.jurisdiction_fallbacks={},this.development_extensions={},this.development_extensions.field_hack=!0,this.development_extensions.allow_field_hack_date_override=!0,this.development_extensions.locator_date_and_revision=!0,this.development_extensions.locator_label_parse=!0,this.development_extensions.raw_date_parsing=!0,this.development_extensions.clean_up_csl_flaws=!0,this.development_extensions.consolidate_legal_items=!1,this.development_extensions.csl_reverse_lookup_support=!1,this.development_extensions.wrap_url_and_doi=!1,this.development_extensions.thin_non_breaking_space_html_hack=!1,this.development_extensions.apply_citation_wrapper=!1,this.development_extensions.main_title_from_short_title=!1,this.development_extensions.uppercase_subtitles=!1,this.development_extensions.normalize_lang_keys_to_lowercase=!1,this.development_extensions.strict_text_case_locales=!1,this.development_extensions.expect_and_symbol_form=!1,this.development_extensions.require_explicit_legal_case_title_short=!1,this.development_extensions.spoof_institutional_affiliations=!1,this.development_extensions.force_jurisdiction=!1,this.development_extensions.parse_names=!0,this.development_extensions.hanging_indent_legacy_number=!1,this.development_extensions.throw_on_empty=!1,this.development_extensions.strict_inputs=!0,this.development_extensions.prioritize_disambiguate_condition=!1,this.development_extensions.force_short_title_casing_alignment=!0,this.development_extensions.implicit_short_title=!1,this.development_extensions.force_title_abbrev_fallback=!1,this.development_extensions.split_container_title=!1,this.development_extensions.legacy_institution_name_ordering=!1,this.development_extensions.etal_min_etal_usefirst_hack=!1};m.Engine.Tmp=function(){this.names_max=new m.Stack,this.names_base=new m.Stack,this.givens_base=new m.Stack,this.value=[],this.namepart_decorations={},this.namepart_type=!1,this.area="citation",this.root="citation",this.extension="",this.can_substitute=new m.Stack(0,m.LITERAL),this.element_rendered_ok=!1,this.element_trace=new m.Stack("style"),this.nameset_counter=0,this.group_context=new m.Stack({term_intended:!1,variable_attempt:!1,variable_success:!1,output_tip:void 0,label_form:void 0,parallel_first:void 0,parallel_last:void 0,parallel_delimiter_override:void 0,condition:!1,force_suppress:!1,done_vars:[]}),this.term_predecessor=!1,this.in_cite_predecessor=!1,this.jump=new m.Stack(0,m.LITERAL),this.decorations=new m.Stack,this.tokenstore_stack=new m.Stack,this.last_suffix_used="",this.last_names_used=[],this.last_years_used=[],this.years_used=[],this.names_used=[],this.taintedItemIDs={},this.taintedCitationIDs={},this.initialize_with=new m.Stack,this.disambig_request=!1,this["name-as-sort-order"]=!1,this.suppress_decorations=!1,this.disambig_settings=new m.AmbigConfig,this.bib_sort_keys=[],this.prefix=new m.Stack("",m.LITERAL),this.suffix=new m.Stack("",m.LITERAL),this.delimiter=new m.Stack("",m.LITERAL),this.cite_locales=[],this.cite_affixes={citation:!1,bibliography:!1,citation_sort:!1,bibliography_sort:!1},this.strip_periods=0,this.shadow_numbers={},this.authority_stop_last=0,this.loadedItemIDs={},this.condition_counter=0,this.condition_lang_val_arr=[],this.condition_lang_counter_arr=[]};m.Engine.Fun=function(e){this.match=new m.Util.Match,this.suffixator=new m.Util.Suffixator(m.SUFFIX_CHARS),this.romanizer=new m.Util.Romanizer,this.ordinalizer=new m.Util.Ordinalizer(e),this.long_ordinalizer=new m.Util.LongOrdinalizer};m.Engine.Build=function(){this["alternate-term"]=!1,this.in_bibliography=!1,this.in_style=!1,this.skip=!1,this.postponed_macro=!1,this.layout_flag=!1,this.name=!1,this.names_variables=[[]],this.name_label=[{}],this.form=!1,this.term=!1,this.macro={},this.macro_stack=[],this.text=!1,this.lang=!1,this.area="citation",this.root="citation",this.extension="",this.substitute_level=new m.Stack(0,m.LITERAL),this.names_level=0,this.render_nesting_level=0,this.render_seen=!1,this.bibliography_key_pos=0};m.Engine.Configure=function(){this.tests=[],this.fail=[],this.succeed=[]};m.Engine.Citation=function(e){this.opt={inheritedAttributes:{}},this.tokens=[],this.srt=new m.Registry.Comparifier(e,"citation_sort"),this.opt.collapse=[],this.opt["disambiguate-add-names"]=!1,this.opt["disambiguate-add-givenname"]=!1,this.opt["disambiguate-add-year-suffix"]=!1,this.opt["givenname-disambiguation-rule"]="by-cite",this.opt["near-note-distance"]=5,this.opt.topdecor=[],this.opt.layout_decorations=[],this.opt.layout_prefix="",this.opt.layout_suffix="",this.opt.layout_delimiter="",this.opt.sort_locales=[],this.opt.max_number_of_names=0,this.root="citation"};m.Engine.Bibliography=function(){this.opt={inheritedAttributes:{}},this.tokens=[],this.opt.collapse=[],this.opt.topdecor=[],this.opt.layout_decorations=[],this.opt.layout_prefix="",this.opt.layout_suffix="",this.opt.layout_delimiter="",this.opt["line-spacing"]=1,this.opt["entry-spacing"]=1,this.opt.sort_locales=[],this.opt.max_number_of_names=0,this.root="bibliography"};m.Engine.BibliographySort=function(){this.tokens=[],this.opt={},this.opt.sort_directions=[],this.opt.topdecor=[],this.opt.citation_number_sort_direction=m.ASCENDING,this.opt.citation_number_secondary=!1,this.tmp={},this.keys=[],this.root="bibliography"};m.Engine.CitationSort=function(){this.tokens=[],this.opt={},this.opt.sort_directions=[],this.keys=[],this.opt.topdecor=[],this.root="citation"};m.Engine.InText=function(){this.opt={inheritedAttributes:{}},this.tokens=[],this.opt.collapse=[],this.opt["disambiguate-add-names"]=!1,this.opt["disambiguate-add-givenname"]=!1,this.opt["disambiguate-add-year-suffix"]=!1,this.opt["givenname-disambiguation-rule"]="by-cite",this.opt["near-note-distance"]=5,this.opt.topdecor=[],this.opt.layout_decorations=[],this.opt.layout_prefix="",this.opt.layout_suffix="",this.opt.layout_delimiter="",this.opt.sort_locales=[],this.opt.max_number_of_names=0,this.root="intext"};m.Engine.prototype.previewCitationCluster=function(e,t,n,r){var i=this.opt.mode;this.setOutputFormat(r),e.citationID&&delete e.citationID;var s=this.processCitationCluster(e,t,n,m.PREVIEW);return this.setOutputFormat(i),s[1]};m.Engine.prototype.appendCitationCluster=function(e){for(var t=[],n=this.registry.citationreg.citationByIndex.length,r=0;r<n;r+=1){var i=this.registry.citationreg.citationByIndex[r];t.push([""+i.citationID,i.properties.noteIndex])}return this.processCitationCluster(e,t,[])[1]};m.Engine.prototype.processCitationCluster=function(e,t,n,r){var i,s,a,l,o,p,f,g,u,d,v,h,S,c,_,y,b,T;this.debug=!1,this.tmp.loadedItemIDs={},this.tmp.citation_errors=[],this.registry.return_data={bibchange:!1},this.setCitationId(e);var O,L,x;if(r===m.PREVIEW){this.debug&&m.debug("****** start state save *********"),O=this.registry.citationreg.citationByIndex.slice(),L=this.registry.reflist.slice();for(var k=t.concat(n),N={},R=[],l=0,o=k.length;l<o;l+=1)for(i=this.registry.citationreg.citationById[k[l][0]],p=0,f=i.citationItems.length;p<f;p+=1)N[i.citationItems[p].id]=!0,R.push(""+i.citationItems[p].id);for(p=0,f=e.citationItems.length;p<f;p+=1)N[e.citationItems[p].id]=!0,R.push(""+e.citationItems[p].id);x={};for(var l=0,o=L.length;l<o;l+=1)if(!N[L[l].id]){var I=this.registry.registry[L[l].id].ambig,w=this.registry.ambigcites[I];if(w)for(p=0,f=w.length;p<f;p+=1)x[w[p]]=m.cloneAmbigConfig(this.registry.registry[w[p]].disambig)}this.debug&&m.debug("****** end state save *********")}this.tmp.taintedCitationIDs={};for(var A=[],C={},l=0,o=e.citationItems.length;l<o;l+=1){c={};for(var h in e.citationItems[l])c[h]=e.citationItems[l][h];if(S=this.retrieveItem(""+c.id),S.id&&this.transform.loadAbbreviation("default","hereinafter",S.id,S.language),c=m.parseLocator.call(this,c),this.opt.development_extensions.consolidate_legal_items&&this.remapSectionVariable([[S,c]]),this.opt.development_extensions.locator_label_parse&&c.locator&&["bill","gazette","legislation","regulation","treaty"].indexOf(S.type)===-1&&(!c.label||c.label==="page")){var b=m.LOCATOR_LABELS_REGEXP.exec(c.locator);if(b){var j=m.LOCATOR_LABELS_MAP[b[2]];this.getTerm(j)&&(c.label=j,c.locator=b[3])}}var U=[S,c];A.push(U),e.citationItems[l].item=S}e.sortedItems=A;var D=[],G={},B;for(l=0,o=t.length;l<o;l+=1)s=t[l],this.opt.development_extensions.strict_inputs&&(G[s[0]]&&m.error("Previously referenced citationID "+s[0]+" encountered in citationsPre"),s[1]&&(B>s[1]&&m.debug("Note index sequence is not sane at citationsPre["+l+"]"),B=s[1])),this.registry.citationreg.citationById[s[0]].properties.noteIndex=s[1],D.push(this.registry.citationreg.citationById[s[0]]),G[s[0]]=this.registry.citationreg.citationById[s[0]];for(e.properties||(e.properties={noteIndex:0}),this.opt.development_extensions.strict_inputs&&(G[e.citationID]&&m.error("Citation with previously referenced citationID "+e.citationID),e.properties.noteIndex&&(B>e.properties.noteIndex&&m.debug("Note index sequence is not sane for citation "+e.citationID),B=e.properties.noteIndex)),D.push(e),G[e.citationID]=e,l=0,o=n.length;l<o;l+=1)a=n[l],this.opt.development_extensions.strict_inputs&&(G[a[0]]&&m.error("Previously referenced citationID "+a[0]+" encountered in citationsPost"),a[1]&&(B>a[1]&&m.debug("Note index sequence is not sane at postCitation["+l+"]"),B=a[1])),this.registry.citationreg.citationById[a[0]].properties.noteIndex=a[1],D.push(this.registry.citationreg.citationById[a[0]]),G[a[0]]=this.registry.citationreg.citationById[a[0]];this.registry.citationreg.citationByIndex=D,this.registry.citationreg.citationById=G,this.registry.citationreg.citationsByItemId={},this.opt.update_mode===m.POSITION&&(y=[],_=[],T={});for(var E=[],l=0,o=D.length;l<o;l+=1){for(D[l].properties.index=l,p=0,f=D[l].sortedItems.length;p<f;p+=1)c=D[l].sortedItems[p],this.registry.citationreg.citationsByItemId[c[1].id]||(this.registry.citationreg.citationsByItemId[c[1].id]=[],E.push(""+c[1].id)),this.registry.citationreg.citationsByItemId[c[1].id].indexOf(D[l])===-1&&this.registry.citationreg.citationsByItemId[c[1].id].push(D[l]);this.opt.update_mode===m.POSITION&&(D[l].properties.noteIndex?_.push(D[l]):(D[l].properties.noteIndex=0,y.push(D[l])))}if(r!==m.ASSUME_ALL_ITEMS_REGISTERED&&(this.debug&&m.debug("****** start update items *********"),this.updateItems(E,null,null,!0),this.debug&&m.debug("****** endo update items *********")),!this.opt.citation_number_sort&&A&&A.length>1&&this.citation_sort.tokens.length>0){for(var l=0,o=A.length;l<o;l+=1)A[l][1].sortkeys=m.getSortKeys.call(this,A[l][0],"citation_sort");if(this.opt.grouped_sort&&!e.properties.unsorted){for(var l=0,o=A.length;l<o;l+=1){var M=A[l][1].sortkeys;this.tmp.authorstring_request=!0;var F=this.registry.registry[A[l][0].id].disambig;this.tmp.authorstring_request=!0,m.getAmbiguousCite.call(this,A[l][0],F);var P=this.registry.authorstrings[A[l][0].id];this.tmp.authorstring_request=!1,A[l][1].sortkeys=[P].concat(M)}A.sort(this.citation.srt.compareCompositeKeys);for(var z=!1,q=!1,H=!1,l=0,o=A.length;l<o;l+=1)A[l][1].sortkeys[0]!==z&&(H=A[l][1].sortkeys[0],q=A[l][1].sortkeys[1]),A[l][1].sortkeys[0]=""+q+l,z=H}e.properties.unsorted||A.sort(this.citation.srt.compareCompositeKeys)}this.opt.parallel.enable&&this.parallel.StartCitation(e.sortedItems);var V;if(this.opt.update_mode===m.POSITION)for(var l=0;l<2;l+=1){var X={},K={},Q={};for(V=[y,_][l],p=0,f=V.length;p<f;p+=1){var $=V[p];for(V[p].properties.noteIndex||(V[p].properties.noteIndex=0),V[p].properties.noteIndex=parseInt(V[p].properties.noteIndex,10),p>0&&$.properties.noteIndex&&V[p-1].properties.noteIndex>$.properties.noteIndex&&(T={},X={},K={},Q={}),g=0,u=$.sortedItems.length;g<u;g+=1)$.sortedItems[g][1].parallel&&$.sortedItems[g][1].parallel!=="first"||(T[$.properties.noteIndex]?T[$.properties.noteIndex]+=1:T[$.properties.noteIndex]=1);for(g=0,u=V[p].sortedItems.length;g<u;g+=1){c=V[p].sortedItems[g];var J=c[0].id,ee=c[0].legislation_id?c[0].legislation_id:c[0].id,W=c[0].legislation_id?c[0].legislation_id:c[0].container_id?c[0].container_id:c[0].id,te=c[1]["locator-extra"],me=c[1].locator,Y=c[1].label,ne,ge;if(g>0)if($.sortedItems[g-1][0].legislation_id)ne=$.sortedItems[g-1][0].legislation_id;else{ne=$.sortedItems[g-1][1].id,ge=$.sortedItems[g-1][1]["locator-extra"];for(var Z=g-2;Z>-1;Z--)$.sortedItems[Z][1].parallel==="first"&&(ne=$.sortedItems[Z][1].id,ge=$.sortedItems[Z][1]["locator-extra"])}if(r===m.PREVIEW&&$.citationID!=e.citationID){typeof X[c[1].id]>"u"&&(X[ee]=$.properties.noteIndex),K[W]=$.properties.noteIndex;continue}var oe={};if(oe.position=c[1].position,oe["first-reference-note-number"]=c[1]["first-reference-note-number"],oe["first-container-reference-note-number"]=c[1]["first-container-reference-note-number"],oe["near-note"]=c[1]["near-note"],c[1]["first-reference-note-number"]=0,c[1]["first-container-reference-note-number"]=0,c[1]["near-note"]=!1,this.registry.citationreg.citationsByItemId[J]&&this.opt.xclass==="note"&&this.opt.has_disambiguate){var pe=this.registry.registry[c[0].id]["citation-count"],ze=this.registry.citationreg.citationsByItemId[J].length;if(this.registry.registry[c[0].id]["citation-count"]=this.registry.citationreg.citationsByItemId[J].length,typeof pe=="number"){var je=pe<2,Be=ze<2;if(je!==Be)for(var Z=0,ve=this.registry.citationreg.citationsByItemId[J].length;Z<ve;Z++)C[this.registry.registry[c[0].id].ambig]=!0,this.tmp.taintedCitationIDs[this.registry.citationreg.citationsByItemId[J][Z].citationID]=!0}else for(var Z=0,ve=this.registry.citationreg.citationsByItemId[J].length;Z<ve;Z++)C[this.registry.registry[c[0].id].ambig]=!0,this.tmp.taintedCitationIDs[this.registry.citationreg.citationsByItemId[J][Z].citationID]=!0}var _e,xe;if(typeof K[W]>"u"&&$.properties.mode!=="author-only")X[ee]=$.properties.noteIndex,K[W]=$.properties.noteIndex,Q[W]=$.properties.noteIndex,c[1].position=m.POSITION_FIRST;else{var ae=!1,he=!1,re=null;if(p>0)var re=V[p-1];var ce=V[p];if(p>0){var ye=1;re.properties.mode==="author-only"&&p>1&&(ye=2);var Te=p-ye;V[Te].sortedItems.length&&(_e=V[Te].sortedItems.slice(-1)[0][1].id,xe=V[p-ye].sortedItems.slice(-1)[0][1]["locator-extra"]),re.sortedItems.length&&re.sortedItems[0].slice(-1)[0].legislation_id&&(_e=re.sortedItems[0].slice(-1)[0].legislation_id)}if(p>0&&g===0&&re.properties.noteIndex!==ce.properties.noteIndex){var Ne=!1,ke=re.sortedItems[0][0].id;if(re.sortedItems[0][0].legislation_id&&(ke=re.sortedItems[0][0].legislation_id),ke==ee&&re.properties.noteIndex>=ce.properties.noteIndex-1){var qe=re.sortedItems[0][1]["locator-extra"],Ue=ce.sortedItems[0][1]["locator-extra"];(T[re.properties.noteIndex]===1||re.properties.noteIndex===0)&&qe===Ue&&(Ne=!0)}Ne?ae=!0:he=!0}else g>0&&ne==ee&&ge==te||g===0&&p>0&&re.properties.noteIndex==ce.properties.noteIndex&&re.sortedItems.length&&_e==ee&&xe==te?ae=!0:he=!0;var fe,le,Oe,ue,Se;ae&&(g>0?fe=$.sortedItems[g-1][1]:fe=V[p-1].sortedItems[0][1],fe.locator?(fe.label?Oe=fe.label:Oe="",le=""+fe.locator+Oe):le=fe.locator,me?(Y?Se=Y:Se="",ue=""+me+Se):ue=me),ae&&le&&!ue&&(ae=!1,he=!0),ae&&(!le&&ue?c[1].position=m.POSITION_IBID_WITH_LOCATOR:!le&&!ue||le&&ue===le?c[1].position=m.POSITION_IBID:le&&ue&&ue!==le?c[1].position=m.POSITION_IBID_WITH_LOCATOR:(ae=!1,he=!0)),he&&(c[1].position=m.POSITION_CONTAINER_SUBSEQUENT,typeof X[ee]>"u"?X[ee]=$.properties.noteIndex:c[1].position=m.POSITION_SUBSEQUENT),(he||ae)&&($.properties.mode==="author-only"&&(c[1].position=m.POSITION_FIRST),Q[W]!=$.properties.noteIndex&&(c[1]["first-container-reference-note-number"]=Q[W],this.registry.registry[c[0].id]&&(this.registry.registry[c[0].id]["first-container-reference-note-number"]=Q[W])),X[ee]!=$.properties.noteIndex&&(c[1]["first-reference-note-number"]=X[ee],this.registry.registry[c[0].id]&&(this.registry.registry[c[0].id]["first-reference-note-number"]=X[ee])))}if($.properties.noteIndex){var He=parseInt($.properties.noteIndex,10)-parseInt(K[W],10);c[1].position!==m.POSITION_FIRST&&He<=this.citation.opt["near-note-distance"]&&(c[1]["near-note"]=!0),K[W]=$.properties.noteIndex}else c[1].position!==m.POSITION_FIRST&&(c[1]["near-note"]=!0);if($.citationID!=e.citationID)for(d=0,v=m.POSITION_TEST_VARS.length;d<v;d+=1){var Re=m.POSITION_TEST_VARS[d];c[1][Re]!==oe[Re]&&(this.registry.registry[c[0].id]&&Re==="first-reference-note-number"&&(C[this.registry.registry[c[0].id].ambig]=!0,this.tmp.taintedItemIDs[c[0].id]=!0),this.tmp.taintedCitationIDs[$.citationID]=!0)}this.sys.variableWrapper&&(c[1].index=$.properties.index,c[1].noteIndex=$.properties.noteIndex)}}}if(this.opt.citation_number_sort&&A&&A.length>1&&this.citation_sort.tokens.length>0&&!e.properties.unsorted){for(var l=0,o=A.length;l<o;l+=1)A[l][1].sortkeys=m.getSortKeys.call(this,A[l][0],"citation_sort");A.sort(this.citation.srt.compareCompositeKeys)}for(var h in this.tmp.taintedItemIDs)if(this.tmp.taintedItemIDs.hasOwnProperty(h)&&(V=this.registry.citationreg.citationsByItemId[h],V))for(var l=0,o=V.length;l<o;l+=1)this.tmp.taintedCitationIDs[V[l].citationID]=!0;var de=[];if(r===m.PREVIEW){this.debug&&m.debug("****** start run processor *********");try{de=this.process_CitationCluster.call(this,e.sortedItems,e)}catch(be){m.error("Error running CSL processor for preview: "+be)}this.debug&&(m.debug("****** end run processor *********"),m.debug("****** start state restore *********")),this.registry.citationreg.citationByIndex=O,this.registry.citationreg.citationById={};for(var l=0,o=O.length;l<o;l+=1)this.registry.citationreg.citationById[O[l].citationID]=O[l];this.debug&&m.debug("****** start final update *********");for(var Ae=[],l=0,o=L.length;l<o;l+=1)Ae.push(""+L[l].id);this.updateItems(Ae,null,null,!0),this.debug&&m.debug("****** end final update *********");for(var h in x)x.hasOwnProperty(h)&&(this.registry.registry[h].disambig=x[h]);this.debug&&m.debug("****** end state restore *********")}else{for(var Pe in C)this.disambiguate.run(Pe,e);var se;for(var h in this.tmp.taintedCitationIDs)if(h!=e.citationID){var ie=this.registry.citationreg.citationById[h];if(!ie.properties.unsorted){for(var l=0,o=ie.sortedItems.length;l<o;l+=1)ie.sortedItems[l][1].sortkeys=m.getSortKeys.call(this,ie.sortedItems[l][0],"citation_sort");ie.sortedItems.sort(this.citation.srt.compareCompositeKeys)}this.tmp.citation_pos=ie.properties.index,this.tmp.citation_note_index=ie.properties.noteIndex,this.tmp.citation_id=""+ie.citationID,se=[],se.push(ie.properties.index),se.push(this.process_CitationCluster.call(this,ie.sortedItems,ie)),se.push(ie.citationID),de.push(se)}this.tmp.taintedItemIDs={},this.tmp.taintedCitationIDs={},this.tmp.citation_pos=e.properties.index,this.tmp.citation_note_index=e.properties.noteIndex,this.tmp.citation_id=""+e.citationID,se=[],se.push(t.length),se.push(this.process_CitationCluster.call(this,A,e)),se.push(e.citationID),de.push(se),de.sort(function(be,Ee){return be[0]>Ee[0]?1:be[0]<Ee[0]?-1:0})}return this.registry.return_data.citation_errors=this.tmp.citation_errors.slice(),[this.registry.return_data,de]};m.Engine.prototype.process_CitationCluster=function(e,t){var n="";if(t&&t.properties&&t.properties.mode==="composite"){t.properties.mode="author-only";var r=m.getCitationCluster.call(this,e,t);t.properties.mode="suppress-author";var i="";t.properties.infix&&(this.output.append(t.properties.infix),i=this.output.string(this,this.output.queue),typeof i=="object"&&(i=i.join("")));var s=m.getCitationCluster.call(this,e,t);t.properties.mode="composite",r&&i&&m.SWAPPING_PUNCTUATION.concat(["\u2019","'"]).indexOf(i[0])>-1&&(r+=i,i=!1),n=[r,i,s].filter(function(a){return a}).join(" ")}else n=m.getCitationCluster.call(this,e,t);return n};m.Engine.prototype.makeCitationCluster=function(e){var t,n,f,r,i,s,a;for(t=[],i=e.length,r=0;r<i;r+=1){s={};for(var l in e[r])s[l]=e[r][l];if(a=this.retrieveItem(""+s.id),this.opt.development_extensions.locator_label_parse&&s.locator&&["bill","gazette","legislation","regulation","treaty"].indexOf(a.type)===-1&&(!s.label||s.label==="page")){var o=m.LOCATOR_LABELS_REGEXP.exec(s.locator);if(o){var p=m.LOCATOR_LABELS_MAP[o[2]];this.getTerm(p)&&(s.label=p,s.locator=o[3])}}s.locator&&(s.locator=(""+s.locator).replace(/\s+$/,"")),n=[a,s],t.push(n)}if(this.opt.development_extensions.consolidate_legal_items&&this.remapSectionVariable(t),t&&t.length>1&&this.citation_sort.tokens.length>0){for(i=t.length,r=0;r<i;r+=1)t[r][1].sortkeys=m.getSortKeys.call(this,t[r][0],"citation_sort");t.sort(this.citation.srt.compareCompositeKeys)}this.tmp.citation_errors=[];var f=m.getCitationCluster.call(this,t);return f};m.getAmbiguousCite=function(e,t,n,r){var u,i=this.tmp.group_context.tip,s={term_intended:i.term_intended,variable_attempt:i.variable_attempt,variable_success:i.variable_success,output_tip:i.output_tip,label_form:i.label_form,non_parallel:i.non_parallel,parallel_last:i.parallel_last,parallel_first:i.parallel_first,parallel_last_override:i.parallel_last_override,parallel_delimiter_override:i.parallel_delimiter_override,parallel_delimiter_override_on_suppress:i.parallel_delimiter_override_on_suppress,condition:i.condition,force_suppress:i.force_suppress,done_vars:i.done_vars.slice()};t?this.tmp.disambig_request=t:this.tmp.disambig_request=!1;var a={position:m.POSITION_SUBSEQUENT,"near-note":!0};r&&(a.locator=r.locator,a.label=r.label),this.registry.registry[e.id]&&this.registry.citationreg.citationsByItemId&&this.registry.citationreg.citationsByItemId[e.id]&&this.registry.citationreg.citationsByItemId[e.id].length&&n&&this.citation.opt["givenname-disambiguation-rule"]==="by-cite"&&(a["first-reference-note-number"]=this.registry.registry[e.id]["first-reference-note-number"]),this.tmp.area="citation",this.tmp.root="citation";var l=this.tmp.suppress_decorations;this.tmp.suppress_decorations=!0,this.tmp.just_looking=!0,m.getCite.call(this,e,a,null,!1);for(var o=0,p=this.output.queue.length;o<p;o+=1)m.Output.Queue.purgeEmptyBlobs(this.output.queue[o]);if(this.opt.development_extensions.clean_up_csl_flaws)for(var f=0,g=this.output.queue.length;f<g;f+=1)this.output.adjust.upward(this.output.queue[f]),this.output.adjust.leftward(this.output.queue[f]),this.output.adjust.downward(this.output.queue[f]),this.output.adjust.fix(this.output.queue[f]);var u=this.output.string(this,this.output.queue);return this.tmp.just_looking=!1,this.tmp.suppress_decorations=l,this.tmp.group_context.replace(s),u};m.getSpliceDelimiter=function(e,t,n){if(this.citation.opt["after-collapse-delimiter"]!==void 0)e?this.tmp.splice_delimiter=this.citation.opt["after-collapse-delimiter"]:t&&!this.tmp.have_collapsed?this.tmp.splice_delimiter=this.citation.opt["after-collapse-delimiter"]:!t&&!this.tmp.have_collapsed&&this.citation.opt.collapse!=="year-suffix"?this.tmp.splice_delimiter=this.citation.opt["after-collapse-delimiter"]:this.tmp.splice_delimiter=this.citation.opt.layout_delimiter;else if(this.tmp.use_cite_group_delimiter)this.tmp.splice_delimiter=this.citation.opt.cite_group_delimiter;else if(this.tmp.have_collapsed&&this.opt.xclass==="in-text"&&this.opt.update_mode!==m.NUMERIC)this.tmp.splice_delimiter=", ";else if(this.tmp.cite_locales[n-1]){var r=this.tmp.cite_affixes[this.tmp.area][this.tmp.cite_locales[n-1]];r&&r.delimiter&&(this.tmp.splice_delimiter=r.delimiter)}else this.tmp.splice_delimiter||(this.tmp.splice_delimiter="");return this.tmp.splice_delimiter};m.getCitationCluster=function(e,t){var n,r,i,s,a,l,o,p,f,g,u,d,v,h,S,c,_,y,b,T,O,L,x="";this.output.checkNestedBrace=new m.checkNestedBrace(this),t&&(T=t.citationID,O=t.properties.mode==="author-only"?!!t.properties.mode:!1,this.opt.xclass!=="note"&&(L=t.properties.mode==="suppress-author"?!!t.properties.mode:!1),t.properties.prefix&&(x=m.checkPrefixSpaceAppend(this,t.properties.prefix))),e=e||[],this.tmp.last_primary_names_string=!1,y=m.getSafeEscape(this),this.tmp.area="citation",this.tmp.root="citation",n="",r=[],this.tmp.last_suffix_used="",this.tmp.last_names_used=[],this.tmp.last_years_used=[],this.tmp.backref_index=[],this.tmp.cite_locales=[],this.tmp.just_looking||(this.tmp.abbrev_trimmer={QUASHES:{}});var k=this.output.checkNestedBrace.update(this.citation.opt.layout_prefix+x),N=!1;if(this.citation.opt.suppressTrailingPunctuation&&(N=!0),T&&this.registry.citationreg.citationById[T].properties["suppress-trailing-punctuation"]&&(N=!0),this.opt.xclass==="note"){for(var R=[],I=!1,w=!1,A=!1,C=[],j=0,U=e.length;j<U;j+=1){var D=e[j][0].type,G=e[j][0].title,B=e[j][1].position,E=e[j][0].id;G&&D==="legal_case"&&E!==A&&B&&((G!==I||R.length===0)&&(C=[],R.push(C)),C.push(e[j][1])),I=G,w=B,A=E}for(j=0,U=R.length;j<U;j+=1)if(C=R[j],!(C.length<2)){var M=C.slice(-1)[0].locator;if(M)for(var F=0,P=C.length-1;F<P;F+=1)C[F].locator&&(M=!1);M&&(C[0].locator=M,delete C.slice(-1)[0].locator,C[0].label=C.slice(-1)[0].label,C.slice(-1)[0].label&&delete C.slice(-1)[0].label)}}for(i=[],s=e.length,e[0]&&e[0][1]&&(O?(delete e[0][1]["suppress-author"],e[0][1]["author-only"]=!0):L&&(delete e[0][1]["author-only"],e[0][1]["suppress-author"]=!0)),this.opt.parallel.enable&&this.parallel.StartCitation(e),a=0;a<s;a+=1){this.tmp.cite_index=a,v=e[a][0],l=e[a][1],l=m.parseLocator.call(this,l),o=this.tmp.have_collapsed;var z=!1;if(a>0&&e[a-1][1]&&(z=!!e[a-1][1].locator),p={},this.tmp.shadow_numbers={},!this.tmp.just_looking&&this.opt.hasPlaceholderTerm){var q=this.output;this.output=new m.Output.Queue(this),this.output.adjust=new m.Output.Queue.adjust,m.getAmbiguousCite.call(this,v,null,!1,l),this.output=q}if(this.tmp.in_cite_predecessor=!1,a>0?m.getCite.call(this,v,l,""+e[a-1][0].id,!0):(this.tmp.term_predecessor=!1,m.getCite.call(this,v,l,null,!0)),this.tmp.cite_renders_content||(b={citationID:""+this.tmp.citation_id,index:this.tmp.citation_pos,noteIndex:this.tmp.citation_note_index,itemID:""+v.id,citationItems_pos:a,error_code:m.ERROR_NO_RENDERED_FORM},this.tmp.citation_errors.push(b)),p.splice_delimiter=m.getSpliceDelimiter.call(this,z,o,a),l&&l["author-only"]&&(this.tmp.suppress_decorations=!0),a>0){_=e[a-1][1];var H=_.suffix&&[";",".",","].indexOf(_.suffix.slice(-1))>-1,V=!_.suffix&&l.prefix&&[";",".",","].indexOf(l.prefix.slice(0,1))>-1;if(H||V){var X=p.splice_delimiter.indexOf(" ");X>-1&&!V?p.splice_delimiter=p.splice_delimiter.slice(X):p.splice_delimiter=""}}if(p.suppress_decorations=this.tmp.suppress_decorations,p.have_collapsed=this.tmp.have_collapsed,i.push(p),l["author-only"])break}f=0,d=this.output.queue.slice();var K="";t&&(K=m.checkSuffixSpacePrepend(this,t.properties.suffix));var Q=this.citation.opt.layout_suffix,$=this.tmp.cite_locales[this.tmp.cite_locales.length-1];$&&this.tmp.cite_affixes[this.tmp.area][$]&&this.tmp.cite_affixes[this.tmp.area][$].suffix&&(Q=this.tmp.cite_affixes[this.tmp.area][$].suffix),m.TERMINAL_PUNCTUATION.slice(0,-1).indexOf(Q.slice(0,1))>-1&&(Q=Q.slice(0,1)),Q=this.output.checkNestedBrace.update(K+Q);for(var j=0,U=this.output.queue.length;j<U;j+=1)m.Output.Queue.purgeEmptyBlobs(this.output.queue[j]);if(!this.tmp.suppress_decorations&&this.output.queue.length&&(this.opt.development_extensions.apply_citation_wrapper&&this.sys.wrapCitationEntry&&!this.tmp.just_looking&&this.tmp.area==="citation"||(N||(this.output.queue[this.output.queue.length-1].strings.suffix=Q),this.output.queue[0].strings.prefix=k)),this.opt.development_extensions.clean_up_csl_flaws)for(var F=0,P=this.output.queue.length;F<P;F+=1)this.output.adjust.upward(this.output.queue[F]),this.output.adjust.leftward(this.output.queue[F]),this.output.adjust.downward(this.output.queue[F]),this.tmp.last_chr=this.output.adjust.fix(this.output.queue[F]);for(a=0,s=d.length;a<s;a+=1){var J=[];if(this.output.queue=[d[a]],this.tmp.suppress_decorations=i[a].suppress_decorations,this.tmp.splice_delimiter=i[a].splice_delimiter,d[a].parallel_delimiter&&(this.tmp.splice_delimiter=d[a].parallel_delimiter),this.tmp.have_collapsed=i[a].have_collapsed,g=this.output.string(this,this.output.queue),this.tmp.suppress_decorations=!1,typeof g=="string")return this.tmp.suppress_decorations=!1,g||(this.opt.development_extensions.throw_on_empty?m.error("Citation would render no content"):g="[NO_PRINTED_FORM]"),g;if(typeof g=="object"&&g.length===0&&!l["suppress-author"]){if(a===0){var ee="[CSL STYLE ERROR: reference with no printed form.]",W=a===0?y(this.citation.opt.layout_prefix):"",te=a===d.length-1?y(this.citation.opt.layout_suffix):"";g.push(W+ee+te)}else if(a===d.length-1){var me=r[r.length-1];typeof me=="string"?r[r.length-1]+=y(this.citation.opt.layout_suffix):typeof me=="object"&&(me.strings.suffix+=y(this.citation.opt.layout_suffix))}}if(J.length&&typeof g[0]=="string"){g.reverse();var Y=g.pop();Y&&Y.slice(0,1)===","?J.push(Y):typeof J.slice(-1)[0]=="string"&&J.slice(-1)[0].slice(-1)===","?J.push(" "+Y):Y&&J.push(y(this.tmp.splice_delimiter)+Y)}else g.reverse(),u=g.pop(),typeof u<"u"&&(J.length&&typeof J[J.length-1]=="string"&&(J[J.length-1]+=u.successor_prefix),J.push(u));for(h=g.length,S=0;S<h;S+=1){if(c=g[S],typeof c=="string"){J.push(y(this.tmp.splice_delimiter)+c);continue}u=g.pop(),typeof u<"u"&&J.push(u)}J.length===0&&!e[a][1]["suppress-author"]&&(f+=1),J.length>1&&typeof J[0]!="string"&&(J=[this.output.renderBlobs(J)]),J.length&&(typeof J[0]=="string"?a>0&&(J[0]=y(this.tmp.splice_delimiter)+J[0]):a>0?J[0].splice_prefix=this.tmp.splice_delimiter:J[0].splice_prefix=""),r=r.concat(J)}if(n+=this.output.renderBlobs(r),n&&!this.tmp.suppress_decorations)for(s=this.citation.opt.layout_decorations.length,a=0;a<s;a+=1)p=this.citation.opt.layout_decorations[a],p[1]!=="normal"&&(!l||!l["author-only"])&&(n=this.fun.decorate[p[0]][p[1]](this,n));return this.tmp.suppress_decorations=!1,n||(this.opt.development_extensions.throw_on_empty?m.error("Citation would render no content"):n="[NO_PRINTED_FORM]"),n};m.getCite=function(e,t,n,r){var i,s,a=this.tmp.area;for(t&&t["author-only"]&&this.intext&&this.intext.tokens.length>0&&(this.tmp.area="intext"),this.tmp.cite_renders_content=!1,this.tmp.probably_rendered_something=!1,this.tmp.prevItemID=n,m.citeStart.call(this,e,t,r),i=0,this.tmp.name_node={},this.nameOutput=new m.NameOutput(this,e,t);i<this[this.tmp.area].tokens.length;)i=m.tokenExec.call(this,this[this.tmp.area].tokens[i],e,t);return m.citeEnd.call(this,e,t),!this.tmp.cite_renders_content&&!this.tmp.just_looking&&this.tmp.area==="bibliography"&&(s={index:this.tmp.bibliography_pos,itemID:""+e.id,error_code:m.ERROR_NO_RENDERED_FORM},this.tmp.bibliography_errors.push(s)),this.tmp.area=a,""+e.id};m.citeStart=function(e,t,n){if(this.tmp.lang_array=[],e.language){var r=e.language.match(/^([a-zA-Z]+).*/);r&&this.tmp.lang_array.push(r[1].toLowerCase())}if(this.tmp.lang_array.push(this.opt.lang),n||(this.tmp.shadow_numbers={}),this.tmp.disambiguate_count=0,this.tmp.disambiguate_maxMax=0,this.tmp.same_author_as_previous_cite=!1,this.tmp.suppress_decorations?this.tmp.subsequent_author_substitute_ok=!1:this.tmp.subsequent_author_substitute_ok=!0,this.tmp.lastchr="",this.tmp.area==="citation"&&this.citation.opt.collapse&&this.citation.opt.collapse.length?this.tmp.have_collapsed=!0:this.tmp.have_collapsed=!1,this.tmp.render_seen=!1,this.tmp.disambig_request&&!this.tmp.disambig_override?this.tmp.disambig_settings=this.tmp.disambig_request:this.registry.registry[e.id]&&!this.tmp.disambig_override?(this.tmp.disambig_request=this.registry.registry[e.id].disambig,this.tmp.disambig_settings=this.registry.registry[e.id].disambig):this.tmp.disambig_settings=new m.AmbigConfig,this.tmp.area!=="citation"){if(!this.registry.registry[e.id])this.tmp.disambig_restore=new m.AmbigConfig;else if(this.tmp.disambig_restore=m.cloneAmbigConfig(this.registry.registry[e.id].disambig),this.tmp.area==="bibliography"&&this.tmp.disambig_settings&&this.tmp.disambig_override&&(this.opt["disambiguate-add-names"]&&(this.tmp.disambig_settings.names=this.registry.registry[e.id].disambig.names.slice(),this.tmp.disambig_request&&(this.tmp.disambig_request.names=this.registry.registry[e.id].disambig.names.slice())),this.opt["disambiguate-add-givenname"])){this.tmp.disambig_request=this.tmp.disambig_settings,this.tmp.disambig_settings.givens=this.registry.registry[e.id].disambig.givens.slice(),this.tmp.disambig_request.givens=this.registry.registry[e.id].disambig.givens.slice();for(var i=0,s=this.tmp.disambig_settings.givens.length;i<s;i+=1)this.tmp.disambig_settings.givens[i]=this.registry.registry[e.id].disambig.givens[i].slice();for(var i=0,s=this.tmp.disambig_request.givens.length;i<s;i+=1)this.tmp.disambig_request.givens[i]=this.registry.registry[e.id].disambig.givens[i].slice()}}this.tmp.names_used=[],this.tmp.nameset_counter=0,this.tmp.years_used=[],this.tmp.names_max.clear(),this.tmp.just_looking||(!t||t.parallel==="first"||!t.parallel)&&(this.tmp.abbrev_trimmer={QUASHES:{}}),this.tmp.splice_delimiter=this[this.tmp.area].opt.layout_delimiter,this.bibliography_sort.keys=[],this.citation_sort.keys=[],this.tmp.has_done_year_suffix=!1,this.tmp.last_cite_locale=!1,!this.tmp.just_looking&&t&&!t.position&&this.registry.registry[e.id]&&(this.tmp.disambig_restore=m.cloneAmbigConfig(this.registry.registry[e.id].disambig)),this.tmp.first_name_string=!1,this.tmp.authority_stop_last=0};m.citeEnd=function(e,t){if(this.tmp.disambig_restore&&this.registry.registry[e.id]){this.registry.registry[e.id].disambig.names=this.tmp.disambig_restore.names.slice(),this.registry.registry[e.id].disambig.givens=this.tmp.disambig_restore.givens.slice();for(var n=0,r=this.registry.registry[e.id].disambig.givens.length;n<r;n+=1)this.registry.registry[e.id].disambig.givens[n]=this.tmp.disambig_restore.givens[n].slice()}if(this.tmp.disambig_restore=!1,t&&t.suffix?this.tmp.last_suffix_used=t.suffix:this.tmp.last_suffix_used="",this.tmp.last_years_used=this.tmp.years_used.slice(),this.tmp.last_names_used=this.tmp.names_used.slice(),this.tmp.cut_var=!1,this.tmp.disambig_request=!1,this.tmp.cite_locales.push(this.tmp.last_cite_locale),this.tmp.issued_date&&this.tmp.renders_collection_number){for(var i=[],n=this.tmp.issued_date.list.length-1;n>this.tmp.issued_date.pos;n+=-1)i.push(this.tmp.issued_date.list.pop());for(this.tmp.issued_date.list.pop(),n=i.length-1;n>-1;n+=-1)this.tmp.issued_date.list.push(i.pop())}this.tmp.issued_date=!1,this.tmp.renders_collection_number=!1};m.Engine.prototype.makeBibliography=function(e){var t,n,r,i,s,a,l,o,p,f,g,u;if(t=!1,!e&&(this.bibliography.opt.exclude_types||this.bibliography.opt.exclude_with_fields)){if(e={exclude:[]},this.bibliography.opt.exclude_types)for(var d in this.bibliography.opt.exclude_types){var v=this.bibliography.opt.exclude_types[d];e.exclude.push({field:"type",value:v})}if(this.bibliography.opt.exclude_with_fields)for(var d in this.bibliography.opt.exclude_with_fields){var h=this.bibliography.opt.exclude_with_fields[d];e.exclude.push({field:h,value:!0})}}if(!this.bibliography.tokens.length)return!1;if(typeof e=="string"&&(this.opt.citation_number_slug=e,e=!1),t){for(a=this.bibliography.tokens.length,l=0;l<a;l+=1)o=this.bibliography.tokens[l],m.debug("bibtok: "+o.name);for(m.debug("---"),a=this.citation.tokens.length,l=0;l<a;l+=1)p=this.citation.tokens[l],m.debug("cittok: "+o.name);for(m.debug("---"),a=this.bibliography_sort.tokens.length,l=0;l<a;l+=1)f=this.bibliography_sort.tokens[l],m.debug("bibsorttok: "+o.name)}n=m.getBibliographyEntries.call(this,e),g=n[0],u=n[1];var S=n[2];for(r={maxoffset:0,entryspacing:this.bibliography.opt["entry-spacing"],linespacing:this.bibliography.opt["line-spacing"],"second-field-align":!1,entry_ids:g,bibliography_errors:this.tmp.bibliography_errors.slice(),done:S},this.bibliography.opt["second-field-align"]&&(r["second-field-align"]=this.bibliography.opt["second-field-align"]),i=0,a=this.registry.reflist.length,l=0;l<a;l+=1)s=this.registry.reflist[l],s.offset>r.maxoffset&&(r.maxoffset=s.offset);return this.bibliography.opt.hangingindent&&(r.hangingindent=this.bibliography.opt.hangingindent),r.bibstart=this.fun.decorate.bibstart,r.bibend=this.fun.decorate.bibend,this.opt.citation_number_slug=!1,[r,u]};m.getBibliographyEntries=function(e){var t,n,r,i,s,a,l,o,p,f,g,u,d,v,h,S,c,_,y,b,T,O,L;t=[],T=[],this.tmp.area="bibliography",this.tmp.root="bibliography",this.tmp.last_rendered_name=!1,this.tmp.bibliography_errors=[],this.tmp.bibliography_pos=0,e&&e.page_start&&e.page_length?n=this.registry.getSortedIds():n=this.refetchItems(this.registry.getSortedIds()),this.tmp.disambig_override=!0;function x(D,G){return D===G}function k(D,G){for(f=G.length,g=0;g<f;g+=1)if(x(D,G[g]))return!0;return!1}function N(D,G){return typeof D=="boolean"||!D?D?!!G:!G:typeof G=="string"?x(D,G):G?k(D,G):!1}_={};var R;if(e&&e.page_start&&e.page_length&&(R=0,e.page_start!==!0))for(h=0,S=n.length;h<S&&(_[n[h]]=!0,e.page_start!=n[h]);h+=1);var I=[],w={};for(this.tmp.container_item_count={},n=n.filter(D=>{var G=D;return D.legislation_id?w[D.legislation_id]?G=!1:w[D.legislation_id]=!0:D.container_id&&(this.tmp.container_item_count[D.container_id]||(this.tmp.container_item_count[D.container_id]=0),this.tmp.container_item_count[D.container_id]++,this.bibliography.opt.consolidate_containers.indexOf(D.type)>-1&&(w[D.container_id]?G=!1:w[D.container_id]=!0)),G}),this.tmp.container_item_pos={},h=0,S=n.length;h<S;h+=1){if(e&&e.page_start&&e.page_length){if(_[n[h]])continue;if(o=this.refetchItem(n[h]),R===e.page_length)break}else if(o=n[h],_[o.id])continue;if(e){if(r=!0,e.include){for(r=!1,O=0,L=e.include.length;O<L;O+=1)if(p=e.include[O],N(p.value,o[p.field])){r=!0;break}}else if(e.exclude){for(i=!1,O=0,L=e.exclude.length;O<L;O+=1)if(p=e.exclude[O],N(p.value,o[p.field])){i=!0;break}i&&(r=!1)}else if(e.select){for(r=!1,s=!0,O=0,L=e.select.length;O<L;O+=1)p=e.select[O],N(p.value,o[p.field])||(s=!1);s&&(r=!0)}if(e.quash){for(s=!0,O=0,L=e.quash.length;O<L;O+=1)p=e.quash[O],N(p.value,o[p.field])||(s=!1);s&&(r=!1)}if(!r)continue}if(v&&m.debug("BIB: "+o.id),o.container_id&&(this.tmp.container_item_pos[o.container_id]||(this.tmp.container_item_pos[o.container_id]=0),this.tmp.container_item_pos[o.container_id]++),a=new m.Token("group",m.START),a.decorations=[["@bibliography","entry"]].concat(this.bibliography.opt.layout_decorations),this.output.startTag("bib_entry",a),o.system_id&&this.sys.embedBibliographyEntry?this.output.current.value().item_id=o.system_id:this.output.current.value().system_id=o.id,d=[],this.registry.registry[o.id].master&&!(e&&e.page_start&&e.page_length)){y=[[o,{id:o.id}]],c=this.registry.registry[o.id].siblings;for(var O=0,L=c.length;O<L;O++)y.push([this.refetchItem(c[O]),{id:c[O]}]);for(this.parallel.StartCitation(y),this.registry.registry[o.id].parallel_delimiter_override?this.output.queue[0].strings.delimiter=this.registry.registry[o.id].parallel_delimiter_override:this.output.queue[0].strings.delimiter=", ",this.tmp.term_predecessor=!1,this.tmp.cite_index=0,O=0,L=y.length;O<L;O+=1)O<y.length-1?this.tmp.parallel_and_not_last=!0:delete this.tmp.parallel_and_not_last,d.push(""+m.getCite.call(this,y[O][0],y[O][1])),this.tmp.cite_index++,_[y[O][0].id]=!0}else this.registry.registry[o.id].siblings||(this.tmp.term_predecessor=!1,this.tmp.cite_index=0,d.push(""+m.getCite.call(this,o)),e&&e.page_start&&e.page_length&&(R+=1));for(T.push(""),this.tmp.bibliography_pos+=1,I.push(d),this.output.endTag("bib_entry"),this.output.queue[0].blobs.length&&this.output.queue[0].blobs[0].blobs.length&&(this.output.queue[0].blobs[0].blobs[0].strings?u=this.output.queue[0].blobs[0].blobs:u=this.output.queue[0].blobs,u[0].strings.prefix=this.bibliography.opt.layout_prefix+u[0].strings.prefix),O=0,L=this.output.queue.length;O<L;O+=1)m.Output.Queue.purgeEmptyBlobs(this.output.queue[O]);for(O=0,L=this.output.queue.length;O<L;O+=1)this.output.adjust.upward(this.output.queue[O]),this.output.adjust.leftward(this.output.queue[O]),this.output.adjust.downward(this.output.queue[O],!0),this.output.adjust.fix(this.output.queue[O]);if(l=this.output.string(this,this.output.queue)[0],!l&&this.opt.update_mode===m.NUMERIC){var A=t.length+1+". [CSL STYLE ERROR: reference with no printed form.]";l=m.Output.Formats[this.opt.mode]["@bibliography/entry"](this,A)}l&&t.push(l)}var C=!1;if(e&&e.page_start&&e.page_length){var j=n.slice(-1)[0],U=I.slice(-1)[0];(!j||!U||j==U)&&(C=!0)}return this.tmp.disambig_override=!1,[I,t,C]};m.Engine.prototype.setCitationId=function(e,t){var n,r,i;if(n=!1,!e.citationID||t){for(r=Math.floor(Math.random()*1e14);;){if(i=0,this.registry.citationreg.citationById[r])!i&&r<5e13?i=1:i=-1;else{e.citationID="a"+r.toString(32);break}i===1?r+=1:r+=-1}n=""+r}return this.registry.citationreg.citationById[e.citationID]=e,n};m.Engine.prototype.rebuildProcessorState=function(e,t,n){e||(e=[]),t||(t="html");for(var r={},i=[],s=0,a=e.length;s<a;s+=1)for(var l=0,o=e[s].citationItems.length;l<o;l+=1){var p=""+e[s].citationItems[l].id;r[p]||i.push(p),r[p]=!0}this.updateItems(i);var f=[],g=[],u=[],d=this.opt.mode;this.setOutputFormat(t);for(var s=0,a=e.length;s<a;s+=1){var v=this.processCitationCluster(e[s],f,g,m.ASSUME_ALL_ITEMS_REGISTERED);f.push([e[s].citationID,e[s].properties.noteIndex]);for(var l=0,o=v[1].length;l<o;l+=1){var h=v[1][l][0];u[h]=[f[h][0],f[h][1],v[1][l][1]]}}return this.updateUncitedItems(n),this.setOutputFormat(d),u};m.Engine.prototype.restoreProcessorState=function(e){var t,n,r,i,s,a,l,o,p,f;o=[],p=[],e||(e=[]);var g=[],u={};for(t=0,n=e.length;t<n;t+=1)u[e[t].citationID]&&this.setCitationId(e[t],!0),u[e[t].citationID]=!0,g.push(e[t].properties.index);var d=e.slice();for(d.sort(function(h,S){return h.properties.index<S.properties.index?-1:h.properties.index>S.properties.index?1:0}),t=0,n=d.length;t<n;t+=1)d[t].properties.index=t;for(t=0,n=d.length;t<n;t+=1){for(f=[],r=0,i=d[t].citationItems.length;r<i;r+=1)s=d[t].citationItems[r],typeof s.sortkeys>"u"&&(s.sortkeys=[]),a=this.retrieveItem(""+s.id),l=[a,s],f.push(l),d[t].citationItems[r].item=a,p.push(""+s.id);d[t].properties.unsorted||f.sort(this.citation.srt.compareCompositeKeys),d[t].sortedItems=f,this.registry.citationreg.citationById[d[t].citationID]=d[t]}for(this.updateItems(p),t=0,n=e.length;t<n;t+=1)o.push([""+e[t].citationID,e[t].properties.noteIndex]);var v=[];return e&&e.length?v=this.processCitationCluster(e[0],[],o.slice(1)):(this.registry=new m.Registry(this),this.tmp=new m.Engine.Tmp,this.disambiguate=new m.Disambiguation(this)),v};m.Engine.prototype.updateItems=function(e,t,n,r){var i=!1,s=this.tmp.area,a=this.tmp.root,l=this.tmp.extension;if(this.bibliography_sort.tokens.length===0&&(t=!0),this.tmp.area="citation",this.tmp.root="citation",this.tmp.extension="",r||(this.tmp.loadedItemIDs={}),i&&m.debug("--> init <--"),this.registry.init(e),n)for(var o in this.registry.ambigcites)this.registry.ambigsTouched[o]=!0;return this.registry.dodeletes(this.registry.myhash),this.registry.doinserts(this.registry.mylist),this.registry.dorefreshes(),this.registry.rebuildlist(t),this.registry.setsortkeys(),this.registry.setdisambigs(),this.registry.sorttokens(t),this.registry.renumber(),this.tmp.extension=l,this.tmp.area=s,this.tmp.root=a,this.registry.getSortedIds()};m.Engine.prototype.updateUncitedItems=function(e,t){var n,r=this.tmp.area,i=this.tmp.root,s=this.tmp.extension;if(this.bibliography_sort.tokens.length===0&&(t=!0),this.tmp.area="citation",this.tmp.root="citation",this.tmp.extension="",this.tmp.loadedItemIDs={},e||(e=[]),typeof e=="object"){if(typeof e.length>"u"){n=e,e=[];for(var a in n)e.push(a)}else if(typeof e.length=="number"){n={};for(var l=0,o=e.length;l<o;l+=1)n[e[l]]=!0}}return this.registry.init(e,!0),this.registry.dopurge(n),this.registry.doinserts(this.registry.mylist),this.registry.dorefreshes(),this.registry.rebuildlist(t),this.registry.setsortkeys(),this.registry.setdisambigs(),this.registry.sorttokens(t),this.registry.renumber(),this.tmp.extension=s,this.tmp.area=r,this.tmp.root=i,this.registry.getSortedIds()};m.localeResolve=function(e,t){var n,r;return t||(t="en-US"),e||(e=t),n={},r=e.split(/[\-_]/),n.base=m.LANG_BASES[r[0]],typeof n.base>"u"?{base:t,best:e,bare:r[0]}:(r.length===1&&(n.generic=!0),r.length===1||r[1]==="x"?n.best=n.base.replace("_","-"):n.best=r.slice(0,2).join("-"),n.base=n.base.replace("_","-"),n.bare=r[0],n)};m.Engine.prototype.localeConfigure=function(e,t){var n;if(!(t&&this.locale[e.best])&&(e.best==="en-US"?(n=m.setupXml(this.sys.retrieveLocale("en-US")),this.localeSet(n,"en-US",e.best)):e.best!=="en-US"&&(e.base!==e.best&&(n=m.setupXml(this.sys.retrieveLocale(e.base)),this.localeSet(n,e.base,e.best)),n=m.setupXml(this.sys.retrieveLocale(e.best)),this.localeSet(n,e.best,e.best)),this.localeSet(this.cslXml,"",e.best),this.localeSet(this.cslXml,e.bare,e.best),e.base!==e.best&&this.localeSet(this.cslXml,e.base,e.best),this.localeSet(this.cslXml,e.best,e.best),typeof this.locale[e.best].terms["page-range-delimiter"]>"u"&&(["fr","pt"].indexOf(e.best.slice(0,2).toLowerCase())>-1?this.locale[e.best].terms["page-range-delimiter"]="-":this.locale[e.best].terms["page-range-delimiter"]="\u2013"),typeof this.locale[e.best].terms["year-range-delimiter"]>"u"&&(this.locale[e.best].terms["year-range-delimiter"]="\u2013"),typeof this.locale[e.best].terms["citation-range-delimiter"]>"u"&&(this.locale[e.best].terms["citation-range-delimiter"]="\u2013"),this.opt.development_extensions.normalize_lang_keys_to_lowercase)){for(var r=["default-locale","locale-sort","locale-translit","locale-translat"],i=0,s=r.length;i<s;i+=1)for(var a=0,l=this.opt[r[i]].length;a<l;a+=1)this.opt[r[i]][a]=this.opt[r[i]][a].toLowerCase();this.opt.lang=this.opt.lang.toLowerCase()}};m.Engine.prototype.localeSet=function(e,t,n){var r,i,s,a,l,o,p,f,g,u,d,v,h,S,c,_;if(t=t.replace("_","-"),n=n.replace("_","-"),this.opt.development_extensions.normalize_lang_keys_to_lowercase&&(t=t.toLowerCase(),n=n.toLowerCase()),this.locale[n]||(this.locale[n]={},this.locale[n].terms={},this.locale[n].opts={},this.locale[n].opts["skip-words"]=m.SKIP_WORDS,this.locale[n].opts["leading-noise-words"]||(this.locale[n].opts["leading-noise-words"]=[]),this.locale[n].dates={},this.locale[n].ord={"1.0.1":!1,keys:{}},this.locale[n]["noun-genders"]={}),i=e.makeXml(),e.nodeNameIs(e.dataObj,"locale"))i=e.dataObj;else{s=e.getNodesByName(e.dataObj,"locale");var y=!1;for(l=0,v=e.numberofnodes(s);l<v;l+=1)if(r=s[l],!y&&e.getAttributeValue(r,"lang","xml")===t)i=r,y=!0;else{var b=e.getAttributeValue(r,"lang","xml"),T=e.getNodesByName(r,"style-options");if(b&&T&&T.length){var O=e.getAttributeValue(T[0],"jurisdiction-preference");O&&(this.locale[b]||(this.locale[b]={opts:{}}),this.locale[b].opts["jurisdiction-preference"]=O.split(/\s+/))}}}for(s=e.getNodesByName(i,"type"),c=0,_=e.numberofnodes(s);c<_;c+=1){var L=s[c],x=e.getAttributeValue(L,"name"),k=e.getAttributeValue(L,"gender");this.opt.gender[x]=k}var N=e.getNodesByName(i,"term","ordinal").length;if(N){for(var R in this.locale[n].ord.keys)delete this.locale[n].terms[R];this.locale[n].ord={"1.0.1":!1,keys:{}}}s=e.getNodesByName(i,"term");var I={"last-digit":{},"last-two-digits":{},"whole-number":{}},w=!1,A={};for(l=0,v=e.numberofnodes(s);l<v;l+=1){if(o=s[l],f=e.getAttributeValue(o,"name"),f==="sub verbo"&&(f="sub-verbo"),f.slice(0,7)==="ordinal"){if(f==="ordinal")w=!0;else{var C=e.getAttributeValue(o,"match"),j=f.slice(8),h=e.getAttributeValue(o,"gender-form");h||(h="neuter"),C||(C="last-two-digits",j.slice(0,1)==="0"&&(C="last-digit")),j.slice(0,1)==="0"&&(j=j.slice(1)),I[C][j]||(I[C][j]={}),I[C][j][h]=f}this.locale[n].ord.keys[f]=!0}typeof this.locale[n].terms[f]>"u"&&(this.locale[n].terms[f]={}),p="long",h=!1,e.getAttributeValue(o,"form")&&(p=e.getAttributeValue(o,"form")),e.getAttributeValue(o,"gender-form")&&(h=e.getAttributeValue(o,"gender-form")),e.getAttributeValue(o,"gender")&&(this.locale[n]["noun-genders"][f]=e.getAttributeValue(o,"gender")),h?(this.locale[n].terms[f][h]={},this.locale[n].terms[f][h][p]=[],S=this.locale[n].terms[f][h],A[f]=!0):(this.locale[n].terms[f][p]=[],S=this.locale[n].terms[f]),e.numberofnodes(e.getNodesByName(o,"multiple"))?(S[p][0]=e.getNodeValue(o,"single"),S[p][0].indexOf("%s")>-1&&(this.opt.hasPlaceholderTerm=!0),S[p][1]=e.getNodeValue(o,"multiple"),S[p][1].indexOf("%s")>-1&&(this.opt.hasPlaceholderTerm=!0)):(S[p]=e.getNodeValue(o),S[p].indexOf("%s")>-1&&(this.opt.hasPlaceholderTerm=!0))}if(this.locale[n].terms.supplement||(this.locale[n].terms.supplement={}),this.locale[n].terms.supplement.long||(this.locale[n].terms.supplement.long=["supplement","supplements"]),w){for(var U in A){var D={},G=0;for(var B in this.locale[n].terms[U])["masculine","feminine"].indexOf(B)>-1?D[B]=this.locale[n].terms[U][B]:G+=1;if(!G){if(D.feminine)for(var B in D.feminine)this.locale[n].terms[U][B]=D.feminine[B];else if(D.masculine)for(var B in D.masculine)this.locale[n].terms[U][B]=D.masculine[B]}}this.locale[n].ord["1.0.1"]=I}for(f in this.locale[n].terms)for(c=0,_=2;c<_;c+=1)if(h=m.GENDERS[c],this.locale[n].terms[f][h])for(p in this.locale[n].terms[f])this.locale[n].terms[f][h][p]||(this.locale[n].terms[f][h][p]=this.locale[n].terms[f][p]);for(s=e.getNodesByName(i,"style-options"),l=0,v=e.numberofnodes(s);l<v;l+=1){g=s[l],a=e.attributes(g);for(d in a)if(a.hasOwnProperty(d)){if(d==="@punctuation-in-quote"||d==="@limit-day-ordinals-to-day-1")a[d]==="true"?this.locale[n].opts[d.slice(1)]=!0:this.locale[n].opts[d.slice(1)]=!1;else if(d==="@jurisdiction-preference"){var E=a[d].split(/\s+/);this.locale[n].opts[d.slice(1)]=E}else if(d==="@skip-words"){var M=a[d].split(/\s*,\s*/);this.locale[n].opts[d.slice(1)]=M}else if(d==="@leading-noise-words"){var F=a[d].split(/\s*,\s*/);this.locale[n].opts["leading-noise-words"]=F}else if(d==="@name-as-sort-order"){this.locale[n].opts["name-as-sort-order"]={};for(var P=a[d].split(/\s+/),c=0,_=P.length;c<_;c+=1)this.locale[n].opts["name-as-sort-order"][P[c]]=!0}else if(d==="@name-as-reverse-order"){this.locale[n].opts["name-as-reverse-order"]={};for(var P=a[d].split(/\s+/),c=0,_=P.length;c<_;c+=1)this.locale[n].opts["name-as-reverse-order"][P[c]]=!0}else if(d==="@name-never-short"){this.locale[n].opts["name-never-short"]={};for(var P=a[d].split(/\s+/),c=0,_=P.length;c<_;c+=1)this.locale[n].opts["name-never-short"][P[c]]=!0}}}for(s=e.getNodesByName(i,"date"),l=0,v=e.numberofnodes(s);l<v;l+=1){var u=s[l];this.locale[n].dates[e.getAttributeValue(u,"form")]=u}m.SET_COURT_CLASSES(this,n,e,i)};m.getLocaleNames=function(e,t){var n=m.setupXml(e);function r(g,u){var d=["base","best"];if(u)for(var v=m.localeResolve(u),h=0,S=d.length;h<S;h++)v[d[h]]&&g.indexOf(v[d[h]])===-1&&g.push(v[d[h]])}var i=["en-US"];function s(g){for(var u=n.getNodesByName(n.dataObj,g),d=0,v=u.length;d<v;d++){var h=n.getAttributeValue(u[d],"locale");if(h){h=h.split(/ +/);for(var S=0,c=h.length;S<c;S++)this.extendLocaleList(i,h[S])}}}r(i,t);var a=n.getNodesByName(n.dataObj,"style")[0],l=n.getAttributeValue(a,"default-locale");r(i,l);for(var o=["layout","if","else-if","condition"],p=0,f=o.length;p<f;p++)s(n,i,o[p]);return i};m.Node={};m.Node.bibliography={build:function(e,t){if(this.tokentype===m.START){e.build.area="bibliography",e.build.root="bibliography",e.build.extension="";var n=function(r){r.tmp.area="bibliography",r.tmp.root="bibliography",r.tmp.extension=""};this.execs.push(n)}t.push(this)}};m.Node.choose={build:function(e,t){var n;this.tokentype===m.START&&(n=function(r){r.tmp.jump.push(void 0,m.LITERAL)}),this.tokentype===m.END&&(n=function(r){r.tmp.jump.pop()}),this.execs.push(n),t.push(this)},configure:function(e,t){this.tokentype===m.END?(e.configure.fail.push(t),e.configure.succeed.push(t)):(e.configure.fail.pop(),e.configure.succeed.pop())}};m.Node.citation={build:function(e,t){if(this.tokentype===m.START){e.build.area="citation",e.build.root="citation",e.build.extension="";var n=function(i){i.tmp.area="citation",i.tmp.root="citation",i.tmp.extension=""};this.execs.push(n)}if(this.tokentype===m.END){if(e.opt.grouped_sort=e.opt.xclass==="in-text"&&e.citation.opt.collapse&&e.citation.opt.collapse.length||e.citation.opt.cite_group_delimiter&&e.citation.opt.cite_group_delimiter.length&&e.opt.update_mode!==m.POSITION&&e.opt.update_mode!==m.NUMERIC,e.opt.grouped_sort&&e.citation_sort.opt.sort_directions.length){var r=e.citation_sort.opt.sort_directions[0].slice();e.citation_sort.opt.sort_directions=[r].concat(e.citation_sort.opt.sort_directions)}e.citation.srt=new m.Registry.Comparifier(e,"citation_sort")}t.push(this)}};m.Node["#comment"]={build:function(){}};m.Node.date={build:function(e,t){var n,r,i,s,a,l,o,p,f,g;(this.tokentype===m.START||this.tokentype===m.SINGLETON)&&(e.dateput.string(e,e.dateput.queue),e.tmp.date_token=m.Util.cloneToken(this),e.tmp.date_token.strings.prefix="",e.tmp.date_token.strings.suffix="",e.dateput.openLevel(this),e.build.date_parts=[],e.build.date_variables=this.variables,e.build.extension||m.Util.substituteStart.call(this,e,t),e.build.extension?n=m.dateMacroAsSortKey:n=function(u,d,v){var h;if(u.tmp.element_rendered_ok=!1,u.tmp.donesies=[],u.tmp.dateparts=[],h=[],this.variables.length&&!(u.tmp.just_looking&&this.variables[0]==="accessed")){for(r=d[this.variables[0]],typeof r>"u"&&(r={"date-parts":[[0]]},u.opt.development_extensions.locator_date_and_revision&&v&&this.variables[0]==="locator-date"&&v["locator-date"]&&(r=v["locator-date"])),u.tmp.date_object=r,i=this.dateparts.length,s=0;s<i;s+=1)a=this.dateparts[s],(typeof u.tmp.date_object[a+"_end"]<"u"||a==="month"&&typeof u.tmp.date_object.season_end<"u")&&h.push(a);for(l=[],o=["year","month","day"],i=o.length,s=0;s<i;s+=1)h.indexOf(o[s])>-1&&l.push(o[s]);for(h=l.slice(),p=2,i=h.length,s=0;s<i;s+=1)if(a=h[s],f=u.tmp.date_object[a],g=u.tmp.date_object[a+"_end"],f!==g){p=s;break}u.tmp.date_collapse_at=h.slice(p)}else u.tmp.date_object=!1},this.execs.push(n),n=function(u,d){if(d[this.variables[0]]&&(u.output.startTag("date",this),this.variables[0]==="issued"&&(d.type==="legal_case"||d.type==="legislation")&&u.opt.disable_duplicate_year_suppression.indexOf(d.country)===-1&&!u.tmp.extension&&""+d["collection-number"]==""+u.tmp.date_object.year&&this.dateparts.length===1&&this.dateparts[0]==="year")){for(var v in u.tmp.date_object)if(u.tmp.date_object.hasOwnProperty(v)&&v.slice(0,4)==="year"){u.tmp.issued_date={};var h=u.output.current.mystack.slice(-2)[0].blobs;u.tmp.issued_date.list=h,u.tmp.issued_date.pos=h.length-1}}},this.execs.push(n)),!e.build.extension&&(this.tokentype===m.END||this.tokentype===m.SINGLETON)&&(n=function(u,d){d[this.variables[0]]&&u.output.endTag()},this.execs.push(n)),t.push(this),(this.tokentype===m.END||this.tokentype===m.SINGLETON)&&(e.build.extension||m.Util.substituteEnd.call(this,e,t))}};m.Node["date-part"]={build:function(e,t){var n,r,i,s,a,l,o,p,f,g,u,d,v,h,S,c,_,y,b,T,O,L,x;this.strings.form||(this.strings.form="long"),e.build.date_parts.push(this.strings.name);var k=e.build.date_variables[0];function N(R,I,w){if(!w)return w;if(w=""+m.Util.Dates[this.strings.name][R](e,w,I,this.default_locale),this.strings.name==="month"){if(e.tmp.strip_periods)w=w.replace(/\./g,"");else for(var A=0,C=this.decorations.length;A<C;A+=1)if(this.decorations[A][0]==="@strip-periods"&&this.decorations[A][1]==="true"){w=w.replace(/\./g,"");break}}return w}n=function(R,I){if(R.tmp.date_object)R.tmp.probably_rendered_something=!0;else return;var w="";if(s=!0,a="",l="",R.tmp.donesies.push(this.strings.name),R.tmp.date_object.literal&&this.strings.name==="year"&&(w=R.tmp.date_object.literal,R.output.append(R.tmp.date_object.literal,this)),R.tmp.date_object&&(a=R.tmp.date_object[this.strings.name],l=R.tmp.date_object[this.strings.name+"_end"]),this.strings.name==="year"&&a===0&&!R.tmp.suppress_decorations&&(a=!1),o=!R.tmp.suppress_decorations,p=R.tmp.have_collapsed,f=R[R.tmp.area].opt.collapse==="year-suffix"||R[R.tmp.area].opt.collapse==="year-suffix-ranged",g=R.opt["disambiguate-add-year-suffix"],o&&g&&f&&(R.tmp.years_used.push(a),u=R.tmp.last_years_used.length>=R.tmp.years_used.length,u&&p&&R.tmp.last_years_used[R.tmp.years_used.length-1]===a&&(a=!1)),typeof a<"u"){d=!1,v=!1,h=!1,S=!1,this.strings.name==="year"&&(parseInt(a,10)<500&&parseInt(a,10)>0&&(v=R.getTerm("ad")),parseInt(a,10)<0&&(d=R.getTerm("bc"),a=parseInt(a,10)*-1),l&&(parseInt(l,10)<500&&parseInt(l,10)>0&&(S=R.getTerm("ad")),parseInt(l,10)<0&&(h=R.getTerm("bc"),l=parseInt(l,10)*-1)));for(var A=""+R.tmp.date_object.month;A.length<2;)A="0"+A;A="month-"+A;var C=R.locale[R.opt.lang]["noun-genders"][A];if(this.strings.form){var j=this.strings.form,U=this.strings.form;this.strings.name==="day"&&j==="ordinal"&&R.locale[R.opt.lang].opts["limit-day-ordinals-to-day-1"]&&(a!=1&&(j="numeric"),l!=1&&(U="numeric")),a=N.call(this,j,C,a),l=N.call(this,U,C,l)}if(R.output.openLevel("empty"),R.tmp.date_collapse_at.length){for(c=!0,i=R.tmp.date_collapse_at.length,r=0;r<i;r+=1)if(L=R.tmp.date_collapse_at[r],R.tmp.donesies.indexOf(L)===-1){c=!1;break}if(c){if(""+l!="0"){if(R.dateput.queue.length===0&&(s=!0),R.opt["year-range-format"]&&R.opt["year-range-format"]!=="expanded"&&!R.tmp.date_object.day&&!R.tmp.date_object.month&&!R.tmp.date_object.season&&this.strings.name==="year"&&a&&l){l=R.fun.year_mangler(a+"-"+l,!0);var D=R.getTerm("year-range-delimiter");l=l.slice(l.indexOf(D)+1)}w=l,R.dateput.append(l,this),s&&(x=R.dateput.current.value().blobs[0],x&&(x.strings.prefix=""))}w=a,R.output.append(a,this),_=R.output.current.value(),x=_.blobs[_.blobs.length-1],x&&(x.strings.suffix=""),this.strings["range-delimiter"]?R.output.append(this.strings["range-delimiter"]):R.output.append(R.getTerm("year-range-delimiter"),"empty"),R.dateput.closeLevel(),y=R.dateput.current.value(),_.blobs=_.blobs.concat(y),R.dateput.string(R,R.dateput.queue),R.dateput.openLevel(R.tmp.date_token),R.tmp.date_collapse_at=[]}else w=a,R.output.append(a,this),R.tmp.date_collapse_at.indexOf(this.strings.name)>-1&&""+l!="0"&&(R.dateput.queue.length===0&&(s=!0),R.dateput.openLevel("empty"),w=l,R.dateput.append(l,this),s&&(x=R.dateput.current.value().blobs[0],x&&(x.strings.prefix="")),d&&(w=d,R.dateput.append(d)),v&&(w=v,R.dateput.append(v)),R.dateput.closeLevel())}else w=a,R.output.append(a,this);d&&(w=d,R.output.append(d)),v&&(w=v,R.output.append(v)),R.output.closeLevel()}else this.strings.name==="month"&&R.tmp.date_object.season&&(a=""+R.tmp.date_object.season,a&&a.match(/^[1-4]$/)?(R.tmp.group_context.tip.variable_success=!0,w="winter",R.output.append(R.getTerm("season-0"+a),this)):a&&(w=a,R.output.append(a,this)));R.tmp.value=[],I[k]&&(a||R.tmp.have_collapsed)&&!R.opt.has_year_suffix&&this.strings.name==="year"&&!R.tmp.just_looking&&R.registry.registry[I.id]&&R.registry.registry[I.id].disambig.year_suffix!==!1&&!R.tmp.has_done_year_suffix&&(R.tmp.has_done_year_suffix=!0,w="x",T=parseInt(R.registry.registry[I.id].disambig.year_suffix,10),b=new m.NumericBlob(R,!1,T,this,I.id),this.successor_prefix=R[R.build.area].opt.layout_delimiter,this.splice_prefix=R[R.build.area].opt.layout_delimiter,O=new m.Util.Suffixator(m.SUFFIX_CHARS),b.setFormatter(O),R[R.tmp.area].opt.collapse==="year-suffix-ranged"&&(b.range_prefix=R.getTerm("citation-range-delimiter")),R[R.tmp.area].opt.cite_group_delimiter?b.successor_prefix=R[R.tmp.area].opt.cite_group_delimiter:R[R.tmp.area].opt["year-suffix-delimiter"]?b.successor_prefix=R[R.tmp.area].opt["year-suffix-delimiter"]:b.successor_prefix=R[R.tmp.area].opt.layout_delimiter,b.UGLY_DELIMITER_SUPPRESS_HACK=!0,R.output.append(b,"literal")),w&&!R.tmp.group_context.tip.condition&&(R.tmp.just_did_number=w.match(/[0-9]$/),R.output.current.tip.strings.suffix&&(R.tmp.just_did_number=!1))},this.execs.push(n),t.push(this)}};m.Node["else-if"]={build:function(e,t){m.Conditions.TopNode.call(this,e,t),t.push(this)},configure:function(e,t){m.Conditions.Configure.call(this,e,t)}};m.Node.else={build:function(e,t){t.push(this)},configure:function(e,t){this.tokentype===m.START&&(e.configure.fail[e.configure.fail.length-1]=t)}};m.Node["et-al"]={build:function(e,t){if(e.build.area==="citation"||e.build.area==="bibliography"){var n=function(r){r.tmp.etal_node=this,typeof this.strings.term=="string"&&(r.tmp.etal_term=this.strings.term)};this.execs.push(n)}t.push(this)}};m.Node.group={build:function(e,t,n){var r,i;if(this.realGroup=n,this.tokentype===m.START&&(m.Util.substituteStart.call(this,e,t),e.build.substitute_level.value()&&e.build.substitute_level.replace(e.build.substitute_level.value()+1),this.juris||t.push(this),r=function(u){if(u.output.startTag("group",this),this.strings.label_form_override&&(u.tmp.group_context.tip.label_form||(u.tmp.group_context.tip.label_form=this.strings.label_form_override)),this.strings.label_capitalize_if_first_override&&(u.tmp.group_context.tip.label_capitalize_if_first||(u.tmp.group_context.tip.label_capitalize_if_first=this.strings.label_capitalize_if_first_override)),this.realGroup){u.tmp.group_context.tip.condition&&m.UPDATE_GROUP_CONTEXT_CONDITION(u,this.strings.prefix,null,this);var d=!1,v=!1;u.tmp.group_context.mystack.length&&(u.output.current.value().parent=u.tmp.group_context.tip.output_tip);var h=u.tmp.group_context.tip.label_form;h||(h=this.strings.label_form_override);var S=u.tmp.group_context.tip.label_capitalize_if_first;S||(S=this.strings.label_capitalize_if_first),u.tmp.group_context.tip.condition?(d=u.tmp.group_context.tip.condition,v=u.tmp.group_context.tip.force_suppress):this.strings.reject?d={test:this.strings.reject,not:!0}:this.strings.require&&(d={test:this.strings.require,not:!1});var c={old_term_predecessor:u.tmp.term_predecessor,term_intended:!1,variable_attempt:!1,variable_success:!1,variable_success_parent:u.tmp.group_context.tip.variable_success,output_tip:u.output.current.tip,label_form:h,label_static:u.tmp.group_context.tip.label_static,label_capitalize_if_first:S,parallel_delimiter_override:this.strings.set_parallel_delimiter_override,parallel_delimiter_override_on_suppress:this.strings.set_parallel_delimiter_override_on_suppress,condition:d,force_suppress:v,done_vars:u.tmp.group_context.tip.done_vars.slice()};if(this.non_parallel){var _=u.tmp.group_context.tip.non_parallel;_||(_={}),Object.assign(_,this.non_parallel),c.non_parallel=_}if(this.parallel_first){var y=u.tmp.group_context.tip.parallel_first;y||(y={}),Object.assign(y,this.parallel_first),c.parallel_first=y}if(this.parallel_last){var b=u.tmp.group_context.tip.parallel_last;b||(b={}),Object.assign(b,this.parallel_last),c.parallel_last=b}if(u.tmp.abbrev_trimmer&&u.tmp.abbrev_trimmer.LAST_TO_FIRST&&c.parallel_last){c.parallel_first||(c.parallel_first={});for(var T in u.tmp.abbrev_trimmer.LAST_TO_FIRST)c.parallel_last[T]&&(c.parallel_first[T]=!0,delete c.parallel_last[T])}if(u.tmp.group_context.push(c),u.tmp.abbrev_trimmer&&this.parallel_last_to_first){u.tmp.abbrev_trimmer.LAST_TO_FIRST||(u.tmp.abbrev_trimmer.LAST_TO_FIRST={});for(var T in this.parallel_last_to_first)u.tmp.abbrev_trimmer.LAST_TO_FIRST[T]=!0}}},i=[],i.push(r),this.execs=i.concat(this.execs),this.strings["has-publisher-and-publisher-place"]&&(e.build["publisher-special"]=!0,this.strings["subgroup-delimiter"]&&(r=function(u,d){if(d.publisher&&d["publisher-place"]){var v=d.publisher.split(/;\s*/),h=d["publisher-place"].split(/;\s*/);v.length>1&&v.length===h.length&&(u.publisherOutput=new m.PublisherOutput(u,this),u.publisherOutput["publisher-list"]=v,u.publisherOutput["publisher-place-list"]=h)}},this.execs.push(r))),this.juris)){var s=new m.Token("choose",m.START);m.Node.choose.build.call(s,e,t);var a=new m.Token("if",m.START);r=function(u){return function(d,v){return m.INIT_JURISDICTION_MACROS(e,d,v,u)}}(this.juris),a.tests||(a.tests=[]),a.tests.push(r),a.test=e.fun.match.any(a,e,a.tests),t.push(a);var l=new m.Token("text",m.SINGLETON);r=function(u,d,v){var h=d;v&&v["best-jurisdiction"]&&this.juris==="juris-locator"&&(h=v);var S=0;if(u.juris[h["best-jurisdiction"]][this.juris])for(;S<u.juris[h["best-jurisdiction"]][this.juris].length;)S=m.tokenExec.call(u,u.juris[h["best-jurisdiction"]][this.juris][S],d,v)},l.juris=this.juris,l.execs.push(r),t.push(l);var o=new m.Token("if",m.END);m.Node.if.build.call(o,e,t);var p=new m.Token("else",m.START);m.Node.else.build.call(p,e,t)}if(this.tokentype===m.END&&(e.build["publisher-special"]&&(e.build["publisher-special"]=!1,r=function(u){u.publisherOutput&&(u.publisherOutput.render(),u.publisherOutput=!1)},this.execs.push(r)),r=function(u,d,v){if(u.tmp.group_context.tip.condition||u.output.current.tip.strings.suffix&&(u.tmp.just_did_number=!1),u.output.endTag(),this.realGroup){var h=u.tmp.group_context.pop();if(h.parallel_delimiter_override&&(u.tmp.group_context.tip.parallel_delimiter_override=h.parallel_delimiter_override,!u.tmp.just_looking&&u.registry.registry[d.id].master&&(u.registry.registry[d.id].parallel_delimiter_override=h.parallel_delimiter_override)),h.parallel_delimiter_override_on_suppress&&(u.tmp.group_context.tip.parallel_delimiter_override_on_suppress=h.parallel_delimiter_override_on_suppress),u.tmp.area==="bibliography_sort"){var S=h.done_vars.indexOf("citation-number");this.strings.sort_direction&&S>-1&&u.tmp.group_context.length()==1&&(this.strings.sort_direction===m.DESCENDING?u.bibliography_sort.opt.citation_number_sort_direction=m.DESCENDING:u.bibliography_sort.opt.citation_number_sort_direction=m.ASCENDING,h.done_vars=h.done_vars.slice(0,S).concat(h.done_vars.slice(S+1)))}if(h.condition&&(h.force_suppress=m.EVALUATE_GROUP_CONDITION(u,h)),u.tmp.group_context.tip.condition&&(u.tmp.group_context.tip.force_suppress=h.force_suppress),!h.force_suppress&&(h.variable_success||h.term_intended&&!h.variable_attempt)){this.isJurisLocatorLabel||(u.tmp.group_context.tip.variable_success=!0);var c=u.output.current.value().blobs,_=u.output.current.value().blobs.length-1;if(!u.tmp.just_looking&&(h.non_parallel||h.parallel_last||h.parallel_first||h.parallel_delimiter_override||h.parallel_delimiter_override_on_suppress)){var y=u.parallel.checkRepeats(h);if(y&&c&&c.pop(),u.tmp.cite_index>0&&(y||!h.parallel_first&&!h.parallel_last&&!h.non_parallel)){var b=u.tmp.suppress_repeats[u.tmp.cite_index-1];y&&h.parallel_delimiter_override_on_suppress&&(b.SIBLING||b.ORPHAN)?u.output.queue.slice(-1)[0].parallel_delimiter=h.parallel_delimiter_override_on_suppress:h.parallel_delimiter_override&&b.SIBLING&&(u.output.queue.slice(-1)[0].parallel_delimiter=h.parallel_delimiter_override)}}}else{if(u.tmp.term_predecessor=h.old_term_predecessor,u.tmp.group_context.tip.variable_attempt=h.variable_attempt,h.force_suppress&&!u.tmp.group_context.tip.condition&&(u.tmp.group_context.tip.variable_attempt=!0,u.tmp.group_context.tip.variable_success=h.variable_success_parent),h.force_suppress)for(var T=0,O=h.done_vars.length;T<O;T++)for(var L=h.done_vars[T],x=0,k=u.tmp.done_vars.length;x<k;x++)u.tmp.done_vars[x]===L&&(u.tmp.done_vars=u.tmp.done_vars.slice(0,x).concat(u.tmp.done_vars.slice(x+1)));u.output.current.value().blobs&&u.output.current.value().blobs.pop()}}},this.execs.push(r),this.juris)){var f=new m.Token("else",m.END);m.Node.else.build.call(f,e,t);var g=new m.Token("choose",m.END);m.Node.choose.build.call(g,e,t)}this.tokentype===m.END&&(this.juris||t.push(this),e.build.substitute_level.value()&&e.build.substitute_level.replace(e.build.substitute_level.value()-1),m.Util.substituteEnd.call(this,e,t))}};m.Node.if={build:function(e,t){m.Conditions.TopNode.call(this,e,t),t.push(this)},configure:function(e,t){m.Conditions.Configure.call(this,e,t)}};m.Node.conditions={build:function(e){this.tokentype===m.START&&e.tmp.conditions.addMatch(this.match),this.tokentype===m.END&&e.tmp.conditions.matchCombine()}};m.Node.condition={build:function(e){if(this.tokentype===m.SINGLETON){var t=e.fun.match[this.match](this,e,this.tests);e.tmp.conditions.addTest(t)}}};m.Conditions={};m.Conditions.TopNode=function(e){var t;(this.tokentype===m.START||this.tokentype===m.SINGLETON)&&(this.locale&&(e.opt.lang=this.locale),!this.tests||!this.tests.length?e.tmp.conditions=new m.Conditions.Engine(e,this):this.test=e.fun.match[this.match](this,e,this.tests),e.build.substitute_level.value()===0&&(t=function(n){n.tmp.condition_counter++},this.execs.push(t))),(this.tokentype===m.END||this.tokentype===m.SINGLETON)&&(e.build.substitute_level.value()===0&&(t=function(n){if(n.tmp.condition_counter--,n.tmp.condition_lang_counter_arr.length>0){var r=n.tmp.condition_lang_counter_arr.slice(-1)[0];r===n.tmp.condition_counter&&(n.opt.lang=n.tmp.condition_lang_val_arr.pop(),n.tmp.condition_lang_counter_arr.pop())}this.locale_default&&(n.output.current.value().old_locale=this.locale_default,n.output.closeLevel("empty"),n.opt.lang=this.locale_default)},this.execs.push(t)),t=function(n){var r=this[n.tmp.jump.value()];return r},this.execs.push(t),this.locale_default&&(e.opt.lang=this.locale_default))};m.Conditions.Configure=function(e,t){this.tokentype===m.START?(this.fail=e.configure.fail.slice(-1)[0],this.succeed=this.next,e.configure.fail[e.configure.fail.length-1]=t):this.tokentype===m.SINGLETON?(this.fail=this.next,this.succeed=e.configure.succeed.slice(-1)[0],e.configure.fail[e.configure.fail.length-1]=t):(this.succeed=e.configure.succeed.slice(-1)[0],this.fail=this.next)};m.Conditions.Engine=function(e,t){this.token=t,this.state=e};m.Conditions.Engine.prototype.addTest=function(e){this.token.tests||(this.token.tests=[]),this.token.tests.push(e)};m.Conditions.Engine.prototype.addMatch=function(e){this.token.match=e};m.Conditions.Engine.prototype.matchCombine=function(){this.token.test=this.state.fun.match[this.token.match](this.token,this.state,this.token.tests)};m.Node.info={build:function(e){this.tokentype===m.START?e.build.skip="info":e.build.skip=!1}};m.Node.institution={build:function(e,t){if([m.SINGLETON,m.START].indexOf(this.tokentype)>-1){var n=function(r){typeof this.strings.delimiter=="string"?r.tmp.institution_delimiter=this.strings.delimiter:r.tmp.institution_delimiter=r.tmp.name_delimiter,r.inheritOpt(this,"and")==="text"?this.and_term=r.getTerm("and","long",0):r.inheritOpt(this,"and")==="symbol"?r.opt.development_extensions.expect_and_symbol_form?this.and_term=r.getTerm("and","symbol",0):this.and_term="&":r.inheritOpt(this,"and")==="none"&&(this.and_term=r.tmp.institution_delimiter),typeof this.and_term>"u"&&r.tmp.and_term&&(this.and_term=r.tmp.and_term),m.STARTSWITH_ROMANESQUE_REGEXP.test(this.and_term)?(this.and_prefix_single=" ",this.and_prefix_multiple=", ",typeof r.tmp.institution_delimiter=="string"&&(this.and_prefix_multiple=r.tmp.institution_delimiter),this.and_suffix=" "):(this.and_prefix_single="",this.and_prefix_multiple="",this.and_suffix=""),r.inheritOpt(this,"delimiter-precedes-last")==="always"?this.and_prefix_single=r.tmp.institution_delimiter:r.inheritOpt(this,"delimiter-precedes-last")==="never"&&this.and_prefix_multiple&&(this.and_prefix_multiple=" "),this.and={},typeof this.and_term<"u"?(r.output.append(this.and_term,"empty",!0),this.and.single=r.output.pop(),this.and.single.strings.prefix=this.and_prefix_single,this.and.single.strings.suffix=this.and_suffix,r.output.append(this.and_term,"empty",!0),this.and.multiple=r.output.pop(),this.and.multiple.strings.prefix=this.and_prefix_multiple,this.and.multiple.strings.suffix=this.and_suffix):this.strings.delimiter!=="undefined"&&(this.and.single=new m.Blob(r.tmp.institution_delimiter),this.and.single.strings.prefix="",this.and.single.strings.suffix="",this.and.multiple=new m.Blob(r.tmp.institution_delimiter),this.and.multiple.strings.prefix="",this.and.multiple.strings.suffix=""),r.nameOutput.institution=this};this.execs.push(n)}t.push(this)},configure:function(e){[m.SINGLETON,m.START].indexOf(this.tokentype)>-1&&(e.build.has_institution=!0)}};m.Node["institution-part"]={build:function(e,t){var n;this.strings.name==="long"?this.strings["if-short"]?n=function(r){r.nameOutput.institutionpart["long-with-short"]=this}:n=function(r){r.nameOutput.institutionpart.long=this}:this.strings.name==="short"&&(n=function(r){r.nameOutput.institutionpart.short=this}),this.execs.push(n),t.push(this)}};m.Node.key={build:function(e,t){t=e[e.build.root+"_sort"].tokens;var n,r=!1,i=new m.Token("key",m.START);e.tmp.root=e.build.root,i.strings["et-al-min"]=e.inheritOpt(this,"et-al-min"),i.strings["et-al-use-first"]=e.inheritOpt(this,"et-al-use-first"),i.strings["et-al-use-last"]=e.inheritOpt(this,"et-al-use-last"),n=function(_){_.tmp.done_vars=[]},i.execs.push(n),n=function(_){_.output.openLevel("empty")},i.execs.push(n);var s=[];if(this.strings.sort_direction===m.DESCENDING?(s.push(1),s.push(-1)):(s.push(-1),s.push(1)),e[e.build.area].opt.sort_directions.push(s),m.DATE_VARIABLES.indexOf(this.variables[0])>-1&&(e.build.date_key=!0),n=function(_){_.tmp.sort_key_flag=!0,_.inheritOpt(this,"et-al-min")&&(_.tmp["et-al-min"]=_.inheritOpt(this,"et-al-min")),_.inheritOpt(this,"et-al-use-first")&&(_.tmp["et-al-use-first"]=_.inheritOpt(this,"et-al-use-first")),typeof _.inheritOpt(this,"et-al-use-last")=="boolean"&&(_.tmp["et-al-use-last"]=_.inheritOpt(this,"et-al-use-last"))},i.execs.push(n),t.push(i),this.variables.length){var a=this.variables[0];if(m.NAME_VARIABLES.indexOf(a)>-1){var l=new m.Token("names",m.START);l.tokentype=m.START,l.variables=this.variables,m.Node.names.build.call(l,e,t);var o=new m.Token("name",m.SINGLETON);o.tokentype=m.SINGLETON,o.strings["name-as-sort-order"]="all",o.strings["sort-separator"]=" ",o.strings["et-al-use-last"]=e.inheritOpt(this,"et-al-use-last"),o.strings["et-al-min"]=e.inheritOpt(this,"et-al-min"),o.strings["et-al-use-first"]=e.inheritOpt(this,"et-al-use-first"),m.Node.name.build.call(o,e,t);var p=new m.Token("institution",m.SINGLETON);p.tokentype=m.SINGLETON,m.Node.institution.build.call(p,e,t);var f=new m.Token("names",m.END);f.tokentype=m.END,m.Node.names.build.call(f,e,t)}else{var g=new m.Token("text",m.SINGLETON);if(g.strings.sort_direction=this.strings.sort_direction,g.dateparts=this.dateparts,m.NUMERIC_VARIABLES.indexOf(a)>-1)a==="citation-number"?n=function(_,y){if(_.tmp.area==="bibliography_sort"&&(this.strings.sort_direction===m.DESCENDING?_.bibliography_sort.opt.citation_number_sort_direction=m.DESCENDING:_.bibliography_sort.opt.citation_number_sort_direction=m.ASCENDING),_.tmp.area==="citation_sort"&&_.bibliography_sort.tmp.citation_number_map)var b=_.bibliography_sort.tmp.citation_number_map[_.registry.registry[y.id].seq];else var b=_.registry.registry[y.id].seq;b&&(b=m.Util.padding(""+b)),_.output.append(b,this)}:n=function(_,y){var b=!1;b=y[a],b&&(b=m.Util.padding(b)),_.output.append(b,this)};else if(a==="citation-label")n=function(_,y){var b=_.getCitationLabel(y);_.output.append(b,this)};else if(m.DATE_VARIABLES.indexOf(a)>-1)n=m.dateAsSortKey,g.variables=this.variables;else if(a==="title"){var u="title",d=!1,v=!1,h=!0;n=e.transform.getOutputFunction(this.variables,u,d,v,h)}else a==="court-class"?n=function(_,y,b){m.INIT_JURISDICTION_MACROS(_,y,b,"juris-main");var T=m.GET_COURT_CLASS(_,y,!0);_.output.append(T,"empty")}:n=function(_,y){var b=y[a];_.output.append(b,"empty")};g.execs.push(n),t.push(g)}}else{var S=new m.Token("text",m.SINGLETON);S.strings.sort_direction=this.strings.sort_direction,S.postponed_macro=this.postponed_macro,m.expandMacro.call(e,S,t)}var c=new m.Token("key",m.END);n=function(_){var y=_.output.string(_,_.output.queue);_.sys.normalizeUnicode&&(y=_.sys.normalizeUnicode(y)),y=y?y.split(" ").join(_.opt.sort_sep)+_.opt.sort_sep:"",r&&m.debug("keystring: "+y+" "+typeof y),y===""&&(y=void 0),typeof y!="string"&&(y=void 0),_[_[_.tmp.area].root+"_sort"].keys.push(y),_.tmp.value=[]},c.execs.push(n),e.build.date_key&&(e.build.area==="citation"&&e.build.extension==="_sort"&&(e[e.build.area].opt.sort_directions.push([-1,1]),n=function(_,y){var b=_.registry.registry[y.id].disambig.year_suffix;b||(b=0);var T=m.Util.padding(""+b);_[_.tmp.area].keys.push(T)},c.execs.push(n)),e.build.date_key=!1),n=function(_){_.tmp["et-al-min"]=void 0,_.tmp["et-al-use-first"]=void 0,_.tmp["et-al-use-last"]=void 0,_.tmp.sort_key_flag=!1},c.execs.push(n),t.push(c)}};m.Node.label={build:function(e,t){if(this.strings.term){var n=function(l,o,p){var f=m.evaluateLabel(this,l,o,p);p&&this.strings.term==="locator"&&(p.section_form_override=this.strings.form),f&&(l.tmp.group_context.tip.term_intended=!0),m.UPDATE_GROUP_CONTEXT_CONDITION(l,f,null,this),f.indexOf("%s")===-1&&(this.strings.capitalize_if_first&&!l.tmp.term_predecessor&&!(l.opt.class==="in-text"&&l.tmp.area==="citation")&&(f=m.Output.Formatters["capitalize-first"](l,f)),l.output.append(f,this))};this.execs.push(n)}else{this.strings.form||(this.strings.form="long");for(var r=e.build.names_variables[e.build.names_variables.length-1],i=e.build.name_label[e.build.name_label.length-1],s=0,a=r.length;s<a;s+=1)i[r[s]]||(i[r[s]]={});if(e.build.name_flag)for(var s=0,a=r.length;s<a;s+=1)i[r[s]].after=this;else for(var s=0,a=r.length;s<a;s+=1)i[r[s]].before=this}t.push(this)}};m.Node.layout={build:function(e,t){var n,r,i,s;function a(){e.build.area==="bibliography"&&(i=new m.Token("text",m.SINGLETON),n=function(p){if(!p.tmp.parallel_and_not_last){var f;p.tmp.cite_affixes[p.tmp.area][p.tmp.last_cite_locale]?f=p.tmp.cite_affixes[p.tmp.area][p.tmp.last_cite_locale].suffix:f=p.bibliography.opt.layout_suffix;var g=p.output.current.value();p.opt.using_display?g.blobs[g.blobs.length-1].strings.suffix=f:g.strings.suffix=f}p.bibliography.opt["second-field-align"]&&p.output.endTag("bib_other")},i.execs.push(n),t.push(i))}this.tokentype===m.START&&(this.locale_raw?e.build.current_default_locale=this.locale_raw:e.build.current_default_locale=e.opt["default-locale"],n=function(p,f,g){if(p.opt.development_extensions.apply_citation_wrapper&&p.sys.wrapCitationEntry&&!p.tmp.just_looking&&f.system_id&&p.tmp.area==="citation"){var u=new m.Token("group",m.START);u.decorations=[["@cite","entry"]],p.output.startTag("cite_entry",u),p.output.current.value().item_id=f.system_id,g&&(p.output.current.value().locator_txt=g.locator_txt,p.output.current.value().suffix_txt=g.suffix_txt)}},this.execs.push(n)),this.tokentype===m.START&&!e.tmp.cite_affixes[e.build.area]&&(n=function(p,f,g){if(p.tmp.done_vars=[],g&&g["author-only"]&&p.tmp.done_vars.push("locator"),p.opt.suppressedJurisdictions[f.country]&&f.country&&["treaty","patent"].indexOf(f.type)===-1&&p.tmp.done_vars.push("country"),!p.tmp.just_looking&&p.registry.registry[f.id]&&p.registry.registry[f.id].parallel&&p.tmp.done_vars.push("first-reference-note-number"),!p.tmp.just_looking&&p.tmp.abbrev_trimmer&&f.jurisdiction)for(var u in p.tmp.abbrev_trimmer.QUASHES[f.jurisdiction])p.tmp.done_vars.push(u);p.tmp.rendered_name=!1},this.execs.push(n),n=function(p){p.tmp.sort_key_flag=!1},this.execs.push(n),n=function(p){p.tmp.nameset_counter=0},this.execs.push(n),n=function(p,f){var g=new m.Token;p.output.openLevel(g)},this.execs.push(n),t.push(this),e.build.area==="citation"&&(r=new m.Token("text",m.SINGLETON),n=function(p,f,g){if(g&&g.prefix){var u=m.checkPrefixSpaceAppend(p,g.prefix);p.tmp.just_looking||(u=p.output.checkNestedBrace.update(u));var d=m.checkIgnorePredecessor(p,u);p.output.append(u,this,!1,d)}},r.execs.push(n),t.push(r)));var l;if(this.locale_raw&&(l=new m.Token("dummy",m.START),l.locale=this.locale_raw,l.strings.delimiter=this.strings.delimiter,l.strings.suffix=this.strings.suffix,e.tmp.cite_affixes[e.build.area]||(e.tmp.cite_affixes[e.build.area]={})),this.tokentype===m.START&&(e.build.layout_flag=!0,this.locale_raw||(e[e.tmp.area].opt.topdecor=[this.decorations],e[e.tmp.area+"_sort"].opt.topdecor=[this.decorations],e[e.build.area].opt.layout_prefix=this.strings.prefix,e[e.build.area].opt.layout_suffix=this.strings.suffix,e[e.build.area].opt.layout_delimiter=this.strings.delimiter,e[e.build.area].opt.layout_decorations=this.decorations,e.tmp.cite_affixes[e.build.area]&&(s=new m.Token("else",m.START),m.Node.else.build.call(s,e,t))),this.locale_raw)){if(e.build.layout_locale_flag)l.name="else-if",m.Attributes["@locale-internal"].call(l,e,this.locale_raw),m.Node["else-if"].build.call(l,e,t);else{var o=new m.Token("choose",m.START);m.Node.choose.build.call(o,e,t),l.name="if",m.Attributes["@locale-internal"].call(l,e,this.locale_raw),m.Node.if.build.call(l,e,t)}e.tmp.cite_affixes[e.build.area][l.locale]={},e.tmp.cite_affixes[e.build.area][l.locale].delimiter=this.strings.delimiter,e.tmp.cite_affixes[e.build.area][l.locale].suffix=this.strings.suffix}this.tokentype===m.END&&(this.locale_raw&&(a(),e.build.layout_locale_flag?(l.name="else-if",l.tokentype=m.END,m.Attributes["@locale-internal"].call(l,e,this.locale_raw),m.Node["else-if"].build.call(l,e,t)):(l.name="if",l.tokentype=m.END,m.Attributes["@locale-internal"].call(l,e,this.locale_raw),m.Node.if.build.call(l,e,t),e.build.layout_locale_flag=!0)),this.locale_raw||(a(),e.tmp.cite_affixes[e.build.area]&&e.build.layout_locale_flag&&(s=new m.Token("else",m.END),m.Node.else.build.call(s,e,t),s=new m.Token("choose",m.END),m.Node.choose.build.call(s,e,t)),e.build_layout_locale_flag=!0,e.build.area==="citation"&&(i=new m.Token("text",m.SINGLETON),n=function(p,f,g){var u;if(g&&g.suffix){var d=m.checkSuffixSpacePrepend(p,g.suffix);p.tmp.just_looking||(d=p.output.checkNestedBrace.update(d)),p.output.append(d,this)}},i.execs.push(n),t.push(i)),n=function(p){p.output.closeLevel()},this.execs.push(n),n=function(p,f){p.opt.development_extensions.apply_citation_wrapper&&p.sys.wrapCitationEntry&&!p.tmp.just_looking&&f.system_id&&p.tmp.area==="citation"&&p.output.endTag()},this.execs.push(n),t.push(this),e.build.layout_flag=!1,e.build.layout_locale_flag=!1))}};m.Node.macro={build:function(){}};m.Node.alternative={build:function(e,t){if(this.tokentype===m.START){var n=new m.Token("choose",m.START);m.Node.choose.build.call(n,e,t);var r=new m.Token("if",m.START);m.Attributes["@alternative-node-internal"].call(r,e),m.Node.if.build.call(r,e,t);var i=function(s,a){if(s.tmp.oldItem=a,s.tmp.oldLang=s.opt.lang,s.tmp.abort_alternative=!0,a["language-name"]&&a["language-name-original"]){var l=JSON.parse(JSON.stringify(a));l.language=l["language-name"];var o=m.localeResolve(l.language,s.opt["default-locale"][0]);if(s.opt.multi_layout)for(var p in s.opt.multi_layout){var f=s.opt.multi_layout[p],g=!1;for(var u in f){var d=f[u];if(o.best===d.best||o.base===d.base||o.bare===d.bare){g=f[0].best;break}}g||(g=s.opt["default-locale"][0]),s.opt.lang=g}for(var v in l)if(["id","type","language","multi"].indexOf(v)===-1&&v.slice(0,4)!=="alt-")if(l.multi&&l.multi._keys[v]){var h=!0;for(var S in l.multi._keys[v])if(o.bare===S.replace(/^([a-zA-Z]+).*/,"$1")){h=!1;break}h&&delete l[v]}else delete l[v];for(var v in l)v.slice(0,4)==="alt-"?(l[v.slice(4)]=l[v],s.tmp.abort_alternative=!1):l.multi&&l.multi._keys&&!l["alt-"+v]&&l.multi._keys[v]&&(l.multi._keys[v][o.best]?(l[v]=l.multi._keys[v][o.best],s.tmp.abort_alternative=!1):l.multi._keys[v][o.base]?(l[v]=l.multi._keys[v][o.base],s.tmp.abort_alternative=!1):l.multi._keys[v][o.bare]&&(l[v]=l.multi._keys[v][o.bare],s.tmp.abort_alternative=!1))}s.output.openLevel(this),s.registry.refhash[a.id]=l,s.nameOutput=new m.NameOutput(s,l)};this.execs.push(i),t.push(this);var n=new m.Token("choose",m.START);m.Node.choose.build.call(n,e,t);var r=new m.Token("if",m.START);m.Attributes["@alternative-node-internal"].call(r,e);var i=function(s){s.tmp.abort_alternative=!0};r.execs.push(i),m.Node.if.build.call(r,e,t)}else if(this.tokentype===m.END){var r=new m.Token("if",m.END);m.Node.if.build.call(r,e,t);var n=new m.Token("choose",m.END);m.Node.choose.build.call(n,e,t);var i=function(o,p){o.output.closeLevel(),o.registry.refhash[p.id]=o.tmp.oldItem,o.opt.lang=o.tmp.oldLang,o.nameOutput=new m.NameOutput(o,o.tmp.oldItem),o.tmp.abort_alternative=!1};this.execs.push(i),t.push(this);var r=new m.Token("if",m.END);m.Node.if.build.call(r,e,t);var n=new m.Token("choose",m.END);m.Node.choose.build.call(n,e,t)}}};m.Node["alternative-text"]={build:function(e,t){if(this.tokentype===m.SINGLETON){var n=function(r,s){var s=r.refetchItem(s.id);m.getCite.call(r,s)};this.execs.push(n)}t.push(this)}};m.NameOutput=function(e,t,n){this.debug=!1,this.state=e,this.debug&&this.state.sys.print("(1)"),this.Item=t,this.item=n,this.nameset_base=0,this.etal_spec={},this._first_creator_variable=!1,this._please_chop=!1};m.NameOutput.prototype.init=function(e){this.requireMatch=e.requireMatch,this.state.tmp.term_predecessor&&(this.state.tmp.subsequent_author_substitute_ok=!1),this.nameset_offset&&(this.nameset_base=this.nameset_base+this.nameset_offset),this.nameset_offset=0,this.names=e,this.variables=e.variables,this.state.tmp.value=[],this.state.tmp.rendered_name=[],this.state.tmp.label_blob=!1,this.state.tmp.etal_node=!1,this.state.tmp.etal_term=!1;for(var t=0,n=this.variables.length;t<n;t+=1)this.Item[this.variables[t]]&&this.Item[this.variables[t]].length&&(this.state.tmp.value=this.state.tmp.value.concat(this.Item[this.variables[t]]));if(this["et-al"]=void 0,this.with=void 0,this.name=void 0,this.institutionpart={},this.state.tmp.group_context.tip.variable_attempt=!0,this.labelVariable=this.variables[0],!!this.state.tmp.value.length){var r=this.checkCommonAuthor(this.requireMatch);if(r){this.state.tmp.can_substitute.pop(),this.state.tmp.can_substitute.push(!0);for(var t in this.variables){var i=this.state.tmp.done_vars.indexOf(this.variables[t]);i>-1&&(this.state.tmp.done_vars=this.state.tmp.done_vars.slice(0,i).concat(this.state.tmp.done_vars.slice(t+1)))}this.state.tmp.common_term_match_fail=!0,this.variables=[]}}};m.NameOutput.prototype.reinit=function(e,t){if(this.requireMatch=e.requireMatch,this.labelVariable=t,this.state.tmp.can_substitute.value()){this.nameset_offset=0,this.variables=e.variables;var n=this.state.tmp.value.slice();this.state.tmp.value=[];for(var r=0,i=this.variables.length;r<i;r+=1)this.Item[this.variables[r]]&&this.Item[this.variables[r]].length&&(this.state.tmp.value=this.state.tmp.value.concat(this.Item[this.variables[r]]));this.state.tmp.value.length&&this.state.tmp.can_substitute.replace(!1,m.LITERAL),this.state.tmp.value=n}var s=this.checkCommonAuthor(this.requireMatch);if(s){this.state.tmp.can_substitute.pop(),this.state.tmp.can_substitute.push(!0);for(var r in this.variables){var a=this.state.tmp.done_vars.indexOf(this.variables[r]);a>-1&&(this.state.tmp.done_vars=this.state.tmp.done_vars.slice(0,a).concat(this.state.tmp.done_vars.slice(r+1)))}this.variables=[]}};m.NameOutput.prototype.outputNames=function(){var e,t,n=this.variables;if(this.institution.and&&((!this.institution.and.single.blobs||!this.institution.and.single.blobs.length)&&(this.institution.and.single.blobs=this.name.and.single.blobs),(!this.institution.and.multiple.blobs||!this.institution.and.multiple.blobs.length)&&(this.institution.and.multiple.blobs=this.name.and.multiple.blobs)),this.variable_offset={},this.family)for(this.family_decor=m.Util.cloneToken(this.family),this.family_decor.strings.prefix="",this.family_decor.strings.suffix="",e=0,t=this.family.execs.length;e<t;e+=1)this.family.execs[e].call(this.family_decor,this.state,this.Item);else this.family_decor=!1;if(this.given)for(this.given_decor=m.Util.cloneToken(this.given),this.given_decor.strings.prefix="",this.given_decor.strings.suffix="",e=0,t=this.given.execs.length;e<t;e+=1)this.given.execs[e].call(this.given_decor,this.state,this.Item);else this.given_decor=!1;if(this.debug&&this.state.sys.print("(2)"),this.getEtAlConfig(),this.debug&&this.state.sys.print("(3)"),this.divideAndTransliterateNames(),this.debug&&this.state.sys.print("(4)"),this.truncatePersonalNameLists(),this.debug&&this.state.sys.print("(5)"),this.debug&&this.state.sys.print("(6)"),this.disambigNames(),this.constrainNames(),this.debug&&this.state.sys.print("(7)"),this.name.strings.form==="count"){(this.state.tmp.extension||this.names_count!=0)&&(this.state.output.append(this.names_count,"empty"),this.state.tmp.group_context.tip.variable_success=!0);return}this.debug&&this.state.sys.print("(8)"),this.setEtAlParameters(),this.debug&&this.state.sys.print("(9)"),this.setCommonTerm(this.requireMatch),this.debug&&this.state.sys.print("(10)"),this.renderAllNames(),this.debug&&this.state.sys.print("(11)");var r=[];for(e=0,t=n.length;e<t;e+=1){var i=n[e],s=[],a=!1,l=null;if(!this.state.opt.development_extensions.spoof_institutional_affiliations)l=this._join([this.freeters[i]],"");else{this.debug&&this.state.sys.print("(11a)");for(var o=0,p=this.institutions[i].length;o<p;o+=1)s.push(this.joinPersonsAndInstitutions([this.persons[i][o],this.institutions[i][o]]));if(this.debug&&this.state.sys.print("(11b)"),this.institutions[i].length){var f=this.nameset_base+this.variable_offset[i];this.freeters[i].length&&(f+=1),a=this.joinInstitutionSets(s,f)}this.debug&&this.state.sys.print("(11c)");var l=this.joinFreetersAndInstitutionSets([this.freeters[i],a]);this.debug&&this.state.sys.print("(11d)")}if(l&&(this.state.tmp.extension||(l=this._applyLabels(l,i)),r.push(l)),this.debug&&this.state.sys.print("(11e)"),this.common_term)break}for(this.debug&&this.state.sys.print("(12)"),this.state.output.openLevel("empty"),this.state.output.current.value().strings.delimiter=this.state.inheritOpt(this.names,"delimiter","names-delimiter"),this.debug&&this.state.sys.print("(13)"),e=0,t=r.length;e<t;e+=1)this.state.output.append(r[e],"literal",!0);!this.state.tmp.just_looking&&r.length>0&&(this.state.tmp.probably_rendered_something=!0),this.debug&&this.state.sys.print("(14)"),this.state.output.closeLevel("empty"),this.debug&&this.state.sys.print("(15)");var g=this.state.output.pop();this.state.tmp.name_node.top=g,this.debug&&this.state.sys.print("(16)");var u=m.Util.cloneToken(this.names);if(this.state.tmp.group_context.tip.condition&&m.UPDATE_GROUP_CONTEXT_CONDITION(this.state,this.names.strings.prefix,null,this.names),this.state.output.append(g,u),this.state.tmp.term_predecessor_name&&(this.state.tmp.term_predecessor=!0),this.debug&&this.state.sys.print("(17)"),this.debug&&this.state.sys.print("(18)"),n[0]!=="authority"){var d=[],v=this.Item[n[0]];if(v)for(var e=0,t=v.length;e<t;e+=1){var h=m.Util.Names.getRawName(v[e]);h&&d.push(h)}d=d.join(", "),d&&(this.state.tmp.name_node.string=d)}if(this.state.tmp.name_node.string&&!this.state.tmp.first_name_string&&(this.state.tmp.first_name_string=this.state.tmp.name_node.string),this.Item.type==="classic"&&this.state.tmp.first_name_string){var S=[];S.push(this.state.tmp.first_name_string),this.Item.title&&S.push(this.Item.title),S=S.join(", "),S&&this.state.sys.getAbbreviation&&(this.state.sys.normalizeAbbrevsKey&&(S=this.state.sys.normalizeAbbrevsKey("classic",S)),this.state.transform.loadAbbreviation("default","classic",S,this.Item.language),this.state.transform.abbrevs.default.classic[S]&&(this.state.tmp.done_vars.push("title"),this.state.output.append(this.state.transform.abbrevs.default.classic[S],"empty",!0),g=this.state.output.pop(),this.state.tmp.name_node.top.blobs.pop(),this.state.tmp.name_node.top.blobs.push(g)))}this._collapseAuthor(),this.variables=[],this.state.tmp.authority_stop_last=0,this.debug&&this.state.sys.print("(19)")};m.NameOutput.prototype._applyLabels=function(e,t){var n;if(!this.label||!this.label[this.labelVariable])return e;var r=0,i=this.freeters_count[t]+this.institutions_count[t];if(i>1)r=1;else{for(var s=0,a=this.persons[t].length;s<a;s+=1)i+=this.persons_count[t][s];i>1&&(r=1)}return this.label[this.labelVariable].before?(typeof this.label[this.labelVariable].before.strings.plural=="number"&&(r=this.label[this.labelVariable].before.strings.plural),n=this._buildLabel(t,r,"before",this.labelVariable),this.state.output.openLevel("empty"),this.state.output.append(n,this.label[this.labelVariable].before,!0),this.state.output.append(e,"literal",!0),this.state.output.closeLevel("empty"),e=this.state.output.pop()):this.label[this.labelVariable].after&&(typeof this.label[this.labelVariable].after.strings.plural=="number"&&(r=this.label[this.labelVariable].after.strings.plural),n=this._buildLabel(t,r,"after",this.labelVariable),this.state.output.openLevel("empty"),this.state.output.append(e,"literal",!0),this.state.output.append(n,this.label[this.labelVariable].after,!0),this.state.tmp.label_blob=this.state.output.pop(),this.state.output.append(this.state.tmp.label_blob,"literal",!0),this.state.output.closeLevel("empty"),e=this.state.output.pop()),e};m.NameOutput.prototype._buildLabel=function(e,t,n,r){this.common_term&&(e=this.common_term);var i=!1,s=this.label[r][n];return s&&(i=m.castLabel(this.state,s,e,t,m.TOLERANT)),i};m.NameOutput.prototype._collapseAuthor=function(){var e,t,n;this.state.tmp.name_node.top.blobs.length!==0&&(this.nameset_base===0&&this.Item[this.variables[0]]&&!this._first_creator_variable&&(this._first_creator_variable=this.variables[0]),(this.state[this.state.tmp.area].opt.collapse&&this.state[this.state.tmp.area].opt.collapse.length||this.state[this.state.tmp.area].opt.cite_group_delimiter&&this.state[this.state.tmp.area].opt.cite_group_delimiter.length)&&(this.state.tmp.authorstring_request?(t="",e=this.state.tmp.name_node.top.blobs.slice(-1)[0].blobs,n=this.state.tmp.offset_characters,e&&(t=this.state.output.string(this.state,e,!1)),this.state.tmp.offset_characters=n,this.state.registry.authorstrings[this.Item.id]=t):!this.state.tmp.just_looking&&!this.state.tmp.suppress_decorations&&(this.state[this.state.tmp.area].opt.collapse&&this.state[this.state.tmp.area].opt.collapse.length||this.state[this.state.tmp.area].opt.cite_group_delimiter&&this.state[this.state.tmp.area].opt.cite_group_delimiter)&&(t="",e=this.state.tmp.name_node.top.blobs.slice(-1)[0].blobs,n=this.state.tmp.offset_characters,e&&(t=this.state.output.string(this.state,e,!1)),t===this.state.tmp.last_primary_names_string?((this.item["suppress-author"]||this.state[this.state.tmp.area].opt.collapse&&this.state[this.state.tmp.area].opt.collapse.length)&&(this.state.tmp.name_node.top.blobs.pop(),this.state.tmp.name_node.children=[],this.state.tmp.offset_characters=n),this.state[this.state.tmp.area].opt.cite_group_delimiter&&this.state[this.state.tmp.area].opt.cite_group_delimiter&&(this.state.tmp.use_cite_group_delimiter=!0)):(this.state.tmp.last_primary_names_string=t,this.variables.indexOf(this._first_creator_variable)>-1&&this.item&&this.item["suppress-author"]&&this.Item.type!=="legal_case"&&(this.state.tmp.name_node.top.blobs.pop(),this.state.tmp.name_node.children=[],this.state.tmp.offset_characters=n,this.state.tmp.term_predecessor=!1),this.state.tmp.have_collapsed=!1,this.state[this.state.tmp.area].opt.cite_group_delimiter&&this.state[this.state.tmp.area].opt.cite_group_delimiter&&(this.state.tmp.use_cite_group_delimiter=!1)))))};m.NameOutput.prototype.isPerson=function(e){return!(e.literal||!e.given&&e.family&&e.isInstitution)};m.NameOutput.prototype.truncatePersonalNameLists=function(){var e,t,n,r,i,s,a;this.freeters_count={},this.persons_count={},this.institutions_count={};for(e in this.freeters)this.freeters.hasOwnProperty(e)&&(this.freeters_count[e]=this.freeters[e].length,this.freeters[e]=this._truncateNameList(this.freeters,e));for(e in this.persons)if(this.persons.hasOwnProperty(e))for(this.institutions_count[e]=this.institutions[e].length,this._truncateNameList(this.institutions,e),this.persons[e]=this.persons[e].slice(0,this.institutions[e].length),this.persons_count[e]=[],r=0,i=this.persons[e].length;r<i;r+=1)this.persons_count[e][r]=this.persons[e][r].length,this.persons[e][r]=this._truncateNameList(this.persons,e,r);if(this.state.opt.development_extensions.etal_min_etal_usefirst_hack&&this.etal_min===1&&this.etal_use_first===1&&!(this.state.tmp.extension||this.state.tmp.just_looking)?s=e:s=!1,s||this._please_chop)for(t=0,n=this.variables.length;t<n;t+=1){e=this.variables[t],this.freeters[e].length&&(this._please_chop===e?(this.freeters[e]=this.freeters[e].slice(1),this.freeters_count[e]+=-1,this._please_chop=!1):s&&!this._please_chop&&(this.freeters[e]=this.freeters[e].slice(0,1),this.freeters_count[e]=1,this.institutions[e]=[],this.persons[e]=[],this._please_chop=s));for(var r=0,i=this.persons[e].length;r<i;r++)if(this.persons[e][r].length){if(this._please_chop===e){this.persons[e][r]=this.persons[e][r].slice(1),this.persons_count[e][r]+=-1,this._please_chop=!1;break}else if(s&&!this._please_chop){this.freeters[e]=this.persons[e][r].slice(0,1),this.freeters_count[e]=1,this.institutions[e]=[],this.persons[e]=[],a=[],this._please_chop=s;break}}this.institutions[e].length&&(this._please_chop===e?(this.institutions[e]=this.institutions[e].slice(1),this.institutions_count[e]+=-1,this._please_chop=!1):s&&!this._please_chop&&(this.institutions[e]=this.institutions[e].slice(0,1),this.institutions_count[e]=1,a=[],this._please_chop=s))}for(t=0,n=this.variables.length;t<n;t+=1){this.institutions[e].length&&(this.nameset_offset+=1);for(var r=0,i=this.persons[e].length;r<i;r++)this.persons[e][r].length&&(this.nameset_offset+=1)}};m.NameOutput.prototype._truncateNameList=function(e,t,n){var r;if(typeof n>"u"?r=e[t]:r=e[t][n],this.state[this.state[this.state.tmp.area].root].opt.max_number_of_names&&r.length>50&&r.length>this.state[this.state[this.state.tmp.area].root].opt.max_number_of_names+2){var i=this.state[this.state[this.state.tmp.area].root].opt.max_number_of_names;r=r.slice(0,i+1).concat(r.slice(-1))}return r};m.NameOutput.prototype.divideAndTransliterateNames=function(){var e,t,n,r,i=this.Item,s=this.variables;for(this.varnames=s.slice(),this.freeters={},this.persons={},this.institutions={},e=0,t=s.length;e<t;e+=1){var a=s[e];this.variable_offset[a]=this.nameset_offset;var l=this._normalizeVariableValue(i,a);if(this.name.strings["suppress-min"]&&l.length>=this.name.strings["suppress-min"]&&(l=[]),this.name.strings["suppress-max"]&&l.length<=this.name.strings["suppress-max"]&&(l=[]),this._getFreeters(a,l),this._getPersonsAndInstitutions(a,l),this.state.opt.development_extensions.spoof_institutional_affiliations){if(this.name.strings["suppress-min"]===0)for(this.freeters[a]=[],n=0,r=this.persons[a].length;n<r;n+=1)this.persons[a][n]=[];else if(this.institution.strings["suppress-min"]===0){for(this.institutions[a]=[],this.freeters[a]=this.freeters[a].concat(this.persons[a]),n=0,r=this.persons[a].length;n<r;n+=1)for(var o=0,p=this.persons[a][n].length;o<p;o+=1)this.freeters[a].push(this.persons[a][n][o]);this.persons[a]=[]}}}};m.NameOutput.prototype._normalizeVariableValue=function(e,t){var n;return typeof e[t]=="string"||typeof e[t]=="number"?(m.debug('name variable "'+t+'" is string or number, not array. Attempting to fix.'),n=[{literal:e[t]+""}]):e[t]?(typeof e[t].length!="number"&&(m.debug('name variable "'+t+'" is object, not array. Attempting to fix.'),e[t]=[e[t]]),n=e[t].slice()):n=[],n};m.NameOutput.prototype._getFreeters=function(e,t){if(this.freeters[e]=[],this.state.opt.development_extensions.spoof_institutional_affiliations)for(var n=t.length-1;n>-1&&this.isPerson(t[n]);n--){var r=this._checkNickname(t.pop());r&&this.freeters[e].push(r)}else for(var n=t.length-1;n>-1;n--){var r=t.pop();if(this.isPerson(r))var r=this._checkNickname(r);this.freeters[e].push(r)}this.freeters[e].reverse(),this.freeters[e].length&&(this.nameset_offset+=1)};m.NameOutput.prototype._getPersonsAndInstitutions=function(e,t){if(this.persons[e]=[],this.institutions[e]=[],!!this.state.opt.development_extensions.spoof_institutional_affiliations){for(var n=[],r=!1,i=!0,s=t.length-1;s>-1;s+=-1)if(this.isPerson(t[s])){var a=this._checkNickname(t[s]);a&&n.push(a)}else r=!0,this.institutions[e].push(t[s]),i||(n.reverse(),this.persons[e].push(n),n=[]),i=!1;r&&(n.reverse(),this.persons[e].push(n),this.persons[e].reverse(),this.institutions[e].reverse())}};m.NameOutput.prototype._clearValues=function(e){for(var t=e.length-1;t>-1;t+=-1)e.pop()};m.NameOutput.prototype._checkNickname=function(e){if(["interview","personal_communication"].indexOf(this.Item.type)>-1){var t="";if(t=m.Util.Names.getRawName(e),t&&this.state.sys.getAbbreviation&&!(this.item&&this.item["suppress-author"])){var n=t;this.state.sys.normalizeAbbrevsKey&&(n=this.state.sys.normalizeAbbrevsKey("author",t)),this.state.transform.loadAbbreviation("default","nickname",n,this.Item.language);var r=this.state.transform.abbrevs.default.nickname[n];r&&(r==="!here>>>"?e=!1:e={family:r,given:""})}}return e};m.NameOutput.prototype._purgeEmptyBlobs=function(e){for(var t=e.length-1;t>-1;t+=-1)(!e[t]||e[t].length===0||!e[t].blobs.length)&&(e=e.slice(0,t).concat(e.slice(t+1)));return e};m.NameOutput.prototype.joinPersons=function(e,t,n,r){var i;return e=this._purgeEmptyBlobs(e),r||(r="name"),typeof n>"u"?this.etal_spec[t].freeters===1?i=this._joinEtAl(e):this.etal_spec[t].freeters===2?i=this._joinEllipsis(e):this.state.tmp.sort_key_flag?i=this._join(e,this.state.inheritOpt(this.name,"delimiter","name-delimiter",", ")):i=this._joinAnd(e):this.etal_spec[t].persons[n]===1?i=this._joinEtAl(e):this.etal_spec[t].persons[n]===2?i=this._joinEllipsis(e):this.state.tmp.sort_key_flag?i=this._join(e,this.state.inheritOpt(this.name,"delimiter","name-delimiter",", ")):i=this._joinAnd(e),i};m.NameOutput.prototype.joinInstitutionSets=function(e,t){var n;return e=this._purgeEmptyBlobs(e),this.etal_spec[t].institutions===1?n=this._joinEtAl(e,"institution"):this.etal_spec[t].institutions===2?n=this._joinEllipsis(e,"institution"):n=this._joinAnd(e),n};m.NameOutput.prototype.joinPersonsAndInstitutions=function(e){e=this._purgeEmptyBlobs(e);var t=this._join(e,this.state.tmp.name_delimiter);return t.isInstitution=!0,t};m.NameOutput.prototype.joinFreetersAndInstitutionSets=function(e){e=this._purgeEmptyBlobs(e);var t=this._join(e,"[never here]",this.with.single,this.with.multiple);return t};m.NameOutput.prototype._getAfterInvertedName=function(e,t,n){if(n&&e.length>1&&this.state.inheritOpt(this.name,"delimiter-precedes-last")==="after-inverted-name"){var r=e[e.length-2];r.blobs.length>0&&r.blobs[0].isInverted&&(n.strings.prefix=t)}return n};m.NameOutput.prototype._getAndJoin=function(e,t){var n=!1;if(e.length>1){var r="single";e.length>2&&(r="multiple"),e[e.length-1].isInstitution?n=this.institution.and[r]:n=this.name.and[r],n=JSON.parse(JSON.stringify(n)),n=this._getAfterInvertedName(e,t,n)}return n};m.NameOutput.prototype._joinEtAl=function(e){var t=this.state.inheritOpt(this.name,"delimiter","name-delimiter",", "),n=this._join(e,t);return this.state.output.openLevel(this._getToken("name")),this.state.output.current.value().strings.delimiter="",this.state.output.append(n,"literal",!0),e.length>1?this.state.output.append(this["et-al"].multiple,"literal",!0):e.length===1&&this.state.output.append(this["et-al"].single,"literal",!0),this.state.output.closeLevel(),this.state.output.pop()};m.NameOutput.prototype._joinEllipsis=function(e){var t=this.state.inheritOpt(this.name,"delimiter","name-delimiter",", "),n=!1;if(e.length>1){var r="single";e.length>2&&(r="multiple"),n=JSON.parse(JSON.stringify(this.name.ellipsis[r])),n=this._getAfterInvertedName(e,t,n)}return this._join(e,t,n)};m.NameOutput.prototype._joinAnd=function(e){var t=this.state.inheritOpt(this.name,"delimiter","name-delimiter",", "),n=this._getAndJoin(e,t);return this._join(e,t,n)};m.NameOutput.prototype._join=function(e,t,n){var r,i;if(!e||(e=this._purgeEmptyBlobs(e),!e.length))return!1;if(e.length>1)if(e.length===2)n?e=[e[0],n,e[1]]:e[0].strings.suffix+=t;else{var s;n?s=1:s=0;for(var a=e.pop(),r=0,i=e.length-s;r<i;r++)e[r].strings.suffix+=t;e.push(n),e.push(a)}for(this.state.output.openLevel(),r=0,i=e.length;r<i;r+=1)this.state.output.append(e[r],!1,!0);return this.state.output.closeLevel(),this.state.output.pop()};m.NameOutput.prototype._getToken=function(e){var t=this[e];if(e==="institution"){var n=new m.Token;return n}return t};m.NameOutput.prototype.checkCommonAuthor=function(e){if(!e)return!1;var t=!1;if(this.variables.length===2){var n=this.variables,r=n.slice();r.sort(),t=r.join("")}if(!t)return!1;var i=!1;if(this.state.locale[this.state.opt.lang].terms[t]&&(i=!0),!i)return this.state.tmp.done_vars.push(this.variables[0]),this.state.tmp.done_vars.push(this.variables[1]),!1;var s=this.Item[this.variables[0]],a=this.Item[this.variables[1]],l=this._compareNamesets(s,a);return l===!0&&(this.state.tmp.done_vars.push(this.variables[0]),this.state.tmp.done_vars.push(this.variables[1])),!l};m.NameOutput.prototype.setCommonTerm=function(){var e=this.variables,t=e.slice();if(t.sort(),this.common_term=t.join(""),!!this.common_term){var n=!1;if(this.label&&this.label[this.variables[0]]&&(this.label[this.variables[0]].before?n=this.state.getTerm(this.common_term,this.label[this.variables[0]].before.strings.form,0):this.label[this.variables[0]].after&&(n=this.state.getTerm(this.common_term,this.label[this.variables[0]].after.strings.form,0))),!this.state.locale[this.state.opt.lang].terms[this.common_term]||!n||this.variables.length<2){this.common_term=!1;return}for(var r=0,i=0,s=this.variables.length-1;i<s;i+=1){var a=this.variables[i],l=this.variables[i+1];if(this.freeters[a].length||this.freeters[l].length){if(this.etal_spec[a].freeters!==this.etal_spec[l].freeters||!this._compareNamesets(this.freeters[a],this.freeters[l])){this.common_term=!1;return}r+=1}if(this.persons[a].length!==this.persons[l].length){this.common_term=!1;return}for(var o=0,p=this.persons[a].length;o<p;o+=1)if(this.etal_spec[a].persons[o]!==this.etal_spec[l].persons[o]||!this._compareNamesets(this.persons[a][o],this.persons[l][o])){this.common_term=!1;return}}}};m.NameOutput.prototype._compareNamesets=function(e,t){if(!e||!t||e.length!==t.length)return!1;for(var n=0,r=t.length;n<r;n+=1)for(var i=0,s=m.NAME_PARTS.length;i<s;i+=1){var a=m.NAME_PARTS[i];if(!e[n]||e[n][a]!=t[n][a])return!1}return!0};m.NameOutput.prototype.constrainNames=function(){this.names_count=0;for(var e,t=0,n=this.variables.length;t<n;t+=1){var r=this.variables[t];e=this.nameset_base+t,this.freeters[r].length&&(this.state.tmp.names_max.push(this.freeters[r].length,"literal"),this._imposeNameConstraints(this.freeters,this.freeters_count,r,e),this.names_count+=this.freeters[r].length),this.institutions[r].length&&(this.state.tmp.names_max.push(this.institutions[r].length,"literal"),this._imposeNameConstraints(this.institutions,this.institutions_count,r,e),this.persons[r]=this.persons[r].slice(0,this.institutions[r].length),this.names_count+=this.institutions[r].length);for(var i=0,s=this.persons[r].length;i<s;i+=1)this.persons[r][i].length&&(this.state.tmp.names_max.push(this.persons[r][i].length,"literal"),this._imposeNameConstraints(this.persons[r],this.persons_count[r],i,e),this.names_count+=this.persons[r][i].length)}};m.NameOutput.prototype._imposeNameConstraints=function(e,t,n,r){var i=e[n],s=this.state.tmp["et-al-min"];this.state.tmp.suppress_decorations?this.state.tmp.disambig_request&&this.state.tmp.disambig_request.names[r]?s=this.state.tmp.disambig_request.names[r]:t[n]>=this.etal_min&&(s=this.etal_use_first):(this.state.tmp.disambig_request&&this.state.tmp.disambig_request.names[r]>this.etal_use_first?t[n]<this.etal_min?s=t[n]:s=this.state.tmp.disambig_request.names[r]:t[n]>=this.etal_min&&(s=this.etal_use_first),this.etal_use_last&&s>this.etal_min-2&&(s=this.etal_min-2));var a=this.etal_min>=this.etal_use_first,l=t[n]>s;s>t[n]&&(s=i.length),a&&l&&(this.etal_use_last?e[n]=i.slice(0,s).concat(i.slice(-1)):e[n]=i.slice(0,s)),this.state.tmp.disambig_settings.names[r]=e[n].length,this.state.disambiguate.padBase(this.state.tmp.disambig_settings)};m.NameOutput.prototype.disambigNames=function(){for(var e,t=0,n=this.variables.length;t<n;t+=1){var r=this.variables[t];if(e=this.nameset_base+t,this.freeters[r].length&&this._runDisambigNames(this.freeters[r],e),this.institutions[r].length){typeof this.state.tmp.disambig_settings.givens[e]>"u"&&(this.state.tmp.disambig_settings.givens[e]=[]);for(var i=0,s=this.institutions[r].length;i<s;i+=1)typeof this.state.tmp.disambig_settings.givens[e][i]>"u"&&this.state.tmp.disambig_settings.givens[e].push(2)}for(var i=0,s=this.persons[r].length;i<s;i+=1)this.persons[r][i].length&&this._runDisambigNames(this.persons[r][i],e)}};m.NameOutput.prototype._runDisambigNames=function(e,t){var n,r,i,s,a,l,o;for(a=0,l=e.length;a<l;a+=1)if(!(!e[a].given&&!e[a].family)){if(i=this.state.inheritOpt(this.name,"initialize-with"),this.state.registry.namereg.addname(""+this.Item.id,e[a],a),n=this.state.tmp.disambig_settings.givens[t],typeof n>"u")for(var p=0,f=t+1;p<f;p+=1)this.state.tmp.disambig_settings.givens[p]||(this.state.tmp.disambig_settings.givens[p]=[]);if(n=this.state.tmp.disambig_settings.givens[t][a],typeof n>"u"&&(r=this.state.inheritOpt(this.name,"form","name-form","long"),s=this.state.registry.namereg.evalname(""+this.Item.id,e[a],a,0,r,i),this.state.tmp.disambig_settings.givens[t].push(s)),r=this.state.inheritOpt(this.name,"form","name-form","long"),o=this.state.registry.namereg.evalname(""+this.Item.id,e[a],a,0,r,i),this.state.tmp.disambig_request){var g=this.state.tmp.disambig_settings.givens[t][a];g===1&&this.state.citation.opt["givenname-disambiguation-rule"]==="by-cite"&&(typeof this.state.inheritOpt(this.name,"initialize-with")>"u"||typeof e[a].given>"u")&&(g=2),s=g,this.state.opt["disambiguate-add-givenname"]&&e[a].given&&(s=this.state.registry.namereg.evalname(""+this.Item.id,e[a],a,s,this.state.inheritOpt(this.name,"form","name-form","long"),this.state.inheritOpt(this.name,"initialize-with")))}else s=o;!this.state.tmp.just_looking&&this.item&&this.item.position===m.POSITION_FIRST&&o>s&&(s=o),this.state.tmp.sort_key_flag||(this.state.tmp.disambig_settings.givens[t][a]=s,typeof i=="string"&&(typeof this.name.strings.initialize>"u"||this.name.strings.initialize===!0)&&(this.state.tmp.disambig_settings.use_initials=!0))}};m.NameOutput.prototype.getEtAlConfig=function(){var e=this.item;this["et-al"]={},this.state.output.append(this.etal_term,this.etal_style,!0),this["et-al"].single=this.state.output.pop(),this["et-al"].single.strings.suffix=this.etal_suffix,this["et-al"].single.strings.prefix=this.etal_prefix_single,this.state.output.append(this.etal_term,this.etal_style,!0),this["et-al"].multiple=this.state.output.pop(),this["et-al"].multiple.strings.suffix=this.etal_suffix,this["et-al"].multiple.strings.prefix=this.etal_prefix_multiple,typeof e>"u"&&(e={}),e.position?(this.state.inheritOpt(this.name,"et-al-subsequent-min")?this.etal_min=this.state.inheritOpt(this.name,"et-al-subsequent-min"):this.etal_min=this.state.inheritOpt(this.name,"et-al-min"),this.state.inheritOpt(this.name,"et-al-subsequent-use-first")?this.etal_use_first=this.state.inheritOpt(this.name,"et-al-subsequent-use-first"):this.etal_use_first=this.state.inheritOpt(this.name,"et-al-use-first")):(this.state.tmp["et-al-min"]?this.etal_min=this.state.tmp["et-al-min"]:this.etal_min=this.state.inheritOpt(this.name,"et-al-min"),this.state.tmp["et-al-use-first"]?this.etal_use_first=this.state.tmp["et-al-use-first"]:this.etal_use_first=this.state.inheritOpt(this.name,"et-al-use-first"),typeof this.state.tmp["et-al-use-last"]=="boolean"?this.etal_use_last=this.state.tmp["et-al-use-last"]:this.etal_use_last=this.state.inheritOpt(this.name,"et-al-use-last")),this.state.tmp["et-al-min"]||(this.state.tmp["et-al-min"]=this.etal_min)};m.NameOutput.prototype.setEtAlParameters=function(){var e,t,n,r;for(e=0,t=this.variables.length;e<t;e+=1){var i=this.variables[e];for(typeof this.etal_spec[i]>"u"&&(this.etal_spec[i]={freeters:0,institutions:0,persons:[]}),this.etal_spec[this.nameset_base+e]=this.etal_spec[i],this.freeters[i].length&&this._setEtAlParameter("freeters",i),n=0,r=this.persons[i].length;n<r;n+=1)typeof this.etal_spec[i][n]>"u"&&(this.etal_spec[i].persons[n]=0),this._setEtAlParameter("persons",i,n);this.institutions[i].length&&this._setEtAlParameter("institutions",i)}};m.NameOutput.prototype._setEtAlParameter=function(e,t,n){var r,i;e==="persons"?(r=this.persons[t][n],i=this.persons_count[t][n]):(r=this[e][t],i=this[e+"_count"][t]),r.length<i&&!this.state.tmp.sort_key_flag?this.etal_use_last?e==="persons"?this.etal_spec[t].persons[n]=2:this.etal_spec[t][e]=2:e==="persons"?this.etal_spec[t].persons[n]=1:this.etal_spec[t][e]=1:e==="persons"?this.etal_spec[t].persons[n]=0:this.etal_spec[t][e]=0};m.NameOutput.prototype.renderAllNames=function(){for(var e,t=0,n=this.variables.length;t<n;t+=1){var r=this.variables[t];(this.freeters[r].length||this.institutions[r].length)&&(this.state.tmp.group_context.tip.condition||(this.state.tmp.just_did_number=!1)),e=this.nameset_base+t,this.freeters[r].length&&(this.freeters[r]=this._renderNames(r,this.freeters[r],e));for(var i=0,s=this.institutions[r].length;i<s;i+=1)this.persons[r][i]=this._renderNames(r,this.persons[r][i],e,i)}this.renderInstitutionNames()};m.NameOutput.prototype.renderInstitutionNames=function(){for(var e=0,t=this.variables.length;e<t;e+=1)for(var n=this.variables[e],r=0,i=this.institutions[n].length;r<i;r+=1){var g,s=this.institutions[n][r],r,i,a;this.state.tmp.extension?a=["sort"]:s.isInstitution||s.literal?a=this.state.opt["cite-lang-prefs"].institutions:a=this.state.opt["cite-lang-prefs"].persons;var l={primary:"locale-orig",secondary:!1,tertiary:!1};if(a)for(var o=["primary","secondary","tertiary"],p=0,f=o.length;p<f&&!(a.length-1<p);p+=1)a[p]&&(l[o[p]]="locale-"+a[p]);else l.primary="locale-translat";this.state.tmp.area!=="bibliography"&&!(this.state.tmp.area==="citation"&&this.state.opt.xclass==="note"&&this.item&&!this.item.position)&&(l.secondary=!1,l.tertiary=!1),this.setRenderedName(s);var g=this._renderInstitutionName(n,s,l,r);this.institutions[n][r]=g}};m.NameOutput.prototype._renderInstitutionName=function(e,t,n,r){var i,s,a,l,o,p,f,g=this.getName(t,n.primary,!0),u=g.name,d=g.usedOrig;if(u&&(u=this.fixupInstitution(u,e,r)),i=!1,n.secondary){g=this.getName(t,n.secondary,!1,d);var i=g.name;d=g.usedOrig,i&&(i=this.fixupInstitution(i,e,r))}s=!1,n.tertiary&&(g=this.getName(t,n.tertiary,!1,d),s=g.name,s&&(s=this.fixupInstitution(s,e,r)));var v={l:{pri:!1,sec:!1,ter:!1},s:{pri:!1,sec:!1,ter:!1}};switch(u&&(v.l.pri=u.long,v.s.pri=u.short.length?u.short:u.long),i&&(v.l.sec=i.long,v.s.sec=i.short.length?i.short:i.long),s&&(v.l.ter=s.long,v.s.ter=s.short.length?s.short:s.long),this.institution.strings["institution-parts"]){case"short":u.short.length?(l=this._getShortStyle(),o=[this._composeOneInstitutionPart([v.s.pri,v.s.sec,v.s.ter],n,l,e)]):(a=this._getLongStyle(u,e,r),o=[this._composeOneInstitutionPart([v.l.pri,v.l.sec,v.l.ter],n,a,e)]);break;case"short-long":a=this._getLongStyle(u,e,r),l=this._getShortStyle(),p=this._renderOneInstitutionPart(u.short,l),f=this._composeOneInstitutionPart([v.l.pri,v.l.sec,v.l.ter],n,a,e),o=[p,f];break;case"long-short":a=this._getLongStyle(u,e,r),l=this._getShortStyle(),p=this._renderOneInstitutionPart(u.short,l),f=this._composeOneInstitutionPart([v.l.pri,v.l.sec,v.l.ter],n,a,e),o=[f,p];break;default:a=this._getLongStyle(u,e,r),o=[this._composeOneInstitutionPart([v.l.pri,v.l.sec,v.l.ter],n,a,e)];break}var h=this._join(o," ");return h&&(h.isInstitution=!0),this.state.tmp.name_node.children.push(h),h};m.NameOutput.prototype._composeOneInstitutionPart=function(e,t,n){var r=!1,i=!1,s=!1,a,l,o;if(e[0]){if(a=m.Util.cloneToken(n),this.state.opt.citeAffixes[t.primary]&&this.state.opt.citeAffixes.institutions[t.primary].prefix==="<i>"){for(var p=!1,f=0,g=a.decorations.length;f<g;f+=1)n.decorations[f][0]==="@font-style"&&a.decorations[f][1]==="italic"&&(p=!0);p||a.decorations.push(["@font-style","italic"])}r=this._renderOneInstitutionPart(e[0],a)}e[1]&&(i=this._renderOneInstitutionPart(e[1],n)),e[2]&&(s=this._renderOneInstitutionPart(e[2],n));var u;if(i||s){this.state.output.openLevel("empty"),this.state.output.append(r),l=m.Util.cloneToken(n),t.secondary&&(l.strings.prefix=this.state.opt.citeAffixes.institutions[t.secondary].prefix,l.strings.suffix=this.state.opt.citeAffixes.institutions[t.secondary].suffix,l.strings.prefix||(l.strings.prefix=" "));var d=new m.Token;d.decorations.push(["@font-style","normal"]),d.decorations.push(["@font-weight","normal"]),this.state.output.openLevel(d),this.state.output.append(i,l),this.state.output.closeLevel(),o=m.Util.cloneToken(n),t.tertiary&&(o.strings.prefix=this.state.opt.citeAffixes.institutions[t.tertiary].prefix,o.strings.suffix=this.state.opt.citeAffixes.institutions[t.tertiary].suffix,o.strings.prefix||(o.strings.prefix=" "));var v=new m.Token;v.decorations.push(["@font-style","normal"]),v.decorations.push(["@font-weight","normal"]),this.state.output.openLevel(v),this.state.output.append(s,o),this.state.output.closeLevel(),this.state.output.closeLevel(),u=this.state.output.pop()}else u=r;return u};m.NameOutput.prototype._renderOneInstitutionPart=function(e,t){for(var n=0,r=e.length;n<r;n+=1)if(e[n]){var i=e[n];if(this.state.tmp.strip_periods)i=i.replace(/\./g,"");else for(var s=0,a=t.decorations.length;s<a;s+=1)if(t.decorations[s][0]==="@strip-periods"&&t.decorations[s][1]==="true"){i=i.replace(/\./g,"");break}this.state.tmp.group_context.tip.variable_success=!0,this.state.tmp.can_substitute.replace(!1,m.LITERAL),i==="!here>>>"?e[n]=!1:(this.state.output.append(i,t,!0),e[n]=this.state.output.pop())}return typeof this.institution.strings["part-separator"]>"u"&&(this.institution.strings["part-separator"]=this.state.tmp.name_delimiter),this._join(e,this.institution.strings["part-separator"])};m.NameOutput.prototype._renderNames=function(e,t,n,r){var i=!1;if(t.length){for(var s=[],a=0,l=t.length;a<l;a+=1){var o=t[a],i,p;this.state.tmp.extension?p=["sort"]:o.isInstitution||o.literal?p=this.state.opt["cite-lang-prefs"].institutions:p=this.state.opt["cite-lang-prefs"].persons;var f={primary:"locale-orig",secondary:!1,tertiary:!1};if(p)for(var g=["primary","secondary","tertiary"],u=0,d=g.length;u<d&&!(p.length-1<u);u+=1)f[g[u]]="locale-"+p[u];else f.primary="locale-translat";if((this.state.tmp.sort_key_flag||this.state.tmp.area!=="bibliography"&&!(this.state.tmp.area==="citation"&&this.state.opt.xclass==="note"&&this.item&&!this.item.position))&&(f.secondary=!1,f.tertiary=!1),this.setRenderedName(o),!o.literal&&!o.isInstitution){var v=this._renderPersonalName(e,o,f,n,a,r),h=m.Util.cloneToken(this.name);this.state.output.append(v,h,!0),s.push(this.state.output.pop())}else s.push(this._renderInstitutionName(e,o,f,r))}i=this.joinPersons(s,n,r)}return i};m.NameOutput.prototype._renderPersonalName=function(e,t,n,r,i,s){var a=this.getName(t,n.primary,!0),l=this._renderOnePersonalName(a.name,r,i,s),o=!1;n.secondary&&(a=this.getName(t,n.secondary,!1,a.usedOrig),a.name&&(o=this._renderOnePersonalName(a.name,r,i,s)));var p=!1;n.tertiary&&(a=this.getName(t,n.tertiary,!1,a.usedOrig),a.name&&(p=this._renderOnePersonalName(a.name,r,i,s)));var f;if(o||p){this.state.output.openLevel("empty"),this.state.output.append(l);var g=new m.Token;n.secondary&&(g.strings.prefix=this.state.opt.citeAffixes.persons[n.secondary].prefix,g.strings.suffix=this.state.opt.citeAffixes.persons[n.secondary].suffix,g.strings.prefix||(g.strings.prefix=" ")),this.state.output.append(o,g);var u=new m.Token;n.tertiary&&(u.strings.prefix=this.state.opt.citeAffixes.persons[n.tertiary].prefix,u.strings.suffix=this.state.opt.citeAffixes.persons[n.tertiary].suffix,u.strings.prefix||(u.strings.prefix=" ")),this.state.output.append(p,u),this.state.output.closeLevel(),f=this.state.output.pop()}else f=l;return f};m.NameOutput.prototype._isRomanesque=function(e){var t=2;e.family.replace(/\"/g,"").match(m.ROMANESQUE_REGEXP)||(t=0),!t&&e.given&&e.given.match(m.STARTSWITH_ROMANESQUE_REGEXP)&&(t=1);var n;return t==2&&(e.multi&&e.multi.main?n=e.multi.main.slice(0,2):this.Item.language&&(n=this.Item.language.slice(0,2)),["ja","zh"].indexOf(n)>-1&&(t=1)),t};m.NameOutput.prototype._renderOnePersonalName=function(e,t,n,r){var i=e,s=this._droppingParticle(i,t,r),a=this._familyName(i),l=this._nonDroppingParticle(i),o=this._givenName(i,t,n),p=o.blob,f=this._nameSuffix(i);p===!1&&(s=!1,f=!1);var g=this.state.inheritOpt(this.name,"sort-separator");g||(g="");var u;i["comma-suffix"]?u=", ":u=" ";var d=this._isRomanesque(i);function v(x){return x?typeof x.blobs=="string"?["\u2019","'","-"," "].indexOf(x.blobs.slice(-1))>-1:v(x.blobs[x.blobs.length-1]):!1}var h=v(l),S;["fr","ru","cs"].indexOf(this.state.opt["default-locale"][0].slice(0,2))>-1?S="\xA0":S=" ";var c,_,y,b;if(d===0)c=this._join([l,a,p],"");else if(d===1||i["static-ordering"])_=this._join([l,a],S),c=this._join([_,p]," ");else if(i["reverse-ordering"])_=this._join([l,a],S),c=this._join([p,_]," ");else if(this.state.tmp.sort_key_flag)this.state.opt["demote-non-dropping-particle"]==="never"?(_=this._join([l,a],S),_=this._join([_,s]," "),_=this._join([_,p],this.state.opt.sort_sep),c=this._join([_,f]," ")):(b=this._join([p,s,l]," "),_=this._join([a,b],this.state.opt.sort_sep),c=this._join([_,f]," "));else if(this.state.inheritOpt(this.name,"name-as-sort-order")==="all"||this.state.inheritOpt(this.name,"name-as-sort-order")==="first"&&n===0&&(r===0||typeof r>"u"))["Lord","Lady"].indexOf(i.given)>-1&&(g=", "),["always","display-and-sort"].indexOf(this.state.opt["demote-non-dropping-particle"])>-1?(b=this._join([p,s],i["comma-dropping-particle"]+" "),b=this._join([b,l]," "),b&&this.given&&(b.strings.prefix=this.given.strings.prefix,b.strings.suffix=this.given.strings.suffix),a&&this.family&&(a.strings.prefix=this.family.strings.prefix,a.strings.suffix=this.family.strings.suffix),_=this._join([a,b],g),c=this._join([_,f],g)):(h?y=this._join([l,a],""):y=this._join([l,a],S),y&&this.family&&(y.strings.prefix=this.family.strings.prefix,y.strings.suffix=this.family.strings.suffix),b=this._join([p,s],i["comma-dropping-particle"]+" "),b&&this.given&&(b.strings.prefix=this.given.strings.prefix,b.strings.suffix=this.given.strings.suffix),_=this._join([y,b],g),c=this._join([_,f],g)),c.isInverted=!0;else{if(i["dropping-particle"]&&i.family&&!i["non-dropping-particle"]){var T=i["dropping-particle"],O=["'","\u02BC","\u2019","-"];O.indexOf(T.slice(-1))>-1&&T.slice(0,-1)!=="de"&&(a=this._join([s,a],""),s=!1)}h?(b=this._join([l,a],""),b=this._join([s,b],S)):b=this._join([s,l,a],S),b=this._join([b,f],u),b&&this.family&&(b.strings.prefix=this.family.strings.prefix,b.strings.suffix=this.family.strings.suffix),p&&this.given&&(p.strings.prefix=this.given.strings.prefix,p.strings.suffix=this.given.strings.suffix),b.strings.prefix&&(i["comma-dropping-particle"]="");var L;this.state.inheritOpt(this.name,"initialize-with")&&this.state.inheritOpt(this.name,"initialize-with").match(/[\u00a0\ufeff]/)&&o.initializationLevel===1?L=S:L=" ",c=this._join([p,b],i["comma-dropping-particle"]+L)}return this.state.tmp.group_context.tip.variable_success=!0,this.state.tmp.can_substitute.replace(!1,m.LITERAL),this.state.tmp.term_predecessor=!0,this.state.tmp.name_node.children.push(c),c};m.NameOutput.prototype._normalizeNameInput=function(e){var t={literal:e.literal,family:e.family,isInstitution:e.isInstitution,given:e.given,suffix:e.suffix,"comma-suffix":e["comma-suffix"],"non-dropping-particle":e["non-dropping-particle"],"dropping-particle":e["dropping-particle"],"static-ordering":e["static-ordering"],"static-particles":e["static-particles"],"reverse-ordering":e["reverse-ordering"],"full-form-always":e["full-form-always"],"parse-names":e["parse-names"],"comma-dropping-particle":"",block_initialize:e.block_initialize,multi:e.multi};return this._parseName(t),t};m.NameOutput.prototype._stripPeriods=function(e,t){var n=this[e+"_decor"];if(t){if(this.state.tmp.strip_periods)t=t.replace(/\./g,"");else if(n){for(var r=0,i=n.decorations.length;r<i;r+=1)if(n.decorations[r][0]==="@strip-periods"&&n.decorations[r][1]==="true"){t=t.replace(/\./g,"");break}}}return t};m.NameOutput.prototype._nonDroppingParticle=function(e){var t=e["non-dropping-particle"];t&&this.state.tmp.sort_key_flag&&(t=t.replace(/[\'\u2019]/,""));var n=this._stripPeriods("family",t);return this.state.output.append(n,this.family_decor,!0)?this.state.output.pop():!1};m.NameOutput.prototype._droppingParticle=function(e,t,n){var r=e["dropping-particle"];r&&this.state.tmp.sort_key_flag&&(r=r.replace(/[\'\u2019]/,""));var i=this._stripPeriods("given",r);if(e["dropping-particle"]&&e["dropping-particle"].match(/^et.?al[^a-z]$/))this.state.inheritOpt(this.name,"et-al-use-last")?typeof n>"u"?this.etal_spec[t].freeters=2:this.etal_spec[t].persons=2:typeof n>"u"?this.etal_spec[t].freeters=1:this.etal_spec[t].persons=1,e["comma-dropping-particle"]="";else if(this.state.output.append(i,this.given_decor,!0))return this.state.output.pop();return!1};m.NameOutput.prototype._familyName=function(e){var t=this._stripPeriods("family",e.family);return this.state.output.append(t,this.family_decor,!0)?this.state.output.pop():!1};m.NameOutput.prototype._givenName=function(e,t,n){var r,i=this.state.inheritOpt(this.name,"form","name-form","long")!=="long",s=this.state.inheritOpt(this.name,"initialize")!==!1,a=typeof this.state.inheritOpt(this.name,"initialize-with")=="string"&&!e.block_initialize,l,o;if(e["full-form-always"])o=2;else{i?l=0:a?l=1:l=2;var p=this.state.tmp.disambig_settings.givens[t][n];p>l?o=p:o=l}var f=this.state.citation.opt["givenname-disambiguation-rule"];if(f&&f.slice(-14)==="-with-initials"&&(a=!0),e.family&&o===1)if(a){var g=this.state.inheritOpt(this.name,"initialize-with",!1,"");e.given=m.Util.Names.initializeWith(this.state,e.given,g,!s)}else e.given=m.Util.Names.unInitialize(this.state,e.given);else{if(o===0)return{blob:!1};o===2&&(e.given=m.Util.Names.unInitialize(this.state,e.given))}var u=this._stripPeriods("given",e.given),d=this.state.output.append(u,this.given_decor,!0);return d?(r=this.state.output.pop(),{blob:r,initializationLevel:o}):{blob:!1}};m.NameOutput.prototype._nameSuffix=function(e){var t=e.suffix,n;t&&typeof this.state.inheritOpt(this.name,"initialize-with")=="string"&&(t=m.Util.Names.initializeWith(this.state,t,this.state.inheritOpt(this.name,"initialize-with"),!0)),t=this._stripPeriods("family",t);var r="";t&&t.slice(-1)==="."&&(t=t.slice(0,-1),r=".");var i=this.state.output.append(t,"empty",!0);return i?(n=this.state.output.pop(),n.strings.suffix=r+n.strings.suffix,n):!1};m.NameOutput.prototype._getLongStyle=function(e){var t;return e.short.length?this.institutionpart["long-with-short"]?t=this.institutionpart["long-with-short"]:t=this.institutionpart.long:t=this.institutionpart.long,t||(t=new m.Token),t};m.NameOutput.prototype._getShortStyle=function(){var e;return this.institutionpart.short?e=this.institutionpart.short:e=new m.Token,e};m.NameOutput.prototype._parseName=function(e){if(!e["parse-names"]&&typeof e["parse-names"]<"u")return e;e.family&&!e.given&&e.isInstitution&&(e.literal=e.family,e.family=void 0,e.isInstitution=void 0);var t;e.family&&e.family.slice(0,1)==='"'&&e.family.slice(-1)==='"'||!e["parse-names"]&&typeof e["parse-names"]<"u"?(e.family=e.family.slice(1,-1),t=!0,e["parse-names"]=0):t=!1,this.state.opt.development_extensions.parse_names&&!e["non-dropping-particle"]&&e.family&&!t&&e.given&&(e["static-particles"]||m.parseParticles(e,!0))};m.NameOutput.prototype.getName=function(e,t,n,r){if(r&&t==="locale-orig")return{name:!1,usedOrig:r};e.family||(e.family=""),e.given||(e.given="");var i={};i["static-ordering"]=this.getStaticOrder(e);var s=!0,a;if(t!=="locale-orig"&&(s=!1,e.multi)){for(var l=this.state.opt[t],o=0,p=l.length;o<p;o+=1)if(a=l[o],e.multi._key[a]){s=!0;var f=e.isInstitution;e=e.multi._key[a],e.isInstitution=f,i=this.getNameParams(a),i.transliterated=!0;break}}if(s||(a=!1,e.multi&&e.multi.main?a=e.multi.main:this.Item.language&&(a=this.Item.language),a&&(i=this.getNameParams(a))),!n&&!s)return{name:!1,usedOrig:r};e.family||(e.family=""),e.given||(e.given=""),e.literal&&(delete e.family,delete e.given),e={family:e.family,given:e.given,"non-dropping-particle":e["non-dropping-particle"],"dropping-particle":e["dropping-particle"],suffix:e.suffix,"static-ordering":i["static-ordering"],"static-particles":e["static-particles"],"reverse-ordering":i["reverse-ordering"],"full-form-always":i["full-form-always"],"parse-names":e["parse-names"],"comma-suffix":e["comma-suffix"],"comma-dropping-particle":e["comma-dropping-particle"],transliterated:i.transliterated,block_initialize:i["block-initialize"],literal:e.literal,isInstitution:e.isInstitution,multi:e.multi},!e.literal&&!e.given&&e.family&&e.isInstitution&&(e.literal=e.family),e.literal&&(delete e.family,delete e.given),e=this._normalizeNameInput(e);var g;return r?g=r:g=!s,{name:e,usedOrig:g}};m.NameOutput.prototype.getNameParams=function(e){var t={},n=m.localeResolve(this.Item.language,this.state.opt["default-locale"][0]),r=this.state.locale[n.best]?n.best:this.state.opt["default-locale"][0],i=this.state.locale[r].opts["name-as-sort-order"],s=this.state.locale[r].opts["name-as-reverse-order"],a=this.state.locale[r].opts["name-never-short"],l=e.split("-")[0];return i&&i[l]&&(t["static-ordering"]=!0,t["reverse-ordering"]=!1),s&&s[l]&&(t["reverse-ordering"]=!0,t["static-ordering"]=!1),a&&a[l]&&(t["full-form-always"]=!0),t["static-ordering"]&&(t["block-initialize"]=!0),t};m.NameOutput.prototype.setRenderedName=function(e){if(this.state.tmp.area==="bibliography"){for(var t="",n=0,r=m.NAME_PARTS.length;n<r;n+=1)e[m.NAME_PARTS[n]]&&(t+=e[m.NAME_PARTS[n]]);this.state.tmp.rendered_name.push(t)}};m.NameOutput.prototype.fixupInstitution=function(e,t,n){!e.literal&&e.family&&(e.literal=e.family,delete e.family);var r=e.literal,i=r,s={long:r.split(/\s*\|\s*/),short:i.split(/\s*\|\s*/)};if(this.state.sys.getAbbreviation){if(this.institution.strings.form==="short"){let u=this.Item.jurisdiction;u=this.state.transform.loadAbbreviation(u,"institution-entire",r,this.Item.language),this.state.transform.abbrevs[u]["institution-entire"][r]?r=this.state.transform.abbrevs[u]["institution-entire"][r]:(u=this.Item.jurisdiction,u=this.state.transform.loadAbbreviation(u,"institution-part",r,this.Item.language),this.state.transform.abbrevs[u]["institution-part"][r]&&(r=this.state.transform.abbrevs[u]["institution-part"][r])),r=this._quashChecks(u,r)}if(["short","short-long","long-short"].indexOf(this.institution.strings["institution-parts"])>-1){let u=this.Item.jurisdiction;u=this.state.transform.loadAbbreviation(u,"institution-part",i,this.Item.language),this.state.transform.abbrevs[u]["institution-part"][i]&&(i=this.state.transform.abbrevs[u]["institution-part"][i]),i=this._quashChecks(u,i),["short-long","long-short"].indexOf(this.institution.strings["institution-parts"])>-1&&i===r&&(i="")}if(s.long=r.split(/\s*\|\s*/),s.short=i.split(/\s*\|\s*/),["short","short-long","long-short"].indexOf(this.institution.strings["institution-parts"])>-1)for(var a=s.short.length-1;a>-1;a--){let u=this.Item.jurisdiction;var l=s.short[a];if(u=this.state.transform.loadAbbreviation(u,"institution-part",l,this.Item.language),this.state.transform.abbrevs[u]["institution-part"][l]&&(s.short[a]=this.state.transform.abbrevs[u]["institution-part"][l]),s.short[a].indexOf("|")>-1){let d=s.short,v=d[a].split(/\s*\|\s*/);s.short=d.slice(0,a).concat(v).concat(d.slice(a+1))}}if(this.state.opt.development_extensions.legacy_institution_name_ordering&&s.short.reverse(),s.short=this._trimInstitution(s.short),this.institution.strings["reverse-order"]&&s.short.reverse(),!this.state.tmp.just_looking&&this.Item.jurisdiction){let u=this.Item.jurisdiction;var o=this.state.tmp.abbrev_trimmer;if(o&&o[u]&&o[u][t])for(var p=0,f=s.short.length;p<f;p++){var g=s.short[p];s.short[p]=g.replace(o[u][t],"").trim()}}}return this.state.opt.development_extensions.legacy_institution_name_ordering&&s.long.reverse(),s.long=this._trimInstitution(s.long),this.institution.strings["reverse-order"]&&s.long.reverse(),s};m.NameOutput.prototype.getStaticOrder=function(e,t){var n=!1;return(!t&&e["static-ordering"]||this._isRomanesque(e)===0||(!e.multi||!e.multi.main)&&this.Item.language&&["vi","hu"].indexOf(this.Item.language)>-1||e.multi&&e.multi.main&&["vi","hu"].indexOf(e.multi.main.slice(0,2))>-1||this.state.opt["auto-vietnamese-names"]&&m.VIETNAMESE_NAMES.exec(e.family+" "+e.given)&&m.VIETNAMESE_SPECIALS.exec(e.family+e.given))&&(n=!0),n};m.NameOutput.prototype._quashChecks=function(e,n){var n=this.state.transform.quashCheck(e,n),r=n.split(/>>[0-9]{4}>>/),i=n.match(/>>([0-9]{4})>>/);n=r.pop();var s=this.Item["original-date"]?this.Item["original-date"]:this.Item.issued;if(s&&(s=parseInt(s.year,10),s=isNaN(s)?!1:s),s){if(r.length>0)for(var a=i.length-1;a>0&&!(s>=parseInt(i[a],10));a--)n=r.pop();n=n.replace(/\s*\|\s*/g,"|")}return n};m.NameOutput.prototype._trimInstitution=function(e){var t=!1,n=!1,r=!1,i=!1,s=e.slice();if(this.institution){if(typeof this.institution.strings["use-first"]<"u"&&(t=this.institution.strings["use-first"]),typeof this.institution.strings["use-last"]<"u"&&(r=this.institution.strings["use-last"]),typeof this.institution.strings["stop-first"]<"u"&&(i=this.institution.strings["stop-first"]),typeof this.institution.strings["stop-last"]<"u"&&(n=this.institution.strings["stop-last"]),t&&(n&&(s=s.slice(0,n*-1)),s=s.slice(0,t)),r){var a=e.slice();t?i=t:s=[],i&&(a=a.slice(i)),a=a.slice(r*-1),s=s.concat(a)}e=s}return e};m.PublisherOutput=function(e,t){this.state=e,this.group_tok=t,this.varlist=[]};m.PublisherOutput.prototype.render=function(){this.clearVars(),this.composeAndBlob(),this.composeElements(),this.composePublishers(),this.joinPublishers()};m.PublisherOutput.prototype.composeAndBlob=function(){this.and_blob={};var e=!1;this.group_tok.strings.and==="text"?e=this.state.getTerm("and"):this.group_tok.strings.and==="symbol"&&(e="&");var t=new m.Token;t.strings.suffix=" ",t.strings.prefix=" ",this.state.output.append(e,t,!0);var n=this.state.output.pop();t.strings.prefix=this.group_tok.strings["subgroup-delimiter"],this.state.output.append(e,t,!0);var r=this.state.output.pop();this.and_blob.single=!1,this.and_blob.multiple=!1,e&&(this.group_tok.strings["subgroup-delimiter-precedes-last"]==="always"?this.and_blob.single=r:this.group_tok.strings["subgroup-delimiter-precedes-last"]==="never"?(this.and_blob.single=n,this.and_blob.multiple=n):(this.and_blob.single=n,this.and_blob.multiple=r))};m.PublisherOutput.prototype.composeElements=function(){for(var e=0,t=2;e<t;e+=1)for(var n=["publisher","publisher-place"][e],r=0,i=this["publisher-list"].length;r<i;r+=1){var s=this[n+"-list"][r],a=this[n+"-token"];this.state.output.append(s,a,!0),this[n+"-list"][r]=this.state.output.pop()}};m.PublisherOutput.prototype.composePublishers=function(){for(var e,t=0,n=this["publisher-list"].length;t<n;t+=1)e=[this[this.varlist[0]+"-list"][t],this[this.varlist[1]+"-list"][t]],this["publisher-list"][t]=this._join(e,this.group_tok.strings.delimiter)};m.PublisherOutput.prototype.joinPublishers=function(){var e=this["publisher-list"],t=this._join(e,this.group_tok.strings["subgroup-delimiter"],this.and_blob.single,this.and_blob.multiple,this.group_tok);this.state.output.append(t,"literal")};m.PublisherOutput.prototype._join=m.NameOutput.prototype._join;m.PublisherOutput.prototype._getToken=m.NameOutput.prototype._getToken;m.PublisherOutput.prototype.clearVars=function(){this.state.tmp["publisher-list"]=!1,this.state.tmp["publisher-place-list"]=!1,this.state.tmp["publisher-group-token"]=!1,this.state.tmp["publisher-token"]=!1,this.state.tmp["publisher-place-token"]=!1};m.evaluateLabel=function(e,t,n,r){var i;e.strings.term==="locator"?(r&&r.label&&(r.label==="sub verbo"?i="sub-verbo":i=r.label),i||(i="page")):i=e.strings.term;var s=e.strings.plural;if(typeof s!="number"){var a=r&&e.strings.term==="locator"?r:n;a[e.strings.term]&&(t.processNumber(!1,a,e.strings.term,n.type),s=t.tmp.shadow_numbers[e.strings.term].plural,!t.tmp.shadow_numbers[e.strings.term].labelForm&&!t.tmp.shadow_numbers[e.strings.term].labelDecorations&&(e.strings.form?t.tmp.shadow_numbers[e.strings.term].labelForm=e.strings.form:t.tmp.group_context.tip.label_form&&(t.tmp.shadow_numbers[e.strings.term].labelForm=t.tmp.group_context.tip.label_form),t.tmp.shadow_numbers[e.strings.term].labelCapitalizeIfFirst=e.strings.capitalize_if_first,t.tmp.shadow_numbers[e.strings.term].labelDecorations=e.decorations.slice()),["locator","number","page"].indexOf(e.strings.term)>-1&&t.tmp.shadow_numbers[e.strings.term].label&&(i=t.tmp.shadow_numbers[e.strings.term].label),e.decorations&&t.opt.development_extensions.csl_reverse_lookup_support&&(e.decorations.reverse(),e.decorations.push(["@showid","true",e.cslid]),e.decorations.reverse()))}return m.castLabel(t,e,i,s,m.TOLERANT)};m.castLabel=function(e,t,n,r,i){var s=t.strings.form,a=t.strings.capitalize_if_first;e.tmp.group_context.tip.label_form&&(s==="static"?e.tmp.group_context.tip.label_static=!0:s=e.tmp.group_context.tip.label_form),e.tmp.group_context.tip.label_capitalize_if_first&&(a=e.tmp.group_context.tip.label_capitalize_if_first);var l=e.getTerm(n,s,r,!1,i,t.default_locale);if(a&&(l=m.Output.Formatters["capitalize-first"](e,l)),e.tmp.strip_periods)l=l.replace(/\./g,"");else for(var o=0,p=t.decorations.length;o<p;o+=1)if(t.decorations[o][0]==="@strip-periods"&&t.decorations[o][1]==="true"){l=l.replace(/\./g,"");break}return l};m.Node.name={build:function(e,t){var n;if([m.SINGLETON,m.START].indexOf(this.tokentype)>-1){var r;typeof e.tmp.root>"u"?(r=void 0,e.tmp.root="citation"):r=e.tmp.root,e.inheritOpt(this,"et-al-subsequent-min")&&e.inheritOpt(this,"et-al-subsequent-min")!==e.inheritOpt(this,"et-al-min")&&(e.opt.update_mode=m.POSITION),e.inheritOpt(this,"et-al-subsequent-use-first")&&e.inheritOpt(this,"et-al-subsequent-use-first")!==e.inheritOpt(this,"et-al-use-first")&&(e.opt.update_mode=m.POSITION),e.tmp.root=r,n=function(i){i.tmp.etal_term="et-al",i.tmp.name_delimiter=i.inheritOpt(this,"delimiter","name-delimiter",", "),i.tmp["delimiter-precedes-et-al"]=i.inheritOpt(this,"delimiter-precedes-et-al"),i.inheritOpt(this,"and")==="text"?this.and_term=i.getTerm("and","long",0):i.inheritOpt(this,"and")==="symbol"&&(i.opt.development_extensions.expect_and_symbol_form?this.and_term=i.getTerm("and","symbol",0):this.and_term="&"),i.tmp.and_term=this.and_term,m.STARTSWITH_ROMANESQUE_REGEXP.test(this.and_term)?(this.and_prefix_single=" ",this.and_prefix_multiple=", ",typeof i.tmp.name_delimiter=="string"&&(this.and_prefix_multiple=i.tmp.name_delimiter),this.and_suffix=" "):(this.and_prefix_single="",this.and_prefix_multiple="",this.and_suffix=""),i.inheritOpt(this,"delimiter-precedes-last")==="always"?this.and_prefix_single=i.tmp.name_delimiter:i.inheritOpt(this,"delimiter-precedes-last")==="never"?this.and_prefix_multiple&&(this.and_prefix_multiple=" "):i.inheritOpt(this,"delimiter-precedes-last")==="after-inverted-name"&&(this.and_prefix_single&&(this.and_prefix_single=i.tmp.name_delimiter),this.and_prefix_multiple&&(this.and_prefix_multiple=" ")),this.and={},i.inheritOpt(this,"and")?(i.output.append(this.and_term,"empty",!0),this.and.single=i.output.pop(),this.and.single.strings.prefix=this.and_prefix_single,this.and.single.strings.suffix=this.and_suffix,i.output.append(this.and_term,"empty",!0),this.and.multiple=i.output.pop(),this.and.multiple.strings.prefix=this.and_prefix_multiple,this.and.multiple.strings.suffix=this.and_suffix):i.tmp.name_delimiter&&(this.and.single=new m.Blob(i.tmp.name_delimiter),this.and.single.strings.prefix="",this.and.single.strings.suffix="",this.and.multiple=new m.Blob(i.tmp.name_delimiter),this.and.multiple.strings.prefix="",this.and.multiple.strings.suffix=""),this.ellipsis={},i.inheritOpt(this,"et-al-use-last")&&(this.ellipsis_term="\u2026",this.ellipsis_prefix_single=" ",this.ellipsis_prefix_multiple=i.inheritOpt(this,"delimiter","name-delimiter",", "),this.ellipsis_suffix=" ",this.ellipsis.single=new m.Blob(this.ellipsis_term),this.ellipsis.single.strings.prefix=this.ellipsis_prefix_single,this.ellipsis.single.strings.suffix=this.ellipsis_suffix,this.ellipsis.multiple=new m.Blob(this.ellipsis_term),this.ellipsis.multiple.strings.prefix=this.ellipsis_prefix_multiple,this.ellipsis.multiple.strings.suffix=this.ellipsis_suffix),typeof i.tmp["et-al-min"]>"u"&&(i.tmp["et-al-min"]=i.inheritOpt(this,"et-al-min")),typeof i.tmp["et-al-use-first"]>"u"&&(i.tmp["et-al-use-first"]=i.inheritOpt(this,"et-al-use-first")),typeof i.tmp["et-al-use-last"]>"u"&&(i.tmp["et-al-use-last"]=i.inheritOpt(this,"et-al-use-last")),i.nameOutput.name=this},e.build.name_flag=!0,this.execs.push(n)}t.push(this)}};m.Node["name-part"]={build:function(e){e.build[this.strings.name]=this}};m.Node.names={build:function(e,t){var n;if((this.tokentype===m.START||this.tokentype===m.SINGLETON)&&(m.Util.substituteStart.call(this,e,t),e.build.substitute_level.push(1)),this.tokentype===m.SINGLETON){e.build.names_variables[e.build.names_variables.length-1].concat(this.variables);for(var r in this.variables){var i=this.variables[r],s=e.build.name_label[e.build.name_label.length-1];Object.keys(s).length&&(s[i]=s[Object.keys(s)[0]])}n=function(o){o.nameOutput.reinit(this,this.variables_real[0])},this.execs.push(n)}if(this.tokentype===m.START&&(e.build.names_flag=!0,e.build.name_flag=!1,e.build.names_level+=1,e.build.names_variables.push(this.variables),e.build.name_label.push({}),n=function(o){o.tmp.can_substitute.push(!0),o.tmp.name_node={},o.tmp.name_node.children=[],o.nameOutput.init(this)},this.execs.push(n)),this.tokentype===m.END){for(var r=0,a=3;r<a;r+=1){var l=["family","given","et-al"][r];this[l]=e.build[l],e.build.names_level===1&&(e.build[l]=void 0)}this.label=e.build.name_label[e.build.name_label.length-1],e.build.names_level+=-1,e.build.names_variables.pop(),e.build.name_label.pop(),n=function(o){o.tmp.etal_node?this.etal_style=o.tmp.etal_node:this.etal_style="empty",this.etal_term=o.getTerm(o.tmp.etal_term,"long",0),this.etal_prefix_single=" ",this.etal_prefix_multiple=o.tmp.name_delimiter,o.tmp["delimiter-precedes-et-al"]==="always"?this.etal_prefix_single=o.tmp.name_delimiter:o.tmp["delimiter-precedes-et-al"]==="never"?this.etal_prefix_multiple=" ":o.tmp["delimiter-precedes-et-al"]==="after-inverted-name"&&(this.etal_prefix_single=o.tmp.name_delimiter,this.etal_prefix_multiple=" "),this.etal_suffix="",m.STARTSWITH_ROMANESQUE_REGEXP.test(this.etal_term)||(this.etal_prefix_single===" "&&(this.etal_prefix_single=""),this.etal_prefix_multiple===" "&&(this.etal_prefix_multiple=""),this.etal_suffix===" "&&(this.etal_suffix=""));for(var p=0,f=3;p<f;p+=1){var g=["family","given"][p];o.nameOutput[g]=this[g]}o.nameOutput.with=this.with;var u="with",d="",v="";m.STARTSWITH_ROMANESQUE_REGEXP.test(u)&&(d=" ",v=" ");var h={};h.single=new m.Blob(u),h.single.strings.suffix=v,h.multiple=new m.Blob(u),h.multiple.strings.suffix=v,o.inheritOpt(o.nameOutput.name,"delimiter-precedes-last")==="always"?(h.single.strings.prefix=o.inheritOpt(this,"delimiter","names-delimiter"),h.multiple.strings.prefix=o.inheritOpt(this,"delimiter","names-delimiter")):o.inheritOpt(o.nameOutput.name,"delimiter-precedes-last")==="contextual"?(h.single.strings.prefix=d,h.multiple.strings.prefix=o.inheritOpt(this,"delimiter","names-delimiter")):o.inheritOpt(o.nameOutput.name,"delimiter-precedes-last")==="after-inverted-name"?(h.single.strings.prefix=o.inheritOpt(this,"delimiter","names-delimiter"),h.multiple.strings.prefix=d):(h.single.strings.prefix=d,h.multiple.strings.prefix=d),o.nameOutput.with=h,o.nameOutput.label=this.label,o.nameOutput.etal_style=this.etal_style,o.nameOutput.etal_term=this.etal_term,o.nameOutput.etal_prefix_single=this.etal_prefix_single,o.nameOutput.etal_prefix_multiple=this.etal_prefix_multiple,o.nameOutput.etal_suffix=this.etal_suffix,o.nameOutput.outputNames(),o.tmp["et-al-use-first"]=void 0,o.tmp["et-al-min"]=void 0,o.tmp["et-al-use-last"]=void 0},this.execs.push(n),n=function(o){o.tmp.can_substitute.pop()||o.tmp.can_substitute.replace(!1,m.LITERAL),o.tmp.can_substitute.mystack.length===1&&(o.tmp.can_block_substitute=!1)},this.execs.push(n),e.build.name_flag=!1}t.push(this),(this.tokentype===m.END||this.tokentype===m.SINGLETON)&&(e.build.substitute_level.pop(),m.Util.substituteEnd.call(this,e,t))}};m.Node.number={build:function(e,t){var n;m.Util.substituteStart.call(this,e,t),this.strings.form==="roman"?this.formatter=e.fun.romanizer:this.strings.form==="ordinal"?this.formatter=e.fun.ordinalizer:this.strings.form==="long-ordinal"&&(this.formatter=e.fun.long_ordinalizer),typeof this.successor_prefix>"u"&&(this.successor_prefix=e[e.build.area].opt.layout_delimiter),typeof this.splice_prefix>"u"&&(this.splice_prefix=e[e.build.area].opt.layout_delimiter),n=function(r,i,s){if(this.variables.length!==0){var a;if(a=this.variables[0],typeof s>"u")var s={};if(["locator","locator-extra"].indexOf(a)>-1){if(r.tmp.just_looking||!s[a])return}else if(!i[a])return;a==="collection-number"&&i.type==="legal_case"&&(r.tmp.renders_collection_number=!0);var l=this;if(r.tmp.group_context.tip.force_suppress)return!1;if(["locator","locator-extra"].indexOf(a)>-1?r.processNumber.call(r,l,s,a,i.type):(!r.tmp.group_context.tip.condition&&i[a]&&(r.tmp.just_did_number=(""+i[a]).match(/[0-9]$/)),r.processNumber.call(r,l,i,a,i.type)),this.substring){var o=i[a].slice(this.substring);r.output.append(o,l)}else m.Util.outputNumericField(r,a,i.id);["locator","locator-extra"].indexOf(this.variables_real[0])>-1&&!r.tmp.just_looking&&(r.tmp.done_vars.push(this.variables_real[0]),r.tmp.group_context.tip.done_vars.push(this.variables_real[0]))}},this.execs.push(n),t.push(this),m.Util.substituteEnd.call(this,e,t)}};m.Node.sort={build:function(e,t){if(t=e[e.build.root+"_sort"].tokens,this.tokentype===m.START){e.build.area==="citation"&&(e.opt.sort_citations=!0),e.build.area=e.build.root+"_sort",e.build.extension="_sort";var n=function(r,i){if(r.opt.has_layout_locale){for(var s=m.localeResolve(i.language,r.opt["default-locale"][0]),a=r[r.tmp.area.slice(0,-5)].opt.sort_locales,l,o=0,p=a.length;o<p&&(l=a[o][s.bare],l||(l=a[o][s.best]),!l);o+=1);l||(l=r.opt["default-locale"][0]),r.tmp.lang_sort_hold=r.opt.lang,r.opt.lang=l}};this.execs.push(n)}if(this.tokentype===m.END){e.build.area=e.build.root,e.build.extension="";var n=function(i){i.opt.has_layout_locale&&(i.opt.lang=i.tmp.lang_sort_hold,delete i.tmp.lang_sort_hold)};this.execs.push(n)}t.push(this)}};m.Node.substitute={build:function(e,t){var n;if(this.tokentype===m.START){var r=new m.Token("choose",m.START);m.Node.choose.build.call(r,e,t);var i=new m.Token("if",m.SINGLETON);n=function(){return!!(e.tmp.value.length&&!e.tmp.common_term_match_fail)},i.tests=[n],i.test=e.fun.match.any(i,e,i.tests),t.push(i),n=function(a){a.tmp.can_block_substitute=!0,a.tmp.value.length&&!a.tmp.common_term_match_fail&&a.tmp.can_substitute.replace(!1,m.LITERAL),a.tmp.common_term_match_fail=!1},this.execs.push(n),t.push(this)}if(this.tokentype===m.END){t.push(this);var s=new m.Token("choose",m.END);m.Node.choose.build.call(s,e,t)}}};m.Node.text={build:function(e,t){var n,r,i,s,a,l,o,p,f,g,u,d;if(this.postponed_macro){var v=m.Util.cloneToken(this);v.name="group",v.tokentype=m.START,m.Node.group.build.call(v,e,t),m.expandMacro.call(e,this,t);var h=m.Util.cloneToken(this);h.name="group",h.tokentype=m.END,this.postponed_macro==="juris-locator-label"&&(h.isJurisLocatorLabel=!0),m.Node.group.build.call(h,e,t)}else{if(m.Util.substituteStart.call(this,e,t),this.variables_real||(this.variables_real=[]),this.variables||(this.variables=[]),r="long",i=0,this.strings.form&&(r=this.strings.form),this.strings.plural&&(i=this.strings.plural),this.variables_real[0]==="citation-number"||this.variables_real[0]==="year-suffix"||this.variables_real[0]==="citation-label")this.variables_real[0]==="citation-number"?(e.build.root==="citation"&&(e.opt.update_mode=m.NUMERIC),e.build.root==="bibliography"&&(e.opt.bib_mode=m.NUMERIC),e[e.tmp.area].opt.collapse==="citation-number"&&(this.range_prefix=e.getTerm("citation-range-delimiter")),this.successor_prefix=e[e.build.area].opt.layout_delimiter,this.splice_prefix=e[e.build.area].opt.layout_delimiter,n=function(b,T,O){if(s=""+T.id,!b.tmp.just_looking){if(b.tmp.area.slice(-5)==="_sort"&&this.variables[0]==="citation-number"){if(b.tmp.area==="bibliography_sort"&&b.tmp.group_context.tip.done_vars.push("citation-number"),b.tmp.area==="citation_sort"&&b.bibliography_sort.tmp.citation_number_map)var L=b.bibliography_sort.tmp.citation_number_map[b.registry.registry[T.id].seq];else var L=b.registry.registry[T.id].seq;L&&(L=m.Util.padding(""+L)),b.output.append(L,this);return}O&&O["author-only"]&&b.tmp.element_trace.replace("suppress-me"),b.tmp.area!=="bibliography_sort"&&b.bibliography_sort.tmp.citation_number_map&&b.bibliography_sort.opt.citation_number_sort_direction===m.DESCENDING?L=b.bibliography_sort.tmp.citation_number_map[b.registry.registry[s].seq]:L=b.registry.registry[s].seq,b.opt.citation_number_slug?b.output.append(b.opt.citation_number_slug,this):(l=new m.NumericBlob(b,!1,L,this,T.id),b.tmp.in_cite_predecessor&&(l.suppress_splice_prefix=!0),b.output.append(l,"literal"))}},this.execs.push(n)):this.variables_real[0]==="year-suffix"?(e.opt.has_year_suffix=!0,e[e.tmp.area].opt.collapse==="year-suffix-ranged"&&(this.range_prefix=e.getTerm("citation-range-delimiter")),this.successor_prefix=e[e.build.area].opt.layout_delimiter,e[e.tmp.area].opt["year-suffix-delimiter"]&&(this.successor_prefix=e[e.build.area].opt["year-suffix-delimiter"]),n=function(b,T){if(b.registry.registry[T.id]&&b.registry.registry[T.id].disambig.year_suffix!==!1&&!b.tmp.just_looking){a=parseInt(b.registry.registry[T.id].disambig.year_suffix,10),b[b.tmp.area].opt.cite_group_delimiter&&(this.successor_prefix=b[b.tmp.area].opt.cite_group_delimiter),l=new m.NumericBlob(b,!1,a,this,T.id),o=new m.Util.Suffixator(m.SUFFIX_CHARS),l.setFormatter(o),b.output.append(l,"literal"),p=!1;for(var O=0,L=b.tmp.group_context.mystack.length;O<L;O++){var x=b.tmp.group_context.mystack[O];if(!x.variable_success&&(x.variable_attempt||!x.variable_attempt&&!x.term_intended)){p=!0;break}}f=b[b.tmp.area].opt["year-suffix-delimiter"],p&&f&&!b.tmp.sort_key_flag&&(b.tmp.splice_delimiter=b[b.tmp.area].opt["year-suffix-delimiter"])}},this.execs.push(n)):this.variables_real[0]==="citation-label"&&(e.build.root==="bibliography"&&(e.opt.bib_mode=m.TRIGRAPH),e.opt.has_year_suffix=!0,n=function(b,T){g=T["citation-label"],g||(g=b.getCitationLabel(T)),b.tmp.just_looking||(u="",b.registry.registry[T.id]&&b.registry.registry[T.id].disambig.year_suffix!==!1&&(a=parseInt(b.registry.registry[T.id].disambig.year_suffix,10),u=b.fun.suffixator.format(a)),g+=u),b.output.append(g,this)},this.execs.push(n));else if(this.strings.term)n=function(b,T){var O=b.opt.gender[T.type],L=this.strings.term;L=b.getTerm(L,r,i,O,m.TOLERANT,this.default_locale);var x;if(L!==""&&(b.tmp.group_context.tip.term_intended=!0),m.UPDATE_GROUP_CONTEXT_CONDITION(b,L,null,this),!b.tmp.term_predecessor&&!(b.opt.class==="in-text"&&b.tmp.area==="citation")?x=m.Output.Formatters["capitalize-first"](b,L):x=L,b.tmp.strip_periods)x=x.replace(/\./g,"");else for(var k=0,N=this.decorations.length;k<N;k+=1)if(this.decorations[k][0]==="@strip-periods"&&this.decorations[k][1]==="true"){x=x.replace(/\./g,"");break}b.output.append(x,this),b.tmp.can_block_substitute&&b.tmp.can_substitute.replace(!1,m.LITERAL)},this.execs.push(n),e.build.term=!1,e.build.form=!1,e.build.plural=!1;else if(this.variables_real.length){if(n=function(b,T){this.variables_real[0]!=="locator"&&(b.tmp.have_collapsed=!1),!b.tmp.group_context.tip.condition&&T[this.variables[0]]&&(b.tmp.just_did_number=!1);var O=T[this.variables[0]];O&&!b.tmp.group_context.tip.condition&&((""+O).slice(-1).match(/[0-9]/)?b.tmp.just_did_number=!0:b.tmp.just_did_number=!1)},this.execs.push(n),m.MULTI_FIELDS.indexOf(this.variables_real[0])>-1||this.variables_real[0].indexOf("-main")>-1||this.variables_real[0].indexOf("-sub")>-1||["language-name","language-name-original"].indexOf(this.variables_real[0])>-1){var S=this.variables[0],c=!1,_=!1,y=!1;r==="short"?this.variables_real[0].slice(-6)!=="-short"&&(_=this.variables_real[0]+"-short"):S=!1,e.build.extension?y=!0:(y=!0,c=!0),n=e.transform.getOutputFunction(this.variables,S,c,_,y)}else m.CITE_FIELDS.indexOf(this.variables_real[0])>-1?n=function(b,T,O){O&&O[this.variables[0]]&&(b.processNumber(this,O,this.variables[0],T.type),m.Util.outputNumericField(b,this.variables[0],T.id),["locator","locator-extra"].indexOf(this.variables_real[0])>-1&&!b.tmp.just_looking&&b.tmp.done_vars.push(this.variables_real[0]))}:["page","page-first","chapter-number","collection-number","edition","issue","number","number-of-pages","number-of-volumes","volume"].indexOf(this.variables_real[0])>-1?n=function(b,T){b.processNumber(this,T,this.variables[0],T.type),m.Util.outputNumericField(b,this.variables[0],T.id)}:["URL","DOI"].indexOf(this.variables_real[0])>-1?n=function(b,T){var O;if(this.variables[0]&&(O=b.getVariable(T,this.variables[0],r),O))if(this.variables[0]==="URL"&&r==="short"&&(O=O.replace(/(.*\.[^\/]+)\/.*/,"$1"),O.match(/\/\/www\./)&&(O=O.replace(/https?:\/\//,""))),b.opt.development_extensions.wrap_url_and_doi)if(!this.decorations.length||this.decorations[0][0]!=="@"+this.variables[0]){var L=m.Util.cloneToken(this),x=new m.Blob(null,null,"url-wrapper");if(x.decorations.push(["@DOI","true"]),this.variables_real[0]==="DOI"){var k;this.strings.prefix&&this.strings.prefix.match(/^.*https:\/\/doi\.org\/$/)&&(O=O.replace(/^https?:\/\/doi\.org\//,""),O.match(/^https?:\/\//)?k="":k="https://doi.org/",L.strings.prefix=this.strings.prefix.slice(0,L.strings.prefix.length-16));var N=new m.Blob(k),R=new m.Blob(O);x.push(N),x.push(R),b.output.append(x,L,!1,!1,!0)}else{var R=new m.Blob(O);x.push(R),b.output.append(x,L,!1,!1,!0)}}else b.output.append(O,this,!1,!1,!0);else{if(this.decorations.length)for(var I=this.decorations.length-1;I>-1;I--)this.decorations[I][0]==="@"+this.variables[0]&&(this.decorations=this.decorations.slice(0,I).concat(this.decorations.slice(I+1)));b.output.append(O,this,!1,!1,!0)}}:this.variables_real[0]==="section"?n=function(b,T){var O;O=b.getVariable(T,this.variables[0],r),O&&b.output.append(O,this)}:this.variables_real[0]==="hereinafter"?n=function(b,T){var O=b.transform.abbrevs.default.hereinafter[T.id];O&&(b.output.append(O,this),b.tmp.group_context.tip.variable_success=!0)}:n=function(b,T){var O;this.variables[0]&&(O=b.getVariable(T,this.variables[0],r),O&&(O=""+O,O=O.split("\\").join(""),b.output.append(O,this)))};this.execs.push(n)}else this.strings.value&&(n=function(b){b.tmp.group_context.tip.term_intended=!0,m.UPDATE_GROUP_CONTEXT_CONDITION(b,this.strings.value,!0,this),b.output.append(this.strings.value,this),b.tmp.can_block_substitute&&b.tmp.can_substitute.replace(!1,m.LITERAL)},this.execs.push(n));t.push(this),m.Util.substituteEnd.call(this,e,t)}}};m.Node.intext={build:function(e,t){if(this.tokentype===m.START){e.build.area="intext",e.build.root="intext",e.build.extension="";var n=function(r,i){r.tmp.area="intext",r.tmp.root="intext",r.tmp.extension=""};this.execs.push(n)}this.tokentype===m.END&&(e.intext_sort={opt:{sort_directions:e.citation_sort.opt.sort_directions}},e.intext.srt=e.citation.srt),t.push(this)}};m.Attributes={};m.Attributes["@disambiguate"]=function(e,t){if(this.tests||(this.tests=[]),t==="true"){e.opt.has_disambiguate=!0;var n=function(r){if(e.tmp.area==="bibliography"){if(e.tmp.disambiguate_count<e.registry.registry[r.id].disambig.disambiguate)return e.tmp.disambiguate_count+=1,!0}else if(e.tmp.disambiguate_maxMax+=1,e.tmp.disambig_settings.disambiguate&&e.tmp.disambiguate_count<e.tmp.disambig_settings.disambiguate)return e.tmp.disambiguate_count+=1,!0;return!1};this.tests.push(n)}else if(t==="check-ambiguity-and-backreference"){var n=function(i){return!!(e.registry.registry[i.id].disambig.disambiguate&&e.registry.registry[i.id]["citation-count"]>1)};this.tests.push(n)}};m.Attributes["@is-numeric"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(s){return function(a,l){var o=a;if(l&&["locator","locator-extra"].indexOf(s)>-1&&(o=l),!o[s])return!1;if(m.NUMERIC_VARIABLES.indexOf(s)>-1){if(e.tmp.shadow_numbers[s]||e.processNumber(!1,o,s,a.type),e.tmp.shadow_numbers[s].numeric)return!0}else if(["title","version"].indexOf(s)>-1&&o[s].slice(-1)===""+parseInt(o[s].slice(-1),10))return!0;return!1}},i=0;i<n.length;i+=1)this.tests.push(r(n[i]))};m.Attributes["@is-uncertain-date"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(a){return function(l){return!!(l[a]&&l[a].circa)}},i=0,s=n.length;i<s;i+=1)this.tests.push(r(n[i]))};m.Attributes["@locator"]=function(e,t){this.tests||(this.tests=[]);var n=t.replace("sub verbo","sub-verbo");n=n.split(/\s+/);for(var r=function(a){return function(l,o){var p;return e.processNumber(!1,o,"locator"),p=e.tmp.shadow_numbers.locator.label,!!(p&&a===p)}},i=0,s=n.length;i<s;i+=1)this.tests.push(r(n[i]))};m.Attributes["@position"]=function(e,t){this.tests||(this.tests=[]);var n;e.opt.update_mode=m.POSITION;for(var r=t.split(/\s+/),i=function(p,f){return!!(f&&m.POSITION_MAP[f.position]>=m.POSITION_MAP[m.POSITION_SUBSEQUENT]&&f["near-note"])},s=function(p,f){return!!(f&&m.POSITION_MAP[f.position]==m.POSITION_MAP[m.POSITION_SUBSEQUENT]&&!f["near-note"])},a=function(p){return function(f,g){if(e.tmp.area==="bibliography")return!1;if(g&&typeof g.position>"u"&&(g.position=0),g&&typeof g.position=="number"){if(g.position===0&&p===0)return!0;if(p>0&&m.POSITION_MAP[g.position]>=m.POSITION_MAP[p])return!0}else if(p===0)return!0;return!1}},l=0,o=r.length;l<o;l+=1){var n=r[l];n==="first"?n=m.POSITION_FIRST:n==="container-subsequent"?n=m.POSITION_CONTAINER_SUBSEQUENT:n==="subsequent"?n=m.POSITION_SUBSEQUENT:n==="ibid"?n=m.POSITION_IBID:n==="ibid-with-locator"&&(n=m.POSITION_IBID_WITH_LOCATOR),n==="near-note"?this.tests.push(i):n==="far-note"?this.tests.push(s):this.tests.push(a(n))}};m.Attributes["@type"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(l){return function(o){var p=o.type===l;return!!p}},i=[],s=0,a=n.length;s<a;s+=1)i.push(r(n[s]));this.tests.push(e.fun.match.any(this,e,i))};m.Attributes["@variable"]=function(e,t){this.tests||(this.tests=[]);var n;if(this.variables=t.split(/\s+/),this.variables_real=this.variables.slice(),this.name==="label"&&this.variables[0])this.strings.term=this.variables[0];else if(["names","date","text","number"].indexOf(this.name)>-1)n=function(a,l,o){for(var p=this.variables.length-1;p>-1;p+=-1)this.variables.pop();for(var p=0,f=this.variables_real.length;p<f;p++)a.tmp.done_vars.indexOf(this.variables_real[p])===-1&&this.variables.push(this.variables_real[p]),a.tmp.can_block_substitute&&a.tmp.done_vars.push(this.variables_real[p])},this.execs.push(n),n=function(a,l,o){for(var p=!1,f=0,g=this.variables.length;f<g;f++){var u=this.variables[f];if(["authority","committee"].indexOf(u)>-1&&typeof l[u]=="string"&&this.name==="names"){var d=!0,v=l[u].split(/\s*;\s*/),h={};if(l.multi&&l.multi._keys[u]){for(var S in l.multi._keys[u])if(h[S]=l.multi._keys[u][S].split(/\s*;\s*/),h[S].length!==v.length){d=!1;break}}d||(v=[l[u]],h=l.multi._keys[u]);for(var c=0,_=v.length;c<_;c++){var y={literal:v[c],multi:{_key:{}}};for(var S in h){var b={literal:h[S][c]};y.multi._key[S]=b}v[c]=y}l[u]=v}if(this.strings.form==="short"&&!l[u]&&(u==="title"?u="title-short":u==="container-title"&&(u="container-title-short")),u==="year-suffix"){p=!0;break}else if(m.DATE_VARIABLES.indexOf(u)>-1){if(a.opt.development_extensions.locator_date_and_revision&&u==="locator-date"){p=!0;break}if(l[u]){for(var T in l[u])if(!(this.dateparts.indexOf(T)===-1&&T!=="literal")&&l[u][T]){p=!0;break}if(p)break}}else if(u==="locator"){o&&o.locator&&(p=!0);break}else if(u==="locator-extra"){o&&o["locator-extra"]&&(p=!0);break}else if(["citation-number","citation-label"].indexOf(u)>-1){p=!0;break}else if(u==="first-reference-note-number"){o&&o["first-reference-note-number"]&&(p=!0);break}else if(u==="first-container-reference-note-number"){o&&o["first-container-reference-note-number"]&&(p=!0);break}else if(u==="hereinafter"){a.transform.abbrevs.default.hereinafter[l.id]&&a.sys.getAbbreviation&&l.id&&(p=!0);break}else{if(typeof l[u]=="object")break;if(typeof l[u]=="string"&&l[u]){p=!0;break}else if(typeof l[u]=="number"){p=!0;break}}if(p)break}if(p){for(var f=0,g=this.variables_real.length;f<g;f++){var u=this.variables_real[f];(u!=="citation-number"||a.tmp.area!=="bibliography")&&(a.tmp.cite_renders_content=!0),a.tmp.group_context.tip.variable_success=!0,a.tmp.can_substitute.value()&&a.tmp.area==="bibliography"&&typeof l[u]=="string"&&(a.tmp.name_node.top=a.output.current.value(),a.tmp.rendered_name.push(l[u]))}a.tmp.can_substitute.replace(!1,m.LITERAL)}else a.tmp.group_context.tip.variable_attempt=!0},this.execs.push(n);else if(["if","else-if","condition"].indexOf(this.name)>-1)for(var r=function(a){return function(l,o){var p=l;if(o&&["locator","locator-extra","first-reference-note-number","first-container-reference-note-number","locator-date"].indexOf(a)>-1&&(p=o),a==="hereinafter"&&e.sys.getAbbreviation&&p.id){if(e.transform.abbrevs.default.hereinafter[p.id])return!0}else if(p[a]){if(typeof p[a]=="number"||typeof p[a]=="string")return!0;if(typeof p[a]=="object"){for(var f in p[a])if(p[a][f])return!0}}return!1}},i=0,s=this.variables.length;i<s;i+=1)this.tests.push(r(this.variables[i]))};m.Attributes["@page"]=function(e,t){this.tests||(this.tests=[]);var n=t.replace("sub verbo","sub-verbo");n=n.split(/\s+/);for(var r=function(a){return function(l){var o;return e.processNumber(!1,l,"page",l.type),e.tmp.shadow_numbers.page.label?e.tmp.shadow_numbers.page.label==="sub verbo"?o="sub-verbo":o=e.tmp.shadow_numbers.page.label:o="page",e.tmp.shadow_numbers.page.values.length>0&&e.tmp.shadow_numbers.page.values[0].gotosleepability&&(e.tmp.shadow_numbers.page.values[0].labelVisibility=!1),a===o}},i=0,s=n.length;i<s;i+=1)this.tests.push(r(n[i]))};m.Attributes["@number"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(a){return function(l){var o;return e.processNumber(!1,l,"number",l.type),e.tmp.shadow_numbers.number.label?o=e.tmp.shadow_numbers.number.label:o="number",a===o}},i=0,s=n.length;i<s;i+=1)this.tests.push(r(n[i]))};m.Attributes["@jurisdiction"]=function(e,t){this.tests||(this.tests=[]);var n=t.split(/\s+/),r=function(i){return function(s){if(!s.jurisdiction)return!1;for(var a=s.jurisdiction,l=0,o=i.length;l<o;l++)if(a===i[l])return!0;return!1}};this.tests.push(r(n))};m.Attributes["@country"]=function(e,t){this.tests||(this.tests=[]);var n=t.split(/\s+/),r=function(i){return function(s){if(!s.country)return!1;for(var a=s.country,l=0,o=i.length;l<o;l++)if(a===i[l])return!0;return!1}};this.tests.push(r(n))};m.Attributes["@context"]=function(e,t){this.tests||(this.tests=[]);var n=function(){if(["bibliography","citation"].indexOf(t)>-1){var r=e.tmp.area.slice(0,t.length);return r===t}else if(t==="alternative")return!!e.tmp.abort_alternative};this.tests.push(n)};m.Attributes["@has-year-only"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(a){return function(l){var o=l[a];return!(!o||o.month||o.season)}},i=0,s=n.length;i<s;i+=1)this.tests.push(r(n[i]))};m.Attributes["@has-to-month-or-season"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(a){return function(l){var o=l[a];return!(!o||!o.month&&!o.season||o.day)}},i=0,s=n.length;i<s;i+=1)this.tests.push(r(n[i]))};m.Attributes["@has-day"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(a){return function(l){var o=l[a];return!(!o||!o.day)}},i=0,s=n.length;i<s;i+=1)this.tests.push(r(n[i]))};m.Attributes["@is-plural"]=function(e,t){this.tests||(this.tests=[]);var n=function(r){var i=r[t];if(i&&i.length){for(var s=0,a=0,l=!1,o=0,p=i.length;o<p;o+=1)e.opt.development_extensions.spoof_institutional_affiliations&&(i[o].literal||i[o].isInstitution&&i[o].family&&!i[o].given)?(a+=1,l=!1):(s+=1,l=!0);if(s>1)return!0;if(a>1)return!0;if(a&&l)return!0}return!1};this.tests.push(n)};m.Attributes["@is-multiple"]=function(e,t){this.tests||(this.tests=[]);var n=function(r){var i=""+r[t],s=i.split(/(?:,\s|\s(?:tot\sen\smet|līdz|oraz|and|bis|έως|και|och|až|do|en|et|in|ir|ja|og|sa|to|un|und|és|și|i|u|y|à|e|a|и|-|–)\s|—|\&)/);return s.length>1};this.tests.push(n)};m.Attributes["@locale"]=function(e,t){this.tests||(this.tests=[]);var n,r,i,s,a,l,o=e.opt["default-locale"][0];if(this.name==="layout"){if(this.locale_raw=t,this.tokentype===m.START){e.opt.multi_layout||(e.opt.multi_layout=[]);var p=[],f=t.split(/\s+/),g={},u=m.localeResolve(f[0],o);p.push(u),u.generic?g[u.generic]=u.best:g[u.best]=u.best;for(var a=1,l=f.length;a<l;a+=1){var d=m.localeResolve(f[a],o);p.push(d),d.generic?g[d.generic]=u.best:g[d.best]=u.best}e[e.build.area].opt.sort_locales.push(g),e.opt.multi_layout.push(p)}e.opt.has_layout_locale=!0}else{s=t.split(/\s+/);var v=[];for(a=0,l=s.length;a<l;a+=1)i=s[a],r=m.localeResolve(i,o),s[a].length===2&&v.push(r.bare),e.localeConfigure(r,!0),s[a]=r;var h=s.slice(),S=function(c,_,y){return function(b){var T;n=[],T=!1;var O=!1,L;for(b.language?L=b.language:L=_,O=m.localeResolve(L,_),a=0,l=c.length;a<l;a+=1)if(O.best===c[a].best){e.tmp.condition_lang_counter_arr.push(e.tmp.condition_counter),e.tmp.condition_lang_val_arr.push(e.opt.lang),e.opt.lang=c[0].best,T=!0;break}return!T&&y.indexOf(O.bare)>-1&&(e.tmp.condition_lang_counter_arr.push(e.tmp.condition_counter),e.tmp.condition_lang_val_arr.push(e.opt.lang),e.opt.lang=c[0].best,T=!0),T}};this.tests.push(S(h,o,v))}};m.Attributes["@alternative-node-internal"]=function(e){this.tests||(this.tests=[]);var t=function(){return function(){return!e.tmp.abort_alternative}},n=this;this.tests.push(t(n))};m.Attributes["@locale-internal"]=function(e,t){this.tests||(this.tests=[]);var n,r,i,s,a;for(i=t.split(/\s+/),this.locale_bares=[],s=0,a=i.length;s<a;s+=1)r=i[s],n=m.localeResolve(r,e.opt["default-locale"][0]),i[s].length===2&&this.locale_bares.push(n.bare),e.localeConfigure(n),i[s]=n;this.locale_default=e.opt["default-locale"][0],this.locale=i[0].best,this.locale_list=i.slice();var l=function(p){return function(f){var g,u;g=[],u=!1;var d=!1;if(f.language&&(r=f.language,d=m.localeResolve(r,e.opt["default-locale"][0]),d.best===e.opt["default-locale"][0]&&(d=!1)),d){for(s=0,a=p.locale_list.length;s<a;s+=1)if(d.best===p.locale_list[s].best){e.opt.lang=p.locale,e.tmp.last_cite_locale=p.locale,e.output.openLevel("empty"),e.output.current.value().new_locale=p.locale,u=!0;break}!u&&p.locale_bares.indexOf(d.bare)>-1&&(e.opt.lang=p.locale,e.tmp.last_cite_locale=p.locale,e.output.openLevel("empty"),e.output.current.value().new_locale=p.locale,u=!0)}return u}},o=this;this.tests.push(l(o))};m.Attributes["@court-class"]=function(e,t){this.tests||(this.tests=[]);for(var n=t.split(/\s+/),r=function(a){return function(l){var o=m.GET_COURT_CLASS(e,l);return o===a}},i=0,s=n.length;i<s;i++)this.tests.push(r(n[i]))};m.Attributes["@container-multiple"]=function(e,t){this.tests||(this.tests=[]);var n=t==="true",r=function(i){return function(s){if(e.tmp.container_item_count[s.container_id]){if(e.tmp.container_item_count[s.container_id]>1)return i}else return!i;return!i}};this.tests.push(r(n))};m.Attributes["@container-subsequent"]=function(e,t){this.tests||(this.tests=[]);var n=t==="true",r=function(i){return function(s){return e.tmp.container_item_pos[s.container_id]>1?i:!i}};this.tests.push(r(n))};m.Attributes["@has-subunit"]=function(e,t){this.tests||(this.tests=[]);var n=function(r){return function(i){var s=0;for(var a in i[r]){var l=i[r][a];if(!l.given){var o=l.literal?l.literal:l.family,p=o.split("|").length;(s===0||p<s)&&(s=p)}}return s>1}};this.tests.push(n(t))};m.Attributes["@cite-form"]=function(e,t){this.tests||(this.tests=[]);var n=function(r){return function(i){return i["cite-form"]===r}};this.tests.push(n(t))};m.Attributes["@disable-duplicate-year-suppression"]=function(e,t){e.opt.disable_duplicate_year_suppression=t.split(/\s+/)};m.Attributes["@consolidate-containers"]=function(e,t){m.Attributes["@track-containers"](e,t);var n=t.split(/\s+/);e.bibliography.opt.consolidate_containers=n};m.Attributes["@track-containers"]=function(e,t){var n=t.split(/\s+/);e.bibliography.opt.track_container_items||(e.bibliography.opt.track_container_items=[]),e.bibliography.opt.consolidate_containers||(e.bibliography.opt.consolidate_containers=[]),e.bibliography.opt.track_container_items=e.bibliography.opt.track_container_items.concat(n)};m.Attributes["@parallel-first"]=function(e,t){e.opt.parallel.enable=!0;var n=t.split(/\s+/);e.opt.track_repeat||(e.opt.track_repeat={}),this.parallel_first={};for(var r in n){var i=n[r];this.parallel_first[i]=!0,e.opt.track_repeat[i]=!0}};m.Attributes["@parallel-last"]=function(e,t){e.opt.parallel.enable=!0;var n=t.split(/\s+/);e.opt.track_repeat||(e.opt.track_repeat={}),this.parallel_last={};for(var r in n){var i=n[r];this.parallel_last[i]=!0,e.opt.track_repeat[i]=!0}};m.Attributes["@parallel-last-to-first"]=function(e,t){e.opt.parallel.enable=!0;var n=t.split(/\s+/);this.parallel_last_to_first={};for(var r=0,i=n.length;r<i;r++)this.parallel_last_to_first[n[r]]=!0};m.Attributes["@parallel-delimiter-override"]=function(e,t){e.opt.parallel.enable=!0,this.strings.set_parallel_delimiter_override=t};m.Attributes["@parallel-delimiter-override-on-suppress"]=function(e,t){e.opt.parallel.enable=!0,this.strings.set_parallel_delimiter_override_on_suppress=t};m.Attributes["@no-repeat"]=function(e,t){e.opt.parallel.enable=!0;var n=t.split(/\s+/);e.opt.track_repeat||(e.opt.track_repeat={}),this.non_parallel={};for(var r in n){var i=n[r];this.non_parallel[i]=!0,e.opt.track_repeat[i]=!0}};m.Attributes["@require"]=function(e,t){e.opt.use_context_condition=!0,this.strings.require=t};m.Attributes["@reject"]=function(e,t){e.opt.use_context_condition=!0,this.strings.reject=t};m.Attributes["@require-comma-on-symbol"]=function(e,t){e.opt.require_comma_on_symbol=t};m.Attributes["@gender"]=function(e,t){this.gender=t};m.Attributes["@cslid"]=function(e,t){this.cslid=parseInt(t,10)};m.Attributes["@capitalize-if-first"]=function(e,t){this.strings.capitalize_if_first_override=t};m.Attributes["@label-capitalize-if-first"]=function(e,t){this.strings.label_capitalize_if_first_override=t};m.Attributes["@label-form"]=function(e,t){this.strings.label_form_override=t};m.Attributes["@part-separator"]=function(e,t){this.strings["part-separator"]=t};m.Attributes["@leading-noise-words"]=function(e,t){this["leading-noise-words"]=t};m.Attributes["@name-never-short"]=function(e,t){this["name-never-short"]=t};m.Attributes["@class"]=function(e,t){e.opt.class=t};m.Attributes["@version"]=function(e,t){e.opt.version=t};m.Attributes["@value"]=function(e,t){this.strings.value=t};m.Attributes["@name"]=function(e,t){this.strings.name=t};m.Attributes["@form"]=function(e,t){this.strings.form=t};m.Attributes["@date-parts"]=function(e,t){this.strings["date-parts"]=t};m.Attributes["@range-delimiter"]=function(e,t){this.strings["range-delimiter"]=t};m.Attributes["@macro"]=function(e,t){this.postponed_macro=t};m.Attributes["@term"]=function(e,t){t==="sub verbo"?this.strings.term="sub-verbo":this.strings.term=t};m.Attributes["@xmlns"]=function(){};m.Attributes["@lang"]=function(e,t){t&&(e.build.lang=t)};m.Attributes["@lingo"]=function(){};m.Attributes["@macro-has-date"]=function(){this["macro-has-date"]=!0};m.Attributes["@suffix"]=function(e,t){this.strings.suffix=t};m.Attributes["@prefix"]=function(e,t){this.strings.prefix=t};m.Attributes["@delimiter"]=function(e,t){this.strings.delimiter=t};m.Attributes["@match"]=function(e,t){this.match=t};m.Attributes["@names-min"]=function(e,t){var n=parseInt(t,10);e[e.build.area].opt.max_number_of_names<n&&(e[e.build.area].opt.max_number_of_names=n),this.strings["et-al-min"]=n};m.Attributes["@names-use-first"]=function(e,t){this.strings["et-al-use-first"]=parseInt(t,10)};m.Attributes["@names-use-last"]=function(e,t){t==="true"?this.strings["et-al-use-last"]=!0:this.strings["et-al-use-last"]=!1};m.Attributes["@sort"]=function(e,t){t==="descending"&&(this.strings.sort_direction=m.DESCENDING)};m.Attributes["@plural"]=function(e,t){t==="always"||t==="true"?this.strings.plural=1:t==="never"||t==="false"?this.strings.plural=0:t==="contextual"&&(this.strings.plural=!1)};m.Attributes["@has-publisher-and-publisher-place"]=function(){this.strings["has-publisher-and-publisher-place"]=!0};m.Attributes["@publisher-delimiter-precedes-last"]=function(e,t){this.strings["publisher-delimiter-precedes-last"]=t};m.Attributes["@publisher-delimiter"]=function(e,t){this.strings["publisher-delimiter"]=t};m.Attributes["@publisher-and"]=function(e,t){this.strings["publisher-and"]=t};m.Attributes["@givenname-disambiguation-rule"]=function(e,t){m.GIVENNAME_DISAMBIGUATION_RULES.indexOf(t)>-1&&(e.citation.opt["givenname-disambiguation-rule"]=t)};m.Attributes["@collapse"]=function(e,t){t&&(e[this.name].opt.collapse=t)};m.Attributes["@cite-group-delimiter"]=function(e,t){t&&(e[e.tmp.area].opt.cite_group_delimiter=t)};m.Attributes["@names-delimiter"]=function(e,t){e.setOpt(this,"names-delimiter",t)};m.Attributes["@name-form"]=function(e,t){e.setOpt(this,"name-form",t)};m.Attributes["@subgroup-delimiter"]=function(e,t){this.strings["subgroup-delimiter"]=t};m.Attributes["@subgroup-delimiter-precedes-last"]=function(e,t){this.strings["subgroup-delimiter-precedes-last"]=t};m.Attributes["@name-delimiter"]=function(e,t){e.setOpt(this,"name-delimiter",t)};m.Attributes["@et-al-min"]=function(e,t){var n=parseInt(t,10);e[e.build.area].opt.max_number_of_names<n&&(e[e.build.area].opt.max_number_of_names=n),e.setOpt(this,"et-al-min",n)};m.Attributes["@et-al-use-first"]=function(e,t){e.setOpt(this,"et-al-use-first",parseInt(t,10))};m.Attributes["@et-al-use-last"]=function(e,t){t==="true"?e.setOpt(this,"et-al-use-last",!0):e.setOpt(this,"et-al-use-last",!1)};m.Attributes["@et-al-subsequent-min"]=function(e,t){var n=parseInt(t,10);e[e.build.area].opt.max_number_of_names<n&&(e[e.build.area].opt.max_number_of_names=n),e.setOpt(this,"et-al-subsequent-min",n)};m.Attributes["@et-al-subsequent-use-first"]=function(e,t){e.setOpt(this,"et-al-subsequent-use-first",parseInt(t,10))};m.Attributes["@suppress-min"]=function(e,t){this.strings["suppress-min"]=parseInt(t,10)};m.Attributes["@suppress-max"]=function(e,t){this.strings["suppress-max"]=parseInt(t,10)};m.Attributes["@and"]=function(e,t){e.setOpt(this,"and",t)};m.Attributes["@delimiter-precedes-last"]=function(e,t){e.setOpt(this,"delimiter-precedes-last",t)};m.Attributes["@delimiter-precedes-et-al"]=function(e,t){e.setOpt(this,"delimiter-precedes-et-al",t)};m.Attributes["@initialize-with"]=function(e,t){e.setOpt(this,"initialize-with",t)};m.Attributes["@initialize"]=function(e,t){t==="false"&&e.setOpt(this,"initialize",!1)};m.Attributes["@name-as-reverse-order"]=function(e,t){this["name-as-reverse-order"]=t};m.Attributes["@name-as-sort-order"]=function(e,t){this.name==="style-options"?this["name-as-sort-order"]=t:e.setOpt(this,"name-as-sort-order",t)};m.Attributes["@sort-separator"]=function(e,t){e.setOpt(this,"sort-separator",t)};m.Attributes["@require-match"]=function(e,t){t==="true"&&(this.requireMatch=!0)};m.Attributes["@exclude-types"]=function(e,t){e.bibliography.opt.exclude_types=t.split(/\s+/)};m.Attributes["@exclude-with-fields"]=function(e,t){e.bibliography.opt.exclude_with_fields=t.split(/\s+/)};m.Attributes["@year-suffix-delimiter"]=function(e,t){e[this.name].opt["year-suffix-delimiter"]=t};m.Attributes["@after-collapse-delimiter"]=function(e,t){e[this.name].opt["after-collapse-delimiter"]=t};m.Attributes["@subsequent-author-substitute"]=function(e,t){e[this.name].opt["subsequent-author-substitute"]=t};m.Attributes["@subsequent-author-substitute-rule"]=function(e,t){e[this.name].opt["subsequent-author-substitute-rule"]=t};m.Attributes["@disambiguate-add-names"]=function(e,t){t==="true"&&(e.opt["disambiguate-add-names"]=!0)};m.Attributes["@disambiguate-add-givenname"]=function(e,t){t==="true"&&(e.opt["disambiguate-add-givenname"]=!0)};m.Attributes["@disambiguate-add-year-suffix"]=function(e,t){t==="true"&&e.opt.xclass!=="numeric"&&(e.opt["disambiguate-add-year-suffix"]=!0)};m.Attributes["@second-field-align"]=function(e,t){(t==="flush"||t==="margin")&&(e[this.name].opt["second-field-align"]=t)};m.Attributes["@hanging-indent"]=function(e,t){t==="true"&&(e.opt.development_extensions.hanging_indent_legacy_number?e[this.name].opt.hangingindent=2:e[this.name].opt.hangingindent=!0)};m.Attributes["@line-spacing"]=function(e,t){t&&t.match(/^[.0-9]+$/)&&(e[this.name].opt["line-spacing"]=parseFloat(t,10))};m.Attributes["@entry-spacing"]=function(e,t){t&&t.match(/^[.0-9]+$/)&&(e[this.name].opt["entry-spacing"]=parseFloat(t,10))};m.Attributes["@near-note-distance"]=function(e,t){e[this.name].opt["near-note-distance"]=parseInt(t,10)};m.Attributes["@substring"]=function(e,t){this.substring=parseInt(t,10)};m.Attributes["@text-case"]=function(e,t){var n=function(r,i){t==="normal"?this.text_case_normal=!0:(this.strings["text-case"]=t,t==="title"&&i.jurisdiction&&(this.strings["text-case"]="passthrough"))};this.execs.push(n)};m.Attributes["@page-range-format"]=function(e,t){e.opt["page-range-format"]=t};m.Attributes["@year-range-format"]=function(e,t){e.opt["year-range-format"]=t};m.Attributes["@default-locale"]=function(e,t){if(this.name==="style"){var n,r,i,a,s,a=t.match(/-x-(sort|translit|translat)-/g);if(a)for(i=0,r=a.length;i<r;i+=1)a[i]=a[i].replace(/^-x-/,"").replace(/-$/,"");for(n=t.split(/-x-(?:sort|translit|translat)-/),s=[n[0]],i=1,r=n.length;i<r;i+=1)s.push(a[i-1]),s.push(n[i]);for(n=s.slice(),r=n.length,i=1;i<r;i+=2)e.opt["locale-"+n[i]].push(n[i+1].replace(/^\s*/g,"").replace(/\s*$/g,""));n.length?e.opt["default-locale"]=n.slice(0,1):e.opt["default-locale"]=["en"]}else t==="true"&&(this.default_locale=!0)};m.Attributes["@default-locale-sort"]=function(e,t){e.opt["default-locale-sort"]=t};m.Attributes["@demote-non-dropping-particle"]=function(e,t){e.opt["demote-non-dropping-particle"]=t};m.Attributes["@initialize-with-hyphen"]=function(e,t){t==="false"&&(e.opt["initialize-with-hyphen"]=!1)};m.Attributes["@institution-parts"]=function(e,t){this.strings["institution-parts"]=t};m.Attributes["@if-short"]=function(e,t){t==="true"&&(this.strings["if-short"]=!0)};m.Attributes["@substitute-use-first"]=function(e,t){this.strings["substitute-use-first"]=parseInt(t,10)};m.Attributes["@use-first"]=function(e,t){this.strings["use-first"]=parseInt(t,10)};m.Attributes["@use-last"]=function(e,t){this.strings["use-last"]=parseInt(t,10)};m.Attributes["@stop-first"]=function(e,t){this.strings["stop-first"]=parseInt(t,10)};m.Attributes["@stop-last"]=function(e,t){this.strings["stop-last"]=parseInt(t,10)*-1};m.Attributes["@reverse-order"]=function(e,t){t==="true"&&(this.strings["reverse-order"]=!0)};m.Attributes["@display"]=function(e,t){e.bibliography.tokens.length===2&&(e.opt.using_display=!0),this.strings.cls=t};m.Stack=function(e,t){this.mystack=[],(t||e)&&this.mystack.push(e),this.tip=this.mystack[0]};m.Stack.prototype.push=function(e,t){t||e?this.mystack.push(e):this.mystack.push(""),this.tip=this.mystack[this.mystack.length-1]};m.Stack.prototype.clear=function(){this.mystack=[],this.tip={}};m.Stack.prototype.replace=function(e,t){this.mystack.length===0&&m.error("Internal CSL processor error: attempt to replace nonexistent stack item with "+e),t||e?this.mystack[this.mystack.length-1]=e:this.mystack[this.mystack.length-1]="",this.tip=this.mystack[this.mystack.length-1]};m.Stack.prototype.pop=function(){var e=this.mystack.pop();return this.mystack.length?this.tip=this.mystack[this.mystack.length-1]:this.tip={},e};m.Stack.prototype.value=function(){return this.mystack.slice(-1)[0]};m.Stack.prototype.length=function(){return this.mystack.length};m.Parallel=function(e){this.state=e};m.Parallel.prototype.StartCitation=function(e,t){if(this.state.tmp.suppress_repeats=[],!(e.length<2)){for(var n=0,r=!1,i=[],s=0,a=e.length-1;s<a;s++){var l=e[s][0],o=e[s+1][0],p=!1,f={};if(e[s][0].seeAlso&&e[s][0].seeAlso.length>0&&!r){p=!0,r=[e[s][0].id].concat(e[s][0].seeAlso);var g=r.slice(),u=e.slice(s);u[0][1].parallel="first";for(var d=0,v=u.length;d<v;d++){var h=u[d][0].id,S=g.indexOf(h);if(n=!1,S===-1?n=s+d-1:s+d===e.length-1&&(n=s+d),n){i.push([s,n]);break}else g=g.slice(0,S).concat(g.slice(S+1))}}s>0&&p&&(this.state.tmp.suppress_repeats[s-1].START=!0,p=!1);for(var c in this.state.opt.track_repeat)if(!l[c]||!o[c])f[c]=!1;else if(typeof o[c]=="string"||typeof o[c]=="number"){if(c==="title"&&l["title-short"]&&o["title-short"])var _=l["title-short"],y=o["title-short"];else var _=l[c],y=o[c];_==y?f[c]=!0:f[c]=!1}else if(typeof l[c].length>"u"){f[c]=!1;var b=l[c].year,T=o[c].year;b&&T&&b==T&&(f[c]=!0)}else{var _=JSON.stringify(l[c]),y=JSON.stringify(o[c]);_===y?f[c]=!0:f[c]=!1}r||(f.ORPHAN=!0),n===s&&(f.END=!0,r=!1),this.state.tmp.suppress_repeats.push(f)}for(var d=0,v=i.length;d<v;d++){var O=e[i[d][0]][0].id;this.state.registry.registry[O].master=!0,this.state.registry.registry[O].siblings=[];for(var L=i[d][0],x=i[d][1],k=L;k<x;k++){this.state.tmp.suppress_repeats[k].SIBLING=!0;var N=e[k+1][0].id;e[k+1][1].parallel="other",this.state.registry.registry[O].siblings.push(N)}}}};m.Parallel.prototype.checkRepeats=function(e){var t=this.state.tmp.cite_index;if(this.state.tmp.suppress_repeats){if(e.parallel_first&&Object.keys(e.parallel_first).length>0){var n=[{}].concat(this.state.tmp.suppress_repeats),r=!0;for(var i in e.parallel_first)(!n[t][i]||n[t].START)&&(r=!1);return r}if(e.parallel_last&&Object.keys(e.parallel_last).length>0){var n=this.state.tmp.suppress_repeats.concat([{}]),r=Object.keys(e.parallel_last).length>0;for(var i in e.parallel_last)(!n[t][i]||n[t].END)&&(r=!1);return r}if(e.non_parallel&&Object.keys(e.non_parallel).length>0){var n=[{}].concat(this.state.tmp.suppress_repeats),r=!0;for(var i in e.non_parallel)n[t][i]||(r=!1);return r}}return!1};m.Util={};m.Util.Match=function(){this.any=function(e,t,n){return function(r,i){for(var s=0,a=n.length;s<a;s+=1){var l=n[s](r,i);if(l)return!0}return!1}},this.none=function(e,t,n){return function(r,i){for(var s=0,a=n.length;s<a;s+=1){var l=n[s](r,i);if(l)return!1}return!0}},this.all=function(e,t,n){return function(r,i){for(var s=0,a=n.length;s<a;s+=1){var l=n[s](r,i);if(!l)return!1}return!0}},this[void 0]=this.all,this.nand=function(e,t,n){return function(r,i){for(var s=0,a=n.length;s<a;s+=1){var l=n[s](r,i);if(!l)return!0}return!1}}};m.Transform=function(e){this.abbrevs={},this.abbrevs.default=new e.sys.AbbreviationSegments;function t(f,g,u){var d="";return e.sys.getHumanForm&&(f==="country"?(d=e.sys.getHumanForm(g.toLowerCase(),!1,!0),d=d.split("|")[0]):f==="jurisdiction"&&(d=e.sys.getHumanForm(g.toLowerCase(),!1,!0),u?d="":d=d.split("|").slice(1).join(", "))),d}function n(f,g,u,d,v,h,S){var c="",_=m.FIELD_CATEGORY_REMAP[h],y;if(!_)return v;var b=h,T=v;f.sys.normalizeAbbrevsKey&&(T=f.sys.normalizeAbbrevsKey(h,v));var O=!1;if(b==="jurisdiction"&&T&&(O=T.indexOf(":")===-1),["jurisdiction","country"].indexOf(h)>-1&&v===v.toLowerCase()&&(T=v.toUpperCase()),f.sys.getAbbreviation){["jurisdiction","country","language-name","language-name-original"].indexOf(b)>-1?y="default":u.jurisdiction?y=u.jurisdiction:y="default";var L=f.transform.loadAbbreviation(y,_,T,u.language);if(f.transform.abbrevs[L][_]&&T){var x=f.transform.abbrevs[L][_][T];g.strings.form==="short"&&x?O?c="":c=x:c=t(b,T,O)}}return!c&&(!f.opt.development_extensions.require_explicit_legal_case_title_short||u.type!=="legal_case")&&d&&u[d]&&S&&(c=u[d]),!c&&!f.sys.getAbbreviation&&f.sys.getHumanForm&&(c=t(b,T,O)),!c&&!O&&(!f.sys.getHumanForm||b!=="jurisdiction")&&(c=v),f.opt.development_extensions.force_title_abbrev_fallback&&b==="title"&&c===v&&u["title-short"]&&(c=u["title-short"]),c}function r(f,g){var u=e.opt["default-locale"][0].slice(0,2),d;if(e.opt.development_extensions.strict_text_case_locales?d=new RegExp("^([a-zA-Z]{2})(?:$|-.*| .*)"):d=new RegExp("^([a-zA-Z]{2})(?:$|-.*|.*)"),f.language){var v=(""+f.language).match(d);v?u=v[1]:u="tlh"}return f.multi&&f.multi&&f.multi.main&&f.multi.main[g]&&(u=f.multi.main[g]),(!e.opt.development_extensions.strict_text_case_locales||e.opt.development_extensions.normalize_lang_keys_to_lowercase)&&(u=u.toLowerCase()),u}function i(f,g,u,d,v,h){var S,c,_,y,b=v,T=!1;if(!f[g])return{name:"",usedOrig:v,token:m.Util.cloneToken(this)};var O=!1;m.VARIABLES_WITH_SHORT_FORM.indexOf(g)>-1&&h&&(g=g+"-short",O=!0);var L=!1,x=null,k=[];g.slice(-6)==="-short"?(k.push(g),k.push(g.slice(0,-6))):k.push(g);for(var N=0,R=k.length;N<R;N++){var I=!1,g=k[N];_={name:"",usedOrig:v,locale:r(f,g)},y=e.opt[u]?e.opt[u].slice():[];var w=!1;if(u==="locale-orig"?(v||(_.name=f[g],_.usedOrig=!1),w=!0,T=!0):d&&(typeof y>"u"||y.length===0)&&(_.name=f[g],_.usedOrig=!0,w=!0,T=!0),!w){for(var A=0,C=y.length;A<C;A+=1)if(S=y[A],c=S.split(/[\-_]/)[0],S&&f.multi&&f.multi._keys[g]&&f.multi._keys[g][S]){_.name=f.multi._keys[g][S],_.locale=S,w=!0,I=!0,T=!1;break}else if(c&&f.multi&&f.multi._keys[g]&&f.multi._keys[g][c]){_.name=f.multi._keys[g][c],_.locale=c,w=!0,I=!0,T=!1;break}!_.name&&d&&(_={name:f[g],usedOrig:!0,locale:r(f,g)},T=!0)}if(_.token=m.Util.cloneToken(this),N===0?(I&&(_.found_variant_ok=!0),x=_,!O&&(typeof y>"u"||y.length===0)&&(L=!0),I&&(L=!0)):!O&&!I&&x?(_=x,g=k[0]):I&&(_.found_variant_ok=!0),["title","container-title"].indexOf(g)>-1&&!b&&(!_.token.strings["text-case"]||_.token.strings["text-case"]==="sentence"||_.token.strings["text-case"]==="normal")){var j=e.opt.lang,U;T?U=!1:U=_.locale;var D=g.slice(0,-5),G=_.token.strings["text-case"]==="sentence";_.name=m.titlecaseSentenceOrNormal(e,f,D,U,G),delete _.token.strings["text-case"]}if(L)break}return _}this.getTextSubField=i;function s(f,g,u,d){f||(f="default");var v=f.split(":")[0],h=m.getAbbrevsDomain(e,v,d);return h&&(f+="@"+h),u?(e.sys.getAbbreviation&&(f=e.sys.getAbbreviation(e.opt.styleID,e.transform.abbrevs,f,g,u),f||(f="default",h&&(f+="@"+h))),f):(e.transform.abbrevs[f]||(e.transform.abbrevs[f]=new e.sys.AbbreviationSegments),e.transform.abbrevs[f][g]||(e.transform.abbrevs[f][g]={}),f)}this.loadAbbreviation=s;function a(f,g,u,d){var v=f.variables[0];if(e.publisherOutput&&u){if(["publisher","publisher-place"].indexOf(v)===-1)return!1;e.publisherOutput[v+"-token"]=f,e.publisherOutput.varlist.push(v);var h=u.split(/;\s*/);h.length===e.publisherOutput[v+"-list"].length&&(e.publisherOutput[v+"-list"]=h);for(var S=0,c=h.length;S<c;S+=1)h[S]=n(e,f,g,!1,h[S],d,!0);return e.tmp[v+"-token"]=f,!0}return!1}function l(f,g){var u=g.match(/^#([0-9]+).*>>>/);u&&u[1]&&(f["cite-form"]=u[1])}function o(f,g){var u=g.match(/^(?:#[0-9]+)*(?:!((?:[-_a-z]+(?:(?:.*)))(?:,(?:[-_a-z]+(?:(?:.*))))*))*>>>/);if(u&&(g=g.slice(u[0].length),u[1]))for(var d=u[1].split(","),v=0,h=d.length;v<h;v+=1){var S=d[v],c=S.match(/^([-_a-z]+)(?:\:(.*))*$/),_=c[1],y=e.tmp.abbrev_trimmer;c[2]?y&&f&&(y[f]||(y[f]={}),y[f][_]=c[2]):e.tmp.done_vars.indexOf(_)===-1&&(y&&f&&(y.QUASHES[f]||(y.QUASHES[f]={}),y.QUASHES[f][_]=!0),e.tmp.done_vars.push(_))}return g}this.quashCheck=o;function p(f,g,u,d){var v,h=m.LangPrefsMap[f[0]];return h?v=e.opt["cite-lang-prefs"][h]:v=!1,function(S,c,_){var y,b,T,O,L,x,C;if(!f[0]||!c[f[0]]&&!c[d]||!S.tmp.just_looking&&_&&_["suppress-author"]&&!S.tmp.probably_rendered_something&&S.tmp.can_substitute.length()>1)return null;var k={primary:!1,secondary:!1,tertiary:!1};if(S.tmp.area.slice(-5)==="_sort")k.primary="locale-sort";else if(v&&v.length===1&&v[0]==="locale-orig")k.primary="locale-orig",v=!1;else if(v&&!S.tmp.multi_layout)for(var N=["primary","secondary","tertiary"],R=0,I=N.length;R<I&&!(v.length-1<R);R+=1)v[R]&&(k[N[R]]="locale-"+v[R]);else k.primary="locale-orig";if((f[0]==="title-short"||S.tmp.area!=="bibliography"&&!(S.tmp.area==="citation"&&S.opt.xclass==="note"&&_&&!_.position))&&(k.secondary=!1,k.tertiary=!1),S.tmp.multi_layout&&(k.secondary=!1,k.tertiary=!1),S.tmp["publisher-list"])return f[0]==="publisher"?S.tmp["publisher-token"]=this:f[0]==="publisher-place"&&(S.tmp["publisher-place-token"]=this),null;var w=S.tmp.lang_array.slice(),A=i.call(this,c,f[0],k.primary,!0,null,g);y=A.name,b=A.locale;var C=A.token,j=A.usedOrig;if(g&&!A.found_variant_ok&&(y=n(S,C,c,d,y,g,!0),y&&(l(c,y),S.tmp.just_looking||(y=o(c.jurisdiction,y)))),a(this,c,y,g))return S.tmp.lang_array=w,null;T=!1,L=!1;var U,D;k.secondary&&(A=i.call(this,c,f[0],k.secondary,!1,A.usedOrig,null,g),T=A.name,O=A.locale,U=A.token,g&&!A.found_variant_ok&&T&&(T=n(S,U,c,!1,T,g,!0))),k.tertiary&&(A=i.call(this,c,f[0],k.tertiary,!1,A.usedOrig,null,g),L=A.name,x=A.locale,D=A.token,g&&!A.found_variant_ok&&L&&(L=n(S,D,c,!1,L,g,!0)));var G;if(k.primary==="locale-translit"&&(G=S.opt.citeAffixes[h][k.primary].prefix),G==="<i>"&&f[0]==="title"&&!j){for(var B=!1,R=0,I=C.decorations.length;R<I;R+=1)C.decorations[R][0]==="@font-style"&&C.decorations[R][1]==="italic"&&(B=!0);B||C.decorations.push(["@font-style","italic"])}if(b!=="en"&&C.strings["text-case"]==="title"&&(C.strings["text-case"]="passthrough"),f[0]==="title"&&(y=m.demoteNoiseWords(S,y,this["leading-noise-words"])),T||L){if(S.output.openLevel("empty"),C.strings.suffix=C.strings.suffix.replace(/[ .,]+$/,""),b&&(S.tmp.lang_array=[b].concat(w)),m.UPDATE_GROUP_CONTEXT_CONDITION(S,null,null,C,C.strings.prefix+y),S.output.append(y,C),S.tmp.probably_rendered_something=!0,y===T&&(T=!1),T){U.strings.prefix=S.opt.citeAffixes[h][k.secondary].prefix,U.strings.suffix=S.opt.citeAffixes[h][k.secondary].suffix,U.strings.prefix||(U.strings.prefix=" ");for(var R=U.decorations.length-1;R>-1;R+=-1)["@quotes/true","@font-style/italic","@font-style/oblique","@font-weight/bold"].indexOf(U.decorations[R].join("/"))>-1&&(U.decorations=U.decorations.slice(0,R).concat(U.decorations.slice(R+1)));O!=="en"&&U.strings["text-case"]==="title"&&(U.strings["text-case"]="passthrough"),O&&(S.tmp.lang_array=[O].concat(w));var E=new m.Token;E.decorations.push(["@font-style","normal"]),E.decorations.push(["@font-weight","normal"]),S.output.openLevel(E),S.output.append(T,U),S.output.closeLevel();var M=S.output.current.value(),F=S.output.current.value().blobs.length-1}if(y===L&&(L=!1),L){D.strings.prefix=S.opt.citeAffixes[h][k.tertiary].prefix,D.strings.suffix=S.opt.citeAffixes[h][k.tertiary].suffix,D.strings.prefix||(D.strings.prefix=" ");for(var R=D.decorations.length-1;R>-1;R+=-1)["@quotes/true","@font-style/italic","@font-style/oblique","@font-weight/bold"].indexOf(D.decorations[R].join("/"))>-1&&(D.decorations=D.decorations.slice(0,R).concat(D.decorations.slice(R+1)));x!=="en"&&D.strings["text-case"]==="title"&&(D.strings["text-case"]="passthrough"),x&&(S.tmp.lang_array=[x].concat(w));var P=new m.Token;P.decorations.push(["@font-style","normal"]),P.decorations.push(["@font-weight","normal"]),S.output.openLevel(P),S.output.append(L,D),S.output.closeLevel();var M=S.output.current.value(),F=S.output.current.value().blobs.length-1}S.output.closeLevel()}else b&&(S.tmp.lang_array=[b].concat(w)),m.UPDATE_GROUP_CONTEXT_CONDITION(S,null,null,C,C.strings.prefix+y),S.output.append(y,C),S.tmp.probably_rendered_something=!0;return S.tmp.lang_array=w,S.tmp.can_block_substitute&&S.tmp.name_node.children.push(S.output.current.value()),null}}this.getOutputFunction=p};m.Token=function(e,t,n){this.name=e,this.strings={},this.strings.delimiter=void 0,this.strings.prefix="",this.strings.suffix="",this.decorations=[],this.variables=[],this.execs=[],this.tokentype=t};m.Util.cloneToken=function(e){var t,n,r,i;if(typeof e=="string")return e;t=new m.Token(e.name,e.tokentype);for(var n in e.strings)e.strings.hasOwnProperty(n)&&(t.strings[n]=e.strings[n]);if(e.decorations)for(t.decorations=[],r=0,i=e.decorations.length;r<i;r+=1)t.decorations.push(e.decorations[r].slice());return e.variables&&(t.variables=e.variables.slice()),e.execs&&(t.execs=e.execs.slice(),e.tests&&(t.tests=e.tests.slice())),t};m.AmbigConfig=function(){this.maxvals=[],this.minval=1,this.names=[],this.givens=[],this.year_suffix=!1,this.disambiguate=0};m.Blob=function(e,t,n){var r,i,s;if(this.levelname=n,t){this.strings={prefix:"",suffix:""};for(var s in t.strings)t.strings.hasOwnProperty(s)&&(this.strings[s]=t.strings[s]);for(this.decorations=[],t.decorations===void 0?r=0:r=t.decorations.length,i=0;i<r;i+=1)this.decorations.push(t.decorations[i].slice())}else this.strings={},this.strings.prefix="",this.strings.suffix="",this.strings.delimiter="",this.decorations=[];typeof e=="string"?this.blobs=e:e?this.blobs=[e]:this.blobs=[],this.alldecor=[this.decorations]};m.Blob.prototype.push=function(e){typeof this.blobs=="string"?m.error("Attempt to push blob onto string object"):e!==!1&&(e.alldecor=e.alldecor.concat(this.alldecor),this.blobs.push(e))};m.NumericBlob=function(e,t,n,r,i){if(this.id=i,this.alldecor=[],this.num=n,this.particle=t,this.blobs=n.toString(),this.status=m.START,this.strings={},r){if(r.strings["text-case"]){var s=r.strings["text-case"];this.particle=m.Output.Formatters[s](e,this.particle),this.blobs=m.Output.Formatters[s](e,this.blobs)}this.gender=r.gender,this.decorations=r.decorations,this.strings.prefix=r.strings.prefix,this.strings.suffix=r.strings.suffix,this.strings["text-case"]=r.strings["text-case"],this.successor_prefix=r.successor_prefix,this.range_prefix=r.range_prefix,this.splice_prefix=r.splice_prefix,this.formatter=r.formatter,this.formatter||(this.formatter=new m.Output.DefaultFormatter),this.formatter&&(this.type=this.formatter.format(1))}else this.decorations=[],this.strings.prefix="",this.strings.suffix="",this.successor_prefix="",this.range_prefix="",this.splice_prefix="",this.formatter=new m.Output.DefaultFormatter};m.NumericBlob.prototype.setFormatter=function(e){this.formatter=e,this.type=this.formatter.format(1)};m.Output.DefaultFormatter=function(){};m.Output.DefaultFormatter.prototype.format=function(e){return e.toString()};m.NumericBlob.prototype.checkNext=function(e,t){t?(this.status=m.START,typeof e=="object"&&(e.num===this.num+1?e.status=m.SUCCESSOR:e.status=m.SEEN)):!e||!e.num||this.type!==e.type||e.num!==this.num+1?(this.status===m.SUCCESSOR_OF_SUCCESSOR&&(this.status=m.END),typeof e=="object"&&(e.status=m.SEEN)):this.status===m.START||this.status===m.SEEN?e.status=m.SUCCESSOR:(this.status===m.SUCCESSOR||this.status===m.SUCCESSOR_OF_SUCCESSOR)&&(this.range_prefix?(e.status=m.SUCCESSOR_OF_SUCCESSOR,this.status=m.SUPPRESS):e.status=m.SUCCESSOR)};m.NumericBlob.prototype.checkLast=function(e){return this.status===m.SEEN||e.num!==this.num-1&&this.status===m.SUCCESSOR?(this.status=m.SUCCESSOR,!0):!1};m.Util.fixDateNode=function(e,t,n){var r,i,s,a,l,o,p,f,g,u,d,v,h,c=this.cslXml.getAttributeValue(n,"lingo"),S=this.cslXml.getAttributeValue(n,"default-locale");this.build.date_key=!0,r=this.cslXml.getAttributeValue(n,"form");var c;if(S?c=this.opt["default-locale"][0]:c=this.cslXml.getAttributeValue(n,"lingo"),!this.getDate(r,S))return e;var _=this.cslXml.getAttributeValue(n,"date-parts");i=this.cslXml.getAttributeValue(n,"variable"),f=this.cslXml.getAttributeValue(n,"prefix"),g=this.cslXml.getAttributeValue(n,"suffix"),v=this.cslXml.getAttributeValue(n,"display"),h=this.cslXml.getAttributeValue(n,"cslid"),s=this.cslXml.nodeCopy(this.getDate(r,S)),this.cslXml.setAttribute(s,"lingo",this.opt.lang),this.cslXml.setAttribute(s,"form",r),this.cslXml.setAttribute(s,"date-parts",_),this.cslXml.setAttribute(s,"cslid",h),this.cslXml.setAttribute(s,"variable",i),this.cslXml.setAttribute(s,"default-locale",S),f&&this.cslXml.setAttribute(s,"prefix",f),g&&this.cslXml.setAttribute(s,"suffix",g),v&&this.cslXml.setAttribute(s,"display",v),u=this.cslXml.children(s);for(var y in u)a=u[y],this.cslXml.nodename(a)==="date-part"&&(l=this.cslXml.getAttributeValue(a,"name"),S&&this.cslXml.setAttributeOnNodeIdentifiedByNameAttribute(s,"date-part",l,"@default-locale","true"));u=this.cslXml.children(n);for(var y in u)if(a=u[y],this.cslXml.nodename(a)==="date-part"){l=this.cslXml.getAttributeValue(a,"name"),d=this.cslXml.attributes(a);for(o in d)o!=="@name"&&(c&&c!==this.opt.lang&&["@suffix","@prefix","@form"].indexOf(o)>-1||(p=d[o],this.cslXml.setAttributeOnNodeIdentifiedByNameAttribute(s,"date-part",l,o,p)))}if(this.cslXml.getAttributeValue(n,"date-parts")==="year")this.cslXml.deleteNodeByNameAttribute(s,"month"),this.cslXml.deleteNodeByNameAttribute(s,"day");else if(this.cslXml.getAttributeValue(n,"date-parts")==="year-month")this.cslXml.deleteNodeByNameAttribute(s,"day");else if(this.cslXml.getAttributeValue(n,"date-parts")==="month-day"){for(var b=this.cslXml.children(s),T=1,O=this.cslXml.numberofnodes(b);T<O;T++)if(this.cslXml.getAttributeValue(b[T],"name")==="year"){this.cslXml.setAttribute(b[T-1],"suffix","");break}this.cslXml.deleteNodeByNameAttribute(s,"year")}return this.cslXml.insertChildNodeAfter(e,n,t,s)};m.dateMacroAsSortKey=function(e,t){m.dateAsSortKey.call(this,e,t,!0)};m.dateAsSortKey=function(e,t,n){var r,i,s,a,l,o,p,f,g=this.variables[0],u="empty";if(n&&e.tmp.extension&&(u="macro-with-date"),r=t[g],typeof r>"u"&&(r={"date-parts":[[0]]}),typeof this.dateparts>"u"&&(this.dateparts=["year","month","day"]),r.raw?r=e.fun.dateparser.parseDateToArray(r.raw):r["date-parts"]&&(r=e.dateParseArray(r)),typeof r>"u"&&(r={}),r.year)for(p=0,f=m.DATE_PARTS_INTERNAL.length;p<f;p+=1)if(i=m.DATE_PARTS_INTERNAL[p],s=0,a=i,a.slice(-4)==="_end"&&(a=a.slice(0,-4)),r[i]&&this.dateparts.indexOf(a)>-1&&(s=r[i]),i.slice(0,4)==="year"){l=m.Util.Dates[a].numeric(e,s);var o="1";l[0]==="-"&&(o="0",l=l.slice(1),l=9999-parseInt(l,10)),e.output.append(m.Util.Dates[i.slice(0,4)].numeric(e,o+l),u)}else s=m.Util.Dates[a]["numeric-leading-zeros"](e,s),s||(s="00"),e.output.append(s,u)};m.Engine.prototype.dateParseArray=function(e){var t,n,r,i;t={};for(n in e)if(n==="date-parts"){r=e["date-parts"],r.length>1&&r[0].length!==r[1].length&&m.error("CSL data error: element mismatch in date range input."),i=["","_end"];for(var s=0,a=r.length;s<a;s+=1)for(var l=0,o=m.DATE_PARTS.length;l<o;l+=1)isNaN(parseInt(r[s][l],10))?t[m.DATE_PARTS[l]+i[s]]=void 0:t[m.DATE_PARTS[l]+i[s]]=parseInt(r[s][l],10)}else e.hasOwnProperty(n)&&(n==="literal"&&typeof e.literal=="object"&&typeof e.literal.part=="string"?(m.debug("Warning: fixing up weird literal date value"),t.literal=e.literal.part):t[n]=e[n]);return t};m.Util.Names={};m.Util.Names.compareNamesets=m.NameOutput.prototype._compareNamesets;m.Util.Names.unInitialize=function(e,t){var n,r,i,s,a;if(!t)return"";for(i=t.split(/(?:\-|\s+)/),s=t.match(/(\-|\s+)/g),a="",n=0,r=i.length;n<r;n+=1)a+=i[n],n<r-1&&(a+=s[n]);return a};m.Util.Names.initializeWith=function(e,t,n,r){var i,s,a,l,o;if(!t)return"";if(n||(n=""),["Lord","Lady"].indexOf(t)>-1||!t.replace(/^(?:<[^>]+>)*/,"").match(m.STARTSWITH_ROMANESQUE_REGEXP)&&!n.match("%s"))return t;e.opt["initialize-with-hyphen"]===!1&&(t=t.replace(/\-/g," ")),t=t.replace(/\s*\-\s*/g,"-").replace(/\s+/g," "),t=t.replace(/-([a-z])/g,"\u2013$1");for(var i=t.length-2;i>-1;i+=-1)t.slice(i,i+1)==="."&&t.slice(i+1,i+2)!==" "&&(t=t.slice(0,i)+". "+t.slice(i+1));var p=m.Output.Formatters.nameDoppel.split(t),f=[];if(f=[p.strings[0]],p.tags.length===0){var g=f[0].match(/[^\.]+$/);g&&g[0].length===1&&g[0]!==g[0].toLowerCase()&&(f[0]+=".")}for(i=1,s=p.strings.length;i<s;i+=1)f.push(p.tags[i-1]),f.push(p.strings[i]);return r?o=this.doNormalize(e,f,n):o=this.doInitialize(e,f,n),o=o.replace(/\u2013([a-z])/g,"-$1"),o};m.Util.Names.notag=function(e){return e.replace(/^(?:<[^>]+>)*/,"")};m.Util.Names.mergetag=function(e,t,n){var r=t.match(/(?:-*<[^>]+>-*)/g);if(r)t=r.join("");else return n;return r=n.match(/^(.*[^\s])*(\s+)$/),r?(r[1]=r[1]?r[1]:"",n=r[1]+t+r[2]):n=n+t,n};m.Util.Names.tagonly=function(e,t){var n=t.match(/(?:<[^>]+>)+/);return n?n.join(""):t};m.Util.Names.doNormalize=function(e,t,n){var r,i;n=n||"";var s=[];for(r=0,i=t.length;r<i;r+=1)this.notag(t[r]).length>1&&this.notag(t[r]).slice(-1)==="."?(t[r]=t[r].replace(/^(.*)\.(.*)$/,"$1$2"),s.push(!0)):t[r].length===1&&t[r].toUpperCase()===t[r]?s.push(!0):s.push(!1);for(r=0,i=t.length;r<i;r+=2)s[r]&&(r<t.length-2&&(t[r+1]=this.tagonly(e,t[r+1]),s[r+2]||(t[r+1]=this.tagonly(e,t[r+1])+" "),t[r+2].length>1?t[r+1]=n.replace(/\ufeff$/,"")+t[r+1]:t[r+1]=this.mergetag(e,t[r+1],n)),r===t.length-1&&(t[r]=t[r]+n));return t.join("").replace(/[\u0009\u000a\u000b\u000c\u000d\u0020\ufeff\u00a0]+$/,"").replace(/\s*\-\s*/g,"-").replace(/[\u0009\u000a\u000b\u000c\u000d\u0020]+/g," ")};m.Util.Names.doInitialize=function(e,t,n){var r,i,s,a,l,o,p;for(r=0,i=t.length;r<i;r+=2)if(p=t[r],!!p)if(s=p.match(m.NAME_INITIAL_REGEXP),!s&&!p.match(m.STARTSWITH_ROMANESQUE_REGEXP)&&p.length>1&&n.match("%s")&&(s=p.match(/(.)(.*)/)),s&&s[2]&&s[3]&&(s[1]=s[1]+s[2],s[2]=""),s&&s[1].slice(0,1)===s[1].slice(0,1).toUpperCase()){var f="";if(s[2]){var g="";for(o=s[2].split(""),a=0,l=o.length;a<l;a+=1){var u=o[a];if(u===u.toUpperCase())g+=u;else break}g.length<s[2].length&&(f=m.toLocaleLowerCase.call(e,g))}t[r]=s[1]+f,r<i-1?n.match("%s")?t[r]=n.replace("%s",t[r]):t[r+1].indexOf("-")>-1?t[r+1]=this.mergetag(e,t[r+1].replace("-",""),n)+"-":t[r+1]=this.mergetag(e,t[r+1],n):n.match("%s")?t[r]=n.replace("%s",t[r]):t.push(n)}else p.match(m.ROMANESQUE_REGEXP)&&(!s||!s[3])&&(t[r]=" "+p);var d=t.join("");return d=d.replace(/[\u0009\u000a\u000b\u000c\u000d\u0020\ufeff\u00a0]+$/,"").replace(/\s*\-\s*/g,"-").replace(/[\u0009\u000a\u000b\u000c\u000d\u0020]+/g," "),d};m.Util.Names.getRawName=function(e){var t=[];return e.literal?t.push(e.literal):(e.given&&t.push(e.given),e.family&&t.push(e.family)),t.join(" ")};m.Util.Dates={};m.Util.Dates.year={};m.Util.Dates.year.long=function(e,t){return t||(typeof t=="boolean"?t="":t=0),t.toString()};m.Util.Dates.year.imperial=function(e,t,n){var r="";t||(typeof t=="boolean"?t="":t=0),n=n?"_end":"";var i=e.tmp.date_object["month"+n];for(i=i?""+i:"1";i.length<2;)i="0"+i;var s=e.tmp.date_object["day"+n];for(s=s?""+s:"1";s.length<2;)s="0"+s;var a=parseInt(t+i+s,10),l,o;if(a>=18680908&&a<19120730?(l="\u660E\u6CBB",o=1867):a>=19120730&&a<19261225?(l="\u5927\u6B63",o=1911):a>=19261225&&a<19890108?(l="\u662D\u548C",o=1925):a>=19890108&&(l="\u5E73\u6210",o=1988),l&&o){var p=l;e.sys.normalizeAbbrevsKey&&(p=e.sys.normalizeAbbrevsKey("number",l)),e.transform.abbrevs.default.number[p]||e.transform.loadAbbreviation("default","number",p,null),e.transform.abbrevs.default.number[p]&&(l=e.transform.abbrevs.default.number[p]),r=l+(t-o)}return r};m.Util.Dates.year.short=function(e,t){if(t=t.toString(),t&&t.length===4)return t.substr(2)};m.Util.Dates.year.numeric=function(e,t){var r,n;t=""+t;var r=t.match(/([0-9]*)$/);for(r?(n=t.slice(0,r[1].length*-1),t=r[1]):(n=t,t="");t.length<4;)t="0"+t;return n+t};m.Util.Dates.normalizeMonth=function(e,t){var n;if(e||(e=0),e=""+e,e.match(/^[0-9]+$/)||(e=0),e=parseInt(e,10),t){var r={stub:"month-",num:e};if(r.num<1||r.num>24)r.num=0;else{for(;r.num>16;)r.num=r.num-4;r.num>12&&(r.stub="season-",r.num=r.num-12)}n=r}else(e<1||e>12)&&(e=0),n=e;return n};m.Util.Dates.month={};m.Util.Dates.month.numeric=function(e,n){var n=m.Util.Dates.normalizeMonth(n);return n||(n=""),n};m.Util.Dates.month["numeric-leading-zeros"]=function(e,n){var n=m.Util.Dates.normalizeMonth(n);if(!n)n="";else for(n=""+n;n.length<2;)n="0"+n;return n};m.Util.Dates.month.long=function(e,s,n,r){var i=m.Util.Dates.normalizeMonth(s,!0),s=i.num;if(!s)s="";else{for(s=""+s;s.length<2;)s="0"+s;s=e.getTerm(i.stub+s,"long",0,0,!1,r)}return s};m.Util.Dates.month.short=function(e,s,n,r){var i=m.Util.Dates.normalizeMonth(s,!0),s=i.num;if(!s)s="";else{for(s=""+s;s.length<2;)s="0"+s;s=e.getTerm(i.stub+s,"short",0,0,!1,r)}return s};m.Util.Dates.day={};m.Util.Dates.day.numeric=function(e,t){return t.toString()};m.Util.Dates.day.long=m.Util.Dates.day.numeric;m.Util.Dates.day["numeric-leading-zeros"]=function(e,t){for(t||(t=0),t=t.toString();t.length<2;)t="0"+t;return t.toString()};m.Util.Dates.day.ordinal=function(e,t,n){return e.fun.ordinalizer.format(t,n)};m.Util.Sort={};m.Util.Sort.strip_prepositions=function(e){var t;return typeof e=="string"&&(t=e.match(/^(([aA]|[aA][nN]|[tT][hH][eE])\s+)/)),t&&(e=e.substr(t[1].length)),e};m.Util.substituteStart=function(e,t){var n,r,i,s,a,l,o;s=function(p,f,g){for(var u=0,d=this.decorations.length;u<d;u+=1)if(this.decorations[u][0]==="@strip-periods"&&this.decorations[u][1]==="true"){p.tmp.strip_periods+=1;break}},this.execs.push(s),this.decorations&&e.opt.development_extensions.csl_reverse_lookup_support&&(this.decorations.reverse(),this.decorations.push(["@showid","true",this.cslid]),this.decorations.reverse()),o=["number","date","names"],(this.name==="text"&&!this.postponed_macro||o.indexOf(this.name)>-1)&&(n=function(p,f,g){p.tmp.element_trace.value()==="author"||this.name==="names"?(!p.tmp.just_looking&&g&&g["author-only"]&&p.tmp.area!=="intext"&&p.tmp.probably_rendered_something&&p.tmp.element_trace.push("suppress-me"),!p.tmp.just_looking&&g&&g["suppress-author"]&&(p.tmp.probably_rendered_something||p.tmp.element_trace.push("suppress-me"))):this.name==="date"?!p.tmp.just_looking&&g&&g["author-only"]&&p.tmp.area!=="intext"&&p.tmp.probably_rendered_something&&p.tmp.element_trace.push("suppress-me"):!p.tmp.just_looking&&g&&g["author-only"]&&p.tmp.area!=="intext"?!p.tmp.probably_rendered_something&&p.tmp.can_block_substitute||p.tmp.element_trace.push("suppress-me"):g&&g["suppress-author"]&&p.tmp.element_trace.push("do-not-suppress-me")},this.execs.push(n)),r=this.strings.cls,this.strings.cls=!1,e.build.render_nesting_level===0&&(e.build.area==="bibliography"&&e.bibliography.opt["second-field-align"]?(i=new m.Token("group",m.START),i.decorations=[["@display","left-margin"]],s=function(p,f){p.tmp.render_seen||(i.strings.first_blob=f.id,p.output.startTag("bib_first",i))},i.execs.push(s),t.push(i)):m.DISPLAY_CLASSES.indexOf(r)>-1&&(i=new m.Token("group",m.START),i.decorations=[["@display",r]],s=function(p,f){i.strings.first_blob=f.id,p.output.startTag("bib_first",i)},i.execs.push(s),t.push(i)),e.build.cls=r),e.build.render_nesting_level+=1,e.build.substitute_level.value()===1&&(a=new m.Token("choose",m.START),m.Node.choose.build.call(a,e,t),l=new m.Token("if",m.START),s=function(){return!!e.tmp.can_substitute.value()},l.tests||(l.tests=[]),l.tests.push(s),l.test=e.fun.match.any(this,e,l.tests),t.push(l)),e.sys.variableWrapper&&this.variables_real&&this.variables_real.length&&(s=function(p,f,g){if(!p.tmp.just_looking&&!p.tmp.suppress_decorations){var u=new m.Token("text",m.START);u.decorations=[["@showid","true"]],p.output.startTag("variable_entry",u);var d=null;g&&(d=g.position),d||(d=0);var v=["first","container-subsequent","subsequent","ibid","ibid-with-locator"],h=0;g&&g.noteIndex&&(h=g.noteIndex);var S=0;g&&g["first-reference-note-number"]&&(S=g["first-reference-note-number"]);var c=0;g&&g["first-container-reference-note-number"]&&(c=g["first-container-reference-note-number"]);var _=0;g&&g["citation-number"]&&(_=g["citation-number"]);var y=0;g&&g.index&&(y=g.index);var b={itemData:f,variableNames:this.variables,context:p.tmp.area,xclass:p.opt.xclass,position:v[d],"note-number":h,"first-reference-note-number":S,"first-container-reference-note-number":c,"citation-number":_,index:y,mode:p.opt.mode};p.output.current.value().params=b}},this.execs.push(s))};m.Util.substituteEnd=function(e,t){var n,r,i,s,a,l,o;if(e.sys.variableWrapper&&(this.hasVariable||this.variables_real&&this.variables_real.length)&&(n=function(f){!f.tmp.just_looking&&!f.tmp.suppress_decorations&&f.output.endTag("variable_entry")},this.execs.push(n)),n=function(f){for(var g=0,u=this.decorations.length;g<u;g+=1)if(this.decorations[g][0]==="@strip-periods"&&this.decorations[g][1]==="true"){f.tmp.strip_periods+=-1;break}},this.execs.push(n),e.build.render_nesting_level+=-1,e.build.render_nesting_level===0&&(e.build.cls?(n=function(f){f.output.endTag("bib_first")},this.execs.push(n),e.build.cls=!1):e.build.area==="bibliography"&&e.bibliography.opt["second-field-align"]&&(r=new m.Token("group",m.END),n=function(f){f.tmp.render_seen||f.output.endTag("bib_first")},r.execs.push(n),t.push(r),i=new m.Token("group",m.START),i.decorations=[["@display","right-inline"]],n=function(f){f.tmp.render_seen||(f.tmp.render_seen=!0,f.output.startTag("bib_other",i))},i.execs.push(n),t.push(i))),e.build.substitute_level.value()===1&&(s=new m.Token("if",m.END),t.push(s),a=new m.Token("choose",m.END),m.Node.choose.build.call(a,e,t)),this.name==="names"||this.name==="text"&&this.variables_real!=="title"){l=new m.Token("text",m.SINGLETON);var p=this.name;n=function(f,g){if(f.tmp.area==="bibliography"&&typeof f.bibliography.opt["subsequent-author-substitute"]=="string"&&!(this.variables_real&&!g[this.variables_real])&&!(this.variables_real&&p==="names")){var u=f.bibliography.opt["subsequent-author-substitute-rule"],d,v,h=!f.tmp.suppress_decorations;if(h&&f.tmp.subsequent_author_substitute_ok&&f.tmp.rendered_name){if(u==="partial-each"||u==="partial-first"){var S=!0,c=[];for(d=0,v=f.tmp.name_node.children.length;d<v;d+=1){var _=f.tmp.rendered_name[d];S&&f.tmp.last_rendered_name&&f.tmp.last_rendered_name.length>d-1&&_&&!_.localeCompare(f.tmp.last_rendered_name[d])?(o=new m.Blob(f[f.tmp.area].opt["subsequent-author-substitute"]),f.tmp.name_node.children[d].blobs=[o],u==="partial-first"&&(S=!1)):S=!1,c.push(_)}f.tmp.last_rendered_name=c}else if(u==="complete-each"){var c=f.tmp.rendered_name.join(",");if(c){if(f.tmp.last_rendered_name&&!c.localeCompare(f.tmp.last_rendered_name))for(d=0,v=f.tmp.name_node.children.length;d<v;d+=1)o=new m.Blob(f[f.tmp.area].opt["subsequent-author-substitute"]),f.tmp.name_node.children[d].blobs=[o];f.tmp.last_rendered_name=c}}else{var c=f.tmp.rendered_name.join(",");c&&(f.tmp.last_rendered_name&&!c.localeCompare(f.tmp.last_rendered_name)&&(o=new m.Blob(f[f.tmp.area].opt["subsequent-author-substitute"]),f.tmp.label_blob?f.tmp.name_node.top.blobs=[o,f.tmp.label_blob]:f.tmp.name_node.top.blobs.length?f.tmp.name_node.top.blobs[0].blobs=[o]:f.tmp.name_node.top.blobs=[o],f.tmp.substituted_variable=p),f.tmp.last_rendered_name=c)}f.tmp.subsequent_author_substitute_ok=!1}}},this.execs.push(n)}(this.name==="text"&&!this.postponed_macro||["number","date","names"].indexOf(this.name)>-1)&&(n=function(f,g){f.tmp.element_trace.mystack.length>1&&f.tmp.element_trace.pop()},this.execs.push(n))};m.Util.padding=function(e){var t=e.match(/\s*(-{0,1}[0-9]+)/);if(t)for(e=parseInt(t[1],10),e<0&&(e=1e20+e),e=""+e;e.length<20;)e="0"+e;return e};m.Util.LongOrdinalizer=function(){};m.Util.LongOrdinalizer.prototype.init=function(e){this.state=e};m.Util.LongOrdinalizer.prototype.format=function(e,t){e<10&&(e="0"+e);var n=m.Engine.getField(m.LOOSE,this.state.locale[this.state.opt.lang].terms,"long-ordinal-"+e,"long",0,t);return n||(n=this.state.fun.ordinalizer.format(e,t)),this.state.tmp.cite_renders_content=!0,n};m.Util.Ordinalizer=function(e){this.state=e,this.suffixes={}};m.Util.Ordinalizer.prototype.init=function(){if(!this.suffixes[this.state.opt.lang]){this.suffixes[this.state.opt.lang]={};for(var e=0,t=3;e<t;e+=1){var n=[void 0,"masculine","feminine"][e];this.suffixes[this.state.opt.lang][n]=[];for(var r=1;r<5;r+=1){var i=this.state.getTerm("ordinal-0"+r,"long",!1,n);if(typeof i>"u"){delete this.suffixes[this.state.opt.lang][n];break}this.suffixes[this.state.opt.lang][n].push(i)}}}};m.Util.Ordinalizer.prototype.format=function(e,t){var n;e=parseInt(e,10),n=""+e;var r="",i=[];if(t&&i.push(t),i.push("neuter"),this.state.locale[this.state.opt.lang].ord["1.0.1"]){r=this.state.getTerm("ordinal",!1,0,t);for(var s,a=0,l=i.length;a<l;a+=1){s=i[a];var o=this.state.locale[this.state.opt.lang].ord["1.0.1"];if(o["whole-number"][n]&&o["whole-number"][n][s]?r=this.state.getTerm(this.state.locale[this.state.opt.lang].ord["1.0.1"]["whole-number"][n][s],!1,0,t):o["last-two-digits"][n.slice(n.length-2)]&&o["last-two-digits"][n.slice(n.length-2)][s]?r=this.state.getTerm(this.state.locale[this.state.opt.lang].ord["1.0.1"]["last-two-digits"][n.slice(n.length-2)][s],!1,0,t):o["last-digit"][n.slice(n.length-1)]&&o["last-digit"][n.slice(n.length-1)][s]&&(r=this.state.getTerm(this.state.locale[this.state.opt.lang].ord["1.0.1"]["last-digit"][n.slice(n.length-1)][s],!1,0,t)),r)break}}else t||(t=void 0),this.state.fun.ordinalizer.init(),e/10%10===1||e>10&&e<20?r=this.suffixes[this.state.opt.lang][t][3]:e%10===1&&e%100!==11?r=this.suffixes[this.state.opt.lang][t][0]:e%10===2&&e%100!==12?r=this.suffixes[this.state.opt.lang][t][1]:e%10===3&&e%100!==13?r=this.suffixes[this.state.opt.lang][t][2]:r=this.suffixes[this.state.opt.lang][t][3];return n=n+=r,n};m.Util.Romanizer=function(){};m.Util.Romanizer.prototype.format=function(e){var t,n,r,i,s;if(t="",e<6e3)for(i=e.toString().split(""),i.reverse(),n=0,r=0,s=i.length,n=0;n<s;n+=1)r=parseInt(i[n],10),t=m.ROMAN_NUMERALS[n][r]+t;return t};m.Util.Suffixator=function(e){e||(e=m.SUFFIX_CHARS),this.slist=e.split(",")};m.Util.Suffixator.prototype.format=function(e){var t;e+=1;var n="";do{t=e%26===0?26:e%26;var n=this.slist[t-1]+n;e=(e-t)/26}while(e!==0);return n};m.Engine.prototype.processNumber=function(e,t,n){var r,i=this,s=n;n=n==="page-first"?"page":n;var a=",\\s+and\\s+|\\s+and\\s+";this.opt.lang.slice(0,2)!=="en"&&(a+="|,\\s+"+this.getTerm("and")+"\\s+|\\s+"+this.getTerm("and")+"\\s+");var l="\\s*&\\s*",o=new RegExp("^"+l+"$"),p=new RegExp("("+l+"|"+a+"|;\\s+|,\\s+|\\s*\\\\*[\\-\\u2013]+\\s*)","g"),f=new RegExp("(?:"+l+"|"+a+"|;\\s+|,\\s+|\\s*\\\\*[\\-\\u2013]+\\s*)"),g=this.getTerm("and"),u=this.getTerm("and","symbol");g===u&&(u="&");function d(E){E=E.trim();var M=E.match(/^([^ ]+)/);if(M&&!m.STATUTE_SUBDIV_STRINGS[M[1]]){var F=null;["locator","locator-extra","page"].indexOf(n)>-1?t.label?F=m.STATUTE_SUBDIV_STRINGS_REVERSE[t.label]:F="p.":F=m.STATUTE_SUBDIV_STRINGS_REVERSE[n],F&&(E=F+" "+E)}return E}function v(E,M,F,P,z){P=P||"";var q={};if(!M&&!m.STATUTE_SUBDIV_STRINGS_REVERSE[n]&&(M="var:"+n),M){var H=M.match(/(\s*)([^\s]+)(\s*)/);s==="page"&&z===0&&["p.","pp."].indexOf(H[2])===-1?(q.gotosleepability=!0,q.labelVisibility=!0):q.labelVisibility=!1,q.label=H[2],q.origLabel=E,q.labelSuffix=H[3]?H[3]:"",q.plural=0}var H=F.match(/^([0-9]*[a-zA-Z]+0*)?([0-9]+(?:[a-zA-Z]*|[-,a-zA-Z]+))$/);return H?(q.particle=H[1]?H[1]:"",q.value=H[2]):(q.particle="",q.value=F),q.joiningSuffix=P.replace(/\s*-\s*/,"-"),q}function h(E){for(var M=E.length-2;M>-1;M-=2)E[M]==="-"&&E[M-1].match(/^(?:(?:[a-z]|[a-z][a-z]|[a-z][a-z][a-z]|[a-z][a-z][a-z][a-z])\.  *)*[0-9]+[,a-zA-Z]+$/)&&E[M+1].match(/^[,a-zA-Z]+$/)&&(E[M-1]=E.slice(M-1,M+2).join(""),E=E.slice(0,M).concat(E.slice(M+2)));return E}function S(E,M){M=M||"",E=d(E,M);var F,P,z;if(n==="page"&&E.indexOf("\u2013")>-1&&(E=E.replace(/\u2013/g,"-")),E.indexOf("\\-")>-1){F=new RegExp(p.source.replace("\\-","")),P=new RegExp(f.source.replace("\\-",""));for(var q=E.split("\\-"),H=0,V=q.length;H<V;H++)q[H]=q[H].replace(/\-/g,"\u2013");z=q.join("\\-"),z=z.replace(/\\/g,"")}else F=p,P=f,z=E;var X=[],K=z.match(F);if(K){for(var q=z.split(P),H=0,V=K.length;H<V;H++)K[H].match(o)&&(q[H].match(/[a-zA-Z]$/)&&q[H].match(/^[a-zA-Z]/)?K[H]=u:K[H]=" "+u+" ");var Q=!1;for(var H in q)if((""+q[H]).replace(/^[a-z]\.\s+/,"").match(/[^\s0-9ivxlcmIVXLCM]/))break;if(Q)X=[z];else{for(var H=0,V=q.length-1;H<V;H++)X.push(q[H]),X.push(K[H]);X.push(q[q.length-1]),X=h(X)}}else var X=[z];for(var $=[],J=M,ee="",H=0,V=X.length;H<V;H+=2){var K=X[H].match(/((?:^| )(?:[a-z]|[a-z][a-z]|[a-z][a-z][a-z]|[a-z][a-z][a-z][a-z]|subpara|subch|amend|bibliog|annot|illus|princ|intro|sched|subdiv|subsec)(?:\.| ) *)/g);if(K){for(var q=X[H].split(/(?:(?:^| )(?:[a-z]|[a-z][a-z]|[a-z][a-z][a-z]|[a-z][a-z][a-z][a-z]|subpara|subch|amend|bibliog|annot|illus|princ|intro|sched|subdiv|subsec)(?:\.| ) *)/),W=q.length-1;W>0;W--)q[W-1]&&(!q[W].match(/^[0-9]+([-;,:a-zA-Z]*)$/)||!q[W-1].match(/^[0-9]+([-;,:a-zA-Z]*)$/))&&(q[W-1]=q[W-1]+K[W-1]+q[W],q=q.slice(0,W).concat(q.slice(W+1)),K=K.slice(0,W-1).concat(K.slice(W)));if(K.length>0){var te=K[0].trim(),me=!m.STATUTE_SUBDIV_STRINGS[te]||typeof i.getTerm(m.STATUTE_SUBDIV_STRINGS[te])>"u"||["locator","number","locator-extra","page"].indexOf(n)===-1&&m.STATUTE_SUBDIV_STRINGS[te]!==n;me?H===0&&(K=K.slice(1),q[0]=q[0]+" "+te+" "+q[1],q=q.slice(0,1).concat(q.slice(2))):ee=te}for(var W=0,Y=q.length;W<Y;W++)if(q[W]||W===q.length-1){var ne;J=K[W-1]?K[W-1]:J,ee===J.trim()?ne="":ne=ee,z=q[W]?q[W].trim():"",W===q.length-1?$.push(v(ne,J,z,X[H+1],H)):$.push(v(ne,J,z,null,H))}}else{var ne;ee===J.trim()?ne="":ne=ee,$.push(v(ne,J,X[H],X[H+1]))}}return $}function c(E){for(var M=0,F=E.length-1;M<F;M++)!E[M].joiningSuffix&&E[M+1].label&&(E[M].joiningSuffix=" ")}function _(E,M,F){var P=E[F.pos],z=E[M].value,q=P.joiningSuffix==="\\-";z.particle&&z.particle!==P.particle&&(F.collapsible=!1);var H=z.match(/^[0-9]+([-,:a-zA-Z]*)$/),V=P.value.match(/^(?:[0-9]+|[ixv]+)([-,:a-zA-Z]*|\-[\-0-9]+)$/);if((!z||!H||!V||q)&&(F.collapsible=!1,(!z||!V)&&(F.numeric=!1),q&&F.count--),(H&&H[1]||V&&V[1])&&(F.collapsible=!1),E[M].collapsible===void 0){for(var X=M,K=M+F.count;X<K;X++)isNaN(parseInt(E[X].value))&&!E[X].value.match(/^[ivxlcmIVXLCM]+$/)?E[X].collapsible=!1:E[X].collapsible=!0;F.collapsible=E[M].collapsible}for(var Q=F.collapsible,X=F.pos,K=F.pos+F.count;X<K;X++)F.count>1&&Q&&(E[X].plural=1),E[X].numeric=F.numeric,E[X].collapsible=F.collapsible}function y(E,M,F){F.label.slice(0,4)!=="var:"&&(F.pos===0?(["locator","number","locator-extra","page"].indexOf(n)>-1&&typeof i.getTerm(m.STATUTE_SUBDIV_STRINGS[F.label])>"u"&&(E[F.pos].labelVisibility=!0),["locator","number","locator-extra","page"].indexOf(n)===-1&&m.STATUTE_SUBDIV_STRINGS[F.label]!==n&&(E[0].labelVisibility=!0)):E[F.pos].labelVisibility=!0)}function b(E){if(E.length!==0){for(var M=0,F=1,P=1,z=E.length;P<z;P++){var q=E[P-1],H=E[P];if(q.label===H.label&&q.particle===q.particle)F++;else{var V=JSON.parse(JSON.stringify(E[M]));V.pos=M,V.count=F,V.numeric=!0,_(E,M,V),q.label!==H.label&&y(E,M,V),M=P,F=1}}var V=JSON.parse(JSON.stringify(E[M]));V.pos=M,V.count=F,V.numeric=!0,_(E,M,V),y(E,M,V),E.length&&E[0].numeric&&n.slice(0,10)==="number-of-"&&parseInt(t[s],10)>1&&(E[0].plural=1)}}function T(E){return E.replace("\\-","-")}function O(E){var M=m.Util.cloneToken(e),F=new m.Token;i.tmp.just_looking||(F.decorations=M.decorations,M.decorations=[],F.strings.prefix=M.strings.prefix,M.strings.prefix="",F.strings.suffix=M.strings.suffix,M.strings.suffix="");var P=E.length?E[0].label:null;if(E.length){for(var z=0,q=E.length;z<q;z++){var H=E[z],V=m.Util.cloneToken(M);V.gender=e.gender,P===H.label&&(V.formatter=e.formatter),H.numeric&&(V.successor_prefix=H.successor_prefix),V.strings.suffix=V.strings.suffix+T(H.joiningSuffix),H.styling=V}i.tmp.just_looking||E[0].value.slice(0,1)==='"'&&E[E.length-1].value.slice(-1)==='"'&&(E[0].value=E[0].value.slice(1),E[E.length-1].value=E[E.length-1].value.slice(0,-1),F.decorations.push(["@quotes",!0]))}return F}function L(E,M){var F=!0;if(["locator","locator-extra","page"].indexOf(E)>-1){var P;M.origLabel?P=M.origLabel:P=M.label,F=!!i.getTerm(m.STATUTE_SUBDIV_STRINGS[P])}return F}function x(E,M){return E==="page"||["locator","locator-extra"].indexOf(E)>-1&&(["p."].indexOf(M.label)>-1||["p."].indexOf(M.origLabel)>-1)}function k(E,M,F,P){var z=x(E,M),q=L(E,M);return q&&F==="-"&&P&&((z||["locator","locator-extra","issue","volume","edition","number"].indexOf(E)>-1)&&(F=i.getTerm("page-range-delimiter"),F||(F="\u2013")),E==="collection-number"&&(F=i.getTerm("year-range-delimiter"),F||(F="\u2013"))),F}function N(E,M,F){if(!(M<1)&&F.count===2&&E[M-1].particle===E[M].particle){if(E[M-1].joiningSuffix!=="-"){F.count=1;return}if(!i.opt["page-range-format"]&&parseInt(E[M-1].value,10)>parseInt(E[M].value,10)){E[M-1].joiningSuffix=k(n,E[M],E[M-1].joiningSuffix,!0);return}var P=E[M],z=x(n,P),q;z&&!isNaN(parseInt(E[M-1].value))&&!isNaN(parseInt(E[M].value))?(q=E[M-1].particle+E[M-1].value+" - "+E[M].particle+E[M].value,q=i.fun.page_mangler(q)):((""+E[M-1].value).match(/^([0-9]+|[ivxlcmIVXLCM]+)$/)&&(""+E[M].value).match(/^([0-9]+|[ivxlcmIVXLCM]+)$/)&&(E[M-1].joiningSuffix=i.getTerm("page-range-delimiter")),q=E[M-1].value+T(E[M-1].joiningSuffix)+E[M].value);var H=q.match(/^((?:[0-9]*[a-zA-Z]+0*))?([0-9]+[a-z]*)(\s*[^0-9]+\s*)([-,a-zA-Z]?0*)([0-9]+[a-z]*)$/);if(H){var V=H[3];V=k(n,P,V,E[M].numeric),E[M-1].particle=H[1],E[M-1].value=H[2],E[M-1].joiningSuffix=V,E[M].particle=H[4],E[M].value=H[5]}F.count=0}}function R(E){if(e&&["page","chapter-number","collection-number","edition","issue","number","number-of-pages","number-of-volumes","volume","locator","locator-extra"].indexOf(n)!==-1){for(var M={count:0,label:null,lastHadRangeDelimiter:!1},F=0,P=E.length;F<P;F++){var z=E[F];if(z.collapsible)M.label===z.label&&z.joiningSuffix==="-"?M.count=1:M.label===z.label&&z.joiningSuffix!=="-"?(M.count++,M.count===2&&N(E,F,M)):M.label!==z.label?(M.label=z.label,M.count=1):(M.count=1,M.label=z.label);else{M.count=0,M.label=null;var q=z.numeric;z.joiningSuffix=k(n,z,z.joiningSuffix,q)}}M.count===2&&N(E,E.length-1,M)}}function I(E,M,F){var P=E[M];F.length&&(P.numeric=F[0].numeric,P.collapsible=F[0].collapsible,P.plural=F[0].plural,P.label=m.STATUTE_SUBDIV_STRINGS[F[0].label],n==="number"&&P.label==="issue"&&i.getTerm("number")&&(P.label="number"))}if(e&&this.tmp.shadow_numbers[s]&&this.tmp.shadow_numbers[s].values.length){var w=this.tmp.shadow_numbers[s].values;R(w),this.tmp.shadow_numbers[s].masterStyling=O(w);return}if(this.tmp.shadow_numbers[s]||(this.tmp.shadow_numbers[s]={values:[]}),!!t){var A=m.LangPrefsMap[n];if(A){var C=this.opt["cite-lang-prefs"][A][0];r=this.transform.getTextSubField(t,s,"locale-"+C,!0),r=r.name}else r=t[s];if(r&&s==="number"&&t.type==="legal_case"&&(r=r.replace(/[\\]*-/g,"\\-")),r&&this.sys.getAbbreviation){if(this.sys.normalizeAbbrevsKey)var j=this.sys.normalizeAbbrevsKey(s,r);else var j=r;var U=this.transform.loadAbbreviation(t.jurisdiction,"number",j,t.language);this.transform.abbrevs[U].number&&(this.transform.abbrevs[U].number[j]?r=this.transform.abbrevs[U].number[j]:typeof this.transform.abbrevs[U].number[j]<"u"&&delete this.transform.abbrevs[U].number[j])}if(typeof r<"u"&&(typeof r=="string"||typeof r=="number")){typeof r=="number"&&(r=""+r);var D=m.STATUTE_SUBDIV_STRINGS_REVERSE[n];if(this.tmp.shadow_numbers[s].values.length===0){var w=S(r,D);c(w),b(w);for(var G of w)G.numeric||(G.plural=0);this.tmp.shadow_numbers[s].values=w,e&&(R(w),this.tmp.shadow_numbers[s].masterStyling=O(w)),I(this.tmp.shadow_numbers,s,w)}var B=this.tmp.shadow_numbers[s];n==="number"&&B.values.length===1&&B.values[0].value.indexOf("|")>-1&&(B.values[0].value=B.values[0].value.replace(/\|/g,", "),B.values[0].numeric=!0,B.values[0].plural=1,B.values[0].collapsible=!1,B.numeric=!0,B.plural=1,B.collapsible=!1),B.values.length===1&&B.values[0].value.match(/^[0-9]+(?:\/[0-9]+)+$/)&&(B.values[0].numeric=!0,B.values[0].plural=0,B.values[0].collapsible=!1,B.numeric=!0,B.plural=0,B.collapsible=!1),n==="page"&&B.values.length>0&&B.values[0].gotosleepability&&(B.labelForm="short")}}};m.Util.outputNumericField=function(e,t,n){e.output.openLevel(e.tmp.shadow_numbers[t].masterStyling);var r=e.tmp.shadow_numbers[t].masterStyling,i=e.tmp.shadow_numbers[t].values,s=i.length?i[0].label:null,a=e.tmp.shadow_numbers[t].labelForm,l=e.tmp.group_context.tip.label_static,o;a?o=a:o="short";for(var p=e.tmp.shadow_numbers[t].labelCapitalizeIfFirst,f=e.tmp.shadow_numbers[t].labelDecorations,g=null,u=0,d=i.length;u<d;u++){var v=i[u],h="",S;v.label&&(v.label.slice(0,4)==="var:"?S=v.label.slice(4):S=m.STATUTE_SUBDIV_STRINGS[v.label],S&&(v.label===s?(l&&(h=e.getTerm(S,"static",v.plural),h.indexOf("%s")===-1&&(h="")),h||(h=e.getTerm(S,a,v.plural))):(l&&(h=e.getTerm(S,"static",v.plural),h.indexOf("%s")===-1&&(h="")),h||(h=e.getTerm(S,o,v.plural))),p&&(h=m.Output.Formatters["capitalize-first"](e,h))));var c=-1;h&&(c=h.indexOf("%s"));var _=m.Util.cloneToken(v.styling);if(_.formatter=v.styling.formatter,_.type=v.styling.type,_.num=v.styling.num,_.gender=v.styling.gender,c>0&&c<h.length-2)_.strings.prefix+=h.slice(0,c),_.strings.suffix=h.slice(c+2)+_.strings.suffix;else if(v.labelVisibility)if(h||(h=v.label,S=v.label),c>0){var y=new m.Token;y.decorations=f,e.output.append(h.slice(0,c),y)}else(c===h.length-2||c===-1)&&e.output.append(h+v.labelSuffix,"empty");if(m.UPDATE_GROUP_CONTEXT_CONDITION(e,r.strings.prefix,null,r,`${v.particle}${v.value}`),v.collapsible){var b;v.value.match(/^[1-9][0-9]*$/)&&Number.isSafeInteger(parseInt(v.value,10))?b=new m.NumericBlob(e,v.particle,parseInt(v.value,10),_,n):b=new m.NumericBlob(e,v.particle,v.value,_,n),typeof b.gender>"u"&&(b.gender=e.locale[e.opt.lang]["noun-genders"][t]),e.output.append(b,"literal")}else e.output.append(v.particle+v.value,_);if(c===0&&c<h.length-2&&(g===null&&(g=S),S!==g||u===i.length-1)){var T=new m.Token;T.decorations=f,e.output.append(h.slice(c+2),T)}g=S,e.tmp.term_predecessor=!0}e.output.closeLevel()};m.Util.PageRangeMangler={};m.Util.PageRangeMangler.getFunction=function(e,t){var n,r,i,s,a,l,o,p,f,g,u,d,v,h,S,c,_,y,b=e.getTerm(t+"-range-delimiter");n=/([0-9]*[a-zA-Z]+0*)?([0-9]+[a-z]*)\s*(?:\u2013|-)\s*([0-9]*[a-zA-Z]+0*)?([0-9]+[a-z]*)/,s=function(O){for(i=O.length,r=1;r<i;r+=2)typeof O[r]=="object"&&(O[r]=O[r].join(""));var L=O.join("");return L=L.replace(/([^\\])\-/g,"$1"+e.getTerm(t+"-range-delimiter")),L},a=function(O){var L,x,k,N="\\s+\\-\\s+",R=b==="-"?"":b,I=new RegExp("([^\\\\])[-"+R+"\\u2013]","g");O=O.replace(I,"$1 - ").replace(/\s+-\s+/g," - ");var w=new RegExp("((?:[0-9]*[a-zA-Z]+0*)?[0-9]+[a-z]*"+N+"(?:[0-9]*[a-zA-Z]+0*)?[0-9]+[a-z]*)","g"),A=new RegExp("(?:[0-9]*[a-zA-Z]+0*)?[0-9]+[a-z]*"+N+"(?:[0-9]*[a-zA-Z]+0*)?[0-9]+[a-z]*");if(L=O.match(w),x=O.split(A),x.length===0)k=L;else for(k=[x[0]],r=1,i=x.length;r<i;r+=1)k.push(L[r-1].replace(/\s*\-\s*/g,"-")),k.push(x[r]);return k},l=function(O){for(O=""+O,u=a(O),i=u.length,r=1;r<i;r+=2)d=u[r].match(n),d&&(!d[3]||d[1]===d[3])&&(d[4].length<d[2].length&&(d[4]=d[2].slice(0,d[2].length-d[4].length)+d[4]),parseInt(d[2],10)<parseInt(d[4],10)&&(d[3]=b+(d[1]?d[1]:""),u[r]=d.slice(1))),typeof u[r]=="string"&&(u[r]=u[r].replace(/\-/g,b));return u},o=function(O,L,x){i=O.length;for(var k=1,N=O.length;k<N;k+=2)typeof O[k]=="object"&&(O[k][3]=p(O[k][1],O[k][3],L,x),O[k][2].slice(1)===O[k][0]&&(O[k][2]=b));return s(O)},p=function(O,L,x,k){if(x||(x=0),v=(""+O).split(""),h=(""+L).split(""),S=h.slice(),S.reverse(),v.length===h.length)for(var N=0,R=v.length;N<R;N+=1)if(v[N]===h[N]&&S.length>x)S.pop();else{if(x&&k&&S.length===3){var I=v.slice(0,N);I.reverse(),S=S.concat(I)}break}return S.reverse(),S.join("")},f=function(O){for(i=O.length,r=1;r<i;r+=2)typeof O[r]=="object"&&(d=O[r],c=parseInt(d[1],10),_=parseInt(d[3],10),c>100&&c%100&&parseInt(c/100,10)===parseInt(_/100,10)?d[3]=""+_%100:c>=1e4&&(d[3]=""+_%1e3)),d[2].slice(1)===d[0]&&(d[2]=b);return s(O)},g=function(O){for(i=O.length,r=1;r<i;r+=2){if(typeof O[r]=="object"&&(d=O[r],c=parseInt(d[1],10),_=parseInt(d[3],10),h=""+_,c>100&&c%100))for(var L=2;L<h.length;L++){var x=Math.pow(10,L);if(Math.floor(c/x)===Math.floor(_/x)){d[3]=""+_%x;break}}d[2].slice(1)===d[0]&&(d[2]=b)}return s(O)};var T=function(O,L,x,k){var R;O=""+O;var N=l(O),R=L(N,x,k);return R};return e.opt[t+"-range-format"]?e.opt[t+"-range-format"]==="expanded"?y=function(O){return T(O,s)}:e.opt[t+"-range-format"]==="minimal"?y=function(O){return T(O,o)}:e.opt[t+"-range-format"]==="minimal-two"?y=function(O,L){return T(O,o,2,L)}:e.opt[t+"-range-format"]==="chicago"?y=function(O){return T(O,f)}:e.opt[t+"-range-format"]==="chicago-15"?y=function(O){return T(O,f)}:e.opt[t+"-range-format"]==="chicago-16"&&(y=function(O){return T(O,g)}):y=function(O){return T(O,s)},y};m.Util.FlipFlopper=function(e){var t=[],n={'<span class="nocase">':{type:"nocase",opener:'<span class="nocase">',closer:"</span>",attr:null,outer:null,flipflop:null},'<span class="nodecor">':{type:"nodecor",opener:'<span class="nodecor">',closer:"</span>",attr:"@class",outer:"nodecor",flipflop:{nodecor:"nodecor"}},'<span style="font-variant:small-caps;">':{type:"tag",opener:'<span style="font-variant:small-caps;">',closer:"</span>",attr:"@font-variant",outer:"small-caps",flipflop:{"small-caps":"normal",normal:"small-caps"}},"<sc>":{type:"tag",opener:"<sc>",closer:"</sc>",attr:"@font-variant",outer:"small-caps",flipflop:{"small-caps":"normal",normal:"small-caps"}},"<i>":{type:"tag",opener:"<i>",closer:"</i>",attr:"@font-style",outer:"italic",flipflop:{italic:"normal",normal:"italic"}},"<b>":{type:"tag",opener:"<b>",closer:"</b>",attr:"@font-weight",outer:"bold",flipflop:{bold:"normal",normal:"bold"}},"<sup>":{type:"tag",opener:"<sup>",closer:"</sup>",attr:"@vertical-align",outer:"sup",flipflop:{sub:"sup",sup:"sup"}},"<sub>":{type:"tag",opener:"<sub>",closer:"</sub>",attr:"@vertical-align",outer:"sub",flipflop:{sup:"sub",sub:"sub"}},' "':{type:"quote",opener:' "',closer:'"',attr:"@quotes",outer:"true",flipflop:{true:"inner",inner:"true",false:"true"}}," '":{type:"quote",opener:" '",closer:"'",attr:"@quotes",outer:"inner",flipflop:{true:"inner",inner:"true",false:"true"}}};n['("']=n[' "'],n["('"]=n[" '"];var r=e.getTerm("open-quote"),i=e.getTerm("close-quote"),s=e.getTerm("open-inner-quote"),a=e.getTerm("close-inner-quote");r&&i&&[' "'," '",'"',"'"].indexOf(r)===-1&&(n[r]=JSON.parse(JSON.stringify(n[' "'])),n[r].opener=r,n[r].closer=i),s&&a&&[' "'," '",'"',"'"].indexOf(s)===-1&&(n[s]=JSON.parse(JSON.stringify(n[" '"])),n[s].opener=s,n[s].closer=a);function l(_){var y={" '":' "',' "':" '",'("':"('","('":'("'};n[_].outer="true",n[y[_]].outer="inner"}function o(_){for(var y=[],b=Object.keys(n),T=0,O=b.length;T<O;T++){var L=b[T];(n[_].type!=="quote"||!n[_])&&y.push(L)}var x=n[_];return x.opener=new RegExp("^(?:"+y.map(function(k){return k.replace("(","\\(")}).join("|")+")"),x}var p=function(){for(var _={},y=Object.keys(n),b=0,T=y.length;b<T;b++){var O=y[b];_[O]=o(O)}return _}(),f=function(){var _=[],y=[],b={};for(var T in p)_.push(T),b[p[T].closer]=!0;for(var O=Object.keys(b),L=0,x=O.length;L<x;L++){var k=O[L];y.push(k)}var N=_.concat(y).map(function(R){return R.replace("(","\\(")}).join("|");return{matchAll:new RegExp("((?:"+N+"))","g"),splitAll:new RegExp("(?:"+N+")","g"),open:new RegExp("(^(?:"+_.map(function(R){return R.replace("(","\\(")}).join("|")+")$)"),close:new RegExp("(^(?:"+y.join("|")+")$)")}}();function g(_,y){var b=t[t.length-1];return!b||_.match(b.opener)?(t.push({type:p[_].type,opener:p[_].opener,closer:p[_].closer,pos:y}),!1):(t.pop(),t.push({type:p[_].type,opener:p[_].opener,closer:p[_].closer,pos:y}),{fixtag:b.pos})}function u(_,y){var b=t[t.length-1];return b&&_===b.closer?(t.pop(),b.type==="nocase"?{nocase:{open:b.pos,close:y}}:!1):b?{fixtag:b.pos}:{fixtag:y}}function d(_,y){return _.match(f.open)?g(_,y):u(_,y)}function v(_){var y=[];_=_.replace(/(<span)\s+(style=\"font-variant:)\s*(small-caps);?\"[^>]*(>)/g,'$1 $2$3;"$4'),_=_.replace(/(<span)\s+(class=\"no(?:case|decor)\")[^>]*(>)/g,"$1 $2$3");var b=_.match(f.matchAll);if(!b)return{tags:[],strings:[_],forcedSpaces:[]};for(var T=_.split(f.splitAll),O=0,L=b.length-1;O<L;O++)n[b[O]]&&(T[O+1]===""&&['"',"'"].indexOf(b[O+1])>-1?(b[O+1]=" "+b[O+1],y.push(!0)):y.push(!1));return{tags:b,strings:T,forcedSpaces:y}}var h=function(_){var y=[];this.set=function(b){for(var T=n[b].attr,O=null,L=y.length-1;L>-1;L--){var x=y[L];if(x[0]===T){O=x;break}}if(!O){var k=[e[e.tmp.area].opt.layout_decorations].concat(_.alldecor);e:for(var L=k.length-1;L>-1;L--){var N=k[L];if(N)for(var R=N.length-1;R>-1;R--){var x=N[R];if(x[0]===T){O=x;break e}}}}O?O=[T,n[b].flipflop[O[1]]]:O=[T,n[b].outer],y.push(O)},this.pair=function(){return y[y.length-1]},this.pop=function(){y.pop()}};function S(_,y){if(_==="'"){if(y&&y.match(/^[^\,\.\?\:\;\ ]/))return"\u2019"}else if(_===" '"&&y&&y.match(/^[\ ]/))return" \u2019";return!1}function c(_,y,b){var T=!0,O=new h(_);_.blobs=[];function L(w){this.stack=[w],this.latest=w,this.addStyling=function(A,C){if(T&&(A.slice(0,1)===" "&&(A=A.slice(1)),A.slice(0,1)===" "&&(A=A.slice(1)),T=!1),this.latest=this.stack[this.stack.length-1],C){if(typeof this.latest.blobs=="string"){var j=new m.Blob;j.blobs=this.latest.blobs,j.alldecor=this.latest.alldecor.slice(),this.latest.blobs=[j]}var U=new m.Token,D=new m.Blob(null,U);if(D.alldecor=this.latest.alldecor.slice(),C[0]==="@class"&&C[1]==="nodecor"){for(var G=[],B={},E=[e[e.tmp.area].opt.layout_decorations].concat(D.alldecor),M=E.length-1;M>-1;M--){var F=E[M];if(F)for(var P=F.length-1;P>-1;P--){var z=F[P];["@font-weight","@font-style","@font-variant"].indexOf(z[0])>-1&&!B[z[0]]&&(C[1]!=="normal"&&(D.decorations.push([z[0],"normal"]),G.push([z[0],"normal"])),B[z[0]]=!0)}}D.alldecor.push(G)}else D.decorations.push(C),D.alldecor.push([C]);if(this.latest.blobs.push(D),this.stack.push(D),this.latest=D,A){var U=new m.Token,D=new m.Blob(null,U);D.blobs=A,D.alldecor=this.latest.alldecor.slice(),this.latest.blobs.push(D)}}else if(A){var j=new m.Blob;j.blobs=A,j.alldecor=this.latest.alldecor.slice(),this.latest.blobs.push(j)}},this.popStyling=function(){this.stack.pop()}}var x=new L(_);if(y.strings.length){var k=y.strings[0];b&&(k=" "+k),x.addStyling(k)}for(var N=0,R=y.tags.length;N<R;N++){var I=y.tags[N],k=y.strings[N+1];I.match(f.open)?(O.set(I),x.addStyling(k,O.pair())):(O.pop(),x.popStyling(),x.addStyling(k))}}this.processTags=function(_){var T=_.blobs,y=!1;T.slice(0,1)===" "&&!T.match(/^\s+[\'\"]/)&&(y=!0);var b=new RegExp("("+m.ROMANESQUE_REGEXP.source+")\u2019("+m.ROMANESQUE_REGEXP.source+")","g"),T=" "+T.replace(b,"$1'$2"),O=v(T);if(O.tags.length!==0){for(var L=!1,x=0,k=O.tags.length;x<k;x++){var N=O.tags[x],T=O.strings[x+1],R=S(N,T);if(R)O.strings[x+1]=R+O.strings[x+1],O.tags[x]="";else{for(var I;I=d(N,x),I;)if(Object.keys(I).indexOf("fixtag")>-1){if(N.match(f.close)&&N==="'")O.strings[x+1]="\u2019"+O.strings[x+1],O.tags[x]="";else{var w=O.tags[I.fixtag];O.forcedSpaces[I.fixtag-1]&&(w=w.slice(1)),O.strings[I.fixtag+1]=w+O.strings[I.fixtag+1],O.tags[I.fixtag]=""}if(t.length>0)if(N!=="'")t.pop();else break;else break}else if(I.nocase){O.tags[I.nocase.open]="",O.tags[I.nocase.close]="";break}else break;I&&(I.fixtag||I.fixtag===0)&&(O.strings[x+1]=O.tags[x]+O.strings[x+1],O.tags[x]="")}}for(var x=t.length-1;x>-1;x--){var A=t[x].pos,N=O.tags[A];N===" '"||N==="'"?O.strings[A+1]=" \u2019"+O.strings[A+1]:O.strings[A+1]=O.tags[A]+O.strings[A+1],O.tags[A]="",t.pop()}for(var x=O.tags.length-1;x>-1;x--)O.tags[x]||(O.tags=O.tags.slice(0,x).concat(O.tags.slice(x+1)),O.strings[x]=O.strings[x]+O.strings[x+1],O.strings=O.strings.slice(0,x+1).concat(O.strings.slice(x+2)));for(var x=0,k=O.tags.length;x<k;x++){var N=O.tags[x],C=O.forcedSpaces[x-1];[' "'," '",'("',"('"].indexOf(N)>-1&&(L||(l(N),L=!0),C||(O.strings[x]+=N.slice(0,1)))}c(_,O,y)}}};m.Output.Formatters=function(){var e=`(?:\u2018|\u2019|\u201C|\u201D| "| '|"|'|[-\u2013\u2014/.,;?!:]|\\[|\\]|\\(|\\)|<span style="font-variant: small-caps;">|<span class="no(?:case|decor)">|</span>|</?(?:i|sc|b|sub|sup)>)`,t=new m.Doppeler(e,function(h){return h.replace(/(<span)\s+(class=\"no(?:case|decor)\")[^>]*(>)/g,"$1 $2$3").replace(/(<span)\s+(style=\"font-variant:)\s*(small-caps);?(\")[^>]*(>)/g,"$1 $2 $3;$4$5")}),n='(?:[-\\s]*<\\/*(?:spans+class="no(?:case|decor)"|i|sc|b|sub|sup)>[-\\s]*|[-\\s]+)',r=new m.Doppeler(n),i=new m.Doppeler("(?:[\xA0 \xA0\u2000-\u200B\u205F\u3000]+)"),s={'<span style="font-variant: small-caps;">':"</span>",'<span class="nocase">':"</span>",'<span class="nodecor">':"</span>","<sc>":"</sc>","<sub>":"</sub>","<sup>":"</sup>"};function a(h){var S=h.match(/(^\s*)((?:[\0-\t\x0B\f\x0E-\u2027\u202A-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]))(.*)/);return S&&!(S[2].match(/^[\u0370-\u03FF]$/)&&!S[3])?S[1]+m.toLocaleUpperCase.call(this,S[2])+S[3]:h}function l(h,S){if(!S)return"";h.doppel=t.split(S);var c={' "':{opener:" '",closer:'"'}," '":{opener:' "',closer:"'"},"\u2018":{opener:"\u2018",closer:"\u2019"},"\u201C":{opener:"\u201C",closer:"\u201D"}};function _(A,C){if(h.quoteState.length===0||A===h.quoteState[h.quoteState.length-1].opener)return h.quoteState.push({opener:c[A].opener,closer:c[A].closer,pos:C}),!1;var j=h.quoteState[h.quoteState.length-1].pos;return h.quoteState.pop(),h.quoteState.push({opener:c[A].opener,closer:c[A].closer,positions:C}),j}function y(A,C){if(h.quoteState.length>0&&A===h.quoteState[h.quoteState.length-1].closer)h.quoteState.pop();else return C}function b(A,C){var j=["\u201C","\u2018",' "'," '"].indexOf(A)>-1;return j?_(A,C):y(A,C)}function T(A,C){var j=A.match(/(^(?:\u2018|\u2019|\u201C|\u201D|\"|\')|(?: \"| \')$)/);if(j)return b(j[1],C)}h.doppel.strings.length&&h.doppel.strings[0].trim()&&(h.doppel.strings[0]=h.capitaliseWords(h.doppel.strings[0],0,h.doppel.tags[0]));for(var O=0,L=h.doppel.tags.length;O<L;O++){var x=h.doppel.tags[O],k=h.doppel.strings[O+1];if(h.tagState!==null&&(s[x]?h.tagState.push(s[x]):h.tagState.length&&x===h.tagState[h.tagState.length-1]&&h.tagState.pop()),h.afterPunct!==null&&x.match(/[\!\?\:]$/)&&(h.afterPunct=!0),h.tagState.length===0?h.doppel.strings[O+1]=h.capitaliseWords(k,O+1,h.doppel,h.doppel.tags[O+1]):h.doppel.strings[O+1].trim()&&(h.lastWordPos=null),h.quoteState!==null){var N=T(x,O);if(N||N===0){var R=h.doppel.origStrings[N+1].slice(0,1);h.doppel.strings[N+1]=R+h.doppel.strings[N+1].slice(1),h.lastWordPos=null}}h.isFirst&&k.trim()&&(h.isFirst=!1),h.afterPunct&&k.trim()&&(h.afterPunct=!1)}if(h.quoteState)for(var O=0,L=h.quoteState.length;O<L;O++){var N=h.quoteState[O].pos;if(typeof N<"u"){var R=h.doppel.origStrings[N+1].slice(0,1);h.doppel.strings[N+1]=R+h.doppel.strings[N+1].slice(1)}}if(h.lastWordPos){var I=i.split(h.doppel.strings[h.lastWordPos.strings]),w=I.strings[h.lastWordPos.words];w.length>1&&m.toLocaleLowerCase.call(this,w).match(h.skipWordsRex)&&(w=a.call(this,w),I.strings[h.lastWordPos.words]=w),h.doppel.strings[h.lastWordPos.strings]=i.join(I)}return t.join(h.doppel)}function o(h,S){return S}function p(h,S){var c={quoteState:null,capitaliseWords:function(_){for(var y=_.split(" "),b=0,T=y.length;b<T;b++){var O=y[b];O&&(y[b]=m.toLocaleLowerCase.call(h,O))}return y.join(" ")},skipWordsRex:null,tagState:[],afterPunct:null,isFirst:null};return l.call(h,c,S)}function f(h,S){var c={quoteState:null,capitaliseWords:function(_){for(var y=_.split(" "),b=0,T=y.length;b<T;b++){var O=y[b];O&&(y[b]=m.toLocaleUpperCase.call(h,O))}return y.join(" ")},skipWordsRex:null,tagState:[],afterPunct:null,isFirst:null};return l.call(h,c,S)}function g(h,S){var c={quoteState:[],capitaliseWords:function(_){for(var y=_.split(" "),b=0,T=y.length;b<T;b++){var O=y[b];O&&(c.isFirst?(y[b]=a.call(h,O),c.isFirst=!1):y[b]=m.toLocaleLowerCase.call(h,O))}return y.join(" ")},skipWordsRex:null,tagState:[],afterPunct:null,isFirst:!0};return l.call(h,c,S)}function u(h,S){var c={quoteState:[],capitaliseWords:function(_,y,b){if(_.trim()){for(var T=i.split(_),O=T.strings,L=0,x=O.length;L<x;L++){var k=O[L];if(!k)continue;let N=m.toLocaleLowerCase.call(h,k),R=!1;(k.length>1&&!N.match(c.skipWordsRex)||L===O.length-1&&b==="-"||c.isFirst||c.afterPunct)&&(R=!0),R&&k===N&&(O[L]=a.call(h,k)),c.afterPunct=!1,c.isFirst=!1,c.lastWordPos={strings:y,words:L}}_=i.join(T)}return _},skipWordsRex:h.locale[h.opt.lang].opts["skip-words-regexp"],tagState:[],afterPunct:!1,isFirst:!0};return l.call(h,c,S)}function d(h,S){var c={quoteState:[],capitaliseWords:function(_){for(var y=i.split(_),b=y.strings,T=0,O=b.length;T<O;T++){var L=b[T];if(L&&c.isFirst){L===m.toLocaleLowerCase.call(h,L)&&(b[T]=a.call(h,L)),c.isFirst=!1;break}}return i.join(y)},skipWordsRex:null,tagState:[],afterPunct:null,isFirst:!0};return l.call(h,c,S)}function v(h,S){var c={quoteState:[],capitaliseWords:function(_){for(var y=i.split(_),b=y.strings,T=0,O=b.length;T<O;T++){var L=b[T];L&&L===m.toLocaleLowerCase.call(h,L)&&(b[T]=a.call(h,L))}return i.join(y)},skipWordsRex:null,tagState:[],afterPunct:null,isFirst:null};return l.call(h,c,S)}return{nameDoppel:r,passthrough:o,lowercase:p,uppercase:f,sentence:g,title:u,"capitalize-first":d,"capitalize-all":v}}();m.Output.Formats=function(){};m.Output.Formats.prototype.html={text_escape:function(e){return e||(e=""),e.replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;").replace(/\s\s/g,"\xA0 ").replace(m.SUPERSCRIPTS_REGEXP,function(t){return"<sup>"+m.SUPERSCRIPTS[t]+"</sup>"})},bibstart:`<div class="csl-bib-body">
`,bibend:"</div>","@font-style/italic":"<i>%%STRING%%</i>","@font-style/oblique":"<em>%%STRING%%</em>","@font-style/normal":'<span style="font-style:normal;">%%STRING%%</span>',"@font-variant/small-caps":'<span style="font-variant:small-caps;">%%STRING%%</span>',"@passthrough/true":m.Output.Formatters.passthrough,"@font-variant/normal":'<span style="font-variant:normal;">%%STRING%%</span>',"@font-weight/bold":"<b>%%STRING%%</b>","@font-weight/normal":'<span style="font-weight:normal;">%%STRING%%</span>',"@font-weight/light":!1,"@text-decoration/none":'<span style="text-decoration:none;">%%STRING%%</span>',"@text-decoration/underline":'<span style="text-decoration:underline;">%%STRING%%</span>',"@vertical-align/sup":"<sup>%%STRING%%</sup>","@vertical-align/sub":"<sub>%%STRING%%</sub>","@vertical-align/baseline":'<span style="baseline">%%STRING%%</span>',"@strip-periods/true":m.Output.Formatters.passthrough,"@strip-periods/false":m.Output.Formatters.passthrough,"@quotes/true":function(e,t){return typeof t>"u"?e.getTerm("open-quote"):e.getTerm("open-quote")+t+e.getTerm("close-quote")},"@quotes/inner":function(e,t){return typeof t>"u"?"\u2019":e.getTerm("open-inner-quote")+t+e.getTerm("close-inner-quote")},"@quotes/false":!1,"@cite/entry":function(e,t){return e.sys.wrapCitationEntry(t,this.item_id,this.locator_txt,this.suffix_txt)},"@bibliography/entry":function(e,t){var n="";return e.sys.embedBibliographyEntry&&(n=e.sys.embedBibliographyEntry(this.item_id)+`
`),'  <div class="csl-entry">'+t+`</div>
`+n},"@display/block":function(e,t){return`

    <div class="csl-block">`+t+`</div>
`},"@display/left-margin":function(e,t){return`
    <div class="csl-left-margin">`+t+"</div>"},"@display/right-inline":function(e,t){return'<div class="csl-right-inline">'+t+`</div>
  `},"@display/indent":function(e,t){return'<div class="csl-indent">'+t+`</div>
  `},"@showid/true":function(e,t,n){if(!e.tmp.just_looking&&!e.tmp.suppress_decorations){if(n)return'<span class="'+e.opt.nodenames[n]+'" cslid="'+n+'">'+t+"</span>";if(this.params&&typeof t=="string"){var r="";if(t){var i=t.match(m.VARIABLE_WRAPPER_PREPUNCT_REX);r=i[1],t=i[2]}var s="";return t&&m.SWAPPING_PUNCTUATION.indexOf(t.slice(-1))>-1&&(s=t.slice(-1),t=t.slice(0,-1)),e.sys.variableWrapper(this.params,r,t,s)}else return t}else return t},"@URL/true":function(e,t){return'<a href="'+t+'">'+t+"</a>"},"@DOI/true":function(e,t){var n=t;return t.match(/^https?:\/\//)||(n="https://doi.org/"+t),'<a href="'+n+'">'+t+"</a>"}};m.Output.Formats.prototype.text={text_escape:function(e){return e||(e=""),e},bibstart:"",bibend:"","@font-style/italic":!1,"@font-style/oblique":!1,"@font-style/normal":!1,"@font-variant/small-caps":!1,"@passthrough/true":m.Output.Formatters.passthrough,"@font-variant/normal":!1,"@font-weight/bold":!1,"@font-weight/normal":!1,"@font-weight/light":!1,"@text-decoration/none":!1,"@text-decoration/underline":!1,"@vertical-align/baseline":!1,"@vertical-align/sup":!1,"@vertical-align/sub":!1,"@strip-periods/true":m.Output.Formatters.passthrough,"@strip-periods/false":m.Output.Formatters.passthrough,"@quotes/true":function(e,t){return typeof t>"u"?e.getTerm("open-quote"):e.getTerm("open-quote")+t+e.getTerm("close-quote")},"@quotes/inner":function(e,t){return typeof t>"u"?"\u2019":e.getTerm("open-inner-quote")+t+e.getTerm("close-inner-quote")},"@quotes/false":!1,"@cite/entry":function(e,t){return e.sys.wrapCitationEntry(t,this.item_id,this.locator_txt,this.suffix_txt)},"@bibliography/entry":function(e,t){return t+`
`},"@display/block":function(e,t){return`
`+t},"@display/left-margin":function(e,t){return t+" "},"@display/right-inline":function(e,t){return t},"@display/indent":function(e,t){return`
    `+t},"@showid/true":function(e,t){return t},"@URL/true":function(e,t){return t},"@DOI/true":function(e,t){return t}};m.Output.Formats.prototype.rtf={text_escape:function(e){return e||(e=""),e.replace(/([\\{}])/g,"\\$1").replace(m.SUPERSCRIPTS_REGEXP,function(t){return"\\super "+m.SUPERSCRIPTS[t]+"\\nosupersub{}"}).replace(/[\u007F-\uFFFF]/g,function(t){return"\\uc0\\u"+t.charCodeAt(0).toString()+"{}"}).split("	").join("\\tab{}")},"@passthrough/true":m.Output.Formatters.passthrough,"@font-style/italic":"{\\i{}%%STRING%%}","@font-style/normal":"{\\i0{}%%STRING%%}","@font-style/oblique":"{\\i{}%%STRING%%}","@font-variant/small-caps":"{\\scaps %%STRING%%}","@font-variant/normal":"{\\scaps0{}%%STRING%%}","@font-weight/bold":"{\\b{}%%STRING%%}","@font-weight/normal":"{\\b0{}%%STRING%%}","@font-weight/light":!1,"@text-decoration/none":!1,"@text-decoration/underline":"{\\ul{}%%STRING%%}","@vertical-align/baseline":!1,"@vertical-align/sup":"\\super %%STRING%%\\nosupersub{}","@vertical-align/sub":"\\sub %%STRING%%\\nosupersub{}","@strip-periods/true":m.Output.Formatters.passthrough,"@strip-periods/false":m.Output.Formatters.passthrough,"@quotes/true":function(e,t){return typeof t>"u"?m.Output.Formats.rtf.text_escape(e.getTerm("open-quote")):m.Output.Formats.rtf.text_escape(e.getTerm("open-quote"))+t+m.Output.Formats.rtf.text_escape(e.getTerm("close-quote"))},"@quotes/inner":function(e,t){return typeof t>"u"?m.Output.Formats.rtf.text_escape("\u2019"):m.Output.Formats.rtf.text_escape(e.getTerm("open-inner-quote"))+t+m.Output.Formats.rtf.text_escape(e.getTerm("close-inner-quote"))},"@quotes/false":!1,bibstart:"{\\rtf ",bibend:"}","@display/block":`\\line{}%%STRING%%\\line\r
`,"@cite/entry":function(e,t){return e.sys.wrapCitationEntry(t,this.item_id,this.locator_txt,this.suffix_txt)},"@bibliography/entry":function(e,t){return t},"@display/left-margin":function(e,t){return t+"\\tab "},"@display/right-inline":function(e,t){return t+`\r
`},"@display/indent":function(e,t){return`
\\tab `+t+`\\line\r
`},"@showid/true":function(e,t){if(!e.tmp.just_looking&&!e.tmp.suppress_decorations){var n="";if(t){var r=t.match(m.VARIABLE_WRAPPER_PREPUNCT_REX);n=r[1],t=r[2]}var i="";return t&&m.SWAPPING_PUNCTUATION.indexOf(t.slice(-1))>-1&&(i=t.slice(-1),t=t.slice(0,-1)),e.sys.variableWrapper(this.params,n,t,i)}else return t},"@URL/true":function(e,t){return t},"@DOI/true":function(e,t){return t}};m.Output.Formats.prototype.asciidoc={text_escape:function(e){return e||(e=""),e.replace("*","pass:[*]","g").replace("_","pass:[_]","g").replace("#","pass:[#]","g").replace("^","pass:[^]","g").replace("~","pass:[~]","g").replace("[[","pass:[[[]","g").replace("  ","&#160; ","g").replace(m.SUPERSCRIPTS_REGEXP,function(t){return"^"+m.SUPERSCRIPTS[t]+"^"})},bibstart:"",bibend:"","@passthrough/true":m.Output.Formatters.passthrough,"@font-style/italic":"__%%STRING%%__","@font-style/oblique":"__%%STRING%%__","@font-style/normal":!1,"@font-variant/small-caps":"[small-caps]#%%STRING%%#","@font-variant/normal":!1,"@font-weight/bold":"**%%STRING%%**","@font-weight/normal":!1,"@font-weight/light":!1,"@text-decoration/none":!1,"@text-decoration/underline":"[underline]##%%STRING%%##","@vertical-align/sup":"^^%%STRING%%^^","@vertical-align/sub":"~~%%STRING%%~~","@vertical-align/baseline":!1,"@strip-periods/true":m.Output.Formatters.passthrough,"@strip-periods/false":m.Output.Formatters.passthrough,"@quotes/true":function(e,t){return typeof t>"u"?"``":"``"+t+"''"},"@quotes/inner":function(e,t){return typeof t>"u"?"`":"`"+t+"'"},"@quotes/false":!1,"@cite/entry":function(e,t){return e.sys.wrapCitationEntry(t,this.item_id,this.locator_txt,this.suffix_txt)},"@bibliography/entry":function(e,t){return t+`
`},"@display/block":function(e,t){return t},"@display/left-margin":function(e,t){return t},"@display/right-inline":function(e,t){return" "+t},"@display/indent":function(e,t){return" "+t},"@showid/true":function(e,t){if(!e.tmp.just_looking&&!e.tmp.suppress_decorations&&this.params&&typeof t=="string"){var n="";if(t){var r=t.match(m.VARIABLE_WRAPPER_PREPUNCT_REX);n=r[1],t=r[2]}var i="";return t&&m.SWAPPING_PUNCTUATION.indexOf(t.slice(-1))>-1&&(i=t.slice(-1),t=t.slice(0,-1)),e.sys.variableWrapper(this.params,n,t,i)}else return t},"@URL/true":function(e,t){return t},"@DOI/true":function(e,t){var n=t;return t.match(/^https?:\/\//)||(n="https://doi.org/"+t),n+"["+t+"]"}};m.Output.Formats.prototype.fo={text_escape:function(e){return e||(e=""),e.replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;").replace("  ","&#160; ","g").replace(m.SUPERSCRIPTS_REGEXP,function(t){return'<fo:inline vertical-align="super">'+m.SUPERSCRIPTS[t]+"</fo:inline>"})},bibstart:"",bibend:"","@passthrough/true":m.Output.Formatters.passthrough,"@font-style/italic":'<fo:inline font-style="italic">%%STRING%%</fo:inline>',"@font-style/oblique":'<fo:inline font-style="oblique">%%STRING%%</fo:inline>',"@font-style/normal":'<fo:inline font-style="normal">%%STRING%%</fo:inline>',"@font-variant/small-caps":'<fo:inline font-variant="small-caps">%%STRING%%</fo:inline>',"@font-variant/normal":'<fo:inline font-variant="normal">%%STRING%%</fo:inline>',"@font-weight/bold":'<fo:inline font-weight="bold">%%STRING%%</fo:inline>',"@font-weight/normal":'<fo:inline font-weight="normal">%%STRING%%</fo:inline>',"@font-weight/light":'<fo:inline font-weight="lighter">%%STRING%%</fo:inline>',"@text-decoration/none":'<fo:inline text-decoration="none">%%STRING%%</fo:inline>',"@text-decoration/underline":'<fo:inline text-decoration="underline">%%STRING%%</fo:inline>',"@vertical-align/sup":'<fo:inline vertical-align="super">%%STRING%%</fo:inline>',"@vertical-align/sub":'<fo:inline vertical-align="sub">%%STRING%%</fo:inline>',"@vertical-align/baseline":'<fo:inline vertical-align="baseline">%%STRING%%</fo:inline>',"@strip-periods/true":m.Output.Formatters.passthrough,"@strip-periods/false":m.Output.Formatters.passthrough,"@quotes/true":function(e,t){return typeof t>"u"?e.getTerm("open-quote"):e.getTerm("open-quote")+t+e.getTerm("close-quote")},"@quotes/inner":function(e,t){return typeof t>"u"?"\u2019":e.getTerm("open-inner-quote")+t+e.getTerm("close-inner-quote")},"@quotes/false":!1,"@cite/entry":function(e,t){return e.sys.wrapCitationEntry(t,this.item_id,this.locator_txt,this.suffix_txt)},"@bibliography/entry":function(e,t){var n="";if(e.bibliography&&e.bibliography.opt&&e.bibliography.opt.hangingindent){var r=e.bibliography.opt.hangingindent;n=' start-indent="'+r+'em" text-indent="-'+r+'em"'}var i="";return e.sys.embedBibliographyEntry&&(i=e.sys.embedBibliographyEntry(this.item_id)+`
`),'<fo:block id="'+this.system_id+'"'+n+">"+t+`</fo:block>
`+i},"@display/block":function(e,t){return`
  <fo:block>`+t+`</fo:block>
`},"@display/left-margin":function(e,t){return`
  <fo:table table-layout="fixed" width="100%">
    <fo:table-column column-number="1" column-width="$$$__COLUMN_WIDTH_1__$$$"/>
    <fo:table-column column-number="2" column-width="proportional-column-width(1)"/>
    <fo:table-body>
      <fo:table-row>
        <fo:table-cell>
          <fo:block>`+t+`</fo:block>
        </fo:table-cell>
        `},"@display/right-inline":function(e,t){return`<fo:table-cell>
          <fo:block>`+t+`</fo:block>
        </fo:table-cell>
      </fo:table-row>
    </fo:table-body>
  </fo:table>
`},"@display/indent":function(e,t){return'<fo:block margin-left="2em">'+t+`</fo:block>
`},"@showid/true":function(e,t){if(!e.tmp.just_looking&&!e.tmp.suppress_decorations&&this.params&&typeof t=="string"){var n="";if(t){var r=t.match(m.VARIABLE_WRAPPER_PREPUNCT_REX);n=r[1],t=r[2]}var i="";return t&&m.SWAPPING_PUNCTUATION.indexOf(t.slice(-1))>-1&&(i=t.slice(-1),t=t.slice(0,-1)),e.sys.variableWrapper(this.params,n,t,i)}else return t},"@URL/true":function(e,t){return`<fo:basic-link external-destination="url('`+t+`')">`+t+"</fo:basic-link>"},"@DOI/true":function(e,t){var n=t;return t.match(/^https?:\/\//)||(n="https://doi.org/"+t),`<fo:basic-link external-destination="url('`+n+`')">`+t+"</fo:basic-link>"}};m.Output.Formats.prototype.latex={text_escape:function(e){return e||(e=""),e},bibstart:"\\begin{thebibliography}{4}",bibend:"\\end{thebibliography}","@font-style/italic":"{\\em %%STRING%%}","@font-style/oblique":!1,"@font-style/normal":!1,"@font-variant/small-caps":!1,"@passthrough/true":m.Output.Formatters.passthrough,"@font-variant/normal":!1,"@font-weight/bold":"{\\bf %%STRING%%}","@font-weight/normal":!1,"@font-weight/light":!1,"@text-decoration/none":!1,"@text-decoration/underline":!1,"@vertical-align/baseline":!1,"@vertical-align/sup":!1,"@vertical-align/sub":!1,"@strip-periods/true":m.Output.Formatters.passthrough,"@strip-periods/false":m.Output.Formatters.passthrough,"@quotes/true":function(e,t){return typeof t>"u"?e.getTerm("open-quote"):e.getTerm("open-quote")+t+e.getTerm("close-quote")},"@quotes/inner":function(e,t){return typeof t>"u"?"\u2019":e.getTerm("open-inner-quote")+t+e.getTerm("close-inner-quote")},"@quotes/false":!1,"@cite/entry":function(e,t){return e.sys.wrapCitationEntry(t,this.item_id,this.locator_txt,this.suffix_txt)},"@bibliography/entry":function(e,t){return"\\bibitem{"+e.sys.embedBibliographyEntry(this.item_id)+`}
`},"@display/block":function(e,t){return`
`+t},"@display/left-margin":function(e,t){return t},"@display/right-inline":function(e,t){return t},"@display/indent":function(e,t){return`
    `+t},"@showid/true":function(e,t,n){return t},"@URL/true":function(e,t){return t},"@DOI/true":function(e,t){return t}};m.Output.Formats=new m.Output.Formats;m.Registry=function(e){this.debug=!1,this.state=e,this.registry={},this.reflist=[],this.refhash={},this.namereg=new m.Registry.NameReg(e),this.citationreg=new m.Registry.CitationReg(e),this.authorstrings={},this.masterMap={},this.mylist=[],this.myhash={},this.deletes=[],this.inserts=[],this.uncited={},this.refreshes={},this.akeys={},this.oldseq={},this.return_data={},this.ambigcites={},this.ambigresets={},this.sorter=new m.Registry.Comparifier(e,"bibliography_sort"),this.getSortedIds=function(){for(var t=[],n=0,r=this.reflist.length;n<r;n+=1)t.push(""+this.reflist[n].id);return t},this.getSortedRegistryItems=function(){for(var t=[],n=0,r=this.reflist.length;n<r;n+=1)t.push(this.reflist[n]);return t}};m.Registry.prototype.init=function(e,t){var n,r;if(this.oldseq={},t){this.uncited={};for(var n=0,r=e.length;n<r;n+=1)this.myhash[e[n]]||this.mylist.push(""+e[n]),this.uncited[e[n]]=!0,this.myhash[e[n]]=!0}else{for(var i in this.uncited)e.push(i);var s={};for(n=e.length-1;n>-1;n+=-1)s[e[n]]?e=e.slice(0,n).concat(e.slice(n+1)):s[e[n]]=!0;this.mylist=e,this.myhash=s}this.refreshes={},this.touched={},this.ambigsTouched={},this.ambigresets={}};m.Registry.prototype.dopurge=function(e){for(var t=this.mylist.length-1;t>-1;t+=-1)this.citationreg.citationsByItemId&&(!this.citationreg.citationsByItemId||!this.citationreg.citationsByItemId[this.mylist[t]])&&!e[this.mylist[t]]&&(delete this.myhash[this.mylist[t]],delete this.uncited[this.mylist[t]],this.mylist=this.mylist.slice(0,t).concat(this.mylist.slice(t+1)));this.dodeletes(this.myhash)};m.Registry.prototype.dodeletes=function(e){var t,n,r,i,s,a,l,o,p;if(typeof e=="string"){var n=e;e={},e[n]=!0}for(var n in this.registry)if(!e[n]){if(this.uncited[n])continue;t=this.namereg.delitems(n);for(l in t)this.refreshes[l]=!0;for(r=this.registry[n].ambig,o=this.ambigcites[r].indexOf(n),o>-1&&(a=this.ambigcites[r].slice(),this.ambigcites[r]=a.slice(0,o).concat(a.slice(o+1,a.length)),this.ambigresets[r]=this.ambigcites[r].length),s=this.ambigcites[r].length,i=0;i<s;i+=1)p=""+this.ambigcites[r][i],this.refreshes[p]=!0;if(this.registry[n].siblings){if(this.registry[n].siblings.length==1){var f=this.registry[n].siblings[0];this.registry[f].siblings&&(this.registry[f].siblings.pop(),this.registry[f].master=!0)}else if(this.registry[n].siblings.length>1){var g=[n];if(this.registry[n].master){var u=this.registry[n].siblings[0],d=this.registry[u];d.master=!0,g.push(u)}for(var v=[],h=this.registry[n].siblings.length-1;h>-1;h+=-1){var S=this.registry[n].siblings.pop();g.indexOf(S)===-1&&v.push(S)}for(var h=v.length-1;h>-1;h+=-1)this.registry[n].siblings.push(v[h])}}for(var c=this.reflist.length-1;c>-1;c--)this.reflist[c].id===n&&(this.reflist=this.reflist.slice(0,c).concat(this.reflist.slice(c+1)));delete this.registry[n],delete this.refhash[n],this.return_data.bibchange=!0}};m.Registry.prototype.doinserts=function(e){var t,n,r,i,s,a,l;typeof e=="string"&&(e=[e]);for(var a=0,l=e.length;a<l;a+=1)t=e[a],this.registry[t]||(n=this.state.retrieveItem(t),r=m.getAmbiguousCite.call(this.state,n),this.ambigsTouched[r]=!0,n.legislation_id||(this.akeys[r]=!0),i={id:""+t,seq:0,offset:0,sortkeys:!1,ambig:!1,rendered:!1,disambig:!1,ref:n,newItem:!0},this.registry[t]=i,this.citationreg.citationsByItemId&&this.citationreg.citationsByItemId[t]&&(this.registry[t]["first-reference-note-number"]=this.citationreg.citationsByItemId[t][0].properties.noteIndex),s=m.getAmbigConfig.call(this.state),this.registerAmbigToken(r,t,s),this.touched[t]=!0,this.return_data.bibchange=!0)};m.Registry.prototype.rebuildlist=function(e){var t,n,r,i;if(e)for(this.reflist=[],t=this.mylist.length,n=0;n<t;n+=1)r=this.mylist[n],i=this.registry[r],this.reflist.push(i),this.oldseq[r]=this.registry[r].seq,this.registry[r].seq=n+1;else for(this.reflist_inserts=[],t=this.mylist.length,n=0;n<t;n+=1)r=this.mylist[n],i=this.registry[r],i.newItem&&this.reflist_inserts.push(i),this.oldseq[r]=this.registry[r].seq,this.registry[r].seq=n+1};m.Registry.prototype.dorefreshes=function(){var e,t,n,r,i;for(var e in this.refreshes)if(t=this.registry[e],!!t){t.sortkeys=void 0,n=this.state.refetchItem(e);var r=t.ambig;typeof r>"u"&&(this.state.tmp.disambig_settings=!1,r=m.getAmbiguousCite.call(this.state,n),i=m.getAmbigConfig.call(this.state),this.registerAmbigToken(r,e,i));for(var s in this.ambigresets)if(this.ambigresets[s]===1){var a=this.ambigcites[r][0],n=this.state.refetchItem(a);this.registry[a].disambig=new m.AmbigConfig,this.state.tmp.disambig_settings=!1;var r=m.getAmbiguousCite.call(this.state,n),i=m.getAmbigConfig.call(this.state);this.registerAmbigToken(r,a,i)}this.state.tmp.taintedItemIDs[e]=!0,this.ambigsTouched[r]=!0,n.legislation_id||(this.akeys[r]=!0),this.touched[e]=!0}};m.Registry.prototype.setdisambigs=function(){for(var e in this.ambigsTouched)this.state.disambiguate.run(e);this.ambigsTouched={},this.akeys={}};m.Registry.prototype.renumber=function(){var e,t,n;for(this.state.bibliography_sort.opt.citation_number_sort_direction===m.DESCENDING&&(this.state.bibliography_sort.tmp.citation_number_map={}),e=this.reflist.length,t=0;t<e;t+=1)n=this.reflist[t],n.seq=t+1,this.state.bibliography_sort.opt.citation_number_sort_direction===m.DESCENDING&&(this.state.bibliography_sort.tmp.citation_number_map[n.seq]=this.reflist.length-n.seq+1),this.state.opt.update_mode===m.NUMERIC&&n.seq!=this.oldseq[n.id]&&(this.state.tmp.taintedItemIDs[n.id]=!0),n.seq!=this.oldseq[n.id]&&(this.return_data.bibchange=!0)};m.Registry.prototype.setsortkeys=function(){for(var e,t=0,n=this.mylist.length;t<n;t+=1){var e=this.mylist[t];(this.touched[e]||this.state.tmp.taintedItemIDs[e]||!this.registry[e].sortkeys)&&(this.registry[e].sortkeys=m.getSortKeys.call(this.state,this.state.retrieveItem(e),"bibliography_sort"))}};m.Registry.prototype._insertItem=function(e,t){return t.splice(this._locationOf(e,t)+1,0,e),t};m.Registry.prototype._locationOf=function(e,t,n,r){if(t.length===0)return-1;n=n||0,r=r||t.length;var i=n+r>>1,s=this.sorter.compareKeys(e,t[i]);if(r-n<=1)return s==-1?i-1:i;switch(s){case-1:return this._locationOf(e,t,n,i);case 0:return i;case 1:return this._locationOf(e,t,i,r)}};m.Registry.prototype.sorttokens=function(e){var t,n,r,i;if(!e){for(this.reflist_inserts=[],t=this.mylist.length,i=0;i<t;i+=1)n=this.mylist[i],r=this.registry[n],r.newItem&&this.reflist_inserts.push(r);for(var s in this.state.tmp.taintedItemIDs)if(this.registry[s]&&!this.registry[s].newItem)for(var a=this.reflist.length-1;a>-1;a--)this.reflist[a].id===s&&(this.reflist_inserts.push(this.reflist[a]),this.reflist=this.reflist.slice(0,a).concat(this.reflist.slice(a+1)));for(var a=0,l=this.reflist_inserts.length;a<l;a++){var r=this.reflist_inserts[a];delete r.newItem,this.reflist=this._insertItem(r,this.reflist)}for(i=0;i<t;i+=1)n=this.mylist[i],r=this.registry[n],this.registry[n].seq=i+1}};m.Registry.Comparifier=function(e,t){var n,r,i,s,a=m.getSortCompare.call(e,e.opt["default-locale-sort"]);n=e[t].opt.sort_directions,this.compareKeys=function(l,o){for(r=l.sortkeys?l.sortkeys.length:0,i=0;i<r;i+=1){var p=0;if(l.sortkeys[i]===o.sortkeys[i]?p=0:typeof l.sortkeys[i]>"u"?p=n[i][1]:typeof o.sortkeys[i]>"u"?p=n[i][0]:p=a(l.sortkeys[i],o.sortkeys[i]),0<p)return n[i][1];if(0>p)return n[i][0]}return l.seq>o.seq?1:l.seq<o.seq?-1:0},s=this.compareKeys,this.compareCompositeKeys=function(l,o){return s(l[1],o[1])}};m.Registry.prototype.compareRegistryTokens=function(e,t){return e.seq>t.seq?1:e.seq<t.seq?-1:0};m.Registry.prototype.registerAmbigToken=function(e,t,n){if(this.registry[t]||m.debug("Warning: unregistered item: itemID=("+t+"), akey=("+e+")"),this.registry[t]&&this.registry[t].disambig&&this.registry[t].disambig.names)for(var r=0,i=n.names.length;r<i;r+=1){var s=n.names[r],a=this.registry[t].disambig.names[r];if(s!==a)this.state.tmp.taintedItemIDs[t]=!0;else if(n.givens[r])for(var l=0,o=n.givens[r].length;l<o;l+=1){var p=n.givens[r][l],f=this.registry[t].disambig.givens[r][l];p!==f&&(this.state.tmp.taintedItemIDs[t]=!0)}}this.ambigcites[e]||(this.ambigcites[e]=[]),this.ambigcites[e].indexOf(""+t)===-1&&this.ambigcites[e].push(""+t),this.registry[t].ambig=e,this.registry[t].disambig=m.cloneAmbigConfig(n)};m.getSortKeys=function(e,t){var n,r,i,s,a,l;for(n=this.tmp.area,r=this.tmp.root,i=this.tmp.extension,s=m.Util.Sort.strip_prepositions,this.tmp.area=t,this.tmp.root=t.indexOf("_")>-1?t.slice(0,-5):t,this.tmp.extension="_sort",this.tmp.disambig_override=!0,this.tmp.disambig_request=!1,this.tmp.suppress_decorations=!0,m.getCite.call(this,e),this.tmp.suppress_decorations=!1,this.tmp.disambig_override=!1,a=this[t].keys.length,l=0;l<a;l+=1)this[t].keys[l]=s(this[t].keys[l]);return this.tmp.area=n,this.tmp.root=r,this.tmp.extension=i,this[t].keys};m.Registry.NameReg=function(e){var t,n,r,i,s,a,l,o,p,f,g,u;this.state=e,this.namereg={},this.nameind={},this.nameindpkeys={},this.itemkeyreg={},l=function(d){return d||(d=""),d.replace(/\./g," ").replace(/\s+/g," ").replace(/\s+$/,"")},o=function(d,v,h){t=l(h.family),d.opt["demote-non-dropping-particle"]==="never"&&h["non-dropping-particle"]&&h.family&&(t=`${t} ${h["non-dropping-particle"]}`),r=l(h.given);var S=r.match(/[,\!]* ([^,]+)$/);S&&S[1]===S[1].toLowerCase()&&(r=r.replace(/[,\!]* [^,]+$/,"")),n=m.Util.Names.initializeWith(d,r,"%s"),d.citation.opt["givenname-disambiguation-rule"]==="by-cite"&&(t=""+v+t)},p=function(d,v,h,S,c,_){var y;if(e.tmp.area.slice(0,12)==="bibliography"&&!c)return typeof _=="string"?1:2;var b=e.nameOutput.getName(v,"locale-translit",!0);v=b.name,o(this.state,""+d,v),y=2,i=e.opt["disambiguate-add-givenname"],s=e.citation.opt["givenname-disambiguation-rule"];var T=s;if(s==="by-cite"&&(s="all-names"),c==="short"?y=0:typeof _=="string"&&(y=1),typeof this.namereg[t]>"u"||typeof this.namereg[t].ikey[n]>"u")return y;if(T==="by-cite"&&y<=S)return S;if(!i||typeof s=="string"&&s.slice(0,12)==="primary-name"&&h>0||(!s||s==="all-names"||s==="primary-name"?(this.namereg[t].count>1&&(y=1),(this.namereg[t].ikey&&this.namereg[t].ikey[n].count>1||this.namereg[t].count>1&&typeof _!="string")&&(y=2)):(s==="all-names-with-initials"||s==="primary-name-with-initials")&&(this.namereg[t].count>1?y=1:y=0),e.registry.registry[d]))return y;if(c=="short")return 0;if(typeof _=="string")return 1},f=function(d){var v,h,S,c,_;(typeof d=="string"||typeof d=="number")&&(d=[""+d]);var y={};for(h=d.length,v=0;v<h;v+=1)if(c=""+d[v],!!this.nameind[c]){for(_ in this.nameind[c])if(this.nameind[c].hasOwnProperty(_)){var b=_.split("::");if(t=b[0],n=b[1],r=b[2],typeof this.namereg[t]>"u")continue;if(a=this.namereg[t].items,r&&this.namereg[t].ikey[n]&&this.namereg[t].ikey[n].skey[r]&&(u=this.namereg[t].ikey[n].skey[r].items,S=u.indexOf(""+c),S>-1&&(this.namereg[t].ikey[n].skey[r].items=u.slice(0,S).concat(u.slice([S+1]))),this.namereg[t].ikey[n].skey[r].items.length===0&&(delete this.namereg[t].ikey[n].skey[r],this.namereg[t].ikey[n].count+=-1,this.namereg[t].ikey[n].count<2)))for(var T=0,O=this.namereg[t].ikey[n].items.length;T<O;T+=1)e.tmp.taintedItemIDs[this.namereg[t].ikey[n].items[T]]=!0;if(n&&this.namereg[t].ikey[n]&&(S=this.namereg[t].ikey[n].items.indexOf(""+c),S>-1&&(a=this.namereg[t].ikey[n].items.slice(),this.namereg[t].ikey[n].items=a.slice(0,S).concat(a.slice([S+1]))),this.namereg[t].ikey[n].items.length===0&&(delete this.namereg[t].ikey[n],this.namereg[t].count+=-1,this.namereg[t].count<2)))for(var T=0,O=this.namereg[t].items.length;T<O;T+=1)e.tmp.taintedItemIDs[this.namereg[t].items[T]]=!0;t&&(S=this.namereg[t].items.indexOf(""+c),S>-1&&(a=this.namereg[t].items.slice(),this.namereg[t].items=a.slice(0,S).concat(a.slice([S+1],a.length))),this.namereg[t].items.length<2&&delete this.namereg[t]),delete this.nameind[c][_]}delete this.nameind[c],delete this.nameindpkeys[c]}return y},g=function(d,v,h){var S,c,_=e.nameOutput.getName(v,"locale-translit",!0);if(v=_.name,!(e.citation.opt["givenname-disambiguation-rule"]&&e.citation.opt["givenname-disambiguation-rule"].slice(0,8)==="primary-"&&h!==0)){if(o(this.state,""+d,v),t&&(typeof this.namereg[t]>"u"?(this.namereg[t]={},this.namereg[t].count=0,this.namereg[t].ikey={},this.namereg[t].items=[d]):this.namereg[t].items.indexOf(d)===-1&&this.namereg[t].items.push(d)),t&&n)if(typeof this.namereg[t].ikey[n]>"u"){if(this.namereg[t].ikey[n]={},this.namereg[t].ikey[n].count=0,this.namereg[t].ikey[n].skey={},this.namereg[t].ikey[n].items=[d],this.namereg[t].count+=1,this.namereg[t].count===2)for(var S=0,c=this.namereg[t].items.length;S<c;S+=1)e.tmp.taintedItemIDs[this.namereg[t].items[S]]=!0}else this.namereg[t].ikey[n].items.indexOf(d)===-1&&this.namereg[t].ikey[n].items.push(d);if(t&&n&&r)if(typeof this.namereg[t].ikey[n].skey[r]>"u"){if(this.namereg[t].ikey[n].skey[r]={},this.namereg[t].ikey[n].skey[r].items=[d],this.namereg[t].ikey[n].count+=1,this.namereg[t].ikey[n].count===2)for(var S=0,c=this.namereg[t].ikey[n].items.length;S<c;S+=1)e.tmp.taintedItemIDs[this.namereg[t].ikey[n].items[S]]=!0}else this.namereg[t].ikey[n].skey[r].items.indexOf(d)===-1&&this.namereg[t].ikey[n].skey[r].items.push(d);typeof this.nameind[d]>"u"&&(this.nameind[d]={},this.nameindpkeys[d]={}),t&&(this.nameind[d][t+"::"+n+"::"+r]=!0,this.nameindpkeys[d][t]=this.namereg[t])}},this.addname=g,this.delitems=f,this.evalname=p};m.Registry.CitationReg=function(){this.citationById={},this.citationByIndex=[]};m.Disambiguation=function(e){this.state=e,this.sys=this.state.sys,this.registry=e.registry.registry,this.ambigcites=e.registry.ambigcites,this.configModes(),this.debug=!1};m.Disambiguation.prototype.run=function(e){this.modes.length&&(this.debug&&this.state.sys.print("[A] === RUN ==="),this.akey=e,this.initVars(e)&&this.runDisambig())};m.Disambiguation.prototype.runDisambig=function(){var e;for(this.debug&&this.state.sys.print("[C] === runDisambig() ==="),this.initGivens=!0;this.lists.length;){for(this.gnameset=0,this.gname=0,this.clashes=[1,0];this.lists[0][1].length;)this.listpos=0,this.base||(this.base=this.lists[0][0]),e=this.incrementDisambig(),this.scanItems(this.lists[0]),this.evalScan(e);this.lists=this.lists.slice(1)}};m.Disambiguation.prototype.scanItems=function(e){var t,n,r;this.debug&&this.state.sys.print("[2] === scanItems() ==="),this.Item=e[1][0],this.ItemCite=m.getAmbiguousCite.call(this.state,this.Item,this.base,!0),this.scanlist=e[1],this.partners=[],this.partners.push(this.Item),this.nonpartners=[];for(var i=0,t=1,n=e[1].length;t<n;t+=1){r=e[1][t];var s=m.getAmbiguousCite.call(this.state,r,this.base,!0);this.debug&&t>1&&this.state.sys.print("  -----------"),this.ItemCite===s?(this.debug&&(this.state.sys.print("  [CLASH]--> "+this.Item.id+": "+this.ItemCite),this.state.sys.print("             "+r.id+": "+s)),i+=1,this.partners.push(r)):(this.debug&&(this.state.sys.print("  [clear]--> "+this.Item.id+": "+this.ItemCite),this.state.sys.print("             "+r.id+": "+s)),this.nonpartners.push(r))}this.clashes[0]=this.clashes[1],this.clashes[1]=i};m.Disambiguation.prototype.evalScan=function(e){this[this.modes[this.modeindex]](e),e&&(this.modeindex<this.modes.length-1?this.modeindex+=1:this.lists[this.listpos+1]=[this.base,[]])};m.Disambiguation.prototype.disNames=function(e){var t,n;if(this.debug&&this.state.sys.print("[3] == disNames() =="),this.clashes[1]===0&&this.nonpartners.length===1)this.captureStepToBase(),this.debug&&(this.state.sys.print("  ** RESOLUTION [a]: lone partner, one nonpartner"),this.state.sys.print("  registering "+this.partners[0].id+" and "+this.nonpartners[0].id)),this.state.registry.registerAmbigToken(this.akey,""+this.nonpartners[0].id,this.betterbase),this.state.registry.registerAmbigToken(this.akey,""+this.partners[0].id,this.betterbase),this.lists[this.listpos]=[this.betterbase,[]];else if(this.clashes[1]===0)this.captureStepToBase(),this.debug&&(this.state.sys.print("  ** RESOLUTION [b]: lone partner, unknown number of remaining nonpartners"),this.state.sys.print("  registering "+this.partners[0].id)),this.state.registry.registerAmbigToken(this.akey,""+this.partners[0].id,this.betterbase),this.lists[this.listpos]=[this.betterbase,this.nonpartners],this.nonpartners.length&&(this.initGivens=!0);else if(this.nonpartners.length===1)this.captureStepToBase(),this.debug&&(this.state.sys.print("  ** RESOLUTION [c]: lone nonpartner, unknown number of partners remaining"),this.state.sys.print("  registering "+this.nonpartners[0].id)),this.state.registry.registerAmbigToken(this.akey,""+this.nonpartners[0].id,this.betterbase),this.lists[this.listpos]=[this.betterbase,this.partners];else if(this.clashes[1]<this.clashes[0])this.captureStepToBase(),this.debug&&this.state.sys.print("  ** RESOLUTION [d]: better result, but no entries safe to register"),this.lists[this.listpos]=[this.betterbase,this.partners],this.lists.push([this.betterbase,this.nonpartners]);else if(this.debug&&this.state.sys.print("  ** RESOLUTION [e]: no improvement, and clashes remain"),e&&(this.lists[this.listpos]=[this.betterbase,this.nonpartners],this.lists.push([this.betterbase,this.partners]),this.modeindex===this.modes.length-1)){this.debug&&this.state.sys.print("     (registering clashing entries because we've run out of options)");for(var t=0,n=this.partners.length;t<n;t+=1)this.state.registry.registerAmbigToken(this.akey,""+this.partners[t].id,this.betterbase);this.lists[this.listpos]=[this.betterbase,[]]}};m.Disambiguation.prototype.disExtraText=function(){this.debug&&this.state.sys.print("[3] === disExtraText ==");var e=!1;if(this.clashes[1]===0&&this.nonpartners.length<2&&(e=!0),!e&&(!this.base.disambiguate||this.state.tmp.disambiguate_count!==this.state.tmp.disambiguate_maxMax))if(this.modeindex=0,this.base.disambiguate=this.state.tmp.disambiguate_count,this.betterbase.disambiguate=this.state.tmp.disambiguate_count,this.base.disambiguate)this.disNames();else{this.initGivens=!0,this.base.disambiguate=1;for(var t=0,n=this.lists[this.listpos][1].length;t<n;t+=1)this.state.tmp.taintedItemIDs[this.lists[this.listpos][1][t].id]=!0}else if(e||this.state.tmp.disambiguate_count===this.state.tmp.disambiguate_maxMax)if(e||this.modeindex===this.modes.length-1){for(var r=this.lists[this.listpos][0],t=0,n=this.lists[this.listpos][1].length;t<n;t+=1)this.state.tmp.taintedItemIDs[this.lists[this.listpos][1][t].id]=!0,this.state.registry.registerAmbigToken(this.akey,""+this.lists[this.listpos][1][t].id,r);this.lists[this.listpos]=[this.betterbase,[]]}else{this.modeindex=this.modes.length-1;var r=this.lists[this.listpos][0];r.disambiguate=!0;for(var t=0,n=this.lists[this.listpos][1].length;t<n;t+=1)this.state.tmp.taintedItemIDs[this.lists[this.listpos][1][t].id]=!0,this.state.registry.registerAmbigToken(this.akey,""+this.lists[this.listpos][1][t].id,r)}};m.Disambiguation.prototype.disYears=function(){var e,t,n,r;this.debug&&this.state.sys.print("[3] === disYears =="),n=[];var i=this.lists[this.listpos][0];if(this.clashes[1])for(var s=0,a=this.state.registry.mylist.length;s<a;s+=1)for(var l=this.state.registry.mylist[s],o=0,p=this.lists[this.listpos][1].length;o<p;o+=1){var r=this.lists[this.listpos][1][o];if(r.id==l){n.push(this.registry[r.id]);break}}n.sort(this.state.registry.sorter.compareKeys);for(var e=0,t=n.length;e<t;e+=1){i.year_suffix=""+e;var f=this.state.registry.registry[n[e].id].disambig;this.state.registry.registerAmbigToken(this.akey,""+n[e].id,i),m.ambigConfigDiff(f,i)&&(this.state.tmp.taintedItemIDs[n[e].id]=!0)}this.lists[this.listpos]=[this.betterbase,[]]};m.Disambiguation.prototype.incrementDisambig=function(){if(this.debug&&this.state.sys.print(`
[1] === incrementDisambig() ===`),this.initGivens)return this.initGivens=!1,!1;var e=!1,t=!0;if(this.modes[this.modeindex]==="disNames"){t=!1,typeof this.givensMax!="number"&&(t=!0);var n=!1;typeof this.namesMax!="number"&&(n=!0),typeof this.givensMax=="number"&&(this.base.givens.length&&this.base.givens[this.gnameset][this.gname]<this.givensMax?this.base.givens[this.gnameset][this.gname]+=1:t=!0),typeof this.namesMax=="number"&&t&&(this.state.opt["disambiguate-add-names"]?(n=!1,this.gname<this.namesMax?(this.base.names[this.gnameset]+=1,this.gname+=1):n=!0):n=!0),typeof this.namesetsMax=="number"&&n&&this.gnameset<this.namesetsMax&&(this.gnameset+=1,this.base.names[this.gnameset]=1,this.gname=0),this.debug&&(this.state.sys.print("    ------------------"),this.state.sys.print("    incremented values"),this.state.sys.print("    ------------------"),this.state.sys.print("    | gnameset: "+this.gnameset),this.state.sys.print("    | gname: "+this.gname),this.state.sys.print("    | names value: "+this.base.names[this.gnameset]),this.base.givens.length?this.state.sys.print("    | givens value: "+this.base.givens[this.gnameset][this.gname]):this.state.sys.print("    | givens value: nil"),this.state.sys.print("    | namesetsMax: "+this.namesetsMax),this.state.sys.print("    | namesMax: "+this.namesMax),this.state.sys.print("    | givensMax: "+this.givensMax)),(typeof this.namesetsMax!="number"||this.namesetsMax===-1||this.gnameset===this.namesetsMax)&&(!this.state.opt["disambiguate-add-names"]||typeof this.namesMax!="number"||this.gname===this.namesMax)&&(typeof this.givensMax!="number"||typeof this.base.givens[this.gnameset]>"u"||typeof this.base.givens[this.gnameset][this.gname]>"u"||this.base.givens[this.gnameset][this.gname]===this.givensMax)&&(e=!0,this.debug&&this.state.sys.print("    MAXED"))}else this.modes[this.modeindex]==="disExtraText"&&(this.base.disambiguate+=1,this.betterbase.disambiguate+=1);return e};m.Disambiguation.prototype.initVars=function(e){var t,n,r,i,s;if(this.debug&&this.state.sys.print("[B] === initVars() ==="),this.lists=[],this.base=!1,this.betterbase=!1,this.akey=e,this.maxNamesByItemId={},i=[],r=this.ambigcites[e],!r||!r.length)return!1;var a=this.state.refetchItem(""+r[0]);if(this.getCiteData(a),this.base=m.getAmbigConfig.call(this.state),r&&r.length>1){i.push([this.maxNamesByItemId[a.id],a]);for(var t=1,n=r.length;t<n;t+=1)a=this.state.refetchItem(""+r[t]),this.getCiteData(a,this.base),i.push([this.maxNamesByItemId[a.id],a]);i.sort(function(o,p){return o[0]>p[0]?1:o[0]<p[0]?-1:o[1].id>p[1].id?1:o[1].id<p[1].id?-1:0}),s=[];for(var t=0,n=i.length;t<n;t+=1)s.push(i[t][1]);this.lists.push([this.base,s]),this.Item=this.lists[0][1][0]}else this.Item=this.state.refetchItem(""+r[0]);if(this.modeindex=0,this.state.citation.opt["disambiguate-add-names"]||!0)this.namesMax=this.maxNamesByItemId[this.Item.id][0];else{var l;for(var t,n;t<n;t+=1);}return this.padBase(this.base),this.padBase(this.betterbase),this.base.year_suffix=!1,this.base.disambiguate=!1,this.betterbase.year_suffix=!1,this.betterbase.disambiguate=!1,this.state.citation.opt["givenname-disambiguation-rule"]==="by-cite"&&this.state.opt["disambiguate-add-givenname"]&&(this.givensMax=2),!0};m.Disambiguation.prototype.padBase=function(e){for(var t=0,n=e.names.length;t<n;t+=1){e.givens[t]||(e.givens[t]=[]);for(var r=0,i=e.names[t];r<i;r+=1)e.givens[t][r]||(e.givens[t][r]=0)}};m.Disambiguation.prototype.configModes=function(){var e,t;this.modes=[],e=this.state.opt["disambiguate-add-givenname"],t=this.state.citation.opt["givenname-disambiguation-rule"],(this.state.opt["disambiguate-add-names"]||e&&t==="by-cite")&&this.modes.push("disNames"),this.state.opt.development_extensions.prioritize_disambiguate_condition?(this.state.opt.has_disambiguate&&this.modes.push("disExtraText"),this.state.opt["disambiguate-add-year-suffix"]&&this.modes.push("disYears")):(this.state.opt["disambiguate-add-year-suffix"]&&this.modes.push("disYears"),this.state.opt.has_disambiguate&&this.modes.push("disExtraText"))};m.Disambiguation.prototype.getCiteData=function(e,t){if(!this.maxNamesByItemId[e.id]){m.getAmbiguousCite.call(this.state,e,t),t=m.getAmbigConfig.call(this.state),this.maxNamesByItemId[e.id]=m.getMaxVals.call(this.state),this.state.registry.registry[e.id].disambig.givens=this.state.tmp.disambig_settings.givens.slice();for(var n=0,r=this.state.registry.registry[e.id].disambig.givens.length;n<r;n+=1)this.state.registry.registry[e.id].disambig.givens[n]=this.state.tmp.disambig_settings.givens[n].slice();this.namesetsMax=this.state.registry.registry[e.id].disambig.names.length-1,this.base||(this.base=t,this.betterbase=m.cloneAmbigConfig(t)),t.names.length<this.base.names.length&&(this.base=t);for(var n=0,r=t.names.length;n<r;n+=1)t.names[n]>this.base.names[n]&&(this.base.givens[n]=t.givens[n].slice(),this.base.names[n]=t.names[n],this.betterbase.names=this.base.names.slice(),this.betterbase.givens=this.base.givens.slice(),this.padBase(this.base),this.padBase(this.betterbase));this.betterbase.givens=this.base.givens.slice();for(var i=0,s=this.base.givens.length;i<s;i+=1)this.betterbase.givens[i]=this.base.givens[i].slice()}};m.Disambiguation.prototype.captureStepToBase=function(){this.state.citation.opt["givenname-disambiguation-rule"]==="by-cite"&&this.base.givens&&this.base.givens.length&&typeof this.base.givens[this.gnameset][this.gname]<"u"&&(this.betterbase.givens.length<this.base.givens.length&&(this.betterbase.givens=JSON.parse(JSON.stringify(this.base.givens))),this.betterbase.givens[this.gnameset][this.gname]=this.base.givens[this.gnameset][this.gname]),this.betterbase.names[this.gnameset]=this.base.names[this.gnameset]};m.Engine.prototype.getJurisdictionList=function(e){for(var t=[],n=e.split(":"),r=n.length;r>0;r--){var i=n.slice(0,r).join(":");if(t.push(i),this.opt.jurisdiction_fallbacks[i]){var s=this.opt.jurisdiction_fallbacks[i];t.push(s)}}return t.indexOf("us")===-1&&t.push("us"),t};m.Engine.prototype.loadStyleModule=function(e,t,n){var r=null,i=0;this.juris[e]={};var s=m.setupXml(t);s.addMissingNameNodes(s.dataObj),s.addInstitutionNodes(s.dataObj),s.insertPublisherAndPlace(s.dataObj),s.flagDateMacros(s.dataObj);for(var u=s.getNodesByName(s.dataObj,"law-module"),a=0,l=u.length;a<l;a++){var o=s.getAttributeValue(u[a],"types");if(o){this.juris[e].types={},o=o.split(/\s+/);for(var p=0,f=o.length;p<f;p++)this.juris[e].types[o[p]]=!0}n||(r=s.getAttributeValue(u[a],"fallback"),r&&e!=="us"&&(this.opt.jurisdiction_fallbacks[e]=r))}var g=this.opt.lang?this.opt.lang:this.opt["default-locale"][0];m.SET_COURT_CLASSES(this,g,s,s.dataObj),this.juris[e].types||(this.juris[e].types=m.MODULE_TYPES);for(var u=s.getNodesByName(s.dataObj,"macro"),a=0,l=u.length;a<l;a++){var d=s.getAttributeValue(u[a],"name");if(!m.MODULE_MACROS[d]){m.debug('CSL: skipping non-modular macro name "'+d+'" in module context');continue}i++,this.juris[e][d]=[],this.buildTokenLists(u[a],this.juris[e][d]),this.configureTokenList(this.juris[e][d])}return r};m.Engine.prototype.retrieveAllStyleModules=function(e){var t={},n=this.locale[this.opt.lang].opts["jurisdiction-preference"];n=n||[],n=[""].concat(n);for(var r=n.length-1;r>-1;r--)for(var i=n[r],s=0,a=e.length;s<a;s++){var l=e[s];if(!this.opt.jurisdictions_seen[l]){var o=this.sys.retrieveStyleModule(l,i);(!o&&!i||o)&&(this.opt.jurisdictions_seen[l]=!0),o&&(t[l]=o)}}return t};m.ParticleList=function(){var e=[[[0,1],null]],t=[[[0,3],null]],n=[[null,[0,1]]],r=[[null,[0,2]]],i=[[null,[0,3]]],s=[[null,[0,1]],[[0,1],null]],a=[[null,[0,2]],[[0,2],null]],l=[[[0,1],null],[null,[0,1]]],o=[[[0,2],null],[null,[0,2]]],p=[[[0,3],null],[null,[0,3]]],f=[[null,[0,2]],[[0,1],[1,2]]],g=[["'s",n],["'s-",n],["'t",n],["a",n],["aan 't",r],["aan de",r],["aan den",r],["aan der",r],["aan het",r],["aan t",r],["aan",n],["ad-",s],["adh-",s],["af",s],["al",s],["al-",s],["am de",r],["am",n],["an-",s],["ar-",s],["as-",s],["ash-",s],["at-",s],["ath-",s],["auf dem",o],["auf den",o],["auf der",o],["auf ter",r],["auf",l],["aus 'm",o],["aus dem",o],["aus den",o],["aus der",o],["aus m",o],["aus",l],["aus'm",o],["az-",s],["a\u0161-",s],["a\u1E0D-",s],["a\u1E0F-",s],["a\u1E63-",s],["a\u1E6D-",s],["a\u1E6F-",s],["a\u1E93-",s],["ben",n],["bij 't",r],["bij de",r],["bij den",r],["bij het",r],["bij t",r],["bij",n],["bin",n],["boven d",r],["boven d'",r],["d",n],["d'",s],["da",s],["dal",n],["dal'",n],["dall'",n],["dalla",n],["das",s],["de die le",i],["de die",r],["de l",r],["de l'",r],["de la",f],["de las",f],["de le",r],["de li",a],["de van der",i],["de",s],["de'",s],["deca",n],["degli",s],["dei",s],["del",s],["dela",e],["dell'",s],["della",s],["delle",s],["dello",s],["den",s],["der",s],["des",s],["di",s],["die le",r],["do",n],["don",n],["dos",s],["du",s],["ed-",s],["edh-",s],["el",s],["el-",s],["en-",s],["er-",s],["es-",s],["esh-",s],["et-",s],["eth-",s],["ez-",s],["e\u0161-",s],["e\u1E0D-",s],["e\u1E0F-",s],["e\u1E63-",s],["e\u1E6D-",s],["e\u1E6F-",s],["e\u1E93-",s],["het",n],["i",n],["il",e],["im",n],["in 't",r],["in de",r],["in den",r],["in der",a],["in het",r],["in t",r],["in",n],["l",n],["l'",n],["la",n],["las",n],["le",n],["les",s],["lo",s],["los",n],["lou",n],["of",n],["onder 't",r],["onder de",r],["onder den",r],["onder het",r],["onder t",r],["onder",n],["op 't",r],["op de",a],["op den",r],["op der",r],["op gen",r],["op het",r],["op t",r],["op ten",r],["op",n],["over 't",r],["over de",r],["over den",r],["over het",r],["over t",r],["over",n],["s",n],["s'",n],["sen",e],["t",n],["te",n],["ten",n],["ter",n],["tho",n],["thoe",n],["thor",n],["to",n],["toe",n],["tot",n],["uijt 't",r],["uijt de",r],["uijt den",r],["uijt te de",i],["uijt ten",r],["uijt",n],["uit 't",r],["uit de",r],["uit den",r],["uit het",r],["uit t",r],["uit te de",i],["uit ten",r],["uit",n],["unter",n],["v",n],["v.",n],["v.d.",n],["van 't",r],["van de l",i],["van de l'",i],["van de",r],["van de",r],["van den",r],["van der",r],["van gen",r],["van het",r],["van la",r],["van t",r],["van ter",r],["van van de",i],["van",s],["vander",n],["vd",n],["ver",n],["vom und zum",t],["vom",s],["von 't",r],["von dem",o],["von den",o],["von der",o],["von t",r],["von und zu",p],["von zu",o],["von",l],["voor 't",r],["voor de",r],["voor den",r],["voor in 't",i],["voor in t",i],["voor",n],["vor der",o],["vor",l],["z",e],["ze",e],["zu",l],["zum",s],["zur",s]];return g}();m.parseParticles=function(){function e(r,i,s){var a=r;r=s?r.toLowerCase():r;var l=[],o,p;i?(r=r.split("").reverse().join(""),o=m.PARTICLE_GIVEN_REGEXP):o=m.PARTICLE_FAMILY_REGEXP;for(var f=r.match(o);f;){var g=i?f[1].split("").reverse().join(""):f[1],u=f?g:!1,u=u?g.replace(/^[-\'\u02bb\u2019\s]*(.).*$/,"$1"):!1;if(p=u?u.toUpperCase()!==u:!1,!p)break;i?(l.push(a.slice(g.length*-1)),a=a.slice(0,g.length*-1)):(l.push(a.slice(0,g.length)),a=a.slice(g.length)),r=f[2],f=r.match(o)}if(i){r=r.split("").reverse().join(""),l.reverse();for(var d=1,v=l.length;d<v;d++)l[d].slice(0,1)==" "&&(l[d-1]+=" ");for(var d=0,v=l.length;d<v;d++)l[d].slice(0,1)==" "&&(l[d]=l[d].slice(1));r=a.slice(0,r.length)}else r=a.slice(r.length*-1);return[p,r,l]}function t(r){var i=r.slice(-1);return r=r.trim(),i===" "&&["'","\u2019"].indexOf(r.slice(-1))>-1&&(r+=" "),r}function n(r){if(!r.suffix&&r.given){var i=r.given.match(/(\s*,!*\s*)/);if(i){var s=r.given.indexOf(i[1]),a=r.given.slice(s+i[1].length),l=r.given.slice(s,s+i[1].length).replace(/\s*/g,"");a.replace(/\./g,"")==="et al"&&!r["dropping-particle"]?(r["dropping-particle"]=a,r["comma-dropping-particle"]=","):(l.length===2&&(r["comma-suffix"]=!0),r.suffix=a),r.given=r.given.slice(0,s)}}}return function(r){var l=e(r.family),i=l[1],s=l[2];r.family=i;var a=t(s.join(""));a&&(r["non-dropping-particle"]=a),n(r);var l=e(r.given,!0),o=l[1],p=l[2];r.given=o;var f=p.join("").trim();f&&(r["dropping-particle"]=f)}}();Me.exports=m});var De=Ie(require("node:fs"));var Ce=Ie(we(),1);function Fe(e,t){let n=new Map(e.references.map(l=>[String(l.id),l])),r=new Ce.default.Engine({retrieveLocale(l){let o=l.replace(/_/g,"-");return t[o]||t[Object.keys(t).find(p=>p.split("-")[0]===o.split("-")[0])]||t["en-US"]},retrieveItem(l){if(!n.has(String(l)))throw Error(`Missing CSL record: ${l}`);return n.get(String(l))}},e.style,e.language||"en-US");r.setOutputFormat("html");let i=[],s=[];for(let[l,o]of e.clusters.entries()){let p={citationID:`md-word-${l}`,citationItems:o,properties:{noteIndex:0}},[,f]=r.processCitationCluster(p,i,[]);for(let[g,u]of f)s[g]=u;i.push([p.citationID,0])}let a=r.makeBibliography();if(s.length!==e.clusters.length||s.some(l=>!l))throw Error("Incomplete CSL citations");if(!a||!a[1].length)throw Error("The selected CSL has no bibliography");return{citations:s,bibliography:a[1]}}var Ye={"af-ZA":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="af-ZA">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="/"/>
  </date>
  <terms>
    <term name="accessed">toegang verkry</term>
    <term name="and">en</term>
    <term name="and others">and others</term>
    <term name="anonymous">anonymous</term>
    <term name="anonymous" form="short">anon</term>
    <term name="at">at</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>edition</single>
      <multiple>editions</multiple>
    </term>
    <term name="edition" form="short">ed</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">voorhande</term>
    <term name="from">van</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">n.d.</term>
    <term name="online">online</term>
    <term name="presented at">presented at the</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">opgehaal</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">first</term>
    <term name="long-ordinal-02">second</term>
    <term name="long-ordinal-03">third</term>
    <term name="long-ordinal-04">fourth</term>
    <term name="long-ordinal-05">fifth</term>
    <term name="long-ordinal-06">sixth</term>
    <term name="long-ordinal-07">seventh</term>
    <term name="long-ordinal-08">eighth</term>
    <term name="long-ordinal-09">ninth</term>
    <term name="long-ordinal-10">tenth</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>book</single>
      <multiple>books</multiple>
    </term>
    <term name="chapter">
      <single>chapter</single>
      <multiple>chapters</multiple>
    </term>
    <term name="column">
      <single>column</single>
      <multiple>columns</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>number</single>
      <multiple>numbers</multiple>
    </term>
    <term name="line">
      <single>re\xEBl</single>
      <multiple>re\xEBls</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>bladsy</single>
      <multiple>bladsye</multiple>
    </term>
    <term name="number-of-pages">
      <single>bladsy</single>
      <multiple>bladsye</multiple>
    </term>
    <term name="paragraph">
      <single>paragraaf</single>
      <multiple>paragrawe</multiple>
    </term>
    <term name="part">
      <single>part</single>
      <multiple>parts</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk</term>
    <term name="chapter" form="short">chap</term>
    <term name="column" form="short">col</term>
    <term name="figure" form="short">fig</term>
    <term name="folio" form="short">f</term>
    <term name="issue" form="short">no</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op</term>
    <term name="page" form="short">
      <single>bl</single>
      <multiple>bll</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>bl</single>
      <multiple>bll</multiple>
    </term>
    <term name="paragraph" form="short">para</term>
    <term name="part" form="short">pt</term>
    <term name="section" form="short">sec</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v</single>
      <multiple>vv</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol</single>
      <multiple>vols</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>redakteur</single>
      <multiple>redakteurs</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>vertaler</single>
      <multiple>vertalers</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>red</single>
      <multiple>reds</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>vert</single>
      <multiple>verts</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">onder redaksie van</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">vertaal deur</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">red</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">verts</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Januarie</term>
    <term name="month-02">Februarie</term>
    <term name="month-03">Maart</term>
    <term name="month-04">April</term>
    <term name="month-05">Mei</term>
    <term name="month-06">Junie</term>
    <term name="month-07">Julie</term>
    <term name="month-08">Augustus</term>
    <term name="month-09">September</term>
    <term name="month-10">Oktober</term>
    <term name="month-11">November</term>
    <term name="month-12">Desember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan</term>
    <term name="month-02" form="short">Feb</term>
    <term name="month-03" form="short">Mrt</term>
    <term name="month-04" form="short">Apr</term>
    <term name="month-05" form="short">Mei</term>
    <term name="month-06" form="short">Jun</term>
    <term name="month-07" form="short">Jul</term>
    <term name="month-08" form="short">Aug</term>
    <term name="month-09" form="short">Sep</term>
    <term name="month-10" form="short">Okt</term>
    <term name="month-11" form="short">Nov</term>
    <term name="month-12" form="short">Des</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,ar:`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="ar">
  <info>
    <translator>
      <name>abdealikhurrum</name>
    </translator>
    <translator>
      <name>Dr. Ayman Saleh</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix="\u060C "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" suffix="/"/>
    <date-part name="month" form="numeric" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0648\u0635\u0648\u0644</term>
    <term name="and">\u0648</term>
    <term name="and others">\u0648\u0622\u062E\u0631\u0648\u0646</term>
    <term name="anonymous">\u0645\u062C\u0647\u0648\u0644</term>
    <term name="anonymous" form="short">\u0645\u062C\u0647\u0648\u0644</term>
    <term name="at">\u0639\u0646\u062F</term>
    <term name="available at">\u0645\u0648\u062C\u0648\u062F \u0641\u064A</term>
    <term name="by">\u0639\u0646 \u0637\u0631\u064A\u0642</term>
    <term name="circa">\u062D\u0648\u0627\u0644\u064A</term>
    <term name="circa" form="short">\u062D\u0648\u0627\u0644\u064A</term>
    <term name="cited">\u0648\u062B\u0642</term>
    <term name="edition">
      <single>\u0627\u0644\u0637\u0628\u0639\u0629</single>
      <multiple>\u0627\u0644\u0637\u0628\u0639\u0627\u062A</multiple>
    </term>
    <term name="edition" form="short">\u0637</term>
    <term name="et-al">\u0648\u0622\u062E\u0631\u0648\u0646</term>
    <term name="forthcoming">\u0627\u0644\u062A\u0627\u0644\u064A</term>
    <term name="from">\u0645\u0646</term>
    <term name="ibid">\u0627\u0644\u0645\u0631\u062C\u0639 \u0627\u0644\u0633\u0627\u0628\u0642</term>
    <term name="in">\u0641\u064A</term>
    <term name="in press">\u0642\u064A\u062F \u0627\u0644\u0646\u0634\u0631</term>
    <term name="internet">\u0627\u0646\u062A\u0631\u0646\u062A</term>
    <term name="interview">\u0645\u0642\u0627\u0628\u0644\u0629</term>
    <term name="letter">\u062E\u0637\u0627\u0628</term>
    <term name="no date">\u062F\u0648\u0646 \u062A\u0627\u0631\u064A\u062E</term>
    <term name="no date" form="short">\u062F.\u062A</term>
    <term name="online">\u0645\u0628\u0627\u0634\u0631 \u0639\u0644\u0649 \u0627\u0644\u0625\u0646\u062A\u0631\u0646\u062A</term>
    <term name="presented at">\u0642\u064F\u062F\u0651\u064E\u0645 \u0641\u064A</term>
    <term name="reference">
      <single>\u0645\u0631\u062C\u0639</single>
      <multiple>\u0645\u0631\u0627\u062C\u0639</multiple>
    </term>
    <term name="reference" form="short">
      <single>\u0645\u0631\u062C\u0639</single>
      <multiple>\u0645\u0631\u0627\u062C\u0639</multiple>
    </term>
    <term name="retrieved">\u0627\u0633\u062A\u0631\u062C\u0639 \u0641\u064A</term>
    <term name="scale">\u0627\u0644\u0633\u0644\u0645 \u0627\u0644\u0645\u0648\u0633\u064A\u0642\u064A</term>
    <term name="version">\u0625\u0635\u062F\u0627\u0631</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u0628.\u0645.</term>
    <term name="bc">\u0642.\u0645.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">"</term>
    <term name="close-quote">"</term>
    <term name="open-inner-quote">'</term>
    <term name="close-inner-quote">'</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal"></term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u0627\u0644\u0623\u0648\u0644</term>
    <term name="long-ordinal-02">\u0627\u0644\u062B\u0627\u0646\u064A</term>
    <term name="long-ordinal-03">\u0627\u0644\u062B\u0627\u0644\u062B</term>
    <term name="long-ordinal-04">\u0627\u0644\u0631\u0627\u0628\u0639</term>
    <term name="long-ordinal-05">\u0627\u0644\u062E\u0627\u0645\u0633</term>
    <term name="long-ordinal-06">\u0627\u0644\u0633\u0627\u062F\u0633</term>
    <term name="long-ordinal-07">\u0627\u0644\u0633\u0627\u0628\u0639</term>
    <term name="long-ordinal-08">\u0627\u0644\u062B\u0627\u0645\u0646</term>
    <term name="long-ordinal-09">\u0627\u0644\u062A\u0627\u0633\u0639</term>
    <term name="long-ordinal-10">\u0627\u0644\u0639\u0627\u0634\u0631</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u0643\u062A\u0627\u0628</single>
      <multiple>\u0643\u062A\u0628</multiple>
    </term>
    <term name="chapter">
      <single>\u0641\u0635\u0644</single>
      <multiple>\u0641\u0635\u0648\u0644</multiple>
    </term>
    <term name="column">
      <single>\u0639\u0645\u0648\u062F</single>
      <multiple>\u0623\u0639\u0645\u062F\u0629</multiple>
    </term>
    <term name="figure">
      <single>\u0631\u0633\u0645 \u062A\u0648\u0636\u064A\u062D\u064A</single>
      <multiple>\u0631\u0633\u0648\u0645 \u062A\u0648\u0636\u064A\u062D\u064A\u0629</multiple>
    </term>
    <term name="folio">
      <single>\u0648\u0631\u0642\u0629</single>
      <multiple>\u0623\u0648\u0631\u0627\u0642</multiple>
    </term>
    <term name="issue">
      <single>\u0639\u062F\u062F</single>
      <multiple>\u0623\u0639\u062F\u0627\u062F</multiple>
    </term>
    <term name="line">
      <single>\u0633\u0637\u0631</single>
      <multiple>\u0623\u0633\u0637\u0631</multiple>
    </term>
    <term name="note">
      <single>\u0645\u0644\u0627\u062D\u0638\u0629</single>
      <multiple>\u0645\u0644\u0627\u062D\u0638\u0627\u062A</multiple>
    </term>
    <term name="opus">
      <single>\u0646\u0648\u062A\u0647 \u0645\u0648\u0633\u064A\u0642\u064A\u0629</single>
      <multiple>\u0646\u0648\u062A\u0627\u062A \u0645\u0648\u0633\u064A\u0642\u064A\u0629</multiple>
    </term>
    <term name="page">
      <single>\u0635\u0641\u062D\u0629</single>
      <multiple>\u0635\u0641\u062D\u0627\u062A</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u0635\u0641\u062D\u0629</single>
      <multiple>\u0635\u0641\u062D\u0627\u062A</multiple>
    </term>
    <term name="paragraph">
      <single>\u0641\u0642\u0631\u0629</single>
      <multiple>\u0641\u0642\u0631\u0627\u062A</multiple>
    </term>
    <term name="part">
      <single>\u062C\u0632\u0621</single>
      <multiple>\u0623\u062C\u0632\u0627\u0621</multiple>
    </term>
    <term name="section">
      <single>\u0642\u0633\u0645</single>
      <multiple>\u0623\u0642\u0633\u0627\u0645</multiple>
    </term>
    <term name="sub verbo">
      <single>\u062A\u0641\u0633\u064A\u0631 \u0641\u0631\u0639\u064A</single>
      <multiple>\u062A\u0641\u0633\u064A\u0631\u0627\u062A \u0641\u0631\u0639\u064A\u0629</multiple>
    </term>
    <term name="verse">
      <single>\u0628\u064A\u062A \u0634\u0639\u0631</single>
      <multiple>\u0623\u0628\u064A\u0627\u062A \u0634\u0639\u0631</multiple>
    </term>
    <term name="volume">
      <single>\u0645\u062C\u0644\u062F</single>
      <multiple>\u0645\u062C\u0644\u062F\u0627\u062A</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u0643\u062A\u0627\u0628</term>
    <term name="chapter" form="short">\u0641\u0635\u0644</term>
    <term name="column" form="short">\u0639\u0645\u0648\u062F</term>
    <term name="figure" form="short">\u0631\u0633\u0645 \u062A\u0648\u0636\u064A\u062D\u064A</term>
    <term name="folio" form="short">\u0645\u0637\u0648\u064A\u0629</term>
    <term name="issue" form="short">\u0639\u062F\u062F</term>
    <term name="line" form="short">\u0633\u0640</term>
    <term name="note" form="short">\u0645\u0644\u0627\u062D\u0638\u0629</term>
    <term name="opus" form="short">\u0646\u0648\u062A\u0629 \u0645\u0648\u0633\u064A\u0642\u064A\u0629</term>
    <term name="page" form="short">
      <single>\u0635</single>
      <multiple>\u0635</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>\u0635</single>
      <multiple>\u0635</multiple>
    </term>
    <term name="paragraph" form="short">\u0641\u0642\u0631\u0629</term>
    <term name="part" form="short">\u062C</term>
    <term name="section" form="short">\u0642\u0633\u0645</term>
    <term name="sub verbo" form="short">
      <single>\u062A\u0641\u0633\u064A\u0631 \u0641\u0631\u0639\u064A</single>
      <multiple>\u062A\u0641\u0633\u064A\u0631\u0627\u062A \u0641\u0631\u0639\u064A\u0629</multiple>
    </term>
    <term name="verse" form="short">
      <single>\u0628\u064A\u062A \u0634\u0639\u0631</single>
      <multiple>\u0623\u0628\u064A\u0627\u062A \u0634\u0639\u0631</multiple>
    </term>
    <term name="volume" form="short">
      <single>\u0645</single>
      <multiple>\u0645</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">\u0625\u062F\u0627\u0631\u0629</term>
    <term name="editor">\u062A\u062D\u0642\u064A\u0642</term>
    <term name="editorial-director">\u0625\u062F\u0627\u0631\u0629 \u0627\u0644\u062A\u062D\u0631\u064A\u0631</term>
    <term name="illustrator">\u0631\u0633\u0648\u0645</term>
    <term name="translator">\u062A\u0631\u062C\u0645\u0629</term>
    <term name="editortranslator">\u062A\u0631\u062C\u0645\u0629 \u0648\u062A\u062D\u0642\u064A\u0642</term>

    <!-- SHORT ROLE FORMS -->

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">\u0625\u0646\u0634\u0627\u0621</term>
    <term name="director" form="verb">\u0625\u0634\u0631\u0627\u0641</term>
    <term name="editor" form="verb">\u062A\u062D\u0642\u064A\u0642</term>
    <term name="editorial-director" form="verb">\u0625\u0639\u062F\u0627\u062F</term>
    <term name="illustrator" form="verb">\u0631\u0633\u0648\u0645</term>
    <term name="interviewer" form="verb">\u0645\u0642\u0627\u0628\u0644\u0629 \u0645\u0639</term>
    <term name="recipient" form="verb">\u0627\u0644\u0645\u0633\u062A\u0644\u0645</term>
    <term name="reviewed-author" form="verb">\u0645\u0631\u0627\u062C\u0639\u0629</term>
    <term name="translator" form="verb">\u062A\u0631\u062C\u0645\u0629</term>
    <term name="editortranslator" form="verb">\u062A\u062D\u0642\u064A\u0642 \u0648\u062A\u0631\u062C\u0645\u0629</term>

    <!-- SHORT VERB ROLE FORMS -->
 
    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u064A\u0646\u0627\u064A\u0631</term>
    <term name="month-02">\u0641\u0628\u0631\u0627\u064A\u0631</term>
    <term name="month-03">\u0645\u0627\u0631\u0633</term>
    <term name="month-04">\u0623\u0628\u0631\u064A\u0644</term>
    <term name="month-05">\u0645\u0627\u064A\u0648</term>
    <term name="month-06">\u064A\u0648\u0646\u064A\u0648</term>
    <term name="month-07">\u064A\u0648\u0644\u064A\u0648</term>
    <term name="month-08">\u0623\u063A\u0633\u0637\u0633</term>
    <term name="month-09">\u0633\u0628\u062A\u0645\u0628\u0631</term>
    <term name="month-10">\u0623\u0643\u062A\u0648\u0628\u0631</term>
    <term name="month-11">\u0646\u0648\u0641\u0645\u0628\u0631</term>
    <term name="month-12">\u062F\u064A\u0633\u0645\u0628\u0631</term>

    <!-- SHORT MONTH FORMS -->


    <!-- SEASONS -->
    <term name="season-01">\u0631\u0628\u064A\u0639</term>
    <term name="season-02">\u0635\u064A\u0641</term>
    <term name="season-03">\u062E\u0631\u064A\u0641</term>
    <term name="season-04">\u0634\u062A\u0627\u0621</term>
  </terms>
</locale>
`,"bg-BG":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="bg-BG">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2018-02-15T04:14:02+00:00</updated>
    <translator>
      <name>Valeriya Simeonova</name>
      <email>simeonova@fmi.uni-sofia.bg</email>
      <uri>http://www.mendeley.com/profiles/valeriya-simeonova/</uri>
    </translator>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u043E\u0442\u0432\u043E\u0440\u0435\u043D \u043D\u0430</term>
    <term name="and">\u0438</term>
    <term name="and others">\u0438 \u0434\u0440\u0443\u0433\u0438</term>
    <term name="anonymous">\u0430\u043D\u043E\u043D\u0438\u043C\u0435\u043D</term>
    <term name="anonymous" form="short">\u0430\u043D\u043E\u043D.</term>
    <term name="at">\u0432</term>
    <term name="available at">\u0434\u043E\u0441\u0442\u044A\u043F\u0435\u043D \u043D\u0430</term>
    <term name="by">\u043E\u0442</term>
    <term name="circa">\u043E\u043A\u043E\u043B\u043E</term>
    <term name="circa" form="short">\u043E\u043A.</term>
    <term name="cited">\u0446\u0438\u0442\u0438\u0440\u0430\u043D</term>
    <term name="edition">
      <single>\u0438\u0437\u0434\u0430\u043D\u0438\u0435</single>
      <multiple>\u0438\u0437\u0434\u0430\u043D\u0438\u044F</multiple>
    </term>
    <term name="edition" form="short">\u0438\u0437\u0434.</term>
    <term name="et-al">\u0438 \u0441\u044A\u0430\u0432\u0442.</term>
    <term name="forthcoming">\u043F\u0440\u0435\u0434\u0441\u0442\u043E\u044F\u0449</term>
    <term name="from">\u043E\u0442</term>
    <term name="ibid">\u043F\u0430\u043A \u0442\u0430\u043C</term>
    <term name="in">\u0432</term>
    <term name="in press">\u043F\u043E\u0434 \u043F\u0435\u0447\u0430\u0442</term>
    <term name="internet">\u0438\u043D\u0442\u0435\u0440\u043D\u0435\u0442</term>
    <term name="interview">\u0438\u043D\u0442\u0435\u0440\u0432\u044E</term>
    <term name="letter">\u043F\u0438\u0441\u043C\u043E</term>
    <term name="no date">\u0431\u0435\u0437 \u0434\u0430\u0442\u0430</term>
    <term name="no date" form="short">\u0431.\u0434.</term>
    <term name="online">\u043E\u043D\u043B\u0430\u0439\u043D</term>
    <term name="presented at">\u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0435\u043D \u043D\u0430</term>
    <term name="reference">
      <single>\u0438\u0437\u0442\u043E\u0447\u043D\u0438\u043A</single>
      <multiple>\u0438\u0437\u0442\u043E\u0447\u043D\u0438\u0446\u0438</multiple>
    </term>
    <term name="reference" form="short">
      <single>\u0438\u0437\u0442.</single>
      <multiple>\u0438\u0437\u0442.</multiple>
    </term>
    <term name="retrieved">\u0438\u0437\u0442\u0435\u0433\u043B\u0435\u043D \u043D\u0430</term>
    <term name="scale">\u0441\u043A\u0430\u043B\u0430</term>
    <term name="version">\u0432\u0435\u0440\u0441\u0438\u044F</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u0441\u043B.\u0445\u0440.</term>
    <term name="bc">\u043F\u0440.\u0445\u0440.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u201E</term>
    <term name="close-inner-quote">\u201C</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">\u0442\u043E</term>
    <term name="ordinal-01">\u0432\u043E</term>
    <term name="ordinal-02">\u0440\u043E</term>
    <term name="ordinal-03">\u0442\u043E</term>
    <term name="ordinal-21">\u0432\u043E</term>
    <term name="ordinal-22">\u0440\u043E</term>
    <term name="ordinal-33">\u0442\u043E</term>
    <term name="ordinal" gender-form="masculine">\u0442\u0438</term>
    <term name="ordinal-01" gender-form="masculine">\u0432\u0438</term>
    <term name="ordinal-02" gender-form="masculine">\u0440\u0438</term>
    <term name="ordinal-03" gender-form="masculine">\u0442\u0438</term>
    <term name="ordinal-21" gender-form="masculine">\u0432\u0438</term>
    <term name="ordinal-22" gender-form="masculine">\u0440\u0438</term>
    <term name="ordinal-33" gender-form="masculine">\u0442\u0438</term>
    <term name="ordinal" gender-form="feminine">\u0442\u0430</term>
    <term name="ordinal-01" gender-form="feminine">\u0432\u0430</term>
    <term name="ordinal-02" gender-form="feminine">\u0440\u0430</term>
    <term name="ordinal-03" gender-form="feminine">\u0442\u0430</term>
    <term name="ordinal-21" gender-form="feminine">\u0432\u0430</term>
    <term name="ordinal-22" gender-form="feminine">\u0440\u0430</term>
    <term name="ordinal-33" gender-form="feminine">\u0442\u0430</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u043F\u044A\u0440\u0432o</term>
    <term name="long-ordinal-02">\u0432\u0442\u043E\u0440o</term>
    <term name="long-ordinal-03">\u0442\u0440\u0435\u0442o</term>
    <term name="long-ordinal-04">\u0447\u0435\u0442\u0432\u044A\u0440\u0442o</term>
    <term name="long-ordinal-05">\u043F\u0435\u0442o</term>
    <term name="long-ordinal-06">\u0448\u0435\u0441\u0442o</term>
    <term name="long-ordinal-07">\u0441\u0435\u0434\u043Co</term>
    <term name="long-ordinal-08">\u043E\u0441\u043Co</term>
    <term name="long-ordinal-09">\u0434\u0435\u0432\u0435\u0442o</term>
    <term name="long-ordinal-10">\u0434\u0435\u0441\u0435\u0442o</term>
    <term name="long-ordinal-01" gender-form="masculine">\u043F\u044A\u0440\u0432\u0438</term>
    <term name="long-ordinal-02" gender-form="masculine">\u0432\u0442\u043E\u0440\u0438</term>
    <term name="long-ordinal-03" gender-form="masculine">\u0442\u0440\u0435\u0442\u0438</term>
    <term name="long-ordinal-04" gender-form="masculine">\u0447\u0435\u0442\u0432\u0435\u0440\u0442\u0438</term>
    <term name="long-ordinal-05" gender-form="masculine">\u043F\u0435\u0442\u0438</term>
    <term name="long-ordinal-06" gender-form="masculine">\u0448\u0435\u0441\u0442\u0438</term>
    <term name="long-ordinal-07" gender-form="masculine">\u0441\u0435\u0434\u043C\u0438</term>
    <term name="long-ordinal-08" gender-form="masculine">\u043E\u0441\u043C\u0438</term>
    <term name="long-ordinal-09" gender-form="masculine">\u0434\u0435\u0432\u0435\u0442\u0438</term>
    <term name="long-ordinal-10" gender-form="masculine">\u0434\u0435\u0441\u0435\u0442\u0438</term>
    <term name="long-ordinal-01" gender-form="feminine">\u043F\u044A\u0440\u0432\u0430</term>
    <term name="long-ordinal-02" gender-form="feminine">\u0432\u0442\u043E\u0440\u0430</term>
    <term name="long-ordinal-03" gender-form="feminine">\u0442\u0440\u0435\u0442\u0430</term>
    <term name="long-ordinal-04" gender-form="feminine">\u0447\u0435\u0442\u0432\u0435\u0440\u0442\u0430</term>
    <term name="long-ordinal-05" gender-form="feminine">\u043F\u0435\u0442\u0430</term>
    <term name="long-ordinal-06" gender-form="feminine">\u0448\u0435\u0441\u0442\u0430</term>
    <term name="long-ordinal-07" gender-form="feminine">\u0441\u0435\u0434\u043C\u0430</term>
    <term name="long-ordinal-08" gender-form="feminine">\u043E\u0441\u043C\u0430</term>
    <term name="long-ordinal-09" gender-form="feminine">\u0434\u0435\u0432\u0435\u0442\u0430</term>
    <term name="long-ordinal-10" gender-form="feminine">\u0434\u0435\u0441\u0435\u0442\u0430</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u043A\u043D\u0438\u0433\u0430</single>
      <multiple>\u043A\u043D\u0438\u0433\u0438</multiple>
    </term>
    <term name="chapter">
      <single>\u0433\u043B\u0430\u0432\u0430</single>
      <multiple>\u0433\u043B\u0430\u0432\u0438</multiple>
    </term>
    <term name="column">
      <single>\u043A\u043E\u043B\u043E\u043D\u0430</single>
      <multiple>\u043A\u043E\u043B\u043E\u043D\u0438</multiple>
    </term>
    <term name="figure">
      <single>\u0444\u0438\u0433\u0443\u0440\u0430</single>
      <multiple>\u0444\u0438\u0433\u0443\u0440\u0438</multiple>
    </term>
    <term name="folio">
      <single>\u0444\u043E\u043B\u0438\u043E</single>
      <multiple>\u0444\u043E\u043B\u0438\u044F</multiple>
    </term>
    <term name="issue">
      <single>\u0431\u0440\u043E\u0439</single>
      <multiple>\u0431\u0440\u043E\u0435\u0432\u0435</multiple>
    </term>
    <term name="line">
      <single>\u0440\u0435\u0434</single>
      <multiple>\u0440\u0435\u0434\u043E\u0432\u0435</multiple>
    </term>
    <term name="note">
      <single>\u0431\u0435\u043B\u0435\u0436\u043A\u0430</single>
      <multiple>\u0431\u0435\u043B\u0435\u0436\u043A\u0438</multiple>
    </term>
    <term name="opus">
      <single>\u043E\u043F\u0443\u0441</single>
      <multiple>\u043E\u043F\u0443\u0441\u0438</multiple>
    </term>
    <term name="page">
      <single>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430</single>
      <multiple>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0438</multiple>
    </term>
    <term name="number-of-pages">\u0431\u0440\u043E\u0439 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0438</term>
    <term name="paragraph">
      <single>\u0430\u0431\u0437\u0430\u0446</single>
      <multiple>\u0430\u0431\u0437\u0430\u0446\u0438</multiple>
    </term>
    <term name="part">
      <single>\u0447\u0430\u0441\u0442</single>
      <multiple>\u0447\u0430\u0441\u0442\u0438</multiple>
    </term>
    <term name="section">
      <single>\u0440\u0430\u0437\u0434\u0435\u043B</single>
      <multiple>\u0440\u0430\u0437\u0434\u0435\u043B\u0438</multiple>
    </term>
    <term name="sub verbo">
      <single>\u043F\u043E\u0434 \u0440\u0430\u0437\u0434\u0435\u043B</single>
      <multiple>\u043F\u043E\u0434 \u0440\u0430\u0437\u0434\u0435\u043B\u0438</multiple>
    </term>
    <term name="verse">
      <single>\u0441\u0442\u0438\u0445\u043E\u0442\u0432\u043E\u0440\u0435\u043D\u0438\u0435</single>
      <multiple>\u0441\u0442\u0438\u0445\u043E\u0432\u0435</multiple>
    </term>
    <term name="volume">
      <single>\u0442\u043E\u043C</single>
      <multiple>\u0442\u043E\u043C\u043E\u0432\u0435</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u043A\u043D.</term>
    <term name="chapter" form="short">\u0433\u043B.</term>
    <term name="column" form="short">\u043A\u043E\u043B.</term>
    <term name="figure" form="short">\u0444\u0438\u0433.</term>
    <term name="folio" form="short">\u0444\u043E\u043B.</term>
    <term name="issue" form="short">\u0431\u0440.</term>
    <term name="line" form="short">\u0440.</term>
    <term name="note" form="short">\u0431\u0435\u043B.</term>
    <term name="opus" form="short">\u043E\u043F.</term>
    <term name="page" form="short">\u0441\u0442\u0440.</term>
    <term name="number-of-pages" form="short">\u0431\u0440.\u0441\u0442\u0440.</term>
    <term name="paragraph" form="short">\u0430\u0431\u0437.</term>
    <term name="part" form="short">\u0447.</term>
    <term name="section" form="short">\u0440\u0430\u0437\u0434.</term>
    <term name="sub verbo" form="short">\u043F\u043E\u0434\u0440\u0430\u0437\u0434.</term>
    <term name="verse" form="short">\u0441\u0442.</term>
    <term name="volume" form="short">
      <single>\u0442\u043E\u043C</single>
      <multiple>\u0442\u043E\u043C\u043E\u0432\u0435</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">\u0440\u0435\u0436\u0438\u0441\u044C\u043E\u0440</term>
    <term name="editor">
      <single>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440</single>
      <multiple>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0438</multiple>
    </term>
    <term name="editorial-director">
      <single>\u0433\u043B\u0430\u0432\u0435\u043D \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440</single>
      <multiple>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0441\u043A\u0438 \u043A\u043E\u043B\u0435\u043A\u0442\u0438\u0432</multiple>
    </term>
    <term name="illustrator">\u0438\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u0438</term>
    <term name="translator">
      <single>\u043F\u0440\u0435\u0432\u043E\u0434\u0430\u0447</single>
      <multiple>\u043F\u0440\u0435\u0432\u043E\u0434\u0430\u0447\u0438</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">\u0440\u0435\u0436.</term>
    <term name="editor" form="short">
      <single>\u0440\u0435\u0434.</single>
      <multiple>\u0440\u0435\u0434.\u043A\u043E\u043B.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>\u0433\u043B.\u0440\u0435\u0434.</single>
      <multiple>\u0433\u043B.\u0440\u0435\u0434.\u043A\u043E\u043B.</multiple>
    </term>
    <term name="illustrator" form="short">\u0438\u043B.</term>
    <term name="translator" form="short">
      <single>\u043F\u0440\u0435\u0432</single>
      <multiple>\u043F\u0440\u0435\u0432.\u043A\u043E\u043B.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>\u0440\u0435\u0434. &amp; \u043F\u0440\u0435\u0432.</single>
      <multiple>\u0440\u0435\u0434.\u043A\u043E\u043B. &amp; \u043F\u0440\u0435\u0432.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">\u043E\u0442</term>
    <term name="director" form="verb">\u043F\u043E\u0434 \u043E\u0431\u0449\u0430\u0442\u0430 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u044F \u043D\u0430</term>
    <term name="editor" form="verb">\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u0430\u043D \u043E\u0442</term>
    <term name="editorial-director" form="verb">\u0433\u043B\u0430\u0432\u0435\u043D \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440</term>
    <term name="illustrator" form="verb">\u0438\u043B\u044E\u0441\u0442\u0440\u0430\u0446\u0438\u0438 \u043E\u0442</term>
    <term name="interviewer" form="verb">\u0438\u043D\u0442\u0435\u0440\u0432\u044E\u0438\u0440\u0430\u043D \u043E\u0442</term>
    <term name="recipient" form="verb">\u0434\u043E</term>
    <term name="reviewed-author" form="verb">\u0440\u0435\u0446\u0435\u043D\u0437\u0435\u043D\u0442</term>
    <term name="translator" form="verb">\u043F\u0440\u0435\u0432\u0435\u0434\u0435\u043D \u043E\u0442</term>
    <term name="editortranslator" form="verb">\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u0430\u043D\u043E &amp; \u043F\u0440\u0435\u0432\u0435\u0434\u0435\u043D\u043E \u043E\u0442</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">\u043F.\u043E.\u0440.</term>
    <term name="editor" form="verb-short">\u0440\u0435\u0434.</term>
    <term name="editorial-director" form="verb-short">\u0433\u043B.\u0440\u0435\u0434.</term>
    <term name="illustrator" form="verb-short">\u0438\u043B.</term>
    <term name="translator" form="verb-short">\u043F\u0440\u0435\u0432.</term>
    <term name="editortranslator" form="verb-short">\u0440\u0435\u0434. &amp; \u043F\u0440\u0435\u0432. \u043E\u0442</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u042F\u043D\u0443\u0430\u0440\u0438</term>
    <term name="month-02">\u0424\u0435\u0432\u0440\u0443\u0430\u0440\u0438</term>
    <term name="month-03">\u041C\u0430\u0440\u0442</term>
    <term name="month-04">\u0410\u043F\u0440\u0438\u043B</term>
    <term name="month-05">\u041C\u0430\u0439</term>
    <term name="month-06">\u042E\u043D\u0438</term>
    <term name="month-07">\u042E\u043B\u0438</term>
    <term name="month-08">\u0410\u0432\u0433\u0443\u0441\u0442</term>
    <term name="month-09">\u0421\u0435\u043F\u0442\u0435\u043C\u0432\u0440\u0438</term>
    <term name="month-10">\u041E\u043A\u0442\u043E\u043C\u0432\u0440\u0438</term>
    <term name="month-11">\u041D\u043E\u0435\u043C\u0432\u0440\u0438</term>
    <term name="month-12">\u0414\u0435\u043A\u0435\u043C\u0432\u0440\u0438</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">\u042F\u043D\u0443</term>
    <term name="month-02" form="short">\u0424\u0435\u0432</term>
    <term name="month-03" form="short">\u041C\u0430\u0440</term>
    <term name="month-04" form="short">\u0410\u043F\u0440</term>
    <term name="month-05" form="short">\u041C\u0430\u0439</term>
    <term name="month-06" form="short">\u042E\u043D\u0438</term>
    <term name="month-07" form="short">\u042E\u043B\u0438</term>
    <term name="month-08" form="short">\u0410\u0432\u0433</term>
    <term name="month-09" form="short">\u0421\u0435\u043F</term>
    <term name="month-10" form="short">\u041E\u043A\u0442</term>
    <term name="month-11" form="short">\u041D\u043E\u0435</term>
    <term name="month-12" form="short">\u0414\u0435\u043A</term>

    <!-- SEASONS -->
    <term name="season-01">\u041F\u0440\u043E\u043B\u0435\u0442</term>
    <term name="season-02">\u041B\u044F\u0442\u043E</term>
    <term name="season-03">\u0415\u0441\u0435\u043D</term>
    <term name="season-04">\u0417\u0438\u043C\u0430</term>
  </terms>
</locale>
`,"ca-AD":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="ca-AD">
  <info>
    <translator>
      <name>anidal</name>
    </translator>
    <translator>
      <name>javimat</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">consulta</term>
    <term name="and">i</term>
    <term name="and others">i altres</term>
    <term name="anonymous">an\xF2nim</term>
    <term name="anonymous" form="short">an\xF2n.</term>
    <term name="at">a</term>
    <term name="available at">disponible a</term>
    <term name="by">per</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citat</term>
    <term name="edition">
      <single>edici\xF3</single>
      <multiple>edicions</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">previst</term>
    <term name="from">de</term>
    <term name="ibid">ib\xEDd.</term>
    <term name="in">en</term>
    <term name="in press">en impremta</term>
    <term name="internet">internet</term>
    <term name="interview">entrevista</term>
    <term name="letter">carta</term>
    <term name="no date">sense data</term>
    <term name="no date" form="short">s.d.</term>
    <term name="online">en l\xEDnia</term>
    <term name="presented at">presentat a</term>
    <term name="reference">
      <single>refer\xE8ncia</single>
      <multiple>refer\xE8ncies</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">recuperat</term>
    <term name="scale">escala</term>
    <term name="version">versi\xF3</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">dC</term>
    <term name="bc">aC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">-</term>

    <!-- ORDINALS -->
    <term name="ordinal">a</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">primera</term>
    <term name="long-ordinal-02">segona</term>
    <term name="long-ordinal-03">tercera</term>
    <term name="long-ordinal-04">quarta</term>
    <term name="long-ordinal-05">cinquena</term>
    <term name="long-ordinal-06">sisena</term>
    <term name="long-ordinal-07">setena</term>
    <term name="long-ordinal-08">vuitena</term>
    <term name="long-ordinal-09">novena</term>
    <term name="long-ordinal-10">desena</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>llibre</single>
      <multiple>llibres</multiple>
    </term>
    <term name="chapter">
      <single>cap\xEDtol</single>
      <multiple>cap\xEDtols</multiple>
    </term>
    <term name="column">
      <single>columna</single>
      <multiple>columnes</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>foli</single>
      <multiple>folis</multiple>
    </term>
    <term name="issue">
      <single>n\xFAmero</single>
      <multiple>n\xFAmeros</multiple>
    </term>
    <term name="line">
      <single>l\xEDnia</single>
      <multiple>l\xEDnies</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>p\xE0gina</single>
      <multiple>p\xE0gines</multiple>
    </term>
    <term name="number-of-pages">
      <single>p\xE0gina</single>
      <multiple>p\xE0gines</multiple>
    </term>
    <term name="paragraph">
      <single>par\xE0graf</single>
      <multiple>par\xE0grafs</multiple>
    </term>
    <term name="part">
      <single>part</single>
      <multiple>parts</multiple>
    </term>
    <term name="section">
      <single>secci\xF3</single>
      <multiple>seccions</multiple>
    </term>
    <term name="sub verbo">
      <single>sub voce</single>
      <multiple>sub vocibus</multiple>
    </term>
    <term name="verse">
      <single>vers</single>
      <multiple>versos</multiple>
    </term>
    <term name="volume">
      <single>volum</single>
      <multiple>volums</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">llib.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">n\xFAm.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.v.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vol.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>il\xB7lustrador</single>
      <multiple>il\xB7lustradors</multiple>
    </term>
    <term name="translator">
      <single>traductor</single>
      <multiple>traductors</multiple>
    </term>
    <term name="editortranslator">
      <single>editor i traductor</single>
      <multiple>editors i traductors</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dir.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>il\xB7lust.</single>
      <multiple>il\xB7lust.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trad.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. i trad.</single>
      <multiple>ed. i trad.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">per</term>
    <term name="director" form="verb">dirigit per</term>
    <term name="editor" form="verb">editat per</term>
    <term name="editorial-director" form="verb">editat per</term>
    <term name="illustrator" form="verb">il\xB7lustrat per</term>
    <term name="interviewer" form="verb">entrevistat per</term>
    <term name="recipient" form="verb">a</term>
    <term name="reviewed-author" form="verb">per</term>
    <term name="translator" form="verb">tradu\xEFt per</term>
    <term name="editortranslator" form="verb">editat i tradu\xEFt per</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">il\xB7lust.</term>
    <term name="translator" form="verb-short">trad.</term>
    <term name="editortranslator" form="verb-short">ed. i trad. per</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">gener</term>
    <term name="month-02">febrer</term>
    <term name="month-03">mar\xE7</term>
    <term name="month-04">abril</term>
    <term name="month-05">maig</term>
    <term name="month-06">juny</term>
    <term name="month-07">juliol</term>
    <term name="month-08">agost</term>
    <term name="month-09">setembre</term>
    <term name="month-10">octubre</term>
    <term name="month-11">novembre</term>
    <term name="month-12">desembre</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">gen.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar\xE7</term>
    <term name="month-04" form="short">abr.</term>
    <term name="month-05" form="short">maig</term>
    <term name="month-06" form="short">juny</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">ago.</term>
    <term name="month-09" form="short">set.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">des.</term>

    <!-- SEASONS -->
    <term name="season-01">primavera</term>
    <term name="season-02">estiu</term>
    <term name="season-03">tardor</term>
    <term name="season-04">hivern</term>
  </terms>
</locale>
`,"cs-CZ":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="cs-CZ">
  <info>
    <translator>
      <name>nosaal</name>
    </translator>
    <translator>
      <name>Andrew Dunning</name>
    </translator>
    <translator>
      <name>libora</name>
    </translator>
    <translator>
      <name>Michal Hoftich</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric" suffix=". " range-delimiter="-"/>
    <date-part name="month" form="numeric" suffix=". " range-delimiter="-"/>
    <date-part name="year" range-delimiter="-"/>
  </date>
  <terms>
    <term name="accessed">vid\u011Bno</term>
    <term name="accessed" form="short">vid.</term>
    <term name="and">a</term>
    <term name="and others">a dal\u0161\xED</term>
    <term name="anonymous">anonym</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">v</term>
    <term name="available at">dostupn\xE9 z</term>
    <term name="by">od</term>
    <term name="circa">asi</term>
    <term name="circa" form="short">cca.</term>
    <term name="cited">citov\xE1n</term>
    <term name="edition">
      <single>vyd\xE1n\xED</single>
      <multiple>vyd\xE1n\xED</multiple>
    </term>
    <term name="edition" form="short">vyd.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">nadch\xE1zej\xEDc\xED</term>
    <term name="from">z</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">v tisku</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">dopis</term>
    <term name="no date">nedatov\xE1no</term>
    <term name="no date" form="short">b.r.</term>
    <term name="online">online</term>
    <term name="presented at">prezentov\xE1no v</term>
    <term name="reference">
      <single>reference</single>
      <multiple>reference</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">z\xEDsk\xE1no</term>
    <term name="scale">m\u011B\u0159\xEDtko</term>
    <term name="version">verze</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">n. l.</term>
    <term name="bc">p\u0159. n. l.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">"</term>
    <term name="open-inner-quote">\u201A</term>
    <term name="close-inner-quote">\xB4</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">prvn\xED</term>
    <term name="long-ordinal-02">druh\xE9</term>
    <term name="long-ordinal-03">t\u0159et\xED</term>
    <term name="long-ordinal-04">\u010Dtvrt\xE9</term>
    <term name="long-ordinal-05">p\xE1t\xE9</term>
    <term name="long-ordinal-06">\u0161est\xE9</term>
    <term name="long-ordinal-07">sedm\xE9</term>
    <term name="long-ordinal-08">osm\xE9</term>
    <term name="long-ordinal-09">dev\xE1t\xE9</term>
    <term name="long-ordinal-10">des\xE1t\xE9</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>kniha</single>
      <multiple>knihy</multiple>
    </term>
    <term name="chapter">
      <single>kapitola</single>
      <multiple>kapitoly</multiple>
    </term>
    <term name="column">
      <single>sloupec</single>
      <multiple>sloupce</multiple>
    </term>
    <term name="figure">
      <single>obr\xE1zek</single>
      <multiple>obr\xE1zky</multiple>
    </term>
    <term name="folio">
      <single>list</single>
      <multiple>listy</multiple>
    </term>
    <term name="issue">
      <single>\u010D\xEDslo</single>
      <multiple>\u010D\xEDsla</multiple>
    </term>
    <term name="line">
      <single>\u0159\xE1dek</single>
      <multiple>\u0159\xE1dky</multiple>
    </term>
    <term name="note">
      <single>pozn\xE1mka</single>
      <multiple>pozn\xE1mky</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opusy</multiple>
    </term>
    <term name="page">
      <single>strana</single>
      <multiple>strany</multiple>
    </term>
    <term name="number-of-pages">
      <single>strana</single>
      <multiple>strany</multiple>
    </term>
    <term name="paragraph">
      <single>odstavec</single>
      <multiple>odstavce</multiple>
    </term>
    <term name="part">
      <single>\u010D\xE1st</single>
      <multiple>\u010D\xE1sti</multiple>
    </term>
    <term name="section">
      <single>sekce</single>
      <multiple>sekce</multiple>
    </term>
    <term name="sub verbo">
      <single>pod heslem</single>
      <multiple>pod hesly</multiple>
    </term>
    <term name="verse">
      <single>ver\u0161</single>
      <multiple>ver\u0161e</multiple>
    </term>
    <term name="volume">
      <single>ro\u010Dn\xEDk</single>
      <multiple>ro\u010Dn\xEDky</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">k.</term>
    <term name="chapter" form="short">kap.</term>
    <term name="column" form="short">sl.</term>
    <term name="figure" form="short">obr.</term>
    <term name="folio" form="short">l.</term>
    <term name="issue" form="short">\u010D.</term>
    <term name="line" form="short">\u0159.</term>
    <term name="note" form="short">pozn.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="paragraph" form="short">odst.</term>
    <term name="part" form="short">\u010D.</term>
    <term name="section" form="short">sek.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.v.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>ro\u010D.</single>
      <multiple>ro\u010D.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>\u0159editel</single>
      <multiple>\u0159editel\xE9</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>edito\u0159i</multiple>
    </term>
    <term name="editorial-director">
      <single>vedouc\xED editor</single>
      <multiple>vedouc\xED edito\u0159i</multiple>
    </term>
    <term name="illustrator">
      <single>ilustr\xE1tor</single>
      <multiple>ilustr\xE1to\u0159i</multiple>
    </term>
    <term name="translator">
      <single>p\u0159ekladatel</single>
      <multiple>p\u0159ekladatel\xE9</multiple>
    </term>
    <term name="editortranslator">
      <single>editor a p\u0159ekladatel</single>
      <multiple>edito\u0159i a p\u0159ekladatel\xE9</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>\u0159ed.</single>
      <multiple>\u0159ed.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>il.</single>
      <multiple>il.</multiple>
    </term>
    <term name="translator" form="short">
      <single>p\u0159el.</single>
      <multiple>p\u0159el.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. a p\u0159el.</single>
      <multiple>ed. a p\u0159el.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb"></term>
    <term name="director" form="verb">\u0159\xEDdil</term>
    <term name="editor" form="verb">editoval</term>
    <term name="editorial-director" form="verb">editoval</term>
    <term name="illustrator" form="verb">ilustroval</term>
    <term name="interviewer" form="verb">rozhovor vedl</term>
    <term name="recipient" form="verb">pro</term>
    <term name="reviewed-author" form="verb">recenzoval</term>
    <term name="translator" form="verb">p\u0159elo\u017Eil</term>
    <term name="editortranslator" form="verb">editoval a p\u0159elo\u017Eil</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">\u0159ed.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">ilust.</term>
    <term name="translator" form="verb-short">p\u0159el.</term>
    <term name="editortranslator" form="verb-short">ed. a p\u0159el.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">leden</term>
    <term name="month-02">\xFAnor</term>
    <term name="month-03">b\u0159ezen</term>
    <term name="month-04">duben</term>
    <term name="month-05">kv\u011Bten</term>
    <term name="month-06">\u010Derven</term>
    <term name="month-07">\u010Dervenec</term>
    <term name="month-08">srpen</term>
    <term name="month-09">z\xE1\u0159\xED</term>
    <term name="month-10">\u0159\xEDjen</term>
    <term name="month-11">listopad</term>
    <term name="month-12">prosinec</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">led.</term>
    <term name="month-02" form="short">\xFAno.</term>
    <term name="month-03" form="short">b\u0159e.</term>
    <term name="month-04" form="short">dub.</term>
    <term name="month-05" form="short">kv\u011B.</term>
    <term name="month-06" form="short">\u010Der.</term>
    <term name="month-07" form="short">\u010Dvc.</term>
    <term name="month-08" form="short">srp.</term>
    <term name="month-09" form="short">z\xE1\u0159.</term>
    <term name="month-10" form="short">\u0159\xEDj.</term>
    <term name="month-11" form="short">lis.</term>
    <term name="month-12" form="short">pro.</term>

    <!-- SEASONS -->
    <term name="season-01">jaro</term>
    <term name="season-02">l\xE9to</term>
    <term name="season-03">podzim</term>
    <term name="season-04">zima</term>
  </terms>
</locale>
`,"cy-GB":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="cy-GB">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2014-10-08T12:00:00+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">gwelwyd</term>
    <term name="and">a/ac</term>
    <term name="and others">ac eraill</term>
    <term name="anonymous">di-enw</term>
    <term name="anonymous" form="short">dienw</term>
    <term name="at">at</term>
    <term name="available at">ar gael</term>
    <term name="by">gan</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">dyfynnwyd</term>
    <term name="edition">
      <single>argraffiad</single>
      <multiple>argraffiadau</multiple>
    </term>
    <term name="edition" form="short">arg.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">ar fin ymddangos</term>
    <term name="from">gan</term>
    <term name="ibid">ibid.</term>
    <term name="in">yn</term>
    <term name="in press">yn y wasg</term>
    <term name="internet">rhyngrwyd</term>
    <term name="interview">cyfweliad</term>
    <term name="letter">llythyr</term>
    <term name="no date">dim dyddiad</term>
    <term name="no date" form="short">d.d.</term>
    <term name="online">arlein</term>
    <term name="presented at">cyflwynwyd yn</term>
    <term name="reference">
      <single>cyfeirnod</single>
      <multiple>cyfeirnodau</multiple>
    </term>
    <term name="reference" form="short">
      <single>cyf.</single>
      <multiple>cyf\u2019au.</multiple>
    </term>
    <term name="retrieved">gwelwyd</term>
    <term name="scale">graddfa</term>
    <term name="version">fersiwn</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">OC</term>
    <term name="bc">CC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u2018</term>
    <term name="close-quote">\u2019</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">af</term>
    <term name="ordinal-02">il</term>
    <term name="ordinal-03">ydd</term>
    <term name="ordinal-11">ed</term>
    <term name="ordinal-12">ed</term>
    <term name="ordinal-13">ed</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">cyntaf</term>
    <term name="long-ordinal-02">ail</term>
    <term name="long-ordinal-03">trydydd</term>
    <term name="long-ordinal-04">pedwerydd</term>
    <term name="long-ordinal-05">pumed</term>
    <term name="long-ordinal-06">chweched</term>
    <term name="long-ordinal-07">seithfed</term>
    <term name="long-ordinal-08">wythfed</term>
    <term name="long-ordinal-09">nawfed</term>
    <term name="long-ordinal-10">degfed</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>llyfr</single>
      <multiple>llyfrau</multiple>
    </term>
    <term name="chapter">
      <single>pennod</single>
      <multiple>penodau</multiple>
    </term>
    <term name="column">
      <single>colofn</single>
      <multiple>colofnau</multiple>
    </term>
    <term name="figure">
      <single>ffigwr</single>
      <multiple>ffigyrau</multiple>
    </term>
    <term name="folio">
      <single>ffolio</single>
      <multiple>ffolios</multiple>
    </term>
    <term name="issue">
      <single>rhifyn</single>
      <multiple>rhifynnau</multiple>
    </term>
    <term name="line">
      <single>llinell</single>
      <multiple>llinellau</multiple>
    </term>
    <term name="note">
      <single>nodyn</single>
      <multiple>nodiadau</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>tudalen</single>
      <multiple>tudalennau</multiple>
    </term>
    <term name="number-of-pages">
      <single>tudalen</single>
      <multiple>tudalennau</multiple>
    </term>
    <term name="paragraph">
      <single>paragraff</single>
      <multiple>paragraffau</multiple>
    </term>
    <term name="part">
      <single>rhan</single>
      <multiple>rhannau</multiple>
    </term>
    <term name="section">
      <single>adran</single>
      <multiple>adrannau</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>pennill</single>
      <multiple>penillion</multiple>
    </term>
    <term name="volume">
      <single>cyfrol</single>
      <multiple>cyfrolau</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">llyfr.</term>
    <term name="chapter" form="short">pen.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">ffig.</term>
    <term name="folio" form="short">ff.</term>
    <term name="issue" form="short">rhif.</term>
    <term name="line" form="short">ll.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>t.</single>
      <multiple>tt.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>t.</single>
      <multiple>tt.</multiple>
    </term>
    <term name="paragraph" form="short">para.</term>
    <term name="part" form="short">rhan.</term>
    <term name="section" form="short">adr.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="volume" form="short">
      <single>rhif.</single>
      <multiple>rhifu.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>cyfarwyddwr</single>
      <multiple>cyfarwyddwyr</multiple>
    </term>
    <term name="editor">
      <single>golygydd</single>
      <multiple>golygyddion</multiple>
    </term>
    <term name="editorial-director">
      <single>cyfarwyddwr-golygyddol</single>
      <multiple>cyfarwyddwyr-golygyddol</multiple>
    </term>
    <term name="illustrator">
      <single>darlunydd</single>
      <multiple>darlunwyr</multiple>
    </term>
    <term name="translator">
      <single>cyfieithydd</single>
      <multiple>cyfieithwyr</multiple>
    </term>
    <term name="editortranslator">
      <single>golygydd a chyfieithydd</single>
      <multiple>golygyddion a chyfieithwyr</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>cyf.</single>
      <multiple>cyfy.</multiple>
    </term>
    <term name="editor" form="short">
      <single>gol.</single>
      <multiple>goln.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>gol.</single>
      <multiple>goln.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>darlun.</single>
      <multiple>darlun.</multiple>
    </term>
    <term name="translator" form="short">
      <single>cyf.</single>
      <multiple>cyf.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>gol. a chyf.</single>
      <multiple>goln. a chyf.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">gan</term>
    <term name="director" form="verb">cyfarwyddwyd gan</term>
    <term name="editor" form="verb">golygwyd gan</term>
    <term name="editorial-director" form="verb">cyfarwyddwyd a golygwyd gan</term>
    <term name="illustrator" form="verb">darlunwyd gan</term>
    <term name="interviewer" form="verb">cyfweliad gan</term>
    <term name="recipient" form="verb">i</term>
    <term name="reviewed-author" form="verb">gan</term>
    <term name="translator" form="verb">cyfieithwyd gan </term>
    <term name="editortranslator" form="verb">golygwyd a chyfieithwyd gan</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">cyf. gan</term>
    <term name="editor" form="verb-short">gol. gan</term>
    <term name="editorial-director" form="verb-short">cyf.-gol. gan</term>
    <term name="illustrator" form="verb-short">darlun. gan</term>
    <term name="translator" form="verb-short">cyf. gan</term>
    <term name="editortranslator" form="verb-short">gol. a chyf. gan</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Ionawr</term>
    <term name="month-02">Chwefror</term>
    <term name="month-03">Mawrth</term>
    <term name="month-04">Ebrill</term>
    <term name="month-05">Mai</term>
    <term name="month-06">Mehefin</term>
    <term name="month-07">Gorffennaf</term>
    <term name="month-08">Awst</term>
    <term name="month-09">Medi</term>
    <term name="month-10">Hydref</term>
    <term name="month-11">Tachwedd</term>
    <term name="month-12">Rhagfyr</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Ion.</term>
    <term name="month-02" form="short">Chwe.</term>
    <term name="month-03" form="short">Maw.</term>
    <term name="month-04" form="short">Ebr.</term>
    <term name="month-05" form="short">Mai</term>
    <term name="month-06" form="short">Meh.</term>
    <term name="month-07" form="short">Gorff.</term>
    <term name="month-08" form="short">Aws.</term>
    <term name="month-09" form="short">Med.</term>
    <term name="month-10" form="short">Hyd.</term>
    <term name="month-11" form="short">Tach.</term>
    <term name="month-12" form="short">Rhag.</term>

    <!-- SEASONS -->
    <term name="season-01">Gwanwyn</term>
    <term name="season-02">Haf</term>
    <term name="season-03">Hydref</term>
    <term name="season-04">Gaeaf</term>
  </terms>
</locale>
`,"da-DK":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="da-DK">
  <info>
    <translator>
      <name>Niels Erik Wille</name>
    </translator>
    <translator>
      <name>Jonas Nyrup</name>
    </translator>
    <translator>
      <name>hafnius</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="-" range-delimiter="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="-" range-delimiter="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">set</term>
    <term name="and">og</term>
    <term name="and others">med flere</term>
    <term name="anonymous">anonym</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">p\xE5</term>
    <term name="available at">tilg\xE6ngelig hos</term>
    <term name="by">af</term>
    <term name="circa">cirka</term>
    <term name="circa" form="short">ca.</term>
    <term name="cited">henvist</term>
    <term name="edition">
      <single>udgave</single>
      <multiple>udgaver</multiple>
    </term>
    <term name="edition" form="short">udg.</term>
    <term name="et-al">m.fl.</term>
    <term name="forthcoming">kommende</term>
    <term name="from">fra</term>
    <term name="ibid">ibid.</term>
    <term name="in">i</term>
    <term name="in press">i trykken</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">brev</term>
    <term name="no date">uden \xE5r</term>
    <term name="no date" form="short">u.\xE5.</term>
    <term name="online">online</term>
    <term name="presented at">pr\xE6senteret ved</term>
    <term name="reference">
      <single>reference</single>
      <multiple>referencer</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refr.</multiple>
    </term>
    <term name="retrieved">hentet</term>
    <term name="scale">skala</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">e.v.t.</term>
    <term name="bc">f.v.t.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">f\xF8rste</term>
    <term name="long-ordinal-02">anden</term>
    <term name="long-ordinal-03">tredje</term>
    <term name="long-ordinal-04">fjerde</term>
    <term name="long-ordinal-05">femte</term>
    <term name="long-ordinal-06">sjette</term>
    <term name="long-ordinal-07">syvende</term>
    <term name="long-ordinal-08">ottende</term>
    <term name="long-ordinal-09">niende</term>
    <term name="long-ordinal-10">tiende</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>bog</single>
      <multiple>b\xF8ger</multiple>
    </term>
    <term name="chapter">
      <single>kapitel</single>
      <multiple>kapitler</multiple>
    </term>
    <term name="column">
      <single>kolonne</single>
      <multiple>kolonner</multiple>
    </term>
    <term name="figure">
      <single>figur</single>
      <multiple>figurer</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folio</multiple>
    </term>
    <term name="issue">
      <single>nummer</single>
      <multiple>numre</multiple>
    </term>
    <term name="line">
      <single>linje</single>
      <multiple>linjer</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>noter</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opus</multiple>
    </term>
    <term name="page">
      <single>side</single>
      <multiple>sider</multiple>
    </term>
    <term name="number-of-pages">
      <single>side</single>
      <multiple>sider</multiple>
    </term>
    <term name="paragraph">
      <single>afsnit</single>
      <multiple>afsnit</multiple>
    </term>
    <term name="part">
      <single>del</single>
      <multiple>dele</multiple>
    </term>
    <term name="section">
      <single>paragraf</single>
      <multiple>paragraffer</multiple>
    </term>
    <term name="sub verbo">
      <single>sub voce</single>
      <multiple>sub voce</multiple>
    </term>
    <term name="verse">
      <single>vers</single>
      <multiple>vers</multiple>
    </term>
    <term name="volume">
      <single>bind</single>
      <multiple>bind</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">b.</term>
    <term name="chapter" form="short">kap.</term>
    <term name="column" form="short">kol.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">nr.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="paragraph" form="short">afs.</term>
    <term name="part" form="short">d.</term>
    <term name="section" form="short">par.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.v.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>bd.</single>
      <multiple>bd.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>instrukt\xF8r</single>
      <multiple>instrukt\xF8rer</multiple>
    </term>
    <term name="editor">
      <single>redakt\xF8r</single>
      <multiple>redakt\xF8rer</multiple>
    </term>
    <term name="editorial-director">
      <single>redakt\xF8r</single>
      <multiple>redakt\xF8rer</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustratorer</multiple>
    </term>
    <term name="translator">
      <single>overs\xE6tter</single>
      <multiple>overs\xE6ttere</multiple>
    </term>
    <term name="editortranslator">
      <single>redakt\xF8r &amp; overs\xE6tter</single>
      <multiple>redakt\xF8rer &amp; overs\xE6ttere</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>instr.</single>
      <multiple>instr.</multiple>
    </term>
    <term name="editor" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>overs.</single>
      <multiple>overs.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>red. &amp; overs.</single>
      <multiple>red. &amp; overs.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">af</term>
    <term name="director" form="verb">instrueret af</term>
    <term name="editor" form="verb">redigeret af</term>
    <term name="editorial-director" form="verb">redigeret af</term>
    <term name="illustrator" form="verb">illustreret af</term>
    <term name="interviewer" form="verb">interviewet af</term>
    <term name="recipient" form="verb">modtaget af</term>
    <term name="reviewed-author" form="verb">af</term>
    <term name="translator" form="verb">oversat af</term>
    <term name="editortranslator" form="verb">redigeret &amp; oversat af</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">instr.</term>
    <term name="editor" form="verb-short">red.</term>
    <term name="editorial-director" form="verb-short">red.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">overs.</term>
    <term name="editortranslator" form="verb-short">red. &amp; overs. af</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">januar</term>
    <term name="month-02">februar</term>
    <term name="month-03">marts</term>
    <term name="month-04">april</term>
    <term name="month-05">maj</term>
    <term name="month-06">juni</term>
    <term name="month-07">juli</term>
    <term name="month-08">august</term>
    <term name="month-09">september</term>
    <term name="month-10">oktober</term>
    <term name="month-11">november</term>
    <term name="month-12">december</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">maj</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">For\xE5r</term>
    <term name="season-02">Sommer</term>
    <term name="season-03">Efter\xE5r</term>
    <term name="season-04">Vinter</term>
  </terms>
</locale>
`,"de-AT":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="de-AT">
  <info>
    <translator>
      <name>Till A. Heilmann</name>
    </translator>
    <translator>
      <name>Georg Duffner</name>
    </translator>
    <translator>
      <name>Sebastian Karcher</name>
    </translator>
    <translator>
      <name>Sylvester Keil</name>
    </translator>
    <translator>
      <name>jakov</name>
    </translator>
    <translator>
      <name>Frank Bennett</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">zugegriffen</term>
    <term name="and">und</term>
    <term name="and others">und andere</term>
    <term name="anonymous">ohne Autor</term>
    <term name="anonymous" form="short">o.&#160;A.</term>
    <term name="at">auf</term>
    <term name="available at">verf\xFCgbar unter</term>
    <term name="by">von</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">ca.</term>
    <term name="cited">zitiert</term>
    <term name="edition">
      <single>Auflage</single>
      <multiple>Auflagen</multiple>
    </term>
    <term name="edition" form="short">Aufl.</term>
    <term name="et-al">u.&#160;a.</term>
    <term name="forthcoming">i.&#160;E.</term>
    <term name="from">von</term>
    <term name="ibid">ebd.</term>
    <term name="in">in</term>
    <term name="in press">im Druck</term>
    <term name="internet">Internet</term>
    <term name="interview">Interview</term>
    <term name="letter">Brief</term>
    <term name="no date">ohne Datum</term>
    <term name="no date" form="short">o.&#160;J.</term>
    <term name="online">online</term>
    <term name="presented at">gehalten auf der</term>
    <term name="reference">
      <single>Referenz</single>
      <multiple>Referenzen</multiple>
    </term>
    <term name="reference" form="short">
      <single>Ref.</single>
      <multiple>Ref.</multiple>
    </term>
    <term name="retrieved">abgerufen</term>
    <term name="scale">Ma\xDFstab</term>
    <term name="version">Version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">&#160;n.&#160;Chr.</term>
    <term name="bc">&#160;v.&#160;Chr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u201A</term>
    <term name="close-inner-quote">\u2018</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">erster</term>
    <term name="long-ordinal-02">zweiter</term>
    <term name="long-ordinal-03">dritter</term>
    <term name="long-ordinal-04">vierter</term>
    <term name="long-ordinal-05">f\xFCnfter</term>
    <term name="long-ordinal-06">sechster</term>
    <term name="long-ordinal-07">siebter</term>
    <term name="long-ordinal-08">achter</term>
    <term name="long-ordinal-09">neunter</term>
    <term name="long-ordinal-10">zehnter</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>Buch</single>
      <multiple>B\xFCcher</multiple>
    </term>
    <term name="chapter">
      <single>Kapitel</single>
      <multiple>Kapitel</multiple>
    </term>
    <term name="column">
      <single>Spalte</single>
      <multiple>Spalten</multiple>
    </term>
    <term name="figure">
      <single>Abbildung</single>
      <multiple>Abbildungen</multiple>
    </term>
    <term name="folio">
      <single>Blatt</single>
      <multiple>Bl\xE4tter</multiple>
    </term>
    <term name="issue">
      <single>Nummer</single>
      <multiple>Nummern</multiple>
    </term>
    <term name="line">
      <single>Zeile</single>
      <multiple>Zeilen</multiple>
    </term>
    <term name="note">
      <single>Note</single>
      <multiple>Noten</multiple>
    </term>
    <term name="opus">
      <single>Opus</single>
      <multiple>Opera</multiple>
    </term>
    <term name="page">
      <single>Seite</single>
      <multiple>Seiten</multiple>
    </term>
    <term name="number-of-pages">
      <single>Seite</single>
      <multiple>Seiten</multiple>
    </term>
    <term name="paragraph">
      <single>Absatz</single>
      <multiple>Abs\xE4tze</multiple>
    </term>
    <term name="part">
      <single>Teil</single>
      <multiple>Teile</multiple>
    </term>
    <term name="section">
      <single>Abschnitt</single>
      <multiple>Abschnitte</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>Vers</single>
      <multiple>Verse</multiple>
    </term>
    <term name="volume">
      <single>Band</single>
      <multiple>B\xE4nde</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">B.</term>
    <term name="chapter" form="short">Kap.</term>
    <term name="column" form="short">Sp.</term>
    <term name="figure" form="short">Abb.</term>
    <term name="folio" form="short">Fol.</term>
    <term name="issue" form="short">Nr.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>S.</single>
      <multiple>S.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>S.</single>
      <multiple>S.</multiple>
    </term>
    <term name="paragraph" form="short">Abs.</term>
    <term name="part" form="short">Teil</term>
    <term name="section" form="short">Abschn.</term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>V.</single>
      <multiple>V.</multiple>
    </term>
    <term name="volume" form="short">
      <single>Bd.</single>
      <multiple>Bd.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>Regisseur</single>
      <multiple>Regisseure</multiple>
    </term>
    <term name="editor">
      <single>Herausgeber</single>
      <multiple>Herausgeber</multiple>
    </term>
    <term name="collection-editor">
      <single>Reihenherausgeber</single>
      <multiple>Reihenherausgeber</multiple>
    </term>
    <term name="editorial-director">
      <single>Herausgeber</single>
      <multiple>Herausgeber</multiple>
    </term>
    <term name="illustrator">
      <single>Illustrator</single>
      <multiple>Illustratoren</multiple>
    </term>
    <term name="translator">
      <single>\xDCbersetzer</single>
      <multiple>\xDCbersetzer</multiple>
    </term>
    <term name="editortranslator">
      <single>Herausgeber&#160;&amp; \xDCbersetzer</single>
      <multiple>Herausgeber&#160;&amp; \xDCbersetzer</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>Reg.</single>
      <multiple>Reg.</multiple>
    </term>
    <term name="editor" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="collection-editor" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>Ill.</single>
      <multiple>Ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\xDCbers.</single>
      <multiple>\xDCbers.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>Hrsg.&#160;&amp; \xDCbers.</single>
      <multiple>Hrsg.&#160;&amp; \xDCbers</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">von</term>
    <term name="director" form="verb">Regie von</term>
    <term name="editor" form="verb">herausgegeben von</term>
    <term name="collection-editor" form="verb">herausgegeben von</term>
    <term name="editorial-director" form="verb">herausgegeben von</term>
    <term name="illustrator" form="verb">illustriert von</term>
    <term name="interviewer" form="verb">interviewt von</term>
    <term name="recipient" form="verb">an</term>
    <term name="reviewed-author" form="verb">von</term>
    <term name="translator" form="verb">\xFCbersetzt von</term>
    <term name="editortranslator" form="verb">herausgegeben und \xFCbersetzt von</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">Reg.</term>
    <term name="editor" form="verb-short">hg. von</term>
    <term name="collection-editor" form="verb-short">hg. von</term>
    <term name="editorial-director" form="verb-short">hg. von</term>
    <term name="illustrator" form="verb-short">illus. von</term>
    <term name="translator" form="verb-short">\xFCbers. von</term>
    <term name="editortranslator" form="verb-short">hg.&#160;&amp; \xFCbers. von</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">J\xE4nner</term>
    <term name="month-02">Februar</term>
    <term name="month-03">M\xE4rz</term>
    <term name="month-04">April</term>
    <term name="month-05">Mai</term>
    <term name="month-06">Juni</term>
    <term name="month-07">Juli</term>
    <term name="month-08">August</term>
    <term name="month-09">September</term>
    <term name="month-10">Oktober</term>
    <term name="month-11">November</term>
    <term name="month-12">Dezember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">J\xE4n.</term>
    <term name="month-02" form="short">Feb.</term>
    <term name="month-03" form="short">M\xE4rz</term>
    <term name="month-04" form="short">Apr.</term>
    <term name="month-05" form="short">Mai</term>
    <term name="month-06" form="short">Juni</term>
    <term name="month-07" form="short">Juli</term>
    <term name="month-08" form="short">Aug.</term>
    <term name="month-09" form="short">Sep.</term>
    <term name="month-10" form="short">Okt.</term>
    <term name="month-11" form="short">Nov.</term>
    <term name="month-12" form="short">Dez.</term>

    <!-- SEASONS -->
    <term name="season-01">Fr\xFChjahr</term>
    <term name="season-02">Sommer</term>
    <term name="season-03">Herbst</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"de-CH":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="de-CH">
  <info>
    <translator>
      <name>Till A. Heilmann</name>
    </translator>
    <translator>
      <name>Sylvester Keil</name>
    </translator>
    <translator>
      <name>jakov</name>
    </translator>
    <translator>
      <name>Sebastian Karcher</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">zugegriffen</term>
    <term name="and">und</term>
    <term name="and others">und andere</term>
    <term name="anonymous">ohne Autor</term>
    <term name="anonymous" form="short">o.&#160;A.</term>
    <term name="at">auf</term>
    <term name="available at">verf\xFCgbar unter</term>
    <term name="by">von</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">ca.</term>
    <term name="cited">zitiert</term>
    <term name="edition">
      <single>Auflage</single>
      <multiple>Auflagen</multiple>
    </term>
    <term name="edition" form="short">Aufl.</term>
    <term name="et-al">u.&#160;a.</term>
    <term name="forthcoming">i.&#160;E.</term>
    <term name="from">von</term>
    <term name="ibid">ebd.</term>
    <term name="in">in</term>
    <term name="in press">im Druck</term>
    <term name="internet">Internet</term>
    <term name="interview">Interview</term>
    <term name="letter">Brief</term>
    <term name="no date">ohne Datum</term>
    <term name="no date" form="short">o.&#160;J.</term>
    <term name="online">online</term>
    <term name="presented at">gehalten auf der</term>
    <term name="reference">
      <single>Referenz</single>
      <multiple>Referenzen</multiple>
    </term>
    <term name="reference" form="short">
      <single>Ref.</single>
      <multiple>Ref.</multiple>
    </term>
    <term name="retrieved">abgerufen</term>
    <term name="scale">Massstab</term>
    <term name="version">Version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">&#160;n.&#160;Chr.</term>
    <term name="bc">&#160;v.&#160;Chr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u2039</term>
    <term name="close-inner-quote">\u203A</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">erster</term>
    <term name="long-ordinal-02">zweiter</term>
    <term name="long-ordinal-03">dritter</term>
    <term name="long-ordinal-04">vierter</term>
    <term name="long-ordinal-05">f\xFCnfter</term>
    <term name="long-ordinal-06">sechster</term>
    <term name="long-ordinal-07">siebter</term>
    <term name="long-ordinal-08">achter</term>
    <term name="long-ordinal-09">neunter</term>
    <term name="long-ordinal-10">zehnter</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>Buch</single>
      <multiple>B\xFCcher</multiple>
    </term>
    <term name="chapter">
      <single>Kapitel</single>
      <multiple>Kapitel</multiple>
    </term>
    <term name="column">
      <single>Spalte</single>
      <multiple>Spalten</multiple>
    </term>
    <term name="figure">
      <single>Abbildung</single>
      <multiple>Abbildungen</multiple>
    </term>
    <term name="folio">
      <single>Blatt</single>
      <multiple>Bl\xE4tter</multiple>
    </term>
    <term name="issue">
      <single>Nummer</single>
      <multiple>Nummern</multiple>
    </term>
    <term name="line">
      <single>Zeile</single>
      <multiple>Zeilen</multiple>
    </term>
    <term name="note">
      <single>Note</single>
      <multiple>Noten</multiple>
    </term>
    <term name="opus">
      <single>Opus</single>
      <multiple>Opera</multiple>
    </term>
    <term name="page">
      <single>Seite</single>
      <multiple>Seiten</multiple>
    </term>
    <term name="number-of-pages">
      <single>Seite</single>
      <multiple>Seiten</multiple>
    </term>
    <term name="paragraph">
      <single>Absatz</single>
      <multiple>Abs\xE4tze</multiple>
    </term>
    <term name="part">
      <single>Teil</single>
      <multiple>Teile</multiple>
    </term>
    <term name="section">
      <single>Abschnitt</single>
      <multiple>Abschnitte</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>Vers</single>
      <multiple>Verse</multiple>
    </term>
    <term name="volume">
      <single>Band</single>
      <multiple>B\xE4nde</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">B.</term>
    <term name="chapter" form="short">Kap.</term>
    <term name="column" form="short">Sp.</term>
    <term name="figure" form="short">Abb.</term>
    <term name="folio" form="short">Fol.</term>
    <term name="issue" form="short">Nr.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>S.</single>
      <multiple>S.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>S.</single>
      <multiple>S.</multiple>
    </term>
    <term name="paragraph" form="short">Abs.</term>
    <term name="part" form="short">Teil</term>
    <term name="section" form="short">Abschn.</term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>V.</single>
      <multiple>V.</multiple>
    </term>
    <term name="volume" form="short">
      <single>Bd.</single>
      <multiple>Bd.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>Regisseur</single>
      <multiple>Regisseure</multiple>
    </term>
    <term name="editor">
      <single>Herausgeber</single>
      <multiple>Herausgeber</multiple>
    </term>
    <term name="editorial-director">
      <single>Herausgeber</single>
      <multiple>Herausgeber</multiple>
    </term>
    <term name="illustrator">
      <single>Illustrator</single>
      <multiple>Illustratoren</multiple>
    </term>
    <term name="translator">
      <single>\xDCbersetzer</single>
      <multiple>\xDCbersetzer</multiple>
    </term>
    <term name="editortranslator">
      <single>Herausgeber&#160;&amp; \xDCbersetzer</single>
      <multiple>Herausgeber&#160;&amp; \xDCbersetzer</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>Reg.</single>
      <multiple>Reg.</multiple>
    </term>
    <term name="editor" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>Ill.</single>
      <multiple>Ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\xDCbers.</single>
      <multiple>\xDCbers.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>Hrsg.&#160;&amp; \xDCbers.</single>
      <multiple>Hrsg.&#160;&amp; \xDCbers</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">von</term>
    <term name="director" form="verb">Regie von</term>
    <term name="editor" form="verb">herausgegeben von</term>
    <term name="editorial-director" form="verb">herausgegeben von</term>
    <term name="illustrator" form="verb">illustriert von</term>
    <term name="interviewer" form="verb">interviewt von</term>
    <term name="recipient" form="verb">an</term>
    <term name="reviewed-author" form="verb">von</term>
    <term name="translator" form="verb">\xFCbersetzt von</term>
    <term name="editortranslator" form="verb">herausgegeben und \xFCbersetzt von</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">Reg.</term>
    <term name="editor" form="verb-short">hg. von</term>
    <term name="editorial-director" form="verb-short">hg. von</term>
    <term name="illustrator" form="verb-short">illus. von</term>
    <term name="translator" form="verb-short">\xFCbers. von</term>
    <term name="editortranslator" form="verb-short">hg.&#160;&amp; \xFCbers. von</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Januar</term>
    <term name="month-02">Februar</term>
    <term name="month-03">M\xE4rz</term>
    <term name="month-04">April</term>
    <term name="month-05">Mai</term>
    <term name="month-06">Juni</term>
    <term name="month-07">Juli</term>
    <term name="month-08">August</term>
    <term name="month-09">September</term>
    <term name="month-10">Oktober</term>
    <term name="month-11">November</term>
    <term name="month-12">Dezember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan.</term>
    <term name="month-02" form="short">Feb.</term>
    <term name="month-03" form="short">M\xE4rz</term>
    <term name="month-04" form="short">Apr.</term>
    <term name="month-05" form="short">Mai</term>
    <term name="month-06" form="short">Juni</term>
    <term name="month-07" form="short">Juli</term>
    <term name="month-08" form="short">Aug.</term>
    <term name="month-09" form="short">Sep.</term>
    <term name="month-10" form="short">Okt.</term>
    <term name="month-11" form="short">Nov.</term>
    <term name="month-12" form="short">Dez.</term>

    <!-- SEASONS -->
    <term name="season-01">Fr\xFChjahr</term>
    <term name="season-02">Sommer</term>
    <term name="season-03">Herbst</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"de-DE":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="de-DE">
  <info>
    <translator>
      <name>Till A. Heilmann</name>
    </translator>
    <translator>
      <name>Ulrich</name>
    </translator>
    <translator>
      <name>Rintze M. Zelle</name>
    </translator>
    <translator>
      <name>Sebastian Karcher</name>
    </translator>
    <translator>
      <name>jakov</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">zugegriffen</term>
    <term name="and">und</term>
    <term name="and others">und andere</term>
    <term name="anonymous">ohne Autor</term>
    <term name="anonymous" form="short">o.&#160;A.</term>
    <term name="at">auf</term>
    <term name="available at">verf\xFCgbar unter</term>
    <term name="by">von</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">ca.</term>
    <term name="cited">zitiert</term>
    <term name="edition">
      <single>Auflage</single>
      <multiple>Auflagen</multiple>
    </term>
    <term name="edition" form="short">Aufl.</term>
    <term name="et-al">u.&#160;a.</term>
    <term name="forthcoming">i.&#160;E.</term>
    <term name="from">von</term>
    <term name="ibid">ebd.</term>
    <term name="in">in</term>
    <term name="in press">im Druck</term>
    <term name="internet">Internet</term>
    <term name="interview">Interview</term>
    <term name="letter">Brief</term>
    <term name="no date">ohne Datum</term>
    <term name="no date" form="short">o.&#160;J.</term>
    <term name="online">online</term>
    <term name="presented at">gehalten auf der</term>
    <term name="reference">
      <single>Referenz</single>
      <multiple>Referenzen</multiple>
    </term>
    <term name="reference" form="short">
      <single>Ref.</single>
      <multiple>Ref.</multiple>
    </term>
    <term name="retrieved">abgerufen</term>
    <term name="scale">Ma\xDFstab</term>
    <term name="version">Version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">&#160;n.&#160;Chr.</term>
    <term name="bc">&#160;v.&#160;Chr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u201A</term>
    <term name="close-inner-quote">\u2018</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">erster</term>
    <term name="long-ordinal-02">zweiter</term>
    <term name="long-ordinal-03">dritter</term>
    <term name="long-ordinal-04">vierter</term>
    <term name="long-ordinal-05">f\xFCnfter</term>
    <term name="long-ordinal-06">sechster</term>
    <term name="long-ordinal-07">siebter</term>
    <term name="long-ordinal-08">achter</term>
    <term name="long-ordinal-09">neunter</term>
    <term name="long-ordinal-10">zehnter</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>Buch</single>
      <multiple>B\xFCcher</multiple>
    </term>
    <term name="chapter">
      <single>Kapitel</single>
      <multiple>Kapitel</multiple>
    </term>
    <term name="column">
      <single>Spalte</single>
      <multiple>Spalten</multiple>
    </term>
    <term name="figure">
      <single>Abbildung</single>
      <multiple>Abbildungen</multiple>
    </term>
    <term name="folio">
      <single>Blatt</single>
      <multiple>Bl\xE4tter</multiple>
    </term>
    <term name="issue">
      <single>Nummer</single>
      <multiple>Nummern</multiple>
    </term>
    <term name="line">
      <single>Zeile</single>
      <multiple>Zeilen</multiple>
    </term>
    <term name="note">
      <single>Note</single>
      <multiple>Noten</multiple>
    </term>
    <term name="opus">
      <single>Opus</single>
      <multiple>Opera</multiple>
    </term>
    <term name="page">
      <single>Seite</single>
      <multiple>Seiten</multiple>
    </term>
    <term name="number-of-pages">
      <single>Seite</single>
      <multiple>Seiten</multiple>
    </term>
    <term name="paragraph">
      <single>Absatz</single>
      <multiple>Abs\xE4tze</multiple>
    </term>
    <term name="part">
      <single>Teil</single>
      <multiple>Teile</multiple>
    </term>
    <term name="section">
      <single>Abschnitt</single>
      <multiple>Abschnitte</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>Vers</single>
      <multiple>Verse</multiple>
    </term>
    <term name="volume">
      <single>Band</single>
      <multiple>B\xE4nde</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">B.</term>
    <term name="chapter" form="short">Kap.</term>
    <term name="column" form="short">Sp.</term>
    <term name="figure" form="short">Abb.</term>
    <term name="folio" form="short">Fol.</term>
    <term name="issue" form="short">Nr.</term>
    <term name="line" form="short">Z.</term>
    <term name="note" form="short">N.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>S.</single>
      <multiple>S.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>S.</single>
      <multiple>S.</multiple>
    </term>
    <term name="paragraph" form="short">Abs.</term>
    <term name="part" form="short">Teil</term>
    <term name="section" form="short">Abschn.</term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>V.</single>
      <multiple>V.</multiple>
    </term>
    <term name="volume" form="short">
      <single>Bd.</single>
      <multiple>Bde.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>Regisseur</single>
      <multiple>Regisseure</multiple>
    </term>
    <term name="editor">
      <single>Herausgeber</single>
      <multiple>Herausgeber</multiple>
    </term>
    <term name="collection-editor">
      <single>Reihenherausgeber</single>
      <multiple>Reihenherausgeber</multiple>
    </term>
    <term name="editorial-director">
      <single>Herausgeber</single>
      <multiple>Herausgeber</multiple>
    </term>
    <term name="illustrator">
      <single>Illustrator</single>
      <multiple>Illustratoren</multiple>
    </term>
    <term name="translator">
      <single>\xDCbersetzer</single>
      <multiple>\xDCbersetzer</multiple>
    </term>
    <term name="editortranslator">
      <single>Herausgeber&#160;&amp; \xDCbersetzer</single>
      <multiple>Herausgeber&#160;&amp; \xDCbersetzer</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>Reg.</single>
      <multiple>Reg.</multiple>
    </term>
    <term name="editor" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="collection-editor" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>Hrsg.</single>
      <multiple>Hrsg.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>Ill.</single>
      <multiple>Ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\xDCbers.</single>
      <multiple>\xDCbers.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>Hrsg.&#160;&amp; \xDCbers.</single>
      <multiple>Hrsg.&#160;&amp; \xDCbers</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">von</term>
    <term name="director" form="verb">Regie von</term>
    <term name="editor" form="verb">herausgegeben von</term>
    <term name="collection-editor" form="verb">herausgegeben von</term>
    <term name="editorial-director" form="verb">herausgegeben von</term>
    <term name="illustrator" form="verb">illustriert von</term>
    <term name="interviewer" form="verb">interviewt von</term>
    <term name="recipient" form="verb">an</term>
    <term name="reviewed-author" form="verb">von</term>
    <term name="translator" form="verb">\xFCbersetzt von</term>
    <term name="editortranslator" form="verb">herausgegeben und \xFCbersetzt von</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">Reg.</term>
    <term name="editor" form="verb-short">hg. von</term>
    <term name="collection-editor" form="verb-short">hg. von</term>
    <term name="editorial-director" form="verb-short">hg. von</term>
    <term name="illustrator" form="verb-short">illus. von</term>
    <term name="translator" form="verb-short">\xFCbers. von</term>
    <term name="editortranslator" form="verb-short">hg.&#160;&amp; \xFCbers. von</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Januar</term>
    <term name="month-02">Februar</term>
    <term name="month-03">M\xE4rz</term>
    <term name="month-04">April</term>
    <term name="month-05">Mai</term>
    <term name="month-06">Juni</term>
    <term name="month-07">Juli</term>
    <term name="month-08">August</term>
    <term name="month-09">September</term>
    <term name="month-10">Oktober</term>
    <term name="month-11">November</term>
    <term name="month-12">Dezember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan.</term>
    <term name="month-02" form="short">Feb.</term>
    <term name="month-03" form="short">M\xE4rz</term>
    <term name="month-04" form="short">Apr.</term>
    <term name="month-05" form="short">Mai</term>
    <term name="month-06" form="short">Juni</term>
    <term name="month-07" form="short">Juli</term>
    <term name="month-08" form="short">Aug.</term>
    <term name="month-09" form="short">Sep.</term>
    <term name="month-10" form="short">Okt.</term>
    <term name="month-11" form="short">Nov.</term>
    <term name="month-12" form="short">Dez.</term>

    <!-- SEASONS -->
    <term name="season-01">Fr\xFChjahr</term>
    <term name="season-02">Sommer</term>
    <term name="season-03">Herbst</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"el-GR":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="el-GR">
  <info>
    <translator>
      <name>thanasis57</name>
    </translator>
    <translator>
      <name>dimtamb</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2013-11-08T20:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u03B7\u03BC\u03B5\u03C1\u03BF\u03BC\u03B7\u03BD\u03AF\u03B1 \u03C0\u03C1\u03CC\u03C3\u03B2\u03B1\u03C3\u03B7\u03C2</term>
    <term name="and">\u03BA\u03B1\u03B9</term>
    <term name="and others">\u03BA\u03B1\u03B9 \u03AC\u03BB\u03BB\u03BF\u03B9</term>
    <term name="anonymous">\u03B1\u03BD\u03CE\u03BD\u03C5\u03BC\u03BF</term>
    <term name="anonymous" form="short">\u03B1\u03BD\u03CE\u03BD.</term>
    <term name="at">\u03B5\u03C6.</term>
    <term name="available at">\u03B4\u03B9\u03B1\u03B8\u03AD\u03C3\u03B9\u03BC\u03BF \u03C3\u03C4\u03BF</term>
    <term name="by">\u03B1\u03C0\u03CC</term>
    <term name="circa">\u03C0\u03B5\u03C1\u03AF\u03C0\u03BF\u03C5</term>
    <term name="circa" form="short">\u03C0\u03B5\u03C1.</term>
    <term name="cited">\u03C0\u03B1\u03C1\u03B1\u03C4\u03AF\u03B8\u03B5\u03C4\u03B1\u03B9</term>
    <term name="edition" gender="feminine">
      <single>\u03AD\u03BA\u03B4\u03BF\u03C3\u03B7</single>
      <multiple>\u03B5\u03BA\u03B4\u03CC\u03C3\u03B5\u03B9\u03C2</multiple>
    </term>
    <term name="edition" form="short">\u03AD\u03BA\u03B4.</term>
    <term name="et-al">\u03BA.\u03AC.</term>
    <term name="forthcoming">\u03C0\u03C1\u03BF\u03C3\u03B5\u03C7\u03AD\u03C2</term>
    <term name="from">\u03B1\u03C0\u03CC</term>
    <term name="ibid">\u03C3\u03C4\u03BF \u03AF\u03B4\u03B9\u03BF</term>
    <term name="in">\u03C3\u03C4\u03BF</term>
    <term name="in press">\u03C5\u03C0\u03CC \u03AD\u03BA\u03B4\u03BF\u03C3\u03B7</term>
    <term name="internet">\u03B4\u03B9\u03B1\u03B4\u03AF\u03BA\u03C4\u03C5\u03BF</term>
    <term name="interview">\u03C3\u03C5\u03BD\u03AD\u03BD\u03C4\u03B5\u03C5\u03BE\u03B7</term>
    <term name="letter">\u03B5\u03C0\u03B9\u03C3\u03C4\u03BF\u03BB\u03AE</term>
    <term name="no date">\u03C7\u03C9\u03C1\u03AF\u03C2 \u03C7\u03C1\u03BF\u03BD\u03BF\u03BB\u03BF\u03B3\u03AF\u03B1</term>
    <term name="no date" form="short">\u03C7.\u03C7.</term>
    <term name="online">\u03AD\u03BA\u03B4\u03BF\u03C3\u03B7 \u03C3\u03B5 \u03C8\u03B7\u03C6\u03B9\u03B1\u03BA\u03AE \u03BC\u03BF\u03C1\u03C6\u03AE</term>
    <term name="presented at">\u03C0\u03B1\u03C1\u03BF\u03C5\u03C3\u03B9\u03AC\u03C3\u03C4\u03B7\u03BA\u03B5 \u03C3\u03C4\u03BF</term>
    <term name="reference">
      <single>\u03C0\u03B1\u03C1\u03B1\u03C0\u03BF\u03BC\u03C0\u03AE</single>
      <multiple>\u03C0\u03B1\u03C1\u03B1\u03C0\u03BF\u03BC\u03C0\u03AD\u03C2</multiple>
    </term>
    <term name="reference" form="short">
      <single>\u03C0\u03B1\u03C1.</single>
      <multiple>\u03C0\u03B1\u03C1.</multiple>
    </term>
    <term name="retrieved">\u03B1\u03BD\u03B1\u03BA\u03C4\u03AE\u03B8\u03B7\u03BA\u03B5</term>
    <term name="scale">\u03BA\u03BB\u03AF\u03BC\u03B1\u03BA\u03B1</term>
    <term name="version">\u03B5\u03BA\u03B4\u03BF\u03C7\u03AE</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u03BC.\u03A7.</term>
    <term name="bc">\u03C0.\u03A7.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u2018</term>
    <term name="close-quote">\u2019</term>
    <term name="open-inner-quote">'</term>
    <term name="close-inner-quote">'</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">\u03BF</term>
    <term name="ordinal-01" gender-form="feminine" match="whole-number">\u03B7</term>
    <term name="ordinal-01" gender-form="masculine" match="whole-number">\u03BF\u03C2</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u03C0\u03C1\u03CE\u03C4\u03BF\u03C2</term>
    <term name="long-ordinal-02">\u03B4\u03B5\u03CD\u03C4\u03B5\u03C1\u03BF\u03C2</term>
    <term name="long-ordinal-03">\u03C4\u03C1\u03AF\u03C4\u03BF\u03C2</term>
    <term name="long-ordinal-04">\u03C4\u03AD\u03C4\u03B1\u03C1\u03C4\u03BF\u03C2</term>
    <term name="long-ordinal-05">\u03C0\u03AD\u03BC\u03C0\u03C4\u03BF\u03C2</term>
    <term name="long-ordinal-06">\u03AD\u03BA\u03C4\u03BF\u03C2</term>
    <term name="long-ordinal-07">\u03AD\u03B2\u03B4\u03BF\u03BC\u03BF\u03C2</term>
    <term name="long-ordinal-08">\u03CC\u03B3\u03B4\u03BF\u03BF\u03C2</term>
    <term name="long-ordinal-09">\u03AD\u03BD\u03B1\u03C4\u03BF\u03C2</term>
    <term name="long-ordinal-10">\u03B4\u03AD\u03BA\u03B1\u03C4\u03BF\u03C2</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u03B2\u03B9\u03B2\u03BB\u03AF\u03BF</single>
      <multiple>\u03B2\u03B9\u03B2\u03BB\u03AF\u03B1</multiple>
    </term>
    <term name="chapter">
      <single>\u03BA\u03B5\u03C6\u03AC\u03BB\u03B1\u03B9\u03BF</single>
      <multiple>\u03BA\u03B5\u03C6\u03AC\u03BB\u03B1\u03B9\u03B1</multiple>
    </term>
    <term name="column">
      <single>\u03C3\u03C4\u03AE\u03BB\u03B7</single>
      <multiple>\u03C3\u03C4\u03AE\u03BB\u03B5\u03C2</multiple>
    </term>
    <term name="figure">
      <single>\u03B5\u03B9\u03BA\u03CC\u03BD\u03B1</single>
      <multiple>\u03B5\u03B9\u03BA\u03CC\u03BD\u03B5\u03C2</multiple>
    </term>
    <term name="folio">
      <single>\u03C6\u03AC\u03BA\u03B5\u03BB\u03BF\u03C2</single>
      <multiple>\u03C6\u03AC\u03BA\u03B5\u03BB\u03BF\u03B9</multiple>
    </term>
    <term name="issue">
      <single>\u03C4\u03B5\u03CD\u03C7\u03BF\u03C2</single>
      <multiple>\u03C4\u03B5\u03CD\u03C7\u03B7</multiple>
    </term>
    <term name="line">
      <single>\u03C3\u03B5\u03B9\u03C1\u03AC</single>
      <multiple>\u03C3\u03B5\u03B9\u03C1\u03AD\u03C2</multiple>
    </term>
    <term name="note">
      <single>\u03C3\u03B7\u03BC\u03B5\u03AF\u03C9\u03C3\u03B7</single>
      <multiple>\u03C3\u03B7\u03BC\u03B5\u03B9\u03CE\u03C3\u03B5\u03B9\u03C2</multiple>
    </term>
    <term name="opus">
      <single>\u03AD\u03C1\u03B3\u03BF</single>
      <multiple>\u03AD\u03C1\u03B3\u03B1</multiple>
    </term>
    <term name="page">
      <single>\u03C3\u03B5\u03BB\u03AF\u03B4\u03B1</single>
      <multiple>\u03C3\u03B5\u03BB\u03AF\u03B4\u03B5\u03C2</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u03C3\u03B5\u03BB\u03AF\u03B4\u03B1</single>
      <multiple>\u03C3\u03B5\u03BB\u03AF\u03B4\u03B5\u03C2</multiple>
    </term>
    <term name="paragraph">
      <single>\u03C0\u03B1\u03C1\u03AC\u03B3\u03C1\u03B1\u03C6\u03BF\u03C2</single>
      <multiple>\u03C0\u03B1\u03C1\u03AC\u03B3\u03C1\u03B1\u03C6\u03BF\u03B9</multiple>
    </term>
    <term name="part">
      <single>\u03BC\u03AD\u03C1\u03BF\u03C2</single>
      <multiple>\u03BC\u03AD\u03C1\u03B7</multiple>
    </term>
    <term name="section">
      <single>\u03C4\u03BC\u03AE\u03BC\u03B1</single>
      <multiple>\u03C4\u03BC\u03AE\u03BC\u03B1\u03C4\u03B1</multiple>
    </term>
    <term name="sub verbo">
      <single>\u03BB\u03AE\u03BC\u03BC\u03B1</single>
      <multiple>\u03BB\u03AE\u03BC\u03BC\u03B1\u03C4\u03B1</multiple>
    </term>
    <term name="verse">
      <single>\u03C3\u03C4\u03AF\u03C7\u03BF\u03C2</single>
      <multiple>\u03C3\u03C4\u03AF\u03C7\u03BF\u03B9</multiple>
    </term>
    <term name="volume">
      <single>\u03C4\u03CC\u03BC\u03BF\u03C2</single>
      <multiple>\u03C4\u03CC\u03BC\u03BF\u03B9</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u03B2\u03B9\u03B2.</term>
    <term name="chapter" form="short">\u03BA\u03B5\u03C6.</term>
    <term name="column" form="short">\u03C3\u03C4.</term>
    <term name="figure" form="short">\u03B5\u03B9\u03BA.</term>
    <term name="folio" form="short">\u03C6\u03AC\u03BA</term>
    <term name="issue" form="short">\u03C4\u03C7.</term>
    <term name="line" form="short">\u03B3\u03C1.</term>
    <term name="note" form="short">\u03C3\u03B7\u03BC.</term>
    <term name="opus" form="short">\u03AD\u03C1\u03B3.</term>
    <term name="page" form="short">
      <single>\u03C3.</single>
      <multiple>\u03C3\u03C3.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>\u03C3.</single>
      <multiple>\u03C3\u03C3.</multiple>
    </term>
    <term name="paragraph" form="short">\u03C0\u03B1\u03C1.</term>
    <term name="part" form="short">\u03BC\u03AD\u03C1.</term>
    <term name="section" form="short">\u03C4\u03BC.</term>
    <term name="sub verbo" form="short">
      <single>\u03BB\u03AE\u03BC.</single>
      <multiple>\u03BB\u03AE\u03BC.</multiple>
    </term>
    <term name="verse" form="short">
      <single>\u03C3\u03C4.</single>
      <multiple>\u03C3\u03C4.</multiple>
    </term>
    <term name="volume" form="short">
      <single>\u03C4.</single>
      <multiple>\u03C4.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>\u0394\u03B9\u03B5\u03C5\u03B8\u03C5\u03BD\u03C4\u03AE\u03C2</single>
      <multiple>\u0394\u03B9\u03B5\u03C5\u03B8\u03C5\u03BD\u03C4\u03AD\u03C2</multiple>
    </term>
    <term name="editor">
      <single>\u03B5\u03C0\u03B9\u03BC\u03B5\u03BB\u03B7\u03C4\u03AE\u03C2</single>
      <multiple>\u03B5\u03C0\u03B9\u03BC\u03B5\u03BB\u03B7\u03C4\u03AD\u03C2</multiple>
    </term>
    <term name="editorial-director">
      <single>\u03B4\u03B9\u03B5\u03C5\u03B8\u03C5\u03BD\u03C4\u03AE\u03C2 \u03C3\u03B5\u03B9\u03C1\u03AC\u03C2</single>
      <multiple>\u03B4\u03B9\u03B5\u03C5\u03B8\u03C5\u03BD\u03C4\u03AD\u03C2 \u03C3\u03B5\u03B9\u03C1\u03AC\u03C2</multiple>
    </term>
    <term name="illustrator">
      <single>\u03B5\u03B9\u03BA\u03BF\u03BD\u03BF\u03B3\u03C1\u03AC\u03C6\u03BF\u03C2</single>
      <multiple>\u03B5\u03B9\u03BA\u03BF\u03BD\u03BF\u03B3\u03C1\u03AC\u03C6\u03BF\u03B9</multiple>
    </term>
    <term name="translator">
      <single>\u03BC\u03B5\u03C4\u03B1\u03C6\u03C1\u03B1\u03C3\u03C4\u03AE\u03C2</single>
      <multiple>\u03BC\u03B5\u03C4\u03B1\u03C6\u03C1\u03B1\u03C3\u03C4\u03AD\u03C2</multiple>
    </term>
    <term name="editortranslator">
      <single>\u03BC\u03B5\u03C4\u03B1\u03C6\u03C1\u03B1\u03C3\u03C4\u03AE\u03C2 \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BC\u03B5\u03BB\u03B7\u03C4\u03AE\u03C2</single>
      <multiple>\u03BC\u03B5\u03C4\u03B1\u03C6\u03C1\u03B1\u03C3\u03C4\u03AD\u03C2 \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BC\u03B5\u03BB\u03B7\u03C4\u03AD\u03C2</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>\u03B4/\u03BD\u03C4\u03B7\u03C2.</single>
      <multiple>\u03B4/\u03BD\u03C4\u03AD\u03C2.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\u03B5\u03C0\u03B9\u03BC.</single>
      <multiple>\u03B5\u03C0\u03B9\u03BC.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>\u03B4/\u03BD\u03C4\u03AE\u03C2 \u03C3\u03B5\u03B9\u03C1\u03AC\u03C2</single>
      <multiple>\u03B4/\u03BD\u03C4\u03AD\u03C2 \u03C3\u03B5\u03B9\u03C1\u03B1\u03C2</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>\u03B5\u03B9\u03BA.</single>
      <multiple>\u03B5\u03B9\u03BA..</multiple>
    </term>
    <term name="translator" form="short">
      <single>\u03BC\u03C4\u03C6.</single>
      <multiple>\u03BC\u03C4\u03C6.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>\u03BC\u03C4\u03C6. \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BC.</single>
      <multiple>\u03BC\u03C4\u03C6. \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BC.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">\u03C3\u03C4\u03BF\u03BD \u03C3\u03C5\u03BB\u03BB. \u03C4\u03CC\u03BC\u03BF</term>
    <term name="director" form="verb">\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7</term>
    <term name="editor" form="verb">\u03B5\u03C0\u03B9\u03BC\u03AD\u03BB\u03B5\u03B9\u03B1</term>
    <term name="editorial-director" form="verb">\u03B4\u03B9\u03B5\u03CD\u03B8\u03C5\u03BD\u03C3\u03B7 \u03C3\u03B5\u03B9\u03C1\u03AC\u03C2</term>
    <term name="illustrator" form="verb">\u03B5\u03B9\u03BA\u03BF\u03BD\u03BF\u03B3\u03C1\u03AC\u03C6\u03B7\u03C3\u03B7:</term>
    <term name="interviewer" form="verb">\u03C3\u03C5\u03BD\u03AD\u03BD\u03C4\u03B5\u03C5\u03BE\u03B7</term>
    <term name="recipient" form="verb">\u03C0\u03B1\u03C1\u03B1\u03BB\u03AE\u03C0\u03C4\u03B7\u03C2</term>
    <term name="reviewed-author" form="verb">\u03C3\u03C5\u03B3\u03B3\u03C1\u03B1\u03C6\u03AD\u03B1\u03C2:</term>
    <term name="translator" form="verb">\u03BC\u03B5\u03C4\u03AC\u03C6\u03C1\u03B1\u03C3\u03B7</term>
    <term name="editortranslator" form="verb">\u03BC\u03B5\u03C4\u03AC\u03C6\u03C1\u03B1\u03C3\u03B7 \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BC\u03AD\u03BB\u03B5\u03B9\u03B1</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">\u03B4\u03B9\u03B5\u03C5\u03B8.</term>
    <term name="editor" form="verb-short">\u03B5\u03C0\u03B9\u03BC\u03AD\u03BB.</term>
    <term name="editorial-director" form="verb-short">\u03B4/\u03BD\u03C3\u03B7 \u03C3\u03B5\u03B9\u03C1\u03AC\u03C2</term>
    <term name="illustrator" form="verb-short">\u03B5\u03B9\u03BA\u03BF\u03BD.</term>
    <term name="translator" form="verb-short">\u03BC\u03B5\u03C4\u03AC\u03C6\u03C1.</term>
    <term name="editortranslator" form="verb-short">\u03BC\u03B5\u03C4\u03AC\u03C6\u03C1. \u03BA\u03B1\u03B9 \u03B5\u03C0\u03B9\u03BC\u03AD\u03BB.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u0399\u03B1\u03BD\u03BF\u03C5\u03AC\u03C1\u03B9\u03BF\u03C2</term>
    <term name="month-02">\u03A6\u03B5\u03B2\u03C1\u03BF\u03C5\u03AC\u03C1\u03B9\u03BF\u03C2</term>
    <term name="month-03">\u039C\u03AC\u03C1\u03C4\u03B9\u03BF\u03C2</term>
    <term name="month-04">\u0391\u03C0\u03C1\u03AF\u03BB\u03B9\u03BF\u03C2</term>
    <term name="month-05">\u039C\u03AC\u03B9\u03BF\u03C2</term>
    <term name="month-06">\u0399\u03BF\u03CD\u03BD\u03B9\u03BF\u03C2</term>
    <term name="month-07">\u0399\u03BF\u03CD\u03BB\u03B9\u03BF\u03C2</term>
    <term name="month-08">\u0391\u03CD\u03B3\u03BF\u03C5\u03C3\u03C4\u03BF\u03C2</term>
    <term name="month-09">\u03A3\u03B5\u03C0\u03C4\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2</term>
    <term name="month-10">\u039F\u03BA\u03C4\u03CE\u03B2\u03C1\u03B9\u03BF\u03C2</term>
    <term name="month-11">\u039D\u03BF\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2</term>
    <term name="month-12">\u0394\u03B5\u03BA\u03AD\u03BC\u03B2\u03C1\u03B9\u03BF\u03C2</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">\u0399\u03B1\u03BD\u03BF\u03C5\u03B1\u03C1\u03AF\u03BF\u03C5</term>
    <term name="month-02" form="short">\u03A6\u03B5\u03B2\u03C1\u03BF\u03C5\u03B1\u03C1\u03AF\u03BF\u03C5</term>
    <term name="month-03" form="short">\u039C\u03B1\u03C1\u03C4\u03AF\u03BF\u03C5</term>
    <term name="month-04" form="short">\u0391\u03C0\u03C1\u03B9\u03BB\u03AF\u03BF\u03C5</term>
    <term name="month-05" form="short">\u039C\u03B1\u0390\u03BF\u03C5</term>
    <term name="month-06" form="short">\u0399\u03BF\u03C5\u03BD\u03AF\u03BF\u03C5</term>
    <term name="month-07" form="short">\u0399\u03BF\u03C5\u03BB\u03AF\u03BF\u03C5</term>
    <term name="month-08" form="short">\u0391\u03C5\u03B3\u03BF\u03CD\u03C3\u03C4\u03BF\u03C5</term>
    <term name="month-09" form="short">\u03A3\u03B5\u03C0\u03C4\u03B5\u03BC\u03B2\u03C1\u03AF\u03BF\u03C5</term>
    <term name="month-10" form="short">\u039F\u03BA\u03C4\u03C9\u03B2\u03C1\u03AF\u03BF\u03C5</term>
    <term name="month-11" form="short">\u039D\u03BF\u03B5\u03BC\u03B2\u03C1\u03AF\u03BF\u03C5</term>
    <term name="month-12" form="short">\u0394\u03B5\u03BA\u03B5\u03BC\u03B2\u03C1\u03AF\u03BF\u03C5</term>

    <!-- SEASONS -->
    <term name="season-01">\u0386\u03BD\u03BF\u03B9\u03BE\u03B7</term>
    <term name="season-02">\u039A\u03B1\u03BB\u03BF\u03BA\u03B1\u03AF\u03C1\u03B9</term>
    <term name="season-03">\u03A6\u03B8\u03B9\u03BD\u03CC\u03C0\u03C9\u03C1\u03BF</term>
    <term name="season-04">\u03A7\u03B5\u03B9\u03BC\u03CE\u03BD\u03B1\u03C2</term>
  </terms>
</locale>
`,"en-GB":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="en-GB">
  <info>
    <translator>
      <name>Andrew Dunning</name>
    </translator>
    <translator>
      <name>Sebastian Karcher</name>
    </translator>
    <translator>
      <name>Rintze M. Zelle</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2015-10-10T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">accessed</term>
    <term name="and">and</term>
    <term name="and others">and others</term>
    <term name="anonymous">anonymous</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">at</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>edition</single>
      <multiple>editions</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">forthcoming</term>
    <term name="from">from</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">n.d.</term>
    <term name="online">online</term>
    <term name="presented at">presented at the</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">retrieved</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u2018</term>
    <term name="close-quote">\u2019</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">first</term>
    <term name="long-ordinal-02">second</term>
    <term name="long-ordinal-03">third</term>
    <term name="long-ordinal-04">fourth</term>
    <term name="long-ordinal-05">fifth</term>
    <term name="long-ordinal-06">sixth</term>
    <term name="long-ordinal-07">seventh</term>
    <term name="long-ordinal-08">eighth</term>
    <term name="long-ordinal-09">ninth</term>
    <term name="long-ordinal-10">tenth</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>book</single>
      <multiple>books</multiple>
    </term>
    <term name="chapter">
      <single>chapter</single>
      <multiple>chapters</multiple>
    </term>
    <term name="column">
      <single>column</single>
      <multiple>columns</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>number</single>
      <multiple>numbers</multiple>
    </term>
    <term name="line">
      <single>line</single>
      <multiple>lines</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="number-of-pages">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="paragraph">
      <single>paragraph</single>
      <multiple>paragraphs</multiple>
    </term>
    <term name="part">
      <single>part</single>
      <multiple>parts</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">
      <single>bk.</single>
      <multiple>bks</multiple>
    </term>
    <term name="chapter" form="short">
      <single>chap.</single>
      <multiple>chaps</multiple>
    </term>
    <term name="column" form="short">
      <single>col.</single>
      <multiple>cols</multiple>
    </term>
    <term name="figure" form="short">
      <single>fig.</single>
      <multiple>figs</multiple>
    </term>
    <term name="folio" form="short">
      <single>fol.</single>
      <multiple>fols</multiple>
    </term>
    <term name="issue" form="short">
      <single>no.</single>
      <multiple>nos.</multiple>
    </term>
    <term name="line" form="short">
      <single>l.</single>
      <multiple>ll.</multiple>
    </term>
    <term name="note" form="short">
      <single>n.</single>
      <multiple>nn.</multiple>
    </term>
    <term name="opus" form="short">
      <single>op.</single>
      <multiple>opp.</multiple>
    </term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">
      <single>para.</single>
      <multiple>paras</multiple>
    </term>
    <term name="part" form="short">
      <single>pt.</single>
      <multiple>pts</multiple>
    </term>
    <term name="section" form="short">
      <single>sec.</single>
      <multiple>secs</multiple>
    </term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>translator</single>
      <multiple>translators</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>tran.</single>
      <multiple>trans.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">edited by</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">translated by</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir. by</term>
    <term name="editor" form="verb-short">ed. by</term>
    <term name="editorial-director" form="verb-short">ed. by</term>
    <term name="illustrator" form="verb-short">illus. by</term>
    <term name="translator" form="verb-short">trans. by</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">January</term>
    <term name="month-02">February</term>
    <term name="month-03">March</term>
    <term name="month-04">April</term>
    <term name="month-05">May</term>
    <term name="month-06">June</term>
    <term name="month-07">July</term>
    <term name="month-08">August</term>
    <term name="month-09">September</term>
    <term name="month-10">October</term>
    <term name="month-11">November</term>
    <term name="month-12">December</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan.</term>
    <term name="month-02" form="short">Feb.</term>
    <term name="month-03" form="short">Mar.</term>
    <term name="month-04" form="short">Apr.</term>
    <term name="month-05" form="short">May</term>
    <term name="month-06" form="short">Jun.</term>
    <term name="month-07" form="short">Jul.</term>
    <term name="month-08" form="short">Aug.</term>
    <term name="month-09" form="short">Sep.</term>
    <term name="month-10" form="short">Oct.</term>
    <term name="month-11" form="short">Nov.</term>
    <term name="month-12" form="short">Dec.</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"en-US":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="en-US">
  <info>
    <translator>
      <name>Andrew Dunning</name>
    </translator>
    <translator>
      <name>Sebastian Karcher</name>
    </translator>
    <translator>
      <name>Rintze M. Zelle</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2015-10-10T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="true"/>
  <date form="text">
    <date-part name="month" suffix=" "/>
    <date-part name="day" suffix=", "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">accessed</term>
    <term name="and">and</term>
    <term name="and others">and others</term>
    <term name="anonymous">anonymous</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">at</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>edition</single>
      <multiple>editions</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">forthcoming</term>
    <term name="from">from</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">n.d.</term>
    <term name="online">online</term>
    <term name="presented at">presented at the</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">retrieved</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">first</term>
    <term name="long-ordinal-02">second</term>
    <term name="long-ordinal-03">third</term>
    <term name="long-ordinal-04">fourth</term>
    <term name="long-ordinal-05">fifth</term>
    <term name="long-ordinal-06">sixth</term>
    <term name="long-ordinal-07">seventh</term>
    <term name="long-ordinal-08">eighth</term>
    <term name="long-ordinal-09">ninth</term>
    <term name="long-ordinal-10">tenth</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>book</single>
      <multiple>books</multiple>
    </term>
    <term name="chapter">
      <single>chapter</single>
      <multiple>chapters</multiple>
    </term>
    <term name="column">
      <single>column</single>
      <multiple>columns</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>number</single>
      <multiple>numbers</multiple>
    </term>
    <term name="line">
      <single>line</single>
      <multiple>lines</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="number-of-pages">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="paragraph">
      <single>paragraph</single>
      <multiple>paragraphs</multiple>
    </term>
    <term name="part">
      <single>part</single>
      <multiple>parts</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">
      <single>bk.</single>
      <multiple>bks.</multiple>
    </term>
    <term name="chapter" form="short">
      <single>chap.</single>
      <multiple>chaps.</multiple>
    </term>
    <term name="column" form="short">
      <single>col.</single>
      <multiple>cols.</multiple>
    </term>
    <term name="figure" form="short">
      <single>fig.</single>
      <multiple>figs.</multiple>
    </term>
    <term name="folio" form="short">
      <single>fol.</single>
      <multiple>fols.</multiple>
    </term>
    <term name="issue" form="short">
      <single>no.</single>
      <multiple>nos.</multiple>
    </term>
    <term name="line" form="short">
      <single>l.</single>
      <multiple>ll.</multiple>
    </term>
    <term name="note" form="short">
      <single>n.</single>
      <multiple>nn.</multiple>
    </term>
    <term name="opus" form="short">
      <single>op.</single>
      <multiple>opp.</multiple>
    </term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">
      <single>para.</single>
      <multiple>paras.</multiple>
    </term>
    <term name="part" form="short">
      <single>pt.</single>
      <multiple>pts.</multiple>
    </term>
    <term name="section" form="short">
      <single>sec.</single>
      <multiple>secs.</multiple>
    </term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>translator</single>
      <multiple>translators</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>tran.</single>
      <multiple>trans.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">edited by</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">translated by</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir. by</term>
    <term name="editor" form="verb-short">ed. by</term>
    <term name="editorial-director" form="verb-short">ed. by</term>
    <term name="illustrator" form="verb-short">illus. by</term>
    <term name="translator" form="verb-short">trans. by</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">January</term>
    <term name="month-02">February</term>
    <term name="month-03">March</term>
    <term name="month-04">April</term>
    <term name="month-05">May</term>
    <term name="month-06">June</term>
    <term name="month-07">July</term>
    <term name="month-08">August</term>
    <term name="month-09">September</term>
    <term name="month-10">October</term>
    <term name="month-11">November</term>
    <term name="month-12">December</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan.</term>
    <term name="month-02" form="short">Feb.</term>
    <term name="month-03" form="short">Mar.</term>
    <term name="month-04" form="short">Apr.</term>
    <term name="month-05" form="short">May</term>
    <term name="month-06" form="short">Jun.</term>
    <term name="month-07" form="short">Jul.</term>
    <term name="month-08" form="short">Aug.</term>
    <term name="month-09" form="short">Sep.</term>
    <term name="month-10" form="short">Oct.</term>
    <term name="month-11" form="short">Nov.</term>
    <term name="month-12" form="short">Dec.</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"es-CL":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="es-CL">
  <info>
    <translator>
      <name>Scott Sadowsky</name>
      <uri>http://sadowsky.cl/</uri>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2013-10-28T13:57:31-04:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" de "/>
    <date-part name="month" suffix=" de "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">accedido</term>
    <term name="and">y</term>
    <term name="and others">et&#160;al.</term>
    <term name="anonymous">an\xF3nimo</term>
    <term name="anonymous" form="short">an\xF3n.</term>
    <term name="at">en</term>
    <term name="available at">disponible en</term>
    <term name="by">de</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citado</term>
    <term name="edition">
      <single>edici\xF3n</single>
      <multiple>ediciones</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et&#160;al.</term>
    <term name="forthcoming">en preparaci\xF3n</term>
    <term name="from">a partir de</term>
    <term name="ibid">ibid.</term>
    <term name="in">en</term>
    <term name="in press">en imprenta</term>
    <term name="internet">internet</term>
    <term name="interview">entrevista</term>
    <term name="letter">carta</term>
    <term name="no date">sin fecha</term>
    <term name="no date" form="short">s.&#160;f.</term>
    <term name="online">en l\xEDnea</term>
    <term name="presented at">presentado en</term>
    <term name="reference">
      <single>referencia</single>
      <multiple>referencias</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">recuperado</term>
    <term name="scale">escala</term>
    <term name="version">versi\xF3n</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">d.&#160;C.</term>
    <term name="bc">a.&#160;C.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">\xAA</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">primera</term>
    <term name="long-ordinal-02">segunda</term>
    <term name="long-ordinal-03">tercera</term>
    <term name="long-ordinal-04">cuarta</term>
    <term name="long-ordinal-05">quinta</term>
    <term name="long-ordinal-06">sexta</term>
    <term name="long-ordinal-07">s\xE9ptima</term>
    <term name="long-ordinal-08">octava</term>
    <term name="long-ordinal-09">novena</term>
    <term name="long-ordinal-10">d\xE9cima</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>libro</single>
      <multiple>libros</multiple>
    </term>
    <term name="chapter">
      <single>cap\xEDtulo</single>
      <multiple>cap\xEDtulos</multiple>
    </term>
    <term name="column">
      <single>columna</single>
      <multiple>columnas</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figuras</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>n\xFAmero</single>
      <multiple>n\xFAmeros</multiple>
    </term>
    <term name="line">
      <single>l\xEDnea</single>
      <multiple>l\xEDneas</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notas</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="number-of-pages">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="paragraph">
      <single>p\xE1rrafo</single>
      <multiple>p\xE1rrafos</multiple>
    </term>
    <term name="part">
      <single>parte</single>
      <multiple>partes</multiple>
    </term>
    <term name="section">
      <single>secci\xF3n</single>
      <multiple>secciones</multiple>
    </term>
    <term name="sub verbo">
      <single>sub voce</single>
      <multiple>sub vocibus</multiple>
    </term>
    <term name="verse">
      <single>verso</single>
      <multiple>versos</multiple>
    </term>
    <term name="volume">
      <single>volumen</single>
      <multiple>vol\xFAmenes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">lib.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">n\xBA</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">p\xE1rr.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directores</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="editorial-director">
      <single>coordinador</single>
      <multiple>coordinadores</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrador</single>
      <multiple>ilustradores</multiple>
    </term>
    <term name="translator">
      <single>traductor</single>
      <multiple>traductores</multiple>
    </term>
    <term name="editortranslator">
      <single>editor y traductor</single>
      <multiple>editores y traductores</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>coord.</single>
      <multiple>coords.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ilust.</single>
      <multiple>ilusts.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trads.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. y trad.</single>
      <multiple>eds. y trads.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">de</term>
    <term name="director" form="verb">dirigido por</term>
    <term name="editor" form="verb">editado por</term>
    <term name="editorial-director" form="verb">coordinado por</term>
    <term name="illustrator" form="verb">ilustrado por</term>
    <term name="interviewer" form="verb">entrevistado por</term>
    <term name="recipient" form="verb">a</term>
    <term name="reviewed-author" form="verb">por</term>
    <term name="translator" form="verb">traducido por</term>
    <term name="editortranslator" form="verb">editado y traducido por</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">coord.</term>
    <term name="illustrator" form="verb-short">ilust.</term>
    <term name="translator" form="verb-short">trad.</term>
    <term name="editortranslator" form="verb-short">ed. y trad.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">enero</term>
    <term name="month-02">febrero</term>
    <term name="month-03">marzo</term>
    <term name="month-04">abril</term>
    <term name="month-05">mayo</term>
    <term name="month-06">junio</term>
    <term name="month-07">julio</term>
    <term name="month-08">agosto</term>
    <term name="month-09">septiembre</term>
    <term name="month-10">octubre</term>
    <term name="month-11">noviembre</term>
    <term name="month-12">diciembre</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">ene.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">abr.</term>
    <term name="month-05" form="short">may</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">ago.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dic.</term>

    <!-- SEASONS -->
    <term name="season-01">primavera</term>
    <term name="season-02">verano</term>
    <term name="season-03">oto\xF1o</term>
    <term name="season-04">invierno</term>
  </terms>
</locale>
`,"es-ES":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="es-ES">
  <info>
    <translator>
      <name>javimat</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" de "/>
    <date-part name="month" suffix=" de "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">accedido</term>
    <term name="and">y</term>
    <term name="and others">y otros</term>
    <term name="anonymous">an\xF3nimo</term>
    <term name="anonymous" form="short">an\xF3n.</term>
    <term name="at">en</term>
    <term name="available at">disponible en</term>
    <term name="by">de</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citado</term>
    <term name="edition">
      <single>edici\xF3n</single>
      <multiple>ediciones</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et&#160;al.</term>
    <term name="forthcoming">previsto</term>
    <term name="from">a partir de</term>
    <term name="ibid">ibid.</term>
    <term name="in">en</term>
    <term name="in press">en imprenta</term>
    <term name="internet">internet</term>
    <term name="interview">entrevista</term>
    <term name="letter">carta</term>
    <term name="no date">sin fecha</term>
    <term name="no date" form="short">s.&#160;f.</term>
    <term name="online">en l\xEDnea</term>
    <term name="presented at">presentado en</term>
    <term name="reference">
      <single>referencia</single>
      <multiple>referencias</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">recuperado</term>
    <term name="scale">escala</term>
    <term name="version">versi\xF3n</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">d.&#160;C.</term>
    <term name="bc">a.&#160;C.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">-</term>

    <!-- ORDINALS -->
    <term name="ordinal">.\xAA</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">primera</term>
    <term name="long-ordinal-02">segunda</term>
    <term name="long-ordinal-03">tercera</term>
    <term name="long-ordinal-04">cuarta</term>
    <term name="long-ordinal-05">quinta</term>
    <term name="long-ordinal-06">sexta</term>
    <term name="long-ordinal-07">s\xE9ptima</term>
    <term name="long-ordinal-08">octava</term>
    <term name="long-ordinal-09">novena</term>
    <term name="long-ordinal-10">d\xE9cima</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>libro</single>
      <multiple>libros</multiple>
    </term>
    <term name="chapter">
      <single>cap\xEDtulo</single>
      <multiple>cap\xEDtulos</multiple>
    </term>
    <term name="column">
      <single>columna</single>
      <multiple>columnas</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figuras</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>n\xFAmero</single>
      <multiple>n\xFAmeros</multiple>
    </term>
    <term name="line">
      <single>l\xEDnea</single>
      <multiple>l\xEDneas</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notas</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="number-of-pages">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="paragraph">
      <single>p\xE1rrafo</single>
      <multiple>p\xE1rrafos</multiple>
    </term>
    <term name="part">
      <single>parte</single>
      <multiple>partes</multiple>
    </term>
    <term name="section">
      <single>secci\xF3n</single>
      <multiple>secciones</multiple>
    </term>
    <term name="sub verbo">
      <single>sub voce</single>
      <multiple>sub vocibus</multiple>
    </term>
    <term name="verse">
      <single>verso</single>
      <multiple>versos</multiple>
    </term>
    <term name="volume">
      <single>volumen</single>
      <multiple>vol\xFAmenes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">lib.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">n.\xBA</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">p\xE1rr.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directores</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrador</single>
      <multiple>ilustradores</multiple>
    </term>
    <term name="translator">
      <single>traductor</single>
      <multiple>traductores</multiple>
    </term>
    <term name="editortranslator">
      <single>editor y traductor</single>
      <multiple>editores y traductores</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ilust.</single>
      <multiple>ilusts.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trads.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. y trad.</single>
      <multiple>eds. y trads.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">de</term>
    <term name="director" form="verb">dirigido por</term>
    <term name="editor" form="verb">editado por</term>
    <term name="editorial-director" form="verb">editado por</term>
    <term name="illustrator" form="verb">ilustrado por</term>
    <term name="interviewer" form="verb">entrevistado por</term>
    <term name="recipient" form="verb">a</term>
    <term name="reviewed-author" form="verb">por</term>
    <term name="translator" form="verb">traducido por</term>
    <term name="editortranslator" form="verb">editado y traducido por</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">ilust.</term>
    <term name="translator" form="verb-short">trad.</term>
    <term name="editortranslator" form="verb-short">ed. y trad.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">enero</term>
    <term name="month-02">febrero</term>
    <term name="month-03">marzo</term>
    <term name="month-04">abril</term>
    <term name="month-05">mayo</term>
    <term name="month-06">junio</term>
    <term name="month-07">julio</term>
    <term name="month-08">agosto</term>
    <term name="month-09">septiembre</term>
    <term name="month-10">octubre</term>
    <term name="month-11">noviembre</term>
    <term name="month-12">diciembre</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">ene.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">abr.</term>
    <term name="month-05" form="short">may</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">ago.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dic.</term>

    <!-- SEASONS -->
    <term name="season-01">primavera</term>
    <term name="season-02">verano</term>
    <term name="season-03">oto\xF1o</term>
    <term name="season-04">invierno</term>
  </terms>
</locale>
`,"es-MX":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="es-MX">
  <info>
    <translator>
      <name>Juan Ignacio Flores Salgado</name>
      <uri>https://www.mendeley.com/profiles/juan-ignacio-flores-salgado/</uri>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2015-06-13T13:57:31-04:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" prefix="el " suffix=" de "/>
    <date-part name="month" suffix=" de "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">consultado</term>
    <term name="and">y</term>
    <term name="and others">et&#160;al.</term>
    <term name="anonymous">an\xF3nimo</term>
    <term name="anonymous" form="short">an\xF3n.</term>
    <term name="at">en</term>
    <term name="available at">disponible en</term>
    <term name="by">de</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citado</term>
    <term name="edition">
      <single>edici\xF3n</single>
      <multiple>ediciones</multiple>
    </term>
    <term name="edition" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="et-al">et&#160;al.</term>
    <term name="forthcoming">en preparaci\xF3n</term>
    <term name="from">a partir de</term>
    <term name="ibid">ibid.</term>
    <term name="in">en</term>
    <term name="in press">en imprenta</term>
    <term name="internet">internet</term>
    <term name="interview">entrevista</term>
    <term name="letter">carta</term>
    <term name="no date">sin fecha</term>
    <term name="no date" form="short">s/f</term>
    <term name="online">en l\xEDnea</term>
    <term name="presented at">presentado en</term>
    <term name="reference">
      <single>referencia</single>
      <multiple>referencias</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">recuperado</term>
    <term name="scale">escala</term>
    <term name="version">versi\xF3n</term>
    
    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">d.&#160;C.</term>
    <term name="bc">a.&#160;C.</term>
    
    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>
    
    <!-- ORDINALS -->
    <term name="ordinal">a</term>
    <term name="ordinal-01" gender-form="feminine" match="whole-number">a</term>
    <term name="ordinal-01" gender-form="masculine" match="whole-number">o</term>
    
    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">primera</term>
    <term name="long-ordinal-02">segunda</term>
    <term name="long-ordinal-03">tercera</term>
    <term name="long-ordinal-04">cuarta</term>
    <term name="long-ordinal-05">quinta</term>
    <term name="long-ordinal-06">sexta</term>
    <term name="long-ordinal-07">s\xE9ptima</term>
    <term name="long-ordinal-08">octava</term>
    <term name="long-ordinal-09">novena</term>
    <term name="long-ordinal-10">d\xE9cima</term>
    
    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>libro</single>
      <multiple>libros</multiple>
    </term>
    <term name="chapter">
      <single>cap\xEDtulo</single>
      <multiple>cap\xEDtulos</multiple>
    </term>
    <term name="column">
      <single>columna</single>
      <multiple>columnas</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figuras</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>n\xFAmero</single>
      <multiple>n\xFAmeros</multiple>
    </term>
    <term name="line">
      <single>l\xEDnea</single>
      <multiple>l\xEDneas</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notas</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="number-of-pages">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="paragraph">
      <single>p\xE1rrafo</single>
      <multiple>p\xE1rrafos</multiple>
    </term>
    <term name="part">
      <single>parte</single>
      <multiple>partes</multiple>
    </term>
    <term name="section">
      <single>secci\xF3n</single>
      <multiple>secciones</multiple>
    </term>
    <term name="sub verbo">
      <single>sub voce</single>
      <multiple>sub vocibus</multiple>
    </term>
    <term name="verse">
      <single>verso</single>
      <multiple>versos</multiple>
    </term>
    <term name="volume">
      <single>volumen</single>
      <multiple>vol\xFAmenes</multiple>
    </term>
    
    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">
      <single>lib.</single>
      <multiple>libs.</multiple>
    </term>
    <term name="chapter" form="short">
      <single>cap.</single>
      <multiple>caps.</multiple>
    </term>
    <term name="column" form="short">
      <single>col.</single>
      <multiple>cols.</multiple>
    </term>
    <term name="figure" form="short">
      <single>fig.</single>
      <multiple>figs.</multiple>
    </term>
    <term name="folio" form="short">
      <single>f.</single>
      <multiple>ff.</multiple>
    </term>
    <term name="issue" form="short">
      <single>n\xFAm.</single>
      <multiple>n\xFAms.</multiple>
    </term>
    <term name="line" form="short">
      <single>l.</single>
      <multiple>ls.</multiple>
    </term>
    <term name="note" form="short">
      <single>n.</single>
      <multiple>nn.</multiple>
    </term>
    <term name="opus" form="short">
      <single>op.</single>
      <multiple>opp.</multiple>
    </term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">
      <single>p\xE1rr.</single>
      <multiple>p\xE1rrs.</multiple>
    </term>
    <term name="part" form="short">
      <single>pt.</single>
      <multiple>pts.</multiple>
    </term>
    <term name="section" form="short">
      <single>sec.</single>
      <multiple>secs.</multiple>
    </term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>
    
    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>
    
    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directores</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="editorial-director">
      <single>coordinador</single>
      <multiple>coordinadores</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrador</single>
      <multiple>ilustradores</multiple>
    </term>
    <term name="translator">
      <single>traductor</single>
      <multiple>traductores</multiple>
    </term>
    <term name="editortranslator">
      <single>editor y traductor</single>
      <multiple>editores y traductores</multiple>
    </term>
    
    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>coord.</single>
      <multiple>coords.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ilust.</single>
      <multiple>ilusts.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trads.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. y trad.</single>
      <multiple>eds. y trads.</multiple>
    </term>
    
    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">de</term>
    <term name="director" form="verb">dirigido por</term>
    <term name="editor" form="verb">editado por</term>
    <term name="editorial-director" form="verb">coordinado por</term>
    <term name="illustrator" form="verb">ilustrado por</term>
    <term name="interviewer" form="verb">entrevistado por</term>
    <term name="recipient" form="verb">a</term>
    <term name="reviewed-author" form="verb">por</term>
    <term name="translator" form="verb">traducido por</term>
    <term name="editortranslator" form="verb">editado y traducido por</term>
    
    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">coord.</term>
    <term name="illustrator" form="verb-short">ilust.</term>
    <term name="translator" form="verb-short">trad.</term>
    <term name="editortranslator" form="verb-short">ed. y trad.</term>
    
    <!-- LONG MONTH FORMS -->
    <term name="month-01">enero</term>
    <term name="month-02">febrero</term>
    <term name="month-03">marzo</term>
    <term name="month-04">abril</term>
    <term name="month-05">mayo</term>
    <term name="month-06">junio</term>
    <term name="month-07">julio</term>
    <term name="month-08">agosto</term>
    <term name="month-09">septiembre</term>
    <term name="month-10">octubre</term>
    <term name="month-11">noviembre</term>
    <term name="month-12">diciembre</term>
    
    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">ene.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">abr.</term>
    <term name="month-05" form="short">may</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">ago.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dic.</term>
    
    <!-- SEASONS -->
    <term name="season-01">primavera</term>
    <term name="season-02">verano</term>
    <term name="season-03">oto\xF1o</term>
    <term name="season-04">invierno</term>
  </terms>
</locale>
`,"et-EE":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="et-EE">
  <info>
    <translator>
      <name>Andrew Dunning</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">vaadatud</term>
    <term name="and">ja</term>
    <term name="and others">ja teised</term>
    <term name="anonymous">anon\xFC\xFCmne</term>
    <term name="anonymous" form="short">anon</term>
    <term name="at"></term>
    <term name="available at">available at</term>
    <term name="by"></term>
    <term name="circa">umbes</term>
    <term name="circa" form="short">u</term>
    <term name="cited">tsiteeritud</term>
    <term name="edition">
      <single>v\xE4ljaanne</single>
      <multiple>v\xE4ljaanded</multiple>
    </term>
    <term name="edition" form="short">tr</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">ilmumisel</term>
    <term name="from"></term>
    <term name="ibid">ibid.</term>
    <term name="in"></term>
    <term name="in press">tr\xFCkis</term>
    <term name="internet">internet</term>
    <term name="interview">intervjuu</term>
    <term name="letter">kiri</term>
    <term name="no date">s.a.</term>
    <term name="no date" form="short">s.a.</term>
    <term name="online">online</term>
    <term name="presented at">esitatud</term>
    <term name="reference">
      <single>viide</single>
      <multiple>viited</multiple>
    </term>
    <term name="reference" form="short">
      <single>viide</single>
      <multiple>viited</multiple>
    </term>
    <term name="retrieved">salvestatud</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">pKr</term>
    <term name="bc">eKr</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">esimene</term>
    <term name="long-ordinal-02">teine</term>
    <term name="long-ordinal-03">kolmas</term>
    <term name="long-ordinal-04">neljas</term>
    <term name="long-ordinal-05">viies</term>
    <term name="long-ordinal-06">kuues</term>
    <term name="long-ordinal-07">seitsmes</term>
    <term name="long-ordinal-08">kaheksas</term>
    <term name="long-ordinal-09">\xFCheksas</term>
    <term name="long-ordinal-10">k\xFCmnes</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>raamat</single>
      <multiple>raamatud</multiple>
    </term>
    <term name="chapter">
      <single>peat\xFCkk</single>
      <multiple>peat\xFCkid</multiple>
    </term>
    <term name="column">
      <single>veerg</single>
      <multiple>veerud</multiple>
    </term>
    <term name="figure">
      <single>joonis</single>
      <multiple>joonised</multiple>
    </term>
    <term name="folio">
      <single>foolio</single>
      <multiple>fooliod</multiple>
    </term>
    <term name="issue">
      <single>number</single>
      <multiple>numbrid</multiple>
    </term>
    <term name="line">
      <single>rida</single>
      <multiple>read</multiple>
    </term>
    <term name="note">
      <single>viide</single>
      <multiple>viited</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>lehek\xFClg</single>
      <multiple>lehek\xFCljed</multiple>
    </term>
    <term name="number-of-pages">
      <single>lehek\xFClg</single>
      <multiple>lehek\xFCljed</multiple>
    </term>
    <term name="paragraph">
      <single>l\xF5ik</single>
      <multiple>l\xF5igud</multiple>
    </term>
    <term name="part">
      <single>osa</single>
      <multiple>osad</multiple>
    </term>
    <term name="section">
      <single>alajaotis</single>
      <multiple>alajaotised</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>v\xE4rss</single>
      <multiple>v\xE4rsid</multiple>
    </term>
    <term name="volume">
      <single>k\xF6ide</single>
      <multiple>k\xF6ited</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">rmt</term>
    <term name="chapter" form="short">ptk</term>
    <term name="column" form="short">v</term>
    <term name="figure" form="short">joon</term>
    <term name="folio" form="short">f</term>
    <term name="issue" form="short">nr</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op</term>
    <term name="page" form="short">
      <single>lk</single>
      <multiple>lk</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>lk</single>
      <multiple>lk</multiple>
    </term>
    <term name="paragraph" form="short">l\xF5ik</term>
    <term name="part" form="short">osa</term>
    <term name="section" form="short">alajaot.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v</single>
      <multiple>vv</multiple>
    </term>
    <term name="volume" form="short">
      <single>kd</single>
      <multiple>kd</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>toimetaja</single>
      <multiple>toimetajad</multiple>
    </term>
    <term name="editorial-director">
      <single>toimetaja</single>
      <multiple>toimetajad</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>t\xF5lkija</single>
      <multiple>t\xF5lkijad</multiple>
    </term>
    <term name="editortranslator">
      <single>toimetaja &amp; t\xF5lkija</single>
      <multiple>toimetajad &amp; t\xF5lkijad</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>toim</single>
      <multiple>toim</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>toim</single>
      <multiple>toim</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>t\xF5lk</single>
      <multiple>t\xF5lk</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>toim &amp; t\xF5lk</single>
      <multiple>toim &amp; t\xF5lk</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb"></term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">toimetanud</term>
    <term name="editorial-director" form="verb">toimetanud</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">intervjueerinud</term>
    <term name="recipient" form="verb"></term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">t\xF5lkinud</term>
    <term name="editortranslator" form="verb">toimetanud &amp; t\xF5lkinud</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">toim</term>
    <term name="editorial-director" form="verb-short">toim</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">t\xF5lk</term>
    <term name="editortranslator" form="verb-short">toim &amp; t\xF5lk</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">jaanuar</term>
    <term name="month-02">veebruar</term>
    <term name="month-03">m\xE4rts</term>
    <term name="month-04">aprill</term>
    <term name="month-05">mai</term>
    <term name="month-06">juuni</term>
    <term name="month-07">juuli</term>
    <term name="month-08">august</term>
    <term name="month-09">september</term>
    <term name="month-10">oktoober</term>
    <term name="month-11">november</term>
    <term name="month-12">detsember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jaan</term>
    <term name="month-02" form="short">veebr</term>
    <term name="month-03" form="short">m\xE4rts</term>
    <term name="month-04" form="short">apr</term>
    <term name="month-05" form="short">mai</term>
    <term name="month-06" form="short">juuni</term>
    <term name="month-07" form="short">juuli</term>
    <term name="month-08" form="short">aug</term>
    <term name="month-09" form="short">sept</term>
    <term name="month-10" form="short">okt</term>
    <term name="month-11" form="short">nov</term>
    <term name="month-12" form="short">dets</term>

    <!-- SEASONS -->
    <term name="season-01">kevad</term>
    <term name="season-02">suvi</term>
    <term name="season-03">s\xFCgis</term>
    <term name="season-04">talv</term>
  </terms>
</locale>
`,eu:`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="eu">
  <info>
    <translator>
      <name>Amaraun</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="year" suffix="(e)ko "/>
    <date-part name="month" suffix="aren "/>
    <date-part name="day" suffix="a"/>
  </date>
  <date form="numeric">
    <date-part name="year" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="day" form="numeric-leading-zeros"/>
  </date>
  <terms>
    <term name="accessed">eskuratua</term>
    <term name="and">eta</term>
    <term name="and others">eta beste</term>
    <term name="anonymous">ezezaguna</term>
    <term name="anonymous" form="short">ezez.</term>
    <term name="at">-(e)n</term>
    <term name="available at">available at</term>
    <term name="by">-(e)k egina</term>
    <term name="circa">inguru</term>
    <term name="circa" form="short">ing.</term>
    <term name="cited">aipatua</term>
    <term name="edition">
      <single>argitalpena</single>
      <multiple>argitalpenak</multiple>
    </term>
    <term name="edition" form="short">arg.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">bidean</term>
    <term name="from">-(e)tik</term>
    <term name="ibid">ib\xEDd.</term>
    <term name="in">in</term>
    <term name="in press">moldiztegian</term>
    <term name="internet">internet</term>
    <term name="interview">elkarrizketa</term>
    <term name="letter">gutuna</term>
    <term name="no date">datarik gabe</term>
    <term name="no date" form="short">d. g.</term>
    <term name="online">sarean</term>
    <term name="presented at">-(e)n aurkeztua</term>
    <term name="reference">
      <single>aipamena</single>
      <multiple>aipamenak</multiple>
    </term>
    <term name="reference" form="short">
      <single>aip.</single>
      <multiple>aip.</multiple>
    </term>
    <term name="retrieved">berreskuratua</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">K.a.</term>
    <term name="bc">K.o.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">lehengo</term>
    <term name="long-ordinal-02">bigarren</term>
    <term name="long-ordinal-03">hirugarren</term>
    <term name="long-ordinal-04">laugarren</term>
    <term name="long-ordinal-05">bosgarren</term>
    <term name="long-ordinal-06">seigarren</term>
    <term name="long-ordinal-07">zazpigarren</term>
    <term name="long-ordinal-08">zortzigarren</term>
    <term name="long-ordinal-09">bederatzigarren</term>
    <term name="long-ordinal-10">hamargarren</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>liburua</single>
      <multiple>liburuak</multiple>
    </term>
    <term name="chapter">
      <single>kapitulua</single>
      <multiple>kapituluak</multiple>
    </term>
    <term name="column">
      <single>zutabea</single>
      <multiple>zutabeak</multiple>
    </term>
    <term name="figure">
      <single>irudia</single>
      <multiple>irudiak</multiple>
    </term>
    <term name="folio">
      <single>orria</single>
      <multiple>orriak</multiple>
    </term>
    <term name="issue">
      <single>zenbakia</single>
      <multiple>zenbakiak</multiple>
    </term>
    <term name="line">
      <single>lerroa</single>
      <multiple>lerroak</multiple>
    </term>
    <term name="note">
      <single>oharra</single>
      <multiple>oharrak</multiple>
    </term>
    <term name="opus">
      <single>obra</single>
      <multiple>obrak</multiple>
    </term>
    <term name="page">
      <single>orrialdea</single>
      <multiple>orrialdeak</multiple>
    </term>
    <term name="number-of-pages">
      <single>orrialdea</single>
      <multiple>orrialdeak</multiple>
    </term>
    <term name="paragraph">
      <single>paragrafoa</single>
      <multiple>paragrafoak</multiple>
    </term>
    <term name="part">
      <single>zatia</single>
      <multiple>zatiak</multiple>
    </term>
    <term name="section">
      <single>atala</single>
      <multiple>atalak</multiple>
    </term>
    <term name="sub verbo">
      <single>sub voce</single>
      <multiple>sub vocem</multiple>
    </term>
    <term name="verse">
      <single>bertsoa</single>
      <multiple>bertsoak</multiple>
    </term>
    <term name="volume">
      <single>luburikia</single>
      <multiple>luburukiak</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">lib.</term>
    <term name="chapter" form="short">kap.</term>
    <term name="column" form="short">zut.</term>
    <term name="figure" form="short">iru.</term>
    <term name="folio" form="short">or.</term>
    <term name="issue" form="short">zenb.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>or.</single>
      <multiple>or.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>or.</single>
      <multiple>or.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">zt.</term>
    <term name="section" form="short">atal.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.v.</multiple>
    </term>
    <term name="verse" form="short">
      <single>b.</single>
      <multiple>bb.</multiple>
    </term>
    <term name="volume" form="short">
      <single>libk.</single>
      <multiple>libk.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>argitaratzailea</single>
      <multiple>argitaratzaileak</multiple>
    </term>
    <term name="editorial-director">
      <single>argitaratzailea</single>
      <multiple>argitaratzaileak</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>itzultzailea</single>
      <multiple>itzultzaileak</multiple>
    </term>
    <term name="editortranslator">
      <single>argitaratzaile eta itzultzailea</single>
      <multiple>argitaratzaile eta itzultzaileak</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>arg.</single>
      <multiple>arg.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>arg.</single>
      <multiple>arg.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>itzul.</single>
      <multiple>itzul.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>arg. eta itzul.</single>
      <multiple>arg. eta itzul.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb"></term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">-(e)k argitaratua</term>
    <term name="editorial-director" form="verb">-(e)k argitaratua</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">-(e)k elkarrizketatua</term>
    <term name="recipient" form="verb">-(r)entzat</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">-(e)k itzulia</term>
    <term name="editortranslator" form="verb">-(e)k argitaratu eta itzulia</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">arg.</term>
    <term name="editorial-director" form="verb-short">arg.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">itzul.</term>
    <term name="editortranslator" form="verb-short">-(e)k arg. eta itzul.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">urtarrilak</term>
    <term name="month-02">otsailak</term>
    <term name="month-03">martxoak</term>
    <term name="month-04">apirilak</term>
    <term name="month-05">maiatzak</term>
    <term name="month-06">ekainak</term>
    <term name="month-07">uztailak</term>
    <term name="month-08">abuztuak</term>
    <term name="month-09">irailak</term>
    <term name="month-10">urriak</term>
    <term name="month-11">azaroak</term>
    <term name="month-12">abenduak</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">urt.</term>
    <term name="month-02" form="short">ots.</term>
    <term name="month-03" form="short">martx.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mai.</term>
    <term name="month-06" form="short">eka.</term>
    <term name="month-07" form="short">uzt.</term>
    <term name="month-08" form="short">abz.</term>
    <term name="month-09" form="short">ira.</term>
    <term name="month-10" form="short">urr.</term>
    <term name="month-11" form="short">aza.</term>
    <term name="month-12" form="short">abe.</term>

    <!-- SEASONS -->
    <term name="season-01">udaberria</term>
    <term name="season-02">uda</term>
    <term name="season-03">udazkena</term>
    <term name="season-04">negua</term>
  </terms>
</locale>
`,"fa-IR":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="fa-IR">
  <info>
    <translator>
      <name>Hamed Heydari</name>
    </translator>
    <translator>
      <name>abdealikhurrum</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="true"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u062F\u0633\u062A\u0631\u0633\u06CC</term>
    <term name="and">\u0648</term>
    <term name="and others">\u0648 \u062F\u06CC\u06AF\u0631\u0627\u0646</term>
    <term name="anonymous">\u0646\u0627\u0634\u0646\u0627\u0633</term>
    <term name="anonymous" form="short">\u0646\u0627\u0634\u0646\u0627\u0633</term>
    <term name="at">\u062F\u0631</term>
    <term name="available at">\u0642\u0627\u0628\u0644 \u062F\u0633\u062A\u0631\u0633 \u062F\u0631</term>
    <term name="by">\u062A\u0648\u0633\u0637</term>
    <term name="circa">\u062A\u0642\u0631\u06CC\u0628\u0627\u064B</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">\u0627\u0631\u062C\u0627\u0639 \u0634\u062F\u0647</term>
    <term name="edition">
      <single>\u0648\u06CC\u0631\u0627\u06CC\u0634</single>
      <multiple>\u0648\u06CC\u0631\u0627\u06CC\u0634\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="edition" form="short">\u0648\u06CC\u0631\u0627\u06CC\u0634</term>
    <term name="et-al">\u0648 \u0647\u0645\u06A9\u0627\u0631\u0627\u0646</term>
    <term name="forthcoming">\u062F\u0631 \u062F\u0633\u062A \u0627\u0646\u062A\u0634\u0627\u0631</term>
    <term name="from">\u0627\u0632</term>
    <term name="ibid">\u0647\u0645\u0627\u0646</term>
    <term name="in">\u062F\u0631</term>
    <term name="in press">\u0632\u06CC\u0631 \u0686\u0627\u067E</term>
    <term name="internet">\u0627\u06CC\u0646\u062A\u0631\u0646\u062A</term>
    <term name="interview">\u0645\u0635\u0627\u062D\u0628\u0647</term>
    <term name="letter">\u0646\u0627\u0645\u0647</term>
    <term name="no date">\u0628\u062F\u0648\u0646 \u062A\u0627\u0631\u06CC\u062E</term>
    <term name="no date" form="short">\u0628\u062F\u0648\u0646 \u062A\u0627\u0631\u06CC\u062E</term>
    <term name="online">\u0622\u0646\u0644\u0627\u06CC\u0646</term>
    <term name="presented at">\u0627\u0631\u0627\u0626\u0647 \u0634\u062F\u0647 \u062F\u0631</term>
    <term name="reference">
      <single>\u0645\u0631\u062C\u0639</single>
      <multiple>\u0645\u0631\u0627\u062C\u0639</multiple>
    </term>
    <term name="reference" form="short">
      <single>\u0645\u0631\u062C\u0639</single>
      <multiple>\u0645\u0631\u0627\u062C\u0639</multiple>
    </term>
    <term name="retrieved">retrieved</term>
    <term name="scale">scale</term>
    <term name="version">\u0646\u0633\u062E\u0647</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u0628\u0639\u062F \u0627\u0632 \u0645\u06CC\u0644\u0627\u062F</term>
    <term name="bc">\u0642\u0628\u0644 \u0627\u0632 \u0645\u06CC\u0644\u0627\u062F</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal"></term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u0627\u0648\u0644</term>
    <term name="long-ordinal-02">\u062F\u0648\u0645</term>
    <term name="long-ordinal-03">\u0633\u0648\u0645</term>
    <term name="long-ordinal-04">\u0686\u0647\u0627\u0631\u0645</term>
    <term name="long-ordinal-05">\u067E\u0646\u062C\u0645</term>
    <term name="long-ordinal-06">\u0634\u0634\u0645</term>
    <term name="long-ordinal-07">\u0647\u0641\u062A\u0645</term>
    <term name="long-ordinal-08">\u0647\u0634\u062A\u0645</term>
    <term name="long-ordinal-09">\u0646\u0647\u0645</term>
    <term name="long-ordinal-10">\u062F\u0647\u0645</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u06A9\u062A\u0627\u0628</single>
      <multiple>\u06A9\u062A\u0627\u0628\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="chapter">
      <single>\u0641\u0635\u0644</single>
      <multiple>\u0641\u0635\u0644\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="column">
      <single>\u0633\u062A\u0648\u0646</single>
      <multiple>\u0633\u062A\u0648\u0646\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="figure">
      <single>\u062A\u0635\u0648\u06CC\u0631</single>
      <multiple>\u062A\u0635\u0627\u0648\u06CC\u0631</multiple>
    </term>
    <term name="folio">
      <single>\u0628\u0631\u06AF</single>
      <multiple>\u0628\u0631\u06AF\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="issue">
      <single>\u0634\u0645\u0627\u0631\u0647</single>
      <multiple>\u0634\u0645\u0627\u0631\u0647\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="line">
      <single>\u062E\u0637</single>
      <multiple>\u062E\u0637\u0648\u0637</multiple>
    </term>
    <term name="note">
      <single>\u06CC\u0627\u062F\u062F\u0627\u0634\u062A</single>
      <multiple>\u06CC\u0627\u062F\u062F\u0627\u0634\u062A\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="opus">
      <single>\u0642\u0637\u0639\u0647</single>
      <multiple>\u0642\u0637\u0639\u0627\u062A</multiple>
    </term>
    <term name="page">
      <single>\u0635\u0641\u062D\u0647</single>
      <multiple>\u0635\u0641\u062D\u0627\u062A</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u0635\u0641\u062D\u0647</single>
      <multiple>\u0635\u0641\u062D\u0627\u062A</multiple>
    </term>
    <term name="paragraph">
      <single>\u067E\u0627\u0631\u0627\u06AF\u0631\u0627\u0641</single>
      <multiple>\u067E\u0627\u0631\u0627\u06AF\u0631\u0627\u0641\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="part">
      <single>\u0628\u062E\u0634</single>
      <multiple>\u0628\u062E\u0634\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="section">
      <single>\u0642\u0633\u0645\u062A</single>
      <multiple>\u0642\u0633\u0645\u062A\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="sub verbo">
      <single>\u062F\u0631 \u0630\u06CC\u0644\u0650 \u0648\u0627\u0698\u0647</single>
      <multiple>\u062F\u0631 \u0630\u06CC\u0644\u0650 \u0648\u0627\u0698\u0647\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="verse">
      <single>\u0628\u06CC\u062A</single>
      <multiple>\u0628\u06CC\u062A\u200C\u0647\u0627\u06CC</multiple>
    </term>
    <term name="volume">
      <single>\u062C\u0644\u062F</single>
      <multiple>\u062C\u0644\u062F\u0647\u0627\u06CC</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u06A9\u062A\u0627\u0628</term>
    <term name="chapter" form="short">\u0641\u0635\u0644</term>
    <term name="column" form="short">\u0633\u062A\u0648\u0646</term>
    <term name="figure" form="short">\u062A\u0635\u0648\u06CC\u0631</term>
    <term name="folio" form="short">\u0628\u0631\u06AF</term>
    <term name="issue" form="short">\u0634</term>
    <term name="line" form="short">\u062E\u0637</term>
    <term name="note" form="short">\u06CC\u0627\u062F\u062F\u0627\u0634\u062A</term>
    <term name="opus" form="short">\u0642\u0637\u0639\u0647</term>
    <term name="page" form="short">
      <single>\u0635</single>
      <multiple>\u0635\u0635</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>\u0635</single>
      <multiple>\u0635\u0635</multiple>
    </term>
    <term name="paragraph" form="short">\u067E\u0627\u0631\u0627\u06AF\u0631\u0627\u0641</term>
    <term name="part" form="short">\u0628\u062E\u0634</term>
    <term name="section" form="short">\u0642\u0633\u0645\u062A</term>
    <term name="sub verbo" form="short">
      <single>s.v</single>
      <multiple>s.vv</multiple>
    </term>
    <term name="verse" form="short">
      <single>\u0628\u06CC\u062A</single>
      <multiple>\u0627\u0628\u06CC\u0627\u062A</multiple>
    </term>
    <term name="volume" form="short">
      <single>\u062C</single>
      <multiple>\u062C\u062C</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631</single>
      <multiple>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631\u0627\u0646</multiple>
    </term>
    <term name="editorial-director">
      <single>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631</single>
      <multiple>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631\u0627\u0646</multiple>
    </term>
    <term name="illustrator">
      <single>\u0637\u0631\u0627\u062D \u06AF\u0631\u0627\u0641\u06CC\u06A9</single>
      <multiple>\u0637\u0631\u0627\u062D\u0627\u0646 \u06AF\u0631\u0627\u0641\u06CC\u06A9</multiple>
    </term>
    <term name="translator">
      <single>\u0645\u062A\u0631\u062C\u0645</single>
      <multiple>\u0645\u062A\u0631\u062C\u0645\u06CC\u0646</multiple>
    </term>
    <term name="editortranslator">
      <single>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631 \u0648 \u0645\u062A\u0631\u062C\u0645</single>
      <multiple>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631\u0627\u0646 \u0648 \u0645\u062A\u0631\u062C\u0645\u06CC\u0646</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631</single>
      <multiple>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631\u0627\u0646</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631</single>
      <multiple>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631\u0627\u0646</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>\u062A\u0635\u0648\u06CC\u0631\u06AF\u0631</single>
      <multiple>\u062A\u0635\u0648\u06CC\u0631\u06AF\u0631\u0627\u0646</multiple>
    </term>
    <term name="translator" form="short">
      <single>\u0645\u062A\u0631\u062C\u0645</single>
      <multiple>\u0645\u062A\u0631\u062C\u0645\u06CC\u0646</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631 \u0648 \u0645\u062A\u0631\u062C\u0645</single>
      <multiple>\u0648\u06CC\u0631\u0627\u0633\u062A\u0627\u0631\u0627\u0646 \u0648 \u0645\u062A\u0631\u062C\u0645\u06CC\u0646</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">\u062A\u0648\u0633\u0637</term>
    <term name="director" form="verb">\u0632\u06CC\u0631 \u0646\u0638\u0631</term>
    <term name="editor" form="verb">\u0648\u06CC\u0631\u0627\u0633\u062A\u0647\u200C\u06CC</term>
    <term name="editorial-director" form="verb">\u0648\u06CC\u0631\u0627\u0633\u062A\u0647\u200C\u06CC</term>
    <term name="illustrator" form="verb">\u0637\u0631\u0627\u062D\u06CC \u06AF\u0631\u0627\u0641\u06CC\u06A9\u06CC \u0627\u0632</term>
    <term name="interviewer" form="verb">\u0645\u0635\u0627\u062D\u0628\u0647 \u062A\u0648\u0633\u0637</term>
    <term name="recipient" form="verb">\u0628\u0647</term>
    <term name="reviewed-author" form="verb">\u0628\u0627\u0632\u0628\u06CC\u0646\u06CC \u062A\u0648\u0633\u0637</term>
    <term name="translator" form="verb">\u062A\u0631\u062C\u0645\u0647\u200C\u06CC</term>
    <term name="editortranslator" form="verb">\u062A\u0631\u062C\u0645\u0647 \u0648 \u0648\u06CC\u0631\u0627\u0633\u062A\u0647\u200C\u06CC</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">\u0648\u06CC\u0631\u0627\u0633\u062A\u0647\u200C\u06CC</term>
    <term name="editorial-director" form="verb-short">\u0648\u06CC\u0631\u0627\u0633\u062A\u0647\u200C\u06CC</term>
    <term name="illustrator" form="verb-short">\u0637\u0631\u0627\u062D\u06CC \u0627\u0632</term>
    <term name="translator" form="verb-short">\u062A\u0631\u062C\u0645\u0647\u200C\u06CC</term>
    <term name="editortranslator" form="verb-short">\u062A\u0631\u062C\u0645\u0647 \u0648 \u0648\u06CC\u0631\u0627\u0633\u062A\u0647\u200C\u06CC</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u0698\u0627\u0646\u0648\u06CC\u0647</term>
    <term name="month-02">\u0641\u0648\u0631\u06CC\u0647</term>
    <term name="month-03">\u0645\u0627\u0631\u0633</term>
    <term name="month-04">\u0622\u0648\u0631\u06CC\u0644</term>
    <term name="month-05">\u0645\u06CC</term>
    <term name="month-06">\u0698\u0648\u0626\u0646</term>
    <term name="month-07">\u062C\u0648\u0644\u0627\u06CC</term>
    <term name="month-08">\u0622\u06AF\u0648\u0633\u062A</term>
    <term name="month-09">\u0633\u067E\u062A\u0627\u0645\u0628\u0631</term>
    <term name="month-10">\u0627\u06A9\u062A\u0628\u0631</term>
    <term name="month-11">\u0646\u0648\u0627\u0645\u0628\u0631</term>
    <term name="month-12">\u062F\u0633\u0627\u0645\u0628\u0631</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">\u0698\u0627\u0646\u0648\u06CC\u0647</term>
    <term name="month-02" form="short">\u0641\u0648\u0631\u06CC\u0647</term>
    <term name="month-03" form="short">\u0645\u0627\u0631\u0633</term>
    <term name="month-04" form="short">\u0622\u0648\u0631\u06CC\u0644</term>
    <term name="month-05" form="short">\u0645\u06CC</term>
    <term name="month-06" form="short">\u0698\u0648\u0626\u0646</term>
    <term name="month-07" form="short">\u062C\u0648\u0644\u0627\u06CC</term>
    <term name="month-08" form="short">\u0622\u06AF\u0648\u0633\u062A</term>
    <term name="month-09" form="short">\u0633\u067E\u062A\u0627\u0645\u0628\u0631</term>
    <term name="month-10" form="short">\u0627\u06A9\u062A\u0628\u0631</term>
    <term name="month-11" form="short">\u0646\u0648\u0627\u0645\u0628\u0631</term>
    <term name="month-12" form="short">\u062F\u0633\u0627\u0645\u0628\u0631</term>

    <!-- SEASONS -->
    <term name="season-01">\u0628\u0647\u0627\u0631</term>
    <term name="season-02">\u062A\u0627\u0628\u0633\u062A\u0627\u0646</term>
    <term name="season-03">\u067E\u0627\u06CC\u06CC\u0632</term>
    <term name="season-04">\u0632\u0645\u0633\u062A\u0627\u0646</term>
  </terms>
</locale>
`,"fi-FI":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="fi-FI">
  <info>
    <translator>
      <name>Janne Huovari</name>
    </translator>
    <translator>
      <name>snissine</name>
    </translator>
    <translator>
      <name>villelahtinen</name>
    </translator>
    <translator>
      <name>Juhana Ven\xE4l\xE4inen</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" suffix="."/>
    <date-part name="month" form="numeric" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">viitattu</term>
    <term name="and">ja</term>
    <term name="and others">ym.</term>
    <term name="anonymous">tuntematon</term>
    <term name="anonymous" form="short">tuntematon</term>
    <term name="at">osoitteessa</term>
    <term name="available at">saatavissa</term>
    <term name="by">tekij\xE4</term>
    <term name="circa">noin</term>
    <term name="circa" form="short">n.</term>
    <term name="cited">viitattu</term>
    <term name="edition">
      <single>painos</single>
      <multiple>painokset</multiple>
    </term>
    <term name="edition" form="short">p.</term>
    <term name="et-al">ym.</term>
    <term name="forthcoming">tulossa</term>
    <term name="from">osoitteesta</term>
    <term name="ibid">mt.</term>
    <term name="in">teoksessa</term>
    <term name="in press">painossa</term>
    <term name="internet">internet</term>
    <term name="interview">haastattelu</term>
    <term name="letter">kirje</term>
    <term name="no date">ei p\xE4iv\xE4m\xE4\xE4r\xE4\xE4</term>
    <term name="no date" form="short">ei pvm.</term>
    <term name="online">verkossa</term>
    <term name="presented at">esitetty tilaisuudessa</term>
    <term name="reference">
      <single>viittaus</single>
      <multiple>viittaukset</multiple>
    </term>
    <term name="reference" form="short">
      <single>viit.</single>
      <multiple>viit.</multiple>
    </term>
    <term name="retrieved">noudettu</term>
    <term name="scale">mittakaava</term>
    <term name="version">versio</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">jaa.</term>
    <term name="bc">eaa.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201D</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2019</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">ensimm\xE4inen</term>
    <term name="long-ordinal-02">toinen</term>
    <term name="long-ordinal-03">kolmas</term>
    <term name="long-ordinal-04">nelj\xE4s</term>
    <term name="long-ordinal-05">viides</term>
    <term name="long-ordinal-06">kuudes</term>
    <term name="long-ordinal-07">seitsem\xE4s</term>
    <term name="long-ordinal-08">kahdeksas</term>
    <term name="long-ordinal-09">yhdeks\xE4s</term>
    <term name="long-ordinal-10">kymmenes</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>kirja</single>
      <multiple>kirjat</multiple>
    </term>
    <term name="chapter">
      <single>luku</single>
      <multiple>luvut</multiple>
    </term>
    <term name="column">
      <single>palsta</single>
      <multiple>palstat</multiple>
    </term>
    <term name="figure">
      <single>kuvio</single>
      <multiple>kuviot</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>foliot</multiple>
    </term>
    <term name="issue">
      <single>numero</single>
      <multiple>numerot</multiple>
    </term>
    <term name="line">
      <single>rivi</single>
      <multiple>rivit</multiple>
    </term>
    <term name="note">
      <single>huomautus</single>
      <multiple>huomautukset</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opukset</multiple>
    </term>
    <term name="page">
      <single>sivu</single>
      <multiple>sivut</multiple>
    </term>
    <term name="number-of-pages">
      <single>sivu</single>
      <multiple>sivut</multiple>
    </term>
    <term name="paragraph">
      <single>kappale</single>
      <multiple>kappaleet</multiple>
    </term>
    <term name="part">
      <single>osa</single>
      <multiple>osat</multiple>
    </term>
    <term name="section">
      <single>osa</single>
      <multiple>osat</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>s\xE4keist\xF6</single>
      <multiple>s\xE4keist\xF6t</multiple>
    </term>
    <term name="volume">
      <single>vuosikerta</single>
      <multiple>vuosikerrat</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">kirja</term>
    <term name="chapter" form="short">luku</term>
    <term name="column" form="short">palsta</term>
    <term name="figure" form="short">kuv.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">nro</term>
    <term name="line" form="short">r.</term>
    <term name="note" form="short">huom.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>ss.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>ss.</multiple>
    </term>
    <term name="paragraph" form="short">kappale</term>
    <term name="part" form="short">osa</term>
    <term name="section" form="short">osa</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>s\xE4k.</single>
      <multiple>s\xE4k.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vsk.</single>
      <multiple>vsk.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>ohjaaja</single>
      <multiple>ohjaajat</multiple>
    </term>
    <term name="editor">
      <single>toimittaja</single>
      <multiple>toimittajat</multiple>
    </term>
    <term name="editorial-director">
      <single>toimittaja</single>
      <multiple>toimittajat</multiple>
    </term>
    <term name="illustrator">
      <single>kuvittaja</single>
      <multiple>kuvittajat</multiple>
    </term>
    <term name="translator">
      <single>k\xE4\xE4nt\xE4j\xE4</single>
      <multiple>k\xE4\xE4nt\xE4j\xE4t</multiple>
    </term>
    <term name="editortranslator">
      <single>toimittaja ja k\xE4\xE4nt\xE4j\xE4</single>
      <multiple>toimittajat ja k\xE4\xE4nt\xE4j\xE4t</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>ohj.</single>
      <multiple>ohj.</multiple>
    </term>
    <term name="editor" form="short">
      <single>toim.</single>
      <multiple>toim.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>toim.</single>
      <multiple>toim.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>kuv.</single>
      <multiple>kuv.</multiple>
    </term>
    <term name="translator" form="short">
      <single>k\xE4\xE4nt.</single>
      <multiple>k\xE4\xE4nt.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>toim. ja k\xE4\xE4nt.</single>
      <multiple>toim. ja k\xE4\xE4nt.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb"></term>
    <term name="director" form="verb">ohjannut</term>
    <term name="editor" form="verb">toimittanut</term>
    <term name="editorial-director" form="verb">toimittanut</term>
    <term name="illustrator" form="verb">kuvittanut</term>
    <term name="interviewer" form="verb">haastatellut</term>
    <term name="recipient" form="verb">vastaanottaja</term>
    <term name="reviewed-author" form="verb"></term>
    <term name="translator" form="verb">k\xE4\xE4nt\xE4nyt</term>
    <term name="editortranslator" form="verb">toimittanut ja k\xE4\xE4nt\xE4nyt</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">ohj.</term>
    <term name="editor" form="verb-short">toim.</term>
    <term name="editorial-director" form="verb-short">toim.</term>
    <term name="illustrator" form="verb-short">kuv.</term>
    <term name="translator" form="verb-short">k\xE4\xE4nt.</term>
    <term name="editortranslator" form="verb-short">toim. ja k\xE4\xE4nt.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">tammikuuta</term>
    <term name="month-02">helmikuuta</term>
    <term name="month-03">maaliskuuta</term>
    <term name="month-04">huhtikuuta</term>
    <term name="month-05">toukokuuta</term>
    <term name="month-06">kes\xE4kuuta</term>
    <term name="month-07">hein\xE4kuuta</term>
    <term name="month-08">elokuuta</term>
    <term name="month-09">syyskuuta</term>
    <term name="month-10">lokakuuta</term>
    <term name="month-11">marraskuuta</term>
    <term name="month-12">joulukuuta</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">tammi</term>
    <term name="month-02" form="short">helmi</term>
    <term name="month-03" form="short">maalis</term>
    <term name="month-04" form="short">huhti</term>
    <term name="month-05" form="short">touko</term>
    <term name="month-06" form="short">kes\xE4</term>
    <term name="month-07" form="short">hein\xE4</term>
    <term name="month-08" form="short">elo</term>
    <term name="month-09" form="short">syys</term>
    <term name="month-10" form="short">loka</term>
    <term name="month-11" form="short">marras</term>
    <term name="month-12" form="short">joulu</term>

    <!-- SEASONS -->
    <term name="season-01">kev\xE4t</term>
    <term name="season-02">kes\xE4</term>
    <term name="season-03">syksy</term>
    <term name="season-04">talvi</term>
  </terms>
</locale>
`,"fr-CA":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="fr-CA">
  <info>
    <translator>
      <name>Gr\xE9goire Colly</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false" limit-day-ordinals-to-day-1="true"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">consult\xE9 le</term>
    <term name="and">et</term>
    <term name="and others">et autres</term>
    <term name="anonymous">anonyme</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">sur</term>
    <term name="available at">disponible \xE0</term>
    <term name="by">par</term>
    <term name="circa">vers</term>
    <term name="circa" form="short">v.</term>
    <term name="cited">cit\xE9</term>
    <term name="edition" gender="feminine">
      <single>\xE9dition</single>
      <multiple>\xE9ditions</multiple>
    </term>
    <term name="edition" form="short">\xE9d.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">\xE0 para\xEEtre</term>
    <term name="from">\xE0 l'adresse</term>
    <term name="ibid">ibid.</term>
    <term name="in">dans</term>
    <term name="in press">sous presse</term>
    <term name="internet">Internet</term>
    <term name="interview">entretien</term>
    <term name="letter">lettre</term>
    <term name="no date">sans date</term>
    <term name="no date" form="short">s.&#160;d.</term>
    <term name="online">en ligne</term>
    <term name="presented at">pr\xE9sent\xE9 \xE0</term>
    <term name="reference">
      <single>r\xE9f\xE9rence</single>
      <multiple>r\xE9f\xE9rences</multiple>
    </term>
    <term name="reference" form="short">
      <single>r\xE9f.</single>
      <multiple>r\xE9f.</multiple>
    </term>
    <term name="retrieved">consult\xE9</term>
    <term name="scale">\xE9chelle</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">apr. J.-C.</term>
    <term name="bc">av. J.-C.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB&#160;</term>
    <term name="close-quote">&#160;\xBB</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">&#8209;</term> <!-- non-breaking hyphen -->

    <!-- ORDINALS -->
    <term name="ordinal">\u1D49</term>
   	<term name="ordinal-01" gender-form="feminine" match="whole-number">\u02B3\u1D49</term>
    <term name="ordinal-01" gender-form="masculine" match="whole-number">\u1D49\u02B3</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">premier</term>
    <term name="long-ordinal-02">deuxi\xE8me</term>
    <term name="long-ordinal-03">troisi\xE8me</term>
    <term name="long-ordinal-04">quatri\xE8me</term>
    <term name="long-ordinal-05">cinqui\xE8me</term>
    <term name="long-ordinal-06">sixi\xE8me</term>
    <term name="long-ordinal-07">septi\xE8me</term>
    <term name="long-ordinal-08">huiti\xE8me</term>
    <term name="long-ordinal-09">neuvi\xE8me</term>
    <term name="long-ordinal-10">dixi\xE8me</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>livre</single>
      <multiple>livres</multiple>
    </term>
    <term name="chapter">
      <single>chapitre</single>
      <multiple>chapitres</multiple>
    </term>
    <term name="column">
      <single>colonne</single>
      <multiple>colonnes</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue" gender="masculine">
      <single>num\xE9ro</single>
      <multiple>num\xE9ros</multiple>
    </term>
    <term name="line">
      <single>ligne</single>
      <multiple>lignes</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opus</multiple>
    </term>
    <term name="page">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="number-of-pages">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="paragraph">
      <single>paragraphe</single>
      <multiple>paragraphes</multiple>
    </term>
    <term name="part">
      <single>partie</single>
      <multiple>parties</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verset</single>
      <multiple>versets</multiple>
    </term>
    <term name="volume" gender="masculine">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">liv.</term>
    <term name="chapter" form="short">chap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">
      <single>f\u1D52</single>
      <multiple>f\u1D52\u02E2</multiple>
    </term>
    <term name="issue" form="short">
      <single>n\u1D52</single>
      <multiple>n\u1D52\u02E2</multiple>
    </term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="paragraph" form="short">paragr.</term>
    <term name="part" form="short">part.</term>
    <term name="section" form="short">sect.</term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vol.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>r\xE9alisateur</single>
      <multiple>r\xE9alisateurs</multiple>
    </term>
    <term name="editor">
      <single>\xE9diteur</single>
      <multiple>\xE9diteurs</multiple>
    </term>
    <term name="editorial-director">
      <single>directeur</single>
      <multiple>directeurs</multiple>
    </term>
    <term name="illustrator">
      <single>illustrateur</single>
      <multiple>illustrateurs</multiple>
    </term>
    <term name="translator">
      <single>traducteur</single>
      <multiple>traducteurs</multiple>
    </term>
    <term name="editortranslator">
      <single>\xE9diteur et traducteur</single>
      <multiple>\xE9diteurs et traducteurs</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>r\xE9al.</single>
      <multiple>r\xE9al.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\xE9d.</single>
      <multiple>\xE9d.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>dir.</single>
      <multiple>dir.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trad.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>\xE9d. et trad.</single>
      <multiple>\xE9d. et trad.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">par</term>
    <term name="director" form="verb">r\xE9alis\xE9 par</term>
    <term name="editor" form="verb">\xE9dit\xE9 par</term>
    <term name="editorial-director" form="verb">sous la direction de</term>
    <term name="illustrator" form="verb">illustr\xE9 par</term>
    <term name="interviewer" form="verb">entretien r\xE9alis\xE9 par</term>
    <term name="recipient" form="verb">\xE0</term>
    <term name="reviewed-author" form="verb">par</term>
    <term name="translator" form="verb">traduit par</term>
    <term name="editortranslator" form="verb">\xE9dit\xE9 et traduit par</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">r\xE9al. par</term>
    <term name="editor" form="verb-short">\xE9d. par</term>
    <term name="editorial-director" form="verb-short">ss la dir. de</term>
    <term name="illustrator" form="verb-short">ill. par</term>
    <term name="translator" form="verb-short">trad. par</term>
    <term name="editortranslator" form="verb-short">\xE9d. et trad. par</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01" gender="masculine">janvier</term>
    <term name="month-02" gender="masculine">f\xE9vrier</term>
    <term name="month-03" gender="masculine">mars</term>
    <term name="month-04" gender="masculine">avril</term>
    <term name="month-05" gender="masculine">mai</term>
    <term name="month-06" gender="masculine">juin</term>
    <term name="month-07" gender="masculine">juillet</term>
    <term name="month-08" gender="masculine">ao\xFBt</term>
    <term name="month-09" gender="masculine">septembre</term>
    <term name="month-10" gender="masculine">octobre</term>
    <term name="month-11" gender="masculine">novembre</term>
    <term name="month-12" gender="masculine">d\xE9cembre</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">janv.</term>
    <term name="month-02" form="short">f\xE9vr.</term>
    <term name="month-03" form="short">mars</term>
    <term name="month-04" form="short">avr.</term>
    <term name="month-05" form="short">mai</term>
    <term name="month-06" form="short">juin</term>
    <term name="month-07" form="short">juill.</term>
    <term name="month-08" form="short">ao\xFBt</term>
    <term name="month-09" form="short">sept.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">d\xE9c.</term>

    <!-- SEASONS -->
    <term name="season-01">printemps</term>
    <term name="season-02">\xE9t\xE9</term>
    <term name="season-03">automne</term>
    <term name="season-04">hiver</term>
  </terms>
</locale>
`,"fr-FR":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="fr-FR">
  <info>
    <translator>
      <name>Gr\xE9goire Colly</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false" limit-day-ordinals-to-day-1="true"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">consult\xE9 le</term>
    <term name="and">et</term>
    <term name="and others">et autres</term>
    <term name="anonymous">anonyme</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">sur</term>
    <term name="available at">disponible sur</term>
    <term name="by">par</term>
    <term name="circa">vers</term>
    <term name="circa" form="short">v.</term>
    <term name="cited">cit\xE9</term>
    <term name="edition" gender="feminine">
      <single>\xE9dition</single>
      <multiple>\xE9ditions</multiple>
    </term>
    <term name="edition" form="short">\xE9d.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">\xE0 para\xEEtre</term>
    <term name="from">\xE0 l'adresse</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">sous presse</term>
    <term name="internet">Internet</term>
    <term name="interview">entretien</term>
    <term name="letter">lettre</term>
    <term name="no date">sans date</term>
    <term name="no date" form="short">s.&#160;d.</term>
    <term name="online">en ligne</term>
    <term name="presented at">pr\xE9sent\xE9 \xE0</term>
    <term name="reference">
      <single>r\xE9f\xE9rence</single>
      <multiple>r\xE9f\xE9rences</multiple>
    </term>
    <term name="reference" form="short">
      <single>r\xE9f.</single>
      <multiple>r\xE9f.</multiple>
    </term>
    <term name="retrieved">consult\xE9</term>
    <term name="scale">\xE9chelle</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">apr. J.-C.</term>
    <term name="bc">av. J.-C.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB&#160;</term>
    <term name="close-quote">&#160;\xBB</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">&#8209;</term> <!-- non-breaking hyphen -->

    <!-- ORDINALS -->
    <term name="ordinal">\u1D49</term>
    <term name="ordinal-01" gender-form="feminine" match="whole-number">\u02B3\u1D49</term>
    <term name="ordinal-01" gender-form="masculine" match="whole-number">\u1D49\u02B3</term>
    
    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">premier</term>
    <term name="long-ordinal-02">deuxi\xE8me</term>
    <term name="long-ordinal-03">troisi\xE8me</term>
    <term name="long-ordinal-04">quatri\xE8me</term>
    <term name="long-ordinal-05">cinqui\xE8me</term>
    <term name="long-ordinal-06">sixi\xE8me</term>
    <term name="long-ordinal-07">septi\xE8me</term>
    <term name="long-ordinal-08">huiti\xE8me</term>
    <term name="long-ordinal-09">neuvi\xE8me</term>
    <term name="long-ordinal-10">dixi\xE8me</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>livre</single>
      <multiple>livres</multiple>
    </term>
    <term name="chapter">
      <single>chapitre</single>
      <multiple>chapitres</multiple>
    </term>
    <term name="column">
      <single>colonne</single>
      <multiple>colonnes</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue" gender="masculine">
      <single>num\xE9ro</single>
      <multiple>num\xE9ros</multiple>
    </term>
    <term name="line">
      <single>ligne</single>
      <multiple>lignes</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opus</multiple>
    </term>
    <term name="page">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="number-of-pages">
      <single>page</single>
      <multiple>pages</multiple>
    </term>
    <term name="paragraph">
      <single>paragraphe</single>
      <multiple>paragraphes</multiple>
    </term>
    <term name="part">
      <single>partie</single>
      <multiple>parties</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verset</single>
      <multiple>versets</multiple>
    </term>
    <term name="volume" gender="masculine">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">liv.</term>
    <term name="chapter" form="short">chap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">
      <single>f\u1D52</single>
      <multiple>f\u1D52\u02E2</multiple>
    </term>
    <term name="issue" form="short">
      <single>n\u1D52</single>
      <multiple>n\u1D52\u02E2</multiple>
    </term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="paragraph" form="short">paragr.</term>
    <term name="part" form="short">part.</term>
    <term name="section" form="short">sect.</term>
    <term name="sub verbo" form="short">
      <single>s.&#160;v.</single>
      <multiple>s.&#160;vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vol.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>r\xE9alisateur</single>
      <multiple>r\xE9alisateurs</multiple>
    </term>
    <term name="editor">
      <single>\xE9diteur</single>
      <multiple>\xE9diteurs</multiple>
    </term>
    <term name="editorial-director">
      <single>directeur</single>
      <multiple>directeurs</multiple>
    </term>
    <term name="illustrator">
      <single>illustrateur</single>
      <multiple>illustrateurs</multiple>
    </term>
    <term name="translator">
      <single>traducteur</single>
      <multiple>traducteurs</multiple>
    </term>
    <term name="editortranslator">
      <single>\xE9diteur et traducteur</single>
      <multiple>\xE9diteurs et traducteurs</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>r\xE9al.</single>
      <multiple>r\xE9al.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\xE9d.</single>
      <multiple>\xE9d.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>dir.</single>
      <multiple>dir.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trad.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>\xE9d. et trad.</single>
      <multiple>\xE9d. et trad.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">par</term>
    <term name="director" form="verb">r\xE9alis\xE9 par</term>
    <term name="editor" form="verb">\xE9dit\xE9 par</term>
    <term name="editorial-director" form="verb">sous la direction de</term>
    <term name="illustrator" form="verb">illustr\xE9 par</term>
    <term name="interviewer" form="verb">entretien r\xE9alis\xE9 par</term>
    <term name="recipient" form="verb">\xE0</term>
    <term name="reviewed-author" form="verb">par</term>
    <term name="translator" form="verb">traduit par</term>
    <term name="editortranslator" form="verb">\xE9dit\xE9 et traduit par</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">r\xE9al. par</term>
    <term name="editor" form="verb-short">\xE9d. par</term>
    <term name="editorial-director" form="verb-short">ss la dir. de</term>
    <term name="illustrator" form="verb-short">ill. par</term>
    <term name="translator" form="verb-short">trad. par</term>
    <term name="editortranslator" form="verb-short">\xE9d. et trad. par</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01" gender="masculine">janvier</term>
    <term name="month-02" gender="masculine">f\xE9vrier</term>
    <term name="month-03" gender="masculine">mars</term>
    <term name="month-04" gender="masculine">avril</term>
    <term name="month-05" gender="masculine">mai</term>
    <term name="month-06" gender="masculine">juin</term>
    <term name="month-07" gender="masculine">juillet</term>
    <term name="month-08" gender="masculine">ao\xFBt</term>
    <term name="month-09" gender="masculine">septembre</term>
    <term name="month-10" gender="masculine">octobre</term>
    <term name="month-11" gender="masculine">novembre</term>
    <term name="month-12" gender="masculine">d\xE9cembre</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">janv.</term>
    <term name="month-02" form="short">f\xE9vr.</term>
    <term name="month-03" form="short">mars</term>
    <term name="month-04" form="short">avr.</term>
    <term name="month-05" form="short">mai</term>
    <term name="month-06" form="short">juin</term>
    <term name="month-07" form="short">juill.</term>
    <term name="month-08" form="short">ao\xFBt</term>
    <term name="month-09" form="short">sept.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">d\xE9c.</term>

    <!-- SEASONS -->
    <term name="season-01">printemps</term>
    <term name="season-02">\xE9t\xE9</term>
    <term name="season-03">automne</term>
    <term name="season-04">hiver</term>
  </terms>
</locale>
`,"he-IL":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="he-IL">
  <info>
    <translator>
      <name>roypeled1</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u05E0\u05D1\u05D3\u05E7 \u05DC\u05D0\u05D7\u05E8\u05D5\u05E0\u05D4</term>
    <term name="and">\u05D5</term>
    <term name="and others">\u05D5\u05D0\u05D7\u05E8\u05D9\u05DD</term>
    <term name="anonymous">\u05D0\u05DC\u05DE\u05D5\u05E0\u05D9</term>
    <term name="anonymous" form="short">anon</term>
    <term name="at">-\u05D1</term>
    <term name="available at">\u05D6\u05DE\u05D9\u05DF \u05D1</term>
    <term name="by">\u05E2\u05DC-\u05D9\u05D3\u05D9</term>
    <term name="circa">\u05DC\u05E2\u05E8\u05DA</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">\u05DE\u05E6\u05D5\u05D8\u05D8 \u05D1</term>
    <term name="edition">
      <single>\u05DE\u05D4\u05D3\u05D5\u05E8\u05D4</single>
      <multiple>\u05DE\u05D4\u05D3\u05D5\u05E8\u05D5\u05EA</multiple>
    </term>
    <term name="edition" form="short">ed</term>
    <term name="et-al">\u05D5\u05D0\u05D7\u05E8\u05D9\u05DD</term>
    <term name="forthcoming">\u05E6\u05E4\u05D5\u05D9</term>
    <term name="from">\u05DE\u05EA\u05D5\u05DA</term>
    <term name="ibid">\u05E9\u05DD</term>
    <term name="in">\u05D1\u05EA\u05D5\u05DA</term>
    <term name="in press">\u05D1\u05D4\u05D3\u05E4\u05E1\u05D4</term>
    <term name="internet">\u05D0\u05D9\u05E0\u05D8\u05E8\u05E0\u05D8</term>
    <term name="interview">\u05E8\u05D0\u05D9\u05D5\u05DF</term>
    <term name="letter">\u05DE\u05DB\u05EA\u05D1</term>
    <term name="no date">\u05D0\u05D9\u05DF \u05E0\u05EA\u05D5\u05E0\u05D9\u05DD</term>
    <term name="no date" form="short">nd</term>
    <term name="online">\u05DE\u05E7\u05D5\u05D5\u05DF</term>
    <term name="presented at">\u05D4\u05D5\u05E6\u05D2 \u05D1</term>
    <term name="reference">
      <single>\u05D4\u05E4\u05E0\u05D9\u05D4</single>
      <multiple>\u05D4\u05E4\u05E0\u05D9\u05D5\u05EA</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">\u05D0\u05D5\u05D7\u05D6\u05E8</term>
    <term name="scale">scale</term>
    <term name="version">\u05D2\u05D9\u05E8\u05E1\u05D4</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u05DC\u05E1\u05E4\u05D9\u05E8\u05D4</term>
    <term name="bc">\u05DC\u05E4\u05E0\u05D9 \u05D4\u05E1\u05E4\u05D9\u05E8\u05D4</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u05E8\u05D0\u05E9\u05D5\u05DF</term>
    <term name="long-ordinal-02">\u05E9\u05E0\u05D9</term>
    <term name="long-ordinal-03">\u05E9\u05DC\u05D9\u05E9\u05D9</term>
    <term name="long-ordinal-04">\u05E8\u05D1\u05D9\u05E2\u05D9</term>
    <term name="long-ordinal-05">\u05D7\u05DE\u05D9\u05E9\u05D9</term>
    <term name="long-ordinal-06">\u05E9\u05D9\u05E9\u05D9</term>
    <term name="long-ordinal-07">\u05E9\u05D1\u05D9\u05E2\u05D9</term>
    <term name="long-ordinal-08">\u05E9\u05DE\u05D9\u05E0\u05D9</term>
    <term name="long-ordinal-09">\u05EA\u05E9\u05D9\u05E2\u05D9</term>
    <term name="long-ordinal-10">\u05E2\u05E9\u05D9\u05E8\u05D9</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u05E1\u05E4\u05E8</single>
      <multiple>\u05E1\u05E4\u05E8\u05D9\u05DD</multiple>
    </term>
    <term name="chapter">
      <single>\u05E4\u05E8\u05E7</single>
      <multiple>\u05E4\u05E8\u05E7\u05D9\u05DD</multiple>
    </term>
    <term name="column">
      <single>\u05D8\u05D5\u05E8</single>
      <multiple>\u05D8\u05D5\u05E8\u05D9\u05DD</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>\u05E4\u05D5\u05DC\u05D9\u05D5</single>
      <multiple>\u05E4\u05D5\u05DC\u05D9\u05D5</multiple>
    </term>
    <term name="issue">
      <single>\u05DE\u05E1\u05E4\u05E8</single>
      <multiple>\u05DE\u05E1\u05E4\u05E8\u05D9\u05DD</multiple>
    </term>
    <term name="line">
      <single>\u05E9\u05D5\u05E8\u05D4</single>
      <multiple>\u05E9\u05D5\u05E8\u05D5\u05EA</multiple>
    </term>
    <term name="note">
      <single>\u05D4\u05E2\u05E8\u05D4</single>
      <multiple>\u05D4\u05E2\u05E8\u05D5\u05EA</multiple>
    </term>
    <term name="opus">
      <single>\u05D0\u05D5\u05E4\u05D5\u05E1</single>
      <multiple>\u05D0\u05D5\u05E4\u05E8\u05D4</multiple>
    </term>
    <term name="page">
      <single>\u05E2\u05DE\u05D5\u05D3</single>
      <multiple>\u05E2\u05DE\u05D5\u05D3\u05D9\u05DD</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u05E2\u05DE\u05D5\u05D3</single>
      <multiple>\u05E2\u05DE\u05D5\u05D3\u05D9\u05DD</multiple>
    </term>
    <term name="paragraph">
      <single>\u05E4\u05D9\u05E1\u05E7\u05D4</single>
      <multiple>\u05E4\u05D9\u05E1\u05E7\u05D0\u05D5\u05EA</multiple>
    </term>
    <term name="part">
      <single>\u05D7\u05DC\u05E7</single>
      <multiple>\u05D7\u05DC\u05E7\u05D9\u05DD</multiple>
    </term>
    <term name="section">
      <single>\u05E1\u05E2\u05D9\u05E3</single>
      <multiple>\u05E1\u05E2\u05D9\u05E4\u05D9\u05DD</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>\u05D1\u05D9\u05EA</single>
      <multiple>\u05D1\u05EA\u05D9\u05DD</multiple>
    </term>
    <term name="volume">
      <single>\u05DB\u05E8\u05DA</single>
      <multiple>\u05DB\u05E8\u05DB\u05D9\u05DD</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk</term>
    <term name="chapter" form="short">chap</term>
    <term name="column" form="short">col</term>
    <term name="figure" form="short">fig</term>
    <term name="folio" form="short">f</term>
    <term name="issue" form="short">no</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op</term>
    <term name="page" form="short">
      <single>'\u05E2\u05DE</single>
      <multiple>'\u05E2\u05DE</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>'\u05E2\u05DE</single>
      <multiple>'\u05E2\u05DE</multiple>
    </term>
    <term name="paragraph" form="short">para</term>
    <term name="part" form="short">pt</term>
    <term name="section" form="short">\u05E1'</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v</single>
      <multiple>vv</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol</single>
      <multiple>vols</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>\u05D1\u05DE\u05D0\u05D9</single>
      <multiple>\u05D1\u05DE\u05D0\u05D9\u05DD</multiple>
    </term>
    <term name="editor">
      <single>\u05E2\u05D5\u05E8\u05DA</single>
      <multiple>\u05E2\u05D5\u05E8\u05DB\u05D9\u05DD</multiple>
    </term>
    <term name="editorial-director">
      <single>\u05E2\u05D5\u05E8\u05DA \u05E8\u05D0\u05E9\u05D9</single>
      <multiple>\u05E2\u05D5\u05E8\u05DB\u05D9\u05DD \u05E8\u05D0\u05E9\u05D9\u05D9\u05DD</multiple>
    </term>
    <term name="illustrator">
      <single>\u05DE\u05D0\u05D9\u05D9\u05E8</single>
      <multiple>\u05DE\u05D0\u05D9\u05D9\u05E8\u05D9\u05DD</multiple>
    </term>
    <term name="translator">
      <single>\u05DE\u05EA\u05E8\u05D2\u05DD</single>
      <multiple>\u05DE\u05EA\u05E8\u05D2\u05DE\u05D9\u05DD</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed</single>
      <multiple>eds</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>tran</single>
      <multiple>trans</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">\u05D1\u05D5\u05D9\u05DD \u05E2"\u05D9</term>
    <term name="editor" form="verb">\u05E0\u05E2\u05E8\u05DA \u05E2"\u05D9</term>
    <term name="editorial-director" form="verb">\u05D1\u05D5\u05D9\u05DD \u05E2"\u05D9</term>
    <term name="illustrator" form="verb">\u05D0\u05D5\u05D9\u05E8 \u05E2"\u05D9</term>
    <term name="interviewer" form="verb">\u05E8\u05D5\u05D0\u05D9\u05D9\u05DF \u05E2"\u05D9</term>
    <term name="recipient" form="verb">\u05D0\u05DC</term>
    <term name="reviewed-author" form="verb">\u05E2"\u05D9</term>
    <term name="translator" form="verb">\u05EA\u05D5\u05E8\u05D2\u05DD \u05E2"\u05D9</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">trans</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u05D9\u05E0\u05D5\u05D0\u05E8</term>
    <term name="month-02">\u05E4\u05D1\u05E8\u05D5\u05D0\u05E8</term>
    <term name="month-03">\u05DE\u05E8\u05E5</term>
    <term name="month-04">\u05D0\u05E4\u05E8\u05D9\u05DC</term>
    <term name="month-05">\u05DE\u05D0\u05D9</term>
    <term name="month-06">\u05D9\u05D5\u05E0\u05D9</term>
    <term name="month-07">\u05D9\u05D5\u05DC\u05D9</term>
    <term name="month-08">\u05D0\u05D5\u05D2\u05D5\u05E1\u05D8</term>
    <term name="month-09">\u05E1\u05E4\u05D8\u05DE\u05D1\u05E8</term>
    <term name="month-10">\u05D0\u05D5\u05E7\u05D8\u05D5\u05D1\u05E8</term>
    <term name="month-11">\u05E0\u05D5\u05D1\u05DE\u05D1\u05E8</term>
    <term name="month-12">\u05D3\u05E6\u05DE\u05D1\u05E8</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan</term>
    <term name="month-02" form="short">Feb</term>
    <term name="month-03" form="short">Mar</term>
    <term name="month-04" form="short">Apr</term>
    <term name="month-05" form="short">May</term>
    <term name="month-06" form="short">Jun</term>
    <term name="month-07" form="short">Jul</term>
    <term name="month-08" form="short">Aug</term>
    <term name="month-09" form="short">Sep</term>
    <term name="month-10" form="short">Oct</term>
    <term name="month-11" form="short">Nov</term>
    <term name="month-12" form="short">Dec</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"hr-HR":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="hr-HR">
  <info>
    <translator>
      <name>tvrbanec</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=". "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year" suffix="."/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
  </date>
  <terms>
    <term name="accessed">pristupljeno</term>
    <term name="and">i</term>
    <term name="and others">i ostali</term>
    <term name="anonymous">anonimno</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">na</term>
    <term name="available at">dostupno na</term>
    <term name="by">od</term>
    <term name="circa">oko</term>
    <term name="circa" form="short">oko</term>
    <term name="cited">citirano</term>
    <term name="edition">
      <single>izdanje</single>
      <multiple>izdanja</multiple>
    </term>
    <term name="edition" form="short">izd.</term>
    <term name="et-al">i ostali</term>
    <term name="forthcoming">u pripremi</term>
    <term name="from">od</term>
    <term name="ibid">ibid.</term>
    <term name="in">u</term>
    <term name="in press">u tisku</term>
    <term name="internet">internet</term>
    <term name="interview">intervju</term>
    <term name="letter">pismo</term>
    <term name="no date">bez datuma</term>
    <term name="no date" form="short">bez dat.</term>
    <term name="online">na internetu</term>
    <term name="presented at">predstavljeno na</term>
    <term name="reference">
      <single>reference</single>
      <multiple>reference</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">preuzeto</term>
    <term name="scale">skala</term>
    <term name="version">verzija</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad"></term>
    <term name="bc">pr. Kr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u201A</term>
    <term name="close-inner-quote">\u2018</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">prvi</term>
    <term name="long-ordinal-02">drugi</term>
    <term name="long-ordinal-03">tre\u0107i</term>
    <term name="long-ordinal-04">\u010Detvrti</term>
    <term name="long-ordinal-05">peti</term>
    <term name="long-ordinal-06">\u0161esti</term>
    <term name="long-ordinal-07">sedmi</term>
    <term name="long-ordinal-08">osmi</term>
    <term name="long-ordinal-09">deveti</term>
    <term name="long-ordinal-10">deseti</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>knjiga</single>
      <multiple>knjige</multiple>
    </term>
    <term name="chapter">
      <single>poglavlje</single>
      <multiple>poglavlja</multiple>
    </term>
    <term name="column">
      <single>stupac</single>
      <multiple>stupci</multiple>
    </term>
    <term name="figure">
      <single>crte\u017E</single>
      <multiple>crte\u017Ei</multiple>
    </term>
    <term name="folio">
      <single>folija</single>
      <multiple>folije</multiple>
    </term>
    <term name="issue">
      <single>izdanje</single>
      <multiple>izdanja</multiple>
    </term>
    <term name="line">
      <single>red</single>
      <multiple>redovi</multiple>
    </term>
    <term name="note">
      <single>bilje\u0161ka</single>
      <multiple>bilje\u0161ke</multiple>
    </term>
    <term name="opus">
      <single>djelo</single>
      <multiple>djela</multiple>
    </term>
    <term name="page">
      <single>stranica</single>
      <multiple>stranice</multiple>
    </term>
    <term name="number-of-pages">
      <single>stranica</single>
      <multiple>stranice</multiple>
    </term>
    <term name="paragraph">
      <single>pasus</single>
      <multiple>pasusi</multiple>
    </term>
    <term name="part">
      <single>dio</single>
      <multiple>dijelova</multiple>
    </term>
    <term name="section">
      <single>odjeljak</single>
      <multiple>odjeljci</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>stih</single>
      <multiple>stihovi</multiple>
    </term>
    <term name="volume">
      <single>svezak</single>
      <multiple>svesci</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">knj.</term>
    <term name="chapter" form="short">pogl.</term>
    <term name="column" form="short">stup.</term>
    <term name="figure" form="short">crt.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">izd.</term>
    <term name="line" form="short">red</term>
    <term name="note" form="short">bilj.</term>
    <term name="opus" form="short">sv.</term>
    <term name="page" form="short">
      <single>str.</single>
      <multiple>str.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>str.</single>
      <multiple>str.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">dio</term>
    <term name="section" form="short">od.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>st.</single>
      <multiple>st.</multiple>
    </term>
    <term name="volume" form="short">
      <single>sv.</single>
      <multiple>sv.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>voditelj</single>
      <multiple>voditelji</multiple>
    </term>
    <term name="editor">
      <single>urednik</single>
      <multiple>urednici</multiple>
    </term>
    <term name="editorial-director">
      <single>urednik</single>
      <multiple>urednici</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrator</single>
      <multiple>ilustratori</multiple>
    </term>
    <term name="translator">
      <single>prevoditelj</single>
      <multiple>prevoditelji</multiple>
    </term>
    <term name="editortranslator">
      <single>urednik &amp; prevoditelj</single>
      <multiple>urednici &amp; prevoditelji</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>vod.</single>
      <multiple>vod.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ur.</single>
      <multiple>ur.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ur.-vod.</single>
      <multiple>ur.-vod.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>il.</single>
      <multiple>il.</multiple>
    </term>
    <term name="translator" form="short">
      <single>prev.</single>
      <multiple>prev.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ur. &amp; prev.</single>
      <multiple>ur. &amp; prev.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">od</term>
    <term name="director" form="verb">vodio</term>
    <term name="editor" form="verb">uredio</term>
    <term name="editorial-director" form="verb">uredio</term>
    <term name="illustrator" form="verb">ilustrirao</term>
    <term name="interviewer" form="verb">intervjuirao</term>
    <term name="recipient" form="verb">primatelj</term>
    <term name="reviewed-author" form="verb">pregledao</term>
    <term name="translator" form="verb">preveo</term>
    <term name="editortranslator" form="verb">uredio &amp; preveo</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">vod.</term>
    <term name="editor" form="verb-short">ur.</term>
    <term name="editorial-director" form="verb-short">ur. vod.</term>
    <term name="illustrator" form="verb-short">ilus.</term>
    <term name="translator" form="verb-short">prev.</term>
    <term name="editortranslator" form="verb-short">ur. &amp; prev.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">sije\u010Danj</term>
    <term name="month-02">velja\u010Da</term>
    <term name="month-03">o\u017Eujak</term>
    <term name="month-04">travanj</term>
    <term name="month-05">svibanj</term>
    <term name="month-06">lipanj</term>
    <term name="month-07">srpanj</term>
    <term name="month-08">kolovoz</term>
    <term name="month-09">rujan</term>
    <term name="month-10">listopad</term>
    <term name="month-11">studeni</term>
    <term name="month-12">prosinac</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">sij.</term>
    <term name="month-02" form="short">velj.</term>
    <term name="month-03" form="short">o\u017Eu.</term>
    <term name="month-04" form="short">tra.</term>
    <term name="month-05" form="short">svi.</term>
    <term name="month-06" form="short">lip.</term>
    <term name="month-07" form="short">srp.</term>
    <term name="month-08" form="short">kol.</term>
    <term name="month-09" form="short">ruj.</term>
    <term name="month-10" form="short">lis.</term>
    <term name="month-11" form="short">stu.</term>
    <term name="month-12" form="short">pros.</term>

    <!-- SEASONS -->
    <term name="season-01">prolje\u0107e</term>
    <term name="season-02">ljeto</term>
    <term name="season-03">jesen</term>
    <term name="season-04">zima</term>
  </terms>
</locale>
`,"hu-HU":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="hu-HU">
  <info>
    <translator>
      <name>Miklos Vajna</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2014-06-17T09:56:35+02:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="year"/>
    <date-part name="month" prefix=". "/>
    <date-part name="day" prefix=" " suffix="."/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="."/>
    <date-part name="day" form="numeric-leading-zeros" prefix="."/>
  </date>
  <terms>
    <term name="accessed">el\xE9r\xE9s</term>
    <term name="and">\xE9s</term>
    <term name="and others">\xE9s m\xE1sok</term>
    <term name="anonymous">szerz\u0151 n\xE9lk\xFCl</term>
    <term name="anonymous" form="short">sz. n.</term>
    <term name="at"></term>
    <term name="available at">el\xE9rhet\u0151</term>
    <term name="by">by</term>
    <term name="circa">k\xF6r\xFClbel\xFCl</term>
    <term name="circa" form="short">kb.</term>
    <term name="cited">id\xE9zi</term>
    <term name="edition">
      <single>kiad\xE1s</single>
      <multiple>kiad\xE1s</multiple>
    </term>
    <term name="edition" form="short">kiad.</term>
    <term name="et-al">\xE9s mtsai.</term>
    <term name="forthcoming">megjelen\xE9s alatt</term>
    <term name="from">forr\xE1s</term>
    <term name="ibid">uo.</term>
    <term name="in">in</term>
    <term name="in press">nyomtat\xE1s alatt</term>
    <term name="internet">internet</term>
    <term name="interview">interj\xFA</term>
    <term name="letter">lev\xE9l</term>
    <term name="no date">\xE9vsz\xE1m n\xE9lk\xFCl</term>
    <term name="no date" form="short">\xE9. n.</term>
    <term name="online">online</term>
    <term name="presented at">el\u0151ad\xE1s</term>
    <term name="reference">
      <single>hivatkoz\xE1s</single>
      <multiple>hivatkoz\xE1s</multiple>
    </term>
    <term name="reference" form="short">
      <single>hiv.</single>
      <multiple>hiv.</multiple>
    </term>
    <term name="retrieved">el\xE9r\xE9s</term>
    <term name="scale">sk\xE1la</term>
    <term name="version">verzi\xF3</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">Kr. u.</term>
    <term name="bc">Kr. e.</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">i. sz.</term>
    <term name="bc">i. e.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\xBB</term>
    <term name="close-inner-quote">\xAB</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">els\u0151</term>
    <term name="long-ordinal-02">m\xE1sodik</term>
    <term name="long-ordinal-03">harmadik</term>
    <term name="long-ordinal-04">negyedik</term>
    <term name="long-ordinal-05">\xF6t\xF6dik</term>
    <term name="long-ordinal-06">hatodik</term>
    <term name="long-ordinal-07">hetedik</term>
    <term name="long-ordinal-08">nyolcadik</term>
    <term name="long-ordinal-09">kilencedik</term>
    <term name="long-ordinal-10">tizedik</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>k\xF6nyv</single>
      <multiple>k\xF6nyv</multiple>
    </term>
    <term name="chapter">
      <single>fejezet</single>
      <multiple>fejezet</multiple>
    </term>
    <term name="column">
      <single>oszlop</single>
      <multiple>oszlop</multiple>
    </term>
    <term name="figure">
      <single>\xE1bra</single>
      <multiple>\xE1bra</multiple>
    </term>
    <term name="folio">
      <single>f\xF3li\xE1ns</single>
      <multiple>f\xF3li\xE1ns</multiple>
    </term>
    <term name="issue">
      <single>sz\xE1m</single>
      <multiple>sz\xE1m</multiple>
    </term>
    <term name="line">
      <single>sor</single>
      <multiple>sor</multiple>
    </term>
    <term name="note">
      <single>jegyzet</single>
      <multiple>jegyzet</multiple>
    </term>
    <term name="opus">
      <single>m\u0171</single>
      <multiple>m\u0171</multiple>
    </term>
    <term name="page">
      <single>oldal</single>
      <multiple>oldal</multiple>
    </term>
    <term name="number-of-pages">
      <single>oldal</single>
      <multiple>oldal</multiple>
    </term>
    <term name="paragraph">
      <single>bekezd\xE9s</single>
      <multiple>bekezd\xE9s</multiple>
    </term>
    <term name="part">
      <single>r\xE9sz</single>
      <multiple>r\xE9sz</multiple>
    </term>
    <term name="section">
      <single>szakasz</single>
      <multiple>szakasz</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>versszak</single>
      <multiple>versszak</multiple>
    </term>
    <term name="volume">
      <single>k\xF6tet</single>
      <multiple>k\xF6tet</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">k\xF6nyv</term>
    <term name="chapter" form="short">fej.</term>
    <term name="column" form="short">oszl.</term>
    <term name="figure" form="short">\xE1br.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">sz.</term>
    <term name="line" form="short">s.</term>
    <term name="note" form="short">j.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>o.</single>
      <multiple>o.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>o.</single>
      <multiple>o.</multiple>
    </term>
    <term name="paragraph" form="short">bek.</term>
    <term name="part" form="short">r\xE9sz</term>
    <term name="section" form="short">szak.</term>
    <term name="sub verbo" form="short">
      <single>s. v.</single>
      <multiple>s. vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>vsz.</single>
      <multiple>vsz.</multiple>
    </term>
    <term name="volume" form="short">
      <single>k\xF6t.</single>
      <multiple>k\xF6t.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>igazgat\xF3</single>
      <multiple>igazgat\xF3</multiple>
    </term>
    <term name="editor">
      <single>szerkeszt\u0151</single>
      <multiple>szerkeszt\u0151</multiple>
    </term>
    <term name="editorial-director">
      <single>szerkeszt\u0151s\xE9gi igazgat\xF3</single>
      <multiple>szerkeszt\u0151s\xE9gi igazgat\xF3</multiple>
    </term>
    <term name="illustrator">
      <single>illusztr\xE1tor</single>
      <multiple>illusztr\xE1tor</multiple>
    </term>
    <term name="translator">
      <single>ford\xEDt\xF3</single>
      <multiple>ford\xEDt\xF3</multiple>
    </term>
    <term name="editortranslator">
      <single>szerkeszt\u0151 &amp; ford\xEDt\xF3</single>
      <multiple>szerkeszt\u0151 &amp; ford\xEDt\xF3</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>ig.</single>
      <multiple>ig.</multiple>
    </term>
    <term name="editor" form="short">
      <single>szerk.</single>
      <multiple>szerk.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>szerk. ig.</single>
      <multiple>szerk. ig.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>ford.</single>
      <multiple>ford.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>szerk. &amp; ford.</single>
      <multiple>szerk. &amp; ford.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">szerkesztette</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illusztr\xE1lta</term>
    <term name="interviewer" form="verb">interj\xFAk\xE9sz\xEDt\u0151</term>
    <term name="recipient" form="verb">c\xEDmzett</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">ford\xEDtotta</term>
    <term name="editortranslator" form="verb">szerkesztette &amp; ford\xEDtotta</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">ig.</term>
    <term name="editor" form="verb-short">szerk.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">ill.</term>
    <term name="translator" form="verb-short">ford.</term>
    <term name="editortranslator" form="verb-short">szerk. &amp; ford.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">janu\xE1r</term>
    <term name="month-02">febru\xE1r</term>
    <term name="month-03">m\xE1rcius</term>
    <term name="month-04">\xE1prilis</term>
    <term name="month-05">m\xE1jus</term>
    <term name="month-06">j\xFAnius</term>
    <term name="month-07">j\xFAlius</term>
    <term name="month-08">augusztus</term>
    <term name="month-09">szeptember</term>
    <term name="month-10">okt\xF3ber</term>
    <term name="month-11">november</term>
    <term name="month-12">december</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">febr.</term>
    <term name="month-03" form="short">m\xE1rc.</term>
    <term name="month-04" form="short">\xE1pr.</term>
    <term name="month-05" form="short">m\xE1j.</term>
    <term name="month-06" form="short">j\xFAn.</term>
    <term name="month-07" form="short">j\xFAl.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">szept.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">tavasz</term>
    <term name="season-02">ny\xE1r</term>
    <term name="season-03">\u0151sz</term>
    <term name="season-04">t\xE9l</term>
  </terms>
</locale>
`,"id-ID":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="id-ID">
  <info>
    <translator>
      <name>faizhabibullah</name>
    </translator>
    <translator>
      <name>Deden Habibi</name>
    </translator>
    <translator>
      <name>xbypass</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2015-08-05T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="true"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="-"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="-"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">diakses</term>
    <term name="and">dan</term>
    <term name="and others">dan lainnya</term>
    <term name="anonymous">anonim</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">pada</term>
    <term name="available at">tersedia pada</term>
    <term name="by">oleh</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">ca.</term>
    <term name="cited">dikutip</term>
    <term name="edition">
      <single>edisi</single>
      <multiple>edisi</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">dkk.</term>
    <term name="forthcoming">mendatang</term>
    <term name="from">dari</term>
    <term name="ibid">ibid.</term>
    <term name="in">dalam</term>
    <term name="in press">dalam proses cetakan</term>
    <term name="internet">internet</term>
    <term name="interview">wawancara</term>
    <term name="letter">surat</term>
    <term name="no date">tanpa tanggal</term>
    <term name="no date" form="short">t.t.</term>
    <term name="online">daring</term>
    <term name="presented at">dipresentasikan pada</term>
    <term name="reference">
      <single>referensi</single>
      <multiple>referensi</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">diambil</term>
    <term name="scale">skala</term>
    <term name="version">versi</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">M</term>
    <term name="bc">SM</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal"></term>
    <term name="ordinal-01"></term>
    <term name="ordinal-02"></term>
    <term name="ordinal-03"></term>
    <term name="ordinal-11"></term>
    <term name="ordinal-12"></term>
    <term name="ordinal-13"></term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">pertama</term>
    <term name="long-ordinal-02">kedua</term>
    <term name="long-ordinal-03">ketiga</term>
    <term name="long-ordinal-04">keempat</term>
    <term name="long-ordinal-05">kelima</term>
    <term name="long-ordinal-06">keenam</term>
    <term name="long-ordinal-07">ketujuh</term>
    <term name="long-ordinal-08">kedelapan</term>
    <term name="long-ordinal-09">kesembilan</term>
    <term name="long-ordinal-10">kesepuluh</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>buku</single>
      <multiple>buku</multiple>
    </term>
    <term name="chapter">
      <single>bab</single>
      <multiple>bab</multiple>
    </term>
    <term name="column">
      <single>kolom</single>
      <multiple>kolom</multiple>
    </term>
    <term name="figure">
      <single>gambar</single>
      <multiple>gambar</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folio</multiple>
    </term>
    <term name="issue">
      <single>nomor</single>
      <multiple>nomor</multiple>
    </term>
    <term name="line">
      <single>baris</single>
      <multiple>baris</multiple>
    </term>
    <term name="note">
      <single>catatan</single>
      <multiple>catatan</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>halaman</single>
      <multiple>halaman</multiple>
    </term>
    <term name="number-of-pages">
      <single>halaman</single>
      <multiple>halaman</multiple>
    </term>
    <term name="paragraph">
      <single>paragraf</single>
      <multiple>paragraf</multiple>
    </term>
    <term name="part">
      <single>bagian</single>
      <multiple>bagian</multiple>
    </term>
    <term name="section">
      <single>bagian</single>
      <multiple>bagian</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>ayat</single>
      <multiple>ayat</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volume</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk.</term>
    <term name="chapter" form="short">bb.</term>
    <term name="column" form="short">kol.</term>
    <term name="figure" form="short">gbr.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">no.</term>
    <term name="line" form="short">brs.</term>
    <term name="note" form="short">ctt.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>hlm.</single>
      <multiple>hlm.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>hlm.</single>
      <multiple>hlm.</multiple>
    </term>
    <term name="paragraph" form="short">para.</term>
    <term name="part" form="short">bag.</term>
    <term name="section" form="short">bag.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>a.</single>
      <multiple>a.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vol.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>direktur</single>
      <multiple>direktur</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editor</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editor</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrator</single>
      <multiple>ilustrator</multiple>
    </term>
    <term name="translator">
      <single>penerjemah</single>
      <multiple>penerjemah</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; penerjemah</single>
      <multiple>editor &amp; penerjemah</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dir.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>il.</single>
      <multiple>il.</multiple>
    </term>
    <term name="translator" form="short">
      <single>penerj.</single>
      <multiple>penerj.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; penerj.</single>
      <multiple>ed. &amp; penerj.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">oleh</term>
    <term name="director" form="verb">diarahkan oleh</term>
    <term name="editor" form="verb">disunting oleh</term>
    <term name="editorial-director" form="verb">disunting oleh</term>
    <term name="illustrator" form="verb">diilustrasi oleh</term>
    <term name="interviewer" form="verb">diwawancara oleh</term>
    <term name="recipient" form="verb">kepada</term>
    <term name="reviewed-author" form="verb">oleh</term>
    <term name="translator" form="verb">diterjemahkan oleh</term>
    <term name="editortranslator" form="verb">disunting &amp; diterjemahkan oleh</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir. oleh</term>
    <term name="editor" form="verb-short">ed. oleh</term>
    <term name="editorial-director" form="verb-short">ed. oleh</term>
    <term name="illustrator" form="verb-short">illus. oleh</term>
    <term name="translator" form="verb-short">trans. oleh</term>
    <term name="editortranslator" form="verb-short">ed. &amp; penerj. oleh</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Januari</term>
    <term name="month-02">Februari</term>
    <term name="month-03">Maret</term>
    <term name="month-04">April</term>
    <term name="month-05">Mei</term>
    <term name="month-06">Juni</term>
    <term name="month-07">Juli</term>
    <term name="month-08">Agustus</term>
    <term name="month-09">September</term>
    <term name="month-10">Oktober</term>
    <term name="month-11">November</term>
    <term name="month-12">Desember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan</term>
    <term name="month-02" form="short">Feb</term>
    <term name="month-03" form="short">Mar</term>
    <term name="month-04" form="short">Apr</term>
    <term name="month-05" form="short">Mei</term>
    <term name="month-06" form="short">Jun</term>
    <term name="month-07" form="short">Jul</term>
    <term name="month-08" form="short">Agu</term>
    <term name="month-09" form="short">Sep</term>
    <term name="month-10" form="short">Okt</term>
    <term name="month-11" form="short">Nov</term>
    <term name="month-12" form="short">Des</term>

    <!-- SEASONS -->
    <term name="season-01">Semi</term>
    <term name="season-02">Panas</term>
    <term name="season-03">Gugur</term>
    <term name="season-04">Dingin</term>
  </terms>
</locale>
`,"is-IS":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="is-IS">
  <info>
    <translator>
      <name>dadamaster</name>
    </translator>
    <translator>
      <name>styrmirm</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=". "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">s\xF3tt</term>
    <term name="and">og</term>
    <term name="and others">og fleiri</term>
    <term name="anonymous">nafnlaus</term>
    <term name="anonymous" form="short">nafnl.</term>
    <term name="at">af</term>
    <term name="available at">a\xF0gengilegt \xE1</term>
    <term name="by">eftir</term>
    <term name="circa">sirka</term>
    <term name="circa" form="short">u.\xFE.b.</term>
    <term name="cited">tilvitnun</term>
    <term name="edition">
      <single>\xFAtg\xE1fa</single>
      <multiple>\xFAtg\xE1fur</multiple>
    </term>
    <term name="edition" form="short">\xFAtg.</term>
    <term name="et-al">o.fl.</term>
    <term name="forthcoming">\xF3birt</term>
    <term name="from">af</term>
    <term name="ibid">sama heimild</term>
    <term name="in">\xED</term>
    <term name="in press">\xED prentun</term>
    <term name="internet">rafr\xE6nt</term>
    <term name="interview">vi\xF0tal</term>
    <term name="letter">br\xE9f</term>
    <term name="no date">engin dagsetning</term>
    <term name="no date" form="short">e.d.</term>
    <term name="online">rafr\xE6nt</term>
    <term name="presented at">flutt \xE1</term>
    <term name="reference">
      <single>tilvitnun</single>
      <multiple>tilvitnanir</multiple>
    </term>
    <term name="reference" form="short">
      <single>tilv.</single>
      <multiple>tilv.</multiple>
    </term>
    <term name="retrieved">s\xF3tt</term>
    <term name="scale">scale</term>
    <term name="version">\xFAtg\xE1fa</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">e.Kr.</term>
    <term name="bc">f.Kr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">fyrsti</term>
    <term name="long-ordinal-02">annar</term>
    <term name="long-ordinal-03">\xFEri\xF0ji</term>
    <term name="long-ordinal-04">fj\xF3r\xF0i</term>
    <term name="long-ordinal-05">fimmti</term>
    <term name="long-ordinal-06">sj\xF6tti</term>
    <term name="long-ordinal-07">sj\xF6undi</term>
    <term name="long-ordinal-08">\xE1ttundi</term>
    <term name="long-ordinal-09">n\xEDundi</term>
    <term name="long-ordinal-10">t\xEDundi</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>b\xF3k</single>
      <multiple>b\xE6kur</multiple>
    </term>
    <term name="chapter">
      <single>kafli</single>
      <multiple>kaflar</multiple>
    </term>
    <term name="column">
      <single>d\xE1lkur</single>
      <multiple>d\xE1lkar</multiple>
    </term>
    <term name="figure">
      <single>mynd</single>
      <multiple>myndir</multiple>
    </term>
    <term name="folio">
      <single>handrit</single>
      <multiple>handrit</multiple>
    </term>
    <term name="issue">
      <single>t\xF6lubla\xF0</single>
      <multiple>t\xF6lubl\xF6\xF0</multiple>
    </term>
    <term name="line">
      <single>l\xEDna</single>
      <multiple>l\xEDnur</multiple>
    </term>
    <term name="note">
      <single>athugasemd</single>
      <multiple>athugasemdir</multiple>
    </term>
    <term name="opus">
      <single>t\xF3nverk</single>
      <multiple>t\xF3nverk</multiple>
    </term>
    <term name="page">
      <single>bla\xF0s\xED\xF0a</single>
      <multiple>bla\xF0s\xED\xF0ur</multiple>
    </term>
    <term name="number-of-pages">
      <single>bla\xF0s\xED\xF0a</single>
      <multiple>bla\xF0s\xED\xF0ur</multiple>
    </term>
    <term name="paragraph">
      <single>m\xE1lsgrein</single>
      <multiple>m\xE1lsgreinar</multiple>
    </term>
    <term name="part">
      <single>hluti</single>
      <multiple>hlutar</multiple>
    </term>
    <term name="section">
      <single>hluti</single>
      <multiple>hlutar</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>vers</single>
      <multiple>vers</multiple>
    </term>
    <term name="volume">
      <single>bindi</single>
      <multiple>bindi</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">b\xF3k</term>
    <term name="chapter" form="short">k.</term>
    <term name="column" form="short">d.</term>
    <term name="figure" form="short">mynd.</term>
    <term name="folio" form="short">handr.</term>
    <term name="issue" form="short">tbl.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">ath.</term>
    <term name="opus" form="short">t\xF3nv.</term>
    <term name="page" form="short">
      <single>bls.</single>
      <multiple>bls.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>bls.</single>
      <multiple>bls.</multiple>
    </term>
    <term name="paragraph" form="short">m\xE1lsgr.</term>
    <term name="part" form="short">hl.</term>
    <term name="section" form="short">hl.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>b.</single>
      <multiple>b.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>leikstj\xF3ri</single>
      <multiple>leikstj\xF3rar</multiple>
    </term>
    <term name="editor">
      <single>ritstj\xF3ri</single>
      <multiple>ritstj\xF3rar</multiple>
    </term>
    <term name="editorial-director">
      <single>ritstj\xF3ri</single>
      <multiple>ritstj\xF3rar</multiple>
    </term>
    <term name="illustrator">
      <single>h\xF6fundur myndskreytinga</single>
      <multiple>h\xF6fundar myndskreytinga</multiple>
    </term>
    <term name="translator">
      <single>\xFE\xFD\xF0andi</single>
      <multiple>\xFE\xFD\xF0endur</multiple>
    </term>
    <term name="editortranslator">
      <single>ritstj\xF3ri og \xFE\xFD\xF0andi</single>
      <multiple>ritstj\xF3rar og \xFE\xFD\xF0endur</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>leikstj.</single>
      <multiple>leikstj.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ritstj.</single>
      <multiple>ritstj.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ritstj.</single>
      <multiple>ritstj.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>h\xF6f. mynd.</single>
      <multiple>h\xF6f. mynd.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\xFE\xFD\xF0.</single>
      <multiple>\xFE\xFD\xF0.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ritstj. og \xFE\xFD\xF0.</single>
      <multiple>ritstj. og \xFE\xFD\xF0.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">eftir</term>
    <term name="director" form="verb">leikst\xFDrt af</term>
    <term name="editor" form="verb">ritst\xFDrt af</term>
    <term name="editorial-director" form="verb">ritst\xFDrt af</term>
    <term name="illustrator" form="verb">myndskreytt af</term>
    <term name="interviewer" form="verb">vi\xF0tal t\xF3k</term>
    <term name="recipient" form="verb">til</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">\xFE\xFDddi</term>
    <term name="editortranslator" form="verb">ritst\xFDrt og \xFE\xFDtt af</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">leikstj.</term>
    <term name="editor" form="verb-short">ritstj.</term>
    <term name="editorial-director" form="verb-short">ritstj.</term>
    <term name="illustrator" form="verb-short">myndskr.</term>
    <term name="translator" form="verb-short">\xFE\xFD\xF0.</term>
    <term name="editortranslator" form="verb-short">ritstj. og \xFE\xFD\xF0.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">jan\xFAar</term>
    <term name="month-02">febr\xFAar</term>
    <term name="month-03">mars</term>
    <term name="month-04">apr\xEDl</term>
    <term name="month-05">ma\xED</term>
    <term name="month-06">j\xFAn\xED</term>
    <term name="month-07">j\xFAl\xED</term>
    <term name="month-08">\xE1g\xFAst</term>
    <term name="month-09">september</term>
    <term name="month-10">okt\xF3ber</term>
    <term name="month-11">n\xF3vember</term>
    <term name="month-12">desember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">ma\xED</term>
    <term name="month-06" form="short">j\xFAn.</term>
    <term name="month-07" form="short">j\xFAl.</term>
    <term name="month-08" form="short">\xE1g\xFA.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">n\xF3v.</term>
    <term name="month-12" form="short">des.</term>

    <!-- SEASONS -->
    <term name="season-01">vor</term>
    <term name="season-02">sumar</term>
    <term name="season-03">haust</term>
    <term name="season-04">vetur</term>
  </terms>
</locale>
`,"it-IT":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="it-IT">
  <info>
    <translator>
      <name>FI App Development</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">consultato</term>
    <term name="and">e</term>
    <term name="and others">e altri</term>
    <term name="anonymous">anonimo</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">a</term>
    <term name="available at">available at</term>
    <term name="by">di</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citato</term>
    <term name="edition">
      <single>edizione</single>
      <multiple>edizioni</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">futuro</term>
    <term name="from">da</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">in stampa</term>
    <term name="internet">internet</term>
    <term name="interview">intervista</term>
    <term name="letter">lettera</term>
    <term name="no date">senza data</term>
    <term name="no date" form="short">s.d.</term>
    <term name="online">in linea</term>
    <term name="presented at">presentato al</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">recuperato</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">d.C.</term>
    <term name="bc">a.C.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">\xBA</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">prima</term>
    <term name="long-ordinal-02">seconda</term>
    <term name="long-ordinal-03">terza</term>
    <term name="long-ordinal-04">quarta</term>
    <term name="long-ordinal-05">quinta</term>
    <term name="long-ordinal-06">sesta</term>
    <term name="long-ordinal-07">settima</term>
    <term name="long-ordinal-08">ottava</term>
    <term name="long-ordinal-09">nona</term>
    <term name="long-ordinal-10">decima</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>libro</single>
      <multiple>libri</multiple>
    </term>
    <term name="chapter">
      <single>capitolo</single>
      <multiple>capitoli</multiple>
    </term>
    <term name="column">
      <single>colonna</single>
      <multiple>colonne</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figure</multiple>
    </term>
    <term name="folio">
      <single>foglio</single>
      <multiple>fogli</multiple>
    </term>
    <term name="issue">
      <single>numero</single>
      <multiple>numeri</multiple>
    </term>
    <term name="line">
      <single>riga</single>
      <multiple>righe</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>note</multiple>
    </term>
    <term name="opus">
      <single>opera</single>
      <multiple>opere</multiple>
    </term>
    <term name="page">
      <single>pagina</single>
      <multiple>pagine</multiple>
    </term>
    <term name="number-of-pages">
      <single>pagina</single>
      <multiple>pagine</multiple>
    </term>
    <term name="paragraph">
      <single>capoverso</single>
      <multiple>capoversi</multiple>
    </term>
    <term name="part">
      <single>parte</single>
      <multiple>parti</multiple>
    </term>
    <term name="section">
      <single>paragrafo</single>
      <multiple>paragrafi</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verso</single>
      <multiple>versi</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumi</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">lib.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">fgl.</term>
    <term name="issue" form="short">n.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>pag.</single>
      <multiple>pagg.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>pag.</single>
      <multiple>pagg.</multiple>
    </term>
    <term name="paragraph" form="short">cpv.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">par.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vol.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>curatore</single>
      <multiple>curatori</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>traduttore</single>
      <multiple>traduttori</multiple>
    </term>
    <term name="editortranslator">
      <single>curatore e traduttore</single>
      <multiple>curatori e tradutori</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>a c. di</single>
      <multiple>a c. di</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trad.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>a c. di e trad. da</single>
      <multiple>a c. di e trad. da</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">di</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">a cura di</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">intervista di</term>
    <term name="recipient" form="verb">a</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">tradotto da</term>
    <term name="editortranslator" form="verb">a cura di e tradotto da</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">a c. di</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">trad. da</term>
    <term name="editortranslator" form="verb-short">a c. di e trad. da</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">gennaio</term>
    <term name="month-02">febbraio</term>
    <term name="month-03">marzo</term>
    <term name="month-04">aprile</term>
    <term name="month-05">maggio</term>
    <term name="month-06">giugno</term>
    <term name="month-07">luglio</term>
    <term name="month-08">agosto</term>
    <term name="month-09">settembre</term>
    <term name="month-10">ottobre</term>
    <term name="month-11">novembre</term>
    <term name="month-12">dicembre</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">gen.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mag.</term>
    <term name="month-06" form="short">giu.</term>
    <term name="month-07" form="short">lug.</term>
    <term name="month-08" form="short">ago.</term>
    <term name="month-09" form="short">set.</term>
    <term name="month-10" form="short">ott.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dic.</term>

    <!-- SEASONS -->
    <term name="season-01">primavera</term>
    <term name="season-02">estate</term>
    <term name="season-03">autunno</term>
    <term name="season-04">inverno</term>
  </terms>
</locale>
`,"ja-JP":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="ja-JP">
  <info>
    <translator>
      <name>Shoji Takahashi</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="year" suffix="\u5E74"/>
    <date-part name="month" form="numeric" suffix="\u6708"/>
    <date-part name="day" suffix="\u65E5"/>
  </date>
  <date form="numeric">
    <date-part name="year" suffix="\u5E74"/>
    <date-part name="month" form="numeric" suffix="\u6708"/>
    <date-part name="day" suffix="\u65E5"/>
  </date>
  <terms>
    <term name="accessed">\u53C2\u7167</term>
    <term name="and">\u3068</term>
    <term name="and others">and others</term>
    <term name="anonymous">anonymous</term>
    <term name="anonymous" form="short">anon</term>
    <term name="at">at</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>\u7248</single>
      <multiple>\u7248</multiple>
    </term>
    <term name="edition" form="short">\u7248</term>
    <term name="et-al">\u307B\u304B</term>
    <term name="forthcoming">\u8FD1\u520A</term>
    <term name="from">\u304B\u3089</term>
    <term name="ibid">\u524D\u63B2</term>
    <term name="in"></term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">\u65E5\u4ED8\u306A\u3057</term>
    <term name="online">online</term>
    <term name="presented at">presented at the</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">\u8AAD\u307F\u8FBC\u307F</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u300C</term>
    <term name="close-quote">\u300D</term>
    <term name="open-inner-quote">\u300E</term>
    <term name="close-inner-quote">\u300F</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">first</term>
    <term name="long-ordinal-02">second</term>
    <term name="long-ordinal-03">third</term>
    <term name="long-ordinal-04">fourth</term>
    <term name="long-ordinal-05">fifth</term>
    <term name="long-ordinal-06">sixth</term>
    <term name="long-ordinal-07">seventh</term>
    <term name="long-ordinal-08">eighth</term>
    <term name="long-ordinal-09">ninth</term>
    <term name="long-ordinal-10">tenth</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>book</single>
      <multiple>books</multiple>
    </term>
    <term name="chapter">
      <single>chapter</single>
      <multiple>chapters</multiple>
    </term>
    <term name="column">
      <single>column</single>
      <multiple>columns</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>number</single>
      <multiple>numbers</multiple>
    </term>
    <term name="line">
      <single>\u884C</single>
      <multiple>\u884C</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>\u30DA\u30FC\u30B8</single>
      <multiple>\u30DA\u30FC\u30B8</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u30DA\u30FC\u30B8</single>
      <multiple>\u30DA\u30FC\u30B8</multiple>
    </term>
    <term name="paragraph">
      <single>\u6BB5\u843D</single>
      <multiple>\u6BB5\u843D</multiple>
    </term>
    <term name="part">
      <single>part</single>
      <multiple>parts</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk.</term>
    <term name="chapter" form="short">chap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">no.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">para.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>\u7DE8</single>
      <multiple>\u7DE8</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>\u7FFB\u8A33\u8005</single>
      <multiple>\u7FFB\u8A33\u8005</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\u7DE8</single>
      <multiple>\u7DE8</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\u7FFB\u8A33\u8005</single>
      <multiple>\u7FFB\u8A33\u8005</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">\u7DE8\u96C6\u8005\uFF1A</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">\u7FFB\u8A33\u8005\uFF1A</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">\u7DE8\u96C6\u8005\uFF1A</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">\u7FFB\u8A33\u8005\uFF1A</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">1\u6708</term>
    <term name="month-02">2\u6708</term>
    <term name="month-03">3\u6708</term>
    <term name="month-04">4\u6708</term>
    <term name="month-05">5\u6708</term>
    <term name="month-06">6\u6708</term>
    <term name="month-07">7\u6708</term>
    <term name="month-08">8\u6708</term>
    <term name="month-09">9\u6708</term>
    <term name="month-10">10\u6708</term>
    <term name="month-11">11\u6708</term>
    <term name="month-12">12\u6708</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">1\u6708</term>
    <term name="month-02" form="short">2\u6708</term>
    <term name="month-03" form="short">3\u6708</term>
    <term name="month-04" form="short">4\u6708</term>
    <term name="month-05" form="short">5\u6708</term>
    <term name="month-06" form="short">6\u6708</term>
    <term name="month-07" form="short">7\u6708</term>
    <term name="month-08" form="short">8\u6708</term>
    <term name="month-09" form="short">9\u6708</term>
    <term name="month-10" form="short">10\u6708</term>
    <term name="month-11" form="short">11\u6708</term>
    <term name="month-12" form="short">12\u6708</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"km-KH":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="km-KH">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric" suffix="\u200B"/>
    <date-part name="month" suffix="\u200B"/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">accessed</term>
    <term name="and">and</term>
    <term name="and others">and others</term>
    <term name="anonymous">anonymous</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">at</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>edition</single>
      <multiple>editions</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">forthcoming</term>
    <term name="from">from</term>
    <term name="ibid">ibid</term>
    <term name="in">in</term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">n.d.</term>
    <term name="online">online</term>
    <term name="presented at">presented at the</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">retrieved</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u1791\u17B8\u1798\u17BD\u1799</term>
    <term name="long-ordinal-02">\u1791\u17B8\u1796\u17B8\u179A</term>
    <term name="long-ordinal-03">\u1791\u17B8\u1794\u17B8</term>
    <term name="long-ordinal-04">\u1791\u17B8\u1794\u17BD\u1793</term>
    <term name="long-ordinal-05">\u1791\u17B8\u1794\u17D2\u179A\u17B6\u17C6</term>
    <term name="long-ordinal-06">\u1791\u17B8\u1794\u17D2\u179A\u17B6\u17C6\u1798\u17BD\u1799</term>
    <term name="long-ordinal-07">\u1791\u17B8\u1794\u17D2\u179A\u17B6\u17C6\u1796\u17B8\u179A</term>
    <term name="long-ordinal-08">\u1791\u17B8\u1794\u17D2\u179A\u17B6\u17C6\u1794\u17B8</term>
    <term name="long-ordinal-09">\u1791\u17B8\u1794\u17D2\u179A\u17B6\u17C6\u1794\u17BD\u1793</term>
    <term name="long-ordinal-10">\u1791\u17B8\u178A\u1794\u17CB\u1798\u17BD\u1799</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u179F\u17C0\u179C\u1797\u17C5</single>
      <multiple>\u179F\u17C0\u179C\u1797\u17C5</multiple>
    </term>
    <term name="chapter">
      <single>\u1787\u17C6\u1796\u17BC\u1780</single>
      <multiple>\u1787\u17C6\u1796\u17BC\u1780</multiple>
    </term>
    <term name="column">
      <single>\u1780\u17B6\u17A1\u17C4\u1793</single>
      <multiple>\u1780\u17B6\u17A1\u17C4\u1793</multiple>
    </term>
    <term name="figure">
      <single>\u178F\u17BD\u179B\u17C1\u1781</single>
      <multiple>\u178F\u17BD\u179B\u17C1\u1781</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>\u1785\u17C6\u1793\u17BD\u1793</single>
      <multiple>\u1785\u17C6\u1793\u17BD\u1793</multiple>
    </term>
    <term name="line">
      <single>\u1794\u1793\u17D2\u1791\u17B6\u178F\u17CB</single>
      <multiple>\u1794\u1793\u17D2\u1791\u17B6\u178F\u17CB</multiple>
    </term>
    <term name="note">
      <single>\u1780\u17C6\u178E\u178F\u17CB\u1785\u17C6\u178E\u17B6\u17C6</single>
      <multiple>\u1780\u17C6\u178E\u178F\u17CB\u1785\u17C6\u178E\u17B6\u17C6</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>\u1791\u17C6\u1796\u17D0\u179A</single>
      <multiple>\u1791\u17C6\u1796\u17D0\u179A</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u1791\u17C6\u1796\u17D0\u179A</single>
      <multiple>\u1791\u17C6\u1796\u17D0\u179A</multiple>
    </term>
    <term name="paragraph">
      <single>\u1780\u1790\u17B6\u1781\u178E\u17D2\u178C</single>
      <multiple>\u1780\u1790\u17B6\u1781\u178E\u17D2\u178C</multiple>
    </term>
    <term name="part">
      <single>\u1787\u17C6\u1796\u17BC\u1780</single>
      <multiple>\u1787\u17C6\u1796\u17BC\u1780</multiple>
    </term>
    <term name="section">
      <single>\u1795\u17D2\u1793\u17C2\u1780</single>
      <multiple>\u1795\u17D2\u1793\u17C2\u1780</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>\u179C\u17C9\u17BB\u179B</single>
      <multiple>\u179C\u17C9\u17BB\u179B</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk.</term>
    <term name="chapter" form="short">chap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">no.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">para.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="editorial-director">
      <single></single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>translator</single>
      <multiple>translator</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>tran.</single>
      <multiple>trans.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">edited by</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">translated by</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">trans.</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u1798\u1780\u179A\u17B6</term>
    <term name="month-02">\u1780\u17BB\u1798\u17D2\u1797\u17C8</term>
    <term name="month-03">\u1798\u17B8\u1793\u17B6</term>
    <term name="month-04">\u1798\u17C1\u179F\u17B6</term>
    <term name="month-05">\u17A7\u179F\u1797\u17B6</term>
    <term name="month-06">\u1798\u17B7\u1790\u17BB\u1793\u17B6</term>
    <term name="month-07">\u1780\u1780\u17D2\u1780\u178A\u17B6</term>
    <term name="month-08">\u179F\u17B8\u17A0\u17B6</term>
    <term name="month-09">\u1780\u1789\u17D2\u1789\u17B6</term>
    <term name="month-10">\u178F\u17BB\u179B\u17B6</term>
    <term name="month-11">\u179C\u17B7\u1785\u17D2\u1786\u17B7\u1780\u17B6</term>
    <term name="month-12">\u1792\u17D2\u1793\u17BC</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan.</term>
    <term name="month-02" form="short">Feb.</term>
    <term name="month-03" form="short">Mar.</term>
    <term name="month-04" form="short">Apr.</term>
    <term name="month-05" form="short">May</term>
    <term name="month-06" form="short">Jun.</term>
    <term name="month-07" form="short">Jul.</term>
    <term name="month-08" form="short">Aug.</term>
    <term name="month-09" form="short">Sep.</term>
    <term name="month-10" form="short">Oct.</term>
    <term name="month-11" form="short">Nov.</term>
    <term name="month-12" form="short">Dec.</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"ko-KR":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="ko-KR">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="year" suffix="\uB144"/>
    <date-part name="month" form="numeric" prefix=" " suffix="\uC6D4"/>
    <date-part name="day" prefix=" " suffix="\uC77C"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="/"/>
  </date>
  <terms>
    <term name="accessed">\uC811\uADFC\uB41C</term>
    <term name="and">\uC640/\uACFC</term>
    <term name="and others">and others</term>
    <term name="anonymous">anonymous</term>
    <term name="anonymous" form="short">anon</term>
    <term name="at">at</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>edition</single>
      <multiple>editions</multiple>
    </term>
    <term name="edition" form="short">ed</term>
    <term name="et-al">\uAE30\uD0C0</term>
    <term name="forthcoming">\uADFC\uAC04</term>
    <term name="from">(\uC73C)\uB85C\uBD80\uD130</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">\uC77C\uC790 \uC5C6\uC74C</term>
    <term name="online">online</term>
    <term name="presented at">presented at the</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">retrieved</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">first</term>
    <term name="long-ordinal-02">second</term>
    <term name="long-ordinal-03">third</term>
    <term name="long-ordinal-04">fourth</term>
    <term name="long-ordinal-05">fifth</term>
    <term name="long-ordinal-06">sixth</term>
    <term name="long-ordinal-07">seventh</term>
    <term name="long-ordinal-08">eighth</term>
    <term name="long-ordinal-09">ninth</term>
    <term name="long-ordinal-10">tenth</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>book</single>
      <multiple>books</multiple>
    </term>
    <term name="chapter">
      <single>chapter</single>
      <multiple>chapters</multiple>
    </term>
    <term name="column">
      <single>column</single>
      <multiple>columns</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>number</single>
      <multiple>numbers</multiple>
    </term>
    <term name="line">
      <single>\uD589</single>
      <multiple>\uD589</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>\uD398\uC774\uC9C0</single>
      <multiple>\uD398\uC774\uC9C0</multiple>
    </term>
    <term name="number-of-pages">
      <single>\uD398\uC774\uC9C0</single>
      <multiple>\uD398\uC774\uC9C0</multiple>
    </term>
    <term name="paragraph">
      <single>\uB2E8\uB77D</single>
      <multiple>\uB2E8\uB77D</multiple>
    </term>
    <term name="part">
      <single>part</single>
      <multiple>parts</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk</term>
    <term name="chapter" form="short">chap</term>
    <term name="column" form="short">col</term>
    <term name="figure" form="short">fig</term>
    <term name="folio" form="short">f</term>
    <term name="issue" form="short">\uD638</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op</term>
    <term name="page" form="short">
      <single>p</single>
      <multiple>pp</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p</single>
      <multiple>pp</multiple>
    </term>
    <term name="paragraph" form="short">para</term>
    <term name="part" form="short">pt</term>
    <term name="section" form="short">sec</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v</single>
      <multiple>vv</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol</single>
      <multiple>vols</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>\uD3B8\uC9D1\uC790</single>
      <multiple>\uD3B8\uC9D1\uC790</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>\uBC88\uC5ED\uC790</single>
      <multiple>\uBC88\uC5ED\uC790</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\uD3B8\uC9D1\uC790</single>
      <multiple>\uD3B8\uC9D1\uC790</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\uBC88\uC5ED\uC790</single>
      <multiple>\uBC88\uC5ED\uC790</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">\uD3B8\uC9D1\uC790\uFF1A</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">\uBC88\uC5ED\uC790\uFF1A</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">trans</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">1\uC6D4</term>
    <term name="month-02">2\uC6D4</term>
    <term name="month-03">3\uC6D4</term>
    <term name="month-04">4\uC6D4</term>
    <term name="month-05">5\uC6D4</term>
    <term name="month-06">6\uC6D4</term>
    <term name="month-07">7\uC6D4</term>
    <term name="month-08">8\uC6D4</term>
    <term name="month-09">9\uC6D4</term>
    <term name="month-10">10\uC6D4</term>
    <term name="month-11">11\uC6D4</term>
    <term name="month-12">12\uC6D4</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">1</term>
    <term name="month-02" form="short">2</term>
    <term name="month-03" form="short">3</term>
    <term name="month-04" form="short">4</term>
    <term name="month-05" form="short">5</term>
    <term name="month-06" form="short">6</term>
    <term name="month-07" form="short">7</term>
    <term name="month-08" form="short">8</term>
    <term name="month-09" form="short">9</term>
    <term name="month-10" form="short">10</term>
    <term name="month-11" form="short">11</term>
    <term name="month-12" form="short">12</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,la:`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="la">
  <info>
    <translator>
      <name>Andrew Dunning</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2019-01-21T13:33:33+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">consultatus</term>
    <term name="and">et</term>
    <term name="and others">et alii</term>
    <term name="anonymous">anonymus</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">ad</term>
    <term name="available at">praestatus ad</term>
    <term name="by">a</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citatus</term>
    <term name="edition">
      <single>editio</single>
      <multiple>editiones</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">futurus</term>
    <term name="from">ab</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">impressorio</term>
    <term name="internet">interrete</term>
    <term name="interview">congressus</term>
    <term name="letter">epistula</term>
    <term name="no date">sine die</term>
    <term name="no date" form="short">s.d.</term>
    <term name="online">in linea</term>
    <term name="presented at">praebitus ad</term>
    <term name="reference">
      <single>relatio</single>
      <multiple>relationes</multiple>
    </term>
    <term name="reference" form="short">
      <single>rel.</single>
      <multiple>rell.</multiple>
    </term>
    <term name="retrieved">recuperatus</term>
    <term name="scale">scala</term>
    <term name="version">uersio</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">A.D.</term>
    <term name="bc">A.C.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u2018</term>
    <term name="close-quote">\u2019</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">\xBA</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">primus</term>
    <term name="long-ordinal-02">secundus</term>
    <term name="long-ordinal-03">tertius</term>
    <term name="long-ordinal-04">quartus</term>
    <term name="long-ordinal-05">quintus</term>
    <term name="long-ordinal-06">sextus</term>
    <term name="long-ordinal-07">septimus</term>
    <term name="long-ordinal-08">octauus</term>
    <term name="long-ordinal-09">nonus</term>
    <term name="long-ordinal-10">decimus</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>liber</single>
      <multiple>libri</multiple>
    </term>
    <term name="chapter">
      <single>capitulum</single>
      <multiple>capitula</multiple>
    </term>
    <term name="column">
      <single>columna</single>
      <multiple>columnae</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figurae</multiple>
    </term>
    <term name="folio">
      <single>folium</single>
      <multiple>folii</multiple>
    </term>
    <term name="issue">
      <single>numerus</single>
      <multiple>numeri</multiple>
    </term>
    <term name="line">
      <single>linea</single>
      <multiple>lineae</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notae</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>pagina</single>
      <multiple>paginae</multiple>
    </term>
    <term name="number-of-pages">
      <single>pagina</single>
      <multiple>paginae</multiple>
    </term>
    <term name="paragraph">
      <single>paragraphus</single>
      <multiple>paragraphi</multiple>
    </term>
    <term name="part">
      <single>pars</single>
      <multiple>partes</multiple>
    </term>
    <term name="section">
      <single>paragraphus</single>
      <multiple>paragraphi</multiple>
    </term>
    <term name="sub verbo">
      <single>sub uerbo</single>
      <multiple>sub uerbis</multiple>
    </term>
    <term name="verse">
      <single>versus</single>
      <multiple>versus</multiple>
    </term>
    <term name="volume">
      <single>tomus</single>
      <multiple>tomi</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">lib.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">n.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">pr.</term>
    <term name="section" form="short">par.</term>
    <term name="sub verbo" form="short">
      <single>s.u.</single>
      <multiple>s.uu.</multiple>
    </term>
    <term name="verse" form="short">
      <single>u.</single>
      <multiple>uu.</multiple>
    </term>
    <term name="volume" form="short">
      <single>t.</single>
      <multiple>tt.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directores</multiple>
    </term>
    <term name="editor">
      <single>curator</single>
      <multiple>curatores</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustratores</multiple>
    </term>
    <term name="translator">
      <single>interpres</single>
      <multiple>interpretes</multiple>
    </term>
    <term name="editortranslator">
      <single>curator et interpres</single>
      <multiple>curatores et interpretes</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>cur.</single>
      <multiple>curs.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>interp.</single>
      <multiple>interps.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>cur. et interp.</single>
      <multiple>curs. et interps.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">a</term>
    <term name="director" form="verb">a directione</term>
    <term name="editor" form="verb">a cura</term>
    <term name="editorial-director" form="verb">ab editione</term>
    <term name="illustrator" form="verb">ab illustratione</term>
    <term name="interviewer" form="verb">a congressione</term>
    <term name="recipient" form="verb">a</term>
    <term name="reviewed-author" form="verb">a</term>
    <term name="translator" form="verb">a interpretatione</term>
    <term name="editortranslator" form="verb">a cura et interpretatione</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">cur.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">interp.</term>
    <term name="editortranslator" form="verb-short">a cur. et interp.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">ianuarius</term>
    <term name="month-02">februarius</term>
    <term name="month-03">martius</term>
    <term name="month-04">aprilis</term>
    <term name="month-05">maius</term>
    <term name="month-06">iunius</term>
    <term name="month-07">iulius</term>
    <term name="month-08">augustus</term>
    <term name="month-09">september</term>
    <term name="month-10">october</term>
    <term name="month-11">nouember</term>
    <term name="month-12">december</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">ian.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mai.</term>
    <term name="month-06" form="short">iun.</term>
    <term name="month-07" form="short">iul.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nou.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">uer</term>
    <term name="season-02">aestas</term>
    <term name="season-03">autumnus</term>
    <term name="season-04">hiems</term>
  </terms>
</locale>
`,"lt-LT":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="lt-LT">
  <info>
    <translator>
      <name>Valdemaras Klumbys</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2017-01-18T10:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text" delimiter=" ">
    <!-- "2011 m. lapkri\u010Dio 1 d." -->
    <date-part name="year" suffix=" m."/>
    <date-part name="month"/>
    <date-part name="day" form="numeric" suffix=" d."/>
  </date>
  <date form="numeric" delimiter="-">
    <!-- "2011-11-01" -->
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros"/>
    <date-part name="day" form="numeric-leading-zeros"/>
  </date>
  <terms>
    <term name="accessed">\u017Ei\u016Br\u0117ta</term>
    <term name="and">ir</term>
    <term name="and others">ir kt.</term>
    <term name="anonymous">anonimas</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at"></term>
    <term name="available at">adresas</term>
    <term name="by"></term>
    <term name="circa">apie</term>
    <term name="circa" form="short">apie</term>
    <term name="cited">\u017Ei\u016Br\u0117ta</term>
    <term name="edition" gender="masculine">
      <single>leidimas</single>
      <multiple>leidimai</multiple>
    </term>
    <term name="edition" form="short">leid.</term>
    <term name="et-al">ir kt.</term>
    <term name="forthcoming">ruo\u0161iamas</term>
    <term name="from"></term>
    <term name="ibid">ten pat</term>
    <term name="in"></term>
    <term name="in press">priimta spaudai</term>
    <term name="internet">prieiga per internet\u0105</term>
    <term name="interview">interviu</term>
    <term name="letter">lai\u0161kas</term>
    <term name="no date">sine anno</term>
    <term name="no date" form="short">s.a.</term>
    <term name="online">interaktyvus</term>
    <term name="presented at">pristatytas</term>
    <term name="reference">
      <single>nuoroda</single>
      <multiple>nuorodos</multiple>
    </term>
    <term name="reference" form="short">
      <single>nuor.</single>
      <multiple>nuor.</multiple>
    </term>
    <term name="retrieved">gauta</term>
    <term name="scale">mastelis</term>
    <term name="version">versija</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">po Kr.</term>
    <term name="bc">pr. Kr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">,</term>
    <term name="close-inner-quote">\u2018</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">-asis</term>
    <term name="ordinal" gender-form="masculine">-asis</term>
    <term name="ordinal" gender-form="feminine">-oji</term>
    <term name="ordinal-03" gender-form="masculine">-iasis</term>
    <term name="ordinal-13" gender-form="masculine">-asis</term>
    <term name="ordinal-03" gender-form="feminine">-ioji</term>
    <term name="ordinal-13" gender-form="feminine">-oji</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">pirmasis</term>
    <term name="long-ordinal-02">antrasis</term>
    <term name="long-ordinal-03">tre\u010Diasis</term>
    <term name="long-ordinal-04">ketvirtasis</term>
    <term name="long-ordinal-05">penktasis</term>
    <term name="long-ordinal-06">\u0161e\u0161tasis</term>
    <term name="long-ordinal-07">septintasis</term>
    <term name="long-ordinal-08">a\u0161tuntasis</term>
    <term name="long-ordinal-09">devintasis</term>
    <term name="long-ordinal-10">de\u0161imtasis</term>

    <term name="long-ordinal-01" gender-form="feminine">pirmoji</term>
    <term name="long-ordinal-02" gender-form="feminine">antroji</term>
    <term name="long-ordinal-03" gender-form="feminine">tre\u010Dioji</term>
    <term name="long-ordinal-04" gender-form="feminine">ketvirtoji</term>
    <term name="long-ordinal-05" gender-form="feminine">penktoji</term>
    <term name="long-ordinal-06" gender-form="feminine">\u0161e\u0161toji</term>
    <term name="long-ordinal-07" gender-form="feminine">septintoji</term>
    <term name="long-ordinal-08" gender-form="feminine">a\u0161tuntoji</term>
    <term name="long-ordinal-09" gender-form="feminine">devintoji</term>
    <term name="long-ordinal-10" gender-form="feminine">de\u0161imtoji</term>
    
    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>knyga</single>
      <multiple>knygos</multiple>
    </term>
    <term name="chapter">
      <single>skyrius</single>
      <multiple>skyriai</multiple>
    </term>
    <term name="column">
      <single>skiltis</single>
      <multiple>skiltys</multiple>
    </term>
    <term name="figure">
      <single>iliustracija</single>
      <multiple>iliustracijos</multiple>
    </term>
    <term name="folio">
      <single>lapas</single>
      <multiple>lapai</multiple>
    </term>
    <term name="issue" gender="masculine">
      <single>numeris</single>
      <multiple>numeriai</multiple>
    </term>
    <term name="line">
      <single>eilut\u0117</single>
      <multiple>eilut\u0117s</multiple>
    </term>
    <term name="note">
      <single>pastaba</single>
      <multiple>pastabos</multiple>
    </term>
    <term name="opus">
      <single>k\u016Brinys</single>
      <multiple>k\u016Briniai</multiple>
    </term>
    <term name="page">
      <single>puslapis</single>
      <multiple>puslapiai</multiple>
    </term>
    <term name="number-of-pages" gender="masculine">
      <single>puslapis</single>
      <multiple>puslapiai</multiple>
    </term>
    <term name="paragraph">
      <single>pastraipa</single>
      <multiple>pastraipos</multiple>
    </term>
    <term name="part">
      <single>dalis</single>
      <multiple>dalys</multiple>
    </term>
    <term name="section">
      <single>poskyris</single>
      <multiple>poskyriai</multiple>
    </term>
    <term name="sub verbo">
      <single>\u017Ei\u016Br\u0117k</single>
      <multiple>\u017Ei\u016Br\u0117k</multiple>
    </term>
    <term name="verse">
      <single>eil\u0117ra\u0161tis</single>
      <multiple>eil\u0117ra\u0161\u010Diai</multiple>
    </term>
    <term name="volume" gender="masculine">
      <single>tomas</single>
      <multiple>tomai</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">kn.</term>
    <term name="chapter" form="short">sk.</term>
    <term name="column" form="short">skilt.</term>
    <term name="figure" form="short">il.</term>
    <term name="folio" form="short">l.</term>
    <term name="issue" form="short">nr.</term>
    <term name="line" form="short">eil.</term>
    <term name="note" form="short">pstb.</term>
    <term name="opus" form="short">k\u016Br.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="paragraph" form="short">pastr.</term>
    <term name="part" form="short">d.</term>
    <term name="section" form="short">posk.</term>
    <term name="sub verbo" form="short">
      <single>\u017Er.</single>
      <multiple>\u017Er.</multiple>
    </term>
    <term name="verse" form="short">
      <single>eil\u0117r.</single>
      <multiple>eil\u0117r.</multiple>
    </term>
    <term name="volume" form="short">
      <single>t.</single>
      <multiple>t.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>vadovas</single>
      <multiple>vadovai</multiple>
    </term>
    <term name="editor">
      <single>sudarytojas</single>
      <multiple>sudarytojai</multiple>
    </term>
    <term name="editorial-director">
      <single>atsakingasis redaktorius</single>
      <multiple>atsakingieji redaktoriai</multiple>
    </term>
    <term name="illustrator">
      <single>iliustratorius</single>
      <multiple>iliustratoriai</multiple>
    </term>
    <term name="translator">
      <single>vert\u0117jas</single>
      <multiple>vert\u0117jai</multiple>
    </term>
    <term name="editortranslator">
      <single>sudarytojas ir vert\u0117jas</single>
      <multiple>sudarytojai ir vert\u0117jai</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>vad.</single>
      <multiple>vad.</multiple>
    </term>
    <term name="editor" form="short">
      <single>sud.</single>
      <multiple>sud.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ats. red.</single>
      <multiple>ats. red.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>iliustr.</single>
      <multiple>iliustr.</multiple>
    </term>
    <term name="translator" form="short">
      <single>vert.</single>
      <multiple>vert.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>sud. ir vert.</single>
      <multiple>sud. ir vert.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb"></term>
    <term name="director" form="verb">vadovavo</term>
    <term name="editor" form="verb">sudar\u0117</term>
    <term name="editorial-director" form="verb">pareng\u0117</term>
    <term name="illustrator" form="verb">iliustravo</term>
    <term name="interviewer" form="verb">interviu \u0117m\u0117</term>
    <term name="recipient" form="verb">gavo</term>
    <term name="reviewed-author" form="verb">recenzavo</term>
    <term name="translator" form="verb">vert\u0117</term>
    <term name="editortranslator" form="verb">sudar\u0117 ir vert\u0117</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">vad.</term>
    <term name="editor" form="verb-short">sud.</term>
    <term name="editorial-director" form="verb-short">pareng.</term>
    <term name="illustrator" form="verb-short">iliustr.</term>
    <term name="translator" form="verb-short">vert.</term>
    <term name="editortranslator" form="verb-short">sud. ir vert.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">sausio</term>
    <term name="month-02">vasario</term>
    <term name="month-03">kovo</term>
    <term name="month-04">baland\u017Eio</term>
    <term name="month-05">gegu\u017E\u0117s</term>
    <term name="month-06">bir\u017Eelio</term>
    <term name="month-07">liepos</term>
    <term name="month-08">rugpj\u016B\u010Dio</term>
    <term name="month-09">rugs\u0117jo</term>
    <term name="month-10">spalio</term>
    <term name="month-11">lapkri\u010Dio</term>
    <term name="month-12">gruod\u017Eio</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">saus.</term>
    <term name="month-02" form="short">vas.</term>
    <term name="month-03" form="short">kovo</term>
    <term name="month-04" form="short">bal.</term>
    <term name="month-05" form="short">geg.</term>
    <term name="month-06" form="short">bir\u017E.</term>
    <term name="month-07" form="short">liep.</term>
    <term name="month-08" form="short">rugpj.</term>
    <term name="month-09" form="short">rugs.</term>
    <term name="month-10" form="short">spal.</term>
    <term name="month-11" form="short">lapkr.</term>
    <term name="month-12" form="short">gruod\u017E.</term>

    <!-- SEASONS -->
    <term name="season-01">pavasaris</term>
    <term name="season-02">vasara</term>
    <term name="season-03">ruduo</term>
    <term name="season-04">\u017Eiema</term>
  </terms>
</locale>
`,"lv-LV":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="lv-LV">
  <info>
    <translator>
      <name>Andris Lupgins</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-12-27T11:40:58+02:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text" delimiter=" ">
    <!-- "2012. gada 28. mart\u0101" -->
    <date-part name="year" suffix=". gada"/>
    <date-part name="day" form="numeric" suffix="."/>
    <date-part name="month"/>
  </date>
  <date form="numeric" delimiter=".">
    <!-- "28.03.2012." -->
    <date-part name="day" form="numeric"/>
    <date-part name="month" form="numeric"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">skat\u012Bts</term>
    <term name="ad">m.\u0113.</term>
    <term name="and">un</term>
    <term name="and others">un citi</term>
    <term name="anonymous">anon\u012Bms</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at"></term>
    <term name="available at">pieejams</term>
    <term name="bc">p.m.\u0113.</term>
    <term name="by"></term>
    <term name="circa">apm\u0113ram</term>
    <term name="circa" form="short">apm.</term>
    <term name="cited">cit\u0113ts</term>
    <term name="edition" gender="feminine">
      <single>redakcija</single>
      <multiple>redakcijas</multiple>
    </term>
    <term name="edition" form="short">red.</term>
    <term name="et-al">u.c.</term>
    <term name="forthcoming">gaid\u0101ms</term>
    <term name="from">no</term>
    <term name="ibid">turpat</term>
    <term name="in">no</term>
    <term name="in press">pres\u0113</term>
    <term name="internet">internets</term>
    <term name="interview">intervija</term>
    <term name="letter">v\u0113stule</term>
    <term name="no date">bez datuma</term>
    <term name="no date" form="short">b.g.</term>
    <term name="online">tie\u0161saiste</term>
    <term name="presented at">iesniegts</term>
    <term name="reference">
      <single>atsauce</single>
      <multiple>atsauces</multiple>
    </term>
    <term name="reference" form="short">
      <single>ats.</single>
      <multiple>ats.</multiple>
    </term>
    <term name="retrieved">ieg\u016Bts</term>
    <term name="scale">m\u0113rogs</term>
    <term name="version">versija</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">"</term>
    <term name="close-quote">"</term>
    <term name="open-inner-quote">"</term>
    <term name="close-inner-quote">"</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">-ais</term>
    <term name="ordinal" gender-form="feminine">-\u0101</term>
    
    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">pirmais</term>
    <term name="long-ordinal-02">otrais</term>
    <term name="long-ordinal-03">tre\u0161ais</term>
    <term name="long-ordinal-04">ceturtais</term>
    <term name="long-ordinal-05">piektais</term>
    <term name="long-ordinal-06">sestais</term>
    <term name="long-ordinal-07">sept\u012Btais</term>
    <term name="long-ordinal-08">astotais</term>
    <term name="long-ordinal-09">dev\u012Btais</term>
    <term name="long-ordinal-10">desmitais</term>

    <term name="long-ordinal-01" gender-form="feminine">pirm\u0101</term>
    <term name="long-ordinal-02" gender-form="feminine">otr\u0101</term>
    <term name="long-ordinal-03" gender-form="feminine">tre\u0161\u0101</term>
    <term name="long-ordinal-04" gender-form="feminine">ceturt\u0101</term>
    <term name="long-ordinal-05" gender-form="feminine">piekt\u0101</term>
    <term name="long-ordinal-06" gender-form="feminine">sest\u0101</term>
    <term name="long-ordinal-07" gender-form="feminine">sept\u012Bt\u0101</term>
    <term name="long-ordinal-08" gender-form="feminine">astot\u0101</term>
    <term name="long-ordinal-09" gender-form="feminine">dev\u012Bt\u0101</term>
    <term name="long-ordinal-10" gender-form="feminine">desmit\u0101</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>gr\u0101mata</single>
      <multiple>gr\u0101matas</multiple>
    </term>
    <term name="chapter">
      <single>noda\u013Ca</single>
      <multiple>noda\u013Cas</multiple>
    </term>
    <term name="column">
      <single>sleja</single>
      <multiple>slejas</multiple>
    </term>
    <term name="figure">
      <single>ilustr\u0101cija</single>
      <multiple>ilustr\u0101cijas</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folio</multiple>
    </term>
    <term name="issue">
      <single>numurs</single>
      <multiple>numuri</multiple>
    </term>
    <term name="line">
      <single>rinda</single>
      <multiple>rindas</multiple>
    </term>
    <term name="note">
      <single>piez\u012Bme</single>
      <multiple>piez\u012Bmes</multiple>
    </term>
    <term name="opus">
      <single>opuss</single>
      <multiple>opusi</multiple>
    </term>
    <term name="page">
      <single>lappuse</single>
      <multiple>lappuses</multiple>
    </term>
    <term name="number-of-pages">
      <single>lappuse</single>
      <multiple>lappuses</multiple>
    </term>
    <term name="paragraph">
      <single>rindkopa</single>
      <multiple>rindkopas</multiple>
    </term>
    <term name="part">
      <single>da\u013Ca</single>
      <multiple>da\u013Cas</multiple>
    </term>
    <term name="section">
      <single>apak\u0161noda\u013Ca</single>
      <multiple>apak\u0161noda\u013Cas</multiple>
    </term>
    <term name="sub verbo">
      <single>skat\u012Bt</single>
      <multiple>skat\u012Bt</multiple>
    </term>
    <term name="verse">
      <single>pants</single>
      <multiple>panti</multiple>
    </term>
    <term name="volume">
      <single>s\u0113jums</single>
      <multiple>s\u0113jumi</multiple>
    </term>
    
    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">gr\u0101m.</term>
    <term name="chapter" form="short">nod.</term>
    <term name="column" form="short">sl.</term>
    <term name="figure" form="short">il.</term>
    <term name="folio" form="short">fo.</term>
    <term name="issue" form="short">nr.</term>
    <term name="line" form="short">r.</term>
    <term name="note" form="short">piez.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>lpp.</single>
      <multiple>lpp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>lpp.</single>
      <multiple>lpp.</multiple>
    </term>
    <term name="paragraph" form="short">rindk.</term>
    <term name="part" form="short">d.</term>
    <term name="section" form="short">apak\u0161nod.</term>
    <term name="sub verbo" form="short">
      <single>sk.</single>
      <multiple>sk.</multiple>
    </term>
    <term name="verse" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="volume" form="short">
      <single>s\u0113j.</single>
      <multiple>s\u0113j.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="collection-editor">
      <single>kr\u0101juma redaktors</single>
      <multiple>kr\u0101juma redaktori</multiple>
    </term>
    <term name="composer">
      <single>sast\u0101d\u012Bt\u0101js</single>
      <multiple>sast\u0101d\u012Bt\u0101ji</multiple>
    </term>
    <term name="container-author">
      <single>pamatmateri\u0101la autors</single>
      <multiple>pamatmateri\u0101la autori</multiple>
    </term>
    <term name="director">
      <single>vad\u012Bt\u0101js</single>
      <multiple>vad\u012Bt\u0101ji</multiple>
    </term>
    <term name="editor">
      <single>redaktors</single>
      <multiple>redaktors</multiple>
    </term>
    <term name="editorial-director">
      <single>galvenais redaktors</single>
      <multiple>galvenie redaktori</multiple>
    </term>
    <term name="editortranslator">
      <single>redaktors un tulkot\u0101js</single>
      <multiple>redaktors un tulkot\u0101js</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrators</single>
      <multiple>ilustratori</multiple>
    </term>
    <term name="interviewer">
      <single>interv\u0113t\u0101js</single>
      <multiple>interv\u0113t\u0101ji</multiple>
    </term>
    <term name="recipient">
      <single>sa\u0146\u0113m\u0113js</single>
      <multiple>sa\u0146\u0113m\u0113ji</multiple>
    </term>
    <term name="translator">
      <single>tulkot\u0101js</single>
      <multiple>tulkot\u0101ji</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="collection-editor" form="short">
      <single>kr. red.</single>
      <multiple>kr. red.</multiple>
    </term>
    <term name="composer" form="short">
      <single>sast.</single>
      <multiple>sast.</multiple>
    </term>
    <term name="container-author" form="short">
      <single>pamatmat. aut.</single>
      <multiple>pamatmat. aut.</multiple>
    </term>
    <term name="director" form="short">
      <single>vad.</single>
      <multiple>vad.</multiple>
    </term>
    <term name="editor" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>galv. red.</single>
      <multiple>galv. red.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>red. un tulk.</single>
      <multiple>red. un tulk.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ilustr.</single>
      <multiple>ilustr.</multiple>
    </term>
    <term name="interviewer" form="short">
      <single>interv.</single>
      <multiple>interv.</multiple>
    </term>
    <term name="recipient" form="short">
      <single>sa\u0146.</single>
      <multiple>sa\u0146.</multiple>
    </term>
    <term name="translator" form="short">
      <single>tulk.</single>
      <multiple>tulk.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb"></term>
    <term name="composer" form="verb">sast\u0101d\u012Bja</term>
    <term name="director" form="verb">vad\u012Bja</term>
    <term name="editor" form="verb">sagatavoja</term>
    <term name="editorial-director" form="verb">sagatavoja</term>
    <term name="editortranslator" form="verb">sagatavoja un tulkoja</term>
    <term name="illustrator" form="verb">ilustr\u0113ja</term>
    <term name="interviewer" form="verb">interv\u0113ja</term>
    <term name="recipient" form="verb">sa\u0146\u0113ma</term>
    <term name="translator" form="verb">tulkoja</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">sast.</term>
    <term name="editor" form="verb-short">sag.</term>
    <term name="editorial-director" form="verb-short">sag.</term>
    <term name="illustrator" form="verb-short">ilustr.</term>
    <term name="translator" form="verb-short">tulk.</term>
    <term name="editortranslator" form="verb-short">sag. un tulk.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">janv\u0101r\u012B</term>
    <term name="month-02">febru\u0101r\u012B</term>
    <term name="month-03">mart\u0101</term>
    <term name="month-04">apr\u012Bl\u012B</term>
    <term name="month-05">maij\u0101</term>
    <term name="month-06">j\u016Bnij\u0101</term>
    <term name="month-07">j\u016Blij\u0101</term>
    <term name="month-08">august\u0101</term>
    <term name="month-09">septembr\u012B</term>
    <term name="month-10">oktobr\u012B</term>
    <term name="month-11">novembr\u012B</term>
    <term name="month-12">decembr\u012B</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">janv.</term>
    <term name="month-02" form="short">febr.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mai.</term>
    <term name="month-06" form="short">j\u016Bn.</term>
    <term name="month-07" form="short">j\u016Bl.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sept.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">pavasaris</term>
    <term name="season-02">vasara</term>
    <term name="season-03">rudens</term>
    <term name="season-04">ziema</term>
  </terms>
</locale>
`,"mn-MN":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="mn-MN">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="."/>
    <date-part name="day" form="numeric-leading-zeros" prefix="."/>
  </date>
  <terms>
    <term name="accessed">accessed</term>
    <term name="and">and</term>
    <term name="and others">and others</term>
    <term name="anonymous">anonymous</term>
    <term name="anonymous" form="short">anon</term>
    <term name="at">at</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>edition</single>
      <multiple>editions</multiple>
    </term>
    <term name="edition" form="short">ed</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">forthcoming</term>
    <term name="from">from</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">n.d.</term>
    <term name="online">online</term>
    <term name="presented at">presented at the</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">retrieved</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u201E</term>
    <term name="close-inner-quote">\u201C</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">-p</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u043D\u044D\u0433\u0434\u04AF\u0433\u044D\u044D\u0440</term>
    <term name="long-ordinal-02">\u0445\u043E\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440</term>
    <term name="long-ordinal-03">\u0433\u0443\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440</term>
    <term name="long-ordinal-04">\u0434\u04E9\u0440\u04E9\u0432\u0434\u04AF\u0433\u044D\u044D\u0440</term>
    <term name="long-ordinal-05">\u0442\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440</term>
    <term name="long-ordinal-06">\u0437\u0443\u0440\u0433\u0430\u0430\u0434\u0443\u0433\u0430\u0430\u0440</term>
    <term name="long-ordinal-07">\u0434\u043E\u043B\u043E\u043E\u0434\u0443\u0433\u0430\u0430\u0440</term>
    <term name="long-ordinal-08">\u043D\u0430\u0439\u043C\u0434\u0443\u0433\u0430\u0430\u0440</term>
    <term name="long-ordinal-09">\u0435\u0441\u0434\u04AF\u0433\u044D\u044D\u0440</term>
    <term name="long-ordinal-10">\u0430\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u043D\u043E\u043C</single>
      <multiple>\u043D\u043E\u043C\u043D\u0443\u0443\u0434</multiple>
    </term>
    <term name="chapter">
      <single>chapter</single>
      <multiple>chapters</multiple>
    </term>
    <term name="column">
      <single>\u0431\u0430\u0433\u0430\u043D\u0430</single>
      <multiple>\u0431\u0430\u0433\u0430\u043D\u0443\u0443\u0434</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>\u0442\u043E\u043E</single>
      <multiple>\u0442\u043E\u043E\u043D\u0443\u0443\u0434</multiple>
    </term>
    <term name="line">
      <single>\u0448\u0443\u0433\u0430\u043C</single>
      <multiple>\u0448\u0443\u0433\u0430\u043C\u043D\u0443\u0443\u0434</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notes</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>\u0445\u0443\u0443\u0434\u0430\u0441</single>
      <multiple>\u0445\u0443\u0443\u0434\u0430\u0441\u043D\u0443\u0443\u0434</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u0445\u0443\u0443\u0434\u0430\u0441</single>
      <multiple>\u0445\u0443\u0443\u0434\u0430\u0441\u043D\u0443\u0443\u0434</multiple>
    </term>
    <term name="paragraph">
      <single>paragraph</single>
      <multiple>paragraph</multiple>
    </term>
    <term name="part">
      <single>part</single>
      <multiple>parts</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk</term>
    <term name="chapter" form="short">chap</term>
    <term name="column" form="short">col</term>
    <term name="figure" form="short">fig</term>
    <term name="folio" form="short">f</term>
    <term name="issue" form="short">no</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op</term>
    <term name="page" form="short">
      <single>p</single>
      <multiple>pp</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p</single>
      <multiple>pp</multiple>
    </term>
    <term name="paragraph" form="short">para</term>
    <term name="part" form="short">pt</term>
    <term name="section" form="short">sec</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v</single>
      <multiple>vv</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol</single>
      <multiple>vols</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440</single>
      <multiple>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0443\u0443\u0434</multiple>
    </term>
    <term name="editorial-director">
      <single>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440</single>
      <multiple>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0443\u0443\u0434</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>\u043E\u0440\u0447\u0443\u0443\u043B\u0430\u0433\u0447</single>
      <multiple>\u043E\u0440\u0447\u0443\u0443\u043B\u0430\u0433\u0447\u0438\u0434</multiple>
    </term>
    <term name="editortranslator">
      <single>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0431\u0430 \u043E\u0440\u0447\u0443\u0443\u043B\u0430\u0433\u0447</single>
      <multiple>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u0443\u0443\u0434 \u0431\u0430 \u043E\u0440\u0447\u0443\u0443\u043B\u0430\u0433\u0447\u0438\u0434</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\u0440\u0435\u0434.</single>
      <multiple>\u0440\u0435\u0434.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>\u0440\u0435\u0434.</single>
      <multiple>\u0440\u0435\u0434.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\u043E\u0440\u0447</single>
      <multiple>\u043E\u0440\u0447</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>\u0440\u0435\u0434. \u0431\u0430 \u043E\u0440\u0447.</single>
      <multiple>\u0440\u0435\u0434. \u0431\u0430 \u043E\u0440\u0447.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">edited by</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">translated by</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">trans</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u041D\u044D\u0433\u0434\u04AF\u0433\u044D\u044D\u0440 \u0441\u0430\u0440</term>
    <term name="month-02">\u0425\u043E\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>
    <term name="month-03">\u0413\u0443\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>
    <term name="month-04">\u0414\u04E9\u0440\u04E9\u0432\u0434\u04AF\u0433\u044D\u044D\u0440 \u0441\u0430\u0440</term>
    <term name="month-05">\u0422\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>
    <term name="month-06">\u0417\u0443\u0440\u0433\u0430\u0430\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>
    <term name="month-07">\u0414\u043E\u043B\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>
    <term name="month-08">\u041D\u0430\u0439\u043C\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>
    <term name="month-09">\u0415\u0441\u0434\u04AF\u0433\u044D\u044D\u0440 \u0441\u0430\u0440</term>
    <term name="month-10">\u0410\u0440\u0430\u0432\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>
    <term name="month-11">\u0410\u0440\u0432\u0430\u043D \u043D\u044D\u0433\u0434\u04AF\u0433\u044D\u044D\u0440 \u0441\u0430\u0440</term>
    <term name="month-12">\u0410\u0440\u0432\u0430\u043D \u0445\u043E\u0451\u0440\u0434\u0443\u0433\u0430\u0430\u0440 \u0441\u0430\u0440</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">1-\u0440 \u0441\u0430\u0440</term>
    <term name="month-02" form="short">2-\u0440 \u0441\u0430\u0440</term>
    <term name="month-03" form="short">3-\u0440 \u0441\u0430\u0440</term>
    <term name="month-04" form="short">4-\u0440 \u0441\u0430\u0440</term>
    <term name="month-05" form="short">5-\u0440 \u0441\u0430\u0440</term>
    <term name="month-06" form="short">6-\u0440 \u0441\u0430\u0440</term>
    <term name="month-07" form="short">7-\u0440 \u0441\u0430\u0440</term>
    <term name="month-08" form="short">8-\u0440 \u0441\u0430\u0440</term>
    <term name="month-09" form="short">9-\u0440 \u0441\u0430\u0440</term>
    <term name="month-10" form="short">10-\u0440 \u0441\u0430\u0440</term>
    <term name="month-11" form="short">11-\u0440 \u0441\u0430\u0440</term>
    <term name="month-12" form="short">12-\u0440 \u0441\u0430\u0440</term>

    <!-- SEASONS -->
    <term name="season-01">\u0425\u0430\u0432\u0430\u0440</term>
    <term name="season-02">\u0417\u0443\u043D</term>
    <term name="season-03">\u041D\u0430\u043C\u0430\u0440</term>
    <term name="season-04">\u04E8\u0432\u04E9\u043B</term>
  </terms>
</locale>
`,"nb-NO":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="nb-NO">
  <info>
    <translator>
      <name>Guttorm Flatab\xF8</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2013-03-01T12:20:00+01:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
  </date>
  <terms>
    <term name="accessed">\xE5pnet</term>
    <term name="and">og</term>
    <term name="and others">med flere</term>
    <term name="anonymous">anonym</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">p\xE5</term>
    <term name="available at">tilgjengelig p\xE5</term>
    <term name="by">av</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">ca.</term>
    <term name="cited">sitert</term>
    <term name="edition">
      <single>utgave</single>
      <multiple>utgaver</multiple>
    </term>
    <term name="edition" form="short">utg.</term>
    <term name="et-al">mfl.</term>
    <term name="forthcoming">kommende</term>
    <term name="from">fra</term>
    <term name="ibid">ibid.</term>
    <term name="in">i</term>
    <term name="in press">i trykk</term>
    <term name="internet">Internett</term>
    <term name="interview">intervju</term>
    <term name="letter">brev</term>
    <term name="no date">ingen dato</term>
    <term name="no date" form="short">udatert</term>
    <term name="online">online</term>
    <term name="presented at">presentert p\xE5</term>
    <term name="reference">
      <single>referanse</single>
      <multiple>referanser</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refr.</multiple>
    </term>
    <term name="retrieved">hentet</term>
    <term name="scale">m\xE5lestokk</term>
    <term name="version">versjon</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">fvt.</term>
    <term name="bc">evt.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">f\xF8rste</term>
    <term name="long-ordinal-02">andre</term>
    <term name="long-ordinal-03">tredje</term>
    <term name="long-ordinal-04">fjerde</term>
    <term name="long-ordinal-05">femte</term>
    <term name="long-ordinal-06">sjette</term>
    <term name="long-ordinal-07">sjuende</term>
    <term name="long-ordinal-08">\xE5ttende</term>
    <term name="long-ordinal-09">niende</term>
    <term name="long-ordinal-10">tiende</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>bok</single>
      <multiple>b\xF8ker</multiple>
    </term>
    <term name="chapter">
      <single>kapittel</single>
      <multiple>kapitler</multiple>
    </term>
    <term name="column">
      <single>kolonne</single>
      <multiple>kolonner</multiple>
    </term>
    <term name="figure">
      <single>figur</single>
      <multiple>figurer</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folioer</multiple>
    </term>
    <term name="issue">
      <single>nummer</single>
      <multiple>numre</multiple>
    </term>
    <term name="line">
      <single>linje</single>
      <multiple>linjer</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>noter</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opus</multiple>
    </term>
    <term name="page">
      <single>side</single>
      <multiple>side</multiple>
    </term>
    <term name="number-of-pages">
      <single>side</single>
      <multiple>sider</multiple>
    </term>
    <term name="paragraph">
      <single>avsnitt</single>
      <multiple>avsnitt</multiple>
    </term>
    <term name="part">
      <single>del</single>
      <multiple>deler</multiple>
    </term>
    <term name="section">
      <single>paragraf</single>
      <multiple>paragrafer</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>vers</single>
      <multiple>vers</multiple>
    </term>
    <term name="volume">
      <single>bind</single>
      <multiple>bind</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">b.</term>
    <term name="chapter" form="short">kap.</term>
    <term name="column" form="short">kol.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">nr.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="paragraph" form="short">avsn.</term>
    <term name="part" form="short">d.</term>
    <term name="section" form="short">pargr.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>bd.</single>
      <multiple>bd.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>regiss\xF8r</single>
      <multiple>regiss\xF8rer</multiple>
    </term>
    <term name="editor">
      <single>redakt\xF8r</single>
      <multiple>redakt\xF8rer</multiple>
    </term>
    <term name="editorial-director">
      <single>redakt\xF8r</single>
      <multiple>redakt\xF8rer</multiple>
    </term>
    <term name="illustrator">
      <single>illustrat\xF8r</single>
      <multiple>illustrat\xF8rer</multiple>
    </term>
    <term name="translator">
      <single>oversetter</single>
      <multiple>oversettere</multiple>
    </term>
    <term name="editortranslator">
      <single>redakt\xF8r &amp; oversetter</single>
      <multiple>redakt\xF8rer &amp; oversettere</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>regi</single>
      <multiple>regi</multiple>
    </term>
    <term name="editor" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>overs.</single>
      <multiple>overs.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>red. &amp; overs.</single>
      <multiple>red. &amp; overs.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">av</term>
    <term name="director" form="verb">regissert av</term>
    <term name="editor" form="verb">redigert av</term>
    <term name="editorial-director" form="verb">redigert av</term>
    <term name="illustrator" form="verb">illustrert av</term>
    <term name="interviewer" form="verb">intervjuet av</term>
    <term name="recipient" form="verb">til</term>
    <term name="reviewed-author" form="verb">av</term>
    <term name="translator" form="verb">oversatt av</term>
    <term name="editortranslator" form="verb">redigert &amp; oversatt av</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">regi</term>
    <term name="editor" form="verb-short">red.</term>
    <term name="editorial-director" form="verb-short">red.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">overs.</term>
    <term name="editortranslator" form="verb-short">red. &amp; overs. av</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">januar</term>
    <term name="month-02">februar</term>
    <term name="month-03">mars</term>
    <term name="month-04">april</term>
    <term name="month-05">mai</term>
    <term name="month-06">juni</term>
    <term name="month-07">juli</term>
    <term name="month-08">august</term>
    <term name="month-09">september</term>
    <term name="month-10">oktober</term>
    <term name="month-11">november</term>
    <term name="month-12">desember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mai</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">des.</term>

    <!-- SEASONS -->
    <term name="season-01">v\xE5r</term>
    <term name="season-02">sommer</term>
    <term name="season-03">h\xF8st</term>
    <term name="season-04">vinter</term>
  </terms>
</locale>
`,"nl-NL":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="nl-NL">
  <info>
    <translator>
      <name>Rintze M. Zelle</name>
      <uri>http://twitter.com/rintzezelle</uri>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2017-04-01T12:00:00+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" suffix="-" range-delimiter="/"/>
    <date-part name="month" form="numeric" suffix="-" range-delimiter="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">geraadpleegd</term>
    <term name="and">en</term>
    <term name="and others">en anderen</term>
    <term name="anonymous">anoniem</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">bij</term>
    <term name="available at">beschikbaar op</term>
    <term name="by">door</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">geciteerd</term>
    <term name="edition">
      <single>druk</single>
      <multiple>drukken</multiple>
    </term>
    <term name="edition" form="short">dr.</term>
    <term name="et-al">e.a.</term>
    <term name="forthcoming">in voorbereiding</term>
    <term name="from">van</term>
    <term name="ibid">ibid.</term>
    <term name="in">in</term>
    <term name="in press">in druk</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">brief</term>
    <term name="no date">zonder datum</term>
    <term name="no date" form="short">z.d.</term>
    <term name="online">online</term>
    <term name="presented at">gepresenteerd bij</term>
    <term name="reference">
      <single>referentie</single>
      <multiple>referenties</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">geraadpleegd</term>
    <term name="scale">schaal</term>
    <term name="version">versie</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">ste</term>
    <term name="ordinal-00" match="whole-number">de</term>
    <term name="ordinal-02" match="last-two-digits">de</term>
    <term name="ordinal-03" match="last-two-digits">de</term>
    <term name="ordinal-04" match="last-two-digits">de</term>
    <term name="ordinal-05" match="last-two-digits">de</term>
    <term name="ordinal-06" match="last-two-digits">de</term>
    <term name="ordinal-07" match="last-two-digits">de</term>
    <term name="ordinal-09" match="last-two-digits">de</term>
    <term name="ordinal-10">de</term>
    <term name="ordinal-11">de</term>
    <term name="ordinal-12">de</term>
    <term name="ordinal-13">de</term>
    <term name="ordinal-14">de</term>
    <term name="ordinal-15">de</term>
    <term name="ordinal-16">de</term>
    <term name="ordinal-17">de</term>
    <term name="ordinal-18">de</term>
    <term name="ordinal-19">de</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">eerste</term>
    <term name="long-ordinal-02">tweede</term>
    <term name="long-ordinal-03">derde</term>
    <term name="long-ordinal-04">vierde</term>
    <term name="long-ordinal-05">vijfde</term>
    <term name="long-ordinal-06">zesde</term>
    <term name="long-ordinal-07">zevende</term>
    <term name="long-ordinal-08">achtste</term>
    <term name="long-ordinal-09">negende</term>
    <term name="long-ordinal-10">tiende</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>boek</single>
      <multiple>boeken</multiple>
    </term>
    <term name="chapter">
      <single>hoofdstuk</single>
      <multiple>hoofdstukken</multiple>
    </term>
    <term name="column">
      <single>column</single>
      <multiple>columns</multiple>
    </term>
    <term name="figure">
      <single>figuur</single>
      <multiple>figuren</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folio's</multiple>
    </term>
    <term name="issue">
      <single>nummer</single>
      <multiple>nummers</multiple>
    </term>
    <term name="line">
      <single>regel</single>
      <multiple>regels</multiple>
    </term>
    <term name="note">
      <single>aantekening</single>
      <multiple>aantekeningen</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>pagina</single>
      <multiple>pagina's</multiple>
    </term>
    <term name="number-of-pages">
      <single>pagina</single>
      <multiple>pagina's</multiple>
    </term>
    <term name="paragraph">
      <single>paragraaf</single>
      <multiple>paragrafen</multiple>
    </term>
    <term name="part">
      <single>deel</single>
      <multiple>delen</multiple>
    </term>
    <term name="section">
      <single>sectie</single>
      <multiple>secties</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>vers</single>
      <multiple>versen</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bk.</term>
    <term name="chapter" form="short">hfdst.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">nr.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">deel</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>regisseur</single>
      <multiple>regisseurs</multiple>
    </term>
    <term name="editor">
      <single>redacteur</single>
      <multiple>redacteuren</multiple>
    </term>
    <term name="editorial-director">
      <single>redacteur</single>
      <multiple>redacteuren</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>vertaler</single>
      <multiple>vertalers</multiple>
    </term>
    <term name="editortranslator">
      <single>redacteur &amp; vertaler</single>
      <multiple>redacteuren &amp; vertalers</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>reg.</single>
      <multiple>reg.</multiple>
    </term>
    <term name="editor" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>vert.</single>
      <multiple>vert.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>red. &amp; vert.</single>
      <multiple>red. &amp; vert.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">door</term>
    <term name="director" form="verb">geregisseerd door</term>
    <term name="editor" form="verb">onder redactie van</term>
    <term name="editorial-director" form="verb">onder redactie van</term>
    <term name="illustrator" form="verb">ge\xEFllustreerd door</term>
    <term name="interviewer" form="verb">ge\xEFnterviewd door</term>
    <term name="recipient" form="verb">ontvangen door</term>
    <term name="reviewed-author" form="verb">door</term>
    <term name="translator" form="verb">vertaald door</term>
    <term name="editortranslator" form="verb">bewerkt &amp; vertaald door</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">geregisseerd door</term>
    <term name="editor" form="verb-short">onder redactie van</term>
    <term name="editorial-director" form="verb-short">bewerkt door</term>
    <term name="illustrator" form="verb-short">ge\xEFllustreerd door</term>
    <term name="translator" form="verb-short">vertaald door</term>
    <term name="editortranslator" form="verb-short">bewerkt &amp; vertaald door</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">januari</term>
    <term name="month-02">februari</term>
    <term name="month-03">maart</term>
    <term name="month-04">april</term>
    <term name="month-05">mei</term>
    <term name="month-06">juni</term>
    <term name="month-07">juli</term>
    <term name="month-08">augustus</term>
    <term name="month-09">september</term>
    <term name="month-10">oktober</term>
    <term name="month-11">november</term>
    <term name="month-12">december</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mrt.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mei</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">lente</term>
    <term name="season-02">zomer</term>
    <term name="season-03">herst</term>
    <term name="season-04">winter</term>
  </terms>
</locale>
`,"nn-NO":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="nn-NO">
  <info>
    <translator>
      <name>Guttorm Flatab\xF8</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2013-03-01T12:20:00+01:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
  </date>
  <terms>
    <term name="accessed">vitja</term>
    <term name="and">og</term>
    <term name="and others">med fleire</term>
    <term name="anonymous">anonym</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">p\xE5</term>
    <term name="available at">tilgjengeleg p\xE5</term>
    <term name="by">av</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">ca.</term>
    <term name="cited">sitert</term>
    <term name="edition">
      <single>utg\xE5ve</single>
      <multiple>utg\xE5ver</multiple>
    </term>
    <term name="edition" form="short">utg.</term>
    <term name="et-al">mfl.</term>
    <term name="forthcoming">kommande</term>
    <term name="from">fr\xE5</term>
    <term name="ibid">ibid.</term>
    <term name="in">i</term>
    <term name="in press">i trykk</term>
    <term name="internet">Internett</term>
    <term name="interview">intervju</term>
    <term name="letter">brev</term>
    <term name="no date">ingen dato</term>
    <term name="no date" form="short">udatert</term>
    <term name="online">online</term>
    <term name="presented at">presentert p\xE5</term>
    <term name="reference">
      <single>referanse</single>
      <multiple>referansar</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refr.</multiple>
    </term>
    <term name="retrieved">henta</term>
    <term name="scale">m\xE5lestokk</term>
    <term name="version">versjon</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">fvt.</term>
    <term name="bc">evt.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">f\xF8rste</term>
    <term name="long-ordinal-02">andre</term>
    <term name="long-ordinal-03">tredje</term>
    <term name="long-ordinal-04">fjerde</term>
    <term name="long-ordinal-05">femte</term>
    <term name="long-ordinal-06">sjette</term>
    <term name="long-ordinal-07">sjuande</term>
    <term name="long-ordinal-08">\xE5ttande</term>
    <term name="long-ordinal-09">niande</term>
    <term name="long-ordinal-10">tiande</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>bok</single>
      <multiple>b\xF8ker</multiple>
    </term>
    <term name="chapter">
      <single>kapittel</single>
      <multiple>kapittel</multiple>
    </term>
    <term name="column">
      <single>kolonne</single>
      <multiple>kolonner</multiple>
    </term>
    <term name="figure">
      <single>figur</single>
      <multiple>figurar</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folioar</multiple>
    </term>
    <term name="issue">
      <single>nummer</single>
      <multiple>nummer</multiple>
    </term>
    <term name="line">
      <single>linje</single>
      <multiple>linjer</multiple>
    </term>
    <term name="note">
      <single>note</single>
      <multiple>notar</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opus</multiple>
    </term>
    <term name="page">
      <single>side</single>
      <multiple>side</multiple>
    </term>
    <term name="number-of-pages">
      <single>side</single>
      <multiple>sider</multiple>
    </term>
    <term name="paragraph">
      <single>avsnitt</single>
      <multiple>avsnitt</multiple>
    </term>
    <term name="part">
      <single>del</single>
      <multiple>deler</multiple>
    </term>
    <term name="section">
      <single>paragraf</single>
      <multiple>paragrafar</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>vers</single>
      <multiple>vers</multiple>
    </term>
    <term name="volume">
      <single>bind</single>
      <multiple>bind</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">b.</term>
    <term name="chapter" form="short">kap.</term>
    <term name="column" form="short">kol.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">nr.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="paragraph" form="short">avsn.</term>
    <term name="part" form="short">d.</term>
    <term name="section" form="short">par.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>bd.</single>
      <multiple>bd.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>regiss\xF8r</single>
      <multiple>regiss\xF8rar</multiple>
    </term>
    <term name="editor">
      <single>redakt\xF8r</single>
      <multiple>redakt\xF8rar</multiple>
    </term>
    <term name="editorial-director">
      <single>redakt\xF8r</single>
      <multiple>redakt\xF8rar</multiple>
    </term>
    <term name="illustrator">
      <single>illustrat\xF8r</single>
      <multiple>illustrat\xF8rar</multiple>
    </term>
    <term name="translator">
      <single>omsetjar</single>
      <multiple>omsetjarar</multiple>
    </term>
    <term name="editortranslator">
      <single>redakt\xF8r &amp; omsetjar</single>
      <multiple>redakt\xF8rar &amp; omsetjarar</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>regi</single>
      <multiple>regi</multiple>
    </term>
    <term name="editor" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>oms.</single>
      <multiple>oms.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>red. &amp; oms.</single>
      <multiple>red. &amp; oms.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">av</term>
    <term name="director" form="verb">regissert av</term>
    <term name="editor" form="verb">redigert av</term>
    <term name="editorial-director" form="verb">redigert av</term>
    <term name="illustrator" form="verb">illustrert av</term>
    <term name="interviewer" form="verb">intervjua av</term>
    <term name="recipient" form="verb">til</term>
    <term name="reviewed-author" form="verb">av</term>
    <term name="translator" form="verb">omsett av</term>
    <term name="editortranslator" form="verb">redigert &amp; omsett av</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">regi</term>
    <term name="editor" form="verb-short">red.</term>
    <term name="editorial-director" form="verb-short">red.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">oms.</term>
    <term name="editortranslator" form="verb-short">red. &amp; oms. av</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">januar</term>
    <term name="month-02">februar</term>
    <term name="month-03">mars</term>
    <term name="month-04">april</term>
    <term name="month-05">mai</term>
    <term name="month-06">juni</term>
    <term name="month-07">juli</term>
    <term name="month-08">august</term>
    <term name="month-09">september</term>
    <term name="month-10">oktober</term>
    <term name="month-11">november</term>
    <term name="month-12">desember</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mai</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">des.</term>

    <!-- SEASONS -->
    <term name="season-01">v\xE5r</term>
    <term name="season-02">sommar</term>
    <term name="season-03">haust</term>
    <term name="season-04">vinter</term>
  </terms>
</locale>
`,"pl-PL":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="pl-PL">
  <info>
    <translator>
      <name>pAo</name>
    </translator>
    <translator>
      <name>Michal</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">udost\u0119pniono</term>
    <term name="and">i</term>
    <term name="and others">i inni</term>
    <term name="anonymous">anonim</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">na</term>
    <term name="available at">dost\u0119pne na</term>
    <term name="by">przez</term>
    <term name="circa">oko\u0142o</term>
    <term name="circa" form="short">ok</term>
    <term name="cited">cytowane</term>
    <term name="edition">
      <single>wydanie</single>
      <multiple>wydania</multiple>
    </term>
    <term name="edition" form="short">wyd.</term>
    <term name="et-al">i in.</term>
    <term name="forthcoming">w przygotowaniu</term>
    <term name="from">z</term>
    <term name="ibid">ibid.</term>
    <term name="in">w</term>
    <term name="in press">w druku</term>
    <term name="internet">internet</term>
    <term name="interview">wywiad</term>
    <term name="letter">list</term>
    <term name="no date">brak daty</term>
    <term name="no date" form="short">b.d.</term>
    <term name="online">online</term>
    <term name="presented at">zaprezentowano na</term>
    <term name="reference">
      <single>referencja</single>
      <multiple>referencje</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">pobrano</term>
    <term name="scale">skala</term>
    <term name="version">wersja</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">n.e.</term>
    <term name="bc">p.n.e.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\xAB</term>
    <term name="close-inner-quote">\xBB</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">pierwszy</term>
    <term name="long-ordinal-02">drugi</term>
    <term name="long-ordinal-03">trzeci</term>
    <term name="long-ordinal-04">czwarty</term>
    <term name="long-ordinal-05">pi\u0105ty</term>
    <term name="long-ordinal-06">sz\xF3sty</term>
    <term name="long-ordinal-07">si\xF3dmy</term>
    <term name="long-ordinal-08">\xF3smy</term>
    <term name="long-ordinal-09">dziewi\u0105ty</term>
    <term name="long-ordinal-10">dziesi\u0105ty</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>ksi\u0105\u017Cka</single>
      <multiple>ksi\u0105\u017Cki</multiple>
    </term>
    <term name="chapter">
      <single>rozdzia\u0142</single>
      <multiple>rozdzia\u0142y</multiple>
    </term>
    <term name="column">
      <single>kolumna</single>
      <multiple>kolumny</multiple>
    </term>
    <term name="figure">
      <single>rycina</single>
      <multiple>ryciny</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folio</multiple>
    </term>
    <term name="issue">
      <single>numer</single>
      <multiple>numery</multiple>
    </term>
    <term name="line">
      <single>wiersz</single>
      <multiple>wiersze</multiple>
    </term>
    <term name="note">
      <single>notatka</single>
      <multiple>notatki</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>strona</single>
      <multiple>strony</multiple>
    </term>
    <term name="number-of-pages">
      <single>strona</single>
      <multiple>strony</multiple>
    </term>
    <term name="paragraph">
      <single>akapit</single>
      <multiple>akapity</multiple>
    </term>
    <term name="part">
      <single>cz\u0119\u015B\u0107</single>
      <multiple>cz\u0119\u015Bci</multiple>
    </term>
    <term name="section">
      <single>sekcja</single>
      <multiple>sekcje</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>wers</single>
      <multiple>wersy</multiple>
    </term>
    <term name="volume">
      <single>tom</single>
      <multiple>tomy</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">ksi\u0105\u017Cka</term>
    <term name="chapter" form="short">rozdz.</term>
    <term name="column" form="short">kol.</term>
    <term name="figure" form="short">ryc.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">nr</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>ss.</multiple>
    </term>
    <term name="paragraph" form="short">akap.</term>
    <term name="part" form="short">cz.</term>
    <term name="section" form="short">sekc.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>w.</single>
      <multiple>w.</multiple>
    </term>
    <term name="volume" form="short">
      <single>t.</single>
      <multiple>t.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>re\u017Cyser</single>
      <multiple>re\u017Cyserzy</multiple>
    </term>
    <term name="editor">
      <single>redaktor</single>
      <multiple>redaktorzy</multiple>
    </term>
    <term name="editorial-director">
      <single>edytor</single>
      <multiple>edytorzy</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrator</single>
      <multiple>ilustratorzy</multiple>
    </term>
    <term name="translator">
      <single>t\u0142umacz</single>
      <multiple>t\u0142umacze</multiple>
    </term>
    <term name="editortranslator">
      <single>redaktor &amp; t\u0142umacz</single>
      <multiple>redaktorzy &amp; t\u0142umacze</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>re\u017C.</single>
      <multiple>re\u017C.</multiple>
    </term>
    <term name="editor" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>il.</single>
      <multiple>il.</multiple>
    </term>
    <term name="translator" form="short">
      <single>t\u0142um.</single>
      <multiple>t\u0142um.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>red.t\u0142um.</single>
      <multiple>red.t\u0142um.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">przez</term>
    <term name="director" form="verb">re\u017Cyserowane przez</term>
    <term name="editor" form="verb">zredagowane przez</term>
    <term name="editorial-director" form="verb">zredagowane przez</term>
    <term name="illustrator" form="verb">ilustrowane przez</term>
    <term name="interviewer" form="verb">przeprowadzony przez</term>
    <term name="recipient" form="verb">dla</term>
    <term name="reviewed-author" form="verb">przez</term>
    <term name="translator" form="verb">przet\u0142umaczone przez</term>
    <term name="editortranslator" form="verb">zredagowane i przet\u0142umaczone przez</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">re\u017C.</term>
    <term name="editor" form="verb-short">red.</term>
    <term name="editorial-director" form="verb-short">red.</term>
    <term name="illustrator" form="verb-short">il.</term>
    <term name="translator" form="verb-short">t\u0142um.</term>
    <term name="editortranslator" form="verb-short">red.t\u0142um.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">stycze\u0144</term>
    <term name="month-02">luty</term>
    <term name="month-03">marzec</term>
    <term name="month-04">kwiecie\u0144</term>
    <term name="month-05">maj</term>
    <term name="month-06">czerwiec</term>
    <term name="month-07">lipiec</term>
    <term name="month-08">sierpie\u0144</term>
    <term name="month-09">wrzesie\u0144</term>
    <term name="month-10">pa\u017Adziernik</term>
    <term name="month-11">listopad</term>
    <term name="month-12">grudzie\u0144</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">sty.</term>
    <term name="month-02" form="short">luty</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">kwi.</term>
    <term name="month-05" form="short">maj</term>
    <term name="month-06" form="short">cze.</term>
    <term name="month-07" form="short">lip.</term>
    <term name="month-08" form="short">sie.</term>
    <term name="month-09" form="short">wrz.</term>
    <term name="month-10" form="short">pa\u017A.</term>
    <term name="month-11" form="short">lis.</term>
    <term name="month-12" form="short">grudz.</term>

    <!-- SEASONS -->
    <term name="season-01">wiosna</term>
    <term name="season-02">lato</term>
    <term name="season-03">jesie\u0144</term>
    <term name="season-04">zima</term>
  </terms>
</locale>
`,"pt-BR":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="pt-BR">
  <info>
    <translator>
      <name>Jos\xE9 Antonio Meira da Rocha</name>
    </translator>
    <translator>
      <name>Meira da Rocha</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2016-05-16T00:00:00+03:00</updated>
  </info>
  <style-options punctuation-in-quote="false" limit-day-ordinals-to-day-1="true"/>
  <date form="text">
    <date-part name="day" form="ordinal" suffix=" de "/>
    <date-part name="month" suffix=" de "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">acessado</term>
    <term name="and">e</term>
    <term name="and others">e outros</term>
    <term name="anonymous">an\xF4nimo</term>
    <term name="anonymous" form="short">anon</term>
    <term name="at">em</term>
    <term name="available at">dispon\xEDvel em</term>
    <term name="by">por</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citado</term>
    <term name="edition">
      <single>edi\xE7\xE3o</single>
      <multiple>edi\xE7\xF5es</multiple>
    </term>
    <term name="edition" form="short">ed</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">a ser publicado</term>
    <term name="from">de</term>
    <term name="ibid">ibidem</term>
    <term name="in">in</term>
    <term name="in press">no prelo</term>
    <term name="internet">internet</term>
    <term name="interview">entrevista</term>
    <term name="letter">carta</term>
    <term name="no date">sem data</term>
    <term name="no date" form="short">[s.d.]</term>
    <term name="online">online</term>
    <term name="presented at">apresentado em</term>
    <term name="reference">
      <single>refer\xEAncia</single>
      <multiple>refer\xEAncias</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">recuperado</term>
    <term name="scale">escala</term>
    <term name="version">vers\xE3o</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">DC</term>
    <term name="bc">AC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">&#8211;</term>

    <!-- ORDINALS -->
    <term name="ordinal">\xBA</term>
    <term name="ordinal-01" gender-form="feminine" match="whole-number">\xAA</term>
    <term name="ordinal-01" gender-form="masculine" match="whole-number">\xBA</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01" gender-form="masculine">primeiro</term>
    <term name="long-ordinal-02" gender-form="masculine">segundo</term>
    <term name="long-ordinal-03" gender-form="masculine">terceiro</term>
    <term name="long-ordinal-04" gender-form="masculine">quarto</term>
    <term name="long-ordinal-05" gender-form="masculine">quinto</term>
    <term name="long-ordinal-06" gender-form="masculine">sexto</term>
    <term name="long-ordinal-07" gender-form="masculine">s\xE9timo</term>
    <term name="long-ordinal-08" gender-form="masculine">oitavo</term>
    <term name="long-ordinal-09" gender-form="masculine">nono</term>
    <term name="long-ordinal-10" gender-form="masculine">d\xE9cimo</term>
    <term name="long-ordinal-01" gender-form="feminine">primeira</term>
    <term name="long-ordinal-02" gender-form="feminine">segunda</term>
    <term name="long-ordinal-03" gender-form="feminine">terceira</term>
    <term name="long-ordinal-04" gender-form="feminine">quarta</term>
    <term name="long-ordinal-05" gender-form="feminine">quinta</term>
    <term name="long-ordinal-06" gender-form="feminine">sexta</term>
    <term name="long-ordinal-07" gender-form="feminine">s\xE9tima</term>
    <term name="long-ordinal-08" gender-form="feminine">oitava</term>
    <term name="long-ordinal-09" gender-form="feminine">nona</term>
    <term name="long-ordinal-10" gender-form="feminine">d\xE9cima</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>livro</single>
      <multiple>livros</multiple>
    </term>
    <term name="chapter">
      <single>cap\xEDtulo</single>
      <multiple>cap\xEDtulos</multiple>
    </term>
    <term name="column">
      <single>coluna</single>
      <multiple>colunas</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figuras</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>n\xFAmero</single>
      <multiple>n\xFAmeros</multiple>
    </term>
    <term name="line">
      <single>linha</single>
      <multiple>linhas</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notas</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="number-of-pages">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="paragraph">
      <single>par\xE1grafo</single>
      <multiple>par\xE1grafos</multiple>
    </term>
    <term name="part">
      <single>parte</single>
      <multiple>partes</multiple>
    </term>
    <term name="section">
      <single>se\xE7\xE3o</single>
      <multiple>se\xE7\xF5es</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verso</single>
      <multiple>versos</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">liv.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">n\xBA</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>p.</multiple>
    </term>
    <term name="paragraph" form="short">parag.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">se\xE7.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>diretor</single>
      <multiple>diretores</multiple>
    </term>
    <term name="editor">
      <single>organizador</single>
      <multiple>organizadores</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrador</single>
      <multiple>ilustradores</multiple>
    </term>
    <term name="translator">
      <single>tradutor</single>
      <multiple>tradutores</multiple>
    </term>
    <term name="editortranslator">
      <single>editor e tradutor</single>
      <multiple>editores e tradutores</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>org.</single>
      <multiple>orgs.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>il.</single>
      <multiple>ils.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trads.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. e trad.</single>
      <multiple>eds. e trads.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">por</term>
    <term name="director" form="verb">dirigido por</term>
    <term name="editor" form="verb">organizado por</term>
    <term name="editorial-director" form="verb">editado por</term>
    <term name="illustrator" form="verb">ilustrado por</term>
    <term name="interviewer" form="verb">entrevista de</term>
    <term name="recipient" form="verb">para</term>
    <term name="reviewed-author" form="verb">por</term>
    <term name="translator" form="verb">traduzido por</term>
    <term name="editortranslator" form="verb">editado e traduzido por</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">org.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">ilus.</term>
    <term name="translator" form="verb-short">trad.</term>
    <term name="editortranslator" form="verb-short">ed. e trad. por</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">janeiro</term>
    <term name="month-02">fevereiro</term>
    <term name="month-03">mar\xE7o</term>
    <term name="month-04">abril</term>
    <term name="month-05">maio</term>
    <term name="month-06">junho</term>
    <term name="month-07">julho</term>
    <term name="month-08">agosto</term>
    <term name="month-09">setembro</term>
    <term name="month-10">outubro</term>
    <term name="month-11">novembro</term>
    <term name="month-12">dezembro</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">fev.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">abr.</term>
    <term name="month-05" form="short">maio</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">ago.</term>
    <term name="month-09" form="short">set.</term>
    <term name="month-10" form="short">out.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dez.</term>

    <!-- SEASONS -->
    <term name="season-01">Primavera</term>
    <term name="season-02">Ver\xE3o</term>
    <term name="season-03">Outono</term>
    <term name="season-04">Inverno</term>
  </terms>
</locale>
`,"pt-PT":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="pt-PT">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2013-09-20T23:31:02+00:00</updated>
    <translator>
      <name>Jonadabe PT</name>
    </translator>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" de "/>
    <date-part name="month" suffix=" de "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">acedido</term>
    <term name="and">e</term>
    <term name="and others">e outros</term>
    <term name="anonymous">an\xF3nimo</term>
    <term name="anonymous" form="short">an\xF3n.</term>
    <term name="at">em</term>
    <term name="available at">dispon\xEDvel em</term>
    <term name="by">por</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">citado</term>
    <term name="edition">
      <single>edi\xE7\xE3o</single>
      <multiple>edi\xE7\xF5es</multiple>
    </term>
    <term name="edition" form="short">ed.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">a publicar</term>
    <term name="from">de</term>
    <term name="ibid">ibid.</term>
    <term name="in">em</term>
    <term name="in press">no prelo</term>
    <term name="internet">internet</term>
    <term name="interview">entrevista</term>
    <term name="letter">carta</term>
    <term name="no date">sem data</term>
    <term name="no date" form="short">sem data</term>
    <term name="online">em linha</term>
    <term name="presented at">apresentado na</term>
    <term name="reference">
      <single>refer\xEAncia</single>
      <multiple>refer\xEAncias</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">obtido</term>
    <term name="scale">scale</term>
    <term name="version">vers\xE3o</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u201C</term>
    <term name="close-inner-quote">\u201D</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal" gender-form="masculine" match="whole-number">.\xBA</term>
    <term name="ordinal" gender-form="feminine" match="whole-number">.\xAA</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01" gender-form="masculine">primeiro</term>
    <term name="long-ordinal-01" gender-form="feminine">primeira</term>
    <term name="long-ordinal-02" gender-form="masculine">segundo</term>
    <term name="long-ordinal-02" gender-form="feminine">segunda</term>    
    <term name="long-ordinal-03" gender-form="masculine">terceiro</term>
    <term name="long-ordinal-03" gender-form="feminine">terceira</term>    
    <term name="long-ordinal-04" gender-form="masculine">quarto</term>
    <term name="long-ordinal-04" gender-form="feminine">quarta</term>
    <term name="long-ordinal-05" gender-form="masculine">quinto</term>
    <term name="long-ordinal-05" gender-form="feminine">quinta</term>
    <term name="long-ordinal-06" gender-form="masculine">sexto</term>
    <term name="long-ordinal-06" gender-form="feminine">sexta</term>
    <term name="long-ordinal-07" gender-form="masculine">s\xE9timo</term>
    <term name="long-ordinal-07" gender-form="feminine">s\xE9tima</term>
    <term name="long-ordinal-08" gender-form="masculine">oitavo</term>
    <term name="long-ordinal-08" gender-form="feminine">oitava</term>
    <term name="long-ordinal-09" gender-form="masculine">nono</term>
    <term name="long-ordinal-09" gender-form="feminine">nona</term>
    <term name="long-ordinal-10" gender-form="masculine">d\xE9cimo</term>
    <term name="long-ordinal-10" gender-form="feminine">d\xE9cima</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>livro</single>
      <multiple>livros</multiple>
    </term>
    <term name="chapter">
      <single>cap\xEDtulo</single>
      <multiple>cap\xEDtulos</multiple>
    </term>
    <term name="column">
      <single>coluna</single>
      <multiple>colunas</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figuras</multiple>
    </term>
    <term name="folio">
      <single>f\xF3lio</single>
      <multiple>f\xF3lios</multiple>
    </term>
    <term name="issue">
      <single>n\xFAmero</single>
      <multiple>n\xFAmeros</multiple>
    </term>
    <term name="line">
      <single>linha</single>
      <multiple>linhas</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notas</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="number-of-pages">
      <single>p\xE1gina</single>
      <multiple>p\xE1ginas</multiple>
    </term>
    <term name="paragraph">
      <single>par\xE1grafo</single>
      <multiple>par\xE1grafos</multiple>
    </term>
    <term name="part">
      <single>parte</single>
      <multiple>partes</multiple>
    </term>
    <term name="section">
      <single>sec\xE7\xE3o</single>
      <multiple>sec\xE7\xF5es</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>vers\xEDculo</single>
      <multiple>vers\xEDculos</multiple>
    </term>
    <term name="volume">
      <single>volume</single>
      <multiple>volumes</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">liv.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">n.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">pt.</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v</single>
      <multiple>vv</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vols.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directores</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editores</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrador</single>
      <multiple>ilustradores</multiple>
    </term>
    <term name="translator">
      <single>tradutor</single>
      <multiple>tradutores</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; tradutor</single>
      <multiple>editores &amp; tradutores</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>il.</single>
      <multiple>ils.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trads.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; trad.</single>
      <multiple>eds. &amp; trads.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">por</term>
    <term name="director" form="verb">dirigido por</term>
    <term name="editor" form="verb">editado por</term>
    <term name="editorial-director" form="verb">editorial de</term>
    <term name="illustrator" form="verb">ilustrado por</term>
    <term name="interviewer" form="verb">entrevistado por</term>
    <term name="recipient" form="verb">para</term>
    <term name="reviewed-author" form="verb">revisto por</term>
    <term name="translator" form="verb">traduzido por</term>
    <term name="editortranslator" form="verb">editado &amp; traduzido por</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">ilus.</term>
    <term name="translator" form="verb-short">trad.</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trad. por</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Janeiro</term>
    <term name="month-02">Fevereiro</term>
    <term name="month-03">Mar\xE7o</term>
    <term name="month-04">Abril</term>
    <term name="month-05">Maio</term>
    <term name="month-06">Junho</term>
    <term name="month-07">Julho</term>
    <term name="month-08">Agosto</term>
    <term name="month-09">Setembro</term>
    <term name="month-10">Outubro</term>
    <term name="month-11">Novembro</term>
    <term name="month-12">Dezembro</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Jan.</term>
    <term name="month-02" form="short">Fev.</term>
    <term name="month-03" form="short">Mar.</term>
    <term name="month-04" form="short">Abr.</term>
    <term name="month-05" form="short">Mai.</term>
    <term name="month-06" form="short">Jun.</term>
    <term name="month-07" form="short">Jul.</term>
    <term name="month-08" form="short">Ago.</term>
    <term name="month-09" form="short">Set.</term>
    <term name="month-10" form="short">Out.</term>
    <term name="month-11" form="short">Nov.</term>
    <term name="month-12" form="short">Dez.</term>

    <!-- SEASONS -->
    <term name="season-01">Primavera</term>
    <term name="season-02">Ver\xE3o</term>
    <term name="season-03">Outono</term>
    <term name="season-04">Inverno</term>
  </terms>
</locale>
`,"ro-RO":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="ro-RO">
  <info>
    <translator>
      <name>Nicolae Turcan</name>
      <email>nturcan@gmail.com</email>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" suffix="."/>
    <date-part name="month" form="numeric" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">data acces\u0103rii</term>
    <term name="and">\u0219i</term>
    <term name="and others">\u0219i al\u021Bii</term>
    <term name="anonymous">anonim</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">la</term>
    <term name="available at">disponibil la</term>
    <term name="by">de</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">cca.</term>
    <term name="cited">citat</term>
    <term name="edition">
      <single>edi\u021Bia</single>
      <multiple>edi\u021Biile</multiple>
    </term>
    <term name="edition" form="short">ed</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">\xEEn curs de apari\u021Bie</term>
    <term name="from">din</term>
    <term name="ibid">ibidem</term>
    <term name="in">\xEEn</term>
    <term name="in press">sub tipar</term>
    <term name="internet">internet</term>
    <term name="interview">interviu</term>
    <term name="letter">scrisoare</term>
    <term name="no date">f\u0103r\u0103 dat\u0103</term>
    <term name="no date" form="short">f.a.</term>
    <term name="online">online</term>
    <term name="presented at">prezentat la</term>
    <term name="reference">
      <single>referin\u021B\u0103</single>
      <multiple>referin\u021Be</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">preluat \xEEn</term>
    <term name="scale">scal\u0103</term>
    <term name="version">versiunea</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">d.Hr.</term>
    <term name="bc">\xEE.Hr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\xAB</term>
    <term name="close-inner-quote">\xBB</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">-lea</term>
    <term name="ordinal-01" match="whole-number"></term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">primul</term>
    <term name="long-ordinal-02">al doilea</term>
    <term name="long-ordinal-03">al treilea</term>
    <term name="long-ordinal-04">al patrulea</term>
    <term name="long-ordinal-05">al cincilea</term>
    <term name="long-ordinal-06">al \u0219aselea</term>
    <term name="long-ordinal-07">al \u0219aptelea</term>
    <term name="long-ordinal-08">al optulea</term>
    <term name="long-ordinal-09">al nou\u0103lea</term>
    <term name="long-ordinal-10">al zecelea</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>cartea</single>
      <multiple>c\u0103r\u021Bile</multiple>
    </term>
    <term name="chapter">
      <single>capitolul</single>
      <multiple>capitolele</multiple>
    </term>
    <term name="column">
      <single>coloana</single>
      <multiple>coloanele</multiple>
    </term>
    <term name="figure">
      <single>figura</single>
      <multiple>figurile</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folio</multiple>
    </term>
    <term name="issue">
      <single>num\u0103rul</single>
      <multiple>numerele</multiple>
    </term>
    <term name="line">
      <single>linia</single>
      <multiple>liniile</multiple>
    </term>
    <term name="note">
      <single>nota</single>
      <multiple>notele</multiple>
    </term>
    <term name="opus">
      <single>opusul</single>
      <multiple>opusurile</multiple>
    </term>
    <term name="page">
      <single>pagina</single>
      <multiple>paginile</multiple>
    </term>
    <term name="number-of-pages">
      <single>pagina</single>
      <multiple>paginile</multiple>
    </term>
    <term name="paragraph">
      <single>paragraful</single>
      <multiple>paragrafele</multiple>
    </term>
    <term name="part">
      <single>partea</single>
      <multiple>p\u0103r\u021Bile</multiple>
    </term>
    <term name="section">
      <single>sec\u021Biunea</single>
      <multiple>sec\u021Biunile</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>versetul</single>
      <multiple>versetele</multiple>
    </term>
    <term name="volume">
      <single>volumul</single>
      <multiple>volumele</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">cart.</term>
    <term name="chapter" form="short">cap.</term>
    <term name="column" form="short">col.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">nr.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>p.</single>
      <multiple>pp.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">part.</term>
    <term name="section" form="short">sec.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vol.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directori</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editori</multiple>
    </term>
    <term name="editorial-director">
      <single>coordonator</single>
      <multiple>coordonatori</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrator</single>
      <multiple>ilustratori</multiple>
    </term>
    <term name="translator">
      <single>traduc\u0103tor</single>
      <multiple>traduc\u0103tori</multiple>
    </term>
    <term name="editortranslator">
      <single>editor \u0219i traduc\u0103tor</single>
      <multiple>editori \u0219i traduc\u0103tori</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dir.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>coord.</single>
      <multiple>coord.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ilustr.</single>
      <multiple>ilustr.</multiple>
    </term>
    <term name="translator" form="short">
      <single>trad.</single>
      <multiple>trad.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. \u0219i trad.</single>
      <multiple>ed. \u0219i trad.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">de</term>
    <term name="director" form="verb">coordonat de</term>
    <term name="editor" form="verb">edi\u021Bie de</term>
    <term name="editorial-director" form="verb">coordonator</term>
    <term name="illustrator" form="verb">ilustra\u021Bii de</term>
    <term name="interviewer" form="verb">interviu de</term>
    <term name="recipient" form="verb">\xEEn</term>
    <term name="reviewed-author" form="verb">de</term>
    <term name="translator" form="verb">traducere de</term>
    <term name="editortranslator" form="verb">edi\u021Bie \u0219i traducere de</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">coord.</term>
    <term name="illustrator" form="verb-short">ilustr.</term>
    <term name="translator" form="verb-short">trad.</term>
    <term name="editortranslator" form="verb-short">ed. \u0219i trad. de</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">ianuarie</term>
    <term name="month-02">februarie</term>
    <term name="month-03">martie</term>
    <term name="month-04">aprilie</term>
    <term name="month-05">mai</term>
    <term name="month-06">iunie</term>
    <term name="month-07">iulie</term>
    <term name="month-08">august</term>
    <term name="month-09">septembrie</term>
    <term name="month-10">octombrie</term>
    <term name="month-11">noiembrie</term>
    <term name="month-12">decembrie</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">ian.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">mai</term>
    <term name="month-06" form="short">iun.</term>
    <term name="month-07" form="short">iul.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">oct.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">prim\u0103vara</term>
    <term name="season-02">vara</term>
    <term name="season-03">toamna</term>
    <term name="season-04">iarna</term>
  </terms>
</locale>
`,"ru-RU":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="ru-RU">
  <info>
    <translator>
      <name>Alexei Kouprianov</name>
      <email>alexei.kouprianov@gmail.com</email>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year" suffix=" \u0433."/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u043F\u0440\u043E\u0441\u043C\u043E\u0442\u0440\u0435\u043D\u043E</term>
    <term name="and">\u0438</term>
    <term name="and others">\u0438 \u0434\u0440.</term>
    <term name="anonymous">\u0430\u043D\u043E\u043D\u0438\u043C</term>
    <term name="anonymous" form="short">\u0430\u043D\u043E\u043D.</term>
    <term name="at">\u043D\u0430</term>
    <term name="available at">\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u043E \u043D\u0430</term>
    <term name="by"></term>
    <term name="circa">\u043E\u043A\u043E\u043B\u043E</term>
    <term name="circa" form="short">\u043E\u043A.</term>
    <term name="cited">\u0446\u0438\u0442\u0438\u0440\u0443\u0435\u0442\u0441\u044F \u043F\u043E</term>
    <term name="cited" form="short">\u0446\u0438\u0442. \u043F\u043E</term>
    <term name="edition"> <!-- gender="neuter" -->
      <single>\u0438\u0437\u0434\u0430\u043D\u0438\u0435</single>
      <multiple>\u0438\u0437\u0434\u0430\u043D\u0438\u044F</multiple>
    </term>
    <term name="edition" form="short">\u0438\u0437\u0434.</term>
    <term name="et-al">\u0438 \u0434\u0440.</term>
    <term name="forthcoming">\u043E\u0436\u0438\u0434\u0430\u0435\u0442\u0441\u044F</term>
    <term name="from">\u043E\u0442</term>
    <term name="ibid">\u0442\u0430\u043C \u0436\u0435</term>
    <term name="in">\u0432</term>
    <term name="in press">\u0432 \u043F\u0435\u0447\u0430\u0442\u0438</term>
    <term name="internet">\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442</term>
    <term name="interview">\u0438\u043D\u0442\u0435\u0440\u0432\u044C\u044E</term>
    <term name="letter">\u043F\u0438\u0441\u044C\u043C\u043E</term>
    <term name="no date">\u0431\u0435\u0437 \u0434\u0430\u0442\u044B</term>
    <term name="no date" form="short">\u0431. \u0434.</term>
    <term name="online">\u043E\u043D\u043B\u0430\u0439\u043D</term>
    <term name="presented at">\u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u043E \u043D\u0430</term>
    <!-- \u0421\u043B\u043E\u0436\u043D\u043E \u043F\u043E\u0434\u043E\u0431\u0440\u0430\u0442\u044C \u043E\u0434\u0438\u043D \u043F\u0435\u0440\u0435\u0432\u043E\u0434 \u0434\u043B\u044F \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u0433\u043E \u0442\u0435\u0440\u043C\u0438\u043D\u0430. \u0412 \u0437\u0430\u0432\u0438\u0441\u0438\u043C\u043E\u0441\u0442\u0438 \u043E\u0442 \u043A\u043E\u043D\u0442\u0435\u043A\u0441\u0442\u0430 \u044D\u0442\u043E \u043C\u043E\u0436\u0435\u0442 \u0431\u044B\u0442\u044C "\u0440\u0430\u0431\u043E\u0442\u0430" \u0438\u043B\u0438 "\u0438\u0441\u0442\u043E\u0447\u043D\u0438\u043A" \u0438\u043B\u0438 \u0432\u043E\u043E\u0431\u0449\u0435 \u043E\u043F\u0443\u0441\u043A\u0430\u0442\u044C\u0441\u044F -->
    <term name="reference">
      <single>\u0441\u0441\u044B\u043B\u043A\u0430</single>
      <multiple>\u0441\u0441\u044B\u043B\u043A\u0438</multiple>
    </term>
    <!-- \u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u0438\u044F \u0434\u043B\u044F "\u0441\u0441\u044B\u043B\u043A\u0430" \u043D\u0435 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u044E\u0442\u0441\u044F, \u043D\u043E \u0434\u043B\u044F \u043D\u0435\u043A\u043E\u0442\u043E\u0440\u044B\u0445 \u0441\u043B\u0443\u0447\u0430\u0435\u0432 \u043C\u043E\u0436\u0435\u0442 \u043F\u043E\u0434\u043E\u0439\u0442\u0438 "\u0438\u0441\u0442." -->
    <term name="reference" form="short">
      <single>\u0441\u0441\u044B\u043B\u043A\u0430</single>
      <multiple>\u0441\u0441\u044B\u043B\u043A\u0438</multiple>
    </term>
    <term name="retrieved">\u0438\u0437\u0432\u043B\u0435\u0447\u0435\u043D\u043E</term>
    <term name="scale">\u043C\u0430\u0441\u0448\u0442\u0430\u0431</term>
    <term name="version">\u0432\u0435\u0440\u0441\u0438\u044F</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u043D. \u044D.</term>
    <term name="bc">\u0434\u043E \u043D. \u044D.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u201E</term>
    <term name="close-inner-quote">\u201C</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">-\u0435</term>
    <term name="ordinal" gender-form="masculine">-\u0439</term>
    <term name="ordinal" gender-form="feminine">-\u044F</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u043F\u0435\u0440\u0432\u043E\u0435</term>
    <term name="long-ordinal-02">\u0432\u0442\u043E\u0440\u043E\u0435</term>
    <term name="long-ordinal-03">\u0442\u0440\u0435\u0442\u044C\u0435</term>
    <term name="long-ordinal-04">\u0447\u0435\u0442\u0432\u0435\u0440\u0442\u043E\u0435</term>
    <term name="long-ordinal-05">\u043F\u044F\u0442\u043E\u0435</term>
    <term name="long-ordinal-06">\u0448\u0435\u0441\u0442\u043E\u0435</term>
    <term name="long-ordinal-07">\u0441\u0435\u0434\u044C\u043C\u043E\u0435</term>
    <term name="long-ordinal-08">\u0432\u043E\u0441\u044C\u043C\u043E\u0435</term>
    <term name="long-ordinal-09">\u0434\u0435\u0432\u044F\u0442\u043E\u0435</term>
    <term name="long-ordinal-10">\u0434\u0435\u0441\u044F\u0442\u043E\u0435</term>
    <term name="long-ordinal-01" gender-form="masculine">\u043F\u0435\u0440\u0432\u044B\u0439</term>
    <term name="long-ordinal-02" gender-form="masculine">\u0432\u0442\u043E\u0440\u043E\u0439</term>
    <term name="long-ordinal-03" gender-form="masculine">\u0442\u0440\u0435\u0442\u0438\u0439</term>
    <term name="long-ordinal-04" gender-form="masculine">\u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044B\u0439</term>
    <term name="long-ordinal-05" gender-form="masculine">\u043F\u044F\u0442\u044B\u0439</term>
    <term name="long-ordinal-06" gender-form="masculine">\u0448\u0435\u0441\u0442\u043E\u0439</term>
    <term name="long-ordinal-07" gender-form="masculine">\u0441\u0435\u0434\u044C\u043C\u043E\u0439</term>
    <term name="long-ordinal-08" gender-form="masculine">\u0432\u043E\u0441\u044C\u043C\u043E\u0439</term>
    <term name="long-ordinal-09" gender-form="masculine">\u0434\u0435\u0432\u044F\u0442\u044B\u0439</term>
    <term name="long-ordinal-10" gender-form="masculine">\u0434\u0435\u0441\u044F\u0442\u044B\u0439</term>
    <term name="long-ordinal-01" gender-form="feminine">\u043F\u0435\u0440\u0432\u0430\u044F</term>
    <term name="long-ordinal-02" gender-form="feminine">\u0432\u0442\u043E\u0440\u0430\u044F</term>
    <term name="long-ordinal-03" gender-form="feminine">\u0442\u0440\u0435\u0442\u044C\u044F</term>
    <term name="long-ordinal-04" gender-form="feminine">\u0447\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044F</term>
    <term name="long-ordinal-05" gender-form="feminine">\u043F\u044F\u0442\u0430\u044F</term>
    <term name="long-ordinal-06" gender-form="feminine">\u0448\u0435\u0441\u0442\u0430\u044F</term>
    <term name="long-ordinal-07" gender-form="feminine">\u0441\u0435\u0434\u044C\u043C\u0430\u044F</term>
    <term name="long-ordinal-08" gender-form="feminine">\u0432\u043E\u0441\u044C\u043C\u0430\u044F</term>
    <term name="long-ordinal-09" gender-form="feminine">\u0434\u0435\u0432\u044F\u0442\u0430\u044F</term>
    <term name="long-ordinal-10" gender-form="feminine">\u0434\u0435\u0441\u044F\u0442\u0430\u044F</term>
    <!-- LONG LOCATOR FORMS -->
    <!-- Currently only a few of locator terms are gender-assignable -->
    <term name="book">
      <single>\u043A\u043D\u0438\u0433\u0430</single>
      <multiple>\u043A\u043D\u0438\u0433\u0438</multiple>
    </term>
    <term name="chapter">
      <single>\u0433\u043B\u0430\u0432\u0430</single>
      <multiple>\u0433\u043B\u0430\u0432\u044B</multiple>
    </term>
    <term name="column">
      <single>\u0441\u0442\u043E\u043B\u0431\u0435\u0446</single>
      <multiple>\u0441\u0442\u043E\u043B\u0431\u0446\u044B</multiple>
    </term>
    <term name="figure">
      <single>\u0440\u0438\u0441\u0443\u043D\u043E\u043A</single>
      <multiple>\u0440\u0438\u0441\u0443\u043D\u043A\u0438</multiple>
    </term>
    <term name="folio">
      <single>\u043B\u0438\u0441\u0442</single>
      <multiple>\u043B\u0438\u0441\u0442\u044B</multiple>
    </term>
    <term name="issue" gender="masculine">
      <single>\u0432\u044B\u043F\u0443\u0441\u043A</single>
      <multiple>\u0432\u044B\u043F\u0443\u0441\u043A\u0438</multiple>
    </term>
    <term name="line">
      <single>\u0441\u0442\u0440\u043E\u043A\u0430</single>
      <multiple>\u0441\u0442\u0440\u043E\u043A\u0438</multiple>
    </term>
    <term name="note">
      <single>\u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u0435</single>
      <multiple>\u043F\u0440\u0438\u043C\u0435\u0447\u0430\u043D\u0438\u044F</multiple>
    </term>
    <term name="opus">
      <single>\u0441\u043E\u0447\u0438\u043D\u0435\u043D\u0438\u0435</single>
      <multiple>\u0441\u043E\u0447\u0438\u043D\u0435\u043D\u0438\u044F</multiple>
    </term>
    <term name="page">
      <single>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430</single>
      <multiple>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B</multiple>
    </term>
    <!-- \u0434\u043B\u044F \u043E\u0434\u043D\u043E\u043E\u0431\u0440\u0430\u0437\u043D\u043E\u0441\u0442\u0438 \u0437\u0434\u0435\u0441\u044C \u0442\u043E\u0436\u0435 \u0443\u043A\u0430\u0437\u0430\u043B\u0438 \u0440\u043E\u0434, \u043D\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u043D\u0438\u0435 \u043A\u043E\u043B-\u0432\u0430 \u0441\u0442\u0440\u0430\u043D\u0438\u0446 \u0441 \u043F\u043E\u0440\u044F\u0434\u043A\u043E\u0432\u044B\u043C \u0447\u0438\u0441\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u043C \u043C\u0430\u043B\u043E\u0432\u0435\u0440\u043E\u044F\u0442\u043D\u043E -->
    <term name="number-of-pages" gender="feminine">
      <single>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430</single>
      <multiple>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u044B</multiple>
    </term>
    <term name="paragraph">
      <single>\u043F\u0430\u0440\u0430\u0433\u0440\u0430\u0444</single>
      <multiple>\u043F\u0430\u0440\u0430\u0433\u0440\u0430\u0444\u044B</multiple>
    </term>
    <term name="part">
      <single>\u0447\u0430\u0441\u0442\u044C</single>
      <multiple>\u0447\u0430\u0441\u0442\u0438</multiple>
    </term>
    <term name="section">
      <single>\u0440\u0430\u0437\u0434\u0435\u043B</single>
      <multiple>\u0440\u0430\u0437\u0434\u0435\u043B\u044B</multiple>
    </term>
    <term name="sub verbo">\u0441\u043C\u043E\u0442\u0440\u0438</term>
    <term name="verse">
      <single>\u0441\u0442\u0438\u0445</single>
      <multiple>\u0441\u0442\u0438\u0445\u0438</multiple>
    </term>
    <term name="volume" gender="masculine">
      <single>\u0442\u043E\u043C</single>
      <multiple>\u0442\u043E\u043C\u0430</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <!-- \u041D\u0438\u0436\u0435 \u0434\u043B\u044F \u0432\u0441\u0435\u0445 \u043E\u0434\u043D\u043E\u0431\u0443\u043A\u0432\u0435\u043D\u043D\u044B\u0445 \u0441\u043E\u043A\u0440\u0430\u0449\u0435\u043D\u0438\u0439 \u043F\u0440\u0438\u0432\u0435\u0434\u0435\u043D\u044B \u0434\u0432\u0443\u0445\u0431\u0443\u043A\u0432\u0435\u043D\u043D\u044B\u0435 \u0432\u0430\u0440\u0438\u0430\u043D\u0442\u044B \u043C\u043D\u043E\u0436\u0435\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0433\u043E \u0447\u0438\u0441\u043B\u0430. \u0415\u0441\u043B\u0438 \u043F\u043E\u0441\u043B\u0435\u0434\u043D\u0438\u0435 \u043D\u0435\u0436\u0435\u043B\u0430\u0442\u0435\u043B\u044C\u043D\u044B (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, \u043F\u043E \u0413\u041E\u0421\u0422\u0443 \u0434\u043B\u044F \u0431\u0438\u0431\u043B\u0438\u043E\u0433\u0440\u0430\u0444\u0438\u0438 "\u0421. 23-35") \u0442\u043E \u044D\u0442\u043E \u0434\u043E\u043B\u0436\u043D\u043E \u043E\u043F\u0440\u0435\u0434\u0435\u043B\u044F\u0442\u044C\u0441\u044F \u0432 \u0441\u0430\u043C\u043E\u043C \u0441\u0442\u0438\u043B\u0435 (plural="never") -->
    <term name="book" form="short">\u043A\u043D.</term>
    <term name="chapter" form="short">\u0433\u043B.</term>
    <term name="column" form="short">\u0441\u0442\u0431.</term>
    <term name="figure" form="short">\u0440\u0438\u0441.</term>
    <term name="folio" form="short">
      <single>\u043B.</single>
      <multiple>\u043B\u043B.</multiple>
    </term>
    <term name="issue" form="short">\u0432\u044B\u043F.</term>
    <term name="line" form="short">\u0441\u0442\u0440.</term>
    <term name="note" form="short">\u043F\u0440\u0438\u043C.</term>
    <term name="opus" form="short">\u0441\u043E\u0447.</term>
    <term name="page" form="short">
      <single>\u0441.</single>
      <multiple>\u0441\u0441.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>\u0441.</single>
      <multiple>\u0441\u0441.</multiple>
    </term>
    <term name="paragraph" form="short">
      <single>\u043F.</single>
      <multiple>\u043F\u043F.</multiple>
    </term>
    <term name="part" form="short">
      <single>\u0447.</single>
      <multiple>\u0447\u0447.</multiple>
    </term>
    <term name="section" form="short">\u0440\u0430\u0437\u0434.</term>
    <term name="sub verbo" form="short">\u0441\u043C.</term>
    <term name="verse" form="short">\u0441\u0442.</term>
    <term name="volume" form="short">
      <single>\u0442.</single>
      <multiple>\u0442\u0442.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>\u0440\u0435\u0436\u0438\u0441\u0441\u0435\u0440</single>
      <multiple>\u0440\u0435\u0436\u0438\u0441\u0441\u0435\u0440\u044B</multiple>
    </term>
    <term name="editor">
      <single>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440</single>
      <multiple>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u044B</multiple>
    </term>
    <term name="editorial-director">
      <single>\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0439 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440</single>
      <multiple>\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u0435 \u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u044B</multiple>
    </term>
    <term name="illustrator">
      <single>\u0438\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0442\u043E\u0440</single>
      <multiple>\u0438\u043B\u043B\u044E\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u044B</multiple>
    </term>
    <term name="translator">
      <single>\u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0447\u0438\u043A</single>
      <multiple>\u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0447\u0438\u043A\u0438</multiple>
    </term>
    <term name="editortranslator">
      <single>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440 \u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0447\u0438\u043A</single>
      <multiple>\u0440\u0435\u0434\u0430\u043A\u0442\u043E\u0440\u044B \u0438 \u043F\u0435\u0440\u0435\u0432\u043E\u0434\u0447\u0438\u043A\u0438</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">\u0440\u0435\u0436.</term>
    <term name="editor" form="short">\u0440\u0435\u0434.</term>
    <term name="editorial-director" form="short">\u043E\u0442\u0432. \u0440\u0435\u0434.</term>
    <term name="illustrator" form="short">\u0438\u043B.</term>
    <term name="translator" form="short">\u043F\u0435\u0440.</term>
    <term name="editortranslator" form="short">\u0440\u0435\u0434. \u0438 \u043F\u0435\u0440.</term>

    <!-- VERB ROLE FORMS -->
    <!-- \u0412 \u044D\u0442\u043E\u043C \u0438 \u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0435\u043C \u0440\u0430\u0437\u0434\u0435\u043B\u0435 \u043F\u0440\u0438\u0432\u0435\u0434\u0435\u043D\u044B \u043D\u0430\u0438\u0431\u043E\u043B\u0435\u0435 \u0448\u0438\u0440\u043E\u043A\u043E \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0435\u043C\u044B\u0435 \u0442\u0435\u0440\u043C\u0438\u043D\u044B (\u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440, "\u043F\u043E\u0434 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0435\u0439" \u0432\u043C\u0435\u0441\u0442\u043E "\u043E\u0442\u0440\u0435\u0434\u0430\u043A\u0442\u0438\u0440\u043E\u0432\u0430\u043D\u043E"). \u0415\u0434\u0438\u043D\u0441\u0442\u0432\u0435\u043D\u043D\u044B\u043C \u043D\u0435\u0434\u043E\u0441\u0442\u0430\u0442\u043A\u043E\u043C \u044F\u0432\u043B\u044F\u0435\u0442\u0441\u044F \u0442\u043E, \u0447\u0442\u043E \u0440\u0430\u0437\u043D\u044B\u0435 \u0442\u0435\u0440\u043C\u0438\u043D\u044B \u0442\u0440\u0435\u0431\u0443\u0435\u0442 \u0440\u0430\u0437\u043D\u043E\u0433\u043E \u043F\u0430\u0434\u0435\u0436\u0430 \u0434\u043B\u044F \u043F\u043E\u0441\u043B\u0435\u0434\u0443\u044E\u0449\u0438\u0445 \u0444\u0430\u043C\u0438\u043B\u0438\u0439 -->
    <term name="container-author" form="verb"></term>
    <term name="director" form="verb">\u0440\u0435\u0436\u0438\u0441\u0441\u0438\u0440\u043E\u0432\u0430\u043D\u043E</term>
    <term name="editor" form="verb">\u043F\u043E\u0434 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0435\u0439</term>
    <term name="editorial-director" form="verb">\u043F\u043E\u0434 \u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u0435\u043D\u043D\u043E\u0439 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0435\u0439</term>
    <term name="illustrator" form="verb">\u0438\u043B\u043B\u044E\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u043D\u043E</term>
    <term name="interviewer" form="verb">\u0438\u043D\u0442\u0435\u0440\u0432\u044C\u044E \u043F\u0440\u043E\u0432\u0435\u0434\u0435\u043D\u043E</term>
    <term name="recipient" form="verb">\u043A</term>
    <term name="reviewed-author" form="verb"></term>
    <term name="translator" form="verb">\u043F\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043D\u043E</term>
    <term name="editortranslator" form="verb">\u043F\u043E\u0434 \u0440\u0435\u0434\u0430\u043A\u0446\u0438\u0435\u0439 \u0438 \u043F\u0435\u0440\u0435\u0432\u0435\u0434\u0435\u043D\u043E</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">\u0440\u0435\u0436.</term>
    <term name="editor" form="verb-short">\u043F\u043E\u0434 \u0440\u0435\u0434.</term>
    <term name="editorial-director" form="verb-short">\u043F\u043E\u0434 \u043E\u0442\u0432. \u0440\u0435\u0434.</term>
    <term name="illustrator" form="verb-short">\u0438\u043B.</term>
    <term name="translator" form="verb-short">\u043F\u0435\u0440.</term>
    <term name="editortranslator" form="verb-short">\u043F\u043E\u0434 \u0440\u0435\u0434. \u0438 \u043F\u0435\u0440.</term>

    <!-- LONG MONTH FORMS -->
    <!-- \u0440\u043E\u0434 \u043C\u0435\u0441\u044F\u0446\u0435\u0432 \u043D\u0435 \u0443\u043A\u0430\u0437\u044B\u0432\u0430\u0435\u043C, \u043F\u043E\u0441\u043A\u043E\u043B\u044C\u043A\u0443 \u0434\u0430\u0436\u0435 \u0435\u0441\u043B\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u044C \u043F\u043E\u0440\u044F\u0434\u043A\u043E\u0432\u044B\u0435 \u0447\u0438\u0441\u043B\u0438\u0442\u0435\u043B\u044C\u043D\u044B\u0435 \u0432 \u0434\u0430\u0442\u0435, \u0442\u043E \u043E\u043D\u0438 \u0434\u043E\u043B\u0436\u043D\u044B \u0441\u043E\u043E\u0442\u0432\u0435\u0442\u0441\u0442\u0432\u043E\u0432\u0430\u0442\u044C \u0441\u0440\u0435\u0434\u043D\u0435\u043C\u0443 \u0440\u043E\u0434\u0443, \u043D\u0430\u043F\u0440\u0438\u043C\u0435\u0440 "\u0432\u0442\u043E\u0440\u043E\u0435 \u0444\u0435\u0432\u0440\u0430\u043B\u044F" -->
    <term name="month-01">\u044F\u043D\u0432\u0430\u0440\u044C</term>
    <term name="month-02">\u0444\u0435\u0432\u0440\u0430\u043B\u044C</term>
    <term name="month-03">\u043C\u0430\u0440\u0442</term>
    <term name="month-04">\u0430\u043F\u0440\u0435\u043B\u044C</term>
    <term name="month-05">\u043C\u0430\u0439</term>
    <term name="month-06">\u0438\u044E\u043D\u044C</term>
    <term name="month-07">\u0438\u044E\u043B\u044C</term>
    <term name="month-08">\u0430\u0432\u0433\u0443\u0441\u0442</term>
    <term name="month-09">\u0441\u0435\u043D\u0442\u044F\u0431\u0440\u044C</term>
    <term name="month-10">\u043E\u043A\u0442\u044F\u0431\u0440\u044C</term>
    <term name="month-11">\u043D\u043E\u044F\u0431\u0440\u044C</term>
    <term name="month-12">\u0434\u0435\u043A\u0430\u0431\u0440\u044C</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">\u044F\u043D\u0432.</term>
    <term name="month-02" form="short">\u0444\u0435\u0432.</term>
    <term name="month-03" form="short">\u043C\u0430\u0440.</term>
    <term name="month-04" form="short">\u0430\u043F\u0440.</term>
    <term name="month-05" form="short">\u043C\u0430\u0439</term>
    <term name="month-06" form="short">\u0438\u044E\u043D.</term>
    <term name="month-07" form="short">\u0438\u044E\u043B.</term>
    <term name="month-08" form="short">\u0430\u0432\u0433.</term>
    <term name="month-09" form="short">\u0441\u0435\u043D.</term>
    <term name="month-10" form="short">\u043E\u043A\u0442.</term>
    <term name="month-11" form="short">\u043D\u043E\u044F.</term>
    <term name="month-12" form="short">\u0434\u0435\u043A.</term>

    <!-- SEASONS -->
    <term name="season-01">\u0432\u0435\u0441\u043D\u0430</term>
    <term name="season-02">\u043B\u0435\u0442\u043E</term>
    <term name="season-03">\u043E\u0441\u0435\u043D\u044C</term>
    <term name="season-04">\u0437\u0438\u043C\u0430</term>
  </terms>
</locale>
`,"sk-SK":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="sk-SK">
  <info>
    <translator>
      <name>Tom\xE1\u0161 Ferianc</name>
    </translator>
    <translator>
      <name>kohafan</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2014-03-09T22:23:31+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=". "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" suffix="."/>
    <date-part name="month" form="numeric" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">cit</term>
    <term name="and">a</term>
    <term name="and others">a \u010Fal\u0161\xED</term>
    <term name="anonymous">anonym</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">v</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">cca.</term>
    <term name="cited">cit</term>
    <term name="edition">
      <single>vydanie</single>
      <multiple>vydania</multiple>
    </term>
    <term name="edition" form="short">vyd.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">nadch\xE1dzaj\xFAci</term>
    <term name="from">z</term>
    <term name="ibid">ibid.</term>
    <term name="in">v</term>
    <term name="in press">v tla\u010Di</term>
    <term name="internet">internet</term>
    <term name="interview">osobn\xE1 komunik\xE1cia</term>
    <term name="letter">list</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">n.d.</term>
    <term name="online">online</term>
    <term name="presented at">prezentovan\xE9 na</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">cit</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">po Kr.</term>
    <term name="bc">pred Kr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">first</term>
    <term name="long-ordinal-02">second</term>
    <term name="long-ordinal-03">third</term>
    <term name="long-ordinal-04">fourth</term>
    <term name="long-ordinal-05">fifth</term>
    <term name="long-ordinal-06">sixth</term>
    <term name="long-ordinal-07">seventh</term>
    <term name="long-ordinal-08">eighth</term>
    <term name="long-ordinal-09">ninth</term>
    <term name="long-ordinal-10">tenth</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>kniha</single>
      <multiple>knihy</multiple>
    </term>
    <term name="chapter">
      <single>kapitola</single>
      <multiple>kapitoly</multiple>
    </term>
    <term name="column">
      <single>st\u013Apec</single>
      <multiple>st\u013Apce</multiple>
    </term>
    <term name="figure">
      <single>obr\xE1zok</single>
      <multiple>obr\xE1zky</multiple>
    </term>
    <term name="folio">
      <single>list</single>
      <multiple>listy</multiple>
    </term>
    <term name="issue">
      <single>\u010D\xEDslo</single>
      <multiple>\u010D\xEDsla</multiple>
    </term>
    <term name="line">
      <single>riadok</single>
      <multiple>riadky</multiple>
    </term>
    <term name="note">
      <single>pozn\xE1mka</single>
      <multiple>pozn\xE1mky</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>strana</single>
      <multiple>strany</multiple>
    </term>
    <term name="number-of-pages">
      <single>strana</single>
      <multiple>strany</multiple>
    </term>
    <term name="paragraph">
      <single>odstavec</single>
      <multiple>odstavce</multiple>
    </term>
    <term name="part">
      <single>\u010Das\u0165</single>
      <multiple>\u010Dasti</multiple>
    </term>
    <term name="section">
      <single>sekcia</single>
      <multiple>sekcie</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>ver\u0161</single>
      <multiple>ver\u0161e</multiple>
    </term>
    <term name="volume">
      <single>ro\u010Dn\xEDk</single>
      <multiple>ro\u010Dn\xEDky</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">k.</term>
    <term name="chapter" form="short">kap.</term>
    <term name="column" form="short">st\u013Ap.</term>
    <term name="figure" form="short">obr.</term>
    <term name="folio" form="short">l.</term>
    <term name="issue" form="short">\u010D.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">\u010D.</term>
    <term name="section" form="short">sek.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>ro\u010D.</single>
      <multiple>ro\u010D.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>editor</single>
      <multiple>editori</multiple>
    </term>
    <term name="editorial-director">
      <single>zostavovate\u013E</single>
      <multiple>zostavovatelia</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>prekladate\u013E</single>
      <multiple>prekladatelia</multiple>
    </term>
    <term name="editortranslator">
      <single>zostavovate\u013E &amp; prekladate\u013E</single>
      <multiple>zostavovatelia &amp; prekladatelia</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>zost.</single>
      <multiple>zost.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>prel.</single>
      <multiple>prel.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">zostavil</term>
    <term name="editorial-director" form="verb">zostavil</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">rozhovor urobil</term>
    <term name="recipient" form="verb">adres\xE1t</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">prelo\u017Eil</term>
    <term name="editortranslator" form="verb">zostavil &amp; prelo\u017Eil</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">prel.</term>
    <term name="editortranslator" form="verb-short">zost. &amp; prel.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">janu\xE1r</term>
    <term name="month-02">febru\xE1r</term>
    <term name="month-03">marec</term>
    <term name="month-04">apr\xEDl</term>
    <term name="month-05">m\xE1j</term>
    <term name="month-06">j\xFAn</term>
    <term name="month-07">j\xFAl</term>
    <term name="month-08">august</term>
    <term name="month-09">september</term>
    <term name="month-10">okt\xF3ber</term>
    <term name="month-11">november</term>
    <term name="month-12">december</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">m\xE1j.</term>
    <term name="month-06" form="short">j\xFAn.</term>
    <term name="month-07" form="short">j\xFAl.</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">Jar</term>
    <term name="season-02">Leto</term>
    <term name="season-03">Jese\u0148</term>
    <term name="season-04">Zima</term>
  </terms>
</locale>
`,"sl-SI":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="sl-SI">
  <info>
    <translator>
      <name>Kristof Ostir</name>
    </translator>
    <translator>
      <name>ratek1</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2014-11-06T09:41:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric" suffix=". "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year" suffix="."/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric" suffix=". "/>
    <date-part name="month" form="numeric" suffix=". "/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">pridobljeno</term>
    <term name="and">in</term>
    <term name="and others">in drugi</term>
    <term name="anonymous">anonimni</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">pri</term>
    <term name="available at">dostopno na</term>
    <term name="by"></term>
    <term name="circa">pribli\u017Eno</term>
    <term name="circa" form="short">prib.</term>
    <term name="cited">citirano</term>
    <term name="edition">
      <single>izdaja</single>
      <multiple>izdaje</multiple>
    </term>
    <term name="edition" form="short">izd.</term>
    <term name="et-al">in sod.</term>
    <term name="forthcoming">pred izidom</term>
    <term name="from">od</term>
    <term name="ibid">isto</term>
    <term name="in">v</term>
    <term name="in press">v tisku</term>
    <term name="internet">internet</term>
    <term name="interview">intervju</term>
    <term name="letter">pismo</term>
    <term name="no date">brez datuma</term>
    <term name="no date" form="short">b. d.</term>
    <term name="online">na spletu</term>
    <term name="presented at">predstavljeno na</term>
    <term name="reference">
      <single>referenca</single>
      <multiple>reference</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">pridobljeno</term>
    <term name="scale">merilo</term>
    <term name="version">razli\u010Dica</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">n. \u0161t.</term>
    <term name="bc">pr. n. \u0161t.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u201A</term>
    <term name="close-inner-quote">\u2018</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">prva</term>
    <term name="long-ordinal-02">druga</term>
    <term name="long-ordinal-03">tretja</term>
    <term name="long-ordinal-04">\u010Detrta</term>
    <term name="long-ordinal-05">peta</term>
    <term name="long-ordinal-06">\u0161esta</term>
    <term name="long-ordinal-07">sedma</term>
    <term name="long-ordinal-08">osma</term>
    <term name="long-ordinal-09">deveta</term>
    <term name="long-ordinal-10">deseta</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>knjiga</single>
      <multiple>knjige</multiple>
    </term>
    <term name="chapter">
      <single>poglavje</single>
      <multiple>poglavja</multiple>
    </term>
    <term name="column">
      <single>stolpec</single>
      <multiple>stolpci</multiple>
    </term>
    <term name="figure">
      <single>slika</single>
      <multiple>slike</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folii</multiple>
    </term>
    <term name="issue">
      <single>\u0161tevilka</single>
      <multiple>\u0161tevilke</multiple>
    </term>
    <term name="line">
      <single>vrstica</single>
      <multiple>vrstice</multiple>
    </term>
    <term name="note">
      <single>opomba</single>
      <multiple>opombe</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opusi</multiple>
    </term>
    <term name="page">
      <single>stran</single>
      <multiple>strani</multiple>
    </term>
    <term name="number-of-pages">
      <single>stran</single>
      <multiple>strani</multiple>
    </term>
    <term name="paragraph">
      <single>odstavek</single>
      <multiple>odstavki</multiple>
    </term>
    <term name="part">
      <single>del</single>
      <multiple>deli</multiple>
    </term>
    <term name="section">
      <single>odsek</single>
      <multiple>odseki</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verz</single>
      <multiple>verzi</multiple>
    </term>
    <term name="volume">
      <single>letnik</single>
      <multiple>letniki</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">knj.</term>
    <term name="chapter" form="short">pogl.</term>
    <term name="column" form="short">stolp.</term>
    <term name="figure" form="short">sl.</term>
    <term name="folio" form="short">fol.</term>
    <term name="issue" form="short">\u0161t.</term>
    <term name="line" form="short">vrst.</term>
    <term name="note" form="short">op.</term>
    <term name="opus" form="short">opus</term>
    <term name="page" form="short">
      <single>str.</single>
      <multiple>str.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>str.</single>
      <multiple>str.</multiple>
    </term>
    <term name="paragraph" form="short">odst.</term>
    <term name="part" form="short">del</term>
    <term name="section" form="short">ods.</term>
    <term name="sub verbo" form="short">
      <single>s. v.</single>
      <multiple>s. v.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>v.</multiple>
    </term>
    <term name="volume" form="short">
      <single>let.</single>
      <multiple>let.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>re\u017Eiser</single>
      <multiple>re\u017Eiserji</multiple>
    </term>
    <term name="editor">
      <single>urednik</single>
      <multiple>uredniki</multiple>
    </term>
    <term name="editorial-director">
      <single>glavni urednik</single>
      <multiple>glavni uredniki</multiple>
    </term>
    <term name="illustrator">
      <single>ilustrator</single>
      <multiple>ilustratorji</multiple>
    </term>
    <term name="translator">
      <single>prevajalec</single>
      <multiple>prevajalci</multiple>
    </term>
    <term name="editortranslator">
      <single>urednik &amp; prevajalec</single>
      <multiple>uredniki &amp; prevajalci</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>re\u017E.</single>
      <multiple>re\u017E.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ur.</single>
      <multiple>ur.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>gl. ur.</single>
      <multiple>gl. ur.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ilus.</single>
      <multiple>ilus.</multiple>
    </term>
    <term name="translator" form="short">
      <single>prev.</single>
      <multiple>prev.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ur. &amp; prev.</single>
      <multiple>ur. &amp; prev.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb"></term>
    <term name="director" form="verb">re\u017Eiral</term>
    <term name="editor" form="verb">uredil</term>
    <term name="editorial-director" form="verb">uredil</term>
    <term name="illustrator" form="verb">ilustriral</term>
    <term name="interviewer" form="verb">intervjuval</term>
    <term name="recipient" form="verb">za</term>
    <term name="reviewed-author" form="verb">od</term>
    <term name="translator" form="verb">prevedel</term>
    <term name="editortranslator" form="verb">uredil &amp; prevedel</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">re\u017E.</term>
    <term name="editor" form="verb-short">ured.</term>
    <term name="editorial-director" form="verb-short">ured.</term>
    <term name="illustrator" form="verb-short">ilus.</term>
    <term name="translator" form="verb-short">prev.</term>
    <term name="editortranslator" form="verb-short">ured. &amp; prev. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">januar</term>
    <term name="month-02">februar</term>
    <term name="month-03">marec</term>
    <term name="month-04">april</term>
    <term name="month-05">maj</term>
    <term name="month-06">junij</term>
    <term name="month-07">julij</term>
    <term name="month-08">avgust</term>
    <term name="month-09">september</term>
    <term name="month-10">oktober</term>
    <term name="month-11">november</term>
    <term name="month-12">december</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">maj</term>
    <term name="month-06" form="short">jun.</term>
    <term name="month-07" form="short">jul.</term>
    <term name="month-08" form="short">avg.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">pomlad</term>
    <term name="season-02">poletje</term>
    <term name="season-03">jesen</term>
    <term name="season-04">zima</term>
  </terms>
</locale>
`,"sr-RS":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="sr-RS">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=". "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year" suffix="."/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
  </date>
  <terms>
    <term name="accessed">\u043F\u0440\u0438\u0441\u0442\u0443\u043F\u0459\u0435\u043D\u043E</term>
    <term name="and">\u0438</term>
    <term name="and others">\u0438 \u043E\u0441\u0442\u0430\u043B\u0438</term>
    <term name="anonymous">\u0430\u043D\u043E\u043D\u0438\u043C\u043D\u0430</term>
    <term name="anonymous" form="short">\u0430\u043D\u043E\u043D.</term>
    <term name="at">\u043D\u0430</term>
    <term name="available at">available at</term>
    <term name="by">by</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">\u0446\u0438\u0442\u0438\u0440\u0430\u043D\u043E</term>
    <term name="edition">
      <single>\u0438\u0437\u0434\u0430\u045A\u0435</single>
      <multiple>\u0438\u0437\u0434\u0430\u045A\u0430</multiple>
    </term>
    <term name="edition" form="short">\u0438\u0437\u0434.</term>
    <term name="et-al">\u0438 \u043E\u0441\u0442\u0430\u043B\u0438</term>
    <term name="forthcoming">\u0434\u043E\u043B\u0430\u0437\u0435\u045B\u0438</term>
    <term name="from">\u043E\u0434</term>
    <term name="ibid">ibid.</term>
    <term name="in">\u0443</term>
    <term name="in press">\u0443 \u0448\u0442\u0430\u043C\u043F\u0438</term>
    <term name="internet">\u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442</term>
    <term name="interview">\u0438\u043D\u0442\u0435\u0440\u0432\u0458\u0443</term>
    <term name="letter">\u043F\u0438\u0441\u043C\u043E</term>
    <term name="no date">no date</term>
    <term name="no date" form="short">\u0431\u0435\u0437 \u0434\u0430\u0442\u0443\u043C\u0430</term>
    <term name="online">\u043D\u0430 \u0418\u043D\u0442\u0435\u0440\u043D\u0435\u0442\u0443</term>
    <term name="presented at">\u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u0459\u0435\u043D\u043E \u043D\u0430</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">\u043F\u0440\u0435\u0443\u0437\u0435\u0442\u043E</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201E</term>
    <term name="close-quote">\u201C</term>
    <term name="open-inner-quote">\u201A</term>
    <term name="close-inner-quote">\u2018</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">first</term>
    <term name="long-ordinal-02">second</term>
    <term name="long-ordinal-03">third</term>
    <term name="long-ordinal-04">fourth</term>
    <term name="long-ordinal-05">fifth</term>
    <term name="long-ordinal-06">sixth</term>
    <term name="long-ordinal-07">seventh</term>
    <term name="long-ordinal-08">eighth</term>
    <term name="long-ordinal-09">ninth</term>
    <term name="long-ordinal-10">tenth</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u043A\u045A\u0438\u0433\u0430</single>
      <multiple>\u043A\u045A\u0438\u0433\u0435</multiple>
    </term>
    <term name="chapter">
      <single>\u043F\u043E\u0433\u043B\u0430\u0432\u0459\u0435</single>
      <multiple>\u043F\u043E\u0433\u043B\u0430\u0432\u0459\u0430</multiple>
    </term>
    <term name="column">
      <single>\u043A\u043E\u043B\u043E\u043D\u0430</single>
      <multiple>\u043A\u043E\u043B\u043E\u043D\u0435</multiple>
    </term>
    <term name="figure">
      <single>\u0446\u0440\u0442\u0435\u0436</single>
      <multiple>\u0446\u0440\u0442\u0435\u0436\u0438</multiple>
    </term>
    <term name="folio">
      <single>\u0444\u043E\u043B\u0438\u043E</single>
      <multiple>\u0444\u043E\u043B\u0438\u0458\u0438</multiple>
    </term>
    <term name="issue">
      <single>\u0431\u0440\u043E\u0458</single>
      <multiple>\u0431\u0440\u043E\u0458\u0435\u0432\u0438</multiple>
    </term>
    <term name="line">
      <single>\u043B\u0438\u043D\u0438\u0458\u0430</single>
      <multiple>\u043B\u0438\u043D\u0438\u0458\u0435</multiple>
    </term>
    <term name="note">
      <single>\u0431\u0435\u043B\u0435\u0448\u043A\u0430</single>
      <multiple>\u0431\u0435\u043B\u0435\u0448\u043A\u0435</multiple>
    </term>
    <term name="opus">
      <single>\u043E\u043F\u0443\u0441</single>
      <multiple>\u043E\u043F\u0435\u0440\u0430</multiple>
    </term>
    <term name="page">
      <single>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430</single>
      <multiple>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0430</single>
      <multiple>\u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0435</multiple>
    </term>
    <term name="paragraph">
      <single>\u043F\u0430\u0440\u0430\u0433\u0440\u0430\u0444</single>
      <multiple>\u043F\u0430\u0440\u0430\u0433\u0440\u0430\u0444\u0438</multiple>
    </term>
    <term name="part">
      <single>\u0434\u0435\u043E</single>
      <multiple>\u0434\u0435\u043B\u043E\u0432\u0430</multiple>
    </term>
    <term name="section">
      <single>\u043E\u0434\u0435\u0459\u0430\u043A</single>
      <multiple>\u043E\u0434\u0435\u0459\u0430\u043A\u0430</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>\u0441\u0442\u0440\u043E\u0444\u0430</single>
      <multiple>\u0441\u0442\u0440\u043E\u0444\u0435</multiple>
    </term>
    <term name="volume">
      <single>\u0442\u043E\u043C</single>
      <multiple>\u0442\u043E\u043C\u043E\u0432\u0430</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u043A\u045A\u0438\u0433\u0430</term>
    <term name="chapter" form="short">\u041F\u043E\u0433.</term>
    <term name="column" form="short">\u043A\u043E\u043B.</term>
    <term name="figure" form="short">\u0446\u0440\u0442.</term>
    <term name="folio" form="short">\u0444\u043E\u043B\u0438\u043E</term>
    <term name="issue" form="short">\u0438\u0437\u0434.</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">\u043E\u043F.</term>
    <term name="page" form="short">
      <single>\u0441\u0442\u0440.</single>
      <multiple>\u0441\u0442\u0440.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>\u0441\u0442\u0440.</single>
      <multiple>\u0441\u0442\u0440.</multiple>
    </term>
    <term name="paragraph" form="short">\u043F\u0430\u0440.</term>
    <term name="part" form="short">\u0434\u0435\u043E</term>
    <term name="section" form="short">\u043E\u0434.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>\u0441\u0442\u0440.</single>
      <multiple>\u0441\u0442\u0440.</multiple>
    </term>
    <term name="volume" form="short">
      <single>\u0442\u043E\u043C</single>
      <multiple>\u0442\u043E\u043C\u043E\u0432\u0438</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>\u0443\u0440\u0435\u0434\u043D\u0438\u043A</single>
      <multiple>\u0443\u0440\u0435\u0434\u0438\u043D\u0438\u0446\u0438</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>\u043F\u0440\u0435\u0432\u043E\u0434\u0438\u043B\u0430\u0446</single>
      <multiple>\u043F\u0440\u0435\u0432\u043E\u0434\u0438\u043E\u0446\u0438</multiple>
    </term>
    <term name="editortranslator">
      <single>editor &amp; translator</single>
      <multiple>editors &amp; translators</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\u0443\u0440.</single>
      <multiple>\u0443\u0440.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\u043F\u0440\u0435\u0432.</single>
      <multiple>\u043F\u0440\u0435\u0432.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; tran.</single>
      <multiple>eds. &amp; trans.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">\u0443\u0440\u0435\u0434\u0438\u043E</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">\u0438\u043D\u0442\u0435\u0440\u0432\u0458\u0443\u0438\u0441\u0430\u043E</term>
    <term name="recipient" form="verb">\u043F\u0440\u0438\u043C\u0430</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">\u043F\u0440\u0435\u0432\u0435\u043E</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">\u0443\u0440.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">\u043F\u0440\u0435\u0432.</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u0408\u0430\u043D\u0443\u0430\u0440</term>
    <term name="month-02">\u0424\u0435\u0431\u0440\u0443\u0430\u0440</term>
    <term name="month-03">\u041C\u0430\u0440\u0442</term>
    <term name="month-04">\u0410\u043F\u0440\u0438\u043B</term>
    <term name="month-05">\u041C\u0430\u0458</term>
    <term name="month-06">\u0408\u0443\u043D\u0438</term>
    <term name="month-07">\u0408\u0443\u043B\u0438</term>
    <term name="month-08">\u0410\u0432\u0433\u0443\u0441\u0442</term>
    <term name="month-09">\u0421\u0435\u043F\u0442\u0435\u043C\u0431\u0430\u0440</term>
    <term name="month-10">\u041E\u043A\u0442\u043E\u0431\u0430\u0440</term>
    <term name="month-11">\u041D\u043E\u0432\u0435\u043C\u0431\u0430\u0440</term>
    <term name="month-12">\u0414\u0435\u0446\u0435\u043C\u0431\u0430\u0440</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">\u0408\u0430\u043D.</term>
    <term name="month-02" form="short">\u0424\u0435\u0431.</term>
    <term name="month-03" form="short">\u041C\u0430\u0440\u0442</term>
    <term name="month-04" form="short">\u0410\u043F\u0440.</term>
    <term name="month-05" form="short">\u041C\u0430\u0458</term>
    <term name="month-06" form="short">\u0408\u0443\u043D\u0438</term>
    <term name="month-07" form="short">\u0408\u0443\u043B\u0438</term>
    <term name="month-08" form="short">\u0410\u0432\u0433.</term>
    <term name="month-09" form="short">\u0421\u0435\u043F.</term>
    <term name="month-10" form="short">\u041E\u043A\u0442.</term>
    <term name="month-11" form="short">\u041D\u043E\u0432.</term>
    <term name="month-12" form="short">\u0414\u0435\u0446.</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"sv-SE":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="sv-SE">
  <info>
    <translator>
      <name>torfeur</name>
    </translator>
    <translator>
      <name>Sylvester Keil</name>
    </translator>
    <translator>
      <name>Sebastian Karcher</name>
    </translator>
    <translator>
      <name>Ulf Harnhammar</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="-" range-delimiter="/"/>
  </date>
  <terms>
    <term name="accessed">\xE5tkomstdatum</term>
    <term name="and">och</term>
    <term name="and others">och andra</term>
    <term name="anonymous">anonym</term>
    <term name="anonymous" form="short">anon.</term>
    <term name="at">vid</term>
    <term name="available at">tillg\xE4nglig vid</term>
    <term name="by">av</term>
    <term name="circa">cirka</term>
    <term name="circa" form="short">ca</term>
    <term name="cited">citerad</term>
    <term name="edition">
      <single>upplaga</single>
      <multiple>upplagor</multiple>
    </term>
    <term name="edition" form="short">uppl.</term>
    <term name="et-al">m.fl.</term>
    <term name="forthcoming">kommande</term>
    <term name="from">fr\xE5n</term>
    <term name="ibid">ibid.</term>
    <term name="in">i</term>
    <term name="in press">i tryck</term>
    <term name="internet">internet</term>
    <term name="interview">intervju</term>
    <term name="letter">brev</term>
    <term name="no date">utan \xE5rtal</term>
    <term name="no date" form="short">u.\xE5.</term>
    <term name="online">online</term>
    <term name="presented at">presenterad vid</term>
    <term name="reference">
      <single>referens</single>
      <multiple>referenser</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>ref.</multiple>
    </term>
    <term name="retrieved">h\xE4mtad</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">e.Kr.</term>
    <term name="bc">f.Kr.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201D</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2019</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">:e</term>
    <term name="ordinal-01">:a</term>
    <term name="ordinal-02">:a</term>
    <term name="ordinal-11">:e</term>
    <term name="ordinal-12">:e</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">f\xF6rsta</term>
    <term name="long-ordinal-02">andra</term>
    <term name="long-ordinal-03">tredje</term>
    <term name="long-ordinal-04">fj\xE4rde</term>
    <term name="long-ordinal-05">femte</term>
    <term name="long-ordinal-06">sj\xE4tte</term>
    <term name="long-ordinal-07">sjunde</term>
    <term name="long-ordinal-08">\xE5ttonde</term>
    <term name="long-ordinal-09">nionde</term>
    <term name="long-ordinal-10">tionde</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>bok</single>
      <multiple>b\xF6cker</multiple>
    </term>
    <term name="chapter">
      <single>kapitel</single>
      <multiple>kapitel</multiple>
    </term>
    <term name="column">
      <single>kolumn</single>
      <multiple>kolumner</multiple>
    </term>
    <term name="figure">
      <single>figur</single>
      <multiple>figurer</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>nummer</single>
      <multiple>nummer</multiple>
    </term>
    <term name="line">
      <single>rad</single>
      <multiple>rader</multiple>
    </term>
    <term name="note">
      <single>not</single>
      <multiple>noter</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>sida</single>
      <multiple>sidor</multiple>
    </term>
    <term name="number-of-pages">
      <single>sida</single>
      <multiple>sidor</multiple>
    </term>
    <term name="paragraph">
      <single>stycke</single>
      <multiple>stycken</multiple>
    </term>
    <term name="part">
      <single>del</single>
      <multiple>delar</multiple>
    </term>
    <term name="section">
      <single>avsnitt</single>
      <multiple>avsnitt</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>vers</single>
      <multiple>verser</multiple>
    </term>
    <term name="volume">
      <single>volym</single>
      <multiple>volymer</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">bok</term>
    <term name="chapter" form="short">kap.</term>
    <term name="column" form="short">kol.</term>
    <term name="figure" form="short">fig.</term>
    <term name="folio" form="short">f.</term>
    <term name="issue" form="short">nr</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>s.</multiple>
    </term>
    <term name="paragraph" form="short">st.</term>
    <term name="part" form="short">del</term>
    <term name="section" form="short">avs.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>vers</single>
      <multiple>verser</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol.</single>
      <multiple>vol.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>redakt\xF6r</single>
      <multiple>redakt\xF6rer</multiple>
    </term>
    <term name="editorial-director">
      <single>editor</single>
      <multiple>editors</multiple>
    </term>
    <term name="illustrator">
      <single>illustrat\xF6r</single>
      <multiple>illustrat\xF6rer</multiple>
    </term>
    <term name="translator">
      <single>\xF6vers\xE4ttare</single>
      <multiple>\xF6vers\xE4ttare</multiple>
    </term>
    <term name="editortranslator">
      <single>redakt\xF6r &amp; \xF6vers\xE4ttare</single>
      <multiple>redakt\xF6rer &amp; \xF6vers\xE4ttare</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>red.</single>
      <multiple>red.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>ed.</single>
      <multiple>eds.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ill.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\xF6vers.</single>
      <multiple>\xF6vers.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>red. &amp; \xF6vers.</single>
      <multiple>red. &amp; \xF6vers.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">av</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">redigerad av</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrerad av</term>
    <term name="interviewer" form="verb">intervjuad av</term>
    <term name="recipient" form="verb">till</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">\xF6versatt av</term>
    <term name="editortranslator" form="verb">redigerad &amp; \xF6versatt av</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">red.</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">\xF6vers.</term>
    <term name="editortranslator" form="verb-short">red. &amp; \xF6vers. av</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">januari</term>
    <term name="month-02">februari</term>
    <term name="month-03">mars</term>
    <term name="month-04">april</term>
    <term name="month-05">maj</term>
    <term name="month-06">juni</term>
    <term name="month-07">juli</term>
    <term name="month-08">augusti</term>
    <term name="month-09">september</term>
    <term name="month-10">oktober</term>
    <term name="month-11">november</term>
    <term name="month-12">december</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">jan.</term>
    <term name="month-02" form="short">feb.</term>
    <term name="month-03" form="short">mar.</term>
    <term name="month-04" form="short">apr.</term>
    <term name="month-05" form="short">maj</term>
    <term name="month-06" form="short">juni</term>
    <term name="month-07" form="short">juli</term>
    <term name="month-08" form="short">aug.</term>
    <term name="month-09" form="short">sep.</term>
    <term name="month-10" form="short">okt.</term>
    <term name="month-11" form="short">nov.</term>
    <term name="month-12" form="short">dec.</term>

    <!-- SEASONS -->
    <term name="season-01">v\xE5r</term>
    <term name="season-02">sommar</term>
    <term name="season-03">h\xF6st</term>
    <term name="season-04">vinter</term>
  </terms>
</locale>
`,"th-TH":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="th-TH">
  <info>
    <translator>
      <name>Dusit Laohasinnarong</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u0E2A\u0E37\u0E1A\u0E04\u0E49\u0E19</term>
    <term name="and">\u0E41\u0E25\u0E30</term>
    <term name="and others">\u0E41\u0E25\u0E30\u0E04\u0E13\u0E30</term>
    <term name="anonymous">\u0E19\u0E34\u0E23\u0E19\u0E32\u0E21</term>
    <term name="anonymous" form="short">\u0E19\u0E34\u0E23\u0E19\u0E32\u0E21</term>
    <term name="at">\u0E17\u0E35\u0E48</term>
    <term name="available at">available at</term>
    <term name="by">\u0E42\u0E14\u0E22</term>
    <term name="circa">\u0E42\u0E14\u0E22\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13</term>
    <term name="circa" form="short">\u0E1B\u0E23\u0E30\u0E21\u0E32\u0E13</term>
    <term name="cited">\u0E2D\u0E49\u0E32\u0E07\u0E16\u0E36\u0E07</term>
    <term name="edition">
      <single>\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48</single>
      <multiple>\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48</multiple>
    </term>
    <term name="edition" form="short">\u0E1E\u0E34\u0E21\u0E1E\u0E4C\u0E04\u0E23\u0E31\u0E49\u0E07\u0E17\u0E35\u0E48</term>
    <term name="et-al">\u0E41\u0E25\u0E30\u0E04\u0E13\u0E30</term>
    <term name="forthcoming">\u0E40\u0E15\u0E47\u0E21\u0E43\u0E08\u0E43\u0E2B\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25</term>
    <term name="from">\u0E08\u0E32\u0E01</term>
    <term name="ibid"> \u0E43\u0E19\u0E17\u0E35\u0E48\u0E40\u0E14\u0E35\u0E22\u0E27\u0E01\u0E31\u0E19</term>
    <term name="in">\u0E43\u0E19</term>
    <term name="in press">\u0E01\u0E33\u0E25\u0E31\u0E07\u0E23\u0E2D\u0E15\u0E35\u0E1E\u0E34\u0E21\u0E1E\u0E4C</term>
    <term name="internet">\u0E2D\u0E34\u0E19\u0E40\u0E17\u0E2D\u0E23\u0E4C\u0E40\u0E19\u0E47\u0E15</term>
    <term name="interview">\u0E01\u0E32\u0E23\u0E2A\u0E31\u0E21\u0E20\u0E32\u0E29\u0E13\u0E4C</term>
    <term name="letter">\u0E08\u0E14\u0E2B\u0E21\u0E32\u0E22</term>
    <term name="no date">\u0E44\u0E21\u0E48\u0E1B\u0E23\u0E32\u0E01\u0E0F\u0E1B\u0E35\u0E17\u0E35\u0E48\u0E1E\u0E34\u0E21\u0E1E\u0E4C</term>
    <term name="no date" form="short">\u0E21.\u0E1B.\u0E1B.</term>
    <term name="online">\u0E2D\u0E2D\u0E19\u0E44\u0E25\u0E19\u0E4C</term>
    <term name="presented at">\u0E19\u0E33\u0E40\u0E2A\u0E19\u0E2D\u0E17\u0E35\u0E48</term>
    <term name="reference">
      <single>\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07</single>
      <multiple>\u0E40\u0E2D\u0E01\u0E2A\u0E32\u0E23\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07</multiple>
    </term>
    <term name="reference" form="short">
      <single>\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07</single>
      <multiple>\u0E2D\u0E49\u0E32\u0E07\u0E2D\u0E34\u0E07</multiple>
    </term>
    <term name="retrieved">\u0E2A\u0E37\u0E1A\u0E04\u0E49\u0E19</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u0E04.\u0E28.</term>
    <term name="bc">\u0E1E.\u0E28.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal"></term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u0E2B\u0E19\u0E36\u0E48\u0E07</term>
    <term name="long-ordinal-02">\u0E2A\u0E2D\u0E07</term>
    <term name="long-ordinal-03">\u0E2A\u0E32\u0E21</term>
    <term name="long-ordinal-04">\u0E2A\u0E35\u0E48</term>
    <term name="long-ordinal-05">\u0E2B\u0E49\u0E32</term>
    <term name="long-ordinal-06">\u0E2B\u0E01</term>
    <term name="long-ordinal-07">\u0E40\u0E08\u0E47\u0E14</term>
    <term name="long-ordinal-08">\u0E41\u0E1B\u0E14</term>
    <term name="long-ordinal-09">\u0E40\u0E01\u0E49\u0E32</term>
    <term name="long-ordinal-10">\u0E2A\u0E34\u0E1A</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u0E2B\u0E19\u0E31\u0E07\u0E2A\u0E37\u0E2D</single>
      <multiple>\u0E2B\u0E19\u0E31\u0E07\u0E2A\u0E37\u0E2D</multiple>
    </term>
    <term name="chapter">
      <single>\u0E1A\u0E17\u0E17\u0E35\u0E48</single>
      <multiple>\u0E1A\u0E17\u0E17\u0E35\u0E48</multiple>
    </term>
    <term name="column">
      <single>\u0E2A\u0E14\u0E21\u0E20\u0E4C</single>
      <multiple>\u0E2A\u0E14\u0E21\u0E20\u0E4C</multiple>
    </term>
    <term name="figure">
      <single>\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E</single>
      <multiple>\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E</multiple>
    </term>
    <term name="folio">
      <single>\u0E2B\u0E19\u0E49\u0E32</single>
      <multiple>\u0E2B\u0E19\u0E49\u0E32</multiple>
    </term>
    <term name="issue">
      <single>\u0E09\u0E1A\u0E31\u0E1A\u0E17\u0E35\u0E48</single>
      <multiple>\u0E09\u0E1A\u0E31\u0E1A\u0E17\u0E35\u0E48</multiple>
    </term>
    <term name="line">
      <single>\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E17\u0E35\u0E48</single>
      <multiple>\u0E1A\u0E23\u0E23\u0E17\u0E31\u0E14\u0E17\u0E35\u0E48</multiple>
    </term>
    <term name="note">
      <single>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</single>
      <multiple>\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01</multiple>
    </term>
    <term name="opus">
      <single>\u0E1A\u0E17\u0E1B\u0E23\u0E30\u0E1E\u0E31\u0E19\u0E18\u0E4C</single>
      <multiple>\u0E1A\u0E17\u0E1B\u0E23\u0E30\u0E1E\u0E31\u0E19\u0E18\u0E4C</multiple>
    </term>
    <term name="page">
      <single>\u0E2B\u0E19\u0E49\u0E32</single>
      <multiple>\u0E2B\u0E19\u0E49\u0E32</multiple>
    </term>
    <term name="number-of-pages">
      <single>\u0E2B\u0E19\u0E49\u0E32</single>
      <multiple>\u0E2B\u0E19\u0E49\u0E32</multiple>
    </term>
    <term name="paragraph">
      <single>\u0E22\u0E48\u0E2D\u0E2B\u0E19\u0E49\u0E32</single>
      <multiple>\u0E22\u0E48\u0E2D\u0E2B\u0E19\u0E49\u0E32</multiple>
    </term>
    <term name="part">
      <single>\u0E2A\u0E48\u0E27\u0E19\u0E22\u0E48\u0E2D\u0E22</single>
      <multiple>\u0E2A\u0E48\u0E27\u0E19\u0E22\u0E48\u0E2D\u0E22</multiple>
    </term>
    <term name="section">
      <single>\u0E2B\u0E21\u0E27\u0E14</single>
      <multiple>\u0E2B\u0E21\u0E27\u0E14</multiple>
    </term>
    <term name="sub verbo">
      <single>\u0E43\u0E15\u0E49\u0E04\u0E33</single>
      <multiple>\u0E43\u0E15\u0E49\u0E04\u0E33</multiple>
    </term>
    <term name="verse">
      <single>\u0E23\u0E49\u0E2D\u0E22\u0E01\u0E23\u0E2D\u0E07</single>
      <multiple>\u0E23\u0E49\u0E2D\u0E22\u0E01\u0E23\u0E2D\u0E07</multiple>
    </term>
    <term name="volume">
      <single>\u0E1B\u0E35\u0E17\u0E35\u0E48</single>
      <multiple>\u0E1B\u0E35\u0E17\u0E35\u0E48</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u0E2B\u0E19\u0E31\u0E07\u0E2A\u0E37\u0E2D</term>
    <term name="chapter" form="short">\u0E1A\u0E17\u0E17\u0E35\u0E48</term>
    <term name="column" form="short">\u0E2A\u0E14\u0E21\u0E20\u0E4C</term>
    <term name="figure" form="short">\u0E23\u0E39\u0E1B\u0E20\u0E32\u0E1E</term>
    <term name="folio" form="short">\u0E2B\u0E19\u0E49\u0E32</term>
    <term name="issue" form="short">\u0E09\u0E1A\u0E31\u0E1A\u0E17\u0E35\u0E48</term>
    <term name="line" form="short">l.</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">\u0E1A\u0E17\u0E1B\u0E23\u0E30\u0E1E\u0E31\u0E19\u0E18\u0E4C</term>
    <term name="page" form="short">
      <single>\u0E19.</single>
      <multiple>\u0E19.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>\u0E19.</single>
      <multiple>\u0E19.</multiple>
    </term>
    <term name="paragraph" form="short">\u0E22\u0E48\u0E2D\u0E2B\u0E19\u0E49\u0E32</term>
    <term name="part" form="short">\u0E2A\u0E48\u0E27\u0E19\u0E22\u0E48\u0E2D\u0E22</term>
    <term name="section" form="short">\u0E2B\u0E21\u0E27\u0E14</term>
    <term name="sub verbo" form="short">
      <single>\u0E43\u0E15\u0E49\u0E04\u0E33</single>
      <multiple>\u0E43\u0E15\u0E49\u0E04\u0E33</multiple>
    </term>
    <term name="verse" form="short">
      <single>\u0E23\u0E49\u0E2D\u0E22\u0E01\u0E23\u0E2D\u0E07</single>
      <multiple>\u0E23\u0E49\u0E2D\u0E22\u0E01\u0E23\u0E2D\u0E07</multiple>
    </term>
    <term name="volume" form="short">
      <single>\u0E1B\u0E35</single>
      <multiple>\u0E1B\u0E35</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23</single>
      <multiple>\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23</multiple>
    </term>
    <term name="editorial-director">
      <single>\u0E1C\u0E39\u0E49\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E01\u0E32\u0E23\u0E1A\u0E17\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23</single>
      <multiple>\u0E1C\u0E39\u0E49\u0E2D\u0E33\u0E19\u0E27\u0E22\u0E01\u0E32\u0E23\u0E1A\u0E17\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23</multiple>
    </term>
    <term name="illustrator">
      <single>illustrator</single>
      <multiple>illustrators</multiple>
    </term>
    <term name="translator">
      <single>\u0E1C\u0E39\u0E49\u0E41\u0E1B\u0E25</single>
      <multiple>\u0E1C\u0E39\u0E49\u0E41\u0E1B\u0E25</multiple>
    </term>
    <term name="editortranslator">
      <single>\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23\u0E41\u0E25\u0E30\u0E1C\u0E39\u0E49\u0E41\u0E1B\u0E25</single>
      <multiple>\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23\u0E41\u0E25\u0E30\u0E1C\u0E39\u0E49\u0E41\u0E1B\u0E25</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>\u0E1A.\u0E01.</single>
      <multiple>\u0E1A.\u0E01.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>\u0E1C\u0E2D.\u0E1A\u0E17\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23</single>
      <multiple>\u0E1C\u0E2D.\u0E1A\u0E17\u0E1A\u0E23\u0E23\u0E13\u0E32\u0E18\u0E34\u0E01\u0E32\u0E23</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>ill.</single>
      <multiple>ills.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\u0E1C\u0E39\u0E49\u0E41\u0E1B\u0E25</single>
      <multiple>\u0E1C\u0E39\u0E49\u0E41\u0E1B\u0E25</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>\u0E1A.\u0E01.</single>
      <multiple>\u0E1A.\u0E01.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">\u0E42\u0E14\u0E22</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E07\u0E42\u0E14\u0E22</term>
    <term name="editorial-director" form="verb">\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E07\u0E42\u0E14\u0E22</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">\u0E2A\u0E31\u0E21\u0E20\u0E32\u0E29\u0E13\u0E4C\u0E42\u0E14\u0E22</term>
    <term name="recipient" form="verb">\u0E16\u0E36\u0E07</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">\u0E41\u0E1B\u0E25\u0E42\u0E14\u0E22</term>
    <term name="editortranslator" form="verb">\u0E41\u0E1B\u0E25\u0E41\u0E25\u0E30\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E07\u0E42\u0E14\u0E22</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">\u0E42\u0E14\u0E22</term>
    <term name="editorial-director" form="verb-short">\u0E42\u0E14\u0E22</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">\u0E41\u0E1B\u0E25</term>
    <term name="editortranslator" form="verb-short">\u0E41\u0E1B\u0E25\u0E41\u0E25\u0E30\u0E40\u0E23\u0E35\u0E22\u0E1A\u0E40\u0E23\u0E35\u0E22\u0E07\u0E42\u0E14\u0E22</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u0E21\u0E01\u0E23\u0E32\u0E04\u0E21</term>
    <term name="month-02">\u0E01\u0E38\u0E21\u0E20\u0E32\u0E1E\u0E31\u0E19\u0E18\u0E4C</term>
    <term name="month-03">\u0E21\u0E35\u0E19\u0E32\u0E04\u0E21</term>
    <term name="month-04">\u0E40\u0E21\u0E29\u0E32\u0E22\u0E19</term>
    <term name="month-05">\u0E1E\u0E24\u0E29\u0E20\u0E32\u0E04\u0E21</term>
    <term name="month-06">\u0E21\u0E34\u0E16\u0E38\u0E19\u0E32\u0E22\u0E19</term>
    <term name="month-07">\u0E01\u0E23\u0E01\u0E0E\u0E32\u0E04\u0E21</term>
    <term name="month-08">\u0E2A\u0E34\u0E07\u0E2B\u0E32\u0E04\u0E21</term>
    <term name="month-09">\u0E01\u0E31\u0E19\u0E22\u0E32\u0E22\u0E19</term>
    <term name="month-10">\u0E15\u0E38\u0E25\u0E32\u0E04\u0E32\u0E21</term>
    <term name="month-11">\u0E1E\u0E24\u0E28\u0E08\u0E34\u0E01\u0E32\u0E22\u0E19</term>
    <term name="month-12">\u0E18\u0E31\u0E19\u0E27\u0E32\u0E04\u0E21</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">\u0E21.\u0E04.</term>
    <term name="month-02" form="short">\u0E01.\u0E1E.</term>
    <term name="month-03" form="short">\u0E21\u0E35.\u0E04.</term>
    <term name="month-04" form="short">\u0E40\u0E21.\u0E22.</term>
    <term name="month-05" form="short">\u0E1E.\u0E04.</term>
    <term name="month-06" form="short">\u0E21\u0E34.\u0E22.</term>
    <term name="month-07" form="short">\u0E01.\u0E04.</term>
    <term name="month-08" form="short">\u0E2A.\u0E04.</term>
    <term name="month-09" form="short">\u0E01.\u0E22.</term>
    <term name="month-10" form="short">\u0E15.\u0E04.</term>
    <term name="month-11" form="short">\u0E1E.\u0E22.</term>
    <term name="month-12" form="short">\u0E18.\u0E04.</term>

    <!-- SEASONS -->
    <term name="season-01">\u0E24\u0E14\u0E39\u0E43\u0E1A\u0E44\u0E21\u0E49\u0E1C\u0E25\u0E34</term>
    <term name="season-02">\u0E24\u0E14\u0E39\u0E23\u0E49\u0E2D\u0E19</term>
    <term name="season-03">\u0E24\u0E14\u0E39\u0E43\u0E1A\u0E44\u0E21\u0E49\u0E23\u0E48\u0E27\u0E07</term>
    <term name="season-04">\u0E24\u0E14\u0E39\u0E2B\u0E19\u0E32\u0E27</term>
  </terms>
</locale>
`,"tr-TR":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="tr-TR">
  <info>
    <translator>
      <name>ekizyener</name>
    </translator>
    <translator>
      <name>Binici</name>
    </translator>
    <translator>
      <name>cengiza</name>
    </translator>
    <translator>
      <name>Muhammet Tarak\xE7\u0131</name>
      <email>muhammettarakci@gmail.com</email>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="."/>
    <date-part name="month" form="numeric-leading-zeros" suffix="."/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">eri\u015Fim</term>
    <term name="and">ve</term>
    <term name="and others">ve di\u011Ferleri</term>
    <term name="anonymous">anonim</term>
    <term name="anonymous" form="short">anonim</term>
    <term name="at">de</term>
    <term name="available at">eri\u015Fim adresi</term>
    <term name="by">by</term>
    <term name="circa">yakla\u015F\u0131k</term>
    <term name="circa" form="short">yakl.</term>
    <term name="cited">a.yer</term>
    <term name="edition">
      <single>bask\u0131</single>
      <multiple>bask\u0131</multiple>
    </term>
    <term name="edition" form="short">bs</term>
    <term name="et-al">vd.</term>
    <term name="forthcoming">gelecek</term>
    <term name="from">g\xF6nderen</term>
    <term name="ibid">a.g.e.</term>
    <term name="in">i\xE7inde</term>
    <term name="in press">bas\u0131mda</term>
    <term name="internet">internet</term>
    <term name="interview">m\xFClakat</term>
    <term name="letter">mektup</term>
    <term name="no date">tarih yok</term>
    <term name="no date" form="short">t.y.</term>
    <term name="online">\xE7evrimi\xE7i</term>
    <term name="presented at">program ad\u0131:</term>
    <term name="reference">
      <single>kaynak</single>
      <multiple>kaynaklar</multiple>
    </term>
    <term name="reference" form="short">
      <single>kay.</single>
      <multiple>kay.</multiple>
    </term>
    <term name="retrieved">geli\u015F tarihi</term>
    <term name="scale">\xF6l\xE7ek</term>
    <term name="version">versiyon</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">M.S.</term>
    <term name="bc">M.\xD6.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">-</term>

    <!-- ORDINALS -->
    <term name="ordinal">.</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">birinci</term>
    <term name="long-ordinal-02">ikinci</term>
    <term name="long-ordinal-03">\xFC\xE7\xFCnc\xFC</term>
    <term name="long-ordinal-04">d\xF6rd\xFCnc\xFC</term>
    <term name="long-ordinal-05">be\u015Finci</term>
    <term name="long-ordinal-06">alt\u0131nc\u0131</term>
    <term name="long-ordinal-07">yedinci</term>
    <term name="long-ordinal-08">sekizinci</term>
    <term name="long-ordinal-09">dokuzuncu</term>
    <term name="long-ordinal-10">onuncu</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>kitap</single>
      <multiple>kitaplar</multiple>
    </term>
    <term name="chapter">
      <single>b\xF6l\xFCm</single>
      <multiple>b\xF6l\xFCmler</multiple>
    </term>
    <term name="column">
      <single>s\xFCtun</single>
      <multiple>s\xFCtunlar</multiple>
    </term>
    <term name="figure">
      <single>\u015Fekil</single>
      <multiple>\u015Fekiller</multiple>
    </term>
    <term name="folio">
      <single>folyo</single>
      <multiple>folyo</multiple>
    </term>
    <term name="issue">
      <single>say\u0131</single>
      <multiple>say\u0131</multiple>
    </term>
    <term name="line">
      <single>sat\u0131r</single>
      <multiple>sat\u0131rlar</multiple>
    </term>
    <term name="note">
      <single>not</single>
      <multiple>notlar</multiple>
    </term>
    <term name="opus">
      <single>eser</single>
      <multiple>eserler</multiple>
    </term>
    <term name="page">
      <single>sayfa</single>
      <multiple>sayfalar</multiple>
    </term>
    <term name="number-of-pages">
      <single>sayfa say\u0131s\u0131</single>
      <multiple>sayfa say\u0131lar\u0131</multiple>
    </term>
    <term name="paragraph">
      <single>paragraf</single>
      <multiple>paragraflar</multiple>
    </term>
    <term name="part">
      <single>k\u0131s\u0131m</single>
      <multiple>k\u0131s\u0131mlar</multiple>
    </term>
    <term name="section">
      <single>b\xF6l\xFCm</single>
      <multiple>b\xF6l\xFCmler</multiple>
    </term>
    <term name="sub verbo">
      <single>madde</single>
      <multiple>maddeler</multiple>
    </term>
    <term name="verse">
      <single>ayet</single>
      <multiple>ayetler</multiple>
    </term>
    <term name="volume">
      <single>cilt</single>
      <multiple>ciltler</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">kit.</term>
    <term name="chapter" form="short">b\xF6l.</term>
    <term name="column" form="short">s\xFCt.</term>
    <term name="figure" form="short">\u015Fek.</term>
    <term name="folio" form="short">fl.</term>
    <term name="issue" form="short">sy</term>
    <term name="line" form="short">sat\u0131r</term>
    <term name="note" form="short">n.</term>
    <term name="opus" form="short">a.yer</term>
    <term name="page" form="short">
      <single>s.</single>
      <multiple>ss.</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>s.</single>
      <multiple>ss.</multiple>
    </term>
    <term name="paragraph" form="short">par.</term>
    <term name="part" form="short">ksm.</term>
    <term name="section" form="short">blm.</term>
    <term name="sub verbo" form="short">
      <single>md.</single>
      <multiple>md.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v.</single>
      <multiple>vv.</multiple>
    </term>
    <term name="volume" form="short">
      <single>c.</single>
      <multiple>c.</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>direkt\xF6r</single>
      <multiple>direkt\xF6rler</multiple>
    </term>
    <term name="editor">
      <single>edit\xF6r</single>
      <multiple>edit\xF6rler</multiple>
    </term>
    <term name="editorial-director">
      <single>sorumlu edit\xF6r</single>
      <multiple>sorumlu edit\xF6rler</multiple>
    </term>
    <term name="illustrator">
      <single>\xE7izen</single>
      <multiple>\xE7izenler</multiple>
    </term>
    <term name="translator">
      <single>\xE7eviren</single>
      <multiple>\xE7evirenler</multiple>
    </term>
    <term name="editortranslator">
      <single>edit\xF6r &amp; \xE7eviren</single>
      <multiple>edit\xF6rler &amp; \xE7evirenler</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dir.</multiple>
    </term>
    <term name="editor" form="short">
      <single>ed.</single>
      <multiple>ed.</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>sor.ed.</single>
      <multiple>sor.ed.</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>\xE7zm.</single>
      <multiple>\xE7zm.</multiple>
    </term>
    <term name="translator" form="short">
      <single>\xE7ev.</single>
      <multiple>\xE7ev.</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>ed. &amp; \xE7ev.</single>
      <multiple>ed. &amp; \xE7ev.</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">kitap edit\xF6r\xFC</term>
    <term name="director" form="verb">direkt\xF6r</term>
    <term name="editor" form="verb">edit\xF6r</term>
    <term name="editorial-director" form="verb">sorumlu edit\xF6r</term>
    <term name="illustrator" form="verb">\xE7izen</term>
    <term name="interviewer" form="verb">r\xF6portaj yapan</term>
    <term name="recipient" form="verb">al\u0131c\u0131</term>
    <term name="reviewed-author" form="verb">tan\u0131t\u0131m yazar\u0131</term>
    <term name="translator" form="verb">\xE7eviren</term>
    <term name="editortranslator" form="verb">d\xFCzenleyen &amp; \xE7eviren by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed.</term>
    <term name="editorial-director" form="verb-short">sor.ed.</term>
    <term name="illustrator" form="verb-short">\xE7izen</term>
    <term name="translator" form="verb-short">\xE7ev.</term>
    <term name="editortranslator" form="verb-short">ed. &amp; \xE7ev.</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Ocak</term>
    <term name="month-02">\u015Eubat</term>
    <term name="month-03">Mart</term>
    <term name="month-04">Nisan</term>
    <term name="month-05">May\u0131s</term>
    <term name="month-06">Haziran</term>
    <term name="month-07">Temmuz</term>
    <term name="month-08">A\u011Fustos</term>
    <term name="month-09">Eyl\xFCl</term>
    <term name="month-10">Ekim</term>
    <term name="month-11">Kas\u0131m</term>
    <term name="month-12">Aral\u0131k</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">Oca.</term>
    <term name="month-02" form="short">\u015Eub.</term>
    <term name="month-03" form="short">Mar.</term>
    <term name="month-04" form="short">Nis.</term>
    <term name="month-05" form="short">May.</term>
    <term name="month-06" form="short">Haz.</term>
    <term name="month-07" form="short">Tem.</term>
    <term name="month-08" form="short">A\u011Fu.</term>
    <term name="month-09" form="short">Eyl.</term>
    <term name="month-10" form="short">Eki.</term>
    <term name="month-11" form="short">Kas.</term>
    <term name="month-12" form="short">Ara.</term>

    <!-- SEASONS -->
    <term name="season-01">Bahar</term>
    <term name="season-02">Yaz</term>
    <term name="season-03">Sonbahar</term>
    <term name="season-04">K\u0131\u015F</term>
  </terms>
</locale>
`,"uk-UA":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="uk-UA">
  <info>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2018-09-17T21:00:00+02:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" form="numeric-leading-zeros" suffix=", "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">\u0434\u0430\u0442\u0430 \u0437\u0432\u0435\u0440\u043D\u0435\u043D\u043D\u044F</term>
    <term name="and">\u0456</term>
    <term name="and others">\u0442\u0430 \u0456\u043D\u0448\u0456</term>
    <term name="anonymous">\u0430\u043D\u043E\u043D\u0456\u043C\u043D\u0438\u0439</term>
    <term name="anonymous" form="short">\u0430\u043D\u043E\u043D.</term>
    <term name="at">\u043D\u0430</term>
    <term name="available at">\u0434\u043E\u0441\u0442\u0443\u043F\u043D\u0438\u0439 \u0443</term>
    <term name="by">\u0432\u0456\u0434\u043F\u043E\u0432\u0456\u0434\u043D\u043E \u0434\u043E</term>
    <term name="circa">\u0431\u043B\u0438\u0437\u044C\u043A\u043E</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">\u0446\u0438\u0442. \u0437\u0430</term>
    <term name="edition">\u0432\u0438\u0434\u0430\u043D\u043D\u044F</term>
    <term name="edition" form="short">\u0432\u0438\u0434.</term>
    <term name="et-al">et al.</term>
    <term name="forthcoming">\u043C\u0430\u0439\u0431\u0443\u0442\u043D\u0456\u0439</term>
    <term name="from">\u0456\u0437</term>
    <term name="ibid">\u0442\u0430\u043C \u0441\u0430\u043C\u043E</term>
    <term name="in">\u0432</term>
    <term name="in press">\u0443 \u043F\u0440\u0435\u0441\u0456</term>
    <term name="internet">\u0456\u043D\u0442\u0435\u0440\u043D\u0435\u0442</term>
    <term name="interview">\u0456\u043D\u0442\u0435\u0440\u0432\u044E</term>
    <term name="letter">\u043B\u0438\u0441\u0442</term>
    <term name="no date">\u0431\u0435\u0437 \u0434\u0430\u0442\u0438</term>
    <term name="no date" form="short">\u0431. \u0434.</term>
    <term name="online">online</term>
    <term name="presented at">\u043F\u0440\u0435\u0434\u0441\u0442\u0430\u0432\u043B\u0435\u043D\u0430 \u043D\u0430</term>
    <term name="reference">\u0441\u043F\u0438\u0441\u043E\u043A \u0432\u0438\u043A\u043E\u0440\u0438\u0441\u0442\u0430\u043D\u0438\u0445 \u0434\u0436\u0435\u0440\u0435\u043B</term>
    <term name="reference" form="short">\u0434\u0436\u0435\u0440\u0435\u043B\u0430</term>
    <term name="retrieved">\u0432\u0438\u043B\u0443\u0447\u0435\u043D\u043E</term>
    <term name="scale">\u043C\u0430\u0441\u0448\u0442\u0430\u0431</term>
    <term name="version">\u0432\u0435\u0440\u0441\u0456\u044F</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u043D. \u0435.</term>
    <term name="bc">\u0434\u043E \u043D. \u0435.</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\xAB</term>
    <term name="close-quote">\xBB</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">\u0438\u0439</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u043F\u0435\u0440\u0448\u0438\u0439</term>
    <term name="long-ordinal-02">\u0434\u0440\u0443\u0433\u0438\u0439</term>
    <term name="long-ordinal-03">\u0442\u0440\u0435\u0442\u0456\u0439</term>
    <term name="long-ordinal-04">\u0447\u0435\u0442\u0432\u0435\u0440\u0442\u0438\u0439</term>
    <term name="long-ordinal-05">\u043F'\u044F\u0442\u0438\u0439</term>
    <term name="long-ordinal-06">\u0448\u043E\u0441\u0442\u0438\u0439</term>
    <term name="long-ordinal-07">\u0441\u044C\u043E\u043C\u0438\u0439</term>
    <term name="long-ordinal-08">\u0432\u043E\u0441\u044C\u043C\u0438\u0439</term>
    <term name="long-ordinal-09">\u0434\u0435\u0432'\u044F\u0442\u0438\u0439</term>
    <term name="long-ordinal-10">\u0434\u0435\u0441\u044F\u0442\u0438\u0439</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>\u043A\u043D\u0438\u0433\u0430</single>
      <multiple>\u043A\u043D\u0438\u0433\u0438</multiple>
    </term>
    <term name="chapter">
      <single>\u0440\u043E\u0437\u0434\u0456\u043B</single>
      <multiple>\u0440\u043E\u0437\u0434\u0456\u043B\u0438</multiple>
    </term>
    <term name="column">
      <single>\u0433\u0440\u0430\u0444\u0430</single>
      <multiple>\u0433\u0440\u0430\u0444\u0438</multiple>
    </term>
    <term name="figure">
      <single>\u0440\u0438\u0441\u0443\u043D\u043E\u043A</single>
      <multiple>\u0440\u0438\u0441\u0443\u043D\u043A\u0438</multiple>
    </term>
    <term name="folio">
      <single>\u0444\u043E\u043B\u0456\u0430\u043D\u0442</single>
      <multiple>\u0444\u043E\u043B\u0456\u0430\u043D\u0442\u0438</multiple>
    </term>
    <term name="issue">\u0432\u0438\u043F\u0443\u0441\u043A</term>
    <term name="line">
      <single>\u0420\u044F\u0434\u043E\u043A</single>
      <multiple>\u0420\u044F\u0434\u043A\u0438</multiple>
    </term>
    <term name="note">
      <single>\u043F\u0440\u0438\u043C\u0456\u0442\u043A\u0430</single>
      <multiple>\u043F\u0440\u0438\u043C\u0456\u0442\u043A\u0438</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">\u0421.</term>
    <term name="number-of-pages">\u0441.</term>
    <term name="paragraph">
      <single>\u043F\u0430\u0440\u0430\u0433\u0440\u0430\u0444</single>
      <multiple>\u043F\u0430\u0440\u0430\u0433\u0440\u0430\u0444\u0438</multiple>
    </term>
    <term name="part">
      <single>\u0447\u0430\u0441\u0442\u0438\u043D\u0430</single>
      <multiple>\u0447\u0430\u0441\u0442\u0438\u043D\u0438</multiple>
    </term>
    <term name="section">
      <single>\u0440\u043E\u0437\u0434\u0456\u043B</single>
      <multiple>\u0440\u043E\u0437\u0434\u0456\u043B\u0438</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>verse</single>
      <multiple>verses</multiple>
    </term>
    <term name="volume">
      <single>\u0422\u043E\u043C</single>
      <multiple>\u0422\u043E\u043C\u0438</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u043A\u043D.</term>
    <term name="chapter" form="short">\u0440\u043E\u0437\u0434.</term>
    <term name="column" form="short">\u0440\u044F\u0434.</term>
    <term name="figure" form="short">\u0440\u0438\u0441.</term>
    <term name="folio" form="short">\u0444.</term>
    <term name="issue" form="short">\u0432\u0438\u043F.</term>
    <term name="line" form="short">\u043B.</term>
    <term name="note" form="short">\u043F\u0440\u0438\u043C.</term>
    <term name="opus" form="short">\u043E\u043F.</term>
    <term name="page" form="short">\u0441.</term>
    <term name="number-of-pages" form="short">\u0441.</term>
    <term name="paragraph" form="short">\u043F\u0430\u0440.</term>
    <term name="part" form="short">\u0447.</term>
    <term name="section" form="short">\u0441\u0435\u043A.</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">\u0441.</term>
    <term name="volume" form="short">\u0432\u0438\u043F.</term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>\u0440\u0435\u0436\u0438\u0441\u0435\u0440</single>
      <multiple>\u0440\u0435\u0436\u0438\u0441\u0435\u0440\u0438</multiple>
    </term>
    <term name="editor">\u0437\u0430 \u0440\u0435\u0434.</term>
    <term name="editorial-director">\u0437\u0430 \u0440\u0435\u0434.</term>
    <term name="illustrator">
      <single>\u0456\u043B\u044E\u0441\u0442\u0440\u0430\u0442\u043E\u0440</single>
      <multiple>\u0456\u043B\u044E\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0438</multiple>
    </term>
    <term name="translator">
      <single>\u043F\u0435\u0440\u0435\u043A\u043B\u0430\u0434\u0430\u0447</single>
      <multiple>\u043F\u0435\u0440\u0435\u043A\u043B\u0430\u0434\u0430\u0447\u0456</multiple>
    </term>
    <term name="editortranslator">\u0417\u0430 \u0440\u0435\u0434. &amp; \u043F\u0435\u0440\u0435\u043A\u043B\u0430\u0434</term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">\u0440\u0435\u0436.</term>
    <term name="editor" form="short">\u0440\u0435\u0434.</term>
    <term name="editorial-director" form="short">\u0440\u0435\u0434.</term>
    <term name="illustrator" form="short">\u0456\u043B.</term>
    <term name="translator" form="short">\u043F\u0435\u0440.</term>
    <term name="editortranslator" form="short">\u0440\u0435\u0434. &amp; \u043F\u0435\u0440.</term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">by</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">edited by</term>
    <term name="editorial-director" form="verb">edited by</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">by</term>
    <term name="translator" form="verb">translated by</term>
    <term name="editortranslator" form="verb">edited &amp; translated by</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">ed</term>
    <term name="editorial-director" form="verb-short">ed.</term>
    <term name="illustrator" form="verb-short">illus.</term>
    <term name="translator" form="verb-short">trans</term>
    <term name="editortranslator" form="verb-short">ed. &amp; trans. by</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u0421\u0456\u0447\u0435\u043D\u044C</term>
    <term name="month-02">\u041B\u044E\u0442\u0438\u0439</term>
    <term name="month-03">\u0411\u0435\u0440\u0435\u0437\u0435\u043D\u044C</term>
    <term name="month-04">\u041A\u0432\u0456\u0442\u0435\u043D\u044C</term>
    <term name="month-05">\u0422\u0440\u0430\u0432\u0435\u043D\u044C</term>
    <term name="month-06">\u0427\u0435\u0440\u0432\u0435\u043D\u044C</term>
    <term name="month-07">\u041B\u0438\u043F\u0435\u043D\u044C</term>
    <term name="month-08">\u0421\u0435\u0440\u043F\u0435\u043D\u044C</term>
    <term name="month-09">\u0412\u0435\u0440\u0435\u0441\u0435\u043D\u044C</term>
    <term name="month-10">\u0416\u043E\u0432\u0442\u0435\u043D\u044C</term>
    <term name="month-11">\u041B\u0438\u0441\u0442\u043E\u043F\u0430\u0434</term>
    <term name="month-12">\u0413\u0440\u0443\u0434\u0435\u043D\u044C</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">\u0421\u0456\u0447</term>
    <term name="month-02" form="short">\u041B\u044E\u0442</term>
    <term name="month-03" form="short">\u0411\u0435\u0440</term>
    <term name="month-04" form="short">\u041A\u0432\u0456\u0442</term>
    <term name="month-05" form="short">\u0422\u0440\u0430\u0432</term>
    <term name="month-06" form="short">\u0427\u0435\u0440</term>
    <term name="month-07" form="short">\u041B\u0438\u043F</term>
    <term name="month-08" form="short">\u0421\u0435\u0440</term>
    <term name="month-09" form="short">\u0412\u0435\u0440</term>
    <term name="month-10" form="short">\u0416\u043E\u0432</term>
    <term name="month-11" form="short">\u041B\u0438\u0441</term>
    <term name="month-12" form="short">\u0413\u0440\u0443\u0434</term>

    <!-- SEASONS -->
    <term name="season-01">Spring</term>
    <term name="season-02">Summer</term>
    <term name="season-03">Autumn</term>
    <term name="season-04">Winter</term>
  </terms>
</locale>
`,"vi-VN":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="vi-VN">
  <info>
    <translator>
      <name>dowens76</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2012-07-04T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="day" suffix=" "/>
    <date-part name="month" suffix=" "/>
    <date-part name="year"/>
  </date>
  <date form="numeric">
    <date-part name="day" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="month" form="numeric-leading-zeros" suffix="/"/>
    <date-part name="year"/>
  </date>
  <terms>
    <term name="accessed">truy c\u1EADp</term>
    <term name="and">v\xE0</term>
    <term name="and others">and others</term>
    <term name="anonymous">v\xF4 danh</term>
    <term name="anonymous" form="short">v.d</term>
    <term name="at">t\u1EA1i</term>
    <term name="available at">available at</term>
    <term name="by">b\u1EDFi</term>
    <term name="circa">circa</term>
    <term name="circa" form="short">c.</term>
    <term name="cited">cited</term>
    <term name="edition">
      <single>\u1EA5n b\u1EA3n</single>
      <multiple>\u1EA5n b\u1EA3n</multiple>
    </term>
    <term name="edition" form="short">a.b</term>
    <term name="et-al">v\xE0 c.s.</term>
    <term name="forthcoming">s\u1EAFp t\u1EDBi</term>
    <term name="from">t\u1EEB</term>
    <term name="ibid">n.t.</term>
    <term name="in">trong</term>
    <term name="in press">in press</term>
    <term name="internet">internet</term>
    <term name="interview">interview</term>
    <term name="letter">letter</term>
    <term name="no date">kh\xF4ng ng\xE0y</term>
    <term name="no date" form="short">kh\xF4ng ng\xE0y</term>
    <term name="online">online</term>
    <term name="presented at">\u0111\u01B0\u1EE3c tr\xECnh b\xE0y t\u1EA1i</term>
    <term name="reference">
      <single>reference</single>
      <multiple>references</multiple>
    </term>
    <term name="reference" form="short">
      <single>ref.</single>
      <multiple>refs.</multiple>
    </term>
    <term name="retrieved">truy v\u1EA5n</term>
    <term name="scale">scale</term>
    <term name="version">version</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">AD</term>
    <term name="bc">BC</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u201C</term>
    <term name="close-quote">\u201D</term>
    <term name="open-inner-quote">\u2018</term>
    <term name="close-inner-quote">\u2019</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal">th</term>
    <term name="ordinal-01">st</term>
    <term name="ordinal-02">nd</term>
    <term name="ordinal-03">rd</term>
    <term name="ordinal-11">th</term>
    <term name="ordinal-12">th</term>
    <term name="ordinal-13">th</term>

    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">th\u1EE9 nh\u1EA5t</term>
    <term name="long-ordinal-02">th\u1EE9 hai</term>
    <term name="long-ordinal-03">th\u1EE9 ba</term>
    <term name="long-ordinal-04">th\u1EE9 t\u01B0</term>
    <term name="long-ordinal-05">th\u1EE9 n\u0103m</term>
    <term name="long-ordinal-06">th\u1EE9 s\xE1u</term>
    <term name="long-ordinal-07">th\u1EE9 b\u1EA3y</term>
    <term name="long-ordinal-08">th\u1EE9 t\xE1m</term>
    <term name="long-ordinal-09">th\u1EE9 ch\xEDnh</term>
    <term name="long-ordinal-10">th\u1EE9 m\u01B0\u1EDDi</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">
      <single>s\xE1ch</single>
      <multiple>s\xE1ch</multiple>
    </term>
    <term name="chapter">
      <single>ch\u01B0\u01A1ng</single>
      <multiple>ch\u01B0\u01A1ng</multiple>
    </term>
    <term name="column">
      <single>column</single>
      <multiple>columns</multiple>
    </term>
    <term name="figure">
      <single>figure</single>
      <multiple>figures</multiple>
    </term>
    <term name="folio">
      <single>folio</single>
      <multiple>folios</multiple>
    </term>
    <term name="issue">
      <single>s\u1ED1</single>
      <multiple>s\u1ED1</multiple>
    </term>
    <term name="line">
      <single>d\xF2ng</single>
      <multiple>d\xF2ng</multiple>
    </term>
    <term name="note">
      <single>ghi ch\xFA</single>
      <multiple>ghi ch\xFA</multiple>
    </term>
    <term name="opus">
      <single>opus</single>
      <multiple>opera</multiple>
    </term>
    <term name="page">
      <single>trang</single>
      <multiple>trang</multiple>
    </term>
    <term name="number-of-pages">
      <single>trang</single>
      <multiple>trang</multiple>
    </term>
    <term name="paragraph">
      <single>\u0111o\u1EA1n v\u0103n</single>
      <multiple>\u0111o\u1EA1n v\u0103n</multiple>
    </term>
    <term name="part">
      <single>ph\u1EA7n</single>
      <multiple>ph\u1EA7n</multiple>
    </term>
    <term name="section">
      <single>section</single>
      <multiple>sections</multiple>
    </term>
    <term name="sub verbo">
      <single>sub verbo</single>
      <multiple>sub verbis</multiple>
    </term>
    <term name="verse">
      <single>c\xE2u</single>
      <multiple>c\xE2u</multiple>
    </term>
    <term name="volume">
      <single>t\u1EADp</single>
      <multiple>t\u1EADp</multiple>
    </term>

    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">s\xE1ch</term>
    <term name="chapter" form="short">ch</term>
    <term name="column" form="short">col</term>
    <term name="figure" form="short">fig</term>
    <term name="folio" form="short">f</term>
    <term name="issue" form="short">s\u1ED1 p.h</term>
    <term name="line" form="short">d.</term>
    <term name="note" form="short">gc.</term>
    <term name="opus" form="short">op</term>
    <term name="page" form="short">
      <single>tr</single>
      <multiple>tr</multiple>
    </term>
    <term name="number-of-pages" form="short">
      <single>tr</single>
      <multiple>tr</multiple>
    </term>
    <term name="paragraph" form="short">para</term>
    <term name="part" form="short">ph</term>
    <term name="section" form="short">sec</term>
    <term name="sub verbo" form="short">
      <single>s.v.</single>
      <multiple>s.vv.</multiple>
    </term>
    <term name="verse" form="short">
      <single>v</single>
      <multiple>vv</multiple>
    </term>
    <term name="volume" form="short">
      <single>vol</single>
      <multiple>vols</multiple>
    </term>

    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">
      <single>director</single>
      <multiple>directors</multiple>
    </term>
    <term name="editor">
      <single>bi\xEAn t\u1EADp vi\xEAn</single>
      <multiple>bi\xEAn t\u1EADp vi\xEAn</multiple>
    </term>
    <term name="editorial-director">
      <single>bi\xEAn t\u1EADp vi\xEAn</single>
      <multiple>bi\xEAn t\u1EADp vi\xEAn</multiple>
    </term>
    <term name="illustrator">
      <single>h\u1ECDa s\u0129</single>
      <multiple>h\u1ECDa s\u0129</multiple>
    </term>
    <term name="translator">
      <single>bi\xEAn d\u1ECBch vi\xEAn</single>
      <multiple>bi\xEAn d\u1ECBch vi\xEAn</multiple>
    </term>
    <term name="editortranslator">
      <single>bi\xEAn t\u1EADp vi\xEAn &amp; bi\xEAn d\u1ECBch vi\xEAn</single>
      <multiple>bi\xEAn t\u1EADp vi\xEAn &amp; bi\xEAn d\u1ECBch vi\xEAn</multiple>
    </term>

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">
      <single>dir.</single>
      <multiple>dirs.</multiple>
    </term>
    <term name="editor" form="short">
      <single>b.t.v</single>
      <multiple>b.t.v</multiple>
    </term>
    <term name="editorial-director" form="short">
      <single>b.t.v</single>
      <multiple>b.t.v</multiple>
    </term>
    <term name="illustrator" form="short">
      <single>h.s</single>
      <multiple>h.s</multiple>
    </term>
    <term name="translator" form="short">
      <single>b.d.v</single>
      <multiple>b.d.v</multiple>
    </term>
    <term name="editortranslator" form="short">
      <single>b.t.v &amp; b.d.v</single>
      <multiple>b.t.v &amp; b.d.v</multiple>
    </term>

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">b\u1EDFi</term>
    <term name="director" form="verb">directed by</term>
    <term name="editor" form="verb">bi\xEAn t\u1EADp b\u1EDFi</term>
    <term name="editorial-director" form="verb">bi\xEAn t\u1EADp b\u1EDFi</term>
    <term name="illustrator" form="verb">illustrated by</term>
    <term name="interviewer" form="verb">interview by</term>
    <term name="recipient" form="verb">to</term>
    <term name="reviewed-author" form="verb">b\u1EDFi</term>
    <term name="translator" form="verb">bi\xEAn d\u1ECBch b\u1EDFi</term>
    <term name="editortranslator" form="verb">bi\xEAn t\u1EADp &amp; bi\xEAn d\u1ECBch b\u1EDFi</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">dir.</term>
    <term name="editor" form="verb-short">b.t</term>
    <term name="editorial-director" form="verb-short">b.t</term>
    <term name="illustrator" form="verb-short">h.s</term>
    <term name="translator" form="verb-short">b.d</term>
    <term name="editortranslator" form="verb-short">b.t &amp; b.d b\u1EDFi</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">Th\xE1ng Gi\xEAng</term>
    <term name="month-02">Th\xE1ng Hai</term>
    <term name="month-03">Th\xE1ng Ba</term>
    <term name="month-04">Th\xE1ng T\u01B0</term>
    <term name="month-05">Th\xE1ng N\u0103m</term>
    <term name="month-06">Th\xE1ng S\xE1u</term>
    <term name="month-07">Th\xE1ng B\u1EA3y</term>
    <term name="month-08">Th\xE1ng T\xE1m</term>
    <term name="month-09">Th\xE1ng Ch\xEDn</term>
    <term name="month-10">Th\xE1ng M\u01B0\u1EDDi</term>
    <term name="month-11">Th\xE1ng M\u01B0\u1EDDi-M\u1ED9t</term>
    <term name="month-12">Th\xE1ng Ch\u1EA1p</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">th\xE1ng 1</term>
    <term name="month-02" form="short">th\xE1ng 2</term>
    <term name="month-03" form="short">th\xE1ng 3</term>
    <term name="month-04" form="short">th\xE1ng 4</term>
    <term name="month-05" form="short">th\xE1ng 5</term>
    <term name="month-06" form="short">th\xE1ng 6</term>
    <term name="month-07" form="short">th\xE1ng 7</term>
    <term name="month-08" form="short">th\xE1ng 8</term>
    <term name="month-09" form="short">th\xE1ng 9</term>
    <term name="month-10" form="short">th\xE1ng 10</term>
    <term name="month-11" form="short">th\xE1ng 11</term>
    <term name="month-12" form="short">th\xE1ng 12</term>

    <!-- SEASONS -->
    <term name="season-01">M\xF9a Xu\xE2n</term>
    <term name="season-02">M\xF9a H\xE8</term>
    <term name="season-03">M\xF9a Thu</term>
    <term name="season-04">M\xF9a \u0110\xF4ng</term>
  </terms>
</locale>
`,"zh-CN":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="zh-CN">
  <info>
    <translator>
      <name>rongls</name>
    </translator>
    <translator>
      <name>sati-bodhi</name>
    </translator>
    <translator>
      <name>Heromyth</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2014-05-15T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="year" suffix="\u5E74"/>
    <date-part name="month" form="numeric" suffix="\u6708"/>
    <date-part name="day" suffix="\u65E5"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="/"/>
  </date>
  <terms>
    <term name="accessed">\u89C1\u65BC</term>
    <term name="and">\u548C</term>
    <term name="and others">\u53CA\u5176\u4ED6</term>
    <term name="anonymous">\u4F5C\u8005\u4E0D\u8BE6</term>
    <term name="anonymous" form="short">\u65E0\u540D\u6C0F</term>
    <term name="at">\u65BC</term>
    <term name="available at">\u8F7D\u65BC</term>
    <term name="by">\u8457</term>
    <term name="circa">\u4ECB\u4E8E</term>
    <term name="circa" form="short">\u7EA6</term>
    <term name="cited">\u89C1\u5F15\u65BC</term>
    <term name="edition">\u7248\u672C</term>
    <term name="edition" form="short">\u672C</term>
    <term name="et-al">\u7B49</term>
    <term name="forthcoming">\u5373\u5C06\u51FA\u7248</term>
    <term name="from">\u4ECE</term>
    <term name="ibid">\u540C\u4E0A</term>
    <term name="in">\u6536\u5165</term>
    <term name="in press">\u9001\u5370\u4E2D</term>
    <term name="internet">\u7F51\u9645\u7F51\u7EDC</term>
    <term name="interview">\u8BBF\u8C08</term>
    <term name="letter">\u4FE1\u51FD</term>
    <term name="no date">\u65E5\u671F\u4E0D\u8BE6</term>
    <term name="no date" form="short">\u4E0D\u8BE6</term>
    <term name="online">\u5728\u7EBF</term>
    <term name="presented at">\u53D1\u8868\u65BC</term>
    <term name="reference">\u53C2\u8003</term>
    <term name="reference" form="short">\u53C2</term>
    <term name="retrieved">\u53D6\u8BFB\u4E8E</term>
    <term name="scale">\u6BD4\u4F8B</term>
    <term name="version">\u7248</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u516C\u5143</term>
    <term name="bc">\u516C\u5143\u524D</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u300A</term>
    <term name="close-quote">\u300B</term>
    <term name="open-inner-quote">\u3008</term>
    <term name="close-inner-quote">\u3009</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal"></term>
  
    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u4E00</term>
    <term name="long-ordinal-02">\u4E8C</term>
    <term name="long-ordinal-03">\u4E09</term>
    <term name="long-ordinal-04">\u56DB</term>
    <term name="long-ordinal-05">\u4E94</term>
    <term name="long-ordinal-06">\u516D</term>
    <term name="long-ordinal-07">\u4E03</term>
    <term name="long-ordinal-08">\u516B</term>
    <term name="long-ordinal-09">\u4E5D</term>
    <term name="long-ordinal-10">\u5341</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">\u518C</term>
    <term name="chapter">\u7AE0</term>
    <term name="column">\u680F</term>
    <term name="figure">\u56FE\u8868</term>       
    <term name="folio">\u7248</term>
    <term name="issue">\u671F</term>
    <term name="line">\u884C</term>
    <term name="note">\u6CE8\u811A</term>
    <term name="opus">\u4F5C\u54C1</term>      
    <term name="page">\u9875</term>
    <term name="number-of-pages"> \u603B\u9875\u6570</term>      
    <term name="paragraph">\u6BB5\u843D</term>
    <term name="part">\u90E8\u5206</term>     
    <term name="section">\u8282</term>         
    <term name="sub verbo">\u53E6\u89C1</term>    
    <term name="verse">\u7BC7</term>    
    <term name="volume">\u5377</term>
    
    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u518C</term>
    <term name="chapter" form="short">\u7AE0</term>
    <term name="column" form="short">\u680F</term>
    <term name="figure" form="short">\u56FE</term>
    <term name="folio" form="short">\u7248</term>
    <term name="issue" form="short">\u671F</term>
    <term name="line" form="short">\u884C</term>
    <term name="note" form="short">\u6CE8</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">\u9875</term>   
    <term name="number-of-pages" form="short">\u5171</term>    
    <term name="paragraph" form="short">\u6BB5</term>
    <term name="part" form="short">\u90E8</term>
    <term name="section" form="short">\u8282</term>
    <term name="sub verbo" form="short">\u53E6\u89C1</term>   
    <term name="verse" form="short">\u7BC7</term>      
    <term name="volume" form="short">\u5377</term>
    
    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="director">\u5BFC\u6F14</term>     
    <term name="editor">\u7F16\u8F91</term> 
    <term name="editorial-director">\u4E3B\u7F16</term>     
    <term name="illustrator">\u7ED8\u56FE</term>     
    <term name="translator">\u7FFB\u8BD1</term>      
    <term name="editortranslator">\u7F16\u8BD1</term>     

    <!-- SHORT ROLE FORMS -->
    <term name="director" form="short">\u5BFC\u6F14</term>     
    <term name="editor" form="short">\u7F16</term>     
    <term name="editorial-director" form="short">\u4E3B\u7F16</term>     
    <term name="illustrator" form="short">\u7ED8</term>   
    <term name="translator" form="short">\u8BD1</term>     
    <term name="editortranslator" form="short">\u7F16\u8BD1</term>    

    <!-- VERB ROLE FORMS -->
    <term name="container-author" form="verb">\u8457</term>
    <term name="director" form="verb">\u6307\u5BFC</term>
    <term name="editor" form="verb">\u7F16\u8F91</term>
    <term name="editorial-director" form="verb">\u4E3B\u7F16</term>
    <term name="illustrator" form="verb">\u7ED8\u56FE</term>
    <term name="interviewer" form="verb">\u91C7\u8BBF</term>
    <term name="recipient" form="verb">\u53D7\u51FD</term>
    <term name="reviewed-author" form="verb">\u6821\u8BA2</term>
    <term name="translator" form="verb">\u7FFB\u8BD1</term>
    <term name="editortranslator" form="verb">\u7F16\u8BD1</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">\u5BFC</term>
    <term name="editor" form="verb-short">\u7F16</term>
    <term name="editorial-director" form="verb-short">\u4E3B\u7F16</term>
    <term name="illustrator" form="verb-short">\u7ED8</term>
    <term name="translator" form="verb-short">\u8BD1</term>
    <term name="editortranslator" form="verb-short">\u7F16\u8BD1</term>
    <term name="reviewed-author" form="verb">\u6821</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u4E00\u6708</term>
    <term name="month-02">\u4E8C\u6708</term>
    <term name="month-03">\u4E09\u6708</term>
    <term name="month-04">\u56DB\u6708</term>
    <term name="month-05">\u4E94\u6708</term>
    <term name="month-06">\u516D\u6708</term>
    <term name="month-07">\u4E03\u6708</term>
    <term name="month-08">\u516B\u6708</term>
    <term name="month-09">\u4E5D\u6708</term>
    <term name="month-10">\u5341\u6708</term>
    <term name="month-11">\u5341\u4E00\u6708</term>
    <term name="month-12">\u5341\u4E8C\u6708</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">1\u6708</term>
    <term name="month-02" form="short">2\u6708</term>
    <term name="month-03" form="short">3\u6708</term>
    <term name="month-04" form="short">4\u6708</term>
    <term name="month-05" form="short">5\u6708</term>
    <term name="month-06" form="short">6\u6708</term>
    <term name="month-07" form="short">7\u6708</term>
    <term name="month-08" form="short">8\u6708</term>
    <term name="month-09" form="short">9\u6708</term>
    <term name="month-10" form="short">10\u6708</term>
    <term name="month-11" form="short">11\u6708</term>
    <term name="month-12" form="short">12\u6708</term>

    <!-- SEASONS -->
    <term name="season-01">\u6625</term>
    <term name="season-02">\u590F</term>
    <term name="season-03">\u79CB</term>
    <term name="season-04">\u51AC</term>
  </terms>
</locale>
`,"zh-TW":`<?xml version="1.0" encoding="utf-8"?>
<locale xmlns="http://purl.org/net/xbiblio/csl" version="1.0" xml:lang="zh-TW">
  <info>
    <translator>
      <name>sati-bodhi</name>
    </translator>
    <rights license="http://creativecommons.org/licenses/by-sa/3.0/">This work is licensed under a Creative Commons Attribution-ShareAlike 3.0 License</rights>
    <updated>2014-05-15T23:31:02+00:00</updated>
  </info>
  <style-options punctuation-in-quote="false"/>
  <date form="text">
    <date-part name="year" suffix="\u5E74"/>
    <date-part name="month" form="numeric" suffix="\u6708"/>
    <date-part name="day" suffix="\u65E5"/>
  </date>
  <date form="numeric">
    <date-part name="year"/>
    <date-part name="month" form="numeric-leading-zeros" prefix="/"/>
    <date-part name="day" form="numeric-leading-zeros" prefix="/"/>
  </date>
  <terms>
    <term name="accessed">\u5F15\u898B\u65BC</term>
    <term name="and">\u53CA</term>
    <term name="and others">\u53CA\u5176\u4ED6</term>
    <term name="anonymous">\u4F5C\u8005\u4E0D\u8A73</term>
    <term name="anonymous" form="short">\u7121\u540D\u6C0F</term>
    <term name="at">\u65BC</term>
    <term name="available at">\u8F09\u65BC</term>
    <term name="by">\u8457</term>
    <term name="circa">\u4ECB\u65BC</term>
    <term name="circa" form="short">\u7D04</term>
    <term name="cited">\u898B\u5F15\u65BC</term>
    <term name="edition">\u7248\u672C</term>
    <term name="edition" form="short">\u672C</term>
    <term name="et-al">\u7B49</term>
    <term name="forthcoming">\u5373\u5C07\u51FA\u7248</term>
    <term name="from">\u5F9E</term>
    <term name="ibid">\u540C\u4E0A</term>
    <term name="in">\u6536\u5165</term>
    <term name="in press">\u5370\u884C\u4E2D</term>
    <term name="internet">\u4E92\u806F\u7DB2</term>
    <term name="interview">\u8A2A\u8AC7</term>
    <term name="letter">\u4FE1\u51FD</term>
    <term name="no date">\u65E5\u671F\u4E0D\u8A73</term>
    <term name="no date" form="short">\u4E0D\u8A73</term>
    <term name="online">\u7DDA\u4E0A</term>
    <term name="presented at">\u767C\u8868\u65BC</term>
    <term name="reference">\u53C3\u8003</term>
    <term name="reference" form="short">\u53C3</term>
    <term name="retrieved">\u8B80\u53D6\u65BC</term>
    <term name="scale">\u6BD4\u4F8B</term>
    <term name="version">\u7248</term>

    <!-- ANNO DOMINI; BEFORE CHRIST -->
    <term name="ad">\u897F\u5143</term>
    <term name="bc">\u897F\u5143\u524D</term>

    <!-- PUNCTUATION -->
    <term name="open-quote">\u300C</term>
    <term name="close-quote">\u300D</term>
    <term name="open-inner-quote">\u300E</term>
    <term name="close-inner-quote">\u300F</term>
    <term name="page-range-delimiter">\u2013</term>

    <!-- ORDINALS -->
    <term name="ordinal"></term>
  
    <!-- LONG ORDINALS -->
    <term name="long-ordinal-01">\u4E00</term>
    <term name="long-ordinal-02">\u4E8C</term>
    <term name="long-ordinal-03">\u4E09</term>
    <term name="long-ordinal-04">\u56DB</term>
    <term name="long-ordinal-05">\u4E94</term>
    <term name="long-ordinal-06">\u516D</term>
    <term name="long-ordinal-07">\u4E03</term>
    <term name="long-ordinal-08">\u516B</term>
    <term name="long-ordinal-09">\u4E5D</term>
    <term name="long-ordinal-10">\u5341</term>

    <!-- LONG LOCATOR FORMS -->
    <term name="book">\u518A</term>
    <term name="chapter">\u7AE0</term>
    <term name="column">\u6B04</term>
    <term name="figure">\u5716\u8868</term>       
    <term name="folio">\u7248</term>
    <term name="issue">\u671F</term>
    <term name="line">\u884C</term>
    <term name="note">\u8A3B\u8173</term>
    <term name="opus">\u4F5C\u54C1</term>      
    <term name="page">\u9801</term>
    <term name="number-of-pages">\u7E3D\u9801\u6578</term>      
    <term name="paragraph">\u6BB5\u843D</term>
    <term name="part">\u90E8\u5206</term>     
    <term name="section">\u7BC0</term>         
    <term name="sub verbo">\u53E6\u898B</term>    
    <term name="verse">\u7BC7</term>    
    <term name="volume">\u5377</term>
    
    <!-- SHORT LOCATOR FORMS -->
    <term name="book" form="short">\u518A</term>
    <term name="chapter" form="short">\u7AE0</term>
    <term name="column" form="short">\u6B04</term>
    <term name="figure" form="short">\u5716</term>
    <term name="issue" form="short">\u671F</term>
    <term name="line" form="short">\u884C</term>
    <term name="note" form="short">\u8A3B</term>
    <term name="opus" form="short">op.</term>
    <term name="page" form="short">\u9801</term>   
    <term name="number-of-pages" form="short">\u5171</term>    
    <term name="paragraph" form="short">\u6BB5</term>
    <term name="part" form="short">\u90E8</term>
    <term name="section" form="short">\u7BC0</term>
    <term name="sub verbo" form="short">\u53E6\u898B</term>   
    <term name="verse" form="short">\u7BC7</term>      
    <term name="volume" form="short">\u5377</term>
    
    <!-- SYMBOL LOCATOR FORMS -->
    <term name="paragraph" form="symbol">
      <single>\xB6</single>
      <multiple>\xB6\xB6</multiple>
    </term>
    <term name="section" form="symbol">
      <single>\xA7</single>
      <multiple>\xA7\xA7</multiple>
    </term>

    <!-- LONG ROLE FORMS -->
    <term name="author">\u4F5C\u8005</term>     
    <term name="director">\u5C0E\u6F14</term>     
    <term name="editor">\u7DE8\u8F2F</term> 
    <term name="editorial-director">\u4E3B\u7DE8</term>     
    <term name="illustrator">\u7E6A\u5716\u5E2B</term>
    <term name="interviewer">\u63A1\u8A2A\u54E1</term>
    <term name="recipient">\u6536\u4FE1\u4EBA</term>     
    <term name="translator">\u7FFB\u8B6F\u54E1</term>      
    <term name="editortranslator">\u7DE8\u8B6F\u54E1</term>
    <term name="reviewed-author">\u8A55\u8AD6\u4EBA</term>

    <!-- SHORT ROLE FORMS -->
    <term name="author" form="short">\u4F5C\u8005</term>     
    <term name="director" form="short">\u5C0E\u6F14</term>     
    <term name="editor" form="short">\u7DE8\u8F2F</term> 
    <term name="editorial-director" form="short">\u4E3B\u7DE8</term>     
    <term name="illustrator" form="short">\u7E6A\u5716\u5E2B</term>
    <term name="interviewer" form="short">\u63A1\u8A2A\u54E1</term>
    <term name="recipient" form="short">\u6536\u4FE1\u4EBA</term>     
    <term name="translator" form="short">\u7FFB\u8B6F\u54E1</term>      
    <term name="editortranslator" form="short">\u7DE8\u8B6F\u54E1</term>
    <term name="reviewed-author" form="short">\u8A55\u8AD6\u4EBA</term>


    <!-- VERB ROLE FORMS -->
    <term name="author" form="verb">\u8457</term>
    <term name="container-author" form="verb">\u8457</term>
    <term name="director" form="verb">\u6307\u5C0E</term>
    <term name="editor" form="verb">\u7DE8\u8F2F</term>
    <term name="collection-editor" form="verb">\u9EDE\u6821</term>
    <term name="editorial-director" form="verb">\u4E3B\u7DE8</term>
    <term name="illustrator" form="verb">\u7E6A\u5716</term>
    <term name="interviewer" form="verb">\u63A1\u8A2A</term>
    <term name="recipient" form="verb">\u53D7\u51FD</term>
    <term name="reviewed-author" form="verb">\u9EDE\u8A55</term>
    <term name="translator" form="verb">\u7FFB\u8B6F</term>
    <term name="editortranslator" form="verb">\u7DE8\u8B6F</term>

    <!-- SHORT VERB ROLE FORMS -->
    <term name="director" form="verb-short">\u5C0E</term>
    <term name="editor" form="verb-short">\u7DE8</term>
    <term name="collection-editor" form="verb-short">\u6821</term>
    <term name="editorial-director" form="verb-short">\u7DE8</term>
    <term name="illustrator" form="verb-short">\u7E6A</term>
    <term name="translator" form="verb-short">\u8B6F</term>
    <term name="reviewed-author" form="verb-short">\u8A55</term>

    <!-- LONG MONTH FORMS -->
    <term name="month-01">\u4E00\u6708</term>
    <term name="month-02">\u4E8C\u6708</term>
    <term name="month-03">\u4E09\u6708</term>
    <term name="month-04">\u56DB\u6708</term>
    <term name="month-05">\u4E94\u6708</term>
    <term name="month-06">\u516D\u6708</term>
    <term name="month-07">\u4E03\u6708</term>
    <term name="month-08">\u516B\u6708</term>
    <term name="month-09">\u4E5D\u6708</term>
    <term name="month-10">\u5341\u6708</term>
    <term name="month-11">\u5341\u4E00\u6708</term>
    <term name="month-12">\u5341\u4E8C\u6708</term>

    <!-- SHORT MONTH FORMS -->
    <term name="month-01" form="short">1\u6708</term>
    <term name="month-02" form="short">2\u6708</term>
    <term name="month-03" form="short">3\u6708</term>
    <term name="month-04" form="short">4\u6708</term>
    <term name="month-05" form="short">5\u6708</term>
    <term name="month-06" form="short">6\u6708</term>
    <term name="month-07" form="short">7\u6708</term>
    <term name="month-08" form="short">8\u6708</term>
    <term name="month-09" form="short">9\u6708</term>
    <term name="month-10" form="short">10\u6708</term>
    <term name="month-11" form="short">11\u6708</term>
    <term name="month-12" form="short">12\u6708</term>

    <!-- SEASONS -->
    <term name="season-01">\u6625</term>
    <term name="season-02">\u590F</term>
    <term name="season-03">\u79CB</term>
    <term name="season-04">\u51AC</term>
  </terms>
</locale>
`};try{process.stdout.write(JSON.stringify(Fe(JSON.parse(De.default.readFileSync(0,"utf8")),Ye)))}catch(e){process.stderr.write(String(e.stack||e)),process.exitCode=1}
