/* =====================================================
   ABHISHEK TRIPATHI — 3D & ANIMATED PORTFOLIO SCRIPT
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initLucideIcons();
  initThreeJsHero();
  init3DTilt();
  initCustomCursor();
  initTypewriter();
  initScrollReveal();
  initLaserTimeline();
  initStatCounters();
  initProjectFilters();
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
   2. THREE.JS 3D INTERACTIVE HERO BACKGROUND
   ===================================================== */
function initThreeJsHero() {
  const canvas = document.getElementById('hero-3d-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const wrapper = canvas.parentElement;
  let width = wrapper.offsetWidth;
  let height = wrapper.offsetHeight;

  // Scene & Camera
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 32;

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 1. Floating 3D Geometric Torus Knot Wireframe
  const torusGeometry = new THREE.TorusKnotGeometry(9, 2.2, 120, 24, 2, 3);
  const torusMaterial = new THREE.MeshBasicMaterial({
    color: 0x00f0ff,
    wireframe: true,
    transparent: true,
    opacity: 0.18
  });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.position.set(12, -2, -5);
  scene.add(torusMesh);

  // 2. 3D Particle Starfield & Constellation
  const particleCount = 180;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleVelocities = [];

  for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * 70;
    const y = (Math.random() - 0.5) * 50;
    const z = (Math.random() - 0.5) * 40;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particleVelocities.push({
      vx: (Math.random() - 0.5) * 0.02,
      vy: (Math.random() - 0.5) * 0.02,
      vz: (Math.random() - 0.5) * 0.02
    });
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  // Particle Material (Dual colors using point texture or sprite)
  const particleMaterial = new THREE.PointsMaterial({
    color: 0x00f0ff,
    size: 0.8,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particleSystem);

  // 3. Dynamic Connecting Lines between nearby 3D points
  const lineMaterial = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.12,
    blending: THREE.AdditiveBlending
  });

  // Mouse Interaction Variables
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.015;
    mouseY = (e.clientY - windowHalfY) * 0.015;
  }, { passive: true });

  // Animation Loop
  let animationFrameId;
  let isRunning = true;

  function animate() {
    if (!isRunning) return;

    // Smooth inertia camera motion
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 1.5;
    camera.position.y = -targetY * 1.5;
    camera.lookAt(scene.position);

    // Rotate Torus Knot
    torusMesh.rotation.x += 0.003;
    torusMesh.rotation.y += 0.005;

    // Update particles
    const positions = particleGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] += particleVelocities[i].vx;
      positions[i * 3 + 1] += particleVelocities[i].vy;
      positions[i * 3 + 2] += particleVelocities[i].vz;

      // Wrap around bounds
      if (Math.abs(positions[i * 3]) > 35) particleVelocities[i].vx *= -1;
      if (Math.abs(positions[i * 3 + 1]) > 25) particleVelocities[i].vy *= -1;
      if (Math.abs(positions[i * 3 + 2]) > 20) particleVelocities[i].vz *= -1;
    }
    particleGeometry.attributes.position.needsUpdate = true;

    // Slow rotation of entire particle cluster
    particleSystem.rotation.y += 0.001;

    renderer.render(scene, camera);
    animationFrameId = requestAnimationFrame(animate);
  }

  animate();

  // Resize Handler
  function onWindowResize() {
    width = wrapper.offsetWidth;
    height = wrapper.offsetHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  }

  window.addEventListener('resize', onWindowResize);

  // Performance Optimizer: Pause when hero is out of view
  const heroSection = document.getElementById('home');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!isRunning) {
            isRunning = true;
            animate();
          }
        } else {
          isRunning = false;
          cancelAnimationFrame(animationFrameId);
        }
      });
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }
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
    'Full Stack Developer',
    'Web3 & Blockchain Builder',
    'Data Analytics Enthusiast',
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
    });
  });
}

/* =====================================================
   10. PROJECT QUICK-VIEW MODAL
   ===================================================== */
const projectData = {
  'amazon-clone': {
    title: 'Amazon 2.0 – 3D Interactive E-Commerce Platform',
    year: '2026',
    category: 'Full Stack & 3D WebGL E-Commerce',
    image: 'assets/project-amazon-clone.jpg',
    desc: 'An enterprise-grade, ultra-modern Amazon Clone powered by Three.js WebGL 3D spatial product inspection, 60fps card tilt physics, 1-Click Express Buy, UPI/Multi-Currency payment gateway, and village doorstep logistics across 155,000+ PIN codes. Engineered as a flagship showcase for freelancing clients and production e-commerce.',
    highlights: [
      'Interactive 3D Three.js Spatial Arena with 360° spherical orbit drag, rotational inertia, and animated pulsing feature hotspots.',
      'Physics-driven 60fps CSS 3D perspective card tilt with dynamic specular cursor glare and layered spatial depth.',
      'Village & Rural Doorstep Delivery engine supporting 155,000+ India Post PIN codes, Gram Panchayats, and global postal routes.',
      'Instant UPI payment engine (Google Pay, PhonePe, Paytm, BHIM QR generator) + real-time multi-currency converter (INR, USD, EUR, GBP).',
      '1-Click Express Checkout modal, dynamic reactive cart, and Seller Central Studio product management.'
    ],
    tech: ['Three.js', 'WebGL', 'JavaScript (ES6+)', 'UPI Payments', 'CSS 3D Transforms', 'LocalStorage', 'Responsive UI'],
    github: 'https://github.com/abhishektripathi9/Amazon-clone-',
    liveDemo: './amazon-clone/index.html'
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
  },
  weather: {
    title: 'Real-Time Weather Forecast Application',
    year: '2025',
    category: 'Web Application & API Telemetry',
    image: 'assets/project-weather.jpg',
    desc: 'An ultra-responsive telemetry web application delivering hyper-accurate weather reports using OpenWeather API integration. Styled with glassmorphism aesthetics and animated weather icons matching current meteorological conditions.',
    highlights: [
      'Live OpenWeather API integration providing current temp, precipitation, wind speed, and humidity.',
      'Interactive radar preview with dynamic atmospheric gradients corresponding to local conditions.',
      '7-day multi-tier forecast cards and interactive hourly telemetry charts.',
      'Location auto-detection via browser Geolocation API with city search autocomplete.'
    ],
    tech: ['React.js', 'JavaScript (ES6+)', 'OpenWeather API', 'HTML5', 'CSS3 Glassmorphism'],
    github: 'https://github.com/abhishektripathi9',
    liveDemo: './weather/index.html'
  },
  salary: {
    title: 'Salary Prediction & Compensation Analytics',
    year: '2024',
    category: 'Machine Learning & Data Science',
    image: 'assets/project-salary.jpg',
    desc: 'A machine learning regression system engineered to accurately predict software engineer compensation based on years of experience, skill ratings, education tier, and tech stack demand.',
    highlights: [
      'Engineered with Scikit-learn, Pandas, and NumPy for comprehensive data preprocessing and outlier filtering.',
      'Trained and evaluated multiple regression models (Linear, Polynomial, Random Forest) with R² metric tracking.',
      'Interactive dashboard featuring sliders for real-time compensation projections and feature importance ranking.',
      'Visualized distribution plots and variance curves illustrating salary density across roles.'
    ],
    tech: ['Python', 'Pandas', 'NumPy', 'Scikit-learn', 'Regression Analysis', 'Matplotlib'],
    github: 'https://github.com/abhishektripathi9',
    liveDemo: './salary/index.html'
  },
  portfolio: {
    title: '3D Holographic Developer Portfolio',
    year: '2026',
    category: 'Creative Web & 3D Graphics',
    image: 'assets/project-portfolio.jpg',
    desc: 'A cutting-edge developer portfolio designed with modern WebGL capabilities. Features an interactive 3D particle constellation using Three.js, realistic 3D mouse tilt with dynamic specular glare, cyber-glassmorphism tokens, and seamless micro-animations.',
    highlights: [
      'Interactive Three.js 3D background with particle constellations reacting to cursor momentum.',
      'Physics-based CSS 3D perspective tilt on cards with dynamic cursor-following specular sheen.',
      'Custom cyber glowing cursor follower and scroll progress telemetry indicators.',
      'Fully responsive, accessible, and high-performance WebGL rendering with automated off-screen pause.'
    ],
    tech: ['Three.js', 'WebGL', 'JavaScript (ES6+)', 'HTML5', 'CSS 3D Transforms'],
    github: 'https://github.com/abhishektripathi9',
    liveDemo: './index.html'
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
            
            <h4 style="color:#00f0ff;font-family:var(--font-heading);margin-bottom:12px;font-size:1.05rem;">Key Architecture Highlights</h4>
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
                <a href="${data.liveDemo}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-3d" style="background:linear-gradient(135deg,#10b981,#00f0ff);color:#040711;font-weight:700;">
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

    // 2. Play sound feedback & show success
    playNotificationSound();

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

    // Scroll smoothly to message hub so the sender sees their message right in front!
    const hub = document.getElementById('message-hub');
    if (hub) {
      setTimeout(() => {
        hub.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 300);
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
   17. MOBILE NAVIGATION DRAWER
   ===================================================== */
function initMobileNav() {
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  if (!toggle || !links) return;

  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  links.querySelectorAll('.nav-link, .btn-nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target) && links.classList.contains('open')) {
      toggle.classList.remove('active');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }
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
function isOwnerVerified() {
  const pin = sessionStorage.getItem('abhishek_owner_pin');
  return pin === '1808' || pin === '180887';
}

function initMessageHub() {
  const authBtn = document.getElementById('btn-owner-auth');
  const authText = document.getElementById('owner-auth-text');
  const modal = document.getElementById('owner-pin-modal');
  const closeBtn = document.getElementById('owner-pin-close');
  const pinForm = document.getElementById('owner-pin-form');
  const pinInput = document.getElementById('owner-pin-input');

  function updateAuthBtnState() {
    if (!authBtn || !authText) return;
    if (isOwnerVerified()) {
      authBtn.classList.add('active');
      authText.textContent = 'Abhishek Mode: Active (Click to Logout)';
    } else {
      authBtn.classList.remove('active');
      authText.textContent = 'Abhishek (Owner) Reply Mode';
    }
  }

  if (authBtn) {
    authBtn.addEventListener('click', () => {
      if (isOwnerVerified()) {
        if (confirm('Logout of Abhishek Reply Mode?')) {
          sessionStorage.removeItem('abhishek_owner_pin');
          updateAuthBtnState();
          showToast('Logged out of Abhishek Reply Mode.');
          loadAndRenderMessages();
        }
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
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  if (pinForm) {
    pinForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const enteredPin = (pinInput ? pinInput.value : '').trim();
      if (enteredPin === '1808' || enteredPin === '180887') {
        sessionStorage.setItem('abhishek_owner_pin', enteredPin);
        updateAuthBtnState();
        closeModal();
        showToast('Welcome Abhishek! Verified reply mode unlocked.');
        loadAndRenderMessages();
      } else {
        showToast('Invalid PIN. Only Abhishek can post verified replies (Default: 1808).');
        if (pinInput) {
          pinInput.value = '';
          pinInput.focus();
        }
      }
    });
  }

  updateAuthBtnState();
  loadAndRenderMessages();
}

async function saveMessageToHub(msgData) {
  let created = null;
  try {
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(msgData)
    });
    if (res.ok) {
      const data = await res.json();
      created = data.message;
    }
  } catch (err) {
    try {
      const stored = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      created = {
        id: 'msg-' + Date.now(),
        name: msgData.name,
        email: msgData.email || '',
        phone: msgData.phone || '',
        subject: msgData.subject || 'Portfolio Inquiry',
        message: msgData.message,
        createdAt: new Date().toISOString(),
        replies: []
      };
      stored.unshift(created);
      localStorage.setItem('portfolio_messages', JSON.stringify(stored));
    } catch (e) {
      console.error(e);
    }
  }
  loadAndRenderMessages(created?.id);
  return created;
}

async function loadAndRenderMessages(highlightId = null) {
  const container = document.getElementById('messages-feed');
  if (!container) return;

  let messages = [];

  try {
    const res = await fetch('/api/messages', { cache: 'no-cache' });
    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      messages = await res.json();
      localStorage.setItem('portfolio_messages', JSON.stringify(messages));
    } else {
      const staticRes = await fetch('./messages.json', { cache: 'no-cache' });
      if (staticRes.ok) {
        messages = await staticRes.json();
      } else {
        throw new Error('Static fallback');
      }
    }
  } catch (err) {
    // Clean up any legacy fake sample data
    const localRaw = localStorage.getItem('portfolio_messages');
    if (localRaw && (localRaw.includes('Sarah Jenkins') || localRaw.includes('Vikram Patel'))) {
      localStorage.removeItem('portfolio_messages');
    }

    const local = localStorage.getItem('portfolio_messages');
    if (local) {
      try {
        messages = JSON.parse(local);
      } catch (e) {
        messages = [];
      }
    }
  }

  // Filter out any fake demo messages if present
  if (Array.isArray(messages)) {
    messages = messages.filter(m => m.name !== 'Sarah Jenkins' && m.name !== 'Vikram Patel');
  }

  // Clean professional empty state when no messages have been sent yet
  if (!messages || messages.length === 0) {
    container.innerHTML = `
      <div class="messages-empty-state">
        <div class="empty-icon-ring">
          <i data-lucide="message-square-dashed"></i>
        </div>
        <h4>No Direct Messages Yet</h4>
        <p>Real-time incoming messages from your portfolio visitors will appear here automatically with instant chime notification.</p>
        <button class="btn btn-outline btn-sm" onclick="document.getElementById('form-name')?.focus()">
          <i data-lucide="send"></i>
          <span>Send First Message Above</span>
        </button>
      </div>
    `;
    if (typeof lucide !== 'undefined') lucide.createIcons();
    return;
  }

  const isOwner = isOwnerVerified();

  container.innerHTML = messages.map(msg => {
    const senderInitials = getInitials(msg.name || 'Visitor');
    const timeFormatted = formatTimeAgo(msg.createdAt);
    const isNewArrival = msg.id === highlightId;

    const repliesHtml = (msg.replies && msg.replies.length > 0)
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
      : '';

    const ownerReplyBtn = isOwner
      ? `
        <button class="btn-reply-action" onclick="window.toggleReplyBox('${msg.id}')" aria-label="Reply to ${escapeHtml(msg.name)}">
          <i data-lucide="message-square"></i>
          <span>Reply as Abhishek</span>
        </button>
      `
      : `
        <button class="btn-reply-action" onclick="document.getElementById('btn-owner-auth').click()" aria-label="Abhishek Reply Mode">
          <i data-lucide="lock"></i>
          <span>Abhishek: Unlock to Reply</span>
        </button>
      `;

    const emailBtn = msg.email
      ? `
        <a href="mailto:${encodeURIComponent(msg.email)}?subject=${encodeURIComponent('Re: ' + (msg.subject || 'Portfolio Inquiry'))}" class="btn-email-reply" title="Direct Email">
          <i data-lucide="mail"></i>
          <span>Email ${escapeHtml(msg.name)} (${escapeHtml(msg.email)})</span>
        </a>
      `
      : '';

    const whatsappBtn = msg.phone
      ? `
        <a href="https://wa.me/${escapeHtml(cleanPhone(msg.phone))}?text=Hi%20${encodeURIComponent(msg.name)}%2C%20Abhishek%20here%20regarding%20your%20message%20on%20my%20portfolio" target="_blank" rel="noopener noreferrer" class="btn-whatsapp-mini" title="Direct WhatsApp Chat with ${escapeHtml(msg.name)}">
          <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.23 8.23 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.45 0-2.87-.38-4.12-1.1l-.3-.17-3.12.82.83-3.04-.19-.32a8.19 8.19 0 0 1-1.26-4.43c0-4.54 3.7-8.24 8.24-8.24m4.53 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.12-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.12-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.12.17 1.77 2.7 4.29 3.79.6.26 1.07.41 1.43.53.6.19 1.15.16 1.58.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.23-.17-.48-.3Z"/></svg>
          <span>WhatsApp ${escapeHtml(msg.name)}</span>
        </a>
      `
      : '';

    return `
      <div class="message-card glass-panel ${isNewArrival ? 'just-arrived' : ''}" id="card-${msg.id}">
        <div class="msg-header">
          <div class="msg-sender-info">
            <div class="msg-avatar">${senderInitials}</div>
            <div class="msg-sender-meta">
              <div class="msg-name-badge-row">
                <span class="msg-sender-name">${escapeHtml(msg.name || 'Anonymous')}</span>
                <span class="msg-visitor-pill"><i data-lucide="user"></i> Sender</span>
              </div>
              <span class="msg-subject-tag"><i data-lucide="bookmark"></i> ${escapeHtml(msg.subject || 'Portfolio Inquiry')}</span>
            </div>
          </div>
          <span class="msg-time">${timeFormatted}</span>
        </div>

        <!-- Prominently Visible Sender Details (Naam, Email & Phone Right in Front) -->
        <div class="msg-sender-details-card">
          <div class="msg-detail-item">
            <span class="detail-label"><i data-lucide="user"></i> Sender Name:</span>
            <span class="detail-value name-value">${escapeHtml(msg.name || 'Anonymous')}</span>
          </div>
          <div class="msg-detail-item">
            <span class="detail-label"><i data-lucide="mail"></i> Sender Email:</span>
            <a href="mailto:${escapeHtml(msg.email)}" class="detail-value email-link" title="Click to email ${escapeHtml(msg.name)}">
              ${escapeHtml(msg.email || 'Email not provided')}
            </a>
            ${msg.email ? `
              <button
                class="btn-copy-mini"
                onclick="navigator.clipboard.writeText('${escapeHtml(msg.email)}'); showToast('Copied email: ${escapeHtml(msg.email)}');"
                title="Copy email to clipboard"
                aria-label="Copy email"
              >
                <i data-lucide="copy"></i>
              </button>
            ` : ''}
          </div>
          ${msg.phone ? `
            <div class="msg-detail-item">
              <span class="detail-label"><i data-lucide="phone"></i> Phone / WhatsApp:</span>
              <a href="https://wa.me/${escapeHtml(cleanPhone(msg.phone))}?text=Hi%20${encodeURIComponent(msg.name)}%2C%20Abhishek%20here%20from%20my%20portfolio" target="_blank" rel="noopener noreferrer" class="detail-value phone-link" title="Chat on WhatsApp">
                ${escapeHtml(msg.phone)}
              </a>
            </div>
          ` : ''}
        </div>

        <div class="msg-body-wrapper">
          <p class="msg-text">${escapeHtml(msg.message)}</p>
        </div>

        ${repliesHtml}

        <div class="msg-actions-bar">
          ${ownerReplyBtn}
          ${emailBtn}
          ${whatsappBtn}
          ${isOwner ? `
            <button class="btn-delete-msg" onclick="window.deleteMessage('${msg.id}')" title="Delete Message">
              <i data-lucide="trash-2"></i>
              <span>Delete</span>
            </button>
          ` : ''}
        </div>

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
      </div>
    `;
  }).join('');

  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }
}

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
  const pin = sessionStorage.getItem('abhishek_owner_pin') || '1808';
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
    loadAndRenderMessages();
  } catch (err) {
    // Local fallback in case of static hosting
    try {
      const stored = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      const target = stored.find(m => m.id === msgId);
      if (target) {
        if (!target.replies) target.replies = [];
        target.replies.push({
          id: 'rep-' + Date.now(),
          author: 'Abhishek Tripathi',
          isOwner: true,
          text: replyText,
          createdAt: new Date().toISOString()
        });
        localStorage.setItem('portfolio_messages', JSON.stringify(stored));
        showToast('Verified reply saved locally!');
        loadAndRenderMessages();
        return;
      }
    } catch (localErr) {
      console.error(localErr);
    }
    showToast('Error: ' + err.message);
  }
};

window.deleteMessage = async function(msgId) {
  if (!confirm('Are you sure you want to delete this message?')) return;
  const pin = sessionStorage.getItem('abhishek_owner_pin') || '1808';

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
    showToast('Message deleted successfully.');
    loadAndRenderMessages();
  } catch (err) {
    try {
      let stored = JSON.parse(localStorage.getItem('portfolio_messages') || '[]');
      stored = stored.filter(m => m.id !== msgId);
      localStorage.setItem('portfolio_messages', JSON.stringify(stored));
      showToast('Message removed locally.');
      loadAndRenderMessages();
      return;
    } catch (e) {}
    showToast('Error deleting: ' + err.message);
  }
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

function cleanPhone(num) {
  if (!num) return '';
  const digits = String(num).replace(/\D/g, '');
  if (digits.length === 10) return '91' + digits;
  return digits;
}

function initRealtimeSync() {
  // 1. Server-Sent Events (SSE) for instant real-time push
  if (window.EventSource) {
    try {
      const sse = new EventSource('/api/messages/stream');

      sse.addEventListener('new_message', (e) => {
        try {
          const newMsg = JSON.parse(e.data);
          playNotificationSound();
          showToast(`🔔 Real-Time Message from ${newMsg.name}!`);
          loadAndRenderMessages(newMsg.id);
        } catch (err) {
          loadAndRenderMessages();
        }
      });

      sse.addEventListener('new_reply', (e) => {
        try {
          playNotificationSound();
          showToast('💬 Abhishek posted a verified reply!');
        } catch (err) {}
        loadAndRenderMessages();
      });

      sse.addEventListener('message_deleted', () => {
        loadAndRenderMessages();
      });

      sse.onerror = () => {
        // SSE automatically reconnects
      };
    } catch (err) {
      console.warn('SSE realtime init notice:', err);
    }
  }

  // 2. Continuous real-time polling backup (every 4 seconds)
  let lastKnownCount = -1;
  setInterval(async () => {
    try {
      const res = await fetch('/api/messages', { cache: 'no-cache' });
      if (res.ok) {
        const list = await res.json();
        if (lastKnownCount !== -1 && list.length > lastKnownCount) {
          playNotificationSound();
          showToast(`🔔 New message from ${list[0]?.name}!`);
          loadAndRenderMessages(list[0]?.id);
        }
        lastKnownCount = list.length;
      }
    } catch (e) {}
  }, 4000);
}

