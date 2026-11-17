import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {Marked} from 'marked';
import katex from 'katex';
import {parse, parseFragment, serialize} from 'parse5';

const args = process.argv.slice(2);
const rootArg = args.indexOf('--root');
const root = rootArg >= 0 ? path.resolve(args[rootArg + 1]) : path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const check = args.includes('--check');
const build = args.includes('--build');
const packageOnly = args.includes('--package');
const escape = s => String(s).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const read = name => fs.readFile(path.join(root, name), 'utf8');
const exists = async name => { try { await fs.access(name); return true; } catch { return false; } };
const text = n => n.nodeName === '#text' ? n.value : (n.childNodes ?? []).map(text).join('');
function walk(n, fn) { fn(n); for (const child of n.childNodes ?? []) walk(child, fn); }
const attr = (n, key) => n.attrs?.find(a => a.name === key)?.value;
function setAttr(n, key, value) { const a = n.attrs?.find(a => a.name === key); if (a) a.value = value; else (n.attrs ??= []).push({name:key, value}); }
const dateLabel = (date, month) => new Intl.DateTimeFormat('en-US', {month, day:'numeric', year:'numeric', timeZone:'UTC'}).format(new Date(date + 'T12:00:00Z'));

const markdown = new Marked({gfm:true});
markdown.use({extensions:[
  {name:'displayMath', level:'block', start:s=>s.indexOf('$$'), tokenizer(s) {
    const m = /^\$\$\s*\n([\s\S]+?)\n\$\$(?:\n|$)/.exec(s);
    if (m) return {type:'displayMath', raw:m[0], formula:m[1]};
  }, renderer:t=>'<div class="equation">'+katex.renderToString(t.formula,{displayMode:true,output:'mathml',throwOnError:true})+'</div>\n'},
  {name:'inlineMath',level:'inline',start:s=>s.indexOf('$'),tokenizer(s) {
    const m = /^\$([^$\n]+)\$/.exec(s); if(m) return {type:'inlineMath',raw:m[0],formula:m[1]};
  },renderer:t=>katex.renderToString(t.formula,{output:'mathml',throwOnError:true})}
]});

async function main() {
  const articles = JSON.parse(await read('content/articles.json'));
  const slugs = articles.map(a=>a.slug);
  if(new Set(slugs).size!==slugs.length) throw Error('Duplicate article slug in content/articles.json');
  if(packageOnly) { await packageSite(articles); return; }
  const pendingAssets=new Map();
  const cssVersion=createHash('sha256').update(await read('styles.css')).digest('hex').slice(0,12);
  const template=await read('templates/article.html');
  const output=new Map(); const metadata=[];
  for(const article of articles) {
    const {slug,date}=article;
    if(!/^[a-z0-9-]+$/.test(slug) || !/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(date).toISOString().slice(0,10)!==date) throw Error('Invalid article metadata: '+slug);
    if(typeof article.source!=='string' || !article.source) throw Error('Missing source path for '+slug);
    const sourcePath=path.resolve(root,article.source);
    if(!await exists(sourcePath)) throw Error('Article source not found: '+article.source+' (run rendering on the machine with the vault)');
    if(!(await fs.stat(sourcePath)).isFile()) throw Error(`Article source for ${slug} must point to a Markdown file, not a directory: ${article.source}. Include /Draft.md in the source path.`);
    let source=await fs.readFile(sourcePath,'utf8');
    const sourceDir=path.dirname(sourcePath);
    async function queueFile(input,relative) {
      if(!(await fs.stat(input)).isFile()) throw Error(`Expected a file for ${slug}, received a directory: ${input}`);
      const data=await fs.readFile(input);
      if(pendingAssets.has(relative) && !pendingAssets.get(relative).equals(data)) throw Error('Conflicting assets: '+relative);
      pendingAssets.set(relative,data);
    }
    async function queueTree(input,relative) {
      if(!await exists(input)) return;
      for(const e of await fs.readdir(input,{withFileTypes:true})) {
        if(e.name==='__pycache__' || e.name.startsWith('.') || e.name.endsWith('.pyc')) continue;
        if(e.isDirectory()) await queueTree(path.join(input,e.name),relative+'/'+e.name);
        else if(e.isFile()) await queueFile(path.join(input,e.name),relative+'/'+e.name);
      }
    }
    // Companion READMEs may link to files not directly linked by the article.
    await queueTree(path.join(sourceDir,'examples'),`assets/${slug}/examples`);

    const titleMatch=/^# (.+)\r?\n/.exec(source); if(!titleMatch) throw Error('Missing title in '+slug);
    const title=titleMatch[1]; metadata.push({...article,title});
    source=source.slice(titleMatch[0].length).trimStart().replace(/^Jason Deutsch\s*\n\s*/, '');
    if(article.introduction && !source.startsWith('## Introduction')) source='## Introduction\n\n'+source;
    const dom=parseFragment(markdown.parse(source)); const headings=[]; const used=new Set();
    walk(dom,n=>{
      if(n.tagName==='h2' || n.tagName==='h3') {
        let id=text(n).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,''); const base=id; let i=2; while(used.has(id)) id=base+'-'+i++;
        used.add(id);setAttr(n,'id',id); if(n.tagName==='h2') headings.push({id,label:text(n)});
      }
      if(n.tagName==='img') setAttr(n,'loading','lazy');
      if(n.tagName==='a' && /^\/(Users|home)\//.test(attr(n,'href')??'')) {
        const replacement=parseFragment('<span>'+escape(text(n))+' <span class="muted">(local source; not public)</span></span>').childNodes[0];
        Object.assign(n,replacement);
      }
    });
    const localNodes=[];
    walk(dom,n=>{if(n.tagName==='a' || n.tagName==='img') localNodes.push(n);});
    for(const n of localNodes) {
      const key=n.tagName==='img'?'src':'href', link=attr(n,key);
      if(!link || /^(?:[a-z][a-z0-9+.-]*:|#|\/\/)/i.test(link)) continue;
      const u=new URL(link,'https://source.invalid/');
      const decoded=decodeURIComponent(link.split(/[?#]/)[0]);
      let input=path.resolve(sourceDir,decoded);
      if(decoded.startsWith('writing/')) {
        let ancestor=sourceDir;
        while(path.dirname(ancestor)!==ancestor && path.basename(ancestor)!=='writing') ancestor=path.dirname(ancestor);
        input=path.resolve(path.dirname(ancestor),decoded);
      }
      if(!await exists(input) && !decoded.includes('/')) input=path.join(sourceDir,'images',decoded);
      if(!await exists(input)) throw Error(`Missing source asset in ${slug}: ${link}`);
      const rel=path.relative(sourceDir,input);
      const portable=!rel.startsWith('..') && !path.isAbsolute(rel) ? rel : path.basename(input);
      const outputPath=`assets/${slug}/${portable.split(path.sep).join('/')}`;
      await queueFile(input,outputPath);
      setAttr(n,key,'../'+outputPath.split('/').map(encodeURIComponent).join('/')+u.search+u.hash);
    }
    let body=serialize(dom).replace(/<table>([\s\S]*?)<\/table>/g,'<div class="table-scroll"><table>$1</table></div>');
    if(article.contents) body='<nav class="article-toc" aria-label="Table of contents"><h2>Contents</h2><ol>'+headings.map(h=>`<li><a href="#${h.id}">${escape(h.label)}</a></li>`).join('')+'</ol></nav>'+body;
    const vars={TITLE:escape(title),DATE:date,DATE_LABEL:dateLabel(date,'long'),CSS_VERSION:cssVersion,BODY:body};
    const result=template.replace(/\{\{([A-Z_]+)\}\}/g,(_,key)=>{if(!(key in vars)) throw Error('Unknown template field '+key); return vars[key];});
    output.set(`articles/${slug}.html`,result);
  }
  metadata.sort((a,b)=>b.date.localeCompare(a.date));
  const entries=metadata.map(a=>`<div class="writing-entry"><time datetime="${a.date}">${dateLabel(a.date,'short')}</time><h2 class="entry-title"><a href="articles/${a.slug}.html">${escape(a.title)}</a></h2></div>`).join('');
  let index=await read('index.html');
  const section=/<section class="section" id="writing"[\s\S]*?<\/section>/;
  if(!section.test(index)) throw Error('Homepage writing section missing');
  index=index.replace(section,`<section class="section" id="writing" aria-labelledby="writing-label"><h2 class="label" id="writing-label">01 / Writing</h2><div>${entries}</div></section>`).replace(/styles\.css(?:\?v=[^"\s]+)?/g,'styles.css?v='+cssVersion);
  output.set('index.html',index);
  // Validate the actual generated HTML before writing or deploying it.
  const parsed=new Map();
  for(const [name,html] of output) {
    const dom=parse(html),ids=new Set(),links=[];
    walk(dom,n=>{
      const id=attr(n,'id'); if(id) {if(ids.has(id)) throw Error(`Duplicate id ${id} in ${name}`); ids.add(id);}
      for(const key of ['href','src']) {const url=attr(n,key); if(url) links.push(url);}
    });
    parsed.set(name,{ids,links});
  }
  for(const [name,{links}] of parsed) for(const link of links) {
    if(/^[a-z][a-z0-9+.-]*:|^\/\//i.test(link)) continue;
    if(link.startsWith('/')) throw Error(`Nonportable absolute link in ${name}: ${link}`);
    const url=new URL(link,'https://local.invalid/'+name);
    const relative=decodeURIComponent(url.pathname.slice(1));
    const target=path.resolve(root,relative);
    if(!target.startsWith(root+path.sep)) throw Error('Link escapes site: '+link);
    if(!output.has(relative) && !pendingAssets.has(relative) && !await exists(target)) throw Error(`Missing local target in ${name}: ${link}`);
    if(url.hash && parsed.has(relative) && !parsed.get(relative).ids.has(decodeURIComponent(url.hash.slice(1)))) throw Error(`Missing anchor in ${name}: ${link}`);
  }
  const stale=[];
  for(const [name,html] of output) {
    if(!await exists(path.join(root,name)) || await read(name)!==html) stale.push(name);
    if(!check) {await fs.mkdir(path.dirname(path.join(root,name)),{recursive:true});await fs.writeFile(path.join(root,name),html);}
  }
  for(const [name,data] of pendingAssets) {
    const file=path.join(root,name);
    if(!await exists(file) || !(await fs.readFile(file)).equals(data)) stale.push(name);
    if(!check) { await fs.mkdir(path.dirname(file),{recursive:true}); await fs.writeFile(file,data); }
  }
  if(check && stale.length) throw Error('Generated files are stale. Run npm run render:\n'+stale.join('\n'));
  if(!check) await saveReceipt(output);
  if(build) await packageSite(articles);
  console.log(`${check?'Checked':'Rendered'} ${articles.length} articles and homepage; links, anchors, assets, and math validated.${build?' Deployment output: dist/':''}`);
}
async function filesUnder(relative) {
  const result=[];
  if(!await exists(path.join(root,relative))) return result;
  for(const e of await fs.readdir(path.join(root,relative),{withFileTypes:true})) {
    const name=relative+'/'+e.name;
    if(e.isDirectory()) result.push(...await filesUnder(name));
    else if(e.isFile()) result.push(name);
  }
  return result;
}
const digest=async name=>createHash('sha256').update(await fs.readFile(path.join(root,name))).digest('hex');
async function receiptInputs() {
  const names=['content/articles.json','templates/article.html','styles.css','index.html','scripts/render-articles.mjs'];
  for(const name of ['contact.js','CNAME','.nojekyll']) if(await exists(path.join(root,name))) names.push(name);
  return [...names,...await filesUnder('articles'),...await filesUnder('assets')];
}
async function saveReceipt() {
  const files={};for(const name of await receiptInputs()) files[name]=await digest(name);
  await fs.writeFile(path.join(root,'render-state.json'),JSON.stringify({version:1,files},null,2)+'\n');
}
async function packageSite(articles) {
  const state=JSON.parse(await read('render-state.json'));
  const inputs=await receiptInputs();
  if(JSON.stringify(inputs.sort())!==JSON.stringify(Object.keys(state.files).sort())) throw Error('Build inputs changed. Run npm run build locally before pushing.');
  for(const name of inputs) if(!await exists(path.join(root,name)) || await digest(name)!==state.files[name]) throw Error('Unrendered change: '+name+'. Run npm run build locally before pushing.');
  const dist=path.join(root,'dist');await fs.rm(dist,{recursive:true,force:true});await fs.mkdir(dist);
  for(const name of ['index.html','styles.css','contact.js','CNAME','.nojekyll','assets']) if(await exists(path.join(root,name))) await fs.cp(path.join(root,name),path.join(dist,name),{recursive:true});
  await fs.mkdir(path.join(dist,'articles'));
  for(const {slug} of articles) await fs.copyFile(path.join(root,'articles',slug+'.html'),path.join(dist,'articles',slug+'.html'));
  console.log('Verified generated files and packaged dist/ without accessing vault sources.');
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
