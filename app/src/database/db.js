import { MongoClient } from "mongodb";
import pino from "pino";

const log = pino({ level: process.env.LOG_LEVEL || "info" });
let db;

export async function connectDB() {
  const client = new MongoClient(process.env.MONGO_URL || "mongodb://mongo:27017");
  await client.connect();
  db = client.db(process.env.MONGO_DB || "iot");
  log.info("Connected to MongoDB");
  return db;
}

export function getDB() {
  if (!db) throw new Error("MongoDB not initialized, call connectDB() first");
  return db;
}
