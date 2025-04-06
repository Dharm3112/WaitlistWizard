/**
 * Theme Engine - Professional networking platform with a subtle blue theme
 * 
 * This module provides a consistent, clean design with subtle blue accents
 * that creates a professional yet approachable user experience.
 */

class ThemeEngine {
    constructor() {
        // Define a single subtle blue theme with light and dark variants
        this.themes = {
            // Light blue theme
            light: {
                primary: '#4285F4', // Google blue
                secondary: '#5C9CE6', // Lighter blue
                accent: '#34A8FF', // Sky blue
                accent2: '#81B4FE', // Pale blue
                accent3: '#2D7FF9', // Deeper blue
                background: 'linear-gradient(135deg, #f9fbff, #f0f4f9)',
                foreground: '#333333',
                metaColor: '#f0f4f9',
                isDark: false,
                name: 'Blue Light'
            },
            // Dark blue theme
            dark: {
                primary: '#4285F4', // Same Google blue for consistency
                secondary: '#5C9CE6', // Lighter blue
                accent: '#34A8FF', // Sky blue
                accent2: '#81B4FE', // Pale blue
                accent3: '#2D7FF9', // Deeper blue
                background: 'linear-gradient(135deg, #0f1525, #1c2536)',
                foreground: '#f5f5f5',
                metaColor: '#0f1525',
                isDark: true,
                name: 'Blue Dark'
            }
        };

        // Initialize theme
        this.currentTheme = null;
        this.init();
    }

    init() {
        // Check if there's a manually selected theme
        const manualTheme = localStorage.getItem('manual-theme');
        
        if (manualTheme && this.themes[manualTheme]) {
            // Use the manually selected theme
            this.currentTheme = manualTheme;
            localStorage.setItem('manual-theme', manualTheme); // Make sure it's saved
        } else {
            // Set initial theme based on time of day
            this.updateTheme();
            
            // Update theme periodically if not manually set
            setInterval(() => {
                if (!localStorage.getItem('manual-theme')) {
                    this.updateTheme();
                }
            }, 60000); // Check every minute
        }
        
        // Apply theme immediately
        this.applyTheme();

        // Listen for storage events (for multi-tab synchronization)
        window.addEventListener('storage', (event) => {
            if (event.key === 'manual-theme' || event.key === 'current-theme') {
                const newTheme = localStorage.getItem('manual-theme') || localStorage.getItem('current-theme');
                if (newTheme && this.themes[newTheme] && newTheme !== this.currentTheme) {
                    this.currentTheme = newTheme;
                    this.applyTheme();
                }
            }
        });
    }

    updateTheme() {
        // Use light theme by default, with dark theme option for night hours
        const hour = new Date().getHours();
        let newTheme = (hour >= 20 || hour < 6) ? 'dark' : 'light';

        // Only update if the theme changed
        if (this.currentTheme !== newTheme) {
            this.currentTheme = newTheme;
            this.applyTheme();
            this.showThemeNotification();
        }
    }

    applyTheme() {
        // Default to light theme if current theme is not found
        let theme = this.themes[this.currentTheme];
        if (!theme) {
            console.log('Theme not found:', this.currentTheme);
            this.currentTheme = 'light';
            theme = this.themes.light;
        }
        
        const root = document.documentElement;
        
        // Update CSS variables
        root.style.setProperty('--theme-background', theme.background);
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent2', theme.accent2 || '#3cd4c2');
        root.style.setProperty('--accent3', theme.accent3 || '#5cbf2a');
        root.style.setProperty('--foreground', theme.foreground);
        
        // Apply background
        document.body.style.background = theme.background;
        
        // Adjust text colors and theme class for readability
        if (theme.isDark) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
            
            // Set dark mode specific variables
            root.style.setProperty('--card-background', 'rgba(30, 41, 59, 0.95)');
            root.style.setProperty('--nav-background', 'rgba(17, 24, 39, 0.97)');
            root.style.setProperty('--footer-background', 'rgba(17, 24, 39, 0.98)');
            root.style.setProperty('--input-background', 'rgba(17, 24, 39, 0.7)');
            root.style.setProperty('--input-border', 'rgba(255, 255, 255, 0.1)');
            root.style.setProperty('--placeholder', 'rgba(255, 255, 255, 0.5)');
            root.style.setProperty('--message-received', 'hsl(215, 15%, 20%)');
            root.style.setProperty('--chat-background', 'rgba(17, 24, 39, 0.8)');
            root.style.setProperty('--shadow', '0 8px 20px rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--card-shadow', '0 10px 30px rgba(0, 0, 0, 0.3)');
            root.style.setProperty('--button-shadow', '0 4px 15px rgba(0, 0, 0, 0.25)');
        } else {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            
            // Set light mode specific variables
            root.style.setProperty('--card-background', 'rgba(255, 255, 255, 0.9)');
            root.style.setProperty('--nav-background', 'rgba(255, 255, 255, 0.95)');
            root.style.setProperty('--footer-background', 'rgba(255, 255, 255, 0.97)');
            root.style.setProperty('--input-background', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--input-border', 'rgba(0, 0, 0, 0.1)');
            root.style.setProperty('--placeholder', 'rgba(0, 0, 0, 0.4)');
            root.style.setProperty('--message-received', 'var(--muted)');
            root.style.setProperty('--chat-background', 'rgba(255, 255, 255, 0.8)');
            root.style.setProperty('--shadow', '0 8px 20px rgba(0, 0, 0, 0.1)');
            root.style.setProperty('--card-shadow', '0 10px 30px rgba(0, 0, 0, 0.08)');
            root.style.setProperty('--button-shadow', '0 4px 15px rgba(0, 0, 0, 0.1)');
        }
        
        // Update meta theme-color for mobile devices
        this.addMetaThemeColor(theme.metaColor || theme.primary);
        
        // Store current theme in local storage
        localStorage.setItem('current-theme', this.currentTheme);
    }

    showThemeNotification() {
        // Safely get theme info with fallback
        const theme = this.themes[this.currentTheme] || this.themes.light;
        let toast = document.getElementById('theme-toast');
        
        // Create toast if it doesn't exist
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'theme-toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
            
            // Add toast styling
            const style = document.createElement('style');
            style.textContent = `
                .toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background-color: var(--primary);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    z-index: 1000;
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }
                .toast.show {
                    opacity: 1;
                    transform: translateY(0);
                }
                .dark-theme .toast {
                    background-color: rgba(138, 43, 226, 0.8);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
            `;
            document.head.appendChild(style);
        }
        
        toast.textContent = `Theme changed to: ${theme.name}`;
        toast.className = 'toast show';
        
        // Hide toast after 3 seconds
        setTimeout(() => {
            toast.className = toast.className.replace('show', '');
        }, 3000);
    }

    // Manual theme override (can be used for mood-based selection)
    setTheme(themeName) {
        if (this.themes[themeName]) {
            this.currentTheme = themeName;
            this.applyTheme();
            this.showThemeNotification();
            return true;
        }
        return false;
    }

    // Add or update the meta theme-color for mobile browsers
    addMetaThemeColor(color) {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = 'theme-color';
            document.head.appendChild(meta);
        }
        meta.content = color;
    }

    // Get current theme info
    getCurrentTheme() {
        // Return light theme if current theme is not found
        if (!this.themes[this.currentTheme]) {
            return {
                name: 'light',
                ...this.themes.light
            };
        }
        
        return {
            name: this.currentTheme,
            ...this.themes[this.currentTheme]
        };
    }
}

// Initialize theme engine when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeEngine = new ThemeEngine();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ThemeEngine;
}