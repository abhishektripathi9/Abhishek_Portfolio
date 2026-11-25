/**
 * UDAANMART - CART & WISHLIST ENGINE
 * Handles reactive shopping cart state, quantity mutations, Free Prime Shipping progress,
 * localStorage persistence, and custom broadcast events.
 */

class CartEngine {
  constructor() {
    this.CART_STORAGE_KEY = 'amz_clone_cart_v2';
    this.WISHLIST_STORAGE_KEY = 'amz_clone_wishlist_v2';
    this.FREE_SHIPPING_THRESHOLD = 35.00;
    this.TAX_RATE = 0.0825; // 8.25% standard sales tax
    
    this.items = this.loadCart();
    this.wishlist = this.loadWishlist();
    this.lastRemovedItem = null;
  }

  loadCart() {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.warn("Failed to read cart from localStorage, initializing fresh cart.", e);
      return [];
    }
  }

  saveCart() {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(this.items));
      this.broadcastCartUpdate();
    } catch (e) {
      console.error("Failed to save cart to localStorage", e);
    }
  }

  loadWishlist() {
    try {
      const stored = localStorage.getItem(this.WISHLIST_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  }

  saveWishlist() {
    try {
      localStorage.setItem(this.WISHLIST_STORAGE_KEY, JSON.stringify(this.wishlist));
      window.dispatchEvent(new CustomEvent('wishlist:updated', {
        detail: { wishlist: this.wishlist }
      }));
    } catch (e) {
      console.error("Failed to save wishlist", e);
    }
  }

  // 1-Click wrapper used by static homepage cards & dynamic product triggers
  addToCart(productOrId, quantity = 1) {
    let product = productOrId;
    if (typeof productOrId === 'string' || typeof productOrId === 'number') {
      product = window.amzStore ? window.amzStore.getProductById(productOrId) : null;
      if (!product && typeof PRODUCTS_DATA !== 'undefined') {
        product = PRODUCTS_DATA.find(p => String(p.id) === String(productOrId));
      }
    }
    if (product) {
      this.addItem(product, quantity);
      if (window.amzModal && typeof window.amzModal.openCartDrawer === 'function') {
        window.amzModal.openCartDrawer();
      }
    }
  }

  // Add product to cart or increment quantity
  addItem(product, quantity = 1) {
    const existingIndex = this.items.findIndex(item => item.id === product.id);

    if (existingIndex > -1) {
      this.items[existingIndex].quantity += quantity;
    } else {
      this.items.push({
        id: product.id,
        title: product.shortTitle || product.title,
        fullTitle: product.title,
        price: product.price,
        originalPrice: product.originalPrice,
        image: (Array.isArray(product.images) && product.images[0]) || product.image || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
        category: product.category,
        isPrime: product.isPrime,
        delivery: product.delivery,
        stock: product.stock,
        quantity: Math.max(1, quantity),
        addedAt: new Date().toISOString()
      });
    }

    this.saveCart();
    this.showToast(`Added "${product.shortTitle || product.title}" to your cart.`, "success");
    return true;
  }

  // Update item quantity directly
  updateQuantity(productId, newQuantity) {
    const qty = parseInt(newQuantity, 10);
    const itemIndex = this.items.findIndex(item => item.id === productId);

    if (itemIndex > -1) {
      if (qty <= 0) {
        this.removeItem(productId);
      } else {
        const maxStock = this.items[itemIndex].stock || 30;
        this.items[itemIndex].quantity = Math.min(qty, maxStock);
        this.saveCart();
      }
    }
  }

  // Remove item from cart with undo opportunity
  removeItem(productId) {
    const index = this.items.findIndex(item => item.id === productId);
    if (index > -1) {
      this.lastRemovedItem = { ...this.items[index], index };
      const removedName = this.items[index].title;
      this.items.splice(index, 1);
      this.saveCart();

      this.showToast(`Removed "${removedName}" from cart.`, "info", true);
    }
  }

  // Restore the last removed item
  undoRemove() {
    if (this.lastRemovedItem) {
      this.items.splice(this.lastRemovedItem.index, 0, this.lastRemovedItem);
      const restored = this.lastRemovedItem.title;
      this.lastRemovedItem = null;
      this.saveCart();
      this.showToast(`Restored "${restored}" to cart.`, "success");
    }
  }

  // Clear entire cart
  clearCart() {
    this.items = [];
    this.saveCart();
    this.showToast("Cart has been cleared.", "info");
  }

  // Wishlist toggle
  toggleWishlist(product) {
    const index = this.wishlist.findIndex(id => id === product.id);
    if (index > -1) {
      this.wishlist.splice(index, 1);
      this.saveWishlist();
      this.showToast(`Removed from your Wish List.`, "info");
      return false;
    } else {
      this.wishlist.push(product.id);
      this.saveWishlist();
      this.showToast(`Added to your Wish List.`, "success");
      return true;
    }
  }

  isWishlisted(productId) {
    return this.wishlist.includes(productId);
  }

  // Calculate cart summary metrics
  getSummary() {
    const itemCount = this.items.reduce((acc, item) => acc + item.quantity, 0);
    const subtotal = this.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const savings = this.items.reduce((acc, item) => {
      const orig = item.originalPrice || item.price;
      return acc + ((orig - item.price) * item.quantity);
    }, 0);
    
    const qualifiesForFreeShipping = subtotal >= this.FREE_SHIPPING_THRESHOLD || subtotal === 0;
    const amountNeededForFreeShipping = Math.max(0, this.FREE_SHIPPING_THRESHOLD - subtotal);
    const freeShippingProgress = Math.min(100, (subtotal / this.FREE_SHIPPING_THRESHOLD) * 100);
    
    const shipping = qualifiesForFreeShipping || subtotal === 0 ? 0.00 : 5.99;
    const tax = subtotal * this.TAX_RATE;

    // Dynamic Coupon Calculation
    let couponDiscount = 0;
    let appliedCoupon = null;
    if (window.amzStore && typeof window.amzStore.getAppliedCoupon === 'function') {
      appliedCoupon = window.amzStore.getAppliedCoupon();
      if (appliedCoupon && subtotal > 0) {
        if (appliedCoupon.discountType === 'PERCENTAGE') {
          couponDiscount = (subtotal * appliedCoupon.discountValue) / 100;
          if (appliedCoupon.maxDiscount && couponDiscount > appliedCoupon.maxDiscount) {
            couponDiscount = appliedCoupon.maxDiscount;
          }
        } else {
          couponDiscount = appliedCoupon.discountValue;
        }
        couponDiscount = Math.min(couponDiscount, subtotal);
      }
    }

    const orderTotal = Math.max(0, subtotal - couponDiscount + shipping + tax);

    return {
      itemCount,
      subtotal,
      savings,
      tax,
      shipping,
      couponDiscount: Math.round(couponDiscount),
      appliedCoupon,
      orderTotal,
      qualifiesForFreeShipping,
      amountNeededForFreeShipping,
      freeShippingProgress: Math.round(freeShippingProgress)
    };
  }

  broadcastCartUpdate() {
    const summary = this.getSummary();
    const countEl = document.getElementById('nav-cart-count');
    if (countEl) {
      countEl.textContent = summary.itemCount;
    }
    window.dispatchEvent(new CustomEvent('cart:updated', {
      detail: {
        items: this.items,
        summary
      }
    }));
    window.dispatchEvent(new CustomEvent('amz:cart-updated', {
      detail: {
        items: this.items,
        summary
      }
    }));
  }

  // Unified toast messaging
  showToast(message, type = "info", showUndo = false) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let undoHtml = '';
    if (showUndo) {
      undoHtml = `<button class="toast-undo-btn" id="toast-undo-trigger">Undo</button>`;
    }

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${type === 'success' ? '✓' : 'ℹ'}</span>
        <span class="toast-message">${message}</span>
      </div>
      ${undoHtml}
    `;

    container.appendChild(toast);

    // Bind undo click
    if (showUndo) {
      const undoBtn = toast.querySelector('#toast-undo-trigger');
      if (undoBtn) {
        undoBtn.addEventListener('click', () => {
          this.undoRemove();
          toast.remove();
        });
      }
    }

    // Trigger appear animation
    requestAnimationFrame(() => toast.classList.add('toast-show'));

    setTimeout(() => {
      toast.classList.remove('toast-show');
      setTimeout(() => toast.remove(), 300);
    }, 4500);
  }
}

// Instantiate global cart engine
window.amzCart = new CartEngine();

document.addEventListener('DOMContentLoaded', () => {
  if (window.amzCart) {
    window.amzCart.broadcastCartUpdate();
  }
});
