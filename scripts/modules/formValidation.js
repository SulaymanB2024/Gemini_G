/**
 * formValidation.js
 * Form validation functionality for the Roman-themed portfolio website
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initialize form validation for all forms with the data-validate attribute
 */
export function initFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
        const fields = form.querySelectorAll('input:not([type="hidden"]), select, textarea');
        
        // Add validation on blur for each field
        fields.forEach(field => {
            field.addEventListener('blur', () => {
                validateField(field);
            });
            
            // Clear error state when user starts typing again
            field.addEventListener('input', () => {
                const errorElement = field.nextElementSibling;
                if (errorElement && errorElement.classList.contains('error-message')) {
                    errorElement.textContent = '';
                }
                field.classList.remove('invalid');
            });
        });
        
        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Validate all fields on submit
            if (validateForm(form)) {
                // Check if the form should be submitted via AJAX
                if (form.dataset.ajax === 'true') {
                    submitFormViaAjax(form);
                } else {
                    // Regular form submit
                    form.submit();
                }
            } else {
                // Focus on the first invalid field for better UX
                const firstInvalidField = form.querySelector('.invalid');
                if (firstInvalidField) {
                    firstInvalidField.focus();
                }
                
                // Show error feedback
                showFormFeedback(form, 'error', 'Please correct the errors in the form.');
            }
        });
    });
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
    
    return isValid;
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
    
    if (isValid) {
        field.classList.remove('invalid');
        field.classList.add('valid');
    } else {
        field.classList.remove('valid');
        field.classList.add('invalid');
        
        // Add error message
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = errorMessage;
        field.insertAdjacentElement('afterend', errorElement);
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
    const originalButtonText = submitButton?.innerHTML || 'Submit';
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    }
    
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
        showFormFeedback(form, 'success', 'Your message has been sent successfully!');
        form.reset(); // Clear form
        
        // Remove validation classes
        const fields = form.querySelectorAll('input, select, textarea');
        fields.forEach(field => {
            field.classList.remove('valid', 'invalid');
        });
    })
    .catch(error => {
        // Handle error
        console.error('Form submission error:', error);
        showFormFeedback(
            form, 
            'error', 
            'There was a problem sending your message. Please try again later.'
        );
    })
    .finally(() => {
        // Reset button state
        if (submitButton) {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

/**
 * Show a form feedback message
 * @param {HTMLFormElement} form - The form to show message for
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} message - The message to display
 */
function showFormFeedback(form, type, message) {
    // Find or create feedback element
    let feedbackElement = document.getElementById('form-status-message');
    if (!feedbackElement) {
        feedbackElement = document.createElement('div');
        feedbackElement.id = 'form-status-message';
        form.insertAdjacentElement('afterend', feedbackElement);
    }
    
    // Set message content and styling
    feedbackElement.textContent = message;
    feedbackElement.className = `form-message ${type}-message`;
    
    // Show the message
    feedbackElement.style.display = 'block';
    
    // Scroll to message if not in view
    feedbackElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // For success messages, hide after a delay
    if (type === 'success') {
        setTimeout(() => {
            feedbackElement.classList.add('fade-out');
            setTimeout(() => {
                feedbackElement.style.display = 'none';
                feedbackElement.classList.remove('fade-out');
            }, 1000);
        }, 5000);
    }
}