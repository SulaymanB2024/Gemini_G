/**
 * smoothScroll.js
 * Provides smooth scrolling functionality for anchor links
 */

/**
 * Scroll to the target element with a smooth animation
 * @param {HTMLElement} targetElement - The element to scroll to
 * @param {number} duration - Duration of scroll animation in ms
 * @param {number} offset - Offset from the top in pixels
 */
function scrollToElement(targetElement, duration = 800, offset = 0) {
    if (!targetElement) return;
    
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
    const startPosition = window.pageYOffset;
    const distance = targetPosition - startPosition;
    let startTime = null;
    
    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const scrollProgress = Math.min(timeElapsed / duration, 1);
        const ease = easeInOutCubic(scrollProgress);
        
        window.scrollTo(0, startPosition + distance * ease);
        
        if (timeElapsed < duration) {
            requestAnimationFrame(animation);
        }
    }
    
    // Easing function for smooth acceleration and deceleration
    function easeInOutCubic(t) {
        return t < 0.5 
            ? 4 * t * t * t 
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    requestAnimationFrame(animation);
}

/**
 * Initialize smooth scrolling for all anchor links
 * @param {number} headerOffset - Offset for fixed header
 */
function initSmoothScroll(headerOffset = 70) {
    document.addEventListener('DOMContentLoaded', () => {
        // Handle all anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return; // Skip empty anchors
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    scrollToElement(targetElement, 800, headerOffset);
                }
            });
        });
        
        // Check for hash in URL on page load
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                // Slight delay to ensure page is fully loaded
                setTimeout(() => {
                    scrollToElement(targetElement, 800, headerOffset);
                }, 100);
            }
        }
    });
}

export { initSmoothScroll, scrollToElement };