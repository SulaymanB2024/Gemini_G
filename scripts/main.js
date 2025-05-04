/**
 * Main JavaScript Entry Point
 * Imports and initializes all individual modules
 * Version: 3.0 (Modular Architecture)
 */

// Import all modules
import { initDarkMode } from './modules/darkMode.js';
import { initHeroAnimation } from './modules/heroAnimation.js';
import { initMobileNav } from './modules/mobileNav.js';
import { initScrollReveal } from './modules/scrollReveal.js';
import { initSmoothScroll } from './modules/smoothScroll.js';
import { initPreloader, createPreloader } from './modules/preloader.js';
import { initDomusMap } from './modules/domusMap.js';

/**
 * Initialize all modules when DOM is fully loaded
 */
document.addEventListener('DOMContentLoaded', () => {
    // Check if preloader exists, if not create it
    if (!document.querySelector('.preloader')) {
        createPreloader();
    }
    
    // Initialize preloader (will handle its own visibility)
    initPreloader();
    
    // Initialize dark mode functionality
    initDarkMode();
    
    // Initialize mobile navigation
    initMobileNav();
    
    // Initialize smooth scrolling for anchor links
    initSmoothScroll();
    
    // Initialize scroll animations
    initScrollReveal();
    
    // Initialize hero animation if hero section exists
    if (document.querySelector('.hero-section')) {
        initHeroAnimation();
    }
    
    // Initialize domus map if it exists
    if (document.querySelector('.domus-map')) {
        initDomusMap();
    }
    
    // Handle header scroll effects
    handleHeaderOnScroll();
});

/**
 * Handles header appearance on scroll
 */
function handleHeaderOnScroll() {
    const header = document.querySelector('.site-header');
    
    if (!header) return;
    
    const scrollThreshold = 50;
    
    // Initial check for page load with scroll already happening
    if (window.scrollY > scrollThreshold) {
        header.classList.add('scrolled');
    }
    
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}