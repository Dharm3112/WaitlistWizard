// Constants
const PROFESSIONS = [
    "Software Engineer", "Business Analyst", "Marketing Manager",
    "Designer", "Financial Analyst", "Healthcare Professional",
    "Educator", "Engineer", "Researcher", "Sales Representative",
    "HR Manager", "Lawyer", "Consultant", "Real Estate Agent",
    "Media Professional", "Artist"
];

const INTERESTS = [
    "Technology", "Business", "Marketing", "Design",
    "Finance", "Healthcare", "Education", "Engineering",
    "Research", "Sales", "HR", "Legal",
    "Consulting", "Real Estate", "Media", "Arts"
];

// Initialize the form
function initializeForm() {
    // Populate professions dropdown for the main waitlist form
    const professionSelect = document.getElementById('profession');
    if (professionSelect) {
        PROFESSIONS.forEach(profession => {
            const option = document.createElement('option');
            option.value = profession;
            option.textContent = profession;
            professionSelect.appendChild(option);
        });
    }

    // Populate professions dropdown for the dropdown form
    const dropdownProfessionSelect = document.getElementById('dropdownProfession');
    if (dropdownProfessionSelect) {
        PROFESSIONS.forEach(profession => {
            const option = document.createElement('option');
            option.value = profession;
            option.textContent = profession;
            dropdownProfessionSelect.appendChild(option);
        });
    }

    // Create interest buttons
    const interestsContainer = document.getElementById('interests');
    if (interestsContainer) {
        INTERESTS.forEach(interest => {
            const button = document.createElement('button');
            button.type = 'button';
            button.className = 'interest-button';
            button.textContent = interest;
            button.onclick = () => toggleInterest(button);
            interestsContainer.appendChild(button);
        });
    }

    // Add form submit handler for main waitlist form
    const form = document.getElementById('waitlistForm');
    if (form) {
        form.onsubmit = handleSubmit;
    }
    
    // Add form submit handler for dropdown form
    const dropdownForm = document.getElementById('dropdownWaitlistForm');
    if (dropdownForm) {
        dropdownForm.onsubmit = handleDropdownSubmit;
    }
    
    // Initialize the early access dropdown
    initializeEarlyAccessDropdown();
}

// Handle the early access dropdown
function initializeEarlyAccessDropdown() {
    const earlyAccessBtn = document.getElementById('earlyAccessBtn');
    const earlyAccessDropdown = document.getElementById('earlyAccessDropdown');
    const closeDropdownForm = document.getElementById('closeDropdownForm');
    
    if (earlyAccessBtn && earlyAccessDropdown) {
        // Open dropdown on button click
        earlyAccessBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Stop event from bubbling up
            earlyAccessDropdown.classList.add('visible');
            console.log('Dropdown should be visible now');
        });
        
        // Close dropdown when clicking the close button
        if (closeDropdownForm) {
            closeDropdownForm.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Stop event from bubbling up
                earlyAccessDropdown.classList.remove('visible');
                console.log('Dropdown closed via close button');
            });
        }
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (earlyAccessDropdown.classList.contains('visible') && 
                !earlyAccessDropdown.contains(e.target) && 
                !earlyAccessBtn.contains(e.target)) { // Better check using contains
                earlyAccessDropdown.classList.remove('visible');
                console.log('Dropdown closed via outside click');
            }
        });
        
        // Prevent clicks inside the dropdown from closing it
        earlyAccessDropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }
}

// Handle dropdown form submission
function handleDropdownSubmit(e) {
    e.preventDefault();
    
    const formData = {
        fullName: document.getElementById('dropdownFullName').value,
        email: document.getElementById('dropdownEmail').value,
        profession: document.getElementById('dropdownProfession').value,
        location: "", // Not required for dropdown form
        interests: [] // Not required for dropdown form
    };
    
    // Validate the dropdown form data
    const errors = validateDropdownForm(formData);
    
    if (Object.keys(errors).length === 0) {
        // Show loading state
        const submitButton = document.querySelector('#dropdownWaitlistForm .submit-button');
        submitButton.querySelector('.button-content').style.opacity = '0';
        submitButton.querySelector('.loading-spinner').style.display = 'block';
        
        // Simulate form submission
        setTimeout(() => {
            // Hide loading state
            submitButton.querySelector('.button-content').style.opacity = '1';
            submitButton.querySelector('.loading-spinner').style.display = 'none';
            
            // Close the dropdown
            document.getElementById('earlyAccessDropdown').classList.remove('visible');
            
            // Show success message
            showToast('Thanks for joining our waitlist! We\'ll be in touch soon.');
            
            // Reset the form
            document.getElementById('dropdownWaitlistForm').reset();
        }, 1500);
    } else {
        // Show errors for the dropdown form
        showDropdownErrors(errors);
    }
}

// Validate dropdown form (simpler than main form)
function validateDropdownForm(formData) {
    const errors = {};

    if (!formData.fullName.trim()) {
        errors.dropdownFullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
        errors.dropdownEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.dropdownEmail = 'Invalid email format';
    }

    if (!formData.profession) {
        errors.dropdownProfession = 'Please select your profession';
    }

    return errors;
}

// Show dropdown form errors
function showDropdownErrors(errors) {
    // Clear all previous errors in dropdown form
    document.querySelectorAll('#dropdownWaitlistForm .error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });

    // Show new errors in dropdown form
    Object.entries(errors).forEach(([field, message]) => {
        const errorEl = document.querySelector(`#${field}`).nextElementSibling.nextElementSibling;
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    });
}

// Toggle interest selection
function toggleInterest(button) {
    button.classList.toggle('selected');
}

// Get selected interests
function getSelectedInterests() {
    return Array.from(document.querySelectorAll('.interest-button.selected'))
        .map(button => button.textContent);
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Form validation
function validateForm(formData) {
    const errors = {};

    if (!formData.fullName.trim()) {
        errors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
    }

    if (!formData.profession) {
        errors.profession = 'Please select your profession';
    }

    if (!formData.location.trim()) {
        errors.location = 'Location is required';
    }

    if (formData.interests.length === 0) {
        errors.interests = 'Please select at least one interest';
    }

    return errors;
}

// Show form errors
function showErrors(errors) {
    // Clear all previous errors
    document.querySelectorAll('.error-message').forEach(el => {
        el.style.display = 'none';
        el.textContent = '';
    });

    // Show new errors
    Object.entries(errors).forEach(([field, message]) => {
        const errorEl = document.querySelector(`#${field}`).nextElementSibling;
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    });
}

// Handle form submission
async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const buttonText = submitButton.querySelector('.button-text');
    const spinner = submitButton.querySelector('.loading-spinner');

    const formData = {
        fullName: form.fullName.value,
        email: form.email.value,
        profession: form.profession.value,
        location: form.location.value,
        interests: getSelectedInterests()
    };

    // Validate form
    const errors = validateForm(formData);
    if (Object.keys(errors).length > 0) {
        showErrors(errors);
        return;
    }

    // Show loading state
    submitButton.disabled = true;
    buttonText.style.opacity = '0';
    spinner.style.display = 'block';

    try {
        const response = await fetch('/api/waitlist', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to join waitlist');
        }

        // Show success message
        showToast('Successfully joined waitlist! We\'ll notify you when we launch.');
        form.reset();
        document.querySelectorAll('.interest-button').forEach(button => {
            button.classList.remove('selected');
        });

    } catch (error) {
        showToast(error.message, 'error');
    } finally {
        // Reset button state
        submitButton.disabled = false;
        buttonText.style.opacity = '1';
        spinner.style.display = 'none';
    }
}

// Add contact form handling to the existing JavaScript
function handleContactForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;

    contactForm.onsubmit = async (e) => {
        e.preventDefault();

        const form = e.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const buttonText = submitButton.querySelector('.button-text');
        const spinner = submitButton.querySelector('.loading-spinner');

        const formData = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value
        };

        // Validate form
        const errors = validateContactForm(formData);
        if (Object.keys(errors).length > 0) {
            showErrors(errors);
            return;
        }

        // Show loading state
        submitButton.disabled = true;
        buttonText.style.opacity = '0';
        spinner.style.display = 'block';

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Show success message
            showToast('Message sent successfully! We\'ll get back to you soon.');
            form.reset();

        } catch (error) {
            showToast(error.message || 'Failed to send message', 'error');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            buttonText.style.opacity = '1';
            spinner.style.display = 'none';
        }
    };
}

// Validate contact form
function validateContactForm(formData) {
    const errors = {};

    if (!formData.name.trim()) {
        errors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
        errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Invalid email format';
    }

    if (!formData.subject.trim()) {
        errors.subject = 'Subject is required';
    }

    if (!formData.message.trim()) {
        errors.message = 'Message is required';
    }

    return errors;
}

// Handle mobile navigation
function initializeNavigation() {
    const navbar = document.querySelector('.navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target) && navLinks.classList.contains('show')) {
            navLinks.classList.remove('show');
        }
    });
}


// Feature card flip interaction - optimized
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    if (!featureCards.length) return;
    
    // Use event delegation for better performance
    document.addEventListener('click', (e) => {
        // Find if click was on learn more button
        if (e.target.classList.contains('learn-more') || e.target.closest('.learn-more')) {
            const card = e.target.closest('.feature-card');
            if (!card) return;
            
            const cardInner = card.querySelector('.card-inner');
            if (cardInner) {
                requestAnimationFrame(() => {
                    cardInner.style.transform = 'rotateY(180deg)';
                });
            }
        }
        
        // Find if click was on back button
        if (e.target.classList.contains('back-button') || e.target.closest('.back-button')) {
            const card = e.target.closest('.feature-card');
            if (!card) return;
            
            const cardInner = card.querySelector('.card-inner');
            if (cardInner) {
                requestAnimationFrame(() => {
                    cardInner.style.transform = 'rotateY(0deg)';
                });
            }
        }
    });
}

// Animate the process steps - optimized
function initializeProcessSteps() {
    const steps = document.querySelectorAll('.step-card');
    const progressMarker = document.querySelector('.progress-marker');
    
    if (!steps.length || !progressMarker) return;
    
    // Initial position - throttle to next frame for performance
    requestAnimationFrame(() => {
        updateProgressPosition(steps[0]);
    });
    
    // Create a more efficient IntersectionObserver
    const stepObserver = new IntersectionObserver((entries) => {
        // Cache active step to prevent unnecessary DOM operations
        let activeStep = null;
        
        for (let i = 0; i < entries.length; i++) {
            if (entries[i].isIntersecting) {
                activeStep = entries[i].target;
                break;
            }
        }
        
        if (activeStep) {
            // Batch DOM updates with requestAnimationFrame
            requestAnimationFrame(() => {
                // Remove active class from all steps
                for (let i = 0; i < steps.length; i++) {
                    steps[i].classList.remove('active');
                }
                
                // Add active class to current step
                activeStep.classList.add('active');
                
                // Update progress marker position
                updateProgressPosition(activeStep);
                
                // Animate the step content
                animateStepContent(activeStep);
            });
        }
    }, {
        root: null,
        rootMargin: '0px',
        threshold: 0.6
    });
    
    // Observe all step elements
    for (let i = 0; i < steps.length; i++) {
        stepObserver.observe(steps[i]);
    }
}

function updateProgressPosition(activeStep) {
    const progressMarker = document.querySelector('.progress-marker');
    const progressLine = document.querySelector('.progress-line');
    if (!progressMarker || !progressLine) return;
    
    const stepNumber = activeStep.id.replace('step', '');
    const totalSteps = document.querySelectorAll('.step-card').length;
    const percentage = ((stepNumber - 1) / (totalSteps - 1)) * 100;
    
    progressMarker.style.top = `${percentage}%`;
    progressLine.style.height = `${percentage}%`;
}

function animateStepContent(step) {
    const content = step.querySelector('.step-content');
    const image = step.querySelector('.step-img');
    
    if (content) {
        content.style.opacity = '0';
        content.style.transform = 'translateX(-20px)';
        setTimeout(() => {
            content.style.opacity = '1';
            content.style.transform = 'translateX(0)';
        }, 100);
    }
    
    if (image) {
        image.style.opacity = '0';
        image.style.transform = 'translateX(20px)';
        setTimeout(() => {
            image.style.opacity = '1';
            image.style.transform = 'translateX(0)';
        }, 300);
    }
}

// Back to top button - optimized with throttling
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    if (!backToTopButton) return;
    
    // Throttled scroll handler for better performance
    let isScrolling = false;
    
    // Show/hide button based on scroll position with passive event listener
    window.addEventListener('scroll', () => {
        // Skip if already processing a scroll event
        if (isScrolling) return;
        
        isScrolling = true;
        
        // Use requestAnimationFrame for smoother performance
        window.requestAnimationFrame(() => {
            if (window.scrollY > 300) {
                if (!backToTopButton.classList.contains('show')) {
                    backToTopButton.classList.add('show');
                }
            } else {
                if (backToTopButton.classList.contains('show')) {
                    backToTopButton.classList.remove('show');
                }
            }
            
            isScrolling = false;
        });
    }, { passive: true });
    
    // Scroll to top when clicked
    backToTopButton.addEventListener('click', () => {
        // Using scrollIntoView is more performant than scrollTo in many browsers
        document.body.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
}

// Smooth scroll for anchor links
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Offset for navbar
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate hero section elements - optimized for performance
function animateHero() {
    // Use requestAnimationFrame for better performance
    window.requestAnimationFrame(() => {
        // Add classes to hero content
        const heroContainer = document.querySelector('.hero .container');
        if (heroContainer) {
            heroContainer.style.opacity = '1';
        }
        
        // Animate connection dots with delay
        const dots = document.querySelectorAll('.connection-dot');
        if (dots.length) {
            // Use a single loop with explicit element references for better performance
            let delay = 1000;
            
            for (let i = 0; i < dots.length; i++) {
                ((dot, dotDelay) => {
                    setTimeout(() => {
                        dot.classList.add('animate');
                    }, dotDelay);
                })(dots[i], delay + (i * 200));
            }
            
            // Animate connection lines after dots finish
            const lines = document.querySelectorAll('.connection-line');
            if (lines.length) {
                let lineDelay = delay + (dots.length * 200);
                
                for (let i = 0; i < lines.length; i++) {
                    ((line, lineDelay) => {
                        setTimeout(() => {
                            line.classList.add('animate');
                        }, lineDelay);
                    })(lines[i], lineDelay + (i * 150));
                }
            }
        }
    });
}

// Updated interest buttons for the waitlist form
function initializeInterestSelectors() {
    const interestsContainer = document.getElementById('interests');
    if (!interestsContainer) return;
    
    // Clear previous content
    interestsContainer.innerHTML = '';
    
    // Create interest options
    INTERESTS.forEach((interest, index) => {
        const interestOption = document.createElement('div');
        interestOption.className = 'interest-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `interest-${index}`;
        checkbox.value = interest;
        
        const label = document.createElement('label');
        label.htmlFor = `interest-${index}`;
        label.textContent = interest;
        
        interestOption.appendChild(checkbox);
        interestOption.appendChild(label);
        interestsContainer.appendChild(interestOption);
    });
}

// Updated function to get selected interests
function getSelectedInterests() {
    return Array.from(document.querySelectorAll('#interests input[type="checkbox"]:checked'))
        .map(checkbox => checkbox.value);
}

// Add function for sequential animation classes
function addSequentialAnimationClasses() {
    // Add animate-item class to headings and paragraphs in sections
    document.querySelectorAll('section h1, section h2, section p, .hero-buttons, .feature-card, .step-card, .timeline-item').forEach(element => {
        element.classList.add('animate-item');
    });
}

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page transition system
    try {
        // Import the module dynamically
        import('./page-transitions.js')
            .then(module => {
                console.log('Page transitions initialized successfully');
                // Add sequential animation classes after transitions are loaded
                addSequentialAnimationClasses();
            })
            .catch(error => console.error('Error loading page transitions:', error));
    } catch (error) {
        console.error('Error initializing page transitions:', error);
    }
    
    // Initialize original components
    initializeForm();
    handleContactForm();
    initializeNavigation();
    
    // Initialize new interactive components
    initializeFeatureCards();
    initializeProcessSteps();
    initializeBackToTop();
    initializeSmoothScroll();
    initializeInterestSelectors();
    
    // Animate hero section
    setTimeout(animateHero, 300);
    
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
    
    // Newsletter form handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input').value;
            if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                showToast('Thanks for subscribing to our newsletter!');
                newsletterForm.reset();
            } else {
                showToast('Please enter a valid email address', 'error');
            }
        });
    }
});

// Add scroll animation for sections - optimized for performance
let ticking = false;
let lastScrollY = 0;

// Use passive event listener for better performance
document.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            animateOnScroll(lastScrollY);
            ticking = false;
        });
        
        ticking = true;
    }
}, { passive: true });

// Separate function to handle animations on scroll
function animateOnScroll(scrollY) {
    const viewportHeight = window.innerHeight;
    const triggerPoint = viewportHeight * 0.75;
    
    // Animate sections when scrolled into view - use direct for loop for better performance
    const sections = document.querySelectorAll('section');
    for (let i = 0; i < sections.length; i++) {
        const section = sections[i];
        if (section.classList.contains('animate-in')) continue;
        
        const rect = section.getBoundingClientRect();
        if (rect.top <= triggerPoint) {
            section.classList.add('animate-in');
        }
    }
    
    // Animate elements with data-aos attribute - more efficient batching
    const elements = document.querySelectorAll('[data-aos]:not([data-aos-animated])');
    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];
        const rect = element.getBoundingClientRect();
        
        if (rect.top <= triggerPoint) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
            element.setAttribute('data-aos-animated', 'true');
        }
    }
}