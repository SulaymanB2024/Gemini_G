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
import { initSkillEcosystem } from './modules/skillEcosystem.js';
import { initRomanArtifacts } from './modules/romanArtifacts.js';
import { initLivingBackgrounds } from './modules/livingBackgrounds.js';
import { initCursusHonorumTimeline } from './modules/cursusHonorumTimeline.js';
import { initDynamicLighting } from './modules/dynamicLighting.js';

/**
 * Initialize all modules when DOM is fully loaded
 */
onDocumentReady(() => {
    console.log('Initializing modules...');
    
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
    
    // Initialize living backgrounds with animated textures
    initLivingBackgrounds();
    
    // Initialize dynamic lighting & shadow system
    initDynamicLighting();
    
    // Initialize parallax effects
    initParallaxEffects();
    
    // Initialize interactive Roman artifacts
    initRomanArtifacts();
    
    // Initialize Cursus Honorum Timeline for experience section
    if (document.querySelector('.experience-section')) {
        initCursusHonorumTimeline();
    }
    
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
    
    // Initialize dynamic skill ecosystem visualization if skill tags exist
    if (document.querySelectorAll('.skill-tag[data-skill]').length > 0) {
        // Call the ecosystem initialization with a more reliable approach:
        // 1. First check if everything is loaded
        // 2. Initialize with a delay to ensure DOM is fully ready
        // 3. Add retry logic for more robust initialization
        
        console.log('Preparing to initialize Skill Ecosystem...');
        
        let ecosystemInitAttempts = 0;
        const maxAttempts = 3;
        
        function initializeEcosystem() {
            // Check if we've tried too many times
            if (ecosystemInitAttempts >= maxAttempts) {
                console.warn('Skill Ecosystem: Maximum initialization attempts reached.');
                return;
            }
            
            ecosystemInitAttempts++;
            console.log(`Skill Ecosystem: Initialization attempt ${ecosystemInitAttempts}/${maxAttempts}`);
            
            // Check if coin elements are ready (they should be created by the coin effect script)
            const coinFaces = document.querySelectorAll('.coin-face-inner');
            if (coinFaces.length === 0 && ecosystemInitAttempts < maxAttempts) {
                // If coin faces don't exist yet, wait a bit longer and try again
                console.log('Skill Ecosystem: Coin faces not ready, retrying in 300ms...');
                setTimeout(initializeEcosystem, 300);
                return;
            }
            
            // Initialize the ecosystem
            initSkillEcosystem();
        }
        
        // Start initialization with a delay to ensure other scripts have run
        setTimeout(initializeEcosystem, 300);
    }
    
    // Update copyright year
    updateCurrentYear();
    
    // Handle header scroll effects
    handleHeaderOnScroll();
});