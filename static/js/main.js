/**
 * AnemiaCheck - AI-Powered Anemia Detection
 * Main JavaScript File
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initNavigation();
    initParticles();
    initAOS();
    initCountUp();
    initForm();
    initResults();
});

// ============================================
// Navigation
// ============================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                // Close mobile menu
                navLinks.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    });
}

// ============================================
// Particles Animation
// ============================================
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random positioning
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        
        // Random size
        const size = Math.random() * 4 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        
        // Random animation delay
        particle.style.animationDelay = Math.random() * 15 + 's';
        particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        
        particlesContainer.appendChild(particle);
    }
}

// ============================================
// AOS (Animate On Scroll) - Simple Implementation
// ============================================
function initAOS() {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }

    const elements = document.querySelectorAll('[data-aos]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('aos-animate');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    elements.forEach(el => observer.observe(el));
}

// ============================================
// Count Up Animation
// ============================================
function initCountUp() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                const duration = 2000;
                const step = target / (duration / 16);
                let current = 0;
                
                const updateCounter = () => {
                    current += step;
                    if (current < target) {
                        counter.textContent = Math.floor(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target;
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

// ============================================
// Form Handling
// ============================================
function initForm() {
    const form = document.getElementById('anemiaForm');
    const submitBtn = document.getElementById('submitBtn');
    
    if (!form || !submitBtn) return;

    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            validateField(input);
        });
        
        input.addEventListener('blur', () => {
            validateField(input);
        });
    });

    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) return;

        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        // Collect form data
        const formData = {
            gender: document.getElementById('gender').value,
            age: document.getElementById('age').value,
            hemoglobin: document.getElementById('hemoglobin').value,
            mch: document.getElementById('mch').value,
            mchc: document.getElementById('mchc').value,
            mcv: document.getElementById('mcv').value,
            rbc: document.getElementById('rbc').value
        };

        try {
            // Make API call
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            
            if (data.success) {
                displayResults(data);
                // Scroll to results
                setTimeout(() => {
                    document.getElementById('results').scrollIntoView({
                        behavior: 'smooth'
                    });
                }, 500);
            } else {
                alert('Error: ' + data.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            // Reset button state
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    });
}

function validateField(input) {
    const formGroup = input.closest('.form-group');
    if (!formGroup) return true;

    let isValid = true;

    // Check required
    if (input.hasAttribute('required') && !input.value) {
        isValid = false;
    }

    // Check number ranges
    if (input.type === 'number') {
        const min = parseFloat(input.min);
        const max = parseFloat(input.max);
        const value = parseFloat(input.value);

        if (input.value) {
            if (min && value < min) isValid = false;
            if (max && value > max) isValid = false;
        }
    }

    if (isValid) {
        formGroup.classList.remove('error');
    } else {
        formGroup.classList.add('error');
    }

    return isValid;
}

// ============================================
// Results Display
// ============================================
function initResults() {
    const resetBtn = document.getElementById('resetBtn');
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetForm();
        });
    }
}

function displayResults(data) {
    const resultsInitial = document.getElementById('resultsInitial');
    const resultsLoading = document.getElementById('resultsLoading');
    const resultsDisplay = document.getElementById('resultsDisplay');

    // Hide initial, show loading
    resultsInitial.classList.remove('active');
    resultsLoading.classList.add('active');

    // After loading animation, show results
    setTimeout(() => {
        resultsLoading.classList.remove('active');
        resultsDisplay.classList.add('active');
        
        // Update result content
        updateResultContent(data);
    }, 2000);
}

function updateResultContent(data) {
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const riskBadge = document.getElementById('riskBadge');
    const probAnemia = document.getElementById('probAnemia');
    const probNormal = document.getElementById('probNormal');
    const probAnemiaBar = document.getElementById('probAnemiaBar');
    const probNormalBar = document.getElementById('probNormalBar');
    const confidenceValue = document.getElementById('confidenceValue');
    const confidenceRing = document.getElementById('confidenceRing');
    const recommendationText = document.getElementById('recommendationText');

    // Update title and icon
    resultTitle.textContent = data.result;
    
    if (data.result === 'Anemia Detected') {
        resultIcon.className = 'result-icon negative';
        resultIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        riskBadge.className = 'risk-badge ' + data.risk_level.toLowerCase();
    } else {
        resultIcon.className = 'result-icon positive';
        resultIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        riskBadge.className = 'risk-badge low';
    }
    
    riskBadge.textContent = data.risk_level + ' Risk';

    // Update probabilities
    probAnemia.textContent = data.probability_anemia + '%';
    probNormal.textContent = data.probability_normal + '%';

    // Animate probability bars
    setTimeout(() => {
        probAnemiaBar.style.width = data.probability_anemia + '%';
        probNormalBar.style.width = data.probability_normal + '%';
    }, 100);

    // Update confidence
    confidenceValue.textContent = data.confidence;

    // Animate confidence ring
    const circumference = 2 * Math.PI * 52;
    const offset = circumference - (data.confidence / 100) * circumference;
    
    setTimeout(() => {
        confidenceRing.style.strokeDashoffset = offset;
    }, 100);

    // Update recommendation
    recommendationText.textContent = data.recommendation;
}

function resetForm() {
    const form = document.getElementById('anemiaForm');
    const resultsInitial = document.getElementById('resultsInitial');
    const resultsLoading = document.getElementById('resultsLoading');
    const resultsDisplay = document.getElementById('resultsDisplay');
    const probAnemiaBar = document.getElementById('probAnemiaBar');
    const probNormalBar = document.getElementById('probNormalBar');
    const confidenceRing = document.getElementById('confidenceRing');

    // Reset form
    form.reset();

    // Reset results display
    resultsDisplay.classList.remove('active');
    resultsLoading.classList.remove('active');
    resultsInitial.classList.add('active');

    // Reset animations
    probAnemiaBar.style.width = '0';
    probNormalBar.style.width = '0';
    confidenceRing.style.strokeDashoffset = 326.73;

    // Scroll back to form
    document.getElementById('detect').scrollIntoView({
        behavior: 'smooth'
    });
}

// ============================================
// Utility Functions
// ============================================

// Debounce function for scroll events
function debounce(func, wait = 10, immediate = true) {
    let timeout;
    return function executedFunction() {
        const context = this;
        const args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Throttle function for performance
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}
