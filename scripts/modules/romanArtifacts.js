/**
 * Roman Artifacts Module
 * Handles the placement and interaction of decorative Roman artifacts throughout the site
 * Version: 2.0 - Enhanced with contextual information and improved animations
 */

/**
 * Class to manage interactive Roman artifacts scattered throughout the site
 */
class RomanArtifacts {
    constructor() {
        this.tooltip = null;
        this.artifacts = [];
        this.artifactData = {
            'roman-coin': {
                name: 'Roman Denarius',
                description: 'The denarius was the standard silver coin of the Roman Republic and Roman Empire.',
                fact: 'A Roman legionary earned about 300 denarii per year during the reign of Augustus.',
                animation: 'spin',
                relevance: 'Like Roman coins that carried cultural messages, this section showcases my professional value.',
                icon: 'coin-icon.svg'
            },
            'roman-scroll': {
                name: 'Roman Scroll',
                description: 'Scrolls made from papyrus or parchment were the primary medium for written documents in ancient Rome.',
                fact: 'The Library of Alexandria may have housed over 400,000 scrolls before its destruction.',
                animation: 'unroll',
                relevance: 'Just as scrolls preserved knowledge, this section documents my educational background.',
                icon: 'scroll-rod-icon.png'
            },
            'roman-lamp': {
                name: 'Oil Lamp',
                description: 'Clay and bronze oil lamps provided lighting in Roman homes and public buildings.',
                fact: 'Romans used olive oil as fuel for their lamps, which created much less smoke than other oils.',
                animation: 'flicker',
                relevance: 'Like lamps illuminated Rome, these projects showcase my brightest ideas and implementations.',
                icon: 'lamp-icon.svg'
            },
            'roman-amphora': {
                name: 'Amphora',
                description: 'These large ceramic vessels were used to store and transport goods like wine, olive oil, and grain.',
                fact: 'Amphorae were often stamped with seals indicating their contents, origin, and even the names of merchants.',
                animation: 'rock',
                relevance: 'Like amphorae stored valuable resources, my skill set represents my professional capabilities.',
                icon: 'amphora-icon.svg'
            },
            'roman-gladius': {
                name: 'Gladius',
                description: 'The primary sword of Roman legionaries, the gladius was short, double-edged, and designed for stabbing.',
                fact: 'Roman soldiers were trained to thrust with the gladius rather than slash, as thrusting wounds were more lethal.',
                animation: 'gleam',
                relevance: 'Like the gladius was essential to Roman military success, these experiences have been crucial to my professional journey.',
                icon: 'gladius-icon.svg'
            },
            'roman-laurel': {
                name: 'Laurel Wreath',
                description: 'Laurel wreaths were awarded to victors in athletic competitions and military triumphs in ancient Rome.',
                fact: 'The term "laureate" comes from the laurel wreath, symbolizing achievement and honor.',
                animation: 'rotate',
                relevance: 'Like laurel wreaths honored achievement, these achievements represent my accomplishments.',
                icon: 'laurel-outline.svg'
            }
        };
        this.sectionRelevance = {
            '#about': 'Personal details and background',
            '#professional-experience': 'Professional journey and achievements',
            '#projects': 'Notable work and implementations',
            '#skills': 'Technical expertise and abilities',
            '#leadership-activities': 'Leadership roles and community involvement',
            '#education': 'Academic background and qualifications',
            '#contact': 'Ways to connect and communicate'
        };
    }

    /**
     * Initialize the Roman artifacts
     */
    init() {
        // Create a tooltip element that will be shared by all artifacts
        this.createTooltip();
        
        // Find all artifact elements
        this.findArtifacts();
        
        // Bind events to each artifact
        this.bindEvents();
        
        // Add keyboard accessibility
        this.setupAccessibility();

        // Create particle effect container for animations
        this.createParticleContainer();
    }

    /**
     * Create a tooltip element for displaying artifact information
     */
    createTooltip() {
        if (document.getElementById('roman-artifact-tooltip')) {
            this.tooltip = document.getElementById('roman-artifact-tooltip');
            return;
        }

        this.tooltip = document.createElement('div');
        this.tooltip.id = 'roman-artifact-tooltip';
        this.tooltip.className = 'roman-artifact-tooltip';
        this.tooltip.setAttribute('role', 'tooltip');
        this.tooltip.setAttribute('aria-hidden', 'true');
        
        // Create the tooltip structure with enhanced content
        this.tooltip.innerHTML = `
            <div class="tooltip-header">
                <h4 class="tooltip-title"></h4>
                <div class="tooltip-decoration"></div>
            </div>
            <div class="tooltip-body">
                <p class="tooltip-description"></p>
                <p class="tooltip-fact"><em></em></p>
                <p class="tooltip-relevance"></p>
            </div>
            <div class="tooltip-arrow"></div>
        `;
        
        document.body.appendChild(this.tooltip);
    }

    /**
     * Create a container for particle effects
     */
    createParticleContainer() {
        if (document.getElementById('artifact-particle-container')) {
            this.particleContainer = document.getElementById('artifact-particle-container');
            return;
        }

        this.particleContainer = document.createElement('div');
        this.particleContainer.id = 'artifact-particle-container';
        this.particleContainer.style.position = 'absolute';
        this.particleContainer.style.top = '0';
        this.particleContainer.style.left = '0';
        this.particleContainer.style.width = '100%';
        this.particleContainer.style.height = '100%';
        this.particleContainer.style.pointerEvents = 'none';
        this.particleContainer.style.zIndex = '1000';
        this.particleContainer.style.overflow = 'hidden';
        
        document.body.appendChild(this.particleContainer);
    }

    /**
     * Find all artifact elements in the document
     */
    findArtifacts() {
        // Find artifacts with the class 'roman-artifact'
        const artifactElements = document.querySelectorAll('.roman-artifact');
        
        // Store references to all found artifacts
        artifactElements.forEach(element => {
            const type = element.dataset.artifactType || 'roman-coin';
            
            // Store information about this artifact
            this.artifacts.push({
                element: element,
                type: type,
                info: this.artifactData[type] || this.artifactData['roman-coin']
            });
        });
    }

    /**
     * Bind events to each artifact
     */
    bindEvents() {
        this.artifacts.forEach(artifact => {
            // Mouse events
            artifact.element.addEventListener('mouseenter', () => this.showArtifactInfo(artifact));
            artifact.element.addEventListener('mouseleave', () => this.hideArtifactInfo());
            artifact.element.addEventListener('mousemove', (e) => this.positionTooltip(e));
            
            // Touch events for mobile
            artifact.element.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.showArtifactInfo(artifact);
            });
            
            // Add animation class based on artifact type
            if (artifact.info.animation) {
                const visual = artifact.element.querySelector('.artifact-visual');
                if (visual) {
                    visual.classList.add(`animation-${artifact.info.animation}`);
                }
            }

            // Click event for creating particle effects
            artifact.element.addEventListener('click', (e) => this.createParticleEffect(e, artifact));
        });
        
        // Close tooltip when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.roman-artifact') && !e.target.closest('.roman-artifact-tooltip')) {
                this.hideArtifactInfo();
            }
        });
    }

    /**
     * Set up keyboard accessibility
     */
    setupAccessibility() {
        this.artifacts.forEach(artifact => {
            // Make artifact focusable if it isn't already
            if (artifact.element.getAttribute('tabindex') === null) {
                artifact.element.setAttribute('tabindex', '0');
            }
            
            // Handle keyboard events
            artifact.element.addEventListener('focus', () => this.showArtifactInfo(artifact));
            artifact.element.addEventListener('blur', () => this.hideArtifactInfo());
            artifact.element.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.createParticleEffect(e, artifact);
                }
            });
            
            // Ensure ARIA attributes are set
            artifact.element.setAttribute('aria-label', artifact.info.name);
            artifact.element.setAttribute('role', 'button');
        });
    }

    /**
     * Show information about an artifact
     * @param {Object} artifact - The artifact to show info for
     */
    showArtifactInfo(artifact) {
        // Update tooltip content
        const titleElement = this.tooltip.querySelector('.tooltip-title');
        const descriptionElement = this.tooltip.querySelector('.tooltip-description');
        const factElement = this.tooltip.querySelector('.tooltip-fact em');
        const relevanceElement = this.tooltip.querySelector('.tooltip-relevance');
        const iconElement = this.tooltip.querySelector('.tooltip-decoration');
        
        titleElement.textContent = artifact.info.name;
        descriptionElement.textContent = artifact.info.description;
        factElement.textContent = artifact.info.fact;
        
        // Add context-specific relevance
        const closestSection = this.findClosestSection(artifact.element);
        const sectionId = closestSection ? `#${closestSection.id}` : '';
        const relevance = artifact.info.relevance || 
                         (this.sectionRelevance[sectionId] ? 
                          `This relates to ${this.sectionRelevance[sectionId]}.` : 
                          '');
        
        relevanceElement.textContent = relevance;
        
        // Set icon background
        if (iconElement) {
            iconElement.style.backgroundImage = artifact.info.icon ? 
                `url('/assets/images/decorative/${artifact.info.icon}')` : '';
        }
        
        // Make the tooltip visible
        this.tooltip.classList.add('visible');
        this.tooltip.setAttribute('aria-hidden', 'false');
        
        // Add active class to the artifact
        artifact.element.classList.add('active');
        
        // Position the tooltip near the artifact
        this.positionTooltipNearArtifact(artifact);
    }

    /**
     * Position the tooltip optimally near the artifact
     * @param {Object} artifact - The artifact to position near
     */
    positionTooltipNearArtifact(artifact) {
        const rect = artifact.element.getBoundingClientRect();
        const tooltipRect = this.tooltip.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const windowWidth = window.innerWidth;
        
        // Default position (below)
        let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
        let top = rect.bottom + window.scrollY + 15; // 15px below the artifact
        
        // Check if tooltip would go off the right edge
        if (left + tooltipRect.width > windowWidth) {
            left = windowWidth - tooltipRect.width - 10;
        }
        
        // Check if tooltip would go off the left edge
        if (left < 10) {
            left = 10;
        }
        
        // Check if tooltip would go off the bottom edge
        if (rect.bottom + tooltipRect.height > windowHeight) {
            // Position above if it would go off bottom
            top = rect.top + window.scrollY - tooltipRect.height - 15;
            
            // Move the arrow to the bottom
            this.tooltip.querySelector('.tooltip-arrow').style.top = 'auto';
            this.tooltip.querySelector('.tooltip-arrow').style.bottom = '-6px';
            this.tooltip.querySelector('.tooltip-arrow').style.transform = 'rotate(225deg)';
        } else {
            // Reset arrow position if needed
            this.tooltip.querySelector('.tooltip-arrow').style.top = '-6px';
            this.tooltip.querySelector('.tooltip-arrow').style.bottom = 'auto';
            this.tooltip.querySelector('.tooltip-arrow').style.transform = 'rotate(45deg)';
        }
        
        // Apply positioning
        this.tooltip.style.left = `${Math.max(10, left)}px`;
        this.tooltip.style.top = `${top}px`;
    }

    /**
     * Find the closest section parent of an element
     * @param {HTMLElement} element - The element to start from
     * @return {HTMLElement|null} The closest section element
     */
    findClosestSection(element) {
        let currentElement = element;
        
        while (currentElement && currentElement !== document.body) {
            if (currentElement.tagName.toLowerCase() === 'section' || 
                currentElement.id && this.sectionRelevance[`#${currentElement.id}`]) {
                return currentElement;
            }
            currentElement = currentElement.parentElement;
        }
        
        return null;
    }

    /**
     * Hide the artifact tooltip
     */
    hideArtifactInfo() {
        this.tooltip.classList.remove('visible');
        this.tooltip.setAttribute('aria-hidden', 'true');
        
        // Remove active class from all artifacts
        this.artifacts.forEach(artifact => {
            artifact.element.classList.remove('active');
        });
    }

    /**
     * Position the tooltip based on mouse movement
     * @param {MouseEvent} e - The mouse event
     */
    positionTooltip(e) {
        // No repositioning needed if already hidden
        if (!this.tooltip.classList.contains('visible')) return;
        
        // Calculate gentle movement to follow cursor a bit
        const mouseX = e.clientX;
        const windowWidth = window.innerWidth;
        const tooltipWidth = this.tooltip.offsetWidth;
        
        // Move tooltip slightly (up to 30px) in the direction of mouse
        // This creates a subtle "magnetic" effect
        const currentLeft = parseInt(this.tooltip.style.left, 10);
        const targetLeft = Math.max(10, Math.min(
            windowWidth - tooltipWidth - 10,
            currentLeft + (mouseX - (currentLeft + tooltipWidth/2)) * 0.1
        ));
        
        this.tooltip.style.left = `${targetLeft}px`;
    }

    /**
     * Create a particle effect when an artifact is clicked
     * @param {Event} e - The triggering event
     * @param {Object} artifact - The artifact that was clicked
     */
    createParticleEffect(e, artifact) {
        const rect = artifact.element.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        
        // Animation type based on artifact type
        const type = artifact.type;
        
        // Create particles
        switch(type) {
            case 'roman-coin':
                this.createCoinParticles(x, y);
                break;
            case 'roman-lamp':
                this.createFlameParticles(x, y);
                break;
            case 'roman-gladius':
                this.createGleamParticles(x, y);
                break;
            case 'roman-scroll':
                this.createDustParticles(x, y);
                break;
            case 'roman-amphora':
                this.createShardParticles(x, y);
                break;
            case 'roman-laurel':
                this.createLeafParticles(x, y);
                break;
            default:
                this.createSimpleParticles(x, y);
        }
        
        // Add a ripple effect
        this.createRippleEffect(artifact.element);
    }
    
    /**
     * Create coin-like particle effect
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     */
    createCoinParticles(x, y) {
        // Create 5-10 small coin particles
        const count = Math.floor(Math.random() * 5) + 5;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'coin-particle';
            
            // Random position around the center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 50 + 20;
            const pX = x + Math.cos(angle) * distance;
            const pY = y + Math.sin(angle) * distance;
            
            // Style the particle
            particle.style.cssText = `
                position: absolute;
                width: 10px;
                height: 10px;
                background-color: var(--color-gold-light);
                border-radius: 50%;
                top: ${pY}px;
                left: ${pX}px;
                box-shadow: 0 0 5px var(--color-gold-light);
                transform: scale(0);
                z-index: 1000;
                pointer-events: none;
            `;
            
            // Add to container
            this.particleContainer.appendChild(particle);
            
            // Animate with slight delay
            setTimeout(() => {
                particle.style.transition = 'all 0.5s ease-out';
                particle.style.transform = 'scale(1)';
                particle.style.opacity = '0.8';
                
                // Random movement
                const newX = pX + (Math.random() - 0.5) * 100;
                const newY = pY + (Math.random() - 0.5) * 100;
                particle.style.left = `${newX}px`;
                particle.style.top = `${newY}px`;
                
                // Remove after animation
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 500);
                }, 500);
            }, Math.random() * 200);
        }
    }
    
    /**
     * Create flame-like particle effect
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     */
    createFlameParticles(x, y) {
        // Create 10-15 flame particles
        const count = Math.floor(Math.random() * 5) + 10;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'flame-particle';
            
            // Position just above the center
            const angle = Math.PI * (0.8 + Math.random() * 0.4); // Mostly upward
            const distance = Math.random() * 30 + 10;
            const pX = x + Math.cos(angle) * distance;
            const pY = y + Math.sin(angle) * distance;
            
            // Random gold/orange color
            const hue = 30 + Math.random() * 20;
            const lightness = 50 + Math.random() * 20;
            
            // Style the particle
            particle.style.cssText = `
                position: absolute;
                width: ${5 + Math.random() * 8}px;
                height: ${8 + Math.random() * 12}px;
                background-color: hsl(${hue}, 80%, ${lightness}%);
                border-radius: 50%;
                top: ${pY}px;
                left: ${pX}px;
                filter: blur(1px);
                opacity: 0;
                z-index: 1000;
                pointer-events: none;
            `;
            
            // Add to container
            this.particleContainer.appendChild(particle);
            
            // Animate with slight delay
            setTimeout(() => {
                particle.style.transition = `all ${0.5 + Math.random() * 0.5}s ease-out`;
                particle.style.opacity = '0.8';
                
                // Upward movement
                const newY = pY - (20 + Math.random() * 40);
                particle.style.top = `${newY}px`;
                particle.style.left = `${pX + (Math.random() - 0.5) * 20}px`;
                
                // Fade out and remove
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 500);
                }, 300 + Math.random() * 300);
            }, Math.random() * 200);
        }
    }
    
    /**
     * Create gleaming light ray effect
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     */
    createGleamParticles(x, y) {
        // Create 3-6 gleaming rays
        const count = Math.floor(Math.random() * 3) + 3;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'gleam-particle';
            
            // Position at center
            const angle = Math.random() * Math.PI * 2;
            const length = 40 + Math.random() * 60;
            
            // Style the particle
            particle.style.cssText = `
                position: absolute;
                width: 2px;
                height: ${length}px;
                background: linear-gradient(to top, transparent, var(--color-gold-light), transparent);
                top: ${y}px;
                left: ${x}px;
                transform-origin: center bottom;
                transform: translateX(-50%) rotate(${angle}rad) scale(0);
                opacity: 0;
                z-index: 1000;
                pointer-events: none;
            `;
            
            // Add to container
            this.particleContainer.appendChild(particle);
            
            // Animate
            setTimeout(() => {
                particle.style.transition = `all ${0.3 + Math.random() * 0.2}s ease-out`;
                particle.style.transform = `translateX(-50%) rotate(${angle}rad) scale(1)`;
                particle.style.opacity = '0.7';
                
                // Fade out and remove
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 300);
                }, 200 + Math.random() * 200);
            }, Math.random() * 100);
        }
    }
    
    /**
     * Create dust particle effect for scrolls
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     */
    createDustParticles(x, y) {
        // Create 15-25 dust particles
        const count = Math.floor(Math.random() * 10) + 15;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'dust-particle';
            
            // Position around center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 30;
            const pX = x + Math.cos(angle) * distance;
            const pY = y + Math.sin(angle) * distance;
            
            // Style the particle
            particle.style.cssText = `
                position: absolute;
                width: ${1 + Math.random() * 3}px;
                height: ${1 + Math.random() * 3}px;
                background-color: rgba(210, 180, 140, ${0.3 + Math.random() * 0.4});
                border-radius: 50%;
                top: ${pY}px;
                left: ${pX}px;
                opacity: 0;
                z-index: 1000;
                pointer-events: none;
            `;
            
            // Add to container
            this.particleContainer.appendChild(particle);
            
            // Animate with slight delay
            setTimeout(() => {
                particle.style.transition = `all ${1 + Math.random() * 1.5}s ease-out`;
                particle.style.opacity = '1';
                
                // Slow random movement
                const newX = pX + (Math.random() - 0.5) * 50;
                const newY = pY - (10 + Math.random() * 30); // Mostly upward
                particle.style.left = `${newX}px`;
                particle.style.top = `${newY}px`;
                
                // Remove after animation
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 1000);
                }, 500 + Math.random() * 1000);
            }, Math.random() * 300);
        }
    }
    
    /**
     * Create shard/pottery fragment effect for amphorae
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     */
    createShardParticles(x, y) {
        // Create 5-8 pottery shards
        const count = Math.floor(Math.random() * 3) + 5;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'shard-particle';
            
            // Random shapes for shards
            const width = 4 + Math.random() * 8;
            const height = 4 + Math.random() * 8;
            
            // Position at center
            const angle = Math.random() * Math.PI * 2;
            const pX = x;
            const pY = y;
            
            // Style the particle with irregular shape
            particle.style.cssText = `
                position: absolute;
                width: ${width}px;
                height: ${height}px;
                background-color: rgba(160, 82, 45, ${0.7 + Math.random() * 0.3});
                clip-path: polygon(
                    0% 0%, 
                    ${20 + Math.random() * 80}% ${Math.random() * 40}%, 
                    ${60 + Math.random() * 40}% ${60 + Math.random() * 40}%, 
                    ${Math.random() * 40}% ${80 + Math.random() * 20}%
                );
                top: ${pY}px;
                left: ${pX}px;
                transform: translate(-50%, -50%) rotate(0deg) scale(0);
                opacity: 0;
                z-index: 1000;
                pointer-events: none;
            `;
            
            // Add to container
            this.particleContainer.appendChild(particle);
            
            // Animate with physics-like movement
            setTimeout(() => {
                // Random movement outward
                const speed = 5 + Math.random() * 10;
                const endX = pX + Math.cos(angle) * (50 + Math.random() * 50);
                const endY = pY + Math.sin(angle) * (50 + Math.random() * 50);
                const rotation = (Math.random() - 0.5) * 720; // -360 to +360 degrees
                
                particle.style.transition = `all 0.8s cubic-bezier(.17,.67,.4,1)`;
                particle.style.transform = `translate(-50%, -50%) rotate(${rotation}deg) scale(1)`;
                particle.style.left = `${endX}px`;
                particle.style.top = `${endY}px`;
                particle.style.opacity = '1';
                
                // Remove after animation
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 500);
                }, 600);
            }, Math.random() * 100);
        }
    }
    
    /**
     * Create leaf particles for laurel
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     */
    createLeafParticles(x, y) {
        // Create 6-10 leaves
        const count = Math.floor(Math.random() * 4) + 6;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'leaf-particle';
            
            // Position around center
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 20;
            const pX = x + Math.cos(angle) * distance;
            const pY = y + Math.sin(angle) * distance;
            
            // Leaf shape and color
            const hue = 80 + Math.random() * 40; // Green to gold
            const saturation = 40 + Math.random() * 40;
            const lightness = 30 + Math.random() * 30;
            
            // Style the particle
            particle.style.cssText = `
                position: absolute;
                width: ${6 + Math.random() * 8}px;
                height: ${12 + Math.random() * 10}px;
                background-color: hsl(${hue}, ${saturation}%, ${lightness}%);
                border-radius: 50% 5% 50% 5%;
                top: ${pY}px;
                left: ${pX}px;
                transform: rotate(${Math.random() * 360}deg) scale(0);
                opacity: 0;
                z-index: 1000;
                pointer-events: none;
            `;
            
            // Add to container
            this.particleContainer.appendChild(particle);
            
            // Animate with slight delay
            setTimeout(() => {
                particle.style.transition = `all ${1 + Math.random() * 1}s ease-out`;
                particle.style.transform = `rotate(${Math.random() * 360}deg) scale(1)`;
                particle.style.opacity = '0.9';
                
                // Floating movement
                const newX = pX + (Math.random() - 0.5) * 100;
                const newY = pY + (Math.random() - 0.5) * 100;
                particle.style.left = `${newX}px`;
                particle.style.top = `${newY}px`;
                
                // Remove after animation
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 800);
                }, 700);
            }, Math.random() * 200);
        }
    }
    
    /**
     * Create a simple particle effect (fallback)
     * @param {number} x - X coordinate center
     * @param {number} y - Y coordinate center
     */
    createSimpleParticles(x, y) {
        // Create 8-12 simple particles
        const count = Math.floor(Math.random() * 4) + 8;
        
        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'simple-particle';
            
            // Position at center
            const angle = Math.random() * Math.PI * 2;
            const pX = x;
            const pY = y;
            
            // Style the particle
            particle.style.cssText = `
                position: absolute;
                width: ${3 + Math.random() * 5}px;
                height: ${3 + Math.random() * 5}px;
                background-color: var(--color-gold-light);
                border-radius: 50%;
                top: ${pY}px;
                left: ${pX}px;
                transform: translate(-50%, -50%) scale(0);
                opacity: 0;
                z-index: 1000;
                pointer-events: none;
            `;
            
            // Add to container
            this.particleContainer.appendChild(particle);
            
            // Animate
            setTimeout(() => {
                const distance = 30 + Math.random() * 50;
                const endX = pX + Math.cos(angle) * distance;
                const endY = pY + Math.sin(angle) * distance;
                
                particle.style.transition = `all ${0.5 + Math.random() * 0.5}s ease-out`;
                particle.style.transform = `translate(-50%, -50%) scale(1)`;
                particle.style.left = `${endX}px`;
                particle.style.top = `${endY}px`;
                particle.style.opacity = '0.7';
                
                // Fade out and remove
                setTimeout(() => {
                    particle.style.opacity = '0';
                    setTimeout(() => {
                        if (particle.parentNode) {
                            particle.parentNode.removeChild(particle);
                        }
                    }, 500);
                }, 300);
            }, Math.random() * 100);
        }
    }
    
    /**
     * Create a ripple effect on the artifact
     * @param {HTMLElement} element - The element to apply the effect to
     */
    createRippleEffect(element) {
        // Create ripple element
        const ripple = document.createElement('div');
        ripple.className = 'artifact-ripple';
        
        // Style the ripple
        ripple.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.5);
            transform: scale(0);
            opacity: 0.7;
            pointer-events: none;
        `;
        
        // Add to artifact
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Animate
        requestAnimationFrame(() => {
            ripple.style.transition = 'all 0.6s ease-out';
            ripple.style.transform = 'scale(2)';
            ripple.style.opacity = '0';
            
            // Remove after animation
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
    }

    /**
     * Create and insert Roman artifacts throughout the page
     * This method places artifacts strategically in different sections
     */
    placeArtifacts() {
        // Define placement targets for artifacts
        const placementTargets = [
            { 
                selector: '#about', 
                type: 'roman-coin',
                position: 'bottom-right',
                info: { fact: 'The profile of the emperor on Roman coins was a powerful propaganda tool.' }
            },
            { 
                selector: '#education', 
                type: 'roman-scroll',
                position: 'top-left',
                info: { fact: 'Romans wrote on wax tablets for everyday notes, which could be melted and reused.' }
            },
            { 
                selector: '#professional-experience', 
                type: 'roman-gladius',
                position: 'bottom-left',
                info: { fact: 'The gladius was so effective that many of Rome\'s enemies adopted similar sword designs.' }
            },
            { 
                selector: '#skills', 
                type: 'roman-amphora',
                position: 'top-right',
                info: { fact: 'Some Roman amphorae bore inscriptions indicating the age and quality of the wine they contained.' }
            },
            { 
                selector: '#projects', 
                type: 'roman-lamp',
                position: 'bottom-right',
                info: { fact: 'Roman lamps often featured elaborate decorative scenes depicting myths, daily life, or erotic imagery.' }
            },
            { 
                selector: '#leadership-activities', 
                type: 'roman-laurel',
                position: 'top-right',
                info: { fact: 'In ancient Rome, victorious generals celebrated with triumphs, wearing laurel wreaths as symbols of Apollo.' }
            },
            { 
                selector: '#contact', 
                type: 'roman-scroll',
                position: 'top-left',
                info: { fact: 'Romans maintained communication networks across their vast empire using a system of messengers called cursus publicus.' }
            }
        ];

        // Place artifacts in each target section
        placementTargets.forEach(target => {
            const section = document.querySelector(target.selector);
            if (!section) return; // Skip if section not found
            
            // Create artifact element
            const artifact = document.createElement('div');
            artifact.className = 'roman-artifact';
            artifact.dataset.artifactType = target.type;
            
            // Set position class
            artifact.classList.add(`position-${target.position}`);
            
            // Create the visual element (icon or image)
            const visual = document.createElement('div');
            visual.className = 'artifact-visual';
            
            // Add a descriptive aria-label
            artifact.setAttribute('aria-label', `Decorative ${this.artifactData[target.type].name} artifact. Click for more information.`);
            
            // Add tabindex for keyboard navigation
            artifact.setAttribute('tabindex', '0');
            
            // Override fact if provided
            if (target.info && target.info.fact) {
                artifact.dataset.artifactFact = target.info.fact;
            }
            
            // Add the visual to the artifact and the artifact to the section
            artifact.appendChild(visual);
            section.appendChild(artifact);
            
            // Add to artifacts array
            this.artifacts.push({
                element: artifact,
                type: target.type,
                info: {
                    ...this.artifactData[target.type],
                    ...(target.info || {})
                }
            });
        });
        
        // Re-bind events for newly created artifacts
        this.bindEvents();
    }
}

/**
 * Initialize Roman artifacts
 */
export function initRomanArtifacts() {
    const artifacts = new RomanArtifacts();
    artifacts.init();
    artifacts.placeArtifacts();
    
    return artifacts;
}