/* ==========================================================================
   AISSA AMMOURI - PORTFOLIO INTERACTIVITY ENGINE
   Includes: Full-Page Deck Navigation, Keyboard & Touch Control, Canvas Particles,
   Dynamic Typewriter Effect, Ambient Audio Synthesizer, & Form Submission
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  /* ------------------------------------------------------------------------
     1. State Management & Constants
     ------------------------------------------------------------------------ */
  let currentSlideIndex = 1;
  const totalSlides = 7;
  let isTransitioning = false;

  const slides = document.querySelectorAll('.slide');
  const navLinks = document.querySelectorAll('.nav-link');
  const dots = document.querySelectorAll('.slide-indicator .dot');
  const currentSlideNumEl = document.getElementById('current-slide-num');
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  const gotoBtns = document.querySelectorAll('.goto-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navLinksContainer = document.querySelector('.nav-links');

  /* ------------------------------------------------------------------------
     2. Slide Switcher Function
     ------------------------------------------------------------------------ */
  function goToSlide(targetIndex) {
    if (targetIndex < 1 || targetIndex > totalSlides || targetIndex === currentSlideIndex || isTransitioning) {
      return;
    }

    isTransitioning = true;
    const previousIndex = currentSlideIndex;
    currentSlideIndex = targetIndex;

    // Update active slide
    slides.forEach((slide) => {
      const idx = parseInt(slide.getAttribute('data-index'), 10);
      slide.classList.remove('active', 'prev-slide');

      if (idx === currentSlideIndex) {
        slide.classList.add('active');
      } else if (idx < currentSlideIndex) {
        slide.classList.add('prev-slide');
      }
    });

    // Update Navigation Links
    navLinks.forEach((link) => {
      const slideTarget = parseInt(link.getAttribute('data-slide'), 10);
      if (slideTarget === currentSlideIndex) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Update Dots
    dots.forEach((dot) => {
      const dotTarget = parseInt(dot.getAttribute('data-slide'), 10);
      if (dotTarget === currentSlideIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });

    // Update Slide Counter Number
    if (currentSlideNumEl) {
      currentSlideNumEl.textContent = currentSlideIndex < 10 ? `0${currentSlideIndex}` : currentSlideIndex;
    }

    // Trigger specific slide animations (e.g. progress bars)
    if (currentSlideIndex === 5) {
      animateProgressBars();
    }

    // Reset Mobile Nav if Open
    if (navLinksContainer.classList.contains('active')) {
      navLinksContainer.classList.remove('active');
    }

    setTimeout(() => {
      isTransitioning = false;
    }, 700);
  }

  /* ------------------------------------------------------------------------
     3. Navigation Event Listeners
     ------------------------------------------------------------------------ */
  // Header Nav Links & Brand Logo
  document.querySelectorAll('[data-slide]').forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const target = parseInt(trigger.getAttribute('data-slide'), 10);
      if (target) goToSlide(target);
    });
  });

  // Next / Prev Deck Control Buttons
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentSlideIndex > 1) goToSlide(currentSlideIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentSlideIndex < totalSlides) goToSlide(currentSlideIndex + 1);
    });
  }

  // Keyboard Navigation
  window.addEventListener('keydown', (e) => {
    if (['ArrowDown', 'PageDown', 'ArrowRight'].includes(e.key)) {
      if (currentSlideIndex < totalSlides) goToSlide(currentSlideIndex + 1);
    } else if (['ArrowUp', 'PageUp', 'ArrowLeft'].includes(e.key)) {
      if (currentSlideIndex > 1) goToSlide(currentSlideIndex - 1);
    }
  });

  // Mouse Wheel / Trackpad Scroll Navigation
  let wheelTimeout = null;
  window.addEventListener('wheel', (e) => {
    if (isTransitioning) return;
    if (wheelTimeout) clearTimeout(wheelTimeout);

    wheelTimeout = setTimeout(() => {
      if (e.deltaY > 30) {
        if (currentSlideIndex < totalSlides) goToSlide(currentSlideIndex + 1);
      } else if (e.deltaY < -30) {
        if (currentSlideIndex > 1) goToSlide(currentSlideIndex - 1);
      }
    }, 40);
  }, { passive: true });

  // Touch / Mobile Swipe Navigation
  let touchStartY = 0;
  let touchEndY = 0;

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.changedTouches[0].screenY;
  }, { passive: true });

  window.addEventListener('touchend', (e) => {
    touchEndY = e.changedTouches[0].screenY;
    handleTouchSwipe();
  }, { passive: true });

  function handleTouchSwipe() {
    const swipeDistance = touchStartY - touchEndY;
    if (Math.abs(swipeDistance) > 50) {
      if (swipeDistance > 0) {
        // Swiped UP -> Go to next slide
        if (currentSlideIndex < totalSlides) goToSlide(currentSlideIndex + 1);
      } else {
        // Swiped DOWN -> Go to prev slide
        if (currentSlideIndex > 1) goToSlide(currentSlideIndex - 1);
      }
    }
  }

  // Mobile Menu Toggle
  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      navLinksContainer.classList.toggle('active');
    });
  }

  /* ------------------------------------------------------------------------
     4. Typewriter Effect
     ------------------------------------------------------------------------ */
  const typingTextEl = document.getElementById('typing-text');
  const roles = [
    "Master's Student in Business Admin",
    "English Language & Comm Graduate",
    "Modern Agronomist & Farm Manager",
    "Strategic Problem Solver"
  ];
  let roleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    if (!typingTextEl) return;

    const currentRole = roles[roleIndex];

    if (isDeleting) {
      typingTextEl.textContent = currentRole.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingTextEl.textContent = currentRole.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentRole.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full word
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      roleIndex = (roleIndex + 1) % roles.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  typeEffect();

  /* ------------------------------------------------------------------------
     5. Progress Bar Animation
     ------------------------------------------------------------------------ */
  function animateProgressBars() {
    const fills = document.querySelectorAll('.progress-bar-fill');
    fills.forEach((fill) => {
      const targetWidth = fill.style.width;
      fill.style.width = '0%';
      setTimeout(() => {
        fill.style.width = targetWidth;
      }, 100);
    });
  }

  /* ------------------------------------------------------------------------
     6. Interactive Background Canvas (Ambient Particles)
     ------------------------------------------------------------------------ */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const numParticles = Math.min(Math.floor(width / 20), 60);

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: ['rgba(16, 185, 129, ', 'rgba(6, 182, 212, ', 'rgba(99, 102, 241, '][Math.floor(Math.random() * 3)],
        alpha: Math.random() * 0.5 + 0.2,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4
      });
    }

    function renderCanvas() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.fill();

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(16, 185, 129, ${0.12 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(renderCanvas);
    }

    renderCanvas();
  }

  /* ------------------------------------------------------------------------
     7. Ambient Audio Synthesizer Toggle (Web Audio API)
     ------------------------------------------------------------------------ */
  const audioBtn = document.getElementById('audio-toggle');
  let audioCtx = null;
  let isPlayingAudio = false;
  let masterGain = null;
  let osc1 = null;
  let osc2 = null;

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!isPlayingAudio) {
        startAmbientSound();
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
        audioBtn.style.color = 'var(--accent-emerald)';
        audioBtn.style.borderColor = 'var(--accent-emerald)';
        isPlayingAudio = true;
      } else {
        stopAmbientSound();
        audioBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
        audioBtn.style.color = '';
        audioBtn.style.borderColor = '';
        isPlayingAudio = false;
      }
    });
  }

  function startAmbientSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Low background volume
      masterGain.connect(audioCtx.destination);

      // Relaxing warm chord frequencies
      osc1 = audioCtx.createOscillator();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(110, audioCtx.currentTime); // A2

      osc2 = audioCtx.createOscillator();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(164.81, audioCtx.currentTime); // E3

      osc1.connect(masterGain);
      osc2.connect(masterGain);

      osc1.start();
      osc2.start();
    } catch (err) {
      console.log('Web Audio API not supported or blocked');
    }
  }

  function stopAmbientSound() {
    if (masterGain && audioCtx) {
      masterGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.5);
      setTimeout(() => {
        if (audioCtx) audioCtx.close();
      }, 500);
    }
  }

  /* ------------------------------------------------------------------------
     8. Contact Form Handler
     ------------------------------------------------------------------------ */
  const contactForm = document.getElementById('contact-form');
  const formFeedback = document.getElementById('form-feedback');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('name').value;

      if (formFeedback) {
        formFeedback.className = 'form-feedback success';
        formFeedback.textContent = `Thank you, ${name}! Your message has been sent successfully. Aissa will get back to you soon.`;
      }

      contactForm.reset();

      setTimeout(() => {
        if (formFeedback) formFeedback.textContent = '';
      }, 6000);
    });
  }
});
