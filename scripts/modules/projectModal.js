/**
 * projectModal.js
 * Manages the project modal functionality including opening, closing and populating.
 */

/**
 * Initializes and manages the project modal for showcasing detailed project information.
 * Handles opening, closing, and populating the modal with project data.
 */
export default function initProjectModal() {
    const modal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const projectBtns = document.querySelectorAll('.view-project-btn'); // Buttons on project cards
    const modalContent = modal ? modal.querySelector('.modal-content') : null; // Inner content area
    const modalNav = document.createElement('div');
    let currentProjectId = null;
    let projectIds = [];

    // Exit if essential modal elements are missing
    if (!modal || !modalCloseBtn || !modalContent) {
        console.warn('Project modal elements not found. Feature disabled.');
        return;
    }

    // --- Project Data ---
    // Store project details here. In a real application, this might come from an API.
    const projectData = {
        'imc': { // Matches data-project-id="imc"
            title: 'Systematic Trading Framework',
            subtitle: 'Quantitative Strategy Development',
            date: 'Spring 2025',
            objective: 'Build an algorithmic trading system for competitive market simulation that optimizes for risk-adjusted returns while maintaining market-making obligations.',
            approach: 'Developed a statistical model to estimate fair value based on order book imbalance and recent trade history. Implemented dynamic hedging and inventory management logic with adaptive risk limits.',
            tech: 'Python, NumPy, Pandas, Scikit-learn, Statistical Analysis',
            results: 'Achieved top 15% placement globally with Sharpe ratio of 2.3. Successfully managed risk through high volatility scenarios while maintaining consistent profitability.',
            codeLang: 'python', // Specify language for Prism.js
            code: `import numpy as np
import pandas as pd

class MarketMaker:
    def __init__(self, risk_limit=100, edge_factor=0.2):
        self.position = 0
        self.cash = 10000
        self.risk_limit = risk_limit
        self.edge_factor = edge_factor
        self.trades = []
        self.market_data = []
        self.fair_value = None
        self.last_trade_time = None

    def update_fair_value(self, order_book):
        # Simplified fair value calculation
        if not order_book or not order_book.get('bids') or not order_book.get('asks'):
             return None # Handle empty or invalid order book
        best_bid = order_book['bids'][0]['price']
        best_ask = order_book['asks'][0]['price']
        mid_price = (best_bid + best_ask) / 2
        # Placeholder for imbalance calculation
        imbalance = 0 # Replace with actual calculation if data available
        self.fair_value = mid_price * (1 + imbalance * self.edge_factor)
        return self.fair_value
    def place_order(self, order_type, size):
        if abs(self.position) + size > self.risk_limit:
            print("Order exceeds risk limit.")
            return None
        if order_type == 'buy':
            self.position += size
            self.cash -= size * self.fair_value
        elif order_type == 'sell':
            self.position -= size
            self.cash += size * self.fair_value
        else:
            print("Invalid order type.")
            return None
        self.trades.append({'type': order_type, 'size': size, 'price': self.fair_value})
        self.last_trade_time = pd.Timestamp.now()
        return {'type': order_type, 'size': size, 'price': self.fair_value}`,
            links: [ // Array of link objects
                { text: 'GitHub Repository', url: '#', icon: 'fab fa-github' },
                { text: 'Research Paper', url: '#', icon: 'fas fa-file-alt' }
            ]
        },
        'messari': { // Matches data-project-id="messari"
            title: 'Stablecoin Analytics Dashboard',
            subtitle: 'Blockchain Data Analysis (Messari Research)',
            date: 'Spring 2025',
            objective: 'Create a real-time monitoring system for major stablecoins that tracks key metrics such as market cap, collateralization ratio, and on-chain activity.',
            approach: 'Built data pipelines to collect on-chain data from multiple blockchains (Ethereum, Solana, Arbitrum). Implemented statistical models to detect anomalies and potential de-pegging events.',
            tech: 'Python, Web3.py, SQL, Dash/Plotly, Ethereum, Solana, Arbitrum',
            results: 'Dashboard provided critical real-time insights during market turbulence, detecting early warning signs of stablecoin stress. Research findings were published in Messari Pro Research reports.',
            codeLang: 'python',
            code: `import pandas as pd
import plotly.express as px
from dash import Dash, dcc, html # Assuming Dash for dashboard
# Placeholder for Web3 connection setup
# from web3 import Web3

class StablecoinMonitor:
    def __init__(self, config):
        self.config = config
        # self.web3_connections = {chain: Web3(Web3.HTTPProvider(endpoint))
        #                          for chain, endpoint in config['rpc_endpoints'].items()}
        print("Monitor Initialized (Web3 connection placeholder)")`,
            links: [
                { text: 'Interactive Dashboard', url: '#', icon: 'fas fa-chart-line' },
                { text: 'Research Report (Messari)', url: '#', icon: 'fas fa-file-pdf' }
            ]
        },
        'point72': {
            title: 'Restaurant Industry Analysis',
            subtitle: 'Investment Pitch Case Study',
            date: 'Fall 2024',
            objective: 'Develop a comprehensive investment thesis on a publicly-traded restaurant chain, including detailed financial modeling and industry analysis.',
            approach: 'Created a 5-year DCF model with detailed revenue projections by location type and sensitivity analysis. Performed competitive analysis of margin structures across the industry and examined impact of inflation on cost structure.',
            tech: 'Excel, Financial Modeling, DCF Analysis, Comparable Company Analysis, Industry Research',
            results: 'Identified 27% downside potential in target company due to margin compression and slowing unit growth. Presentation received excellent feedback from investment professionals.',
            codeLang: 'plaintext',
            code: `// Financial Model Structure (Excel Logic Example)

// Revenue Forecast = Sum(Locations[Type] * Avg_Revenue_Per_Location[Type])
Revenue_Year[t] = Σ (Locations[t][i] * Avg_Revenue[t][i])
// Location Types: Urban, Suburban, Rural`,
            links: [
                { text: 'Financial Model (Excel)', url: '#', icon: 'fas fa-file-excel' },
                { text: 'Presentation Deck', url: '#', icon: 'fas fa-file-powerpoint' }
            ]
        }
    };

    // Collect all project IDs for navigation
    projectBtns.forEach(btn => {
        const projectId = btn.getAttribute('data-project-id');
        if (projectId) projectIds.push(projectId);
    });

    // Function to add loading state to modal
    const setLoadingState = (isLoading) => {
        if (isLoading) {
            modalContent.classList.add('is-loading');
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading-spinner';
            loadingIndicator.innerHTML = '<div class="spinner"></div>';
            modalContent.appendChild(loadingIndicator);
        } else {
            modalContent.classList.remove('is-loading');
            const loadingIndicator = modalContent.querySelector('.loading-spinner');
            if (loadingIndicator) loadingIndicator.remove();
        }
    };

    // Function to navigate to next or previous project
    const navigateProject = (direction) => {
        if (!currentProjectId || projectIds.length <= 1) return;
        
        const currentIndex = projectIds.indexOf(currentProjectId);
        let newIndex;
        
        if (direction === 'next') {
            newIndex = (currentIndex + 1) % projectIds.length;
        } else {
            newIndex = (currentIndex - 1 + projectIds.length) % projectIds.length;
        }
        
        const newProjectId = projectIds[newIndex];
        openModal(newProjectId);
        
        // Update active button state
        document.querySelectorAll('.view-project-btn.active').forEach(btn => {
            btn.classList.remove('active');
        });
        const newActiveBtn = document.querySelector(`.view-project-btn[data-project-id="${newProjectId}"]`);
        if (newActiveBtn) newActiveBtn.classList.add('active');
    };

    // Function to populate and open the modal
    const openModal = (projectId) => {
        const data = projectData[projectId];
        currentProjectId = projectId;
        
        if (!data) {
            console.error(`Project data not found for ID: ${projectId}`);
            return;
        }
        
        // Show loading state
        setLoadingState(true);
        
        // Simulate network delay (remove in production)
        setTimeout(() => {
            // Populate modal content elements safely
            const setTitle = (id, text) => { const el = modalContent.querySelector(`#${id}`); if (el) el.textContent = text || ''; };
            
            // Set text content for all fields
            setTitle('modal-title', data.title);
            setTitle('modal-subtitle', data.subtitle);
            setTitle('modal-date', data.date);
            setTitle('modal-objective', data.objective);
            setTitle('modal-approach', data.approach);
            setTitle('modal-tech', data.tech);
            setTitle('modal-results', data.results);
            
            // Handle code display with syntax highlighting
            const codeBlock = modalContent.querySelector('#modal-code-block');
            if (codeBlock) {
                codeBlock.textContent = data.code || '';
                codeBlock.className = `language-${data.codeLang || 'plaintext'}`;
                
                // Apply syntax highlighting if Prism is available
                if (window.Prism) {
                    Prism.highlightElement(codeBlock);
                }
            }
            
            // Handle links section
            const linksContainer = modalContent.querySelector('#modal-links');
            if (linksContainer) {
                // Clear existing links
                linksContainer.innerHTML = '';
                
                // Add new links if available
                if (data.links && data.links.length) {
                    data.links.forEach(link => {
                        const linkElement = document.createElement('a');
                        linkElement.href = link.url;
                        linkElement.className = 'project-link';
                        linkElement.target = '_blank';
                        linkElement.rel = 'noopener noreferrer';
                        
                        // Add icon if specified
                        if (link.icon) {
                            const icon = document.createElement('i');
                            icon.className = link.icon;
                            linkElement.appendChild(icon);
                        }
                        
                        // Add text
                        const text = document.createTextNode(` ${link.text}`);
                        linkElement.appendChild(text);
                        
                        linksContainer.appendChild(linkElement);
                    });
                    
                    // Add share buttons
                    const shareSection = document.createElement('div');
                    shareSection.className = 'share-section';
                    shareSection.innerHTML = '<h4>Share This Project</h4>';
                    
                    const shareButtons = document.createElement('div');
                    shareButtons.className = 'share-buttons';
                    
                    // LinkedIn share
                    const linkedinBtn = document.createElement('button');
                    linkedinBtn.className = 'share-btn linkedin';
                    linkedinBtn.innerHTML = '<i class="fab fa-linkedin"></i>';
                    linkedinBtn.addEventListener('click', () => {
                        const url = encodeURIComponent(window.location.href);
                        const title = encodeURIComponent(data.title);
                        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}`, '_blank');
                    });
                    
                    // Twitter share
                    const twitterBtn = document.createElement('button');
                    twitterBtn.className = 'share-btn twitter';
                    twitterBtn.innerHTML = '<i class="fab fa-twitter"></i>';
                    twitterBtn.addEventListener('click', () => {
                        const url = encodeURIComponent(window.location.href);
                        const text = encodeURIComponent(`Check out this project: ${data.title}`);
                        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
                    });
                    
                    shareButtons.appendChild(linkedinBtn);
                    shareButtons.appendChild(twitterBtn);
                    shareSection.appendChild(shareButtons);
                    linksContainer.appendChild(shareSection);
                } else {
                    // No links available message
                    linksContainer.innerHTML = '<p>No resources available for this project.</p>';
                }
            }
            
            // Handle project images with progressive loading
            const imagesContainer = modalContent.querySelector('#modal-images');
            if (imagesContainer && data.images) {
                imagesContainer.innerHTML = '';
                data.images.forEach(image => {
                    const imgWrapper = document.createElement('div');
                    imgWrapper.className = 'modal-image-wrapper';
                    
                    const img = new Image();
                    img.className = 'modal-image loading';
                    
                    // Add low-res thumbnail as placeholder
                    if (image.thumbnail) {
                        img.style.backgroundImage = `url(${image.thumbnail})`;
                    }
                    
                    // Load high-res image
                    img.onload = () => {
                        img.classList.remove('loading');
                        img.classList.add('loaded');
                    };
                    img.src = image.src;
                    img.alt = image.alt || data.title;
                    
                    imgWrapper.appendChild(img);
                    imagesContainer.appendChild(imgWrapper);
                });
            }
            
            // Add navigation buttons if there are multiple projects
            if (projectIds.length > 1) {
                modalNav.className = 'modal-nav';
                modalNav.innerHTML = `
                    <button class="modal-nav-btn prev" aria-label="Previous project">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="modal-nav-btn next" aria-label="Next project">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                `;
                
                if (!modalContent.contains(modalNav)) {
                    modalContent.appendChild(modalNav);
                }
                
                // Add event listeners to navigation buttons
                const prevBtn = modalNav.querySelector('.prev');
                const nextBtn = modalNav.querySelector('.next');
                
                prevBtn.addEventListener('click', () => navigateProject('prev'));
                nextBtn.addEventListener('click', () => navigateProject('next'));
            }
            
            // Remove loading state
            setLoadingState(false);
            
            // Apply animation class for entrance effect
            modal.classList.add('is-active');
            modalContent.classList.add('animate-in');
            
            // Prevent page scrolling when modal is open
            document.body.style.overflow = 'hidden';
            
            // Focus trap for accessibility
            setTimeout(() => {
                modalCloseBtn.focus();
            }, 100);
        }, 300); // Simulated loading time, remove in production
    };
    
    // Function to close the modal
    const closeModal = () => {
        // Apply exit animation
        modalContent.classList.remove('animate-in');
        modalContent.classList.add('animate-out');
        
        // Allow time for animation to complete before hiding modal
        setTimeout(() => {
            modal.classList.remove('is-active');
            modalContent.classList.remove('animate-out');
            
            // Re-enable page scrolling
            document.body.style.overflow = '';
            
            // Return focus to the button that opened the modal
            const activeProjectBtn = document.querySelector('.view-project-btn.active');
            if (activeProjectBtn) {
                activeProjectBtn.focus();
                activeProjectBtn.classList.remove('active');
            }
            
            // Reset current project ID
            currentProjectId = null;
        }, 300); // Match this with your CSS transition duration
    };
    
    // Event: Open modal when a project button is clicked
    projectBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = btn.getAttribute('data-project-id');
            
            // Mark this button as active (for returning focus later)
            btn.classList.add('active');
            
            // Open the modal with this project's data
            openModal(projectId);
        });
    });
    
    // Event: Close modal when close button is clicked
    modalCloseBtn.addEventListener('click', closeModal);
    
    // Event: Close modal when clicking outside content area
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Event: Close modal on Escape key press and navigate projects with arrow keys
    document.addEventListener('keydown', (e) => {
        // Only handle keyboard events when modal is active
        if (!modal.classList.contains('is-active')) return;
        
        switch (e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowRight':
                navigateProject('next');
                break;
            case 'ArrowLeft':
                navigateProject('prev');
                break;
        }
    });
    
    // Initialize any required CSS state
    modal.style.display = 'none';
    modal.style.display = ''; // Reset to CSS control
    
    return {
        openModal,
        closeModal,
        navigateProject
    };
}