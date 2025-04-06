/**
 * Theme Switcher - Provides UI for manual theme selection
 * 
 * This component creates a floating button that opens a theme selector panel.
 * Users can choose from different mood-based themes or let the system automatically
 * switch based on time of day.
 */

class ThemeSwitcher {
    constructor() {
        this.isOpen = false;
        this.createSwitcherUI();
        this.bindEvents();
    }

    createSwitcherUI() {
        // Create theme switcher toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.innerHTML = `
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
            </svg>
        `;
        toggleButton.setAttribute('aria-label', 'Toggle theme settings');
        toggleButton.id = 'theme-toggle';
        document.body.appendChild(toggleButton);

        // Create theme panel
        const themePanel = document.createElement('div');
        themePanel.className = 'theme-panel';
        themePanel.innerHTML = `
            <div class="theme-panel-header">
                <h3>Choose Your Theme</h3>
                <button class="theme-panel-close">×</button>
            </div>
            <div class="theme-options">
                <div class="theme-option" data-theme="auto">
                    <div class="theme-preview auto">
                        <div class="day"></div>
                        <div class="night"></div>
                    </div>
                    <span>Automatic<br><small>(Time-based)</small></span>
                </div>
                <div class="theme-option" data-theme="morning">
                    <div class="theme-preview morning"></div>
                    <span>Morning<br><small>Energetic & Bright</small></span>
                </div>
                <div class="theme-option" data-theme="afternoon">
                    <div class="theme-preview afternoon"></div>
                    <span>Afternoon<br><small>Focused & Calm</small></span>
                </div>
                <div class="theme-option" data-theme="evening">
                    <div class="theme-preview evening"></div>
                    <span>Evening<br><small>Warm & Relaxing</small></span>
                </div>
                <div class="theme-option" data-theme="night">
                    <div class="theme-preview night"></div>
                    <span>Night<br><small>Dark & Soothing</small></span>
                </div>
            </div>
        `;
        document.body.appendChild(themePanel);

        // Append CSS for the theme switcher
        const style = document.createElement('style');
        style.textContent = `
            .theme-toggle {
                position: fixed;
                bottom: 1.5rem;
                left: 1.5rem;
                width: 3rem;
                height: 3rem;
                border-radius: 50%;
                background: white;
                border: none;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                z-index: 1000;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #333;
                transition: all 0.3s ease;
            }
            
            .theme-toggle:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
            }
            
            .theme-toggle svg {
                width: 1.5rem;
                height: 1.5rem;
            }
            
            .theme-panel {
                position: fixed;
                bottom: 5rem;
                left: 1.5rem;
                width: 300px;
                background: white;
                border-radius: 1rem;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
                z-index: 1000;
                opacity: 0;
                transform: translateY(20px);
                pointer-events: none;
                transition: all 0.3s ease;
                overflow: hidden;
            }
            
            .theme-panel.open {
                opacity: 1;
                transform: translateY(0);
                pointer-events: auto;
            }
            
            .theme-panel-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem;
                border-bottom: 1px solid #eee;
            }
            
            .theme-panel-header h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
            }
            
            .theme-panel-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #666;
                padding: 0;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
            }
            
            .theme-panel-close:hover {
                background: #f5f5f5;
            }
            
            .theme-options {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 1rem;
                padding: 1rem;
            }
            
            .theme-option {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 0.5rem;
                cursor: pointer;
                padding: 0.5rem;
                border-radius: 0.5rem;
                transition: all 0.2s ease;
                text-align: center;
            }
            
            .theme-option:hover {
                background: #f5f5f5;
            }
            
            .theme-option.active {
                background: #f0f0f0;
                box-shadow: inset 0 0 0 2px #8a2be2;
            }
            
            .theme-preview {
                width: 100%;
                height: 80px;
                border-radius: 0.5rem;
                overflow: hidden;
            }
            
            .theme-preview.auto {
                display: flex;
                flex-direction: column;
            }
            
            .theme-preview.auto .day {
                height: 40px;
                background: linear-gradient(135deg, #e0f7fa, #fff8e1);
            }
            
            .theme-preview.auto .night {
                height: 40px;
                background: linear-gradient(135deg, #1a237e, #311b92);
            }
            
            .theme-preview.morning {
                background: linear-gradient(135deg, #e0f7fa, #fff8e1);
            }
            
            .theme-preview.afternoon {
                background: linear-gradient(135deg, #e3f2fd, #f3e5f5);
            }
            
            .theme-preview.evening {
                background: linear-gradient(135deg, #ffebee, #ede7f6);
            }
            
            .theme-preview.night {
                background: linear-gradient(135deg, #1a237e, #311b92);
            }
            
            .theme-option span {
                font-size: 0.875rem;
                font-weight: 600;
                color: #333;
            }
            
            .theme-option small {
                font-size: 0.75rem;
                color: #666;
                font-weight: normal;
            }
            
            /* Dark mode overrides */
            .dark-theme .theme-toggle {
                background: #1e293b;
                color: #f1f5f9;
            }
            
            .dark-theme .theme-panel {
                background: #1e293b;
                color: #f1f5f9;
            }
            
            .dark-theme .theme-panel-header {
                border-color: #2d3748;
            }
            
            .dark-theme .theme-panel-close {
                color: #cbd5e1;
            }
            
            .dark-theme .theme-panel-close:hover {
                background: #2d3748;
            }
            
            .dark-theme .theme-option:hover {
                background: #2d3748;
            }
            
            .dark-theme .theme-option.active {
                background: #2d3748;
                box-shadow: inset 0 0 0 2px #8a2be2;
            }
            
            .dark-theme .theme-option span {
                color: #f1f5f9;
            }
            
            .dark-theme .theme-option small {
                color: #cbd5e1;
            }
            
            /* Mobile adjustments */
            @media (max-width: 768px) {
                .theme-panel {
                    width: 250px;
                }
            }
        `;
        document.head.appendChild(style);
    }

    bindEvents() {
        const toggle = document.getElementById('theme-toggle');
        const panel = document.querySelector('.theme-panel');
        const closeButton = document.querySelector('.theme-panel-close');
        const themeOptions = document.querySelectorAll('.theme-option');

        // Toggle panel
        toggle.addEventListener('click', () => {
            this.isOpen = !this.isOpen;
            if (this.isOpen) {
                panel.classList.add('open');
                this.updateActiveTheme();
            } else {
                panel.classList.remove('open');
            }
        });

        // Close panel
        closeButton.addEventListener('click', () => {
            panel.classList.remove('open');
            this.isOpen = false;
        });

        // Theme selection
        themeOptions.forEach(option => {
            option.addEventListener('click', () => {
                const theme = option.getAttribute('data-theme');
                
                if (theme === 'auto') {
                    // Reset to automatic time-based theme
                    localStorage.removeItem('manual-theme');
                    if (window.themeEngine) {
                        window.themeEngine.updateTheme();
                    }
                } else {
                    // Set manual theme
                    localStorage.setItem('manual-theme', theme);
                    if (window.themeEngine) {
                        window.themeEngine.setTheme(theme);
                    }
                }
                
                this.updateActiveTheme();
            });
        });

        // Click outside to close
        document.addEventListener('click', (e) => {
            if (this.isOpen && !panel.contains(e.target) && e.target !== toggle) {
                panel.classList.remove('open');
                this.isOpen = false;
            }
        });
    }

    updateActiveTheme() {
        const options = document.querySelectorAll('.theme-option');
        const manualTheme = localStorage.getItem('manual-theme');
        
        options.forEach(option => {
            option.classList.remove('active');
            
            if (!manualTheme && option.getAttribute('data-theme') === 'auto') {
                option.classList.add('active');
            } else if (option.getAttribute('data-theme') === manualTheme) {
                option.classList.add('active');
            }
        });
    }
}

// Initialize the theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});