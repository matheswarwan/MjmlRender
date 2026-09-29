// Loads the real block in headless Chromium with a stand-in Block SDK
// (mock-sdk.js) and checks what the block saves to Content Builder.
//   cd tests && npm install && npx playwright install chromium && npm test
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mock = fs.readFileSync(path.join(root, 'tests/mock-sdk.js'));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png' };
let server, base, browser;

before(async () => {
  server = http.createServer((req, res) => {
    const file = path.join(root, decodeURIComponent(new URL(req.url, 'http://x').pathname));
    if (!file.startsWith(root)) { res.statusCode = 403; res.end(); return; }
    fs.readFile(file, (err, body) => {
      if (err) { res.statusCode = 404; res.end(); return; }
      res.setHeader('content-type', types[path.extname(file)] || 'application/octet-stream');
      res.end(body);
    });
  }).listen(0);
  base = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch();
});
after(async () => { await browser?.close(); server?.close(); });

async function openBlock() {
  const context = await browser.newContext();
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.route(/blocksdk\.js$/, r => r.fulfill({ contentType: 'text/javascript', body: mock }));
  await page.goto(`${base}/index.html`);
  await page.waitForFunction(() => window.__block && window.__block.data.mjml);
  const block = () => page.evaluate(() => ({ content: __block.content, data: __block.data, calls: __block.calls.map(c => c[0]) }));
  const type = async src => {
    await page.evaluate(() => { __block.calls = []; });
    await page.evaluate(s => document.querySelector('.CodeMirror').CodeMirror.setValue(s), src);
    await page.waitForTimeout(900);
  };
  const alert = () => page.evaluate(() => getComputedStyle(document.getElementById('alertBox')).display === 'none' ? '' : document.getElementById('errorMsg').textContent);
  return { page, context, errors, block, type, alert };
}

const TWO_COLUMNS = '<mjml><mj-body><mj-section><mj-column><mj-text>LEFT</mj-text></mj-column><mj-column><mj-text>RIGHT</mj-text></mj-column></mj-section></mj-body></mjml>';

test('a new block starts from Hello World and saves it', async () => {
  const b = await openBlock();
  const { content, data } = await b.block();
  assert.match(data.mjml, /Hello World/);
  assert.match(content, /Hello World/);
  assert.deepEqual(b.errors, []);
  await b.context.close();
});

test('two columns stay side by side (head <style> is kept)', async () => {
  const b = await openBlock();
  await b.type(TWO_COLUMNS);
  const { content } = await b.block();
  assert.match(content, /<style/);
  assert.doesNotMatch(content, /<meta|<title/);
  const view = await b.context.newPage();
  await view.setViewportSize({ width: 700, height: 600 });
  await view.setContent(`<!doctype html><html><body>${content}</body></html>`);
  const [left, right] = await view.evaluate(() => ['LEFT', 'RIGHT'].map(t =>
    [...document.querySelectorAll('div')].filter(d => d.textContent.trim() === t).pop().getBoundingClientRect().toJSON()));
  assert.ok(Math.abs(left.top - right.top) < 5 && right.left > left.left, 'columns are side by side at 700px');
  await b.context.close();
});

test('typing saves once after a pause, not on every keystroke', async () => {
  const b = await openBlock();
  await b.page.evaluate(() => { __block.calls = []; const c = document.querySelector('.CodeMirror').CodeMirror; c.setCursor(c.lineCount(), 0); });
  await b.page.focus('.CodeMirror textarea');
  await b.page.keyboard.type('<!-- twenty-two chars -->', { delay: 30 });
  await b.page.waitForTimeout(900);
  const { calls } = await b.block();
  assert.equal(calls.filter(c => c === 'setContent').length, 1);
  assert.equal(calls.filter(c => c === 'setData').length, 1);
  await b.context.close();
});

test('Generate renders and saves straight away', async () => {
  const b = await openBlock();
  await b.page.evaluate(() => { __block.calls = []; document.querySelector('.CodeMirror').CodeMirror.setValue('<mjml><mj-body><mj-section><mj-column><mj-text>NOW</mj-text></mj-column></mj-section></mj-body></mjml>'); });
  await b.page.click('#renderBtn');
  await b.page.waitForTimeout(100);
  assert.match((await b.block()).content, /NOW/, 'rendered before the 400 ms pause');
  await b.page.waitForTimeout(800);
  assert.equal((await b.block()).calls.filter(c => c === 'setContent').length, 1, 'the pending auto-render was cancelled');
  await b.context.close();
});

test('broken or empty MJML keeps the last good email and says so', async () => {
  const b = await openBlock();
  await b.type(TWO_COLUMNS);
  const good = (await b.block()).content;
  for (const src of ['', 'just some text', '<mjml><mj-body><mj-include path="./x.mjml"/></mj-body></mjml>']) {
    await b.type(src);
    const { content, data } = await b.block();
    assert.equal(content, good, `content unchanged for ${JSON.stringify(src)}`);
    assert.equal(data.mjml, src, 'the MJML is still saved');
    assert.match(await b.alert(), /last version that rendered/);
  }
  assert.match(await b.alert(), /mj-include is not supported/);
  await b.context.close();
});

test('validation errors are shown as text', async () => {
  const b = await openBlock();
  await b.type('<mjml><mj-body><mj-section><mj-column><mj-text>ok</mj-text></mj-column><mj-bogus/></mj-section></mj-body></mjml>');
  assert.match(await b.alert(), /Line 1: \[mj-bogus\] Element mj-bogus doesn't exist/);
  await b.context.close();
});

test('nothing in the MJML runs inside the editor', async () => {
  const b = await openBlock();
  await b.type('<mjml><mj-body><mj-raw><img src=x onerror="window.__ran=1"></mj-raw></mj-body></mjml>');
  assert.equal(await b.page.evaluate(() => window.__ran ?? null), null);
  await b.context.close();
});

test('a bare snippet is wrapped for rendering but saved as typed', async () => {
  const b = await openBlock();
  const snippet = '<mj-section><mj-column><mj-text>BARE</mj-text></mj-column></mj-section>';
  await b.type(snippet);
  const { content, data } = await b.block();
  assert.match(content, /BARE/);
  assert.equal(data.mjml, snippet);
  await b.context.close();
});

test('reopening restores the saved MJML, and the snippets tab is on this host', async () => {
  const b = await openBlock();
  await b.type(TWO_COLUMNS);
  await b.page.reload();
  await b.page.waitForTimeout(1200);
  const state = await b.page.evaluate(() => ({
    editor: document.querySelector('.CodeMirror').CodeMirror.getValue(),
    tab: __block.calls.find(c => c[0] === 'new')[1].tabs[1].url,
  }));
  assert.equal(state.editor, TWO_COLUMNS);
  assert.equal(state.tab, `${base}/CodeSnippets.html`);
  assert.deepEqual(b.errors, []);
  await b.context.close();
});
