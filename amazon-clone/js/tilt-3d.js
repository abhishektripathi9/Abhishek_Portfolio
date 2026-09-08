/**
 * AMAZON CLONE - 3D CARD TILT & SPECULAR LIGHT ENGINE
 * Ultra-smooth 60fps perspective tilt physics with dynamic glare sheen
 * following the user's cursor across product cards.
 */

class CardTilt3DEngine {
  constructor() {
    this.maxTilt = 11; // max tilt angle in degrees
    this.perspective = 1000; // perspective depth
    this.scale = 1.025; // subtle lift scale
    this.init();
  }

  init() {
    this.bindCards();

    // Rebind when product grid re-renders
    const grid = document.getElementById('products-grid-container');
    if (grid) {
      const observer = new MutationObserver(() => {
        this.bindCards();
      });
      observer.observe(grid, { childList: true });
    }
  }

  bindCards() {
    const cards = document.querySelectorAll('.prod-card:not([data-tilt-bound])');

    cards.forEach(card => {
      card.setAttribute('data-tilt-bound', 'true');

      // Inject glare element if missing
      if (!card.querySelector('.prod-card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'prod-card-glare';
        card.appendChild(glare);
      }

      let rafId = null;

      const onMouseMove = (e) => {
        const rect = card.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const percentX = (mouseX / rect.width);
        const percentY = (mouseY / rect.height);

        const rotateX = ((0.5 - percentY) * (this.maxTilt * 2)).toFixed(2);
        const rotateY = ((percentX - 0.5) * (this.maxTilt * 2)).toFixed(2);

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.classList.add('is-tilting');
          card.style.transform = `perspective(${this.perspective}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(${this.scale}, ${this.scale}, ${this.scale})`;
          card.style.setProperty('--glare-x', `${(percentX * 100).toFixed(1)}%`);
          card.style.setProperty('--glare-y', `${(percentY * 100).toFixed(1)}%`);
        });
      };

      const onMouseLeave = () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.classList.remove('is-tilting');
        card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease';
        card.style.transform = `perspective(${this.perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;

        setTimeout(() => {
          card.style.transition = '';
        }, 500);
      };

      card.addEventListener('mousemove', onMouseMove);
      card.addEventListener('mouseleave', onMouseLeave);
    });
  }
}

// Instantiate global tilt engine
window.amzCardTilt = new CardTilt3DEngine();
