// Enhanced Typing Animation Class
class TypeMaster {
  constructor(element, options = {}) {
    this.element = element;
    this.text = element.dataset.animateText || element.textContent.trim();
    this.options = {
      typingSpeed: 100,
      eraseSpeed: 30,
      pauseBeforeErase: 1500,
      pauseBeforeRetry: 500,
      loop: true,
      cursor: true,
      ...options
    };
    this.currentText = '';
    this.isDeleting = false;
    this.init();
  }

  init() {
    this.element.textContent = '';
    if (this.options.cursor) {
      this.cursor = document.createElement('span');
      this.cursor.className = 'typing-cursor';
      this.cursor.textContent = '|';
      this.element.appendChild(this.cursor);
    }
    this.animate();
  }

  animate() {
    const speed = this.isDeleting ? this.options.eraseSpeed : this.options.typingSpeed;
    
    if (!this.isDeleting) {
      // Typing phase
      this.currentText = this.text.substring(0, this.currentText.length + 1);
      this.updateDisplay();
      
      if (this.currentText === this.text) {
        setTimeout(() => {
          this.isDeleting = true;
          this.animate();
        }, this.options.pauseBeforeErase);
        return;
      }
    } else {
      // Deleting phase
      this.currentText = this.currentText.substring(0, this.currentText.length - 1);
      this.updateDisplay();
      
      if (this.currentText === '') {
        setTimeout(() => {
          this.isDeleting = false;
          if (this.options.loop) this.animate();
        }, this.options.pauseBeforeRetry);
        return;
      }
    }
    
    setTimeout(() => this.animate(), speed);
  }

  updateDisplay() {
    this.element.innerHTML = this.currentText;
    if (this.options.cursor) {
      this.element.appendChild(this.cursor);
    }
  }
}

// Scroll Animation Functionality
class ScrollAnimator {
  constructor() {
    this.animatedElements = [];
    this.threshold = 0.1;
    this.init();
  }

  init() {
    this.cacheElements();
    this.setupObserver();
  }

  cacheElements() {
    // Cache all elements that need animation
    this.animatedElements = [
      ...document.querySelectorAll('.project-card'),
      ...document.querySelectorAll('.achievement-card'),
      ...document.querySelectorAll('.tech-item'),
      ...document.querySelectorAll('.timeline-item'),
      ...document.querySelectorAll('.section-header h2'),
      ...document.querySelectorAll('.about-content p')
    ];
  }

  setupObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: this.threshold
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateElement(entry.target);
          this.observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe all animated elements
    this.animatedElements.forEach(el => {
      el.classList.add('animate-on-scroll');
      this.observer.observe(el);
    });
  }

  animateElement(element) {
    // Determine animation type based on element type or position
    if (element.classList.contains('project-card') || 
        element.classList.contains('achievement-card')) {
      // Alternate animations for cards
      const index = Array.from(element.parentElement.children).indexOf(element);
      if (index % 2 === 0) {
        element.classList.add('animate-fade-in-left');
      } else {
        element.classList.add('animate-fade-in-right');
      }
    } else if (element.classList.contains('tech-item')) {
      element.classList.add('animate-fade-in-up');
    } else if (element.classList.contains('timeline-item')) {
      element.classList.add('animate-fade-in-left');
    } else if (element.classList.contains('section-header')) {
      element.classList.add('animate-fade-in-up');
    } else {
      element.classList.add('animate-fade-in');
    }
  }
}

// Parallax effect for video background
function initParallax() {
  const videoBackground = document.querySelector('.video-background');
  if (!videoBackground) return;
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const rate = scrolled * -0.5;
    videoBackground.style.transform = `translate3d(0px, ${rate}px, 0px) translate(-50%, -50%)`;
  });
}

// Handle header scroll effect
function handleScroll() {
  const header = document.querySelector('header');
  const scrollPosition = window.scrollY;
  
  if (scrollPosition > 10) {
    header.style.backgroundColor = 'rgba(0,0,0,0.7)';
    header.style.backdropFilter = 'blur(10px)';
  } else {
    header.style.backgroundColor = 'transparent';
    header.style.backdropFilter = 'none';
  }
}

// Set active page in navigation
function setActiveNavLink() {
  const currentPage = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-center a').forEach(link => {
    const linkPage = link.getAttribute('href');
    if (linkPage === currentPage || 
        (currentPage === 'index.html' && linkPage === './')) {
      link.classList.add('current-page');
    }
  });
}

// Initialize everything
function initAnimations() {
  // Hero animation
  const heroTitle = document.querySelector('.hero h1');
  if (heroTitle) {
    new TypeMaster(heroTitle, {
      typingSpeed: 100,
      eraseSpeed: 30,
      pauseBeforeErase: 1500,
      pauseBeforeRetry: 500,
      loop: true
    });
  }

  // Section headings
  document.querySelectorAll('[data-animate-type], .section-header h2').forEach(el => {
    new TypeMaster(el, {
      loop: true,
      typingSpeed: 80,
      cursor: true
    });
  });
}

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
  initAnimations();
  setActiveNavLink();
  
  // Add padding to body to account for fixed header
  const headerHeight = document.querySelector('header').offsetHeight;
  document.body.style.paddingTop = `${headerHeight}px`;
  
  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - headerHeight,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Initialize
  
  // Initialize scroll animations
  new ScrollAnimator();
  
  // Initialize parallax effect
  initParallax();
});