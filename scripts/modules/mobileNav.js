/**
 * mobileNav.js
 * Handles mobile navigation functionality
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initializes mobile navigation functionality
 */
export function initMobileNav() {
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    
    if (!mobileMenuToggle || !mobileNav) return;
    
    // Toggle mobile navigation menu
    mobileMenuToggle.addEventListener('click', function() {
        toggleMobileNav();
    });
    
    // Close mobile nav when clicking outside
    document.addEventListener('click', function(e) {
        if (mobileNav.classList.contains('active') && 
            !mobileNav.contains(e.target) && 
            e.target !== mobileMenuToggle) {
            closeMobileNav();
        }
    });
    
    // Close mobile nav on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 991 && mobileNav.classList.contains('active')) {
            closeMobileNav();
        }
    });
}

/**
 * Toggles mobile navigation visibility
 */
function toggleMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (mobileNav.classList.contains('active')) {
        closeMobileNav();
    } else {
        // Open mobile nav
        mobileNav.classList.add('active');
        mobileMenuToggle.setAttribute('aria-expanded', 'true');
        // Add no-scroll to body
        document.body.classList.add('no-scroll');
        
        // Set focus to first focusable element in mobile nav
        setTimeout(() => {
            const firstFocusable = mobileNav.querySelector('a, button');
            if (firstFocusable) {
                firstFocusable.focus();
            }
        }, 100);
    }
}

/**
 * Closes mobile navigation
 */
function closeMobileNav() {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    mobileNav.classList.remove('active');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('no-scroll');
    
    // Return focus to menu toggle button
    mobileMenuToggle.focus();
}