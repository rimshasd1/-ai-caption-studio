import { type User, type InsertUser, type Caption, type InsertCaption, users, captions } from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCaption(caption: InsertCaption & { results: any[] }): Promise<Caption>;
  getCaption(id: string): Promise<Caption | undefined>;
  getUserCaptions(limit?: number): Promise<Caption[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async createCaption(captionData: InsertCaption & { results: any[] }): Promise<Caption> {
    const [caption] = await db
      .insert(captions)
      .values({
        description: captionData.description,
        tones: captionData.tones,
        results: captionData.results,
      })
      .returning();
    return caption;
  }

  async getCaption(id: string): Promise<Caption | undefined> {
    const [caption] = await db.select().from(captions).where(eq(captions.id, id));
    return caption || undefined;
  }

  async getUserCaptions(limit: number = 10): Promise<Caption[]> {
    return await db
      .select()
      .from(captions)
      .orderBy(desc(captions.createdAt))
      .limit(limit);
  }
}

// Create a mock storage class for testing without OpenAI API
export class MockStorage implements IStorage {
  private users: Map<string, User>;
  private captions: Map<string, Caption>;

  constructor() {
    this.users = new Map();
    this.captions = new Map();
    this.initializeDummyData();
  }

  private initializeDummyData() {
    // Add some dummy captions for testing
    const dummyCaptions = [
      {
        id: randomUUID(),
        description: "A beautiful sunset over the mountains with golden light",
        tones: ["witty", "poetic", "professional"],
        results: [
          {
            tone: "witty",
            text: "When nature shows off and makes your phone camera cry 📸✨ #SunsetGoals",
            characterCount: 76,
            suggestedHashtags: ["sunset", "mountains", "nature", "photography", "golden"]
          },
          {
            tone: "poetic",
            text: "Golden whispers dance across mountain peaks, painting the sky in hues of dreams and wonder.",
            characterCount: 98,
            suggestedHashtags: ["sunset", "poetry", "nature", "mountains", "beauty"]
          },
          {
            tone: "professional",
            text: "Capturing the perfect golden hour moment in the mountains. Nature's artistry at its finest.",
            characterCount: 99,
            suggestedHashtags: ["photography", "goldenhour", "landscape", "mountains", "professional"]
          }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 10) // 10 minutes ago
      },
      {
        id: randomUUID(),
        description: "Coffee shop scene with laptop and morning light",
        tones: ["casual", "professional"],
        results: [
          {
            tone: "casual",
            text: "Monday mood: coffee, laptop, and that perfect morning light streaming in ☕💻",
            characterCount: 82,
            suggestedHashtags: ["coffee", "morning", "worklife", "cafe", "monday"]
          },
          {
            tone: "professional",
            text: "Starting the day right with focus, caffeine, and optimal lighting for productivity.",
            characterCount: 86,
            suggestedHashtags: ["productivity", "workspace", "morning", "focus", "business"]
          }
        ],
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
      }
    ];

    dummyCaptions.forEach(caption => {
      this.captions.set(caption.id, caption);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createCaption(captionData: InsertCaption & { results: any[] }): Promise<Caption> {
    const id = randomUUID();
    
    // Generate mock results based on the requested tones
    const mockResults = captionData.tones.map(tone => {
      const examples = {
        witty: [
          "When your content is so good, even you're impressed 😎 #ContentCreator",
          "Plot twist: this wasn't even planned but here we are looking fabulous ✨",
          "That moment when everything just clicks (literally and figuratively) 📸"
        ],
        poetic: [
          "In quiet moments, beauty reveals itself in the simplest of things.",
          "Light dances through ordinary spaces, transforming them into something magical.",
          "Every frame tells a story, every shadow holds a secret waiting to be discovered."
        ],
        professional: [
          "Capturing authentic moments that resonate with our brand values and vision.",
          "Strategic content creation focused on engagement and meaningful connections.",
          "Professional photography that elevates brand storytelling and visual impact."
        ],
        casual: [
          "Just another day doing what I love and sharing it with you all! 💙",
          "Real moments, real vibes, real life happening right here ✌️",
          "Sometimes the best content comes from just being yourself 🌟"
        ]
      };

      const toneExamples = examples[tone as keyof typeof examples] || examples.casual;
      const randomExample = toneExamples[Math.floor(Math.random() * toneExamples.length)];
      
      return {
        tone,
        text: randomExample,
        characterCount: randomExample.length,
        suggestedHashtags: this.generateHashtags(tone, captionData.description)
      };
    });

    const caption: Caption = {
      id,
      description: captionData.description,
      tones: captionData.tones,
      results: mockResults,
      createdAt: new Date(),
    };
    
    this.captions.set(id, caption);
    return caption;
  }

  private generateHashtags(tone: string, description: string): string[] {
    const baseHashtags = ["content", "creative", "inspiration", "lifestyle"];
    const toneHashtags = {
      witty: ["funny", "humor", "clever", "witty"],
      poetic: ["poetry", "artistic", "beauty", "mindful"],
      professional: ["business", "professional", "brand", "quality"],
      casual: ["authentic", "real", "everyday", "relatable"]
    };

    const descriptionHashtags = description.toLowerCase().includes('sunset') ? ["sunset", "nature"] :
                               description.toLowerCase().includes('coffee') ? ["coffee", "morning"] :
                               description.toLowerCase().includes('photo') ? ["photography", "capture"] :
                               ["moment", "life"];

    return [...baseHashtags, ...(toneHashtags[tone as keyof typeof toneHashtags] || []), ...descriptionHashtags].slice(0, 5);
  }

  async getCaption(id: string): Promise<Caption | undefined> {
    return this.captions.get(id);
  }

  async getUserCaptions(limit: number = 10): Promise<Caption[]> {
    return Array.from(this.captions.values())
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0))
      .slice(0, limit);
  }
}

// Use MockStorage for now to demonstrate functionality
export const storage = new MockStorage();
