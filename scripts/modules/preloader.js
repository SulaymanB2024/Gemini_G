/**
 * preloader.js
 * Handles website preloading animation with a Roman-themed reveal
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initializes the preloader functionality
 */
export function initPreloader() {
    const preloader = document.querySelector('.preloader');
    
    if (!preloader) {
        console.warn('Preloader element not found. Preloader disabled.');
        return;
    }
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', () => {
        // Small delay to ensure all animations are loaded
        setTimeout(() => {
            hidePreloader(preloader);
        }, 500);
    });
    
    // Fallback in case 'load' event already fired
    if (document.readyState === 'complete') {
        setTimeout(() => {
            hidePreloader(preloader);
        }, 500);
    }
    
    // If page takes too long to load, hide preloader anyway after 5 seconds
    const preloaderTimeout = setTimeout(() => {
        hidePreloader(preloader);
    }, 5000);
    
    // Store timeout in window to clear it if needed
    window.preloaderTimeout = preloaderTimeout;
}

/**
 * Hides the preloader with an animation
 * @param {HTMLElement} preloader - The preloader element
 */
function hidePreloader(preloader) {
    // Clear timeout if it exists
    if (window.preloaderTimeout) {
        clearTimeout(window.preloaderTimeout);
    }
    
    // If preloader is already hidden, do nothing
    if (preloader.classList.contains('hidden')) {
        return;
    }
    
    // Animate the preloader out
    const seal = preloader.querySelector('.preloader-seal');
    
    if (seal) {
        // Play the seal animation
        animateSealBreak(seal);
        
        // Hide preloader after animation
        setTimeout(() => {
            preloader.classList.add('hidden');
            document.body.classList.remove('preloading');
            
            // Remove from DOM after fade out
            setTimeout(() => {
                preloader.remove();
            }, 1000);
        }, 1500);
    } else {
        // No seal found, just fade out
        preloader.classList.add('hidden');
        document.body.classList.remove('preloading');
        
        // Remove from DOM after fade out
        setTimeout(() => {
            preloader.remove();
        }, 1000);
    }
}

/**
 * Animates the seal breaking effect
 * @param {HTMLElement} seal - The seal element
 */
function animateSealBreak(seal) {
    // Add the breaking class to play CSS animation
    seal.classList.add('breaking');
    
    // Create crack overlay if not already present
    if (!seal.querySelector('.seal-crack')) {
        const crack = document.createElement('div');
        crack.className = 'seal-crack';
        seal.appendChild(crack);
        
        // Create shatter fragments
        for (let i = 0; i < 6; i++) {
            const fragment = document.createElement('div');
            fragment.className = 'seal-fragment';
            
            // Randomize fragment animation properties
            const rotation = Math.random() * 360;
            const translateX = (Math.random() * 100) - 50;
            const translateY = (Math.random() * 100) - 50;
            
            fragment.style.setProperty('--rot', `${rotation}deg`);
            fragment.style.setProperty('--tx', `${translateX}px`);
            fragment.style.setProperty('--ty', `${translateY}px`);
            
            seal.appendChild(fragment);
        }
    }
    
    // Play sound if available
    const sealBreakSound = document.getElementById('seal-break-sound');
    if (sealBreakSound) {
        sealBreakSound.play().catch(err => {
            console.warn('Could not play seal break sound:', err);
        });
    }
}

/**
 * Creates a roman-themed preloader if it doesn't exist in the DOM
 * This can be called manually if needed
 */
export function createPreloader() {
    if (document.querySelector('.preloader')) {
        return;
    }
    
    // Create preloader elements
    const preloader = document.createElement('div');
    preloader.className = 'preloader';
    
    // Create seal container
    const sealContainer = document.createElement('div');
    sealContainer.className = 'preloader-seal-container';
    
    // Create actual seal
    const seal = document.createElement('div');
    seal.className = 'preloader-seal';
    seal.style.backgroundImage = "url('../../assets/images/roman-wax-seal.png')";
    
    // Create loading text
    const loadingText = document.createElement('div');
    loadingText.className = 'preloader-text';
    loadingText.innerHTML = 'Loading...';
    
    // Create SPQR text
    const spqrText = document.createElement('div');
    spqrText.className = 'preloader-spqr';
    spqrText.innerHTML = 'SPQR';
    
    // Assemble preloader
    sealContainer.appendChild(seal);
    preloader.appendChild(sealContainer);
    preloader.appendChild(loadingText);
    preloader.appendChild(spqrText);
    
    // Add to body
    document.body.prepend(preloader);
    document.body.classList.add('preloading');
    
    // Initialize preloader
    initPreloader();
}