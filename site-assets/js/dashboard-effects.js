// Dashboard Effects - Optimized Performance
// Lightweight effects system with performance optimizations

class DashboardEffects {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.initialized = false;
    this.observers = new Map();
    this.rafId = null;

    // Only initialize if user doesn't prefer reduced motion
    if (!this.isReducedMotion) {
      this.init();
    }
  }

  init() {
    if (this.initialized) return;

    // Use requestIdleCallback if available for non-critical setup
    if (window.requestIdleCallback) {
      requestIdleCallback(() => this.setupEffects());
    } else {
      setTimeout(() => this.setupEffects(), 100);
    }

    this.initialized = true;
  }

  setupEffects() {
    this.setupIntersectionObserver();
    this.setupButtonEffects();
    this.setupImageUploadEffects();
    this.setupFormFocusEffects();
  }

  // Intersection Observer for scroll animations
  setupIntersectionObserver() {
    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCardEntry(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

    // Observe cards that come into view
    document.querySelectorAll('.question-card').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      observer.observe(card);
    });

    this.observers.set('scroll', observer);
  }

  animateCardEntry(element) {
    if (!element) return;

    element.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    element.style.opacity = '1';
    element.style.transform = 'translateY(0)';
  }

  // Optimized button ripple effects
  setupButtonEffects() {
    // Use event delegation for better performance
    document.addEventListener('click', (e) => {
      if (!e.target.classList.contains('btn')) return;

      this.createRipple(e);
    }, { passive: true });
  }

  createRipple(event) {
    const button = event.target;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.style.cssText = `
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: scale(0);
      animation: ripple 0.6s linear;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      pointer-events: none;
    `;

    button.appendChild(ripple);

    // Clean up ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }


  // Image upload animations
  setupImageUploadEffects() {
    document.addEventListener('dragover', (e) => {
      if (!e.target.classList.contains('image-upload-area')) return;

      e.preventDefault();
      this.highlightDropZone(e.target, true);
    }, { passive: false });

    document.addEventListener('dragleave', (e) => {
      if (!e.target.classList.contains('image-upload-area')) return;

      this.highlightDropZone(e.target, false);
    }, { passive: true });

    document.addEventListener('drop', (e) => {
      if (!e.target.classList.contains('image-upload-area')) return;

      e.preventDefault();
      this.highlightDropZone(e.target, false);
      this.animateImageUpload(e.target);
    }, { passive: false });
  }

  highlightDropZone(element, highlight) {
    if (highlight) {
      element.style.borderColor = 'var(--primary-color)';
      element.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
    } else {
      element.style.borderColor = '';
      element.style.backgroundColor = '';
    }
  }

  animateImageUpload(element) {
    element.style.animation = 'pulse 0.3s ease';
    setTimeout(() => {
      element.style.animation = '';
    }, 300);
  }

  // Form focus effects
  setupFormFocusEffects() {
    document.addEventListener('focusin', (e) => {
      if (!this.isFormElement(e.target)) return;

      this.enhanceFormFocus(e.target, true);
    }, { passive: true });

    document.addEventListener('focusout', (e) => {
      if (!this.isFormElement(e.target)) return;

      this.enhanceFormFocus(e.target, false);
    }, { passive: true });
  }

  isFormElement(element) {
    return element.matches('input, textarea, select');
  }

  enhanceFormFocus(element, isFocused) {
    const parent = element.closest('.question-card, .field-block');
    if (!parent) return;

    if (isFocused) {
      parent.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
    } else {
      parent.style.boxShadow = '';
    }
  }

  // Performance monitoring
  startPerformanceMonitoring() {
    if (!window.performance) return;

    let frameCount = 0;
    let lastTime = performance.now();

    const measureFPS = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = Math.round(frameCount * 1000 / (currentTime - lastTime));

        // If FPS drops below 30, disable heavy effects
        if (fps < 30) {
          this.disableHeavyEffects();
        }

        frameCount = 0;
        lastTime = currentTime;
      }

      this.rafId = requestAnimationFrame(measureFPS);
    };

    this.rafId = requestAnimationFrame(measureFPS);
  }

  disableHeavyEffects() {
    console.log('Performance degraded, disabling heavy effects');

    // Remove heavy animations
    document.querySelectorAll('.question-card').forEach(card => {
      card.style.transition = 'none';
    });

    // Cancel monitoring
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Cleanup method
  destroy() {
    // Cancel any running animations
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    // Disconnect observers
    this.observers.forEach(observer => {
      if (observer.disconnect) {
        observer.disconnect();
      }
    });

    this.observers.clear();
    this.initialized = false;
  }
}

// CSS animations (minimal, performance-focused)
const effectsCSS = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }

  /* Reduce animations for users who prefer reduced motion */
  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Performance optimizations */
  .question-card {
    will-change: transform, box-shadow;
    backface-visibility: hidden;
    perspective: 1000px;
  }

  .btn {
    will-change: transform;
    backface-visibility: hidden;
  }

  .image-upload-area {
    will-change: transform, border-color;
    backface-visibility: hidden;
  }

  /* GPU acceleration for smooth animations */
  .question-card,
  .btn,
  .image-upload-area {
    transform: translateZ(0);
  }
`;

// Inject minimal CSS
if (!document.getElementById('dashboard-effects-css')) {
  const style = document.createElement('style');
  style.id = 'dashboard-effects-css';
  style.textContent = effectsCSS;
  document.head.appendChild(style);
}

// Initialize effects when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.dashboardEffects = new DashboardEffects();
  });
} else {
  window.dashboardEffects = new DashboardEffects();
}

// Export for manual control
window.DashboardEffects = DashboardEffects;