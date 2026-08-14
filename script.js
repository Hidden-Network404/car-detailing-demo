const LANG_KEY = 'buk-detailing-lang';
let siteData = null;
let currentLang = 'uk';

async function loadContent() {
  const res = await fetch('content.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load content.json');
  return res.json();
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str ?? '';
  return div.innerHTML;
}

function pickLang(data) {
  const saved = localStorage.getItem(LANG_KEY);
  if (saved && data.i18n[saved]) return saved;
  return data.defaultLang && data.i18n[data.defaultLang] ? data.defaultLang : Object.keys(data.i18n)[0];
}

function renderBusiness(t) {
  const { business } = t;
  document.title = business.name;
  document.getElementById('brand').innerHTML =
    business.name.split(' ').length > 1
      ? business.name.replace(/(\S+)$/, '<span>$1</span>')
      : `<span>${escapeHtml(business.name)}</span>`;
  document.getElementById('footer-text').textContent = `© ${new Date().getFullYear()} ${t.footer}`;
}

function renderNav(t, contacts) {
  document.getElementById('nav-cta').textContent = t.nav.bookNow;
  const bookHref = contacts.telegram || contacts.whatsapp || (contacts.phone ? `tel:${contacts.phone}` : '#contact');
  document.getElementById('nav-cta').href = bookHref;
  document.getElementById('hero-cta-primary').href = bookHref;
  document.getElementById('hero-cta-primary').textContent = t.hero.ctaPrimary;
  document.getElementById('hero-cta-secondary').textContent = t.hero.ctaSecondary;
}

function renderHero(t, business) {
  document.getElementById('hero-eyebrow').firstChild.textContent = t.hero.eyebrow + ' · ';
  document.getElementById('hero-city').textContent = business.city || '';
  document.getElementById('hero-title').childNodes[0].textContent = t.hero.titleLine1;
  document.getElementById('hero-title-em').textContent = t.hero.titleEm;
  document.getElementById('hero-sub').textContent = t.hero.sub;
}

function renderMission(t) {
  document.getElementById('mission-tag').textContent = t.mission.tag;
  document.getElementById('mission-heading').textContent = t.mission.heading;
  document.getElementById('mission-paragraphs').innerHTML =
    t.mission.paragraphs.map(p => `<p>${escapeHtml(p)}</p>`).join('');
  document.getElementById('mission-quote').textContent = t.mission.quote;

  document.getElementById('wem-label').textContent = t.wem.label;
  document.getElementById('wem-text').textContent = t.wem.text;

  document.getElementById('notes-list').innerHTML = t.notes.map(n => `
    <div class="note">
      <div class="note-title">${escapeHtml(n.title)}</div>
      <p>${escapeHtml(n.text)}</p>
    </div>
  `).join('');
}

function renderServices(t) {
  document.getElementById('services-tag').textContent = t.services.tag;
  document.getElementById('services-heading').textContent = t.services.heading;

  const el = document.getElementById('services-list');
  el.innerHTML = t.services.items.map((s, i) => `
    <article class="ticket${s.featured ? ' ticket-featured' : ''}">
      ${s.featured ? `<div class="ticket-stamp">${escapeHtml(s.featuredLabel || '')}</div>` : ''}
      <div class="ticket-no">WO-${String(i + 1).padStart(2, '0')}</div>
      <h3>${escapeHtml(s.title)}</h3>
      ${s.duration ? `<div class="ticket-duration">${escapeHtml(s.duration)}</div>` : ''}
      <ul class="ticket-desc">
        ${(s.desc || []).map(line => `<li>${escapeHtml(line)}</li>`).join('')}
      </ul>
      <div class="ticket-price">${escapeHtml(s.price)}</div>
    </article>
  `).join('');
}

function renderGallery(t, items) {
  document.getElementById('gallery-tag').textContent = t.gallerySection.tag;
  document.getElementById('gallery-heading').textContent = t.gallerySection.heading;

  const el = document.getElementById('gallery-list');
  if (!items || items.length === 0) {
    el.innerHTML = `<p style="color:var(--muted)">${escapeHtml(t.gallerySection.empty)}</p>`;
    return;
  }
  el.innerHTML = items.map(item => {
    const media = item.type === 'video'
      ? `<video src="${escapeHtml(item.src)}" muted loop playsinline autoplay></video>`
      : `<img src="${escapeHtml(item.src)}" alt="${escapeHtml(item.caption || '')}" loading="lazy"
           onerror="this.closest('.media').innerHTML='Add photo:<br>${escapeHtml(item.src)}'">`;
    return `
      <div class="gallery-item">
        <div class="media">${media}</div>
        ${item.caption ? `<div class="gallery-caption">${escapeHtml(item.caption)}</div>` : ''}
      </div>
    `;
  }).join('');
}

function renderReviews(t, reviews) {
  document.getElementById('reviews-tag').textContent = t.reviewsSection.tag;
  document.getElementById('reviews-heading').textContent = t.reviewsSection.heading;

  const el = document.getElementById('reviews-list');
  if (!reviews || reviews.length === 0) {
    el.innerHTML = `<p style="color:var(--muted)">${escapeHtml(t.reviewsSection.empty)}</p>`;
    return;
  }
  el.innerHTML = reviews.map(r => `
    <div class="review">
      <div class="review-stars">${'★'.repeat(r.rating || 5)}${'☆'.repeat(5 - (r.rating || 5))}</div>
      <p>${escapeHtml(r.text)}</p>
      <div class="review-name">${escapeHtml(r.name)}</div>
    </div>
  `).join('');
}

function renderContact(t, contacts) {
  document.getElementById('contact-tag').textContent = t.contact.tag;
  document.getElementById('contact-heading').textContent = t.contact.heading;
  document.getElementById('contact-about').textContent = t.contact.sub;

  const el = document.getElementById('contact-actions');
  const buttons = [];
  if (contacts.phone) buttons.push(`<a class="btn btn-primary" href="tel:${escapeHtml(contacts.phone)}">${escapeHtml(contacts.phoneDisplay || contacts.phone)}</a>`);
  if (contacts.email) buttons.push(`<a class="btn btn-primary" href="mailto:${escapeHtml(contacts.email)}">${escapeHtml(t.contact.emailLabel)}: ${escapeHtml(contacts.email)}</a>`);
  if (contacts.telegram) buttons.push(`<a class="btn btn-ghost" href="${escapeHtml(contacts.telegram)}" target="_blank" rel="noopener">Telegram</a>`);
  if (contacts.whatsapp) buttons.push(`<a class="btn btn-ghost" href="${escapeHtml(contacts.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (contacts.instagram) buttons.push(`<a class="btn btn-ghost" href="${escapeHtml(contacts.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  el.innerHTML = buttons.join('');
}

function renderForm(t) {
  document.getElementById('form-label-name').textContent = t.form.name;
  document.getElementById('form-label-contact').textContent = t.form.contact;
  document.getElementById('form-label-message').textContent = t.form.message;
  document.getElementById('form-label-company').textContent = t.form.company;
  document.getElementById('form-submit').textContent = t.form.submit;
}

function renderLangToggle(lang) {
  document.querySelectorAll('#lang-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

function render(lang) {
  currentLang = lang;
  const t = siteData.i18n[lang];
  document.documentElement.lang = lang;

  renderBusiness(t);
  renderNav(t, siteData.contacts);
  renderHero(t, t.business);
  renderMission(t);
  renderServices(t);
  renderGallery(t, siteData.gallery || []);
  renderReviews(t, siteData.reviews || []);
  renderContact(t, siteData.contacts);
  renderForm(t);
  renderLangToggle(lang);
}

function setupLangToggle() {
  document.getElementById('lang-toggle').addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-lang]');
    if (!btn) return;
    const lang = btn.dataset.lang;
    if (lang === currentLang || !siteData.i18n[lang]) return;
    localStorage.setItem(LANG_KEY, lang);
    render(lang);
  });
}

function setupBookingForm(bookingForm) {
  const form = document.getElementById('booking-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  if (!bookingForm || !bookingForm.enabled) {
    // form not configured yet — hide it, the email button above still works
    form.style.display = 'none';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot: real visitors never fill this hidden field
    const honeypot = document.getElementById('f-company').value;
    const t = siteData.i18n[currentLang].form;
    if (honeypot) {
      status.textContent = t.thanks;
      form.reset();
      return;
    }

    const name = document.getElementById('f-name').value.trim();
    const contact = document.getElementById('f-contact').value.trim();
    const message = document.getElementById('f-message').value.trim();

    if (!name || !contact) return;

    submitBtn.disabled = true;
    status.textContent = t.sending;

    const text =
      `New booking request\n` +
      `Name: ${name}\n` +
      `Contact: ${contact}\n` +
      `Message: ${message || '—'}`;

    try {
      const res = await fetch(`https://api.telegram.org/bot${bookingForm.botToken}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: bookingForm.chatId, text }),
      });
      if (!res.ok) throw new Error('Telegram API error');
      status.textContent = t.thanks;
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = t.error;
    } finally {
      submitBtn.disabled = false;
    }
  });
}

loadContent()
  .then(data => {
    siteData = data;
    currentLang = pickLang(data);
    setupLangToggle();
    render(currentLang);
    setupBookingForm(data.bookingForm);
  })
  .catch(err => {
    console.error(err);
    document.body.innerHTML = `<div style="padding:40px;font-family:monospace">
      Failed to load content.json.<br>
      If you opened this file directly (file://) that's expected — browsers block this kind of request.<br>
      View the site through a local server (see README) or on GitHub Pages.
    </div>`;
  });
