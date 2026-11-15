/**
 * UDAANMART - CENTRAL REAL-TIME SYNC STORE (store.js)
 * PILLAR 1: Single Source of Truth connecting Seller and Buyer actions across the entire marketplace.
 * - Unified Product Store (merges PRODUCTS_DATA with seller-created items)
 * - Unified Orders Pipeline with 4-stage tracking & history
 * - Smart Location & Pincode Engine with API + Offline Fallback
 * - Product Reviews & Dynamic Ratings
 * - Role Switcher (Buyer <-> Karigar Studio)
 * - Central XSS Sanitizer (escapeHTML)
 */

class UdaanStore {
  constructor() {
    this.STORAGE_KEYS = {
      PRODUCTS: 'udaan_custom_products',
      ORDERS: 'udaan_orders',
      REVIEWS: 'udaan_product_reviews',
      ROLE: 'udaan_user_role',
      LOCATION: 'udaan_location',
      SELLER_PROFILE: 'udaan_seller_profile',
      STOCK_OVERRIDES: 'udaan_stock_overrides',
      PRICE_OVERRIDES: 'udaan_price_overrides'
    };

    // Built-in Indian Postal Pincode Offline Fallback Map (Major Cities & Rural Artisan Clusters)
    this.PINCODE_OFFLINE_MAP = {
      '211001': { city: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh', hub: 'Prayagraj Rural Cluster' },
      '211002': { city: 'Prayagraj', district: 'Prayagraj', state: 'Uttar Pradesh', hub: 'Civil Lines Hub' },
      '221001': { city: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', hub: 'Varanasi Silk Weaver Hub' },
      '221002': { city: 'Varanasi', district: 'Varanasi', state: 'Uttar Pradesh', hub: 'Kashi Craft Corridor' },
      '110001': { city: 'New Delhi', district: 'Central Delhi', state: 'Delhi', hub: 'Connaught Place Central' },
      '110020': { city: 'New Delhi', district: 'South Delhi', state: 'Delhi', hub: 'Okhla Logistics Center' },
      '400001': { city: 'Mumbai', district: 'Mumbai City', state: 'Maharashtra', hub: 'Fort / South Mumbai' },
      '400050': { city: 'Mumbai', district: 'Mumbai Suburban', state: 'Maharashtra', hub: 'Bandra West' },
      '560001': { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', hub: 'Bengaluru GPO Hub' },
      '560034': { city: 'Bengaluru', district: 'Bengaluru Urban', state: 'Karnataka', hub: 'Koramangala Tech Corridor' },
      '302001': { city: 'Jaipur', district: 'Jaipur', state: 'Rajasthan', hub: 'Jaipur Blue Pottery & Textile Hub' },
      '370001': { city: 'Bhuj', district: 'Kutch', state: 'Gujarat', hub: 'Kutch Handloom & Mirror Craft Hub' },
      '416001': { city: 'Kolhapur', district: 'Kolhapur', state: 'Maharashtra', hub: 'Kolhapur Chappal Artisan Cluster' },
      '700001': { city: 'Kolkata', district: 'Kolkata', state: 'West Bengal', hub: 'Kolkata GPO Central' },
      '600001': { city: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', hub: 'Chennai Port & Handloom' },
      '500001': { city: 'Hyderabad', district: 'Hyderabad', state: 'Telangana', hub: 'Hyderabad Pearl & Zari Center' },
      '800001': { city: 'Patna', district: 'Patna', state: 'Bihar', hub: 'Patna Madhubani Gateway' },
      '226001': { city: 'Lucknow', district: 'Lucknow', state: 'Uttar Pradesh', hub: 'Lucknow Chikankari Cluster' },
      '208001': { city: 'Kanpur', district: 'Kanpur Nagar', state: 'Uttar Pradesh', hub: 'Kanpur Leather Craft Hub' },
      '452001': { city: 'Indore', district: 'Indore', state: 'Madhya Pradesh', hub: 'Indore Malwa Crafts Hub' },
      '276001': { city: 'Azamgarh', district: 'Azamgarh', state: 'Uttar Pradesh', hub: 'Nizamabad Black Pottery Cluster' },
      '160017': { city: 'Chandigarh', district: 'Chandigarh', state: 'Punjab', hub: 'Chandigarh Central Hub' }
    };

    this.role = localStorage.getItem(this.STORAGE_KEYS.ROLE) || 'buyer';
    this.customProducts = [];
    this.orders = [];
    this.reviews = {};
    this.location = this.loadLocation();

    this.init();
  }

  init() {
    this.loadCustomProducts();
    this.loadOrders();
    this.loadReviews();
  }

  // ==========================================
  // 1. LOCATION & PINCODE ENGINE
  // ==========================================
  loadLocation() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.LOCATION);
      if (saved) return JSON.parse(saved);
    } catch (e) {}

    // Default Location: New Delhi
    return {
      pincode: '110001',
      city: 'New Delhi',
      district: 'Central Delhi',
      state: 'Delhi',
      country: 'India',
      displayName: 'New Delhi 110001'
    };
  }

  getLocation() {
    return this.location;
  }

  setLocation(locData) {
    this.location = { ...this.location, ...locData };
    this.location.displayName = `${this.location.city} ${this.location.pincode}`;
    try {
      localStorage.setItem(this.STORAGE_KEYS.LOCATION, JSON.stringify(this.location));
    } catch (e) {}

    // Update Topbar Delivery Indicator
    const cityEl = document.getElementById('nav-delivery-city');
    if (cityEl) {
      cityEl.textContent = this.location.displayName;
    }

    // Broadcast event
    window.dispatchEvent(new CustomEvent('udaan:location-updated', { detail: this.location }));

    // Trigger toast if cart available
    if (window.amzCart) {
      window.amzCart.showToast(`📍 Delivery location set to ${this.location.displayName}!`);
    }

    return this.location;
  }

  async fetchPincode(pin) {
    const cleanPin = String(pin).trim();
    if (cleanPin.length !== 6 || !/^\d{6}$/.test(cleanPin)) {
      return null;
    }

    // 1. Check Offline Fallback First (Instant Response)
    if (this.PINCODE_OFFLINE_MAP[cleanPin]) {
      const data = this.PINCODE_OFFLINE_MAP[cleanPin];
      return {
        pincode: cleanPin,
        city: data.city,
        district: data.district,
        state: data.state,
        hub: data.hub,
        isExpressAvailable: true
      };
    }

    // 2. Fetch Live from India Post API
    try {
      const response = await fetch(`https://api.postalpincode.in/pincode/${cleanPin}`);
      if (response.ok) {
        const json = await response.json();
        if (Array.isArray(json) && json[0]?.Status === 'Success' && json[0]?.PostOffice?.length > 0) {
          const po = json[0].PostOffice[0];
          return {
            pincode: cleanPin,
            city: po.Name || po.Block || po.District,
            district: po.District,
            state: po.State,
            hub: `${po.Name} Branch Post Office`,
            isExpressAvailable: true
          };
        }
      }
    } catch (err) {
      console.warn('Live pincode lookup network fallback:', err);
    }

    // Generic Indian Pincode Fallback if valid 6-digit
    return {
      pincode: cleanPin,
      city: 'Local Area',
      district: 'District Hub',
      state: 'India',
      hub: 'India Post Speed Post Hub',
      isExpressAvailable: true
    };
  }

  // ==========================================
  // 2. UNIFIED PRODUCT CATALOG
  // ==========================================
  loadCustomProducts() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.PRODUCTS);
      this.customProducts = saved ? JSON.parse(saved) : [];
    } catch (e) {
      this.customProducts = [];
    }
  }

  getAllProducts() {
    const base = (typeof PRODUCTS_DATA !== 'undefined' && Array.isArray(PRODUCTS_DATA)) 
      ? PRODUCTS_DATA 
      : [];

    let stockOverrides = {};
    let priceOverrides = {};
    try {
      stockOverrides = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.STOCK_OVERRIDES) || '{}');
      priceOverrides = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PRICE_OVERRIDES) || '{}');
    } catch (e) {}

    const modifiedBase = base.map(p => {
      let mod = { ...p };
      if (typeof stockOverrides[p.id] === 'number') {
        mod.stock = stockOverrides[p.id];
      }
      if (typeof priceOverrides[p.id] === 'number') {
        mod.price = priceOverrides[p.id];
      }
      return mod;
    });

    // Custom artisan products appear first
    return [...this.customProducts, ...modifiedBase];
  }

  getProductById(id) {
    return this.getAllProducts().find(p => String(p.id) === String(id));
  }

  deductStock(productId, quantity = 1) {
    const qty = parseInt(quantity, 10) || 1;
    const customIdx = this.customProducts.findIndex(p => String(p.id) === String(productId));
    if (customIdx !== -1) {
      const currentStock = typeof this.customProducts[customIdx].stock === 'number' 
        ? this.customProducts[customIdx].stock 
        : 10;
      this.customProducts[customIdx].stock = Math.max(0, currentStock - qty);
      try {
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(this.customProducts));
      } catch (e) {}
    } else {
      let stockOverrides = {};
      try {
        stockOverrides = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.STOCK_OVERRIDES) || '{}');
      } catch (e) {}
      const prod = this.getProductById(productId);
      const currentStock = typeof stockOverrides[productId] === 'number'
        ? stockOverrides[productId]
        : (prod ? (typeof prod.stock === 'number' ? prod.stock : 15) : 10);
      stockOverrides[productId] = Math.max(0, currentStock - qty);
      try {
        localStorage.setItem(this.STORAGE_KEYS.STOCK_OVERRIDES, JSON.stringify(stockOverrides));
      } catch (e) {}
    }

    // Refresh catalog grids live
    if (window.amzSearchFilter && typeof window.amzSearchFilter.applyFilters === 'function') {
      window.amzSearchFilter.applyFilters();
    }
    window.dispatchEvent(new CustomEvent('udaan:stock-updated', { detail: { productId, quantity: qty } }));
  }

  updateProductRateAndStock(productId, newPrice, newStock) {
    const customIdx = this.customProducts.findIndex(p => String(p.id) === String(productId));
    if (customIdx !== -1) {
      if (newPrice !== undefined && !isNaN(newPrice)) {
        this.customProducts[customIdx].price = parseFloat(newPrice);
      }
      if (newStock !== undefined && !isNaN(newStock)) {
        this.customProducts[customIdx].stock = Math.max(0, parseInt(newStock, 10));
      }
      try {
        localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(this.customProducts));
      } catch (e) {}
    } else {
      let stockOverrides = {};
      let priceOverrides = {};
      try {
        stockOverrides = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.STOCK_OVERRIDES) || '{}');
        priceOverrides = JSON.parse(localStorage.getItem(this.STORAGE_KEYS.PRICE_OVERRIDES) || '{}');
      } catch (e) {}
      if (newStock !== undefined && !isNaN(newStock)) {
        stockOverrides[productId] = Math.max(0, parseInt(newStock, 10));
        localStorage.setItem(this.STORAGE_KEYS.STOCK_OVERRIDES, JSON.stringify(stockOverrides));
      }
      if (newPrice !== undefined && !isNaN(newPrice)) {
        priceOverrides[productId] = parseFloat(newPrice);
        localStorage.setItem(this.STORAGE_KEYS.PRICE_OVERRIDES, JSON.stringify(priceOverrides));
      }
    }

    if (window.amzSearchFilter && typeof window.amzSearchFilter.applyFilters === 'function') {
      window.amzSearchFilter.applyFilters();
    }
    window.dispatchEvent(new CustomEvent('udaan:product-updated', { detail: { productId } }));
  }

  getSellerProfile() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEYS.SELLER_PROFILE);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  saveSellerProfile(profile) {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SELLER_PROFILE, JSON.stringify(profile));
      window.dispatchEvent(new CustomEvent('udaan:seller-profile-updated', { detail: profile }));
      return profile;
    } catch (e) {
      return null;
    }
  }

  addCustomProduct(product) {
    if (!product.id) {
      product.id = 'karigar-' + Date.now();
    }
    product.isCustom = true;
    product.isRuralKarigar = true;
    product.badge = product.badge || '✨ New Karigar Arrival';
    product.createdAt = new Date().toISOString();

    this.customProducts.unshift(product);
    try {
      localStorage.setItem(this.STORAGE_KEYS.PRODUCTS, JSON.stringify(this.customProducts));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }

    // Refresh catalog without reload
    if (window.amzSearchFilter && typeof window.amzSearchFilter.applyFilters === 'function') {
      window.amzSearchFilter.applyFilters();
    }

    window.dispatchEvent(new CustomEvent('udaan:product-added', { detail: product }));
    return product;
  }

  // ==========================================
  // 3. UNIFIED ORDERS PIPELINE
  // ==========================================
  loadOrders() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.ORDERS);
      if (saved) {
        this.orders = JSON.parse(saved);
      } else {
        // Pre-seed 2 realistic orders for demonstration
        this.orders = [
          {
            orderId: 'ORD-2026-98214',
            createdAt: new Date(Date.now() - 36 * 3600 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
            date: new Date(Date.now() - 36 * 3600 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            items: [
              {
                id: 'prod-33',
                title: 'UdaanMart Karigar Handcrafted Pure Banarasi Katan Silk Saree',
                shortTitle: 'Pure Banarasi Katan Silk Saree',
                price: 119,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80'
              }
            ],
            subtotal: 119,
            shippingFee: 0,
            totalAmount: 119,
            total: 119,
            paymentMethod: 'UPI Instant Pay (GPay / PhonePe)',
            paymentStatus: 'Paid (Instant)',
            deliveryLocation: {
              name: 'Pooja Sharma',
              phone: '+91 98765 43210',
              pincode: '221001',
              city: 'Varanasi',
              district: 'Varanasi',
              state: 'Uttar Pradesh',
              address: 'B-14/82, Dashashwamedh Ghat Road'
            },
            status: 'Packed by Karigar',
            currentStep: 2,
            trackingStep: 2,
            carrier: 'India Post Speed Post',
            trackingNumber: 'INP-VAR-892187',
            trackingHistory: [
              { step: 1, title: 'Order Confirmed', time: '14 Nov 2026, 10:30 AM', note: 'Payment verified via UPI' },
              { step: 2, title: 'Packed by Karigar', time: '14 Nov 2026, 04:15 PM', note: 'Handcrafted item packed in Varanasi craft hub' }
            ]
          },
          {
            orderId: 'ORD-2026-97451',
            createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            date: new Date(Date.now() - 72 * 3600 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            items: [
              {
                id: 'prod-15',
                title: 'Nike Air Zoom Pegasus Lightweight Breathable Performance Running Shoes',
                shortTitle: 'Nike Air Zoom Pegasus Running Shoes',
                price: 129.99,
                quantity: 1,
                image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80'
              }
            ],
            subtotal: 129.99,
            shippingFee: 0,
            totalAmount: 129.99,
            total: 129.99,
            paymentMethod: 'Cash on Delivery (COD)',
            paymentStatus: 'Collected on Delivery',
            deliveryLocation: {
              name: 'Abhishek Tripathi',
              phone: '+91 98765 43211',
              pincode: '110001',
              city: 'New Delhi',
              district: 'Central Delhi',
              state: 'Delhi',
              address: 'Flat 402, Connaught Place, Block C'
            },
            status: 'Delivered',
            currentStep: 4,
            trackingStep: 4,
            carrier: 'UdaanMart Express Fleet',
            trackingNumber: 'EXP-DEL-401920',
            trackingHistory: [
              { step: 1, title: 'Order Confirmed', time: '12 Nov 2026, 09:12 AM', note: 'COD Verified' },
              { step: 2, title: 'Packed by Hub', time: '12 Nov 2026, 02:40 PM', note: 'Dispatched to Delhi Hub' },
              { step: 3, title: 'In Transit via Speed Post', time: '13 Nov 2026, 08:30 AM', note: 'Out for delivery' },
              { step: 4, title: 'Delivered', time: '13 Nov 2026, 01:15 PM', note: 'Delivered to Abhishek Tripathi' }
            ]
          }
        ];
        localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
      }
    } catch (e) {
      this.orders = [];
    }
  }

  getOrders() {
    return this.orders;
  }

  getOrderById(orderId) {
    return this.orders.find(o => o.orderId === orderId);
  }

  addOrder(orderData) {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderId = orderData.orderId || `ORD-2026-${randomNum}`;
    const nowIso = new Date().toISOString();
    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    const newOrder = {
      orderId: orderId,
      createdAt: nowIso,
      updatedAt: nowIso,
      date: formattedDate,
      items: orderData.items || [],
      subtotal: orderData.subtotal || orderData.totalAmount || 0,
      shippingFee: orderData.shippingFee || 0,
      totalAmount: orderData.totalAmount || orderData.total || 0,
      total: orderData.totalAmount || orderData.total || 0,
      paymentMethod: orderData.paymentMethod || 'UPI Instant Pay',
      paymentStatus: orderData.paymentStatus || 'Paid (Instant)',
      deliveryLocation: orderData.deliveryLocation || {
        name: orderData.buyerName || 'Valued Buyer',
        phone: orderData.buyerPhone || '+91 98765 43210',
        pincode: this.location.pincode,
        city: this.location.city,
        state: this.location.state,
        address: orderData.buyerAddress || 'Express Delivery Address'
      },
      status: 'Order Confirmed',
      currentStep: 1,
      trackingStep: 1,
      carrier: 'India Post Speed Post',
      trackingNumber: `INP-${this.location.pincode}-${Math.floor(100000 + Math.random() * 900000)}`,
      trackingHistory: [
        {
          step: 1,
          title: 'Order Confirmed',
          time: `${formattedDate}, ${formattedTime}`,
          note: `Received by Karigar Guild • Routing to ${this.location.city}`
        }
      ]
    };

    this.orders.unshift(newOrder);
    try {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('udaan:order-created', { detail: newOrder }));
    return newOrder;
  }

  updateOrderStatus(orderId, newStatus, newStep, note = '') {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) return null;

    order.status = newStatus;
    order.currentStep = newStep;
    order.trackingStep = newStep;
    order.updatedAt = new Date().toISOString();

    const formattedDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
    const formattedTime = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    if (!order.trackingHistory) order.trackingHistory = [];
    order.trackingHistory.push({
      step: newStep,
      title: newStatus,
      time: `${formattedDate}, ${formattedTime}`,
      note: note || `Package status updated to: ${newStatus}`
    });

    try {
      localStorage.setItem(this.STORAGE_KEYS.ORDERS, JSON.stringify(this.orders));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('udaan:order-updated', { detail: order }));
    return order;
  }

  advanceOrderStep(orderId) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) return null;

    const nextStep = (order.currentStep || order.trackingStep || 1) + 1;
    if (nextStep > 4) {
      if (window.amzCart) window.amzCart.showToast(`Order ${orderId} is already Delivered!`, 'info');
      return order;
    }

    const stepTitles = {
      2: 'Packed by Karigar',
      3: 'In Transit via India Post Speed Post',
      4: 'Delivered'
    };
    const stepNotes = {
      2: 'Artisan wrapped with eco-seal & India Post barcode affixed',
      3: 'Out for doorstep delivery via postal beat van',
      4: 'Successfully handed over to buyer at doorstep'
    };

    const updated = this.updateOrderStatus(orderId, stepTitles[nextStep], nextStep, stepNotes[nextStep]);
    if (window.amzCart) {
      window.amzCart.showToast(`🚚 Demo: Order ${orderId} advanced to "${stepTitles[nextStep]}"!`);
    }
    return updated;
  }

  packAndPrintOrder(orderId) {
    const order = this.orders.find(o => o.orderId === orderId);
    if (!order) return null;

    if (order.currentStep < 2) {
      this.updateOrderStatus(orderId, 'Packed by Karigar', 2, 'Artisan verified & India Post barcode generated');
    }
    return order;
  }

  // ==========================================
  // 4. PRODUCT REVIEWS & RATINGS ENGINE
  // ==========================================
  loadReviews() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEYS.REVIEWS);
      this.reviews = saved ? JSON.parse(saved) : {};
    } catch (e) {
      this.reviews = {};
    }
  }

  getReviewsForProduct(productId) {
    const key = String(productId);
    const custom = this.reviews[key] || [];

    const defaults = [
      {
        id: 'rev-def-1',
        author: 'Ananya Verma',
        location: 'Varanasi',
        rating: 5,
        date: '2 days ago',
        verified: true,
        text: 'Absolute masterpiece! The zari embroidery and fabric texture are 100% authentic handloom. Delivered directly from Varanasi in pristine eco-friendly box packaging.'
      },
      {
        id: 'rev-def-2',
        author: 'Rajesh Kulkarni',
        location: 'Pune',
        rating: 5,
        date: '1 week ago',
        verified: true,
        text: 'Super happy that rural weavers are getting full fair earnings through UdaanMart without intermediaries. Quality exceeds luxury boutique standards!'
      }
    ];

    return [...custom, ...defaults];
  }

  addReview(productId, review) {
    const key = String(productId);
    if (!this.reviews[key]) {
      this.reviews[key] = [];
    }

    const reviewObj = {
      id: 'rev-' + Date.now(),
      author: review.author || 'Verified Buyer',
      location: review.location || this.location.city,
      rating: parseInt(review.rating, 10) || 5,
      date: 'Just now',
      verified: true,
      text: review.text || 'Exquisite quality, prompt express delivery.'
    };

    this.reviews[key].unshift(reviewObj);
    try {
      localStorage.setItem(this.STORAGE_KEYS.REVIEWS, JSON.stringify(this.reviews));
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('udaan:review-added', { detail: { productId, review: reviewObj } }));
    return reviewObj;
  }

  // ==========================================
  // 5. ROLE SWITCHER (BUYER <-> KARIGAR STUDIO)
  // ==========================================
  getRole() {
    return this.role;
  }

  setRole(newRole) {
    this.role = newRole;
    try {
      localStorage.setItem(this.STORAGE_KEYS.ROLE, newRole);
    } catch (e) {}
    document.body.setAttribute('data-user-role', newRole);

    // Update Role Switcher Header Pill
    const rolePills = document.querySelectorAll('.role-switcher-pill, #role-switcher-pill');
    rolePills.forEach(pill => {
      const isSeller = (newRole === 'seller');
      pill.classList.toggle('role-seller', isSeller);
      const label = pill.querySelector('.role-label');
      if (label) {
        label.textContent = isSeller ? 'Karigar Studio' : 'Buyer View';
      }
    });

    if (newRole === 'seller') {
      if (window.amzSeller && typeof window.amzSeller.openModal === 'function') {
        window.amzSeller.openModal('incoming-orders');
      }
      if (window.amzCart) {
        window.amzCart.showToast('🏭 Switched to Karigar Studio Mode! View incoming orders & list crafts.', 'info');
      }
    } else {
      if (window.amzCart) {
        window.amzCart.showToast('🛍️ Switched to Buyer View! Discover authentic crafts and enjoy 1-click express buy.', 'info');
      }
    }

    window.dispatchEvent(new CustomEvent('udaan:role-changed', { detail: { role: newRole } }));
  }

  toggleRole() {
    const target = this.role === 'buyer' ? 'seller' : 'buyer';
    this.setRole(target);
  }

  // ==========================================
  // 6. XSS SANITIZATION
  // ==========================================
  escapeHTML(str) {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
}

// Global Singleton Instance
window.amzStore = new UdaanStore();
