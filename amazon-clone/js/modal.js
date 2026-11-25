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
  openQuickView(productOrId) {
    if (!productOrId) return;
    let product = productOrId;
    if (typeof productOrId === 'string' || typeof productOrId === 'number') {
      product = window.amzStore ? window.amzStore.getProductById(productOrId) : null;
      if (!product && window.PRODUCTS_DATA) {
        product = window.PRODUCTS_DATA.find(p => String(p.id) === String(productOrId));
      }
    }
    if (!product) return;

    this.currentQuickViewProduct = product;
    const modal = document.getElementById('quickview-modal');
    if (!modal) return;

    const numPrice = typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 999);
    const numOrig = product.originalPrice || product.mrp;
    const formattedPrice = window.amzApp ? window.amzApp.formatPrice(numPrice) : `₹${numPrice}`;
    const formattedOrig = numOrig ? (window.amzApp ? window.amzApp.formatPrice(numOrig) : `₹${numOrig}`) : null;

    // Build specs table rows
    const specsRows = Object.entries(product.specs || {}).map(([key, val]) => `
      <tr>
        <td class="spec-label">${window.amzStore ? window.amzStore.escapeHTML(key) : key}</td>
        <td class="spec-value">${window.amzStore ? window.amzStore.escapeHTML(val) : val}</td>
      </tr>
    `).join('');

    // Build features bullets
    const rawFeatures = Array.isArray(product.features) ? product.features : (product.features ? [product.features] : []);
    const featuresList = rawFeatures.map(f => `<li>${window.amzStore ? window.amzStore.escapeHTML(f) : f}</li>`).join('');

    // Build thumbnails
    const imagesList = Array.isArray(product.images) && product.images.length > 0 
      ? product.images 
      : [product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'];

    const thumbnailsHtml = imagesList.map((img, idx) => `
      <button class="qv-thumb-btn ${idx === 0 ? 'is-active' : ''}" data-image-url="${img}">
        <img src="${img}" alt="Angle ${idx + 1}" />
      </button>
    `).join('');

    const mainImgEl = modal.querySelector('.qv-main-image');
    if (mainImgEl) {
      mainImgEl.src = imagesList[0];
      mainImgEl.alt = product.title || 'Product Image';
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

    const locInfo = window.amzStore ? window.amzStore.getLocation() : { city: 'New Delhi', pincode: '110001' };
    const locCity = locInfo.city || 'Your Doorstep';
    const locPin = locInfo.pincode || '110001';
    const deliveryEl = modal.querySelector('.qv-delivery-info');
    if (deliveryEl) {
      deliveryEl.innerHTML = `
        <div class="qv-pincode-checker-box" style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 12px; margin: 8px 0 12px;">
          <div style="display: flex; gap: 8px; align-items: center;">
            <span style="font-size: 1rem;">📍</span>
            <input type="text" id="qv-pincode-check-input" maxlength="6" value="${locPin}" placeholder="6-digit PIN" style="width: 110px; padding: 5px 8px; font-size: 0.85rem; border: 1px solid #cbd5e1; border-radius: 6px; font-weight: 700;" />
            <button type="button" id="qv-pincode-check-btn" class="amz-btn amz-btn-secondary" style="padding: 5px 12px; font-size: 0.82rem; width: auto;">Check Delivery</button>
            <span id="qv-pincode-live-hub" style="font-size: 0.8rem; color: #64748b; margin-left: auto;">India Post Speed Post</span>
          </div>
          <div id="qv-pincode-details-box" style="margin-top: 8px; font-size: 0.84rem; display: flex; flex-direction: column; gap: 4px;">
            <div style="color: #047857; font-weight: 700;">🚚 Guaranteed Delivery by Tomorrow, 2:00 PM to ${locCity} (${locPin})</div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px;">
              <span style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">✓ Cash on Delivery (COD) Available</span>
              <span style="background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">✓ 100% Free Open-Box Inspection at Doorstep</span>
            </div>
          </div>
        </div>
      `;

      // Bind dynamic live pincode check
      const pinInput = deliveryEl.querySelector('#qv-pincode-check-input');
      const pinBtn = deliveryEl.querySelector('#qv-pincode-check-btn');
      const pinDetails = deliveryEl.querySelector('#qv-pincode-details-box');
      const pinHub = deliveryEl.querySelector('#qv-pincode-live-hub');

      const runPinCheck = async () => {
        const pinVal = pinInput?.value.trim();
        if (pinVal && pinVal.length === 6 && /^\d{6}$/.test(pinVal) && window.amzStore) {
          pinBtn.textContent = 'Checking...';
          const info = await window.amzStore.fetchPincode(pinVal);
          pinBtn.textContent = 'Check Delivery';
          if (info && pinDetails) {
            pinDetails.innerHTML = `
              <div style="color: #047857; font-weight: 700;">🚚 Delivery: ${info.estimatedDeliveryDate || 'Tomorrow'} to ${info.city}, ${info.state} (${info.pincode})</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-top: 2px;">
                <span style="background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">✓ Cash on Delivery (COD) Available</span>
                <span style="background: #eff6ff; color: #1e40af; border: 1px solid #bfdbfe; padding: 2px 8px; border-radius: 9999px; font-size: 0.75rem; font-weight: 700;">✓ 100% Free Open-Box Inspection at Doorstep</span>
              </div>
            `;
            if (pinHub) pinHub.textContent = info.hub || 'India Post Speed Post';
          }
        }
      };

      if (pinBtn) pinBtn.onclick = runPinCheck;
      if (pinInput) {
        pinInput.onkeydown = (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            runPinCheck();
          }
        };
      }
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
          if (window.amzCart) {
            window.amzCart.showToast('⚠️ Please write a short review before submitting.', 'warning');
          }
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
    const listEl = document.getElementById('cart-drawer-items');
    const subtotalEl = document.getElementById('cart-drawer-subtotal');
    const totalEl = document.getElementById('cart-drawer-total');
    const countEl = document.getElementById('cart-drawer-count');
    const itemsLabelEl = document.getElementById('cart-subtotal-items-label');
    const emptyStateEl = document.getElementById('cart-drawer-empty');
    const filledStateEl = document.getElementById('cart-drawer-filled');
    const quickAddonCard = document.getElementById('cart-quick-addon-card');

    if (!listEl || !window.amzCart) return;

    const summary = window.amzCart.getSummary();
    const welfareCheck = document.getElementById('welfare-fund-check');
    const welfareContribution = (welfareCheck && welfareCheck.checked) ? 100 : 0;
    const orderTotal = summary.subtotal > 0 ? (summary.orderTotal + welfareContribution) : 0;

    if (countEl) {
      countEl.textContent = `${summary.itemCount} Items`;
    }

    if (itemsLabelEl) {
      itemsLabelEl.textContent = `Subtotal (${summary.itemCount} Items):`;
    }

    if (subtotalEl) {
      subtotalEl.textContent = window.amzApp ? window.amzApp.formatPrice(summary.subtotal) : `₹${summary.subtotal.toLocaleString('en-IN')}`;
    }

    if (totalEl) {
      totalEl.textContent = window.amzApp ? window.amzApp.formatPrice(orderTotal) : `₹${orderTotal.toLocaleString('en-IN')}`;
    }

    if (window.amzCart.items.length === 0) {
      listEl.innerHTML = '';
      if (emptyStateEl) emptyStateEl.style.display = 'flex';
      if (filledStateEl) filledStateEl.style.display = 'none';
      if (quickAddonCard) quickAddonCard.style.display = 'none';
      return;
    }

    if (emptyStateEl) emptyStateEl.style.display = 'none';
    if (filledStateEl) filledStateEl.style.display = 'block';
    if (quickAddonCard) quickAddonCard.style.display = 'block';

    // Render interactive coupon widget inside cart drawer
    let couponWidget = document.getElementById('cart-coupon-interactive-widget');
    if (!couponWidget) {
      couponWidget = document.createElement('div');
      couponWidget.id = 'cart-coupon-interactive-widget';
      couponWidget.className = 'cart-coupon-interactive-widget';
      if (filledStateEl) {
        filledStateEl.insertBefore(couponWidget, filledStateEl.firstChild);
      }
    }

    const appliedCoupon = summary.appliedCoupon;
    if (appliedCoupon && summary.couponDiscount > 0) {
      couponWidget.innerHTML = `
        <div style="background: #ecfdf5; border: 1px dashed #10b981; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px; display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span style="font-size: 1.2rem;">🏷️</span>
            <div>
              <div style="font-weight: 800; font-size: 0.88rem; color: #065f46;">${appliedCoupon.code} Applied</div>
              <div style="font-size: 0.78rem; color: #047857;">You saved ₹${summary.couponDiscount.toLocaleString('en-IN')}!</div>
            </div>
          </div>
          <button type="button" onclick="window.amzStore.removeCoupon();" style="background: none; border: 1px solid #a7f3d0; color: #dc2626; font-size: 0.78rem; font-weight: 700; padding: 4px 8px; border-radius: 6px; cursor: pointer;">
            ✕ Remove
          </button>
        </div>
      `;
    } else {
      couponWidget.innerHTML = `
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 10px 12px; margin-bottom: 12px;">
          <div style="font-size: 0.82rem; font-weight: 700; margin-bottom: 6px; color: #334155;">Promotional Discount Coupon:</div>
          <div style="display: flex; gap: 6px;">
            <input type="text" id="cart-drawer-coupon-input" placeholder="e.g. WELCOME10 or FLAT200" style="flex: 1; padding: 6px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.82rem; font-weight: 700; text-transform: uppercase;" />
            <button type="button" id="cart-drawer-coupon-apply-btn" class="amz-btn amz-btn-secondary" style="padding: 6px 14px; width: auto; font-size: 0.82rem; font-weight: 700;">Apply</button>
          </div>
          <div style="display: flex; gap: 6px; margin-top: 6px; flex-wrap: wrap;">
            <button type="button" onclick="window.amzStore.applyCoupon('WELCOME10', window.amzCart.getSummary().subtotal);" style="background: #f1f5f9; border: 1px dashed #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; color: #475569; font-weight: 600;">+ WELCOME10 (10% OFF)</button>
            <button type="button" onclick="window.amzStore.applyCoupon('FLAT200', window.amzCart.getSummary().subtotal);" style="background: #f1f5f9; border: 1px dashed #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 0.75rem; cursor: pointer; color: #475569; font-weight: 600;">+ FLAT200 (₹200 OFF)</button>
          </div>
        </div>
      `;

      const inputEl = couponWidget.querySelector('#cart-drawer-coupon-input');
      const applyBtn = couponWidget.querySelector('#cart-drawer-coupon-apply-btn');
      if (applyBtn && inputEl) {
        applyBtn.onclick = () => {
          const code = inputEl.value.trim();
          if (code && window.amzStore) {
            window.amzStore.applyCoupon(code, summary.subtotal);
          }
        };
        inputEl.onkeydown = (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            const code = inputEl.value.trim();
            if (code && window.amzStore) {
              window.amzStore.applyCoupon(code, summary.subtotal);
            }
          }
        };
      }
    }

    // Render coupon line in breakdown if applied
    let couponBreakdownRow = document.getElementById('cart-drawer-coupon-breakdown-row');
    if (summary.couponDiscount > 0 && appliedCoupon) {
      if (!couponBreakdownRow) {
        couponBreakdownRow = document.createElement('div');
        couponBreakdownRow.id = 'cart-drawer-coupon-breakdown-row';
        couponBreakdownRow.className = 'cd-breakdown-row cd-coupon-row';
        const subtotalRow = document.getElementById('cart-drawer-subtotal')?.parentNode;
        if (subtotalRow && subtotalRow.parentNode) {
          subtotalRow.parentNode.insertBefore(couponBreakdownRow, subtotalRow.nextSibling);
        }
      }
      couponBreakdownRow.innerHTML = `
        <span class="cd-breakdown-label">Coupon (${appliedCoupon.code}):</span>
        <span class="cd-breakdown-val cd-val-green">-₹${summary.couponDiscount.toLocaleString('en-IN')}</span>
      `;
      couponBreakdownRow.style.display = 'flex';
    } else if (couponBreakdownRow) {
      couponBreakdownRow.style.display = 'none';
    }

    listEl.innerHTML = window.amzCart.items.map(item => {
      const formattedPrice = window.amzApp ? window.amzApp.formatPrice(item.price) : `₹${item.price.toLocaleString('en-IN')}`;
      let catTag = 'HERITAGE HANDLOOM • GI-TAG-UP';
      let subDesc = 'Direct from Artisan Guild • 100% Authentic Handcrafted';

      if (item.category === 'clothing' || (item.categoryName && item.categoryName.includes('Fashion'))) {
        catTag = item.id === 'prod-33' ? 'HERITAGE HANDLOOM • GI-TAG-UP' : 'CLOTHING & FASHION • PREMIUM WEAR';
        subDesc = item.id === 'prod-33' ? 'Patola Zari | Woven in Mohalla Piil, Varanasi Karigar' : 'Comfort Tailored • Premium Breathable Fabric';
      } else if (item.category === 'audio' || item.category === 'electronics') {
        catTag = 'AUDIO & ELECTRONICS • 1-YR WARRANTY';
        subDesc = 'Studio Hi-Fi Fidelity • Fast Bluetooth 5.3 & ANC';
      } else if (item.category === 'kitchen') {
        catTag = 'INDIA POTTERY • CERTIFIED';
        subDesc = 'Natural Raw Quartz | Khurja & Jaipur Artisan Guild';
      }

      return `
        <div class="cart-drawer-item" data-product-id="${item.id}">
          <img src="${item.image}" alt="${window.amzStore ? window.amzStore.escapeHTML(item.title) : item.title}" class="cart-item-thumb" />
          <div class="cart-item-details">
            <span class="cd-item-tag-pill">${catTag}</span>
            <h5 class="cart-item-title">${window.amzStore ? window.amzStore.escapeHTML(item.shortTitle || item.title) : (item.shortTitle || item.title)}</h5>
            <p class="cd-item-spec-line">${subDesc}</p>
            <div class="cd-item-price-actions-row">
              <div class="cart-item-price">${formattedPrice}</div>
              <div class="cart-qty-stepper">
                <button type="button" class="qty-btn qty-minus" onclick="window.amzCart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
                <span class="qty-val">${item.quantity}</span>
                <button type="button" class="qty-btn qty-plus" onclick="window.amzCart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
              </div>
              <button type="button" class="cart-remove-icon-btn" onclick="window.amzCart.removeItem('${item.id}')" title="Remove item">🗑</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  bindCartReactiveUpdates() {
    const handleCartUpdate = () => {
      const drawer = document.getElementById('cart-drawer');
      if (drawer && drawer.classList.contains('is-open')) {
        this.renderCartDrawer();
      }
    };
    window.addEventListener('amz:cart-updated', handleCartUpdate);
    window.addEventListener('cart:updated', handleCartUpdate);
  }

  // ==========================================
  // 4. DEPARTMENT HAMBURGER SIDE DRAWER
  // ==========================================
  bindDepartmentDrawer() {
    const hamburgerBtn = document.getElementById('nav-hamburger-btn');
    const closeBtn = document.getElementById('department-drawer-close-btn');

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
    const drawer = document.getElementById('department-drawer');
    const overlay = document.getElementById('global-overlay');

    if (drawer) {
      drawer.classList.add('is-open');
      if (overlay) overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
    }
  }

  closeDepartmentDrawer() {
    const drawer = document.getElementById('department-drawer');
    const overlay = document.getElementById('global-overlay');

    if (drawer) {
      drawer.classList.remove('is-open');
      if (overlay && !document.querySelector('.amz-modal.is-open, .modal.is-open:not(#department-drawer), .cart-drawer.is-open')) {
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
      const isCancelled = order.status === 'Cancelled';
      const isDelivered = step >= 4 && !isCancelled;
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
        <div class="order-card-record ${isCancelled ? 'is-cancelled-order' : ''}" data-order-id="${order.orderId}">
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
              <span class="tracking-badge ${isCancelled ? 'status-cancelled' : `status-step-${step}`}">${order.status}</span>
            </div>
          </div>

          ${isCancelled ? `
            <!-- Order Cancelled & Refund Banner -->
            <div class="order-cancelled-banner" style="background: rgba(239, 68, 68, 0.08); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: 8px; padding: 12px 16px; margin: 14px 0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="color: #dc2626; font-weight: 800; font-size: 0.92rem;">❌ Order Cancelled</span>
                <div style="font-size: 0.8rem; color: var(--text-secondary); margin-top: 2px;">Reason: ${order.cancelReason || 'Cancelled by buyer'} • Inventory restocked to shop</div>
              </div>
              <div style="font-size: 0.8rem; background: #fee2e2; color: #991b1b; padding: 4px 10px; border-radius: 6px; font-weight: 700;">
                💰 100% Refund Credited (${order.refundRef || 'REF-INSTANT'})
              </div>
            </div>
          ` : `
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
          `}

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
              <div class="tracking-code"><strong>Tracking #:</strong> <a href="#" onclick="window.amzModal.openTransitCorridorModal('${order.orderId}'); return false;" style="text-decoration: underline; color: #b45309; font-weight: 700; cursor: pointer;">${order.trackingNumber || 'INP-SPEEDPOST'}</a> <span style="font-size: 0.75rem; background: #fef3c7; color: #92400e; padding: 2px 6px; border-radius: 4px; font-weight: 700; cursor: pointer;" onclick="window.amzModal.openTransitCorridorModal('${order.orderId}');">Live Corridor 📍</span></div>
              <div class="tracking-estimate">Destination: <strong>${window.amzStore.escapeHTML(ship.city || 'Your Address')} (${window.amzStore.escapeHTML(ship.pincode || '')})</strong></div>
              <div class="tracking-payment">Payment: <strong>${window.amzStore.escapeHTML(order.paymentMethod || 'UPI')}</strong> ${isCancelled ? '<span style="color: #dc2626; font-weight: 700;">(Refunded)</span>' : ''}</div>
            </div>

            ${order.activeRma ? `
              <div class="order-rma-card" style="background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.35); border-radius: 8px; padding: 12px 14px; margin: 12px 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                  <div>
                    <span style="color: #b45309; font-weight: 800; font-size: 0.88rem;">🛡️ ${order.activeRma.type} PASS ACTIVE (#${order.activeRma.rmaNumber})</span>
                    <div style="font-size: 0.8rem; color: #475569; margin-top: 3px;">
                      Stage: <strong>${order.activeRma.statusLabel || order.activeRma.status}</strong> • Slot: ${order.activeRma.pickupSlot}
                    </div>
                  </div>
                  <div style="display: flex; gap: 6px; align-items: center;">
                    <span style="background: #fef3c7; border: 1px dashed #d97706; padding: 4px 8px; border-radius: 6px; font-size: 0.8rem; font-weight: 800; color: #92400e;">
                      OTP: ${order.activeRma.handoverOtp}
                    </span>
                    <button type="button" class="amz-btn amz-btn-secondary" onclick="window.amzModal.openReturnExchangeModal('${order.orderId}')" style="padding: 4px 10px; font-size: 0.78rem;">
                      View Pass &amp; Demo
                    </button>
                  </div>
                </div>
              </div>
            ` : ''}

            <div class="order-card-actions">
              ${isCancelled ? `
                <button class="amz-btn amz-btn-primary btn-buy-again" onclick="window.amzModal.handleBuyAgain('${order.orderId}')">
                  🔄 Re-order This Item
                </button>
              ` : (!isDelivered ? `
                <button class="amz-btn amz-btn-secondary btn-advance-demo-order" onclick="window.amzStore.advanceOrderStep('${order.orderId}')" title="Advance step for testing">
                  🚚 Advance Delivery Status (Demo)
                </button>
                <button class="amz-btn amz-btn-secondary btn-cancel-order" onclick="window.amzModal.confirmCancelOrder('${order.orderId}')" style="color: #dc2626; border-color: rgba(220, 38, 38, 0.4);" title="Cancel this order and get 100% instant refund">
                  ✕ Cancel Order
                </button>
              ` : `
                <span class="delivered-celebration-pill">🎉 Delivered Successfully!</span>
                <button class="amz-btn amz-btn-primary btn-buy-again" onclick="window.amzModal.handleBuyAgain('${order.orderId}')">
                  🔄 Buy Again (1-Click)
                </button>
                <button class="amz-btn amz-btn-secondary btn-return-exchange" onclick="window.amzModal.openReturnExchangeModal('${order.orderId}')" style="border-color: #f59e0b; color: #b45309;">
                  ↩️ Return / Exchange
                </button>
                <button class="amz-btn amz-btn-secondary btn-rate-delivered" onclick="window.amzModal.openReviewForOrder('${order.orderId}')">
                  ⭐ Rate &amp; Review
                </button>
              `)}
              <button class="amz-btn amz-btn-ghost btn-view-invoice-link" onclick="window.amzCheckout.openGSTInvoice(window.amzStore.getOrderById('${order.orderId}'))">
                📄 ${isCancelled ? 'View Cancellation Slip' : 'View Tax Invoice'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  confirmCancelOrder(orderId) {
    const order = window.amzStore ? window.amzStore.getOrderById(orderId) : null;
    if (!order) return;

    const reasons = [
      "Changed my mind / Placed by mistake",
      "Need to change delivery address or contact number",
      "Found another craft or better price",
      "Delivery time is longer than expected"
    ];

    const promptText = `Are you sure you want to cancel Order #${orderId}?\n\n` +
      `• 100% Instant Refund will be credited back to your account.\n` +
      `• Stock will be returned to the artisan's workshop.\n\n` +
      `Enter reason number or type custom reason:\n` +
      reasons.map((r, i) => `${i + 1}. ${r}`).join('\n');

    const finalReason = reasons[0];
    if (window.amzStore) {
      window.amzStore.cancelOrder(orderId, finalReason);
    }
    this.renderOrdersHistory();
    if (window.amzCart) {
      window.amzCart.showToast(`Order #${orderId} cancelled. Instant refund initiated.`, 'info');
    }
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

  openReviewForOrder(orderId) {
    const order = window.amzStore ? window.amzStore.getOrderById(orderId) : null;
    if (!order || !order.items || order.items.length === 0) return;

    const firstItem = order.items[0];
    const fullProd = window.amzStore ? window.amzStore.getProductById(firstItem.id) : null;
    const target = fullProd || firstItem;

    this.closeAllModalsAndDrawers();
    this.openQuickView(target);
    setTimeout(() => {
      const modal = document.getElementById('quickview-modal');
      const reviewForm = modal?.querySelector('#form-add-review');
      if (reviewForm) {
        reviewForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 300);
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
  openAccountModal() {
    if (window.amzAuth) {
      window.amzAuth.openBuyerAuthModal();
    }
  }

  showModal(modal) {
    if (!modal) return;
    this.activeModal = modal;
    const overlay = document.getElementById('global-overlay');

    modal.classList.add('is-open');
    modal.classList.add('active');
    if (overlay) {
      overlay.classList.add('is-open');
      overlay.classList.add('is-active');
    }
    document.body.style.overflow = 'hidden';
  }

  hideModal(modal) {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.classList.remove('active');
    const overlay = document.getElementById('global-overlay');

    if (overlay && !document.querySelector('.modal.is-open, .modal.active, .amz-modal.is-open, .amz-modal.active, .cart-drawer.is-open, .dept-drawer.is-open')) {
      overlay.classList.remove('is-open');
      overlay.classList.remove('is-active');
    }
    document.body.style.overflow = '';
    this.activeModal = null;
  }

  // ==========================================
  // 6B. RETURN & EXCHANGE (RMA) LIFECYCLE WIZARD
  // ==========================================
  openReturnExchangeModal(orderId) {
    const order = window.amzStore ? window.amzStore.getOrderById(orderId) : null;
    if (!order) return;

    const modal = document.getElementById('return-exchange-modal');
    if (!modal) return;

    const bodyEl = document.getElementById('return-exchange-modal-body');
    if (!bodyEl) return;

    const firstItem = (order.items && order.items[0]) || { title: 'Ordered Craft Item', price: order.totalAmount };
    const rma = order.activeRma || (window.amzStore ? window.amzStore.getReturnRequestByOrderId(orderId) : null);

    if (rma) {
      // Render Twin-Track Active RMA Pass
      const isExchange = rma.type === 'EXCHANGE';
      const steps = [
        { label: 'Registered', done: true },
        { label: 'Courier Scheduled', done: true },
        { label: 'QC & Pickup', done: rma.status === 'QC_PASSED' || rma.status === 'REFUND_COMPLETED' || rma.status === 'REPLACEMENT_DISPATCHED' },
        { label: isExchange ? 'Replacement Sent' : 'Refund Credited', done: rma.status === 'REFUND_COMPLETED' || rma.status === 'REPLACEMENT_DISPATCHED' }
      ];

      bodyEl.innerHTML = `
        <div class="rma-pass-wrapper" style="font-family: var(--font-body, inherit);">
          <!-- Top Pass Banner -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
              <div>
                <span style="font-size: 0.75rem; font-weight: 800; color: #d97706; text-transform: uppercase; letter-spacing: 0.05em;">7-Day Easy Doorstep Guarantee</span>
                <h4 style="margin: 2px 0 0; font-size: 1.15rem; font-weight: 800; color: #0f172a;">${isExchange ? '🔄 Exchange / Replacement' : '↩️ Return for Full Refund'}</h4>
                <div style="font-size: 0.82rem; color: #64748b; margin-top: 2px;">RMA Pass: <strong>${rma.rmaNumber}</strong> • Linked to Order: <strong>${order.orderId}</strong></div>
              </div>
              <div style="text-align: right;">
                <span class="tracking-badge" style="background: #ecfdf5; color: #047857; border: 1px solid #a7f3d0; padding: 6px 12px; border-radius: 9999px; font-weight: 800; font-size: 0.85rem;">
                  ● ${rma.statusLabel || rma.status}
                </span>
              </div>
            </div>
          </div>

          <!-- Dual OTP & Gate PIN Verification Shield -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 20px;">
            <div style="background: linear-gradient(135deg, #fef3c7, #fde68a); border: 2px dashed #f59e0b; border-radius: 12px; padding: 14px; text-align: center;">
              <span style="font-size: 0.75rem; font-weight: 800; color: #92400e; text-transform: uppercase;">Doorstep Handover OTP</span>
              <div style="font-size: 2.2rem; font-weight: 900; letter-spacing: 6px; color: #78350f; font-family: monospace; margin: 4px 0;">
                ${rma.handoverOtp}
              </div>
              <span style="font-size: 0.75rem; color: #92400e;">Show this 4-digit code to courier beat officer</span>
            </div>

            <div style="background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 12px; padding: 14px; text-align: center;">
              <span style="font-size: 0.75rem; font-weight: 800; color: #475569; text-transform: uppercase;">Gated Society Access PIN</span>
              <div style="font-size: 1.8rem; font-weight: 900; letter-spacing: 4px; color: #1e293b; font-family: monospace; margin: 6px 0;">
                ${rma.gatePin}
              </div>
              <span style="font-size: 0.75rem; color: #64748b;">Share with apartment security for entry</span>
            </div>
          </div>

          <!-- Twin-Track Lifecycle Progress -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin-bottom: 20px;">
            <h5 style="margin: 0 0 12px; font-size: 0.88rem; font-weight: 800; color: #334155;">Twin-Track Corridor Progress:</h5>
            <div style="display: flex; justify-content: space-between; position: relative;">
              ${steps.map((st, i) => `
                <div style="flex: 1; text-align: center; position: relative;">
                  <div style="width: 28px; height: 28px; border-radius: 50%; margin: 0 auto 6px; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 0.82rem; background: ${st.done ? '#10b981' : '#e2e8f0'}; color: ${st.done ? '#ffffff' : '#64748b'};">
                    ${st.done ? '✓' : (i + 1)}
                  </div>
                  <span style="font-size: 0.75rem; font-weight: ${st.done ? '700' : '500'}; color: ${st.done ? '#065f46' : '#64748b'};">${st.label}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Pickup Details & Assigned Logistics Officer -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 14px; margin-bottom: 20px; font-size: 0.84rem;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <span style="color: #64748b; font-size: 0.76rem;">SCHEDULED PICKUP SLOT</span>
                <div style="font-weight: 700; color: #0f172a;">${rma.pickupSlot}</div>
              </div>
              <div>
                <span style="color: #64748b; font-size: 0.76rem;">REVERSE LOGISTICS FLEET</span>
                <div style="font-weight: 700; color: #0f172a;">${rma.courierName}</div>
              </div>
              <div>
                <span style="color: #64748b; font-size: 0.76rem;">ASSIGNED POSTAL OFFICER</span>
                <div style="font-weight: 700; color: #0f172a;">${rma.agentName} (${rma.agentPhone})</div>
              </div>
              <div>
                <span style="color: #64748b; font-size: 0.76rem;">REVERSE AWB #</span>
                <div style="font-weight: 700; color: #0f172a;"><code>${rma.awbNumber}</code></div>
              </div>
            </div>
            ${isExchange ? `
              <div style="margin-top: 10px; padding-top: 10px; border-top: 1px dashed #cbd5e1;">
                <span style="color: #64748b; font-size: 0.76rem;">REPLACEMENT VARIANT REQUESTED</span>
                <div style="font-weight: 800; color: #047857;">${rma.replacementVariant}</div>
              </div>
            ` : ''}
          </div>

          <!-- Action Buttons -->
          <div style="display: flex; gap: 10px; justify-content: flex-end; align-items: center; flex-wrap: wrap;">
            <button type="button" class="amz-btn amz-btn-secondary" onclick="window.amzStore.advanceRmaStep('${rma.rmaNumber}'); window.amzModal.openReturnExchangeModal('${order.orderId}');" style="width: auto; padding: 8px 16px; font-size: 0.84rem;">
              ⚡ Advance RMA Step (Demo Simulation)
            </button>
            <button type="button" class="amz-btn amz-btn-primary" onclick="window.amzModal.hideModal(document.getElementById('return-exchange-modal'));" style="width: auto; padding: 8px 20px;">
              Done
            </button>
          </div>
        </div>
      `;
    } else {
      // Render Initial Return/Exchange Creation Wizard
      bodyEl.innerHTML = `
        <form id="form-create-rma" onsubmit="event.preventDefault(); window.amzModal.submitReturnExchangeForm('${order.orderId}');">
          <!-- Item Summary Header -->
          <div style="display: flex; gap: 12px; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px; margin-bottom: 16px;">
            <img src="${firstItem.image || 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&q=80'}" alt="Item" style="width: 52px; height: 52px; object-fit: cover; border-radius: 6px; border: 1px solid #e2e8f0;" />
            <div>
              <h5 style="margin: 0; font-size: 0.92rem; font-weight: 700; color: #0f172a;">${window.amzStore.escapeHTML(firstItem.title)}</h5>
              <span style="font-size: 0.8rem; color: #64748b;">Order #${order.orderId} • Delivered • 7-Day Protection</span>
            </div>
          </div>

          <!-- Step 1: Choose Action Type -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-weight: 700; font-size: 0.86rem; margin-bottom: 8px; color: #1e293b;">Select Resolution Type *</label>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 10px; border: 2px solid #e2e8f0; border-radius: 10px; padding: 12px; cursor: pointer; background: #ffffff;" id="label-opt-exchange">
                <input type="radio" name="rma-type-choice" value="EXCHANGE" checked onchange="document.getElementById('exchange-variant-group').style.display = 'block';" />
                <div>
                  <div style="font-weight: 800; font-size: 0.9rem;">🔄 Free Exchange</div>
                  <span style="font-size: 0.76rem; color: #64748b;">Get a different size, fit or piece</span>
                </div>
              </label>
              <label style="display: flex; align-items: center; gap: 10px; border: 2px solid #e2e8f0; border-radius: 10px; padding: 12px; cursor: pointer; background: #ffffff;" id="label-opt-return">
                <input type="radio" name="rma-type-choice" value="RETURN" onchange="document.getElementById('exchange-variant-group').style.display = 'none';" />
                <div>
                  <div style="font-weight: 800; font-size: 0.9rem;">↩️ 100% Refund</div>
                  <span style="font-size: 0.76rem; color: #64748b;">Return for instant refund to source</span>
                </div>
              </label>
            </div>
          </div>

          <!-- Reason Selector -->
          <div style="margin-bottom: 14px;">
            <label for="rma-reason-select" style="display: block; font-weight: 700; font-size: 0.86rem; margin-bottom: 6px; color: #1e293b;">Reason for Return / Exchange *</label>
            <select id="rma-reason-select" class="form-input" required style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.86rem;">
              <option value="Size / Fit adjustment needed">Size / Fit adjustment needed (Too tight / too loose)</option>
              <option value="Quality / Texture not as expected">Quality / Texture not as expected</option>
              <option value="Damaged during shipping">Item arrived damaged / defective</option>
              <option value="Received incorrect variant/color">Received wrong color / design</option>
              <option value="Changed my mind">Changed my mind / Not needed anymore</option>
            </select>
          </div>

          <!-- Replacement Variant (For Exchange) -->
          <div id="exchange-variant-group" style="margin-bottom: 14px;">
            <label for="rma-variant-input" style="display: block; font-weight: 700; font-size: 0.86rem; margin-bottom: 6px; color: #1e293b;">Desired Replacement Variant (e.g. Size M, Color Gold) *</label>
            <input type="text" id="rma-variant-input" class="form-input" placeholder="e.g. UK 10 / Larger Fit / Saree with Red Palla" value="Standard Replacement Piece (Craft Checked)" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.86rem;" />
          </div>

          <!-- Pickup Slot -->
          <div style="margin-bottom: 16px;">
            <label for="rma-slot-select" style="display: block; font-weight: 700; font-size: 0.86rem; margin-bottom: 6px; color: #1e293b;">Select Doorstep Reverse Pickup Slot *</label>
            <select id="rma-slot-select" class="form-input" style="width: 100%; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.86rem;">
              <option value="Tomorrow 10:00 AM - 01:00 PM">Tomorrow Morning: 10:00 AM - 01:00 PM</option>
              <option value="Tomorrow 02:00 PM - 06:00 PM">Tomorrow Afternoon: 02:00 PM - 06:00 PM</option>
              <option value="Day After Tomorrow 10:00 AM - 01:00 PM">Day After Tomorrow: 10:00 AM - 01:00 PM</option>
            </select>
          </div>

          <!-- Handover Guarantee Box -->
          <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 8px; padding: 10px 14px; margin-bottom: 18px; font-size: 0.8rem; color: #065f46;">
            🛡️ <strong>Zero-Hassle Doorstep Verification:</strong> You will receive a 4-Digit Handover OTP and a 6-Digit Gate PIN upon submitting this form. India Post Beat Courier will pick up without box repackaging needed.
          </div>

          <!-- Form Actions -->
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button type="button" class="amz-btn amz-btn-ghost" onclick="window.amzModal.hideModal(document.getElementById('return-exchange-modal'));" style="width: auto; padding: 10px 18px;">
              Cancel
            </button>
            <button type="submit" class="amz-btn amz-btn-primary" style="width: auto; padding: 10px 24px;">
              Generate Return/Exchange Pass &amp; OTP →
            </button>
          </div>
        </form>
      `;
    }

    this.showModal(modal);
  }

  submitReturnExchangeForm(orderId) {
    const choiceEl = document.querySelector('input[name="rma-type-choice"]:checked');
    const type = choiceEl ? choiceEl.value : 'EXCHANGE';
    const reason = document.getElementById('rma-reason-select')?.value;
    const variant = document.getElementById('rma-variant-input')?.value;
    const slot = document.getElementById('rma-slot-select')?.value;

    if (window.amzStore) {
      window.amzStore.createReturnRequest(orderId, {
        type: type,
        reason: reason,
        replacementVariant: variant,
        pickupSlot: slot
      });
      // Re-render modal to show generated pass
      this.openReturnExchangeModal(orderId);
      this.renderOrdersHistory();
    }
  }

  // ==========================================
  // 6C. LIVE TRANSIT CORRIDOR & WAYBILL MODAL
  // ==========================================
  openTransitCorridorModal(orderId) {
    const order = window.amzStore ? window.amzStore.getOrderById(orderId) : null;
    if (!order) return;

    const modal = document.getElementById('transit-corridor-modal');
    if (!modal) return;

    const bodyEl = document.getElementById('transit-corridor-modal-body');
    if (!bodyEl) return;

    const step = order.currentStep || order.trackingStep || 1;
    const ship = order.deliveryLocation || {};
    const trackingNo = order.trackingNumber || 'INP-SPEEDPOST-89102';
    const destCity = ship.city || 'Destination Hub';
    const destPin = ship.pincode || '110001';

    const hubs = [
      {
        num: 1,
        title: 'Varanasi Master Karigar Cluster Hub',
        loc: 'Varanasi, UP (PIN: 221001)',
        time: 'Day 1 • 10:30 AM',
        desc: 'Handcrafted craft unit verified with Silk Mark / GI-Tag seal and dispatched to postal sorting station.',
        done: step >= 1,
        current: step === 1
      },
      {
        num: 2,
        title: 'National Air Freight Gateway (DEL)',
        loc: 'Indira Gandhi Cargo Terminal, New Delhi',
        time: 'Day 1 • 06:45 PM',
        desc: 'Security screened and loaded onto scheduled logistics air corridor dispatch.',
        done: step >= 2,
        current: step === 2
      },
      {
        num: 3,
        title: `${destCity} Central Postal Distribution Hub`,
        loc: `${destCity}, India (PIN: ${destPin})`,
        time: 'Day 2 • 06:15 AM',
        desc: 'Sorted to local postal beat zone. Handed to certified India Post delivery officer.',
        done: step >= 3,
        current: step === 3
      },
      {
        num: 4,
        title: 'Out for Doorstep Handover',
        loc: `${ship.address || destCity}`,
        time: 'Day 2 • 10:00 AM',
        desc: 'Courier out on electric delivery van. Open-Box Physical Inspection available.',
        done: step >= 4,
        current: step === 4
      }
    ];

    bodyEl.innerHTML = `
      <div class="transit-corridor-wrapper" style="font-family: var(--font-body, inherit);">
        <!-- Waybill Slip Header -->
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
          <div>
            <div style="font-size: 0.72rem; color: #64748b; font-weight: 800; text-transform: uppercase;">OFFICIAL SPEED POST WAYBILL</div>
            <h4 style="margin: 2px 0 0; font-size: 1.15rem; font-weight: 900; color: #0f172a;">${trackingNo}</h4>
            <div style="font-size: 0.82rem; color: #475569; margin-top: 2px;">Order Ref: <strong>${order.orderId}</strong> • Carrier: India Post Express</div>
          </div>

          <!-- Barcode Visualization -->
          <div style="text-align: right;">
            <div class="waybill-barcode-lines" style="display: flex; gap: 2px; height: 36px; align-items: flex-end; justify-content: flex-end;">
              ${Array.from({ length: 32 }).map((_, i) => `
                <div style="width: ${(i % 3 === 0) ? '3px' : '1.5px'}; height: ${(i % 4 === 0) ? '100%' : '80%'}; background: #1e293b;"></div>
              `).join('')}
            </div>
            <span style="font-size: 0.7rem; font-family: monospace; letter-spacing: 2px; color: #334155;">*${trackingNo}*</span>
          </div>
        </div>

        <!-- Visual Hub-to-Hub Corridor -->
        <div style="margin-bottom: 24px;">
          <h5 style="margin: 0 0 16px; font-size: 0.92rem; font-weight: 800; color: #0f172a;">National Transit Corridor Checkpoints:</h5>
          <div style="display: flex; flex-direction: column; gap: 14px; position: relative; padding-left: 20px; border-left: 3px solid #e2e8f0; margin-left: 10px;">
            ${hubs.map((hub, idx) => `
              <div style="position: relative;">
                <!-- Dot on line -->
                <div style="position: absolute; left: -28px; top: 2px; width: 18px; height: 18px; border-radius: 50%; background: ${hub.done ? '#10b981' : '#e2e8f0'}; border: 2px solid #ffffff; box-shadow: 0 0 0 2px ${hub.done ? '#10b981' : '#cbd5e1'};"></div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 6px;">
                  <div>
                    <div style="font-weight: 800; font-size: 0.9rem; color: ${hub.done ? '#0f172a' : '#64748b'};">
                      ${hub.title} ${hub.current ? '<span style="background: #fef3c7; color: #92400e; font-size: 0.72rem; padding: 2px 6px; border-radius: 4px; font-weight: 800; margin-left: 6px;">● ACTIVE POSITION</span>' : ''}
                    </div>
                    <div style="font-size: 0.78rem; color: #64748b; margin-top: 1px;">📍 ${hub.loc}</div>
                    <p style="font-size: 0.8rem; color: #475569; margin: 4px 0 0;">${hub.desc}</p>
                  </div>
                  <span style="font-size: 0.78rem; font-weight: 700; color: #64748b;">${hub.time}</span>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Trust Features Footer -->
        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 12px 16px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <div style="font-weight: 800; font-size: 0.86rem; color: #166534;">🛡️ Open-Box Handover Guaranteed</div>
            <span style="font-size: 0.78rem; color: #15803d;">Inspect item purity & condition before sharing delivery OTP.</span>
          </div>
          <span style="font-size: 0.8rem; font-weight: 800; background: #ffffff; color: #166534; padding: 4px 10px; border-radius: 6px; border: 1px solid #bbf7d0;">
            Zero Fragile Breakage Policy
          </span>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 10px;">
          <button type="button" class="amz-btn amz-btn-secondary" onclick="window.print();" style="width: auto; padding: 8px 18px; font-size: 0.84rem;">
            🖨️ Print Waybill Slip
          </button>
          <button type="button" class="amz-btn amz-btn-primary" onclick="window.amzModal.hideModal(document.getElementById('transit-corridor-modal'));" style="width: auto; padding: 8px 22px;">
            Close Corridor View
          </button>
        </div>
      </div>
    `;

    this.showModal(modal);
  }

  closeAllModalsAndDrawers() {
    document.querySelectorAll('.modal, .amz-modal, .express-modal-overlay').forEach(m => {
      m.classList.remove('is-open');
      m.classList.remove('active');
    });
    this.closeCartDrawer();
    this.closeDepartmentDrawer();
    const overlay = document.getElementById('global-overlay');
    if (overlay) {
      overlay.classList.remove('is-open');
      overlay.classList.remove('is-active');
    }
    document.body.style.overflow = '';
  }
}

// Global Singleton Instance
window.amzModal = new ModalEngine();
