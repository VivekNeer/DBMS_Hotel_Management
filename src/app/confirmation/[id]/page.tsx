import { ObjectId } from "mongodb";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type BookingDocument } from "@/lib/db/schema";

interface ConfirmationPageProps {
  params: Promise<{ id: string }>;
}

export default async function ConfirmationPage({
  params,
}: ConfirmationPageProps) {
  const { id } = await params;
  const isValidObjectId = ObjectId.isValid(id);

  if (!isValidObjectId) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold">Invalid Confirmation ID</h1>
        <p className="mt-3 text-muted-foreground">
          The booking reference provided is not valid.
        </p>
      </main>
    );
  }

  const db = await getDb();
  const booking = await db
    .collection<BookingDocument>(COLLECTIONS.bookings)
    .findOne({ _id: new ObjectId(id) });

  if (!booking) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
        <h1 className="text-3xl font-bold">Booking Not Found</h1>
        <p className="mt-3 text-muted-foreground">
          No booking exists for confirmation ID: {id}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">Booking Confirmed</h1>
      <p className="mt-3 text-muted-foreground">Confirmation ID: {id}</p>
      <div className="mt-8 rounded border p-6">
        <h2 className="text-xl font-semibold">Booking Details</h2>
        <p className="mt-3 text-muted-foreground">
          Guest: {booking.guest_name}
        </p>
        <p className="text-muted-foreground">Email: {booking.guest_email}</p>
        <p className="text-muted-foreground">Room Type: {booking.room_type}</p>
        <p className="text-muted-foreground">Room Number: {booking.room_no}</p>
        <p className="text-muted-foreground">Guests: {booking.guests}</p>
        <p className="text-muted-foreground">
          Check-in: {new Date(booking.check_in_date).toLocaleDateString()}
        </p>
        <p className="text-muted-foreground">
          Check-out: {new Date(booking.check_out_date).toLocaleDateString()}
        </p>
      </div>
    </main>
  );
}
