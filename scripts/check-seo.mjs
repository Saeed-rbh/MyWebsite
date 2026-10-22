import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { canonicalPath, commercializationSeo, schemaFor, siteUrl } from '../src/data/siteSeo.mjs';
const dist = resolve(process.env.SEO_DIST_DIR || 'dist');
const sitemap = readFileSync(join(dist,'sitemap.xml'),'utf8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>m[1].replaceAll('&amp;','&'));
assert.equal(new Set(urls).size, urls.length, 'Sitemap URLs must be unique');
for (const url of urls) {
  assert.ok(url.startsWith(`${siteUrl}/`), 'Use the canonical domain');
  const path = new URL(url).pathname;
  const html = readFileSync(join(dist, path, 'index.html'),'utf8');
  assert.equal((html.match(/<h1\b/g)||[]).length,1,`${path}: one H1`);
  assert.equal((html.match(/<main\b/g)||[]).length,1,`${path}: one main landmark`);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,`${path}: one canonical`);
  assert.ok(html.includes(`rel="canonical" href="${url.replaceAll('&','&amp;')}"`),`${path}: matching canonical`);
  assert.equal((html.match(/name="description"/g)||[]).length,1,`${path}: one description`);
  for (const schema of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) JSON.parse(schema[1]);
}
const html = readFileSync(join(dist,'venture/index.html'),'utf8');
assert.ok(html.includes(commercializationSeo.title.replaceAll('&','&amp;')));
for (const id of ['my-role','discovery','solution','market','pilot-plan','project-team','capabilities','connect']) assert.ok(html.includes(`id="${id}"`), `Missing current section: ${id}`);
assert.ok(!/style="[^"]*opacity:\s*0/.test(html),'Snapshot content must not depend on animation to be visible');
assert.ok(html.includes('summary_large_image'));
assert.ok(existsSync(join(dist,commercializationSeo.image)),'Sharing image must ship with build');
for (const match of html.matchAll(/(?:src|srcSet)="([^\"]+)"/g)) {
  for (const candidate of match[1].split(',')) {
    const path=candidate.trim().split(' ')[0];
    if (path.startsWith('/images/')) assert.ok(existsSync(join(dist,path)),`Missing image: ${path}`);
  }
}
assert.deepEqual(schemaFor('/venture')['@graph'].find(item=>item['@type']==='Article').author,{'@id':`${siteUrl}/#person`});
const hosting = JSON.parse(readFileSync('vercel.json','utf8'));
for (const path of ['/commercialization', '/commercialization/', '/venture/']) {
  assert.equal(canonicalPath(path), '/venture');
  assert.ok(hosting.redirects.some(rule => rule.source === path && rule.destination === '/venture' && rule.permanent), `Missing permanent redirect: ${path}`);
}
assert.ok(urls.includes(`${siteUrl}/venture`));
assert.ok(!urls.some(url => new URL(url).pathname.startsWith('/commercialization')));
assert.equal(commercializationSeo.title, 'Venture | Saeed Arabha');
assert.ok(hosting.rewrites.findIndex(x=>x.source==='/venture') < hosting.rewrites.findIndex(x=>x.source==='/(.*)'), 'Specific HTML route must precede the SPA fallback');
console.log(`SEO checks passed: ${urls.length} pages, canonical metadata, current case-study content, schema, sharing image, responsive assets, and production route.`);
