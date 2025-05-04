/**
 * helpers.js
 * Utility functions used throughout the application
 * Version: 1.0
 * Last Updated: May 4, 2025
 */

/**
 * Executes a callback function when the DOM is fully loaded.
 * A replacement for jQuery's $(document).ready() function.
 * 
 * @param {Function} callback - Function to execute when DOM is ready
 */
export function onDocumentReady(callback) {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', callback);
    } else {
        // DOM already loaded, execute callback immediately
        setTimeout(callback, 1);
    }
}

/**
 * Throttles a function to limit how often it can be called.
 * Useful for scroll, resize, and other high-frequency events.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Creates a debounced function that delays invoking the provided function
 * until after the specified wait time has elapsed since the last time it was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            func.apply(context, args);
        }, wait);
    };
}

/**
 * Gets a random integer between min and max (inclusive)
 * 
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} - Random integer
 */
export function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Checks if an element is in the viewport
 * 
 * @param {HTMLElement} el - The element to check
 * @param {number} [offset=0] - Optional offset to consider element in viewport sooner
 * @returns {boolean} - Whether the element is in viewport
 */
export function isElementInViewport(el, offset = 0) {
    if (!el) return false;
    
    const rect = el.getBoundingClientRect();
    return (
        rect.top - offset <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.bottom + offset >= 0 &&
        rect.right >= 0
    );
}