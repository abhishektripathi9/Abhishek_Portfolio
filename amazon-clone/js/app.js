/**
 * UDAANMART - MAIN APPLICATION CONTROLLER (js/app.js)
 * PILLARS 1, 5 & 6:
 * - Bootstraps Hero Carousel, Lightning Deals Countdown, Currency Switcher (Intl.NumberFormat)
 * - Role Switcher Pill (Buyer View <-> Karigar Studio)
 * - PWA Service Worker Registration & Install Trigger
 * - Theme Mode (Midnight Slate / Porcelain Cream)
 * - Micro-interactions, Trending Tabs, and Back-to-Top
 */

class AmazonApp {
  constructor() {
    window.amzApp = this;
    this.currentCurrency = localStorage.getItem('amz_currency_v2') || 'INR';
    localStorage.removeItem('amz_theme_v2');
    this.currentTheme = localStorage.getItem('udaan_theme_v1') || 'cream';
    this.carouselIndex = 0;
    this.carouselTimer = null;
    this.dealEndTime = Date.now() + (7 * 3600 + 44 * 60 + 29) * 1000;
    this.deferredPrompt = null;

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
    this.initRoleSwitcher();
    this.initPwa();

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
    const flashClock = document.getElementById('flash-clock');
    if (!flashClock) return;

    const updateTimer = () => {
      const remaining = Math.max(0, this.dealEndTime - Date.now());

      const hours = Math.floor(remaining / (1000 * 60 * 60));
      const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remaining % (1000 * 60)) / 1000);

      flashClock.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (remaining <= 0) {
        this.dealEndTime = Date.now() + 8 * 3600 * 1000;
      }
    };

    updateTimer();
    setInterval(updateTimer, 1000);
  }

  // ==========================================
  // 3. CURRENCY SWITCHER (Intl.NumberFormat)
  // ==========================================
  initCurrencySwitcher() {
    const currencySelects = document.querySelectorAll('.currency-selector');

    currencySelects.forEach(sel => {
      sel.value = this.currentCurrency;
      sel.addEventListener('change', (e) => {
        this.setCurrency(e.target.value);
      });
    });

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
    if (typeof CURRENCIES !== 'undefined' && CURRENCIES[currencyCode]) {
      this.currentCurrency = currencyCode;
      localStorage.setItem('amz_currency_v2', currencyCode);

      document.querySelectorAll('.currency-selector').forEach(sel => {
        sel.value = currencyCode;
      });

      this.updateCurrencyNavbarBadge();
      this.updateFeaturedPrices();

      if (window.amzSearchFilter) window.amzSearchFilter.applyFilters();
      if (window.amzCart) window.amzCart.broadcastCartUpdate();
      if (window.amzModal && window.amzModal.activeModal && window.amzModal.currentQuickViewProduct) {
        window.amzModal.openQuickView(window.amzModal.currentQuickViewProduct);
      }

      if (showToast && window.amzCart) {
        window.amzCart.showToast(`Currency updated to ${CURRENCIES[currencyCode].name}`, "info");
      }
    }
  }

  updateCurrencyNavbarBadge() {
    const symbolEl = document.getElementById('nav-current-currency-symbol');
    if (symbolEl && typeof CURRENCIES !== 'undefined' && CURRENCIES[this.currentCurrency]) {
      symbolEl.textContent = CURRENCIES[this.currentCurrency].symbol;
    }
  }

  formatPrice(amount) {
    if (typeof amount !== 'number') amount = parseFloat(amount) || 0;
    const cur = (typeof CURRENCIES !== 'undefined' && CURRENCIES[this.currentCurrency]) 
      ? CURRENCIES[this.currentCurrency] 
      : { code: 'INR', symbol: '₹', rate: 1.0 };

    // Standardize to clean Indian Rupee
    const inrValue = amount >= 500 ? Math.round(amount) : Math.round(amount * 83.5);

    try {
      if (this.currentCurrency === 'INR') {
        return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
        }).format(inrValue);
      }

      const targetRate = (cur.rate || 1.0) / 83.5;
      const converted = inrValue * targetRate;

      if (this.currentCurrency === 'USD') {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(converted);
      }

      if (this.currentCurrency === 'EUR') {
        return new Intl.NumberFormat('de-DE', {
          style: 'currency',
          currency: 'EUR'
        }).format(converted);
      }

      if (this.currentCurrency === 'GBP') {
        return new Intl.NumberFormat('en-GB', {
          style: 'currency',
          currency: 'GBP'
        }).format(converted);
      }

      if (this.currentCurrency === 'JPY') {
        return new Intl.NumberFormat('ja-JP', {
          style: 'currency',
          currency: 'JPY',
          maximumFractionDigits: 0
        }).format(Math.round(converted));
      }
    } catch (e) {}

    // Fallback
    return `₹${inrValue.toLocaleString('en-IN')}`;
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

    document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
      btn.innerHTML = theme === 'dark' 
        ? `<span class="theme-icon">🍦</span> <span class="theme-label">Cream Mode</span>`
        : `<span class="theme-icon">🌙</span> <span class="theme-label">Night Mode</span>`;
    });
  }

  // ==========================================
  // 5. ROLE SWITCHER PILL (BUYER <-> KARIGAR STUDIO)
  // ==========================================
  initRoleSwitcher() {
    const pills = document.querySelectorAll('.role-switcher-pill, #role-switcher-pill');
    pills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        if (window.amzStore) {
          window.amzStore.toggleRole();
        }
      });
    });

    // Synchronize initial state from Store
    if (window.amzStore) {
      const currentRole = window.amzStore.getRole();
      pills.forEach(pill => {
        const isSeller = (currentRole === 'seller');
        pill.classList.toggle('role-seller', isSeller);
        const label = pill.querySelector('.role-label');
        if (label) {
          label.textContent = isSeller ? 'Karigar Studio' : 'Buyer View';
        }
      });
    }
  }

  // ==========================================
  // 6. BACK TO TOP
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
  // 7. FREELANCE PORTFOLIO SHOWCASE HUD
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
  // 8. STITCH UI ENHANCED MICRO-INTERACTIONS
  // ==========================================
  initStitchInteractions() {
    // 1. Voice Search Web Speech API
    const voiceBtn = document.getElementById('voice-search-btn');
    if (voiceBtn) {
      voiceBtn.addEventListener('click', () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          const recognition = new SpeechRecognition();
          recognition.lang = 'en-IN';
          recognition.onstart = () => {
            if (window.amzCart) window.amzCart.showToast('🎙️ Listening... speak your craft or product search', 'info');
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
          if (window.amzCart) window.amzCart.showToast('🎙️ Voice Search is ready! Please type your query.', 'info');
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

  // ==========================================
  // 9. PROGRESSIVE WEB APP (PWA) READY & DELIGHT
  // ==========================================
  initPwa() {
    // Register Service Worker
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
          .then(reg => {
            console.log('UdaanMart Service Worker registered:', reg.scope);
          })
          .catch(err => {
            console.log('UdaanMart Service Worker registration failed:', err);
          });
      });
    }

    // Capture install prompt for utility bar button and floating banner
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      const installBtn = document.getElementById('btn-pwa-install');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
        installBtn.addEventListener('click', () => {
          this.triggerPwaInstall();
        });
      }

      const installBanner = document.getElementById('pwa-install-banner');
      if (installBanner && !sessionStorage.getItem('udaan_pwa_dismissed')) {
        installBanner.classList.add('is-visible');
      }
    });

    // PWA Floating Banner Actions
    const bannerInstallBtn = document.getElementById('pwa-install-btn');
    if (bannerInstallBtn) {
      bannerInstallBtn.addEventListener('click', () => {
        this.triggerPwaInstall();
      });
    }

    const bannerDismissBtn = document.getElementById('pwa-dismiss-btn');
    if (bannerDismissBtn) {
      bannerDismissBtn.addEventListener('click', () => {
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.remove('is-visible');
        sessionStorage.setItem('udaan_pwa_dismissed', 'true');
      });
    }

    // Online / Offline Status Detection
    window.addEventListener('offline', () => {
      if (window.amzCart) {
        window.amzCart.showToast('📶 You are browsing offline. Cached craft catalog is available.', 'warning');
      }
    });

    window.addEventListener('online', () => {
      if (window.amzCart) {
        window.amzCart.showToast('⚡ Back online! Real-time syncing restored.', 'success');
      }
    });
  }

  triggerPwaInstall() {
    if (this.deferredPrompt) {
      this.deferredPrompt.prompt();
      this.deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted' && window.amzCart) {
          window.amzCart.showToast('🎉 Thank you for installing UdaanMart!');
        }
        this.deferredPrompt = null;
        const banner = document.getElementById('pwa-install-banner');
        if (banner) banner.classList.remove('is-visible');
        const installBtn = document.getElementById('btn-pwa-install');
        if (installBtn) installBtn.style.display = 'none';
      });
    } else {
      if (window.amzCart) {
        window.amzCart.showToast('📱 To install on Desktop/Mobile: Use browser menu ➔ "Install App" or "Add to Home screen"', 'info');
      }
    }
  }

  // ==========================================
  // 10. DELIGHT AUDIO SYNTHESIZER & CONFETTI
  // ==========================================
  playSuccessChime() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      // Bright pleasant C-major arpeggio (C5, E5, G5, C6)
      const freqs = [523.25, 659.25, 783.99, 1046.50];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        gain.gain.setValueAtTime(0.08, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.38);
      });
    } catch (e) {
      // Audio autoplay policy fallback
    }
  }

  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6', '#fcd34d', '#14b8a6'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2 + (Math.random() - 0.5) * 300,
        y: canvas.height / 3 + (Math.random() - 0.5) * 120,
        r: Math.random() * 5 + 3,
        dx: (Math.random() - 0.5) * 16,
        dy: (Math.random() - 0.7) * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 85
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;

      particles.forEach(p => {
        if (p.life > 0) {
          alive = true;
          p.x += p.dx;
          p.y += p.dy;
          p.dy += 0.32; // Gravity
          p.life--;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.life / 85;
          ctx.fill();
        }
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;
      }
    };

    animate();
  }
}

// Instantiate global app
window.amzApp = new AmazonApp();
