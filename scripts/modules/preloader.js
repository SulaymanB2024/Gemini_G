/**
 * preloader.js
 * Handles all preloader animations and transitions
 * Version: 1.1
 * Last Updated: May 4, 2025
 */

import { onDocumentReady } from '../utils/helpers.js';

/**
 * Handles the main preloader animation and transition
 */
export function handlePreloader() {
    const preloader = document.querySelector('.preloader');
    if (!preloader) return;
    
    setTimeout(() => {
        preloader.style.transition = 'opacity 1s ease-in-out';
        preloader.style.opacity = '0';
        
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 1000);
    }, 1000);
}

/**
 * Initializes the title card preloader animations
 */
export function initTitleCardPreloader() {
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
 * Initializes the Roman Seal preloader
 */
export function initRomanSealPreloader() {
    const sealPreloader = document.getElementById('roman-seal-preloader');
    
    if (!sealPreloader) {
        console.warn('Roman seal preloader not found. Skipping initialization.');
        return;
    }
    
    // Time for the seal to appear before it starts to reveal
    const sealRevealDelay = 1500;
    // Time for the full preloader animation to complete
    const totalPreloaderTime = 5000;
    
    // Add animation classes after a delay
    setTimeout(() => {
        sealPreloader.classList.add('reveal-seal');
        
        // Add animated gold dust particles
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'seal-particles';
        
        // Add multiple dust particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('span');
            particle.className = 'seal-particle';
            // Randomize particle position and animation delay
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDelay = Math.random() * 1 + 's';
            particlesContainer.appendChild(particle);
        }
        
        sealPreloader.appendChild(particlesContainer);
    }, sealRevealDelay);
    
    // Hide preloader after animation completes
    setTimeout(() => {
        sealPreloader.classList.add('completed');
        
        // Remove from DOM after fade out
        setTimeout(() => {
            if (sealPreloader.parentNode) {
                sealPreloader.parentNode.removeChild(sealPreloader);
            }
            
            // Trigger an event that other components can listen for
            document.dispatchEvent(new Event('preloader:complete'));
        }, 1000);
    }, totalPreloaderTime);
    
    // Optional: Add skip functionality
    sealPreloader.addEventListener('click', () => {
        sealPreloader.classList.add('completed');
        setTimeout(() => {
            if (sealPreloader.parentNode) {
                sealPreloader.parentNode.removeChild(sealPreloader);
            }
            document.dispatchEvent(new Event('preloader:complete'));
        }, 800);
    });
}

/**
 * Main preloader initialization function
 * Sets up event listeners and preloader animations
 */
export function initPreloader() {
    onDocumentReady(() => {
        handlePreloader();
        
        // Check for title card preloader
        if (document.getElementById('preloader-title-card')) {
            initTitleCardPreloader();
        }
        
        // Check for Roman seal preloader
        if (document.getElementById('roman-seal-preloader')) {
            initRomanSealPreloader();
        }
    });
}

/**
 * Sets up the enter button listener for transitioning from preloader to main content
 */
export function setupEnterButtonListener() {
    const enterButton = document.querySelector('.enter-button');
    const titleCard = document.querySelector('.title-card');
    const mainContent = document.querySelector('.main-content');
    
    if (!enterButton || !titleCard || !mainContent) return;
    
    enterButton.addEventListener('click', () => {
        // Hide the title card with fade out animation
        titleCard.classList.add('fade-out');
        
        // Wait for animation to complete before showing main content
        setTimeout(() => {
            titleCard.style.display = 'none';
            mainContent.style.display = 'block';
            
            // Trigger entrance animations for main content
            setTimeout(() => {
                mainContent.classList.add('visible');
                
                // Initialize any post-preloader animations or interactions
                document.dispatchEvent(new Event('preloader:complete'));
            }, 100);
        }, 1000);
    });
}

// Export the main initialization function as default for simpler imports
export default initPreloader;