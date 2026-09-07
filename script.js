document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  const themeToggle = document.querySelector('.theme-toggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.documentElement.dataset.theme = 'light';
  }

  const syncToggleState = () => {
    if (!themeToggle) return;
    const isLight = document.documentElement.dataset.theme === 'light';
    themeToggle.setAttribute('aria-pressed', String(isLight));
  };

  syncToggleState();

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const isLight = document.documentElement.dataset.theme === 'light';
      const nextTheme = isLight ? 'dark' : 'light';
      document.documentElement.dataset.theme = nextTheme;
      localStorage.setItem('theme', nextTheme);
      themeToggle.setAttribute('aria-pressed', String(!isLight));
    });
  }

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const formFields = contactForm.querySelectorAll('input:not([type="hidden"]), textarea, select');
    const formStatus = document.getElementById('form-status');

    const validateField = (field) => {
      const formField = field.closest('.form-field');
      const value = typeof field.value === 'string' ? field.value.trim() : '';
      const isValid = field.checkValidity() && value.length > 0;

      if (formField) {
        formField.classList.toggle('has-error', !isValid);
      }
      field.setAttribute('aria-invalid', String(!isValid));
      return isValid;
    };

    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      contactForm.classList.add('was-submitted');
      const isFormValid = Array.from(formFields)
        .map(validateField)
        .every(Boolean);

      if (!isFormValid) return;

      const submitButton = contactForm.querySelector('button[type="submit"]');
      const submitText = submitButton ? submitButton.querySelector('span') : null;
      const originalText = submitText ? submitText.textContent : 'Send';

      if (submitButton) {
        submitButton.disabled = true;
        if (submitText) submitText.textContent = 'Sending...';
      }

      try {
        const response = await fetch(contactForm.action, {
          method: contactForm.method || 'POST',
          body: new FormData(contactForm),
          headers: { Accept: 'application/json' },
        });

        if (response.ok) {
          window.location.href = 'sent.html';
        } else if (formStatus) {
          formStatus.textContent = 'Something went wrong. Please try again.';
          formStatus.hidden = false;
        }
      } catch (error) {
        if (formStatus) {
          formStatus.textContent = 'Unable to send your message. Please try again.';
          formStatus.hidden = false;
        }
      } finally {
        if (submitButton) {
          submitButton.disabled = false;
          if (submitText) submitText.textContent = originalText;
        }
      }
    });

    formFields.forEach((field) => {
      field.addEventListener('input', () => validateField(field));
      field.addEventListener('change', () => validateField(field));
    });
  }

  window.addEventListener('pointermove', (event) => {
    document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`);
  });

  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.profile-card, .project-card').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width - 0.5;
        const y = (event.clientY - bounds.top) / bounds.height - 0.5;
        card.style.setProperty('--tilt-x', `${y * -7}deg`);
        card.style.setProperty('--tilt-y', `${x * 7}deg`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  document.querySelectorAll('.project-card').forEach((card) => {
    const projectLink = card.querySelector('.btn-17') || card.querySelector('a[href]');
    if (!projectLink) return;

    card.setAttribute('tabindex', '0');
    const projectTitle = card.querySelector('h3')?.textContent.trim() || (document.documentElement.lang === 'ar' ? 'مشروع' : 'project');
    card.setAttribute('aria-label', `${document.documentElement.lang === 'ar' ? 'عرض' : 'View'} ${projectTitle}`);

    const openProject = (event) => {
      if (event.target.closest('a, button, input, textarea, select')) return;
      projectLink.click();
    };

    card.addEventListener('click', openProject);
    card.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      if (event.target.closest('a, button')) return;
      event.preventDefault();
      projectLink.click();
    });
  });

  const filterButtons = document.querySelectorAll('.filter-btn');
  const filterableCards = document.querySelectorAll('.project-grid .project-card');

  if (filterButtons.length > 0 && filterableCards.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterButtons.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const filter = btn.dataset.filter;

        filterableCards.forEach((card) => {
          const category = card.dataset.category;
          if (filter === 'all' || category === filter) {
            card.classList.remove('is-hidden');
          } else {
            card.classList.add('is-hidden');
          }
        });
      });
    });
  }

  const navToggle = document.querySelector('.nav-toggle');
  const mainNav = document.querySelector('.main-nav');

  if (navToggle && mainNav) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('is-open', !expanded);
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      });
    });

    document.addEventListener('click', (e) => {
      if (
        !mainNav.contains(e.target) &&
        !navToggle.contains(e.target) &&
        mainNav.classList.contains('is-open')
      ) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mainNav.classList.contains('is-open')) {
        navToggle.setAttribute('aria-expanded', 'false');
        mainNav.classList.remove('is-open');
      }
    });
  }

  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length > 0) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => {
              entry.target.classList.add('is-visible');
            }, Number(delay));
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -60px 0px',
      }
    );

    revealEls.forEach((el, idx) => {
      if (!el.dataset.delay) {
        const parentGrid = el.closest('.project-grid, .skill-grid, .timeline, .mini-stats, .cta-group');
        if (parentGrid) {
          const siblings = Array.from(parentGrid.querySelectorAll(':scope > .reveal'));
          const index = siblings.indexOf(el);
          if (index > 0) el.dataset.delay = String(index * 90);
        }
      }
      revealObserver.observe(el);
    });
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  const skillBars = document.querySelectorAll('.skill-bar');

  if ('IntersectionObserver' in window && skillBars.length > 0) {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const level = entry.target.dataset.level || 80;
            const fill = entry.target.querySelector('.skill-bar__fill');
            if (fill) {
              requestAnimationFrame(() => {
                fill.style.width = `${level}%`;
              });
            }
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    skillBars.forEach((bar) => barObserver.observe(bar));
  } else {
    skillBars.forEach((bar) => {
      const level = bar.dataset.level || 80;
      const fill = bar.querySelector('.skill-bar__fill');
      if (fill) fill.style.width = `${level}%`;
    });
  }

  const typedOutput = document.getElementById('typed-output');
  const phrases = [
    'responsive, high-performance web apps.',
    'clean, modern interfaces with HTML & CSS.',
    'accessible, component-driven experiences.',
    'pixel-perfect UI with JavaScript ES6+.',
    'interactive and thoughtful digital products.',
  ];
  const TYPE_SPEED = 65;
  const DELETE_SPEED = 38;
  const HOLD_MS = 1500;
  const START_DELAY = 600;

  if (typedOutput) {
    let phraseIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function tick() {
      const current = phrases[phraseIndex];

      if (!deleting) {
        charIndex++;
        typedOutput.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(tick, HOLD_MS);
          return;
        }
        setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        typedOutput.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tick, 280);
          return;
        }
        setTimeout(tick, DELETE_SPEED);
      }
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      typedOutput.textContent = phrases[0];
    } else {
      setTimeout(tick, START_DELAY);
    }
  }

  const scrollProgressBar = document.querySelector('.scroll-progress__bar');
  const backToTopBtn = document.querySelector('.back-to-top');

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (scrollTop > 520) {
        backToTopBtn.classList.add('is-visible');
      } else {
        backToTopBtn.classList.remove('is-visible');
      }
    }
  }

  let ticking = false;
  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          onScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true }
  );

  onScroll();

  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  window.setTimeout(() => {
    document.documentElement.classList.remove('is-loading');
  }, 1000);
});
