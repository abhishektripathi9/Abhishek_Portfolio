/**
 * UDAANMART - SELLER CENTRAL & RURAL ARTISAN HUB ENGINE (js/seller.js)
 * PILLAR 2: "3-Click Easy Dukaan" for Rural Artisans & Merchants
 * 1. Bilingual Voice-to-Fill Product Form (hi-IN & en-IN Web Speech API)
 * 2. 1-Tap Smart Description Chips for zero-typing highlight bullet generation
 * 3. Direct Photo Upload with HTML5 Canvas Compression + Real-Time Card Preview
 * 4. Live "Aapki Kamai" (Net Karigar Payout) Breakdown Card
 * 5. 1-Click Order Fulfillment & Printable India Post Shipping Label with Barcode
 * 6. Real-time Inventory & Delisting linked to amzStore
 */

class SellerCentralEngine {
  constructor() {
    this.activeTab = 'list';
    this.currentSelectedOrder = null;

    // Predefined high-quality Smart Category Templates for 1-Click Fill
    this.smartTemplates = {
      sneakers: {
        title: "Men's Ultra-Light Breathable Cushioning Running Sneakers",
        shortTitle: "Men's Cushioning Running Sneakers",
        category: "clothing",
        gender: "men",
        price: 69.99,
        stock: 35,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        features: "• High-density responsive air cushion sole\n• Breathable honeycomb mesh knit upper\n• Anti-slip textured rubber outsole for all terrains\n• 7-Day Easy Replacement Guarantee",
        isKarigar: false
      },
      saree: {
        title: "UdaanMart Karigar Handcrafted Pure Banarasi Silk Zari Saree from Varanasi",
        shortTitle: "Artisan Banarasi Silk Zari Saree",
        category: "clothing",
        gender: "women",
        price: 119.00,
        stock: 15,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        features: "• 100% GI-Tag Certified Varanasi Handloom\n• Handcrafted Direct from Weaver guild in Kashi\n• Pure Natural Silk with pure golden Zari palla\n• Includes matching 0.8m unstitched blouse piece\n• Zero-Hassle 7-Day Return Guarantee",
        isKarigar: true
      },
      pottery: {
        title: "UdaanMart Karigar Handcrafted Terracotta Blue Pottery Ceramic Tableware Set from Jaipur",
        shortTitle: "Artisan Jaipur Blue Pottery Set",
        category: "kitchen",
        gender: "unisex",
        price: 39.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
        features: "• 100% GI-Tag Certified Jaipur Craft\n• Lead-free natural quartz stone glaze by master potters\n• Microwave & dishwasher safe artisanal stoneware\n• Direct rural doorstep pickup empowering cottage craft guilds",
        isKarigar: true
      },
      watch: {
        title: "Men's Luxury Sapphire Stainless Steel Automatic Chronograph Watch",
        shortTitle: "Automatic Chronograph Watch",
        category: "fashion",
        gender: "men",
        price: 149.99,
        stock: 18,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        features: "• Water resistant to 100M with screw-down crown\n• Japanese 24-jewel automatic movement\n• Scratch-resistant sapphire crystal glass face",
        isKarigar: false
      },
      chappal: {
        title: "UdaanMart Karigar Authentic Hand-Stitched Kolhapuri Leather Chappals",
        shortTitle: "Authentic Kolhapuri Leather Chappals",
        category: "clothing",
        gender: "unisex",
        price: 49.00,
        stock: 25,
        image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=800&q=80",
        features: "• 100% GI-Tag Certified Kolhapur Footwear\n• Handcrafted from vegetable-tanned genuine leather\n• Traditional braided cord straps with anti-slip heel\n• Direct support to rural cobbler guilds of Maharashtra",
        isKarigar: true
      }
    };
  }

  init() {
    this.bindTriggers();
    this.bindTabs();
    this.bindVoiceRecognition();
    this.bindDescriptionChips();
    this.bindSmartTemplates();
    this.bindImageUploader();
    this.bindPhotoChips();
    this.bindLivePreviewSync();
    this.bindAapkiKamaiCalculator();
    this.bindListingForm();
    this.bindShippingLabelModal();

    // Listen for order updates from Store
    window.addEventListener('udaan:order-created', () => {
      if (this.activeTab === 'incoming-orders') {
        this.renderIncomingOrders();
      }
    });

    window.addEventListener('udaan:order-updated', () => {
      if (this.activeTab === 'incoming-orders') {
        this.renderIncomingOrders();
      }
    });
  }

  // ==========================================================================
  // MODAL TRIGGERS & NAVIGATION
  // ==========================================================================
  bindTriggers() {
    const triggers = [
      document.getElementById('open-seller-hub-btn'),
      document.getElementById('footer-sell-link')
    ];

    triggers.forEach(btn => {
      if (btn) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          this.openModal('list');
        });
      }
    });

    const karigarLink = document.getElementById('footer-karigar-link');
    if (karigarLink) {
      karigarLink.addEventListener('click', (e) => {
        e.preventDefault();
        this.openModal('karigar');
      });
    }

    const closeBtn = document.getElementById('seller-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if (this.isShippingLabelModalOpen()) {
          this.closeShippingLabelModal();
        } else if (this.isModalOpen()) {
          this.closeModal();
        }
      }
    });
  }

  openModal(tab = 'list') {
    const modal = document.getElementById('seller-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    this.switchTab(tab);
    this.updateLivePreview();
    this.updateAapkiKamai();

    modal.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  openSellerModal(tab = 'list') {
    this.openModal(tab);
  }

  openKarigarModal() {
    this.openModal('karigar');
  }

  closeModal() {
    const modal = document.getElementById('seller-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    modal.classList.remove('is-open');
    if (overlay && !document.querySelector('.amz-modal.is-open:not(#seller-modal), .modal.is-open, .cart-drawer.is-open, .dept-drawer.is-open')) {
      overlay.classList.remove('is-open');
    }
    document.body.style.overflow = '';
  }

  isModalOpen() {
    const modal = document.getElementById('seller-modal');
    return modal && modal.classList.contains('is-open');
  }

  bindTabs() {
    const tabBtns = document.querySelectorAll('[data-seller-tab]');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = btn.dataset.sellerTab;
        this.switchTab(tab);
      });
    });
  }

  switchTab(tab) {
    this.activeTab = tab;

    document.querySelectorAll('[data-seller-tab]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.sellerTab === tab);
    });

    document.querySelectorAll('.seller-tab-panel').forEach(panel => {
      panel.classList.toggle('is-active', panel.id === `seller-panel-${tab}`);
    });

    if (tab === 'inventory') {
      this.renderInventoryTable();
    } else if (tab === 'analytics') {
      this.renderAnalytics();
    } else if (tab === 'incoming-orders') {
      this.renderIncomingOrders();
    } else if (tab === 'list') {
      this.updateLivePreview();
      this.updateAapkiKamai();
    }
  }

  // ==========================================================================
  // 1. VOICE-TO-FILL SPEECH ENGINE (hi-IN & en-IN)
  // ==========================================================================
  bindVoiceRecognition() {
    const voiceBtn = document.getElementById('seller-title-voice-btn');
    if (!voiceBtn) return;

    voiceBtn.addEventListener('click', () => {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        if (window.amzCart) window.amzCart.showToast('🎤 Web Speech API is not supported in this browser. Please type directly.', 'info');
        return;
      }

      try {
        const recognition = new SpeechRecognition();
        recognition.lang = 'hi-IN'; // Default to Hindi-friendly recognition
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        voiceBtn.classList.add('is-listening');
        if (window.amzCart) window.amzCart.showToast('🎙️ Bolie... Apne product ka naam batayein (Listening...)', 'info');

        recognition.onstart = () => {
          voiceBtn.setAttribute('title', 'Listening... बोलिए');
        };

        recognition.onresult = (event) => {
          voiceBtn.classList.remove('is-listening');
          const spoken = event.results[0][0].transcript;
          const titleInput = document.getElementById('seller-prod-title');
          if (titleInput) {
            titleInput.value = spoken;
            this.updateLivePreview();
          }
          if (window.amzCart) window.amzCart.showToast(`🎤 Voice Captured: "${spoken}"`, 'success');
        };

        recognition.onerror = () => {
          voiceBtn.classList.remove('is-listening');
          if (window.amzCart) window.amzCart.showToast('🎙️ Microphone ready. Please try speaking again.', 'info');
        };

        recognition.onend = () => {
          voiceBtn.classList.remove('is-listening');
        };

        recognition.start();
      } catch (err) {
        voiceBtn.classList.remove('is-listening');
        console.warn('Speech recognition error:', err);
      }
    });
  }

  // ==========================================================================
  // 2. 1-TAP SMART DESCRIPTION CHIPS (Zero Typing Needed)
  // ==========================================================================
  bindDescriptionChips() {
    const chipBtns = document.querySelectorAll('.smart-desc-chip');
    const featuresInput = document.getElementById('seller-prod-features');

    chipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const text = btn.dataset.chipText || btn.textContent.trim();
        if (!featuresInput) return;

        let currentVal = featuresInput.value.trim();
        const bullet = `• ${text}`;

        if (!currentVal.includes(text)) {
          featuresInput.value = currentVal ? `${currentVal}\n${bullet}` : bullet;
          btn.classList.add('is-selected');
          if (window.amzCart) window.amzCart.showToast(`✨ Added highlight: "${text}"`, 'info');
        } else {
          // Toggle off
          featuresInput.value = currentVal
            .split('\n')
            .filter(line => !line.includes(text))
            .join('\n');
          btn.classList.remove('is-selected');
        }
      });
    });
  }

  // ==========================================================================
  // 3. IMAGE UPLOADER WITH HTML5 CANVAS COMPRESSION
  // ==========================================================================
  bindImageUploader() {
    const dropzone = document.getElementById('seller-dropzone');
    const fileInput = document.getElementById('seller-image-file');
    const removeBtn = document.getElementById('seller-remove-photo-btn');
    const urlInput = document.getElementById('seller-prod-image');

    if (fileInput) {
      fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          this.compressAndProcessImage(file);
        }
      });
    }

    if (dropzone) {
      ['dragenter', 'dragover'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.add('is-dragover');
        });
      });

      ['dragleave', 'drop'].forEach(eventName => {
        dropzone.addEventListener(eventName, (e) => {
          e.preventDefault();
          e.stopPropagation();
          dropzone.classList.remove('is-dragover');
        });
      });

      dropzone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
          this.compressAndProcessImage(file);
        }
      });
    }

    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (fileInput) fileInput.value = '';
        const defaultImg = "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";
        if (urlInput) urlInput.value = defaultImg;
        this.hideImagePreview();
        this.updateLivePreview();
      });
    }
  }

  compressAndProcessImage(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // High quality canvas compression (max 800px width/height)
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;

        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to compressed jpeg data URL
        const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.75);

        const urlInput = document.getElementById('seller-prod-image');
        if (urlInput) urlInput.value = compressedDataUrl;

        this.showImagePreview(compressedDataUrl);
        this.updateLivePreview();

        if (window.amzCart) {
          window.amzCart.showToast("📷 Photo optimized and ready for live listing!");
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  showImagePreview(src) {
    const promptEl = document.getElementById('seller-dropzone-prompt');
    const previewEl = document.getElementById('seller-image-preview');
    const imgEl = document.getElementById('seller-preview-img');

    if (promptEl) promptEl.style.display = 'none';
    if (previewEl) previewEl.style.display = 'flex';
    if (imgEl) imgEl.src = src;
  }

  hideImagePreview() {
    const promptEl = document.getElementById('seller-dropzone-prompt');
    const previewEl = document.getElementById('seller-image-preview');

    if (promptEl) promptEl.style.display = 'flex';
    if (previewEl) previewEl.style.display = 'none';
  }

  bindPhotoChips() {
    const photoBtns = document.querySelectorAll('[data-preset-img]');
    photoBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const url = btn.dataset.presetImg;
        const urlInput = document.getElementById('seller-prod-image');
        if (urlInput) urlInput.value = url;
        this.showImagePreview(url);
        this.updateLivePreview();
      });
    });
  }

  // ==========================================================================
  // 4. LIVE "AAPKI KAMAI" (NET KARIGAR PAYOUT) BREAKDOWN
  // ==========================================================================
  bindAapkiKamaiCalculator() {
    const priceInput = document.getElementById('seller-prod-price');
    if (priceInput) {
      priceInput.addEventListener('input', () => this.updateAapkiKamai());
      priceInput.addEventListener('change', () => this.updateAapkiKamai());
    }
  }

  updateAapkiKamai() {
    const priceInput = document.getElementById('seller-prod-price');
    const rawVal = parseFloat(priceInput?.value) || 0;

    // Convert to INR base calculation
    const inrVal = Math.round(rawVal * 83.5);
    const logisticsFee = inrVal > 0 ? 50 : 0;
    const netPayout = Math.max(0, inrVal - logisticsFee);

    const custPriceEl = document.getElementById('kamai-customer-price');
    const logisticsEl = document.getElementById('kamai-logistics-fee');
    const netPayoutEl = document.getElementById('kamai-net-payout');

    if (custPriceEl) custPriceEl.textContent = `₹${inrVal.toLocaleString('en-IN')}`;
    if (logisticsEl) logisticsEl.textContent = `-₹${logisticsFee}`;
    if (netPayoutEl) netPayoutEl.textContent = `₹${netPayout.toLocaleString('en-IN')}`;
  }

  // ==========================================================================
  // 5. LIVE BUYER'S VIEW CARD PREVIEW SYNC
  // ==========================================================================
  bindLivePreviewSync() {
    const inputs = [
      document.getElementById('seller-prod-title'),
      document.getElementById('seller-prod-category'),
      document.getElementById('seller-prod-gender'),
      document.getElementById('seller-prod-price'),
      document.getElementById('seller-prod-image'),
      document.getElementById('seller-prod-karigar'),
      document.getElementById('seller-prod-stock')
    ];

    inputs.forEach(input => {
      if (input) {
        input.addEventListener('input', () => this.updateLivePreview());
        input.addEventListener('change', () => this.updateLivePreview());
      }
    });
  }

  updateLivePreview() {
    const title = document.getElementById('seller-prod-title')?.value.trim() || "Product Title Preview";
    const categoryVal = document.getElementById('seller-prod-category')?.value || "clothing";
    const genderVal = document.getElementById('seller-prod-gender')?.value || "unisex";
    const priceVal = parseFloat(document.getElementById('seller-prod-price')?.value) || 49.99;
    const isKarigar = document.getElementById('seller-prod-karigar')?.checked ?? true;
    const imageVal = document.getElementById('seller-prod-image')?.value.trim() || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";

    const deptObj = (typeof DEPARTMENTS !== 'undefined') ? DEPARTMENTS.find(d => d.id === categoryVal) : null;
    const categoryName = deptObj ? deptObj.name : "Everyday Essentials";

    const curPriceFormatted = window.amzApp ? window.amzApp.formatPrice(priceVal) : ('$' + priceVal.toFixed(2));
    const origPriceVal = Math.round(priceVal * 1.35 * 100) / 100;
    const origPriceFormatted = window.amzApp ? window.amzApp.formatPrice(origPriceVal) : ('$' + origPriceVal.toFixed(2));

    const prevTitle = document.getElementById('prev-title');
    const prevCategory = document.getElementById('prev-category');
    const prevAudience = document.getElementById('prev-audience');
    const prevPrice = document.getElementById('prev-price');
    const prevOrigPrice = document.getElementById('prev-orig-price');
    const prevDelivery = document.getElementById('prev-delivery');
    const prevBadge = document.getElementById('prev-badge');
    const prevImage = document.getElementById('prev-image');

    if (prevTitle) prevTitle.textContent = title;
    if (prevCategory) prevCategory.textContent = categoryName;

    if (prevAudience) {
      if (isKarigar) {
        prevAudience.className = "prod-tag-pill tag-karigar";
        prevAudience.textContent = "🏡 Rural Karigar";
      } else if (genderVal === 'men') {
        prevAudience.className = "prod-tag-pill tag-men";
        prevAudience.textContent = "👨 Men";
      } else if (genderVal === 'women') {
        prevAudience.className = "prod-tag-pill tag-women";
        prevAudience.textContent = "👩 Women";
      } else {
        prevAudience.className = "prod-tag-pill tag-unisex";
        prevAudience.textContent = "✨ Unisex";
      }
    }

    if (prevBadge) {
      prevBadge.textContent = isKarigar ? "✨ UdaanMart Karigar" : "New Seller Launch";
    }

    if (prevDelivery) {
      prevDelivery.textContent = isKarigar ? "FREE Doorstep Village Delivery via India Post" : "FREE Delivery Tomorrow, 7 AM - 11 AM";
    }

    if (prevPrice) prevPrice.textContent = curPriceFormatted;
    if (prevOrigPrice) prevOrigPrice.textContent = `List: ${origPriceFormatted}`;
    if (prevImage) prevImage.src = imageVal;
  }

  // ==========================================================================
  // SMART AI TEMPLATES & FAST FILL
  // ==========================================================================
  bindSmartTemplates() {
    const templateBtns = document.querySelectorAll('[data-smart-template]');
    templateBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.smartTemplate;
        const data = this.smartTemplates[key];
        if (data) {
          this.applyTemplate(data);
          templateBtns.forEach(b => b.classList.remove('is-active'));
          btn.classList.add('is-active');
        }
      });
    });
  }

  applyTemplate(data) {
    const titleEl = document.getElementById('seller-prod-title');
    const catEl = document.getElementById('seller-prod-category');
    const genderEl = document.getElementById('seller-prod-gender');
    const priceEl = document.getElementById('seller-prod-price');
    const stockEl = document.getElementById('seller-prod-stock');
    const imageEl = document.getElementById('seller-prod-image');
    const featuresEl = document.getElementById('seller-prod-features');
    const karigarEl = document.getElementById('seller-prod-karigar');

    if (titleEl) titleEl.value = data.title;
    if (catEl) catEl.value = data.category;
    if (genderEl) genderEl.value = data.gender;
    if (priceEl) priceEl.value = data.price.toString();
    if (stockEl) stockEl.value = data.stock.toString();
    if (imageEl) imageEl.value = data.image;
    if (featuresEl) featuresEl.value = data.features;
    if (karigarEl) karigarEl.checked = data.isKarigar;

    this.showImagePreview(data.image);
    this.updateLivePreview();
    this.updateAapkiKamai();

    if (window.amzCart) {
      window.amzCart.showToast(`✨ Smart Template Applied: "${data.shortTitle}" filled with 1-click!`);
    }
  }

  // ==========================================================================
  // 6. LISTING FORM SUBMISSION
  // ==========================================================================
  bindListingForm() {
    const form = document.getElementById('seller-product-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('seller-prod-title')?.value.trim();
      const category = document.getElementById('seller-prod-category')?.value || 'clothing';
      const gender = document.getElementById('seller-prod-gender')?.value || 'unisex';
      const price = parseFloat(document.getElementById('seller-prod-price')?.value);
      const stock = parseInt(document.getElementById('seller-prod-stock')?.value, 10) || 10;
      const image = document.getElementById('seller-prod-image')?.value.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80';
      const featuresRaw = document.getElementById('seller-prod-features')?.value.trim() || '• Certified Indian Handloom / Craft\n• Free Doorstep Village & Global Delivery\n• 7-Day Easy Return Guarantee';
      const isRuralKarigar = document.getElementById('seller-prod-karigar')?.checked ?? true;

      if (!title || isNaN(price) || price <= 0) {
        alert('Please enter a valid product title and selling price.');
        return;
      }

      const deptObj = (typeof DEPARTMENTS !== 'undefined') ? DEPARTMENTS.find(d => d.id === category) : null;
      const categoryName = deptObj ? deptObj.name : "Everyday Essentials";

      const newProduct = {
        id: `karigar-${Date.now().toString(36)}`,
        title: title,
        shortTitle: title.length > 38 ? title.slice(0, 35) + '...' : title,
        category: category,
        categoryName: categoryName,
        gender: gender,
        isRuralKarigar: isRuralKarigar,
        sellerType: isRuralKarigar ? "artisan" : "merchant",
        price: price,
        originalPrice: Math.round(price * 1.35 * 100) / 100,
        discountPercent: 26,
        rating: 5.0,
        ratingCount: 1,
        badge: isRuralKarigar ? "✨ New Karigar Arrival" : "New Seller Launch",
        isPrime: true,
        delivery: isRuralKarigar ? "FREE Doorstep Village Delivery via India Post" : "FREE Delivery Tomorrow, 7 AM - 11 AM",
        stock: stock,
        isLightningDeal: false,
        dealPercentage: 0,
        images: [
          image,
          "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
          "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80"
        ],
        features: featuresRaw.split('\n').map(f => f.trim()).filter(Boolean),
        specs: {
          "Seller": isRuralKarigar ? "Certified UdaanMart Karigar Rural Artisan Guild" : "UdaanMart Verified Marketplace Merchant",
          "Target Audience": gender === 'men' ? "Men's Collection" : (gender === 'women' ? "Women's Collection" : "Universal / Unisex"),
          "Dispatch Location": isRuralKarigar ? "Direct Village Craft Guild (India)" : "UdaanMart Logistics Fulfillment Hub",
          "Warranty": "1-Year Artisan / Seller Guarantee"
        }
      };

      // Save into Unified Store
      if (window.amzStore) {
        window.amzStore.addCustomProduct(newProduct);
      }

      form.reset();
      this.hideImagePreview();
      this.closeModal();

      if (window.amzCart) {
        window.amzCart.showToast(`🎉 Product Published to Live Store! "${newProduct.shortTitle}" is now live with "✨ New Karigar Arrival" badge!`);
      }

      // Trigger Celebration Chime & Confetti for Karigar
      if (window.amzApp && window.amzApp.playSuccessChime) {
        window.amzApp.playSuccessChime();
      }
      if (window.amzApp && window.amzApp.launchConfetti) {
        window.amzApp.launchConfetti();
      }

      // Smooth scroll to catalog
      const prodsSection = document.getElementById('products-section');
      if (prodsSection) {
        prodsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ==========================================================================
  // 7. INCOMING ORDERS & 1-CLICK FULFILLMENT
  // ==========================================================================
  renderIncomingOrders() {
    const listEl = document.getElementById('seller-incoming-orders-list');
    if (!listEl) return;

    const orders = window.amzStore ? window.amzStore.getOrders() : [];

    if (orders.length === 0) {
      listEl.innerHTML = `
        <div class="empty-panel-state">
          <div class="empty-icon">📦</div>
          <h4>No Incoming Orders Yet</h4>
          <p>Orders placed by buyers will instantly appear here for 1-click packing & India Post shipping label generation.</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = orders.map(order => {
      const step = order.currentStep || order.trackingStep || 1;
      const isPacked = step >= 2;
      const buyer = order.deliveryLocation || {};
      const buyerName = window.amzStore.escapeHTML(buyer.name || 'Valued Buyer');
      const buyerCity = window.amzStore.escapeHTML(buyer.city || 'City');
      const buyerPin = window.amzStore.escapeHTML(buyer.pincode || 'PIN');
      const formattedTotal = window.amzApp ? window.amzApp.formatPrice(order.totalAmount || order.total || 0) : `₹${order.totalAmount || order.total}`;

      return `
        <div class="seller-order-card" data-order-id="${order.orderId}">
          <div class="seller-order-header">
            <div class="order-id-block">
              <span class="seller-order-badge">ORDER #${order.orderId}</span>
              <span class="seller-order-date">📅 ${order.date}</span>
            </div>
            <div class="seller-order-status-pill status-step-${step}">
              ${isPacked ? '✅ Dispatched to Speed Post' : '⏳ Awaiting Artisan Packing'}
            </div>
          </div>

          <div class="seller-order-grid">
            <div class="seller-order-items">
              ${(order.items || []).map(item => `
                <div class="seller-item-row">
                  <img src="${item.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80'}" alt="${window.amzStore.escapeHTML(item.title)}" class="seller-item-thumb" />
                  <div class="seller-item-details">
                    <span class="seller-item-title">${window.amzStore.escapeHTML(item.shortTitle || item.title)}</span>
                    <span class="seller-item-qty">Qty: ${item.quantity || 1} • Payout: ${window.amzApp ? window.amzApp.formatPrice(item.price) : '₹' + item.price}</span>
                  </div>
                </div>
              `).join('')}
            </div>

            <div class="seller-order-dest">
              <span class="dest-label">📍 Destination Doorstep:</span>
              <strong class="dest-name">${buyerName}</strong>
              <div class="dest-addr">${window.amzStore.escapeHTML(buyer.address || '')}</div>
              <div class="dest-city"><strong>${buyerCity} (${buyerPin})</strong> • ${window.amzStore.escapeHTML(buyer.phone || '')}</div>
            </div>

            <div class="seller-order-actions">
              <div class="seller-payout-display">
                <span class="payout-label">Your Net Direct Payout:</span>
                <span class="payout-amount">${formattedTotal}</span>
                <span class="payout-status">0% Marketplace Fee Guaranteed</span>
              </div>
              <button 
                class="amz-btn amz-btn-primary btn-pack-dispatch ${isPacked ? 'is-fulfilled' : ''}" 
                onclick="window.amzSeller.handlePackAndPrint('${order.orderId}')"
              >
                ${isPacked ? '📄 Reprint India Post Label' : '✅ Pack & Print India Post Label'}
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  handlePackAndPrint(orderId) {
    if (!window.amzStore) return;
    const order = window.amzStore.packAndPrintOrder(orderId);
    if (!order) return;

    this.currentSelectedOrder = order;
    this.renderIncomingOrders();
    this.showShippingLabelModal(order);
  }

  // ==========================================================================
  // 8. PRINTABLE SHIPPING LABEL SLIP MODAL
  // ==========================================================================
  bindShippingLabelModal() {
    const closeBtn = document.getElementById('shipping-label-close-btn');
    const printBtn = document.getElementById('btn-print-shipping-label');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeShippingLabelModal());
    }

    if (printBtn) {
      printBtn.addEventListener('click', () => {
        window.print();
      });
    }
  }

  showShippingLabelModal(order) {
    const modal = document.getElementById('shipping-label-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    const buyer = order.deliveryLocation || {};
    const buyerName = window.amzStore.escapeHTML(buyer.name || 'Valued Buyer');
    const buyerAddress = window.amzStore.escapeHTML(buyer.address || 'Address');
    const buyerCity = window.amzStore.escapeHTML(buyer.city || 'City');
    const buyerState = window.amzStore.escapeHTML(buyer.state || 'State');
    const buyerPin = window.amzStore.escapeHTML(buyer.pincode || 'PIN');
    const buyerPhone = window.amzStore.escapeHTML(buyer.phone || '+91 98765 43210');

    // Populate Fields
    const orderIdEl = document.getElementById('slip-order-id');
    const trackingEl = document.getElementById('slip-tracking-num');
    const barcodeEl = document.getElementById('slip-barcode-text');
    const recipientEl = document.getElementById('slip-recipient-info');
    const originEl = document.getElementById('slip-origin-info');
    const dateEl = document.getElementById('slip-date');

    if (orderIdEl) orderIdEl.textContent = order.orderId;
    if (trackingEl) trackingEl.textContent = order.trackingNumber || `INP-${buyerPin}-901283`;
    if (barcodeEl) barcodeEl.textContent = `||| | ||||| || |||| ||| ${order.trackingNumber || order.orderId} |||| ||| | |||`;
    if (dateEl) dateEl.textContent = order.date;

    if (recipientEl) {
      recipientEl.innerHTML = `
        <strong>TO: ${buyerName}</strong><br>
        ${buyerAddress}<br>
        <strong>${buyerCity}, ${buyerState} - PIN: ${buyerPin}</strong><br>
        Mob: ${buyerPhone}
      `;
    }

    if (originEl) {
      originEl.innerHTML = `
        <strong>FROM: UdaanMart Karigar Artisan Guild</strong><br>
        Rural Craft & Handloom Cluster<br>
        Direct Producer Doorstep Dispatch Center<br>
        India Post Registered Speed Post Network
      `;
    }

    modal.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
  }

  closeShippingLabelModal() {
    const modal = document.getElementById('shipping-label-modal');
    if (modal) modal.classList.remove('is-open');
  }

  isShippingLabelModalOpen() {
    const modal = document.getElementById('shipping-label-modal');
    return modal && modal.classList.contains('is-open');
  }

  // ==========================================================================
  // 9. INVENTORY MANAGER TABLE
  // ==========================================================================
  renderInventoryTable() {
    const tbody = document.getElementById('seller-inventory-tbody');
    if (!tbody) return;

    const allProducts = window.amzStore ? window.amzStore.getAllProducts() : [];

    tbody.innerHTML = allProducts.map(prod => {
      const formattedPrice = window.amzApp ? window.amzApp.formatPrice(prod.price) : `$${prod.price.toFixed(2)}`;
      const audienceTag = prod.isRuralKarigar 
        ? '<span class="prod-tag-pill tag-karigar">🏡 Karigar</span>'
        : prod.gender === 'men' 
          ? '<span class="prod-tag-pill tag-men">👨 Men</span>'
          : prod.gender === 'women'
            ? '<span class="prod-tag-pill tag-women">👩 Women</span>'
            : '<span class="prod-tag-pill tag-unisex">✨ Unisex</span>';

      return `
        <tr class="seller-inv-row" data-product-id="${prod.id}">
          <td class="seller-inv-prod">
            <img src="${prod.images ? prod.images[0] : ''}" alt="${window.amzStore.escapeHTML(prod.title)}" class="seller-inv-thumb" />
            <div class="seller-inv-info">
              <span class="seller-inv-title" title="${window.amzStore.escapeHTML(prod.title)}">${window.amzStore.escapeHTML(prod.shortTitle || prod.title)}</span>
              <div class="seller-inv-meta">
                <span class="seller-inv-id">${prod.id}</span>
                ${audienceTag}
              </div>
            </div>
          </td>
          <td class="seller-inv-category">${prod.categoryName || 'Essentials'}</td>
          <td class="seller-inv-price">
            <span class="inv-price-val">${formattedPrice}</span>
          </td>
          <td class="seller-inv-stock">
            <div class="seller-stock-stepper">
              <button class="stock-btn stock-minus" onclick="window.amzSeller.adjustStock('${prod.id}', -1)" title="Decrease stock">-</button>
              <span class="stock-value" id="inv-stock-${prod.id}">${prod.stock}</span>
              <button class="stock-btn stock-plus" onclick="window.amzSeller.adjustStock('${prod.id}', 1)" title="Increase stock">+</button>
            </div>
          </td>
          <td class="seller-inv-status">
            <span class="seller-status-badge ${prod.stock > 0 ? 'badge-in-stock' : 'badge-out-stock'}">
              ${prod.stock > 0 ? 'Active (Live)' : 'Out of Stock'}
            </span>
          </td>
          <td class="seller-inv-actions">
            <button class="amz-btn amz-btn-secondary btn-delist-prod" onclick="window.amzSeller.delistProduct('${prod.id}')" title="Delist from store">
              Delist
            </button>
          </td>
        </tr>
      `;
    }).join('');

    const countEl = document.getElementById('seller-inventory-total-count');
    if (countEl) countEl.textContent = `${allProducts.length} Products Listed`;
  }

  adjustStock(productId, delta) {
    const all = window.amzStore ? window.amzStore.getAllProducts() : [];
    const prod = all.find(p => p.id === productId);
    if (!prod) return;

    prod.stock = Math.max(0, prod.stock + delta);
    const stockValEl = document.getElementById(`inv-stock-${productId}`);
    if (stockValEl) {
      stockValEl.textContent = prod.stock;
    }

    if (window.amzCart) {
      window.amzCart.showToast(`📦 Stock updated for ${prod.shortTitle || prod.title}: ${prod.stock} units available.`);
    }

    this.renderInventoryTable();
  }

  delistProduct(productId) {
    if (window.amzStore) {
      window.amzStore.customProducts = window.amzStore.customProducts.filter(p => p.id !== productId);
      try {
        localStorage.setItem(window.amzStore.STORAGE_KEYS.PRODUCTS, JSON.stringify(window.amzStore.customProducts));
      } catch (e) {}

      if (window.amzSearchFilter) {
        window.amzSearchFilter.applyFilters();
      }
    }

    this.renderInventoryTable();
    this.renderAnalytics();

    if (window.amzCart) {
      window.amzCart.showToast(`🗑️ Delisted product from live catalog.`);
    }
  }

  renderAnalytics() {
    const curFormatter = (val) => window.amzApp ? window.amzApp.formatPrice(val) : `$${val.toFixed(2)}`;
    const orders = window.amzStore ? window.amzStore.getOrders() : [];
    const prods = window.amzStore ? window.amzStore.getAllProducts() : [];

    const grossSales = orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 14850.00);

    const revEl = document.getElementById('seller-stat-revenue');
    if (revEl) revEl.textContent = curFormatter(grossSales);

    const ordersEl = document.getElementById('seller-stat-orders');
    if (ordersEl) ordersEl.textContent = (312 + orders.length).toLocaleString();

    const listingsEl = document.getElementById('seller-stat-listings');
    if (listingsEl) listingsEl.textContent = prods.length.toString();

    const ratingEl = document.getElementById('seller-stat-rating');
    if (ratingEl) ratingEl.textContent = '4.9 ★ (100% Positive)';

    // Render Dynamic Weekly Earnings & Payout Chart
    this.renderEarningsChart(grossSales, orders.length);
  }

  renderEarningsChart(grossSales, additionalOrders) {
    const chartContainer = document.getElementById('seller-chart-container');
    if (!chartContainer) return;

    // 7 Days Weekly Trend with dynamic scaling
    const days = [
      { day: 'Mon', revenue: 1850, orders: 4 },
      { day: 'Tue', revenue: 2400, orders: 6 },
      { day: 'Wed', revenue: 1950, orders: 5 },
      { day: 'Thu', revenue: 3100, orders: 8 },
      { day: 'Fri', revenue: 2800, orders: 7 },
      { day: 'Sat', revenue: 4200, orders: 11 },
      { day: 'Sun (Today)', revenue: 3600 + (additionalOrders * 850), orders: 9 + additionalOrders }
    ];

    const maxRev = Math.max(...days.map(d => d.revenue));
    const curFormatter = (val) => window.amzApp ? window.amzApp.formatPrice(val) : `₹${val.toLocaleString()}`;

    chartContainer.innerHTML = `
      <div class="artisan-chart-wrapper">
        <div class="artisan-chart-bars">
          ${days.map(d => {
            const heightPct = Math.min(100, Math.max(18, Math.round((d.revenue / maxRev) * 100)));
            return `
              <div class="chart-col">
                <span class="chart-bar-value">${curFormatter(d.revenue)}</span>
                <div class="chart-bar-track">
                  <div class="chart-bar-fill" style="height: ${heightPct}%;" title="${d.day}: ${curFormatter(d.revenue)} (${d.orders} parcels)"></div>
                </div>
                <span class="chart-bar-label">${d.day}</span>
              </div>
            `;
          }).join('')}
        </div>
        <div class="chart-footer-metrics">
          <div class="metric-pill">
            <span class="pill-dot green"></span>
            <span><strong>0% Commission:</strong> ₹0 Platform Fee Deducted</span>
          </div>
          <div class="metric-pill">
            <span class="pill-dot amber"></span>
            <span><strong>Direct Bank DBT:</strong> 100% Payout Dispatched via NEFT</span>
          </div>
          <div class="metric-pill">
            <span class="pill-dot blue"></span>
            <span><strong>Logistics Partner:</strong> India Post Speed Post Rural Handover</span>
          </div>
        </div>
      </div>
    `;
  }
}

// Global Singleton Instance
window.amzSeller = new SellerCentralEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.amzSeller.init();
});
