#!/usr/bin/env node
/* 把範本 docx 以 base64 內嵌進網頁，產出一個自給自足的 HTML 檔。
   範本改了就重跑一次。 */

const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const src = path.join(DIR, 'web', 'index.html');
const tpl = path.join(DIR, 'template.docx');
const outDir = path.join(DIR, 'output');
const out = path.join(outDir, '請購規範產生器.html');

if (!fs.existsSync(tpl)) { console.error('找不到 template.docx'); process.exit(1); }

const b64 = fs.readFileSync(tpl).toString('base64');
let html = fs.readFileSync(src, 'utf8');
if (!html.includes('__TEMPLATE_B64__')) { console.error('web/index.html 裡找不到 __TEMPLATE_B64__ 佔位符'); process.exit(1); }
html = html.replace('__TEMPLATE_B64__', b64);

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
fs.writeFileSync(out, html, 'utf8');

console.log('✅ 已產生：' + out);
console.log('   範本 ' + Math.round(fs.statSync(tpl).size / 1024) + ' KB → 內嵌後整份 ' +
            Math.round(Buffer.byteLength(html) / 1024) + ' KB');
