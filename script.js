/* ============================================================
   FlowMaster Plumbing Nairobi — script.js
   Google Sheets booking capture via Apps Script Web App
   ============================================================

   SETUP:
   1. Deploy Code.gs as a Google Apps Script Web App.
   2. Paste your Web App URL into SHEETS_WEBHOOK_URL below.
   ============================================================ */

'use strict';

// ─── CONFIGURATION ────────────────────────────────────────────
const SHEETS_WEBHOOK_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
// ──────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileNav();
  initSmoothScroll();
  initBookingForm();
  initScrollReveal();
  initUrgencyButton();
  setYear();
});


// ===== STICKY HEADER =====
function initHeader() {
  const header = document.getElementById('header');
  if (!header) return;
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


// ===== MOBILE NAV =====
function initMobileNav() {
  const hamburger  = document.getElementById('hamburger');
  const mobNav     = document.getElementById('mobNav');
  const mobClose   = document.getElementById('mobClose');
  const mobOverlay = document.getElementById('mobOverlay');
  const mLinks     = document.querySelectorAll('.m-link');

  if (!hamburger || !mobNav) return;

  const open = () => {
    mobNav.classList.add('open');
    mobOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    hamburger.setAttribute('aria-expanded', 'true');
  };
  const close = () => {
    mobNav.classList.remove('open');
    mobOverlay.classList.remove('active');
    document.body.style.overflow = '';
    hamburger.setAttribute('aria-expanded', 'false');
  };

  hamburger.addEventListener('click', open);
  mobClose?.addEventListener('click', close);
  mobOverlay?.addEventListener('click', close);
  mLinks.forEach(l => l.addEventListener('click', close));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobNav.classList.contains('open')) close();
  });
}


// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = document.getElementById('header')?.offsetHeight ?? 70;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


// ===== BOOKING FORM — GOOGLE SHEETS INTEGRATION =====
function initBookingForm() {
  const form      = document.getElementById('bookingForm');
  const status    = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // ── Collect fields ──────────────────────────────────────
    const name     = document.getElementById('name')?.value.trim();
    const phone    = document.getElementById('phone')?.value.trim();
    const service  = document.getElementById('service')?.value;
    const urgency  = document.getElementById('urgency')?.value   || 'normal';
    const location = document.getElementById('location')?.value.trim();
    const notes    = document.getElementById('notes')?.value.trim() || '—';

    // ── Validation ──────────────────────────────────────────
    if (!name)     return showStatus('error', 'Please enter your full name.');
    if (!phone)    return showStatus('error', 'Please enter your phone number.');
    if (!service)  return showStatus('error', 'Please select the service you need.');
    if (!location) return showStatus('error', 'Please enter your location / estate.');

    const phoneClean = phone.replace(/[\s\-().+]/g, '');
    if (!/^\d{9,15}$/.test(phoneClean)) {
      return showStatus('error', 'Please enter a valid Kenyan phone number.');
    }

    // ── Loading state ───────────────────────────────────────
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending your request…';

    // ── Urgency label map ───────────────────────────────────
    const urgencyMap = {
      normal:    'Normal — this week',
      soon:      'Soon — 1 to 2 days',
      urgent:    'Urgent — today',
      emergency: '🚨 EMERGENCY — right now',
    };

    const payload = {
      name,
      phone,
      service,
      urgency      : urgencyMap[urgency] || urgency,
      location,
      notes,
      submittedAt  : new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' }),
      pageUrl      : window.location.href,
      userAgent    : navigator.userAgent,
    };

    // ── Send to Google Sheets ────────────────────────────────
    const { ok, error } = await sendToSheets(payload);

    if (ok) {
      const isEmergency = urgency === 'emergency';
      showStatus(
        'success',
        isEmergency
          ? '🚨 Emergency request sent! A plumber will call you within 15 minutes.'
          : '✓ Request received! We\'ll confirm your booking within 30 minutes.'
      );
      form.reset();
      // Reset button appearance after emergency
      resetSubmitBtn();
    } else {
      console.error('[Sheets]', error);
      showStatus('error', 'Couldn\'t send your request. Please call us directly on +254 700 000 000.');
    }

    submitBtn.disabled = false;
    resetSubmitBtn();
  });


  // ── Google Sheets fetch ──────────────────────────────────────
  async function sendToSheets(payload) {
    if (!SHEETS_WEBHOOK_URL || SHEETS_WEBHOOK_URL.includes('YOUR_APPS_SCRIPT')) {
      console.warn('[Sheets] URL not configured — running in demo mode.');
      await delay(800);
      return { ok: true };
    }
    try {
      const res = await fetch(SHEETS_WEBHOOK_URL, {
        method  : 'POST',
        headers : { 'Content-Type': 'application/x-www-form-urlencoded' },
        body    : new URLSearchParams(payload).toString(),
      });
      if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
      const json = await res.json().catch(() => ({ result: 'success' }));
      return json.result === 'error'
        ? { ok: false, error: json.error }
        : { ok: true };
    } catch (err) {
      return { ok: false, error: err.message };
    }
  }


  // ── Status display ───────────────────────────────────────────
  function showStatus(type, message) {
    if (!status) return;
    status.textContent = message;
    status.style.display = 'block';

    if (type === 'success') {
      status.style.background = 'rgba(74,154,74,0.1)';
      status.style.color      = '#2d6b2d';
      status.style.border     = '1px solid rgba(74,154,74,0.3)';
    } else {
      status.style.background = 'rgba(193,68,14,0.08)';
      status.style.color      = '#8a2d08';
      status.style.border     = '1px solid rgba(193,68,14,0.25)';
    }

    setTimeout(() => { status.style.display = 'none'; },
      type === 'success' ? 7000 : 5000);
  }

  function resetSubmitBtn() {
    submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send My Request';
    submitBtn.style.background = '';
    submitBtn.style.boxShadow = '';
  }
}


// ===== URGENCY-AWARE SUBMIT BUTTON =====
function initUrgencyButton() {
  const urgency   = document.getElementById('urgency');
  const submitBtn = document.getElementById('submitBtn');
  if (!urgency || !submitBtn) return;

  urgency.addEventListener('change', () => {
    if (urgency.value === 'emergency') {
      submitBtn.style.background  = '#c1440e';
      submitBtn.style.boxShadow   = '0 6px 20px rgba(193,68,14,0.5)';
      submitBtn.innerHTML = '<i class="fas fa-phone-volume"></i> SEND EMERGENCY REQUEST';
    } else {
      submitBtn.style.background  = '';
      submitBtn.style.boxShadow   = '';
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Send My Request';
    }
  });
}


// ===== SCROLL REVEAL =====
function initScrollReveal() {
  if (!('IntersectionObserver' in window)) return;

  const els = document.querySelectorAll(
    '.svc-block, .how-step, .testi-mini, .testi-feature, .wf-item, .cc-item'
  );

  els.forEach((el, i) => {
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(22px)';
    el.style.transition = `opacity 0.55s ease ${i * 0.05}s, transform 0.55s ease ${i * 0.05}s`;
  });

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity   = '1';
        entry.target.style.transform = 'translateY(0)';
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });

  els.forEach(el => obs.observe(el));
}


// ===== FOOTER YEAR =====
function setYear() {
  const el = document.getElementById('yr');
  if (el) el.textContent = new Date().getFullYear();
}


// ===== UTILITY =====
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
