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
        const inputs = form.querySelectorAll('input, textarea, select');
        
        // Add validation listeners to each form field
        inputs.forEach(input => {
            // Skip submit buttons and elements without validation rules
            if (input.type === 'submit' || !input.getAttribute('data-validate')) return;
            
            // Add blur event listener for validation
            input.addEventListener('blur', () => {
                validateField(input);
            });
            
            // Add input event for real-time feedback after first blur
            input.addEventListener('input', () => {
                if (input.classList.contains('is-invalid') || input.classList.contains('is-valid')) {
                    validateField(input);
                }
            });
        });
        
        // Add form submit handler
        form.addEventListener('submit', (e) => {
            const isValid = validateForm(form);
            
            if (!isValid) {
                e.preventDefault();
                
                // Focus the first invalid field
                const firstInvalid = form.querySelector('.is-invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
            } else if (form.getAttribute('data-ajax') === 'true') {
                // Handle AJAX form submission if requested
                e.preventDefault();
                submitFormViaAjax(form);
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
    const validationType = field.getAttribute('data-validate');
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Clear previous validation state
    field.classList.remove('is-valid', 'is-invalid');
    
    // Check if field is required
    if (field.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required.';
    } else if (value !== '') {
        // Only validate non-empty fields (unless required)
        switch (validationType) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                errorMessage = 'Please enter a valid email address.';
                break;
                
            case 'phone':
                const phoneRegex = /^[\d\s\+\-\(\)]{7,20}$/;
                isValid = phoneRegex.test(value);
                errorMessage = 'Please enter a valid phone number.';
                break;
                
            case 'name':
                const nameRegex = /^[a-zA-Z\s\-']{2,50}$/;
                isValid = nameRegex.test(value);
                errorMessage = 'Please enter a valid name (2-50 characters).';
                break;
                
            case 'url':
                try {
                    new URL(value);
                    isValid = true;
                } catch (e) {
                    isValid = false;
                    errorMessage = 'Please enter a valid URL.';
                }
                break;
                
            case 'length':
                const minLength = parseInt(field.getAttribute('data-min-length') || '2');
                const maxLength = parseInt(field.getAttribute('data-max-length') || '1000');
                
                isValid = value.length >= minLength && value.length <= maxLength;
                errorMessage = `Text must be between ${minLength} and ${maxLength} characters.`;
                break;
                
            default:
                // No specific validation or custom validation
                isValid = true;
        }
    }
    
    // Update field appearance based on validation result
    if (isValid) {
        field.classList.add('is-valid');
        
        // Update feedback message
        const feedbackElement = field.parentNode.querySelector('.valid-feedback');
        if (feedbackElement) {
            feedbackElement.textContent = 'Looks good!';
        }
    } else {
        field.classList.add('is-invalid');
        
        // Update error message
        const feedbackElement = field.parentNode.querySelector('.invalid-feedback');
        if (feedbackElement) {
            feedbackElement.textContent = errorMessage;
        }
    }
    
    return isValid;
}

/**
 * Validate an entire form
 * @param {HTMLFormElement} form - The form to validate
 * @returns {boolean} - True if the entire form is valid
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    fields.forEach(field => {
        // Skip submit buttons and elements without validation rules
        if (field.type === 'submit' || !field.getAttribute('data-validate')) return;
        
        const isFieldValid = validateField(field);
        if (!isFieldValid) {
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
    const submitBtn = form.querySelector('[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Collect form data
    const formData = new FormData(form);
    const data = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });
    
    // Get submission URL
    const url = form.getAttribute('action') || window.location.href;
    
    // Send data using fetch API
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        // Show success message
        const successMessage = form.getAttribute('data-success-message') || 'Your message has been sent successfully!';
        showFormMessage(form, 'success', successMessage);
        
        // Reset form
        form.reset();
        form.querySelectorAll('.is-valid').forEach(el => {
            el.classList.remove('is-valid');
        });
    })
    .catch(error => {
        // Show error message
        const errorMessage = form.getAttribute('data-error-message') || 'There was an error sending your message. Please try again.';
        showFormMessage(form, 'error', errorMessage);
        console.error('Error submitting form:', error);
    })
    .finally(() => {
        // Restore button state
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    });
}

/**
 * Show a form feedback message
 * @param {HTMLFormElement} form - The form to show message for
 * @param {string} type - Message type ('success' or 'error')
 * @param {string} message - Message text
 */
function showFormMessage(form, type, message) {
    // Look for existing message container
    let messageContainer = form.querySelector('.form-message');
    
    // Create if it doesn't exist
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.className = 'form-message';
        form.prepend(messageContainer);
    }
    
    // Set message type and content
    messageContainer.className = `form-message ${type === 'success' ? 'form-message-success' : 'form-message-error'}`;
    messageContainer.innerHTML = `
        <div class="form-message-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <p>${message}</p>
        </div>
    `;
    
    // Ensure it's visible
    messageContainer.style.display = 'block';
    
    // Scroll to message
    messageContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // If success, hide after delay
    if (type === 'success') {
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 5000);
    }
}