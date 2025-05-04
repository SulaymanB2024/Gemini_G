/**
 * scrollReveal.js
 * Handles scroll reveal animations using Intersection Observer API
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initializes scroll reveal animations
 */
export function initScrollReveal() {
    // Check for Intersection Observer support
    if (!('IntersectionObserver' in window)) {
        console.warn('Intersection Observer not supported. Scroll animations disabled.');
        // Show all elements that would be animated
        document.querySelectorAll('.reveal-element').forEach(el => {
            el.style.opacity = 1;
            el.style.transform = 'none';
        });
        return;
    }
    
    // Select all elements with the reveal-element class
    const elementsToReveal = document.querySelectorAll('.reveal-element');
    
    if (!elementsToReveal.length) return;
    
    // Create observer configuration
    const observerOptions = {
        root: null, // Use viewport as root
        rootMargin: '0px', 
        threshold: 0.15 // Trigger when at least 15% of the element is visible
    };
    
    // Create Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                revealElement(entry.target);
                observer.unobserve(entry.target); // Stop observing once revealed
            }
        });
    }, observerOptions);
    
    // Start observing all reveal elements
    elementsToReveal.forEach(el => {
        // Set initial styles
        prepareElementForReveal(el);
        // Start observing
        observer.observe(el);
    });
}

/**
 * Prepares an element for reveal animation by setting initial styles
 * @param {HTMLElement} element - Element to prepare
 */
function prepareElementForReveal(element) {
    // Set initial styles based on data attributes or defaults
    const direction = element.dataset.revealDirection || 'up';
    const distance = element.dataset.revealDistance || '30px';
    const delay = element.dataset.revealDelay || '0';
    
    // Set initial styles
    element.style.opacity = '0';
    element.style.transition = `opacity 0.8s ease-out ${delay}s, transform 0.8s ease-out ${delay}s`;
    
    // Set transform based on direction
    switch(direction) {
        case 'up':
            element.style.transform = `translateY(${distance})`;
            break;
        case 'down':
            element.style.transform = `translateY(-${distance})`;
            break;
        case 'left':
            element.style.transform = `translateX(${distance})`;
            break;
        case 'right':
            element.style.transform = `translateX(-${distance})`;
            break;
        case 'scale':
            element.style.transform = 'scale(0.9)';
            break;
        default:
            element.style.transform = `translateY(${distance})`;
    }
}

/**
 * Reveals an element by animating it
 * @param {HTMLElement} element - Element to reveal
 */
function revealElement(element) {
    // Reset styles to reveal the element
    element.style.opacity = '1';
    element.style.transform = 'none';
    
    // Add revealed class for potential styling
    element.classList.add('revealed');
    
    // Allow for additional custom animation
    const customAnimation = element.dataset.revealAnimation;
    if (customAnimation) {
        element.classList.add(customAnimation);
    }
}