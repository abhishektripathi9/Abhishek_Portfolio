/**
 * UDAANMART - ZERO-FRICTION 30-SECOND EXPRESS CHECKOUT ENGINE (js/checkout.js)
 * PILLAR 3: Single-Screen Guest Express Checkout, Live Pincode Auto-Fill,
 * 3 Instant Payment Choices (UPI with simulated QR, COD, Cards),
 * Confetti Canvas Celebration, and Print/Download GST Tax Invoice.
 */

class CheckoutEngine {
  constructor() {
    this.currentStep = 1;
    this.deliveryType = 'village';
    this.expressProduct = null;
    this.expressQty = 1;

    this.orderData = {
      shipping: {
        fullName: 'Abhishek Tripathi',
        phone: '+91 98765 43210',
        pincode: '110001',
        city: 'New Delhi',
        district: 'Central Delhi',
        state: 'Delhi',
        street: 'Flat 402, Connaught Place, Block C',
        village: 'Connaught Central',
        tehsil: 'New Delhi Head Post Office',
        landmark: 'Near Central Metro Station Gate 3',
        country: 'IN',
        addressType: 'city'
      },
      payment: {
        method: 'upi',
        upiApp: 'Google Pay',
        upiId: 'abhishek@okaxis',
        cardNumber: '•••• •••• •••• 4242'
      }
    };

    this.init();
  }

  init() {
    this.syncWithStoreLocation();
    this.bindCheckoutModal();
    this.bindStepNavigation();
    this.bindPincodeLiveAutofill();
    this.bindPaymentSelector();
    this.bindVillageDeliveryToggles();
    this.bindExpressBuyModal();
    this.bindInvoiceModal();

    // Listen for store location changes
    window.addEventListener('udaan:location-updated', (e) => {
      this.syncWithStoreLocation(e.detail);
    });
  }

  syncWithStoreLocation(loc) {
    const curLoc = loc || (window.amzStore ? window.amzStore.getLocation() : null);
    if (!curLoc) return;

    this.orderData.shipping.pincode = curLoc.pincode || '110001';
    this.orderData.shipping.city = curLoc.city || 'New Delhi';
    this.orderData.shipping.district = curLoc.district || curLoc.city || 'Central Delhi';
    this.orderData.shipping.state = curLoc.state || 'Delhi';

    // Populate inputs if they exist in DOM
    const zipInput = document.getElementById('ship-zip');
    const districtInput = document.getElementById('ship-district');
    const stateInput = document.getElementById('ship-state');

    if (zipInput) zipInput.value = this.orderData.shipping.pincode;
    if (districtInput) districtInput.value = this.orderData.shipping.district;
    if (stateInput && this.orderData.shipping.state) {
      stateInput.value = this.orderData.shipping.state;
    }
  }

  // ==========================================================================
  // 1. LIVE INDIAN PINCODE AUTO-FILL WITH TRUST BADGE
  // ==========================================================================
  bindPincodeLiveAutofill() {
    const zipInput = document.getElementById('ship-zip');
    if (!zipInput) return;

    let debounceTimer = null;
    zipInput.addEventListener('input', () => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const pin = zipInput.value.trim();
        if (pin.length === 6 && /^\d{6}$/.test(pin)) {
          this.lookupPincode(pin);
        }
      }, 350);
    });
  }

  async lookupPincode(pin) {
    if (!window.amzStore) return;
    const info = await window.amzStore.fetchPincode(pin);
    if (!info) return;

    const districtInput = document.getElementById('ship-district');
    const stateInput = document.getElementById('ship-state');
    const cityInput = document.getElementById('ship-village');

    if (districtInput) districtInput.value = info.district || info.city;
    if (cityInput && !cityInput.value) cityInput.value = info.city;

    if (stateInput) {
      for (let i = 0; i < stateInput.options.length; i++) {
        if (stateInput.options[i].text.toLowerCase().includes(info.state.toLowerCase()) ||
            info.state.toLowerCase().includes(stateInput.options[i].text.toLowerCase())) {
          stateInput.selectedIndex = i;
          break;
        }
      }
    }

    // Show Trust Badge below Pincode
    let badgeEl = document.getElementById('pincode-trust-badge');
    if (!badgeEl) {
      badgeEl = document.createElement('div');
      badgeEl.id = 'pincode-trust-badge';
      badgeEl.className = 'pincode-trust-badge';
      const parent = document.getElementById('ship-zip')?.parentNode;
      if (parent) parent.appendChild(badgeEl);
    }

    badgeEl.innerHTML = `
      <span class="trust-icon">✓</span>
      <span>Express 24-48h Delivery Available to <strong>${info.city}, ${info.state}</strong> (via India Post Speed Post)</span>
    `;
    badgeEl.style.display = 'flex';

    if (window.amzCart) {
      window.amzCart.showToast(`📍 Pincode ${pin} Verified: Delivering to ${info.city}, ${info.state}!`);
    }
  }

  // ==========================================================================
  // 2. CHECKOUT MODAL OPEN & STEP NAVIGATION
  // ==========================================================================
  bindCheckoutModal() {
    const closeBtn = document.getElementById('checkout-modal-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('checkout-modal');
        if (modal && window.amzModal) {
          window.amzModal.hideModal(modal);
        }
      });
    }

    const placeOrderBtn = document.getElementById('btn-place-order');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        this.processOrderPlacement();
      });
    }

    // Direct Instant UPI Simulation Button
    const simulateUpiBtn = document.getElementById('btn-simulate-qr-scan');
    if (simulateUpiBtn) {
      simulateUpiBtn.addEventListener('click', () => {
        this.simulateInstantUPI(simulateUpiBtn);
      });
    }
  }

  openCheckout() {
    if (!window.amzCart || window.amzCart.items.length === 0) {
      if (window.amzCart) window.amzCart.showToast("Your cart is empty! Add an item before checking out.", "info");
      return;
    }

    const modal = document.getElementById('checkout-modal');
    if (!modal) return;

    this.syncWithStoreLocation();
    this.renderStep(1);

    if (window.amzModal) {
      window.amzModal.showModal(modal);
    }
  }

  bindStepNavigation() {
    // Step 1 to Step 2
    const toStep2Btn = document.getElementById('btn-to-payment');
    if (toStep2Btn) {
      toStep2Btn.addEventListener('click', (e) => {
        e.preventDefault();
        if (this.validateAddressForm()) {
          this.renderStep(2);
        }
      });
    }

    // Step 2 to Step 3
    const toStep3Btn = document.getElementById('btn-to-review');
    if (toStep3Btn) {
      toStep3Btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.renderStep(3);
      });
    }

    // Back buttons
    document.querySelectorAll('[data-checkout-back]').forEach(btn => {
      btn.addEventListener('click', () => {
        const prevStep = parseInt(btn.dataset.checkoutBack, 10);
        this.renderStep(prevStep);
      });
    });
  }

  renderStep(stepNumber) {
    this.currentStep = stepNumber;

    // Update navigation circles
    document.querySelectorAll('.checkout-step-tab').forEach(tab => {
      const step = parseInt(tab.dataset.step, 10);
      tab.classList.toggle('is-active', step === stepNumber);
      tab.classList.toggle('is-completed', step < stepNumber);
    });

    // Update panels
    document.querySelectorAll('.checkout-step-pane').forEach(pane => {
      const step = parseInt(pane.dataset.step, 10);
      pane.classList.toggle('is-active', step === stepNumber);
    });

    if (stepNumber === 3) {
      this.renderOrderReview();
    }
  }

  validateAddressForm() {
    const fullName = document.getElementById('ship-name')?.value.trim();
    const phone = document.getElementById('ship-phone')?.value.trim();
    const street = document.getElementById('ship-street')?.value.trim();
    const zipCode = document.getElementById('ship-zip')?.value.trim();
    const district = document.getElementById('ship-district')?.value.trim();
    const state = document.getElementById('ship-state')?.value;
    const country = document.getElementById('ship-country')?.value || 'IN';

    if (!fullName || !phone || !street || !zipCode) {
      if (window.amzCart) {
        window.amzCart.showToast('⚠️ Please fill in your Full Name, Mobile Number, Street Address, and PIN Code.', 'warning');
      }
      return false;
    }

    this.orderData.shipping = {
      fullName,
      phone,
      street,
      zipCode,
      pincode: zipCode,
      district,
      city: district || 'New Delhi',
      state,
      country,
      addressType: this.deliveryType,
      village: document.getElementById('ship-village')?.value.trim() || '',
      tehsil: document.getElementById('ship-tehsil')?.value.trim() || '',
      landmark: document.getElementById('ship-landmark')?.value.trim() || '',
      carrierPartner: document.querySelector('input[name="ship-carrier"]:checked')?.value === 'indiapost'
        ? 'India Post Speed Post'
        : 'UdaanMart Rural Express'
    };

    return true;
  }

  // ==========================================================================
  // 3. PAYMENT METHOD SELECTOR & UPI INSTANT SUITE
  // ==========================================================================
  bindPaymentSelector() {
    // Country Payment Tabs
    document.querySelectorAll('.country-pay-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const pane = tab.dataset.countryPane;
        this.switchCountryPaymentPane(pane);
      });
    });

    // Payment Radio button changes
    document.querySelectorAll('input[name="checkout-payment-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const val = e.target.value;
        this.orderData.payment.method = val;
        this.updatePaymentPanels(val);
      });
    });

    // UPI Mode buttons
    const appBtn = document.getElementById('upi-mode-apps');
    const vpaBtn = document.getElementById('upi-mode-vpa');
    const qrBtn = document.getElementById('upi-mode-qr');

    const appView = document.getElementById('upi-view-apps');
    const vpaView = document.getElementById('upi-view-vpa');
    const qrView = document.getElementById('upi-view-qr');

    if (appBtn && vpaBtn && qrBtn) {
      appBtn.addEventListener('click', () => {
        appBtn.classList.add('is-active');
        vpaBtn.classList.remove('is-active');
        qrBtn.classList.remove('is-active');
        if (appView) appView.style.display = 'block';
        if (vpaView) vpaView.style.display = 'none';
        if (qrView) qrView.style.display = 'none';
      });

      vpaBtn.addEventListener('click', () => {
        vpaBtn.classList.add('is-active');
        appBtn.classList.remove('is-active');
        qrBtn.classList.remove('is-active');
        if (appView) appView.style.display = 'none';
        if (vpaView) vpaView.style.display = 'block';
        if (qrView) qrView.style.display = 'none';
      });

      qrBtn.addEventListener('click', () => {
        qrBtn.classList.add('is-active');
        appBtn.classList.remove('is-active');
        vpaBtn.classList.remove('is-active');
        if (appView) appView.style.display = 'none';
        if (vpaView) vpaView.style.display = 'none';
        if (qrView) qrView.style.display = 'block';
      });
    }

    // UPI App chip selection
    document.querySelectorAll('.upi-app-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.upi-app-chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        this.orderData.payment.upiApp = chip.dataset.upiApp || 'UPI App';
      });
    });
  }

  switchCountryPaymentPane(paneName) {
    document.querySelectorAll('.country-pay-tab').forEach(t => {
      t.classList.toggle('is-active', t.dataset.countryPane === paneName);
    });

    document.querySelectorAll('.country-pay-pane').forEach(p => {
      p.classList.toggle('is-active', p.dataset.countryPaneContent === paneName);
    });
  }

  updatePaymentPanels(method) {
    const upiBox = document.getElementById('checkout-upi-box');
    const cardBox = document.getElementById('checkout-card-fields');

    if (upiBox) {
      upiBox.style.display = (method === 'upi') ? 'block' : 'none';
    }
    if (cardBox) {
      cardBox.style.display = (method === 'card' || method === 'rupay_card') ? 'block' : 'none';
    }
  }

  simulateInstantUPI(targetBtn = null) {
    const btn = targetBtn || document.getElementById('btn-simulate-qr-scan');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="btn-spinner"></span> Authenticating UPI with Bank...`;
    }

    setTimeout(() => {
      if (btn) {
        btn.innerHTML = `✓ UPI Authorized Successfully!`;
        btn.classList.add('is-success');
      }
      if (window.amzCart) {
        window.amzCart.showToast("⚡ UPI Payment Authorized! Proceeding to Order Placement.", "success");
      }
      setTimeout(() => {
        this.renderStep(3);
      }, 500);
    }, 900);
  }

  bindVillageDeliveryToggles() {
    const villageBtn = document.getElementById('delivery-type-village');
    const cityBtn = document.getElementById('delivery-type-city');
    const villageBanner = document.getElementById('village-info-banner');
    const groupVillage = document.getElementById('group-village-name');
    const groupTehsil = document.getElementById('group-tehsil');
    const groupLandmark = document.getElementById('group-landmark');
    const labelStreet = document.getElementById('label-street');
    const labelDistrict = document.getElementById('label-district');

    if (villageBtn && cityBtn) {
      villageBtn.addEventListener('click', () => {
        this.deliveryType = 'village';
        villageBtn.classList.add('is-active');
        cityBtn.classList.remove('is-active');
        if (villageBanner) villageBanner.style.display = 'flex';
        if (groupVillage) groupVillage.style.display = 'block';
        if (groupTehsil) groupTehsil.style.display = 'block';
        if (groupLandmark) groupLandmark.style.display = 'block';
        if (labelStreet) labelStreet.textContent = 'House / Farm / Mohalla / Lane';
        if (labelDistrict) labelDistrict.textContent = 'District (जिला)';
      });

      cityBtn.addEventListener('click', () => {
        this.deliveryType = 'city';
        cityBtn.classList.add('is-active');
        villageBtn.classList.remove('is-active');
        if (villageBanner) villageBanner.style.display = 'none';
        if (groupVillage) groupVillage.style.display = 'none';
        if (groupTehsil) groupTehsil.style.display = 'none';
        if (groupLandmark) groupLandmark.style.display = 'none';
        if (labelStreet) labelStreet.textContent = 'Street Address / Building / Apt';
        if (labelDistrict) labelDistrict.textContent = 'City / Town';
      });
    }
  }

  // ==========================================================================
  // 4. ORDER REVIEW & SUMMARY RENDERING
  // ==========================================================================
  renderOrderReview() {
    const summary = window.amzCart ? window.amzCart.getSummary() : { subtotal: 0, shipping: 0, orderTotal: 0 };
    const ship = this.orderData.shipping;
    const isVillage = ship.addressType === 'village';

    // Populate Review Step Shipping Details
    const addrReview = document.getElementById('checkout-review-shipping-details');
    if (addrReview) {
      addrReview.innerHTML = `
        <strong>${window.amzStore.escapeHTML(ship.fullName)}</strong> (${window.amzStore.escapeHTML(ship.phone)})<br>
        ${window.amzStore.escapeHTML(ship.street)}<br>
        ${isVillage && ship.village ? `Village: ${window.amzStore.escapeHTML(ship.village)}, ` : ''}
        ${isVillage && ship.tehsil ? `Tehsil: ${window.amzStore.escapeHTML(ship.tehsil)}<br>` : ''}
        <strong>${window.amzStore.escapeHTML(ship.city || ship.district)}, ${window.amzStore.escapeHTML(ship.state)} - PIN: ${window.amzStore.escapeHTML(ship.zipCode)}</strong><br>
        <span style="font-size: 0.8rem; color: var(--color-success); font-weight: 600;">
          🚚 Routing via ${ship.carrierPartner || 'India Post Speed Post'} (Doorstep Handover)
        </span>
      `;
    }

    // Populate Review Step Payment Details
    const payReview = document.getElementById('checkout-review-payment-details');
    if (payReview) {
      let payDesc = '⚡ UPI Instant Pay (Google Pay)';
      if (this.orderData.payment.method === 'cod') {
        payDesc = '💵 Cash on Delivery (Pay cash at your doorstep)';
      } else if (this.orderData.payment.method === 'card' || this.orderData.payment.method === 'rupay_card') {
        payDesc = '💳 Credit / Debit Card (Visa / RuPay •••• 4242)';
      }
      payReview.innerHTML = `<strong>${payDesc}</strong><br><span style="font-size: 0.8rem; color: var(--text-muted);">Encrypted & Verified</span>`;
    }

    // Populate Review Items List
    const itemsReview = document.getElementById('checkout-review-items');
    if (itemsReview && window.amzCart) {
      itemsReview.innerHTML = window.amzCart.items.map(item => `
        <div class="review-item-row">
          <img src="${item.image}" alt="${window.amzStore.escapeHTML(item.title)}" class="review-item-thumb" />
          <div class="review-item-info">
            <span class="review-item-title">${window.amzStore.escapeHTML(item.shortTitle || item.title)}</span>
            <span class="review-item-meta">Qty: ${item.quantity} • ${window.amzApp ? window.amzApp.formatPrice(item.price) : '$' + item.price}</span>
          </div>
        </div>
      `).join('');
    }

    // Populate Pricing Breakdown
    const subtotalEl = document.getElementById('checkout-summary-subtotal');
    const shippingEl = document.getElementById('checkout-summary-shipping');
    const totalEl = document.getElementById('checkout-summary-total');

    if (subtotalEl) subtotalEl.textContent = window.amzApp ? window.amzApp.formatPrice(summary.subtotal) : `$${summary.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = summary.shipping === 0 ? 'FREE' : (window.amzApp ? window.amzApp.formatPrice(summary.shipping) : `$${summary.shipping.toFixed(2)}`);

    // Render coupon line in review if applied
    let couponRow = document.getElementById('checkout-summary-coupon-row');
    if (summary.couponDiscount > 0) {
      if (!couponRow) {
        couponRow = document.createElement('div');
        couponRow.id = 'checkout-summary-coupon-row';
        couponRow.className = 'summary-row discount-row';
        couponRow.style.color = '#15803d';
        couponRow.style.fontWeight = '600';
        totalEl?.parentNode?.parentNode?.insertBefore(couponRow, totalEl.parentNode);
      }
      couponRow.innerHTML = `
        <span>Coupon Discount (${summary.appliedCoupon?.code || 'APPLIED'}):</span>
        <span>-${window.amzApp ? window.amzApp.formatPrice(summary.couponDiscount) : '₹' + summary.couponDiscount}</span>
      `;
      couponRow.style.display = 'flex';
    } else if (couponRow) {
      couponRow.style.display = 'none';
    }

    if (totalEl) totalEl.textContent = window.amzApp ? window.amzApp.formatPrice(summary.orderTotal) : `$${summary.orderTotal.toFixed(2)}`;
  }

  // ==========================================================================
  // 5. ORDER PLACEMENT & CONFLICT-FREE SYNC
  // ==========================================================================
  processOrderPlacement() {
    const placeBtn = document.getElementById('btn-place-order');
    if (placeBtn) {
      placeBtn.disabled = true;
      placeBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Securing Order & Routing India Post Dispatch...</span>
      `;
    }

    setTimeout(() => {
      const summary = window.amzCart ? window.amzCart.getSummary() : { subtotal: 0, orderTotal: 0 };
      const ship = this.orderData.shipping;

      let paymentTitle = 'UPI Instant Pay';
      if (this.orderData.payment.method === 'cod') paymentTitle = 'Cash on Delivery (COD)';
      else if (this.orderData.payment.method === 'card') paymentTitle = 'Credit / Debit Card';

      // Save order into Unified Store
      const newOrder = window.amzStore.addOrder({
        items: [...(window.amzCart ? window.amzCart.items : [])],
        subtotal: summary.subtotal,
        discountAmount: summary.couponDiscount || 0,
        couponCode: summary.appliedCoupon ? summary.appliedCoupon.code : null,
        shippingFee: summary.shipping || 0,
        totalAmount: summary.orderTotal,
        paymentMethod: paymentTitle,
        paymentStatus: this.orderData.payment.method === 'cod' ? 'Pending (Cash at Doorstep)' : 'Paid (Verified)',
        deliveryLocation: {
          name: ship.fullName,
          phone: ship.phone,
          pincode: ship.zipCode,
          city: ship.city || ship.district,
          district: ship.district,
          state: ship.state,
          address: `${ship.street}, ${ship.village ? ship.village + ', ' : ''}${ship.landmark ? 'Near: ' + ship.landmark : ''}`
        }
      });

      // Deduct stock for all ordered products
      if (window.amzStore && typeof window.amzStore.deductStock === 'function') {
        cartItems.forEach(item => {
          window.amzStore.deductStock(item.id, item.quantity);
        });
      }

      // Clear Cart
      if (window.amzCart) {
        window.amzCart.clearCart();
      }

      // Reset Button State
      if (placeBtn) {
        placeBtn.disabled = false;
        placeBtn.innerHTML = `Place Your Order and Pay`;
      }

      // Close Checkout Modal
      const checkoutModal = document.getElementById('checkout-modal');
      if (checkoutModal && window.amzModal) {
        window.amzModal.hideModal(checkoutModal);
      }

      // Show Order Success Modal
      this.showOrderSuccess(newOrder);

    }, 800);
  }

  showOrderSuccess(order) {
    const successModal = document.getElementById('order-success-modal');
    if (!successModal || !window.amzModal) return;

    const ship = order.deliveryLocation || {};

    const orderIdEl = successModal.querySelector('.success-order-id');
    const trackingEl = successModal.querySelector('.success-tracking-no');
    const deliveryDateEl = successModal.querySelector('.success-delivery-date');
    const nameEl = successModal.querySelector('.success-shipping-name');
    const addrEl = successModal.querySelector('.success-shipping-address');
    const payEl = successModal.querySelector('.success-payment-method');
    const totalEl = successModal.querySelector('.success-order-total');

    if (orderIdEl) orderIdEl.textContent = order.orderId;
    if (trackingEl) trackingEl.textContent = order.trackingNumber;
    if (deliveryDateEl) deliveryDateEl.textContent = `Express 24-48h Delivery to ${ship.city || 'Your Doorstep'}`;
    if (nameEl) nameEl.textContent = ship.name;
    if (addrEl) addrEl.textContent = `${ship.address}, ${ship.city} - ${ship.pincode}`;
    if (payEl) payEl.textContent = order.paymentMethod;
    if (totalEl) totalEl.textContent = window.amzApp ? window.amzApp.formatPrice(order.totalAmount || order.total) : `$${order.totalAmount}`;

    // Bind GST Invoice Button
    const invoiceBtn = document.getElementById('btn-download-receipt');
    if (invoiceBtn) {
      invoiceBtn.textContent = '📄 Print / Download GST Invoice';
      invoiceBtn.onclick = () => {
        this.openGSTInvoice(order);
      };
    }

    // Trigger Delight Audio Chime & Confetti Celebration
    if (window.amzApp && window.amzApp.playSuccessChime) {
      window.amzApp.playSuccessChime();
    }
    if (window.amzApp && window.amzApp.launchConfetti) {
      window.amzApp.launchConfetti();
    } else {
      this.launchConfetti();
    }

    window.amzModal.showModal(successModal);
  }

  // ==========================================================================
  // 6. 1-CLICK EXPRESS BUY MODAL (BUYER-FRIENDLY QUICK BUY)
  // ==========================================================================
  bindExpressBuyModal() {
    const modal = document.getElementById('express-buy-modal');
    const closeBtn = document.getElementById('express-buy-close');
    const confirmBtn = document.getElementById('btn-express-confirm-order');
    const qtySelect = document.getElementById('express-qty-select');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeExpressBuy());
    }

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => this.confirmExpressOrder());
    }

    if (qtySelect) {
      qtySelect.addEventListener('change', (e) => {
        this.expressQty = parseInt(e.target.value, 10) || 1;
        this.updateExpressTotals();
      });
    }
  }

  openExpressBuy(productOrId, quantity = 1) {
    if (!productOrId) return;
    let product = productOrId;
    if (typeof productOrId === 'string' || typeof productOrId === 'number') {
      product = window.amzStore ? window.amzStore.getProductById(productOrId) : null;
      if (!product && window.PRODUCTS_DATA) {
        product = window.PRODUCTS_DATA.find(p => String(p.id) === String(productOrId));
      }
    }
    if (!product) return;

    const numPrice = typeof product.price === 'number' ? product.price : (parseFloat(product.price) || 999);
    const numMrp = typeof product.mrp === 'number' ? product.mrp : (parseFloat(product.mrp) || Math.round(numPrice * 1.35));
    const prodImg = product.image || (Array.isArray(product.images) && product.images[0]) || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80';
    const prodTitle = product.title || product.shortTitle || 'Artisan Craft Item';
    const prodShortTitle = product.shortTitle || prodTitle;
    const seller = product.sellerName || product.artisan || product.origin || 'UdaanMart Karigar Guild';

    this.expressProduct = {
      ...product,
      id: product.id,
      title: prodTitle,
      shortTitle: prodShortTitle,
      price: numPrice,
      mrp: numMrp,
      image: prodImg,
      sellerName: seller,
      delivery: product.delivery || `FREE Express Delivery to ${this.orderData.shipping.city || 'your address'}`
    };
    this.expressQty = parseInt(quantity, 10) || 1;

    const modal = document.getElementById('express-buy-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    const imgEl = document.getElementById('express-prod-img');
    const titleEl = document.getElementById('express-prod-title');
    const priceEl = document.getElementById('express-prod-price');
    const deliveryEl = document.getElementById('express-delivery-text');
    const qtySelect = document.getElementById('express-qty-select');

    if (imgEl) imgEl.src = this.expressProduct.image;
    if (titleEl) titleEl.textContent = this.expressProduct.shortTitle;
    if (priceEl) priceEl.textContent = window.amzApp ? window.amzApp.formatPrice(this.expressProduct.price) : `₹${this.expressProduct.price}`;
    if (deliveryEl) deliveryEl.textContent = this.expressProduct.delivery;
    if (qtySelect) qtySelect.value = String(this.expressQty);

    this.updateExpressTotals();

    modal.classList.add('is-open');
    modal.classList.add('active');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  closeExpressBuy() {
    const modal = document.getElementById('express-buy-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    modal.classList.remove('is-open');
    modal.classList.remove('active');
    if (overlay && !document.querySelector('.amz-modal.is-open:not(#express-buy-modal), .modal.is-open, .cart-drawer.is-open, .dept-drawer.is-open')) {
      overlay.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  updateExpressTotals() {
    if (!this.expressProduct) return;
    const price = typeof this.expressProduct.price === 'number' ? this.expressProduct.price : (parseFloat(this.expressProduct.price) || 0);
    const total = price * (this.expressQty || 1);
    const formatted = window.amzApp ? window.amzApp.formatPrice(total) : `₹${total}`;

    const totalEl = document.getElementById('express-total-amount');
    if (totalEl) totalEl.textContent = formatted;

    const submitBtn = document.getElementById('btn-express-confirm-order');
    if (submitBtn) {
      submitBtn.innerHTML = `<span class="bolt-icon">⚡</span><span>1-Click Buy Now (${formatted})</span>`;
    }
  }

  confirmExpressOrder() {
    if (!this.expressProduct) return;

    const btn = document.getElementById('btn-express-confirm-order');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-inline"></span> Placing 1-Click Order...`;
    }

    setTimeout(() => {
      const payVal = document.querySelector('input[name="express-pay-opt"]:checked')?.value || 'upi';
      let payName = 'UPI Instant Pay';
      if (payVal === 'cod') payName = 'Cash on Delivery (COD)';
      else if (payVal === 'card') payName = 'Credit / Debit Card';

      const total = this.expressProduct.price * (this.expressQty || 1);
      const ship = this.orderData.shipping;

      const newOrder = window.amzStore.addOrder({
        items: [
          {
            id: this.expressProduct.id,
            title: this.expressProduct.title,
            shortTitle: this.expressProduct.shortTitle || this.expressProduct.title,
            price: this.expressProduct.price,
            quantity: this.expressQty || 1,
            image: this.expressProduct.images ? this.expressProduct.images[0] : ''
          }
        ],
        subtotal: total,
        shippingFee: 0,
        totalAmount: total,
        paymentMethod: payName,
        paymentStatus: payVal === 'cod' ? 'Pending (Cash at Doorstep)' : 'Paid (Instant)',
        deliveryLocation: {
          name: ship.fullName,
          phone: ship.phone,
          pincode: ship.pincode || ship.zipCode,
          city: ship.city,
          district: ship.district,
          state: ship.state,
          address: ship.street
        }
      });

      // Deduct stock for express ordered product
      if (window.amzStore && typeof window.amzStore.deductStock === 'function') {
        window.amzStore.deductStock(this.expressProduct.id, this.expressQty || 1);
      }

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="bolt-icon">⚡</span><span>1-Click Buy Now</span>`;
      }

      this.closeExpressBuy();
      this.showOrderSuccess(newOrder);

    }, 700);
  }

  // ==========================================================================
  // 7. PRINTABLE GST TAX INVOICE
  // ==========================================================================
  bindInvoiceModal() {
    const printBtn = document.getElementById('btn-print-gst-invoice');
    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }

    const closeBtn = document.getElementById('gst-invoice-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('gst-invoice-modal');
        const overlay = document.getElementById('global-overlay');
        if (modal) {
          modal.classList.remove('is-open');
          modal.classList.remove('active');
        }
        if (overlay && !document.querySelector('.amz-modal.is-open:not(#gst-invoice-modal), .modal.is-open, .cart-drawer.is-open, .dept-drawer.is-open')) {
          overlay.classList.remove('is-open');
          overlay.classList.remove('is-active');
        }
        document.body.style.overflow = '';
      });
    }
  }

  openGSTInvoice(order) {
    const modal = document.getElementById('gst-invoice-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) {
      // Fallback: trigger print simulation receipt
      window.print();
      return;
    }

    const ship = order.deliveryLocation || {};
    const buyerName = window.amzStore.escapeHTML(ship.name || 'Valued Buyer');
    const buyerAddress = window.amzStore.escapeHTML(ship.address || '');
    const buyerCity = window.amzStore.escapeHTML(ship.city || '');
    const buyerState = window.amzStore.escapeHTML(ship.state || '');
    const buyerPin = window.amzStore.escapeHTML(ship.pincode || '');

    const invOrderNo = document.getElementById('inv-order-no');
    const invDate = document.getElementById('inv-date');
    const invBuyerDetails = document.getElementById('inv-buyer-details');
    const invItemsTbody = document.getElementById('inv-items-tbody');
    const invSubtotal = document.getElementById('inv-subtotal');
    const invTax = document.getElementById('inv-tax');
    const invGrandTotal = document.getElementById('inv-grand-total');

    if (invOrderNo) invOrderNo.textContent = order.orderId;
    if (invDate) invDate.textContent = order.date;

    if (invBuyerDetails) {
      invBuyerDetails.innerHTML = `
        <strong>${buyerName}</strong><br>
        ${buyerAddress}<br>
        <strong>${buyerCity}, ${buyerState} - PIN: ${buyerPin}</strong><br>
        Phone: ${window.amzStore.escapeHTML(ship.phone || '')}
      `;
    }

    if (invItemsTbody && order.items) {
      invItemsTbody.innerHTML = order.items.map((it, idx) => {
        const lineTotal = it.price * (it.quantity || 1);
        return `
          <tr>
            <td>${idx + 1}</td>
            <td><strong>${window.amzStore.escapeHTML(it.shortTitle || it.title)}</strong><br><small>HSN: 6204 • GI-Tag Handloom Assured</small></td>
            <td>${it.quantity || 1}</td>
            <td>${window.amzApp ? window.amzApp.formatPrice(it.price) : '₹' + it.price}</td>
            <td>5% (₹0 Karigar Payout Concession)</td>
            <td style="text-align: right;"><strong>${window.amzApp ? window.amzApp.formatPrice(lineTotal) : '₹' + lineTotal}</strong></td>
          </tr>
        `;
      }).join('');
    }

    const totalVal = order.totalAmount || order.total || 0;
    const formattedTotal = window.amzApp ? window.amzApp.formatPrice(totalVal) : `₹${totalVal}`;

    if (invSubtotal) invSubtotal.textContent = formattedTotal;
    if (invTax) invTax.textContent = '₹0.00 (Inclusive of all taxes)';
    if (invGrandTotal) invGrandTotal.textContent = formattedTotal;

    // Cancellation / Credit Note Banner
    const isCancelled = order.status === 'Cancelled';
    const existingBanner = document.getElementById('inv-cancellation-banner');
    if (existingBanner) existingBanner.remove();

    if (isCancelled) {
      const banner = document.createElement('div');
      banner.id = 'inv-cancellation-banner';
      banner.style.cssText = 'background: #fee2e2; border: 2px dashed #dc2626; border-radius: 8px; padding: 12px 16px; margin: 12px 0 16px; color: #991b1b; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;';
      banner.innerHTML = `
        <div>
          <div style="font-size: 1.05rem; font-weight: 800; color: #dc2626; display: flex; align-items: center; gap: 6px;">
            <span>🚫</span> CREDIT NOTE / ORDER CANCELLED
          </div>
          <div style="font-size: 0.82rem; margin-top: 3px; color: #7f1d1d;">
            Reason: <strong>${window.amzStore.escapeHTML(order.cancelReason || 'Cancelled by buyer')}</strong> • 100% Refund credited
          </div>
        </div>
        <div style="text-align: right; background: white; padding: 6px 12px; border-radius: 6px; border: 1px solid #f87171;">
          <div style="font-size: 0.7rem; color: #64748b; font-weight: 700;">REFUND REF #</div>
          <div style="font-size: 0.95rem; font-weight: 800; color: #b91c1c; font-family: monospace;">${order.refundRef || 'REF-INSTANT'}</div>
        </div>
      `;
      const billingRow = modal.querySelector('.inv-billing-row');
      if (billingRow && billingRow.parentNode) {
        billingRow.parentNode.insertBefore(banner, billingRow);
      }
    }

    modal.classList.add('is-open');
    modal.classList.add('active');
    if (overlay) {
      overlay.classList.add('is-open');
      overlay.classList.add('is-active');
    }
  }

  // ==========================================================================
  // 8. CELEBRATORY CONFETTI ENGINE
  // ==========================================================================
  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f59e0b', '#10b981', '#3b82f6', '#ec4899', '#8b5cf6'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 5 + 3,
        dx: (Math.random() - 0.5) * 16,
        dy: (Math.random() - 0.7) * 16,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 80
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
          p.dy += 0.35; // gravity
          p.life--;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
        }
      });

      if (alive) {
        requestAnimationFrame(animate);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    requestAnimationFrame(animate);
  }
}

// Global Singleton Instance
window.amzCheckout = new CheckoutEngine();
