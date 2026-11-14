import "server-only";
import mongoose from "mongoose";

const globalForMongo = globalThis;

function getMongoCache() {
  if (!globalForMongo.campusMongoose) {
    globalForMongo.campusMongoose = { connection: null, promise: null };
  }
  return globalForMongo.campusMongoose;
}

async function connectMongo() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured.");

  const cache = getMongoCache();
  if (cache.connection?.connection.readyState === 1) return cache.connection;

  if (!cache.promise) {
    cache.promise = mongoose.connect(uri, {
      bufferCommands: false,
      dbName: process.env.MONGODB_DB || undefined,
      serverSelectionTimeoutMS: 5000,
    }).catch((error) => {
      cache.promise = null;
      throw error;
    });
  }

  cache.connection = await cache.promise;
  return cache.connection;
}

export default connectMongo;

// Driver APIs use the native MongoDB collection interface on this same connection.
export async function getDatabase() {
  await connectMongo();
  const database = mongoose.connection.db;
  if (!database) throw new Error("MongoDB connection is not ready.");
  return database;
}
