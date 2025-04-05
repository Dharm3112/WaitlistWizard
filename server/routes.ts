import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { ZodError } from "zod";
import { WebSocketServer, WebSocket } from "ws";
import { nanoid } from "nanoid";

// Data structures for the chat system
interface ChatMessage {
  id: string;
  roomId: string;
  username: string;
  content: string;
  timestamp: number;
  mood?: string; // Emoji representing user's mood
  tags?: string[]; // Array of emoji tags for the message
}

interface ChatRoom {
  id: string;
  name: string;
  interests: string[];
  messages: ChatMessage[];
  participants: string[];
}

interface ChatClient {
  id: string;
  username: string;
  socket: WebSocket;
  roomId: string | null;
  currentMood?: string; // Current mood emoji
}

// Memory storage for chat
const chatRooms: ChatRoom[] = [
  {
    id: "tech-enthusiasts",
    name: "Tech Enthusiasts",
    interests: ["Technology", "Programming", "AI"],
    messages: [],
    participants: []
  },
  {
    id: "business-network",
    name: "Business Network",
    interests: ["Business", "Entrepreneurship", "Marketing"],
    messages: [],
    participants: []
  },
  {
    id: "creative-minds",
    name: "Creative Minds",
    interests: ["Design", "Arts", "Media"],
    messages: [],
    participants: []
  },
  {
    id: "health-wellness",
    name: "Health & Wellness",
    interests: ["Healthcare", "Fitness", "Wellness"],
    messages: [],
    participants: []
  }
];

const clients: Map<string, ChatClient> = new Map();

export async function registerRoutes(app: Express) {
  app.post("/api/waitlist", async (req, res) => {
    try {
      const data = insertWaitlistSchema.parse(req.body);
      
      const isRegistered = await storage.isEmailRegistered(data.email);
      if (isRegistered) {
        return res.status(400).json({ 
          message: "This email is already registered for the waitlist" 
        });
      }

      const entry = await storage.createWaitlistEntry(data);
      res.status(201).json(entry);
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          message: "Invalid input data",
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to join waitlist" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  wss.on('connection', (socket: WebSocket) => {
    const clientId = nanoid();
    clients.set(clientId, {
      id: clientId,
      username: '',
      socket,
      roomId: null
    });

    socket.on('message', (message: string) => {
      try {
        const data = JSON.parse(message.toString());
        handleWebSocketMessage(clientId, data);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    });

    socket.on('close', () => {
      const client = clients.get(clientId);
      if (client && client.roomId) {
        // Remove user from room
        leaveRoom(clientId, client.roomId);
      }
      clients.delete(clientId);
    });
  });

  return httpServer;
}

// WebSocket message handler
function handleWebSocketMessage(clientId: string, data: any) {
  const client = clients.get(clientId);
  if (!client) return;

  switch (data.type) {
    case 'getRooms':
      sendRoomsList(client);
      break;
    case 'joinRoom':
      joinRoom(clientId, data.roomId, data.username);
      break;
    case 'sendMessage':
      if (client.roomId) {
        const message: ChatMessage = {
          id: nanoid(),
          roomId: client.roomId,
          username: client.username,
          content: data.content,
          timestamp: Date.now(),
          mood: data.mood || client.currentMood,
          tags: data.tags || undefined
        };
        addMessageToRoom(client.roomId, message);
      }
      break;
    case 'updateMood':
      client.currentMood = data.mood;
      // If user is in a room, notify other participants of mood change
      if (client.roomId) {
        broadcastParticipantsMoodUpdate(client.roomId);
      }
      break;
    case 'createRoom':
      createRoom(data.name, data.interests);
      broadcastRoomsList();
      break;
  }
}

// Helper functions for chat
function sendRoomsList(client: ChatClient) {
  const rooms = chatRooms.map(room => ({
    id: room.id,
    name: room.name,
    interests: room.interests,
    participants: room.participants.length
  }));

  if (client.socket.readyState === WebSocket.OPEN) {
    client.socket.send(JSON.stringify({
      type: 'rooms',
      rooms
    }));
  }
}

function broadcastRoomsList() {
  clients.forEach(client => {
    sendRoomsList(client);
  });
}

function joinRoom(clientId: string, roomId: string, username: string) {
  const client = clients.get(clientId);
  const room = chatRooms.find(r => r.id === roomId);

  if (!client || !room) return;

  // Update client info
  client.username = username;
  
  // If client was in another room, remove them
  if (client.roomId && client.roomId !== roomId) {
    leaveRoom(clientId, client.roomId);
  }

  // Add client to new room
  client.roomId = roomId;
  if (!room.participants.includes(username)) {
    room.participants.push(username);
  }

  // Send room details to client
  if (client.socket.readyState === WebSocket.OPEN) {
    client.socket.send(JSON.stringify({
      type: 'roomJoined',
      room: {
        id: room.id,
        name: room.name,
        interests: room.interests,
        messages: room.messages,
        participants: room.participants
      }
    }));
  }

  // Notify other participants
  broadcastParticipantsUpdate(roomId);
}

function leaveRoom(clientId: string, roomId: string) {
  const client = clients.get(clientId);
  const room = chatRooms.find(r => r.id === roomId);

  if (!client || !room) return;

  // Remove participant from room
  const index = room.participants.indexOf(client.username);
  if (index !== -1) {
    room.participants.splice(index, 1);
  }

  client.roomId = null;

  // Notify other participants
  broadcastParticipantsUpdate(roomId);
}

function broadcastParticipantsUpdate(roomId: string) {
  const room = chatRooms.find(r => r.id === roomId);
  if (!room) return;

  // Get participants with their moods
  const participantsWithMoods = room.participants.map(username => {
    const clientEntry = Array.from(clients.entries()).find(([_, client]) => client.username === username);
    return {
      username,
      mood: clientEntry ? clientEntry[1].currentMood : "😊" // Default mood if not set
    };
  });

  // Send to all clients in the room
  clients.forEach(client => {
    if (client.roomId === roomId && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify({
        type: 'participantsUpdate',
        participants: participantsWithMoods
      }));
    }
  });
}

function addMessageToRoom(roomId: string, message: ChatMessage) {
  const room = chatRooms.find(r => r.id === roomId);
  if (!room) return;

  // Add message to room history
  room.messages.push(message);

  // Limit message history to last 100 messages
  if (room.messages.length > 100) {
    room.messages.shift();
  }

  // Broadcast message to all participants
  clients.forEach(client => {
    if (client.roomId === roomId && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify({
        type: 'message',
        message
      }));
    }
  });
}

function broadcastParticipantsMoodUpdate(roomId: string) {
  const room = chatRooms.find(r => r.id === roomId);
  if (!room) return;

  // Get all participants and their moods
  const participantsWithMoods = room.participants.map(username => {
    const clientEntry = Array.from(clients.entries()).find(([_, client]) => client.username === username);
    return {
      username,
      mood: clientEntry ? clientEntry[1].currentMood : undefined
    };
  });

  // Send to all clients in the room
  clients.forEach(client => {
    if (client.roomId === roomId && client.socket.readyState === WebSocket.OPEN) {
      client.socket.send(JSON.stringify({
        type: 'moodUpdate',
        participants: participantsWithMoods
      }));
    }
  });
}

function createRoom(name: string, interests: string[]) {
  const roomId = nanoid();
  chatRooms.push({
    id: roomId,
    name,
    interests,
    messages: [],
    participants: []
  });
  return roomId;
}
