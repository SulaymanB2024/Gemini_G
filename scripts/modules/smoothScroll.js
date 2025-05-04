/**
 * smoothScroll.js
 * Handles smooth scrolling functionality for anchor links
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initializes smooth scrolling for all anchor links
 */
export function initSmoothScroll() {
    // Get all anchor links that point to an ID
    const anchorLinks = document.querySelectorAll('a[href^="#"]:not([href="#"])');
    
    // Add click event listeners to each anchor link
    anchorLinks.forEach(link => {
        link.addEventListener('click', smoothScrollToTarget);
    });
    
    // Initialize the scroll indicator if it exists
    initScrollIndicator();
}

/**
 * Smoothly scrolls to the target element when an anchor link is clicked
 * @param {Event} e - Click event
 */
function smoothScrollToTarget(e) {
    e.preventDefault();
    
    const targetId = this.getAttribute('href');
    const targetElement = document.querySelector(targetId);
    
    if (!targetElement) return;
    
    // Calculate the target position with an offset for the fixed header
    const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerOffset;
    
    // Smooth scroll to the target
    window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
    });
    
    // Update the URL hash without causing a jump
    history.pushState(null, null, targetId);
    
    // If mobile menu is open, close it
    const mobileNav = document.getElementById('mobile-nav');
    if (mobileNav && mobileNav.classList.contains('active')) {
        mobileNav.classList.remove('active');
    }
}

/**
 * Initializes the scroll indicator in the hero section
 */
function initScrollIndicator() {
    const scrollIndicator = document.querySelector('.scroll-indicator');
    
    if (!scrollIndicator) return;
    
    scrollIndicator.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Find the first section after the hero section
        const heroSection = document.querySelector('.hero-section');
        const targetSection = heroSection.nextElementSibling;
        
        if (!targetSection) return;
        
        // Calculate position and scroll
        const headerOffset = document.querySelector('.site-header')?.offsetHeight || 0;
        const targetPosition = targetSection.getBoundingClientRect().top + window.pageYOffset - headerOffset;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    });
}