/**
 * Project Modal Module
 * Handles the display and interaction with project detail modals
 * Version: 3.2 - Enhanced with Roman-themed styling, dynamic lighting, and improved code viewer
 */

export default class ProjectModal {
  constructor() {
    this.currentProject = null;
    this.modalOverlay = null;
    this.modalContent = null;
    this.activeCategory = 'All';
    this.animationInProgress = false;
    this.viewMode = 'grid'; // grid or timeline
    this.lightSource = { x: 0, y: -30 }; // Default light source position

    this.projectData = {
      imc: {
        title: "Systematic Trading Framework",
        description: `A comprehensive trading framework built with Python for algorithmic trading strategies. 
        This framework includes advanced technical indicator generation, backtesting capabilities, and strategy optimization.`,
        details: [
          "Implemented multiple trading strategies using statistical analysis and technical indicators",
          "Created a backtesting engine to evaluate strategy performance across different market conditions",
          "Designed a risk management module to optimize position sizing and limit downside exposure"
        ],
        technologies: ["Python", "Pandas", "NumPy", "Matplotlib", "Statistical Analysis"],
        links: [{
          text: "GitHub Repository",
          url: "https://github.com/SulaymanB2024/IMC_BOT"
        }],
        year: "2024",
        romanYear: "MMXXIV",
        codeSample: {
          title: 'Trading Strategy Implementation',
          language: 'python',
          code: `# Systematic Trading Strategy Implementation
import pandas as pd
import numpy as np
from backtesting import Strategy

class AdaptiveMomentumStrategy(Strategy):
    """An adaptive momentum strategy that dynamically adjusts parameters
    based on recent market volatility."""
    
    def init(self):
        # Parameters
        self.n1 = 10  # Fast moving average period
        self.n2 = 21  # Slow moving average period
        self.volatility_window = 63  # Window for volatility calculation
        
        # Calculate moving averages
        self.fast_ma = self.I(lambda: self.data.Close.ewm(span=self.n1).mean())
        self.slow_ma = self.I(lambda: self.data.Close.ewm(span=self.n2).mean())
        
        # Calculate dynamic volatility
        self.volatility = self.I(lambda: self.data.Close.pct_change().rolling(self.volatility_window).std())
    
    def next(self):
        # Adjust position size based on inverse of recent volatility
        risk_adjustment = 0.1 / self.volatility[-1] if self.volatility[-1] > 0 else 1
        risk_adjustment = min(risk_adjustment, 1.0)  # Cap the position size
        
        # Trading logic - buy when fast MA crosses above slow MA
        if self.fast_ma[-1] > self.slow_ma[-1] and self.fast_ma[-2] <= self.slow_ma[-2]:
            self.buy(size=risk_adjustment)
        
        # Sell when fast MA crosses below slow MA
        elif self.fast_ma[-1] < self.slow_ma[-1] and self.fast_ma[-2] >= self.slow_ma[-2]:
            self.position.close()`
        }
      },
      messari: {
        title: "Stablecoin Analytics Dashboard",
        description: `Real-time monitoring system for stablecoin market metrics. This dashboard tracks key performance 
        indicators and market conditions for major stablecoins across various blockchain networks.`,
        details: [
          "Developed data pipelines to aggregate on-chain and market data from multiple sources",
          "Created interactive visualizations to track stablecoin performance metrics over time",
          "Implemented alert systems for detecting market anomalies and potential depeg events"
        ],
        technologies: ["Python", "Web3", "SQL", "Tableau", "Data Analysis"],
        links: [],
        year: "2023",
        romanYear: "MMXXIII",
        codeSample: {
          title: 'Stablecoin Monitoring',
          language: 'python',
          code: `# Stablecoin Analytics Dashboard - Market Data Monitor
from web3 import Web3
import pandas as pd
import plotly.graph_objects as go

class StablecoinMonitor:
    def __init__(self, stablecoin_address, blockchain="ethereum"):
        self.address = stablecoin_address
        self.blockchain = blockchain
        self.w3 = Web3(Web3.HTTPProvider('https://mainnet.infura.io/v3/YOUR_INFURA_KEY'))
        self.historical_data = pd.DataFrame()
        self.alert_thresholds = {
            'price_deviation': 0.015,  # Alert if price deviates 1.5% from peg
            'daily_volume_increase': 0.35,  # Alert if volume increases by 35%
            'large_transfer': 1000000  # Alert on transfers over $1M
        }
    
    def fetch_on_chain_metrics(self):
        """Fetch on-chain metrics like total supply, holder count, etc."""
        # Contract ABI simplified for example
        abi = [{"constant": True, "inputs": [], "name": "totalSupply", "outputs": [{"name": "", "type": "uint256"}]}]
        contract = self.w3.eth.contract(address=self.w3.toChecksumAddress(self.address), abi=abi)
        
        # Get total supply
        total_supply = contract.functions.totalSupply().call() / 10**6  # Assuming 6 decimals
        
        return {
            'total_supply': total_supply,
            'blockchain': self.blockchain,
            'timestamp': pd.Timestamp.now()
        }
    
    def detect_depegging_events(self, price_data):
        """Analyze price data to detect potential depegging events"""
        # Calculate moving average and volatility
        price_data['ma7d'] = price_data['price'].rolling(7).mean()
        price_data['volatility'] = price_data['price'].rolling(14).std()
        
        # Detect potential depeg events
        price_data['depeg_alert'] = abs(price_data['price'] - 1.0) > self.alert_thresholds['price_deviation']
        
        # Calculate severity of depegging
        depeg_events = price_data[price_data['depeg_alert']]
        
        return depeg_events`
        }
      },
      point72: {
        title: "Restaurant Industry Analysis",
        description: `Comprehensive financial modeling and industry analysis focused on the restaurant sector. 
        This project includes detailed valuation models, competitive analysis, and market trend forecasting.`,
        details: [
          "Conducted valuation analysis using multiple methodologies (DCF, Comps, LBO)",
          "Performed ZIP-code level competitive analysis to identify market opportunities",
          "Developed scenario models to project performance under varying economic conditions"
        ],
        technologies: ["Excel", "Financial Modeling", "Industry Research", "Valuation"],
        links: [{
          text: "Download PDF",
          url: "Arav Chheda_Jireh Capital Management_Point72 Case Study.pdf",
          download: true
        }],
        year: "2023",
        romanYear: "MMXXIII"
      },
      blockchain: {
        title: "Cryptocurrency Research",
        description: `In-depth research and analysis of cryptocurrency markets and blockchain technology. 
        This project includes protocol evaluations, tokenomics analysis, and investment recommendations.`,
        details: [
          "Analyzed token economic models and incentive structures of leading blockchain protocols",
          "Evaluated technical architecture and scalability solutions across different networks",
          "Forecasted adoption trends and market opportunities in the cryptocurrency ecosystem"
        ],
        technologies: ["Blockchain", "Tokenomics", "Financial Analysis", "Market Research"],
        links: [],
        year: "2022",
        romanYear: "MMXXII"
      },
      energy: {
        title: "Energy Markets Analysis",
        description: `Comprehensive analysis of energy commodity markets with a focus on trading opportunities. 
        This project includes price forecasting models, seasonal trend analysis, and market inefficiency identification.`,
        details: [
          "Developed models to predict natural gas and electricity price movements",
          "Analyzed seasonal patterns in energy consumption and production",
          "Identified market inefficiencies and arbitrage opportunities across regional energy markets"
        ],
        technologies: ["Python", "Statistical Analysis", "Market Research", "Forecasting"],
        links: [{
          text: "View on GitHub",
          url: "https://github.com/SulaymanB2024/UTexas_Coal",
          external: true
        }],
        year: "2022",
        romanYear: "MMXXII"
      }
    };

    this.categories = ['All'];
    Object.values(this.projectData).forEach(project => {
      if (project.technologies) {
        project.technologies.forEach(tech => {
          const category = this.getCategoryFromTech(tech);
          if (!this.categories.includes(category)) {
            this.categories.push(category);
          }
        });
      }
    });

    this.codeViewerShowLineNumbers = true;

    this.init();
  }

  getCategoryFromTech(tech) {
    const techCategories = {
      'Python': 'Programming',
      'Pandas': 'Data Science',
      'NumPy': 'Data Science',
      'Matplotlib': 'Data Science',
      'Statistical Analysis': 'Data Science',
      'Web3': 'Blockchain',
      'SQL': 'Database',
      'Tableau': 'Data Science',
      'Data Analysis': 'Data Science',
      'Excel': 'Finance',
      'Financial Modeling': 'Finance',
      'Industry Research': 'Research',
      'Valuation': 'Finance',
      'Blockchain': 'Blockchain',
      'Tokenomics': 'Blockchain',
      'Financial Analysis': 'Finance',
      'Market Research': 'Research',
      'Forecasting': 'Data Science'
    };

    return techCategories[tech] || 'Other';
  }

  getCategoryIcon(category) {
    const iconMap = {
      'Programming': 'programming-icon',
      'Data Science': 'programming-icon',
      'Database': 'programming-icon',
      'Blockchain': 'blockchain-icon',
      'Finance': 'finance-icon',
      'Research': 'research-icon',
      'Other': 'programming-icon'
    };

    return iconMap[category] || 'programming-icon';
  }

  init() {
    this.createModalElements();
    this.createFilterButtons();
    this.createViewModeToggle();
    this.bindEvents();
    this.enhanceProjectCards();
    this.setupDynamicLighting();
  }

  createModalElements() {
    if (!document.getElementById('project-modal-overlay')) {
      this.modalOverlay = document.createElement('div');
      this.modalOverlay.id = 'project-modal-overlay';
      this.modalOverlay.className = 'project-modal-overlay';

      this.modalContent = document.createElement('div');
      this.modalContent.className = 'project-modal-content';

      const closeButton = document.createElement('button');
      closeButton.className = 'project-modal-close';
      closeButton.innerHTML = '&times;';
      closeButton.setAttribute('aria-label', 'Close project details');

      this.modalContent.appendChild(closeButton);
      this.modalOverlay.appendChild(this.modalContent);
      document.body.appendChild(this.modalOverlay);
    } else {
      this.modalOverlay = document.getElementById('project-modal-overlay');
      this.modalContent = this.modalOverlay.querySelector('.project-modal-content');
    }

    if (this.modalContent && !this.modalContent.querySelector('.roman-decorative-elements')) {
      const decorativeElements = document.createElement('div');
      decorativeElements.className = 'roman-decorative-elements';
      decorativeElements.innerHTML = `
        <div class="laurel-left"></div>
        <div class="laurel-right"></div>
        <div class="roman-border-top"></div>
        <div class="roman-border-bottom"></div>
        <div class="column-pillar left"></div>
        <div class="column-pillar right"></div>
        <div class="mosaic-corner top-left"></div>
        <div class="mosaic-corner top-right"></div>
        <div class="mosaic-corner bottom-left"></div>
        <div class="mosaic-corner bottom-right"></div>
      `;
      this.modalContent.appendChild(decorativeElements);
    }
  }

  createFilterButtons() {
    const projectsSection = document.querySelector('.projects-section');
    if (!projectsSection) return;

    const existingFilters = document.querySelector('.project-filter-container');
    if (existingFilters) existingFilters.remove();

    const filterContainer = document.createElement('div');
    filterContainer.className = 'project-filter-container';

    const filterHeader = document.createElement('div');
    filterHeader.className = 'filter-header';
    filterHeader.innerHTML = `
      <div class="laurel-small left"></div>
      <h3>Browse by Expertise</h3>
      <div class="laurel-small right"></div>
    `;
    filterContainer.appendChild(filterHeader);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'filter-buttons';

    this.categories.sort().forEach(category => {
      const button = document.createElement('button');
      button.className = 'filter-button';
      if (category === 'All') button.classList.add('active');

      button.dataset.category = category;

      const iconClass = category !== 'All' ? this.getCategoryIcon(category) : '';
      button.innerHTML = `
        ${iconClass ? `<span class="project-icon ${iconClass}"></span>` : ''}
        <span class="filter-text">${category}</span>
        <div class="button-decoration"></div>
      `;

      button.addEventListener('click', () => this.filterProjects(category));
      buttonContainer.appendChild(button);

      this.addDynamicLightingToElement(button);
    });

    filterContainer.appendChild(buttonContainer);

    const projectsGrid = document.querySelector('.projects-grid');
    if (projectsGrid) {
      projectsSection.insertBefore(filterContainer, projectsGrid);
    }
  }

  createViewModeToggle() {
    const projectsSection = document.querySelector('.projects-section');
    if (!projectsSection) return;

    const existingToggle = document.querySelector('.view-mode-toggle');
    if (existingToggle) existingToggle.remove();

    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'view-mode-toggle';
    
    toggleContainer.innerHTML = `
      <div class="toggle-header">
        <div class="toggle-icon left"><i class="fas fa-th"></i></div>
        <h4>View Mode</h4>
        <div class="toggle-icon right"><i class="fas fa-stream"></i></div>
      </div>
      <div class="toggle-switch">
        <button class="mode-button active" data-mode="grid">
          <i class="fas fa-th"></i> Grid
          <div class="toggle-decoration"></div>
        </button>
        <button class="mode-button" data-mode="timeline">
          <i class="fas fa-stream"></i> Timeline
          <div class="toggle-decoration"></div>
        </button>
      </div>
    `;

    const filterContainer = document.querySelector('.project-filter-container');
    if (filterContainer) {
      filterContainer.after(toggleContainer);
    } else {
      const projectsGrid = document.querySelector('.projects-grid');
      if (projectsGrid) {
        projectsSection.insertBefore(toggleContainer, projectsGrid);
      }
    }

    const gridButton = toggleContainer.querySelector('[data-mode="grid"]');
    const timelineButton = toggleContainer.querySelector('[data-mode="timeline"]');

    gridButton.addEventListener('click', () => this.changeViewMode('grid'));
    timelineButton.addEventListener('click', () => this.changeViewMode('timeline'));
  }

  changeViewMode(mode) {
    if (this.viewMode === mode || this.animationInProgress) return;
    this.animationInProgress = true;
    this.viewMode = mode;

    document.querySelectorAll('.mode-button').forEach(button => {
      button.classList.toggle('active', button.dataset.mode === mode);
    });

    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) {
      this.animationInProgress = false;
      return;
    }

    projectsGrid.classList.add('fade-out');

    setTimeout(() => {
      projectsGrid.classList.remove('grid-view', 'timeline-view');
      projectsGrid.classList.add(`${mode}-view`);
      
      const projectCards = projectsGrid.querySelectorAll('.project-card');
      projectCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.remove('grid-card', 'timeline-card');
        card.classList.add(`${mode}-card`);
        
        if (mode === 'timeline') {
          const projectId = card.querySelector('[data-project-id]')?.getAttribute('data-project-id');
          if (projectId && !card.querySelector('.year-marker') && this.projectData[projectId]) {
            const yearMarker = document.createElement('div');
            yearMarker.className = 'year-marker';
            yearMarker.innerHTML = `
              <span class="year">${this.projectData[projectId].year}</span>
              <span class="roman-year">${this.projectData[projectId].romanYear}</span>
              <div class="timeline-node"></div>
            `;
            card.prepend(yearMarker);
          }
        }
      });

      projectsGrid.classList.remove('fade-out');
      projectsGrid.classList.add('fade-in');

      setTimeout(() => {
        projectsGrid.classList.remove('fade-in');
        this.animationInProgress = false;
      }, 500);
    }, 300);
  }

  enhanceProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach((card, index) => {
      card.style.animationDelay = `${index * 0.1}s`;

      if (!card.querySelector('.card-decoration')) {
        const decoration = document.createElement('div');
        decoration.className = 'card-decoration';
        card.appendChild(decoration);
      }

      if (!card.querySelector('.card-mosaic')) {
        const mosaic = document.createElement('div');
        mosaic.className = 'card-mosaic';
        card.appendChild(mosaic);
      }

      const projectId = card.querySelector('[data-project-id]')?.getAttribute('data-project-id');
      if (projectId && this.projectData[projectId]) {
        const project = this.projectData[projectId];
        const categories = new Set();

        if (project.technologies) {
          project.technologies.forEach(tech => {
            categories.add(this.getCategoryFromTech(tech));
          });
        }

        card.dataset.categories = Array.from(categories).join(' ');
        card.dataset.year = project.year || '';

        if (!card.querySelector('.card-categories')) {
          const categoryContainer = document.createElement('div');
          categoryContainer.className = 'card-categories';

          Array.from(categories).slice(0, 3).forEach(category => {
            const tag = document.createElement('span');
            tag.className = 'category-tag';
            
            const iconClass = this.getCategoryIcon(category);
            tag.innerHTML = `
              <span class="project-icon ${iconClass}"></span>
              <span>${category}</span>
            `;
            categoryContainer.appendChild(tag);
          });

          card.querySelector('.project-card-content')?.appendChild(categoryContainer);
        }
      }

      this.addDynamicLightingToCard(card);
    });
  }

  setupDynamicLighting() {
    document.addEventListener('mousemove', (e) => {
      if (!this.modalOverlay || !this.modalOverlay.classList.contains('active')) return;
      
      const rect = this.modalContent.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      const lightX = ((mouseX / rect.width) * 100) - 50;
      const lightY = ((mouseY / rect.height) * 100) - 30;
      
      this.lightSource = { x: lightX, y: lightY };
      
      requestAnimationFrame(() => {
        this.modalContent.style.setProperty('--modal-light-x', `${lightX}%`);
        this.modalContent.style.setProperty('--modal-light-y', `${lightY}%`);
      });
    });
  }
  
  addDynamicLightingToCard(card) {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const mouseX = (x / rect.width) * 100;
      const mouseY = (y / rect.height) * 100;
      
      card.style.setProperty('--mouse-x', `${mouseX}%`);
      card.style.setProperty('--mouse-y', `${mouseY}%`);
    });
  }

  createCodeViewer(code, language, title) {
    const codeViewerContainer = document.createElement('div');
    codeViewerContainer.className = 'code-viewer-container';
    
    const codeViewerHeader = document.createElement('div');
    codeViewerHeader.className = 'code-viewer-header';
    
    const codeViewerTitle = document.createElement('div');
    codeViewerTitle.className = 'code-viewer-title';
    codeViewerTitle.innerHTML = `
      <i class="fas fa-code"></i>
      <span>${title || 'Code Sample'}</span>
    `;
    
    const codeViewerActions = document.createElement('div');
    codeViewerActions.className = 'code-viewer-actions';
    
    const copyButton = document.createElement('button');
    copyButton.className = 'code-viewer-button copy-btn';
    copyButton.innerHTML = `<i class="fas fa-copy"></i> Copy`;
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');
    copyButton.addEventListener('click', () => {
      navigator.clipboard.writeText(code).then(() => {
        copyButton.classList.add('copied');
        copyButton.innerHTML = `<i class="fas fa-check"></i> Copied`;
        setTimeout(() => {
          copyButton.classList.remove('copied');
          copyButton.innerHTML = `<i class="fas fa-copy"></i> Copy`;
        }, 2000);
      }).catch(err => {
        console.error('Failed to copy code: ', err);
        copyButton.innerHTML = `<i class="fas fa-times"></i> Error`;
        setTimeout(() => {
          copyButton.innerHTML = `<i class="fas fa-copy"></i> Copy`;
        }, 2000);
      });
    });
    
    const lineNumbersButton = document.createElement('button');
    lineNumbersButton.className = 'code-viewer-button line-numbers-btn';
    lineNumbersButton.innerHTML = this.codeViewerShowLineNumbers ?
      `<i class="fas fa-list-ol"></i> Hide Lines` :
      `<i class="fas fa-list-ol"></i> Show Lines`;
    lineNumbersButton.setAttribute('aria-label', 'Toggle line numbers');
    lineNumbersButton.addEventListener('click', () => {
      this.codeViewerShowLineNumbers = !this.codeViewerShowLineNumbers;
      
      const codeElement = codeViewerContent.querySelector('pre');
      if (this.codeViewerShowLineNumbers) {
        codeElement.classList.add('line-numbers');
        lineNumbersButton.innerHTML = `<i class="fas fa-list-ol"></i> Hide Lines`;
      } else {
        codeElement.classList.remove('line-numbers');
        lineNumbersButton.innerHTML = `<i class="fas fa-list-ol"></i> Show Lines`;
      }
    });
    
    codeViewerActions.appendChild(lineNumbersButton);
    codeViewerActions.appendChild(copyButton);
    codeViewerHeader.appendChild(codeViewerTitle);
    codeViewerHeader.appendChild(codeViewerActions);
    
    const codeViewerContent = document.createElement('div');
    codeViewerContent.className = 'code-viewer-content';
    
    const pre = document.createElement('pre');
    pre.className = `language-${language || 'javascript'} ${this.codeViewerShowLineNumbers ? 'line-numbers' : ''}`;
    
    const codeElement = document.createElement('code');
    codeElement.className = `language-${language || 'javascript'}`;
    codeElement.textContent = code;
    
    pre.appendChild(codeElement);
    codeViewerContent.appendChild(pre);
    
    codeViewerContainer.appendChild(codeViewerHeader);
    codeViewerContainer.appendChild(codeViewerContent);
    
    this.addDynamicLightingToElement(codeViewerContainer);
    
    if (window.Prism) {
      window.Prism.highlightElement(codeElement);
    }
    
    return codeViewerContainer;
  }

  addDynamicLightingToElement(element) {
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const mouseX = (x / rect.width) * 100;
      const mouseY = (y / rect.height) * 100;
      
      element.style.setProperty('--mouse-x', `${mouseX}%`);
      element.style.setProperty('--mouse-y', `${mouseY}%`);
    });
  }

  openProject(projectId) {
    const project = this.projectData[projectId];
    if (!project) return;

    this.currentProject = projectId;

    if (this.modalContent) {
      this.modalContent.classList.add('content-transition');
    }

    this.modalContent.innerHTML = `
      <button class="project-modal-close" aria-label="Close project details">
        <span class="close-icon">&times;</span>
        <span class="close-decoration"></span>
      </button>
      
      <div class="project-modal-header">
        <div class="roman-numeral">${project.romanYear || 'MMXXIII'}</div>
        <h2>${project.title}</h2>
        <div class="header-decoration">
          <div class="line-left"></div>
          <div class="roman-symbol"></div>
          <div class="line-right"></div>
        </div>
        <div class="project-modal-tech-tags">
          ${project.technologies.map(tech => {
              const category = this.getCategoryFromTech(tech);
              const iconClass = this.getCategoryIcon(category);
              return `<span class="tech-tag">
                <span class="project-icon ${iconClass}"></span>
                ${tech}
              </span>`;
          }).join('')}
        </div>
      </div>
      
      <div class="project-modal-body">
        <div class="column-decoration left"></div>
        <div class="column-decoration right"></div>
        
        <p class="project-description">${project.description}</p>
        
        <div class="section-header">
          <div class="section-decoration"></div>
          <h3>Key Features</h3>
          <div class="section-decoration"></div>
        </div>
        
        <ul class="project-details-list">
          ${project.details.map(detail => `
            <li>
              <span class="bullet"></span>
              <div class="detail-content">${detail}</div>
            </li>
          `).join('')}
        </ul>
        
        <div id="code-sample-container"></div>
        
        ${project.links.length > 0 ? `
          <div class="project-links">
            ${project.links.map(link => `
              <a href="${link.url}" 
                 class="project-link-button"
                 ${link.download ? 'download' : ''}
                 ${link.external ? 'target="_blank" rel="noopener noreferrer"' : ''}>
                <span class="link-decoration left"></span>
                <i class="fas ${link.download ? 'fa-download' : link.external ? 'fa-external-link-alt' : 'fa-link'} link-icon"></i>
                ${link.text}
                <span class="link-decoration right"></span>
              </a>
            `).join('')}
          </div>
        ` : ''}
      </div>
      
      <div class="project-modal-navigation">
        <button class="nav-button prev-project" aria-label="Previous project">
          <div class="nav-arrow left"></div>
          <i class="fas fa-chevron-left"></i> Previous
        </button>
        <div class="navigation-decoration">
          <div class="nav-symbol"></div>
        </div>
        <button class="nav-button next-project" aria-label="Next project">
          Next <i class="fas fa-chevron-right"></i>
          <div class="nav-arrow right"></div>
        </button>
      </div>
      
      <div class="roman-decorative-elements">
        <div class="laurel-left"></div>
        <div class="laurel-right"></div>
        <div class="roman-border-top"></div>
        <div class="roman-border-bottom"></div>
        <div class="column-pillar left"></div>
        <div class="column-pillar right"></div>
        <div class="mosaic-corner top-left"></div>
        <div class="mosaic-corner top-right"></div>
        <div class="mosaic-corner bottom-left"></div>
        <div class="mosaic-corner bottom-right"></div>
      </div>
    `;

    if (project.codeSample) {
      const container = this.modalContent.querySelector('#code-sample-container');
      if (container) {
        const codeSection = document.createElement('div');
        codeSection.className = 'code-section';
        
        const sectionHeader = document.createElement('div');
        sectionHeader.className = 'section-header';
        sectionHeader.innerHTML = `
          <div class="section-decoration"></div>
          <h3>Code Sample</h3>
          <div class="section-decoration"></div>
        `;
        
        codeSection.appendChild(sectionHeader);
        
        const codeViewer = this.createCodeViewer(
          project.codeSample.code, 
          project.codeSample.language, 
          project.codeSample.title
        );
        
        codeSection.appendChild(codeViewer);
        container.appendChild(codeSection);
      }
    }

    const closeButton = this.modalContent.querySelector('.project-modal-close');
    closeButton.addEventListener('click', () => this.closeModal());

    this.bindNavigationButtons();

    this.modalOverlay.classList.add('active');
    document.body.classList.add('modal-open');

    setTimeout(() => {
      this.modalOverlay.classList.add('visible');
      this.modalContent.classList.add('visible');
    }, 50);

    this.modalContent.setAttribute('aria-label', `Project details: ${project.title}`);
    this.modalContent.setAttribute('tabindex', '-1');
    this.modalContent.focus();

    setTimeout(() => {
      const sections = this.modalContent.querySelectorAll('.project-modal-header, .project-description, .section-header, .project-details-list, .project-links, .code-section');
      sections.forEach((section, index) => {
        section.style.animationDelay = `${0.1 + (index * 0.1)}s`;
        section.classList.add('animate-in');
      });

      const detailItems = this.modalContent.querySelectorAll('.project-details-list li');
      detailItems.forEach((item, i) => {
        item.style.animationDelay = `${0.5 + (i * 0.1)}s`;
        item.classList.add('detail-reveal');
      });
      
      this.applyDynamicLightingToModalElements();
    }, 200);
  }

  applyDynamicLightingToModalElements() {
    setTimeout(() => {
      const buttons = this.modalContent.querySelectorAll('.nav-button, .project-link-button, .code-viewer-button');
      buttons.forEach(button => {
        this.addDynamicLightingToElement(button);
      });
      
      const codeViewer = this.modalContent.querySelector('.code-viewer-container');
      if (codeViewer) {
        this.addDynamicLightingToElement(codeViewer);
      }
    }, 300);
  }

  closeModal() {
    this.modalOverlay.classList.remove('visible');
    this.modalContent.classList.remove('visible');

    setTimeout(() => {
      this.modalOverlay.classList.remove('active');
      document.body.classList.remove('modal-open');

      const projectId = this.currentProject;
      if (projectId) {
        const button = document.querySelector(`.view-project-btn[data-project-id="${projectId}"]`);
        if (button) button.focus();
      }

      this.currentProject = null;
    }, 500);
  }

  bindNavigationButtons() {
    const prevButton = this.modalContent.querySelector('.prev-project');
    const nextButton = this.modalContent.querySelector('.next-project');

    const projectIds = Object.keys(this.projectData);
    const currentIndex = projectIds.indexOf(this.currentProject);

    prevButton.addEventListener('click', () => {
      const prevIndex = currentIndex > 0 ? currentIndex - 1 : projectIds.length - 1;
      this.openProject(projectIds[prevIndex]);
    });

    nextButton.addEventListener('click', () => {
      const nextIndex = currentIndex < projectIds.length - 1 ? currentIndex + 1 : 0;
      this.openProject(projectIds[nextIndex]);
    });

    prevButton.addEventListener('mouseenter', () => {
      prevButton.classList.add('hover');
      const arrow = prevButton.querySelector('.nav-arrow');
      if (arrow) arrow.classList.add('hover');
    });

    prevButton.addEventListener('mouseleave', () => {
      prevButton.classList.remove('hover');
      const arrow = prevButton.querySelector('.nav-arrow');
      if (arrow) arrow.classList.remove('hover');
    });

    nextButton.addEventListener('mouseenter', () => {
      nextButton.classList.add('hover');
      const arrow = nextButton.querySelector('.nav-arrow');
      if (arrow) arrow.classList.add('hover');
    });

    nextButton.addEventListener('mouseleave', () => {
      nextButton.classList.remove('hover');
      const arrow = nextButton.querySelector('.nav-arrow');
      if (arrow) arrow.classList.remove('hover');
    });
  }

  filterProjects(category) {
    if (this.animationInProgress) return;
    this.animationInProgress = true;
    this.activeCategory = category;

    document.querySelectorAll('.filter-button').forEach(button => {
      button.classList.toggle('active', button.dataset.category === category);
    });

    const projectCards = document.querySelectorAll('.project-card');
    let visibleCount = 0;

    projectCards.forEach((card, index) => {
      const categories = card.dataset.categories ? card.dataset.categories.split(' ') : [];
      const shouldShow = category === 'All' || categories.includes(category);

      card.classList.remove('slide-in', 'fade-out');

      if (shouldShow) {
        setTimeout(() => {
          card.style.display = '';
          card.classList.add('slide-in');
          visibleCount++;
        }, index * 50);
      } else {
        card.classList.add('fade-out');
        setTimeout(() => {
          card.style.display = 'none';
        }, 300);
      }
    });

    setTimeout(() => {
      this.animationInProgress = false;
    }, 500);
  }

  revealOnScroll() {
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    revealElements.forEach(el => observer.observe(el));
  }
}