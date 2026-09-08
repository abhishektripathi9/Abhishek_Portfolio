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
    liveDemo: 'https://abhishektripathi9.github.io/Advanced-Land-Registry-Dapp/'
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
    github: 'https://github.com/abhishektripathi9'
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
    github: 'https://github.com/abhishektripathi9'
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
    github: 'https://github.com/abhishektripathi9'
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
    github: 'https://github.com/abhishektripathi9'
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

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#form-name').value.trim();
    const email = form.querySelector('#form-email').value.trim();
    const msg = form.querySelector('#form-message').value.trim();

    if (!name || !email || !msg) {
      showToast('Please complete all required fields.');
      return;
    }

    const originalHtml = submitBtn.innerHTML;
    submitBtn.innerHTML = `
      <span style="display:inline-flex;align-items:center;gap:8px;">
        <span class="pulse-indicator"><span class="pulse-core"></span></span> Transmitting...
      </span>
    `;
    submitBtn.disabled = true;

    setTimeout(() => {
      form.reset();
      submitBtn.innerHTML = originalHtml;
      submitBtn.disabled = false;

      if (successBanner) {
        successBanner.classList.add('show');
        if (typeof lucide !== 'undefined') lucide.createIcons();

        setTimeout(() => {
          successBanner.classList.remove('show');
        }, 6000);
      }

      showToast('Thank you! Message transmitted successfully.');
    }, 1200);
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
    toggle.classList.toggle('active');
    links.classList.toggle('open');
  });

  links.querySelectorAll('.nav-link, .btn-nav-cta').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      links.classList.remove('open');
    });
  });

  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !links.contains(e.target)) {
      toggle.classList.remove('active');
      links.classList.remove('open');
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
