import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import OpenAI from "openai";

// Initialize OpenAI client with Groq configuration
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  
  app.get(api.chat.history.path, async (req, res) => {
    const messages = await storage.getMessages();
    res.json(messages);
  });

  app.post(api.chat.clear.path, async (req, res) => {
    await storage.clearMessages();
    res.status(204).send();
  });

  app.post(api.chat.send.path, async (req, res) => {
    try {
      const { message } = api.chat.send.input.parse(req.body);

      // Save user message
      await storage.createMessage({
        role: "user",
        content: message,
      });

      // Get history for context
      const history = await storage.getMessages();
      const messagesForAi = history.map(msg => ({
        role: msg.role as "user" | "assistant" | "system",
        content: msg.content
      }));

      // Call Groq API
      const completion = await openai.chat.completions.create({
        messages: [
          { role: "system", content: "You are a helpful and knowledgeable AI assistant focused on stocks, finance, and market analysis. Provide concise, accurate, and insightful answers. If you don't know something, admit it. Do not provide financial advice as professional advice, but as informational content." },
          ...messagesForAi
        ],
        model: "llama3-8b-8192", // Common efficient model on Groq
      });

      const aiResponseContent = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";

      // Save AI response
      const aiMessage = await storage.createMessage({
        role: "assistant",
        content: aiResponseContent,
      });

      res.json(aiMessage);
    } catch (error) {
      console.error("AI Error:", error);
      res.status(500).json({ message: "Failed to process chat request" });
    }
  });

  return httpServer;
}
