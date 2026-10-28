/**
 * TECHFEST 2025 // IIT BOMBAY - OFFICIAL LANDING ENGINE
 * 2D Canvas Neural Particle Engine // Web Audio API Synth // Event Controllers
 * Constraint: Strictly 2D Canvas - Zero 3D Assets (No Three.js / WebGL meshes)
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. WEB AUDIO API SCI-FI SOUND SYNTHESIZER (ZERO EXTERNAL ASSETS)
  // =========================================================================
  let audioCtx = null;
  let soundEnabled = false;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playCyberTone(type) {
    if (!soundEnabled || !audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (type === 'hover') {
        // High-tech subtle blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1800, now + 0.04);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
      } else if (type === 'click') {
        // Sci-Fi chirp confirmation
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'success') {
        // Chime for pass generation
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(783.99, now + 0.18); // G5
        osc2.frequency.setValueAtTime(1046.50, now + 0.25); // C6
        gain2.gain.setValueAtTime(0.07, now + 0.18);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.start(now);
        osc.stop(now + 0.35);
        osc2.start(now + 0.18);
        osc2.stop(now + 0.45);
      }
    } catch (e) {
      // Audio fallback silent
    }
  }

  // Audio Toggle UI Binding
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundLabel = document.getElementById('soundLabel');
  const hudAudioBar = document.getElementById('hudAudioBar');

  if (soundToggleBtn && soundLabel) {
    soundToggleBtn.addEventListener('click', () => {
      initAudio();
      soundEnabled = !soundEnabled;
      if (soundEnabled) {
        hudAudioBar.classList.add('sound-active');
        soundLabel.textContent = 'SFX: ACTIVE';
        soundToggleBtn.style.color = '#00F0FF';
        playCyberTone('click');
      } else {
        hudAudioBar.classList.remove('sound-active');
        soundLabel.textContent = 'SFX: MUTED';
        soundToggleBtn.style.color = '#9CA3AF';
      }
    });
  }

  // Attach SFX listeners
  document.querySelectorAll('[data-sfx="hover"]').forEach(el => {
    el.addEventListener('mouseenter', () => playCyberTone('hover'));
  });

  document.querySelectorAll('[data-sfx="click"]').forEach(el => {
    el.addEventListener('click', () => {
      initAudio();
      playCyberTone('click');
    });
  });

  // =========================================================================
  // 2. HIGH-PERFORMANCE 2D NEURAL CANVAS (ZERO 3D ASSETS)
  // =========================================================================
  const canvas = document.getElementById('neuralCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let mouse = { x: width / 2, y: height / 2, radius: 140 };
    window.addEventListener('mousemove', e => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    });

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    });

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 1;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.density = Math.random() * 20 + 5;
        this.color = Math.random() > 0.4 ? 'rgba(0, 240, 255, ' : 'rgba(121, 40, 202, ';
        this.alpha = Math.random() * 0.5 + 0.2;
      }

      draw() {
        ctx.fillStyle = this.color + this.alpha + ')';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }

      update() {
        // Continuous drift
        this.x += this.vx;
        this.y += this.vy;

        // Wall wrap
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;

        // Mouse interaction (repulsion)
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density;
          const directionY = forceDirectionY * force * this.density;

          this.x -= directionX;
          this.y -= directionY;
        }
      }
    }

    let particles = [];
    function initParticles() {
      particles = [];
      const particleCount = Math.min(Math.floor((width * height) / 14000), 90);
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    }
    initParticles();

    function connectParticles() {
      const maxDist = 130;
      for (let a = 0; a < particles.length; a++) {
        for (let b = a + 1; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDist) {
            const opacity = 1 - dist / maxDist;
            ctx.strokeStyle = `rgba(0, 240, 255, ${opacity * 0.18})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }
    }

    let animationFrameId;
    function animate() {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();
        particles[i].update();
      }
      connectParticles();
      animationFrameId = requestAnimationFrame(animate);
    }
    animate();
  }

  // =========================================================================
  // 3. COUNTDOWN TIMER ENGINE (IIT BOMBAY FESTIVAL COMMENCEMENT)
  // =========================================================================
  const daysEl = document.getElementById('daysVal');
  const hoursEl = document.getElementById('hoursVal');
  const minEl = document.getElementById('minVal');
  const secEl = document.getElementById('secVal');

  // Techfest 29th Edition target: December 22, 2025 at 09:30 AM IST
  const targetDate = new Date('2025-12-22T09:30:00+05:30').getTime();

  function updateCountdown() {
    const now = new Date().getTime();
    let distance = targetDate - now;

    // If target has passed in simulation, keep an active pulsing demo countdown
    if (distance < 0) {
      distance = Math.abs(distance % (30 * 24 * 60 * 60 * 1000));
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
    if (minEl) minEl.textContent = String(minutes).padStart(2, '0');
    if (secEl) secEl.textContent = String(seconds).padStart(2, '0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // =========================================================================
  // 4. COMPETITIONS CATEGORY FILTER ENGINE
  // =========================================================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const compCards = document.querySelectorAll('.comp-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      compCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          card.style.animation = 'modalPop 0.3s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  // =========================================================================
  // 5. ITINERARY 3-DAY TAB CONTROLLER
  // =========================================================================
  const dayTabs = document.querySelectorAll('.day-tab');
  const daySchedules = document.querySelectorAll('.day-schedule');

  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      dayTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const dayId = tab.getAttribute('data-day');
      daySchedules.forEach(schedule => {
        if (schedule.id === dayId) {
          schedule.classList.add('active');
        } else {
          schedule.classList.remove('active');
        }
      });
    });
  });

  // =========================================================================
  // 6. REGISTRATION MODAL CONTROLLER
  // =========================================================================
  const regModal = document.getElementById('regModal');
  const modalBackdrop = document.getElementById('modalBackdrop');
  const modalCloseBtn = document.getElementById('modalCloseBtn');
  const regForm = document.getElementById('regForm');
  const modalSuccess = document.getElementById('modalSuccess');
  const closeSuccessBtn = document.getElementById('closeSuccessBtn');
  const eventSelect = document.getElementById('eventSelect');
  const passHolderName = document.getElementById('passHolderName');
  const passTrack = document.getElementById('passTrack');

  function openModal(defaultEvent) {
    if (regModal) {
      regModal.classList.add('active');
      regModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';

      if (defaultEvent && eventSelect) {
        for (let i = 0; i < eventSelect.options.length; i++) {
          if (eventSelect.options[i].value === defaultEvent) {
            eventSelect.selectedIndex = i;
            break;
          }
        }
      }
    }
  }

  function closeModal() {
    if (regModal) {
      regModal.classList.remove('active');
      regModal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (regForm && modalSuccess) {
        regForm.reset();
        regForm.style.display = 'flex';
        modalSuccess.style.display = 'none';
      }
    }
  }

  document.querySelectorAll('.register-modal-trigger').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      initAudio();
      playCyberTone('click');
      const eventName = btn.getAttribute('data-event') || 'General Festival Pass';
      openModal(eventName);
    });
  });

  if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
  if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);
  if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', closeModal);

  // Escape key closes modal
  window.addEventListener('keydown', e => {
    if (e.key === 'Escape' && regModal && regModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Form submission handling
  if (regForm) {
    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = document.getElementById('fullName').value.trim() || 'Aryan Sharma';
      const selectedTrack = eventSelect.options[eventSelect.selectedIndex].text;

      if (passHolderName) passHolderName.textContent = name.toUpperCase();
      if (passTrack) passTrack.textContent = selectedTrack.toUpperCase();

      playCyberTone('success');
      regForm.style.display = 'none';
      if (modalSuccess) modalSuccess.style.display = 'block';
    });
  }

  // =========================================================================
  // 7. MOBILE DRAWER NAVIGATION
  // =========================================================================
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const drawerCloseBtn = document.getElementById('drawerCloseBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');

  function openDrawer() {
    if (mobileDrawer) mobileDrawer.classList.add('open');
  }

  function closeDrawer() {
    if (mobileDrawer) mobileDrawer.classList.remove('open');
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openDrawer);
  if (drawerCloseBtn) drawerCloseBtn.addEventListener('click', closeDrawer);

  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // =========================================================================
  // 8. HEADER SCROLL SHADOW
  // =========================================================================
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

})();
