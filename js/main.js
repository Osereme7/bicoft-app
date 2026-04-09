/* ============================================
   BICOFT - Main JavaScript
   Futuristic Interactions, Motion, Particles
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // --- Scroll Progress Bar ---
  const progressBar = document.createElement('div');
  progressBar.classList.add('scroll-progress');
  document.body.appendChild(progressBar);

  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = progress + '%';
  }

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
    updateProgress();
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

  // --- Scroll animations (Intersection Observer) with stagger ---
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
            // Ease out expo
            const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
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

  // --- Enhanced Particles ---
  function createParticles() {
    const container = document.getElementById('heroParticles');
    if (!container) return;

    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 4 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 12 + 8) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';
      particle.style.opacity = Math.random() * 0.4 + 0.1;

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

  // --- Contact form (Formspree) ---
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

      const formData = new FormData(this);

      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      }).then(response => {
        if (response.ok) {
          btn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M5 10L9 14L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            Message Sent!
          `;
          btn.style.background = '#10B981';
          contactForm.reset();
        } else {
          btn.innerHTML = 'Error - Try Again';
          btn.style.background = '#EF4444';
        }
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      }).catch(() => {
        btn.innerHTML = 'Error - Try Again';
        btn.style.background = '#EF4444';
        setTimeout(() => {
          btn.innerHTML = originalText;
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
    });
  }

  // --- Back to top button ---
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 600) {
        backToTop.classList.add('visible');
      } else {
        backToTop.classList.remove('visible');
      }
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Play button (video placeholder) ---
  const playButton = document.getElementById('playButton');
  if (playButton) {
    playButton.addEventListener('click', () => {
      const placeholder = document.getElementById('videoPlaceholder');
      placeholder.innerHTML = `
        <iframe
          src="https://www.instagram.com/reel/DUqgYZIiFh3/embed/"
          style="width:100%;height:100%;border:none;position:absolute;top:0;left:0;"
          frameborder="0" scrolling="no" allowtransparency="true" allowfullscreen="true">
        </iframe>
      `;
      placeholder.style.aspectRatio = '9 / 16';
      placeholder.style.maxHeight = '600px';
      placeholder.style.maxWidth = '340px';
      placeholder.style.margin = '0 auto';
      placeholder.style.background = '#fff';
    });
  }

  // --- Tilt effect on service cards (desktop only) ---
  if (window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.service-card:not(.service-cta-card)').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 25;
        const rotateY = (centerX - x) / 25;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- Mouse-follow parallax on hero elements (desktop only) ---
  if (window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const heroVisual = document.querySelector('.hero-visual');
    const heroContent = document.querySelector('.hero-content');

    if (heroVisual) {
      document.querySelector('.hero').addEventListener('mousemove', (e) => {
        const rect = document.querySelector('.hero').getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Move cloud cards with different intensities for depth
        const cards = heroVisual.querySelectorAll('.cloud-card');
        cards.forEach((card, i) => {
          const intensity = (i + 1) * 8;
          card.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
        });

        // Slight movement on hero content
        if (heroContent) {
          heroContent.style.transform = `translate(${x * -4}px, ${y * -4}px)`;
        }
      });

      document.querySelector('.hero').addEventListener('mouseleave', () => {
        const cards = heroVisual.querySelectorAll('.cloud-card');
        cards.forEach(card => {
          card.style.transform = '';
        });
        if (heroContent) {
          heroContent.style.transform = '';
        }
      });
    }
  }

  // --- Magnetic effect on CTA buttons (desktop only) ---
  if (window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll('.btn-primary, .btn-white').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px) translateY(-3px) scale(1.02)`;
      });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // --- Parallax scroll on sections (desktop only) ---
  if (window.matchMedia('(min-width: 1024px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const parallaxElements = document.querySelectorAll('.section-header');

    function updateParallax() {
      parallaxElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
          const scrolled = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
          const parallaxOffset = (scrolled - 0.5) * 20;
          el.style.transform = `translateY(${parallaxOffset}px)`;
        }
      });
    }

    window.addEventListener('scroll', updateParallax, { passive: true });
  }

  // --- Animated gradient text ---
  const gradientTexts = document.querySelectorAll('.gradient-text');
  gradientTexts.forEach(text => {
    text.style.backgroundSize = '300% 300%';
  });

  // Add dynamic keyframes
  const styleSheet = document.createElement('style');
  styleSheet.textContent = `
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

  // --- Section reveal with staggered children ---
  function initStaggeredReveals() {
    const grids = document.querySelectorAll('.about-grid, .services-grid, .differentiators, .outcomes-grid, .pricing-grid');

    const gridObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const children = entry.target.children;
          Array.from(children).forEach((child, index) => {
            setTimeout(() => {
              child.style.opacity = '1';
              child.style.transform = 'translateY(0)';
              child.style.filter = 'blur(0)';
            }, index * 100);
          });
          gridObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    grids.forEach(grid => {
      Array.from(grid.children).forEach(child => {
        if (!child.hasAttribute('data-animate')) {
          child.style.opacity = '0';
          child.style.transform = 'translateY(30px)';
          child.style.filter = 'blur(3px)';
          child.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.6s ease';
        }
      });
      gridObserver.observe(grid);
    });
  }

  // Only add stagger if reduced motion is not preferred
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    initStaggeredReveals();
  }

});
