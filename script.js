/* ========================================
   LUXÉ — Interactive JavaScript
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ——————————————————————————
  // 0. State Initialization & Rendering (LocalStorage)
  // ——————————————————————————
  const defaultProducts = [
    {
      id: 1,
      name: "Classic Heritage Chronograph",
      category: "Timepieces",
      price: 289.00,
      originalPrice: null,
      image: "images/product-watch.png",
      badge: "New",
      badgeClass: "new",
      rating: 5,
      reviews: 128,
      categories: "new best",
      stock: 15
    },
    {
      id: 2,
      name: "Milano Crossbody — Cognac",
      category: "Leather Goods",
      price: 195.00,
      originalPrice: null,
      image: "images/product-bag.png",
      badge: null,
      badgeClass: "",
      rating: 4,
      reviews: 86,
      categories: "best",
      stock: 8
    },
    {
      id: 3,
      name: "Aviator — Gold Edition",
      category: "Eyewear",
      price: 165.00,
      originalPrice: null,
      image: "images/product-sunglasses.png",
      badge: "New",
      badgeClass: "new",
      rating: 5,
      reviews: 54,
      categories: "new",
      stock: 12
    },
    {
      id: 4,
      name: "Aura — Eau de Parfum",
      category: "Fragrances",
      price: 112.00,
      originalPrice: 160.00,
      image: "images/product-perfume.png",
      badge: "-30%",
      badgeClass: "sale",
      rating: 4,
      reviews: 203,
      categories: "sale best",
      stock: 22
    },
    {
      id: 5,
      name: "Stride — White Leather",
      category: "Footwear",
      price: 220.00,
      originalPrice: null,
      image: "images/product-sneakers.png",
      badge: "New",
      badgeClass: "new",
      rating: 5,
      reviews: 77,
      categories: "new best",
      stock: 5
    },
    {
      id: 6,
      name: "Solstice — Midnight Edition",
      category: "Timepieces",
      price: 352.00,
      originalPrice: 440.00,
      image: "images/product-watch.png",
      badge: "-20%",
      badgeClass: "sale",
      rating: 5,
      reviews: 162,
      categories: "sale",
      stock: 0
    }
  ];

  const defaultOrders = [
    {
      id: "LX-9821",
      date: "2026-06-12",
      total: 484.00,
      status: "Delivered",
      paymentMethod: "Visa ending in 4242",
      items: [
        { id: 1, name: "Classic Heritage Chronograph", price: 289.00, quantity: 1, image: "images/product-watch.png" },
        { id: 2, name: "Milano Crossbody — Cognac", price: 195.00, quantity: 1, image: "images/product-bag.png" }
      ]
    },
    {
      id: "LX-9743",
      date: "2026-06-18",
      total: 165.00,
      status: "In Transit",
      paymentMethod: "Apple Pay",
      items: [
        { id: 3, name: "Aviator — Gold Edition", price: 165.00, quantity: 1, image: "images/product-sunglasses.png" }
      ]
    },
    {
      id: "LX-9612",
      date: "2026-05-28",
      total: 224.00,
      status: "Delivered",
      paymentMethod: "Mastercard ending in 8812",
      items: [
        { id: 4, name: "Aura — Eau de Parfum", price: 112.00, quantity: 2, image: "images/product-perfume.png" }
      ]
    }
  ];

  const defaultProfile = {
    name: "Alex Mercer",
    email: "alex.mercer@example.com",
    address: "123 Luxury Lane, Beverly Hills, CA 90210",
    phone: "+1 (555) 555-0199",
    loyaltyPoints: 350
  };

  // Seed storage
  if (!localStorage.getItem('luxe_products')) {
    localStorage.setItem('luxe_products', JSON.stringify(defaultProducts));
  }
  if (!localStorage.getItem('luxe_orders')) {
    localStorage.setItem('luxe_orders', JSON.stringify(defaultOrders));
  }
  const existingProfileRaw = localStorage.getItem('luxe_profile');
  let existingProfileObj = null;
  try { existingProfileObj = existingProfileRaw ? JSON.parse(existingProfileRaw) : null; } catch (_) {}
  if (!existingProfileObj || !existingProfileObj.name || !existingProfileObj.email) {
    localStorage.setItem('luxe_profile', JSON.stringify(defaultProfile));
  }
  if (!localStorage.getItem('luxe_wishlist')) {
    localStorage.setItem('luxe_wishlist', JSON.stringify([1, 3]));
  }
  if (!localStorage.getItem('luxe_auth')) {
    localStorage.setItem('luxe_auth', JSON.stringify({ role: 'user' }));
  }

  // Dynamic storefront rendering
  function renderStorefrontProducts() {
    const productsGrid = document.getElementById('products-grid');
    if (!productsGrid) return;

    const products = JSON.parse(localStorage.getItem('luxe_products')) || [];
    const wishlist = JSON.parse(localStorage.getItem('luxe_wishlist')) || [];

    productsGrid.innerHTML = '';

    products.forEach(product => {
      const isWishlisted = wishlist.includes(product.id);
      const wishlistFill = isWishlisted ? '#e05252' : 'none';
      const wishlistStroke = isWishlisted ? '#e05252' : 'currentColor';
      const wishlistClass = isWishlisted ? 'product-wishlist wishlisted' : 'product-wishlist';

      const badgeHtml = product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : '';
      const originalPriceHtml = product.originalPrice ? `<span class="product-price-original">$${product.originalPrice.toFixed(2)}</span>` : '';

      // Star rating construction
      let starsHtml = '';
      for (let i = 1; i <= 5; i++) {
        const starOpacity = i <= product.rating ? '' : ' style="opacity:0.3"';
        starsHtml += `<svg viewBox="0 0 24 24"${starOpacity}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
      }

      const quickAddBtn = product.stock > 0
        ? `<button id="quick-add-${product.id}">Quick Add to Cart</button>`
        : `<button disabled style="background:rgba(255,255,255,0.05); color:var(--color-text-muted); cursor:not-allowed;">Out of Stock</button>`;

      const card = document.createElement('div');
      card.className = 'product-card';
      card.dataset.category = product.categories || '';
      card.id = `product-${product.id}`;

      card.innerHTML = `
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" />
          ${badgeHtml}
          <button class="${wishlistClass}" data-id="${product.id}" aria-label="Add to wishlist">
            <svg viewBox="0 0 24 24" style="fill: ${wishlistFill}; stroke: ${wishlistStroke};"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
          </button>
          <div class="product-quick-add">
            ${quickAddBtn}
          </div>
        </div>
        <div class="product-info">
          <div class="product-category">${product.category}</div>
          <h3 class="product-name">${product.name}</h3>
          <div class="product-price-row">
            <span class="product-price">$${product.price.toFixed(2)}</span>
            ${originalPriceHtml}
          </div>
          <div class="product-rating">
            <div class="product-stars">
              ${starsHtml}
            </div>
            <span class="product-review-count">(${product.reviews})</span>
          </div>
        </div>
      `;

      productsGrid.appendChild(card);
    });
  }

  // Render on startup
  renderStorefrontProducts();

  // ——————————————————————————
  // Account Dropdown Menu Toggle & Render
  // ——————————————————————————
  const accountBtn = document.getElementById('account-btn');
  const accountDropdown = document.getElementById('account-dropdown');

  function updateAccountDropdown() {
    const dropdown = document.getElementById('account-dropdown');
    if (!dropdown) return;

    const auth = JSON.parse(localStorage.getItem('luxe_auth')) || { role: 'user' };
    const isAdmin = auth.role === 'admin';

    let html = `
      <a href="dashboard.html" class="dropdown-item">
        <svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        <span>Dashboard</span>
      </a>
    `;

    if (isAdmin) {
      html += `
        <a href="admin.html" class="dropdown-item">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
          <span>Merchant Admin</span>
        </a>
        <a href="#" class="dropdown-item logout-admin-btn" id="logout-admin-btn" style="color: #e05252;">
          <svg viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          <span>Admin Logout</span>
        </a>
      `;
    } else {
      html += `
        <a href="admin.html" class="dropdown-item">
          <svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="14" x2="15" y2="14"/></svg>
          <span>Merchant Admin <span class="lock-badge">🔒</span></span>
        </a>
      `;
    }

    dropdown.innerHTML = html;

    const logoutBtn = document.getElementById('logout-admin-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.setItem('luxe_auth', JSON.stringify({ role: 'user' }));
        showToast('Admin session ended');
        updateAccountDropdown();

        if (window.location.pathname.includes('admin.html')) {
          setTimeout(() => {
            window.location.href = 'index.html';
          }, 1000);
        }
      });
    }
  }

  // Initialize dropdown rendering
  updateAccountDropdown();

  if (accountBtn && accountDropdown) {
    accountBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      accountDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!accountDropdown.contains(e.target) && e.target !== accountBtn && !accountBtn.contains(e.target)) {
        accountDropdown.classList.remove('active');
      }
    });
  }


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
    if (backToTop) {
      if (scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // run once on load

  // Back to top click
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

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
      if (timerDays) timerDays.textContent = '00';
      if (timerHours) timerHours.textContent = '00';
      if (timerMins) timerMins.textContent = '00';
      if (timerSecs) timerSecs.textContent = '00';
      return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diff % (1000 * 60)) / 1000);

    if (timerDays) timerDays.textContent = String(days).padStart(2, '0');
    if (timerHours) timerHours.textContent = String(hours).padStart(2, '0');
    if (timerMins) timerMins.textContent = String(mins).padStart(2, '0');
    if (timerSecs) timerSecs.textContent = String(secs).padStart(2, '0');
  }

  if (timerDays && timerHours && timerMins && timerSecs) {
    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  // ——————————————————————————
  // 6. Newsletter form
  // ——————————————————————————
  const newsletterForm = document.getElementById('newsletter-form');
  const newsletterEmail = document.getElementById('newsletter-email');
  const newsletterSubmit = document.getElementById('newsletter-submit-btn');

  if (newsletterForm && newsletterEmail && newsletterSubmit) {
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
  }

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
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const productId = parseInt(btn.getAttribute('data-id'));
      if (!productId) return;

      const svg = btn.querySelector('svg');
      const isActive = btn.classList.toggle('wishlisted');
      let wishlist = JSON.parse(localStorage.getItem('luxe_wishlist')) || [];

      if (isActive) {
        svg.style.fill = '#e05252';
        svg.style.stroke = '#e05252';
        if (!wishlist.includes(productId)) {
          wishlist.push(productId);
        }
        showToast('Added to your wishlist');
      } else {
        svg.style.fill = 'none';
        svg.style.stroke = 'currentColor';
        wishlist = wishlist.filter(id => id !== productId);
        showToast('Removed from wishlist');
      }

      localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));
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


  // ========================================
  // CUSTOMER DASHBOARD LOGIC
  // ========================================
  {
    const tabButtons = document.querySelectorAll('.db-nav-btn');
    const tabPanes = document.querySelectorAll('.db-tab-pane');
    
    // Only run if we are on the dashboard page
    if (document.querySelector('.db-sidebar') && !document.getElementById('admin-stat-sales')) {
      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.dataset.tab;
          tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          tabPanes.forEach(pane => {
            if (pane.id === `tab-${targetTab}`) {
              pane.classList.add('active');
            } else {
              pane.classList.remove('active');
            }
          });
        });
      });

      // Hydrate User Profile
      const loadUserProfile = () => {
        const profile = JSON.parse(localStorage.getItem('luxe_profile'));
        if (!profile) return;

        // Update Sidebar
        const sidebarUser = document.getElementById('sidebar-username');
        if (sidebarUser) sidebarUser.textContent = profile.name;
        const avatar = document.getElementById('sidebar-avatar');
        if (avatar) {
          const initials = profile.name.split(' ').map(n => n[0]).join('').toUpperCase();
          avatar.textContent = initials;
        }

        // Update Welcome Title
        const welcomeName = document.getElementById('welcome-name');
        if (welcomeName) {
          const firstName = profile.name.split(' ')[0];
          welcomeName.textContent = firstName;
        }

        // Populate Settings Form
        const settingsFullname = document.getElementById('settings-fullname');
        if (settingsFullname) settingsFullname.value = profile.name;
        const settingsEmail = document.getElementById('settings-email');
        if (settingsEmail) settingsEmail.value = profile.email;
        const settingsPhone = document.getElementById('settings-phone');
        if (settingsPhone) settingsPhone.value = profile.phone;
        const settingsAddress = document.getElementById('settings-address');
        if (settingsAddress) settingsAddress.value = profile.address;

        // Update Points
        const loyaltyPoints = document.getElementById('stat-loyalty-points');
        if (loyaltyPoints) loyaltyPoints.textContent = profile.loyaltyPoints;
      };

      // Hydrate Orders
      const loadOrders = () => {
        const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];
        const totalOrders = document.getElementById('stat-total-orders');
        if (totalOrders) totalOrders.textContent = orders.length;

        // Render Overview Table (Recent Orders)
        const recentOrdersList = document.getElementById('recent-orders-list');
        if (recentOrdersList) {
          recentOrdersList.innerHTML = '';
          const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));
          const recent = sorted.slice(0, 3);

          if (recent.length === 0) {
            recentOrdersList.innerHTML = `<tr><td colspan="5" style="text-align:center;">No orders placed yet.</td></tr>`;
          } else {
            recent.forEach(order => {
              const row = document.createElement('tr');
              let badgeClass = 'badge-processing';
              if (order.status === 'Delivered') badgeClass = 'badge-delivered';
              if (order.status === 'In Transit') badgeClass = 'badge-intransit';
              if (order.status === 'Cancelled') badgeClass = 'badge-cancelled';

              row.innerHTML = `
                <td style="font-family:var(--font-mono); font-weight:500;">${order.id}</td>
                <td>${formatDate(order.date)}</td>
                <td style="font-weight:600; color:var(--color-accent);">$${order.total.toFixed(2)}</td>
                <td><span class="status-badge ${badgeClass}">${order.status}</span></td>
                <td>
                  <button class="text-link-btn view-order-trigger" data-order-id="${order.id}">View Details</button>
                </td>
              `;
              recentOrdersList.appendChild(row);
            });

            recentOrdersList.querySelectorAll('.view-order-trigger').forEach(btn => {
              btn.addEventListener('click', () => {
                const orderId = btn.dataset.orderId;
                const ordBtn = document.querySelector('[data-tab=orders]');
                if (ordBtn) ordBtn.click();
                setTimeout(() => {
                  const card = document.getElementById(`order-card-${orderId}`);
                  if (card) {
                    card.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    if (!card.classList.contains('expanded')) {
                      card.querySelector('.order-card-header').click();
                    }
                  }
                }, 300);
              });
            });
          }
        }

        // Hydrate Tracking Card
        const trackingCard = document.getElementById('tracking-card');
        if (trackingCard) {
          const activeOrder = orders.find(o => o.status === 'In Transit' || o.status === 'Processing');
          if (activeOrder) {
            trackingCard.style.display = 'block';
            const trId = document.getElementById('tracking-order-id');
            if (trId) trId.textContent = activeOrder.id;

            const steps = trackingCard.querySelectorAll('.timeline-step');
            steps.forEach(s => s.className = 'timeline-step');

            if (activeOrder.status === 'Processing') {
              steps[0].classList.add('completed');
              steps[1].classList.add('active');
            } else if (activeOrder.status === 'In Transit') {
              steps[0].classList.add('completed');
              steps[1].classList.add('completed');
              steps[2].classList.add('active');
            }

            const infoPara = trackingCard.querySelector('.tracking-info');
            if (infoPara) {
              infoPara.innerHTML = `
                <p><strong>Status:</strong> ${activeOrder.status} (On schedule)</p>
                <p><strong>Carrier:</strong> LUXÉ Priority Concierge</p>
              `;
            }
          } else {
            const lastDelivered = orders.find(o => o.status === 'Delivered');
            if (lastDelivered) {
              trackingCard.style.display = 'block';
              const trId = document.getElementById('tracking-order-id');
              if (trId) trId.textContent = lastDelivered.id;
              const steps = trackingCard.querySelectorAll('.timeline-step');
              steps.forEach(s => s.className = 'timeline-step completed');
              const infoPara = trackingCard.querySelector('.tracking-info');
              if (infoPara) {
                infoPara.innerHTML = `
                  <p><strong>Status:</strong> Delivered on ${formatDate(lastDelivered.date)}</p>
                  <p><strong>Carrier:</strong> LUXÉ Priority Concierge (Hand-delivered)</p>
                `;
              }
            } else {
              trackingCard.style.display = 'none';
            }
          }
        }

        // Render Full Orders Tab
        const ordersFullList = document.getElementById('orders-full-list');
        if (ordersFullList) {
          ordersFullList.innerHTML = '';
          const sorted = [...orders].sort((a, b) => new Date(b.date) - new Date(a.date));

          if (sorted.length === 0) {
            ordersFullList.innerHTML = `
              <div class="wishlist-empty-state">
                <div class="empty-state-icon">👜</div>
                <h3>No purchases yet</h3>
                <p>Your luxury transaction record will appear here once you place orders.</p>
                <a href="index.html#products" class="btn btn-primary">Go to Shop</a>
              </div>
            `;
          } else {
            sorted.forEach(order => {
              const card = document.createElement('div');
              card.className = 'order-history-card';
              card.id = `order-card-${order.id}`;

              let badgeClass = 'badge-processing';
              if (order.status === 'Delivered') badgeClass = 'badge-delivered';
              if (order.status === 'In Transit') badgeClass = 'badge-intransit';
              if (order.status === 'Cancelled') badgeClass = 'badge-cancelled';

              let itemsHtml = '';
              order.items.forEach(item => {
                itemsHtml += `
                  <div class="order-item-row">
                    <div class="order-item-product">
                      <div class="order-item-img-wrapper">
                        <img src="${item.image}" alt="${item.name}" />
                      </div>
                      <div>
                        <h4 class="order-item-name">${item.name}</h4>
                        <span class="order-item-category">Essential</span>
                      </div>
                    </div>
                    <div class="order-item-pricing">
                      <div class="order-item-price">$${item.price.toFixed(2)}</div>
                      <div class="order-item-qty">Qty: ${item.quantity}</div>
                    </div>
                  </div>
                `;
              });

              card.innerHTML = `
                <div class="order-card-header">
                  <div class="order-header-main">
                    <div class="order-header-info">
                      <span class="order-header-label">Order ID</span>
                      <span class="order-header-value" style="font-family:var(--font-mono); font-weight:600;">${order.id}</span>
                    </div>
                    <div class="order-header-info">
                      <span class="order-header-label">Date Placed</span>
                      <span class="order-header-value">${formatDate(order.date)}</span>
                    </div>
                    <div class="order-header-info">
                      <span class="order-header-label">Total Amount</span>
                      <span class="order-header-value order-header-total">$${order.total.toFixed(2)}</span>
                    </div>
                    <div class="order-header-info">
                      <span class="order-header-label">Status</span>
                      <span class="status-badge ${badgeClass}">${order.status}</span>
                    </div>
                  </div>
                  <div class="order-card-expand-icon">
                    <svg viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
                  </div>
                </div>
                <div class="order-card-details">
                  <div class="order-items-list">
                    ${itemsHtml}
                  </div>
                  <div class="order-footer-details">
                    <div class="order-footer-col">
                      <h4>Payment Method</h4>
                      <p>${order.paymentMethod || 'Credit Card ending in 4242'}</p>
                    </div>
                    <div class="order-footer-col">
                      <h4>Shipping Address</h4>
                      <p>${JSON.parse(localStorage.getItem('luxe_profile'))?.address || '123 Luxury Lane, Beverly Hills, CA 90210'}</p>
                    </div>
                  </div>
                </div>
              `;
              
              card.querySelector('.order-card-header').addEventListener('click', () => {
                card.classList.toggle('expanded');
              });

              ordersFullList.appendChild(card);
            });
          }
        }
      };

      // Hydrate Wishlist
      const loadWishlist = () => {
        const wishlistIds = JSON.parse(localStorage.getItem('luxe_wishlist')) || [];
        const products = JSON.parse(localStorage.getItem('luxe_products')) || [];
        const wishlistGrid = document.getElementById('wishlist-items-grid');
        const emptyState = document.getElementById('wishlist-empty');
        const wlCount = document.getElementById('stat-wishlist-count');
        if (wlCount) wlCount.textContent = wishlistIds.length;

        if (!wishlistGrid || !emptyState) return;

        wishlistGrid.innerHTML = '';
        const wishlistedProducts = products.filter(p => wishlistIds.includes(p.id));

        if (wishlistedProducts.length === 0) {
          wishlistGrid.style.display = 'none';
          emptyState.style.display = 'block';
        } else {
          wishlistGrid.style.display = 'grid';
          emptyState.style.display = 'none';

          wishlistedProducts.forEach(product => {
            const badgeHtml = product.badge ? `<span class="product-badge ${product.badgeClass || ''}">${product.badge}</span>` : '';
            const originalPriceHtml = product.originalPrice ? `<span class="product-price-original">$${product.originalPrice.toFixed(2)}</span>` : '';

            let starsHtml = '';
            for (let i = 1; i <= 5; i++) {
              const starOpacity = i <= product.rating ? '' : ' style="opacity:0.3"';
              starsHtml += `<svg viewBox="0 0 24 24"${starOpacity}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
            }

            const quickAddBtn = product.stock > 0
              ? `<button class="wishlist-cart-btn" data-id="${product.id}" data-name="${product.name}">Add to Cart</button>`
              : `<button disabled style="background:rgba(255,255,255,0.05); color:var(--color-text-muted); cursor:not-allowed; border:none;">Out of Stock</button>`;

            const card = document.createElement('div');
            card.className = 'product-card';
            card.id = `wishlist-card-${product.id}`;

            card.innerHTML = `
              <div class="product-image">
                <img src="${product.image}" alt="${product.name}" />
                ${badgeHtml}
                <button class="product-wishlist wishlisted wishlist-remove-btn" data-id="${product.id}" aria-label="Remove from wishlist">
                  <svg viewBox="0 0 24 24" style="fill:#e05252; stroke:#e05252;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
                <div class="product-quick-add">
                  ${quickAddBtn}
                </div>
              </div>
              <div class="product-info">
                <div class="product-category">${product.category}</div>
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price-row">
                  <span class="product-price">$${product.price.toFixed(2)}</span>
                  ${originalPriceHtml}
                </div>
                <div class="product-rating">
                  <div class="product-stars">${starsHtml}</div>
                  <span class="product-review-count">(${product.reviews})</span>
                </div>
              </div>
            `;

            card.querySelector('.wishlist-remove-btn').addEventListener('click', (e) => {
              e.stopPropagation();
              const pId = parseInt(product.id);
              const currentWishlist = JSON.parse(localStorage.getItem('luxe_wishlist')) || [];
              const updated = currentWishlist.filter(id => id !== pId);
              localStorage.setItem('luxe_wishlist', JSON.stringify(updated));
              showToast(`Removed ${product.name} from wishlist`);
              loadWishlist();
            });

            const cartBtn = card.querySelector('.wishlist-cart-btn');
            if (cartBtn) {
              cartBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                showToast(`${product.name} added to cart`);
                const badge = document.querySelector('.cart-badge');
                if (badge) {
                  const current = parseInt(badge.textContent) || 0;
                  badge.textContent = current + 1;
                  badge.style.transform = 'scale(1.3)';
                  setTimeout(() => badge.style.transform = 'scale(1)', 200);
                }
              });
            }

            wishlistGrid.appendChild(card);
          });
        }
      };

      const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
      };

      // Run Initialization
      loadUserProfile();
      loadOrders();
      loadWishlist();

      // Submit Settings Form
      const profileForm = document.getElementById('profile-settings-form');
      const saveProfileBtn = document.getElementById('save-profile-btn');
      if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const profile = {
            name: document.getElementById('settings-fullname').value.trim(),
            email: document.getElementById('settings-email').value.trim(),
            phone: document.getElementById('settings-phone').value.trim(),
            address: document.getElementById('settings-address').value.trim(),
            loyaltyPoints: parseInt(document.getElementById('stat-loyalty-points').textContent) || 350
          };

          localStorage.setItem('luxe_profile', JSON.stringify(profile));
          showToast('Profile settings saved successfully');
          loadUserProfile();

          const originalText = saveProfileBtn.textContent;
          saveProfileBtn.textContent = '✓ Changes Saved';
          saveProfileBtn.style.background = '#2d8a4e';
          saveProfileBtn.style.boxShadow = 'none';

          setTimeout(() => {
            saveProfileBtn.textContent = originalText;
            saveProfileBtn.style.background = '';
            saveProfileBtn.style.boxShadow = '';
          }, 2500);
        });
      }
    }
  }

  // ========================================
  // MERCHANT ADMIN PANEL LOGIC
  // ========================================
  {
    const tabButtons = document.querySelectorAll('.db-nav-btn');
    const tabPanes = document.querySelectorAll('.db-tab-pane');
    
    // Only run if we are on the admin page
    if (document.getElementById('admin-stat-sales')) {
      const lockScreen = document.getElementById('admin-lock-screen');
      const lockForm = document.getElementById('admin-lock-form');
      const lockCard = lockScreen ? lockScreen.querySelector('.lock-card') : null;

      function checkAdminAccess() {
        const auth = JSON.parse(localStorage.getItem('luxe_auth')) || { role: 'user' };
        if (auth.role === 'admin') {
          if (lockScreen) lockScreen.classList.add('hidden');
          loadAnalytics();
        } else {
          if (lockScreen) lockScreen.classList.remove('hidden');
          if (lockForm) {
            lockForm.addEventListener('submit', handleLockFormSubmit);
          }
        }
      }

      function handleLockFormSubmit(e) {
        e.preventDefault();
        const usernameInput = document.getElementById('lock-username');
        const passwordInput = document.getElementById('lock-password');
        const username = usernameInput ? usernameInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (username === 'admin' && password === 'admin') {
          localStorage.setItem('luxe_auth', JSON.stringify({ role: 'admin' }));
          showToast('Access granted. Welcome to Merchant Portal');
          if (lockScreen) lockScreen.classList.add('hidden');
          updateAccountDropdown();
          loadAnalytics();
        } else {
          showToast('Invalid credentials. Please try again.');
          if (lockCard) {
            lockCard.classList.add('shake');
            setTimeout(() => {
              lockCard.classList.remove('shake');
            }, 400);
          }
          if (passwordInput) passwordInput.value = '';
        }
      }

      tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetTab = btn.dataset.tab;
          tabButtons.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          tabPanes.forEach(pane => {
            if (pane.id === `tab-${targetTab}`) {
              pane.classList.add('active');
            } else {
              pane.classList.remove('active');
            }
          });

          // Reload tabs
          if (targetTab === 'analytics') {
            loadAnalytics();
          } else if (targetTab === 'products') {
            loadCatalogProducts();
          } else if (targetTab === 'orders') {
            loadMerchantOrders();
          } else if (targetTab === 'customers') {
            loadCustomersDirectory();
          }
        });
      });

      // Load Analytics
      const loadAnalytics = () => {
        const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];
        const products = JSON.parse(localStorage.getItem('luxe_products')) || [];

        const totalSales = orders
          .filter(o => o.status !== 'Cancelled')
          .reduce((sum, o) => sum + o.total, 0);
        const totalCount = orders.length;
        const aov = totalCount > 0 ? totalSales / totalCount : 0;

        document.getElementById('admin-stat-sales').textContent = `$${totalSales.toFixed(2)}`;
        document.getElementById('admin-stat-orders').textContent = totalCount;
        document.getElementById('admin-stat-aov').textContent = `$${aov.toFixed(2)}`;

        const catSales = {
          "Timepieces": 0,
          "Leather Goods": 0,
          "Eyewear": 0,
          "Fragrances": 0,
          "Footwear": 0
        };

        orders.forEach(o => {
          if (o.status === 'Cancelled') return;
          o.items.forEach(item => {
            const match = products.find(p => p.id === item.id || p.name === item.name);
            const category = match ? match.category : 'Timepieces';
            if (catSales[category] !== undefined) {
              catSales[category] += item.price * item.quantity;
            } else {
              catSales[category] = item.price * item.quantity;
            }
          });
        });

        const breakdownList = document.getElementById('category-distribution-list');
        if (breakdownList) {
          breakdownList.innerHTML = '';
          const totalCatSales = Object.values(catSales).reduce((a, b) => a + b, 0) || 1;
          Object.entries(catSales).forEach(([cat, val]) => {
            const pct = Math.round((val / totalCatSales) * 100);
            const group = document.createElement('div');
            group.className = 'category-bar-group';
            group.innerHTML = `
              <div class="category-bar-info">
                <span class="category-bar-label">${cat}</span>
                <span class="category-bar-val">$${val.toFixed(2)} (${pct}%)</span>
              </div>
              <div class="category-bar-track">
                <div class="category-bar-fill" style="width: ${pct}%"></div>
              </div>
            `;
            breakdownList.appendChild(group);
          });
        }

        const alertsList = document.getElementById('stock-alerts-list');
        if (alertsList) {
          alertsList.innerHTML = '';
          const lowStockProducts = products.filter(p => p.stock <= 3);

          if (lowStockProducts.length === 0) {
            alertsList.innerHTML = `<p style="color:var(--color-text-muted); font-size:0.85rem;">✓ All items fully stocked.</p>`;
          } else {
            lowStockProducts.forEach(p => {
              const item = document.createElement('div');
              const isOut = p.stock === 0;
              item.className = `stock-alert-item ${isOut ? 'critical' : 'warning'}`;
              item.innerHTML = `
                <span class="alert-item-name">${p.name}</span>
                <span class="alert-item-badge">${isOut ? 'OUT OF STOCK' : `LOW STOCK: ${p.stock}`}</span>
              `;
              alertsList.appendChild(item);
            });
          }
        }
      };

      // CRUD products modal elements
      const productModal = document.getElementById('product-modal');
      const addProductTrigger = document.getElementById('add-product-btn-trigger');
      const modalCloseBtn = document.getElementById('modal-close-btn');
      const productCrudForm = document.getElementById('product-crud-form');

      if (addProductTrigger) {
        addProductTrigger.addEventListener('click', () => {
          openProductModal('Add New Product');
        });
      }
      if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeProductModal);
      }
      if (productModal) {
        productModal.addEventListener('click', (e) => {
          if (e.target === productModal) closeProductModal();
        });
      }

      function openProductModal(title, product = null) {
        document.getElementById('modal-title').textContent = title;
        productModal.classList.add('active');

        if (product) {
          document.getElementById('form-product-id').value = product.id;
          document.getElementById('form-product-name').value = product.name;
          document.getElementById('form-product-category').value = product.category;
          document.getElementById('form-product-price').value = product.price;
          document.getElementById('form-product-original-price').value = product.originalPrice || '';
          document.getElementById('form-product-stock').value = product.stock;
          document.getElementById('form-product-image').value = product.image;
          document.getElementById('form-product-badge').value = product.badge || '';
          document.getElementById('form-product-filter-cats').value = product.categories || '';
        } else {
          productCrudForm.reset();
          document.getElementById('form-product-id').value = '';
        }
      }

      function closeProductModal() {
        productModal.classList.remove('active');
      }

      const loadCatalogProducts = () => {
        const products = JSON.parse(localStorage.getItem('luxe_products')) || [];
        const productsList = document.getElementById('admin-products-list');
        if (!productsList) return;

        productsList.innerHTML = '';
        products.forEach(product => {
          const tr = document.createElement('tr');
          let stockClass = '';
          let stockLabel = product.stock;
          if (product.stock === 0) {
            stockClass = 'stock-cell out';
            stockLabel = 'Out of Stock';
          } else if (product.stock <= 3) {
            stockClass = 'stock-cell low';
            stockLabel = `Low (${product.stock})`;
          }

          tr.innerHTML = `
            <td style="font-family:var(--font-mono); font-size:0.75rem;">#${product.id}</td>
            <td>
              <div class="product-cell">
                <img class="product-thumb" src="${product.image}" alt="${product.name}" />
                <span class="product-cell-name">${product.name}</span>
              </div>
            </td>
            <td>${product.category}</td>
            <td style="font-weight:600; color:var(--color-accent);">$${product.price.toFixed(2)}</td>
            <td class="${stockClass}">${stockLabel}</td>
            <td>★ ${product.rating}.0</td>
            <td>
              <div class="action-btn-group">
                <button class="action-btn edit" data-id="${product.id}" aria-label="Edit product">
                  <svg viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="action-btn delete" data-id="${product.id}" aria-label="Delete product">
                  <svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                </button>
              </div>
            </td>
          `;

          tr.querySelector('.action-btn.edit').addEventListener('click', () => {
            openProductModal('Edit Catalog Product', product);
          });

          tr.querySelector('.action-btn.delete').addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
              deleteCatalogProduct(product.id);
            }
          });

          productsList.appendChild(tr);
        });
      };

      if (productCrudForm) {
        productCrudForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const products = JSON.parse(localStorage.getItem('luxe_products')) || [];
          const formId = document.getElementById('form-product-id').value;

          const pPrice = parseFloat(document.getElementById('form-product-price').value) || 0;
          const pOrigPriceVal = document.getElementById('form-product-original-price').value;
          const pOrigPrice = pOrigPriceVal ? parseFloat(pOrigPriceVal) : null;
          const pStock = parseInt(document.getElementById('form-product-stock').value) || 0;
          const pBadgeVal = document.getElementById('form-product-badge').value.trim();

          const productData = {
            name: document.getElementById('form-product-name').value.trim(),
            category: document.getElementById('form-product-category').value,
            price: pPrice,
            originalPrice: pOrigPrice,
            image: document.getElementById('form-product-image').value,
            badge: pBadgeVal || null,
            badgeClass: pBadgeVal ? (pBadgeVal.includes('%') ? 'sale' : 'new') : '',
            stock: pStock,
            categories: document.getElementById('form-product-filter-cats').value.trim(),
            rating: 5,
            reviews: 0
          };

          if (formId) {
            const id = parseInt(formId);
            const index = products.findIndex(p => p.id === id);
            if (index > -1) {
              productData.id = id;
              productData.rating = products[index].rating;
              productData.reviews = products[index].reviews;
              products[index] = productData;
              showToast('Product updated successfully');
            }
          } else {
            const maxId = products.reduce((max, p) => p.id > max ? p.id : max, 0);
            productData.id = maxId + 1;
            products.push(productData);
            showToast('New product added to catalog');
          }

          localStorage.setItem('luxe_products', JSON.stringify(products));
          closeProductModal();
          loadCatalogProducts();
        });
      }

      function deleteCatalogProduct(id) {
        const products = JSON.parse(localStorage.getItem('luxe_products')) || [];
        const updated = products.filter(p => p.id !== id);
        localStorage.setItem('luxe_products', JSON.stringify(updated));

        let wishlist = JSON.parse(localStorage.getItem('luxe_wishlist')) || [];
        wishlist = wishlist.filter(wishId => wishId !== id);
        localStorage.setItem('luxe_wishlist', JSON.stringify(wishlist));

        showToast('Product removed from catalog');
        loadCatalogProducts();
      }

      const loadMerchantOrders = () => {
        const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];
        const ordersList = document.getElementById('admin-orders-list');
        if (!ordersList) return;

        ordersList.innerHTML = '';
        orders.forEach(order => {
          const tr = document.createElement('tr');
          const profile = JSON.parse(localStorage.getItem('luxe_profile'));

          let customerName = "James Mitchell";
          if (order.id === 'LX-9821') customerName = profile ? profile.name : "Alex Mercer";
          else if (order.id === 'LX-9743') customerName = "Sofia Rodriguez";
          else if (order.id === 'LX-9612') customerName = "Aisha Khan";

          let badgeClass = 'badge-processing';
          if (order.status === 'Delivered') badgeClass = 'badge-delivered';
          if (order.status === 'In Transit') badgeClass = 'badge-intransit';
          if (order.status === 'Cancelled') badgeClass = 'badge-cancelled';

          tr.innerHTML = `
            <td style="font-family:var(--font-mono); font-weight:600;">${order.id}</td>
            <td><strong>${customerName}</strong></td>
            <td>${formatDate(order.date)}</td>
            <td style="font-weight:600; color:var(--color-accent);">$${order.total.toFixed(2)}</td>
            <td><span class="status-badge ${badgeClass}">${order.status}</span></td>
            <td>
              <select class="status-select" data-order-id="${order.id}">
                <option value="Processing" ${order.status === 'Processing' ? 'selected' : ''}>Processing</option>
                <option value="In Transit" ${order.status === 'In Transit' ? 'selected' : ''}>In Transit</option>
                <option value="Delivered" ${order.status === 'Delivered' ? 'selected' : ''}>Delivered</option>
                <option value="Cancelled" ${order.status === 'Cancelled' ? 'selected' : ''}>Cancelled</option>
              </select>
            </td>
          `;

          tr.querySelector('.status-select').addEventListener('change', (e) => {
            const orderId = e.target.dataset.orderId;
            const newStatus = e.target.value;
            updateOrderStatus(orderId, newStatus);
          });

          ordersList.appendChild(tr);
        });
      };

      function updateOrderStatus(orderId, status) {
        const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];
        const index = orders.findIndex(o => o.id === orderId);

        if (index > -1) {
          orders[index].status = status;
          localStorage.setItem('luxe_orders', JSON.stringify(orders));
          showToast(`Order ${orderId} updated to ${status}`);
          loadMerchantOrders();
        }
      }

      const loadCustomersDirectory = () => {
        const customersList = document.getElementById('admin-customers-list');
        if (!customersList) return;

        customersList.innerHTML = '';
        const profile = JSON.parse(localStorage.getItem('luxe_profile'));
        const orders = JSON.parse(localStorage.getItem('luxe_orders')) || [];

        const customerTotalSpent = orders
          .filter(o => o.id === 'LX-9821' || o.id === 'LX-9743')
          .reduce((sum, o) => sum + o.total, 0);

        const directory = [
          {
            name: profile ? profile.name : "Alex Mercer",
            email: profile ? profile.email : "alex.mercer@example.com",
            phone: profile ? profile.phone : "+1 (555) 555-0199",
            ordersCount: 2,
            spent: customerTotalSpent,
            status: "Active Connoisseur"
          },
          {
            name: "Sofia Rodriguez",
            email: "sofia.rodriguez@example.com",
            phone: "+1 (555) 341-8911",
            ordersCount: 1,
            spent: 195.00,
            status: "Active Member"
          },
          {
            name: "James Mitchell",
            email: "james.mitchell@example.com",
            phone: "+1 (555) 677-2244",
            ordersCount: 0,
            spent: 0.00,
            status: "Idle Account"
          },
          {
            name: "Aisha Khan",
            email: "aisha.khan@example.com",
            phone: "+1 (555) 909-1234",
            ordersCount: 1,
            spent: 224.00,
            status: "Active Member"
          }
        ];

        directory.forEach(client => {
          const tr = document.createElement('tr');
          const initials = client.name.split(' ').map(n => n[0]).join('').toUpperCase();

          tr.innerHTML = `
            <td>
              <div class="product-cell">
                <div class="user-avatar" style="width:36px; height:36px; font-size:0.9rem; margin-bottom:0; background:rgba(255,255,255,0.05); color:var(--color-text-primary); border:1px solid var(--color-border); box-shadow:none;">${initials}</div>
                <span class="product-cell-name">${client.name}</span>
              </div>
            </td>
            <td>${client.email}</td>
            <td style="font-family:var(--font-mono); font-size:0.8rem;">${client.phone}</td>
            <td>${client.ordersCount} orders</td>
            <td style="font-weight:600; color:var(--color-accent);">$${client.spent.toFixed(2)}</td>
            <td><span class="status-badge badge-delivered" style="background:rgba(201,169,110,0.05); color:var(--color-accent); border:1px solid rgba(201,169,110,0.15);">${client.status}</span></td>
          `;
          customersList.appendChild(tr);
        });
      };

      const formatDate = (dateStr) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateStr).toLocaleDateString('en-US', options);
      };

      // Run Initialization
      checkAdminAccess();
    }
  }

});

