import mongoose from 'mongoose';

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export default async function connectDB() {
  if (cached.conn) {
    console.log("⚡ Using cached DB connection");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🟡 Attempting to connect to MongoDB...");
    console.log("🔧 MONGODB_URI:", process.env.MONGODB_URI); // This should print
    cached.promise = mongoose.connect(process.env.MONGODB_URI).then((mongoose) => mongoose);
  }

  try {
    cached.conn = await cached.promise;
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }

  return cached.conn;
}
