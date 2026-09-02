// Home Page Cinematic Animations with GSAP, ScrollTrigger & Lenis
document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Lenis Smooth Scroll if available
  let lenisInstance = null;
  if (typeof Lenis !== 'undefined') {
    try {
      lenisInstance = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
      });

      function raf(time) {
        lenisInstance.raf(time);
        requestAnimationFrame(raf);
      }
      requestAnimationFrame(raf);
    } catch (e) {
      console.warn('Lenis smooth scroll init bypassed:', e);
    }
  }

  // 2. Register GSAP Plugins
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Sync Lenis with ScrollTrigger if active
    if (lenisInstance) {
      lenisInstance.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenisInstance.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
    }

    // --- Hero Section Timeline ---
    const heroSection = document.getElementById('hero-section');
    const heroVideo = document.getElementById('hero-video-el');
    const heroContent = document.getElementById('hero-content-wrap');
    const heroOverlay = document.getElementById('hero-dark-overlay');

    if (heroSection) {
      // Intro entrance
      const introTl = gsap.timeline();
      introTl
        .fromTo('#hero-badge', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
        .fromTo('#hero-h1', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }, '-=0.5')
        .fromTo('#hero-subtext', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('#hero-cta-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')
        .fromTo('#hero-stats-bar', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5');

      // Scroll pinned zoom & recede
      ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: '+=100%',
        pin: true,
        scrub: 1,
        onUpdate: (self) => {
          const p = self.progress;
          if (heroVideo) {
            gsap.set(heroVideo, { scale: 1 + p * 0.15 });
          }
          if (heroContent) {
            gsap.set(heroContent, { opacity: 1 - p * 1.5, y: -p * 80 });
          }
          if (heroOverlay) {
            gsap.set(heroOverlay, { opacity: 0.6 + p * 0.4 });
          }
        },
      });
    }

    // --- Big Statement Section ---
    const statementSection = document.getElementById('big-statement-section');
    const statementMask = document.getElementById('statement-mask-text');
    if (statementSection && statementMask) {
      gsap.fromTo(
        statementMask,
        { clipPath: 'polygon(0 100%, 100% 100%, 100% 100%, 0 100%)', y: 40, opacity: 0 },
        {
          clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)',
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: statementSection,
            start: 'top 75%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }

    // --- Calculator Preview 3D translation ---
    const calcPreviewSection = document.getElementById('calc-preview-section');
    const calcPreviewCard = document.getElementById('calc-preview-3d-card');
    if (calcPreviewSection && calcPreviewCard) {
      gsap.fromTo(
        calcPreviewCard,
        { rotateX: 18, y: 80, opacity: 0.3, scale: 0.92 },
        {
          rotateX: 0,
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: calcPreviewSection,
            start: 'top 70%',
            end: 'top 20%',
            scrub: 1,
          },
        }
      );
    }

    // --- Formula Deck 3D Stacking ---
    const formulaDeckSection = document.getElementById('formula-deck-section');
    const formulaCards = document.querySelectorAll('.formula-deck-card');
    const formulaProgressBar = document.getElementById('formula-deck-progress-bar');
    const formulaActiveIndexEl = document.getElementById('formula-deck-active-index');

    if (formulaDeckSection && formulaCards.length > 0) {
      ScrollTrigger.create({
        trigger: formulaDeckSection,
        start: 'top top',
        end: `+=${formulaCards.length * 100}%`,
        pin: true,
        scrub: 0.8,
        onUpdate: (self) => {
          const total = formulaCards.length;
          const progress = self.progress;
          const cardProgress = progress * (total - 1);
          const activeIndex = Math.min(Math.floor(cardProgress), total - 1);

          if (formulaActiveIndexEl) {
            formulaActiveIndexEl.textContent = `0${activeIndex + 1}`;
          }
          if (formulaProgressBar) {
            formulaProgressBar.style.width = `${((activeIndex + 1) / total) * 100}%`;
          }

          formulaCards.forEach((card, idx) => {
            const diff = idx - cardProgress;
            if (diff < 0) {
              // Past card
              gsap.set(card, {
                yPercent: -120 * Math.abs(diff),
                opacity: 1 - Math.abs(diff) * 1.5,
                scale: 1 - Math.abs(diff) * 0.05,
                rotateX: diff * 10,
                zIndex: idx,
                pointerEvents: 'none',
              });
            } else if (diff >= 0 && diff <= 1) {
              // Current transitioning card
              gsap.set(card, {
                yPercent: diff * 60,
                opacity: 1 - diff * 0.3,
                scale: 1 - diff * 0.05,
                rotateX: 0,
                zIndex: total - Math.floor(diff),
                pointerEvents: 'auto',
              });
            } else {
              // Upcoming card
              gsap.set(card, {
                yPercent: 80 + (diff - 1) * 30,
                opacity: 0,
                scale: 0.9,
                rotateX: 0,
                zIndex: 0,
                pointerEvents: 'none',
              });
            }
          });
        },
      });
    }

    // --- Exercises Editorial Story ---
    const exercisesStorySection = document.getElementById('exercises-story-section');
    const exerciseStoryCards = document.querySelectorAll('.exercise-story-card');
    const exerciseImageLayers = document.querySelectorAll('.exercise-image-layer');

    if (exercisesStorySection && exerciseStoryCards.length > 0) {
      exerciseStoryCards.forEach((card, idx) => {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 60%',
          end: 'bottom 40%',
          onEnter: () => activateExerciseImage(idx),
          onEnterBack: () => activateExerciseImage(idx),
        });
      });

      function activateExerciseImage(index) {
        exerciseImageLayers.forEach((img, i) => {
          if (i === index) {
            img.classList.remove('opacity-0', 'scale-105');
            img.classList.add('opacity-100', 'scale-100');
          } else {
            img.classList.add('opacity-0', 'scale-105');
            img.classList.remove('opacity-100', 'scale-100');
          }
        });
      }
    }

    // --- Science Split Gauge Animation ---
    const scienceSection = document.getElementById('science-split-section');
    const neuralMeterBar = document.getElementById('neural-meter-bar');
    const fatigueMeterBar = document.getElementById('fatigue-meter-bar');
    if (scienceSection) {
      ScrollTrigger.create({
        trigger: scienceSection,
        start: 'top 70%',
        onEnter: () => {
          if (neuralMeterBar) neuralMeterBar.style.width = '96%';
          if (fatigueMeterBar) fatigueMeterBar.style.width = '24%';
        },
      });
    }
  }

  // 3. FAQ Accordion Interaction
  const faqToggles = document.querySelectorAll('.faq-accordion-toggle');
  faqToggles.forEach((btn) => {
    btn.addEventListener('click', () => {
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';
      const content = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');

      // Close other accordions
      faqToggles.forEach((otherBtn) => {
        if (otherBtn !== btn) {
          otherBtn.setAttribute('aria-expanded', 'false');
          if (otherBtn.nextElementSibling) otherBtn.nextElementSibling.classList.add('hidden');
          const otherIcon = otherBtn.querySelector('.faq-icon');
          if (otherIcon) otherIcon.classList.remove('rotate-180');
        }
      });

      btn.setAttribute('aria-expanded', !isExpanded);
      if (content) {
        content.classList.toggle('hidden');
      }
      if (icon) {
        icon.classList.toggle('rotate-180');
      }
    });
  });

  // 4. Interactive Calculator Preview widget on Home Page
  const homeCalcWeight = document.getElementById('home-calc-weight');
  const homeCalcReps = document.getElementById('home-calc-reps');
  const homeCalcUnit = document.getElementById('home-calc-unit');
  const homeCalc1RMDisplay = document.getElementById('home-calc-1rm-display');
  const homeCalcFormulaDisplay = document.getElementById('home-calc-formula-display');

  function updateHomePreviewCalc() {
    if (!homeCalcWeight || !homeCalcReps || !homeCalc1RMDisplay) return;
    const w = parseFloat(homeCalcWeight.value) || 0;
    const r = parseInt(homeCalcReps.value, 10) || 1;
    if (w <= 0 || r <= 0) return;

    // Epley 1RM
    const epley = r === 1 ? w : Math.round((w * (1 + r / 30)) * 10) / 10;
    homeCalc1RMDisplay.textContent = epley;

    if (homeCalcFormulaDisplay) {
      homeCalcFormulaDisplay.textContent = `${w} × (1 + ${r}/30) = ${epley}`;
    }
  }

  if (homeCalcWeight && homeCalcReps) {
    homeCalcWeight.addEventListener('input', updateHomePreviewCalc);
    homeCalcReps.addEventListener('input', updateHomePreviewCalc);
    updateHomePreviewCalc();
  }
});
