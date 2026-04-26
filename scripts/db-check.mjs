import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "hotel_management";

if (!uri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);
  const ping = await db.command({ ping: 1 });

  console.log("MongoDB connection: OK");
  console.log("Database:", dbName);
  console.log("Ping:", ping.ok);
} catch (error) {
  console.error("MongoDB connection failed:", error);
  process.exit(1);
} finally {
  await client.close();
}
