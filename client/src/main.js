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


// Chat Room Implementation
let socket = null;
let currentRoom = null;

function connectToChat(username, roomId, location, topic) {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log('Connected to chat server');
        socket.send(JSON.stringify({
            type: 'join',
            roomId,
            username,
            location,
            topic
        }));
    };

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        handleChatMessage(message);
    };

    socket.onclose = () => {
        console.log('Disconnected from chat server');
        showToast('Disconnected from chat. Trying to reconnect...', 'error');
        setTimeout(() => connectToChat(username, roomId, location, topic), 3000);
    };
}

function handleChatMessage(message) {
    const chatMessages = document.getElementById('chatMessages');
    const participantList = document.getElementById('participantList');
    const roomInfo = document.getElementById('roomInfo');
    const roomLocation = document.getElementById('roomLocation');
    const roomTopic = document.getElementById('roomTopic');

    switch (message.type) {
        case 'roomInfo':
            currentRoom = message.room;
            roomInfo.textContent = `${currentRoom.name}`;
            roomLocation.textContent = `Location: ${currentRoom.location}`;
            roomTopic.textContent = `Topic: ${currentRoom.topic}`;
            updateParticipantList(currentRoom.participants);
            break;

        case 'message':
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${message.userId === socket?.userId ? 'sent' : 'received'}`;
            messageDiv.innerHTML = `
                <div class="sender">${message.username}</div>
                <div class="content">${escapeHtml(message.content)}</div>
                <div class="timestamp">${new Date(message.timestamp).toLocaleTimeString()}</div>
            `;
            chatMessages.appendChild(messageDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
            break;

        case 'userJoined':
            showToast(`${message.username} joined the room`, 'success');
            if (currentRoom) {
                currentRoom.participants.push({
                    id: message.userId,
                    username: message.username
                });
                updateParticipantList(currentRoom.participants);
            }
            break;

        case 'userLeft':
            showToast(`${message.username} left the room`, 'info');
            if (currentRoom) {
                currentRoom.participants = currentRoom.participants.filter(
                    p => p.id !== message.userId
                );
                updateParticipantList(currentRoom.participants);
            }
            break;
    }
}

function updateParticipantList(participants) {
    const participantList = document.getElementById('participantList');
    participantList.innerHTML = '<h4>Participants</h4>';

    participants.forEach(participant => {
        const participantDiv = document.createElement('div');
        participantDiv.className = 'participant';
        participantDiv.innerHTML = `
            <div class="participant-avatar">
                ${participant.username.charAt(0).toUpperCase()}
            </div>
            <div class="participant-name">${participant.username}</div>
        `;
        participantList.appendChild(participantDiv);
    });
}

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Chat UI Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendMessage');

    messageInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    sendButton?.addEventListener('click', sendMessage);

    function sendMessage() {
        const content = messageInput.value.trim();
        if (content && socket?.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({
                type: 'message',
                content
            }));
            messageInput.value = '';
        }
    }

    // For testing: Connect to a default room
    const defaultRoom = {
        id: 'test-room',
        location: 'San Francisco, CA',
        topic: 'Technology Discussion'
    };

    // Show chat section
    document.getElementById('chatSection').style.display = 'block';

    // Connect to chat with a test user
    connectToChat('Test User', defaultRoom.id, defaultRoom.location, defaultRoom.topic);
});