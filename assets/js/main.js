/* Shared shell and authored translations. Only the language travels in the URL. */
(() => {
  const params = new URLSearchParams(location.search);
  let language = params.get('lang') === 'en' ? 'en' : 'it';
  const page = location.pathname.split('/').pop() || 'index.html';
  const t = (it, en) => `<span lang="it">${it}</span><span lang="en" hidden>${en}</span>`;
  const links = () => [
    ['index.html', 'Home', 'Home'],
    ['index.html#university', 'Ateneo', 'University'],
    ['staff.html', 'Personale', 'Staff'],
    ['publications.html', 'Pubblicazioni', 'Publications'],
    ['apply.html', 'Candidature', 'Apply']
  ].map(([href, it, en]) => `<a href="${href}" ${href === page ? 'aria-current="page"' : ''}>${t(it, en)}</a>`).join('');
  document.getElementById('site-header').innerHTML = `
    <div class="utility"><div class="container"><span>${t('Via Roma 61/D · Vezzano (TN) · Trentino, Italia', 'Via Roma 61/D · Vezzano (TN) · Trentino, Italy')}</span><nav class="language-nav" aria-label="Language / Lingua"><a href="?lang=it" data-language="it" lang="it">ITALIANO</a><span aria-hidden="true">|</span><a href="?lang=en" data-language="en" lang="en">ENGLISH</a></nav></div></div>
    <div class="container header-main"><a class="brand" href="index.html"><img src="assets/images/logo.png" width="1254" height="1254" alt="UNIBV"><span>${t('Università<br>La Borgata Vezzano', 'University of<br>La Borgata Vezzano')}<small>SCIENTIA · CULTURA · FUTURUM</small></span></a><button class="menu-toggle" type="button" aria-expanded="false" aria-controls="main-nav">${t('Menu', 'Menu')} <span aria-hidden="true">☰</span></button><nav id="main-nav" aria-label="${language === 'it' ? 'Navigazione principale' : 'Main navigation'}">${links()}</nav></div>`;
  document.getElementById('site-footer').innerHTML = `<div class="container footer-grid"><div><p class="footer-title">${t('Università La Borgata Vezzano', 'University of La Borgata Vezzano')}</p><p>${t('Via Roma 61/D<br>Vezzano (TN)<br>Trentino, Italia', 'Via Roma 61/D<br>Vezzano (TN)<br>Trentino, Italy')}</p><p class="footer-motto">Scientia · Cultura · Futurum</p></div><nav aria-label="Footer">${links()}</nav></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} UNIBV</span><p>${t('UNIBV è un progetto satirico e un’università immaginaria.', 'UNIBV is a satirical project and a fictional university.')}</p></div>`;
  const titles = {
    'index.html': ['Università La Borgata Vezzano', 'University of La Borgata Vezzano'],
    'staff.html': ['Personale', 'Staff'],
    'publications.html': ['Pubblicazioni', 'Publications'],
    'apply.html': ['Candidatura al Dottorato', 'PhD Application']
  };
  const descriptions = {
    'index.html': ['UNIBV: ricerca, formazione e cultura. Via Roma 61/D, Vezzano (TN), Trentino, Italia.', 'UNIBV: research, education and culture. Via Roma 61/D, Vezzano (TN), Trentino, Italy.'],
    'staff.html': ['Personale accademico UNIBV: fisica, matematica e metodi numerici. Via Roma 61/D, Vezzano (TN), Trentino, Italia.', 'UNIBV academic staff: physics, mathematics and numerical methods. Via Roma 61/D, Vezzano (TN), Trentino, Italy.'],
    'publications.html': ['Pubblicazioni UNIBV: contributi di ricerca in fisica e matematica.', 'UNIBV publications: research contributions in physics and mathematics.'],
    'apply.html': ['Candidatura al Dottorato UNIBV. Verifica locale senza pagamenti o trasmissione di dati.', 'UNIBV PhD application. Local validation without payments or data transmission.']
  };
  function translate() {
    document.documentElement.lang = language;
    document.querySelectorAll('main [lang], .skip-link [lang], #site-header span[lang], #site-footer [lang]').forEach(el => { el.hidden = el.lang !== language; });
    document.querySelectorAll('[data-it][data-en]').forEach(el => { el.textContent = el.dataset[language]; });
    document.querySelectorAll('[data-alt-it][data-alt-en]').forEach(el => { el.alt = el.dataset[language === 'it' ? 'altIt' : 'altEn']; });
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (href.startsWith('#')) return;
      const url = new URL(href, location.href);
      if (url.origin !== location.origin || !/\.html$/.test(url.pathname)) return;
      url.searchParams.set('lang', link.dataset.language || language);
      link.setAttribute('href', `${url.pathname.split('/').pop() || 'index.html'}${url.search}${url.hash}`);
    });
    document.querySelectorAll('[data-language]').forEach(link => {
      if (link.dataset.language === language) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
    document.getElementById('main-nav').setAttribute('aria-label', language === 'it' ? 'Navigazione principale' : 'Main navigation');
    document.title = `${(titles[page] || titles['index.html'])[language === 'en' ? 1 : 0]} | UNIBV`;
    document.querySelector('meta[name="description"]').content = (descriptions[page] || descriptions['index.html'])[language === 'en' ? 1 : 0];
    document.querySelectorAll('input[type="file"]').forEach(validatePDF);
  }
  document.querySelectorAll('[data-language]').forEach(link => link.addEventListener('click', event => {
    event.preventDefault();
    language = link.dataset.language;
    const url = new URL(location.href);
    url.searchParams.set('lang', language);
    history.replaceState(null, '', url);
    translate();
  }));
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('main-nav');
  function closeMenu() { toggle.setAttribute('aria-expanded', 'false'); nav.classList.remove('is-open'); }
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  nav.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('is-open')) { closeMenu(); toggle.focus(); } });
  document.querySelectorAll('.staff-photo').forEach(img => {
    const show = () => { img.hidden = false; img.previousElementSibling.hidden = true; };
    img.addEventListener('load', show);
    img.addEventListener('error', () => { img.hidden = true; img.previousElementSibling.hidden = false; });
    if (img.complete && img.naturalWidth) show();
  });
  function validatePDF(input) {
    const file = input.files && input.files[0];
    const valid = !file || (/\.pdf$/i.test(file.name) && (!file.type || file.type === 'application/pdf'));
    input.setCustomValidity(valid ? '' : (language === 'it' ? 'Seleziona un file PDF (.pdf).' : 'Please select a PDF file (.pdf).'));
  }
  const form = document.getElementById('application-form');
  if (form) {
    /* Local development/display counter only: NOT a global count of applications.
       Store only an aggregate integer, never applicant fields or file metadata.
       Exposed for developers in the console; no counter UI or analytics. */
    const counterKey = 'unibv.localApplicationAttempts';
    let attemptCount = 0;
    try {
      const stored = Number(localStorage.getItem(counterKey));
      if (Number.isSafeInteger(stored) && stored >= 0) attemptCount = stored;
    } catch { /* Keep an in-memory counter when browser storage is unavailable. */ }
    window.unibvDevelopment = Object.freeze({ getApplicationAttemptCount: () => attemptCount });
    /* No action, fetch, FileReader, personal-data storage or payment integration. */
    form.reset();
    document.getElementById('application-fields').disabled = false;
    form.querySelectorAll('input[type="file"]').forEach(input => input.addEventListener('change', () => validatePDF(input)));
    form.addEventListener('submit', event => {
      event.preventDefault();
      form.querySelectorAll('input[type="file"]').forEach(validatePDF);
      if (!form.reportValidity()) return;
      form.reset();
      const dialog = document.getElementById('reveal');
      dialog.showModal();
      if (attemptCount < Number.MAX_SAFE_INTEGER) attemptCount += 1;
      try { localStorage.setItem(counterKey, String(attemptCount)); }
      catch { /* Local confirmation still works when storage is unavailable. */ }
      document.getElementById('close-reveal').focus();
    });
    document.getElementById('close-reveal').addEventListener('click', () => document.getElementById('reveal').close());
    window.addEventListener('pagehide', () => form.reset());
    window.addEventListener('pageshow', () => { form.reset(); form.querySelectorAll('input[type="file"]').forEach(validatePDF); });
  }
  translate();
})();
