/* =====================================================
   ABHISHEK TRIPATHI — 3D & ANIMATED PORTFOLIO SCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  init3DTilt();
  initCustomCursor();
  initTypewriter();
  initScrollReveal();
  initLaserTimeline();
  initStatCounters();
  initProjectFilters();
  initProjectsAutoScroll();
  initProjectModal();
  initResumeModal();
  initCertViewer();
  initContactActions();
  initScrollTopProgress();
  initNavbarScroll();
  initMobileNav();
  initProfileFallback();
  initMessageHub();
  initRealtimeSync();
});

/* =====================================================
   1. LUCIDE ICONS INITIALIZER
   ===================================================== */
function initLucideIcons() {
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  } else {
    setTimeout(() => {
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }, 400);
  }
}

/* =====================================================
   2. THREE.JS 3D HERO BACKGROUND (DISABLED)
   ===================================================== */
function initThreeJsHero() {
  // Static clean background grid per user preference
  return;
}

/* =====================================================
   3. 3D CARD TILT ENGINE WITH SPECULAR GLARE
   ===================================================== */
function init3DTilt() {
  // Check if touch device - skip 3D tilt on touch to avoid jitter
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const tiltCards = document.querySelectorAll('[data-tilt]');

  tiltCards.forEach(card => {
    let bounds;

    function onMouseEnter() {
      bounds = card.getBoundingClientRect();
      card.style.transition = 'transform 0.1s ease-out';
    }

    function onMouseMove(e) {
      if (!bounds) bounds = card.getBoundingClientRect();
      const mouseX = e.clientX - bounds.left;
      const mouseY = e.clientY - bounds.top;

      const centerX = bounds.width / 2;
      const centerY = bounds.height / 2;

      // Max rotation angles in degrees
      const maxTilt = 12;
      const tiltX = ((mouseY - centerY) / centerY) * -maxTilt;
      const tiltY = ((mouseX - centerX) / centerX) * maxTilt;

      card.style.transform = `perspective(1000px) rotateX(${tiltX.toFixed(2)}deg) rotateY(${tiltY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;

      // Specular sheen highlight update
      const sheen = card.querySelector('.card-glass-sheen');
      if (sheen) {
        const percentX = (mouseX / bounds.width) * 100;
        const percentY = (mouseY / bounds.height) * 100;
        sheen.style.background = `radial-gradient(circle at ${percentX}% ${percentY}%, rgba(255, 255, 255, 0.22) 0%, transparent 60%)`;
      }
    }

    function onMouseLeave() {
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';

      const sheen = card.querySelector('.card-glass-sheen');
      if (sheen) {
        sheen.style.background = '';
      }
    }

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
  });
}

/* =====================================================
   4. CUSTOM CYBER CURSOR FOLLOWER
   ===================================================== */
function initCustomCursor() {
  const cursor = document.getElementById('custom-cursor');
  const dot = document.getElementById('cursor-dot');
  if (!cursor || !dot) return;

  // Disable on touch devices
  if (window.matchMedia('(hover: none)').matches) {
    cursor.style.display = 'none';
    dot.style.display = 'none';
    return;
  }

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Instant dot movement
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  }, { passive: true });

  // Smooth lerp loop for the outer cursor
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;

    cursor.style.left = `${cursorX}px`;
    cursor.style.top = `${cursorY}px`;

    requestAnimationFrame(renderCursor);
  }
  renderCursor();

  // Enlarge cursor over clickable elements
  const hoverTargets = 'a, button, input, textarea, [data-tilt], .filter-btn, .tag-pill';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovering'));
  });
}

/* =====================================================
   5. CYBER TEXT DECIPHER / TYPEWRITER
   ===================================================== */
function initTypewriter() {
  const textElement = document.getElementById('typewriter-text');
  if (!textElement) return;

  const roles = [
    'MERN Stack Developer',
    'Data Analytics Enthusiast',
    'Full Stack Engineer',
    'Java & Python Specialist',
    'Machine Learning Builder',
    'Creative 3D Web Engineer'
  ];

  const chars = '!<>-_\\/[]{}—=+*^?#________';
  let roleIndex = 0;

  function scrambleText(newText) {
    let iteration = 0;
    const interval = setInterval(() => {
      textElement.innerText = newText
        .split('')
        .map((letter, index) => {
          if (index < iteration) return newText[index];
          return chars[Math.floor(Math.random() * chars.length)];
        })
        .join('');

      if (iteration >= newText.length) {
        clearInterval(interval);
        setTimeout(nextRole, 2600);
      }
      iteration += 1 / 2;
    }, 30);
  }

  function nextRole() {
    roleIndex = (roleIndex + 1) % roles.length;
    scrambleText(roles[roleIndex]);
  }

  // Start initial rotation
  setTimeout(() => scrambleText(roles[0]), 1000);
}

/* =====================================================
   6. SCROLL REVEAL ANIMATIONS
   ===================================================== */
function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, idx) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, idx * 40);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* =====================================================
   7. TIMELINE LASER BEAM PROGRESS
   ===================================================== */
function initLaserTimeline() {
  const laserFill = document.getElementById('timeline-laser-fill');
  const timeline = document.querySelector('.timeline-container');
  if (!laserFill || !timeline) return;

  function updateLaser() {
    const rect = timeline.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    if (rect.top < windowHeight && rect.bottom > 0) {
      const total = rect.height;
      const progress = Math.max(0, Math.min(1, (windowHeight * 0.7 - rect.top) / total));
      laserFill.style.height = `${(progress * 100).toFixed(1)}%`;
    }
  }

  window.addEventListener('scroll', updateLaser, { passive: true });
  updateLaser();
}

/* =====================================================
   8. NUMERICAL STAT COUNTERS
   ===================================================== */
function initStatCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const target = parseFloat(el.getAttribute('data-target') || '0');
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        const duration = 1500;
        const startTime = performance.now();

        function step(currentTime) {
          const elapsed = currentTime - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out expo curve
          const easeOut = 1 - Math.pow(1 - progress, 3);
          const currentVal = target * easeOut;

          el.innerText = decimals > 0 ? currentVal.toFixed(decimals) : Math.floor(currentVal);

          if (progress < 1) {
            requestAnimationFrame(step);
          } else {
            el.innerText = decimals > 0 ? target.toFixed(decimals) : target;
          }
        }

        requestAnimationFrame(step);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.3 });

  counters.forEach(counter => observer.observe(counter));
}

/* =====================================================
   9. SKILL & PROJECT FILTERING
   ===================================================== */
function initProjectFilters() {
  // Skill Category Filtering
  const skillBtns = document.querySelectorAll('[data-filter]');
  const skillCards = document.querySelectorAll('.skill-category-card');

  skillBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      skillBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');
      skillCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'translateY(0)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });
    });
  });

  // Project Category Filtering
  const projectBtns = document.querySelectorAll('[data-project-filter]');
  const projectCards = document.querySelectorAll('.project-card');

  projectBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      projectBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-project-filter');
      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category') || '';
        const matches = filter === 'all' || cat === filter || cat.split(' ').includes(filter);
        if (matches) {
          card.style.display = 'flex';
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { card.style.display = 'none'; }, 250);
        }
      });

      // Reset carousel position and synchronize dots
      if (typeof window.resetProjectsCarousel === 'function') {
        window.resetProjectsCarousel();
      }
    });
  });
}

/* =====================================================
   9B. PROJECTS AUTOMATIC SLIDING CAROUSEL (3s GAP)
   ===================================================== */
function initProjectsAutoScroll() {
  const grid = document.getElementById('projects-grid');
  const wrapper = document.getElementById('projects-carousel-wrapper');
  const prevBtn = document.getElementById('carousel-prev-btn');
  const nextBtn = document.getElementById('carousel-next-btn');
  const toggleBtn = document.getElementById('carousel-toggle-btn');
  const statusPill = document.querySelector('.carousel-status-pill');
  const statusText = document.getElementById('carousel-status-text');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!grid) return;

  let autoScrollTimer = null;
  let isManuallyPaused = false;
  let isHovered = false;
  let isTouching = false;
  const SLIDE_INTERVAL = 3000; // Exact 3-second gap between slides

  function getStepWidth() {
    const card = grid.querySelector('.project-card:not([style*="display: none"])');
    if (!card) return 408;
    const style = window.getComputedStyle(grid);
    const gap = parseFloat(style.columnGap || style.gap) || 28;
    return card.offsetWidth + gap;
  }

  function scrollNext() {
    const step = getStepWidth();
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    // When reached end of track, smoothly loop back to start
    if (grid.scrollLeft >= maxScroll - 20) {
      grid.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      const target = Math.min(maxScroll, grid.scrollLeft + step);
      grid.scrollTo({ left: target, behavior: 'smooth' });
    }
  }

  function scrollPrev() {
    const step = getStepWidth();
    const maxScroll = grid.scrollWidth - grid.clientWidth;
    if (grid.scrollLeft <= 20) {
      grid.scrollTo({ left: maxScroll, behavior: 'smooth' });
    } else {
      const target = Math.max(0, grid.scrollLeft - step);
      grid.scrollTo({ left: target, behavior: 'smooth' });
    }
  }

  function updateDots() {
    if (!dots || dots.length === 0) return;
    const step = getStepWidth();
    const activeIndex = Math.min(dots.length - 1, Math.max(0, Math.round(grid.scrollLeft / step)));
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === activeIndex);
    });
  }

  function startAutoSlide() {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
    if (isManuallyPaused || isHovered || isTouching) return;

    autoScrollTimer = setInterval(() => {
      scrollNext();
    }, SLIDE_INTERVAL);

    if (statusPill) statusPill.classList.remove('paused');
    if (statusText) statusText.textContent = 'Auto-Slide (3s)';
    if (toggleBtn) {
      toggleBtn.classList.remove('is-paused');
      toggleBtn.setAttribute('title', 'Pause Auto-Slide');
      toggleBtn.setAttribute('aria-label', 'Pause Auto-Slide');
      toggleBtn.innerHTML = '<i data-lucide="pause"></i>';
      if (typeof lucide !== 'undefined') lucide.createIcons();
    }
  }

  function stopAutoSlide(manual = false) {
    if (autoScrollTimer) {
      clearInterval(autoScrollTimer);
      autoScrollTimer = null;
    }
    if (manual) {
      if (statusPill) statusPill.classList.add('paused');
      if (statusText) statusText.textContent = 'Auto-Slide Paused';
      if (toggleBtn) {
        toggleBtn.classList.add('is-paused');
        toggleBtn.setAttribute('title', 'Play Auto-Slide');
        toggleBtn.setAttribute('aria-label', 'Play Auto-Slide');
        toggleBtn.innerHTML = '<i data-lucide="play"></i>';
        if (typeof lucide !== 'undefined') lucide.createIcons();
      }
    }
  }

  // Hover detection: pause auto-slide when hovering card so user can click Live Demo / GitHub
  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => {
      isHovered = true;
      if (!isManuallyPaused) stopAutoSlide(false);
    });
    wrapper.addEventListener('mouseleave', () => {
      isHovered = false;
      if (!isManuallyPaused) startAutoSlide();
    });
  }

  // Touch swipe support for mobile
  grid.addEventListener('touchstart', () => {
    isTouching = true;
    if (!isManuallyPaused) stopAutoSlide(false);
  }, { passive: true });

  grid.addEventListener('touchend', () => {
    isTouching = false;
    if (!isManuallyPaused) {
      setTimeout(startAutoSlide, 1500);
    }
  }, { passive: true });

  // Prev / Next button actions
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      scrollPrev();
      if (!isManuallyPaused) {
        stopAutoSlide(false);
        setTimeout(startAutoSlide, 3000);
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      scrollNext();
      if (!isManuallyPaused) {
        stopAutoSlide(false);
        setTimeout(startAutoSlide, 3000);
      }
    });
  }

  // Manual Play/Pause toggle
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      if (isManuallyPaused) {
        isManuallyPaused = false;
        startAutoSlide();
      } else {
        isManuallyPaused = true;
        stopAutoSlide(true);
      }
    });
  }

  // Dots navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      const step = getStepWidth();
      grid.scrollTo({ left: index * step, behavior: 'smooth' });
      if (!isManuallyPaused) {
        stopAutoSlide(false);
        setTimeout(startAutoSlide, 3000);
      }
    });
  });

  // Track scroll position to update dots
  let scrollDebounce;
  grid.addEventListener('scroll', () => {
    clearTimeout(scrollDebounce);
    scrollDebounce = setTimeout(updateDots, 60);
  }, { passive: true });

  // Category filter integration
  window.resetProjectsCarousel = () => {
    grid.scrollTo({ left: 0, behavior: 'smooth' });
    updateDots();
  };

  // Kickoff
  startAutoSlide();
  updateDots();
}

/* =====================================================
   10. PROJECT QUICK-VIEW MODAL
   ===================================================== */
const projectData = {
  'amazon-clone': {
    title: 'E-Commerce Marketplace & Order Processing System (Amazon 2.0)',
    year: '2026',
    category: 'Full Stack MERN & 3D WebGL',
    image: 'assets/project-amazon-clone.jpg',
    desc: 'Scalable full-stack e-commerce web application featuring dynamic product catalogs, persistent shopping cart, and authenticated checkout flows. Engineered with 12+ RESTful APIs with request validation, role-based JWT authorization, automated invoice generation, and relational MySQL transactional ACID safety.',
    highlights: [
      'Architected a scalable full-stack web application featuring dynamic product catalogs, persistent shopping cart, and authenticated checkout flows.',
      'Engineered 12+ RESTful API endpoints with request validation, role-based JWT authorization, and automated invoice generation.',
      'Designed an indexed relational MySQL schema with transactional safety to prevent inventory concurrency errors and double-booking.',
      'Interactive 3D Three.js Spatial Arena with 360° spherical orbit drag, rotational inertia, and animated pulsing feature hotspots.',
      'Village & Rural Doorstep Delivery engine supporting 155,000+ India Post PIN codes, Gram Panchayats, and global postal routes.',
      'Instant UPI payment engine (Google Pay, PhonePe, Paytm, BHIM QR generator) + real-time multi-currency converter (INR, USD, EUR, GBP).'
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'JWT Authentication', 'Three.js', 'RESTful APIs'],
    github: 'https://github.com/abhishektripathi9/Amazon-clone-',
    liveDemo: './amazon-clone/index.html'
  },
  'quiz-portal': {
    title: 'Student Quiz & Course Learning Portal',
    year: '2026',
    category: 'Full Stack & EdTech',
    image: 'assets/project-quiz-portal.jpg',
    desc: 'An end-to-end full-stack e-learning platform supporting student authentication, dynamic course catalogs, and automated quiz scoring. Engineered with 8+ secure REST APIs in Express.js with input validation, token-based authentication, and instant result calculation, backed by an optimized React frontend guaranteeing sub-100ms UI transitions.',
    highlights: [
      'Developed an end-to-end e-learning platform supporting student authentication, dynamic course catalogs, and automated quiz scoring.',
      'Implemented 8+ secure REST APIs in Express.js with input validation, token-based authentication, and instant result calculation.',
      'Constructed an optimized React frontend with client-side state handling, guaranteeing sub-100ms UI transitions.',
      'Real-time automated evaluation engine with question telemetry, timing countdowns, and performance metrics analytics.',
      'Relational MySQL schema storing students, enrolled modules, quiz questions, and cryptographic session tokens.'
    ],
    tech: ['React.js', 'Node.js', 'Express.js', 'MySQL', 'REST APIs', 'JWT', 'Context API'],
    github: 'https://github.com/abhishektripathi9',
    liveDemo: './quiz-portal/index.html'
  },
  'banking-system': {
    title: 'Enterprise Banking Management System',
    year: '2025',
    category: 'Java & Enterprise Architecture',
    image: 'assets/project-banking-system.jpg',
    desc: 'Desktop and web enterprise banking software engineered with MVC architecture and OOP principles to manage secure customer accounts and ledger transactions. Integrates JDBC with PreparedStatements to sanitize inputs and eliminate SQL injection, with strict ACID transaction management and automated rollback handlers.',
    highlights: [
      'Built a desktop banking software following MVC patterns and OOP principles to manage secure customer accounts and ledger transactions.',
      'Integrated JDBC using PreparedStatements to sanitize inputs and eliminate SQL injection vulnerabilities.',
      'Enforced strict ACID transaction management with automated rollbacks to guarantee ledger consistency during failed transfers.',
      'Real-time transaction audit ledger logging customer balances, debit/credit events, and cluster node synchronization.',
      'High-concurrency connection pooling ensuring sub-50ms query response times under high transaction volume.'
    ],
    tech: ['Java', 'JDBC', 'MySQL', 'OOP Architecture', 'MVC Pattern', 'ACID Transactions', 'PreparedStatements'],
    github: 'https://github.com/abhishektripathi9',
    liveDemo: './banking-system/index.html'
  },
  'land-registry': {
    title: 'Advanced Land Registry DApp – Web3 & Blockchain Platform',
    year: '2026',
    category: 'Blockchain & Smart Contracts',
    image: 'assets/project-land-registry.jpg',
    desc: 'The Advanced Land Registry is a decentralized application (DApp) designed to revolutionize land registry governance and eradicate property ownership fraud. Built with Solidity smart contracts deployed on Ethereum/Polygon, it guarantees tamper-proof immutable title records, transparent ownership lineage, and cryptographic deed verification.',
    highlights: [
      'Self-executing Solidity Smart Contracts managing land titles, escrow deposits, and registrar approvals.',
      'IPFS (InterPlanetary File System) decentralized document storage for legal deeds, surveys, and agreements.',
      'MetaMask Web3 provider integration for cryptographic wallet authentication and digital signing.',
      'Interactive 3D geospatial land plot map with verified ownership tokens, coordinates, and real-time transaction ledger.'
    ],
    tech: ['Solidity', 'Ethereum', 'Web3.js', 'React.js', 'IPFS', 'MetaMask', 'Hardhat'],
    github: 'https://github.com/abhishektripathi9/Advanced-Land-Registry-Dapp',
    liveDemo: './land-registry/index.html'
  },
  rentease: {
    title: 'RentEase – PG & Room Finder Platform',
    year: '2026',
    category: 'Full Stack & Database',
    image: 'assets/project-rentease.jpg',
    desc: 'RentEase is a production-grade full-stack web application developed to modernize the student and professional housing search. It provides an intuitive, high-speed interface for browsing verified PG rooms and flats, submitting rental applications, and tracking bookings.',
    highlights: [
      'Comprehensive RESTful backend built with Java and Spring Boot connecting to MySQL relational database.',
      'Dynamic interactive map view displaying nearby amenities, metros, and price density markers.',
      'Role-based access control (RBAC) supporting Tenants, Room Owners, and System Administrators.',
      'Responsive React frontend featuring instant keyword filters and real-time availability badges.'
    ],
    tech: ['React.js', 'Java', 'Spring Boot', 'MySQL', 'REST APIs', 'CSS3 Grid'],
    github: 'https://github.com/abhishektripathi9',
    liveDemo: './rentease/index.html'
  }
};

function initProjectModal() {
  const modal = document.getElementById('project-modal');
  const target = document.getElementById('modal-content-target');
  const closeBtn = document.getElementById('modal-close-btn');
  if (!modal || !target) return;

  document.querySelectorAll('[data-project-id]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.getAttribute('data-project-id');
      const data = projectData[id];
      if (!data) return;

      target.innerHTML = `
        <div class="project-modal-view">
          <div class="modal-img-wrap">
            <img src="${data.image}" alt="${data.title}" />
          </div>
          <div>
            <div class="modal-meta-row">
              <span class="project-badge">${data.category}</span>
              <span class="project-year">${data.year}</span>
            </div>
            <h3 class="modal-title">${data.title}</h3>
            <p class="modal-desc">${data.desc}</p>
            
            <h4 style="color:#00f5ff;font-family:var(--font-heading);margin-bottom:12px;font-size:1.05rem;text-shadow:0 0 10px rgba(0,245,255,0.6);">Key Architecture Highlights</h4>
            <div class="modal-feature-list">
              ${data.highlights.map(h => `
                <div class="modal-feature-item">
                  <i data-lucide="check-circle-2"></i>
                  <span>${h}</span>
                </div>
              `).join('')}
            </div>

            <div class="project-tech-tags" style="margin-bottom:20px;">
              ${data.tech.map(t => `<span class="tech-tag">${t}</span>`).join('')}
            </div>

            <div class="modal-actions">
              ${data.liveDemo ? `
                <a href="${data.liveDemo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-3d" style="background:linear-gradient(135deg,#00ff88,#00f5ff);color:#03050e;font-weight:800;box-shadow:0 0 25px rgba(0,255,136,0.6);">
                  <i data-lucide="external-link"></i>
                  <span>Launch Live Demo</span>
                </a>
              ` : ''}
              <a href="${data.github}" target="_blank" rel="noopener noreferrer" class="btn btn-outline btn-3d">
                <i data-lucide="github"></i>
                <span>Explore Repository</span>
              </a>
              <a href="mailto:at180887@gmail.com?subject=Inquiry%20about%20${encodeURIComponent(data.title)}" class="btn btn-glass btn-3d">
                <i data-lucide="mail"></i>
                <span>Inquire About Project</span>
              </a>
            </div>
          </div>
        </div>
      `;

      if (typeof lucide !== 'undefined') lucide.createIcons();

      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
}

/* =====================================================
   11. RESUME PREVIEW MODAL
   ===================================================== */
function initResumeModal() {
  const resumeModal = document.getElementById('resume-modal');
  const openBtn = document.getElementById('btn-open-resume');
  const closeBtn = document.getElementById('resume-modal-close-btn');
  if (!resumeModal || !openBtn) return;

  function openResume() {
    resumeModal.classList.add('open');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function closeResume() {
    resumeModal.classList.remove('open');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  openBtn.addEventListener('click', openResume);
  if (closeBtn) closeBtn.addEventListener('click', closeResume);
  resumeModal.addEventListener('click', (e) => {
    if (e.target === resumeModal) closeResume();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && resumeModal.classList.contains('open')) closeResume();
  });
}

/* =====================================================
   12. CERTIFICATE VERIFIER & DETAILS
   ===================================================== */
function initCertViewer() {
  const certDetails = {
    pbel: {
      name: 'PBEL Program Certificate',
      issuer: 'IBM / PBEL',
      date: 'Aug 2025',
      note: 'Certified in modern web development frameworks, responsive design principles, and mobile software architecture.'
    },
    ibm: {
      name: 'PBEL Virtual Internship Credential',
      issuer: 'IBM',
      date: 'Aug 2025',
      note: 'Validated real-world practical project completion and achieved merit-based stipend award.'
    },
    java: {
      name: 'Summer Training in Core Java',
      issuer: 'United Institute of Technology',
      date: 'Aug 2024',
      note: 'Demonstrated mastery in Object-Oriented Programming, Java collections framework, and algorithmic logic.'
    }
  };

  document.querySelectorAll('[data-cert]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-cert');
      const cert = certDetails[id];
      if (cert) {
        showToast(`Verified: ${cert.name} (${cert.issuer})`);
      }
    });
  });
}

/* =====================================================
   13. CONTACT FORM & ONE-CLICK COPY
   ===================================================== */
function initContactActions() {
  // One-click copy buttons for email & phone
  document.querySelectorAll('[data-copy]').forEach(btn => {
    btn.addEventListener('click', () => {
      const textToCopy = btn.getAttribute('data-copy');
      if (!textToCopy) return;

      navigator.clipboard.writeText(textToCopy).then(() => {
        showToast(`Copied to clipboard: ${textToCopy}`);
      }).catch(() => {
        showToast(`Selected: ${textToCopy}`);
      });
    });
  });

  // Contact form submission
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('form-submit-btn');
  const successBanner = document.getElementById('form-success');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name')?.value.trim();
    const email = form.querySelector('#form-email')?.value.trim();
    const phone = form.querySelector('#form-phone')?.value.trim() || '';
    const subject = form.querySelector('#form-subject')?.value.trim() || 'Portfolio Inquiry';
    const msg = form.querySelector('#form-message')?.value.trim();

    if (!name || !email || !msg) {
      showToast('Please complete all required fields (Name, Email, Message).');
      return;
    }

    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <span class="pulse-indicator"><span class="pulse-core"></span></span> Transmitting in Real-Time to Abhishek...
      </span>
    `;
    submitBtn.disabled = true;

    // 1. Immediately save to Live Hub & broadcast to Abhishek in real-time
    const newSavedMsg = await saveMessageToHub({ name, email, phone, subject, message: msg });

    // 2. Play sound feedback & show celebration Thank You modal
    playNotificationSound();

    // Open Thank You Celebration Modal with Complete Details
    const thankYouModal = document.getElementById('thank-you-modal');
    if (thankYouModal) {
      const tyName = document.getElementById('thank-you-name');
      const tySumName = document.getElementById('thank-you-summary-name');
      const tySumEmail = document.getElementById('thank-you-summary-email');
      const tyPhoneRow = document.getElementById('thank-you-phone-row');
      const tySumPhone = document.getElementById('thank-you-summary-phone');
      const tySumSubject = document.getElementById('thank-you-summary-subject');
      const tySumMsg = document.getElementById('thank-you-summary-msg');

      if (tyName) tyName.textContent = name;
      if (tySumName) tySumName.textContent = name;
      if (tySumEmail) tySumEmail.textContent = email;
      if (tyPhoneRow && tySumPhone) {
        if (phone) {
          tyPhoneRow.style.display = 'flex';
          tySumPhone.textContent = phone;
        } else {
          tyPhoneRow.style.display = 'none';
        }
      }
      if (tySumSubject) tySumSubject.textContent = subject || 'Portfolio Inquiry';
      if (tySumMsg) tySumMsg.textContent = msg;

      thankYouModal.classList.add('open');
      thankYouModal.setAttribute('aria-hidden', 'false');
      if (typeof lucide !== 'undefined') lucide.createIcons();

      const closeTyModal = () => {
        thankYouModal.classList.remove('open');
        thankYouModal.setAttribute('aria-hidden', 'true');
      };

      const tyCloseBtn = document.getElementById('thank-you-close');
      const tyOkayBtn = document.getElementById('thank-you-okay-btn');
      const tyBackdrop = document.getElementById('thank-you-backdrop');
      const tyViewOnBoard = document.getElementById('btn-view-on-board');

      if (tyCloseBtn) tyCloseBtn.onclick = closeTyModal;
      if (tyOkayBtn) tyOkayBtn.onclick = closeTyModal;
      if (tyBackdrop) tyBackdrop.onclick = closeTyModal;

      if (tyViewOnBoard) {
        tyViewOnBoard.onclick = () => {
          closeTyModal();
          const targetCard = newSavedMsg?.id ? document.getElementById(`card-${newSavedMsg.id}`) : document.getElementById('message-hub');
          if (targetCard) {
            targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
            targetCard.classList.add('just-arrived');
          }
        };
      }
    }

    if (successBanner) {
      successBanner.innerHTML = `
        <div class="success-icon-wrap">
          <i data-lucide="check-circle-2"></i>
        </div>
        <div>
          <h4>Message Received from ${escapeHtml(name)}!</h4>
          <p style="margin:2px 0 4px;color:var(--text-primary);font-size:0.86rem;">
            Sender Email: <strong style="color:var(--cyan);font-family:var(--font-mono);">${escapeHtml(email)}</strong>
            ${phone ? ` | Phone: <strong style="color:#34d399;font-family:var(--font-mono);">${escapeHtml(phone)}</strong>` : ''}
          </p>
          <p style="font-size:0.82rem;color:var(--text-secondary);margin-bottom:8px;">
            Delivered in real-time to Abhishek's communication board and transmitted to at180887@gmail.com.
          </p>
          <a
            href="https://wa.me/919595347836?text=Hi%20Abhishek%2C%20I%20just%20sent%20you%20a%20direct%20message%20from%20your%20portfolio.%20Name:%20${encodeURIComponent(name)}%2C%20Message:%20${encodeURIComponent(msg)}"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-banner-wa"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.12.82.83-3.04-.19-.32a8.19 8.19 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24m4.53 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z"/></svg>
            <span>Instant Ping on Abhishek's WhatsApp</span>
          </a>
        </div>
      `;
      successBanner.classList.add('show');
      if (typeof lucide !== 'undefined') lucide.createIcons();

      setTimeout(() => {
        successBanner.classList.remove('show');
      }, 10000);
    }

    form.reset();
    showToast(`Direct message from ${name} sent! Live on board & delivered.`);

    // If thank you modal didn't open, scroll to board directly
    if (!thankYouModal) {
      const hub = document.getElementById('message-hub');
      if (hub) {
        setTimeout(() => {
          hub.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 300);
      }
    }

    // 3. Asynchronously transmit to FormSubmit for Gmail inbox delivery
    try {
      fetch('https://formsubmit.co/ajax/at180887@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          phone: phone,
          _replyto: email,
          _subject: `🚨 Portfolio Direct Message: ${name} (${subject})`,
          _template: 'table',
          subject: subject,
          message: msg
        })
      }).catch(e => console.log('Formsubmit async notice', e));
    } catch (e) {}

    submitBtn.innerHTML = originalHtml;
    submitBtn.disabled = false;
  });
}

/* =====================================================
   14. TOAST NOTIFICATION HELPER
   ===================================================== */
function showToast(message) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i data-lucide="info" class="toast-icon"></i>
    <span>${message}</span>
  `;
  container.appendChild(toast);

  if (typeof lucide !== 'undefined') lucide.createIcons();

  requestAnimationFrame(() => toast.classList.add('show'));

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 400);
  }, 3800);
}

/* =====================================================
   15. SCROLL-TO-TOP & PROGRESS RING
   ===================================================== */
function initScrollTopProgress() {
  const btn = document.getElementById('scroll-top-btn');
  const ring = document.getElementById('ring-progress');
  const progressBar = document.getElementById('scroll-progress-bar');
  const circumference = 2 * Math.PI * 20; // r=20 => ~125.66

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) : 0;

    // Top progress bar
    if (progressBar) {
      progressBar.style.width = `${(scrollPercent * 100).toFixed(1)}%`;
    }

    // Floating button visibility
    if (btn) {
      if (scrollTop > 350) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }

    // Circular SVG progress ring
    if (ring) {
      const offset = circumference - (scrollPercent * circumference);
      ring.style.strokeDashoffset = `${offset}`;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (btn) {
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

/* =====================================================
   16. NAVBAR SCROLL & ACTIVE LINK HIGHLIGHTER
   ===================================================== */
function initNavbarScroll() {
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function onScroll() {
    if (navbar) {
      navbar.classList.toggle('scrolled', window.scrollY > 40);
    }

    // Active Section Tracking
    let currentId = '';
    const scrollY = window.scrollY + 160;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
      });
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* =====================================================
   17. SIDEBAR NAVIGATION DRAWER (3-Line Menu / Side Drawer)
   ===================================================== */
function initMobileNav() {
  const toggleMobile = document.getElementById('nav-toggle');
  const toggleDesktop = document.getElementById('btn-desktop-menu');
  const drawerPanel = document.getElementById('side-drawer-panel');
  const drawerBackdrop = document.getElementById('side-drawer-backdrop');
  const drawerClose = document.getElementById('side-drawer-close');
  const drawerLinks = document.querySelectorAll('.drawer-nav-item');
  const drawerResumeLink = document.getElementById('drawer-resume-link');

  if (!drawerPanel) return;

  function openDrawer() {
    drawerPanel.classList.add('open');
    drawerPanel.setAttribute('aria-hidden', 'false');
    if (drawerBackdrop) drawerBackdrop.classList.add('open');
    if (toggleMobile) toggleMobile.classList.add('active');
    document.body.style.overflow = 'hidden';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  function closeDrawer() {
    drawerPanel.classList.remove('open');
    drawerPanel.setAttribute('aria-hidden', 'true');
    if (drawerBackdrop) drawerBackdrop.classList.remove('open');
    if (toggleMobile) toggleMobile.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Toggle triggers (both desktop 3-line button and mobile hamburger)
  if (toggleMobile) {
    toggleMobile.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawerPanel.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (toggleDesktop) {
    toggleDesktop.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawerPanel.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener('click', closeDrawer);
  }

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawerPanel.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Handle drawer navigation links
  drawerLinks.forEach(item => {
    item.addEventListener('click', (e) => {
      if (item === drawerResumeLink) {
        e.preventDefault();
        closeDrawer();
        const resumeModal = document.getElementById('resume-modal');
        if (resumeModal) {
          resumeModal.classList.add('open');
          resumeModal.setAttribute('aria-hidden', 'false');
          document.body.style.overflow = 'hidden';
          if (typeof lucide !== 'undefined') lucide.createIcons();
        }
        return;
      }

      const href = item.getAttribute('href');
      if (href && href.startsWith('#')) {
        closeDrawer();
        const targetEl = document.querySelector(href);
        if (targetEl) {
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

/* =====================================================
   18. PROFILE IMAGE FALLBACK & LOAD
   ===================================================== */
function initProfileFallback() {
  const img = document.getElementById('hero-image');
  const fallback = document.getElementById('hero-fallback');
  if (!img || !fallback) return;

  img.addEventListener('error', () => {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  });

  if (img.complete && img.naturalWidth === 0) {
    img.style.display = 'none';
    fallback.style.display = 'flex';
  }
}

/* =====================================================
   19. INTERACTIVE MESSAGE HUB & ABHISHEK VERIFIED REPLIES
   ===================================================== */
function getMySentMessageIds() {
  try {
    const raw = localStorage.getItem('my_sent_message_ids');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function addMySentMessageId(id) {
  if (!id) return;
  try {
    const list = getMySentMessageIds();
    if (!list.includes(id)) {
      list.unshift(id);
      localStorage.setItem('my_sent_message_ids', JSON.stringify(list));
    }
  } catch (e) {}
}

function getMyPrivateMessages() {
  try {
    const raw = localStorage.getItem('my_private_messages');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return [];
}

function saveMyPrivateMessages(messages) {
  try {
    localStorage.setItem('my_private_messages', JSON.stringify(messages));
  } catch (e) {}
}

// Purge legacy public messages from previous portfolio versions if they don't belong to this user
try {
  if (localStorage.getItem('portfolio_messages')) {
    const legacy = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
    const myIds = new Set(getMySentMessageIds());
    const valid = legacy.filter(m => m && myIds.has(m.id));
    if (valid.length > 0) {
      saveMyPrivateMessages(valid);
    }
    localStorage.removeItem('portfolio_messages');
  }
} catch (e) {}

function isOwnerVerified() {
  const pin = sessionStorage.getItem('abhishek_owner_pin') || localStorage.getItem('abhishek_owner_pin');
  return pin === '1808' || pin === '180887';
}

function getMySentEmail() {
  try {
    return (localStorage.getItem('my_sent_email') || '').toLowerCase().trim();
  } catch (e) {
    return '';
  }
}

function saveMySentEmail(email) {
  try {
    if (email && email.trim()) {
      localStorage.setItem('my_sent_email', email.trim().toLowerCase());
    }
  } catch (e) {}
}

// Auto-login Developer Mode if URL param (?dev=1808, ?owner=1808, ?pin=1808) or hash (#developer, #owner) is present
try {
  const urlParams = new URLSearchParams(window.location.search);
  const devParam = urlParams.get('dev') || urlParams.get('owner') || urlParams.get('pin');
  if (devParam === '1808' || devParam === '180887') {
    sessionStorage.setItem('abhishek_owner_pin', devParam);
    localStorage.setItem('abhishek_owner_pin', devParam);
  }
  if (window.location.hash === '#developer' || window.location.hash === '#owner') {
    const existing = sessionStorage.getItem('abhishek_owner_pin') || localStorage.getItem('abhishek_owner_pin');
    if (!existing) {
      sessionStorage.setItem('abhishek_owner_pin', '1808');
      localStorage.setItem('abhishek_owner_pin', '1808');
    }
  }
} catch (e) {}

function initMessageHub() {
  const authBtn = document.getElementById('btn-owner-auth');
  const authText = document.getElementById('owner-auth-text');
  const clearBtn = document.getElementById('btn-clear-all-messages');
  const modal = document.getElementById('owner-pin-modal');
  const closeBtn = document.getElementById('owner-pin-close');
  const pinForm = document.getElementById('owner-pin-form');
  const pinInput = document.getElementById('owner-pin-input');

  function updateAuthBtnState() {
    const isOwner = isOwnerVerified();
    if (authBtn && authText) {
      if (isOwner) {
        authBtn.classList.add('active');
        authText.textContent = 'Developer Mode: All Messages Visible (Click to Logout)';
      } else {
        authBtn.classList.remove('active');
        authText.textContent = 'Developer (Abhishek) Login';
      }
    }
    if (clearBtn) {
      clearBtn.style.display = isOwner ? 'inline-flex' : 'none';
    }
  }
  window.updateAuthBtnState = updateAuthBtnState;

  window.logoutDeveloperMode = function() {
    if (confirm('Logout of Developer Mode?')) {
      sessionStorage.removeItem('abhishek_owner_pin');
      localStorage.removeItem('abhishek_owner_pin');
      updateAuthBtnState();
      showToast('Logged out of Developer Mode.');
      loadAndRenderMessages();
    }
  };

  if (authBtn) {
    authBtn.addEventListener('click', () => {
      if (isOwnerVerified()) {
        window.logoutDeveloperMode();
      } else {
        if (modal) {
          modal.classList.add('open');
          modal.setAttribute('aria-hidden', 'false');
          if (pinInput) {
            pinInput.value = '';
            setTimeout(() => pinInput.focus(), 150);
          }
        }
      }
    });
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal && modal.classList.contains('open')) closeModal();
      const tyModal = document.getElementById('thank-you-modal');
      if (tyModal && tyModal.classList.contains('open')) {
        tyModal.classList.remove('open');
        tyModal.setAttribute('aria-hidden', 'true');
      }
    }
  });

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = (pinInput ? pinInput.value : '').trim();
      if (enteredPin === '1808' || enteredPin === '180887') {
        sessionStorage.setItem('abhishek_owner_pin', enteredPin);
        localStorage.setItem('abhishek_owner_pin', enteredPin);
        updateAuthBtnState();
        closeModal();
        showToast('Welcome Developer Abhishek! All incoming client messages unlocked.');
        loadAndRenderMessages();
      } else {
        showToast('Invalid PIN. Only Developer Abhishek can view all inquiries (PIN: 1808).');
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    });
  }

  const refreshBtn = document.getElementById('btn-refresh-messages');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', async () => {
      refreshBtn.classList.add('loading');
      refreshBtn.disabled = true;
      showToast('🔄 Reloading messages from live server...');
      try {
        await loadAndRenderMessages();
        showToast('✓ Messages reloaded successfully!');
      } catch (err) {
        showToast('Could not reload: ' + err.message);
      } finally {
        setTimeout(() => {
          refreshBtn.classList.remove('loading');
          refreshBtn.disabled = false;
        }, 500);
      }
    });
  }

  updateAuthBtnState();
  loadAndRenderMessages();
}

async function saveMessageToHub(msgData) {
  const localMsg = {
    id: 'msg-' + Date.now(),
    name: (msgData.name || 'Anonymous').trim(),
    email: (msgData.email || '').trim(),
    phone: (msgData.phone || '').trim(),
    subject: (msgData.subject || 'Portfolio Inquiry').trim(),
    message: (msgData.message || '').trim(),
    createdAt: new Date().toISOString(),
    replies: []
  };

  // 1. Mark this message ID as belonging exclusively to this visitor's browser
  addMySentMessageId(localMsg.id);
  saveMySentEmail(localMsg.email);

  // 2. Store in visitor's private messages cache
  try {
    let myMsgs = getMyPrivateMessages();
    myMsgs.unshift(localMsg);
    saveMyPrivateMessages(myMsgs);
  } catch (e) {
    console.error('LocalStorage write error', e);
  }

  // 3. Sync to dynamic server API
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const data = await res.json();
      if (data && data.message) {
        addMySentMessageId(data.message.id);
        try {
          let myMsgs = getMyPrivateMessages();
          myMsgs = myMsgs.map(m => m.id === localMsg.id ? data.message : m);
          saveMyPrivateMessages(myMsgs);
        } catch (e) {}
      }
    }
  } catch (err) {
    // Static hosting fallback
  }

  // 4. Broadcast on local tab channel
  if (window._portfolioSyncChannel) {
    try { window._portfolioSyncChannel.postMessage({ type: 'new_message', id: localMsg.id, name: localMsg.name }); } catch (e) {}
  }
  await loadAndRenderMessages(localMsg.id);
  return localMsg;
}

function cleanPhone(num) {
  if (!num) return '';
  let digits = String(num).replace(/\D/g, '');
  if (digits.length === 11 && digits.startsWith('0')) {
    digits = digits.substring(1);
  }
  if (digits.length === 10) {
    return '91' + digits;
  }
  return digits;
}

function formatExactDateTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return '';
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

window.copyToClipboard = function(text, label) {
  if (!text) return;
  const showFeedback = () => showToast(`✓ Copied ${label}: ${text}`);
  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(text).then(showFeedback).catch(() => fallbackCopy(text, label));
  } else {
    fallbackCopy(text, label);
  }
};

function fallbackCopy(text, label) {
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    ta.style.top = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(`✓ Copied ${label}: ${text}`);
  } catch (e) {
    showToast(`Could not copy: ${text}`);
  }
}

async function loadAndRenderMessages(highlightId = null) {
  const container = document.getElementById('messages-feed');
  if (!container) return;

  const isOwner = isOwnerVerified();
  const ownerPin = sessionStorage.getItem('abhishek_owner_pin') || localStorage.getItem('abhishek_owner_pin') || '1808';
  const myIds = getMySentMessageIds();
  const myEmail = getMySentEmail();

  let messages = [];
  let serverMessages = [];

  // 1. Fetch from dynamic server API with strict privacy protection
  try {
    let apiUrl = `/api/messages?_t=${Date.now()}`;
    if (isOwner) {
      apiUrl += `&pin=${encodeURIComponent(ownerPin)}`;
    } else {
      if (myIds.length > 0) {
        apiUrl += `&ids=${encodeURIComponent(myIds.join(','))}`;
      }
      if (myEmail) {
        apiUrl += `&email=${encodeURIComponent(myEmail)}`;
      }
      if (myIds.length === 0 && !myEmail) {
        apiUrl += `&ids=none`;
      }
    }

    const res = await fetch(apiUrl, { cache: 'no-cache' });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      serverMessages = await res.json();
    }
  } catch (err) {
    // Dynamic server offline or running on static CDN
  }

  // 2. Load locally stored private messages
  let localMessages = [];
  try {
    if (isOwner) {
      localMessages = getMyPrivateMessages();
    } else {
      const myIdSet = new Set(myIds);
      localMessages = getMyPrivateMessages().filter(m => {
        if (!m) return false;
        if (myIdSet.has(m.id)) return true;
        if (myEmail && m.email && m.email.toLowerCase().trim() === myEmail) return true;
        return false;
      });
    }
  } catch (e) {
    localMessages = [];
  }

  // 3. Deduplicate and merge: Server + Local (Strict Privacy Enforcement)
  const messageMap = new Map();

  const isAllowedMessage = (m) => {
    if (!m || !m.id) return false;
    if (m.name === 'Sarah Jenkins' || m.name === 'Vikram Patel') return false; // Filter legacy dummy items
    if (isOwner) return true;
    if (myIds.includes(m.id)) return true;
    if (myEmail && m.email && m.email.toLowerCase().trim() === myEmail) return true;
    return false;
  };

  if (Array.isArray(serverMessages)) {
    serverMessages.forEach(m => {
      if (isAllowedMessage(m)) {
        messageMap.set(m.id, m);
      }
    });
  }

  if (Array.isArray(localMessages)) {
    localMessages.forEach(m => {
      if (isAllowedMessage(m)) {
        if (!messageMap.has(m.id)) {
          messageMap.set(m.id, m);
        } else {
          const existing = messageMap.get(m.id);
          if ((!existing.replies || existing.replies.length === 0) && (m.replies && m.replies.length > 0)) {
            existing.replies = m.replies;
          }
        }
      }
    });
  }

  messages = Array.from(messageMap.values());
  messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Sync visitor's private messages storage
  if (!isOwner && messages.length > 0) {
    saveMyPrivateMessages(messages);
  }

  // Generate Status Alert Banner
  let statusBannerHtml = '';
  if (isOwner) {
    statusBannerHtml = `
      <div class="hub-status-alert dev-mode-alert">
        <div class="status-info">
          <i data-lucide="shield-check"></i>
          <span><strong>Developer Mode Active:</strong> All incoming client messages visible (${messages.length} inquiries received).</span>
        </div>
        <button class="btn-alert-logout" onclick="window.logoutDeveloperMode()">Logout Developer Mode</button>
      </div>
    `;
  } else if (messages.length > 0) {
    statusBannerHtml = `
      <div class="hub-status-alert sender-mode-alert">
        <div class="status-info">
          <i data-lucide="lock"></i>
          <span><strong>Your Private Messages (${messages.length}):</strong> Strictly confidential — only you and Developer Abhishek Tripathi can view your sent messages and replies.</span>
        </div>
      </div>
    `;
  }

  // 4. Confidential empty state when visitor has no messages sent
  if (!messages || messages.length === 0) {
    if (isOwner) {
      container.innerHTML = `
        ${statusBannerHtml}
        <div class="messages-empty-state">
          <div class="empty-icon-ring">
            <i data-lucide="shield-check"></i>
          </div>
          <h4>No Direct Client Messages Yet</h4>
          <p>Incoming client inquiries and direct messages sent to Abhishek Tripathi will appear here in real-time with instant chime notification.</p>
        </div>
      `;
    } else {
      container.innerHTML = `
        <div class="messages-empty-state private-channel-state">
          <div class="empty-icon-ring">
            <i data-lucide="shield-check"></i>
          </div>
          <h4>Confidential &amp; Private Communication</h4>
          <p>Messages submitted to Abhishek Tripathi are strictly confidential. Only you on this device and Developer Abhishek can view your messages and replies. No other visitor will see your note or details.</p>
          <button class="btn btn-primary btn-sm" onclick="document.getElementById('form-name')?.focus(); document.getElementById('contact')?.scrollIntoView({behavior:'smooth'})">
            <i data-lucide="send"></i>
            <span>Send a Private Message to Abhishek</span>
          </button>
        </div>
      `;
    }
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  container.innerHTML = statusBannerHtml + messages.map(msg => {
    const senderInitials = getInitials(msg.name || 'Visitor');
    const timeFormatted = formatTimeAgo(msg.createdAt);
    const exactTimeFormatted = formatExactDateTime(msg.createdAt);
    const isNewArrival = msg.id === highlightId;
    const cleanedPhone = cleanPhone(msg.phone);
    const gmailUrl = msg.email ? `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(msg.email)}&su=${encodeURIComponent('Re: ' + (msg.subject || 'Portfolio Inquiry'))}&body=${encodeURIComponent('Hi ' + (msg.name || 'there') + ',\n\nThank you for reaching out to me through my portfolio.\n\nBest regards,\nAbhishek Tripathi\nPhone: +91 9595347836')}` : '#';
    const waUrl = cleanedPhone ? `https://wa.me/${cleanedPhone}?text=${encodeURIComponent('Hi ' + (msg.name || 'there') + ', Abhishek Tripathi here regarding your message on my portfolio: "' + (msg.subject || 'Inquiry') + '"')}` : '#';
    const telUrl = cleanedPhone ? `tel:+${cleanedPhone}` : '#';
    const hasReplies = msg.replies && msg.replies.length > 0;

    const repliesHtml = hasReplies
      ? `
        <div class="replies-container">
          ${msg.replies.map(rep => `
            <div class="reply-card">
              <div class="reply-header">
                <div class="reply-author-info">
                  <img src="assets/abhishek-tripathi.jpeg" alt="Abhishek Tripathi" class="reply-author-img" />
                  <div class="reply-author-meta">
                    <div class="reply-title-row">
                      <span class="reply-author-name">${escapeHtml(rep.author || 'Abhishek Tripathi')}</span>
                      <span class="verified-badge"><i data-lucide="shield-check"></i> Abhishek Verified</span>
                    </div>
                    <span class="reply-author-email"><i data-lucide="mail"></i> at180887@gmail.com</span>
                  </div>
                </div>
                <span class="reply-time">${formatTimeAgo(rep.createdAt)}</span>
              </div>
              <p class="reply-text">${escapeHtml(rep.text)}</p>
            </div>
          `).join('')}
        </div>
      `
      : (!isOwner
          ? `
            <div class="awaiting-reply-notice">
              <i data-lucide="clock"></i>
              <span>Delivered in real-time to Abhishek Tripathi (at180887@gmail.com). Awaiting Abhishek's verified response.</span>
            </div>
          `
          : ''
        );

    const ownerReplyBtn = isOwner
      ? `
        <button class="btn-reply-action" onclick="window.toggleReplyBox('${msg.id}')" aria-label="Reply to ${escapeHtml(msg.name)}">
          <i data-lucide="message-square"></i>
          <span>Reply as Abhishek</span>
        </button>
      `
      : '';

    const roleBadge = isOwner
      ? `<span class="msg-visitor-pill"><i data-lucide="user"></i> Client Inquiry</span>`
      : `<span class="msg-visitor-pill private-pill"><i data-lucide="lock"></i> Private &bull; Visible only to You &amp; Abhishek</span>`;

    const bottomActions = isOwner
      ? `
        <div class="msg-actions-bar">
          ${ownerReplyBtn}
          ${msg.email ? `
            <a href="${gmailUrl}" target="_blank" rel="noopener noreferrer" class="btn-email-reply" title="Direct Email via Gmail">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
              <span>Email ${escapeHtml(msg.name)}</span>
            </a>
          ` : ''}
          ${msg.phone ? `
            <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-mini" title="Direct WhatsApp Chat with ${escapeHtml(msg.name)}">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.12.82.83-3.04-.19-.32a8.19 8.19 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24m4.53 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z"/></svg>
              <span>WhatsApp ${escapeHtml(msg.name)}</span>
            </a>
          ` : ''}
          <button class="btn-delete-msg" onclick="window.deleteMessage('${msg.id}')" title="Delete Message (Abhishek PIN: 1808)">
            <i data-lucide="trash-2"></i>
            <span>Delete</span>
          </button>
        </div>
      `
      : `
        <div class="msg-actions-bar">
          <a
            href="https://wa.me/919595347836?text=Hi%20Abhishek%2C%20following%20up%20on%20my%20portfolio%20message%20(ID:%20${encodeURIComponent(msg.id)})"
            target="_blank"
            rel="noopener noreferrer"
            class="btn-whatsapp-mini"
            title="Instant WhatsApp follow-up with Abhishek"
          >
            <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.12.82.83-3.04-.19-.32a8.19 8.19 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24m4.53 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z"/></svg>
            <span>WhatsApp Abhishek</span>
          </a>
          <a
            href="mailto:at180887@gmail.com?subject=Regarding%20Portfolio%20Inquiry%20(${encodeURIComponent(msg.subject || 'Direct Message')})"
            class="btn-email-reply"
            title="Direct Email to Abhishek"
          >
            <i data-lucide="mail"></i>
            <span>Email Abhishek</span>
          </a>
          <button class="btn-delete-msg" onclick="window.deleteMyMessage('${msg.id}')" title="Remove this message from your board">
            <i data-lucide="trash-2"></i>
            <span>Remove from My Board</span>
          </button>
        </div>
      `;

    return `
      <div class="message-card glass-panel ${isNewArrival ? 'just-arrived' : ''}" id="card-${msg.id}">
        <div class="msg-header">
          <div class="msg-sender-info">
            <div class="msg-avatar">${senderInitials}</div>
            <div class="msg-sender-meta">
              <div class="msg-name-badge-row">
                <span class="msg-sender-name">${escapeHtml(msg.name || 'Anonymous')}</span>
                ${roleBadge}
              </div>
              <span class="msg-subject-tag"><i data-lucide="bookmark"></i> ${escapeHtml(msg.subject || 'Portfolio Inquiry')}</span>
            </div>
          </div>
          <div class="msg-timestamp-badge" title="Received at: ${exactTimeFormatted}">
            <span class="msg-relative-time"><i data-lucide="clock"></i> ${timeFormatted}</span>
            <span class="msg-exact-time">${exactTimeFormatted}</span>
          </div>
        </div>

        <!-- SENDER DETAILS DOSSIER -->
        <div class="msg-sender-details-card">
          <!-- Row 1: Sender Full Name -->
          <div class="msg-detail-row">
            <div class="detail-row-left">
              <span class="detail-label-tag"><i data-lucide="user"></i> Full Name:</span>
              <span class="detail-full-value name-value">${escapeHtml(msg.name || 'Anonymous')}</span>
            </div>
            <div class="detail-actions-group">
              <button
                class="btn-action-chip btn-chip-copy"
                onclick="window.copyToClipboard('${escapeHtml(msg.name || '')}', 'Name')"
                title="Copy Name"
              >
                <i data-lucide="copy"></i>
                <span>Copy</span>
              </button>
            </div>
          </div>

          <!-- Row 2: Sender Email with Direct Actions -->
          <div class="msg-detail-row">
            <div class="detail-row-left">
              <span class="detail-label-tag"><i data-lucide="mail"></i> Email Address:</span>
              ${msg.email ? `
                <a
                  href="mailto:${escapeHtml(msg.email)}?subject=Re:%20${encodeURIComponent(msg.subject || 'Portfolio Inquiry')}"
                  class="detail-full-value email-value"
                  title="Click to open default mail client"
                >
                  ${escapeHtml(msg.email)}
                </a>
              ` : `
                <span class="detail-full-value muted-value">No email provided</span>
              `}
            </div>
            ${msg.email ? `
              <div class="detail-actions-group">
                <button
                  class="btn-action-chip btn-chip-copy"
                  onclick="window.copyToClipboard('${escapeHtml(msg.email)}', 'Email')"
                  title="Copy Email Address"
                >
                  <i data-lucide="copy"></i>
                  <span>Copy</span>
                </button>
              </div>
            ` : ''}
          </div>

          <!-- Row 3: Phone / WhatsApp -->
          <div class="msg-detail-row">
            <div class="detail-row-left">
              <span class="detail-label-tag"><i data-lucide="phone"></i> Phone / WhatsApp:</span>
              ${msg.phone ? `
                <a
                  href="${telUrl}"
                  class="detail-full-value phone-value"
                  title="Click to dial on phone"
                >
                  ${escapeHtml(msg.phone)}
                </a>
              ` : `
                <span class="detail-full-value muted-value">Not provided (visitor left blank)</span>
              `}
            </div>
            ${msg.phone ? `
              <div class="detail-actions-group">
                <button
                  class="btn-action-chip btn-chip-copy"
                  onclick="window.copyToClipboard('${escapeHtml(msg.phone)}', 'Phone Number')"
                  title="Copy Phone Number"
                >
                  <i data-lucide="copy"></i>
                  <span>Copy</span>
                </button>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Full Message Content -->
        <div class="msg-body-wrapper">
          <div class="msg-body-title">
            <i data-lucide="message-square"></i>
            <span>Message Content:</span>
          </div>
          <p class="msg-text">${escapeHtml(msg.message)}</p>
        </div>

        ${repliesHtml}

        ${bottomActions}

        ${isOwner ? `
          <div class="inline-reply-box" id="reply-box-${msg.id}" style="display: none;">
            <textarea
              class="reply-textarea"
              id="reply-text-${msg.id}"
              placeholder="Write your verified response as Abhishek Tripathi to ${escapeHtml(msg.name)} (${escapeHtml(msg.email || '')})..."
              rows="3"
            ></textarea>
            <div class="reply-box-btns">
              <button class="btn btn-primary btn-sm" onclick="window.submitReply('${msg.id}')">
                <i data-lucide="send"></i>
                <span>Post Verified Reply</span>
              </button>
              <button class="btn btn-glass btn-sm" onclick="window.toggleReplyBox('${msg.id}')">
                <span>Cancel</span>
              </button>
            </div>
          </div>
        ` : ''}
      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

window.deleteMyMessage = function(msgId) {
  if (!confirm('Remove this message from your board?')) return;
  try {
    let myIds = getMySentMessageIds().filter(id => id !== msgId);
    localStorage.setItem('my_sent_message_ids', JSON.stringify(myIds));
    let myMsgs = getMyPrivateMessages().filter(m => m.id !== msgId);
    saveMyPrivateMessages(myMsgs);
    showToast('✓ Message removed from your board.');
  } catch (e) {}
  loadAndRenderMessages();
};

window.toggleReplyBox = function(msgId) {
  const box = document.getElementById(`reply-box-${msgId}`);
  if (!box) return;
  const isHidden = box.style.display === 'none' || !box.style.display;
  box.style.display = isHidden ? 'flex' : 'none';
  if (isHidden) {
    const textarea = document.getElementById(`reply-text-${msgId}`);
    if (textarea) setTimeout(() => textarea.focus(), 100);
  }
};

window.submitReply = async function(msgId) {
  const pin = sessionStorage.getItem('abhishek_owner_pin') || localStorage.getItem('abhishek_owner_pin') || '1808';
  const textarea = document.getElementById(`reply-text-${msgId}`);
  if (!textarea) return;

  const replyText = textarea.value.trim();
  if (!replyText) {
    showToast('Please enter your reply text.');
    textarea.focus();
    return;
  }

  showToast('Posting verified response as Abhishek...');

  try {
    const res = await fetch('/api/messages/reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: msgId,
        text: replyText,
        pin: pin
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit reply');
    }

    showToast('Verified reply posted successfully!');
    if (window._portfolioSyncChannel) {
      try { window._portfolioSyncChannel.postMessage({ type: 'new_reply', messageId: msgId }); } catch (e) {}
    }
    loadAndRenderMessages();
  } catch (err) {
    showToast('Error: ' + err.message);
  }
};

window.deleteMessage = async function(msgId) {
  let pin = sessionStorage.getItem('abhishek_owner_pin') || localStorage.getItem('abhishek_owner_pin');
  if (!pin || (pin !== '1808' && pin !== '180887')) {
    const enteredPin = prompt('Enter Abhishek Owner PIN to delete this message (PIN: 1808):');
    if (!enteredPin) return;
    if (enteredPin.trim() !== '1808' && enteredPin.trim() !== '180887') {
      showToast('❌ Invalid PIN. Only Abhishek can delete messages.');
      return;
    }
    pin = enteredPin.trim();
    sessionStorage.setItem('abhishek_owner_pin', pin);
    if (typeof window.updateAuthBtnState === 'function') {
      window.updateAuthBtnState();
    }
  }

  if (!confirm('Are you sure you want to permanently delete this message?')) return;

  try {
    const res = await fetch('/api/messages/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: msgId, pin: pin })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to delete');
    }
    showToast('✓ Message deleted successfully.');
  } catch (err) {
    console.warn('Backend delete note:', err.message);
  }

  try {
    let myMsgs = getMyPrivateMessages().filter(m => m && m.id !== msgId);
    saveMyPrivateMessages(myMsgs);
  } catch (e) {}

  if (window._portfolioSyncChannel) {
    try { window._portfolioSyncChannel.postMessage({ type: 'message_deleted', messageId: msgId }); } catch (e) {}
  }
  await loadAndRenderMessages();
};

window.clearAllMessages = async function() {
  let pin = sessionStorage.getItem('abhishek_owner_pin') || localStorage.getItem('abhishek_owner_pin');
  if (!pin || (pin !== '1808' && pin !== '180887')) {
    const enteredPin = prompt('Enter Abhishek Owner PIN to clear all messages (PIN: 1808):');
    if (!enteredPin) return;
    if (enteredPin.trim() !== '1808' && enteredPin.trim() !== '180887') {
      showToast('❌ Invalid PIN. Only Abhishek can clear messages.');
      return;
    }
    pin = enteredPin.trim();
    sessionStorage.setItem('abhishek_owner_pin', pin);
    if (typeof window.updateAuthBtnState === 'function') {
      window.updateAuthBtnState();
    }
  }

  if (!confirm('⚠️ Are you sure you want to DELETE ALL messages permanently? This cannot be undone.')) return;

  try {
    const res = await fetch('/api/messages/clear-all', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: pin })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to clear all');
    }
    showToast('✓ All messages cleared from server.');
  } catch (err) {
    console.warn('Backend clear-all note:', err.message);
  }

  try {
    localStorage.removeItem('my_private_messages');
  } catch (e) {}

  if (window._portfolioSyncChannel) {
    try { window._portfolioSyncChannel.postMessage({ type: 'messages_cleared' }); } catch (e) {}
  }
  showToast('✓ All messages cleared successfully.');
  await loadAndRenderMessages();
};

function getInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatTimeAgo(isoString) {
  if (!isoString) return 'Recently';
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return 'Recently';
  const now = new Date();
  const diffSec = Math.floor((now - date) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  if (diffSec < 604800) return `${Math.floor(diffSec / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/* =====================================================
   20. REAL-TIME SYNCHRONIZATION & NOTIFICATION SOUND
   ===================================================== */
function playNotificationSound() {
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
    osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.55);
  } catch (e) {
    // Autoplay policy fallback
  }
}

function initRealtimeSync() {
  // 1. Instant Cross-Tab Realtime Synchronization via BroadcastChannel
  if ('BroadcastChannel' in window) {
    try {
      const channel = new BroadcastChannel('abhishek_portfolio_realtime');
      channel.onmessage = (event) => {
        if (event.data && event.data.type) {
          const isOwner = isOwnerVerified();
          const myIds = getMySentMessageIds();

          if (event.data.type === 'new_message') {
            if (isOwner) {
              playNotificationSound();
              showToast(`🔔 Real-Time Inquiry from ${event.data.name || 'Visitor'}!`);
              loadAndRenderMessages(event.data.id);
            } else if (myIds.includes(event.data.id)) {
              loadAndRenderMessages(event.data.id);
            }
          } else if (event.data.type === 'new_reply') {
            if (isOwner) {
              loadAndRenderMessages();
            } else if (myIds.includes(event.data.messageId)) {
              playNotificationSound();
              showToast('💬 Abhishek Tripathi posted a verified reply to your inquiry!');
              loadAndRenderMessages(event.data.messageId);
            }
          } else if (event.data.type === 'message_deleted' || event.data.type === 'messages_cleared') {
            loadAndRenderMessages();
          }
        }
      };
      window._portfolioSyncChannel = channel;
    } catch (e) {}
  }

  // 2. Server-Sent Events (SSE) for instant server-push across internet
  if (window.EventSource) {
    try {
      const sse = new EventSource('/api/messages/stream');

      sse.addEventListener('new_message', (e) => {
        try {
          const newMsg = JSON.parse(e.data);
          const isOwner = isOwnerVerified();
          const myIds = getMySentMessageIds();

          if (isOwner) {
            playNotificationSound();
            showToast(`🔔 New client inquiry from ${newMsg.name}!`);
            loadAndRenderMessages(newMsg.id);
          } else if (myIds.includes(newMsg.id)) {
            loadAndRenderMessages(newMsg.id);
          }
        } catch (err) {}
      });

      sse.addEventListener('new_reply', (e) => {
        try {
          const data = JSON.parse(e.data);
          const isOwner = isOwnerVerified();
          const myIds = getMySentMessageIds();
          const targetMsgId = data.messageId || data.target?.id;

          if (isOwner) {
            loadAndRenderMessages();
          } else if (myIds.includes(targetMsgId)) {
            playNotificationSound();
            showToast('💬 Abhishek Tripathi replied to your message!');
            loadAndRenderMessages(targetMsgId);
          }
        } catch (err) {}
      });

      sse.addEventListener('message_deleted', () => {
        loadAndRenderMessages();
      });

      sse.addEventListener('messages_cleared', () => {
        loadAndRenderMessages();
      });

      sse.onerror = () => {
        // SSE automatically reconnects
      };
    } catch (err) {
      console.warn('SSE realtime init notice:', err);
    }
  }

  // 3. Continuous real-time polling backup (every 5 seconds)
  let lastKnownCount = -1;
  setInterval(async () => {
    try {
      const isOwner = isOwnerVerified();
      const myIds = getMySentMessageIds();

      // Third-party visitors who haven't sent any messages do not poll
      if (!isOwner && myIds.length === 0) return;

      let url = `/api/messages?_t=${Date.now()}`;
      if (isOwner) {
        const pin = sessionStorage.getItem('abhishek_owner_pin') || localStorage.getItem('abhishek_owner_pin') || '1808';
        url += `&pin=${encodeURIComponent(pin)}`;
      } else {
        url += `&ids=${encodeURIComponent(myIds.join(','))}`;
      }

      const res = await fetch(url, { cache: 'no-cache' });
      const contentType = res.headers.get('content-type') || '';
      if (res.ok && contentType.includes('application/json')) {
        const list = await res.json();
        if (Array.isArray(list)) {
          if (lastKnownCount !== -1 && list.length > lastKnownCount) {
            if (isOwner) {
              playNotificationSound();
              showToast(`🔔 New inquiry from ${list[0]?.name}!`);
              loadAndRenderMessages(list[0]?.id);
            } else if (myIds.includes(list[0]?.id)) {
              loadAndRenderMessages(list[0]?.id);
            }
          }
          lastKnownCount = list.length;
        }
      }
    } catch (e) {}
  }, 5000);
}

/* =====================================================
   20. PORTFOLIO INITIALIZATION COMPLETE
   ===================================================== */



