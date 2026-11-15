/**
 * UDAANMART - AUTHENTICATION & ROLE-BASED ACCESS CONTROL ENGINE (js/auth.js)
 * PILLAR: Separate Role-Based Portals (Buyer vs Local Dukaan / Karigar Seller)
 * 1. 🛍️ Buyer Login / Sign-Up (Mobile OTP & Instant Verification)
 * 2. 🏪 Local Dukaan & Rural Karigar Onboarding / Seller Studio
 * 3. 1-Click Role Switcher & Real-Time Header State Sync
 */

class UdaanAuthEngine {
  constructor() {
    this.STORAGE_KEYS = {
      BUYER: 'udaan_buyer_profile',
      SELLER: 'udaan_seller_profile',
      ACTIVE_PORTAL: 'udaan_active_portal'
    };

    this.defaultBuyer = {
      isLoggedIn: false,
      name: 'Abhishek Tripathi',
      phone: '9876543210',
      email: 'abhishek@udaanmart.in',
      city: 'New Delhi',
      pincode: '110001',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
    };

    this.generatedOTP = '123456';
  }

  init() {
    // 1. Bind DOM triggers
    this.bindBuyerAuthTriggers();
    this.bindSellerAuthTriggers();
    this.bindPortalSwitcher();

    // 2. Sync UI on load
    this.updateNavbarAuthState();
    this.applyPortalView();

    // 3. Dual Role Router: Prompt login if unauthenticated; open studio if seller
    if (!this.isBuyerLoggedIn() && !this.isSellerRegistered()) {
      setTimeout(() => {
        if (!document.querySelector('.modal.is-open, .amz-modal.is-open')) {
          this.openBuyerAuthModal();
        }
      }, 350);
    } else {
      const portal = this.getActivePortal();
      if (portal === 'seller') {
        setTimeout(() => {
          this.openSellerPortal();
        }, 400);
      }
    }
  }

  // Dual Role Post-Login Actions
  loginAsBuyer(profile) {
    this.setActivePortal('buyer');
    this.saveBuyerProfile({ ...profile, isLoggedIn: true });
    this.closeBuyerAuthModal();
    if (window.amzSeller && typeof window.amzSeller.closeModal === 'function') {
      window.amzSeller.closeModal();
    }
    this.applyPortalView();
    this.updateNavbarAuthState();
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (window.amzApp && window.amzApp.playSuccessChime) {
      window.amzApp.playSuccessChime();
    }
    if (window.amzCart) {
      window.amzCart.showToast(`🛍️ Welcome, ${profile.name || 'Valued Buyer'}! You are in Buyer Mode.`, 'info');
    }
  }

  loginAsSeller(sellerData) {
    this.setActivePortal('seller');
    if (window.amzStore) {
      window.amzStore.saveSellerProfile(sellerData);
    }
    this.closeBuyerAuthModal();
    this.applyPortalView();
    this.updateNavbarAuthState();
    this.openSellerPortal();
    if (window.amzApp && window.amzApp.playSuccessChime) {
      window.amzApp.playSuccessChime();
    }
    if (window.amzCart) {
      window.amzCart.showToast(`🏪 Welcome, ${sellerData.shopName || 'Karigar Studio'}! Opening Seller Central...`, 'info');
    }
  }

  // ==========================================================================
  // 1. BUYER PROFILE & AUTHENTICATION STATE
  // ==========================================================================
  getBuyerProfile() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.BUYER);
      return data ? JSON.parse(data) : { isLoggedIn: false, name: '', phone: '' };
    } catch (e) {
      return { isLoggedIn: false, name: '', phone: '' };
    }
  }

  saveBuyerProfile(profile) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.BUYER, JSON.stringify(profile));
    } catch (e) {}
    this.updateNavbarAuthState();
    window.dispatchEvent(new CustomEvent('udaan:auth-changed', { detail: { type: 'buyer', profile } }));
  }

  isBuyerLoggedIn() {
    const profile = this.getBuyerProfile();
    return !!(profile && profile.isLoggedIn);
  }

  logoutBuyer() {
    const profile = this.getBuyerProfile() || this.defaultBuyer;
    profile.isLoggedIn = false;
    this.saveBuyerProfile(profile);
    this.renderBuyerModalView();
    if (window.amzCart) {
      window.amzCart.showToast('🚪 Signed out of Buyer Account. Enter mobile number to sign in again.', 'info');
    }
  }

  // ==========================================================================
  // 2. SELLER / DUKAAN PROFILE & STATE
  // ==========================================================================
  getSellerProfile() {
    if (window.amzStore && typeof window.amzStore.getSellerProfile === 'function') {
      return window.amzStore.getSellerProfile();
    }
    try {
      const data = localStorage.getItem(this.STORAGE_KEYS.SELLER);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      return null;
    }
  }

  isSellerRegistered() {
    const profile = this.getSellerProfile();
    return !!(profile && profile.shopName);
  }

  // ==========================================================================
  // 3. PORTAL ROLE STATE (BUYER vs SELLER)
  // ==========================================================================
  getActivePortal() {
    return localStorage.getItem(this.STORAGE_KEYS.ACTIVE_PORTAL) || 'buyer';
  }

  setActivePortal(portal) {
    const normalized = portal === 'seller' ? 'seller' : 'buyer';
    try {
      localStorage.setItem(this.STORAGE_KEYS.ACTIVE_PORTAL, normalized);
    } catch (e) {}

    if (window.amzStore) {
      window.amzStore.role = normalized;
      try {
        localStorage.setItem(window.amzStore.STORAGE_KEYS.ROLE, normalized);
      } catch (e) {}
    }

    this.updateNavbarAuthState();
    this.applyPortalView();
    window.dispatchEvent(new CustomEvent('udaan:portal-changed', { detail: { portal: normalized } }));
  }

  // ==========================================================================
  // 4. BUYER AUTH MODAL CONTROLLER
  // ==========================================================================
  bindBuyerAuthTriggers() {
    const accountBtn = document.getElementById('nav-account-btn');
    const avatarWrap = document.querySelector('.nav-user-avatar-wrap');
    const modalClose = document.getElementById('buyer-auth-close');

    if (accountBtn) {
      accountBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openBuyerAuthModal();
      });
    }

    if (avatarWrap) {
      avatarWrap.addEventListener('click', (e) => {
        e.preventDefault();
        this.openBuyerAuthModal();
      });
    }

    if (modalClose) {
      modalClose.addEventListener('click', () => this.closeBuyerAuthModal());
    }

    // Modal Tabs Switcher
    const tabLoginBtn = document.getElementById('tab-btn-buyer-login');
    const tabRegBtn = document.getElementById('tab-btn-buyer-register');
    const formLogin = document.getElementById('buyer-otp-login-form');
    const formReg = document.getElementById('buyer-register-form');

    if (tabLoginBtn && tabRegBtn) {
      tabLoginBtn.addEventListener('click', () => {
        tabLoginBtn.classList.add('is-active');
        tabRegBtn.classList.remove('is-active');
        if (formLogin) formLogin.style.display = 'block';
        if (formReg) formReg.style.display = 'none';
      });

      tabRegBtn.addEventListener('click', () => {
        tabRegBtn.classList.add('is-active');
        tabLoginBtn.classList.remove('is-active');
        if (formLogin) formLogin.style.display = 'none';
        if (formReg) formReg.style.display = 'block';
      });
    }

    // Get OTP Button
    const btnSendOtp = document.getElementById('btn-send-buyer-otp');
    const phoneInput = document.getElementById('buyer-login-phone');
    const otpRow = document.getElementById('buyer-otp-row');
    const otpHint = document.getElementById('buyer-otp-hint');
    const otpInput = document.getElementById('buyer-otp-input');

    if (btnSendOtp && phoneInput && otpRow) {
      btnSendOtp.addEventListener('click', () => {
        const val = phoneInput.value.trim();
        if (val.length < 10) {
          if (window.amzCart) window.amzCart.showToast('Please enter a valid 10-digit mobile number.', 'error');
          phoneInput.focus();
          return;
        }

        // Generate OTP
        this.generatedOTP = '123456';
        otpRow.style.display = 'block';
        btnSendOtp.textContent = 'Resend OTP';
        if (otpInput) {
          otpInput.focus();
        }
        if (window.amzCart) {
          window.amzCart.showToast(`📲 Demo OTP sent to +91 ${val}! Use code: 123456`, 'info');
        }
      });
    }

    if (otpHint && otpInput) {
      otpHint.addEventListener('click', () => {
        otpInput.value = this.generatedOTP;
      });
    }

    // OTP Login Form Submit
    if (formLogin) {
      formLogin.addEventListener('submit', (e) => {
        e.preventDefault();
        const phone = phoneInput ? phoneInput.value.trim() : '9876543210';
        const enteredOtp = otpInput ? otpInput.value.trim() : '';

        if (!enteredOtp) {
          if (window.amzCart) window.amzCart.showToast('Please enter the 6-digit OTP.', 'error');
          if (otpInput) otpInput.focus();
          return;
        }

        // Verify and log in as Buyer
        const existing = this.getBuyerProfile() || {};
        const updated = {
          ...existing,
          isLoggedIn: true,
          name: existing.name || 'Verified Buyer',
          phone: phone,
          avatar: existing.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
        };
        this.loginAsBuyer(updated);
      });
    }

    // New Buyer Register Form Submit
    if (formReg) {
      formReg.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('buyer-reg-name') ? document.getElementById('buyer-reg-name').value.trim() : 'Valued Buyer';
        const phone = document.getElementById('buyer-reg-phone') ? document.getElementById('buyer-reg-phone').value.trim() : '9876543210';
        const city = document.getElementById('buyer-reg-city') ? document.getElementById('buyer-reg-city').value.trim() : 'New Delhi, 110001';

        const newProfile = {
          isLoggedIn: true,
          name: name,
          phone: phone,
          city: city,
          email: `${name.toLowerCase().replace(/\s+/g, '')}@gmail.com`,
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80'
        };
        this.loginAsBuyer(newProfile);
      });
    }

    // 1-Click Demo Login as Abhishek (Buyer)
    const btnDemoBuyer = document.getElementById('btn-quick-demo-buyer');
    if (btnDemoBuyer) {
      btnDemoBuyer.addEventListener('click', () => {
        this.loginAsBuyer({ ...this.defaultBuyer, isLoggedIn: true });
      });
    }

    // 1-Click Demo Login as Varanasi Guild (Seller)
    const btnDemoSeller = document.getElementById('btn-quick-demo-seller');
    if (btnDemoSeller) {
      btnDemoSeller.addEventListener('click', () => {
        this.loginAsSeller({
          shopName: "Varanasi Silk Weaver Guild",
          ownerName: "Master Weaver Ramkishan",
          phone: "9876543210",
          city: "Varanasi, Uttar Pradesh",
          pincode: "221001",
          giTag: "GI-IN-UP-0042 (Banarasi Brocade)"
        });
      });
    }

    // Logged-in Profile Actions
    const btnSignOut = document.getElementById('btn-buyer-signout');
    if (btnSignOut) {
      btnSignOut.addEventListener('click', () => this.logoutBuyer());
    }

    const btnSwitchAccount = document.getElementById('btn-buyer-switch-account');
    if (btnSwitchAccount) {
      btnSwitchAccount.addEventListener('click', () => {
        const wrap = document.getElementById('buyer-auth-form-wrap');
        const card = document.getElementById('buyer-profile-card');
        if (wrap) wrap.style.display = 'block';
        if (card) card.style.display = 'none';
      });
    }

    const btnBuyerOrders = document.getElementById('btn-buyer-orders');
    if (btnBuyerOrders) {
      btnBuyerOrders.addEventListener('click', () => {
        this.closeBuyerAuthModal();
        if (window.amzModal) window.amzModal.openOrdersModal('orders');
      });
    }

    const btnBuyerWishlist = document.getElementById('btn-buyer-wishlist');
    if (btnBuyerWishlist) {
      btnBuyerWishlist.addEventListener('click', () => {
        this.closeBuyerAuthModal();
        if (window.amzModal) window.amzModal.openOrdersModal('wishlist');
      });
    }

    const btnBuyerLoc = document.getElementById('btn-buyer-location');
    if (btnBuyerLoc) {
      btnBuyerLoc.addEventListener('click', () => {
        this.closeBuyerAuthModal();
        const locModal = document.getElementById('location-modal');
        if (window.amzModal && locModal) window.amzModal.showModal(locModal);
      });
    }

    const btnBuyerSwitchSeller = document.getElementById('btn-buyer-switch-seller');
    if (btnBuyerSwitchSeller) {
      btnBuyerSwitchSeller.addEventListener('click', () => {
        this.closeBuyerAuthModal();
        this.openSellerPortal();
      });
    }
  }

  openBuyerAuthModal() {
    const modal = document.getElementById('buyer-auth-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    this.renderBuyerModalView();

    modal.classList.add('is-open');
    modal.classList.add('active');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  closeBuyerAuthModal() {
    const modal = document.getElementById('buyer-auth-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.classList.remove('active');
    if (overlay && !document.querySelector('.modal.is-open:not(#buyer-auth-modal), .amz-modal.is-open, .cart-drawer.is-open, .dept-drawer.is-open')) {
      overlay.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  renderBuyerModalView() {
    const profile = this.getBuyerProfile();
    const isLoggedIn = profile && profile.isLoggedIn;
    const profileCard = document.getElementById('buyer-profile-card');
    const authFormWrap = document.getElementById('buyer-auth-form-wrap');

    if (isLoggedIn) {
      if (profileCard) profileCard.style.display = 'block';
      if (authFormWrap) authFormWrap.style.display = 'none';

      const nameEl = document.getElementById('buyer-card-name');
      const phoneEl = document.getElementById('buyer-card-phone');
      const avatarEl = document.getElementById('buyer-card-avatar');

      if (nameEl) nameEl.textContent = profile.name || 'Valued Buyer';
      if (phoneEl) phoneEl.textContent = `📱 +91 ${profile.phone || '98765 43210'}`;
      if (avatarEl && profile.avatar) avatarEl.src = profile.avatar;
    } else {
      if (profileCard) profileCard.style.display = 'none';
      if (authFormWrap) authFormWrap.style.display = 'block';
    }
  }

  // ==========================================================================
  // 5. SELLER PORTAL LAUNCHER & RETURN TO BUYER STOREFRONT
  // ==========================================================================
  bindSellerAuthTriggers() {
    const sellerHubBtn = document.getElementById('open-seller-hub-btn');
    const footerSellLink = document.getElementById('footer-sell-link');

    if (sellerHubBtn) {
      sellerHubBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSellerPortal();
      });
    }

    if (footerSellLink) {
      footerSellLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSellerPortal();
      });
    }

    // Back to Storefront button inside Seller Central
    const backBtn = document.getElementById('btn-back-to-storefront');
    if (backBtn) {
      backBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToStorefront();
      });
    }
  }

  openSellerPortal() {
    this.setActivePortal('seller');
    if (window.amzSeller && typeof window.amzSeller.openModal === 'function') {
      window.amzSeller.openModal('list');
    }
  }

  switchToStorefront() {
    this.setActivePortal('buyer');
    if (window.amzSeller && typeof window.amzSeller.closeModal === 'function') {
      window.amzSeller.closeModal();
    }
    if (typeof window.scrollTo === 'function') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    if (window.amzCart) {
      window.amzCart.showToast('🛍️ Switched back to Buyer Storefront! Happy shopping.', 'info');
    }
  }

  // ==========================================================================
  // 6. ROLE SWITCHER PILL IN HEADER
  // ==========================================================================
  bindPortalSwitcher() {
    const pill = document.getElementById('role-switcher-pill');
    if (pill) {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const current = this.getActivePortal();
        if (current === 'buyer') {
          this.openSellerPortal();
        } else {
          this.switchToStorefront();
        }
      });
    }
  }

  // ==========================================================================
  // 7. HEADER / NAVBAR VISUAL STATE SYNC
  // ==========================================================================
  updateNavbarAuthState() {
    const profile = this.getBuyerProfile();
    const portal = this.getActivePortal();

    // 1. Account name in navbar
    const nameLabel = document.querySelector('#nav-account-btn .nav-item-small');
    if (nameLabel) {
      if (profile && profile.isLoggedIn) {
        const firstName = (profile.name || 'Abhishek').split(' ')[0];
        nameLabel.textContent = `Hello, ${firstName}`;
      } else {
        nameLabel.textContent = 'Hello, Sign in';
      }
    }

    // 2. Role Switcher Pill in navbar
    const rolePill = document.getElementById('role-switcher-pill');
    if (rolePill) {
      const icon = rolePill.querySelector('.role-icon');
      const label = rolePill.querySelector('.role-label');
      if (portal === 'seller') {
        if (icon) icon.textContent = '🏭';
        if (label) label.textContent = 'Karigar Studio';
        rolePill.classList.add('is-seller-active');
      } else {
        if (icon) icon.textContent = '🛍️';
        if (label) label.textContent = 'Buyer View';
        rolePill.classList.remove('is-seller-active');
      }
    }
  }

  applyPortalView() {
    const portal = this.getActivePortal();
    const sellerBadgePill = document.getElementById('open-seller-hub-btn');
    const sellerModeBanner = document.getElementById('seller-mode-banner');
    const shopNameSpan = document.getElementById('seller-mode-shop-name');

    if (portal === 'seller') {
      if (document && document.body) document.body.classList.add('seller-mode-active');
      if (sellerBadgePill) sellerBadgePill.classList.add('is-active');
      if (sellerModeBanner) {
        sellerModeBanner.style.display = 'block';
        const sellerProfile = this.getSellerProfile();
        if (shopNameSpan && sellerProfile) {
          shopNameSpan.textContent = sellerProfile.shopName || 'Varanasi Silk Weaver Guild';
        }
      }
    } else {
      if (document && document.body) document.body.classList.remove('seller-mode-active');
      if (sellerBadgePill) sellerBadgePill.classList.remove('is-active');
      if (sellerModeBanner) sellerModeBanner.style.display = 'none';
    }

    // Bind banner buttons if present
    const btnOpenStudio = document.getElementById('btn-seller-banner-open-studio');
    if (btnOpenStudio && !btnOpenStudio._bound) {
      btnOpenStudio._bound = true;
      btnOpenStudio.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSellerPortal();
      });
    }

    const btnSwitchBuyer = document.getElementById('btn-seller-banner-switch-buyer');
    if (btnSwitchBuyer && !btnSwitchBuyer._bound) {
      btnSwitchBuyer._bound = true;
      btnSwitchBuyer.addEventListener('click', (e) => {
        e.preventDefault();
        this.switchToStorefront();
      });
    }
  }
}

// Global Singleton Instance
window.amzAuth = new UdaanAuthEngine();
document.addEventListener('DOMContentLoaded', () => {
  window.amzAuth.init();
});
