import type { Express } from "express";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { ZodError } from "zod";

interface ChatClient extends WebSocket {
  userId?: string;
  username?: string;
  room?: string;
}

interface ChatRoom {
  id: string;
  name: string;
  location: string;
  topic: string;
  participants: Map<string, ChatClient>;
}

const chatRooms = new Map<string, ChatRoom>();

function broadcastToRoom(room: ChatRoom, message: any, excludeClient?: ChatClient) {
  room.participants.forEach((client) => {
    if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(message));
    }
  });
}

export async function registerRoutes(app: Express) {
  const server = createServer(app);

  // Create WebSocket server
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: ChatClient) => {
    console.log('New client connected');

    ws.on('message', (data: string) => {
      try {
        const message = JSON.parse(data);

        switch (message.type) {
          case 'join':
            // Join room logic
            const { roomId, username } = message;
            ws.userId = Math.random().toString(36).substring(7);
            ws.username = username;
            ws.room = roomId;

            let room = chatRooms.get(roomId);
            if (!room) {
              room = {
                id: roomId,
                name: `Room ${roomId}`,
                location: message.location || 'Unknown',
                topic: message.topic || 'General Discussion',
                participants: new Map()
              };
              chatRooms.set(roomId, room);
            }

            room.participants.set(ws.userId, ws);

            // Notify others about new participant
            broadcastToRoom(room, {
              type: 'userJoined',
              userId: ws.userId,
              username: ws.username
            });

            // Send room info to new participant
            ws.send(JSON.stringify({
              type: 'roomInfo',
              room: {
                id: room.id,
                name: room.name,
                location: room.location,
                topic: room.topic,
                participants: Array.from(room.participants.values()).map(p => ({
                  id: p.userId,
                  username: p.username
                }))
              }
            }));
            break;

          case 'message':
            if (ws.room) {
              const room = chatRooms.get(ws.room);
              if (room) {
                broadcastToRoom(room, {
                  type: 'message',
                  userId: ws.userId,
                  username: ws.username,
                  content: message.content,
                  timestamp: new Date().toISOString()
                });
              }
            }
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (ws.room && ws.userId) {
        const room = chatRooms.get(ws.room);
        if (room) {
          room.participants.delete(ws.userId);
          broadcastToRoom(room, {
            type: 'userLeft',
            userId: ws.userId,
            username: ws.username
          });
        }
      }
    });
  });

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

  return server;
}