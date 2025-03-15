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

// Initialize the form when the DOM is loaded
document.addEventListener('DOMContentLoaded', initializeForm);

// Add scroll animation
document.addEventListener('scroll', () => {
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

// Initialize animations
document.querySelectorAll('[data-aos]').forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s, transform 0.6s';
});
