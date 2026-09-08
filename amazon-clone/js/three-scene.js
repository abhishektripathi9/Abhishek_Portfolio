/**
 * AMAZON CLONE - THREE.JS 3D SPATIAL ARENA & STUDIO ENGINE
 * Interactive 3D WebGL scenes:
 * 1. Hero 3D Spatial Gadget with 360° mouse drag, particle galaxy & ambient inertia.
 * 2. Quick View 3D Studio with wireframe & dynamic lighting modes.
 */

class ThreeSpatialEngine {
  constructor() {
    this.heroScene = null;
    this.heroCamera = null;
    this.heroRenderer = null;
    this.heroModelGroup = null;
    this.heroParticles = null;
    this.heroIsDragging = false;
    this.heroPrevPointer = { x: 0, y: 0 };
    this.heroVelocity = { x: 0, y: 0 };
    this.heroTargetRotation = { x: 0.1, y: -0.4 };

    this.studioScene = null;
    this.studioCamera = null;
    this.studioRenderer = null;
    this.studioModel = null;
    this.studioWireframe = false;
    this.studioLightMode = 'neon';

    this.init();
  }

  init() {
    if (typeof THREE === 'undefined') {
      console.warn("Three.js not yet loaded, waiting for script load...");
      window.addEventListener('load', () => this.init());
      return;
    }

    this.initHeroScene();
    this.initStudioScene();
    this.bindWindowResize();
  }

  // ==========================================
  // 1. HERO 3D SPATIAL ARENA
  // ==========================================
  initHeroScene() {
    const canvas = document.getElementById('hero-three-canvas');
    const container = document.getElementById('hero-3d-canvas-wrapper');
    if (!canvas || !container) return;

    // Renderer
    this.heroRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    this.heroRenderer.setSize(container.clientWidth, container.clientHeight);
    this.heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene & Camera
    this.heroScene = new THREE.Scene();
    this.heroCamera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    this.heroCamera.position.set(0, 0, 9);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    this.heroScene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xffb84d, 1.8);
    dirLight1.position.set(5, 8, 5);
    this.heroScene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x00d2ff, 1.4);
    dirLight2.position.set(-6, -4, 4);
    this.heroScene.add(dirLight2);

    const pointLight = new THREE.PointLight(0xff9900, 2, 20);
    pointLight.position.set(0, 0, 4);
    this.heroScene.add(pointLight);

    // Build 3D Gadget Model (Futuristic Flagship Spatial Audio Unit)
    this.heroModelGroup = new THREE.Group();

    // Metallic Arc Headband
    const headbandCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-2.4, 0, 0),
      new THREE.Vector3(-1.8, 2.2, 0),
      new THREE.Vector3(0, 2.7, 0),
      new THREE.Vector3(1.8, 2.2, 0),
      new THREE.Vector3(2.4, 0, 0)
    ]);
    const headbandGeo = new THREE.TubeGeometry(headbandCurve, 64, 0.22, 16, false);
    const metalMaterial = new THREE.MeshStandardMaterial({
      color: 0x1f2937,
      metalness: 0.88,
      roughness: 0.22
    });
    const headbandMesh = new THREE.Mesh(headbandGeo, metalMaterial);
    this.heroModelGroup.add(headbandMesh);

    // Earcups (Left & Right)
    const earcupGeo = new THREE.CylinderGeometry(1.05, 1.15, 0.7, 32);
    const cushionGeo = new THREE.TorusGeometry(1.05, 0.32, 16, 32);
    const cushionMat = new THREE.MeshStandardMaterial({
      color: 0x111827,
      roughness: 0.8,
      metalness: 0.1
    });

    const glowRingMat = new THREE.MeshBasicMaterial({
      color: 0xff9900
    });
    const ringGeo = new THREE.TorusGeometry(1.08, 0.05, 16, 48);

    // Left Earcup Assembly
    const leftCupGroup = new THREE.Group();
    const leftCup = new THREE.Mesh(earcupGeo, metalMaterial);
    leftCup.rotation.z = Math.PI / 2;
    const leftCushion = new THREE.Mesh(cushionGeo, cushionMat);
    leftCushion.rotation.y = Math.PI / 2;
    leftCushion.position.x = 0.35;
    const leftRing = new THREE.Mesh(ringGeo, glowRingMat);
    leftRing.rotation.y = Math.PI / 2;
    leftRing.position.x = -0.32;

    leftCupGroup.add(leftCup, leftCushion, leftRing);
    leftCupGroup.position.set(-2.4, -0.4, 0);
    this.heroModelGroup.add(leftCupGroup);

    // Right Earcup Assembly
    const rightCupGroup = new THREE.Group();
    const rightCup = new THREE.Mesh(earcupGeo, metalMaterial);
    rightCup.rotation.z = -Math.PI / 2;
    const rightCushion = new THREE.Mesh(cushionGeo, cushionMat);
    rightCushion.rotation.y = -Math.PI / 2;
    rightCushion.position.x = -0.35;
    const rightRing = new THREE.Mesh(ringGeo, glowRingMat);
    rightRing.rotation.y = -Math.PI / 2;
    rightRing.position.x = 0.32;

    rightCupGroup.add(rightCup, rightCushion, rightRing);
    rightCupGroup.position.set(2.4, -0.4, 0);
    this.heroModelGroup.add(rightCupGroup);

    // Center Core Hologram Disc
    const coreGeo = new THREE.IcosahedronGeometry(0.65, 1);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x00f2fe,
      wireframe: true,
      emissive: 0x00a8e1,
      emissiveIntensity: 0.4
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreMesh.position.set(0, 0.8, 0);
    this.heroModelGroup.add(coreMesh);
    this.heroCoreMesh = coreMesh;

    this.heroModelGroup.position.set(0, -0.3, 0);
    this.heroScene.add(this.heroModelGroup);

    // Orbiting 3D Particle Galaxy
    const particleCount = 450;
    const particleGeo = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      posArray[i] = (Math.random() - 0.5) * 16;
      posArray[i + 1] = (Math.random() - 0.5) * 12;
      posArray[i + 2] = (Math.random() - 0.5) * 14;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particleMat = new THREE.PointsMaterial({
      size: 0.05,
      color: 0xfebd69,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    this.heroParticles = new THREE.Points(particleGeo, particleMat);
    this.heroScene.add(this.heroParticles);

    // Interactive Drag Controls
    this.bindHeroDragControls(container);

    // Start 60fps Render Loop
    this.animateHeroScene();
  }

  bindHeroDragControls(container) {
    const onPointerDown = (e) => {
      this.heroIsDragging = true;
      this.heroPrevPointer.x = e.clientX || (e.touches && e.touches[0].clientX);
      this.heroPrevPointer.y = e.clientY || (e.touches && e.touches[0].clientY);
    };

    const onPointerMove = (e) => {
      if (!this.heroIsDragging) return;

      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);

      const deltaX = clientX - this.heroPrevPointer.x;
      const deltaY = clientY - this.heroPrevPointer.y;

      this.heroVelocity.x = deltaX * 0.006;
      this.heroVelocity.y = deltaY * 0.006;

      this.heroTargetRotation.y += this.heroVelocity.x;
      this.heroTargetRotation.x += this.heroVelocity.y;

      // Constrain X tilt
      this.heroTargetRotation.x = Math.max(-0.9, Math.min(0.9, this.heroTargetRotation.x));

      this.heroPrevPointer.x = clientX;
      this.heroPrevPointer.y = clientY;
    };

    const onPointerUp = () => {
      this.heroIsDragging = false;
    };

    container.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    container.addEventListener('touchstart', onPointerDown, { passive: true });
    window.addEventListener('touchmove', onPointerMove, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  animateHeroScene() {
    requestAnimationFrame(() => this.animateHeroScene());

    // Continuous smooth inertia
    if (!this.heroIsDragging) {
      this.heroVelocity.x *= 0.94;
      this.heroVelocity.y *= 0.94;

      this.heroTargetRotation.y += this.heroVelocity.x + 0.004; // subtle ambient spin
      this.heroTargetRotation.x += this.heroVelocity.y;
    }

    if (this.heroModelGroup) {
      // Lerp rotation to target
      this.heroModelGroup.rotation.y += (this.heroTargetRotation.y - this.heroModelGroup.rotation.y) * 0.08;
      this.heroModelGroup.rotation.x += (this.heroTargetRotation.x - this.heroModelGroup.rotation.x) * 0.08;

      // Floating wave animation
      const time = Date.now() * 0.0018;
      this.heroModelGroup.position.y = -0.3 + Math.sin(time) * 0.14;

      if (this.heroCoreMesh) {
        this.heroCoreMesh.rotation.x += 0.02;
        this.heroCoreMesh.rotation.y += 0.03;
      }
    }

    if (this.heroParticles) {
      this.heroParticles.rotation.y += 0.0008;
    }

    if (this.heroRenderer && this.heroScene && this.heroCamera) {
      this.heroRenderer.render(this.heroScene, this.heroCamera);
    }
  }

  // ==========================================
  // 2. QUICK VIEW 3D STUDIO VIEWER
  // ==========================================
  initStudioScene() {
    const canvas = document.getElementById('qv-three-canvas');
    if (!canvas) return;

    this.studioRenderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true
    });
    this.studioRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.studioScene = new THREE.Scene();
    this.studioCamera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    this.studioCamera.position.set(0, 0, 6.5);

    // Studio Lights
    this.studioAmbient = new THREE.AmbientLight(0xffffff, 0.7);
    this.studioLight1 = new THREE.DirectionalLight(0xffffff, 1.5);
    this.studioLight1.position.set(4, 5, 4);

    this.studioLight2 = new THREE.DirectionalLight(0x00f2fe, 1.0);
    this.studioLight2.position.set(-4, -2, 3);

    this.studioScene.add(this.studioAmbient, this.studioLight1, this.studioLight2);

    this.buildStudioModel('default');
    this.bindStudioControls();
    this.animateStudioScene();
  }

  buildStudioModel(type = 'gadget') {
    if (this.studioModel) {
      this.studioScene.remove(this.studioModel);
    }

    this.studioModel = new THREE.Group();

    // Sleek geometric showcase object
    const mainGeo = new THREE.TorusKnotGeometry(1.2, 0.38, 128, 32);
    const mainMat = new THREE.MeshStandardMaterial({
      color: 0x222d3d,
      roughness: 0.3,
      metalness: 0.85,
      wireframe: this.studioWireframe
    });
    const mainMesh = new THREE.Mesh(mainGeo, mainMat);
    this.studioMainMesh = mainMesh;
    this.studioModel.add(mainMesh);

    // Glowing orbital halo
    const haloGeo = new THREE.TorusGeometry(2.1, 0.04, 16, 64);
    const haloMat = new THREE.MeshBasicMaterial({ color: 0xff9900 });
    const haloMesh = new THREE.Mesh(haloGeo, haloMat);
    haloMesh.rotation.x = Math.PI / 3;
    this.studioModel.add(haloMesh);
    this.studioHaloMesh = haloMesh;

    this.studioScene.add(this.studioModel);
  }

  bindStudioControls() {
    const canvas = document.getElementById('qv-three-canvas');
    if (!canvas) return;

    let isDragging = false;
    let prevX = 0;
    let prevY = 0;

    canvas.addEventListener('mousedown', (e) => {
      isDragging = true;
      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mousemove', (e) => {
      if (!isDragging || !this.studioModel) return;
      const dx = e.clientX - prevX;
      const dy = e.clientY - prevY;

      this.studioModel.rotation.y += dx * 0.01;
      this.studioModel.rotation.x += dy * 0.01;

      prevX = e.clientX;
      prevY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
    });

    // Wireframe Mode Button
    const wireframeBtn = document.getElementById('qv-3d-wireframe-btn');
    if (wireframeBtn) {
      wireframeBtn.addEventListener('click', () => {
        this.studioWireframe = !this.studioWireframe;
        if (this.studioMainMesh) {
          this.studioMainMesh.material.wireframe = this.studioWireframe;
        }
        wireframeBtn.classList.toggle('is-active', this.studioWireframe);
      });
    }

    // Reset Angle Button
    const resetBtn = document.getElementById('qv-3d-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (this.studioModel) {
          this.studioModel.rotation.set(0, 0, 0);
        }
      });
    }

    // Lighting Preset Switcher
    const lightBtn = document.getElementById('qv-3d-light-btn');
    if (lightBtn) {
      lightBtn.addEventListener('click', () => {
        this.toggleStudioLighting(lightBtn);
      });
    }
  }

  toggleStudioLighting(btn) {
    if (this.studioLightMode === 'neon') {
      this.studioLightMode = 'studio';
      this.studioLight1.color.setHex(0xffffff);
      this.studioLight2.color.setHex(0xffffff);
      btn.textContent = '💡 Studio White';
    } else if (this.studioLightMode === 'studio') {
      this.studioLightMode = 'gold';
      this.studioLight1.color.setHex(0xffaa00);
      this.studioLight2.color.setHex(0xff4400);
      btn.textContent = '🌅 Golden Hour';
    } else {
      this.studioLightMode = 'neon';
      this.studioLight1.color.setHex(0x00f2fe);
      this.studioLight2.color.setHex(0xff007f);
      btn.textContent = '⚡ Cyber Neon';
    }
  }

  resizeStudio() {
    const container = document.getElementById('qv-3d-studio-container');
    if (!container || !this.studioRenderer || !this.studioCamera) return;

    const width = container.clientWidth || 340;
    const height = container.clientHeight || 340;

    this.studioCamera.aspect = width / height;
    this.studioCamera.updateProjectionMatrix();
    this.studioRenderer.setSize(width, height);
  }

  animateStudioScene() {
    requestAnimationFrame(() => this.animateStudioScene());

    if (this.studioModel) {
      this.studioModel.rotation.y += 0.006;
      if (this.studioHaloMesh) {
        this.studioHaloMesh.rotation.z += 0.015;
      }
    }

    if (this.studioRenderer && this.studioScene && this.studioCamera) {
      this.studioRenderer.render(this.studioScene, this.studioCamera);
    }
  }

  // Window resize handler
  bindWindowResize() {
    window.addEventListener('resize', () => {
      // Resize Hero
      const heroContainer = document.getElementById('hero-3d-canvas-wrapper');
      if (heroContainer && this.heroRenderer && this.heroCamera) {
        this.heroCamera.aspect = heroContainer.clientWidth / heroContainer.clientHeight;
        this.heroCamera.updateProjectionMatrix();
        this.heroRenderer.setSize(heroContainer.clientWidth, heroContainer.clientHeight);
      }

      // Resize Studio
      this.resizeStudio();
    });
  }
}

// Instantiate global 3D spatial engine
window.amzThree = new ThreeSpatialEngine();
