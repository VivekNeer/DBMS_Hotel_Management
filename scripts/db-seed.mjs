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

const seedTag = "demo-showcase-2026-04-26";

const bookings = [
  {
    room_no: 101,
    room_type: "Single",
    guest_name: "Aarav Sharma",
    guest_email: "aarav@example.com",
    guests: 1,
    check_in_date: new Date("2026-04-25T12:00:00.000Z"),
    check_out_date: new Date("2026-04-27T10:00:00.000Z"),
    created_at: new Date("2026-04-20T08:00:00.000Z"),
    seed_tag: seedTag,
  },
  {
    room_no: 102,
    room_type: "Single",
    guest_name: "Meera Nair",
    guest_email: "meera@example.com",
    guests: 1,
    check_in_date: new Date("2026-04-26T12:00:00.000Z"),
    check_out_date: new Date("2026-04-28T10:00:00.000Z"),
    created_at: new Date("2026-04-21T09:15:00.000Z"),
    seed_tag: seedTag,
  },
  {
    room_no: 103,
    room_type: "Double",
    guest_name: "Rohan Gupta",
    guest_email: "rohan@example.com",
    guests: 2,
    check_in_date: new Date("2026-04-27T13:00:00.000Z"),
    check_out_date: new Date("2026-04-30T10:00:00.000Z"),
    created_at: new Date("2026-04-22T10:30:00.000Z"),
    seed_tag: seedTag,
  },
  {
    room_no: 104,
    room_type: "Double",
    guest_name: "Priya Singh",
    guest_email: "priya@example.com",
    guests: 2,
    check_in_date: new Date("2026-04-28T12:30:00.000Z"),
    check_out_date: new Date("2026-05-01T10:00:00.000Z"),
    created_at: new Date("2026-04-22T14:00:00.000Z"),
    seed_tag: seedTag,
  },
  {
    room_no: 105,
    room_type: "Suite",
    guest_name: "Ishaan Kapoor",
    guest_email: "ishaan@example.com",
    guests: 3,
    check_in_date: new Date("2026-04-27T12:00:00.000Z"),
    check_out_date: new Date("2026-04-29T10:00:00.000Z"),
    created_at: new Date("2026-04-23T11:45:00.000Z"),
    seed_tag: seedTag,
  },
  {
    room_no: 201,
    room_type: "Single",
    guest_name: "Ananya Rao",
    guest_email: "ananya@example.com",
    guests: 1,
    check_in_date: new Date("2026-04-24T12:00:00.000Z"),
    check_out_date: new Date("2026-04-26T10:00:00.000Z"),
    created_at: new Date("2026-04-18T16:00:00.000Z"),
    seed_tag: seedTag,
  },
  {
    room_no: 203,
    room_type: "Double",
    guest_name: "Kabir Malhotra",
    guest_email: "kabir@example.com",
    guests: 2,
    check_in_date: new Date("2026-04-30T12:00:00.000Z"),
    check_out_date: new Date("2026-05-03T10:00:00.000Z"),
    created_at: new Date("2026-04-24T12:00:00.000Z"),
    seed_tag: seedTag,
  },
  {
    room_no: 205,
    room_type: "Suite",
    guest_name: "Nisha Verma",
    guest_email: "nisha@example.com",
    guests: 4,
    check_in_date: new Date("2026-05-01T12:00:00.000Z"),
    check_out_date: new Date("2026-05-04T10:00:00.000Z"),
    created_at: new Date("2026-04-24T15:40:00.000Z"),
    seed_tag: seedTag,
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

  await db.collection("bookings").deleteMany({ seed_tag: seedTag });
  await db.collection("bookings").insertMany(bookings);

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
