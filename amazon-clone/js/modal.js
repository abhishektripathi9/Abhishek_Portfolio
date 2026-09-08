/**
 * AMAZON CLONE - MODALS, DRAWERS & INTERACTIVE PANELS
 * Handles Quick View popover, Cart slide-out drawer, Department side-menu,
 * Delivery location selector, and Wishlist / Orders modal.
 */

class ModalEngine {
  constructor() {
    this.activeModal = null;
    this.currentQuickViewProduct = null;
    this.currentLocation = "New York 10001";
    this.init();
  }

  init() {
    this.bindBackdropClicks();
    this.bindCartDrawerEvents();
    this.bindDepartmentDrawer();
    this.bindLocationModal();
    this.bindOrdersWishlistModal();
    this.bindCartReactiveUpdates();
  }

  bindBackdropClicks() {
    // ESC key closes any open modal or drawer
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeAllModalsAndDrawers();
      }
    });

    // Global overlay click
    const globalOverlay = document.getElementById('global-overlay');
    if (globalOverlay) {
      globalOverlay.addEventListener('click', () => {
        this.closeAllModalsAndDrawers();
      });
    }

    // Modal close buttons
    document.querySelectorAll('[data-close-modal]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.closeAllModalsAndDrawers();
      });
    });
  }

  // ==========================================
  // 1. QUICK VIEW MODAL
  // ==========================================
  openQuickView(product) {
    this.currentQuickViewProduct = product;
    const modal = document.getElementById('quickview-modal');
    if (!modal) return;

    const formattedPrice = window.amzApp ? window.amzApp.formatPrice(product.price) : `$${product.price.toFixed(2)}`;
    const formattedOrig = product.originalPrice ? (window.amzApp ? window.amzApp.formatPrice(product.originalPrice) : `$${product.originalPrice.toFixed(2)}`) : null;

    // Build specs table rows
    const specsRows = Object.entries(product.specs || {}).map(([key, val]) => `
      <tr>
        <td class="spec-label">${key}</td>
        <td class="spec-value">${val}</td>
      </tr>
    `).join('');

    // Build features bullets
    const featuresList = (product.features || []).map(f => `<li>${f}</li>`).join('');

    // Build thumbnails
    const thumbnailsHtml = (product.images || []).map((img, idx) => `
      <button class="qv-thumb-btn ${idx === 0 ? 'is-active' : ''}" data-image-url="${img}">
        <img src="${img}" alt="Angle ${idx + 1}" />
      </button>
    `).join('');

    modal.querySelector('.qv-main-image').src = product.images[0];
    modal.querySelector('.qv-main-image').alt = product.title;
    modal.querySelector('.qv-thumbnails-strip').innerHTML = thumbnailsHtml;

    modal.querySelector('.qv-category').textContent = product.categoryName;
    modal.querySelector('.qv-title').textContent = product.title;
    modal.querySelector('.qv-rating-val').textContent = `${product.rating} out of 5`;
    modal.querySelector('.qv-reviews-count').textContent = `${product.ratingCount.toLocaleString()} global ratings`;

    modal.querySelector('.qv-price-current').textContent = formattedPrice;
    const origPriceEl = modal.querySelector('.qv-price-original');
    if (origPriceEl) {
      if (formattedOrig) {
        origPriceEl.textContent = `Typical: ${formattedOrig}`;
        origPriceEl.style.display = 'inline';
      } else {
        origPriceEl.style.display = 'none';
      }
    }

    const discountTag = modal.querySelector('.qv-discount-tag');
    if (discountTag) {
      if (product.discountPercent) {
        discountTag.textContent = `-${product.discountPercent}%`;
        discountTag.style.display = 'inline-block';
      } else {
        discountTag.style.display = 'none';
      }
    }

    modal.querySelector('.qv-delivery-info').textContent = product.delivery;
    modal.querySelector('.qv-stock-status').textContent = product.stock <= 5 
      ? `Only ${product.stock} left in stock - order soon.` 
      : "In Stock";
    modal.querySelector('.qv-stock-status').className = `qv-stock-status ${product.stock <= 5 ? 'low-stock' : 'in-stock'}`;

    modal.querySelector('.qv-features-list').innerHTML = featuresList;
    modal.querySelector('.qv-specs-table').innerHTML = specsRows;

    // Reset quantity select
    const qtySelect = modal.querySelector('.qv-quantity-select');
    if (qtySelect) qtySelect.value = "1";

    // Bind thumbnail click
    modal.querySelectorAll('.qv-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.qv-thumb-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const imgUrl = btn.dataset.imageUrl;
        modal.querySelector('.qv-main-image').src = imgUrl;
      });
    });

    // Bind Add to Cart inside modal
    const addBtn = modal.querySelector('#qv-add-to-cart-btn');
    if (addBtn) {
      addBtn.onclick = () => {
        const qty = parseInt(qtySelect ? qtySelect.value : "1", 10);
        window.amzCart.addItem(this.currentQuickViewProduct, qty);
        this.closeQuickView();
        this.openCartDrawer();
      };
    }

    // Bind Buy Now inside modal (triggers 1-Click Express Buy)
    const buyBtn = modal.querySelector('#qv-buy-now-btn');
    if (buyBtn) {
      buyBtn.onclick = () => {
        const qty = parseInt(qtySelect ? qtySelect.value : "1", 10);
        this.closeQuickView();
        if (window.amzCheckout && this.currentQuickViewProduct) {
          window.amzCheckout.openExpressBuy(this.currentQuickViewProduct, qty);
        }
      };
    }

    // Bind 3D Studio vs Photo Gallery view tabs
    const photoTab = modal.querySelector('#qv-tab-photos');
    const studioTab = modal.querySelector('#qv-tab-3d');
    const photoBox = modal.querySelector('.qv-main-image-box');
    const thumbStrip = modal.querySelector('.qv-thumbnails-strip');
    const studioBox = modal.querySelector('#qv-3d-studio-container');

    if (photoTab && studioTab && photoBox && studioBox) {
      // Default to photo view
      photoTab.classList.add('is-active');
      studioTab.classList.remove('is-active');
      photoBox.style.display = 'flex';
      if (thumbStrip) thumbStrip.style.display = 'flex';
      studioBox.classList.remove('is-active');

      photoTab.onclick = () => {
        photoTab.classList.add('is-active');
        studioTab.classList.remove('is-active');
        photoBox.style.display = 'flex';
        if (thumbStrip) thumbStrip.style.display = 'flex';
        studioBox.classList.remove('is-active');
      };

      studioTab.onclick = () => {
        studioTab.classList.add('is-active');
        photoTab.classList.remove('is-active');
        photoBox.style.display = 'none';
        if (thumbStrip) thumbStrip.style.display = 'none';
        studioBox.classList.add('is-active');
        if (window.amzThree) {
          window.amzThree.resizeStudio();
        }
      };
    }

    this.showModal(modal);
  }

  closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) this.hideModal(modal);
  }

  // ==========================================
  // 2. CART SLIDE-OUT DRAWER
  // ==========================================
  bindCartDrawerEvents() {
    const cartTrigger = document.getElementById('nav-cart-btn');
    const closeTrigger = document.getElementById('cart-drawer-close-btn');

    if (cartTrigger) {
      cartTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        this.openCartDrawer();
      });
    }

    if (closeTrigger) {
      closeTrigger.addEventListener('click', () => {
        this.closeCartDrawer();
      });
    }

    const drawerCheckoutBtn = document.getElementById('cart-drawer-checkout-btn');
    if (drawerCheckoutBtn) {
      drawerCheckoutBtn.addEventListener('click', () => {
        this.closeCartDrawer();
        if (window.amzCheckout) {
          window.amzCheckout.openCheckout();
        }
      });
    }
  }

  openCartDrawer() {
    this.renderCartDrawer();
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('global-overlay');
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    document.body.classList.add('modal-open');
  }

  closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('global-overlay');
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    document.body.classList.remove('modal-open');
  }

  bindCartReactiveUpdates() {
    window.addEventListener('cart:updated', () => {
      this.renderCartDrawer();
      this.updateHeaderCartBadge();
    });
    // Initial badge update
    this.updateHeaderCartBadge();
  }

  updateHeaderCartBadge() {
    const badge = document.getElementById('nav-cart-count');
    if (badge && window.amzCart) {
      const summary = window.amzCart.getSummary();
      badge.textContent = summary.itemCount;
      badge.classList.remove('cart-bounce');
      void badge.offsetWidth; // trigger reflow
      badge.classList.add('cart-bounce');
    }
  }

  renderCartDrawer() {
    const container = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const countEl = document.getElementById('cart-drawer-count');
    const shippingProgress = document.getElementById('cart-shipping-progress');
    const shippingMsg = document.getElementById('cart-shipping-msg');
    const emptyState = document.getElementById('cart-drawer-empty');
    const filledState = document.getElementById('cart-drawer-filled');

    if (!container || !window.amzCart) return;

    const items = window.amzCart.items;
    const summary = window.amzCart.getSummary();

    if (items.length === 0) {
      if (emptyState) emptyState.style.display = 'block';
      if (filledState) filledState.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (filledState) filledState.style.display = 'block';

    // Format subtotal
    const formattedSubtotal = window.amzApp ? window.amzApp.formatPrice(summary.subtotal) : `$${summary.subtotal.toFixed(2)}`;
    if (subtotalEl) subtotalEl.textContent = formattedSubtotal;
    if (countEl) countEl.textContent = `${summary.itemCount} item${summary.itemCount === 1 ? '' : 's'}`;

    // Free shipping bar calculation
    if (shippingProgress && shippingMsg) {
      shippingProgress.style.width = `${summary.freeShippingProgress}%`;
      if (summary.qualifiesForFreeShipping) {
        shippingMsg.innerHTML = `<span class="text-success">✓ Your order qualifies for <strong>FREE Delivery</strong>!</span>`;
      } else {
        const needed = window.amzApp ? window.amzApp.formatPrice(summary.amountNeededForFreeShipping) : `$${summary.amountNeededForFreeShipping.toFixed(2)}`;
        shippingMsg.innerHTML = `Add <strong>${needed}</strong> of eligible items for <strong>FREE Delivery</strong>`;
      }
    }

    // Render cart items
    container.innerHTML = items.map(item => {
      const itemPrice = window.amzApp ? window.amzApp.formatPrice(item.price) : `$${item.price.toFixed(2)}`;
      const totalItemPrice = window.amzApp ? window.amzApp.formatPrice(item.price * item.quantity) : `$${(item.price * item.quantity).toFixed(2)}`;

      return `
        <div class="cart-drawer-item" data-cart-id="${item.id}">
          <img src="${item.image}" alt="${item.title}" class="cd-item-thumb" />
          <div class="cd-item-details">
            <h4 class="cd-item-title">${item.title}</h4>
            <div class="cd-item-price-row">
              <span class="cd-item-unit-price">${itemPrice}</span>
              ${item.quantity > 1 ? `<span class="cd-item-total-price">(${totalItemPrice})</span>` : ''}
            </div>
            <div class="cd-item-delivery">
              <span class="amz-prime-badge"><span class="prime-italic">prime</span></span>
              <span>FREE delivery</span>
            </div>
            <div class="cd-item-actions">
              <div class="cd-qty-selector">
                <button class="cd-qty-btn" data-action="decrement" data-id="${item.id}" aria-label="Decrease quantity">−</button>
                <span class="cd-qty-val">${item.quantity}</span>
                <button class="cd-qty-btn" data-action="increment" data-id="${item.id}" aria-label="Increase quantity">+</button>
              </div>
              <button class="cd-delete-btn" data-action="delete" data-id="${item.id}">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');

    // Bind item action listeners
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = btn.dataset.action;
        const prodId = btn.dataset.id;
        const currentItem = items.find(i => i.id === prodId);

        if (!currentItem) return;

        if (action === 'increment') {
          window.amzCart.updateQuantity(prodId, currentItem.quantity + 1);
        } else if (action === 'decrement') {
          window.amzCart.updateQuantity(prodId, currentItem.quantity - 1);
        } else if (action === 'delete') {
          window.amzCart.removeItem(prodId);
        }
      });
    });
  }

  // ==========================================
  // 3. DEPARTMENT MEGA-MENU SIDE DRAWER
  // ==========================================
  bindDepartmentDrawer() {
    const hamburgerBtn = document.getElementById('nav-hamburger-btn');
    const closeBtn = document.getElementById('department-drawer-close-btn');

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openDepartmentDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeDepartmentDrawer();
      });
    }

    // Side menu category clicks
    document.querySelectorAll('[data-side-category]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = link.dataset.sideCategory;
        if (window.amzSearchFilter) {
          window.amzSearchFilter.setDepartment(cat);
        }
        this.closeDepartmentDrawer();
      });
    });
  }

  openDepartmentDrawer() {
    const drawer = document.getElementById('department-drawer');
    const overlay = document.getElementById('global-overlay');
    if (drawer) drawer.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    document.body.classList.add('modal-open');
  }

  closeDepartmentDrawer() {
    const drawer = document.getElementById('department-drawer');
    const overlay = document.getElementById('global-overlay');
    if (drawer) drawer.classList.remove('is-open');
    if (overlay) overlay.classList.remove('is-active');
    document.body.classList.remove('modal-open');
  }

  // ==========================================
  // 4. DELIVERY LOCATION SELECTOR MODAL
  // ==========================================
  bindLocationModal() {
    const locationTrigger = document.getElementById('nav-deliver-location-btn');
    const modal = document.getElementById('location-modal');
    const form = document.getElementById('location-form');
    const cityButtons = document.querySelectorAll('[data-preset-location]');

    if (locationTrigger && modal) {
      locationTrigger.addEventListener('click', () => {
        this.showModal(modal);
      });
    }

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        const zipInput = document.getElementById('location-zip-input');
        if (zipInput && zipInput.value.trim()) {
          this.updateDeliveryLocation(zipInput.value.trim());
          this.hideModal(modal);
        }
      });
    }

    cityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const loc = btn.dataset.presetLocation;
        const cur = btn.dataset.currency;
        this.updateDeliveryLocation(loc, cur);
        this.hideModal(modal);
      });
    });
  }

  detectCurrencyFromLocation(locStr) {
    if (!locStr) return 'USD';
    const s = locStr.toLowerCase().trim();

    // India: Mumbai, Delhi, Bangalore, Bengaluru, Chennai, Kolkata, Hyderabad, Pune, India, Bharat, or 6-digit Indian PIN
    if (s.includes('mumbai') || s.includes('delhi') || s.includes('bangalore') || 
        s.includes('bengaluru') || s.includes('chennai') || s.includes('kolkata') || 
        s.includes('hyderabad') || s.includes('pune') || s.includes('india') || 
        s.includes('bharat') || /\b[1-9][0-9]{5}\b/.test(s)) {
      return 'INR';
    }

    // United Kingdom: London, Manchester, Birmingham, Leeds, Glasgow, UK, England, Scotland, or UK postal
    if (s.includes('london') || s.includes('manchester') || s.includes('birmingham') ||
        s.includes('leeds') || s.includes('glasgow') || s.includes('edinburgh') ||
        s.includes('united kingdom') || s.includes('uk') || s.includes('england') || 
        s.includes('scotland') || s.includes('ec1a') || s.includes('sw1')) {
      return 'GBP';
    }

    // Eurozone: Paris, Berlin, Munich, Frankfurt, Rome, Milan, Madrid, Barcelona, Amsterdam, Dublin, France, Germany, Italy, Spain, Europe
    if (s.includes('paris') || s.includes('berlin') || s.includes('munich') ||
        s.includes('frankfurt') || s.includes('rome') || s.includes('milan') ||
        s.includes('madrid') || s.includes('barcelona') || s.includes('amsterdam') ||
        s.includes('dublin') || s.includes('brussels') || s.includes('vienna') ||
        s.includes('france') || s.includes('germany') || s.includes('italy') ||
        s.includes('spain') || s.includes('netherlands') || s.includes('europe')) {
      return 'EUR';
    }

    // Japan: Tokyo, Osaka, Kyoto, Yokohama, Japan, JP, or Japanese postal code
    if (s.includes('tokyo') || s.includes('osaka') || s.includes('kyoto') ||
        s.includes('yokohama') || s.includes('japan') || s.includes('jp') || /\b[0-9]{3}-?[0-9]{4}\b/.test(s)) {
      return 'JPY';
    }

    // Canada: Toronto, Vancouver, Montreal, Ottawa, Calgary, Canada
    if (s.includes('toronto') || s.includes('vancouver') || s.includes('montreal') ||
        s.includes('ottawa') || s.includes('calgary') || s.includes('canada')) {
      return 'CAD';
    }

    // Default to USD for US cities (New York, Seattle, San Francisco, Chicago, Los Angeles, etc.)
    return 'USD';
  }

  updateDeliveryLocation(locationStr, explicitCurrency = null) {
    this.currentLocation = locationStr;
    const headerDisplay = document.getElementById('nav-delivery-city');
    if (headerDisplay) {
      headerDisplay.textContent = locationStr;
    }

    // Automatically detect country currency
    const targetCurrency = explicitCurrency || this.detectCurrencyFromLocation(locationStr);

    if (window.amzApp) {
      const prevCurrency = window.amzApp.currentCurrency;
      window.amzApp.setCurrency(targetCurrency, false);

      const curInfo = CURRENCIES[targetCurrency] || CURRENCIES.USD;
      if (window.amzCart) {
        if (prevCurrency !== targetCurrency) {
          window.amzCart.showToast(`📍 Location set to "${locationStr}". Currency automatically switched to ${curInfo.name} (${curInfo.symbol})!`, "success");
        } else {
          window.amzCart.showToast(`📍 Delivery location set to "${locationStr}" (${curInfo.symbol})`, "success");
        }
      }
    }
  }

  // ==========================================
  // 5. ORDERS & WISHLIST MODAL
  // ==========================================
  bindOrdersWishlistModal() {
    const ordersBtn = document.getElementById('nav-orders-btn');
    const wishlistLink = document.getElementById('nav-wishlist-link');
    const modal = document.getElementById('orders-wishlist-modal');

    if (ordersBtn && modal) {
      ordersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openOrdersModal('orders');
      });
    }

    if (wishlistLink && modal) {
      wishlistLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openOrdersModal('wishlist');
      });
    }

    // Modal Tab switcher (Orders vs Wishlist)
    modal?.querySelectorAll('.modal-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const tab = tabBtn.dataset.tab;
        modal.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('is-active'));
        tabBtn.classList.add('is-active');

        modal.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.remove('is-active'));
        const activePane = modal.querySelector(`#tab-pane-${tab}`);
        if (activePane) activePane.classList.add('is-active');
      });
    });
  }

  openOrdersModal(defaultTab = 'orders') {
    const modal = document.getElementById('orders-wishlist-modal');
    if (!modal) return;

    // Switch to active tab
    modal.querySelectorAll('.modal-tab-btn').forEach(b => {
      b.classList.toggle('is-active', b.dataset.tab === defaultTab);
    });
    modal.querySelectorAll('.modal-tab-pane').forEach(p => {
      p.classList.toggle('is-active', p.id === `tab-pane-${defaultTab}`);
    });

    this.renderOrdersHistory();
    this.renderWishlistTab();
    this.showModal(modal);
  }

  renderOrdersHistory() {
    const listEl = document.getElementById('orders-history-list');
    if (!listEl) return;

    const orders = window.amzCheckout ? window.amzCheckout.getOrders() : [];

    if (orders.length === 0) {
      listEl.innerHTML = `
        <div class="empty-panel-state">
          <div class="empty-icon">📦</div>
          <h4>No orders placed yet</h4>
          <p>Explore our lightning deals and check out to see simulated real-time parcel tracking here.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = orders.map(order => `
      <div class="order-card-record">
        <div class="order-record-header">
          <div class="order-meta-col">
            <span class="meta-label">ORDER PLACED</span>
            <span class="meta-val">${new Date(order.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
          <div class="order-meta-col">
            <span class="meta-label">TOTAL</span>
            <span class="meta-val">${window.amzApp ? window.amzApp.formatPrice(order.total) : `$${order.total.toFixed(2)}`}</span>
          </div>
          <div class="order-meta-col">
            <span class="meta-label">SHIP TO</span>
            <span class="meta-val">${escapeHtml(order.shipping.fullName)}</span>
          </div>
          <div class="order-meta-col order-id-col">
            <span class="meta-label">ORDER # ${order.orderId}</span>
            <span class="tracking-badge status-${order.status.toLowerCase().replace(/\s+/g, '-')}">${order.status}</span>
          </div>
        </div>

        <div class="order-record-body">
          <div class="order-items-strip">
            ${order.items.map(item => `
              <div class="order-mini-thumb-box" title="${escapeHtml(item.title)} (Qty: ${item.quantity})">
                <img src="${item.image}" alt="${escapeHtml(item.title)}" />
                <span class="mini-qty-tag">x${item.quantity}</span>
              </div>
            `).join('')}
          </div>
          <div class="order-tracking-info">
            <div class="tracking-code"><strong>Tracking #:</strong> <code>${order.trackingNumber}</code></div>
            <div class="tracking-estimate">Estimated Delivery: <strong>${order.estimatedDelivery}</strong></div>
          </div>
        </div>
      </div>
    `).join('');
  }

  renderWishlistTab() {
    const listEl = document.getElementById('wishlist-items-list');
    if (!listEl || !window.amzCart) return;

    const wishlistIds = window.amzCart.wishlist;
    const wishlistProducts = PRODUCTS_DATA.filter(p => wishlistIds.includes(p.id));

    if (wishlistProducts.length === 0) {
      listEl.innerHTML = `
        <div class="empty-panel-state">
          <div class="empty-icon">♡</div>
          <h4>Your Wish List is currently empty</h4>
          <p>Click the heart icon on any product card to save items for future shopping.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = wishlistProducts.map(prod => `
      <div class="wishlist-row-item">
        <img src="${prod.images[0]}" alt="${prod.title}" class="wishlist-thumb" />
        <div class="wishlist-info">
          <h4>${prod.title}</h4>
          <div class="wishlist-price">${window.amzApp ? window.amzApp.formatPrice(prod.price) : `$${prod.price.toFixed(2)}`}</div>
          <div class="wishlist-stock">${prod.stock <= 5 ? `Only ${prod.stock} left` : 'In Stock'}</div>
        </div>
        <div class="wishlist-actions">
          <button class="amz-btn amz-btn-primary" onclick="window.amzCart.addItem(PRODUCTS_DATA.find(p => p.id === '${prod.id}'), 1)">
            Add to Cart
          </button>
          <button class="amz-btn amz-btn-secondary" onclick="window.amzCart.toggleWishlist(PRODUCTS_DATA.find(p => p.id === '${prod.id}')); window.amzModal.renderWishlistTab();">
            Remove
          </button>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // HELPERS
  // ==========================================
  showModal(modalEl) {
    this.closeAllModalsAndDrawers();
    const overlay = document.getElementById('global-overlay');
    if (modalEl) modalEl.classList.add('is-open');
    if (overlay) overlay.classList.add('is-active');
    document.body.classList.add('modal-open');
    this.activeModal = modalEl;
  }

  hideModal(modalEl) {
    if (modalEl) modalEl.classList.remove('is-open');
    const overlay = document.getElementById('global-overlay');
    if (overlay) overlay.classList.remove('is-active');
    document.body.classList.remove('modal-open');
    this.activeModal = null;
  }

  closeAllModalsAndDrawers() {
    document.querySelectorAll('.modal, .drawer').forEach(el => {
      el.classList.remove('is-open');
    });
    const overlay = document.getElementById('global-overlay');
    if (overlay) overlay.classList.remove('is-active');
    document.body.classList.remove('modal-open');
    this.activeModal = null;
  }
}

window.amzModal = new ModalEngine();
