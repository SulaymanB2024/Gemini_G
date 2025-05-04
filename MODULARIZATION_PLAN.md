# Modularization Plan

This document details the file and folder structure for the modularized rebuild of the Roman-themed portfolio website.

## Project Structure Overview

```
roman-portfolio/
├── index.html                # Main entry point
├── assets/
│   ├── fonts/               # Custom fonts (if any)
│   ├── icons/               # SVG icons and favicon files
│   └── images/
│       ├── textures/        # Background textures and patterns
│       ├── decorative/      # Ornamental elements (laurels, columns, etc.)
│       └── content/         # Content images (profile, projects, etc.)
├── styles/
│   ├── main.css             # Main CSS file (imports all modules)
│   ├── base/                # Base styles
│   │   ├── _reset.css       # CSS reset/normalize
│   │   ├── _typography.css  # Typography rules
│   │   ├── _variables.css   # CSS variables
│   │   └── _animations.css  # Global animations
│   ├── layout/
│   │   ├── _grid.css        # Grid system
│   │   ├── _header.css      # Header styles
│   │   ├── _footer.css      # Footer styles
│   │   └── _sections.css    # Section layouts
│   ├── components/
│   │   ├── _buttons.css     # Button styles
│   │   ├── _cards.css       # Card styles
│   │   ├── _preloaders.css  # Preloader components
│   │   ├── _modals.css      # Modal styles
│   │   ├── _forms.css       # Form elements
│   │   ├── _skill-tags.css  # Skill tag coins
│   │   ├── _domus.css       # Domus map overlay
│   │   └── _navigation.css  # Navigation menus
│   ├── themes/
│   │   ├── _light.css       # Light mode theme
│   │   └── _dark.css        # Dark mode theme
│   └── pages/
│       └── _home.css        # Home page specific styles
├── scripts/
│   ├── main.js              # Main JS file (imports all modules)
│   ├── config.js            # Centralized configuration values
│   ├── utils/
│   │   ├── dom.js           # DOM helper functions
│   │   └── animation.js     # Animation utilities
│   └── modules/
│       ├── preloader.js     # Preloader logic
│       ├── darkMode.js      # Dark mode toggle
│       ├── navigation.js    # Navigation handling
│       ├── scrollEffects.js # Scroll animations
│       ├── skillTags.js     # Skill tag interactions
│       ├── projectModal.js  # Project modal logic
│       ├── domusMap.js      # Domus map interactions
│       ├── filtering.js     # Content filtering
│       ├── formHandler.js   # Contact form handling
│       └── typedText.js     # Typed.js initialization
└── partials/                # HTML partial templates
    ├── head.html            # <head> content
    ├── header.html          # Site header
    ├── footer.html          # Site footer
    ├── preloaders/
    │   ├── spinner.html     # Spinner preloader
    │   ├── title-card.html  # Title card preloader
    │   └── roman-seal.html  # Roman seal preloader
    └── sections/
        ├── hero.html        # Hero section
        ├── about.html       # About section
        ├── education.html   # Education section
        ├── experience.html  # Experience section
        ├── projects.html    # Projects section
        ├── skills.html      # Skills section
        ├── certifications.html # Certifications section
        ├── leadership.html  # Leadership section
        └── contact.html     # Contact section
```

## CSS Architecture

We will implement a hybrid CSS architecture combining the best aspects of:

1. **ITCSS (Inverted Triangle CSS)**
   - Organize CSS by specificity and reach
   - From generic to explicit, broad to narrow

2. **BEM (Block Element Modifier)**
   - Naming convention: `block__element--modifier`
   - Example: `card__title--highlighted`

3. **CSS Custom Properties**
   - Centralized variables for colors, spacing, animations
   - Theme switching via root variable overrides

## CSS Modules Organization

### Base
Foundation styles applied globally, including variables, reset, typography, and animations.

### Layout
Large structural components that define the overall layout and section structure.

### Components
Individual UI components that are reusable across the site.

### Themes
Theme-specific variables and overrides for light and dark modes.

### Utilities
Helper classes for common CSS patterns (spacing, visibility, etc.).

## JavaScript Modularization Strategy

We'll use ES6 modules with clear separation of concerns:

### Config Module
Centralized configuration variables for animation timings, selectors, breakpoints.

### Utility Modules
Helper functions for DOM manipulation, animation, and other common tasks.

### Feature Modules
Self-contained modules for specific features (e.g., domusMap.js, skillTags.js).

### Main Module
Entry point that imports and initializes other modules as needed.

## HTML Partials Strategy

HTML will be organized into logical partials that can be assembled into the final page:

1. **Core Partials**: head.html, header.html, footer.html
2. **Section Partials**: One file per main section
3. **Component Partials**: For reusable components

This structure allows for:
- Clear separation of concerns
- Easy maintenance of individual sections
- Potential integration with static site generators if needed

## Build Process Consideration

While the current site appears to be static HTML/CSS/JS, we could enhance the workflow with:

1. **Simple build tool** (e.g., Vite, Parcel)
   - CSS preprocessing
   - JS bundling and minification
   - HTML template compilation
   - Asset optimization

2. **Alternative**: Keep it vanilla but use import/export syntax with modern ES modules
   - Reduces build complexity
   - Still maintains code organization
   - Relies on browser's native module support