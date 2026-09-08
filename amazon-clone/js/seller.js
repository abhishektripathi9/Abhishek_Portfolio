/**
 * AMAZON CLONE - SELLER CENTRAL & RURAL ARTISAN HUB ENGINE
 * Interactive Merchant Portal allowing sellers & rural artisans to:
 * 1. Ultra-easy product upload with Drag-and-Drop, Photo Chips, and Smart AI Templates
 * 2. Live real-time Buyer's View product card preview
 * 3. Manage real-time inventory and pricing
 * 4. Track sales analytics and village / global city order dispatches
 * 5. Access the Amazon Karigar Rural Artisan Program
 */

class SellerCentralEngine {
  constructor() {
    this.activeTab = 'list';
    this.stats = {
      grossSales: 14850.00,
      totalOrders: 312,
      activeListings: PRODUCTS_DATA.length,
      rating: 4.9
    };

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
        features: "High-density responsive air cushion sole\nBreathable honeycomb mesh knit upper\nAnti-slip textured rubber outsole for all terrains",
        isKarigar: false
      },
      saree: {
        title: "Amazon Karigar Handcrafted Pure Chanderi Silk Zari Saree from Madhya Pradesh",
        shortTitle: "Artisan Chanderi Silk Zari Saree",
        category: "clothing",
        gender: "women",
        price: 119.00,
        stock: 15,
        image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80",
        features: "Woven by traditional rural weavers under Amazon Karigar cluster\n100% Pure certified natural silk with metallic golden border\nIncludes matching unstitched blouse piece (0.8m)",
        isKarigar: true
      },
      watch: {
        title: "Men's Luxury Sapphire Stainless Steel Automatic Chronograph Watch",
        shortTitle: "Men's Automatic Chronograph Watch",
        category: "fashion",
        gender: "men",
        price: 149.99,
        stock: 20,
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=800&q=80",
        features: "Water resistant to 100M with screw-down crown\nJapanese 24-jewel automatic movement\nScratch-resistant sapphire crystal glass",
        isKarigar: false
      },
      handbag: {
        title: "Women's Luxury Italian Quilted Crossbody Handbag with Gold Chain",
        shortTitle: "Women's Quilted Leather Handbag",
        category: "fashion",
        gender: "women",
        price: 89.99,
        stock: 22,
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80",
        features: "100% Genuine Italian pebble leather with diamond quilt\nTarnish-resistant 24K gold PVD coated turn-lock clasp\nDual interior compartments with zippered RFID security pouch",
        isKarigar: false
      },
      earbuds: {
        title: "Pro Wireless Noise-Canceling Earbuds with Spatial 3D Sound & 40H Battery",
        shortTitle: "Pro Wireless ANC Earbuds",
        category: "audio",
        gender: "unisex",
        price: 49.99,
        stock: 50,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        features: "Active Noise Cancellation (ANC) with transparency mode\nBluetooth 5.3 with ultra-low latency gaming audio\nIPX7 sweatproof and water-resistant rating",
        isKarigar: false
      },
      pottery: {
        title: "Amazon Karigar Handcrafted Terracotta Blue Pottery Ceramic Tableware Set from Jaipur",
        shortTitle: "Artisan Jaipur Blue Pottery Set",
        category: "kitchen",
        gender: "unisex",
        price: 39.99,
        stock: 18,
        image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=800&q=80",
        features: "100% Lead-free traditional quartz stone glaze by master potters\nMicrowave & dishwasher safe natural ceramic\nDirect rural doorstep pickup empowering cottage craft guilds",
        isKarigar: true
      }
    };
  }

  init() {
    this.bindTriggers();
    this.bindTabs();
    this.bindSmartTemplates();
    this.bindImageUploader();
    this.bindPhotoChips();
    this.bindLivePreviewSync();
    this.bindListingForm();
    this.renderInventoryTable();
    this.renderAnalytics();
    this.updateLivePreview();
  }

  bindTriggers() {
    const triggers = [
      document.getElementById('open-seller-hub-btn'),
      document.getElementById('footer-sell-link'),
      document.getElementById('nav-seller-link')
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
    const overlay = document.getElementById('global-overlay');

    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isModalOpen()) {
        this.closeModal();
      }
    });
  }

  openModal(tab = 'list') {
    const modal = document.getElementById('seller-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    this.stats.activeListings = PRODUCTS_DATA.length;
    this.renderInventoryTable();
    this.renderAnalytics();
    this.switchTab(tab);
    this.updateLivePreview();

    modal.classList.add('is-open');
    if (overlay) overlay.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  closeModal() {
    const modal = document.getElementById('seller-modal');
    const overlay = document.getElementById('global-overlay');
    if (!modal) return;

    modal.classList.remove('is-open');
    if (overlay && !document.querySelector('.amz-modal.is-open, .cart-drawer.is-open, .dept-drawer.is-open')) {
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
    } else if (tab === 'list') {
      this.updateLivePreview();
    }
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

    // Update dropzone preview
    this.showImagePreview(data.image);

    // Update live preview card
    this.updateLivePreview();

    if (window.amzCart) {
      window.amzCart.showToast(`✨ Smart Template Applied: "${data.shortTitle}" filled with 1-click!`);
    }
  }

  // ==========================================================================
  // DRAG & DROP / LOCAL FILE IMAGE UPLOADER
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
          this.processImageFile(file);
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
          this.processImageFile(file);
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

  processImageFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target.result;
      const urlInput = document.getElementById('seller-prod-image');
      if (urlInput) urlInput.value = dataUrl;
      this.showImagePreview(dataUrl);
      this.updateLivePreview();

      if (window.amzCart) {
        window.amzCart.showToast("📷 Product photo loaded and previewed in real time!");
      }
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

  // ==========================================================================
  // CURATED PHOTO GALLERY CHIPS
  // ==========================================================================
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
  // LIVE BUYER'S VIEW PREVIEW CARD SYNC
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
    const isKarigar = document.getElementById('seller-prod-karigar')?.checked || false;
    const imageVal = document.getElementById('seller-prod-image')?.value.trim() || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80";

    // Category Name
    const deptObj = DEPARTMENTS.find(d => d.id === categoryVal);
    const categoryName = deptObj ? deptObj.name : "Everyday Essentials";

    // Format Prices
    const curPriceFormatted = window.amzApp ? window.amzApp.formatPrice(priceVal) : ('$' + priceVal.toFixed(2));
    const origPriceVal = Math.round(priceVal * 1.3 * 100) / 100;
    const origPriceFormatted = window.amzApp ? window.amzApp.formatPrice(origPriceVal) : ('$' + origPriceVal.toFixed(2));

    // Update converted hint below price input
    const hintEl = document.getElementById('seller-price-converted-hint');
    if (hintEl) {
      const inrVal = (priceVal * 83.5).toFixed(0);
      const eurVal = (priceVal * 0.92).toFixed(2);
      hintEl.textContent = `Auto-converts to ₹${Number(inrVal).toLocaleString('en-IN')} INR • €${eurVal} EUR`;
    }

    // Update Live Preview Card Elements
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
        prevAudience.textContent = "🏡 Karigar";
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
      prevBadge.textContent = isKarigar ? "Amazon Karigar" : "New Seller Launch";
    }

    if (prevDelivery) {
      prevDelivery.textContent = isKarigar ? "FREE Doorstep Village Delivery in 2 Days" : "FREE Delivery Tomorrow, 7 AM - 11 AM";
    }

    if (prevPrice) prevPrice.textContent = curPriceFormatted;
    if (prevOrigPrice) prevOrigPrice.textContent = `List: ${origPriceFormatted}`;
    if (prevImage) prevImage.src = imageVal;
  }

  // ==========================================================================
  // LISTING SUBMISSION
  // ==========================================================================
  bindListingForm() {
    const form = document.getElementById('seller-product-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('seller-prod-title')?.value.trim();
      const category = document.getElementById('seller-prod-category')?.value;
      const gender = document.getElementById('seller-prod-gender')?.value || 'unisex';
      const price = parseFloat(document.getElementById('seller-prod-price')?.value);
      const stock = parseInt(document.getElementById('seller-prod-stock')?.value, 10) || 10;
      const image = document.getElementById('seller-prod-image')?.value.trim() || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80';
      const featuresRaw = document.getElementById('seller-prod-features')?.value.trim() || 'Premium quality assured\nQuick nationwide and village doorstep delivery\nBacked by 30-day replacement guarantee';
      const isRuralKarigar = document.getElementById('seller-prod-karigar')?.checked || false;

      if (!title || isNaN(price) || price <= 0) {
        alert('Please enter a valid product title and price.');
        return;
      }

      const deptObj = DEPARTMENTS.find(d => d.id === category);
      const categoryName = deptObj ? deptObj.name : "Everyday Essentials";

      const newId = `prod-seller-${Date.now().toString(36)}`;
      const newProduct = {
        id: newId,
        title: title,
        shortTitle: title.length > 38 ? title.slice(0, 35) + '...' : title,
        category: category,
        categoryName: categoryName,
        gender: gender,
        isRuralKarigar: isRuralKarigar,
        sellerType: isRuralKarigar ? "artisan" : "merchant",
        price: price,
        originalPrice: Math.round(price * 1.3 * 100) / 100,
        discountPercent: 23,
        rating: 5.0,
        ratingCount: 1,
        badge: isRuralKarigar ? "Amazon Karigar" : "New Seller Launch",
        isPrime: true,
        delivery: isRuralKarigar ? "FREE Doorstep Village Delivery in 2 Days" : "FREE Delivery Tomorrow, 7 AM - 11 AM",
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
          "Seller": isRuralKarigar ? "Certified Amazon Karigar Rural Artisan Guild" : "Amazon Verified Marketplace Merchant",
          "Target Audience": gender === 'men' ? "Men's Collection" : (gender === 'women' ? "Women's Collection" : "Universal / Unisex"),
          "Dispatch Location": isRuralKarigar ? "Direct Village Craft Center (India)" : "Amazon FBA Fulfillment Hub",
          "Warranty": "1-Year Seller Replacement Guarantee"
        }
      };

      // Add to beginning of PRODUCTS_DATA
      PRODUCTS_DATA.unshift(newProduct);

      // Refresh catalog live
      if (window.amzSearchFilter) {
        window.amzSearchFilter.refreshCatalog(PRODUCTS_DATA);
      }

      this.stats.activeListings = PRODUCTS_DATA.length;
      this.renderInventoryTable();
      this.renderAnalytics();

      // Clear and close
      form.reset();
      this.hideImagePreview();
      this.closeModal();

      if (window.amzCart) {
        window.amzCart.showToast(`🎉 Product Published to Live Store! "${newProduct.shortTitle}" is now available for 1-Click Purchase!`);
      }

      // Smooth scroll to catalog
      const prodsSection = document.getElementById('products-section');
      if (prodsSection) {
        prodsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }

  // ==========================================================================
  // INVENTORY & PRICE MANAGER TABLE
  // ==========================================================================
  renderInventoryTable() {
    const tbody = document.getElementById('seller-inventory-tbody');
    if (!tbody) return;

    tbody.innerHTML = PRODUCTS_DATA.map(prod => {
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
            <img src="${prod.images[0]}" alt="${prod.title}" class="seller-inv-thumb" />
            <div class="seller-inv-info">
              <span class="seller-inv-title" title="${prod.title}">${prod.shortTitle}</span>
              <div class="seller-inv-meta">
                <span class="seller-inv-id">${prod.id}</span>
                ${audienceTag}
              </div>
            </div>
          </td>
          <td class="seller-inv-category">${prod.categoryName}</td>
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
    if (countEl) countEl.textContent = `${PRODUCTS_DATA.length} Products Listed`;
  }

  adjustStock(productId, delta) {
    const prod = PRODUCTS_DATA.find(p => p.id === productId);
    if (!prod) return;

    prod.stock = Math.max(0, prod.stock + delta);

    const stockValEl = document.getElementById(`inv-stock-${productId}`);
    if (stockValEl) {
      stockValEl.textContent = prod.stock;
    }

    if (window.amzCart) {
      window.amzCart.showToast(`📦 Stock updated for ${prod.shortTitle}: ${prod.stock} units available.`);
    }

    this.renderInventoryTable();
  }

  delistProduct(productId) {
    const idx = PRODUCTS_DATA.findIndex(p => p.id === productId);
    if (idx === -1) return;

    const [removed] = PRODUCTS_DATA.splice(idx, 1);

    if (window.amzSearchFilter) {
      window.amzSearchFilter.refreshCatalog(PRODUCTS_DATA);
    }

    this.stats.activeListings = PRODUCTS_DATA.length;
    this.renderInventoryTable();
    this.renderAnalytics();

    if (window.amzCart) {
      window.amzCart.showToast(`🗑️ Delisted "${removed.shortTitle}" from the store catalog.`);
    }
  }

  renderAnalytics() {
    const curFormatter = (val) => window.amzApp ? window.amzApp.formatPrice(val) : `$${val.toFixed(2)}`;

    const revEl = document.getElementById('seller-stat-revenue');
    if (revEl) revEl.textContent = curFormatter(this.stats.grossSales);

    const ordersEl = document.getElementById('seller-stat-orders');
    if (ordersEl) ordersEl.textContent = this.stats.totalOrders.toLocaleString();

    const listingsEl = document.getElementById('seller-stat-listings');
    if (listingsEl) listingsEl.textContent = PRODUCTS_DATA.length.toString();

    const ratingEl = document.getElementById('seller-stat-rating');
    if (ratingEl) ratingEl.textContent = '4.9 ★ (100% Positive)';
  }
}

// Global instance
window.amzSeller = new SellerCentralEngine();

document.addEventListener('DOMContentLoaded', () => {
  window.amzSeller.init();
});
