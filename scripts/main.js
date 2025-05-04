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
import initPreloader, { handlePreloader, initTitleCardPreloader, initRomanSealPreloader } from './modules/preloader.js';
import { initDomusMap } from './modules/domusMap.js';
import initProjectModal from './modules/projectModal.js'; 
import { initFormValidation } from './modules/formValidation.js';
import { handleHeaderOnScroll } from './modules/headerScroll.js';
import { onDocumentReady, updateCurrentYear } from './utils/helpers.js';
import initParallaxEffects from './modules/parallaxEffects.js';

/**
 * Initialize all modules when DOM is fully loaded
 */
onDocumentReady(() => {
    // Initialize preloaders - either use the comprehensive initialization
    // or individual preloader functions
    initPreloader(); 
    
    /* Individual preloader initialization approach:
    // handlePreloader();
    
    // Check for title card preloader
    // if (document.getElementById('preloader-title-card')) {
    //    initTitleCardPreloader();
    // }
    
    // Check for Roman seal preloader
    // if (document.getElementById('roman-seal-preloader')) {
    //    initRomanSealPreloader();
    // }
    */
    
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
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize domus map if it exists
    if (document.querySelector('.domus-map')) {
        initDomusMap();
    }
    
    // Initialize project modal if it exists
    if (document.querySelector('#project-modal')) {
        initProjectModal();
    }
    
    // Initialize form validation if contact form exists
    if (document.querySelector('#contact-form')) {
        initFormValidation();
    }
    
    // Update copyright year
    updateCurrentYear();
    
    // Handle header scroll effects
    handleHeaderOnScroll();
});