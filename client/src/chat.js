// Chat Room Constants
const INTERESTS = [
    "Technology", "Business", "Marketing", "Design",
    "Finance", "Healthcare", "Education", "Engineering",
    "Research", "Sales", "HR", "Legal",
    "Consulting", "Real Estate", "Media", "Arts"
];

// Emoji mappings for interest tags
const INTEREST_EMOJIS = {
    "Technology": "💻",
    "Business": "💼",
    "Marketing": "📊",
    "Design": "🎨",
    "Finance": "💰",
    "Healthcare": "🏥",
    "Education": "📚",
    "Engineering": "⚙️",
    "Research": "🔬",
    "Sales": "🛒",
    "HR": "👥",
    "Legal": "⚖️",
    "Consulting": "💭",
    "Real Estate": "🏢",
    "Media": "📱",
    "Arts": "🎭"
};

// Emoji categories for the emoji picker
const EMOJI_CATEGORIES = {
    "mood": ["😀", "😊", "🙂", "😍", "😎", "🤔", "😐", "😢", "😡", "😴", "🤑", "🤯", "😇", "🥳", "😂", "🥺"],
    "animals": ["🐱", "🐶", "🐼", "🦁", "🐯", "🦊", "🦝", "🐮", "🐷", "🐸", "🐙", "🦄", "🦋", "🐝", "🐬", "🦜"],
    "food": ["🍔", "🍕", "🍦", "🍩", "🍰", "🍎", "🍓", "🥑", "🌮", "🍜", "🍚", "🥗", "🧀", "🥪", "🍺", "☕"],
    "activities": ["⚽", "🏀", "🎮", "🎬", "🎵", "🎨", "📚", "🏆", "🎯", "🎲", "🛫", "🚵‍♂️", "🏄‍♀️", "🧗‍♂️", "🎪", "🎭"],
    "travel": ["🚗", "✈️", "🚢", "🚆", "🚲", "🏔️", "🏖️", "🏙️", "🏜️", "🗺️", "🧳", "⛱️", "🏕️", "🗽", "🎡", "🚀"],
    "objects": ["💡", "💎", "🔨", "📱", "💻", "🎁", "🔑", "🧸", "⏰", "📷", "🔋", "📌", "🔍", "💊", "💰", "📦"]
};

// DOM Elements
const roomsList = document.getElementById('roomsList');
const chatMessages = document.getElementById('chatMessages');
const messageForm = document.getElementById('messageForm');
const messageInput = document.getElementById('messageInput');
const currentRoomTitle = document.getElementById('currentRoom');
const participantCount = document.getElementById('participantCount');
const participantsList = document.getElementById('participantsList');
const roomInterests = document.getElementById('roomInterests');
const createRoomBtn = document.getElementById('createRoomBtn');
const createRoomModal = document.getElementById('createRoomModal');
const createRoomForm = document.getElementById('createRoomForm');
const cancelCreateRoom = document.getElementById('cancelCreateRoom');
const moodSelector = document.getElementById('moodSelector');
const emojiPicker = document.getElementById('emojiPicker');
const tagButton = document.getElementById('tagButton');
const tagSelectionModal = document.getElementById('tagSelectionModal');
const messageTagsSelect = document.getElementById('messageTagsSelect');
const cancelTagSelection = document.getElementById('cancelTagSelection');
const confirmTagSelection = document.getElementById('confirmTagSelection');

// State
let currentRoom = null;
let socket = null;
let rooms = [];
let username = null;
let currentMood = "😊"; // Default mood emoji
let selectedTags = []; // Current message tags
let participantMoods = new Map(); // Map of participant username to mood emoji

// Initialize chat functionality
function initializeChat() {
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    loadingOverlay.classList.add('visible');
    
    // Set loading text
    const loadingText = loadingOverlay.querySelector('.loading-text');
    const loadingSubtext = loadingOverlay.querySelector('.loading-subtext');
    loadingText.textContent = 'Connecting to Chat';
    loadingSubtext.textContent = 'Finding your perfect networking space...';
    
    // Get username
    username = localStorage.getItem('username');
    if (!username) {
        loadingOverlay.classList.remove('visible');
        username = prompt('Enter your name to join chat:');
        if (username) {
            localStorage.setItem('username', username);
            // Show loading again after username entry
            loadingOverlay.classList.add('visible');
        } else {
            window.location.href = 'index.html';
            return;
        }
    }

    // Initialize WebSocket connection
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log('Connected to chat server');
        // Update loading state
        loadingText.textContent = 'Connected!';
        loadingSubtext.textContent = 'Fetching available rooms...';
        
        // Request room list
        socket.send(JSON.stringify({
            type: 'getRooms'
        }));
    };

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        
        // Hide loading overlay when rooms are loaded
        if (data.type === 'rooms') {
            setTimeout(() => {
                loadingOverlay.classList.remove('visible');
            }, 500);
        }
        
        handleWebSocketMessage(event);
    };
    
    socket.onclose = () => {
        console.log('Disconnected from chat server');
        
        // Show reconnection message
        loadingText.textContent = 'Connection Lost';
        loadingSubtext.textContent = 'Attempting to reconnect...';
        loadingOverlay.classList.add('visible');
        
        // Attempt to reconnect after 5 seconds
        setTimeout(initializeChat, 5000);
    };
    
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
        loadingText.textContent = 'Connection Error';
        loadingSubtext.textContent = 'Please try again later...';
    };

    // Initialize room creation
    setupRoomCreation();
    
    // Initialize emoji picker and mood selection
    setupEmojiPicker();
    
    // Initialize tag selection for messages
    setupTagSelection();
}

// Handle WebSocket messages
function handleWebSocketMessage(event) {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case 'rooms':
            updateRoomsList(data.rooms);
            break;
        case 'message':
            displayMessage(data.message);
            break;
        case 'roomJoined':
            handleRoomJoined(data.room);
            break;
        case 'participantsUpdate':
            updateParticipants(data.participants);
            break;
        case 'moodUpdate':
            // Update mood for specific participant
            if (data.username && data.mood) {
                participantMoods.set(data.username, data.mood);
                // If we're in a room, update participants display
                if (currentRoom) {
                    updateParticipants(data.participants || currentRoom.participants);
                }
            }
            break;
    }
}

// Update rooms list in sidebar
function updateRoomsList(newRooms) {
    rooms = newRooms;
    
    // First show a loading animation
    roomsList.innerHTML = '';
    const roomsLoading = document.createElement('div');
    roomsLoading.className = 'rooms-loading';
    roomsLoading.innerHTML = `
        <div class="room-item-loading"></div>
        <div class="room-item-loading"></div>
        <div class="room-item-loading"></div>
    `;
    roomsList.appendChild(roomsLoading);
    
    // Wait a short period (for better UX) then display actual rooms
    setTimeout(() => {
        roomsList.innerHTML = '';
        
        if (rooms.length === 0) {
            // Show empty state if no rooms
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="connection-loading">
                    <div class="connection-node"></div>
                    <div class="connection-node"></div>
                    <div class="connection-node"></div>
                    <div class="connection-node"></div>
                    <div class="connection-line"></div>
                    <div class="connection-line"></div>
                    <div class="connection-line"></div>
                    <div class="connection-line"></div>
                    <div class="connection-center"></div>
                </div>
                <p>No rooms available. Create one to start networking!</p>
            `;
            roomsList.appendChild(emptyState);
        } else {
            // Display all available rooms
            rooms.forEach(room => {
                const roomElement = document.createElement('div');
                roomElement.className = `room-item ${currentRoom?.id === room.id ? 'active' : ''}`;
                
                // Add interest emojis to the room item
                const interestEmojis = room.interests.slice(0, 3).map(interest => 
                    INTEREST_EMOJIS[interest] || '🏷️'
                ).join(' ');
                
                const extraInterestsCount = room.interests.length > 3 ? 
                    `+${room.interests.length - 3}` : '';
                
                roomElement.innerHTML = `
                    <h3>${room.name}</h3>
                    <div class="room-item-interests">
                        ${interestEmojis} ${extraInterestsCount}
                    </div>
                    <p>${room.participants.length} participants</p>
                `;
                roomElement.onclick = () => joinRoom(room.id);
                roomsList.appendChild(roomElement);
            });
        }
    }, 600);
}

// Join a chat room
function joinRoom(roomId) {
    // Show loading overlay
    const loadingOverlay = document.getElementById('loadingOverlay');
    const loadingText = loadingOverlay.querySelector('.loading-text');
    const loadingSubtext = loadingOverlay.querySelector('.loading-subtext');
    
    loadingText.textContent = 'Joining Room';
    loadingSubtext.textContent = 'Preparing your networking experience...';
    loadingOverlay.classList.add('visible');
    
    socket.send(JSON.stringify({
        type: 'joinRoom',
        roomId,
        username
    }));
}

// Handle successful room join
function handleRoomJoined(room) {
    // First update UI elements
    currentRoom = room;
    currentRoomTitle.textContent = room.name;
    messageInput.disabled = false;
    messageInput.placeholder = 'Type your message...';
    
    // Clear previous messages
    chatMessages.innerHTML = '';
    
    // Setup loading indicator for messages
    const messageLoading = document.createElement('div');
    messageLoading.className = 'chat-loading';
    messageLoading.innerHTML = `
        <div class="chat-message-loading"></div>
        <div class="chat-message-loading"></div>
        <div class="chat-message-loading"></div>
    `;
    chatMessages.appendChild(messageLoading);
    
    // Update room details first
    updateRoomDetails(room);
    
    // Hide loading overlay with a slight delay for better UX
    setTimeout(() => {
        const loadingOverlay = document.getElementById('loadingOverlay');
        loadingOverlay.classList.remove('visible');
        
        // Remove message loading placeholders and display actual messages
        chatMessages.innerHTML = '';
        if (room.messages && room.messages.length > 0) {
            room.messages.forEach(message => {
                displayMessage(message);
            });
        } else {
            // Show empty state
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <div class="data-packet-container">
                    <div class="data-path"></div>
                    <div class="data-packet"></div>
                    <div class="data-packet"></div>
                    <div class="data-packet"></div>
                    <div class="data-node"></div>
                    <div class="data-node"></div>
                </div>
                <p>No messages yet. Be the first to start the conversation!</p>
            `;
            chatMessages.appendChild(emptyState);
        }
    }, 800);
}

// Update room details sidebar
function updateRoomDetails(room) {
    participantCount.textContent = `${room.participants.length} participants`;
    
    // Update participants list
    participantsList.innerHTML = '';
    room.participants.forEach(participant => {
        const li = document.createElement('li');
        li.className = 'participant-item';
        li.innerHTML = `
            <div class="participant-avatar">${participant[0]}</div>
            <span>${participant}</span>
        `;
        participantsList.appendChild(li);
    });

    // Update room interests
    roomInterests.innerHTML = '';
    room.interests.forEach(interest => {
        const span = document.createElement('span');
        span.className = 'interest-tag';
        span.textContent = interest;
        roomInterests.appendChild(span);
    });
}

// Update participants list when someone joins/leaves
function updateParticipants(participants) {
    if (!currentRoom) return;
    
    // Update count
    participantCount.textContent = `${participants.length} participants`;
    
    // Update list
    participantsList.innerHTML = '';
    participants.forEach(participant => {
        const participantName = typeof participant === 'string' ? participant : participant.username;
        const participantMood = typeof participant === 'object' && participant.mood ? participant.mood : "😊";
        
        // Store this participant's mood for future reference
        if (typeof participant === 'object' && participant.mood) {
            participantMoods.set(participantName, participantMood);
        }
        
        const li = document.createElement('li');
        li.className = 'participant-item';
        li.innerHTML = `
            <div class="participant-avatar">${participantMood}</div>
            <span>${participantName}</span>
        `;
        participantsList.appendChild(li);
    });
}

// Update mood for participants
function broadcastParticipantsMoodUpdate(roomId) {
    if (!socket || socket.readyState !== WebSocket.OPEN || !currentRoom) return;
    
    socket.send(JSON.stringify({
        type: 'updateMood',
        roomId: roomId,
        mood: currentMood
    }));
}

// Display a chat message
function displayMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.username === username ? 'sent' : ''}`;
    
    // Create header with mood if available
    let headerContent = `<strong>${message.username}</strong>`;
    if (message.mood) {
        headerContent = `<span class="message-mood">${message.mood}</span>` + headerContent;
    }
    
    // Add message content
    messageElement.innerHTML = `
        <div class="message-header">
            ${headerContent}
            <span>${new Date(message.timestamp).toLocaleTimeString()}</span>
        </div>
        <div class="message-content">${message.content}</div>
    `;
    
    // Add tags if available
    if (message.tags && message.tags.length > 0) {
        const tagsContainer = document.createElement('div');
        tagsContainer.className = 'message-tags';
        
        message.tags.forEach(tag => {
            // Find emoji for this tag if it exists
            const emoji = INTEREST_EMOJIS[tag] || '🏷️';
            
            const tagElement = document.createElement('span');
            tagElement.className = 'message-tag';
            tagElement.innerHTML = `<span class="tag-emoji">${emoji}</span> ${tag}`;
            tagsContainer.appendChild(tagElement);
        });
        
        messageElement.appendChild(tagsContainer);
    }
    
    chatMessages.appendChild(messageElement);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Setup room creation functionality
function setupRoomCreation() {
    // Populate interests selection with colorful checkboxes
    const interestsSelect = document.getElementById('roomInterestsSelect');
    interestsSelect.innerHTML = ''; // Clear any existing content
    
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
        interestsSelect.appendChild(interestOption);
    });

    // Show modal with animation
    createRoomBtn.onclick = () => {
        createRoomModal.style.display = 'flex';
        setTimeout(() => {
            createRoomModal.classList.add('show');
        }, 10); // Small delay for the animation to work properly
    };

    // Hide modal with animation
    cancelCreateRoom.onclick = () => {
        createRoomModal.classList.remove('show');
        setTimeout(() => {
            createRoomModal.style.display = 'none';
        }, 300); // Match transition duration
    };

    // Close modal when clicking outside content
    createRoomModal.addEventListener('click', (e) => {
        if (e.target === createRoomModal) {
            cancelCreateRoom.click();
        }
    });

    // Handle room creation with improved validation
    createRoomForm.onsubmit = (e) => {
        e.preventDefault();
        
        const roomName = document.getElementById('roomName').value.trim();
        const selectedInterests = Array.from(
            document.querySelectorAll('#roomInterestsSelect input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);

        // Improved validation
        if (!roomName) {
            showFormError('Please enter a room name');
            return;
        }
        
        if (selectedInterests.length === 0) {
            showFormError('Please select at least one interest');
            return;
        }
        
        if (selectedInterests.length > 5) {
            showFormError('Please select no more than 5 interests');
            return;
        }

        // Show loading overlay for room creation
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = loadingOverlay.querySelector('.loading-text');
        const loadingSubtext = loadingOverlay.querySelector('.loading-subtext');
        
        loadingText.textContent = 'Creating New Room';
        loadingSubtext.textContent = 'Connecting with similar professionals...';
        loadingOverlay.classList.add('visible');
        
        // Reset form and hide modal
        createRoomModal.classList.remove('show');
        setTimeout(() => {
            createRoomModal.style.display = 'none';
            createRoomForm.reset();
            
            // Create room
            socket.send(JSON.stringify({
                type: 'createRoom',
                name: roomName,
                interests: selectedInterests
            }));
        }, 300);
    };
}

// Helper function to show form error messages
function showFormError(message) {
    // Create error message if it doesn't exist
    let errorDiv = document.querySelector('.form-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'form-error';
        createRoomForm.insertBefore(errorDiv, createRoomForm.firstChild);
    }
    
    // Show message with animation
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.style.animation = 'none';
    setTimeout(() => {
        errorDiv.style.animation = 'fadeIn 0.3s forwards';
    }, 10);
    
    // Hide after 3 seconds
    setTimeout(() => {
        errorDiv.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 300);
    }, 3000);
}

// Setup emoji picker
function setupEmojiPicker() {
    // Generate emoji content
    const populateEmojiPicker = (category) => {
        const emojiContainer = document.createElement('div');
        emojiContainer.className = 'emoji-list';
        
        EMOJI_CATEGORIES[category].forEach(emoji => {
            const emojiElement = document.createElement('span');
            emojiElement.className = 'emoji-item';
            emojiElement.textContent = emoji;
            emojiElement.onclick = () => {
                currentMood = emoji;
                moodSelector.textContent = emoji;
                emojiPicker.style.display = 'none';
                
                // Update mood on server
                if (currentRoom) {
                    broadcastParticipantsMoodUpdate(currentRoom.id);
                }
            };
            emojiContainer.appendChild(emojiElement);
        });
        
        return emojiContainer;
    };
    
    // Add emoji category switcher
    const categoryButtons = emojiPicker.querySelectorAll('.emoji-category');
    let currentEmojiContainer = populateEmojiPicker('mood');
    emojiPicker.appendChild(currentEmojiContainer);
    
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active category
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Replace emojis
            const category = button.getAttribute('data-category');
            emojiPicker.removeChild(currentEmojiContainer);
            currentEmojiContainer = populateEmojiPicker(category);
            emojiPicker.appendChild(currentEmojiContainer);
        });
    });
    
    // Toggle emoji picker
    moodSelector.addEventListener('click', (e) => {
        e.stopPropagation();
        if (emojiPicker.style.display === 'block') {
            emojiPicker.style.display = 'none';
        } else {
            emojiPicker.style.display = 'block';
        }
    });
    
    // Close emoji picker when clicking elsewhere
    document.addEventListener('click', (e) => {
        if (e.target !== moodSelector && !emojiPicker.contains(e.target)) {
            emojiPicker.style.display = 'none';
        }
    });
}

// Setup tag selection
function setupTagSelection() {
    // Populate tag selection with the same interests used for rooms
    messageTagsSelect.innerHTML = '';
    
    INTERESTS.forEach((interest, index) => {
        const interestOption = document.createElement('div');
        interestOption.className = 'interest-option';
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `tag-${index}`;
        checkbox.value = interest;
        
        // Add emoji to label
        const emoji = INTEREST_EMOJIS[interest] || '🏷️';
        const label = document.createElement('label');
        label.htmlFor = `tag-${index}`;
        label.innerHTML = `<span class="interest-emoji">${emoji}</span> ${interest}`;
        
        interestOption.appendChild(checkbox);
        interestOption.appendChild(label);
        messageTagsSelect.appendChild(interestOption);
    });
    
    // Show tags modal
    tagButton.addEventListener('click', () => {
        tagSelectionModal.style.display = 'flex';
        setTimeout(() => {
            tagSelectionModal.classList.add('show');
        }, 10);
        
        // Reset checkboxes based on currently selected tags
        const checkboxes = messageTagsSelect.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = selectedTags.includes(checkbox.value);
        });
    });
    
    // Cancel tag selection
    cancelTagSelection.addEventListener('click', () => {
        tagSelectionModal.classList.remove('show');
        setTimeout(() => {
            tagSelectionModal.style.display = 'none';
        }, 300);
    });
    
    // Close modal when clicking outside
    tagSelectionModal.addEventListener('click', (e) => {
        if (e.target === tagSelectionModal) {
            cancelTagSelection.click();
        }
    });
    
    // Confirm tag selection
    confirmTagSelection.addEventListener('click', () => {
        // Get selected tags
        selectedTags = Array.from(
            messageTagsSelect.querySelectorAll('input[type="checkbox"]:checked')
        ).map(checkbox => checkbox.value);
        
        // Update button appearance to indicate tags are selected
        if (selectedTags.length > 0) {
            tagButton.classList.add('has-tags');
            tagButton.setAttribute('title', `${selectedTags.length} tags selected`);
        } else {
            tagButton.classList.remove('has-tags');
            tagButton.setAttribute('title', 'Add interest tags');
        }
        
        // Close modal
        cancelTagSelection.click();
    });
}

// Handle sending messages
messageForm.onsubmit = (e) => {
    e.preventDefault();
    const message = messageInput.value.trim();
    
    if (message && currentRoom) {
        socket.send(JSON.stringify({
            type: 'sendMessage',
            content: message,
            mood: currentMood,
            tags: selectedTags.length > 0 ? selectedTags : undefined
        }));
        
        messageInput.value = '';
        
        // Reset tags after sending (optional, depends on UX preference)
        if (selectedTags.length > 0) {
            selectedTags = [];
            tagButton.classList.remove('has-tags');
            tagButton.setAttribute('title', 'Add interest tags');
        }
    }
};

// Initialize chat when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChat);
