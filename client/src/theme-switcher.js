/**
 * Simplified Theme Switcher - No UI
 */

class ThemeSwitcher {
    constructor() {
        // Do nothing, no UI is shown
        console.log("Simple blue theme applied");
    }
}

// Initialize the theme switcher when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.themeSwitcher = new ThemeSwitcher();
});
