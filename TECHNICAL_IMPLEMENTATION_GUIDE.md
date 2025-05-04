# Technical Implementation Guide

## Overview
This document provides technical guidance for implementing the visual enhancements and new features outlined in the VISUAL_ENHANCEMENTS_PLAN.md and FEATURE_IMPLEMENTATION_PLAN.md documents.

## Code Architecture

### Module Structure
All new features should follow the established module pattern in `scripts/modules/`:

```javascript
// Module template
export default class FeatureName {
  constructor(options = {}) {
    this.options = {
      defaultOption: true,
      // Set defaults
      ...options
    };
    this.init();
  }

  init() {
    // Initialize feature
    this.setupElements();
    this.bindEvents();
  }

  setupElements() {
    // Cache DOM elements
  }

  bindEvents() {
    // Add event listeners
  }

  // Feature-specific methods
}
```

### CSS Organization
New styles should be organized following the existing structure:
- Component-specific styles in `styles/components/`
- Animation definitions in `styles/base/_animations.css`
- Utility classes in `styles/utils/_utilities.css`
- Theme variations in `styles/themes/`

## Visual Effects Implementation

### Parallax Scrolling
```javascript
// Implementation using Intersection Observer
const parallaxElements = document.querySelectorAll('.parallax-element');

const parallaxOptions = {
  rootMargin: '0px',
  threshold: buildThresholdList()
};

const parallaxObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const speed = entry.target.dataset.speed || 0.5;
      const yPos = -(entry.boundingClientRect.y * speed / 10);
      entry.target.style.transform = `translate3d(0, ${yPos}px, 0)`;
    }
  });
}, parallaxOptions);

parallaxElements.forEach(element => {
  parallaxObserver.observe(element);
});

function buildThresholdList() {
  let thresholds = [];
  for (let i = 0; i <= 1.0; i += 0.01) {
    thresholds.push(i);
  }
  return thresholds;
}
```

### Content Reveal Animations
Use the existing scroll-reveal.js module and extend with new animation types:

```javascript
// Add to scrollReveal.js
revealElement(element, delay = 0) {
  const animationType = element.dataset.revealAnimation || 'fade-up';
  const animationMap = {
    'fade-up': 'animate__fadeInUp',
    'fade-in': 'animate__fadeIn',
    'slide-left': 'animate__slideInLeft',
    'slide-right': 'animate__slideInRight',
    'zoom-in': 'animate__zoomIn',
    'bounce': 'animate__bounce'
  };
  
  element.classList.add('animate__animated', animationMap[animationType]);
  element.style.animationDelay = `${delay}ms`;
}
```

### Interactive Timeline
```javascript
// Timeline code sample
export default class RomanTimeline {
  constructor(selector) {
    this.timeline = document.querySelector(selector);
    if (!this.timeline) return;
    
    this.events = this.timeline.querySelectorAll('.timeline-event');
    this.init();
  }
  
  init() {
    this.createProgressLine();
    this.initObserver();
  }
  
  createProgressLine() {
    const line = document.createElement('div');
    line.classList.add('timeline-progress-line');
    this.timeline.appendChild(line);
    this.progressLine = line;
  }
  
  initObserver() {
    const options = {
      root: null,
      threshold: 0.5,
      rootMargin: '0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('timeline-event-active');
          this.updateProgress(entry.target);
        }
      });
    }, options);
    
    this.events.forEach(event => {
      observer.observe(event);
    });
  }
  
  updateProgress(activeEvent) {
    // Calculate progress based on active event position
    const index = Array.from(this.events).indexOf(activeEvent);
    const progress = ((index + 1) / this.events.length) * 100;
    this.progressLine.style.width = `${progress}%`;
  }
}
```

## New Features Implementation

### Interactive Project Showcase
```javascript
// Projects filter and showcase
export default class ProjectShowcase {
  constructor(options = {}) {
    this.options = {
      containerSelector: '.projects-container',
      filterSelector: '.project-filters',
      itemSelector: '.project-item',
      activeClass: 'active',
      ...options
    };
    
    this.container = document.querySelector(this.options.containerSelector);
    this.filters = document.querySelector(this.options.filterSelector);
    this.items = document.querySelectorAll(this.options.itemSelector);
    
    if (!this.container || !this.filters || !this.items.length) return;
    
    this.init();
  }
  
  init() {
    this.createFilters();
    this.bindEvents();
  }
  
  createFilters() {
    // Dynamically create filter buttons based on project tags
    const tags = new Set();
    this.items.forEach(item => {
      const itemTags = (item.dataset.tags || '').split(' ');
      itemTags.forEach(tag => tag && tags.add(tag));
    });
    
    // Create "All" filter
    this.createFilterButton('all', 'All', true);
    
    // Create tag-specific filters
    tags.forEach(tag => {
      this.createFilterButton(tag, this.formatTagName(tag));
    });
  }
  
  createFilterButton(value, text, isActive = false) {
    const button = document.createElement('button');
    button.textContent = text;
    button.dataset.filter = value;
    button.classList.add('filter-btn');
    if (isActive) button.classList.add(this.options.activeClass);
    this.filters.appendChild(button);
  }
  
  formatTagName(tag) {
    return tag.charAt(0).toUpperCase() + tag.slice(1).replace('-', ' ');
  }
  
  bindEvents() {
    this.filters.addEventListener('click', e => {
      if (e.target.classList.contains('filter-btn')) {
        this.filterProjects(e.target);
      }
    });
  }
  
  filterProjects(filterBtn) {
    // Update active state
    this.filters.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove(this.options.activeClass);
    });
    filterBtn.classList.add(this.options.activeClass);
    
    const filterValue = filterBtn.dataset.filter;
    
    this.items.forEach(item => {
      const itemTags = (item.dataset.tags || '').split(' ');
      const shouldShow = filterValue === 'all' || itemTags.includes(filterValue);
      
      if (shouldShow) {
        item.classList.remove('hidden');
        setTimeout(() => item.classList.add('visible'), 10);
      } else {
        item.classList.remove('visible');
        setTimeout(() => item.classList.add('hidden'), 300);
      }
    });
  }
}
```

### Enhanced Domus Map
```javascript
// Enhanced Domus map with zoom and tooltips
export default class EnhancedDomusMap {
  constructor() {
    this.mapContainer = document.querySelector('.domus-map-container');
    this.map = document.getElementById('domus-map');
    if (!this.mapContainer || !this.map) return;
    
    this.zoomLevel = 1;
    this.maxZoom = 3;
    this.minZoom = 0.5;
    this.isDragging = false;
    this.lastPosition = { x: 0, y: 0 };
    this.position = { x: 0, y: 0 };
    
    this.init();
  }
  
  init() {
    this.addControls();
    this.bindEvents();
    this.setupTooltips();
  }
  
  addControls() {
    const controls = document.createElement('div');
    controls.classList.add('domus-map-controls');
    controls.innerHTML = `
      <button class="map-control zoom-in" aria-label="Zoom in">+</button>
      <button class="map-control zoom-out" aria-label="Zoom out">−</button>
      <button class="map-control reset" aria-label="Reset view"><i class="fas fa-sync-alt"></i></button>
    `;
    this.mapContainer.appendChild(controls);
    this.controls = controls;
  }
  
  bindEvents() {
    // Zoom controls
    this.controls.querySelector('.zoom-in').addEventListener('click', () => this.zoom(0.2));
    this.controls.querySelector('.zoom-out').addEventListener('click', () => this.zoom(-0.2));
    this.controls.querySelector('.reset').addEventListener('click', () => this.reset());
    
    // Mouse wheel zoom
    this.mapContainer.addEventListener('wheel', e => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.zoom(delta);
    });
    
    // Drag functionality
    this.mapContainer.addEventListener('mousedown', this.startDrag.bind(this));
    document.addEventListener('mousemove', this.drag.bind(this));
    document.addEventListener('mouseup', this.endDrag.bind(this));
    
    // Touch events
    this.mapContainer.addEventListener('touchstart', this.handleTouchStart.bind(this));
    this.mapContainer.addEventListener('touchmove', this.handleTouchMove.bind(this));
    this.mapContainer.addEventListener('touchend', this.endDrag.bind(this));
  }
  
  setupTooltips() {
    // To be implemented once SVG map is loaded
    this.map.addEventListener('load', () => {
      const svgDoc = this.map.contentDocument;
      if (!svgDoc) return;
      
      const rooms = svgDoc.querySelectorAll('[data-room]');
      rooms.forEach(room => {
        room.addEventListener('mouseenter', e => this.showTooltip(e, room));
        room.addEventListener('mouseleave', () => this.hideTooltip());
        room.addEventListener('click', () => this.navigateToRoom(room.dataset.room));
      });
    });
  }
  
  // Implement zoom, drag, tooltip, and navigation methods
  zoom(delta) {
    this.zoomLevel = Math.min(Math.max(this.zoomLevel + delta, this.minZoom), this.maxZoom);
    this.updateTransform();
  }
  
  startDrag(e) {
    if (e.type.includes('touch')) {
      const touch = e.touches[0];
      this.lastPosition = { x: touch.clientX, y: touch.clientY };
    } else {
      this.lastPosition = { x: e.clientX, y: e.clientY };
    }
    this.isDragging = true;
    this.mapContainer.classList.add('grabbing');
  }
  
  drag(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    
    const clientX = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
    const clientY = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
    
    const deltaX = clientX - this.lastPosition.x;
    const deltaY = clientY - this.lastPosition.y;
    
    this.position.x += deltaX / this.zoomLevel;
    this.position.y += deltaY / this.zoomLevel;
    
    this.lastPosition = { x: clientX, y: clientY };
    this.updateTransform();
  }
  
  endDrag() {
    this.isDragging = false;
    this.mapContainer.classList.remove('grabbing');
  }
  
  handleTouchStart(e) {
    if (e.touches.length === 1) {
      this.startDrag(e);
    }
  }
  
  handleTouchMove(e) {
    if (e.touches.length === 1) {
      this.drag(e);
    }
  }
  
  updateTransform() {
    const transform = `translate(${this.position.x}px, ${this.position.y}px) scale(${this.zoomLevel})`;
    this.map.style.transform = transform;
  }
  
  reset() {
    this.zoomLevel = 1;
    this.position = { x: 0, y: 0 };
    this.updateTransform();
  }
  
  showTooltip(event, room) {
    // Create tooltip with room information
    const tooltip = document.createElement('div');
    tooltip.classList.add('domus-tooltip');
    tooltip.textContent = room.dataset.roomName || room.dataset.room;
    
    // Position tooltip
    const rect = room.getBoundingClientRect();
    tooltip.style.left = `${rect.left + rect.width / 2}px`;
    tooltip.style.top = `${rect.top - 10}px`;
    
    // Add to DOM
    document.body.appendChild(tooltip);
    this.activeTooltip = tooltip;
    
    // Animate in
    setTimeout(() => tooltip.classList.add('visible'), 10);
  }
  
  hideTooltip() {
    if (this.activeTooltip) {
      this.activeTooltip.classList.remove('visible');
      setTimeout(() => this.activeTooltip.remove(), 300);
      this.activeTooltip = null;
    }
  }
  
  navigateToRoom(roomId) {
    // Navigate to corresponding section
    const section = document.getElementById(roomId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      document.querySelector('#domus-close').click();
    }
  }
}
```

## Responsive Design Considerations

Ensure all new features are fully responsive following these guidelines:

| Breakpoint | Min Width | Description |
|------------|-----------|-------------|
| Mobile     | 0px       | Single column, simplified animations |
| Tablet     | 768px     | Two column layouts, moderate animations |
| Desktop    | 1024px    | Full layout, all animations enabled |
| Large      | 1440px    | Enhanced spacing, larger typography |

## Accessibility Requirements

All new features must meet WCAG 2.1 AA standards:

1. Keyboard navigability for all interactive elements
2. Proper ARIA labels and roles
3. Sufficient color contrast (minimum 4.5:1)
4. Animation control and reduced motion support
5. Focus management for interactive elements

## Performance Targets

- First Contentful Paint (FCP): < 2s
- Time to Interactive (TTI): < 3s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

## Testing Strategy

1. Cross-browser testing: Chrome, Firefox, Safari, Edge
2. Responsive testing across devices
3. Performance testing using Lighthouse
4. Accessibility audits using axe or similar tools
5. User testing for key interactive features

## Deployment Checklist

- Minify and bundle all JavaScript modules
- Optimize and compress images and assets
- Set appropriate cache headers
- Implement critical CSS
- Verify all links are working
- Test form submissions
- Check analytics implementation
- Validate HTML and CSS