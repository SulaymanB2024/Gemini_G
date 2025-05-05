/**
 * Living Backgrounds Module
 * Creates subtle dynamic effects for static background textures
 * Version: 1.0
 */

/**
 * Class to manage the living backgrounds effects throughout the site
 */
class LivingBackgrounds {
    constructor() {
        this.filtersInjected = false;
        this.torchEffectActive = false;
        this.mouseTrackingEnabled = false;
        this.sections = [];
        this.mouseMoveThrottle = null;
    }

    /**
     * Initialize the living backgrounds
     */
    init() {
        // Inject SVG filters if not already present
        this.injectSVGFilters();
        
        // Find sections to apply effects to
        this.findTargetSections();
        
        // Apply the appropriate classes to each section
        this.applyBackgroundEffects();
        
        // Set up mouse tracking for enhanced interactivity if enabled
        if (this.mouseTrackingEnabled) {
            this.setupMouseTracking();
        }
        
        // Add torch effect to parchment sections if enabled
        if (this.torchEffectActive) {
            this.setupTorchEffect();
        }

        // Setup resize handler for responsive adjustments
        this.setupResizeHandler();
        
        // Setup reduced motion listener for accessibility
        this.setupReducedMotionListener();
    }

    /**
     * Inject SVG filters into the DOM if not already present
     */
    injectSVGFilters() {
        if (document.getElementById('living-background-filters')) {
            this.filtersInjected = true;
            return;
        }

        const filtersSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        filtersSVG.id = 'living-background-filters';
        filtersSVG.style.display = 'none';
        filtersSVG.innerHTML = `
            <filter id="noise-filter">
                <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch"/>
                <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0"/>
            </filter>
            
            <filter id="subtle-grain">
                <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/>
                <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.05 0"/>
            </filter>
            
            <filter id="marble-texture-filter">
                <feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" seed="5" stitchTiles="stitch"/>
                <feColorMatrix type="matrix" values="1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 0.15 0"/>
                <feGaussianBlur stdDeviation="0.5"/>
            </filter>
        `;
        
        document.body.appendChild(filtersSVG);
        this.filtersInjected = true;
    }

    /**
     * Find sections that should have living background effects
     */
    findTargetSections() {
        // Define the sections to be targeted with specific effects
        const sectionConfigs = [
            { selector: '.hero-section', effect: 'marble' },
            { selector: '#about', effect: 'marble' },
            { selector: '#education', effect: 'parchment' },
            { selector: '#professional-experience', effect: 'marble' },
            { selector: '#skills', effect: 'mosaic', options: { withCracks: true } },
            { selector: '#projects', effect: 'parchment' },
            { selector: '#leadership-activities', effect: 'marble' },
            { selector: '#contact', effect: 'parchment' },
            { selector: '.modal-container', effect: 'parchment' }
        ];
        
        // Find each section in the DOM and store with its configuration
        this.sections = sectionConfigs
            .map(config => {
                const element = document.querySelector(config.selector);
                return element ? { element, ...config } : null;
            })
            .filter(section => section !== null);
    }

    /**
     * Apply the appropriate living background classes to each section
     */
    applyBackgroundEffects() {
        this.sections.forEach(section => {
            const { element, effect, options = {} } = section;
            
            // Add the living effect class
            element.classList.add(`living-${effect}`);
            
            // Apply additional options
            if (options.withCracks) {
                element.classList.add('with-cracks');
            }
        });
    }

    /**
     * Set up mouse tracking for interactive lighting effects
     */
    setupMouseTracking() {
        // Use throttled event listener for performance
        const handleMouseMove = (e) => {
            if (this.mouseMoveThrottle) return;
            
            this.mouseMoveThrottle = setTimeout(() => {
                this.mouseMoveThrottle = null;
                
                // Calculate mouse position as percentage of viewport
                const x = (e.clientX / window.innerWidth) * 100;
                const y = (e.clientY / window.innerHeight) * 100;
                
                // Update CSS variables for marble highlights
                document.documentElement.style.setProperty('--mosaic-highlight-x', `${x}%`);
                document.documentElement.style.setProperty('--mosaic-highlight-y', `${y}%`);
                
            }, 50); // 50ms throttle
        };
        
        // Add mouse move listener
        document.addEventListener('mousemove', handleMouseMove);
    }

    /**
     * Set up torch light effect that follows scroll position
     */
    setupTorchEffect() {
        const updateTorchPosition = () => {
            // Calculate scroll position as percentage
            const scrollPercentY = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
            
            // Move torch down as user scrolls, but keep within 20-80% range
            const torchY = 20 + (scrollPercentY * 0.6); // Map 0-100% to 20-80%
            
            // Update torch position CSS variable
            document.documentElement.style.setProperty('--torch-position-y', `${torchY}%`);
        };
        
        // Initial position
        updateTorchPosition();
        
        // Update on scroll
        window.addEventListener('scroll', () => {
            requestAnimationFrame(updateTorchPosition);
        });
    }

    /**
     * Set up resize handler for responsive adjustments
     */
    setupResizeHandler() {
        // Handle window resize
        window.addEventListener('resize', () => {
            // Re-adjust any size-dependent effects
            // Currently no adjustments needed, but left as extension point
        });
    }

    /**
     * Set up reduced motion listener for accessibility
     */
    setupReducedMotionListener() {
        // Check for reduced motion preference
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        // Function to handle reduced motion preference
        const handleReducedMotionChange = (event) => {
            // CSS handles most of this through the media query
            // This hook is for any additional JS adjustments if needed
            if (event.matches) {
                console.log('Reduced motion preference detected - background animations minimized');
            }
        };
        
        // Initial check
        handleReducedMotionChange(reducedMotionQuery);
        
        // Listen for changes
        try {
            // Chrome & Firefox
            reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
        } catch (err) {
            // Safari & older browsers
            reducedMotionQuery.addListener(handleReducedMotionChange);
        }
    }

    /**
     * Enable interactive torch effect
     */
    enableTorchEffect() {
        this.torchEffectActive = true;
        if (this.sections.length > 0) {
            this.setupTorchEffect();
        }
        return this;
    }

    /**
     * Enable mouse movement tracking for dynamic lighting
     */
    enableMouseTracking() {
        this.mouseTrackingEnabled = true;
        if (this.sections.length > 0) {
            this.setupMouseTracking();
        }
        return this;
    }
}

/**
 * Initialize living backgrounds throughout the site
 */
export function initLivingBackgrounds() {
    const livingBackgrounds = new LivingBackgrounds();
    
    // Initialize with default settings
    livingBackgrounds.init();
    
    // Enable optional advanced features
    livingBackgrounds.enableTorchEffect();
    livingBackgrounds.enableMouseTracking();
    
    return livingBackgrounds;
}