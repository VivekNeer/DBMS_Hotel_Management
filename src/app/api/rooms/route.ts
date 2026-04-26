import { getDb } from "@/lib/mongodb";
import { NextResponse, NextRequest } from "next/server";
import {
  COLLECTIONS,
  type BookingDocument,
  type RoomDocument,
} from "@/lib/db/schema";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const roomType = searchParams.get("roomType");
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  try {
    const db = await getDb();
    const roomsCollection = db.collection<RoomDocument>(COLLECTIONS.rooms);
    const bookingsCollection = db.collection<BookingDocument>(
      COLLECTIONS.bookings,
    );

    const roomFilter: Record<string, unknown> = { status: "Available" };
    if (roomType) {
      roomFilter.room_type = roomType;
    }

    const rooms = await roomsCollection
      .find(roomFilter)
      .sort({ room_no: 1 })
      .toArray();

    if (rooms.length === 0) {
      return NextResponse.json([]);
    }

    let availableRooms = rooms;
    const roomNos = rooms.map((room) => room.room_no);

    if (fromDate && toDate) {
      const from = new Date(fromDate);
      const to = new Date(toDate);

      if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) {
        return NextResponse.json(
          { error: "Invalid date range" },
          { status: 400 },
        );
      }

      const overlappingBookings = await bookingsCollection
        .find({
          room_no: { $in: roomNos },
          check_in_date: { $lt: to },
          check_out_date: { $gt: from },
        })
        .project({ room_no: 1 })
        .toArray();

      const unavailableRoomNos = new Set(
        overlappingBookings.map((booking) => booking.room_no),
      );

      availableRooms = rooms.filter(
        (room) => !unavailableRoomNos.has(room.room_no),
      );
    }

    if (availableRooms.length === 0) {
      return NextResponse.json([]);
    }

    const nextBookings = await bookingsCollection
      .aggregate<{ _id: number; next_booked_from: Date }>([
        {
          $match: {
            room_no: { $in: availableRooms.map((room) => room.room_no) },
            check_in_date: { $gt: new Date() },
          },
        },
        {
          $group: {
            _id: "$room_no",
            next_booked_from: { $min: "$check_in_date" },
          },
        },
      ])
      .toArray();

    const nextBookingByRoom = new Map(
      nextBookings.map((item) => [item._id, item.next_booked_from]),
    );

    const response = availableRooms.map((room) => ({
      room_no: room.room_no,
      floor_no: room.floor_no,
      room_type: room.room_type,
      cost_per_day: room.cost_per_day,
      status: room.status,
      next_booked_from: nextBookingByRoom.get(room.room_no) ?? null,
    }));

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 },
    );
  }
}
