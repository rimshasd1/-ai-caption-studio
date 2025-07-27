import { type User, type InsertUser, type Caption, type InsertCaption } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createCaption(caption: InsertCaption & { results: any[] }): Promise<Caption>;
  getCaption(id: string): Promise<Caption | undefined>;
  getUserCaptions(limit?: number): Promise<Caption[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private captions: Map<string, Caption>;

  constructor() {
    this.users = new Map();
    this.captions = new Map();
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
    const caption: Caption = {
      id,
      description: captionData.description,
      tones: captionData.tones,
      results: captionData.results,
      createdAt: new Date(),
    };
    this.captions.set(id, caption);
    return caption;
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

export const storage = new MemStorage();
