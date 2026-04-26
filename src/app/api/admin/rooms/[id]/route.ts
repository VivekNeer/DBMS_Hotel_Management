/* eslint-disable @typescript-eslint/no-unused-vars */
import { getDb } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import { COLLECTIONS } from "@/lib/db/schema";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const db = await getDb();
    const roomsCollection = db.collection(COLLECTIONS.rooms);
    
    // ID is room_no in this context
    const result = await roomsCollection.deleteOne({ room_no: Number(id) });
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Room not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Room deleted" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete room" }, { status: 500 });
  }
}
