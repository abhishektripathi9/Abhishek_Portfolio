/**
 * AMAZON CLONE - MAIN APPLICATION CONTROLLER
 * Bootstraps Hero Carousel, Lightning Deals Countdown, Currency Switcher,
 * Theme Mode (Dark/Light), Back-to-Top, and Freelancer Portfolio Showcase HUD.
 */

class AmazonApp {
  constructor() {
    this.currentCurrency = localStorage.getItem('amz_currency_v2') || 'USD';
    this.currentTheme = localStorage.getItem('amz_theme_v2') || 'dark'; // default to stunning dark luxury mode
    this.carouselIndex = 0;
    this.carouselTimer = null;
    this.dealEndTime = Date.now() + (7 * 3600 + 44 * 60 + 29) * 1000; // ~7h 44m from now

    this.init();
  }

  init() {
    this.applyTheme(this.currentTheme);
    this.initHeroCarousel();
    this.initLightningDealsTimer();
    this.initCurrencySwitcher();
    this.initThemeToggle();
    this.initBackToTop();
    this.initPortfolioHud();

    // Initialize search filter engine after DOM ready
    if (window.amzSearchFilter) {
      window.amzSearchFilter.init();
    }
  }

  // ==========================================
  // 1. HERO CAROUSEL CONTROLS
  // ==========================================
  initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length === 0) return;

    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');
    const dotsContainer = document.getElementById('hero-dots-container');

    // Generate dots
    if (dotsContainer) {
      dotsContainer.innerHTML = Array.from(slides).map((_, i) => `
        <button class="hero-dot ${i === 0 ? 'is-active' : ''}" data-slide-index="${i}" aria-label="Slide ${i + 1}"></button>
      `).join('');

      dotsContainer.querySelectorAll('.hero-dot').forEach(dot => {
        dot.addEventListener('click', () => {
          const index = parseInt(dot.dataset.slideIndex, 10);
          this.goToSlide(index);
          this.restartCarouselTimer();
        });
      });
    }

    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        this.prevSlide();
        this.restartCarouselTimer();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        this.nextSlide();
        this.restartCarouselTimer();
      });
    }

    // Pause on hover
    const carouselContainer = document.getElementById('hero-carousel');
    if (carouselContainer) {
      carouselContainer.addEventListener('mouseenter', () => clearInterval(this.carouselTimer));
      carouselContainer.addEventListener('mouseleave', () => this.startCarouselTimer());
    }

    this.startCarouselTimer();
  }

  goToSlide(index) {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-dot');

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    this.carouselIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('is-active', i === index);
    });
  }

  nextSlide() {
    this.goToSlide(this.carouselIndex + 1);
  }

  prevSlide() {
    this.goToSlide(this.carouselIndex - 1);
  }

  startCarouselTimer() {
    clearInterval(this.carouselTimer);
    this.carouselTimer = setInterval(() => {
      this.nextSlide();
    }, 5500);
  }

  restartCarouselTimer() {
    this.startCarouselTimer();
  }

  // ==========================================
  // 2. LIGHTNING DEALS COUNTDOWN TIMER
  // ==========================================
  initLightningDealsTimer() {
    const hoursEl = document.getElementById('deals-hours');
    const minsEl = document.getElementById('deals-minutes');
    const secsEl = document.getElementById('deals-seconds');

    if (!hoursEl || !minsEl || !secsEl) return;

    const updateTimer = () => {
      const remaining = Math.max(0, this.dealEndTime - Date.now());

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      hoursEl.textContent = String(hours).padStart(2, '0');
      minsEl.textContent = String(minutes).padStart(2, '0');
      secsEl.textContent = String(seconds).padStart(2, '0');

      if (remaining <= 0) {
        // Reset timer if expired for continuous demonstration
        this.dealEndTime = Date.now() + 8 * 3600 * 1000;
      }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ==========================================
  // 3. CURRENCY CONVERTER
  // ==========================================
  initCurrencySwitcher() {
    const currencySelects = document.querySelectorAll('.currency-selector');

    currencySelects.forEach(sel => {
      sel.value = this.currentCurrency;
      sel.addEventListener('change', (e) => {
        this.setCurrency(e.target.value);
      });
    });

    // Update active currency code badge in navbar
    this.updateCurrencyNavbarBadge();
  }

  setCurrency(currencyCode, showToast = true) {
    if (CURRENCIES[currencyCode]) {
      this.currentCurrency = currencyCode;
      localStorage.setItem('amz_currency_v2', currencyCode);

      // Synchronize all currency dropdown elements across navbar and modals
      document.querySelectorAll('.currency-selector').forEach(sel => {
        sel.value = currencyCode;
      });

      this.updateCurrencyNavbarBadge();

      // Refresh product grid and cart to reflect new currency
      if (window.amzSearchFilter) window.amzSearchFilter.applyFilters();
      if (window.amzCart) window.amzCart.broadcastCartUpdate();
      if (window.amzModal && window.amzModal.activeModal) {
        if (window.amzModal.currentQuickViewProduct) {
          window.amzModal.openQuickView(window.amzModal.currentQuickViewProduct);
        }
      }

      if (showToast && window.amzCart) {
        window.amzCart.showToast(`Currency updated to ${CURRENCIES[currencyCode].name}`, "info");
      }
    }
  }

  updateCurrencyNavbarBadge() {
    const codeEl = document.getElementById('nav-current-currency-code');
    const symbolEl = document.getElementById('nav-current-currency-symbol');
    if (codeEl) codeEl.textContent = this.currentCurrency;
    if (symbolEl && CURRENCIES[this.currentCurrency]) {
      symbolEl.textContent = CURRENCIES[this.currentCurrency].symbol;
    }
  }

  formatPrice(usdAmount) {
    const cur = CURRENCIES[this.currentCurrency] || CURRENCIES.USD;
    const converted = (usdAmount * cur.rate);

    if (this.currentCurrency === 'INR') {
      // Indian numbering format (e.g. ₹28,990)
      return `${cur.symbol}${Math.round(converted).toLocaleString('en-IN')}`;
    }

    if (this.currentCurrency === 'JPY') {
      // Japanese Yen has no decimal places (e.g. ¥52,800)
      return `${cur.symbol}${Math.round(converted).toLocaleString('ja-JP')}`;
    }

    return `${cur.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  }

  // ==========================================
  // 4. DARK / LIGHT THEME TOGGLE
  // ==========================================
  initThemeToggle() {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');

    toggleBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const nextTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(nextTheme);
      });
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('amz_theme_v2', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Update icons on toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' 
        ? `<span class="theme-icon">☀️</span> <span class="theme-label">Light Mode</span>`
        : `<span class="theme-icon">🌙</span> <span class="theme-label">Dark Mode</span>`;
    });
  }

  // ==========================================
  // 5. BACK TO TOP
  // ==========================================
  initBackToTop() {
    const backBtn = document.getElementById('footer-back-to-top');
    if (backBtn) {
      backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  // ==========================================
  // 6. FREELANCE PORTFOLIO SHOWCASE HUD
  // ==========================================
  initPortfolioHud() {
    const hudTrigger = document.getElementById('portfolio-hud-trigger');
    const hudModal = document.getElementById('portfolio-hud-modal');
    const hudClose = document.getElementById('portfolio-hud-close');

    if (hudTrigger && hudModal) {
      hudTrigger.addEventListener('click', () => {
        if (window.amzModal) {
          window.amzModal.showModal(hudModal);
        }
      });
    }

    if (hudClose && hudModal) {
      hudClose.addEventListener('click', () => {
        if (window.amzModal) {
          window.amzModal.hideModal(hudModal);
        }
      });
    }
  }
}

// Instantiate global app
window.amzApp = new AmazonApp();
