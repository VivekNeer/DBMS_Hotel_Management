import { ObjectId } from "mongodb";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import {
  COLLECTIONS,
  type BookingDocument,
  type RoomDocument,
  type RoomType,
  ROOM_TYPES,
} from "@/lib/db/schema";

interface CreateBookingPayload {
  name: string;
  email: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomType: RoomType;
}

function serializeBooking(booking: Record<string, unknown>) {
  return {
    ...booking,
    _id:
      booking._id instanceof ObjectId ? booking._id.toHexString() : booking._id,
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const email = searchParams.get("email");
    const roomNo = searchParams.get("roomNo");

    const db = await getDb();
    const bookingsCollection = db.collection<BookingDocument>(
      COLLECTIONS.bookings,
    );

    const filter: Record<string, unknown> = {};
    if (email) filter.guest_email = email;
    if (roomNo) {
      const parsed = Number(roomNo);
      if (Number.isNaN(parsed)) {
        return NextResponse.json({ error: "Invalid roomNo" }, { status: 400 });
      }
      filter.room_no = parsed;
    }

    const bookings = await bookingsCollection
      .find(filter)
      .sort({ check_in_date: -1 })
      .toArray();

    return NextResponse.json(
      bookings.map((booking) => serializeBooking(booking)),
    );
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return NextResponse.json(
      { error: "Failed to fetch bookings" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as Partial<CreateBookingPayload>;
    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const roomType = body.roomType;
    const guests = Number(body.guests);
    const checkIn = body.checkIn ? new Date(body.checkIn) : null;
    const checkOut = body.checkOut ? new Date(body.checkOut) : null;

    if (
      !name ||
      !email ||
      !roomType ||
      !checkIn ||
      !checkOut ||
      Number.isNaN(guests)
    ) {
      return NextResponse.json(
        { error: "Missing required booking fields" },
        { status: 400 },
      );
    }

    if (!ROOM_TYPES.includes(roomType)) {
      return NextResponse.json({ error: "Invalid room type" }, { status: 400 });
    }

    if (Number.isNaN(checkIn.getTime()) || Number.isNaN(checkOut.getTime())) {
      return NextResponse.json(
        { error: "Invalid check-in/check-out date" },
        { status: 400 },
      );
    }

    if (checkOut <= checkIn) {
      return NextResponse.json(
        { error: "Check-out must be after check-in" },
        { status: 400 },
      );
    }

    if (guests < 1 || guests > 10) {
      return NextResponse.json(
        { error: "Guests must be between 1 and 10" },
        { status: 400 },
      );
    }

    const db = await getDb();
    const roomsCollection = db.collection<RoomDocument>(COLLECTIONS.rooms);
    const bookingsCollection = db.collection<BookingDocument>(
      COLLECTIONS.bookings,
    );

    const candidateRooms = await roomsCollection
      .find({
        room_type: roomType,
        status: "Available",
      })
      .sort({ room_no: 1 })
      .toArray();

    if (candidateRooms.length === 0) {
      return NextResponse.json(
        { error: "No rooms available for selected room type" },
        { status: 409 },
      );
    }

    const roomNos = candidateRooms.map((room) => room.room_no);
    const overlaps = await bookingsCollection
      .find({
        room_no: { $in: roomNos },
        check_in_date: { $lt: checkOut },
        check_out_date: { $gt: checkIn },
      })
      .project({ room_no: 1 })
      .toArray();

    const unavailable = new Set(overlaps.map((item) => item.room_no));
    const assignedRoom = candidateRooms.find(
      (room) => !unavailable.has(room.room_no),
    );

    if (!assignedRoom) {
      return NextResponse.json(
        { error: "No available rooms in selected date range" },
        { status: 409 },
      );
    }

    const booking: BookingDocument = {
      room_no: assignedRoom.room_no,
      room_type: assignedRoom.room_type,
      guest_name: name,
      guest_email: email,
      guests,
      check_in_date: checkIn,
      check_out_date: checkOut,
      created_at: new Date(),
    };

    const result = await bookingsCollection.insertOne(booking);

    return NextResponse.json(
      {
        bookingId: result.insertedId.toHexString(),
        roomNo: assignedRoom.room_no,
        roomType: assignedRoom.room_type,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Failed to create booking" },
      { status: 500 },
    );
  }
}
