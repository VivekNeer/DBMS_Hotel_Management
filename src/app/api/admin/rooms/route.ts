/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import { getDb } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { COLLECTIONS, type RoomDocument } from "@/lib/db/schema";
import { ObjectId } from "mongodb";

export async function GET() {
  try {
    const db = await getDb();
    const roomsCollection = db.collection<RoomDocument>(COLLECTIONS.rooms);
    const rooms = await roomsCollection.find({}).sort({ room_no: 1 }).toArray();
    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch rooms" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const db = await getDb();
    const roomsCollection = db.collection<RoomDocument>(COLLECTIONS.rooms);
    
    // Convert room_no and floor_no to numbers
    const room = {
      room_no: Number(payload.room_no),
      floor_no: Number(payload.floor_no),
      room_type: payload.room_type,
      cost_per_day: Number(payload.cost_per_day),
      status: payload.status,
    };

    const existingRoom = await roomsCollection.findOne({ room_no: room.room_no });
    if (existingRoom) {
      return NextResponse.json({ error: "Room number already exists" }, { status: 400 });
    }

    const result = await roomsCollection.insertOne(room as any);
    return NextResponse.json({ message: "Room added", id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to add room" }, { status: 500 });
  }
}
