/**
 * headerScroll.js
 * Handles header animations and transformations that occur on scroll
 */

import { throttle } from '../utils/helpers.js';

/**
 * Manages header visibility and appearance based on scroll position.
 * - Shows/hides header based on scroll direction
 * - Adds background and shadow when scrolled down
 * - Collapses header to compact mode when scrolled
 */
function handleHeaderOnScroll() {
    const header = document.querySelector('.site-header');
    if (!header) {
        console.warn('Header element not found.');
        return;
    }
    
    // Threshold values
    const scrollThreshold = 100;      // When to start showing the compact header
    const fullChangeThreshold = 200;  // When the header should be fully transformed
    
    let lastScrollTop = 0;  // Track previous scroll position to determine direction
    
    // Throttled scroll handler for performance
    const handleScroll = throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        
        if (scrollTop > scrollThreshold) {
            // When scrolled down, add compact styling
            header.classList.add('scrolled');
            
            // Apply additional classes based on scroll direction
            if (scrollDirection === 'down' && scrollTop > fullChangeThreshold) {
                header.classList.add('header-hidden');
            } else if (scrollDirection === 'up') {
                header.classList.remove('header-hidden');
            }
        } else {
            // When near top, remove all scroll-based modifications
            header.classList.remove('scrolled', 'header-hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Prevent negative scroll position
    }, 100); // Throttle to run at most every 100ms
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Call once on initialization to set the correct state
    handleScroll();
}

/**
 * Initialize all header scroll functionality
 */
function initHeaderScroll() {
    handleHeaderOnScroll();
}

export { initHeaderScroll, handleHeaderOnScroll };