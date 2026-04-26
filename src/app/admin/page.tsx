/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [rooms, setRooms] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newRoom, setNewRoom] = useState({
    room_no: "",
    floor_no: "",
    room_type: "Single",
    cost_per_day: "",
    status: "Available"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const auth = localStorage.getItem("admin_auth");
      if (auth === "true") {
        setIsAuthenticated(true);
        fetchRooms();
      }
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "admin") {
      localStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      fetchRooms();
    } else {
      alert("Invalid credentials");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  const fetchRooms = async () => {
    try {
      const res = await fetch("/api/admin/rooms");
      const data = await res.json();
      if (Array.isArray(data)) {
        setRooms(data);
      }
    } catch (err) {
      console.error("Failed to fetch rooms");
    }
  };

  const handleAddRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRoom),
      });
      if (res.ok) {
        setIsAdding(false);
        setNewRoom({ room_no: "", floor_no: "", room_type: "Single", cost_per_day: "", status: "Available" });
        fetchRooms();
      } else {
        const error = await res.json();
        alert(error.error || "Failed to add room");
      }
    } catch (err) {
      console.error("Failed to add room");
    }
  };

  const handleRemoveRoom = async (roomNo: number) => {
    if (!confirm(`Are you sure you want to remove room ${roomNo}?`)) return;
    try {
      const res = await fetch(`/api/admin/rooms/${roomNo}`, { method: "DELETE" });
      if (res.ok) {
        fetchRooms();
      } else {
        alert("Failed to remove room");
      }
    } catch (err) {
      console.error("Failed to remove room");
    }
  };

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm border p-6 rounded shadow space-y-4">
          <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
          <div>
            <label className="block mb-1">Username</label>
            <input 
              className="w-full border px-3 py-2 rounded text-black bg-white" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              required
            />
          </div>
          <div>
            <label className="block mb-1">Password</label>
            <input 
              type="password" 
              className="w-full border px-3 py-2 rounded text-black bg-white" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 rounded">
            Login
          </button>
        </form>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-8 max-w-5xl mx-auto mt-16">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-600 text-white px-4 py-2 rounded font-semibold">
          Logout
        </button>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Manage Rooms</h2>
        <button 
          onClick={() => setIsAdding(!isAdding)} 
          className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
        >
          {isAdding ? "Cancel" : "+ Add Room"}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAddRoom} className="mb-8 border p-6 rounded shadow space-y-4">
          <h3 className="text-xl font-semibold">Add New Room</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1">Room No.</label>
              <input type="number" required className="w-full border px-3 py-2 rounded text-black bg-white" value={newRoom.room_no} onChange={(e) => setNewRoom({...newRoom, room_no: e.target.value})} />
            </div>
            <div>
              <label className="block mb-1">Floor No.</label>
              <input type="number" required className="w-full border px-3 py-2 rounded text-black bg-white" value={newRoom.floor_no} onChange={(e) => setNewRoom({...newRoom, floor_no: e.target.value})} />
            </div>
            <div>
              <label className="block mb-1">Cost Per Day</label>
              <input type="number" required className="w-full border px-3 py-2 rounded text-black bg-white" value={newRoom.cost_per_day} onChange={(e) => setNewRoom({...newRoom, cost_per_day: e.target.value})} />
            </div>
            <div>
              <label className="block mb-1">Room Type</label>
              <select required className="w-full border px-3 py-2 rounded text-black bg-white" value={newRoom.room_type} onChange={(e) => setNewRoom({...newRoom, room_type: e.target.value})}>
                <option value="Single">Single</option>
                <option value="Double">Double</option>
                <option value="Suite">Suite</option>
              </select>
            </div>
            <div>
              <label className="block mb-1">Status</label>
              <select required className="w-full border px-3 py-2 rounded text-black bg-white" value={newRoom.status} onChange={(e) => setNewRoom({...newRoom, status: e.target.value})}>
                <option value="Available">Available</option>
                <option value="Occupied">Occupied</option>
                <option value="Maintenance">Maintenance</option>
              </select>
            </div>
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-semibold">
            Save Room
          </button>
        </form>
      )}

      <div className="overflow-x-auto border rounded shadow">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 border-b">Room No.</th>
              <th className="p-3 border-b">Floor</th>
              <th className="p-3 border-b">Type</th>
              <th className="p-3 border-b">Cost/Day</th>
              <th className="p-3 border-b">Status</th>
              <th className="p-3 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-3 text-center text-muted-foreground">No rooms found.</td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room._id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-3 border-b">{room.room_no}</td>
                  <td className="p-3 border-b">{room.floor_no}</td>
                  <td className="p-3 border-b">{room.room_type}</td>
                  <td className="p-3 border-b">${room.cost_per_day}</td>
                  <td className="p-3 border-b">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${room.status === 'Available' ? 'bg-green-100 text-green-800' : room.status === 'Maintenance' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                      {room.status}
                    </span>
                  </td>
                  <td className="p-3 border-b">
                    <button onClick={() => handleRemoveRoom(room.room_no)} className="text-red-600 hover:text-red-800 font-semibold text-sm">
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
