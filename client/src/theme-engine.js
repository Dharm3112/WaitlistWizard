/**
 * Simple Theme Engine - Single blue theme
 */

class ThemeEngine {
    constructor() {
        this.themes = {
            light: {
                primary: '#4285F4',
                secondary: '#5C9CE6', 
                accent: '#34A8FF',
                accent2: '#81B4FE',
                accent3: '#2D7FF9',
                background: '#ffffff',
                foreground: '#333333',
                metaColor: '#f0f4f9',
                isDark: false,
                name: 'Blue Light'
            }
        };
        
        // Apply theme immediately
        this.applyTheme();
    }

    applyTheme() {
        const theme = this.themes.light;
        const root = document.documentElement;
        
        // Update CSS variables
        root.style.setProperty('--primary', theme.primary);
        root.style.setProperty('--secondary', theme.secondary);
        root.style.setProperty('--accent', theme.accent);
        root.style.setProperty('--accent2', theme.accent2);
        root.style.setProperty('--accent3', theme.accent3);
        root.style.setProperty('--foreground', theme.foreground);
        
        // Set light mode specific variables
        root.style.setProperty('--card-background', 'rgba(255, 255, 255, 0.9)');
        root.style.setProperty('--nav-background', 'rgba(255, 255, 255, 0.95)');
        root.style.setProperty('--footer-background', 'rgba(255, 255, 255, 0.97)');
        root.style.setProperty('--input-background', 'rgba(255, 255, 255, 0.8)');
        root.style.setProperty('--input-border', 'rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--placeholder', 'rgba(0, 0, 0, 0.4)');
        root.style.setProperty('--message-received', '#f0f4f8');
        root.style.setProperty('--chat-background', 'rgba(255, 255, 255, 0.8)');
        root.style.setProperty('--shadow', '0 8px 20px rgba(0, 0, 0, 0.1)');
        root.style.setProperty('--card-shadow', '0 10px 30px rgba(0, 0, 0, 0.08)');
        root.style.setProperty('--button-shadow', '0 4px 15px rgba(0, 0, 0, 0.1)');
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
