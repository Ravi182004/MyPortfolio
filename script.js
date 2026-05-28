document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. THEME TOGGLE & PERSISTENCE
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Retrieve theme preference from LocalStorage or system default
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme) {
    body.className = savedTheme;
  } else {
    // Default to dark theme
    body.className = 'dark-theme';
    localStorage.setItem('portfolio-theme', 'dark-theme');
  }

  // Handle Theme Switching
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
      localStorage.setItem('portfolio-theme', 'light-theme');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
      localStorage.setItem('portfolio-theme', 'dark-theme');
    }
    // Update particle colors on theme toggle
    updateParticleColors();
  });

  // ==========================================================================
  // 2. HERO TYPING ANIMATION
  // ==========================================================================
  const typedTextSpan = document.getElementById('typed-text');
  const textArray = [
    'Developer',
    'Data Scientist',
    'AI / ML Developer',
    'Hackathon Champion',
    'Computer Science Graduate'
  ];
  const typingSpeed = 100;
  const erasingSpeed = 60;
  const newTextDelay = 2000; // Delay between texts
  let textArrayIndex = 0;
  let charIndex = 0;

  function type() {
    if (charIndex < textArray[textArrayIndex].length) {
      typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
      charIndex++;
      setTimeout(type, typingSpeed);
    } else {
      setTimeout(erase, newTextDelay);
    }
  }

  function erase() {
    if (charIndex > 0) {
      typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
      charIndex--;
      setTimeout(erase, erasingSpeed);
    } else {
      textArrayIndex = (textArrayIndex + 1) % textArray.length;
      setTimeout(type, typingSpeed + 100);
    }
  }

  // Start the typing animation loop
  if (textArray.length) setTimeout(type, 1000);

  // ==========================================================================
  // 3. CANVAS PARTICLE SYSTEM
  // ==========================================================================
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  
  let orbsArray = [];
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  // Track mouse coordinates for smooth parallax
  window.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  // Dynamic Opacities based on Dark/Light Theme
  let opacities = {
    indigo: 0.15,
    teal: 0.12,
    purple: 0.10,
    pink: 0.08
  };

  function updateParticleColors() {
    if (body.classList.contains('dark-theme')) {
      opacities = { indigo: 0.16, teal: 0.14, purple: 0.12, pink: 0.10 };
    } else {
      opacities = { indigo: 0.06, teal: 0.05, purple: 0.04, pink: 0.03 };
    }
  }

  // Set Canvas dimensions
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class GlowOrb {
    constructor(baseX, baseY, radius, colorName, speedFactor) {
      this.baseX = baseX; // Normalized percentage coordinate (0 to 1)
      this.baseY = baseY;
      this.radius = radius;
      this.colorName = colorName;
      this.speedFactor = speedFactor; // How fast it shifts with mouse
      
      // Floating offset
      this.angle = Math.random() * Math.PI * 2;
      this.angleSpeed = Math.random() * 0.0015 + 0.0008;
      this.floatRange = Math.random() * 50 + 50;
    }

    update() {
      // Floating oscillation
      this.angle += this.angleSpeed;
      const floatX = Math.sin(this.angle) * this.floatRange;
      const floatY = Math.cos(this.angle) * this.floatRange;

      // Mouse Parallax displacement
      const offsetX = (mouseX - window.innerWidth / 2) * this.speedFactor;
      const offsetY = (mouseY - window.innerHeight / 2) * this.speedFactor;

      // Combine base coordinate, floating, and mouse parallax
      this.x = (this.baseX * canvas.width) + floatX + offsetX;
      this.y = (this.baseY * canvas.height) + floatY + offsetY;
    }

    draw() {
      let colorStr = '';
      const opacity = opacities[this.colorName] || 0.1;
      
      if (this.colorName === 'indigo') colorStr = `rgba(99, 102, 241, ${opacity})`;
      else if (this.colorName === 'teal') colorStr = `rgba(20, 184, 166, ${opacity})`;
      else if (this.colorName === 'purple') colorStr = `rgba(139, 92, 246, ${opacity})`;
      else if (this.colorName === 'pink') colorStr = `rgba(217, 70, 239, ${opacity})`;

      ctx.fillStyle = colorStr;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function initOrbs() {
    orbsArray = [
      new GlowOrb(0.15, 0.2, 220, 'indigo', 0.08),
      new GlowOrb(0.85, 0.15, 260, 'teal', 0.05),
      new GlowOrb(0.35, 0.75, 280, 'purple', 0.06),
      new GlowOrb(0.75, 0.8, 200, 'pink', 0.07),
      new GlowOrb(0.5, 0.45, 180, 'indigo', 0.04)
    ];
    updateParticleColors();
  }
  initOrbs();

  function animateOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Smooth mouse position easing
    mouseX += (targetMouseX - mouseX) * 0.08;
    mouseY += (targetMouseY - mouseY) * 0.08;

    for (let i = 0; i < orbsArray.length; i++) {
      orbsArray[i].update();
      orbsArray[i].draw();
    }
    requestAnimationFrame(animateOrbs);
  }
  animateOrbs();

  // ==========================================================================
  // 4. HEADER NAVIGATION ACTIONS
  // ==========================================================================
  const header = document.getElementById('my-header');
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Change Header Style on Scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    highlightNavLinks();
  });

  // Mobile Hamburger Toggle
  hamburgerBtn.addEventListener('click', () => {
    hamburgerBtn.classList.toggle('active');
    navMenu.classList.toggle('active');
  });

  // Close Mobile Menu on Link Click
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      hamburgerBtn.classList.remove('active');
      navMenu.classList.remove('active');
    });
  });

  // Scroll Active Link Highlighting
  const sections = document.querySelectorAll('section');
  function highlightNavLinks() {
    let scrollPosition = window.scrollY + 120;
    
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      
      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }

  // ==========================================================================
  // 5. INTERSECTION OBSERVER (SCROLL REVEAL & SKILLS PROGRESS)
  // ==========================================================================
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const skillPills = document.querySelectorAll('.skill-pill');
  
  // Set up reveal observer
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  scrollElements.forEach(el => {
    revealObserver.observe(el);
  });

  // Set up skill progress bar animator
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Animate all skill progress indicators in this container
        const progressBars = entry.target.querySelectorAll('.skill-progress');
        progressBars.forEach(bar => {
          // Triggers transition from scaleX(0) in CSS to actual value
          bar.style.transform = 'scaleX(1)';
        });
      }
    });
  }, {
    threshold: 0.1
  });

  const skillsShowcase = document.querySelector('.skills-showcase');
  if (skillsShowcase) {
    skillsObserver.observe(skillsShowcase);
  }

  // ==========================================================================
  // 6. SKILL CATEGORY TABS FILTER
  // ==========================================================================
  const tabBtns = document.querySelectorAll('.skill-tab');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Toggle Active Tab class
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-category');
      
      skillPills.forEach(pill => {
        const pillCat = pill.getAttribute('data-category');
        if (filterValue === 'all' || pillCat === filterValue) {
          pill.classList.remove('hidden');
          // Trigger entry transitions
          setTimeout(() => {
            pill.style.opacity = '1';
            pill.style.transform = 'translateY(0)';
          }, 50);
        } else {
          pill.style.opacity = '0';
          pill.style.transform = 'translateY(5px)';
          // Hide element from layout after animation completes
          setTimeout(() => {
            pill.classList.add('hidden');
          }, 300);
        }
      });
    });
  });

  // ==========================================================================
  // 7. CONTACT FORM HANDLER WITH MOCK API
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Change button to loading state
    const originalBtnText = formSubmitBtn.innerHTML;
    formSubmitBtn.disabled = true;
    formSubmitBtn.innerHTML = `
      <span>Sending Message...</span>
      <svg class="animate-bounce" style="width:16px;height:16px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    `;

    // Fetch form fields
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;

    // Simulate API network latency of 1.5s
    setTimeout(() => {
      try {
        // Save to local storage for persistence representation (simulate DB write)
        const leads = JSON.parse(localStorage.getItem('portfolio-leads') || '[]');
        leads.push({
          name,
          email,
          subject,
          message,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('portfolio-leads', JSON.stringify(leads));

        // Display Success State
        formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
        formStatus.className = 'form-status-msg success';
        
        // Reset form inputs
        contactForm.reset();
      } catch (err) {
        formStatus.textContent = 'Oops! Something went wrong. Please try again.';
        formStatus.className = 'form-status-msg error';
      } finally {
        formSubmitBtn.disabled = false;
        formSubmitBtn.innerHTML = originalBtnText;
        
        // Auto-hide status message after 5 seconds
        setTimeout(() => {
          formStatus.className = 'form-status-msg hidden';
        }, 5000);
      }
    }, 1500);
  });

  // ==========================================================================
  // 8. 3D INTERACTIVE TILT MOVEMENT
  // ==========================================================================
  const tiltContainer = document.querySelector('.logo-3d-container');
  const tiltWrapper = document.querySelector('.logo-3d-wrapper');
  const reflection = document.querySelector('.logo-3d-reflection');

  if (tiltContainer && tiltWrapper) {
    tiltContainer.addEventListener('mousemove', (e) => {
      const rect = tiltContainer.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Max rotation angles (in degrees)
      const maxRotateX = 25;
      const maxRotateY = 25;

      const rotateX = -(y / (rect.height / 2)) * maxRotateX;
      const rotateY = (x / (rect.width / 2)) * maxRotateY;

      // Apply transforms
      tiltWrapper.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.08)`;
      
      // Specular sheen slide effect
      if (reflection) {
        reflection.style.transform = `translate3d(${-x * 0.5}px, ${-y * 0.5}px, 15px)`;
      }
    });

    tiltContainer.addEventListener('mouseleave', () => {
      // Reset position
      tiltWrapper.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
      if (reflection) {
        reflection.style.transform = 'translate3d(0, 0, 15px)';
      }
    });
  }

  // Tilt other elements like project cards and achievement cards for a premium 3D feel!
  const cards = document.querySelectorAll('.project-card, .achievement-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      const rotateX = -(y / (rect.height / 2)) * 8; // gentle tilt for cards
      const rotateY = (x / (rect.width / 2)) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    });
  });
});

