import { test } from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../script.js', import.meta.url), 'utf8');
function setup(mode, responses = []) {
  const listeners = {};
  const button = { disabled: true, textContent: '' };
  const status = { hidden: true, dataset: {}, textContent: '', focus() {} };
  const form = { action: 'https://lumixia.cz/api/poptavka.php', resets: 0,
    addEventListener(name, fn) { listeners[name] = fn; }, querySelector() { return button; },
    reportValidity() { return true; }, reset() { this.resets++; } };
  const storage = [], requests = [];
  const document = { documentElement: { dataset: { siteMode: mode } },
    querySelector(selector) { return { '#quoteForm': form, '#formSuccess': status, '#year': {} }[selector] || null; },
    querySelectorAll() { return []; } };
  vm.runInNewContext(source, { document, Date, AbortSignal,
    localStorage: { removeItem(key) { storage.push(key); }, setItem() { throw new Error('PII must not persist'); } },
    FormData: class { entries() { return [['email', 'customer@example.com'], ['message', 'Zpráva']][Symbol.iterator](); } },
    async fetch(url, options) {
      requests.push({ url, options });
      const next = responses.shift();
      if (next instanceof Error) throw next;
      return { ok: next?.ok ?? true, json: async () => next?.body ?? { token: 'test-token' } };
    }
  });
  return { form, button, status, requests, storage, submit: () => listeners.submit({ preventDefault() {} }) };
}
test('preview never sends or persists inquiry data', async () => {
  const s = setup('preview'); await s.submit();
  assert.equal(s.requests.length, 0); assert.equal(s.form.resets, 0);
  assert.match(s.status.textContent, /neodeslala/);
  assert.deepEqual(s.storage, ['lumixia:lastInquiry']);
});
test('successful live request clears form only after accepted response', async () => {
  const s = setup('production', [{body:{token:'test-token'}}, {body:{ok:true}}]); await s.submit();
  assert.equal(s.requests.length, 2); assert.equal(s.form.resets, 1);
  assert.equal(s.status.dataset.state, 'success'); assert.equal(s.button.disabled, false);
  assert.equal(s.requests[1].options.credentials, 'omit');
  assert.equal(JSON.parse(s.requests[1].options.body).token, 'test-token');
});
test('SMTP error preserves visitor input and displays server error as text', async () => {
  const s = setup('production', [{body:{token:'test-token'}}, {ok:false,body:{ok:false,message:'Odeslání se nepodařilo.'}}]); await s.submit();
  assert.equal(s.form.resets, 0); assert.equal(s.status.dataset.state, 'error');
  assert.equal(s.status.textContent, 'Odeslání se nepodařilo.'); assert.equal(s.button.disabled, false);
});
test('lost response never retries automatically or falsely confirms delivery', async () => {
  const s = setup('production', [{body:{token:'test-token'}}, new Error('timeout')]); await s.submit();
  assert.equal(s.requests.length, 2); assert.equal(s.form.resets, 0);
  assert.match(s.status.textContent, /Nepodařilo se potvrdit doručení/);
});
test('double click cannot cause two submissions', async () => {
  const s = setup('production', [{body:{token:'test-token'}}, {body:{ok:true}}]);
  await Promise.all([s.submit(), s.submit()]);
  assert.equal(s.requests.length, 2); assert.equal(s.form.resets, 1);
});
