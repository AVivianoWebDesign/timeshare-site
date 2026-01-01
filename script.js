// Modern JS: mobile nav + accessible modal + safe guards
document.addEventListener('DOMContentLoaded', () => {
  // Footer year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  // Mobile nav
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const toggle = document.querySelector('[data-nav-toggle]');

  const closeNav = () => {
    if (!nav || !toggle) return;
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
  };

  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    // Close on link click (mobile)
    nav.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (a) closeNav();
    });

    // Close on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 820) closeNav();
    });
  }

  // Modal (CTA)
  const modal = document.getElementById('cta-modal');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = modal ? modal.querySelectorAll('[data-close-modal]') : [];
  const closeX = modal ? modal.querySelector('.modal-close') : null;

  let lastFocus = null;

  const setModalOpen = (open) => {
    if (!modal) return;

    modal.setAttribute('aria-hidden', open ? 'false' : 'true');
    document.body.style.overflow = open ? 'hidden' : '';

    if (open) {
      lastFocus = document.activeElement;
      const firstInput = modal.querySelector('input, textarea, button');
      if (firstInput) firstInput.focus();
    } else if (lastFocus && typeof lastFocus.focus === 'function') {
      lastFocus.focus();
    }
  };

  openButtons.forEach(btn => btn.addEventListener('click', () => setModalOpen(true)));
  closeButtons.forEach(btn => btn.addEventListener('click', () => setModalOpen(false)));
  if (closeX) closeX.addEventListener('click', () => setModalOpen(false));

  // Escape to close
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.getAttribute('aria-hidden') === 'false') {
      setModalOpen(false);
    }
  });

  // Basic focus trap
  if (modal) {
    modal.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      const focusables = modal.querySelectorAll('a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    });
  }
});
