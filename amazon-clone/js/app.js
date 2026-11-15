/**
 * UDAANMART - MAIN APPLICATION CONTROLLER
 * Bootstraps Hero Carousel, Lightning Deals Countdown, Currency Switcher,
 * Theme Mode (Dark/Light), Back-to-Top, and Freelancer Portfolio Showcase HUD.
 */

class AmazonApp {
  constructor() {
    this.currentCurrency = localStorage.getItem('amz_currency_v2') || 'USD';
    localStorage.removeItem('amz_theme_v2');
    this.currentTheme = localStorage.getItem('udaan_theme_v1') || 'cream'; // default to stunning dark luxury mode
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
    this.initStitchInteractions();

    // Initialize search filter engine after DOM ready
    if (window.amzSearchFilter) {
      window.amzSearchFilter.init();
    }
  }

  // ==========================================
  // 1. HERO CAROUSEL CONTROLS
  // ==========================================
  initHeroCarousel() {
    const slides = document.querySelectorAll('.hero-luxury-slide, .hero-slide');
    if (slides.length === 0) return;

    const prevBtn = document.getElementById('hero-prev-btn');
    const nextBtn = document.getElementById('hero-next-btn');

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
    const slides = document.querySelectorAll('.hero-luxury-slide, .hero-slide');
    if (slides.length === 0) return;

    if (index >= slides.length) index = 0;
    if (index < 0) index = slides.length - 1;

    this.carouselIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle('is-active', i === index);
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

      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(minutes).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(seconds).padStart(2, '0');

      const flashClock = document.getElementById('flash-clock');
      if (flashClock) {
        flashClock.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
      }

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
    this.updateFeaturedPrices();
  }

  updateFeaturedPrices() {
    document.querySelectorAll('.current-price[data-base-price]').forEach(el => {
      const base = parseFloat(el.getAttribute('data-base-price'));
      if (!isNaN(base)) el.textContent = this.formatPrice(base);
    });
    document.querySelectorAll('.original-price[data-base-price]').forEach(el => {
      const base = parseFloat(el.getAttribute('data-base-price'));
      if (!isNaN(base)) el.textContent = this.formatPrice(base);
    });
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
      this.updateFeaturedPrices();

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
        const nextTheme = this.currentTheme === 'dark' ? 'cream' : 'dark';
        this.applyTheme(nextTheme);
      });
    });
  }

  applyTheme(theme) {
    this.currentTheme = theme;
    localStorage.setItem('udaan_theme_v1', theme);
    document.documentElement.setAttribute('data-theme', theme);

    // Update icons on toggle buttons
    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' 
        ? `<span class="theme-icon">🍦</span> <span class="theme-label">Cream Mode</span>`
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

  // ==========================================
  // 7. STITCH UI ENHANCED MICRO-INTERACTIONS
  // ==========================================
  initStitchInteractions() {
    // 1. Voice Search Web Speech API
    const voiceBtn = document.getElementById('voice-search-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-US';
          recognition.onstart = () => {
            if (window.amzCart) window.amzCart.showToast('🎙️ Listening... please speak your search', 'info');
          };
          recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            const searchInput = document.getElementById('navbar-search-input');
            if (searchInput) {
              searchInput.value = transcript;
              if (window.amzSearchFilter) window.amzSearchFilter.applyFilters();
            }
            if (window.amzCart) window.amzCart.showToast(`Searched for: "${transcript}"`, 'success');
          };
          recognition.onerror = () => {
            if (window.amzCart) window.amzCart.showToast('🎙️ Microphone ready. Please try again.', 'info');
          };
          recognition.start();
        } else {
          if (window.amzCart) window.amzCart.showToast('🎙️ Voice Search is ready! Please type or speak your query.', 'info');
        }
      });
    }

    // 2. Trending Recommendations Tabs Filtering
    const trendingTabs = document.querySelectorAll('.trending-tab-btn');
    const trendingCards = document.querySelectorAll('.trending-prod-card');

    trendingTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        trendingTabs.forEach(t => t.classList.remove('is-active'));
        tab.classList.add('is-active');

        const filter = tab.textContent.trim().toLowerCase();
        trendingCards.forEach(card => {
          const cat = (card.querySelector('.trending-prod-cat')?.textContent || '').toLowerCase();
          if (filter.includes('all')) {
            card.style.display = 'flex';
          } else if (filter.includes('footwear') && cat.includes('footwear')) {
            card.style.display = 'flex';
          } else if (filter.includes('apparel') && (cat.includes('fashion') || cat.includes('clothing'))) {
            card.style.display = 'flex';
          } else if (filter.includes('electronics') && (cat.includes('audio') || cat.includes('electronics'))) {
            card.style.display = 'flex';
          } else if (filter.includes('artisan') && (cat.includes('heritage') || cat.includes('karigar'))) {
            card.style.display = 'flex';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });

    // 3. Flagship Category Filter Pills
    const flagshipPills = document.querySelectorAll('.flagship-pill');
    flagshipPills.forEach(pill => {
      pill.addEventListener('click', () => {
        flagshipPills.forEach(p => p.classList.remove('is-active'));
        pill.classList.add('is-active');
      });
    });
  }
}

// Instantiate global app
window.amzApp = new AmazonApp();
