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
if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    data.createdAt = new Date().toISOString();
    success.hidden = false;
    try {
      localStorage.setItem('lumixia:lastInquiry', JSON.stringify(data));
      success.textContent = '✓ Poptávka je uložená pouze v tomto prohlížeči. Nikam se neodeslala.';
      form.reset();
    } catch (_) {
      success.textContent = 'Poptávku se nepodařilo uložit. Zadané údaje zůstávají ve formuláři; nic se neodeslalo.';
    }
    success.scrollIntoView({behavior:'smooth', block:'center'});
  });
}

document.querySelector('#year').textContent = new Date().getFullYear();
