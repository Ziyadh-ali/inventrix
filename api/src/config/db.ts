import mongoose from 'mongoose';

class Database {
  public async connect(): Promise<void> {
    try {
      const uri = process.env.MONGO_URI as string;
      await mongoose.connect(uri);
      console.log("✅ MongoDB connected successfully");
    } catch (error) {
      console.error("❌ MongoDB connection failed:", error);
      process.exit(1);
    }
  }
}

export const database = new Database();