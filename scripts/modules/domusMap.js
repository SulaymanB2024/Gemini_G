/**
 * domusMap.js
 * Handles interactive Roman house (domus) map functionality
 * Version: 3.0 (Modular Architecture)
 */

/**
 * Initializes the interactive domus (Roman house) map
 */
export function initDomusMap() {
    const domusMap = document.querySelector('.domus-map');
    
    if (!domusMap) {
        console.warn('Domus map not found. Domus map functionality disabled.');
        return;
    }
    
    // Get all interactive areas of the domus
    const domusRooms = document.querySelectorAll('.domus-room');
    
    // Get map info container
    const domusInfo = document.querySelector('.domus-info');
    
    // Add event listeners to each room
    domusRooms.forEach(room => {
        room.addEventListener('click', handleRoomClick);
        room.addEventListener('mouseenter', handleRoomHover);
        room.addEventListener('mouseleave', handleRoomLeave);
        room.addEventListener('focus', handleRoomHover);
        room.addEventListener('blur', handleRoomLeave);
    });
    
    // Add toggle functionality for domus mode
    initDomusToggle();
    
    // Initialize domus info area with default content
    if (domusInfo) {
        setDomusDefaultInfo(domusInfo);
    }
}

/**
 * Handles clicking on a room
 * @param {Event} e - Click event
 */
function handleRoomClick(e) {
    const room = e.currentTarget;
    
    // Toggle selected state on all rooms
    document.querySelectorAll('.domus-room').forEach(r => {
        if (r !== room) {
            r.classList.remove('selected');
        }
    });
    
    // Toggle selected state on this room
    room.classList.toggle('selected');
    
    // Update info area
    if (room.classList.contains('selected')) {
        updateDomusInfo(room);
    } else {
        setDomusDefaultInfo(document.querySelector('.domus-info'));
    }
    
    // Play click sound if available
    const clickSound = document.getElementById('domus-click-sound');
    if (clickSound) {
        // Reset audio to beginning if already playing
        clickSound.currentTime = 0;
        clickSound.play().catch(err => {
            console.warn('Could not play click sound:', err);
        });
    }
}

/**
 * Handles hovering over a room
 * @param {Event} e - Mouse event
 */
function handleRoomHover(e) {
    const room = e.currentTarget;
    room.classList.add('hovered');
    
    // Show tooltip if available
    const roomName = room.getAttribute('data-room-name');
    
    if (roomName) {
        // Create tooltip if it doesn't exist
        let tooltip = document.querySelector('.domus-tooltip');
        
        if (!tooltip) {
            tooltip = document.createElement('div');
            tooltip.className = 'domus-tooltip';
            document.body.appendChild(tooltip);
        }
        
        // Position tooltip near mouse or room
        const roomRect = room.getBoundingClientRect();
        tooltip.textContent = roomName;
        
        // Position tooltip
        if (e.type === 'mouseenter') {
            // Use mouse position for mouseenter
            tooltip.style.left = `${e.clientX + 15}px`;
            tooltip.style.top = `${e.clientY + 15}px`;
        } else {
            // Use element center for focus
            tooltip.style.left = `${roomRect.left + roomRect.width / 2}px`;
            tooltip.style.top = `${roomRect.top - 30}px`;
        }
        
        tooltip.classList.add('visible');
    }
}

/**
 * Handles mouse leaving a room
 * @param {Event} e - Mouse event
 */
function handleRoomLeave() {
    // Only remove hover, not selected state
    this.classList.remove('hovered');
    
    // Hide tooltip
    const tooltip = document.querySelector('.domus-tooltip');
    if (tooltip) {
        tooltip.classList.remove('visible');
    }
}

/**
 * Updates the domus info area with room information
 * @param {HTMLElement} room - The selected room element
 */
function updateDomusInfo(room) {
    const domusInfo = document.querySelector('.domus-info');
    if (!domusInfo) return;
    
    // Get room data
    const roomId = room.getAttribute('id');
    const roomName = room.getAttribute('data-room-name') || 'Unknown Room';
    const roomDesc = room.getAttribute('data-room-desc') || 'No description available.';
    const roomFunction = room.getAttribute('data-room-function') || 'Unknown function';
    
    // Update info content
    domusInfo.innerHTML = `
        <h3 class="domus-info-title">${roomName}</h3>
        <div class="domus-info-content">
            <p class="domus-info-desc">${roomDesc}</p>
            <p class="domus-info-function"><strong>Function:</strong> ${roomFunction}</p>
        </div>
        <div class="domus-info-footer">
            <span class="domus-info-id">${roomId || ''}</span>
        </div>
    `;
}

/**
 * Sets default content in the domus info area
 * @param {HTMLElement} infoElement - The info element to update
 */
function setDomusDefaultInfo(infoElement) {
    if (!infoElement) return;
    
    infoElement.innerHTML = `
        <h3 class="domus-info-title">Roman Domus Map</h3>
        <div class="domus-info-content">
            <p class="domus-info-desc">Click on different areas of the Roman house to learn about each room and its function in ancient Roman architecture.</p>
            <p class="domus-info-tip">Each room in a Roman domus had a specific purpose that reflected Roman daily life and social structure.</p>
        </div>
        <div class="domus-info-footer">
            <span class="domus-info-help">Select a room to begin exploring</span>
        </div>
    `;
}

/**
 * Initializes the toggle functionality for showing/hiding the domus map
 */
function initDomusToggle() {
    const domusToggle = document.querySelector('.domus-nav-toggle');
    const domusContainer = document.querySelector('.domus-container');
    
    if (!domusToggle || !domusContainer) return;
    
    domusToggle.addEventListener('click', () => {
        // Toggle domus visibility
        domusContainer.classList.toggle('active');
        
        // Update button text and aria attributes
        const isActive = domusContainer.classList.contains('active');
        
        if (isActive) {
            domusToggle.innerHTML = '<i class="fas fa-times"></i> Close Map';
            domusToggle.setAttribute('aria-expanded', 'true');
        } else {
            domusToggle.innerHTML = '<i class="fas fa-map-marked-alt"></i> Roman Domus';
            domusToggle.setAttribute('aria-expanded', 'false');
        }
    });
    
    // Close button in domus container
    const domusClose = domusContainer.querySelector('.domus-close');
    if (domusClose) {
        domusClose.addEventListener('click', () => {
            domusContainer.classList.remove('active');
            domusToggle.innerHTML = '<i class="fas fa-map-marked-alt"></i> Roman Domus';
            domusToggle.setAttribute('aria-expanded', 'false');
        });
    }
}