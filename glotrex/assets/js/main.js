/* ============================================================
   GLOTREX INTERNATIONAL — main.js v2
   • Word-reveal headings      • Scroll reveal
   • Animated counters         • Accordion
   • Navbar scroll behaviour   • Mobile nav
   • Footer → WhatsApp form    • Product modal
   ============================================================ */

/* ── 1. Navbar ─────────────────────────────────────────── */
const navbar = document.getElementById('navbar');
if (navbar) {
  const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 48);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
}

/* ── 2. Hamburger / Mobile nav ─────────────────────────── */
const hamburger = document.querySelector('.hamburger');
const mobileNav = document.querySelector('.mobile-nav');
const mobileClose = document.querySelector('.mobile-nav-close');
if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    mobileNav.classList.add('open');
    hamburger.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
  const close = () => {
    mobileNav.classList.remove('open');
    hamburger.classList.remove('open');
    document.body.style.overflow = '';
  };
  mobileClose?.addEventListener('click', close);
  mobileNav.querySelectorAll('a').forEach(a => a.addEventListener('click', close));
}

/* ── 3. Active nav link ─────────────────────────────────── */
const page = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a').forEach(a => {
  if (a.getAttribute('href') === page || (page === '' && a.getAttribute('href') === 'index.html'))
    a.classList.add('active');
});

/* ── 4. Word-reveal headings ────────────────────────────── */
function initHeadingAnimations() {
  document.querySelectorAll('.anim-heading').forEach(el => {
    // Walk child nodes and wrap text-node words only
    const fragment = document.createDocumentFragment();
    el.childNodes.forEach(node => {
      if (node.nodeType === Node.TEXT_NODE) {
        const words = node.textContent.split(/(\s+)/);
        words.forEach(part => {
          if (/^\s+$/.test(part)) {
            fragment.appendChild(document.createTextNode(part));
          } else if (part) {
            const span = document.createElement('span');
            span.className = 'word';
            span.textContent = part;
            fragment.appendChild(span);
          }
        });
      } else {
        fragment.appendChild(node.cloneNode(true));
      }
    });
    el.innerHTML = '';
    el.appendChild(fragment);
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('words-visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.anim-heading').forEach(el => obs.observe(el));
}

/* ── 5. Scroll Reveal ───────────────────────────────────── */
function initScrollReveal() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

/* ── 6. Animated counters ───────────────────────────────── */
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const dur = 1600;
  const t0 = performance.now();
  (function tick(now) {
    const p = Math.min((now - t0) / dur, 1);
    const v = (1 - Math.pow(1 - p, 3)) * target;
    el.textContent = (String(target).includes('.') ? v.toFixed(1) : Math.floor(v)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  })(t0);
}

function initCounters() {
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) { animateCounter(e.target); obs.unobserve(e.target); }
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-target]').forEach(el => obs.observe(el));
}

/* ── 7. Accordion ───────────────────────────────────────── */
function initAccordion() {
  document.querySelectorAll('.accordion-trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const body = trigger.nextElementSibling;
      const isOpen = body.classList.contains('open');
      document.querySelectorAll('.accordion-body.open').forEach(b => b.classList.remove('open'));
      document.querySelectorAll('.accordion-trigger.active').forEach(t => t.classList.remove('active'));
      if (!isOpen) { body.classList.add('open'); trigger.classList.add('active'); }
    });
  });
}

/* ── 8. Google Translate ────────────────────────────────── */
const langSel = document.getElementById('langSelect');
if (langSel) {
  langSel.addEventListener('change', e => {
    const el = document.querySelector('.goog-te-combo');
    if (el) { el.value = e.target.value; el.dispatchEvent(new Event('change')); }
  });
}

/* ── 9. Footer form → Email ──────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('footerInquiryForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const btn = this.querySelector('button');
    const originalText = btn.innerText;

    // UI Feedback
    btn.innerText = "Sending...";
    btn.disabled = true;

    // Gather form data
    const formData = {
      name: this.name.value,
      company: this.company.value,
      country: this.country.value,
      contact: this.contact.value,
      products: this.products.value,
      message: this.message.value
    };

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Network response was not ok');

      alert("Message sent successfully!");
      this.reset();
    } catch (err) {
      alert("Failed to send. Please check your connection.");
      console.error(err);
    } finally {
      // Restore UI
      btn.innerText = originalText;
      btn.disabled = false;
    }
  });
});

/* ── 10. Smooth anchor ──────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const t = document.querySelector(a.getAttribute('href'));
    if (t) { e.preventDefault(); t.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  });
});

/* ── 11. Product Modal ──────────────────────────────────── */
const modalOverlay = document.getElementById('productModal');
if (modalOverlay) {
  modalOverlay.querySelector('.modal-close')?.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
}

function openModal(product, categoryLabel, colorClass) {
  const o = document.getElementById('productModal');
  if (!o) return;
  o.querySelector('.modal-product-img').src = product.image;
  o.querySelector('.modal-product-img').alt = product.name;
  o.querySelector('.modal-product-name').textContent = product.name;
  o.querySelector('.modal-category-label').textContent = categoryLabel;
  o.querySelector('.modal-product-desc').textContent = product.description;
  o.querySelector('.modal-specs').innerHTML = Object.entries(product.specs)
    .map(([k, v]) => `<tr><td>${k}</td><td>${v}</td></tr>`).join('');
  o.querySelector('.modal-certs').innerHTML = product.certifications
    .map(c => `<span class="cert-tag cert-tag-default">${c}</span>`).join('');
  // Color stripe on modal header
  const stripe = o.querySelector('.modal-header-stripe');
  if (stripe) {
    stripe.className = 'modal-header-stripe';
    stripe.classList.add(colorClass || 'agri');
  }
  o.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const o = document.getElementById('productModal');
  if (o) { o.classList.remove('open'); document.body.style.overflow = ''; }
}

window.openModal = openModal;
window.closeModal = closeModal;

/* ── Boot ───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initHeadingAnimations();
  initScrollReveal();
  initCounters();
  initAccordion();
});
