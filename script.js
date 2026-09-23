const menuToggle = document.querySelector('.menu-toggle');
const mobileNav = document.querySelector('.mobile-nav');

if (menuToggle && mobileNav) {
  menuToggle.addEventListener('click', () => {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!expanded));
    menuToggle.setAttribute('aria-label', expanded ? 'Otevřít menu' : 'Zavřít menu');
    mobileNav.hidden = expanded;
  });
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Otevřít menu');
    mobileNav.hidden = true;
  }));
}

// Prefill the enquiry type when a product link is clicked.
document.querySelectorAll('[data-product]').forEach(link => {
  link.addEventListener('click', () => {
    const product = link.dataset.product || '';
    const type = document.querySelector('#type');
    if (!type) return;
    const option = [...type.options].find(o => o.value.toLowerCase().endsWith(product.toLowerCase()));
    if (option) type.value = option.value;
  });
});

const form = document.querySelector('#quoteForm');
// Carry the visitor's intended use into the existing enquiry form.
document.querySelectorAll('[data-occasion]').forEach(link => {
  link.addEventListener('click', () => {
    const occasion = document.querySelector('#occasion');
    const value = link.dataset.occasion;
    if (occasion && [...occasion.options].some(option => option.value === value)) {
      occasion.value = value;
    }
  });
});

const success = document.querySelector('#formSuccess');
// Remove only the obsolete prototype's saved inquiry; new inquiries stay in memory.
try { localStorage.removeItem('lumixia:lastInquiry'); } catch (_) { /* Storage may be disabled. */ }
if (form) {
  const submit = form.querySelector('button[type="submit"]');
  const fields = form.querySelector('#quoteFields');
  const statusTitle = document.querySelector('#formStatusTitle');
  const statusMessage = document.querySelector('#formStatusMessage');
  const statusIcon = document.querySelector('#formStatusIcon');
  const reset = document.querySelector('#formReset');
  const live = document.documentElement.dataset.siteMode === 'production';
  let token = '';
  let tokenPromise;
  let pending = false;
  const showStatus = (text, state) => {
    const sent = state === 'success';
    fields.hidden = sent;
    success.hidden = false;
    success.dataset.state = state;
    statusTitle.textContent = sent ? 'Poptávka je odeslaná.' : state === 'error' ? 'Odeslání se nepodařilo potvrdit.' : 'Toto je pouze náhled.';
    statusIcon.textContent = sent ? '✓' : state === 'error' ? '!' : 'i';
    statusMessage.textContent = text;
    reset.hidden = !sent;
    success.focus({ preventScroll: true });
    success.scrollIntoView({ block: 'center' });
  };
  reset.addEventListener('click', () => {
    success.hidden = true;
    reset.hidden = true;
    fields.hidden = false;
    form.querySelector('#occasion').focus();
  });
  const prepareToken = async () => {
    if (!live || token) return;
    if (!tokenPromise) tokenPromise = (async () => {
      const response = await fetch(form.action, { credentials: 'omit', cache: 'no-store', headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(12000) });
      const data = await response.json();
      if (!response.ok || typeof data.token !== 'string') throw new Error('unavailable');
      token = data.token;
    })().finally(() => { tokenPromise = undefined; });
    return tokenPromise;
  };
  submit.disabled = false;
  if (!live) submit.textContent = 'Vyzkoušet formulář';
  form.addEventListener('focusin', () => { prepareToken().catch(() => {}); });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (pending || fields.hidden || !form.reportValidity()) return;
    if (!live) {
      showStatus('Toto je náhled před spuštěním. Poptávka se neodeslala a údaje se neukládají.', 'info');
      return;
    }
    pending = true;
    success.hidden = true;
    submit.disabled = true;
    submit.textContent = 'Odesíláme…';
    let sending = false;
    try {
      await prepareToken();
      const data = Object.fromEntries(new FormData(form).entries());
      data.token = token;
      sending = true;
      const response = await fetch(form.action, {
        method: 'POST', credentials: 'omit', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data), signal: AbortSignal.timeout(30000)
      });
      const result = await response.json();
      token = '';
      if (!response.ok || result.ok !== true) {
        showStatus(result.message || 'Poptávku se nepodařilo odeslat. Napište nám prosím e-mailem.', 'error');
      } else {
        form.reset();
        showStatus('Děkujeme za váš zájem. Ozveme se vám na uvedený e-mail a domluvíme podrobnosti vaší akce.', 'success');
      }
    } catch (_) {
      token = '';
      showStatus(sending
        ? 'Nepodařilo se potvrdit doručení. Údaje zůstaly ve formuláři. Než poptávku odešlete znovu, ověřte ji u nás na poptavky@lumixia.cz.'
        : 'Formulář se nyní nemůže připojit. Zkuste to později nebo napište na poptavky@lumixia.cz. Údaje zůstaly ve formuláři.', 'error');
    } finally {
      pending = false;
      submit.disabled = false;
      submit.textContent = 'Odeslat nezávaznou poptávku';
    }
  });
}

const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();
