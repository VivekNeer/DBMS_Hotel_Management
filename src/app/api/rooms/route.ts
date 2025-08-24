import mysql2 from "mysql2/promise";
import { GetDBSettings } from "@/app/sharedCode/common";
import { NextResponse, NextRequest } from "next/server";

const connectionParams = GetDBSettings();

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const roomType = searchParams.get("roomType");
  const fromDate = searchParams.get("from");
  const toDate = searchParams.get("to");

  let query = `
  SELECT 
    r.room_no,
    r.floor_no,
    r.room_type,
    r.cost_per_day,
    r.status,
    MIN(b.check_in_date) AS next_booked_from
  FROM Rooms r
  LEFT JOIN Bookings b 
    ON r.room_no = b.room_no 
    AND b.check_in_date > CURDATE()
  WHERE r.status = 'Available'
`;
  const queryParams: (string | null)[] = [];

  // Room type filter
  if (roomType) {
    query += " AND r.room_type = ?";
    queryParams.push(roomType);
  }

  // If searching with from/to range, exclude overlapping bookings
  if (fromDate && toDate) {
    query += `
    AND NOT EXISTS (
      SELECT 1 FROM Bookings b2
      WHERE b2.room_no = r.room_no
      AND b2.check_in_date < ? 
      AND b2.check_out_date > ?
    )
  `;
    queryParams.push(toDate, fromDate);
  }

  // Group by room so MIN works
  query += `
  GROUP BY r.room_no, r.floor_no, r.room_type, r.cost_per_day, r.status
`;

  try {
    const connection = await mysql2.createConnection(connectionParams);
    const [rows] = await connection.execute(query, queryParams);
    await connection.end();
    return NextResponse.json(rows);
  } catch (error) {
    console.error("Error fetching rooms:", error);
    return NextResponse.json(
      { error: "Failed to fetch rooms" },
      { status: 500 }
    );
  }
}
