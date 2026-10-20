/* ============================================================
   GALERIA ANEL — script.js
   Sidebar, Theme Toggle, Scroll Effects, Form
   ============================================================ */

(function () {
  'use strict';

  /* ── DOM REFS ─────────────────────────────────────────────── */
  const html          = document.documentElement;
  const hamburgerBtn  = document.getElementById('hamburgerBtn');
  const sidebar       = document.getElementById('sidebar');
  const sidebarClose  = document.getElementById('sidebarClose');
  const sidebarOverlay= document.getElementById('sidebarOverlay');
  const themeToggle   = document.getElementById('themeToggle');
  const header        = document.getElementById('header');
  const ctaSuccess    = document.getElementById('ctaSuccess');

  /* ── SIDEBAR ─────────────────────────────────────────────── */
  function openSidebar() {
    sidebar.classList.add('open');
    sidebarOverlay.classList.add('active');
    hamburgerBtn.classList.add('active');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
    hamburgerBtn.classList.remove('active');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    sidebar.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburgerBtn.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });

  sidebarClose.addEventListener('click', closeSidebar);
  sidebarOverlay.addEventListener('click', closeSidebar);

  // Close on link click (data-close attribute)
  sidebar.querySelectorAll('[data-close]').forEach(link => {
    link.addEventListener('click', () => {
      closeSidebar();
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('open')) {
      closeSidebar();
    }
  });

  /* ── THEME TOGGLE ────────────────────────────────────────── */
  const THEME_KEY = 'galeria-anel-theme';

  function getStoredTheme() {
    try {
      return localStorage.getItem(THEME_KEY);
    } catch {
      return null;
    }
  }

  function setStoredTheme(theme) {
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {}
  }

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    themeToggle.setAttribute('aria-label', 
      theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
    );
  }

  // Init theme: stored preference → system preference → dark (default)
  const stored = getStoredTheme();
  if (stored) {
    applyTheme(stored);
  } else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }

  themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next    = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    setStoredTheme(next);
  });

  // Follow system changes (if no stored preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!getStoredTheme()) {
      applyTheme(e.matches ? 'dark' : 'light');
    }
  });

  /* ── HEADER SCROLL ───────────────────────────────────────── */
  let lastScroll = 0;
  let ticking    = false;

  function updateHeader() {
    const scrollY = window.scrollY;

    if (scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    lastScroll = scrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });

  /* ── SCROLL REVEAL ───────────────────────────────────────── */
  function initReveal() {
    const revealTargets = [
      '.section-label',
      '.section-title',
      '.section-body',
      '.product-card',
      '.vstat',
      '.mission-pillars',
      '.visual-frame',
      '.cta-title',
      '.cta-body',
      '.cta-form',
      '.manifesto-strip',
    ];

    // Wrap / mark elements
    revealTargets.forEach(selector => {
      document.querySelectorAll(selector).forEach((el, i) => {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          // Stagger cards
          if (el.classList.contains('product-card') || el.classList.contains('vstat')) {
            el.style.transitionDelay = `${i * 80}ms`;
          }
        }
      });
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Keep observing (don't unobserve) so re-entry works on scroll back;
            // or unobserve for performance: observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  /* ── SMOOTH ANCHOR SCROLL ────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = header.offsetHeight;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 24;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ── CTA FORM ────────────────────────────────────────────── */
  window.handleForm = function (e) {
    e.preventDefault();
    const form = e.target;

    // Basic visual feedback — simulate async
    const btn = form.querySelector('button[type="submit"]');
    btn.textContent = 'A registar…';
    btn.style.opacity = '0.7';
    btn.disabled = true;

    setTimeout(() => {
      form.style.display = 'none';
      ctaSuccess.classList.add('show');
    }, 900);
  };

  /* ── PRODUCT CARD INTERACTION ────────────────────────────── */
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => {
      // Placeholder: would navigate to category page
      card.style.transform = 'scale(0.98)';
      setTimeout(() => { card.style.transform = ''; }, 200);
    });
  });

  /* ── INIT ────────────────────────────────────────────────── */
  // Small delay so CSS transitions are ready
  setTimeout(initReveal, 100);

  // Log
  console.log('%cGaleria Anel ✦', 'font-family:serif;font-size:1.2rem;color:#a08cd4;');
  console.log('%cEach object holds a story.', 'font-family:serif;font-style:italic;color:#7a6ca8;');

})();
