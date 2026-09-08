/**
 * AMAZON CLONE - SEARCH, FILTER & SORT ENGINE
 * Fast live search with debounced autocomplete, multi-facet filtering,
 * and high-performance product grid rendering.
 */

class SearchFilterEngine {
  constructor() {
    this.allProducts = [...PRODUCTS_DATA];
    this.filteredProducts = [...PRODUCTS_DATA];
    
    this.currentFilters = {
      keyword: '',
      department: 'all',
      gender: 'all',
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      primeOnly: false,
      dealsOnly: false,
      sortBy: 'featured'
    };

    this.debounceTimer = null;
  }

  init() {
    this.bindSearchInputs();
    this.bindFilterControls();
    this.applyFilters();
  }

  bindSearchInputs() {
    const searchInput = document.getElementById('navbar-search-input');
    const searchSuggestions = document.getElementById('search-suggestions-dropdown');
    const departmentSelect = document.getElementById('search-category-select');
    const searchBtn = document.getElementById('navbar-search-submit');

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        clearTimeout(this.debounceTimer);
        const query = e.target.value.trim();

        this.debounceTimer = setTimeout(() => {
          this.handleSearchAutocomplete(query, searchSuggestions);
        }, 180);
      });

      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          this.currentFilters.keyword = searchInput.value.trim();
          this.closeSuggestions();
          this.applyFilters();
          this.scrollToProducts();
        } else if (e.key === 'Escape') {
          this.closeSuggestions();
        }
      });

      // Close suggestions on outside click
      document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchSuggestions?.contains(e.target)) {
          this.closeSuggestions();
        }
      });
    }

    if (departmentSelect) {
      departmentSelect.addEventListener('change', (e) => {
        this.currentFilters.department = e.target.value;
        this.applyFilters();
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (searchInput) {
          this.currentFilters.keyword = searchInput.value.trim();
        }
        this.closeSuggestions();
        this.applyFilters();
        this.scrollToProducts();
      });
    }
  }

  handleSearchAutocomplete(query, container) {
    if (!container) return;

    if (!query || query.length < 1) {
      this.closeSuggestions();
      return;
    }

    const lower = query.toLowerCase();
    const matches = this.allProducts.filter(p => 
      p.title.toLowerCase().includes(lower) || 
      p.categoryName.toLowerCase().includes(lower) ||
      p.features.some(f => f.toLowerCase().includes(lower))
    ).slice(0, 6);

    if (matches.length === 0) {
      container.innerHTML = `
        <div class="search-suggestion-empty">
          No matching products found for "<strong>${escapeHtml(query)}</strong>"
        </div>
      `;
      container.classList.add('is-open');
      return;
    }

    container.innerHTML = matches.map(prod => {
      // Highlight matching terms
      const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      const highlightedTitle = prod.title.replace(regex, '<mark>$1</mark>');
      const currentCur = window.amzApp ? window.amzApp.formatPrice(prod.price) : `$${prod.price.toFixed(2)}`;

      return `
        <div class="search-suggestion-item" data-product-id="${prod.id}">
          <img src="${prod.images[0]}" alt="${prod.title}" class="suggestion-thumb" loading="lazy" />
          <div class="suggestion-info">
            <span class="suggestion-title">${highlightedTitle}</span>
            <span class="suggestion-meta">
              <span class="suggestion-price">${currentCur}</span>
              <span class="suggestion-cat">in ${prod.categoryName}</span>
            </span>
          </div>
        </div>
      `;
    }).join('');

    container.classList.add('is-open');

    // Bind suggestion click
    container.querySelectorAll('.search-suggestion-item').forEach(item => {
      item.addEventListener('click', () => {
        const prodId = item.dataset.productId;
        const targetProd = this.allProducts.find(p => p.id === prodId);
        if (targetProd) {
          const searchInput = document.getElementById('navbar-search-input');
          if (searchInput) searchInput.value = targetProd.shortTitle;
          this.currentFilters.keyword = targetProd.shortTitle;
          this.closeSuggestions();
          this.applyFilters();
          if (window.amzModal) {
            window.amzModal.openQuickView(targetProd);
          }
        }
      });
    });
  }

  closeSuggestions() {
    const searchSuggestions = document.getElementById('search-suggestions-dropdown');
    if (searchSuggestions) {
      searchSuggestions.classList.remove('is-open');
      searchSuggestions.innerHTML = '';
    }
  }

  bindFilterControls() {
    // Sort dropdown
    const sortSelect = document.getElementById('product-sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentFilters.sortBy = e.target.value;
        this.applyFilters();
      });
    }

    // Category pills / buttons
    const catPills = document.querySelectorAll('[data-filter-category]');
    catPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = pill.dataset.filterCategory;
        this.setDepartment(cat);
      });
    });

    // Gender pills / buttons (Men / Women / Karigar / All)
    const genderPills = document.querySelectorAll('[data-filter-gender]');
    genderPills.forEach(pill => {
      pill.addEventListener('click', (e) => {
        e.preventDefault();
        const g = pill.dataset.filterGender;
        this.setGender(g);
      });
    });

    // Prime filter toggle
    const primeToggle = document.getElementById('filter-prime-toggle');
    if (primeToggle) {
      primeToggle.addEventListener('change', (e) => {
        this.currentFilters.primeOnly = e.target.checked;
        this.applyFilters();
      });
    }

    // Lightning deals filter toggle
    const dealsToggle = document.getElementById('filter-deals-toggle');
    if (dealsToggle) {
      dealsToggle.addEventListener('change', (e) => {
        this.currentFilters.dealsOnly = e.target.checked;
        this.applyFilters();
      });
    }

    // Price range presets
    const pricePresets = document.querySelectorAll('[data-price-range]');
    pricePresets.forEach(preset => {
      preset.addEventListener('click', (e) => {
        e.preventDefault();
        const range = preset.dataset.priceRange.split('-');
        this.currentFilters.minPrice = parseFloat(range[0]) || 0;
        this.currentFilters.maxPrice = parseFloat(range[1]) || 99999;
        
        pricePresets.forEach(p => p.classList.remove('is-active'));
        preset.classList.add('is-active');

        this.applyFilters();
      });
    });

    // Clear filters button
    const clearBtn = document.getElementById('clear-all-filters-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  setDepartment(deptId) {
    this.currentFilters.department = deptId;

    // Sync navbar category dropdown
    const searchSelect = document.getElementById('search-category-select');
    if (searchSelect) {
      searchSelect.value = deptId;
    }

    // Update active pill state
    document.querySelectorAll('[data-filter-category]').forEach(pill => {
      pill.classList.toggle('is-active', pill.dataset.filterCategory === deptId);
    });

    this.applyFilters();
    this.scrollToProducts();
  }

  setGender(gender) {
    this.currentFilters.gender = gender;

    // Update active state on all gender pills & sub-nav items
    document.querySelectorAll('[data-filter-gender]').forEach(pill => {
      pill.classList.toggle('is-active', pill.dataset.filterGender === gender);
    });

    this.applyFilters();
    this.scrollToProducts();
  }

  resetFilters() {
    this.currentFilters = {
      keyword: '',
      department: 'all',
      gender: 'all',
      minPrice: 0,
      maxPrice: 5000,
      minRating: 0,
      primeOnly: false,
      dealsOnly: false,
      sortBy: 'featured'
    };

    const searchInput = document.getElementById('navbar-search-input');
    if (searchInput) searchInput.value = '';

    const searchSelect = document.getElementById('search-category-select');
    if (searchSelect) searchSelect.value = 'all';

    const sortSelect = document.getElementById('product-sort-select');
    if (sortSelect) sortSelect.value = 'featured';

    const primeToggle = document.getElementById('filter-prime-toggle');
    if (primeToggle) primeToggle.checked = false;

    const dealsToggle = document.getElementById('filter-deals-toggle');
    if (dealsToggle) dealsToggle.checked = false;

    document.querySelectorAll('[data-filter-category]').forEach(p => {
      p.classList.toggle('is-active', p.dataset.filterCategory === 'all');
    });

    document.querySelectorAll('[data-filter-gender]').forEach(p => {
      p.classList.toggle('is-active', p.dataset.filterGender === 'all');
    });

    document.querySelectorAll('[data-price-range]').forEach(p => p.classList.remove('is-active'));

    this.applyFilters();
  }

  applyFilters() {
    let result = [...this.allProducts];

    // 1. Keyword search filter
    if (this.currentFilters.keyword) {
      const kw = this.currentFilters.keyword.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(kw) ||
        item.categoryName.toLowerCase().includes(kw) ||
        (item.gender && item.gender.toLowerCase() === kw) ||
        (kw.includes('men') && item.gender === 'men') ||
        (kw.includes('women') && item.gender === 'women') ||
        (kw.includes('karigar') && item.isRuralKarigar) ||
        item.features.some(f => f.toLowerCase().includes(kw))
      );
    }

    // 2. Department filter
    if (this.currentFilters.department && this.currentFilters.department !== 'all') {
      result = result.filter(item => item.category === this.currentFilters.department);
    }

    // 2b. Gender & Target Audience Filter (Men / Women / Karigar)
    if (this.currentFilters.gender && this.currentFilters.gender !== 'all') {
      if (this.currentFilters.gender === 'men') {
        result = result.filter(item => item.gender === 'men' || item.gender === 'unisex');
      } else if (this.currentFilters.gender === 'women') {
        result = result.filter(item => item.gender === 'women' || item.gender === 'unisex');
      } else if (this.currentFilters.gender === 'karigar') {
        result = result.filter(item => item.isRuralKarigar);
      }
    }

    // 3. Price range filter
    result = result.filter(item => 
      item.price >= this.currentFilters.minPrice && 
      item.price <= this.currentFilters.maxPrice
    );

    // 4. Prime only
    if (this.currentFilters.primeOnly) {
      result = result.filter(item => item.isPrime);
    }

    // 5. Lightning deals only
    if (this.currentFilters.dealsOnly) {
      result = result.filter(item => item.isLightningDeal);
    }

    // 6. Sorting
    switch (this.currentFilters.sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount':
        result.sort((a, b) => b.discountPercent - a.discountPercent);
        break;
      case 'featured':
      default:
        // Keep original curated rank
        break;
    }

    this.filteredProducts = result;
    this.renderProductGrid();
    this.updateResultCount();
  }

  renderProductGrid() {
    const grid = document.getElementById('products-grid-container');
    if (!grid) return;

    if (this.filteredProducts.length === 0) {
      grid.innerHTML = `
        <div class="no-products-state">
          <div class="no-products-icon">🔍</div>
          <h3 class="no-products-title">No matching products found</h3>
          <p class="no-products-subtitle">Try adjusting your search criteria, clearing category filters, or selecting a broader price range.</p>
          <button class="amz-btn amz-btn-primary" onclick="window.amzSearchFilter.resetFilters()">
            Reset All Filters
          </button>
        </div>
      `;
      return;
    }

    grid.innerHTML = this.filteredProducts.map(prod => this.buildProductCardHtml(prod)).join('');
    this.bindProductCardInteractions(grid);
  }

  buildProductCardHtml(prod) {
    const isWish = window.amzCart ? window.amzCart.isWishlisted(prod.id) : false;
    const formattedPrice = window.amzApp ? window.amzApp.formatPrice(prod.price) : `$${prod.price.toFixed(2)}`;
    const formattedOrigPrice = prod.originalPrice ? (window.amzApp ? window.amzApp.formatPrice(prod.originalPrice) : `$${prod.originalPrice.toFixed(2)}`) : null;

    let badgeHtml = '';
    if (prod.badge === 'Best Seller') {
      badgeHtml = `<span class="prod-badge badge-bestseller">#1 Best Seller</span>`;
    } else if (prod.badge === "Amazon's Choice") {
      badgeHtml = `<span class="prod-badge badge-choice">Amazon's <span class="choice-accent">Choice</span></span>`;
    } else if (prod.badge === 'Limited Deal') {
      badgeHtml = `<span class="prod-badge badge-deal">Limited time deal</span>`;
    } else if (prod.badge) {
      badgeHtml = `<span class="prod-badge badge-generic">${prod.badge}</span>`;
    }

    let dealBarHtml = '';
    if (prod.isLightningDeal && prod.dealPercentage) {
      dealBarHtml = `
        <div class="prod-deal-progress">
          <div class="deal-progress-bar">
            <div class="deal-progress-fill" style="width: ${prod.dealPercentage}%"></div>
          </div>
          <span class="deal-progress-text">${prod.dealPercentage}% claimed</span>
        </div>
      `;
    }

    // Star rating rendering
    const fullStars = Math.floor(prod.rating);
    const hasHalf = prod.rating % 1 >= 0.4;
    let starsHtml = '';
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        starsHtml += '<span class="star-icon star-full">★</span>';
      } else if (i === fullStars && hasHalf) {
        starsHtml += '<span class="star-icon star-half">★</span>';
      } else {
        starsHtml += '<span class="star-icon star-empty">☆</span>';
      }
    }

    return `
      <article class="prod-card" data-product-id="${prod.id}">
        <div class="prod-card-header">
          ${badgeHtml}
          <button class="prod-wishlist-btn ${isWish ? 'is-active' : ''}" 
                  data-wishlist-id="${prod.id}" 
                  title="${isWish ? 'Remove from Wishlist' : 'Add to Wishlist'}"
                  aria-label="Save to Wishlist">
            <svg viewBox="0 0 24 24" width="20" height="20" class="heart-icon">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
            </svg>
          </button>
        </div>

        <div class="prod-card-media" data-action="quickview" data-product-id="${prod.id}">
          <img src="${prod.images[0]}" alt="${prod.title}" class="prod-image" loading="lazy" />
          <button class="prod-quickview-overlay-btn" data-action="quickview" data-product-id="${prod.id}">
            <span>Quick View</span>
          </button>
        </div>

        <div class="prod-card-body">
          <div class="prod-tags-row">
            <span class="prod-category-tag">${prod.categoryName}</span>
            ${
              prod.isRuralKarigar 
                ? '<span class="prod-tag-pill tag-karigar" title="Amazon Karigar Rural Certified">🏡 Karigar</span>'
                : prod.gender === 'men'
                  ? '<span class="prod-tag-pill tag-men" title="Men Fashion and Grooming">👨 Men</span>'
                  : prod.gender === 'women'
                    ? '<span class="prod-tag-pill tag-women" title="Women Fashion and Beauty">👩 Women</span>'
                    : '<span class="prod-tag-pill tag-unisex" title="Unisex and Universal">✨ Unisex</span>'
            }
          </div>
          <h3 class="prod-title" data-action="quickview" data-product-id="${prod.id}" title="${prod.title}">
            ${prod.title}
          </h3>

          <div class="prod-rating-row">
            <div class="prod-stars" title="${prod.rating} out of 5 stars">
              ${starsHtml}
              <span class="rating-num">${prod.rating}</span>
            </div>
            <span class="rating-count">(${prod.ratingCount.toLocaleString()})</span>
          </div>

          <div class="prod-price-row">
            ${prod.discountPercent ? `<span class="prod-discount-tag">-${prod.discountPercent}%</span>` : ''}
            <div class="prod-price-box">
              <span class="price-current">${formattedPrice}</span>
              ${formattedOrigPrice ? `<span class="price-original">List: ${formattedOrigPrice}</span>` : ''}
            </div>
          </div>

          ${dealBarHtml}

          <div class="prod-delivery-row">
            ${prod.isPrime ? `<span class="amz-prime-badge"><span class="prime-italic">prime</span></span>` : ''}
            <span class="delivery-text">${prod.delivery}</span>
          </div>

          ${prod.stock <= 5 ? `<div class="prod-low-stock">Only ${prod.stock} left in stock - order soon.</div>` : ''}
        </div>

        <div class="prod-card-actions">
          <button class="amz-btn amz-btn-primary add-to-cart-btn" data-add-to-cart="${prod.id}">
            Add to Cart
          </button>
          <button class="amz-btn amz-btn-buy-now buy-now-btn" data-buy-now="${prod.id}">
            Buy Now
          </button>
        </div>
      </article>
    `;
  }

  bindProductCardInteractions(container) {
    // Quick View openers
    container.querySelectorAll('[data-action="quickview"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const prodId = el.dataset.productId;
        const targetProd = this.allProducts.find(p => p.id === prodId);
        if (targetProd && window.amzModal) {
          window.amzModal.openQuickView(targetProd);
        }
      });
    });

    // Add to cart buttons
    container.querySelectorAll('[data-add-to-cart]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.dataset.addToCart;
        const targetProd = this.allProducts.find(p => p.id === prodId);
        if (targetProd && window.amzCart) {
          // Visual click ripple feedback
          btn.classList.add('btn-clicked');
          setTimeout(() => btn.classList.remove('btn-clicked'), 300);

          window.amzCart.addItem(targetProd, 1);
        }
      });
    });

    // Buy now buttons (opens 1-Click Express Buy for instant purchase)
    container.querySelectorAll('[data-buy-now]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.dataset.buyNow;
        const targetProd = this.allProducts.find(p => p.id === prodId);
        if (targetProd && window.amzCheckout) {
          window.amzCheckout.openExpressBuy(targetProd, 1);
        }
      });
    });

    // Wishlist toggle
    container.querySelectorAll('[data-wishlist-id]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const prodId = btn.dataset.wishlistId;
        const targetProd = this.allProducts.find(p => p.id === prodId);
        if (targetProd && window.amzCart) {
          const isNowSaved = window.amzCart.toggleWishlist(targetProd);
          btn.classList.toggle('is-active', isNowSaved);
        }
      });
    });
  }

  updateResultCount() {
    const counterEl = document.getElementById('search-result-count');
    if (counterEl) {
      const count = this.filteredProducts.length;
      let label = `${count} result${count === 1 ? '' : 's'}`;
      if (this.currentFilters.keyword) {
        label += ` for "<strong>${escapeHtml(this.currentFilters.keyword)}</strong>"`;
      }
      if (this.currentFilters.department !== 'all') {
        const deptObj = DEPARTMENTS.find(d => d.id === this.currentFilters.department);
        if (deptObj) label += ` in <em>${deptObj.name}</em>`;
      }
      counterEl.innerHTML = label;
    }
  }

  refreshCatalog(products = null) {
    if (products) {
      this.allProducts = [...products];
    } else {
      this.allProducts = [...PRODUCTS_DATA];
    }
    this.applyFilters();
  }

  scrollToProducts() {
    const target = document.getElementById('products-section');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

window.amzSearchFilter = new SearchFilterEngine();
