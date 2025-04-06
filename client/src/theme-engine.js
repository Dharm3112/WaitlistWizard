/**
 * Theme Engine - Dynamically changes website theme based on time of day or mood
 * 
 * This module adjusts the color scheme and background based on:
 * - Morning (6am-11am): Bright, energetic colors with light backgrounds
 * - Afternoon (12pm-5pm): Balanced, productive colors 
 * - Evening (6pm-9pm): Warm, relaxing colors with gradual dimming
 * - Night (10pm-5am): Dark mode with soothing colors, reduced blue light
 * - Custom mood themes (Creative, Focused, Relaxed, Energetic)
 */

class ThemeEngine {
    constructor() {
        // Define theme color palettes for different times of day and moods
        this.themes = {
            // Time-based themes
            morning: {
                primary: '#ff7eb9', // Vibrant pink
                secondary: '#7afcff', // Bright cyan
                accent: '#feff9c', // Soft yellow
                accent2: '#67e8b1', // Mint
                accent3: '#ffe66d', // Light yellow
                background: 'linear-gradient(135deg, #e0f7fa, #fff8e1)',
                foreground: '#333333',
                metaColor: '#e0f7fa',
                isDark: false,
                name: 'Morning Sunrise'
            },
            afternoon: {
                primary: '#7c4dff', // Deep purple
                secondary: '#1de9b6', // Teal
                accent: '#ffab40', // Orange
                accent2: '#64b5f6', // Light blue
                accent3: '#aed581', // Light green
                background: 'linear-gradient(135deg, #e3f2fd, #f3e5f5)',
                foreground: '#333333',
                metaColor: '#e3f2fd',
                isDark: false,
                name: 'Afternoon Clarity'
            },
            evening: {
                primary: '#ff5722', // Deep orange
                secondary: '#ff9e80', // Light orange
                accent: '#b39ddb', // Light purple
                accent2: '#90caf9', // Blue
                accent3: '#ffe082', // Light amber
                background: 'linear-gradient(135deg, #ffebee, #ede7f6)',
                foreground: '#424242',
                metaColor: '#ffebee',
                isDark: false,
                name: 'Evening Glow'
            },
            night: {
                primary: '#8a2be2', // Purple
                secondary: '#483d8b', // Dark slate blue
                accent: '#20b2aa', // Light sea green
                accent2: '#7b68ee', // Medium slate blue
                accent3: '#6a5acd', // Slate blue
                background: 'linear-gradient(135deg, #1a237e, #311b92)',
                foreground: '#f5f5f5',
                metaColor: '#1a237e',
                isDark: true,
                name: 'Night Calm'
            },
            
            // Mood-based themes
            creative: {
                primary: '#FF4D8D', // Hot pink
                secondary: '#00C9FF', // Bright blue
                accent: '#FFC800', // Sunny yellow
                accent2: '#00E5A1', // Green
                accent3: '#7B61FF', // Purple
                background: 'linear-gradient(135deg, #FFEFFF, #D7FFFE)',
                foreground: '#333333',
                metaColor: '#FFEFFF',
                isDark: false,
                name: 'Creative Mood'
            },
            focused: {
                primary: '#3F51B5', // Indigo
                secondary: '#448AFF', // Blue
                accent: '#8BC34A', // Light green
                accent2: '#4DB6AC', // Teal
                accent3: '#26C6DA', // Cyan
                background: 'linear-gradient(135deg, #E8EAF6, #E1F5FE)',
                foreground: '#333333',
                metaColor: '#E8EAF6',
                isDark: false,
                name: 'Focused Mind'
            },
            relaxed: {
                primary: '#009688', // Teal
                secondary: '#4CAF50', // Green
                accent: '#8D6E63', // Brown
                accent2: '#78909C', // Blue grey
                accent3: '#26A69A', // Teal
                background: 'linear-gradient(135deg, #E0F2F1, #F1F8E9)',
                foreground: '#333333',
                metaColor: '#E0F2F1',
                isDark: false,
                name: 'Relaxed Vibe'
            },
            energetic: {
                primary: '#F44336', // Red
                secondary: '#FF9800', // Orange
                accent: '#FFEB3B', // Yellow
                accent2: '#FF5722', // Deep orange
                accent3: '#FFC107', // Amber
                background: 'linear-gradient(135deg, #FBE9E7, #FFFDE7)',
                foreground: '#333333',
                metaColor: '#FBE9E7',
                isDark: false,
                name: 'Energetic Boost'
            },
            darkMode: {
                primary: '#9C27B0', // Purple
                secondary: '#E91E63', // Pink
                accent: '#FF4081', // Pink accent
                accent2: '#7C4DFF', // Deep purple
                accent3: '#00BFA5', // Teal
                background: 'linear-gradient(135deg, #121212, #1F1B24)',
                foreground: '#EEEEEE',
                metaColor: '#121212',
                isDark: true,
                name: 'Dark Mode'
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
        if (!theme) return; // Guard against invalid theme names
        
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
        const theme = this.themes[this.currentTheme];
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