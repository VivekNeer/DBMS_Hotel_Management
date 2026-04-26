import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type BookingDocument } from "@/lib/db/schema";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function serializeBooking(booking: Record<string, unknown>) {
  return {
    ...booking,
    _id:
      booking._id instanceof ObjectId ? booking._id.toHexString() : booking._id,
  };
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid booking id" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const bookingsCollection = db.collection<BookingDocument>(
      COLLECTIONS.bookings,
    );
    const booking = await bookingsCollection.findOne({ _id: new ObjectId(id) });

    if (!booking) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }

    return NextResponse.json(serializeBooking(booking));
  } catch (error) {
    console.error("Error fetching booking:", error);
    return NextResponse.json(
      { error: "Failed to fetch booking" },
      { status: 500 },
    );
  }
}
