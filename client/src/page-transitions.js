/**
 * Page Transitions - Adds smooth, animated transitions between pages
 * 
 * This module provides storytelling-like page transitions with sequential animation
 * of page elements to create a more engaging browsing experience.
 */

class PageTransition {
    constructor() {
        this.isTransitioning = false;
        this.transitionDuration = 800; // milliseconds
        this.sequenceDelay = 100; // Delay between sequential animations
        
        // Initialize transitions
        this.init();
    }
    
    init() {
        // Add transition classes to body
        document.body.classList.add('has-transitions');
        
        // Handle all link clicks for page transitions
        document.addEventListener('click', (e) => {
            // Only handle links that should trigger page transitions
            const link = e.target.closest('a');
            
            if (link && this.shouldTransition(link)) {
                e.preventDefault();
                const targetUrl = link.getAttribute('href');
                
                // Don't transition if it's the current page or already transitioning
                if (window.location.pathname === targetUrl || this.isTransitioning) {
                    return;
                }
                
                console.log('Starting transition to:', targetUrl);
                this.transitionToPage(targetUrl);
            }
        });
        
        // Animate page entry when DOM is loaded
        if (document.readyState === 'complete') {
            this.animatePageEntry();
        } else {
            window.addEventListener('load', () => this.animatePageEntry());
        }
        
        // Add history change handler for back/forward navigation
        window.addEventListener('popstate', () => {
            // Only handle if not in the middle of a transition
            if (!this.isTransitioning) {
                console.log('History navigation, animating page entry');
                this.animatePageEntry();
            }
        });
    }
    
    shouldTransition(link) {
        // Only transition internal links that lead to HTML pages
        const href = link.getAttribute('href');
        
        // Skip anchors, external links, and non-HTML resources
        return href && 
               href.startsWith('/') === false && // Not absolute URL
               href.startsWith('#') === false && // Not anchor
               href.startsWith('http') === false && // Not external
               href.startsWith('mailto:') === false && // Not email
               href.startsWith('tel:') === false && // Not telephone
               (href.endsWith('.html') || href.indexOf('.') === -1); // HTML or no extension
    }
    
    transitionToPage(targetUrl) {
        this.isTransitioning = true;
        
        // Add transition-out class to body
        document.body.classList.add('transition-out');
        
        // Animate all sections out in sequence
        const sections = document.querySelectorAll('section, header, footer');
        
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.classList.add('transition-out');
            }, index * this.sequenceDelay);
        });
        
        // Once transition out is complete, navigate to new page
        setTimeout(() => {
            console.log('Transition out complete, navigating to:', targetUrl);
            window.location.href = targetUrl;
        }, this.transitionDuration);
    }
    
    animatePageEntry() {
        // Reset transitioning state
        this.isTransitioning = false;
        
        // Remove transition classes and add entry class
        document.body.classList.remove('transition-out');
        document.body.classList.add('transition-in');
        
        // Animate sections in sequence
        const sections = document.querySelectorAll('section, header, footer');
        
        sections.forEach((section, index) => {
            // Set initial state (invisible)
            section.classList.add('transition-item');
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            
            // Animate in with delay
            setTimeout(() => {
                section.style.transition = `opacity 0.8s ease, transform 0.8s ease`;
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
                
                // Animate children sequentially if they have the special class
                this.animateSequentialChildren(section);
            }, 100 + (index * this.sequenceDelay));
        });
        
        // Remove transition-in class when complete
        setTimeout(() => {
            document.body.classList.remove('transition-in');
        }, this.transitionDuration + (sections.length * this.sequenceDelay));
    }
    
    animateSequentialChildren(container) {
        // Find elements to animate sequentially
        const animateItems = container.querySelectorAll('.animate-item');
        
        animateItems.forEach((item, index) => {
            // Set initial state
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            
            // Animate with sequential delay
            setTimeout(() => {
                item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 200 + (index * 100)); // Smaller delay for children
        });
    }
}

// Create and export an instance
const pageTransition = new PageTransition();
export default pageTransition;