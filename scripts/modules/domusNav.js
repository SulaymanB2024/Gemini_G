/**
 * domusNav.js - Domus Navigation (Interactive Map Overlay) Module
 * Handles opening/closing, SVG map interactions, legend clicks, and wisdom scroll.
 */

/**
 * Initializes the Domus navigation overlay functionality.
 * @returns {Object} Public methods for controlling the Domus navigation
 */
export function initDomusNavigation() {
    // Get DOM elements related to Domus Navigation
    const domusToggle = document.getElementById('domus-nav-toggle');         // Desktop toggle button
    const mobileDomusToggle = document.getElementById('mobile-domus-toggle'); // Mobile toggle button
    const domusNav = document.getElementById('domus-navigation');           // The main overlay container
    const domusClose = document.getElementById('domus-close');              // Close button within the overlay
    const domusOverlay = document.getElementById('domus-overlay');          // Background overlay element
    const domusContainer = domusNav ? domusNav.querySelector('.domus-container') : null; // Inner content container
    const legendButtons = domusNav ? domusNav.querySelectorAll('.domus-container .legend-item') : []; // Legend buttons
    const domusMapObject = document.getElementById('domus-map');              // SVG map <object> element
    const wisdomNextBtn = document.getElementById('wisdom-next');           // Wisdom scroll 'Next' button
    const wisdomTextEl = document.getElementById('wisdom-text');            // Wisdom scroll text element
    const body = document.body;

    // Exit initialization if essential Domus elements are missing
    if (!domusNav || !domusContainer || !domusClose || !domusOverlay) {
        console.warn('Domus navigation elements not found. Feature disabled.');
        return {
            open: () => console.warn('Domus navigation not initialized.'),
            close: () => console.warn('Domus navigation not initialized.')
        };
    }

    // --- Wisdom Scroll Logic ---
    const wisdoms = [ // Array of wisdom quotes
        "Fortune favors the bold.",
        "Veni, vidi, vici.", // I came, I saw, I conquered.
        "Carpe diem.", // Seize the day.
        "Alea iacta est.", // The die is cast.
        "Tempus fugit.", // Time flies.
        "Cogito, ergo sum.", // I think, therefore I am.
        "Dum spiro, spero.", // While I breathe, I hope.
        "Ad astra per aspera.", // To the stars through difficulties.
        "In vino veritas.", // In wine, there is truth.
        "Memento mori.", // Remember you must die.
        "Vita brevis, ars longa.", // Life is short, art is long.
        "Labor omnia vincit.", // Work conquers all.
        "Omnia vincit amor.", // Love conquers all.
        "Acta non verba.", // Deeds, not words.
        "Amor vincit omnia." // Love conquers all.
    ];
    let currentWisdomIndex = 0;

    // Function to update the wisdom quote displayed
    const updateWisdom = () => {
        if (wisdomTextEl) {
            currentWisdomIndex = (currentWisdomIndex + 1) % wisdoms.length;
            // Add a subtle fade effect (optional, requires CSS)
            wisdomTextEl.style.opacity = '0';
            setTimeout(() => {
                wisdomTextEl.textContent = `"${wisdoms[currentWisdomIndex]}"`;
                wisdomTextEl.style.opacity = '1';
            }, 150); // Match CSS transition duration
        }
    };

    // Add event listener to the 'Next' button for the wisdom scroll
    if (wisdomNextBtn) {
        wisdomNextBtn.addEventListener('click', updateWisdom);
    } else {
        console.warn('Wisdom scroll "Next" button not found.');
    }

    // --- Domus Overlay Open/Close Logic ---

    // Function to open the Domus navigation overlay
    const openDomusNav = () => {
        domusNav.style.display = 'flex'; // Use flex for centering (set in CSS)
        domusNav.setAttribute('aria-hidden', 'false');
        domusNav.classList.remove('visible'); // Remove visible class to reset animation
        body.style.overflow = 'hidden'; // Prevent background scrolling

        // Trigger CSS animation for container entry
        // Use a short timeout to ensure display:flex is applied before starting transition
        setTimeout(() => {
            domusNav.classList.add('visible'); // Add class to trigger transitions/animations
            // Update ARIA states on toggle buttons
            if (domusToggle) domusToggle.setAttribute('aria-expanded', 'true');
            if (mobileDomusToggle) mobileDomusToggle.setAttribute('aria-expanded', 'true');
            // Focus the close button for accessibility
            if (domusClose) domusClose.focus();
        }, 20); // Small delay for CSS rendering
    };

    // Function to close the Domus navigation overlay
    const closeDomusNav = (returnFocusElement = null) => {
        domusNav.classList.remove('visible'); // Trigger exit animation
        domusNav.setAttribute('aria-hidden', 'true');
        // Update ARIA states on toggle buttons
        if (domusToggle) domusToggle.setAttribute('aria-expanded', 'false');
        if (mobileDomusToggle) mobileDomusToggle.setAttribute('aria-expanded', 'false');

        // Wait for exit animation to complete before hiding and restoring scroll
        setTimeout(() => {
            domusNav.style.display = 'none';
            body.style.overflow = ''; // Restore background scrolling
            // Return focus to the element that opened the overlay, if provided
            if (returnFocusElement && typeof returnFocusElement.focus === 'function') {
                returnFocusElement.focus();
            }
        }, 500); // Match CSS transition duration
    };

    // Add event listeners to open/close buttons and overlay
    if (domusToggle) {
        domusToggle.addEventListener('click', () => openDomusNav());
    }
    if (mobileDomusToggle) {
        mobileDomusToggle.addEventListener('click', () => openDomusNav());
    }
    if (domusClose) {
        // Determine which button opened it to return focus correctly
        domusClose.addEventListener('click', () => {
            const opener = document.activeElement === mobileDomusToggle ? mobileDomusToggle : domusToggle;
            closeDomusNav(opener);
        });
    }
    if (domusOverlay) {
        domusOverlay.addEventListener('click', () => closeDomusNav(domusToggle)); // Assume desktop toggle opened it on overlay click
    }

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && domusNav.classList.contains('visible')) {
             // Find which toggle might have opened it to return focus
            const opener = document.querySelector('[aria-controls="domus-navigation"][aria-expanded="true"]');
            closeDomusNav(opener || domusToggle); // Default to desktop toggle if opener not found
        }
    });

    // --- Legend Button Navigation ---
    legendButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.dataset.section; // Get section ID from data-section attribute
            if (targetId) {
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    closeDomusNav(btn); // Close the overlay first, return focus to button
                    // Use setTimeout to ensure overlay is hidden before scrolling
                    setTimeout(() => {
                        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        targetElement.focus({ preventScroll: true }); // Focus section for screen readers
                    }, 550); // Slightly longer than close animation
                } else {
                    console.warn(`Target section #${targetId} not found for Domus legend button.`);
                }
            }
        });
    });

    // --- SVG Map Interaction ---
    if (domusMapObject) {
        domusMapObject.addEventListener('load', () => {
            try {
                const svgDoc = domusMapObject.contentDocument;
                if (!svgDoc) {
                    throw new Error('Could not access SVG document');
                }
                
                // Find all clickable regions in the SVG
                const regions = svgDoc.querySelectorAll('[data-section]');
                
                // Add interaction to each region
                regions.forEach(region => {
                    const targetId = region.dataset.section;
                    
                    // Add hover effects
                    region.addEventListener('mouseenter', () => {
                        region.style.opacity = '0.8';
                        region.style.cursor = 'pointer';
                    });
                    
                    region.addEventListener('mouseleave', () => {
                        region.style.opacity = '1';
                    });
                    
                    // Add click navigation
                    region.addEventListener('click', () => {
                        if (targetId) {
                            const targetElement = document.getElementById(targetId);
                            if (targetElement) {
                                closeDomusNav();
                                setTimeout(() => {
                                    targetElement.scrollIntoView({ behavior: 'smooth' });
                                }, 550);
                            }
                        }
                    });
                });
            } catch (error) {
                console.error('Error setting up SVG interactions:', error);
            }
        });
    }

    // Return public methods
    return {
        open: openDomusNav,
        close: (element) => closeDomusNav(element),
        updateWisdom: updateWisdom
    };
}

export default initDomusNavigation;