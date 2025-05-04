/**
 * heroAnimation.js
 * Handles hero section animations including typed text and 3D effects
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initializes all hero section animations
 */
export function initHeroAnimation() {
    initTypedText();
    init3DMosaicTiles();
}

/**
 * Initializes the typed text animation in the hero section
 * Uses Typed.js if available, or falls back to a simpler implementation
 */
function initTypedText() {
    const typedElement = document.querySelector('.typed-text');
    
    if (!typedElement) return;
    
    // Text options for the typing animation
    const textOptions = [
        "Software Engineer & Web Developer",
        "Frontend & UI/UX Specialist",
        "JavaScript & React Developer",
        "Problem Solver & Code Optimizer"
    ];
    
    // Check if Typed.js is available
    if (typeof Typed !== 'undefined') {
        // Use Typed.js for animation
        new Typed(typedElement, {
            strings: textOptions,
            typeSpeed: 50,
            backSpeed: 30,
            backDelay: 2000,
            startDelay: 500,
            loop: true,
            cursorChar: '|',
            smartBackspace: true
        });
    } else {
        // Fallback to simple CSS animation
        console.warn('Typed.js not found, using fallback animation');
        let currentIndex = 0;
        
        const updateText = () => {
            typedElement.textContent = "";
            let charIndex = 0;
            
            const type = () => {
                if (charIndex < textOptions[currentIndex].length) {
                    typedElement.textContent += textOptions[currentIndex][charIndex];
                    charIndex++;
                    setTimeout(type, 100);
                } else {
                    // Wait before erasing
                    setTimeout(erase, 2000);
                }
            };
            
            const erase = () => {
                if (typedElement.textContent.length) {
                    typedElement.textContent = typedElement.textContent.slice(0, -1);
                    setTimeout(erase, 50);
                } else {
                    // Move to next text
                    currentIndex = (currentIndex + 1) % textOptions.length;
                    // Wait before typing next
                    setTimeout(updateText, 500);
                }
            };
            
            type();
        };
        
        updateText();
    }
}

/**
 * Initializes 3D effect for mosaic tiles in hero section
 * Creates a subtle parallax effect on mouse movement
 */
function init3DMosaicTiles() {
    const heroMosaic = document.querySelector('.hero-mosaic');
    const tiles = document.querySelectorAll('.mosaic-tile');
    
    if (!heroMosaic || !tiles.length) return;
    
    // Setup 3D transform perspective on the parent
    heroMosaic.style.perspective = '2000px';
    
    // Add event listeners for mouse movement
    heroMosaic.addEventListener('mousemove', handleMouseMove);
    heroMosaic.addEventListener('mouseleave', resetTiles);
    
    // Add event listener for touch devices
    heroMosaic.addEventListener('touchmove', handleTouchMove);
    heroMosaic.addEventListener('touchend', resetTiles);
}

/**
 * Handles mouse movement to create a 3D effect
 * @param {MouseEvent} e - Mouse event
 */
function handleMouseMove(e) {
    const heroMosaic = e.currentTarget;
    const tiles = heroMosaic.querySelectorAll('.mosaic-tile');
    
    // Get mouse position relative to the mosaic container
    const rect = heroMosaic.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    // Calculate center point
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate mouse position relative to center (-1 to 1)
    const relativeX = (mouseX - centerX) / centerX;
    const relativeY = (mouseY - centerY) / centerY;
    
    // Apply transform to each tile
    tiles.forEach((tile, index) => {
        // Different rotation intensity based on index
        const intensity = 1 - (index % 3) * 0.2;
        const rotateY = relativeX * 5 * intensity;
        const rotateX = -relativeY * 5 * intensity;
        
        // Apply transform with dampened values
        tile.style.transform = `
            translateZ(15px) 
            rotateX(${rotateX}deg) 
            rotateY(${rotateY}deg)
        `;
    });
}

/**
 * Handles touch movement for mobile devices
 * @param {TouchEvent} e - Touch event
 */
function handleTouchMove(e) {
    if (e.touches.length !== 1) return;
    
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent('mousemove', {
        clientX: touch.clientX,
        clientY: touch.clientY
    });
    
    handleMouseMove(mouseEvent);
}

/**
 * Resets all tiles to their default position
 */
function resetTiles() {
    const tiles = document.querySelectorAll('.mosaic-tile');
    
    tiles.forEach(tile => {
        // Reset to default state with a smooth transition
        tile.style.transition = 'transform 0.5s ease-out';
        tile.style.transform = 'translateZ(10px)';
        
        // Remove the transition after it's complete to allow smooth movement again
        setTimeout(() => {
            tile.style.transition = '';
        }, 500);
    });
}