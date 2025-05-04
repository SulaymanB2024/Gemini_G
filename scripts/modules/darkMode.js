/**
 * darkMode.js
 * Handles dark mode functionality for the Roman-themed portfolio website
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initializes the dark mode functionality
 */
export function initDarkMode() {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Check for saved theme preference or use the system preference
    const savedTheme = localStorage.getItem('theme');
    
    // Apply initial theme
    if (savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches)) {
        document.body.classList.add('dark-mode');
        updateDarkModeToggleText(true);
    } else {
        document.body.classList.remove('dark-mode');
        updateDarkModeToggleText(false);
    }
    
    // Add event listener to the dark mode toggle button
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }
    
    // Listen for system preference changes
    prefersDarkScheme.addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            if (e.matches) {
                document.body.classList.add('dark-mode');
                updateDarkModeToggleText(true);
            } else {
                document.body.classList.remove('dark-mode');
                updateDarkModeToggleText(false);
            }
        }
    });
    
    // Add animation columns for dark mode transition if they don't exist
    addDarkModeAnimationElements();
}

/**
 * Toggles dark mode on/off and saves preference
 */
function toggleDarkMode() {
    const currentTheme = document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    // Update localStorage
    localStorage.setItem('theme', newTheme);
    
    // Toggle class
    if (newTheme === 'dark') {
        document.body.classList.add('dark-mode');
        playDarkModeAnimation(true);
    } else {
        document.body.classList.remove('dark-mode');
        playDarkModeAnimation(false);
    }
    
    // Update toggle button text
    updateDarkModeToggleText(newTheme === 'dark');
}

/**
 * Updates the dark mode toggle button text and icon
 * @param {boolean} isDarkMode - Whether dark mode is active
 */
function updateDarkModeToggleText(isDarkMode) {
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        if (isDarkMode) {
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            darkModeToggle.setAttribute('aria-label', 'Switch to light mode');
        } else {
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> Dark Mode';
            darkModeToggle.setAttribute('aria-label', 'Switch to dark mode');
        }
    }
}

/**
 * Adds animation elements for dark mode transition if they don't exist
 */
function addDarkModeAnimationElements() {
    if (!document.querySelector('.dark-mode-column')) {
        const container = document.createElement('div');
        container.className = 'dark-mode-animation-container';
        container.setAttribute('aria-hidden', 'true');
        
        // Create columns
        for (let i = 0; i < 5; i++) {
            const column = document.createElement('div');
            column.className = 'dark-mode-column';
            container.appendChild(column);
        }
        
        // Create laurel wreath element
        const laurel = document.createElement('div');
        laurel.className = 'dark-mode-laurel';
        container.appendChild(laurel);
        
        document.body.appendChild(container);
    }
}

/**
 * Plays the dark mode transition animation
 * @param {boolean} toDark - Whether transitioning to dark mode
 */
function playDarkModeAnimation(toDark) {
    const columns = document.querySelectorAll('.dark-mode-column');
    const laurel = document.querySelector('.dark-mode-laurel');
    
    if (!columns.length || !laurel) return;
    
    // Reset any ongoing animations
    columns.forEach(column => {
        column.style.animation = 'none';
        column.offsetHeight; // Trigger reflow
    });
    
    laurel.style.animation = 'none';
    laurel.offsetHeight; // Trigger reflow
    
    // Apply appropriate animation
    columns.forEach((column, index) => {
        const delay = index * 100;
        column.style.animation = `column-rise 1.2s ${delay}ms forwards ease-in-out`;
        column.style.backgroundColor = toDark ? 'rgba(26, 26, 26, 0.9)' : 'rgba(244, 240, 232, 0.9)';
    });
    
    // Wait a bit before triggering laurel animation
    setTimeout(() => {
        laurel.style.animation = 'laurel-reveal 1.5s forwards ease-in-out';
        laurel.style.backgroundImage = `url('../../assets/images/laurel-wreath.png')`;
    }, 300);
}