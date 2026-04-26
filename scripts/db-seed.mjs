import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "hotel_management";

if (!uri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

const rooms = [
  {
    room_no: 101,
    floor_no: 1,
    room_type: "Single",
    cost_per_day: 120,
    status: "Available",
  },
  {
    room_no: 102,
    floor_no: 1,
    room_type: "Single",
    cost_per_day: 120,
    status: "Available",
  },
  {
    room_no: 103,
    floor_no: 1,
    room_type: "Double",
    cost_per_day: 180,
    status: "Available",
  },
  {
    room_no: 104,
    floor_no: 1,
    room_type: "Double",
    cost_per_day: 180,
    status: "Available",
  },
  {
    room_no: 105,
    floor_no: 1,
    room_type: "Suite",
    cost_per_day: 300,
    status: "Available",
  },
  {
    room_no: 201,
    floor_no: 2,
    room_type: "Single",
    cost_per_day: 130,
    status: "Available",
  },
  {
    room_no: 202,
    floor_no: 2,
    room_type: "Single",
    cost_per_day: 130,
    status: "Available",
  },
  {
    room_no: 203,
    floor_no: 2,
    room_type: "Double",
    cost_per_day: 190,
    status: "Available",
  },
  {
    room_no: 204,
    floor_no: 2,
    room_type: "Double",
    cost_per_day: 190,
    status: "Available",
  },
  {
    room_no: 205,
    floor_no: 2,
    room_type: "Suite",
    cost_per_day: 320,
    status: "Available",
  },
  {
    room_no: 301,
    floor_no: 3,
    room_type: "Single",
    cost_per_day: 140,
    status: "Available",
  },
  {
    room_no: 302,
    floor_no: 3,
    room_type: "Double",
    cost_per_day: 200,
    status: "Available",
  },
  {
    room_no: 303,
    floor_no: 3,
    room_type: "Suite",
    cost_per_day: 350,
    status: "Available",
  },
];

const client = new MongoClient(uri);

try {
  await client.connect();
  const db = client.db(dbName);

  await db.collection("rooms").createIndex({ room_no: 1 }, { unique: true });
  await db.collection("rooms").createIndex({ status: 1, room_type: 1 });

  await db
    .collection("bookings")
    .createIndex({ room_no: 1, check_in_date: 1, check_out_date: 1 });
  await db
    .collection("bookings")
    .createIndex({ guest_email: 1, check_in_date: -1 });

  for (const room of rooms) {
    await db
      .collection("rooms")
      .updateOne({ room_no: room.room_no }, { $set: room }, { upsert: true });
  }

  const roomCount = await db.collection("rooms").countDocuments();
  const bookingCount = await db.collection("bookings").countDocuments();

  console.log("Seed complete");
  console.log("Database:", dbName);
  console.log("Rooms:", roomCount);
  console.log("Bookings:", bookingCount);
} catch (error) {
  console.error("Seeding failed:", error);
  process.exit(1);
} finally {
  await client.close();
}
