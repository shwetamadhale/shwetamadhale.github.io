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

// Enhanced Scroll Animation Functionality with Timeline Support
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Special handling for timeline items
                    if (entry.target.classList.contains('timeline-item')) {
                        const index = Array.from(entry.target.parentElement.children).indexOf(entry.target);
                        setTimeout(() => {
                            entry.target.classList.add('animate-visible');
                        }, index * 200); // Staggered delay for timeline items
                    } else {
                        // For other elements, add a small delay based on their position
                        const rect = entry.target.getBoundingClientRect();
                        const delay = Math.max(0, rect.top / 10);
                        setTimeout(() => {
                            entry.target.classList.add('animate-visible');
                        }, delay);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    } else {
        // Fallback for browsers without IntersectionObserver
        let delay = 0;
        animatedElements.forEach(el => {
            if (el.classList.contains('timeline-item')) {
                setTimeout(() => {
                    el.classList.add('animate-visible');
                }, delay);
                delay += 200;
            } else {
                setTimeout(() => {
                    el.classList.add('animate-visible');
                }, delay);
                delay += 100;
            }
        });
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

// Debug function to check what's happening with animations
function debugAnimations() {
    console.log("=== ANIMATION DEBUG ===");
    
    // Check if elements have the right classes
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    console.log(`Found ${animatedElements.length} elements with animate-on-scroll class`);
    
    animatedElements.forEach((el, index) => {
        console.log(`Element ${index + 1}:`, el);
        console.log(`Has animate-visible: ${el.classList.contains('animate-visible')}`);
        console.log(`Is timeline item: ${el.classList.contains('timeline-item')}`);
    });
    
    // Check if IntersectionObserver is supported
    console.log(`IntersectionObserver supported: ${'IntersectionObserver' in window}`);
    
    console.log("=== END DEBUG ===");
}

// Force animations for testing
function forceAnimations() {
    console.log("Forcing animations...");
    
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    let delay = 0;
    
    animatedElements.forEach(el => {
        if (el.classList.contains('timeline-item')) {
            setTimeout(() => {
                el.classList.add('animate-visible');
                console.log("Animating timeline item:", el);
            }, delay);
            delay += 300;
        } else {
            setTimeout(() => {
                el.classList.add('animate-visible');
            }, delay);
            delay += 100;
        }
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
    
    // Debug (remove after fixing)
    setTimeout(debugAnimations, 2000);
    
    // Force animations if they don't work (remove after fixing)
    setTimeout(forceAnimations, 3000);
});