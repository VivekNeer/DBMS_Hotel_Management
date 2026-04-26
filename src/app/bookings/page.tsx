"use client";

import { useMemo, useState } from "react";

interface Booking {
  _id: string;
  room_no: number;
  room_type: string;
  guest_name: string;
  guest_email: string;
  guests: number;
  check_in_date: string;
  check_out_date: string;
  created_at: string;
}

export default function BookingsPage() {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async (fetchAll = false) => {
    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (!fetchAll && email.trim()) {
        params.set("email", email.trim().toLowerCase());
      }

      const query = params.toString();
      const response = await fetch(`/api/bookings${query ? `?${query}` : ""}`);
      if (!response.ok) {
        throw new Error("Failed to fetch bookings");
      }

      const data = (await response.json()) as Booking[];
      setBookings(data);
    } catch (fetchError: unknown) {
      const message =
        fetchError instanceof Error
          ? fetchError.message
          : "Failed to fetch bookings";
      setError(message);
      setBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  const bookingSummary = useMemo(() => {
    const now = new Date();
    let upcoming = 0;
    let active = 0;
    let completed = 0;

    for (const booking of bookings) {
      const checkIn = new Date(booking.check_in_date);
      const checkOut = new Date(booking.check_out_date);

      if (checkIn > now) upcoming += 1;
      else if (checkOut < now) completed += 1;
      else active += 1;
    }

    return { total: bookings.length, upcoming, active, completed };
  }, [bookings]);

  return (
    <main className="mx-auto min-h-screen w-full max-w-6xl px-6 py-16">
      <h1 className="text-3xl font-bold">My Bookings</h1>
      <p className="mt-3 text-muted-foreground">
        Search by guest email or load all bookings for demo/review.
      </p>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="guest@example.com"
          className="w-full rounded border px-3 py-2 md:max-w-sm"
        />
        <button
          onClick={() => fetchBookings(false)}
          disabled={isLoading}
          className="rounded bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"
        >
          {isLoading ? "Loading..." : "Search"}
        </button>
        <button
          onClick={() => fetchBookings(true)}
          disabled={isLoading}
          className="rounded border px-4 py-2 font-medium disabled:opacity-60"
        >
          Load All
        </button>
      </div>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded border p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="mt-1 text-2xl font-bold">{bookingSummary.total}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-xs text-muted-foreground">Upcoming</p>
          <p className="mt-1 text-2xl font-bold">{bookingSummary.upcoming}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-xs text-muted-foreground">Active</p>
          <p className="mt-1 text-2xl font-bold">{bookingSummary.active}</p>
        </div>
        <div className="rounded border p-4">
          <p className="text-xs text-muted-foreground">Completed</p>
          <p className="mt-1 text-2xl font-bold">{bookingSummary.completed}</p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded border">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-3">Booking ID</th>
              <th className="px-4 py-3">Guest</th>
              <th className="px-4 py-3">Room</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-muted-foreground" colSpan={5}>
                  No bookings to display.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => {
                const checkIn = new Date(booking.check_in_date);
                const checkOut = new Date(booking.check_out_date);
                const now = new Date();

                const status =
                  checkIn > now
                    ? "Upcoming"
                    : checkOut < now
                      ? "Completed"
                      : "Active";

                return (
                  <tr key={booking._id} className="border-t">
                    <td className="px-4 py-3 font-mono text-xs">{booking._id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{booking.guest_name}</p>
                      <p className="text-xs text-muted-foreground">
                        {booking.guest_email}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {booking.room_type} #{booking.room_no}
                    </td>
                    <td className="px-4 py-3">
                      {checkIn.toLocaleDateString()} - {checkOut.toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">{status}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}

