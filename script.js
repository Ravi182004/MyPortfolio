document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. THEME TOGGLE & PERSISTENCE
  // ==========================================================================
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  // Default to dark theme on every page load
  body.className = 'dark-theme';

  // Handle Theme Switching
  themeToggle.addEventListener('click', () => {
    if (body.classList.contains('dark-theme')) {
      body.classList.replace('dark-theme', 'light-theme');
    } else {
      body.classList.replace('light-theme', 'dark-theme');
    }
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
  // 3. CANVAS PARTICLE SYSTEM (REMOVED)
  // ==========================================================================
  // Removed in favor of background video.

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
  // 7. CONTACT FORM HANDLER WITH WEB3FORMS API
  // ==========================================================================
  const contactForm = document.getElementById('contact-form');
  const formSubmitBtn = document.getElementById('form-submit-btn');
  const formStatus = document.getElementById('form-status');

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Check if status element is hidden and show it
    formStatus.classList.remove('hidden');
    formStatus.textContent = '';
    formStatus.className = 'form-status-msg';

    // Fetch form fields
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;
    const subject = document.getElementById('form-subject').value;
    const message = document.getElementById('form-message').value;
    const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
    let accessKey = accessKeyInput ? accessKeyInput.value : '';

    // 1. First, check if key is set in config.js (CONFIG object)
    if ((!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') && typeof CONFIG !== 'undefined' && CONFIG.API_KEY) {
      accessKey = CONFIG.API_KEY;
    }

    // 2. Second, fallback to fetching .env dynamically (for local HTTP servers)
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      try {
        const envResponse = await fetch('.env');
        if (envResponse.ok) {
          const envText = await envResponse.text();
          const match = envText.match(/API\s*=\s*([^\s#]+)/);
          if (match && match[1]) {
            accessKey = match[1].trim();
          }
        }
      } catch (err) {
        console.warn('Failed to load .env file dynamically:', err);
      }
    }

    // Safety check for unconfigured access key
    if (!accessKey || accessKey === 'YOUR_ACCESS_KEY_HERE') {
      formStatus.textContent = 'Setup required: Please generate a free access key on web3forms.com and replace YOUR_ACCESS_KEY_HERE in index.html or set it in .env (running on a local server).';
      formStatus.className = 'form-status-msg error';
      return;
    }

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

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: accessKey,
        name: name,
        email: email,
        subject: subject,
        message: message
      })
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status === 200) {
        formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
        formStatus.className = 'form-status-msg success';
        
        // Save to local storage for persistence representation (simulate DB write)
        try {
          const leads = JSON.parse(localStorage.getItem('portfolio-leads') || '[]');
          leads.push({ name, email, subject, message, timestamp: new Date().toISOString() });
          localStorage.setItem('portfolio-leads', JSON.stringify(leads));
        } catch (storageErr) {
          console.warn('Could not write to local storage:', storageErr);
        }

        contactForm.reset();
      } else {
        formStatus.textContent = json.message || 'Oops! Something went wrong. Please try again.';
        formStatus.className = 'form-status-msg error';
      }
    })
    .catch((error) => {
      console.error(error);
      formStatus.textContent = 'Oops! Something went wrong. Please check your connection and try again.';
      formStatus.className = 'form-status-msg error';
    })
    .finally(() => {
      formSubmitBtn.disabled = false;
      formSubmitBtn.innerHTML = originalBtnText;
      
      // Auto-hide status message after 6 seconds
      setTimeout(() => {
        formStatus.className = 'form-status-msg hidden';
      }, 6000);
    });
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

