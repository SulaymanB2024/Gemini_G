/**
 * formValidation.js
 * Enhanced form validation functionality with Roman-themed interactive elements
 * Version: 4.0 (Roman Interactive)
 */

// Import utility functions if needed
import { debounce } from '../utils/helpers.js';

/**
 * Initialize form validation for all forms with the data-validate attribute
 */
export function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        // Initialize Roman scroll decoration
        if (form.classList.contains('form-roman')) {
            initRomanScrollDecoration(form);
        }
        
        // Add wax seal effect to submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) {
            initWaxSealEffect(submitBtn);
        }
        
        // Initialize Roman ink effects
        initRomanInkEffects(form);
        
        const fields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
        
        // Add validation on blur for each field
        fields.forEach(field => {
            // Set initial field state with decorative classes
            initializeField(field);
            
            field.addEventListener('blur', () => {
                validateField(field);
            });
            
            // Add interactive focus effects
            field.addEventListener('focus', () => {
                handleFieldFocus(field);
            });
            
            // Clear error state when user starts typing again
            field.addEventListener('input', () => {
                const errorElement = field.nextElementSibling;
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = '';
                }
                field.classList.remove('invalid');
                
                // Add the "writing" animation effect
                field.classList.add('roman-writing');
            });
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Simulate Roman tablet impression before validation
            simulateTabletImpression(form);
            
            setTimeout(() => {
                // Validate all fields on submit
                if (validateForm(form)) {
                    // Show the wax seal animation on successful validation
                    const submitBtn = form.querySelector('button[type="submit"]');
                    if (submitBtn && submitBtn.classList.contains('wax-seal-btn')) {
                        activateWaxSeal(submitBtn);
                    }
                    
                    // Delayed submit for animation to complete
                    setTimeout(() => {
                        // Check if the form should be submitted via AJAX
                        if (form.dataset.ajax === 'true') {
                            submitFormViaAjax(form);
                        } else {
                            // Regular form submit
                            form.submit();
                        }
                    }, 1000);
                } else {
                    // Focus on the first invalid field for better UX
                    const firstInvalidField = form.querySelector('.invalid');
                    if (firstInvalidField) {
                        firstInvalidField.focus();
                        // Scroll effect to the invalid field
                        scrollToField(firstInvalidField);
                    }
                    
                    // Show error feedback with Roman-styled message
                    showFormFeedback(form, 'error', 'Non possumus procedere. Corrige errores, quaeso.', 'Please correct the errors in the form.');
                }
            }, 800);
        });
    });
}

/**
 * Initialize a form field with Roman-themed decorative elements
 * @param {HTMLElement} field - Form field to initialize
 */
function initializeField(field) {
    // Add appropriate Roman-styled classes
    field.classList.add('field-roman');
    
    // Add Roman-themed icon if parent has icon class
    const fieldParent = field.closest('.form-group-icon');
    if (fieldParent && !fieldParent.querySelector('.field-icon')) {
        const iconType = determineFieldIconType(field);
        
        const iconElement = document.createElement('span');
        iconElement.className = `field-icon roman-icon roman-icon-${iconType}`;
        iconElement.setAttribute('aria-hidden', 'true');
        
        // Insert icon before the field
        field.insertAdjacentElement('beforebegin', iconElement);
    }
    
    // Add decorative corners to create a Roman tablet look
    addDecorativeCorners(field);
}

/**
 * Determine appropriate icon type based on field type
 * @param {HTMLElement} field - Form field
 * @returns {string} - Icon type identifier
 */
function determineFieldIconType(field) {
    const type = field.type || '';
    const name = field.name || '';
    const id = field.id || '';
    
    // Determine icon based on field attributes
    if (type === 'email' || name.includes('email') || id.includes('email')) {
        return 'scroll';
    } else if (type === 'tel' || name.includes('phone') || id.includes('phone')) {
        return 'amphora';
    } else if (type === 'textarea' || field.tagName === 'TEXTAREA' || id.includes('message')) {
        return 'tablet';
    } else if (type === 'password' || name.includes('password')) {
        return 'key';
    } else if (name.includes('name') || id.includes('name')) {
        return 'laurel';
    } else {
        return 'stylus';
    }
}

/**
 * Add decorative corners to form fields for Roman tablet appearance
 * @param {HTMLElement} field - Form field
 */
function addDecorativeCorners(field) {
    const fieldContainer = document.createElement('div');
    fieldContainer.className = 'field-roman-container';
    
    // Wrap field in container
    field.parentNode.insertBefore(fieldContainer, field);
    fieldContainer.appendChild(field);
    
    // Add corner decorations
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    corners.forEach(position => {
        const corner = document.createElement('span');
        corner.className = `field-corner field-corner-${position}`;
        fieldContainer.appendChild(corner);
    });
}

/**
 * Handle field focus with Roman-themed effects
 * @param {HTMLElement} field - Form field
 */
function handleFieldFocus(field) {
    // Remove writing class first (if exists from previous input)
    field.classList.remove('roman-writing');
    
    // Add focus effect
    field.classList.add('field-focus');
    
    // Find parent container
    const container = field.closest('.field-roman-container');
    if (container) {
        container.classList.add('container-focus');
    }
    
    // Add light glow effect to field icon
    const fieldParent = field.closest('.form-group-icon');
    if (fieldParent) {
        const icon = fieldParent.querySelector('.field-icon');
        if (icon) {
            icon.classList.add('icon-glow');
        }
    }
}

/**
 * Initialize Roman scroll decoration for form
 * @param {HTMLElement} form - Form element
 */
function initRomanScrollDecoration(form) {
    // Create scroll decorations
    const scrollTop = document.createElement('div');
    scrollTop.className = 'roman-scroll-decoration roman-scroll-top';
    
    const scrollBottom = document.createElement('div');
    scrollBottom.className = 'roman-scroll-decoration roman-scroll-bottom';
    
    // Add decorative scroll handles
    for (let i = 0; i < 2; i++) {
        const handleTop = document.createElement('div');
        handleTop.className = 'scroll-handle';
        scrollTop.appendChild(handleTop);
        
        const handleBottom = document.createElement('div');
        handleBottom.className = 'scroll-handle';
        scrollBottom.appendChild(handleBottom);
    }
    
    // Insert into form
    form.insertAdjacentElement('afterbegin', scrollTop);
    form.insertAdjacentElement('afterend', scrollBottom);
    
    // Add scroll animation effect on form interaction
    form.addEventListener('click', () => {
        scrollTop.classList.add('scroll-animate');
        scrollBottom.classList.add('scroll-animate');
        
        setTimeout(() => {
            scrollTop.classList.remove('scroll-animate');
            scrollBottom.classList.remove('scroll-animate');
        }, 1000);
    });
}

/**
 * Initialize wax seal effect for submit button
 * @param {HTMLElement} button - Submit button 
 */
function initWaxSealEffect(button) {
    // Add wax seal classes
    button.classList.add('wax-seal-btn');
    
    // Create wax seal element
    const waxSeal = document.createElement('span');
    waxSeal.className = 'wax-seal';
    
    // Create seal impression element
    const sealImpression = document.createElement('span');
    sealImpression.className = 'seal-impression';
    sealImpression.innerHTML = 'SPQR';
    
    // Append elements
    waxSeal.appendChild(sealImpression);
    button.appendChild(waxSeal);
    
    // Store original button text
    const originalText = button.textContent.trim();
    button.setAttribute('data-original-text', originalText);
    
    // Add initial animation on page load
    setTimeout(() => {
        button.classList.add('seal-init');
        setTimeout(() => {
            button.classList.remove('seal-init');
        }, 1000);
    }, 1000);
}

/**
 * Activate wax seal animation on submit
 * @param {HTMLElement} button - Submit button with wax seal
 */
function activateWaxSeal(button) {
    // Add active animation class
    button.classList.add('seal-active');
    
    // Change button text to Latin phrase for "Sealed"
    button.querySelector('.seal-impression').innerHTML = 'SPQR';
    
    // Create decorative elements (animated particles)
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('span');
        particle.className = 'seal-particle';
        particle.style.setProperty('--delay', `${i * 0.1}s`);
        button.appendChild(particle);
    }
}

/**
 * Initialize Roman ink effects on form fields
 * @param {HTMLElement} form - Form element
 */
function initRomanInkEffects(form) {
    const textInputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea');
    
    textInputs.forEach(input => {
        // Add ink drop animation on click
        input.addEventListener('click', (e) => {
            const rect = input.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Create ink drop
            const ink = document.createElement('span');
            ink.className = 'ink-effect';
            ink.style.left = `${x}px`;
            ink.style.top = `${y}px`;
            
            // Add to input's parent container
            const container = input.closest('.field-roman-container') || input.parentElement;
            container.appendChild(ink);
            
            // Remove after animation completes
            setTimeout(() => {
                ink.remove();
            }, 700);
        });
    });
}

/**
 * Simulate Roman tablet impression effect
 * @param {HTMLElement} form - Form element
 */
function simulateTabletImpression(form) {
    // Add impression effect class to form
    form.classList.add('form-impression');
    
    // Create impression overlay
    const overlay = document.createElement('div');
    overlay.className = 'impression-overlay';
    form.appendChild(overlay);
    
    // Remove effect after animation completes
    setTimeout(() => {
        form.classList.remove('form-impression');
        overlay.remove();
    }, 800);
}

/**
 * Smooth scroll to a field with Roman-themed animation
 * @param {HTMLElement} field - Form field to scroll to
 */
function scrollToField(field) {
    const fieldRect = field.getBoundingClientRect();
    const absoluteTop = window.pageYOffset + fieldRect.top - 100;
    
    // Add scroll indicator
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator';
    document.body.appendChild(indicator);
    
    // Position indicator
    indicator.style.top = `${fieldRect.top + window.pageYOffset - 30}px`;
    indicator.style.left = `${fieldRect.left}px`;
    
    // Animate scroll
    window.scrollTo({
        top: absoluteTop,
        behavior: 'smooth'
    });
    
    // Highlight field
    field.classList.add('field-highlight');
    
    // Remove effects after animation
    setTimeout(() => {
        indicator.remove();
        field.classList.remove('field-highlight');
    }, 2000);
}

/**
 * Validate an individual form field
 * @param {HTMLElement} field - Form field to validate
 * @returns {boolean} - True if field is valid
 */
function validateField(field) {
    let isValid = true;
    let errorMessage = '';
    
    // Get validation requirements from data attributes
    const isRequired = field.hasAttribute('required');
    const minLength = field.getAttribute('minlength');
    const maxLength = field.getAttribute('maxlength');
    const pattern = field.getAttribute('pattern');
    const fieldType = field.getAttribute('type');
    const dataType = field.dataset.type;
    
    // Check if empty
    if (isRequired && !field.value.trim()) {
        isValid = false;
        errorMessage = 'This field is required.';
    } 
    // Check min length
    else if (minLength && field.value.length < parseInt(minLength)) {
        isValid = false;
        errorMessage = `Must be at least ${minLength} characters.`;
    } 
    // Check max length
    else if (maxLength && field.value.length > parseInt(maxLength)) {
        isValid = false;
        errorMessage = `Must be no more than ${maxLength} characters.`;
    }
    // Check pattern
    else if (pattern && field.value) {
        const regex = new RegExp(pattern);
        if (!regex.test(field.value)) {
            isValid = false;
            errorMessage = field.dataset.patternMessage || 'Please enter a valid value.';
        }
    }
    
    // Check specific field types
    if (fieldType === 'email' && field.value) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address.';
        }
    }
    
    if (dataType === 'phone' && field.value) {
        const phoneRegex = /^\+?[0-9\s\-()]{10,20}$/;
        if (!phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number.';
        }
    }
    
    // Update UI based on validation result
    updateFieldValidationUI(field, isValid, errorMessage);
    
    // Remove writing animation class
    field.classList.remove('roman-writing');
    
    // Add appropriate validation class
    if (isValid && field.value.trim()) {
        field.classList.add('field-validated');
        // Add special animation for validated fields
        animateFieldValidation(field, true);
    } else if (!isValid) {
        field.classList.add('field-invalid');
        // Add special animation for invalid fields
        animateFieldValidation(field, false);
    }
    
    return isValid;
}

/**
 * Animate field validation with Roman-themed effects
 * @param {HTMLElement} field - Form field
 * @param {boolean} isValid - Whether field is valid
 */
function animateFieldValidation(field, isValid) {
    const container = field.closest('.field-roman-container');
    if (!container) return;
    
    // Remove existing animations
    container.classList.remove('validate-success', 'validate-error');
    
    // Add appropriate animation class
    if (isValid) {
        container.classList.add('validate-success');
        
        // Add decorative checkmark for valid fields
        let checkmark = container.querySelector('.roman-valid-mark');
        if (!checkmark) {
            checkmark = document.createElement('span');
            checkmark.className = 'roman-valid-mark';
            checkmark.innerHTML = '✓';
            container.appendChild(checkmark);
        }
        
        // Show checkmark with animation
        checkmark.classList.add('mark-animate');
        setTimeout(() => {
            checkmark.classList.remove('mark-animate');
        }, 500);
    } else {
        container.classList.add('validate-error');
        
        // Add shake effect
        container.classList.add('shake-field');
        setTimeout(() => {
            container.classList.remove('shake-field');
        }, 500);
    }
}

/**
 * Update the UI for a field based on validation result
 * @param {HTMLElement} field - The field to update UI for
 * @param {boolean} isValid - Whether field is valid
 * @param {string} errorMessage - Error message to display if invalid
 */
function updateFieldValidationUI(field, isValid, errorMessage) {
    // Remove any existing error message
    const existingError = field.nextElementSibling;
    if (existingError && existingError.classList.contains('error-message')) {
        existingError.remove();
    }
    
    // Find parent container
    const container = field.closest('.field-roman-container');
    
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
        if (container) {
            container.classList.remove('container-invalid');
            container.classList.add('container-valid');
        }
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        if (container) {
            container.classList.remove('container-valid');
            container.classList.add('container-invalid');
        }
        
        // Add error message with Roman styling
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message roman-error-message';
        
        // Create error icon
        const errorIcon = document.createElement('span');
        errorIcon.className = 'error-icon';
        errorElement.appendChild(errorIcon);
        
        // Add error text
        const errorText = document.createElement('span');
        errorText.textContent = errorMessage;
        errorElement.appendChild(errorText);
        
        // Insert after the container instead of the field
        const targetElement = container || field;
        targetElement.insertAdjacentElement('afterend', errorElement);
        
        // Animate error message appearance
        setTimeout(() => {
            errorElement.classList.add('error-show');
        }, 10);
    }
}

/**
 * Validate an entire form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if the entire form is valid
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
    let isFormValid = true;
    
    fields.forEach(field => {
        const fieldIsValid = validateField(field);
        if (!fieldIsValid) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

/**
 * Submit form via AJAX
 * @param {HTMLFormElement} form - The form to submit
 */
function submitFormViaAjax(form) {
    // Show loading state
    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
    const originalButtonText = submitButton?.dataset.originalText || 'Submit';
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.querySelector('.seal-impression').textContent = 'MITT';
    }
    
    // Add sending animation to form
    form.classList.add('form-sending');
    
    // Create form data object
    const formData = new FormData(form);
    const formObject = {};
    formData.forEach((value, key) => {
        formObject[key] = value;
    });
    
    // Determine endpoint from form attributes
    const endpoint = form.getAttribute('action') || '/api/contact';
    
    // Send the form data
    fetch(endpoint, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formObject)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Server returned an error');
        }
        return response.json();
    })
    .then(data => {
        // Handle success
        showFormFeedback(
            form, 
            'success', 
            'Gratias tibi ago! Litterae tuae missae sunt.',
            'Your message has been sent successfully!'
        );
        
        // Add success animation to form
        form.classList.remove('form-sending');
        form.classList.add('form-success');
        
        // Create flying scroll animation
        createFlyingScrollEffect(form);
        
        form.reset(); // Clear form
        
        // Remove validation classes
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('valid', 'invalid', 'field-validated', 'field-invalid');
            
            // Remove checkmarks
            const container = field.closest('.field-roman-container');
            if (container) {
                container.classList.remove('container-valid', 'container-invalid');
                const checkmark = container.querySelector('.roman-valid-mark');
                if (checkmark) checkmark.remove();
            }
        });
    })
    .catch(error => {
        // Handle error
        console.error('Form submission error:', error);
        form.classList.remove('form-sending');
        form.classList.add('form-error');
        
        showFormFeedback(
            form, 
            'error', 
            'Eheu! Error accidit dum litteras mittere conor.',
            'There was a problem sending your message. Please try again later.'
        );
    })
    .finally(() => {
        // Reset button state
        if (submitButton) {
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.querySelector('.seal-impression').textContent = 'SPQR';
            }, 1000);
        }
    });
}

/**
 * Create flying scroll effect for successful form submission
 * @param {HTMLElement} form - The form element
 */
function createFlyingScrollEffect(form) {
    // Create scroll element
    const scroll = document.createElement('div');
    scroll.className = 'flying-scroll';
    
    // Create scroll parts
    const scrollParchment = document.createElement('div');
    scrollParchment.className = 'scroll-parchment';
    scrollParchment.innerHTML = '<span>SPQR</span>';
    
    const scrollRodTop = document.createElement('div');
    scrollRodTop.className = 'scroll-rod scroll-rod-top';
    
    const scrollRodBottom = document.createElement('div');
    scrollRodBottom.className = 'scroll-rod scroll-rod-bottom';
    
    // Assemble scroll
    scroll.appendChild(scrollRodTop);
    scroll.appendChild(scrollParchment);
    scroll.appendChild(scrollRodBottom);
    
    // Add to document
    document.body.appendChild(scroll);
    
    // Position at form
    const formRect = form.getBoundingClientRect();
    scroll.style.left = `${formRect.left + formRect.width / 2}px`;
    scroll.style.top = `${formRect.top + window.scrollY}px`;
    
    // Animate flight
    requestAnimationFrame(() => {
        scroll.classList.add('scroll-flying');
    });
    
    // Remove after animation
    setTimeout(() => {
        scroll.remove();
    }, 3000);
}

/**
 * Show a form feedback message
 * @param {HTMLFormElement} form - The form to show message for
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} latinMessage - Message in Latin
 * @param {string} message - The message in English
 */
function showFormFeedback(form, type, latinMessage, message) {
    // Find or create feedback element
    let feedbackElement = document.getElementById('form-status-message');
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.id = 'form-status-message';
        form.insertAdjacentElement('afterend', feedbackElement);
    }
    
    // Set message content and styling
    feedbackElement.className = `form-message ${type}-message roman-message`;
    
    // Create Latin message element
    const latinElement = document.createElement('div');
    latinElement.className = 'latin-message';
    latinElement.textContent = latinMessage;
    
    // Create translation message
    const translationElement = document.createElement('div');
    translationElement.className = 'translation-message';
    translationElement.textContent = message;
    
    // Add icon
    const iconElement = document.createElement('div');
    iconElement.className = `message-icon ${type}-icon`;
    
    // Clear and add new content
    feedbackElement.innerHTML = '';
    feedbackElement.appendChild(iconElement);
    feedbackElement.appendChild(latinElement);
    feedbackElement.appendChild(translationElement);
    
    // Show the message
    feedbackElement.style.display = 'block';
    
    // Add animation class
    setTimeout(() => {
        feedbackElement.classList.add('message-show');
    }, 10);
    
    // Scroll to message if not in view
    feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // For success messages, hide after a delay
    if (type === 'success') {
        setTimeout(() => {
            feedbackElement.classList.add('message-hide');
            setTimeout(() => {
                feedbackElement.style.display = 'none';
                feedbackElement.classList.remove('message-show', 'message-hide');
            }, 1000);
        }, 7000);
    }
}