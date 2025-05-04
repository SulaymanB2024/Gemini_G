/**
 * titleCardPreloader.js - Title Card Preloader Module
 * Creates an elegant Roman-styled intro animation sequence
 * Version: 1.0
 * Last Updated: May 4, 2025
 */

/**
 * Initializes the Gilded Title Card Preloader.
 * Handles quote cycling and timed fade-out.
 */
export function initTitleCardPreloader() {
    // Implementation moved to preloader.js to avoid duplication
    // This function is kept as a reference point but the actual implementation
    // is maintained in the main preloader.js module
    console.warn('initTitleCardPreloader was called from titleCardPreloader.js module - use preloader.js instead');
    
    // Import and use the implementation from preloader.js
    import('./preloader.js').then(module => {
        module.initTitleCardPreloader();
    }).catch(err => {
        console.error('Failed to load preloader module:', err);
    });
}

/**
 * Initializes the Enter button in the title card preloader
 */
export function initEnterButton() {
    // Implementation moved to preloader.js to avoid duplication
    console.warn('initEnterButton was called from titleCardPreloader.js module - use preloader.js instead');
    
    // Import and use the implementation from preloader.js
    import('./preloader.js').then(module => {
        // Call the equivalent function in preloader.js
        if (typeof module.setupEnterButtonListener === 'function') {
            module.setupEnterButtonListener();
        }
    }).catch(err => {
        console.error('Failed to load preloader module:', err);
    });
}

// Export the main function as default for simpler imports
export default initTitleCardPreloader;