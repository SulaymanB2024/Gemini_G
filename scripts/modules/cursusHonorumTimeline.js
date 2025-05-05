/**
 * Cursus Honorum Timeline Module
 * Transforms the experience section into an interactive horizontal timeline
 * resembling a Roman road or aqueduct with milestone markers for each role
 * Version: 1.0
 */

class CursusHonorumTimeline {
    constructor() {
        this.timelineContainer = null;
        this.milestones = [];
        this.currentlyExpanded = null;
        this.options = {
            animationDuration: 300, // ms
            scrollBehavior: 'smooth',
            useRomanNumerals: true
        };
    }

    /**
     * Initialize the timeline
     */
    init() {
        // Find experience section
        const experienceSection = document.querySelector('.experience-section');
        if (!experienceSection) {
            console.warn('Experience section not found');
            return;
        }

        // Create timeline structure
        this.createTimelineStructure(experienceSection);
        
        // Convert experience items to milestones
        this.convertExperienceItemsToMilestones(experienceSection);
        
        // Add event listeners to milestones
        this.addEventListeners();
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup intersection observer for entry animations
        this.setupIntersectionObserver();
        
        console.log('Cursus Honorum Timeline initialized');
    }

    /**
     * Create the main timeline structure
     * @param {HTMLElement} experienceSection - The experience section element
     */
    createTimelineStructure(experienceSection) {
        // Create container elements
        const timelineWrapperOuter = document.createElement('div');
        timelineWrapperOuter.className = 'cursus-honorum-wrapper';
        
        const timelineWrapper = document.createElement('div');
        timelineWrapper.className = 'cursus-honorum-scroller';
        
        // Create timeline track (road/aqueduct visual)
        const timelineTrack = document.createElement('div');
        timelineTrack.className = 'cursus-honorum-track';
        
        // Create timeline milestones container
        const timelineContainer = document.createElement('div');
        timelineContainer.className = 'cursus-honorum-timeline';
        timelineContainer.setAttribute('role', 'list');
        timelineContainer.setAttribute('aria-label', 'Professional Experience Timeline');
        
        // Store reference to the timeline container
        this.timelineContainer = timelineContainer;
        
        // Add decorative elements
        const leftColumn = document.createElement('div');
        leftColumn.className = 'cursus-column left-column';
        
        const rightColumn = document.createElement('div');
        rightColumn.className = 'cursus-column right-column';
        
        // Assemble the structure
        timelineWrapper.appendChild(leftColumn);
        timelineWrapper.appendChild(timelineTrack);
        timelineWrapper.appendChild(timelineContainer);
        timelineWrapper.appendChild(rightColumn);
        timelineWrapperOuter.appendChild(timelineWrapper);
        
        // Find the experience items container
        const experienceItems = experienceSection.querySelector('.experience-items');
        
        // If found, replace it with timeline, otherwise append to section
        if (experienceItems) {
            experienceSection.replaceChild(timelineWrapperOuter, experienceItems);
        } else {
            // Find section title and insert after it
            const sectionTitle = experienceSection.querySelector('.section-title');
            if (sectionTitle) {
                experienceSection.insertBefore(timelineWrapperOuter, sectionTitle.nextSibling);
            } else {
                experienceSection.appendChild(timelineWrapperOuter);
            }
        }
        
        // Add scroll indicators
        const scrollIndicatorLeft = document.createElement('button');
        scrollIndicatorLeft.className = 'timeline-scroll-indicator left';
        scrollIndicatorLeft.setAttribute('aria-label', 'Scroll timeline left');
        scrollIndicatorLeft.innerHTML = '<i class="fas fa-chevron-left"></i>';
        
        const scrollIndicatorRight = document.createElement('button');
        scrollIndicatorRight.className = 'timeline-scroll-indicator right';
        scrollIndicatorRight.setAttribute('aria-label', 'Scroll timeline right');
        scrollIndicatorRight.innerHTML = '<i class="fas fa-chevron-right"></i>';
        
        timelineWrapperOuter.appendChild(scrollIndicatorLeft);
        timelineWrapperOuter.appendChild(scrollIndicatorRight);
        
        // Add event listeners to scroll indicators
        scrollIndicatorLeft.addEventListener('click', () => this.scrollTimeline('left'));
        scrollIndicatorRight.addEventListener('click', () => this.scrollTimeline('right'));
    }

    /**
     * Convert existing experience items to timeline milestones
     * @param {HTMLElement} experienceSection - The experience section element
     */
    convertExperienceItemsToMilestones(experienceSection) {
        // Find all experience items in the original structure
        const experienceItems = experienceSection.querySelectorAll('.experience-item');
        
        if (!experienceItems.length) {
            console.warn('No experience items found');
            return;
        }
        
        // Process each experience item
        experienceItems.forEach((item, index) => {
            // Extract data from experience item
            const title = item.querySelector('.experience-title')?.textContent || '';
            const company = item.querySelector('.experience-company')?.textContent || '';
            const date = item.querySelector('.experience-date')?.textContent || '';
            const description = item.querySelector('.experience-description')?.innerHTML || '';
            
            // Get skills/tags if they exist
            const tags = [];
            const skillTags = item.querySelectorAll('.skill-tag');
            skillTags.forEach(tag => {
                tags.push({
                    text: tag.textContent,
                    skill: tag.dataset.skill || ''
                });
            });
            
            // Create milestone element
            const milestone = document.createElement('div');
            milestone.className = 'timeline-milestone';
            milestone.setAttribute('role', 'listitem');
            milestone.setAttribute('tabindex', '0');
            milestone.dataset.index = index;
            
            // Add Roman numeral if option is enabled
            let yearNumber = '';
            if (this.options.useRomanNumerals) {
                // Extract year from date if possible
                const yearMatch = date.match(/\b(19|20)\d{2}\b/);
                if (yearMatch) {
                    const year = parseInt(yearMatch[0]);
                    yearNumber = this.convertToRomanNumeral(year);
                } else {
                    // Use milestone index if no year found
                    yearNumber = this.convertToRomanNumeral(index + 1);
                }
            }
            
            // Create milestone content
            milestone.innerHTML = `
                <div class="milestone-marker">
                    <div class="marker-plinth"></div>
                    <div class="marker-pillar"></div>
                    <div class="marker-top"></div>
                    <span class="milestone-year">${yearNumber}</span>
                </div>
                <div class="milestone-content">
                    <div class="milestone-header">
                        <h3 class="milestone-title">${title}</h3>
                        <div class="milestone-company">${company}</div>
                        <div class="milestone-date">${date}</div>
                    </div>
                    <div class="milestone-details">
                        <div class="milestone-description">${description}</div>
                        ${tags.length ? `
                            <div class="milestone-skills">
                                ${tags.map(tag => `
                                    <span class="skill-tag" data-skill="${tag.skill}">${tag.text}</span>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            `;
            
            // Add to timeline container
            this.timelineContainer.appendChild(milestone);
            
            // Store reference to milestone
            this.milestones.push(milestone);
        });
    }

    /**
     * Add event listeners to milestones
     */
    addEventListeners() {
        this.milestones.forEach(milestone => {
            // Click to expand/collapse
            milestone.addEventListener('click', () => this.toggleMilestone(milestone));
            
            // Mouse enter/leave for hover effects
            milestone.addEventListener('mouseenter', () => this.highlightMilestone(milestone));
            milestone.addEventListener('mouseleave', () => this.unhighlightMilestone(milestone));
        });
    }

    /**
     * Setup keyboard navigation for accessibility
     */
    setupKeyboardNavigation() {
        this.milestones.forEach(milestone => {
            milestone.addEventListener('keydown', (e) => {
                switch (e.key) {
                    case 'Enter':
                    case ' ':
                        e.preventDefault();
                        this.toggleMilestone(milestone);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.focusNextMilestone(milestone);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.focusPrevMilestone(milestone);
                        break;
                }
            });
        });
    }

    /**
     * Setup intersection observer for entry animations
     */
    setupIntersectionObserver() {
        const options = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                    observer.unobserve(entry.target);
                }
            });
        }, options);
        
        // Observe each milestone
        this.milestones.forEach(milestone => {
            observer.observe(milestone);
        });
    }

    /**
     * Toggle milestone expanded state
     * @param {HTMLElement} milestone - The milestone element to toggle
     */
    toggleMilestone(milestone) {
        // If this milestone is already expanded, collapse it
        if (milestone.classList.contains('expanded')) {
            milestone.classList.remove('expanded');
            milestone.setAttribute('aria-expanded', 'false');
            this.currentlyExpanded = null;
            return;
        }
        
        // Collapse currently expanded milestone if any
        if (this.currentlyExpanded) {
            this.currentlyExpanded.classList.remove('expanded');
            this.currentlyExpanded.setAttribute('aria-expanded', 'false');
        }
        
        // Expand this milestone
        milestone.classList.add('expanded');
        milestone.setAttribute('aria-expanded', 'true');
        this.currentlyExpanded = milestone;
        
        // Ensure milestone is properly visible by scrolling it into center view
        this.scrollMilestoneIntoView(milestone);
    }

    /**
     * Highlight milestone on hover
     * @param {HTMLElement} milestone - The milestone element to highlight
     */
    highlightMilestone(milestone) {
        milestone.classList.add('hover');
    }

    /**
     * Remove highlight from milestone
     * @param {HTMLElement} milestone - The milestone element to unhighlight
     */
    unhighlightMilestone(milestone) {
        milestone.classList.remove('hover');
    }

    /**
     * Focus the next milestone
     * @param {HTMLElement} currentMilestone - The currently focused milestone
     */
    focusNextMilestone(currentMilestone) {
        const currentIndex = parseInt(currentMilestone.dataset.index);
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < this.milestones.length) {
            this.milestones[nextIndex].focus();
            this.scrollMilestoneIntoView(this.milestones[nextIndex]);
        }
    }

    /**
     * Focus the previous milestone
     * @param {HTMLElement} currentMilestone - The currently focused milestone
     */
    focusPrevMilestone(currentMilestone) {
        const currentIndex = parseInt(currentMilestone.dataset.index);
        const prevIndex = currentIndex - 1;
        
        if (prevIndex >= 0) {
            this.milestones[prevIndex].focus();
            this.scrollMilestoneIntoView(this.milestones[prevIndex]);
        }
    }

    /**
     * Scroll timeline in the specified direction
     * @param {string} direction - Direction to scroll ('left' or 'right')
     */
    scrollTimeline(direction) {
        const timeline = this.timelineContainer.parentElement;
        const scrollAmount = timeline.clientWidth / 2;
        
        if (direction === 'left') {
            timeline.scrollBy({
                left: -scrollAmount,
                behavior: this.options.scrollBehavior
            });
        } else {
            timeline.scrollBy({
                left: scrollAmount,
                behavior: this.options.scrollBehavior
            });
        }
    }

    /**
     * Scroll milestone into center view
     * @param {HTMLElement} milestone - The milestone to scroll into view
     */
    scrollMilestoneIntoView(milestone) {
        const timeline = this.timelineContainer.parentElement;
        const milestoneRect = milestone.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();
        
        // Calculate desired scroll position to center the milestone
        const desiredScrollLeft = (
            timeline.scrollLeft + 
            milestoneRect.left - 
            timelineRect.left - 
            timelineRect.width / 2 + 
            milestoneRect.width / 2
        );
        
        // Scroll to center the milestone
        timeline.scrollTo({
            left: desiredScrollLeft,
            behavior: this.options.scrollBehavior
        });
    }

    /**
     * Convert a number to Roman numerals
     * @param {number} num - The number to convert
     * @return {string} The Roman numeral representation
     */
    convertToRomanNumeral(num) {
        if (!num) return '';
        
        const romanNumerals = [
            { value: 1000, symbol: 'M' },
            { value: 900, symbol: 'CM' },
            { value: 500, symbol: 'D' },
            { value: 400, symbol: 'CD' },
            { value: 100, symbol: 'C' },
            { value: 90, symbol: 'XC' },
            { value: 50, symbol: 'L' },
            { value: 40, symbol: 'XL' },
            { value: 10, symbol: 'X' },
            { value: 9, symbol: 'IX' },
            { value: 5, symbol: 'V' },
            { value: 4, symbol: 'IV' },
            { value: 1, symbol: 'I' }
        ];
        
        let result = '';
        let remaining = num;
        
        for (const { value, symbol } of romanNumerals) {
            while (remaining >= value) {
                result += symbol;
                remaining -= value;
            }
        }
        
        return result;
    }
}

/**
 * Initialize the Cursus Honorum Timeline
 */
export function initCursusHonorumTimeline() {
    const timeline = new CursusHonorumTimeline();
    timeline.init();
    
    return timeline;
}