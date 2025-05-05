/**
 * parallaxEffects.js
 * Implements various parallax scrolling effects for the portfolio.
 * Version: 3.0 - Enhanced with depth layers, performance optimizations, and Roman-themed decorative elements
 */

/**
 * Initializes parallax scrolling effects throughout the site.
 * Handles multi-layered parallax in hero section and scrolling effects for other sections.
 */
export default function initParallaxEffects() {
    // Performance optimizations - Use requestAnimationFrame for smooth animations
    let ticking = false;
    let lastKnownScrollPosition = window.scrollY;
    let lastKnownMousePosition = { x: 0, y: 0 };
    
    // Get references to parallax containers
    const heroSection = document.querySelector('.hero-section');
    const parallaxContainers = document.querySelectorAll('.hero-parallax-container');
    
    // Early exit if key elements not found
    if (!heroSection) {
        console.warn('Hero section not found. Parallax effects disabled.');
        return;
    }
    
    // Initialize section parallax effects
    initSectionParallax();
    
    // Set up intersection observer for performance optimization
    const observerOptions = {
        root: null, // viewport
        rootMargin: '100px', // slightly larger than viewport
        threshold: 0.1 // trigger when at least 10% visible
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Only apply parallax effects to visible sections
            if (entry.isIntersecting) {
                entry.target.classList.add('parallax-active');
                updateParallaxSection(entry.target, lastKnownScrollPosition);
            } else {
                entry.target.classList.remove('parallax-active');
            }
        });
    }, observerOptions);
    
    // Observe all sections with parallax
    document.querySelectorAll('.scroll-trigger-section').forEach(section => {
        sectionObserver.observe(section);
    });
    
    // Set up passive scroll event listener for better performance
    window.addEventListener('scroll', () => {
        lastKnownScrollPosition = window.scrollY;
        
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateParallaxElements(lastKnownScrollPosition);
                ticking = false;
            });
            
            ticking = true;
        }
    }, { passive: true });
    
    // Set up resize event listener with debounce
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate parallax positions on resize
            updateParallaxElements(lastKnownScrollPosition);
        }, 100);
    });
    
    // Optional: Add mousemove listener for interactive parallax
    if (window.innerWidth > 768 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        heroSection.addEventListener('mousemove', (e) => {
            lastKnownMousePosition = { x: e.clientX, y: e.clientY };
            
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    handleMouseMove(lastKnownMousePosition, heroSection);
                    ticking = false;
                });
                
                ticking = true;
            }
        }, { passive: true });
    }
    
    // Initial update
    updateParallaxElements(lastKnownScrollPosition);
}

/**
 * Updates all parallax elements based on scroll position
 */
function updateParallaxElements(scrollTop) {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return; // Exit early if user prefers reduced motion
    }
    
    // Update hero parallax
    const heroSection = document.querySelector('.hero-section');
    if (heroSection && heroSection.classList.contains('parallax-active')) {
        updateHeroParallax(heroSection, scrollTop);
    }
    
    // Update all active parallax sections
    document.querySelectorAll('.scroll-trigger-section.parallax-active').forEach(section => {
        updateParallaxSection(section, scrollTop);
    });
}

/**
 * Updates parallax effects for the hero section
 */
function updateHeroParallax(heroSection, scrollTop) {
    const viewportHeight = window.innerHeight;
    const heroRect = heroSection.getBoundingClientRect();
    const heroHeight = heroSection.offsetHeight;
    const heroTop = heroRect.top + scrollTop;
    
    // Calculate how much of the hero is visible (0 to 1)
    const visibleRatio = Math.min(1, Math.max(0, 
        (scrollTop + viewportHeight - heroTop) / (heroHeight + viewportHeight)
    ));
    
    // Calculate scroll progress for hero section (0 when at top, 1 when scrolled past)
    const scrollProgress = Math.min(1, Math.max(0, scrollTop / heroHeight));
    
    // Apply parallax to layers
    const parallaxLayers = heroSection.querySelectorAll('.parallax-layer');
    
    parallaxLayers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || 0.1);
        const translateY = -scrollProgress * depth * 100;
        
        // Apply transform with hardware acceleration
        layer.style.transform = `translate3d(0, ${translateY}px, 0)`;
        
        // Adjust opacity based on scroll progress
        if (scrollProgress > 0.2) {
            layer.style.opacity = Math.max(0, 1 - ((scrollProgress - 0.2) * 2));
        }
    });
    
    // Apply effects to hero content
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
        // Fade out and move up hero content as user scrolls down
        heroContent.style.opacity = Math.max(0, 1 - (scrollProgress * 2));
        heroContent.style.transform = `translate3d(0, ${scrollProgress * -50}px, 0)`;
    }
    
    // Apply effects to decorative elements
    const decorations = heroSection.querySelectorAll('.parallax-decoration');
    decorations.forEach(decoration => {
        const depth = parseFloat(decoration.dataset.depth || 0.2);
        
        // Different transforms based on the decoration type
        if (decoration.classList.contains('eagle')) {
            decoration.style.transform = `translate3d(${scrollProgress * 100}px, ${-scrollProgress * depth * 200}px, 0) rotate(${scrollProgress * 10}deg)`;
        } else if (decoration.classList.contains('seal')) {
            decoration.style.transform = `translate3d(${-scrollProgress * 150}px, ${-scrollProgress * depth * 150}px, 0) rotate(${-scrollProgress * 20}deg)`;
        } else if (decoration.classList.contains('scroll')) {
            decoration.style.transform = `translate3d(${scrollProgress * -120}px, ${-scrollProgress * depth * 180}px, 0) rotate(${-scrollProgress * 15}deg)`;
        } else if (decoration.classList.contains('laurel')) {
            // Check if it's left or right laurel
            const isLeft = decoration.classList.contains('roman-laurel-left');
            const xDirection = isLeft ? -1 : 1;
            decoration.style.transform = `translate3d(${xDirection * scrollProgress * 200}px, ${-scrollProgress * depth * 160}px, 0) rotate(${xDirection * scrollProgress * -15}deg)`;
        }
        
        // Adjust opacity
        decoration.style.opacity = Math.max(0, 1 - (scrollProgress * 2.5));
    });
    
    // Apply effects to pillars
    const pillars = heroSection.querySelectorAll('.parallax-pillar');
    pillars.forEach(pillar => {
        const isLeft = pillar.classList.contains('left');
        const moveDirection = isLeft ? -1 : 1;
        
        // Move pillars out as user scrolls
        pillar.style.transform = `translate3d(${moveDirection * scrollProgress * 100}px, 0, 0)`;
    });
}

/**
 * Updates parallax effects for a specific section
 */
function updateParallaxSection(section, scrollTop) {
    const viewportHeight = window.innerHeight;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + scrollTop;
    const sectionHeight = rect.height;
    
    // Calculate section visibility (0 when out of viewport, 1 when fully in viewport)
    // This creates a "window" where the section is considered visible
    const sectionProgress = Math.min(1, Math.max(0, 
        (scrollTop + viewportHeight - sectionTop) / (sectionHeight + viewportHeight)
    ));
    
    // Calculate how far the section is through the viewport
    const scrollRatio = (rect.top) / viewportHeight;
    
    // Select elements with data-parallax attribute
    const parallaxElements = section.querySelectorAll('[data-parallax]');
    parallaxElements.forEach(element => {
        const speed = parseFloat(element.dataset.parallaxSpeed || 0.2);
        const direction = element.dataset.parallaxDirection || 'up';
        
        // Skip if element is not marked for parallax
        if (!element.dataset.parallax) return;
        
        // Apply parallax effect based on direction
        if (direction === 'up' || direction === 'down') {
            const translateY = scrollRatio * speed * (direction === 'up' ? -100 : 100);
            element.style.transform = `translate3d(0, ${translateY}px, 0)`;
        } else if (direction === 'left' || direction === 'right') {
            const translateX = scrollRatio * speed * (direction === 'left' ? -100 : 100);
            element.style.transform = `translate3d(${translateX}px, 0, 0)`;
        } else if (direction === 'fade') {
            // Fade effect - most visible when in center of viewport
            const centerPoint = 0.5; // middle of viewport
            const distance = Math.abs(scrollRatio - centerPoint);
            const opacity = Math.max(0, 1 - (distance * speed * 4));
            element.style.opacity = opacity;
        } else if (direction === 'scale') {
            // Scale effect - grows as it enters viewport
            const scale = 0.8 + (sectionProgress * 0.2 * speed);
            element.style.transform = `scale3d(${scale}, ${scale}, 1)`;
        } else if (direction === 'rotate') {
            // Rotation effect - rotates as it enters viewport
            const rotation = scrollRatio * speed * 10;
            element.style.transform = `rotate(${rotation}deg)`;
        }
    });
    
    // Animate entrance for elements with fade-in-sequence class
    const fadeInElements = section.querySelectorAll('.fade-in-sequence > *');
    fadeInElements.forEach((element, index) => {
        // Only apply when section is entering viewport
        if (sectionProgress > 0.1) {
            const delay = index * 0.15; // stagger the animations
            const elementProgress = Math.min(1, Math.max(0, (sectionProgress - 0.1 - delay) * 2));
            
            element.style.opacity = elementProgress;
            element.style.transform = `translate3d(0, ${(1 - elementProgress) * 30}px, 0)`;
        } else {
            element.style.opacity = 0;
            element.style.transform = 'translate3d(0, 30px, 0)';
        }
    });
}

/**
 * Handles mouse move events for interactive parallax
 */
function handleMouseMove(mousePosition, heroSection) {
    // Skip if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        return;
    }
    
    const rect = heroSection.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the hero section
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Calculate normalized offsets (-1 to 1)
    const offsetX = (mousePosition.x - centerX) / (rect.width / 2);
    const offsetY = (mousePosition.y - centerY) / (rect.height / 2);
    
    // Apply subtle movements to parallax layers
    const parallaxLayers = heroSection.querySelectorAll('.parallax-layer');
    parallaxLayers.forEach(layer => {
        const depth = parseFloat(layer.dataset.depth || 0.1);
        const moveX = -offsetX * depth * 20; // Horizontal movement, inverted for natural feel
        const moveY = -offsetY * depth * 20; // Vertical movement, inverted for natural feel
        
        // Apply transform with hardware acceleration
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });
    
    // Apply subtle movement to decorative elements
    const decorations = heroSection.querySelectorAll('.parallax-decoration');
    decorations.forEach(decoration => {
        const depth = parseFloat(decoration.dataset.depth || 0.2);
        const moveX = -offsetX * depth * 30;
        const moveY = -offsetY * depth * 30;
        const rotate = (offsetX * 5) + (offsetY * 2);
        
        decoration.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) rotate(${rotate}deg)`;
    });
    
    // Subtle effect on hero content
    const heroContent = heroSection.querySelector('.hero-content');
    if (heroContent) {
        const moveX = -offsetX * 5; // Subtle horizontal movement
        const moveY = -offsetY * 5; // Subtle vertical movement
        
        heroContent.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    }
}

/**
 * Initializes parallax elements in specific sections
 */
function initSectionParallax() {
    // Add data-parallax attributes to elements that should have parallax effects
    
    // Projects section
    const projectsSection = document.getElementById('projects');
    if (projectsSection) {
        // Add parallax to project cards
        const projectCards = projectsSection.querySelectorAll('.project-item');
        projectCards.forEach((card, index) => {
            // Add staggered parallax effect to cards
            card.setAttribute('data-parallax', 'true');
            card.setAttribute('data-parallax-speed', 0.1 + (index * 0.02));
            card.setAttribute('data-parallax-direction', 'up');
        });
    }
    
    // Skills section
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        // Add parallax to skill categories
        const skillCategories = skillsSection.querySelectorAll('.skill-category');
        skillCategories.forEach((category, index) => {
            category.setAttribute('data-parallax', 'true');
            category.setAttribute('data-parallax-speed', 0.15);
            category.setAttribute('data-parallax-direction', index % 2 === 0 ? 'left' : 'right');
        });
    }
}