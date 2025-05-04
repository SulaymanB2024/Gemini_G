/**
 * helpers.js
 * Utility functions for the Roman-themed portfolio website
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Debounce function to limit the rate at which a function can fire
 * @param {Function} func - The function to debounce
 * @param {number} wait - The time to wait in milliseconds
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function to ensure a function doesn't execute more than once in a given time period
 * @param {Function} func - The function to throttle
 * @param {number} limit - The time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Format a date in Roman style (e.g. "IV Ides of March, MMXXIII")
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string
 */
export function formatRomanDate(date) {
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    // Convert year to Roman numerals
    const romanYear = convertToRoman(year);
    
    // Special Roman calendar formatting (simplified)
    let romanDay;
    if (day === 1) {
        romanDay = "Kalends of";
    } else if (day > 1 && day < 5) {
        romanDay = `${convertToRoman(5 - day)} Nones of`;
    } else if (day === 5) {
        romanDay = "Nones of";
    } else if (day > 5 && day < 13) {
        romanDay = `${convertToRoman(13 - day)} Ides of`;
    } else if (day === 13) {
        romanDay = "Ides of";
    } else {
        romanDay = `${convertToRoman(day)}`;
    }
    
    return `${romanDay} ${month}, ${romanYear}`;
}

/**
 * Convert a number to Roman numerals
 * @param {number} num - Number to convert
 * @returns {string} - Roman numeral string
 */
export function convertToRoman(num) {
    const romanNumerals = [
        { value: 1000, numeral: 'M' },
        { value: 900, numeral: 'CM' },
        { value: 500, numeral: 'D' },
        { value: 400, numeral: 'CD' },
        { value: 100, numeral: 'C' },
        { value: 90, numeral: 'XC' },
        { value: 50, numeral: 'L' },
        { value: 40, numeral: 'XL' },
        { value: 10, numeral: 'X' },
        { value: 9, numeral: 'IX' },
        { value: 5, numeral: 'V' },
        { value: 4, numeral: 'IV' },
        { value: 1, numeral: 'I' }
    ];
    
    let result = '';
    for (let i = 0; i < romanNumerals.length; i++) {
        while (num >= romanNumerals[i].value) {
            result += romanNumerals[i].numeral;
            num -= romanNumerals[i].value;
        }
    }
    return result;
}

/**
 * Get the current viewport dimensions
 * @returns {Object} width and height of viewport
 */
export function getViewportDimensions() {
    return {
        width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0)
    };
}

/**
 * Check if an element is in the viewport
 * @param {HTMLElement} element - Element to check
 * @param {number} offset - Offset from edges of viewport
 * @returns {boolean} - True if element is in viewport
 */
export function isElementInViewport(element, offset = 0) {
    const rect = element.getBoundingClientRect();
    
    return (
        rect.top >= 0 - offset &&
        rect.left >= 0 - offset &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + offset &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) + offset
    );
}

/**
 * Generate a random string for IDs
 * @param {number} length - Length of string to generate
 * @returns {string} - Random string
 */
export function generateRandomId(length = 8) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
}

/**
 * Add Roman numeral markers to timeline items
 * @param {NodeList} elements - Timeline item elements to mark
 */
export function addRomanNumerals(elements) {
    elements.forEach((element, index) => {
        const numeral = convertToRoman(index + 1);
        const marker = document.createElement('span');
        marker.classList.add('roman-numeral-marker');
        marker.textContent = numeral;
        element.appendChild(marker);
    });
}

/**
 * Create a decorative gold laurel wrapper around an element
 * @param {HTMLElement} element - Element to wrap with laurel
 */
export function addLaurelDecoration(element) {
    const wrapper = document.createElement('div');
    wrapper.classList.add('laurel-decoration');
    
    const leftLaurel = document.createElement('div');
    leftLaurel.classList.add('laurel-leaf', 'laurel-left');
    
    const rightLaurel = document.createElement('div');
    rightLaurel.classList.add('laurel-leaf', 'laurel-right');
    
    const parent = element.parentNode;
    parent.insertBefore(wrapper, element);
    wrapper.appendChild(leftLaurel);
    wrapper.appendChild(element);
    wrapper.appendChild(rightLaurel);
}

/**
 * Add Roman styled tooltips to elements
 * @param {NodeList} elements - Elements to add tooltips to
 */
export function initRomanTooltips(elements) {
    elements.forEach(element => {
        const tooltipText = element.getAttribute('data-tooltip');
        if (!tooltipText) return;
        
        element.addEventListener('mouseenter', (e) => {
            const tooltip = document.createElement('div');
            tooltip.classList.add('roman-tooltip');
            tooltip.textContent = tooltipText;
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.top = `${rect.top - tooltipRect.height - 10 + window.scrollY}px`;
            tooltip.style.left = `${rect.left + (rect.width / 2) - (tooltipRect.width / 2)}px`;
            tooltip.classList.add('visible');
            
            element.addEventListener('mouseleave', () => {
                tooltip.remove();
            }, { once: true });
        });
    });
}