/* ============================================
   BICOFT - Main JavaScript
   Interactivity, Animations, Particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Preloader ---
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }, 800);
  });

  // Fallback: hide preloader after 3s
  setTimeout(() => {
    if (!preloader.classList.contains('hidden')) {
      preloader.classList.add('hidden');
      document.body.style.overflow = '';
      initAnimations();
    }
  }, 3000);

  // --- Navbar scroll effect ---
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
  });

  // --- Mobile nav toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });

  // --- Smooth scrolling ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offset = navbar.offsetHeight + 20;
        const position = target.offsetTop - offset;
        window.scrollTo({
          top: position,
          behavior: 'smooth'
        });
      }
    });
  });

  // --- Scroll animations (Intersection Observer) ---
  function initAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, parseInt(delay));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('[data-animate]').forEach(el => {
      observer.observe(el);
    });
  }

  // --- Counter animation ---
  function animateCounters() {
    const counters = document.querySelectorAll('[data-count]');
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          const duration = 2000;
          const start = performance.now();

          function updateCounter(timestamp) {
            const elapsed = timestamp - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            entry.target.textContent = Math.round(target * eased);

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            }
          }

          requestAnimationFrame(updateCounter);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(counter => counterObserver.observe(counter));
  }

  animateCounters();

  // --- Particles ---
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 10 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = Math.random() * 0.5 + 0.1;

      container.appendChild(particle);
    }
  }

  createParticles();

  // --- Cost chart bars animation ---
  function animateBars() {
    const bars = document.querySelectorAll('.bar-fill');
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.classList.add('animated');
          }, 300);
          barObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    bars.forEach(bar => barObserver.observe(bar));
  }

  animateBars();

  // --- Active nav link on scroll ---
  const sections = document.querySelectorAll('section[id]');

  function updateActiveNav() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + id) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav);

  // --- Contact form ---
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const btn = this.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;

      btn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" class="spin">
          <circle cx="10" cy="10" r="8" stroke="currentColor" stroke-width="2" stroke-dasharray="40 20" stroke-linecap="round"/>
        </svg>
        Sending...
      `;
      btn.disabled = true;

      // Simulate form submission
      setTimeout(() => {
        btn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M5 10L9 14L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          Message Sent!
        `;
        btn.style.background = '#10B981';

        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
          contactForm.reset();
        }, 3000);
      }, 1500);
    });
  }

  // --- Play button (video placeholder) ---
  const playButton = document.getElementById('playButton');
  if (playButton) {
    playButton.addEventListener('click', () => {
      const placeholder = document.getElementById('videoPlaceholder');
      // Replace with an embedded video or just show an animation
      placeholder.innerHTML = `
        <div style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          color: white;
          gap: 16px;
          position: relative;
          z-index: 2;
        ">
          <div style="
            width: 80px;
            height: 80px;
            border: 3px solid rgba(255,255,255,0.3);
            border-top-color: white;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          "></div>
          <p style="font-size: 1.1rem; font-weight: 500;">Demo video coming soon</p>
          <p style="font-size: 0.9rem; opacity: 0.7;">Contact us for a live demonstration</p>
        </div>
        <style>
          @keyframes spin { to { transform: rotate(360deg); } }
        </style>
        <div class="video-bg-animation">
          <div class="vbg-circle vbg-1"></div>
          <div class="vbg-circle vbg-2"></div>
          <div class="vbg-circle vbg-3"></div>
        </div>
      `;
    });
  }

  // --- Tilt effect on service cards (desktop only) ---
  if (window.matchMedia('(min-width: 1024px)').matches) {
    document.querySelectorAll('.service-card:not(.service-cta-card)').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Typing effect for gradient text (optional) ---
  // Subtle glow animation on gradient text
  const gradientTexts = document.querySelectorAll('.gradient-text');
  gradientTexts.forEach(text => {
    text.style.backgroundSize = '200% 200%';
    text.style.animation = 'gradientShift 5s ease infinite';
  });

  // Add gradient shift keyframe dynamically
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
    @keyframes gradientShift {
      0%, 100% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
    }
    .spin {
      animation: spin 1s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .nav-link.active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(styleSheet);

});
