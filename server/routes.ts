import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateCaptionRequestSchema } from "@shared/schema";
import { generateCaptions } from "./services/openai";
import multer from "multer";

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Generate captions endpoint
  app.post("/api/captions/generate", upload.single('image'), async (req, res) => {
    try {
      let requestData;
      
      // Handle both form-data and JSON requests
      if (req.file) {
        requestData = {
          description: req.body.description,
          tones: typeof req.body.tones === 'string' ? JSON.parse(req.body.tones) : req.body.tones,
          imageBase64: req.file.buffer.toString('base64')
        };
      } else {
        requestData = req.body;
      }

      const validatedData = generateCaptionRequestSchema.parse(requestData);
      
      const results = await generateCaptions(
        validatedData.description,
        validatedData.tones,
        validatedData.imageBase64
      );

      // Store the caption generation for potential future use
      const savedCaption = await storage.createCaption({
        description: validatedData.description,
        tones: validatedData.tones,
        results
      });

      res.json({
        success: true,
        data: {
          id: savedCaption.id,
          results
        }
      });
    } catch (error) {
      console.error("Caption generation error:", error);
      
      if (error.name === 'ZodError') {
        return res.status(400).json({
          success: false,
          message: "Invalid request data",
          errors: error.errors
        });
      }
      
      res.status(500).json({
        success: false,
        message: error.message || "Failed to generate captions"
      });
    }
  });

  // Get recent captions
  app.get("/api/captions", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const captions = await storage.getUserCaptions(limit);
      
      res.json({
        success: true,
        data: captions
      });
    } catch (error) {
      console.error("Get captions error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve captions"
      });
    }
  });

  // Get specific caption by ID
  app.get("/api/captions/:id", async (req, res) => {
    try {
      const caption = await storage.getCaption(req.params.id);
      
      if (!caption) {
        return res.status(404).json({
          success: false,
          message: "Caption not found"
        });
      }
      
      res.json({
        success: true,
        data: caption
      });
    } catch (error) {
      console.error("Get caption error:", error);
      res.status(500).json({
        success: false,
        message: "Failed to retrieve caption"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
