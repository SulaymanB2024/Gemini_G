/**
 * Dynamic Lighting & Shadow System
 * Creates a cohesive lighting system using CSS variables and mouse interaction
 * Version: 1.0
 */

class DynamicLighting {
    constructor() {
        // Configuration options
        this.options = {
            // Light source initial position (percentage from top-left)
            defaultLightSourceX: -30, 
            defaultLightSourceY: -30,
            // Whether to enable mouse-based lighting effects
            mouseReactive: true,
            // Damping factor for mouse movements (lower = smoother but slower)
            mouseDamping: 0.1,
            // Mouse influence factor (0-1, how much mouse affects global lighting)
            mouseInfluence: 0.5,
            // Performance considerations
            throttleDelay: 15, // ms between updates
            mobileDisable: true, // disable on mobile devices
            reduceMotionDisable: true // respect prefers-reduced-motion
        };

        // State variables
        this.state = {
            lightSourceX: this.options.defaultLightSourceX,
            lightSourceY: this.options.defaultLightSourceY,
            mouseX: 0,
            mouseY: 0,
            isActive: false,
            activeElements: new Map(), // Elements with mouse-reactive lighting
            requestId: null, // For animation frame
            isThrottled: false // For throttling
        };
    }

    /**
     * Initialize the dynamic lighting system
     */
    init() {
        // Check if reduced motion is preferred
        if (this.options.reduceMotionDisable && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            console.log('Dynamic lighting system disabled due to reduced motion preference');
            this.applyDefaultLighting();
            return;
        }

        // Check if we should disable on mobile
        if (this.options.mobileDisable && this.isMobileDevice()) {
            console.log('Dynamic lighting system partially disabled on mobile device');
            // Apply default lighting without mouse reactivity
            this.applyDefaultLighting();
            return;
        }

        // Set initial light source position as CSS variables
        this.updateLightSourceVariables();

        // Setup mouse tracking if enabled
        if (this.options.mouseReactive) {
            this.setupMouseTracking();
        }

        // Identify elements that should have reactive lighting
        this.identifyReactiveElements();

        this.state.isActive = true;
        console.log('Dynamic lighting system initialized');
    }

    /**
     * Apply the default lighting without any mouse reactivity
     */
    applyDefaultLighting() {
        document.documentElement.style.setProperty('--light-source-x', `${this.options.defaultLightSourceX}%`);
        document.documentElement.style.setProperty('--light-source-y', `${this.options.defaultLightSourceY}%`);
    }

    /**
     * Update CSS variables for light source position
     */
    updateLightSourceVariables() {
        requestAnimationFrame(() => {
            document.documentElement.style.setProperty('--light-source-x', `${this.state.lightSourceX}%`);
            document.documentElement.style.setProperty('--light-source-y', `${this.state.lightSourceY}%`);
        });
    }

    /**
     * Setup mouse tracking for dynamic lighting
     */
    setupMouseTracking() {
        // Add mousemove listener
        document.addEventListener('mousemove', this.handleMouseMove.bind(this));

        // Start animation loop
        this.startAnimationLoop();

        // Add resize listener
        window.addEventListener('resize', this.handleResize.bind(this));

        // Clean up on page unload
        window.addEventListener('beforeunload', this.cleanup.bind(this));
    }

    /**
     * Handle mouse movement
     * @param {MouseEvent} e - Mouse event object
     */
    handleMouseMove(e) {
        if (this.state.isThrottled) return;
        
        // Set throttle flag
        this.state.isThrottled = true;
        
        // Calculate mouse position as percentage of window
        this.state.mouseX = (e.clientX / window.innerWidth) * 200 - 100; // -100 to 100 range
        this.state.mouseY = (e.clientY / window.innerHeight) * 200 - 100; // -100 to 100 range
        
        // Update reactive elements
        this.updateReactiveElements(e);
        
        // Clear throttle after delay
        setTimeout(() => {
            this.state.isThrottled = false;
        }, this.options.throttleDelay);
    }

    /**
     * Start the animation loop for smooth light transitions
     */
    startAnimationLoop() {
        const animate = () => {
            // Calculate new light position with damping for smoothness
            this.state.lightSourceX += (this.state.mouseX * this.options.mouseInfluence - this.state.lightSourceX) * this.options.mouseDamping;
            this.state.lightSourceY += (this.state.mouseY * this.options.mouseInfluence - this.state.lightSourceY) * this.options.mouseDamping;
            
            // Update CSS variables
            this.updateLightSourceVariables();
            
            // Continue animation loop
            this.state.requestId = requestAnimationFrame(animate);
        };
        
        // Start animation
        this.state.requestId = requestAnimationFrame(animate);
    }

    /**
     * Handle window resize
     */
    handleResize() {
        // Recalculate element positions if needed
        this.identifyReactiveElements();
    }

    /**
     * Cleanup event listeners and animations
     */
    cleanup() {
        document.removeEventListener('mousemove', this.handleMouseMove);
        window.removeEventListener('resize', this.handleResize);
        
        if (this.state.requestId) {
            cancelAnimationFrame(this.state.requestId);
        }
    }

    /**
     * Check if user is on a mobile device
     * @return {boolean} True if a mobile device is detected
     */
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    /**
     * Identify elements that should have reactive lighting
     */
    identifyReactiveElements() {
        // Clear existing map
        this.state.activeElements.clear();
        
        // Find elements with data attribute
        const elements = document.querySelectorAll('[data-lighting="reactive"]');
        
        elements.forEach((el, index) => {
            // Store element with its bounding rect
            this.state.activeElements.set(el, {
                rect: el.getBoundingClientRect(),
                id: `lighting-el-${index}`
            });
        });
    }

    /**
     * Update reactive elements with mouse-based lighting
     * @param {MouseEvent} e - Mouse event object
     */
    updateReactiveElements(e) {
        // Skip if no elements or throttled
        if (this.state.activeElements.size === 0 || this.state.isThrottled) return;
        
        // Process each element
        this.state.activeElements.forEach((data, element) => {
            const rect = element.getBoundingClientRect(); // Get fresh position
            
            // Calculate mouse position relative to element center
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            // Calculate distance and direction
            const deltaX = mouseX - elementCenterX;
            const deltaY = mouseY - elementCenterY;
            
            // Normalize to percentage (-50 to 50 range)
            const normalizedX = Math.max(-50, Math.min(50, (deltaX / rect.width) * 100));
            const normalizedY = Math.max(-50, Math.min(50, (deltaY / rect.height) * 100));
            
            // Apply element-specific light source
            element.style.setProperty('--element-light-x', `${normalizedX}%`);
            element.style.setProperty('--element-light-y', `${normalizedY}%`);
        });
    }
}

/**
 * Initialize the dynamic lighting system
 */
export function initDynamicLighting() {
    const lighting = new DynamicLighting();
    lighting.init();
    
    return lighting;
}