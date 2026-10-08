fetch('/data.json')
  .then((r) => r.json())
  .then((data) => {
    const waLink = `https://wa.me/${data.contact.whatsapp}`;
    document.querySelectorAll('#nav-wa, #hero-wa, #footer-wa').forEach((el) => (el.href = waLink));

    document.getElementById('hero-name').textContent = data.businessName;
    document.getElementById('hero-tagline').textContent = data.tagline;
    document.getElementById('hero-about').textContent = data.about;
    document.getElementById('hero-hours').textContent = data.hours;

    const tickerItems = data.promo.length
      ? data.promo.map((p) => `${p.title} — ${p.desc}`)
      : ['Pantau terus halaman ini untuk promo terbaru'];
    const tickerTrack = document.getElementById('ticker-track');
    tickerTrack.innerHTML = tickerItems.map((t) => `<span>${t}</span>`).join('');

    const tiles = document.getElementById('tiles');
    tiles.innerHTML = data.products
      .map(
        (p) => `
      <div class="tile">
        <span class="tile-price">${p.price}</span>
        <h3>${p.name}</h3>
        <p>${p.desc}</p>
      </div>`
      )
      .join('');

    if (data.promo.length) {
      document.getElementById('promo-title').textContent = data.promo[0].title;
      document.getElementById('promo-desc').textContent = data.promo[0].desc;
    } else {
      document.getElementById('promo-section').style.display = 'none';
    }

    document.getElementById('faq-list').innerHTML = data.faq
      .map(
        (f) => `
      <div class="faq-item">
        <h3>${f.q}</h3>
        <p>${f.a}</p>
      </div>`
      )
      .join('');

    document.getElementById('footer-name').textContent = data.businessName;
    document.getElementById('footer-address').textContent = data.contact.address;
    document.getElementById('footer-hours').textContent = data.hours;
    document.getElementById('footer-ig').textContent = data.contact.instagram;
  });
