/* ========================================
   LUXÉ — Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ——————————————————————————
  // 1. Navbar scroll effect
  // ——————————————————————————
  const navbar = document.getElementById('navbar');
  const backToTop = document.getElementById('back-to-top');

  const handleScroll = () => {
    const scrollY = window.scrollY;

    // Navbar glass effect
    if (scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Back-to-top visibility
    if (scrollY > 600) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // Back to top click
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ——————————————————————————
  // 2. Smooth scroll for anchor links
  // ——————————————————————————
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ——————————————————————————
  // 3. Scroll-reveal animations
  // ——————————————————————————
  const revealElements = document.querySelectorAll('.reveal, .reveal-stagger');

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ——————————————————————————
  // 4. Product filter buttons
  // ——————————————————————————
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active state
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      productCards.forEach(card => {
        const categories = card.dataset.category || '';

        if (filter === 'all' || categories.includes(filter)) {
          card.style.opacity = '1';
          card.style.transform = 'scale(1)';
          card.style.pointerEvents = 'auto';
          // Reset display with a tiny delay for animation
          card.style.display = '';
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          card.style.pointerEvents = 'none';
          // Hide after transition
          setTimeout(() => {
            if (!btn.classList.contains('active') || filter === 'all') return;
            if (!categories.includes(filter)) {
              card.style.display = 'none';
            }
          }, 400);
        }
      });
    });
  });

  // ——————————————————————————
  // 5. Countdown timer
  // ——————————————————————————
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 2);
  endDate.setHours(endDate.getHours() + 18);
  endDate.setMinutes(endDate.getMinutes() + 45);

  const timerDays = document.getElementById('timer-days');
  const timerHours = document.getElementById('timer-hours');
  const timerMins = document.getElementById('timer-mins');
  const timerSecs = document.getElementById('timer-secs');

  function updateCountdown() {
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) {
      timerDays.textContent = '00';
      timerHours.textContent = '00';
      timerMins.textContent = '00';
      timerSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    timerDays.textContent = String(days).padStart(2, '0');
    timerHours.textContent = String(hours).padStart(2, '0');
    timerMins.textContent = String(mins).padStart(2, '0');
    timerSecs.textContent = String(secs).padStart(2, '0');
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);

  // ——————————————————————————
  // 6. Newsletter form
  // ——————————————————————————
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterSubmit = document.getElementById('newsletter-submit-btn');

  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = newsletterEmail.value.trim();
    if (!email) return;

    // Simulate subscription
    const originalText = newsletterSubmit.textContent;
    newsletterSubmit.textContent = '✓ Subscribed!';
    newsletterSubmit.style.background = '#2d8a4e';
    newsletterSubmit.style.borderColor = '#2d8a4e';
    newsletterEmail.value = '';
    newsletterEmail.disabled = true;
    newsletterSubmit.disabled = true;

    setTimeout(() => {
      newsletterSubmit.textContent = originalText;
      newsletterSubmit.style.background = '';
      newsletterSubmit.style.borderColor = '';
      newsletterEmail.disabled = false;
      newsletterSubmit.disabled = false;
    }, 3000);
  });

  // ——————————————————————————
  // 7. Quick-add to cart (toast)
  // ——————————————————————————
  function showToast(message) {
    // Remove any existing toast
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      <span>${message}</span>
    `;

    // Style the toast
    Object.assign(toast.style, {
      position: 'fixed',
      bottom: '32px',
      left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      background: 'rgba(28, 28, 35, 0.92)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.1)',
      color: '#f0ece4',
      padding: '14px 28px',
      borderRadius: '9999px',
      fontSize: '0.85rem',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      zIndex: '10000',
      opacity: '0',
      transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    });

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateX(-50%) translateY(0)';
    });

    // Animate out
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(-50%) translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 2500);
  }

  // Attach quick-add handlers
  document.querySelectorAll('.product-quick-add button').forEach(btn => {
    btn.addEventListener('click', () => {
      const card = btn.closest('.product-card');
      const productName = card.querySelector('.product-name').textContent;
      showToast(`${productName} added to cart`);

      // Update cart badge count
      const badge = document.querySelector('.cart-badge');
      if (badge) {
        const current = parseInt(badge.textContent) || 0;
        badge.textContent = current + 1;
        badge.style.transform = 'scale(1.3)';
        setTimeout(() => badge.style.transform = 'scale(1)', 200);
      }
    });
  });

  // ——————————————————————————
  // 8. Wishlist toggle
  // ——————————————————————————
  document.querySelectorAll('.product-wishlist').forEach(btn => {
    btn.addEventListener('click', () => {
      const svg = btn.querySelector('svg');
      const isActive = btn.classList.toggle('wishlisted');

      if (isActive) {
        svg.style.fill = '#e05252';
        svg.style.stroke = '#e05252';
        showToast('Added to your wishlist');
      } else {
        svg.style.fill = 'none';
        svg.style.stroke = 'currentColor';
        showToast('Removed from wishlist');
      }
    });
  });

  // ——————————————————————————
  // 9. Animated number counters (hero stats)
  // ——————————————————————————
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const startTime = performance.now();
    const startValue = 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out quad
      const easedProgress = 1 - (1 - progress) * (1 - progress);
      const current = Math.floor(startValue + (target - startValue) * easedProgress);

      el.innerHTML = current + `<span>${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }

  const statsSection = document.querySelector('.hero-stats');
  let statsAnimated = false;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;

          const statValues = statsSection.querySelectorAll('.hero-stat-value');
          const data = [
            { target: 12, suffix: 'K+' },
            { target: 98, suffix: '%' },
            { target: 250, suffix: '+' },
          ];

          statValues.forEach((el, i) => {
            if (data[i]) {
              animateCounter(el, data[i].target, data[i].suffix);
            }
          });

          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  if (statsSection) {
    statsObserver.observe(statsSection);
  }

  // ——————————————————————————
  // 10. Mobile menu toggle (basic)
  // ——————————————————————————
  const mobileToggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navLinks.style.display === 'flex';

      if (isOpen) {
        navLinks.style.display = '';
      } else {
        navLinks.style.display = 'flex';
        navLinks.style.position = 'fixed';
        navLinks.style.top = 'var(--nav-height)';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.bottom = '0';
        navLinks.style.flexDirection = 'column';
        navLinks.style.alignItems = 'center';
        navLinks.style.justifyContent = 'center';
        navLinks.style.gap = '2rem';
        navLinks.style.background = 'rgba(14, 14, 17, 0.96)';
        navLinks.style.backdropFilter = 'blur(24px)';
        navLinks.style.zIndex = '999';
      }
    });

    // Close menu on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.style.display = '';
        }
      });
    });
  }

  // ——————————————————————————
  // 11. Parallax subtle effect on hero
  // ——————————————————————————
  const heroImage = document.querySelector('.hero-image-wrapper');

  if (heroImage && window.matchMedia('(min-width: 1024px)').matches) {
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      if (scrollY < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrollY * 0.06}px)`;
      }
    }, { passive: true });
  }

});
