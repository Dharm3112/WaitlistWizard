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
    // Populate professions dropdown
    const professionSelect = document.getElementById('profession');
    PROFESSIONS.forEach(profession => {
        const option = document.createElement('option');
        option.value = profession;
        option.textContent = profession;
        professionSelect.appendChild(option);
    });

    // Create interest buttons
    const interestsContainer = document.getElementById('interests');
    INTERESTS.forEach(interest => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'interest-button';
        button.textContent = interest;
        button.onclick = () => toggleInterest(button);
        interestsContainer.appendChild(button);
    });

    // Add form submit handler
    const form = document.getElementById('waitlistForm');
    form.onsubmit = handleSubmit;
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


// Feature card flip interaction
function initializeFeatureCards() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const cardInner = card.querySelector('.feature-card-inner');
        const learnMoreBtn = card.querySelector('.feature-more-btn');
        const backBtn = card.querySelector('.feature-back-btn');
        
        if (learnMoreBtn && backBtn) {
            learnMoreBtn.addEventListener('click', () => {
                card.classList.add('flipped');
            });
            
            backBtn.addEventListener('click', () => {
                card.classList.remove('flipped');
            });
        }
        
        // Add hover effect with slight rotation
        card.addEventListener('mouseenter', (e) => {
            if (!card.classList.contains('flipped')) {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                
                cardInner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            if (!card.classList.contains('flipped')) {
                cardInner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
            }
        });
    });
}

// Animate the process steps
function initializeProcessSteps() {
    const steps = document.querySelectorAll('.step-card');
    const progressMarker = document.querySelector('.progress-marker');
    
    if (steps.length && progressMarker) {
        // Initial position
        updateProgressPosition(steps[0]);
        
        // Set active state for steps when scrolled into view
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.6
        };
        
        const stepObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Remove active class from all steps
                    steps.forEach(s => s.classList.remove('active'));
                    
                    // Add active class to current step
                    entry.target.classList.add('active');
                    
                    // Update progress marker position
                    updateProgressPosition(entry.target);
                    
                    // Animate the step content
                    animateStepContent(entry.target);
                }
            });
        }, observerOptions);
        
        steps.forEach(step => {
            stepObserver.observe(step);
        });
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

// Back to top button
function initializeBackToTop() {
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('show');
            } else {
                backToTopButton.classList.remove('show');
            }
        });
        
        // Scroll to top when clicked
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
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

// Animate hero section elements
function animateHero() {
    const heroElements = [
        document.querySelector('.hero-title'),
        document.querySelector('.hero-subtitle'),
        document.querySelector('.hero-buttons'),
        document.querySelector('.hero-image')
    ];
    
    heroElements.forEach((element, index) => {
        if (element) {
            setTimeout(() => {
                element.classList.add('animate-in');
            }, index * 200);
        }
    });
    
    // Animate connection dots with delay
    const dots = document.querySelectorAll('.connection-dot');
    dots.forEach((dot, index) => {
        setTimeout(() => {
            dot.classList.add('animate');
        }, 1000 + (index * 300));
    });
    
    // Animate connection lines after dots
    const lines = document.querySelectorAll('.connection-line');
    lines.forEach((line, index) => {
        setTimeout(() => {
            line.classList.add('animate');
        }, 2000 + (index * 200));
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

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
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

// Add scroll animation for sections
document.addEventListener('scroll', () => {
    // Animate sections when scrolled into view
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        
        if (isVisible && !section.classList.contains('animate-in')) {
            section.classList.add('animate-in');
        }
    });
    
    // Animate elements with data-aos attribute
    const elements = document.querySelectorAll('[data-aos]');
    elements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top <= window.innerHeight * 0.75;
        
        if (isVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
});