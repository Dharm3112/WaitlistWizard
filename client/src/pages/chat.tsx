import { useEffect } from "react";
import { Link } from "wouter";

// Declare the window global type to include our initializeChat function
declare global {
  interface Window {
    initializeChat: () => void;
  }
}

export default function Chat() {
  // Use useEffect to initialize the chat functionality from chat.js after component mounts
  useEffect(() => {
    // Use dynamic import to load the chat.js module
    import('../chat.js' as any)
      .then(() => {
        // Once loaded, call the initializeChat function
        if (window.initializeChat) {
          window.initializeChat();
        } else {
          console.error("initializeChat function not found");
        }
      })
      .catch(err => {
        console.error("Error loading chat.js:", err);
      });
    
    // No cleanup needed for dynamic imports
  }, []);

  return (
    <div className="chat-page">
      {/* Loading Overlay */}
      <div className="loading-overlay visible" id="loadingOverlay">
        <div className="connection-loading">
          <div className="connection-node"></div>
          <div className="connection-node"></div>
          <div className="connection-node"></div>
          <div className="connection-node"></div>
          <div className="connection-line"></div>
          <div className="connection-line"></div>
          <div className="connection-line"></div>
          <div className="connection-line"></div>
          <div className="connection-center"></div>
        </div>
        <div className="loading-text">Connecting to Chat</div>
        <div className="loading-subtext">Finding your perfect networking space...</div>
      </div>
      
      {/* Navigation */}
      <nav className="navbar">
        <div className="container">
          <Link href="/" className="nav-logo">ConnectHub</Link>
          <button className="nav-toggle" aria-label="Toggle navigation">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <div className="nav-links">
            <Link href="/">Home</Link>
            <Link href="/features">Features</Link>
            <Link href="/how-it-works">How It Works</Link>
            <Link href="/chat" className="active">Chat Rooms</Link>
            <Link href="/about">About</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
      </nav>

      {/* Chat Interface */}
      <div className="chat-container">
        {/* Rooms List */}
        <div className="rooms-sidebar">
          <div className="rooms-header">
            <h2>Available Rooms</h2>
            <button id="createRoomBtn" className="create-room-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              New Room
            </button>
          </div>
          <div className="rooms-list" id="roomsList">
            {/* Rooms will be populated by JavaScript */}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          <div className="chat-header">
            <h2 id="currentRoom">Select a Room</h2>
            <div className="room-info">
              <span id="participantCount">0 participants</span>
            </div>
          </div>
          <div className="chat-messages" id="chatMessages">
            {/* Messages will be populated by JavaScript */}
          </div>
          <div className="chat-input">
            <form id="messageForm">
              <button type="button" id="moodSelector" className="mood-selector" title="Set your mood">
                😊
              </button>
              <div id="emojiPicker" className="emoji-picker">
                <div className="emoji-categories">
                  <div className="emoji-category active" data-category="mood">😀</div>
                  <div className="emoji-category" data-category="animals">🐱</div>
                  <div className="emoji-category" data-category="food">🍔</div>
                  <div className="emoji-category" data-category="activities">⚽</div>
                  <div className="emoji-category" data-category="travel">🚗</div>
                  <div className="emoji-category" data-category="objects">💡</div>
                </div>
                {/* Emojis will be populated by JavaScript */}
              </div>
              <input type="text" id="messageInput" placeholder="Type your message..." disabled />
              <button type="button" id="tagButton" title="Add interest tags">
                🏷️
              </button>
              <button type="submit" id="sendMessage">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 2L11 13"></path>
                  <path d="M22 2l-7 20-4-9-9-4 20-7z"></path>
                </svg>
              </button>
            </form>
          </div>
        </div>

        {/* Room Info */}
        <div className="room-details">
          <div className="room-details-header">
            <h3>Room Details</h3>
          </div>
          <div className="room-participants">
            <h4>Participants</h4>
            <ul id="participantsList">
              {/* Participants will be populated by JavaScript */}
            </ul>
          </div>
          <div className="room-interests">
            <h4>Room Interests</h4>
            <div id="roomInterests" className="interests-tags">
              {/* Interests will be populated by JavaScript */}
            </div>
          </div>
        </div>
      </div>

      {/* Create Room Modal */}
      <div id="createRoomModal" className="modal">
        <div className="modal-content">
          <h2>Create New Room</h2>
          <form id="createRoomForm">
            <div className="form-group">
              <label htmlFor="roomName">Room Name</label>
              <input type="text" id="roomName" required />
            </div>
            <div className="form-group">
              <label>Select Interests</label>
              <div className="interests-grid" id="roomInterestsSelect">
                {/* Will be populated by JavaScript */}
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn-secondary" id="cancelCreateRoom">Cancel</button>
              <button type="submit" className="btn-primary">Create Room</button>
            </div>
          </form>
        </div>
      </div>
      
      {/* Tag Selection Modal */}
      <div id="tagSelectionModal" className="modal">
        <div className="modal-content">
          <h2>Add Interest Tags</h2>
          <p className="subtitle">Tag your message with relevant interests to help others discover it</p>
          <div className="interests-grid" id="messageTagsSelect">
            {/* Will be populated by JavaScript */}
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-secondary" id="cancelTagSelection">Cancel</button>
            <button type="button" className="btn-primary" id="confirmTagSelection">Add Tags</button>
          </div>
        </div>
      </div>
    </div>
  );
}