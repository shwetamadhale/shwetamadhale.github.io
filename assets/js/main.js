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

// Simplified Scroll Animation Functionality
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        
        animatedElements.forEach(el => observer.observe(el));
    } else {
        // Fallback for browsers without IntersectionObserver
        animatedElements.forEach(el => el.classList.add('animate-visible'));
    }
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

// Initialize typing animations
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
    initScrollAnimations();
});