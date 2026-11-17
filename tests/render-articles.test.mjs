import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const script=path.join(repo,'scripts/render-articles.mjs');
const run=(root,...args)=>spawnSync(process.execPath,[script,'--root',root,...args],{encoding:'utf8'});
async function fixture(t) {
 const root=await fs.mkdtemp(path.join(os.tmpdir(),'article-render-')); t.after(()=>fs.rm(root,{recursive:true,force:true}));
 for(const dir of ['content','templates','assets','scripts','vault']) await fs.mkdir(path.join(root,dir));
 await fs.copyFile(script,path.join(root,'scripts/render-articles.mjs'));
 await fs.copyFile(path.join(repo,'templates/article.html'),path.join(root,'templates/article.html'));
 await fs.writeFile(path.join(root,'styles.css'),'body{color:black}');
 await fs.writeFile(path.join(root,'index.html'),'<section class="section" id="writing"></section><div id="newsletter"></div>');
 await fs.writeFile(path.join(root,'content/articles.json'),JSON.stringify([{slug:'example',source:'vault/example.md',date:'2026-10-01',contents:true,introduction:true}]));
 await fs.writeFile(path.join(root,'vault/example.md'),'# Original title\n\nOpening paragraph.\n\n## Definitions\n\n- A definition\n\n## Evidence\n\n```js\nconst x = "<value>";\n```\n\nInline $X_t$.\n\n$$\nC_t=\\pi(X_t)\n$$\n');
 return root;
}
test('Markdown edits regenerate article and homepage without needing old HTML',async t=>{
 const root=await fixture(t);let result=run(root);assert.equal(result.status,0,result.stderr);
 const file=path.join(root,'vault/example.md');await fs.writeFile(file,(await fs.readFile(file,'utf8')).replace('Original title','Revised title').replace('Opening paragraph.','Updated opening.'));
 result=run(root,'--check');assert.notEqual(result.status,0);assert.match(result.stderr,/stale/);
 result=run(root,'--build');assert.equal(result.status,0,result.stderr);
 const article=await fs.readFile(path.join(root,'dist/articles/example.html'),'utf8');
 assert.match(article,/<h1>Revised title<\/h1>/);assert.match(article,/Updated opening\./);assert.match(article,/datetime="2026-10-01"/);
 assert.match(article,/<math/);assert.match(article,/const x = .*&lt;value&gt;/);
 assert.ok(article.indexOf('article-toc')<article.indexOf('id="introduction"'));
 assert.ok(article.indexOf('id="introduction"')<article.indexOf('id="definitions"'));
 assert.match(await fs.readFile(path.join(root,'dist/index.html'),'utf8'),/Revised title/);
 assert.equal(run(root,'--check').status,0);
 assert.equal(await fs.stat(path.join(root,'dist/content')).catch(()=>null),null);
});
test('missing assets stop publication',async t=>{
 const root=await fixture(t);await fs.appendFile(path.join(root,'vault/example.md'),'\n![Missing](../assets/missing.png)\n');
 const result=run(root,'--build');assert.notEqual(result.status,0);assert.match(result.stderr,/Missing source asset/);
 assert.equal(await fs.stat(path.join(root,'dist')).catch(()=>null),null);
});
test('missing external source fails clearly',async t=>{
 const root=await fixture(t);await fs.rm(path.join(root,'vault/example.md'));
 const result=run(root);assert.notEqual(result.status,0);assert.match(result.stderr,/Article source not found/);
});
test('deployment packages without the vault and rejects stale HTML',async t=>{
 const root=await fixture(t);assert.equal(run(root,'--build').status,0);
 await fs.rm(path.join(root,'vault'),{recursive:true});
 let result=run(root,'--package');assert.equal(result.status,0,result.stderr);
 await fs.appendFile(path.join(root,'articles/example.html'),'unrendered edit');
 result=run(root,'--package');assert.notEqual(result.status,0);assert.match(result.stderr,/Unrendered change/);
});
test('source-relative images and companion files are refreshed automatically',async t=>{
 const root=await fixture(t);await fs.mkdir(path.join(root,'vault/images'));
 await fs.writeFile(path.join(root,'vault/images/figure.svg'),'<svg xmlns="http://www.w3.org/2000/svg"></svg>');
 await fs.appendFile(path.join(root,'vault/example.md'),'\n![Diagram](images/figure.svg)\n');
 let result=run(root);assert.equal(result.status,0,result.stderr);
 assert.match(await fs.readFile(path.join(root,'articles/example.html'),'utf8'),/\.\.\/assets\/example\/images\/figure.svg/);
 await fs.writeFile(path.join(root,'vault/images/figure.svg'),'<svg>changed</svg>');
 result=run(root,'--check');assert.notEqual(result.status,0);assert.match(result.stderr,/stale/);
 assert.equal(run(root).status,0);
 assert.equal(await fs.readFile(path.join(root,'assets/example/images/figure.svg'),'utf8'),'<svg>changed</svg>');
});

test('directory source identifies the article and tells the author how to fix it',async t=>{
 const root=await fixture(t);
 const config=path.join(root,'content/articles.json');
 const items=JSON.parse(await fs.readFile(config,'utf8'));items[0].source='vault';
 await fs.writeFile(config,JSON.stringify(items));
 const result=run(root);assert.notEqual(result.status,0);
 assert.match(result.stderr,/source for example must point to a Markdown file/);
 assert.match(result.stderr,/Include \/Draft.md/);
});
