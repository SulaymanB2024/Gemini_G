# ENHANCEMENTS_PROPOSAL_V3.md: Roman Portfolio Rebuild - Detailed Game Plans

This document details proposed enhancements for the Roman Portfolio website rebuild, focusing on new features, visual improvements, and interactive elements designed to deepen the Roman theme and improve user engagement. **Each item now includes a detailed "Game Plan" for implementation.**

## I. Advanced Features & Interactions

1.  **Interactive "Cursus Honorum" Timeline:**
    * **Concept:** Visualize the "Professional Experience" section as a horizontal, scrollable timeline resembling a Roman road or aqueduct structure. Each significant role/job becomes a milestone marker.
    * **Interaction:** Scroll horizontally; click milestones to expand details; hover for dates; optional skill-connection highlighting.
    * **Visual Implementation:** CSS `scroll-snap`, stone/paver textures, Roman numeral/plinth markers, vertical expansion animation, JS logic.
    * **Feasibility/Impact:** Medium-High Feasibility / High Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** HTML structure (e.g., `<ul>` or `<ol>` for timeline, `<li>` for milestones), CSS Flexbox/Grid for horizontal layout, `overflow-x: auto`, `scroll-snap-type: x mandatory`, `scroll-snap-align: center`, CSS Transitions/Animations (`transform`, `max-height`, `opacity`), JavaScript Event Listeners (`click`, `mouseenter`, `mouseleave`), Intersection Observer (for triggering animations on scroll into view).
        * **Implementation Steps:**
            1.  Restructure Experience HTML into a timeline format (e.g., a container with milestone elements). Each milestone contains summary info (title, date) and hidden detailed info.
            2.  Apply CSS for horizontal scrolling, scroll-snapping, and base milestone styling (plinths, numerals). Style the timeline track (road/aqueduct texture).
            3.  Implement JS click listeners on milestones:
                * Toggle an 'expanded' class.
                * CSS transitions handle the visual expansion (e.g., animating `max-height` from 0 to fit content).
                * Ensure only one milestone is expanded at a time (optional).
            4.  Implement JS hover listeners for date display (e.g., show/hide a tooltip or dedicated date element).
            5.  (Optional) Integrate with Skill Highlighting: Add logic to add/remove highlight classes based on skill selection (see Feature #2).
        * **Required Assets:** Stone/paver background texture image or CSS gradient pattern. Optional SVG icons for milestone markers.
        * **Considerations:** Ensure smooth horizontal scrolling on touch devices. Accessibility: Ensure keyboard navigation (tabbing) between milestones and expansion via Enter/Space. Manage focus correctly when milestones expand/collapse.

2.  **Dynamic Skill Ecosystem Visualization:**
    * **Concept:** Create a dynamic relationship between skills, projects, and experience beyond simple filtering.
    * **Interaction:** Clicking a skill highlights related items; hovering an item highlights related skills.
    * **Visual Implementation:** CSS classes (`.skill-highlight`, `.item-dimmed`), subtle animations (pulse, border fade), JS mapping logic.
    * **Feasibility/Impact:** High Feasibility / Medium Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** JavaScript (DOM manipulation, event listeners), CSS classes and transitions/animations (`opacity`, `box-shadow`, `border-color`). Data attributes (`data-skill`, `data-tags`).
        * **Implementation Steps:**
            1.  *Skill Focus:* Modify the existing skill tag click listener (`initContentFiltering`):
                * Instead of just filtering, when a skill is selected, iterate through all filterable items.
                * If an item's `data-tags` includes the selected `data-skill`, add the `.skill-highlight` class.
                * Optionally, add `.item-dimmed` to non-matching items.
                * Define `.skill-highlight` (e.g., pulsing gold border, slight scale) and `.item-dimmed` (e.g., `opacity: 0.6`) styles in CSS with transitions.
            2.  *Item Focus:* Add `mouseenter`/`mouseleave` listeners to filterable items (`.project-item`, `.experience-item`, etc.).
                * On `mouseenter`, parse the item's `data-tags`.
                * Iterate through all skill tags (`.skill-tag`). If a tag's `data-skill` is in the item's tags, add a temporary highlight class (e.g., `.tag-highlighted-by-item`) to the skill tag.
                * Define `.tag-highlighted-by-item` styles (e.g., different background or border).
                * On `mouseleave`, remove the temporary highlight class from all skill tags.
        * **Required Assets:** None (uses existing data attributes).
        * **Considerations:** Optimize DOM iteration, especially if there are many skills/items. Ensure highlighting doesn't conflict visually with filtering or other hover states.

3.  **"Domus Architect View" Mode:**
    * **Concept:** An alternative "blueprint" view mode for the Domus SVG map, revealing website structural insights.
    * **Interaction:** Toggle button switches views; hover reveals technical annotations in Architect View.
    * **Visual Implementation:** CSS class toggling on SVG container, different SVG styles (monochromatic, parchment texture), custom tooltips, JS state management.
    * **Feasibility/Impact:** Medium Feasibility / Medium Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** SVG styling (CSS within SVG or via external CSS targeting SVG elements), JavaScript (event listeners, class toggling), Data Attributes (to store annotations).
        * **Implementation Steps:**
            1.  Prepare SVG: Ensure map elements have appropriate IDs or classes. Add `data-architect-note` attributes to relevant SVG elements containing the annotation text.
            2.  Define CSS Styles: Create CSS rules targeting the SVG elements when a parent container (e.g., `#domus-map-container`) has an `.architect-view-active` class. These rules will override default fills/strokes for the blueprint look (e.g., `fill: none; stroke: var(--blueprint-stroke-color);`). Add a parchment background to the container in this mode.
            3.  Create Toggle Button: Style the toggle button (wax seal/scroll icon).
            4.  Implement JS Toggle Logic:
                * Add a click listener to the toggle button.
                * On click, toggle the `.architect-view-active` class on the `#domus-map-container` (or a suitable parent).
            5.  Implement Annotation Tooltips: Modify the existing Domus tooltip logic:
                * Check if `.architect-view-active` class is present.
                * If active, on hover over an SVG element with `data-architect-note`, display the note content in a distinctively styled tooltip (e.g., simpler, blueprint-like).
                * If not active, use the standard room name tooltip logic.
        * **Required Assets:** Optional wax seal/scroll icon SVG for the toggle. Parchment texture image or CSS pattern. Well-structured SVG map.
        * **Considerations:** Ensure SVG structure allows easy targeting. Write clear and concise annotation notes.

4.  **Contextual Roman Artifacts (Interactive Decor):**
    * **Concept:** Place small, interactive Roman artifact SVGs within sections for thematic detail.
    * **Interaction:** Hover triggers animation and tooltip with related fact/quote/link.
    * **Visual Implementation:** SVG illustrations, CSS hover animations, custom tooltips, JS for content/interaction.
    * **Feasibility/Impact:** Medium Feasibility / Medium Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** SVG, CSS Animations (`transform`, `opacity`), JavaScript (event listeners, tooltip management).
        * **Implementation Steps:**
            1.  Create/Source Artifact SVGs: Design simple, clean SVGs for artifacts (coin, lamp, shard, scroll). Optimize them for web use.
            2.  Place SVGs in HTML: Position the SVGs strategically within relevant section content using `<img>` or inline `<svg>`. Add `data-artifact-info` attributes containing the tooltip text (or an ID to look up). Make them focusable (`tabindex="0"`).
            3.  Define CSS Animations: Create subtle hover animations (e.g., coin spin `transform: rotateY(180deg)`, lamp flicker `opacity` change).
            4.  Implement JS Tooltip Logic:
                * Add `mouseenter`/`focus` listeners to artifacts.
                * On trigger, read `data-artifact-info`.
                * Display the info in a shared, themed tooltip element (position near the artifact).
                * Add `mouseleave`/`blur` listeners to hide the tooltip.
        * **Required Assets:** SVG files for each artifact type. Content for tooltips (facts/quotes).
        * **Considerations:** Keep artifacts subtle so they don't distract from main content. Ensure tooltips are accessible and don't obscure important information.

5.  **Enhanced Project Code Viewer:**
    * **Concept:** Improve the code snippet display in the project modal with UI controls.
    * **Interaction:** Buttons for Copy, Toggle Line Numbers. Optional language selection.
    * **Visual Implementation:** UI buttons, JS for clipboard interaction and class toggling.
    * **Feasibility/Impact:** High Feasibility / Medium Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** JavaScript (`navigator.clipboard.writeText`), DOM manipulation, CSS for button styling, Prism.js Line Numbers plugin (optional).
        * **Implementation Steps:**
            1.  Add Buttons to Modal HTML: Place "Copy" and "Line Numbers" buttons near the `<pre>` tag within the modal structure (initially hidden or styled).
            2.  Copy Button Logic:
                * Add a click listener to the "Copy" button.
                * Inside the listener, get the `textContent` of the corresponding `<code>` element.
                * Use `navigator.clipboard.writeText()` to copy the text.
                * Provide visual feedback (e.g., change button text to "Copied!" briefly). Handle potential errors.
            3.  Line Numbers Toggle Logic:
                * Add a click listener to the "Line Numbers" button.
                * Toggle a class (e.g., `line-numbers`) on the `<pre>` element.
                * Use the Prism Line Numbers plugin (requires including its JS/CSS) which automatically adds numbers when the class is present, OR implement custom JS line numbering if the plugin isn't used (more complex).
                * Update button text/state (e.g., "Show/Hide Lines").
            4.  (Optional) Language Selector: If needed, add a `<select>` dropdown. On change, update the `data.code` displayed and re-highlight with Prism, potentially fetching different code snippets.
        * **Required Assets:** Optional Prism.js Line Numbers plugin JS/CSS. Icons for buttons.
        * **Considerations:** Ensure clipboard API is used securely (requires HTTPS or localhost). Test line numbering thoroughly.

## II. Enhanced Visuals & Theming (Deeper Immersion)

1.  **"Living" Backgrounds & Textures:**
    * **Concept:** Make static textures feel more dynamic using CSS.
    * **Visual Implementation:** Layered CSS gradients, subtle animations (`background-position`, `opacity`), noise filters, `mix-blend-mode`.
    * **Feasibility/Impact:** Medium Feasibility / High Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** Advanced CSS Gradients (linear, radial, conic), CSS Animations (`@keyframes`), `background-blend-mode`, `mix-blend-mode`, SVG Filters (`<feTurbulence>`, `<feDiffuseLighting>`).
        * **Implementation Steps:**
            1.  *Identify Targets:* Select elements where dynamic textures would be most impactful (e.g., section backgrounds, card surfaces, footer).
            2.  *Marble/Stone:* Create layered gradients simulating veins. Animate `background-position` slowly on one layer to give a sense of shifting light/depth. Apply an SVG noise filter via CSS `filter: url(#noise)` for fine grain.
            3.  *Parchment:* Use a base parchment color/texture image. Overlay a large, soft radial gradient (`rgba(torch-color, 0.1)` to `transparent`) animated slowly via `@keyframes` (changing position or size) to simulate flickering light. Use `mix-blend-mode: multiply` or `overlay`.
            4.  *Mosaics:* If using CSS for mosaic patterns, animate `background-size` or `color-stop` positions subtly. If SVG, animate `<rect>` fills or strokes.
            5.  *Performance Check:* Test animations thoroughly, especially on lower-end devices. Use `will-change` sparingly. Keep animations subtle to avoid distraction and performance hits.
        * **Required Assets:** Optional base texture images. SVG filter definition for noise.
        * **Considerations:** Overuse can impact performance. Ensure subtlety. Test cross-browser compatibility for blend modes and filters.

2.  **Dynamic Lighting & Shadow System:**
    * **Concept:** Simulate more cohesive lighting using CSS variables and potentially JS for mouse interaction.
    * **Visual Implementation:** CSS variables for light direction, gradients for highlights/shadows, JS mouse tracking for reactive effects, atmospheric radial gradients in dark mode.
    * **Feasibility/Impact:** Medium-High Feasibility / High Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** CSS Custom Properties (Variables), CSS Gradients, `box-shadow`, JavaScript (event listeners `mousemove`, `getBoundingClientRect`), `requestAnimationFrame` (for performance).
        * **Implementation Steps:**
            1.  *Define Global Light:* Set CSS variables like `--light-source-x`, `--light-source-y` (e.g., -50%, -50% for top-left).
            2.  *Apply Consistent Shadows:* Use these variables in `box-shadow` offsets (e.g., `box-shadow: calc(var(--light-source-x) * -0.1) calc(var(--light-source-y) * -0.1) 15px rgba(0,0,0,0.3);`).
            3.  *Simulate Highlights:* Use pseudo-elements (`::before`, `::after`) with radial gradients positioned based on the light source variables (e.g., `background: radial-gradient(circle at calc(50% + var(--light-source-x)) calc(50% + var(--light-source-y)), rgba(255,255,255,0.1), transparent 70%);`).
            4.  *Mouse Reactivity (Optional):*
                * Add `mousemove` listener to key elements (e.g., mosaic tiles).
                * Calculate mouse position relative to the element center.
                * Update element-specific CSS variables (`--mouse-x`, `--mouse-y`).
                * Use these variables in CSS to position a highlight gradient or pseudo-element (`background: radial-gradient(circle at var(--mouse-x) var(--mouse-y), ...)`). Use `requestAnimationFrame` for performance.
            5.  *Dark Mode Atmosphere:* Add large, soft radial gradients to `body::before` or section backgrounds in dark mode, positioned near corners/edges, using dark gold/crimson tones with low opacity.
        * **Required Assets:** None.
        * **Considerations:** Mouse-tracking JS needs careful optimization. Keep lighting effects subtle to avoid being gimmicky.

3.  **Thematic Section Transitions:**
    * **Concept:** Enhance scrolling between sections with animated dividers or background shifts.
    * **Visual Implementation:** Animated SVG dividers, background overlays/shifts triggered by scroll, parallax titles.
    * **Feasibility/Impact:** Medium Feasibility / Medium-High Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** Intersection Observer, SVG Line Animation (Stroke properties, SMIL, or JS library like GSAP), CSS Masks or `clip-path`, CSS Transforms (`translateY`).
        * **Implementation Steps:**
            1.  *Animated Dividers:*
                * Create SVG dividers (laurel wreath, mosaic line). Ensure paths have distinct IDs/classes.
                * Use Intersection Observer to detect when a divider is near the viewport edge.
                * Trigger CSS animation on SVG paths (`stroke-dashoffset`, `stroke-dasharray`) or use a JS animation library.
            2.  *Background Shift:*
                * Use Intersection Observer to detect when scrolling between sections (observing the section elements themselves).
                * When a section boundary is crossed, briefly apply a class to the `<body>` or a wrapper element that triggers a transition on a full-page pseudo-element (e.g., change its `background-color` or `opacity` for a fade/color shift effect).
            3.  *Parallax Titles:*
                * On scroll, use JS to calculate a `translateY` value for section titles based on scroll position, applying a multiplier less than 1 (e.g., `title.style.transform = \`translateY(${window.scrollY * 0.2}px)\`;`). Optimize with `requestAnimationFrame`.
        * **Required Assets:** SVG divider graphics.
        * **Considerations:** Ensure smooth performance, especially with parallax effects. Test divider animations across browsers.

4.  **Refined Preloader Animations:**
    * **Concept:** Add particle effects, improved textures/lighting, and optional sound to preloaders.
    * **Visual Implementation:** CSS pseudo-elements or Canvas for particles, improved SVG detail/filters, Web Audio API for sound.
    * **Feasibility/Impact:** Medium-High Feasibility / Medium Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** CSS Pseudo-elements (`::before`, `::after`), `@keyframes`, `transform`, `opacity`, Canvas API (for complex particles), SVG Filters (`<feGaussianBlur>`, `<feSpecularLighting>`), Web Audio API.
        * **Implementation Steps:**
            1.  *Roman Seal Particles:* During the `.cracking` / `.hiding` states, use JS to dynamically create and animate small `<div>` elements (or Canvas particles) representing dust/sparks emanating from the seal container. Apply random trajectories and fade-out animations via CSS or JS.
            2.  *Seal SVG Enhancement:* Edit the SVG to add subtle texture fills (`<pattern>`) or lighting effects using SVG filters (`<filter>`).
            3.  *Seal Sound:* Load a short "crumbling stone" sound file. Use Web Audio API to play it briefly when the `.cracking` class is added. **Crucially, add a UI toggle somewhere (e.g., footer) to mute all site sounds.**
            4.  *Gilded Card Polish:* Animate the `background-position` of a subtle metallic grain texture image/gradient on the card. Make the quote transitions use a letter-by-letter animation library or custom JS character shuffling effect. Enhance the `.enter-gleam` animation for the button.
        * **Required Assets:** Optional particle images/shapes. Sound file (e.g., .mp3, .ogg). Enhanced SVG for seal.
        * **Considerations:** Particles/sound can impact performance/annoy users – use sparingly and provide controls.

5.  **Consistent Iconography & Glyphs:**
    * **Concept:** Ensure visual consistency with Roman-themed icons and reusable glyphs.
    * **Visual Implementation:** Review Font Awesome usage, create custom SVGs, use glyphs as bullets/accents.
    * **Feasibility/Impact:** High Feasibility / Medium Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** SVG editing software, CSS (`list-style-image`, `::before` content).
        * **Implementation Steps:**
            1.  *Audit Icons:* Review all `<i>` tags using Font Awesome. Replace any icons that clash with the theme (e.g., overly modern tech icons) with more suitable alternatives or custom SVGs.
            2.  *Create Custom SVGs:* Design SVGs for specific needs (e.g., Domus legend symbols, unique section title icons) in a consistent style (line weight, detail level). Optimize SVGs.
            3.  *Create Glyphs:* Design small, simple SVGs (laurel, eagle, numeral).
            4.  *Implement Glyphs:*
                * Use glyphs as list bullets via `list-style-image: url('path/to/glyph.svg');` or by hiding default bullets and using `::before { content: ''; background-image: url(...); }`.
                * Use glyphs in decorative corners or alongside titles using pseudo-elements or inline SVGs.
        * **Required Assets:** Custom SVG icons and glyphs.
        * **Considerations:** Ensure SVGs are optimized. Maintain visual balance – don't overuse decoration.

6.  **Responsive Typography Scaling:**
    * **Concept:** Use fluid typography techniques for better scaling.
    * **Visual Implementation:** CSS `clamp()` for `font-size`, potentially adjusting `letter-spacing`/`line-height` in media queries.
    * **Feasibility/Impact:** High Feasibility / High Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** CSS `clamp(MIN, PREFERRED, MAX)`, Media Queries.
        * **Implementation Steps:**
            1.  *Identify Targets:* Apply `clamp()` primarily to headings (`h1`-`h6`) and potentially key text elements like hero subtitles.
            2.  *Define Values:* Determine appropriate minimum font sizes (for small screens), preferred sizes (based on viewport width, e.g., `1rem + 2vw`), and maximum sizes (to prevent excessive size on large screens). Example: `font-size: clamp(1.5rem, 1rem + 3vw, 3rem);`.
            3.  *Refine Line Height/Spacing:* Check readability at different viewport sizes. If necessary, adjust `line-height` or `letter-spacing` within media queries for specific breakpoints where `clamp()` alone isn't sufficient.
        * **Required Assets:** None.
        * **Considerations:** Test thoroughly across various screen sizes and devices.

7.  **Animated SPQR Banner Refinement:**
    * **Concept:** Add subtle life to the hero section's SPQR banner.
    * **Visual Implementation:** CSS wave/ripple animation, pulsing glow on eagles, optional parallax.
    * **Feasibility/Impact:** Medium Feasibility / Medium Impact.
    * **Game Plan:**
        * **Technologies/Techniques:** CSS Animations (`@keyframes`), `transform`, `filter: drop-shadow()`, JavaScript (optional, for parallax).
        * **Implementation Steps:**
            1.  *Banner Ripple:* Apply a background image/gradient simulating fabric. Use a CSS `@keyframes` animation that subtly shifts `background-position` or uses a `transform: skewY()` effect to create a slow wave.
            2.  *Eagle Glow:* Target the `.spqr-eagle i` elements. Create a `@keyframes` animation that subtly pulses the `text-shadow` or `filter: drop-shadow()` effect with a golden color.
            3.  *Parallax (Optional):* In the main scroll handler JS, apply a slight `translateY` transform to the `.spqr-banner` element with a multiplier different from the main content (e.g., `banner.style.transform = \`translateY(${window.scrollY * 0.1}px)\`;`).
        * **Required Assets:** Optional fabric texture for banner.
        * **Considerations:** Keep animations subtle to avoid distraction. Test performance of parallax effect.