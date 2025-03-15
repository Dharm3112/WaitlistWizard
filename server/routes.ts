import type { Express } from "express";
import { createServer } from "http";
import { storage } from "./storage";
import { insertWaitlistSchema } from "@shared/schema";
import { ZodError } from "zod";

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

  return createServer(app);
}
