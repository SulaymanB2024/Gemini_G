/**
 * skillEcosystem.js
 * Dynamic Skill Ecosystem Visualization
 * Enhances the relationship between skills and relevant content items
 * Version: 2.1 - Maximized Visual Effects & Stability
 */

/**
 * Creates a dynamic relationship between skills, projects, and experience items
 * beyond simple filtering. Shows connections between related skills and content.
 */
export function initSkillEcosystem() {
    // Select all skill tags that have data-skill attribute
    const skillTags = document.querySelectorAll('.skill-tag[data-skill]');
    // Select all items that can be filtered (projects, experience, etc.)
    const filterableItems = document.querySelectorAll('.experience-item, .project-item, .leadership-item, .music-item');
    
    console.log('Initializing Skill Ecosystem with:', skillTags.length, 'skills and', filterableItems.length, 'content items');
    
    // Exit if there are no skill tags or items to connect
    if (skillTags.length === 0 || filterableItems.length === 0) {
        console.warn('Skill Ecosystem: Missing skill tags or filterable items - feature disabled.');
        return;
    }

    // Create a tooltip element for displaying relationship information
    let tooltip = createEcosystemTooltip();
    
    // Initialize tracking variables
    let currentActiveSkill = null;
    const romanNumerals = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];
    
    // Create a mapping of items to their related skills for quick lookups
    const itemToSkillsMap = new Map();
    const skillToItemsMap = new Map();
    
    // Build the relationship maps
    buildRelationshipMaps();
    
    // Add Roman numeral counters to skill tags
    addRelationshipCounters();
    
    // Track if we're in flip transition to avoid click triggering during flip
    const inFlipTransition = new Map();
    
    // Add event listeners to skill tags for ecosystem interaction
    skillTags.forEach(skillTag => {
        // Get the skill name from the data attribute
        const skillName = skillTag.getAttribute('data-skill').toLowerCase();
        inFlipTransition.set(skillTag, false);
        
        // Store original event handlers to maintain compatibility with coin effect
        const originalMouseEnter = skillTag.onmouseenter;
        const originalMouseLeave = skillTag.onmouseleave;
        
        // Handle click on skill tag - highlight related items
        skillTag.addEventListener('click', (e) => {
            // Skip if this is just part of the coin flip effect
            if (skillTag.classList.contains('flipped') || inFlipTransition.get(skillTag)) {
                return;
            }
            
            const thisSkill = skillTag.getAttribute('data-skill').toLowerCase();
            
            // Toggle active state - if clicking the same skill, turn it off
            if (currentActiveSkill === thisSkill) {
                deactivateSkill();
                return;
            }
            
            // If different skill, activate the new one
            activateSkill(thisSkill, skillTag);
            
            // Add a small visual feedback for click
            skillTag.classList.add('ecosystem-clicked');
            setTimeout(() => skillTag.classList.remove('ecosystem-clicked'), 300);
        });
        
        // Track transitions for the coin effect to prevent conflicts
        skillTag.addEventListener('transitionstart', (e) => {
            if (e.target.classList.contains('coin-face-inner')) {
                inFlipTransition.set(skillTag, true);
            }
        });
        
        skillTag.addEventListener('transitionend', (e) => {
            if (e.target.classList.contains('coin-face-inner')) {
                inFlipTransition.set(skillTag, false);
            }
        });
        
        // Ensure we don't break the coin flip effect
        skillTag.addEventListener('mouseenter', (e) => {
            if (originalMouseEnter) originalMouseEnter.call(skillTag, e);
            
            // We use setTimeout to let the coin effect run first
            setTimeout(() => {
                // Show tooltip with relationship count if not in active filter mode
                if (!currentActiveSkill) {
                    const relatedCount = skillToItemsMap.get(skillName)?.length || 0;
                    if (relatedCount > 0) {
                        showSkillTooltip(skillTag, `${romanToLatin(romanNumerals[Math.min(relatedCount-1, 11)])} related items`);
                    }
                }
            }, 10);
        });
        
        skillTag.addEventListener('mouseleave', (e) => {
            if (originalMouseLeave) originalMouseLeave.call(skillTag, e);
            hideTooltip();
        });
    });
    
    // Add event listeners to filterable items for ecosystem interaction
    filterableItems.forEach(item => {
        const itemTags = getItemTags(item);
        
        // On hover, highlight related skills
        item.addEventListener('mouseenter', () => {
            if (!currentActiveSkill) { // Only if no skill is actively filtering
                highlightRelatedSkills(item);
                
                // Show tooltip with related skills
                const relatedSkills = itemToSkillsMap.get(item) || [];
                if (relatedSkills.length > 0) {
                    const skillNames = relatedSkills.map(skill => 
                        skill.charAt(0).toUpperCase() + skill.slice(1)
                    ).join(', ');
                    
                    showItemTooltip(item, `Related skills: ${skillNames}`);
                }
            }
        });
        
        // Remove highlight when mouse leaves
        item.addEventListener('mouseleave', () => {
            if (!currentActiveSkill) { // Only if no skill is actively filtering
                unhighlightAllSkills();
                hideTooltip();
            }
        });
        
        // Add keyboard accessibility
        item.setAttribute('tabindex', '0');
        item.addEventListener('focus', () => {
            if (!currentActiveSkill) {
                highlightRelatedSkills(item);
            }
        });
        
        item.addEventListener('blur', () => {
            if (!currentActiveSkill) {
                unhighlightAllSkills();
            }
        });
    });
    
    /**
     * Activates a skill, highlighting related items and dimming others
     * @param {string} skillName - The name of the skill to activate
     * @param {HTMLElement} skillTag - The skill tag element
     */
    function activateSkill(skillName, skillTag) {
        // Remove previous active skill
        if (currentActiveSkill) {
            deactivateSkill();
        }
        
        // Set new active skill
        currentActiveSkill = skillName;
        
        // Reset all skill tags and items
        skillTags.forEach(tag => tag.classList.remove('ecosystem-active'));
        filterableItems.forEach(item => {
            item.classList.remove('skill-highlight');
            item.classList.add('item-dimmed');
        });
        
        // Add active class to the selected skill tag
        skillTag.classList.add('ecosystem-active');
        
        // Don't allow coin flipping on the active skill
        skillTag.classList.add('prevent-flip');
        
        // Focus the tag for accessibility
        skillTag.focus();
        
        // Get related items and highlight them
        const relatedItems = skillToItemsMap.get(skillName) || [];
        let delay = 0;
        
        // Show "connected to X items" tooltip
        if (relatedItems.length > 0) {
            // Use setTimeout to let the visual changes start first
            setTimeout(() => {
                showSkillTooltip(
                    skillTag, 
                    `Connected to ${romanToLatin(romanNumerals[Math.min(relatedItems.length-1, 11)])} items`
                );
                
                // Auto hide after 2 seconds
                setTimeout(() => {
                    hideTooltip();
                }, 2000);
            }, 300);
        }
        
        // Add staggered animation effect
        relatedItems.forEach((item, index) => {
            // Remove dimmed class and add highlight with staggered animation
            setTimeout(() => {
                item.classList.remove('item-dimmed');
                item.classList.add('skill-highlight');
                
                // Optional: Add connection lines between skill and related items
                if (window.innerWidth > 768) { // Only on non-mobile
                    createConnectionLine(skillTag, item);
                }
            }, delay);
            
            // Increment delay for staggered effect
            delay += 75;
        });
    }
    
    /**
     * Deactivates the currently active skill
     */
    function deactivateSkill() {
        if (!currentActiveSkill) return;
        
        // Save reference to the active tag
        let activeTag = null;
        skillTags.forEach(tag => {
            if (tag.classList.contains('ecosystem-active')) {
                activeTag = tag;
            }
        });
        
        if (activeTag) {
            // Remove the prevent-flip class to re-enable coin effect
            activeTag.classList.remove('prevent-flip');
        }
        
        // Remove ecosystem-active class from all skill tags
        skillTags.forEach(tag => tag.classList.remove('ecosystem-active'));
        
        // Remove highlight/dimmed classes from all items
        filterableItems.forEach(item => {
            item.classList.remove('skill-highlight');
            item.classList.remove('item-dimmed');
        });
        
        // Remove any connection lines with fade-out effect
        document.querySelectorAll('.ecosystem-connection').forEach(conn => {
            conn.style.opacity = '0';
            setTimeout(() => conn.remove(), 300);
        });
        
        // Reset active skill
        currentActiveSkill = null;
    }
    
    /**
     * Highlights skills related to a hovered item
     * @param {HTMLElement} item - The item being hovered
     */
    function highlightRelatedSkills(item) {
        // Remove previous highlights
        unhighlightAllSkills();
        
        // Get related skills and highlight them
        const relatedSkills = itemToSkillsMap.get(item) || [];
        
        skillTags.forEach(tag => {
            const skillName = tag.getAttribute('data-skill').toLowerCase();
            if (relatedSkills.includes(skillName)) {
                tag.classList.add('tag-highlighted-by-item');
                
                // Force to front-side of coin
                const coinInner = tag.querySelector('.coin-face-inner');
                if (coinInner && coinInner.style.transform !== 'rotateY(0deg)') {
                    coinInner.style.transform = 'rotateY(0deg)';
                }
            }
        });
    }
    
    /**
     * Removes highlighting from all skill tags
     */
    function unhighlightAllSkills() {
        skillTags.forEach(tag => {
            tag.classList.remove('tag-highlighted-by-item');
            
            // Reset coin rotation if it was forced by highlighting
            if (!tag.classList.contains('flipped')) {
                const coinInner = tag.querySelector('.coin-face-inner');
                if (coinInner && coinInner.style.transform) {
                    coinInner.style.transform = '';
                }
            }
        });
    }
    
    /**
     * Creates a tooltip element for skill ecosystem interactions
     * @returns {HTMLElement} The tooltip element
     */
    function createEcosystemTooltip() {
        const tooltipEl = document.createElement('div');
        tooltipEl.className = 'ecosystem-tooltip';
        tooltipEl.setAttribute('role', 'tooltip');
        document.body.appendChild(tooltipEl);
        return tooltipEl;
    }
    
    /**
     * Shows a tooltip for a skill tag
     * @param {HTMLElement} skillTag - The skill tag element
     * @param {string} text - The text to display in the tooltip
     */
    function showSkillTooltip(skillTag, text) {
        const rect = skillTag.getBoundingClientRect();
        tooltip.textContent = text;
        
        // Wait for width calculation before positioning
        setTimeout(() => {
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.bottom + 10}px`;
            tooltip.classList.add('active');
        }, 10);
    }
    
    /**
     * Shows a tooltip for a filterable item
     * @param {HTMLElement} item - The item element
     * @param {string} text - The text to display in the tooltip
     */
    function showItemTooltip(item, text) {
        const rect = item.getBoundingClientRect();
        tooltip.textContent = text;
        
        // Wait for width calculation before positioning
        setTimeout(() => {
            tooltip.style.left = `${rect.left + rect.width / 2 - tooltip.offsetWidth / 2}px`;
            tooltip.style.top = `${rect.top - tooltip.offsetHeight - 10}px`;
            tooltip.classList.add('active');
        }, 10);
    }
    
    /**
     * Hides the tooltip
     */
    function hideTooltip() {
        tooltip.classList.remove('active');
    }
    
    /**
     * Creates an animated connection line between a skill tag and related item
     * @param {HTMLElement} skillTag - The skill tag element
     * @param {HTMLElement} item - The related item element
     */
    function createConnectionLine(skillTag, item) {
        // Calculate positions and dimensions
        const skillRect = skillTag.getBoundingClientRect();
        const itemRect = item.getBoundingClientRect();
        
        // Skip if either element is not visible
        if (skillRect.width === 0 || itemRect.width === 0) {
            return;
        }
        
        // Create line element
        const line = document.createElement('div');
        line.className = 'ecosystem-connection';
        
        // Calculate start and end points
        const scrollY = window.scrollY;
        const startX = skillRect.left + skillRect.width / 2;
        const startY = skillRect.top + skillRect.height / 2 + scrollY;
        const endX = itemRect.left + itemRect.width / 2;
        const endY = itemRect.top + itemRect.height / 2 + scrollY;
        
        // Calculate distance and angle
        const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
        const angle = Math.atan2(endY - startY, endX - startX) * 180 / Math.PI;
        
        // Apply styles
        line.style.width = `${length}px`;
        line.style.left = `${startX}px`;
        line.style.top = `${startY}px`;
        line.style.transform = `rotate(${angle}deg)`;
        line.style.opacity = '0'; // Start transparent for fade-in
        
        // Add to document then fade in
        document.body.appendChild(line);
        
        // Force layout reflow
        void line.offsetWidth;
        
        // Fade in
        line.style.opacity = '0.5';
    }
    
    /**
     * Builds relationship maps between items and skills for efficient lookups
     */
    function buildRelationshipMaps() {
        filterableItems.forEach(item => {
            const itemTags = getItemTags(item);
            
            // Store the tags for this item
            itemToSkillsMap.set(item, itemTags);
            
            // Update the items for each tag
            itemTags.forEach(tag => {
                if (!skillToItemsMap.has(tag)) {
                    skillToItemsMap.set(tag, []);
                }
                skillToItemsMap.get(tag).push(item);
            });
        });
        
        // Log stats for debugging
        console.log('Skill Ecosystem: Built relationship maps between', 
            itemToSkillsMap.size, 'items and', skillToItemsMap.size, 'skills');
    }
    
    /**
     * Adds Roman numeral counters to skill tags showing the number of related items
     */
    function addRelationshipCounters() {
        skillTags.forEach(tag => {
            const skillName = tag.getAttribute('data-skill').toLowerCase();
            const relatedItems = skillToItemsMap.get(skillName) || [];
            
            if (relatedItems.length > 0) {
                // Create counter element
                const counter = document.createElement('span');
                counter.className = 'ecosystem-related-count';
                counter.textContent = romanNumerals[Math.min(relatedItems.length - 1, 11)];
                tag.appendChild(counter);
                
                // Add ARIA for accessibility
                tag.setAttribute('aria-label', 
                    `${tag.textContent.trim()} - Related to ${relatedItems.length} items`);
            }
        });
    }
    
    /**
     * Gets the tags for an item from its data-tags attribute
     * @param {HTMLElement} item - The item element
     * @returns {Array<string>} Array of tag names
     */
    function getItemTags(item) {
        const tagsAttribute = item.getAttribute('data-tags');
        if (!tagsAttribute) return [];
        
        // Split by whitespace or commas and convert to lowercase for consistency
        return tagsAttribute.toLowerCase().split(/[\s,]+/).filter(tag => tag.length > 0);
    }
    
    /**
     * Converts a Roman numeral to its Latin number equivalent
     * @param {string} roman - Roman numeral to convert
     * @returns {number} Equivalent Latin number
     */
    function romanToLatin(roman) {
        const romanValues = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000
        };
        
        let result = 0;
        
        for (let i = 0; i < roman.length; i++) {
            const current = romanValues[roman[i]];
            const next = romanValues[roman[i + 1]];
            
            if (next && current < next) {
                result += next - current;
                i++;
            } else {
                result += current;
            }
        }
        
        return result;
    }
    
    // Window resize handler to update connection lines
    window.addEventListener('resize', () => {
        if (currentActiveSkill) {
            // Remove existing lines
            document.querySelectorAll('.ecosystem-connection').forEach(conn => conn.remove());
            
            // Recreate lines after a short delay
            setTimeout(() => {
                const activeTag = document.querySelector('.ecosystem-active');
                const relatedItems = document.querySelectorAll('.skill-highlight');
                
                if (activeTag && relatedItems.length > 0) {
                    relatedItems.forEach(item => {
                        if (window.innerWidth > 768) { // Only on non-mobile
                            createConnectionLine(activeTag, item);
                        }
                    });
                }
            }, 200);
        }
    });
}