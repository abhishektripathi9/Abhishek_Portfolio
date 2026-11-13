/**
 * FitPulse Studio - Bespoke Client Interaction Script
 * Minimal, dependency-free vanilla JavaScript
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. MOBILE DRAWER SLIDE-OUT MENU
     -------------------------------------------------------------------------- */
  const drawerTrigger = document.getElementById('drawerTrigger');
  const drawerClose = document.getElementById('drawerClose');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.add('active');
    drawerOverlay.classList.add('active');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    drawerTrigger?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  }

  function closeDrawer() {
    if (!mobileDrawer || !drawerOverlay) return;
    mobileDrawer.classList.remove('active');
    drawerOverlay.classList.remove('active');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    drawerTrigger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (drawerTrigger) {
    drawerTrigger.addEventListener('click', openDrawer);
  }

  if (drawerClose) {
    drawerClose.addEventListener('click', closeDrawer);
  }

  if (drawerOverlay) {
    drawerOverlay.addEventListener('click', closeDrawer);
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // ESC key listener to close drawer
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer?.classList.contains('active')) {
      closeDrawer();
    }
  });

  /* --------------------------------------------------------------------------
     2. DYNAMIC STUDIO LIVE BATCH STATUS (REAL-TIME CONTEXT)
     -------------------------------------------------------------------------- */
  const statusMessageEl = document.getElementById('statusMessage');
  const liveStatusBadge = document.getElementById('liveStatusBadge');

  function updateLiveStudioStatus() {
    if (!statusMessageEl) return;

    // Use current time
    const now = new Date();
    const currentHour = now.getHours();
    const currentDay = now.getDay(); // 0 is Sunday

    if (currentDay === 0) {
      // Sunday
      if (currentHour >= 6 && currentHour < 12) {
        statusMessageEl.textContent = 'Floor Open: Sunday Mobility (Till 12 PM)';
      } else {
        statusMessageEl.textContent = 'Sunday Floor Closed • Reopens Mon 5:00 AM';
      }
    } else {
      // Monday - Saturday
      if (currentHour >= 5 && currentHour < 11) {
        statusMessageEl.textContent = 'Floor Active: Morning Strength Shift';
      } else if (currentHour >= 11 && currentHour < 16) {
        statusMessageEl.textContent = 'Next Batch: Evening 4:00 PM';
      } else if (currentHour >= 16 && currentHour < 22) {
        statusMessageEl.textContent = 'Floor Active: Evening Conditioning Shift';
      } else {
        statusMessageEl.textContent = 'Next Batch: Tomorrow 5:00 AM';
      }
    }
  }

  updateLiveStudioStatus();

  /* --------------------------------------------------------------------------
     3. INTERACTIVE PRICING TABS & CARD HIGHLIGHTING
     -------------------------------------------------------------------------- */
  const pricingTabs = document.querySelectorAll('.pricing-tab');
  const pricingCards = document.querySelectorAll('.pricing-card');

  pricingTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Set active tab
      pricingTabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const targetPeriod = tab.getAttribute('data-period');

      // Highlight target card
      pricingCards.forEach(card => {
        const planType = card.getAttribute('data-plan');
        if (planType === targetPeriod) {
          card.style.transform = 'translateY(-6px)';
          card.style.borderColor = 'var(--color-gold)';
          card.style.boxShadow = '0 16px 36px -4px var(--color-gold-glow)';
        } else {
          card.style.transform = '';
          card.style.borderColor = '';
          card.style.boxShadow = '';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     4. HEADER SCROLL SPY FOR ACTIVE NAV ITEMS
     -------------------------------------------------------------------------- */
  const sections = document.querySelectorAll('section[id]');
  const desktopNavLinks = document.querySelectorAll('.desktop-nav .nav-item');

  function updateActiveNavLink() {
    const scrollPosition = window.pageYOffset + 140;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        desktopNavLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNavLink, { passive: true });

  /* --------------------------------------------------------------------------
     5. PRIORITY CALLBACK LEAD FORM (ZERO BACKEND VIA WEB3FORMS)
     -------------------------------------------------------------------------- */
  const leadForm = document.getElementById('leadForm');
  const submitBtn = document.getElementById('submitBtn');
  const submitBtnText = document.getElementById('submitBtnText');
  const formFeedback = document.getElementById('formFeedback');

  // Form Inputs
  const fullNameInput = document.getElementById('fullName');
  const phoneInput = document.getElementById('phoneNumber');
  const goalSelect = document.getElementById('fitnessGoal');
  const batchSelect = document.getElementById('batchPreference');

  // Error Labels
  const nameError = document.getElementById('nameError');
  const phoneError = document.getElementById('phoneError');
  const goalError = document.getElementById('goalError');
  const batchError = document.getElementById('batchError');

  function clearErrors() {
    [nameError, phoneError, goalError, batchError].forEach(err => {
      if (err) err.classList.remove('active');
    });
  }

  function validateForm() {
    let isValid = true;
    clearErrors();

    // Full Name check (minimum 2 letters)
    if (!fullNameInput || fullNameInput.value.trim().length < 2) {
      if (nameError) nameError.classList.add('active');
      fullNameInput?.focus();
      isValid = false;
    }

    // Indian Phone validation (10 digits starting with 6, 7, 8, or 9)
    const phoneVal = phoneInput?.value.trim() || '';
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phoneVal)) {
      if (phoneError) phoneError.classList.add('active');
      if (isValid) phoneInput?.focus();
      isValid = false;
    }

    // Fitness Goal
    if (!goalSelect || !goalSelect.value) {
      if (goalError) goalError.classList.add('active');
      if (isValid) goalSelect?.focus();
      isValid = false;
    }

    // Batch Shift
    if (!batchSelect || !batchSelect.value) {
      if (batchError) batchError.classList.add('active');
      if (isValid) batchSelect?.focus();
      isValid = false;
    }

    return isValid;
  }

  if (leadForm) {
    leadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      if (!validateForm()) {
        return;
      }

      // Enter Loading State
      const originalText = submitBtnText ? submitBtnText.textContent : 'Confirm';
      if (submitBtnText) submitBtnText.textContent = 'Locking In Pass...';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.75';
      }
      if (formFeedback) {
        formFeedback.className = 'form-feedback';
        formFeedback.style.display = 'none';
      }

      const formData = new FormData(leadForm);
      const accessKey = formData.get('access_key');
      const enteredPhone = phoneInput.value.trim();

      try {
        // If placeholder access key, provide realistic local demo confirmation
        if (accessKey === 'YOUR_ACCESS_KEY_HERE') {
          await new Promise(resolve => setTimeout(resolve, 850));

          showFeedback(
            true, 
            `🎉 Pass Reserved! Head Coach Amit has received your details and will call you on +91 ${enteredPhone} within 2 hours to confirm your workout slot.`
          );
          leadForm.reset();
        } else {
          // Live Web3Forms submission
          const response = await fetch(leadForm.action, {
            method: 'POST',
            body: formData,
            headers: {
              'Accept': 'application/json'
            }
          });

          const result = await response.json();

          if (response.ok && result.success) {
            showFeedback(
              true, 
              `🎉 Pass Reserved! Your details are confirmed. Our coach will call you on +91 ${enteredPhone} shortly.`
            );
            leadForm.reset();
          } else {
            showFeedback(
              false, 
              result.message || 'Unable to submit right now. Please tap the WhatsApp button below for instant confirmation.'
            );
          }
        }
      } catch (err) {
        showFeedback(
          false, 
          'Network connection interrupted. Please WhatsApp us directly at +91 98765 43210 to book your trial.'
        );
      } finally {
        if (submitBtnText) submitBtnText.textContent = originalText;
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        }
      }
    });
  }

  function showFeedback(isSuccess, message) {
    if (!formFeedback) return;
    formFeedback.className = `form-feedback ${isSuccess ? 'success' : 'error'}`;
    formFeedback.textContent = message;
    formFeedback.style.display = 'block';
  }
});

