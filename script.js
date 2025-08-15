// Mobile Navigation Toggle with Enhanced Animation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const body = document.body;

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        body.style.overflow = '';
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Calculator Functionality
class LamiSecCalculator {
    constructor() {
        this.materials = {
            glass: {
                name: 'Materiał ochronny do szkła',
                consumption: 90, // g/m² (average of 80-100)
                packages: {
                    '1kg': { price: 60, coverage: 11 }, // covers 10-12 m², using average
                    '5kg': { price: 250, coverage: 57.5 }, // 5kg * 11.5 m²/kg
                    '25kg': { price: 900, coverage: 300 } // 25kg * 12 m²/kg
                }
            },
            marble: {
                name: 'Materiał ochronny do marmuru',
                consumption: 350, // g/m²
                pricePerKg: 80
            }
        };

        this.vatRate = 0.23; // 23% VAT
        this.init();
    }

    init() {
        this.bindEvents();
        this.updatePackageVisibility();
        this.addInputEnhancements();
    }

    bindEvents() {
        const calculateBtn = document.getElementById('calculate-btn');
        const materialType = document.getElementById('material-type');
        const packageSize = document.getElementById('package-size');

        calculateBtn.addEventListener('click', () => this.calculate());
        materialType.addEventListener('change', () => this.updatePackageVisibility());
        
        // Add input validation
        document.getElementById('surface-area').addEventListener('input', (e) => {
            if (e.target.value < 0) e.target.value = 0;
        });
    }

    addInputEnhancements() {
        const inputs = document.querySelectorAll('input, select');
        inputs.forEach(input => {
            // Add focus effects
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                input.parentElement.classList.remove('focused');
            });

            // Add floating label effect
            if (input.type === 'number') {
                input.addEventListener('input', (e) => {
                    if (e.target.value) {
                        input.classList.add('has-value');
                    } else {
                        input.classList.remove('has-value');
                    }
                });
            }
        });
    }

    updatePackageVisibility() {
        const materialType = document.getElementById('material-type').value;
        const packageSizeGroup = document.querySelector('.form-group:has(#package-size)');
        
        if (materialType === 'marble') {
            packageSizeGroup.style.display = 'none';
        } else {
            packageSizeGroup.style.display = 'block';
        }
    }

    calculate() {
        const surfaceArea = parseFloat(document.getElementById('surface-area').value);
        const materialType = document.getElementById('material-type').value;
        const packageSize = document.getElementById('package-size').value;

        if (!surfaceArea || surfaceArea <= 0) {
            this.showError('Proszę wprowadzić prawidłową powierzchnię.');
            return;
        }

        let results;
        if (materialType === 'glass') {
            results = this.calculateGlass(surfaceArea, packageSize);
        } else {
            results = this.calculateMarble(surfaceArea);
        }

        this.displayResults(results);
        this.animateResults();
    }

    calculateGlass(surfaceArea, packageSize) {
        const material = this.materials.glass;
        const consumption = (material.consumption * surfaceArea) / 1000; // Convert to kg
        const packageInfo = material.packages[packageSize];
        
        const packagesNeeded = Math.ceil(consumption / (packageInfo.coverage / surfaceArea));
        const totalNetPrice = packagesNeeded * packageInfo.price;
        const vat = totalNetPrice * this.vatRate;
        const totalGrossPrice = totalNetPrice + vat;
        const costPerM2 = totalGrossPrice / surfaceArea;

        return {
            consumption: consumption.toFixed(2) + ' kg',
            packages: packagesNeeded,
            priceNet: totalNetPrice.toFixed(2) + ' PLN',
            vat: vat.toFixed(2) + ' PLN',
            priceGross: totalGrossPrice.toFixed(2) + ' PLN',
            costPerM2: costPerM2.toFixed(2) + ' PLN/m²'
        };
    }

    calculateMarble(surfaceArea) {
        const material = this.materials.marble;
        const consumption = (material.consumption * surfaceArea) / 1000; // Convert to kg
        const totalNetPrice = consumption * material.pricePerKg;
        const vat = totalNetPrice * this.vatRate;
        const totalGrossPrice = totalNetPrice + vat;
        const costPerM2 = totalGrossPrice / surfaceArea;

        return {
            consumption: consumption.toFixed(2) + ' kg',
            packages: Math.ceil(consumption),
            priceNet: totalNetPrice.toFixed(2) + ' PLN',
            vat: vat.toFixed(2) + ' PLN',
            priceGross: totalGrossPrice.toFixed(2) + ' PLN',
            costPerM2: costPerM2.toFixed(2) + ' PLN/m²'
        };
    }

    displayResults(results) {
        document.getElementById('consumption').textContent = results.consumption;
        document.getElementById('packages').textContent = results.packages;
        document.getElementById('price-net').textContent = results.priceNet;
        document.getElementById('vat').textContent = results.vat;
        document.getElementById('price-gross').textContent = results.priceGross;
        document.getElementById('cost-per-m2').textContent = results.costPerM2;
    }

    animateResults() {
        const resultsContainer = document.querySelector('.calculator-results');
        const resultItems = resultsContainer.querySelectorAll('.result-item');
        
        // Reset animations
        resultItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateX(-20px)';
        });

        // Animate each result item sequentially
        resultItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.transition = 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
                item.style.opacity = '1';
                item.style.transform = 'translateX(0)';
            }, index * 100);
        });
    }

    showError(message) {
        // Remove existing error notifications
        const existingErrors = document.querySelectorAll('.error-notification');
        existingErrors.forEach(error => error.remove());

        // Create error notification
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #dc3545;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 8px 25px rgba(220, 53, 69, 0.3);
            z-index: 1001;
            animation: slideInRight 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            font-weight: 500;
            max-width: 300px;
            line-height: 1.4;
        `;

        document.body.appendChild(notification);

        // Remove notification after 4 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 400);
        }, 4000);
    }
}

// Initialize calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LamiSecCalculator();
});

// Enhanced Navbar scroll effect
let lastScrollTop = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
    
    if (currentScroll > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.08)';
        navbar.style.borderBottom = '1px solid rgba(0, 0, 0, 0.05)';
    }

    // Hide/show navbar on scroll (optional)
    if (currentScroll > lastScrollTop && currentScroll > 200) {
        navbar.style.transform = 'translateY(-100%)';
    } else {
        navbar.style.transform = 'translateY(0)';
    }
    lastScrollTop = currentScroll;
});

// Enhanced Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            
            // Add staggered animation for child elements
            const animatedChildren = entry.target.querySelectorAll('.feature, .product-card, .application-card, .eco-feature');
            animatedChildren.forEach((child, index) => {
                setTimeout(() => {
                    child.style.opacity = '1';
                    child.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    
    // Set initial state for child elements
    const animatedChildren = section.querySelectorAll('.feature, .product-card, .application-card, .eco-feature');
    animatedChildren.forEach(child => {
        child.style.opacity = '0';
        child.style.transform = 'translateY(30px)';
        child.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });
    
    observer.observe(section);
});

// Enhanced form validation
document.getElementById('surface-area').addEventListener('blur', function() {
    if (this.value && parseFloat(this.value) <= 0) {
        this.style.borderColor = '#dc3545';
        this.style.boxShadow = '0 0 0 4px rgba(220, 53, 69, 0.1)';
    } else {
        this.style.borderColor = '';
        this.style.boxShadow = '';
    }
});

// Reset form validation on input
document.getElementById('surface-area').addEventListener('input', function() {
    this.style.borderColor = '';
    this.style.boxShadow = '';
});

// Enhanced loading state for calculate button
document.getElementById('calculate-btn').addEventListener('click', function() {
    this.classList.add('loading');
    this.textContent = 'Obliczam...';
    this.style.pointerEvents = 'none';
    
    setTimeout(() => {
        this.classList.remove('loading');
        this.textContent = 'Oblicz koszty';
        this.style.pointerEvents = '';
    }, 1500);
});

// Enhanced mobile experience
if ('ontouchstart' in window) {
    // Add touch-friendly hover effects for mobile
    document.querySelectorAll('.btn, .application-card, .product-card, .feature, .eco-feature').forEach(element => {
        element.addEventListener('touchstart', function() {
            this.style.transform = 'scale(0.98)';
        });
        
        element.addEventListener('touchend', function() {
            this.style.transform = '';
        });
    });
}

// Performance optimization: Lazy load images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Add smooth reveal animation for hero section
window.addEventListener('load', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.opacity = '0';
        hero.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            hero.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
            hero.style.opacity = '1';
            hero.style.transform = 'translateY(0)';
        }, 100);
    }
});

// Enhanced scroll animations
let ticking = false;

function updateScrollAnimations() {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero::before');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        const yPos = -(scrolled * speed);
        element.style.transform = `translateY(${yPos}px)`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateScrollAnimations);
        ticking = true;
    }
});
