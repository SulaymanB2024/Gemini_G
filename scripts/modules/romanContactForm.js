/**
 * Roman-Styled Interactive Contact Form
 * Transforms the standard contact form into an immersive Roman experience
 * Version: 1.0
 */

class RomanContactForm {
    constructor() {
        // Form elements
        this.form = null;
        this.formFields = [];
        this.submitButton = null;
        
        // Animation state
        this.currentFieldIndex = 0;
        this.animating = false;
        this.isRevealed = false;
        
        // Interactive elements
        this.waxSeal = null;
        this.scrollContainer = null;
        
        // Configuration options
        this.options = {
            // Animation durations in ms
            scrollUnfurlDuration: 800,
            fieldAppearDuration: 400, 
            sealAnimationDuration: 1200,
            sealPressDelay: 300,
            
            // Classnames
            scrollContainerClass: 'roman-scroll-container',
            scrollParchmentClass: 'roman-scroll-parchment',
            waxSealClass: 'roman-wax-seal',
            formRevealedClass: 'form-revealed',
            fieldVisibleClass: 'field-visible',
            fieldActiveClass: 'field-active',
            formSuccessClass: 'form-success',
            formErrorClass: 'form-error',
            
            // Text content
            successMessage: 'Your message has been sealed and dispatched by the fastest courier.',
            errorMessage: 'Apologies, your message could not be delivered. Please try again.',
            
            // Enable progressive field reveal
            progressiveReveal: true,
            
            // Tablet engraving animation
            tabletEngraving: true
        };
    }
    
    /**
     * Initialize the Roman Contact Form
     */
    init() {
        // Find the contact form
        this.form = document.getElementById('contact-form');
        
        if (!this.form) {
            console.warn('Contact form not found');
            return;
        }
        
        console.log('Initializing Roman Contact Form');
        
        // Transform the form into a Roman scroll/tablet
        this.transformFormLayout();
        
        // Initialize form fields with Roman styling
        this.setupFormFields();
        
        // Create wax seal element
        this.createWaxSeal();
        
        // Setup event handlers
        this.setupEventListeners();
        
        // Add data-lighting attributes for dynamic lighting
        this.addLightingAttributes();
    }
    
    /**
     * Transform the standard form into a Roman scroll/tablet
     */
    transformFormLayout() {
        // Add Roman-styled container around the form
        const formParent = this.form.parentElement;
        
        // Create scroll container
        this.scrollContainer = document.createElement('div');
        this.scrollContainer.className = this.options.scrollContainerClass;
        
        // Create parchment element
        const parchment = document.createElement('div');
        parchment.className = this.options.scrollParchmentClass;
        
        // Move the form inside our custom containers
        formParent.insertBefore(this.scrollContainer, this.form);
        this.scrollContainer.appendChild(parchment);
        parchment.appendChild(this.form);
        
        // Add Roman-styled decorative elements
        const topRod = document.createElement('div');
        topRod.className = 'scroll-rod top-rod';
        
        const bottomRod = document.createElement('div');
        bottomRod.className = 'scroll-rod bottom-rod';
        
        // Add rods to the container
        this.scrollContainer.insertBefore(topRod, parchment);
        this.scrollContainer.appendChild(bottomRod);
        
        // Add title to the form in Roman style
        const formTitle = document.createElement('h3');
        formTitle.className = 'form-title';
        formTitle.textContent = 'Send a Message to the Senate';
        this.form.insertBefore(formTitle, this.form.firstChild);
        
        // Add form response message container
        const responseContainer = document.createElement('div');
        responseContainer.className = 'form-response';
        this.form.appendChild(responseContainer);
    }
    
    /**
     * Setup form fields with Roman styling
     */
    setupFormFields() {
        // Find all form fields
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach((input, index) => {
            // Create field wrapper
            const fieldWrapper = document.createElement('div');
            fieldWrapper.className = 'roman-field-wrapper';
            
            // If it's not already wrapped, wrap it
            if (input.parentElement.className !== 'roman-field-wrapper') {
                // Get the label if it exists
                let label = null;
                if (input.id) {
                    label = this.form.querySelector(`label[for="${input.id}"]`);
                }
                
                // Move input into wrapper
                input.parentElement.insertBefore(fieldWrapper, input);
                fieldWrapper.appendChild(input);
                
                // Move label into wrapper if it exists
                if (label) {
                    fieldWrapper.appendChild(label);
                }
            }
            
            // Add Roman-styled border decoration
            const borderDecoration = document.createElement('div');
            borderDecoration.className = 'field-border-decoration';
            fieldWrapper.appendChild(borderDecoration);
            
            // Add field number (Roman numeral)
            const fieldNumber = document.createElement('span');
            fieldNumber.className = 'field-number';
            fieldNumber.textContent = this.convertToRomanNumeral(index + 1);
            fieldWrapper.appendChild(fieldNumber);
            
            // Add tablet engraving effect if enabled
            if (this.options.tabletEngraving) {
                input.addEventListener('input', this.animateTabletEngraving.bind(this, input));
            }
            
            // Store reference to field
            this.formFields.push({
                wrapper: fieldWrapper,
                input: input,
                label: label
            });
            
            // Hide fields initially if progressive reveal is enabled
            if (this.options.progressiveReveal && index > 0) {
                fieldWrapper.style.opacity = '0';
                fieldWrapper.style.transform = 'translateY(20px)';
            } else {
                fieldWrapper.classList.add(this.options.fieldVisibleClass);
            }
        });
        
        // Find submit button and enhance it
        const submitButton = this.form.querySelector('button[type="submit"], input[type="submit"]');
        
        if (submitButton) {
            // Replace with enhanced button if it's a basic input
            if (submitButton.tagName === 'INPUT') {
                const newButton = document.createElement('button');
                newButton.type = 'submit';
                newButton.className = submitButton.className + ' roman-submit-button';
                newButton.textContent = submitButton.value || 'Submit';
                
                submitButton.parentElement.replaceChild(newButton, submitButton);
                this.submitButton = newButton;
            } else {
                submitButton.classList.add('roman-submit-button');
                this.submitButton = submitButton;
            }
            
            // Add Roman styling to button
            const buttonText = this.submitButton.textContent;
            this.submitButton.innerHTML = `
                <span class="button-text">${buttonText}</span>
                <span class="button-border"></span>
            `;
        }
        
        // Focus on first field if any exist
        if (this.formFields.length > 0) {
            this.formFields[0].wrapper.classList.add(this.options.fieldActiveClass);
            setTimeout(() => {
                this.formFields[0].input.focus();
            }, 500);
        }
    }
    
    /**
     * Create wax seal interactive element
     */
    createWaxSeal() {
        // Create seal container
        this.waxSeal = document.createElement('div');
        this.waxSeal.className = this.options.waxSealClass;
        
        // Add inner structure
        this.waxSeal.innerHTML = `
            <div class="seal-wax">
                <div class="seal-impression"></div>
            </div>
            <div class="seal-shine"></div>
        `;
        
        // Add to form
        if (this.form && this.submitButton) {
            this.form.insertBefore(this.waxSeal, this.submitButton.nextSibling);
        }
    }
    
    /**
     * Setup event listeners for form interaction
     */
    setupEventListeners() {
        if (!this.form) return;
        
        // Form submission
        this.form.addEventListener('submit', this.handleSubmit.bind(this));
        
        // Next field navigation on Enter
        this.formFields.forEach((field, index) => {
            field.input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && field.input.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    this.navigateToNextField(index);
                }
            });
            
            // Focus and blur for field highlighting
            field.input.addEventListener('focus', () => {
                field.wrapper.classList.add(this.options.fieldActiveClass);
            });
            
            field.input.addEventListener('blur', () => {
                field.wrapper.classList.remove(this.options.fieldActiveClass);
            });
        });
        
        // Initial form reveal animation
        if (!this.isRevealed) {
            setTimeout(() => {
                this.revealForm();
            }, 500);
        }
    }
    
    /**
     * Add dynamic lighting attributes to form elements
     */
    addLightingAttributes() {
        if (!this.scrollContainer) return;
        
        // Make the scroll reactive to lighting
        this.scrollContainer.setAttribute('data-lighting', 'reactive');
        
        // Make the seal reactive if it exists
        if (this.waxSeal) {
            this.waxSeal.setAttribute('data-lighting', 'reactive');
        }
    }
    
    /**
     * Animate the form reveal like a scroll unfurling
     */
    revealForm() {
        if (!this.scrollContainer || this.isRevealed) return;
        
        // Add revealed class
        this.scrollContainer.classList.add(this.options.formRevealedClass);
        
        // Set flag
        this.isRevealed = true;
        
        // Progressive field reveal
        if (this.options.progressiveReveal) {
            this.revealNextField();
        } else {
            // Show all fields at once
            this.formFields.forEach(field => {
                field.wrapper.classList.add(this.options.fieldVisibleClass);
            });
        }
    }
    
    /**
     * Progressively reveal form fields one by one
     */
    revealNextField() {
        if (this.currentFieldIndex >= this.formFields.length) return;
        
        const field = this.formFields[this.currentFieldIndex];
        
        // Make field visible
        field.wrapper.classList.add(this.options.fieldVisibleClass);
        field.wrapper.style.opacity = '1';
        field.wrapper.style.transform = 'translateY(0)';
        
        // Increment current field index
        this.currentFieldIndex++;
        
        // Continue with next field after delay
        if (this.currentFieldIndex < this.formFields.length) {
            setTimeout(() => {
                this.revealNextField();
            }, this.options.fieldAppearDuration);
        }
    }
    
    /**
     * Navigate to the next field in sequence
     * @param {number} currentIndex - Current field index
     */
    navigateToNextField(currentIndex) {
        const nextIndex = currentIndex + 1;
        
        if (nextIndex < this.formFields.length) {
            // Focus next field
            this.formFields[nextIndex].input.focus();
            
            // Ensure it's revealed
            this.formFields[nextIndex].wrapper.classList.add(this.options.fieldVisibleClass);
        } else {
            // If it's the last field, focus submit button
            if (this.submitButton) {
                this.submitButton.focus();
            }
        }
    }
    
    /**
     * Animate tablet engraving effect (for text inputs)
     * @param {HTMLElement} input - The input element
     */
    animateTabletEngraving(input) {
        // Find characters being typed
        const text = input.value;
        const lastChar = text.charAt(text.length - 1);
        
        if (!lastChar) return;
        
        // Create engraving effect element
        const engraving = document.createElement('span');
        engraving.className = 'engraving-effect';
        engraving.textContent = lastChar;
        
        // Position at cursor position (approximation)
        const textWidth = text.length * 0.5; // Rough estimation
        engraving.style.left = `calc(${textWidth}em + 20px)`;
        
        // Add to field
        input.parentElement.appendChild(engraving);
        
        // Animate then remove
        setTimeout(() => {
            engraving.remove();
        }, 1000);
    }
    
    /**
     * Handle form submission
     * @param {Event} e - Submit event
     */
    handleSubmit(e) {
        e.preventDefault();
        
        if (this.animating) return;
        this.animating = true;
        
        // Animate seal pressing
        this.animateSealPress()
            .then(() => {
                // Here we would normally submit the form via AJAX
                // For demo purposes, simulate successful submission
                this.handleSubmitSuccess();
            })
            .catch(error => {
                console.error('Form submission error:', error);
                this.handleSubmitError();
            })
            .finally(() => {
                this.animating = false;
            });
    }
    
    /**
     * Animate wax seal pressing
     * @returns {Promise} Resolves when animation completes
     */
    animateSealPress() {
        return new Promise((resolve) => {
            if (!this.waxSeal) {
                resolve();
                return;
            }
            
            // Add pressing class
            this.waxSeal.classList.add('pressing');
            
            // After delay, add pressed class
            setTimeout(() => {
                this.waxSeal.classList.add('pressed');
                
                // Complete animation after duration
                setTimeout(resolve, this.options.sealAnimationDuration);
            }, this.options.sealPressDelay);
        });
    }
    
    /**
     * Handle successful form submission
     */
    handleSubmitSuccess() {
        // Find or create response container
        let responseContainer = this.form.querySelector('.form-response');
        
        if (!responseContainer) {
            responseContainer = document.createElement('div');
            responseContainer.className = 'form-response';
            this.form.appendChild(responseContainer);
        }
        
        // Add success message
        responseContainer.innerHTML = `
            <div class="success-icon">
                <i class="fas fa-check"></i>
            </div>
            <p>${this.options.successMessage}</p>
        `;
        
        // Add success class
        this.form.classList.add(this.options.formSuccessClass);
        
        // Reset form after delay
        setTimeout(() => {
            this.form.reset();
            
            // Remove success class and message after longer delay
            setTimeout(() => {
                this.form.classList.remove(this.options.formSuccessClass);
                responseContainer.innerHTML = '';
                
                // Reset seal
                if (this.waxSeal) {
                    this.waxSeal.classList.remove('pressing', 'pressed');
                }
            }, 5000);
        }, 1000);
    }
    
    /**
     * Handle form submission error
     */
    handleSubmitError() {
        // Find or create response container
        let responseContainer = this.form.querySelector('.form-response');
        
        if (!responseContainer) {
            responseContainer = document.createElement('div');
            responseContainer.className = 'form-response';
            this.form.appendChild(responseContainer);
        }
        
        // Add error message
        responseContainer.innerHTML = `
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            <p>${this.options.errorMessage}</p>
        `;
        
        // Add error class
        this.form.classList.add(this.options.formErrorClass);
        
        // Remove error class and message after delay
        setTimeout(() => {
            this.form.classList.remove(this.options.formErrorClass);
            responseContainer.innerHTML = '';
            
            // Reset seal
            if (this.waxSeal) {
                this.waxSeal.classList.remove('pressing', 'pressed');
            }
        }, 5000);
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
 * Initialize the Roman Contact Form
 */
export function initRomanContactForm() {
    const contactForm = new RomanContactForm();
    contactForm.init();
    
    return contactForm;
}