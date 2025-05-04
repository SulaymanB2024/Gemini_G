/**
 * parallaxEffects.js
 * Implements parallax scrolling effects for the Roman-themed portfolio website
 * Creates depth layers with subtle movement to enhance the visual experience
 */

export default function initParallaxEffects() {
    // Only initialize if not on mobile (optional - can be adjusted based on performance needs)
    if (window.innerWidth < 768 && detectLowPowerDevice()) {
        disableParallaxEffects();
        return;
    }

    setupParallaxLayers();
    setupParallaxSections();
    setupScrollingMosaic();
    
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        disableParallaxEffects();
    }
}

/**
 * Setup hero section parallax layers with different movement speeds
 */
function setupParallaxLayers() {
    const parallaxContainer = document.querySelector('.parallax-container');
    if (!parallaxContainer) return;
    
    // Set up scroll event with throttling for performance
    window.addEventListener('scroll', throttle(updateParallaxLayers, 10));
    
    // Initial update
    updateParallaxLayers();
}

/**
 * Update positions of parallax layers based on scroll position
 */
function updateParallaxLayers() {
    const scrollY = window.scrollY;
    document.querySelectorAll('.parallax-layer').forEach(layer => {
        const speed = parseFloat(layer.dataset.speed) || 0;
        const yPos = -(scrollY * speed);
        layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
}

/**
 * Setup parallax effects for section transitions
 */
function setupParallaxSections() {
    // Use Intersection Observer to trigger effects when sections come into view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const section = entry.target;
                animateSection(section);
            }
        });
    }, {
        threshold: 0.1
    });
    
    // Observe all sections with parallax effects
    document.querySelectorAll('.section-parallax').forEach(section => {
        observer.observe(section);
    });
}

/**
 * Animate section elements with parallax effects
 * @param {HTMLElement} section - The section to animate
 */
function animateSection(section) {
    // Find decorative elements and apply staggered animations
    section.querySelectorAll('.decorative-element').forEach((element, index) => {
        setTimeout(() => {
            element.classList.add('animated');
        }, index * 150); // Staggered timing
    });
    
    // Animate side pillars with parallax effect
    section.querySelectorAll('.side-pillar').forEach(pillar => {
        pillar.classList.add('parallax-active');
    });
    
    // Apply floating effect to banners and emblems
    section.querySelectorAll('.roman-banner, .roman-emblem').forEach(element => {
        element.classList.add('floating');
    });
}

/**
 * Setup scrolling mosaic background effect
 */
function setupScrollingMosaic() {
    const mosaicSections = document.querySelectorAll('.mosaic-background');
    if (!mosaicSections.length) return;
    
    // Create mosaic tiles with variable movement
    mosaicSections.forEach(section => {
        createMosaicTiles(section);
    });
    
    // Add scroll listener for mosaic parallax effect
    window.addEventListener('scroll', throttle(updateMosaicParallax, 16));
}

/**
 * Create mosaic tile elements with random properties
 * @param {HTMLElement} container - Container for mosaic tiles
 */
function createMosaicTiles(container) {
    const tileCount = Math.floor(container.offsetWidth / 50) * Math.floor(container.offsetHeight / 50);
    const fragment = document.createDocumentFragment();
    
    for (let i = 0; i < tileCount; i++) {
        const tile = document.createElement('div');
        tile.className = 'mosaic-tile';
        tile.dataset.speed = (0.5 + Math.random() * 0.5).toFixed(2);
        tile.dataset.rotation = (Math.random() * 3).toFixed(2);
        
        // Position randomly within the container
        tile.style.left = `${Math.random() * 100}%`;
        tile.style.top = `${Math.random() * 100}%`;
        
        fragment.appendChild(tile);
    }
    
    container.appendChild(fragment);
}

/**
 * Update mosaic tiles based on scroll position
 */
function updateMosaicParallax() {
    const scrollY = window.scrollY;
    
    document.querySelectorAll('.mosaic-tile').forEach(tile => {
        const speed = parseFloat(tile.dataset.speed) || 0;
        const rotation = parseFloat(tile.dataset.rotation) || 0;
        const yPos = -(scrollY * speed);
        const rotateAmount = (scrollY * 0.001 * rotation);
        
        tile.style.transform = `translate3d(0, ${yPos}px, 0) rotate(${rotateAmount}deg)`;
    });
}

/**
 * Utility function to detect low power devices that might struggle with parallax
 * @returns {boolean} True if device is likely low power
 */
function detectLowPowerDevice() {
    // Simple detection based on mobile and old browsers
    const ua = navigator.userAgent;
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
        return true;
    }
    
    // More sophisticated detection could include:
    // - Battery API check
    // - Memory check
    // - Processor cores check
    
    return false;
}

/**
 * Disable all parallax effects for accessibility or performance reasons
 */
function disableParallaxEffects() {
    // Remove transform styles
    document.querySelectorAll('.parallax-layer, .mosaic-tile, .decorative-element, .side-pillar, .roman-banner, .roman-emblem')
        .forEach(element => {
            element.style.transform = 'none';
            element.style.transition = 'none';
        });
    
    // Remove scroll listeners
    window.removeEventListener('scroll', updateParallaxLayers);
    window.removeEventListener('scroll', updateMosaicParallax);
}

/**
 * Throttle function to limit execution frequency
 * @param {Function} callback - Function to throttle
 * @param {number} limit - Throttle time in ms
 * @returns {Function} Throttled function
 */
function throttle(callback, limit) {
    let waiting = false;
    return function() {
        if (!waiting) {
            callback.apply(this, arguments);
            waiting = true;
            setTimeout(() => {
                waiting = false;
            }, limit);
        }
    };
}