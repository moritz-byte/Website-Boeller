'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initMobileMenu();
  initScrollReveal();
  initCounters();
  initContactForm();
  setActiveNavLink();
});

/* ── Navbar scroll effect ── */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ── Mobile menu ── */
function initMobileMenu() {
  const hamburger = document.querySelector('.hamburger');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });
}

/* ── Scroll reveal ── */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  elements.forEach(el => observer.observe(el));
}

/* ── Animated counters ── */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const easeOut = t => 1 - Math.pow(1 - t, 3);

  const animateCounter = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const start = performance.now();

    const update = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const value = Math.round(easeOut(progress) * target);
      el.textContent = value + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(el => observer.observe(el));
}

/* ── Contact form validation ── */
function initContactForm() {
  const form = document.getElementById('kontakt-form');
  if (!form) return;

  const successMsg = document.getElementById('form-success');

  const rules = {
    name:      val => val.trim().length >= 2,
    email:     val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
    betreff:   val => val !== '',
    nachricht: val => val.trim().length >= 10,
  };

  const validate = (input) => {
    const rule = rules[input.name];
    if (!rule) return true;
    const valid = rule(input.value);
    input.classList.toggle('invalid', !valid);
    return valid;
  };

  form.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', () => validate(input));
    input.addEventListener('input', () => {
      if (input.classList.contains('invalid')) validate(input);
    });
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    let allValid = true;
    form.querySelectorAll('input[name], select[name], textarea[name]').forEach(input => {
      if (!validate(input)) allValid = false;
    });

    if (!allValid) return;

    const submitBtn = form.querySelector('.form-submit');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Wird gesendet…';

    await new Promise(resolve => setTimeout(resolve, 1000));

    form.style.display = 'none';
    if (successMsg) successMsg.style.display = 'block';
  });
}

/* ── Active nav link ── */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === path || (path === 'index.html' && href === './') || href === './' && path === '') {
      link.classList.add('active');
    } else if (href === path) {
      link.classList.add('active');
    }
  });
}
