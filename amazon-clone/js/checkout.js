/**
 * AMAZON CLONE - SIMULATED CHECKOUT & ORDER DISPATCH ENGINE
 * High-fidelity 3-step checkout simulation with client-side form validation,
 * dynamic confetti particle system, and persistent order tracking history.
 */

class CheckoutEngine {
  constructor() {
    this.ORDERS_STORAGE_KEY = 'amz_clone_orders_v2';
    this.currentStep = 1;
    this.orders = this.loadOrders();
    this.orderData = {
      shipping: {
        fullName: 'Alex Vance',
        address: '742 Evergreen Terrace',
        city: 'Springfield',
        state: 'OR',
        zipCode: '97477',
        phone: '+1 (555) 019-2834'
      },
      payment: {
        method: 'card',
        cardName: 'Alex Vance',
        cardNumber: '•••• •••• •••• 4242',
        expiry: '09/28'
      }
    };

    this.deliveryType = 'village';
    this.init();
  }

  init() {
    this.bindCheckoutModal();
    this.bindStepNavigation();
    this.bindPaymentSelector();
    this.bindVillageDeliveryToggles();
    this.bindExpressBuyModal();
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
    const countrySelect = document.getElementById('ship-country');

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

    if (countrySelect) {
      countrySelect.addEventListener('change', (e) => {
        const country = e.target.value;
        if (country === 'IN' && window.amzApp) {
          window.amzApp.setCurrency('INR', false);
        }
      });
    }
  }

  loadOrders() {
    try {
      const saved = localStorage.getItem(this.ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn("Could not load past orders", e);
    }

    // Seed default sample order for realistic portfolio demonstration
    return [
      {
        orderId: '113-9482103-7841290',
        trackingNumber: 'INP938201948IN',
        date: new Date(Date.now() - 86400000 * 2).toISOString(),
        status: 'Delivered to Village Doorstep',
        estimatedDelivery: 'Delivered via India Post Speed Post',
        carrierPartner: 'India Post Speed Post (Last-Mile Village Doorstep)',
        total: 28990.00,
        shipping: {
          fullName: 'Ramesh Kumar Sharma',
          addressType: 'village',
          villageName: 'Rampur Kalan',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          zipCode: '221001',
          landmark: 'Opposite Gram Panchayat Bhavan & Primary School'
        },
        items: [
          {
            id: 'prod-1',
            title: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
            price: 348.00,
            quantity: 1,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80'
          }
        ]
      }
    ];
  }

  saveOrders() {
    try {
      localStorage.setItem(this.ORDERS_STORAGE_KEY, JSON.stringify(this.orders));
    } catch (e) {
      console.error("Failed to save orders", e);
    }
  }

  getOrders() {
    return this.orders;
  }

  openCheckout() {
    if (!window.amzCart || window.amzCart.items.length === 0) {
      if (window.amzCart) window.amzCart.showToast("Your cart is empty! Add an item before checking out.", "info");
      return;
    }

    this.currentStep = 1;
    this.renderStep(1);

    // If current currency is INR or delivery city contains India, auto-select India & village delivery
    const isIndia = window.amzApp?.currentCurrency === 'INR' || 
                    (window.amzModal?.currentLocation && window.amzModal.currentLocation.toLowerCase().includes('mumbai')) ||
                    (window.amzModal?.currentLocation && window.amzModal.currentLocation.toLowerCase().includes('india'));
    
    const countrySelect = document.getElementById('ship-country');
    if (countrySelect && isIndia) {
      countrySelect.value = 'IN';
    }

    const modal = document.getElementById('checkout-modal');
    if (modal && window.amzModal) {
      window.amzModal.showModal(modal);
    }
  }

  bindCheckoutModal() {
    const closeBtn = document.getElementById('checkout-modal-close-btn');
    if (closeBtn && window.amzModal) {
      closeBtn.addEventListener('click', () => {
        const modal = document.getElementById('checkout-modal');
        if (modal) window.amzModal.hideModal(modal);
      });
    }

    // Bind Place Order button
    const placeOrderBtn = document.getElementById('btn-place-order');
    if (placeOrderBtn) {
      placeOrderBtn.addEventListener('click', () => {
        this.processOrderPlacement();
      });
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

  bindPaymentSelector() {
    // 1. Country Payment Tabs
    document.querySelectorAll('.country-pay-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const pane = tab.dataset.countryPane;
        this.switchCountryPaymentPane(pane);
      });
    });

    // 2. Radio button change listener across all payment options
    document.querySelectorAll('input[name="checkout-payment-method"]').forEach(radio => {
      radio.addEventListener('change', (e) => {
        const val = e.target.value;
        this.orderData.payment.method = val;

        // Card fields visibility (card / rupay_card / jcb)
        const cardBox = document.getElementById('checkout-card-fields');
        if (cardBox) {
          cardBox.style.display = ['card', 'rupay_card', 'jcb'].includes(val) ? 'block' : 'none';
        }

        // NetBanking box visibility
        const nbBox = document.getElementById('checkout-netbanking-box');
        if (nbBox) {
          nbBox.style.display = val === 'netbanking' ? 'block' : 'none';
        }

        // UPI Box visibility
        const upiBox = document.getElementById('checkout-upi-box');
        if (upiBox) {
          upiBox.style.display = val === 'upi' ? 'flex' : 'none';
        }

        // Giftcard Box visibility
        const gcBox = document.getElementById('checkout-giftcard-box');
        if (gcBox) {
          gcBox.style.display = val === 'giftcard' ? 'block' : 'none';
        }
      });
    });

    // 3. UPI Mode Toggle Buttons (Apps vs VPA vs QR)
    const btnUpiApps = document.getElementById('upi-mode-apps');
    const btnUpiVpa = document.getElementById('upi-mode-vpa');
    const btnUpiQr = document.getElementById('upi-mode-qr');
    const viewUpiApps = document.getElementById('upi-view-apps');
    const viewUpiVpa = document.getElementById('upi-view-vpa');
    const viewUpiQr = document.getElementById('upi-view-qr');

    if (btnUpiApps && btnUpiVpa && btnUpiQr) {
      btnUpiApps.addEventListener('click', () => {
        btnUpiApps.classList.add('is-active');
        btnUpiVpa.classList.remove('is-active');
        btnUpiQr.classList.remove('is-active');
        if (viewUpiApps) viewUpiApps.style.display = 'block';
        if (viewUpiVpa) viewUpiVpa.style.display = 'none';
        if (viewUpiQr) viewUpiQr.style.display = 'none';
        this.orderData.payment.upiMode = 'app';
      });

      btnUpiVpa.addEventListener('click', () => {
        btnUpiVpa.classList.add('is-active');
        btnUpiApps.classList.remove('is-active');
        btnUpiQr.classList.remove('is-active');
        if (viewUpiVpa) viewUpiVpa.style.display = 'block';
        if (viewUpiApps) viewUpiApps.style.display = 'none';
        if (viewUpiQr) viewUpiQr.style.display = 'none';
        this.orderData.payment.upiMode = 'vpa';
      });

      btnUpiQr.addEventListener('click', () => {
        btnUpiQr.classList.add('is-active');
        btnUpiApps.classList.remove('is-active');
        btnUpiVpa.classList.remove('is-active');
        if (viewUpiQr) viewUpiQr.style.display = 'block';
        if (viewUpiApps) viewUpiApps.style.display = 'none';
        if (viewUpiVpa) viewUpiVpa.style.display = 'none';
        this.orderData.payment.upiMode = 'qr';
        this.startUpiQrTimer();
      });
    }

    // 4. UPI App Chips Selection
    document.querySelectorAll('.upi-app-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.upi-app-chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        const appName = chip.dataset.upiApp;
        this.orderData.payment.upiApp = appName;
        const statusEl = document.getElementById('upi-app-status');
        if (statusEl) {
          statusEl.textContent = `✓ Selected: ${appName} (Seamless payment intent will launch upon clicking Place Order)`;
        }
      });
    });

    // 5. UPI ID / VPA Verify Button
    const verifyBtn = document.getElementById('btn-verify-upi');
    const vpaInput = document.getElementById('upi-vpa-input');
    const verifyBadge = document.getElementById('upi-verify-badge');

    if (verifyBtn && vpaInput && verifyBadge) {
      verifyBtn.addEventListener('click', () => {
        const vpa = vpaInput.value.trim();
        if (!vpa || !vpa.includes('@')) {
          if (window.amzCart) window.amzCart.showToast("Please enter a valid UPI ID (e.g. yourname@oksbi / mobile@ybl)", "info");
          return;
        }

        verifyBtn.textContent = 'Verifying...';
        verifyBtn.disabled = true;

        setTimeout(() => {
          verifyBtn.textContent = 'Verified ✓';
          verifyBtn.disabled = false;
          const customerName = this.orderData.shipping?.fullName || 'Ramesh Kumar Sharma';
          verifyBadge.textContent = `✓ Verified: ${customerName} (NPCI / Banking Partner Verified)`;
          verifyBadge.style.display = 'inline-flex';
          this.orderData.payment.upiId = vpa;
          if (window.amzCart) window.amzCart.showToast(`UPI ID ${vpa} Verified!`, "success");
        }, 350);
      });
    }

    // 6. QR Code Simulate Scan
    const qrSimulateBtn = document.getElementById('btn-simulate-qr-scan');
    const qrSuccessBadge = document.getElementById('qr-scan-success-badge');
    if (qrSimulateBtn && qrSuccessBadge) {
      qrSimulateBtn.addEventListener('click', () => {
        qrSimulateBtn.textContent = 'Authenticating...';
        setTimeout(() => {
          qrSimulateBtn.textContent = 'Authorized ✓';
          qrSuccessBadge.style.display = 'inline-flex';
          this.orderData.payment.qrAuthorized = true;
          if (window.amzCart) window.amzCart.showToast("QR Code Scanned & Approved from Mobile Phone!", "success");
        }, 400);
      });
    }

    // 7. Bank Chips Selection (Indian Net Banking)
    document.querySelectorAll('.bank-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.bank-chip').forEach(c => c.classList.remove('is-selected'));
        chip.classList.add('is-selected');
        this.orderData.payment.bank = chip.dataset.bank;
        if (window.amzCart) window.amzCart.showToast(`Selected ${chip.dataset.bank}`, "info");
      });
    });

    // 8. Gift Card Voucher Code
    const applyGiftBtn = document.getElementById('btn-apply-giftcard');
    const giftInput = document.getElementById('giftcard-code-input');
    const giftSuccessBadge = document.getElementById('giftcard-success-badge');

    if (applyGiftBtn && giftInput && giftSuccessBadge) {
      applyGiftBtn.addEventListener('click', () => {
        const code = giftInput.value.trim();
        if (!code) return;
        applyGiftBtn.textContent = 'Applying...';
        setTimeout(() => {
          applyGiftBtn.textContent = 'Applied ✓';
          giftSuccessBadge.style.display = 'inline-flex';
          this.orderData.payment.giftCode = code;
          if (window.amzCart) window.amzCart.showToast(`Gift Card ${code} Applied!`, "success");
        }, 300);
      });
    }
  }

  switchCountryPaymentPane(paneName) {
    document.querySelectorAll('.country-pay-tab').forEach(tab => {
      tab.classList.toggle('is-active', tab.dataset.countryPane === paneName);
    });

    document.querySelectorAll('.country-pay-pane').forEach(pane => {
      pane.classList.toggle('is-active', pane.dataset.countryPaneContent === paneName);
    });

    // Auto-select first available payment option in that pane
    const activePane = document.querySelector(`.country-pay-pane[data-country-pane-content="${paneName}"]`);
    if (activePane) {
      const firstRadio = activePane.querySelector('input[name="checkout-payment-method"]');
      if (firstRadio) {
        firstRadio.checked = true;
        firstRadio.dispatchEvent(new Event('change'));
      }
    }
  }

  startUpiQrTimer() {
    let timeLeft = 299; // 5 minutes
    const timerEl = document.getElementById('upi-qr-timer');
    if (!timerEl) return;

    if (this.qrInterval) clearInterval(this.qrInterval);

    this.qrInterval = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(this.qrInterval);
        timerEl.textContent = 'Expired - Click to Refresh';
        return;
      }
      const mins = String(Math.floor(timeLeft / 60)).padStart(2, '0');
      const secs = String(timeLeft % 60).padStart(2, '0');
      timerEl.textContent = `${mins}:${secs}`;
    }, 1000);
  }

  validateAddressForm() {
    const country = document.getElementById('ship-country')?.value || 'IN';
    const nameInput = document.getElementById('ship-name');
    const phoneInput = document.getElementById('ship-phone');
    const streetInput = document.getElementById('ship-street');
    const stateInput = document.getElementById('ship-state');
    const zipInput = document.getElementById('ship-zip');
    const villageInput = document.getElementById('ship-village');
    const tehsilInput = document.getElementById('ship-tehsil');
    const districtInput = document.getElementById('ship-district');
    const landmarkInput = document.getElementById('ship-landmark');
    const carrierInput = document.querySelector('input[name="ship-carrier"]:checked');

    if (!nameInput?.value.trim() || !phoneInput?.value.trim() || !streetInput?.value.trim() || !zipInput?.value.trim()) {
      if (window.amzCart) window.amzCart.showToast("Please fill in your name, phone, address, and PIN/ZIP code.", "info");
      return false;
    }

    const carrierName = carrierInput?.value === 'ruralexpress' 
      ? 'Amazon Rural Express Hub Partner' 
      : 'India Post Speed Post (Last-Mile Village Doorstep)';

    this.orderData.shipping = {
      country: country,
      addressType: this.deliveryType,
      fullName: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      street: streetInput.value.trim(),
      village: this.deliveryType === 'village' ? (villageInput?.value.trim() || 'Village Rampur') : '',
      tehsil: this.deliveryType === 'village' ? (tehsilInput?.value.trim() || '') : '',
      district: districtInput?.value.trim() || 'District',
      state: stateInput?.value.trim() || 'Uttar Pradesh',
      zipCode: zipInput.value.trim(),
      landmark: this.deliveryType === 'village' ? (landmarkInput?.value.trim() || 'Near Primary School') : '',
      carrierPartner: carrierName
    };

    return true;
  }

  renderStep(stepNumber) {
    this.currentStep = stepNumber;

    // Update step indicator tabs
    document.querySelectorAll('.checkout-step-tab').forEach(tab => {
      const tabStep = parseInt(tab.dataset.step, 10);
      tab.classList.toggle('is-active', tabStep === stepNumber);
      tab.classList.toggle('is-completed', tabStep < stepNumber);
    });

    // Toggle step panes
    document.querySelectorAll('.checkout-step-pane').forEach(pane => {
      const paneStep = parseInt(pane.dataset.step, 10);
      pane.classList.toggle('is-active', paneStep === stepNumber);
    });

    // When entering Step 2: Auto-select appropriate Country Payment tab
    if (stepNumber === 2) {
      const country = this.orderData.shipping?.country || 'IN';
      if (country === 'IN') {
        this.switchCountryPaymentPane('india');
      } else if (['US', 'CA'].includes(country)) {
        this.switchCountryPaymentPane('usa');
      } else if (['GB', 'DE'].includes(country)) {
        this.switchCountryPaymentPane('europe');
      } else if (country === 'JP') {
        this.switchCountryPaymentPane('apac');
      } else {
        this.switchCountryPaymentPane('india');
      }
    }

    // Populate review step if navigating to Step 3
    if (stepNumber === 3) {
      this.populateOrderReview();
    }
  }

  populateOrderReview() {
    const reviewItemsContainer = document.getElementById('checkout-review-items');
    const reviewShippingEl = document.getElementById('checkout-review-shipping-details');
    const reviewPaymentEl = document.getElementById('checkout-review-payment-details');
    const subtotalEl = document.getElementById('checkout-summary-subtotal');
    const shippingEl = document.getElementById('checkout-summary-shipping');
    const taxEl = document.getElementById('checkout-summary-tax');
    const totalEl = document.getElementById('checkout-summary-total');

    if (!window.amzCart) return;

    const items = window.amzCart.items;
    const summary = window.amzCart.getSummary();

    // Render item rows
    if (reviewItemsContainer) {
      reviewItemsContainer.innerHTML = items.map(item => `
        <div class="checkout-review-item-row">
          <img src="${item.image}" alt="${item.title}" class="review-item-thumb" />
          <div class="review-item-info">
            <h5 class="review-item-title">${item.title}</h5>
            <div class="review-item-meta">
              <span class="review-item-qty">Qty: ${item.quantity}</span>
              <span class="review-item-price">${window.amzApp ? window.amzApp.formatPrice(item.price * item.quantity) : `$${(item.price * item.quantity).toFixed(2)}`}</span>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Shipping address summary (Rich Village & Rural Display)
    if (reviewShippingEl) {
      const ship = this.orderData.shipping;
      if (ship.addressType === 'village') {
        reviewShippingEl.innerHTML = `
          <div style="display: inline-block; background: #eaf8f4; color: #067d62; padding: 2px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 800; margin-bottom: 4px;">
            🏡 VILLAGE / RURAL DOORSTEP DELIVERY
          </div><br>
          <strong>${escapeHtml(ship.fullName)}</strong> (📞 ${escapeHtml(ship.phone)})<br>
          ${escapeHtml(ship.street)}<br>
          <strong>Village:</strong> ${escapeHtml(ship.village)} ${ship.tehsil ? `| <strong>Tehsil / PO:</strong> ${escapeHtml(ship.tehsil)}` : ''}<br>
          <strong>District:</strong> ${escapeHtml(ship.district)}, ${escapeHtml(ship.state)} - <strong>${escapeHtml(ship.zipCode)}</strong><br>
          ${ship.landmark ? `🚩 <strong>Landmark:</strong> ${escapeHtml(ship.landmark)}<br>` : ''}
          <div style="font-size: 0.78rem; color: #007185; margin-top: 4px;">
            🚚 <strong>Carrier:</strong> ${escapeHtml(ship.carrierPartner)}
          </div>
        `;
      } else {
        reviewShippingEl.innerHTML = `
          <strong>${escapeHtml(ship.fullName)}</strong> (📞 ${escapeHtml(ship.phone)})<br>
          ${escapeHtml(ship.street)}<br>
          ${escapeHtml(ship.district)}, ${escapeHtml(ship.state)} ${escapeHtml(ship.zipCode)}<br>
          🚚 <strong>Carrier:</strong> ${escapeHtml(ship.carrierPartner)}
        `;
      }
    }

    // Payment summary with dynamic country/method details
    if (reviewPaymentEl) {
      const p = this.orderData.payment;
      let payTitle = 'Credit or Debit Card';
      let paySub = 'Visa ending in 4242';

      switch (p.method) {
        case 'upi':
          payTitle = `⚡ UPI Payment (${p.upiApp || 'Google Pay'})`;
          paySub = p.upiId ? `VPA: ${p.upiId} ✓ Verified` : `Instant 1-Click Intent on ${p.upiApp || 'Google Pay'}`;
          break;
        case 'cod':
          payTitle = `💵 Cash on Delivery / Pay on Arrival`;
          paySub = `Pay cash or UPI to delivery agent upon village/doorstep arrival`;
          break;
        case 'netbanking':
          payTitle = `🏦 Net Banking (${p.bank || 'State Bank of India'})`;
          paySub = `Secure direct bank redirect via NPCI gateway`;
          break;
        case 'rupay_card':
          payTitle = `💳 RuPay Debit/Credit Card`;
          paySub = `RuPay card ending in 7192 (RuPay PaySecure)`;
          break;
        case 'card':
          payTitle = `💳 Credit/Debit Card (Visa/Mastercard)`;
          paySub = `Visa card ending in 4242 (Exp: 09/28)`;
          break;
        case 'applepay':
          payTitle = `🍏 Apple Pay`;
          paySub = `1-Touch biometric authentication (Apple Wallet)`;
          break;
        case 'paypal':
          payTitle = `🅿️ PayPal & Venmo`;
          paySub = `Instant checkout from linked balance`;
          break;
        case 'affirm':
          payTitle = `🛍️ Affirm: Buy Now, Pay Later`;
          paySub = `4 interest-free payments of 25%`;
          break;
        case 'sepa':
          payTitle = `🇪🇺 SEPA Direct Debit`;
          paySub = `Eurozone IBAN ending in •••• 8912`;
          break;
        case 'klarna':
          payTitle = `🛍️ Klarna Pay in 3 / Sofort Banking`;
          paySub = `Split European payments with 0% interest`;
          break;
        case 'ideal':
          payTitle = `🇳🇱 iDEAL & 🇧🇪 Bancontact`;
          paySub = `Direct bank transfer (Netherlands & Belgium)`;
          break;
        case 'revolut':
          payTitle = `⚡ Revolut Pay`;
          paySub = `1-Click Revolut account transfer`;
          break;
        case 'paypay':
          payTitle = `🔴 PayPay & LINE Pay`;
          paySub = `Japan's leading QR mobile wallet`;
          break;
        case 'konbini':
          payTitle = `🏪 Konbini Convenience Store`;
          paySub = `Pay at 7-Eleven, Lawson, or FamilyMart in Japan`;
          break;
        case 'jcb':
          payTitle = `🇯🇵 JCB International Card`;
          paySub = `JCB card ending in 8109`;
          break;
        case 'amazonpay':
          payTitle = `🟠 Amazon Pay Balance`;
          paySub = `Deducted from available stored wallet`;
          break;
        case 'giftcard':
          payTitle = `🎁 Amazon Gift Card / Promo Code`;
          paySub = `Voucher ${p.giftCode || 'AMZ-PRIME-2026'} applied`;
          break;
        case 'crypto':
          payTitle = `🪙 Web3 Crypto Payment`;
          paySub = `Bitcoin / USDT simulated blockchain transfer`;
          break;
        default:
          payTitle = 'Electronic Payment';
          paySub = 'Encrypted Transaction';
      }

      this.orderData.paymentMethodTitle = `${payTitle} (${paySub})`;

      reviewPaymentEl.innerHTML = `
        <div style="font-size: 0.85rem;">
          <strong style="color: var(--text-primary);">${payTitle}</strong><br>
          <span style="color: var(--text-secondary); font-size: 0.78rem;">${paySub}</span>
        </div>
      `;
    }

    // Financial totals
    if (subtotalEl) subtotalEl.textContent = window.amzApp ? window.amzApp.formatPrice(summary.subtotal) : `$${summary.subtotal.toFixed(2)}`;
    if (shippingEl) shippingEl.textContent = summary.shipping === 0 ? 'FREE' : (window.amzApp ? window.amzApp.formatPrice(summary.shipping) : `$${summary.shipping.toFixed(2)}`);
    if (taxEl) taxEl.textContent = window.amzApp ? window.amzApp.formatPrice(summary.tax) : `$${summary.tax.toFixed(2)}`;
    if (totalEl) totalEl.textContent = window.amzApp ? window.amzApp.formatPrice(summary.orderTotal) : `$${summary.orderTotal.toFixed(2)}`;
  }

  processOrderPlacement() {
    const placeBtn = document.getElementById('btn-place-order');
    if (placeBtn) {
      placeBtn.disabled = true;
      placeBtn.innerHTML = `
        <span class="btn-spinner"></span>
        <span>Securing Order & Routing Village Dispatch...</span>
      `;
    }

    setTimeout(() => {
      const summary = window.amzCart.getSummary();
      const ship = this.orderData.shipping;
      const isVillage = ship.addressType === 'village';

      const randomOrderId = `114-${Math.floor(1000000 + Math.random() * 9000000)}-${Math.floor(1000000 + Math.random() * 9000000)}`;
      const randomTracking = isVillage 
        ? `INP${Math.floor(100000000 + Math.random() * 900000000)}IN` 
        : `TBA${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      const newOrder = {
        orderId: randomOrderId,
        trackingNumber: randomTracking,
        date: new Date().toISOString(),
        status: isVillage ? 'Dispatched to Village Post Office' : 'Preparing for Shipment',
        estimatedDelivery: isVillage ? 'Arriving in 2-3 Days at Village Doorstep' : 'Arriving Tomorrow by 8 PM',
        carrierPartner: ship.carrierPartner || 'India Post Speed Post',
        total: summary.orderTotal,
        shipping: { ...this.orderData.shipping },
        items: [...window.amzCart.items]
      };

      // Push into order history
      this.orders.unshift(newOrder);
      this.saveOrders();

      // Clear cart
      window.amzCart.clearCart();

      // Reset place button state
      if (placeBtn) {
        placeBtn.disabled = false;
        placeBtn.innerHTML = `Place Your Order and Pay`;
      }

      // Close checkout modal & show Order Confirmation modal
      const checkoutModal = document.getElementById('checkout-modal');
      if (checkoutModal && window.amzModal) {
        window.amzModal.hideModal(checkoutModal);
      }

      this.showOrderConfirmation(newOrder);
    }, 1200);
  }

  showOrderConfirmation(order) {
    const modal = document.getElementById('order-success-modal');
    if (!modal) return;

    const ship = order.shipping;
    const isVillage = ship.addressType === 'village';
    const formattedAddress = isVillage
      ? `${ship.street}, Village: ${ship.village}${ship.tehsil ? ` (${ship.tehsil})` : ''}, District: ${ship.district}, ${ship.state} - ${ship.zipCode} | 🚩 Landmark: ${ship.landmark}`
      : `${ship.street}, ${ship.district}, ${ship.state} ${ship.zipCode}`;

    modal.querySelector('.success-order-id').textContent = order.orderId;
    modal.querySelector('.success-tracking-no').textContent = `${order.trackingNumber} (${order.carrierPartner})`;
    modal.querySelector('.success-delivery-date').textContent = order.estimatedDelivery;
    modal.querySelector('.success-shipping-name').textContent = `${ship.fullName} (📞 ${ship.phone})`;
    modal.querySelector('.success-shipping-address').textContent = formattedAddress;
    modal.querySelector('.success-order-total').textContent = window.amzApp ? window.amzApp.formatPrice(order.total) : `$${order.total.toFixed(2)}`;

    const payMethodEl = modal.querySelector('.success-payment-method');
    if (payMethodEl) {
      payMethodEl.textContent = order.paymentMethod || '⚡ UPI Payment (Google Pay - Verified)';
    }

    if (window.amzModal) {
      window.amzModal.showModal(modal);
    }

    // Launch celebratory confetti
    this.launchConfetti();

    // Bind receipt download simulation
    const downloadBtn = modal.querySelector('#btn-download-receipt');
    if (downloadBtn) {
      downloadBtn.onclick = () => {
        this.downloadSimulatedReceipt(order);
      };
    }
  }

  downloadSimulatedReceipt(order) {
    const ship = order.shipping;
    const isVillage = ship.addressType === 'village';

    const addressBlock = isVillage ? `
RECIPIENT: ${ship.fullName} (Phone: ${ship.phone})
DELIVERY TYPE: Rural / Village Doorstep Delivery (गाँव डिलीवरी)
VILLAGE / GRAM PANCHAYAT: ${ship.village}
POST OFFICE / TEHSIL: ${ship.tehsil || 'Local Gram Post Office'}
HOUSE / LOCALITY: ${ship.street}
DISTRICT: ${ship.district}
STATE: ${ship.state}
PIN CODE: ${ship.zipCode}
NEAREST LANDMARK: ${ship.landmark}
COUNTRY: ${ship.country === 'IN' ? 'India' : ship.country}
ASSIGNED CARRIER: ${order.carrierPartner}
    `.trim() : `
RECIPIENT: ${ship.fullName} (Phone: ${ship.phone})
ADDRESS: ${ship.street}
CITY / DISTRICT: ${ship.district}, ${ship.state} ${ship.zipCode}
COUNTRY: ${ship.country}
CARRIER: ${order.carrierPartner}
    `.trim();

    const receiptContent = `
============================================================
              AMAZON 2.0 ORDER CONFIRMATION & RECEIPT
============================================================
Order ID: ${order.orderId}
Carrier Tracking: ${order.trackingNumber}
Carrier Partner: ${order.carrierPartner}
Order Date: ${new Date(order.date).toLocaleString()}
Status: ${order.status}
Estimated Delivery: ${order.estimatedDelivery}
Payment Method: ${order.paymentMethod || '⚡ UPI Payment (Google Pay - Verified)'}

SHIP TO DESTINATION:
${addressBlock}

ORDER ITEMS:
${order.items.map(i => `- ${i.title} (Qty: ${i.quantity}) - ${window.amzApp ? window.amzApp.formatPrice(i.price * i.quantity) : '$' + (i.price * i.quantity).toFixed(2)}`).join('\n')}

TOTAL CHARGE: ${window.amzApp ? window.amzApp.formatPrice(order.total) : '$' + order.total.toFixed(2)}
============================================================
✓ Guaranteed Doorstep Delivery to Remote Villages Across India & Globally
✓ Delivered via India Post Speed Post & Amazon Rural Logistics
Thank you for using this Amazon Clone portfolio demonstration!
============================================================
    `.trim();

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Amazon-Receipt-${order.orderId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.amzCart) {
      window.amzCart.showToast("Receipt downloaded with Village Delivery details!", "success");
    }
  }

  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#febd69', '#f08804', '#007185', '#067d62', '#ffd814', '#ffffff'];

    for (let i = 0; i < 90; i++) {
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        r: Math.random() * 6 + 3,
        d: Math.random() * 50 + 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.floor(Math.random() * 10) - 10,
        tiltAngleIncremental: (Math.random() * 0.07) + 0.05,
        tiltAngle: 0,
        vx: (Math.random() - 0.5) * 18,
        vy: (Math.random() - 0.7) * 18,
        gravity: 0.35
      });
    }

    let animationFrame;
    const renderConfetti = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let activeParticles = 0;
      particles.forEach(p => {
        p.vy += p.gravity;
        p.x += p.vx;
        p.y += p.vy;
        p.tiltAngle += p.tiltAngleIncremental;
        p.tilt = Math.sin(p.tiltAngle) * 15;

        if (p.y < canvas.height) {
          activeParticles++;
          ctx.beginPath();
          ctx.lineWidth = p.r;
          ctx.strokeStyle = p.color;
          ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
          ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
          ctx.stroke();
        }
      });

      if (activeParticles > 0) {
        animationFrame = requestAnimationFrame(renderConfetti);
      } else {
        cancelAnimationFrame(animationFrame);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    };

    renderConfetti();
  }

  // ==========================================================================
  // EXPRESS 1-CLICK INSTANT PURCHASE ENGINE (BUYER-FRIENDLY)
  // ==========================================================================
  bindExpressBuyModal() {
    const modal = document.getElementById('express-buy-modal');
    const closeBtn = document.getElementById('express-buy-close');
    const qtySelect = document.getElementById('express-qty-select');
    const confirmBtn = document.getElementById('btn-express-confirm-order');
    const fallbackLink = document.getElementById('express-fallback-link');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeExpressBuy());
    }

    if (qtySelect) {
      qtySelect.addEventListener('change', () => {
        if (this.expressProduct) {
          const q = parseInt(qtySelect.value, 10) || 1;
          this.expressQty = q;
          this.updateExpressTotals();
        }
      });
    }

    // Address chip selector
    const villageAddrChip = document.getElementById('express-addr-village');
    const cityAddrChip = document.getElementById('express-addr-city');

    if (villageAddrChip && cityAddrChip) {
      villageAddrChip.addEventListener('click', () => {
        villageAddrChip.classList.add('is-selected');
        cityAddrChip.classList.remove('is-selected');
        const r = villageAddrChip.querySelector('input');
        if (r) r.checked = true;
      });

      cityAddrChip.addEventListener('click', () => {
        cityAddrChip.classList.add('is-selected');
        villageAddrChip.classList.remove('is-selected');
        const r = cityAddrChip.querySelector('input');
        if (r) r.checked = true;
      });
    }

    // Payment pills selector
    const payUpi = document.getElementById('express-pay-upi');
    const payCod = document.getElementById('express-pay-cod');
    const payCard = document.getElementById('express-pay-card');
    const payPills = [payUpi, payCod, payCard].filter(Boolean);

    payPills.forEach(pill => {
      pill.addEventListener('click', () => {
        payPills.forEach(p => p.classList.remove('is-selected'));
        pill.classList.add('is-selected');
        const r = pill.querySelector('input');
        if (r) r.checked = true;
      });
    });

    if (confirmBtn) {
      confirmBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.confirmExpressOrder();
      });
    }

    if (fallbackLink) {
      fallbackLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.closeExpressBuy();
        if (this.expressProduct && window.amzCart) {
          window.amzCart.addItem(this.expressProduct, this.expressQty || 1);
        }
        this.openCheckout();
      });
    }
  }

  openExpressBuy(product, quantity = 1) {
    if (!product) return;
    this.expressProduct = product;
    this.expressQty = quantity;

    const modal = document.getElementById('express-buy-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    // Populate product details
    const imgEl = document.getElementById('express-prod-img');
    const titleEl = document.getElementById('express-prod-title');
    const priceEl = document.getElementById('express-prod-price');
    const deliveryEl = document.getElementById('express-delivery-text');
    const qtySelect = document.getElementById('express-qty-select');

    if (imgEl) imgEl.src = product.images ? product.images[0] : '';
    if (titleEl) titleEl.textContent = product.shortTitle || product.title;
    if (priceEl) priceEl.textContent = window.amzApp ? window.amzApp.formatPrice(product.price) : ("$" + product.price.toFixed(2));
    if (deliveryEl) deliveryEl.textContent = product.delivery || 'FREE Delivery Tomorrow';
    if (qtySelect) qtySelect.value = quantity.toString();

    this.updateExpressTotals();

    // Show modal & overlay
    modal.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  closeExpressBuy() {
    const modal = document.getElementById('express-buy-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    modal.classList.remove('is-open');
    if (overlay && !document.querySelector('.amz-modal.is-open:not(#express-buy-modal), .cart-drawer.is-open, .dept-drawer.is-open')) {
      overlay.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  updateExpressTotals() {
    if (!this.expressProduct) return;
    const total = this.expressProduct.price * (this.expressQty || 1);
    const formatted = window.amzApp ? window.amzApp.formatPrice(total) : ("$" + total.toFixed(2));

    const totalEl = document.getElementById('express-total-amount');
    if (totalEl) totalEl.textContent = formatted;

    const submitBtn = document.getElementById('btn-express-confirm-order');
    if (submitBtn) {
      submitBtn.innerHTML = `<span class="bolt-icon">⚡</span><span>Slide / Tap to Complete 1-Click Order (${formatted})</span>`;
    }
  }

  confirmExpressOrder() {
    if (!this.expressProduct) return;

    const btn = document.getElementById('btn-express-confirm-order');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = `<span class="spinner-inline"></span> Processing 1-Click Order...`;
    }

    setTimeout(() => {
      // Determine selected address
      const isVillage = document.querySelector('input[name="express-addr-opt"]:checked')?.value === 'village';
      // Determine selected payment
      const payVal = document.querySelector('input[name="express-pay-opt"]:checked')?.value || 'upi';
      let payName = '⚡ UPI 1-Click (GPay / PhonePe - Verified)';
      if (payVal === 'cod') {
        payName = '💵 Cash on Delivery (Pay cash at village doorstep)';
      } else if (payVal === 'card') {
        payName = '💳 Saved Visa Card (•••• 4242)';
      }

      const total = this.expressProduct.price * (this.expressQty || 1);
      const randomDigits = Math.floor(1000000 + Math.random() * 9000000);
      const orderId = `114-${randomDigits}-7890123`;
      const carrier = isVillage ? 'India Post Rural Speed Post' : 'Amazon Prime Express Van';
      const trackingNo = isVillage ? `IN${Math.floor(100000000 + Math.random() * 900000000)}RP` : `TBA${Math.floor(100000000000 + Math.random() * 900000000000)}`;

      const newOrder = {
        orderId: orderId,
        date: new Date().toISOString(),
        status: 'Dispatched (Out for Delivery)',
        estimatedDelivery: isVillage ? 'FREE Doorstep Village Delivery in 2 Days' : 'Arriving Tomorrow by 11 AM',
        total: total,
        paymentMethod: payName,
        carrierPartner: carrier,
        trackingNumber: trackingNo,
        items: [
          {
            id: this.expressProduct.id,
            title: this.expressProduct.shortTitle || this.expressProduct.title,
            price: this.expressProduct.price,
            quantity: this.expressQty || 1,
            image: this.expressProduct.images ? this.expressProduct.images[0] : ''
          }
        ],
        shipping: isVillage ? {
          addressType: 'village',
          fullName: 'Aarav Sharma (Resident)',
          street: 'House #42, Primary School Road',
          village: 'Rampur Gram Panchayat',
          tehsil: 'Sadar Tehsil',
          district: 'Varanasi',
          state: 'Uttar Pradesh',
          zipCode: '244901',
          landmark: 'Opposite Village Panchayat Bhavan',
          phone: '+91 98765 43210',
          country: 'IN'
        } : {
          addressType: 'city',
          fullName: 'Alex Vance',
          street: 'Flat 402, Lotus Heights, Outer Ring Road',
          district: 'New Delhi',
          state: 'Delhi',
          zipCode: '110001',
          phone: '+91 91234 56789',
          country: 'IN'
        }
      };

      // Save order
      this.orders.unshift(newOrder);
      this.saveOrders();

      // Decrement product stock in PRODUCTS_DATA
      const catProd = PRODUCTS_DATA.find(p => p.id === this.expressProduct.id);
      if (catProd) {
        catProd.stock = Math.max(0, catProd.stock - (this.expressQty || 1));
      }

      // Close express buy modal
      this.closeExpressBuy();

      // Reset button
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = `<span class="bolt-icon">⚡</span><span>Slide / Tap to Complete 1-Click Order</span>`;
      }

      // Show Order Confirmation modal
      this.showOrderConfirmation(newOrder);

      // Refresh catalog live
      if (window.amzSearchFilter) {
        window.amzSearchFilter.refreshCatalog();
      }

      if (window.amzCart) {
        window.amzCart.showToast(`⚡ 1-Click Order Placed! ${newOrder.items[0].title} is arriving with Free ${isVillage ? 'Village' : 'Prime'} Delivery!`, 'success');
      }
    }, 900);
  }
}

window.amzCheckout = new CheckoutEngine();
