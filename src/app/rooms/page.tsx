"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";
import { Select } from "@/components/retroui/Select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

// Define a type for our room data for type safety
interface Room {
  room_no: number;
  floor_no: number;
  room_type: string;
  cost_per_day: number;
  status: "Available" | "Occupied" | "Maintenance";
  next_booked_from?: string | null;
}

export default function Rooms() {
  const [roomType, setRoomType] = useState<string>("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchResults, setSearchResults] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (roomType) {
        params.append("roomType", roomType);
      }
      if (dateRange?.from) {
        params.append("from", format(dateRange.from, "yyyy-MM-dd"));
      }
      if (dateRange?.to) {
        params.append("to", format(dateRange.to, "yyyy-MM-dd"));
      }

      const response = await fetch(`/api/rooms?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rooms");
      }
      const data: Room[] = await response.json();
      setSearchResults(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch all available rooms on initial load
  useEffect(() => {
    fetchRooms();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    fetchRooms();
  };

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Full-width Image Banner */}
      <div className="relative w-full h-64 md:h-96">
        <Image
          src="/roooms.jpg"
          alt="Hotel Interior"
          layout="fill"
          objectFit="cover"
          className="w-full h-full"
        />
      </div>

      {/* Search and Filter Section */}
      <div className="container mx-auto px-4 -mt-16 relative z-10">
        <div className="bg-card p-4 rounded-lg border shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Room Type
              </label>
              <Select onValueChange={setRoomType} value={roomType}>
                <Select.Trigger>
                  <Select.Value placeholder="Any Type" />
                </Select.Trigger>
                <Select.Content>
                  <Select.Item value="Single">Single</Select.Item>
                  <Select.Item value="Double">Double</Select.Item>
                  <Select.Item value="Suite">Suite</Select.Item>
                </Select.Content>
              </Select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Check-in / Check-out
              </label>
              <DateRangePicker onDateChange={setDateRange} />
            </div>
            <div className="md:col-span-1">
              <Button
                onClick={handleSearch}
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Searching..." : "Search"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Room Results Section */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-6 text-center">Available Rooms</h2>
        {isLoading ? (
          <p className="text-center">Loading rooms...</p>
        ) : error ? (
          <p className="text-center text-destructive">{error}</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {searchResults.length > 0 ? (
              searchResults.map((room) => (
                <Card key={room.room_no} className="w-full">
                  <Card.Content className="flex flex-col gap-4">
                    <div className="relative w-full h-48 mb-4">
                      <Image
                        src={`/landing.png`} // Placeholder
                        alt={room.room_type}
                        layout="fill"
                        objectFit="cover"
                        className="rounded-lg"
                      />
                    </div>
                    <h3 className="text-2xl font-bold text-card-foreground">
                      {room.room_type} Room
                    </h3>
                    <p className="text-muted-foreground">
                      Floor: {room.floor_no} | Room: {room.room_no}
                    </p>

                    {/* 🔹 Availability Info */}
                    <p className="text-sm text-muted-foreground">
                      {room.next_booked_from
                        ? `Available until ${format(
                            new Date(room.next_booked_from),
                            "dd MMM yyyy"
                          )}`
                        : "Available indefinitely"}
                    </p>

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-xl font-semibold text-primary">
                        ${room.cost_per_day}/day
                      </p>
                      <Button>Book Now</Button>
                    </div>
                  </Card.Content>
                </Card>
              ))
            ) : (
              <p className="col-span-full text-center text-muted-foreground">
                No available rooms match your criteria.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
