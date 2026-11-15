/**
 * UDAANMART - MODALS, DRAWERS & HIGH-TRUST REVIEWS ENGINE (js/modal.js)
 * PILLARS 2, 4 & 6:
 * 1. Smart Delivery Location with 6-Digit Pincode Fetch & Geolocation Detection
 * 2. High-Trust Product QuickView with Karigar Price Transparency Bar
 * 3. Visual Size & Fit Chart Toggle
 * 4. WhatsApp Direct Artisan Chat
 * 5. Verified Customer Reviews & Live Rating Submission Form
 * 6. Returns & Orders 4-Stage Visual Stepper & 1-Tap Reorder
 */

class ModalEngine {
  constructor() {
    this.activeModal = null;
    this.currentQuickViewProduct = null;
    this.selectedReviewRating = 5;
    this.init();
  }

  init() {
    this.bindBackdropClicks();
    this.bindCartDrawerEvents();
    this.bindDepartmentDrawer();
    this.bindLocationModal();
    this.bindOrdersWishlistModal();
    this.bindCartReactiveUpdates();

    // Re-render orders if store updates
    window.addEventListener('udaan:order-created', () => {
      this.renderOrdersHistory();
    });

    window.addEventListener('udaan:order-updated', () => {
      this.renderOrdersHistory();
    });

    window.addEventListener('udaan:review-added', (e) => {
      if (this.currentQuickViewProduct && String(e.detail.productId) === String(this.currentQuickViewProduct.id)) {
        this.renderQuickViewReviews(this.currentQuickViewProduct);
      }
    });
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
  // 1. HIGH-TRUST PRODUCT QUICK VIEW MODAL
  // ==========================================
  openQuickView(product) {
    if (!product) return;
    this.currentQuickViewProduct = product;
    const modal = document.getElementById('quickview-modal');
    if (!modal) return;

    const formattedPrice = window.amzApp ? window.amzApp.formatPrice(product.price) : `$${product.price.toFixed(2)}`;
    const formattedOrig = product.originalPrice ? (window.amzApp ? window.amzApp.formatPrice(product.originalPrice) : `$${product.originalPrice.toFixed(2)}`) : null;

    // Build specs table rows
    const specsRows = Object.entries(product.specs || {}).map(([key, val]) => `
      <tr>
        <td class="spec-label">${window.amzStore ? window.amzStore.escapeHTML(key) : key}</td>
        <td class="spec-value">${window.amzStore ? window.amzStore.escapeHTML(val) : val}</td>
      </tr>
    `).join('');

    // Build features bullets
    const featuresList = (product.features || []).map(f => `<li>${window.amzStore ? window.amzStore.escapeHTML(f) : f}</li>`).join('');

    // Build thumbnails
    const thumbnailsHtml = (product.images || []).map((img, idx) => `
      <button class="qv-thumb-btn ${idx === 0 ? 'is-active' : ''}" data-image-url="${img}">
        <img src="${img}" alt="Angle ${idx + 1}" />
      </button>
    `).join('');

    const mainImgEl = modal.querySelector('.qv-main-image');
    if (mainImgEl) {
      mainImgEl.src = product.images ? product.images[0] : '';
      mainImgEl.alt = product.title;
    }

    const thumbStrip = modal.querySelector('.qv-thumbnails-strip');
    if (thumbStrip) thumbStrip.innerHTML = thumbnailsHtml;

    const catEl = modal.querySelector('.qv-category');
    if (catEl) catEl.textContent = product.categoryName || 'Authentic Craft';

    const titleEl = modal.querySelector('.qv-title');
    if (titleEl) titleEl.textContent = product.title;

    const ratingValEl = modal.querySelector('.qv-rating-val');
    if (ratingValEl) ratingValEl.textContent = `${product.rating} out of 5 ★`;

    const reviewCountEl = modal.querySelector('.qv-reviews-count');
    if (reviewCountEl) reviewCountEl.textContent = `${(product.ratingCount || 12).toLocaleString()} verified buyer ratings`;

    const curPriceEl = modal.querySelector('.qv-price-current');
    if (curPriceEl) curPriceEl.textContent = formattedPrice;

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

    const locCity = window.amzStore ? window.amzStore.getLocation().city : 'Your Doorstep';
    const deliveryEl = modal.querySelector('.qv-delivery-info');
    if (deliveryEl) {
      deliveryEl.innerHTML = `🚚 <strong>Free Express Delivery by Tomorrow</strong> to <strong>${locCity}</strong> via India Post Speed Post`;
    }

    const stockEl = modal.querySelector('.qv-stock-status');
    if (stockEl) {
      stockEl.textContent = product.stock <= 5 
        ? `Only ${product.stock} items left in rural artisan inventory - order fast.` 
        : "In Stock (Ready for Dispatch)";
      stockEl.className = `qv-stock-status ${product.stock <= 5 ? 'low-stock' : 'in-stock'}`;
    }

    const featEl = modal.querySelector('.qv-features-list');
    if (featEl) featEl.innerHTML = featuresList;

    const specsEl = modal.querySelector('.qv-specs-table');
    if (specsEl) specsEl.innerHTML = specsRows;

    // Reset quantity select
    const qtySelect = modal.querySelector('.qv-quantity-select');
    if (qtySelect) qtySelect.value = "1";

    // Bind thumbnail click
    modal.querySelectorAll('.qv-thumb-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        modal.querySelectorAll('.qv-thumb-btn').forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        const imgUrl = btn.dataset.imageUrl;
        if (mainImgEl) mainImgEl.src = imgUrl;
      });
    });

    // 1. INJECT KARIGAR PRICE TRANSPARENCY BAR & SIZE GUIDE & WHATSAPP
    this.injectKarigarTrustEnhancements(modal, product);

    // 2. RENDER VERIFIED REVIEWS & SUBMISSION FORM
    this.renderQuickViewReviews(product);

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

    this.showModal(modal);
  }

  closeQuickView() {
    const modal = document.getElementById('quickview-modal');
    if (modal) this.hideModal(modal);
  }

  injectKarigarTrustEnhancements(modal, product) {
    let trustBox = modal.querySelector('.karigar-quickview-trust-box');
    if (!trustBox) {
      trustBox = document.createElement('div');
      trustBox.className = 'karigar-quickview-trust-box';
      const specsTable = modal.querySelector('.qv-specs-table');
      if (specsTable && specsTable.parentNode) {
        specsTable.parentNode.insertBefore(trustBox, specsTable.nextSibling);
      }
    }

    const isClothing = (product.category === 'clothing' || product.category === 'fashion' || (product.shortTitle && product.shortTitle.toLowerCase().includes('saree')));
    const encodedTitle = encodeURIComponent(`Hello Karigar! I am interested in purchasing: "${product.title}". Is it in stock for immediate dispatch?`);
    const waUrl = `https://wa.me/919876543210?text=${encodedTitle}`;

    trustBox.innerHTML = `
      <!-- Karigar Fair-Price Transparency Bar -->
      <div class="karigar-transparency-card">
        <div class="transparency-header">
          <div class="transparency-badge">💚 Fair-Trade Karigar Pricing</div>
          <span class="transparency-direct"><strong>85% Direct</strong> to Artisan</span>
        </div>
        <div class="transparency-progress-bar">
          <div class="bar-slice slice-artisan" style="width: 85%;" title="85% Direct Karigar Bank Payout">85% Karigar</div>
          <div class="bar-slice slice-post" style="width: 10%;" title="10% India Post Last-Mile Logistics">10% Post</div>
          <div class="bar-slice slice-tech" style="width: 5%;" title="5% Udaan Platform Support">5% Tech</div>
        </div>
        <div class="transparency-legend-row">
          <span>• 85% Direct Karigar Payout</span>
          <span>• 10% India Post Speed Post</span>
          <span>• 5% Platform Maintenance</span>
        </div>
      </div>

      <!-- Action Chips: WhatsApp & Size Guide -->
      <div class="qv-interactive-actions-row">
        <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="qv-whatsapp-btn" title="Chat with artisan on WhatsApp">
          <span class="wa-icon">💬</span>
          <span>Ask Karigar on WhatsApp</span>
        </a>

        ${isClothing ? `
          <button type="button" class="qv-size-chart-btn" id="btn-toggle-size-chart">
            <span>📏 Size &amp; Fit Guide</span>
          </button>
        ` : ''}
      </div>

      ${isClothing ? `
        <div class="qv-size-chart-drawer" id="qv-size-chart-content" style="display: none;">
          <h5 style="margin: 8px 0 6px; font-size: 0.88rem; font-weight: 700;">Standard Indian Handloom &amp; Fit Chart:</h5>
          <table class="size-chart-table">
            <thead>
              <tr><th>Size</th><th>Bust / Chest</th><th>Waist</th><th>Standard Length</th></tr>
            </thead>
            <tbody>
              <tr><td>S (36)</td><td>36" (91 cm)</td><td>30" (76 cm)</td><td>Standard Free Size</td></tr>
              <tr><td>M (38)</td><td>38" (96 cm)</td><td>32" (81 cm)</td><td>Saree: 5.5m + 0.8m Blouse</td></tr>
              <tr><td>L (40)</td><td>40" (101 cm)</td><td>34" (86 cm)</td><td>Tailored Handloom Fall</td></tr>
              <tr><td>XL (42)</td><td>42" (106 cm)</td><td>36" (91 cm)</td><td>Custom Weaver Drape</td></tr>
            </tbody>
          </table>
        </div>
      ` : ''}
    `;

    // Bind size guide toggle
    const sizeBtn = trustBox.querySelector('#btn-toggle-size-chart');
    const sizeDrawer = trustBox.querySelector('#qv-size-chart-content');
    if (sizeBtn && sizeDrawer) {
      sizeBtn.addEventListener('click', () => {
        const isOpen = sizeDrawer.style.display === 'block';
        sizeDrawer.style.display = isOpen ? 'none' : 'block';
        sizeBtn.classList.toggle('is-active', !isOpen);
      });
    }
  }

  // ==========================================
  // 2. VERIFIED REVIEWS & LIVE RATING SUBMISSION
  // ==========================================
  renderQuickViewReviews(product) {
    const modal = document.getElementById('quickview-modal');
    if (!modal) return;

    let reviewContainer = modal.querySelector('.qv-reviews-section');
    if (!reviewContainer) {
      reviewContainer = document.createElement('div');
      reviewContainer.className = 'qv-reviews-section';
      modal.querySelector('.modal-body')?.appendChild(reviewContainer);
    }

    const reviews = window.amzStore ? window.amzStore.getReviewsForProduct(product.id) : [];

    reviewContainer.innerHTML = `
      <div class="qv-reviews-header">
        <h4 class="qv-reviews-title">⭐ Verified Customer Reviews (${reviews.length})</h4>
        <span class="qv-trust-shield">🛡️ 100% Genuine Certified Purchases</span>
      </div>

      <!-- Add Review Form -->
      <div class="qv-add-review-box">
        <h5 style="margin: 0 0 8px; font-size: 0.9rem; font-weight: 700;">Write a Customer Review (समीक्षा लिखें):</h5>
        <div class="qv-star-selector" id="qv-star-rating-picker">
          <span class="star-opt is-active" data-star="1">★</span>
          <span class="star-opt is-active" data-star="2">★</span>
          <span class="star-opt is-active" data-star="3">★</span>
          <span class="star-opt is-active" data-star="4">★</span>
          <span class="star-opt is-active" data-star="5">★</span>
          <span id="star-rating-hint" style="font-size: 0.8rem; font-weight: 600; color: var(--color-primary); margin-left: 8px;">5 Stars - Excellent</span>
        </div>
        <div style="display: flex; gap: 8px; margin-top: 8px;">
          <input type="text" id="qv-review-author" class="form-input" placeholder="Your Name (e.g. Abhishek Tripathi)" value="Abhishek Tripathi" style="flex: 1;" />
          <input type="text" id="qv-review-city" class="form-input" placeholder="City (e.g. Varanasi)" value="${window.amzStore ? window.amzStore.getLocation().city : 'New Delhi'}" style="width: 140px;" />
        </div>
        <textarea id="qv-review-text" class="form-input" rows="2" placeholder="Share your experience with this handcrafted item..." style="margin-top: 8px; resize: vertical;"></textarea>
        <div style="text-align: right; margin-top: 8px;">
          <button type="button" class="amz-btn amz-btn-primary" id="btn-submit-review" style="width: auto; padding: 8px 20px;">
            Submit Verified Review
          </button>
        </div>
      </div>

      <!-- Existing Reviews List -->
      <div class="qv-reviews-list">
        ${reviews.map(r => `
          <div class="qv-review-card">
            <div class="qv-review-card-header">
              <div class="qv-reviewer-meta">
                <strong>${window.amzStore.escapeHTML(r.author)}</strong>
                <span class="qv-badge-verified">✓ Verified Purchase</span>
                <span class="qv-reviewer-loc">📍 ${window.amzStore.escapeHTML(r.location || 'India')}</span>
              </div>
              <span class="qv-review-date">${r.date}</span>
            </div>
            <div class="qv-review-stars">
              ${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}
            </div>
            <p class="qv-review-body">${window.amzStore.escapeHTML(r.text)}</p>
          </div>
        `).join('')}
      </div>
    `;

    // Bind Star rating selector
    const stars = reviewContainer.querySelectorAll('.star-opt');
    const starHint = reviewContainer.querySelector('#star-rating-hint');
    stars.forEach(star => {
      star.addEventListener('click', () => {
        const val = parseInt(star.dataset.star, 10);
        this.selectedReviewRating = val;
        stars.forEach(s => {
          s.classList.toggle('is-active', parseInt(s.dataset.star, 10) <= val);
        });
        if (starHint) {
          const labels = { 1: '1 Star - Poor', 2: '2 Stars - Fair', 3: '3 Stars - Good', 4: '4 Stars - Very Good', 5: '5 Stars - Excellent' };
          starHint.textContent = labels[val] || `${val} Stars`;
        }
      });
    });

    // Bind Review submission
    const submitBtn = reviewContainer.querySelector('#btn-submit-review');
    if (submitBtn) {
      submitBtn.addEventListener('click', () => {
        const author = reviewContainer.querySelector('#qv-review-author')?.value.trim() || 'Verified Buyer';
        const city = reviewContainer.querySelector('#qv-review-city')?.value.trim() || 'India';
        const text = reviewContainer.querySelector('#qv-review-text')?.value.trim();

        if (!text) {
          alert('Please write a short review before submitting.');
          return;
        }

        if (window.amzStore) {
          window.amzStore.addReview(product.id, {
            author: author,
            location: city,
            rating: this.selectedReviewRating,
            text: text
          });

          if (window.amzCart) {
            window.amzCart.showToast("⭐ Thank you! Your verified review has been published live.");
          }
        }
      });
    }
  }

  // ==========================================
  // 3. CART SLIDE-OUT DRAWER
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

    if (drawer) {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeCartDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('global-overlay');

    if (drawer) {
      drawer.classList.remove('is-open');
      if (overlay && !document.querySelector('.amz-modal.is-open, .modal.is-open:not(#cart-drawer), .dept-drawer.is-open')) {
        overlay.classList.remove('is-open');
      }
      document.body.style.overflow = '';
    }
  }

  renderCartDrawer() {
    const listEl = document.getElementById('cart-drawer-items-list');
    const subtotalEl = document.getElementById('cart-drawer-subtotal-val');
    const countEl = document.getElementById('cart-drawer-count');

    if (!listEl || !window.amzCart) return;

    const summary = window.amzCart.getSummary();

    if (subtotalEl) {
      subtotalEl.textContent = window.amzApp ? window.amzApp.formatPrice(summary.subtotal) : `$${summary.subtotal.toFixed(2)}`;
    }

    if (countEl) {
      countEl.textContent = `${summary.totalCount} items`;
    }

    if (window.amzCart.items.length === 0) {
      listEl.innerHTML = `
        <div class="empty-cart-state">
          <div class="empty-icon">🛒</div>
          <h4>Your UdaanMart Cart is empty</h4>
          <p>Discover authentic rural weaves, handmade brassware, and lifestyle electronics with 1-click delivery.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = window.amzCart.items.map(item => {
      const formattedPrice = window.amzApp ? window.amzApp.formatPrice(item.price) : `$${item.price.toFixed(2)}`;
      return `
        <div class="cart-drawer-item" data-product-id="${item.id}">
          <img src="${item.image}" alt="${window.amzStore.escapeHTML(item.title)}" class="cart-item-thumb" />
          <div class="cart-item-details">
            <h5 class="cart-item-title">${window.amzStore.escapeHTML(item.shortTitle || item.title)}</h5>
            <div class="cart-item-price">${formattedPrice}</div>
            <div class="cart-item-actions">
              <div class="cart-qty-stepper">
                <button class="qty-btn qty-minus" onclick="window.amzCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button class="qty-btn qty-plus" onclick="window.amzCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              </div>
              <button class="cart-remove-link" onclick="window.amzCart.removeItem('${item.id}')">Delete</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  bindCartReactiveUpdates() {
    window.addEventListener('amz:cart-updated', () => {
      const drawer = document.getElementById('cart-drawer');
      if (drawer && drawer.classList.contains('is-open')) {
        this.renderCartDrawer();
      }
    });
  }

  // ==========================================
  // 4. DEPARTMENT HAMBURGER SIDE DRAWER
  // ==========================================
  bindDepartmentDrawer() {
    const hamburgerBtn = document.getElementById('nav-hamburger-btn');
    const closeBtn = document.getElementById('dept-drawer-close-btn');

    if (hamburgerBtn) {
      hamburgerBtn.addEventListener('click', () => {
        this.openDepartmentDrawer();
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeDepartmentDrawer();
      });
    }

    // Bind Department links inside drawer
    document.querySelectorAll('.dept-menu-item[data-dept-id]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const deptId = link.dataset.deptId;
        this.closeDepartmentDrawer();
        if (window.amzSearchFilter) {
          window.amzSearchFilter.setDepartment(deptId);
        }
      });
    });
  }

  openDepartmentDrawer() {
    const drawer = document.getElementById('dept-drawer');
    const overlay = document.getElementById('global-overlay');

    if (drawer) {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDepartmentDrawer() {
    const drawer = document.getElementById('dept-drawer');
    const overlay = document.getElementById('global-overlay');

    if (drawer) {
      drawer.classList.remove('is-open');
      if (overlay && !document.querySelector('.amz-modal.is-open, .modal.is-open:not(#dept-drawer), .cart-drawer.is-open')) {
        overlay.classList.remove('is-open');
      }
      document.body.style.overflow = '';
    }
  }

  // ==========================================
  // 5. DELIVERY LOCATION SELECTOR MODAL
  // ==========================================
  bindLocationModal() {
    const trigger = document.getElementById('nav-deliver-location-btn');
    const modal = document.getElementById('location-modal');
    const form = document.getElementById('location-form');
    const input = document.getElementById('location-zip-input');

    if (trigger && modal) {
      trigger.addEventListener('click', () => {
        this.showModal(modal);
      });
    }

    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const raw = input.value.trim();
        if (!raw) return;

        // Check if 6-digit Pincode
        if (/^\d{6}$/.test(raw) && window.amzStore) {
          const info = await window.amzStore.fetchPincode(raw);
          if (info) {
            window.amzStore.setLocation(info);
            this.hideModal(modal);
            return;
          }
        }

        // Generic String Location
        if (window.amzStore) {
          window.amzStore.setLocation({
            city: raw,
            pincode: 'Verified PIN',
            displayName: raw
          });
        }
        this.hideModal(modal);
      });
    }

    // Geolocation Detection Button
    const detectBtn = document.getElementById('btn-detect-current-location');
    if (detectBtn) {
      detectBtn.addEventListener('click', () => {
        if (!navigator.geolocation) {
          if (window.amzCart) window.amzCart.showToast("Geolocation is not supported by your browser.", "info");
          return;
        }

        detectBtn.innerHTML = `📡 Detecting Satellite Location...`;

        navigator.geolocation.getCurrentPosition(
          (position) => {
            detectBtn.innerHTML = `✓ Location Detected!`;
            if (window.amzStore) {
              window.amzStore.setLocation({
                city: 'Prayagraj / Varanasi Cluster',
                pincode: '211001',
                state: 'Uttar Pradesh',
                country: 'India'
              });
            }
            setTimeout(() => {
              this.hideModal(modal);
              detectBtn.innerHTML = `📡 Detect My Current Location`;
            }, 500);
          },
          (err) => {
            // Graceful fallback to default Indian artisan hub
            if (window.amzStore) {
              window.amzStore.setLocation({
                city: 'New Delhi',
                pincode: '110001',
                state: 'Delhi',
                country: 'India'
              });
            }
            this.hideModal(modal);
            detectBtn.innerHTML = `📡 Detect My Current Location`;
          },
          { timeout: 5000 }
        );
      });
    }

    // Preset location chips
    const cityButtons = document.querySelectorAll('.location-chip-btn');
    cityButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const loc = btn.dataset.presetLocation;
        const cur = btn.dataset.currency;
        const lang = btn.dataset.lang;

        // Parse City and Pincode
        const match = loc.match(/(.*)\s\((\d{6})\)/);
        const city = match ? match[1].trim() : loc;
        const pin = match ? match[2] : '110001';

        if (window.amzStore) {
          window.amzStore.setLocation({
            city: city,
            pincode: pin,
            displayName: `${city} ${pin}`
          });
        }

        if (cur && window.amzApp) {
          window.amzApp.setCurrency(cur, false);
        }

        if (lang && window.udaanI18n) {
          window.udaanI18n.applyLanguage(lang, false);
        }

        this.hideModal(modal);
      });
    });
  }

  // ==========================================
  // 6. ORDERS & WISHLIST HUB MODAL (4-STAGE STEPPER)
  // ==========================================
  bindOrdersWishlistModal() {
    const ordersBtn = document.getElementById('nav-orders-btn');
    const modal = document.getElementById('orders-wishlist-modal');

    if (ordersBtn && modal) {
      ordersBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openOrdersModal('orders');
      });
    }

    // Tab switcher (Orders vs Wishlist)
    modal?.querySelectorAll('.modal-tab-btn').forEach(tabBtn => {
      tabBtn.addEventListener('click', () => {
        const tab = tabBtn.dataset.tab;
        modal.querySelectorAll('.modal-tab-btn').forEach(b => b.classList.remove('is-active'));
        modal.querySelectorAll('.modal-tab-pane').forEach(p => p.classList.remove('is-active'));

        tabBtn.classList.add('is-active');
        document.getElementById(`tab-pane-${tab}`)?.classList.add('is-active');
      });
    });
  }

  openOrdersModal(defaultTab = 'orders') {
    const modal = document.getElementById('orders-wishlist-modal');
    if (!modal) return;

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

    const orders = window.amzStore ? window.amzStore.getOrders() : [];

    if (orders.length === 0) {
      listEl.innerHTML = `
        <div class="empty-panel-state">
          <div class="empty-icon">📦</div>
          <h4>No orders placed yet</h4>
          <p>Explore our lightning deals and check out to see live 4-stage tracking right here.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = orders.map(order => {
      const step = order.currentStep || order.trackingStep || 1;
      const isDelivered = step >= 4;
      const ship = order.deliveryLocation || {};
      const buyerName = window.amzStore.escapeHTML(ship.name || 'Buyer');
      const formattedTotal = window.amzApp ? window.amzApp.formatPrice(order.totalAmount || order.total || 0) : `₹${order.totalAmount || order.total}`;

      // Stepper Labels & Statuses
      const stepsConfig = [
        { num: 1, label: 'Order Confirmed', icon: '📝' },
        { num: 2, label: 'Packed by Karigar', icon: '📦' },
        { num: 3, label: 'In Transit via Speed Post', icon: '🚚' },
        { num: 4, label: 'Delivered', icon: '🎉' }
      ];

      return `
        <div class="order-card-record" data-order-id="${order.orderId}">
          <div class="order-record-header">
            <div class="order-meta-col">
              <span class="meta-label">ORDER PLACED</span>
              <span class="meta-val">${order.date}</span>
            </div>
            <div class="order-meta-col">
              <span class="meta-label">TOTAL</span>
              <span class="meta-val">${formattedTotal}</span>
            </div>
            <div class="order-meta-col">
              <span class="meta-label">SHIP TO</span>
              <span class="meta-val">${buyerName}</span>
            </div>
            <div class="order-meta-col order-id-col">
              <span class="meta-label">ORDER # ${order.orderId}</span>
              <span class="tracking-badge status-step-${step}">${order.status}</span>
            </div>
          </div>

          <!-- 4-Stage Visual Progress Stepper -->
          <div class="order-stepper-wrapper">
            <div class="order-stepper-bar">
              <div class="stepper-fill" style="width: ${((step - 1) / 3) * 100}%;"></div>
            </div>
            <div class="order-stepper-points">
              ${stepsConfig.map(s => `
                <div class="stepper-point ${s.num <= step ? 'is-complete' : ''} ${s.num === step ? 'is-current' : ''}">
                  <div class="point-circle">${s.num <= step ? '✓' : s.num}</div>
                  <span class="point-label">${s.label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div class="order-record-body">
            <div class="order-items-strip">
              ${(order.items || []).map(item => `
                <div class="order-mini-thumb-box" title="${window.amzStore.escapeHTML(item.title)} (Qty: ${item.quantity || 1})">
                  <img src="${item.image}" alt="${window.amzStore.escapeHTML(item.title)}" />
                  <span class="mini-qty-tag">x${item.quantity || 1}</span>
                </div>
              `).join('')}
            </div>

            <div class="order-tracking-info">
              <div class="tracking-code"><strong>Tracking #:</strong> <code>${order.trackingNumber || 'INP-SPEEDPOST'}</code></div>
              <div class="tracking-estimate">Destination: <strong>${window.amzStore.escapeHTML(ship.city || 'Your Address')} (${window.amzStore.escapeHTML(ship.pincode || '')})</strong></div>
              <div class="tracking-payment">Payment: <strong>${window.amzStore.escapeHTML(order.paymentMethod || 'UPI')}</strong></div>
            </div>

            <div class="order-card-actions">
              ${!isDelivered ? `
                <button class="amz-btn amz-btn-secondary btn-advance-demo-order" onclick="window.amzStore.advanceOrderStep('${order.orderId}')" title="Advance step for testing">
                  🚚 Advance Delivery Status (Demo)
                </button>
              ` : `
                <span class="delivered-celebration-pill">🎉 Delivered Successfully!</span>
                <button class="amz-btn amz-btn-primary btn-buy-again" onclick="window.amzModal.handleBuyAgain('${order.orderId}')">
                  🔄 Buy Again (1-Click)
                </button>
              `}
              <button class="amz-btn amz-btn-ghost btn-view-invoice-link" onclick="window.amzCheckout.openGSTInvoice(window.amzStore.getOrderById('${order.orderId}'))">
                📄 View Tax Invoice
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  handleBuyAgain(orderId) {
    const order = window.amzStore ? window.amzStore.getOrderById(orderId) : null;
    if (!order || !order.items || order.items.length === 0) return;

    const firstItem = order.items[0];
    this.closeAllModalsAndDrawers();
    if (window.amzCheckout) {
      window.amzCheckout.openExpressBuy(firstItem, 1);
    }
  }

  renderWishlistTab() {
    const listEl = document.getElementById('wishlist-items-list');
    if (!listEl || !window.amzCart) return;

    const wishlistIds = window.amzCart.wishlist;
    const allProducts = window.amzStore ? window.amzStore.getAllProducts() : [];
    const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));

    if (wishlistProducts.length === 0) {
      listEl.innerHTML = `
        <div class="empty-panel-state">
          <div class="empty-icon">♡</div>
          <h4>Your Wish List is currently empty</h4>
          <p>Click the heart icon on any craft or flagship card to save items for future purchases.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = wishlistProducts.map(prod => `
      <div class="wishlist-row-item">
        <img src="${prod.images ? prod.images[0] : ''}" alt="${window.amzStore.escapeHTML(prod.title)}" class="wishlist-thumb" />
        <div class="wishlist-info">
          <h5 class="wishlist-title">${window.amzStore.escapeHTML(prod.title)}</h5>
          <span class="wishlist-price">${window.amzApp ? window.amzApp.formatPrice(prod.price) : '$' + prod.price}</span>
        </div>
        <div class="wishlist-actions">
          <button class="amz-btn amz-btn-primary" onclick="window.amzCart.addItem(window.amzStore.getProductById('${prod.id}'), 1); window.amzModal.openCartDrawer();">
            Move to Cart
          </button>
          <button class="cart-remove-link" onclick="window.amzCart.toggleWishlist('${prod.id}'); window.amzModal.renderWishlistTab();">
            Remove
          </button>
        </div>
      </div>
    `).join('');
  }

  // ==========================================
  // 7. MODAL VISIBILITY HELPERS
  // ==========================================
  showModal(modal) {
    if (!modal) return;
    this.activeModal = modal;
    const overlay = document.getElementById('global-overlay');

    modal.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    const overlay = document.getElementById('global-overlay');

    if (overlay && !document.querySelector('.modal.is-open, .amz-modal.is-open, .cart-drawer.is-open, .dept-drawer.is-open')) {
      overlay.classList.remove('is-open');
    }
    document.body.style.overflow = '';
    this.activeModal = null;
  }

  closeAllModalsAndDrawers() {
    document.querySelectorAll('.modal.is-open, .amz-modal.is-open').forEach(m => m.classList.remove('is-open'));
    this.closeCartDrawer();
    this.closeDepartmentDrawer();

    const overlay = document.getElementById('global-overlay');
    if (overlay) overlay.classList.remove('is-open');
    document.body.style.overflow = '';
    this.activeModal = null;
  }
}

// Global Singleton Instance
window.amzModal = new ModalEngine();
