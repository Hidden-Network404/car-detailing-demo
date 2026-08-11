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

function renderBusiness(data) {
  const { business, contacts } = data;

  document.title = business.name;
  document.getElementById('brand').innerHTML =
    business.name.split(' ').length > 1
      ? business.name.replace(/(\S+)$/, '<span>$1</span>')
      : `<span>${escapeHtml(business.name)}</span>`;

  document.getElementById('hero-city').textContent = business.city || '';
  document.getElementById('hero-sub').textContent = business.tagline || '';
  document.getElementById('contact-about').textContent = business.about || '';
  document.getElementById('footer-text').textContent =
    `© ${new Date().getFullYear()} ${business.name}`;

  const bookHref = contacts.telegram || contacts.whatsapp || `tel:${contacts.phone}`;
  document.getElementById('nav-cta').href = bookHref;
  document.getElementById('hero-cta-primary').href = bookHref;
}

function renderServices(services) {
  const el = document.getElementById('services-list');
  el.innerHTML = services.map((s, i) => `
    <article class="ticket">
      <div class="ticket-no">WO-${String(i + 1).padStart(2, '0')}</div>
      <h3>${escapeHtml(s.title)}</h3>
      <p>${escapeHtml(s.desc)}</p>
      <div class="ticket-price">${escapeHtml(s.price)}</div>
    </article>
  `).join('');
}

function renderGallery(items) {
  const el = document.getElementById('gallery-list');
  if (!items || items.length === 0) {
    el.innerHTML = `<p style="color:var(--muted)">Photos and videos of completed work will appear here.</p>`;
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

function renderReviews(reviews) {
  const el = document.getElementById('reviews-list');
  if (!reviews || reviews.length === 0) {
    el.innerHTML = `<p style="color:var(--muted)">Client reviews will appear here.</p>`;
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

function renderContacts(contacts) {
  const el = document.getElementById('contact-actions');
  const buttons = [];
  if (contacts.phone) buttons.push(`<a class="btn btn-primary" href="tel:${escapeHtml(contacts.phone)}">Call: ${escapeHtml(contacts.phoneDisplay || contacts.phone)}</a>`);
  if (contacts.telegram) buttons.push(`<a class="btn btn-ghost" href="${escapeHtml(contacts.telegram)}" target="_blank" rel="noopener">Telegram</a>`);
  if (contacts.whatsapp) buttons.push(`<a class="btn btn-ghost" href="${escapeHtml(contacts.whatsapp)}" target="_blank" rel="noopener">WhatsApp</a>`);
  if (contacts.instagram) buttons.push(`<a class="btn btn-ghost" href="${escapeHtml(contacts.instagram)}" target="_blank" rel="noopener">Instagram</a>`);
  el.innerHTML = buttons.join('');
}

function setupBookingForm(bookingForm) {
  const form = document.getElementById('booking-form');
  const status = document.getElementById('form-status');
  const submitBtn = document.getElementById('form-submit');

  if (!bookingForm || !bookingForm.enabled) {
    // form not configured yet — hide it, messenger buttons above still work
    form.style.display = 'none';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // honeypot: real visitors never fill this hidden field
    const honeypot = document.getElementById('f-company').value;
    if (honeypot) {
      status.textContent = 'Thanks! We\'ll be in touch shortly.';
      form.reset();
      return;
    }

    const name = document.getElementById('f-name').value.trim();
    const contact = document.getElementById('f-contact').value.trim();
    const message = document.getElementById('f-message').value.trim();

    if (!name || !contact) return;

    submitBtn.disabled = true;
    status.textContent = 'Sending…';

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
      status.textContent = 'Thanks! We\'ll be in touch shortly.';
      form.reset();
    } catch (err) {
      console.error(err);
      status.textContent = 'Something went wrong — please use one of the contact buttons above instead.';
    } finally {
      submitBtn.disabled = false;
    }
  });
}

loadContent()
  .then(data => {
    renderBusiness(data);
    renderServices(data.services || []);
    renderGallery(data.gallery || []);
    renderReviews(data.reviews || []);
    renderContacts(data.contacts || {});
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
