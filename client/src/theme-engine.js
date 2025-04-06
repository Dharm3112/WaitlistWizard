/**
 * Theme Engine - Dynamically changes website theme based on time of day
 * 
 * This module adjusts the color scheme and background based on the current time:
 * - Morning (6am-11am): Bright, energetic colors with light backgrounds
 * - Afternoon (12pm-5pm): Balanced, productive colors 
 * - Evening (6pm-9pm): Warm, relaxing colors with gradual dimming
 * - Night (10pm-5am): Dark mode with soothing colors, reduced blue light
 */

class ThemeEngine {
    constructor() {
        // Define theme color palettes for different times of day
        this.themes = {
            morning: {
                primary: '#ff7eb9', // Vibrant pink
                secondary: '#7afcff', // Bright cyan
                accent: '#feff9c', // Soft yellow
                background: 'linear-gradient(135deg, #e0f7fa, #fff8e1)',
                foreground: '#333333',
                isDark: false,
                name: 'Morning Sunrise'
            },
            afternoon: {
                primary: '#7c4dff', // Deep purple
                secondary: '#1de9b6', // Teal
                accent: '#ffab40', // Orange
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                foreground: '#333333',
                isDark: false,
                name: 'Afternoon Clarity'
            },
            evening: {
                primary: '#ff5722', // Deep orange
                secondary: '#ff9e80', // Light orange
                accent: '#b39ddb', // Light purple
                background: 'linear-gradient(135deg, #ffebee, #ede7f6)',
                foreground: '#424242',
                isDark: false,
                name: 'Evening Glow'
            },
            night: {
                primary: '#8a2be2', // Purple
                secondary: '#483d8b', // Dark slate blue
                accent: '#20b2aa', // Light sea green
                background: 'linear-gradient(135deg, #1a237e, #311b92)',
                foreground: '#f5f5f5',
                isDark: true,
                name: 'Night Calm'
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
            this.applyTheme();
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
    }

    updateTheme() {
        const hour = new Date().getHours();
        let newTheme;

        // Determine theme based on time of day
        if (hour >= 6 && hour < 12) {
            newTheme = 'morning';
        } else if (hour >= 12 && hour < 18) {
            newTheme = 'afternoon';
        } else if (hour >= 18 && hour < 22) {
            newTheme = 'evening';
        } else {
            newTheme = 'night';
        }

        // Only update if the theme changed
        if (this.currentTheme !== newTheme) {
            this.currentTheme = newTheme;
            this.applyTheme();
            this.showThemeNotification();
        }
    }

    applyTheme() {
        const theme = this.themes[this.currentTheme];
        const root = document.documentElement;
        
        // Update CSS variables
        root.style.setProperty('--theme-background', theme.background);
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--foreground', theme.foreground);
        
        // Apply background
        document.body.style.background = theme.background;
        
        // Adjust text colors for readability
        if (theme.isDark) {
            document.body.classList.add('dark-theme');
            document.body.classList.remove('light-theme');
        } else {
            document.body.classList.add('light-theme');
            document.body.classList.remove('dark-theme');
        }
        
        // Update meta theme-color for mobile devices
        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', theme.primary);
        } else {
            const meta = document.createElement('meta');
            meta.name = 'theme-color';
            meta.content = theme.primary;
            document.head.appendChild(meta);
        }
    }

    showThemeNotification() {
        const theme = this.themes[this.currentTheme];
        const toast = document.getElementById('toast');
        
        if (toast) {
            toast.textContent = `Theme changed to: ${theme.name}`;
            toast.className = 'toast show';
            
            // Hide toast after 3 seconds
            setTimeout(() => {
                toast.className = toast.className.replace('show', '');
            }, 3000);
        }
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

    // Get current theme info
    getCurrentTheme() {
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