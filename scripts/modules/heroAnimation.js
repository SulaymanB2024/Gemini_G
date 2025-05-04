/**
 * heroAnimation.js - Hero Animation Module
 * Handles animated entrance effects for the hero section elements
 */

/**
 * Initializes staggered animations for the hero section elements.
 * Controls fade-in and slide-up effects with sequential timing.
 */
export function initHeroAnimation() {
    // Hero section elements to animate
    const heroElements = {
        heading: document.querySelector('.hero-content h1'),
        subheading: document.querySelector('.hero-content h2'),
        tagline: document.querySelector('.hero-content .tagline'),
        description: document.querySelector('.hero-content .hero-description'),
        cta: document.querySelector('.hero-content .cta-container'),
        heroImage: document.querySelector('.hero-image-container'),
        scrollIndicator: document.querySelector('.scroll-indicator')
    };
    
    // Timing configuration (milliseconds)
    const animationConfig = {
        initialDelay: 300,     // Initial delay before animations start
        staggerDelay: 180,     // Delay between each element animation
        fadeInDuration: 800,   // Duration of the fade-in effect
        slideDistance: '30px', // Distance elements move during animation
        autoScrollDelay: 8000  // Auto-scroll indicator delay
    };
    
    /**
     * Animate an element with fade-in and slide-up effects
     * @param {HTMLElement} element - The DOM element to animate
     * @param {number} delay - Delay before animation starts (ms)
     */
    function animateElement(element, delay) {
        if (!element) return;
        
        // Prepare element for animation
        element.style.opacity = '0';
        element.style.transform = `translateY(${animationConfig.slideDistance})`;
        element.style.transition = `opacity ${animationConfig.fadeInDuration}ms ease-out, transform ${animationConfig.fadeInDuration}ms ease-out`;
        
        // Trigger animation after delay
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }
    
    /**
     * Initialize the scroll indicator animation
     */
    function initScrollIndicator() {
        const indicator = heroElements.scrollIndicator;
        if (!indicator) return;
        
        // Prepare indicator with extended delay
        animateElement(indicator, animationConfig.initialDelay + (Object.keys(heroElements).length - 1) * animationConfig.staggerDelay + 400);
        
        // Add pulsing animation after appearing
        setTimeout(() => {
            indicator.classList.add('pulse-animation');
        }, animationConfig.initialDelay + Object.keys(heroElements).length * animationConfig.staggerDelay + 1000);
        
        // Auto-scroll functionality after delay
        setTimeout(() => {
            // Only auto-scroll if user hasn't scrolled yet
            if (window.scrollY < 100) {
                const firstSection = document.querySelector('section:not(.hero-section)');
                if (firstSection) {
                    firstSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, animationConfig.autoScrollDelay);
        
        // Add click handler for manual scroll
        indicator.addEventListener('click', () => {
            const firstSection = document.querySelector('section:not(.hero-section)');
            if (firstSection) {
                firstSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    /**
     * Start the animation sequence
     */
    function startAnimations() {
        let delay = animationConfig.initialDelay;
        
        // Animate hero elements in sequence
        Object.keys(heroElements).forEach(key => {
            if (key === 'scrollIndicator') return; // Handle separately
            
            const element = heroElements[key];
            if (element) {
                animateElement(element, delay);
                delay += animationConfig.staggerDelay;
            }
        });
        
        // Initialize scroll indicator separately
        initScrollIndicator();
    }
    
    // Check if hero section exists before initializing
    if (Object.values(heroElements).some(el => el)) {
        // Begin animations when DOM is loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', startAnimations);
        } else {
            startAnimations();
        }
        
        return {
            // Expose methods for potential manual control
            restart: startAnimations
        };
    } else {
        console.warn('Hero section elements not found. Animation module disabled.');
        return null;
    }
}

export default initHeroAnimation;