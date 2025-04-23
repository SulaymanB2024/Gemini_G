/**
 * roman-portfolio.js
 * Consolidated JavaScript file for the Roman-themed portfolio website
 * Version: 4.0 (Reflecting HTML v5 and visual enhancement plans)
 * Last Updated: April 21, 2025
 */

// =============================================
// 1. UTILITY FUNCTIONS
// =============================================

/**
 * Executes a function when the DOM is fully loaded and ready.
 * Ensures scripts run after the HTML structure is available.
 * @param {function} fn - The function to execute upon DOM readiness.
 */
function onDocumentReady(fn) {
    // Check if DOM is already loaded
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        // Call function immediately if already loaded
        setTimeout(fn, 1);
    } else {
        // Otherwise, wait for the DOMContentLoaded event
        document.addEventListener('DOMContentLoaded', fn);
    }
}

/**
 * Throttles a function to prevent it from being called too frequently.
 * Useful for performance optimization of event listeners like 'scroll' or 'resize'.
 * @param {function} func - The function to throttle.
 * @param {number} limit - The minimum time interval (in milliseconds) between calls.
 * @returns {function} The throttled version of the function.
 */
function throttle(func, limit) {
    let inThrottle; // Flag to track whether the function is currently throttled
    return function() {
        const args = arguments; // Capture arguments passed to the function
        const context = this;   // Capture the context ('this') of the function call
        // If not currently throttled, execute the function
        if (!inThrottle) {
            func.apply(context, args); // Execute the original function
            inThrottle = true;        // Set the throttle flag
            // Reset the throttle flag after the specified limit
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// =============================================
// 2. CORE FUNCTIONALITY & INITIALIZATION
// =============================================

/**
 * Handles the hiding of the preloader element once the page assets are loaded.
 * Uses a fade-out effect controlled by CSS transitions.
 */
function handlePreloader() {
    const loader = document.getElementById('preloader');
    if (!loader) {
        console.warn('Preloader element not found.');
        return;
    }

    // Wait for the window's 'load' event (ensures images and other resources are loaded)
    window.addEventListener('load', () => {
        loader.style.opacity = '0'; // Start fade-out animation defined in CSS
        // Remove the loader from the DOM after the transition completes
        // Adjust timeout duration to match the CSS transition duration for #preloader
        setTimeout(() => {
            loader.style.display = 'none'; // Hide completely before removing
            // Check if it still exists before trying to remove (might have been removed by other means)
            if (loader.parentNode) {
                loader.remove();
            }
        }, 600); // Assumes a 0.5s or 0.6s fade-out transition in CSS
    });
}

/**
 * Initializes the Gilded Title Card Preloader.
 * Handles quote cycling and timed fade-out.
 */
function initTitleCardPreloader() {
    const preloader = document.getElementById('preloader-title-card');
    const quoteItems = preloader?.querySelectorAll('.quote-item');
    const nameElement = preloader?.querySelector('.preloader-name');
    const enterBtn = preloader?.querySelector('#enter-website-btn');

    if (!preloader || !quoteItems || quoteItems.length === 0 || !nameElement) {
        console.warn('Title card preloader elements not found. Skipping initialization.');
        if(preloader) preloader.style.display = 'none';
        return;
    }

    let currentQuoteIndex = -1;
    let quoteIntervalId = null;
    
    // Increase timing for a more deliberate pace
    const quoteDisplayTime = 6000;     // Time each quote is visible (in ms)
    const quoteFadeTime = 1200;        // Must match CSS transition duration for opacity (in ms)
    const preloaderDisplayTime = 18000; // Total time preloader stays before auto-fading (in ms)
    const nameRevealDelay = 1000;      // Delay before name fades in (in ms)
    
    // Add a subtle animation to the enter button
    if (enterBtn) {
        setTimeout(() => {
            enterBtn.classList.add('pulse-animation');
        }, 2000); // Start pulsing after 2 seconds
    }

    // Fade in name after preloader appears
    setTimeout(() => {
        if (nameElement) {
            nameElement.style.opacity = '1';
            nameElement.style.transform = 'translateY(0)';
        }
    }, nameRevealDelay);

    function showNextQuote() {
        // Fade out the current quote
        const currentQuote = quoteItems[currentQuoteIndex];
        if (currentQuote) {
            currentQuote.classList.add('fading-out');
            currentQuote.classList.remove('visible');
        }

        // Wait for fade out before showing next
        setTimeout(() => {
            if (currentQuote) {
                currentQuote.classList.remove('fading-out');
            }

            // Calculate next index
            currentQuoteIndex = (currentQuoteIndex + 1) % quoteItems.length;

            // Fade in the new quote with a slight slide-up effect
            const nextQuote = quoteItems[currentQuoteIndex];
            if (nextQuote) {
                nextQuote.style.transform = 'translateY(10px)';
                nextQuote.classList.add('visible');
                
                // Slight delay for slide-up effect after fade-in starts
                setTimeout(() => {
                    nextQuote.style.transform = 'translateY(0)';
                }, 100);
            }
        }, quoteFadeTime);
    }

    // Start the quote cycling
    showNextQuote(); // Show the first quote immediately
    quoteIntervalId = setInterval(showNextQuote, quoteDisplayTime);

    // Enter button click handler
    if (enterBtn) {
        enterBtn.addEventListener('click', () => {
            console.log("Enter button clicked - hiding preloader");
            clearInterval(quoteIntervalId);
            
            // Add a special exit effect
            preloader.classList.add('exit-effect');
            
            setTimeout(() => {
                preloader.classList.add('hidden');
                
                // Remove the preloader from DOM after fade-out completes
                setTimeout(() => {
                    if (preloader.parentNode) {
                        preloader.remove();
                    }
                }, 800);
            }, 300);
        });
    }

    // Auto-hide preloader after display time
    const hideTimerId = setTimeout(() => {
        console.log("Auto-hiding title card preloader...");
        if (preloader) {
            // Fade out name first
            if (nameElement) {
                nameElement.style.opacity = '0';
                nameElement.style.transform = 'translateY(-10px)';
            }
            
            setTimeout(() => {
                clearInterval(quoteIntervalId);
                preloader.classList.add('hidden');

                setTimeout(() => {
                    if (preloader.parentNode) {
                        preloader.remove();
                    }
                }, 800);
            }, 500); // Short delay after name starts fading
        }
    }, preloaderDisplayTime);

    // Optional: Add keyboard shortcut to skip preloader (Escape key)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && preloader && preloader.parentNode) {
            clearTimeout(hideTimerId);
            clearInterval(quoteIntervalId);
            preloader.classList.add('hidden');
            
            setTimeout(() => {
                if (preloader.parentNode) {
                    preloader.remove();
                }
            }, 800);
        }
    });
}

/**
 * Initializes the Enter button in the title card preloader
 */
function initEnterButton() {
    const preloader = document.getElementById('preloader-title-card');
    const enterBtn = preloader?.querySelector('#enter-website-btn');
    
    if (!preloader || !enterBtn) {
        console.warn('Enter button or preloader not found');
        return;
    }
    
    enterBtn.addEventListener('click', () => {
        console.log("Enter button clicked - hiding preloader");
        preloader.classList.add('hidden');
        
        // Remove the preloader from DOM after fade-out completes
        setTimeout(() => {
            if (preloader.parentNode) {
                preloader.remove();
            }
        }, 800); // 800ms matches the CSS opacity transition
    });
    
    // Add keyboard accessibility for the button
    enterBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            enterBtn.click();
        }
    });
}
/**
 * Initializes the Typed.js library for the animated text effect in the hero section.
 * Requires Typed.js library to be included in the HTML.
 */
function initTypedText() {
    const typedElement = document.getElementById('typed');
    const stringsElement = document.getElementById('typed-strings');
    let typedInstance = null;

    // Check if the target element, strings element and Typed library constructor exist
    if (typedElement && stringsElement && typeof Typed === 'function') {
        try {
            typedInstance = new Typed(typedElement, {
                stringsElement: '#typed-strings', // Points to the hidden div containing strings
                typeSpeed: 50,       // Speed of typing (milliseconds)
                backSpeed: 30,       // Speed of deleting (milliseconds)
                backDelay: 2000,     // Pause before deleting (milliseconds)
                startDelay: 500,     // Pause before starting animation (milliseconds)
                loop: true,          // Repeat the animation indefinitely
                showCursor: true,    // Display the blinking cursor
                cursorChar: '|',     // Character used for the cursor
                smartBackspace: true, // Only backspace what doesn't match the next string
                autoInsertCss: true, // Ensures Typed.js styles are injected
                attr: null,          // Type in pre-existing text
                contentType: 'html'  // Type HTML content if needed
            });
            
            // Create cleanup handler for SPA environments
            window.addEventListener('beforeunload', () => {
                if (typedInstance) typedInstance.destroy();
            });
        } catch (error) {
            console.error("Error initializing Typed.js:", error);
            // Fallback: display the first string statically if Typed.js fails
            if (stringsElement.children.length > 0) {
                typedElement.textContent = stringsElement.children[0].textContent;
            }
        }
    } else {
        // Provide more specific warnings
        if (!typedElement) console.warn('Typed.js target element #typed not found.');
        if (!stringsElement) console.warn('Typed.js strings element #typed-strings not found.');
        if (typeof Typed !== 'function') console.warn('Typed.js library not found or not a constructor. Please ensure it is included.');
        
        // Static fallback if elements exist but Typed doesn't
        if (typedElement && stringsElement && stringsElement.children.length > 0) {
             typedElement.textContent = stringsElement.children[0].textContent;
        }
    }
    
    return typedInstance; // Return instance for potential external control
}

/**
 * Initializes and manages the scroll progress bar at the top of the page.
 * Updates the bar's width based on the user's scroll position.
 */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress');
    if (!progressBar) {
        console.warn('Scroll progress bar element not found.');
        return; // Exit if progress bar element doesn't exist
    }

    // Function to update the progress bar width
    const updateProgressBar = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        // Calculate the total scrollable height
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        // Calculate scroll percentage (handle edge case where scrollHeight is 0)
        const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
        // Apply the width style to the progress bar, ensuring it doesn't exceed 100%
        progressBar.style.width = `${Math.min(scrollPercent, 100)}%`;
    };

    // Use requestAnimationFrame for smoother performance
    let ticking = false;
    const requestTick = () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgressBar();
                ticking = false;
            });
            ticking = true;
        }
    };

    // Attach the optimized update function to scroll event
    window.addEventListener('scroll', requestTick);
    
    // Update on resize as well (content height might change)
    window.addEventListener('resize', throttle(updateProgressBar, 100));

    // Initial update in case the page loads scrolled down
    updateProgressBar();
}

/**
 * Updates the copyright year dynamically in the footer.
 * @param {string} [prefix='©'] - Optional prefix before the year
 * @param {string} [suffix=''] - Optional text after the year
 */
function updateCurrentYear(prefix = '©', suffix = '') {
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        const year = new Date().getFullYear();
        yearElement.textContent = `${prefix} ${year}${suffix ? ' ' + suffix : ''}`;
    } else {
        console.warn('Element with ID "current-year" not found in footer.');
    }
}

/**
 * Initializes the mobile navigation menu toggle and behavior.
 * Handles opening/closing the menu and accessibility attributes.
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('mobile-menu-toggle'); // Hamburger button
    const mobileNav = document.getElementById('mobile-nav');         // The navigation drawer
    const domusToggleMobile = document.getElementById('mobile-domus-toggle'); // Domus toggle inside mobile nav
    const body = document.body;

    if (!menuToggle || !mobileNav) {
        console.warn('Mobile menu toggle or navigation container not found.');
        return;
    }

    // Function to close the mobile menu
    const closeMobileMenu = () => {
        mobileNav.classList.remove('active'); // Trigger CSS transition/animation for closing
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
    };

    // Toggle mobile menu visibility on hamburger button click
    menuToggle.addEventListener('click', function() {
        const isExpanded = mobileNav.classList.toggle('active');
        // Update ARIA attributes for accessibility
        this.setAttribute('aria-expanded', isExpanded);
        mobileNav.setAttribute('aria-hidden', !isExpanded);
    });

    // Close mobile menu when clicking on any navigation link inside it
    const mobileNavLinks = mobileNav.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
        // Ensure it's a link pointing to a section on the same page
        if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
            link.addEventListener('click', closeMobileMenu);
        }
    });

    // Close mobile menu when clicking the Domus toggle inside it
    if (domusToggleMobile) {
        domusToggleMobile.addEventListener('click', closeMobileMenu);
        // Note: The actual opening of the Domus overlay is handled separately
        // in initDomusNavigation. This just closes the mobile nav first.
    }

    // Close mobile menu if user clicks outside of it (optional)
    // document.addEventListener('click', (event) => {
    //     if (mobileNav.classList.contains('active') && !mobileNav.contains(event.target) && !menuToggle.contains(event.target)) {
    //         closeMobileMenu();
    //     }
    // });
}

// =============================================
// 3. SCROLL-TRIGGERED ANIMATIONS
// =============================================

/**
 * Initializes Intersection Observer to add the 'revealed' class to elements
 * (sections, specific components) as they enter the viewport.
 * This class triggers CSS animations (fade-in, slide-up, 3D transforms).
 */
function initScrollAnimations() {
    // Select all elements intended to be animated on scroll
    const scrollTriggerElements = document.querySelectorAll('.scroll-trigger-section, .fade-in-sequence');

    // Exit if no elements to observe
    if (scrollTriggerElements.length === 0) {
        console.warn('No elements found for scroll-triggered animations.');
        return;
    }

    // Configuration for the Intersection Observer
    const options = {
        root: null,       // Observe intersections relative to the viewport
        rootMargin: '0px',  // No margin around the viewport
        threshold: 0.15   // Trigger when 15% of the element becomes visible
    };

    // The callback function executed when an observed element's intersection status changes
    const intersectionCallback = (entries, observer) => {
        entries.forEach(entry => {
            // If the element is now intersecting (visible enough)
            if (entry.isIntersecting) {
                // Add the 'revealed' class to trigger CSS animations
                entry.target.classList.add('revealed');
                // Optional: Add a class for more complex staggered animations within the element
                if (entry.target.classList.contains('fade-in-sequence')) {
                    entry.target.classList.add('sequence-active');
                    // CSS can now target children of '.sequence-active.revealed' for delays
                }
                // Once revealed, we don't need to observe it anymore
                observer.unobserve(entry.target);
            }
        });
    };

    // Create the Intersection Observer instance
    const observer = new IntersectionObserver(intersectionCallback, options);

    // Start observing each target element
    scrollTriggerElements.forEach(el => observer.observe(el));

    // Note: The actual animation (fade, slide, 3D rotate/scale) should be defined
    // in CSS targeting the '.revealed' class on these elements.
}


// =============================================
// 4. SKILL TAG COIN EFFECT (3D Flip)
// =============================================

/**
 * Initializes the 3D coin flip effect for skill tags.
 * Dynamically creates the front and back faces for each tag
 * and adds hover/focus event listeners to toggle the flip animation (controlled by CSS).
 */
function initCoinEffect() {
    const skillTags = document.querySelectorAll('.skill-tag');

    // Exit if no skill tags are found
    if (skillTags.length === 0) {
        console.warn('No elements with class "skill-tag" found for coin effect.');
        return;
    }

    /**
     * Sets up the necessary HTML structure (front/back faces) within a skill tag
     * to enable the CSS-driven 3D flip animation.
     * @param {HTMLElement} coinElement - The .skill-tag element to set up.
     */
    function setupCoinElementStructure(coinElement) {
        // Check if the structure already exists to prevent duplication
        if (coinElement.querySelector('.coin-face-inner')) {
            return;
        }

        // Get the original content (including any icons) and proficiency level
        const originalHTML = coinElement.innerHTML; // Keep original HTML including icons
        const proficiencyLevel = coinElement.getAttribute('data-level') || 'Info'; // Default if level is missing

        // Create the inner container needed for the 3D transform
        const inner = document.createElement('div');
        inner.className = 'coin-face-inner';

        // Create the front face (displays the skill name and icon)
        const frontFace = document.createElement('div');
        frontFace.className = 'coin-face coin-front';
        frontFace.innerHTML = originalHTML; // Use original HTML

        // Create the back face (displays the proficiency level)
        const backFace = document.createElement('div');
        backFace.className = 'coin-face coin-back';
        backFace.innerHTML = proficiencyLevel; // Use data-level attribute text

        // Append faces to the inner container
        inner.appendChild(frontFace);
        inner.appendChild(backFace);

        // Clear the original content and append the new structure
        coinElement.innerHTML = '';
        coinElement.appendChild(inner);

        // Add hover listeners to toggle the 'flipped' class, which controls the CSS animation
        coinElement.addEventListener('mouseenter', () => {
            coinElement.classList.add('flipped');
        });
        coinElement.addEventListener('mouseleave', () => {
            coinElement.classList.remove('flipped');
        });

        // Add focus listeners for keyboard accessibility
        coinElement.setAttribute('tabindex', '0'); // Make it focusable
        coinElement.addEventListener('focus', () => {
            coinElement.classList.add('flipped');
        });
        coinElement.addEventListener('blur', () => {
            coinElement.classList.remove('flipped');
        });

        // Add keydown listener for Enter/Space to trigger filter (if applicable)
        coinElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault(); // Prevent default space scroll
                coinElement.click(); // Simulate a click to trigger filter logic
            }
        });
    }

    // Apply the setup to each skill tag found
    skillTags.forEach(setupCoinElementStructure);

    // Note: The parent container (e.g., '.skills-grid' or '.skill-category') should have 'perspective'
    // set in CSS for the 3D effect to be visible. The actual rotation and
    // backface-visibility are handled in CSS rules targeting '.skill-tag',
    // '.coin-face-inner', '.coin-face', '.coin-front', '.coin-back', and '.flipped'.
}

// =============================================
// ROMAN SEAL PRELOADER
// =============================================

document.addEventListener('DOMContentLoaded', () => {
  const pre = document.getElementById('roman-seal-preloader');
  const seal = pre?.querySelector('.seal-container');
  if (!pre || !seal) return;

  // on window.load auto‑hide after 3s
  window.addEventListener('load', () => {
    const autoHide = setTimeout(() => pre.classList.add('hiding'), 3000);

    // click to crack + fade immediately
    seal.addEventListener('click', () => {
      clearTimeout(autoHide);
      pre.classList.add('cracking');
      setTimeout(() => pre.classList.add('hiding'), 400);
    });
  });

  // once fade ends, remove from DOM
  pre.addEventListener('transitionend', () => pre.remove(), { once: true });
});

// =============================================
// 5. DOMUS NAVIGATION (Interactive Map Overlay)
// =============================================

/**
 * Initializes the Domus navigation overlay functionality.
 * Handles opening/closing, SVG map interactions, legend clicks, and wisdom scroll.
 */
function initDomusNavigation() {
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
        return;
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
        // Add more quotes as needed
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


        // Trigger CSS animation for container entry (e.g., fade-in, scale-up, 3D rotate)
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
        // Duration should match the CSS transition/animation duration (e.g., 0.5s)
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
                    console.error('Could not access SVG content document. Check permissions or loading.');
                    return;
                }
                const svgRoot = svgDoc.documentElement;

                // Ensure SVG is fully rendered before selecting elements
                if (!svgRoot) {
                     console.error('SVG root element not found.');
                     return;
                }

                const interactiveRooms = svgRoot.querySelectorAll('[data-room][data-section]'); // Select elements with both attributes

                if (interactiveRooms.length === 0) {
                    console.warn('No interactive rooms found in SVG map (missing data-room or data-section attributes).');
                    return;
                }

                // Get or create the tooltip element
                let tooltip = document.getElementById('domus-tooltip');
                if (!tooltip) {
                    tooltip = document.createElement('div');
                    tooltip.id = 'domus-tooltip';
                    tooltip.className = 'domus-tooltip'; // Style this class in CSS
                    tooltip.setAttribute('role', 'tooltip');
                    tooltip.style.position = 'absolute'; // Positioned by JS
                    tooltip.style.display = 'none';     // Initially hidden
                    tooltip.style.zIndex = '1100';      // Ensure it's above most elements
                    document.body.appendChild(tooltip); // Append to body to avoid clipping issues
                }

                // Function to update tooltip position based on mouse event
                const updateTooltipPosition = throttle((e) => {
                    if (tooltip.style.display !== 'block') return; // Only update if visible
                    // Position tooltip slightly offset from the cursor
                    const xOffset = 15;
                    const yOffset = 10;
                    // Constrain tooltip within viewport boundaries
                    const tooltipRect = tooltip.getBoundingClientRect();
                    let left = e.clientX + xOffset;
                    let top = e.clientY + yOffset;

                    if (left + tooltipRect.width > window.innerWidth) {
                        left = e.clientX - tooltipRect.width - xOffset;
                    }
                    if (top + tooltipRect.height > window.innerHeight) {
                        top = e.clientY - tooltipRect.height - yOffset;
                    }
                    tooltip.style.left = `${left}px`;
                    tooltip.style.top = `${top}px`;
                }, 50); // Throttle tooltip updates

                interactiveRooms.forEach(room => {
                    const roomName = room.getAttribute('data-room');
                    const sectionId = room.getAttribute('data-section');

                    // Add hover effects (can be enhanced in CSS using :hover)
                    room.addEventListener('mouseenter', (e) => {
                        room.classList.add('hovered'); // Add class for CSS styling (e.g., fill change)
                        tooltip.innerHTML = `<strong>${roomName}</strong><br>Go to ${sectionId.charAt(0).toUpperCase() + sectionId.slice(1)}`;
                        tooltip.style.display = 'block';
                        updateTooltipPosition(e); // Initial position
                        document.addEventListener('mousemove', updateTooltipPosition); // Track mouse for updates
                    });

                    room.addEventListener('mouseleave', () => {
                        room.classList.remove('hovered');
                        tooltip.style.display = 'none';
                        document.removeEventListener('mousemove', updateTooltipPosition); // Stop tracking
                    });

                    // Handle click navigation
                    room.addEventListener('click', () => {
                        const targetElement = document.getElementById(sectionId);
                        if (targetElement) {
                            closeDomusNav(domusMapObject); // Close overlay, return focus to map object
                            setTimeout(() => {
                                targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                targetElement.focus({ preventScroll: true });
                            }, 550); // Wait for close animation
                        } else {
                            console.warn(`Target section #${sectionId} not found for SVG room click.`);
                        }
                    });

                    // Add focus/blur for keyboard accessibility (optional)
                    room.setAttribute('tabindex', '-1'); // Make focusable only via script/link? Or '0' if direct focus needed.
                    room.addEventListener('focus', () => room.classList.add('focused')); // Add class for focus style
                    room.addEventListener('blur', () => room.classList.remove('focused'));
                });

            } catch (error) {
                console.error("Error accessing or processing SVG map:", error);
            }
        });
        // Handle potential errors loading the SVG object itself
        domusMapObject.addEventListener('error', (e) => {
            console.error("Error loading SVG map object:", e);
        });
    } else {
        console.warn('Domus map <object> element not found.');
    }
}


// =============================================
// 6. PROJECT MODAL
// =============================================

/**
 * Initializes the project modal functionality.
 * Handles opening, closing, and populating the modal with project data.
 */
function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const projectBtns = document.querySelectorAll('.view-project-btn'); // Buttons on project cards
    const modalContent = modal ? modal.querySelector('.modal-content') : null; // Inner content area

    // Exit if essential modal elements are missing
    if (!modal || !modalCloseBtn || !modalContent) {
        console.warn('Project modal elements not found. Feature disabled.');
        return;
    }

    // --- Project Data ---
    // Store project details here. In a real application, this might come from an API.
    // Ensure project IDs match the 'data-project-id' attributes on the buttons in HTML.
    // TODO: Update links and add data for 'blockchain', 'energy', 'leadership' if they open modals.
    const projectData = {
        'imc': { // Matches data-project-id="imc"
            title: 'Systematic Trading Framework',
            subtitle: 'Quantitative Strategy Development',
            date: 'Spring 2025',
            objective: 'Build an algorithmic trading system for competitive market simulation that optimizes for risk-adjusted returns while maintaining market-making obligations.',
            approach: 'Developed a statistical model to estimate fair value based on order book imbalance and recent trade history. Implemented dynamic hedging and inventory management logic with adaptive risk limits.',
            tech: 'Python, NumPy, Pandas, Scikit-learn, Statistical Analysis',
            results: 'Achieved top 15% placement globally with Sharpe ratio of 2.3. Successfully managed risk through high volatility scenarios while maintaining consistent profitability.',
            codeLang: 'python', // Specify language for Prism.js
            code: `import numpy as np
import pandas as pd

class MarketMaker:
    def __init__(self, risk_limit=100, edge_factor=0.2):
        self.position = 0
        self.cash = 10000
        self.risk_limit = risk_limit
        self.edge_factor = edge_factor
        self.trades = []
        self.market_data = []
        self.fair_value = None
        self.last_trade_time = None

    def update_fair_value(self, order_book):
        # Simplified fair value calculation
        if not order_book or not order_book.get('bids') or not order_book.get('asks'):
             return None # Handle empty or invalid order book
        best_bid = order_book['bids'][0]['price']
        best_ask = order_book['asks'][0]['price']
        mid_price = (best_bid + best_ask) / 2
        # Placeholder for imbalance calculation
        imbalance = 0 # Replace with actual calculation if data available
        self.fair_value = mid_price * (1 + imbalance * self.edge_factor)
        return self.fair_value
    def place_order(self, order_type, size):
        if abs(self.position) + size > self.risk_limit:
            print("Order exceeds risk limit.")
            return None
        if order_type == 'buy':
            self.position += size
            self.cash -= size * self.fair_value
        elif order_type == 'sell':
            self.position -= size
            self.cash += size * self.fair_value
        else:
            print("Invalid order type.")
            return None
        self.trades.append({'type': order_type, 'size': size, 'price': self.fair_value})
        self.last_trade_time = pd.Timestamp.now()
        return {'type': order_type, 'size': size, 'price': self.fair_value}
    def calculate_quotes(self, volatility):
        # Simplified quote calculation
        if self.fair_value is None: return None # Need fair value first
        base_spread = volatility * 2 # Example spread calculation
        inventory_skew = self.position / self.risk_limit
        spread = base_spread * (1 + abs(inventory_skew)) # Widen spread based on inventory risk
        bid_edge = spread / 2 * (1 + inventory_skew) # Skew bid down if long
        ask_edge = spread / 2 * (1 - inventory_skew) # Skew ask up if short
        bid_price = self.fair_value - bid_edge
        ask_price = self.fair_value + ask_edge
        # Simplified size calculation
        bid_size = max(1, int(self.risk_limit * 0.1 * (1 - inventory_skew)))
        ask_size = max(1, int(self.risk_limit * 0.1 * (1 + inventory_skew)))
        return {'bid': bid_price, 'ask': ask_price, 'bid_size': bid_size, 'ask_size': ask_size}`,
            links: [ // Array of link objects
                { text: 'GitHub Repository', url: '#', icon: 'fab fa-github' }, // TODO: Update URL
                { text: 'Research Paper', url: '#', icon: 'fas fa-file-alt' }  // TODO: Update URL
            ]
        },
        'messari': { // Matches data-project-id="messari"
            title: 'Stablecoin Analytics Dashboard',
            subtitle: 'Blockchain Data Analysis (Messari Research)',
            date: 'Spring 2025',
            objective: 'Create a real-time monitoring system for major stablecoins that tracks key metrics such as market cap, collateralization ratio, and on-chain activity.',
            approach: 'Built data pipelines to collect on-chain data from multiple blockchains (Ethereum, Solana, Arbitrum). Implemented statistical models to detect anomalies and potential de-pegging events.',
            tech: 'Python, Web3.py, SQL, Dash/Plotly, Ethereum, Solana, Arbitrum',
            results: 'Dashboard provided critical real-time insights during market turbulence, detecting early warning signs of stablecoin stress. Research findings were published in Messari Pro Research reports.',
            codeLang: 'python',
            code: `import pandas as pd
import plotly.express as px
from dash import Dash, dcc, html # Assuming Dash for dashboard
# Placeholder for Web3 connection setup
# from web3 import Web3

class StablecoinMonitor:
    def __init__(self, config):
        self.config = config
        # self.web3_connections = {chain: Web3(Web3.HTTPProvider(endpoint))
        #                          for chain, endpoint in config['rpc_endpoints'].items()}
        print("Monitor Initialized (Web3 connection placeholder)")

    def fetch_onchain_metrics(self, address, chain):
        print(f"Fetching metrics for {address} on {chain} (Placeholder)")
        # Placeholder data
        return {'total_supply': 1000000, 'holders': 5000, 'transfers_24h': 1000}

    def calculate_peg_stability(self, price_data_df):
        print("Calculating peg stability (Placeholder)")
        if price_data_df.empty: return {}
        # Placeholder calculations
        volatility = price_data_df['price'].std()
        max_deviation = price_data_df['price'].max() - 1.0
        return {'volatility': volatility, 'max_deviation': max_deviation}`,
            links: [
                { text: 'Interactive Dashboard', url: '#', icon: 'fas fa-chart-line' }, // TODO: Update URL
                { text: 'Research Report (Messari)', url: '#', icon: 'fas fa-file-pdf' } // TODO: Update URL
            ]
        },
        'point72': { // Matches data-project-id="point72"
            title: 'Restaurant Industry Analysis',
            subtitle: 'Investment Pitch Case Study',
            date: 'Fall 2024',
            objective: 'Develop a comprehensive investment thesis on a publicly-traded restaurant chain, including detailed financial modeling and industry analysis.',
            approach: 'Created a 5-year DCF model with detailed revenue projections by location type and sensitivity analysis. Performed competitive analysis of margin structures across the industry and examined impact of inflation on cost structure.',
            tech: 'Excel, Financial Modeling, DCF Analysis, Comparable Company Analysis, Industry Research',
            results: 'Identified 27% downside potential in target company due to margin compression and slowing unit growth. Presentation received excellent feedback from investment professionals.',
            codeLang: 'plaintext', // Use 'plaintext' or similar for non-code logic
            code: `// Financial Model Structure (Excel Logic Example)

// Revenue Forecast = Sum(Locations[Type] * Avg_Revenue_Per_Location[Type])
Revenue_Year[t] = Σ (Locations[t][i] * Avg_Revenue[t][i])
// Location Types: Urban, Suburban, Rural
// Growth Rate = Base Growth Rate + Inflation Impact
// Base Growth Rate = 5% (assumed)
Base_Growth_Rate = 0.05
// Inflation Impact = Inflation Rate * Sensitivity Factor
Inflation_Impact = Inflation_Rate * Sensitivity_Factor
// Sensitivity Factor = 0.5 (assumed)
// Inflation Rate = 3% (assumed)
Inflation_Rate = 0.03

// Same Store Sales Growth = Inflation + Traffic Growth + Menu Price Premium
SSS_Growth[t] = Inflation[t] + Traffic_Growth[t] + Price_Premium[t]
// Cost of Goods Sold (COGS) = Revenue * COGS Margin
COGS[t] = Revenue[t] * COGS_Margin
// Labor Cost = Revenue * Labor Cost Margin
Labor_Cost[t] = Revenue[t] * Labor_Cost_Margin
// Operating Expenses = Revenue * OpEx Margin
OpEx[t] = Revenue[t] * OpEx_Margin
// Depreciation & Amortization (D&A) = Revenue * D&A Margin
D&A[t] = Revenue[t] * D&A_Margin
// Capital Expenditures (Capex) = Revenue * Capex Margin
Capex[t] = Revenue[t] * Capex_Margin
// Net Working Capital (NWC) = Revenue * NWC Margin
ΔNWC[t] = Revenue[t] * NWC_Margin
// Net Operating Profit After Tax (NOPAT) = (Revenue - COGS - OpEx - D&A) * (1 - Tax Rate)
NOPAT[t] = (Revenue[t] - COGS[t] - OpEx[t] - D&A[t]) * (1 - Tax_Rate)

// Margin Projections (considering cost pressures)
EBITDA_Margin[t] = Base_Margin - ΔLabor_Cost - ΔFood_Cost

// Free Cash Flow (FCF) Calculation
FCF[t] = NOPAT[t] + D&A[t] - Capex[t] - ΔNWC[t]

// Terminal Value (Gordon Growth Model)
TV = FCF[t+1] / (WACC - Terminal_Growth_Rate)

// Enterprise Value = PV(Forecasted FCFs) + PV(Terminal Value)
EV = Σ [FCF[n] / (1 + WACC)^n] + [TV / (1 + WACC)^t]

// Equity Value = EV - Net Debt
// Price_per_Share = Equity_Value / Shares_Outstanding`,
            links: [
                { text: 'Financial Model (Excel)', url: '#', icon: 'fas fa-file-excel' }, // TODO: Update URL
                { text: 'Presentation Deck', url: '#', icon: 'fas fa-file-powerpoint' } // TODO: Update URL
            ]
        },
        // TODO: Add data for 'blockchain', 'energy', 'leadership' if they should open modals
    };

    // Function to populate and open the modal
    const openModal = (projectId) => {
        const data = projectData[projectId];
        const openerButton = document.querySelector(`.view-project-btn[data-project-id="${projectId}"]`); // Find button that opened modal

        if (!data) {
            console.error(`Project data not found for ID: ${projectId}`);
            return; // Exit if no data for this project ID
        }

        // Populate modal content elements safely
        const setTitle = (id, text) => { const el = modalContent.querySelector(`#${id}`); if (el) el.textContent = text || ''; };
        const setContent = (id, text) => { const el = modalContent.querySelector(`#${id}`); if (el) el.textContent = text || 'N/A'; };

        setTitle('modal-project-title', data.title);
        setTitle('modal-project-subtitle', data.subtitle);
        setContent('modal-project-date', data.date);
        setContent('modal-project-objective', data.objective);
        setContent('modal-project-approach', data.approach);
        setContent('modal-project-tech', data.tech);
        setContent('modal-project-results', data.results);

        // Handle code snippet
        const codeElement = modalContent.querySelector('#modal-project-code');
        const codeContainer = modalContent.querySelector('#modal-code-snippet-container');
        if (codeElement && codeContainer) {
            if (data.code && data.codeLang && window.Prism && Prism.languages[data.codeLang]) {
                codeElement.textContent = data.code;
                // Update the class for Prism.js highlighting
                codeElement.className = `language-${data.codeLang}`;
                // Ensure Prism highlights the element
                Prism.highlightElement(codeElement);
                codeContainer.style.display = ''; // Show container
            } else if (data.code) {
                codeElement.textContent = data.code;
                codeElement.className = ''; // No language class for non-supported languages
                codeContainer.style.display = ''; // Show container
                console.warn(`Language '${data.codeLang}' not supported by Prism.js for project ${projectId}.`);
            } else if (data.codeLang) {
                codeElement.textContent = `Code not available for this project.`;
                codeElement.className = ''; // No language class
                codeContainer.style.display = ''; // Show container
                console.warn(`Code snippet not available for project ${projectId}.`);
            } else {
                // Hide code section if no code, Prism not available, or language not supported
                codeContainer.style.display = 'none';
                if (data.code && (!window.Prism || !Prism.languages[data.codeLang])) {
                    console.warn(`Prism.js or language '${data.codeLang}' not available for project ${projectId}.`);
                }
            }
        }

        // Handle project links
        const linksContainer = modalContent.querySelector('#modal-project-links');
        const linksWrapper = modalContent.querySelector('#modal-project-links-container'); // Get the wrapper div
        if (linksContainer && linksWrapper) {
            linksContainer.innerHTML = ''; // Clear previous links
            if (data.links && data.links.length > 0) {
                data.links.forEach(link => {
                    const linkElement = document.createElement('a');
                    linkElement.className = 'project-link';
                    linkElement.href = link.url || '#'; // Default to '#' if URL missing
                    if (link.url && link.url !== '#') { // Only open valid links in new tab
                         linkElement.target = '_blank';
                         linkElement.rel = 'noopener noreferrer';
                    }
                    linkElement.innerHTML = `<i class="${link.icon || 'fas fa-link'}" aria-hidden="true"></i> ${link.text || 'Link'}`;
                    linksContainer.appendChild(linkElement);
                });
                linksWrapper.style.display = ''; // Show links container
            } else {
                linksWrapper.style.display = 'none'; // Hide if no links
            }
        }

        // Show the modal
        modal.style.display = 'flex'; // Use flex for centering
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
        setTimeout(() => {
            modal.classList.add('visible'); // Trigger fade-in/animation defined in CSS
        }, 20); // Small delay for CSS rendering

        // Focus the close button for accessibility
        if (modalCloseBtn) modalCloseBtn.focus();
    };

    // Function to close the modal
    const closeModal = (returnFocusElement = null) => {
        modal.classList.remove('visible'); // Trigger fade-out/animation
        modal.setAttribute('aria-hidden', 'true');
        // Wait for animation to finish before hiding and restoring scroll
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore background scroll
            // Return focus to the element that opened the modal
            if (returnFocusElement && typeof returnFocusElement.focus === 'function') {
                returnFocusElement.focus();
            }
        }, 500); // Match CSS transition duration
    };

    // Add event listeners for opening the modal from project buttons
    projectBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const projectId = this.getAttribute('data-project-id');
            if (projectId) {
                openModal(projectId);
            } else {
                console.warn('Project button clicked without a data-project-id attribute.');
            }
        });
    });

    // Add event listeners for closing the modal
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            // Try to find which button might have opened it based on project ID (less reliable)
            // It's better to track the opener if possible, but for simple close, just focus body or header
            const potentialOpener = document.querySelector('.view-project-btn'); // Fallback
            closeModal(potentialOpener);
        });
    }
    modal.addEventListener('click', (e) => {
        // Close if clicking directly on the overlay (background)
        if (e.target === modal) {
             const potentialOpener = document.querySelector('.view-project-btn'); // Fallback
            closeModal(potentialOpener);
        }
    });
    document.addEventListener('keydown', (e) => {
        // Close with Escape key
        if (e.key === 'Escape' && modal.classList.contains('visible')) {
             const potentialOpener = document.querySelector('.view-project-btn'); // Fallback
            closeModal(potentialOpener);
        }
    });
}

// =============================================
// 7. CONTENT FILTERING (Based on Skill Tags)
// =============================================

/**
 * Initializes the content filtering functionality based on skill tag clicks.
 * Allows users to filter Experience, Projects, and Leadership/Activities sections.
 * Uses data-skill on tags and data-tags on filterable items.
 */
function initContentFiltering() {
    // Select only skill tags that have the data-skill attribute
    const skillTags = document.querySelectorAll('.skill-tag[data-skill]');
    // Select all items that can be filtered (adjust selectors if HTML structure changes)
    const filterableItems = document.querySelectorAll('.experience-item, .project-item, .leadership-item, .music-item'); // Note: .music-item might be merged into leadership
    const resetFilterBtn = document.getElementById('reset-filter-btn');
    // Ensure the reset button is present
    if (resetFilterBtn) {
        resetFilterBtn.style.display = 'none'; // Hide initially
    }
    // Initialize current filter state
    let currentFilter = ''; // Variable to store the currently active filter skill

    // Exit if no skill tags or filterable items are found
    if (skillTags.length === 0) {
        console.warn('No skill tags with [data-skill] found. Filtering disabled.');
        return;
    }
    if (filterableItems.length === 0) {
        console.warn('No filterable items found (experience-item, project-item, etc.). Filtering disabled.');
        return;
    }

    /**
     * Filters the visible items based on the selected skill tag.
     * @param {string} filter - The skill to filter by (lowercase), or empty string to show all.
     */

    const filterItems = (filter) => {
        const filterLower = filter.toLowerCase(); // Ensure filter is lowercase
        // Loop through all filterable items
        filterableItems.forEach(item => {
            const tagsAttribute = item.getAttribute('data-tags');
            // Check if the item has tags and if they include the filter
            const matches = !filterLower || (tagsAttribute && tagsAttribute.toLowerCase().includes(filterLower));
            // Use classList for better performance and readability
            // Use CSS classes for transitions (e.g., fade-out) instead of display:none
            // This allows for smoother transitions and avoids layout shifts

            // Show or hide the item based on whether it matches
            if (matches) {
                // Use classes for smooth transitions defined in CSS
                item.classList.remove('filtered-out');
                item.style.display = ''; // Reset display (needed if previously 'none')
            } else {
                item.classList.add('filtered-out');
                // Optionally use display:none after transition, but opacity/transform is often smoother
                // setTimeout(() => { item.style.display = 'none'; }, 300); // Match CSS transition duration
            }
        });
    };

    /**
     * Updates the UI state of skill tags and the reset button.
     * @param {string} activeFilter - The currently active filter skill.
     */
    const updateFilterUI = (activeFilter) => {
        // Update active state on skill tags
        skillTags.forEach(tag => {
            if (tag.getAttribute('data-skill') === activeFilter) {
                tag.classList.add('active-filter'); // Highlight active filter tag (style in CSS)
            } else {
                tag.classList.remove('active-filter');
            }
        });

        // Show or hide the reset button
        if (resetFilterBtn) {
            resetFilterBtn.style.display = activeFilter ? 'inline-block' : 'none';
        }
    };

    // Add click event listeners to each skill tag
    skillTags.forEach(tag => {
        tag.addEventListener('click', function() {
            const skill = this.getAttribute('data-skill');
            if (!skill) return; // Ignore tags without a data-skill

            // Toggle filter: if clicking the same tag, turn filter off; otherwise, set new filter
            if (currentFilter === skill) {
                currentFilter = ''; // Deactivate filter
            } else {
                currentFilter = skill; // Activate new filter
            }

            // Apply the filter and update the UI
            filterItems(currentFilter);
            updateFilterUI(currentFilter);
        });
    });

    // Add click event listener to the reset button
    if (resetFilterBtn) {
        resetFilterBtn.addEventListener('click', () => {
            currentFilter = ''; // Clear the active filter
            filterItems(currentFilter); // Show all items
            updateFilterUI(currentFilter); // Update UI states
        });
    } else {
        console.warn('Reset filter button #reset-filter-btn not found.');
    }
}


// =============================================
// 8. DARK MODE TOGGLE
// =============================================

/**
 * Initializes the dark mode toggle functionality.
 * Reads/writes user preference to localStorage and updates UI (body class, button icon).
 */
function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;
    // Define icon classes used for toggling
    const moonIconClass = 'fa-moon'; // Icon shown in light mode
    const sunIconClass = 'fa-sun';   // Icon shown in dark mode
    const storageKey = 'portfolioDarkModePreference'; // Key for localStorage

    if (!darkModeToggle) {
        console.warn('Dark mode toggle button #dark-mode-toggle not found.');
        return;
    }

    const iconElement = darkModeToggle.querySelector('i');
    if (!iconElement) {
        console.warn('Icon element not found within dark mode toggle button.');
        return;
    }

    // Function to apply dark mode state (true = dark, false = light)
    const applyDarkMode = (isDark) => {
        body.classList.toggle('dark-mode', isDark); // Add/remove class based on boolean
        // Update the icon class
        iconElement.classList.remove(isDark ? moonIconClass : sunIconClass);
        iconElement.classList.add(isDark ? sunIconClass : moonIconClass);
        // Update ARIA pressed state for accessibility
        darkModeToggle.setAttribute('aria-pressed', isDark);
    };

    // Check localStorage for saved preference, default to false (light mode) if not set
    let isDarkModePreferred = false;
    try {
        const stored = localStorage.getItem(storageKey);
        isDarkModePreferred = stored === 'true' ? true : false; // Explicitly default to false if not set
    } catch (e) {
        console.warn('Could not access localStorage for dark mode preference.', e);
        isDarkModePreferred = false; // Default to light mode if localStorage fails
    }

    // Apply the initial state
    applyDarkMode(isDarkModePreferred);

    // Add click event listener to the toggle button
    darkModeToggle.addEventListener('click', () => {
        // Toggle the current state
        const newState = !body.classList.contains('dark-mode');
        // Apply the new state
        applyDarkMode(newState);
        // Save the new preference to localStorage
        try {
            localStorage.setItem(storageKey, newState);
        } catch (e) {
            console.warn('Could not save dark mode preference to localStorage.', e);
        }
    });
}


// =============================================
// 9. CONTACT FORM HANDLING
// =============================================

/**
 * Initializes contact form handling with validation and feedback messages.
 * Replaces alert() with messages in the #form-status-message div.
 */
function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    const statusMessageElement = document.getElementById('form-status-message');

    if (!contactForm) {
        console.warn('Contact form #contact-form not found.');
        return;
    }
    if (!statusMessageElement) {
        console.warn('Form status message element #form-status-message not found.');
        // Optionally create it dynamically if critical, but better to ensure it's in HTML
    }

    /**
     * Displays a status message to the user.
     * @param {string} message - The message text.
     * @param {boolean} isError - True for error styling, false for success.
     */
    const showStatusMessage = (message, isError = false) => {
        if (!statusMessageElement) return;
        statusMessageElement.textContent = message;
        statusMessageElement.className = 'form-status'; // Reset classes
        if (isError) {
            statusMessageElement.classList.add('form-status--error');
        } else {
            statusMessageElement.classList.add('form-status--success');
        }
        statusMessageElement.style.display = 'block'; // Make visible

        // Optional: Hide message after some time
        // setTimeout(() => {
        //     statusMessageElement.style.display = 'none';
        //     statusMessageElement.textContent = '';
        // }, 5000);
    };

    /**
     * Hides the status message.
     */
    const hideStatusMessage = () => {
        if (statusMessageElement) {
            statusMessageElement.style.display = 'none';
            statusMessageElement.textContent = '';
            statusMessageElement.className = 'form-status'; // Reset classes
        }
    };

    // Hide status message when user starts typing in any field
    contactForm.querySelectorAll('input, textarea').forEach(input => {
        input.addEventListener('input', hideStatusMessage);
        input.addEventListener('focus', hideStatusMessage);
    });


    contactForm.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission
        hideStatusMessage(); // Clear previous messages

        const nameInput = contactForm.querySelector('#name');
        const emailInput = contactForm.querySelector('#email');
        const messageInput = contactForm.querySelector('#message');
        const submitButton = contactForm.querySelector('button[type="submit"]');

        // --- Basic Client-Side Validation ---
        let isValid = true;
        let validationMessage = '';

        if (!nameInput.value.trim()) {
            isValid = false;
            validationMessage = 'Please enter your name.';
            nameInput.focus(); // Focus the first invalid field
        } else if (!emailInput.value.trim() || !/\S+@\S+\.\S+/.test(emailInput.value)) { // Simple email format check
            isValid = false;
            validationMessage = 'Please enter a valid email address.';
            if(isValid) emailInput.focus(); // Focus only if name was valid
        } else if (!messageInput.value.trim()) {
            isValid = false;
            validationMessage = 'Please enter your message.';
             if(isValid) messageInput.focus(); // Focus only if name/email were valid
        }

        if (!isValid) {
            showStatusMessage(validationMessage, true); // Show error message
            return; // Stop submission
        }

        // --- Simulate Form Submission ---
        // TODO: Replace simulation with actual fetch() call to a server endpoint
        console.log('Form data valid, simulating submission...');
        const formData = {
            name: nameInput.value.trim(),
            email: emailInput.value.trim(),
            message: messageInput.value.trim()
        };
        console.log('Data:', formData);

    // Disable form elements during "submission"
    const formElements = contactForm.elements;
    for (let i = 0; i < formElements.length; i++) {
        formElements[i].disabled = true;
    }
    
    // Save original button text
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Sending...';
    submitButton.style.cursor = 'wait';
    
    // Simulate network delay
    setTimeout(() => {
            // --- Actions after successful "submission" ---
            console.log('Simulated form submission successful.');
            showStatusMessage('Message sent successfully!', false); // Show success message

            // Reset the form fields
            contactForm.reset();

            // Re-enable form elements
            for (let i = 0; i < formElements.length; i++) {
                formElements[i].disabled = false;
            }

            // Restore button text and style
            submitButton.textContent = originalButtonText;
            submitButton.style.cursor = '';

        }, 1500); // Simulate a 1.5-second delay
    });
}


// =============================================
// 10. MAIN WEBSITE INITIALIZATION
// =============================================

/**
 * Initializes preloaders, including the Gilded Title Card preloader.
 */
function initPreloaders() {
    // Regular preloader
    handlePreloader();
    
    // Title card preloader initialization
    initTitleCardPreloader();
}

/**
 * Main function to initialize all website features after the DOM is ready.
 * Calls all the individual init functions in a logical order.
 */
function initWebsite() {
    console.log("Website initialization started...");
    initPreloaders();         // Ensure preloaders are initialized first
    initEnterButton();        // Initialize the Enter button specifically
    updateCurrentYear();      // Update footer year
    initMobileMenu();         // Setup mobile navigation toggle
    initScrollProgress();     // Setup scroll progress bar
    initTypedText();          // Start hero text animation
    initScrollAnimations();   // Setup Intersection Observer for scroll effects

    // Interactive components & Effects
    initCoinEffect();         // Setup skill tag 3D flip structure and listeners
    initDomusNavigation();    // Setup Domus overlay, map, and wisdom scroll
    initProjectModal();       // Setup project details modal
    initContentFiltering();   // Setup filtering based on skill tags
    initDarkMode();           // Setup dark mode toggle and persistence
    initContactForm();        // Setup contact form handling (with feedback div)

    // Back-to-Top Button Functionality
    const bt = document.getElementById('back-to-top');
    if (bt) {
        window.addEventListener('scroll',() => {
            bt.style.display = window.scrollY>600?'flex':'none';
        });
        bt.addEventListener('click',() => window.scrollTo({top:0,behavior:'smooth'}));
    }

    console.log("Roman Portfolio Initialized Successfully.");
}

// Execute the main initialization function once the DOM is ready
onDocumentReady(initWebsite);


// =============================================
// (End of JavaScript File)
// =============================================
