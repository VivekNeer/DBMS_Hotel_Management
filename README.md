# DBMS Hotel Management

Next.js hotel management app with API routes migrated to MongoDB.

## Prerequisites

- Node.js 20+
- npm 10+
- A MongoDB instance (Atlas or local)

## Install

```bash
npm install
```

## Environment Variables

Create a `.env` file in the project root (or copy from `.env.example`) and set:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-url>/?retryWrites=true&w=majority&appName=<app-name>
MONGODB_DB=hotel_management
```

### Where do these values come from?

1. `MONGODB_URI`
   - MongoDB Atlas: Go to Atlas -> Database -> Connect -> Drivers.
   - Copy the connection string and replace `<username>`, `<password>`, and `<cluster-url>`.
   - If your password has special characters, URL-encode it.

2. `MONGODB_DB`
   - This is the database name used by this app.
   - You can keep `hotel_management` or choose another name.

### Atlas checklist (important)

1. Create a database user with read/write access.
2. Add your current IP in Network Access (or allow `0.0.0.0/0` only for temporary testing).
3. Use that user in your `MONGODB_URI`.

## Run Locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## Build & Validation

```bash
npm run lint
npm run build
```

## Database Helpers

```bash
npm run db:check
npm run db:seed
```

## Current MongoDB-backed Endpoints

- `GET /api/rooms`
- `GET /api/bookings`
- `GET /api/bookings/:id`
- `POST /api/bookings`

## Recommended Initial Collections

Use these collection names:

- `rooms`
- `bookings`

Suggested fields:

- `rooms`: `room_no`, `floor_no`, `room_type`, `cost_per_day`, `status`
- `bookings`: `room_no`, `guest_name`, `guest_email`, `check_in_date`, `check_out_date`

Suggested indexes:

```js
db.rooms.createIndex({ room_no: 1 }, { unique: true });
db.rooms.createIndex({ status: 1, room_type: 1 });

db.bookings.createIndex({ room_no: 1, check_in_date: 1, check_out_date: 1 });
db.bookings.createIndex({ guest_email: 1, check_in_date: -1 });
```

## Notes

- The app throws `Missing MONGODB_URI environment variable` when DB-backed API routes are called without `MONGODB_URI`.
- Keep `.env` out of git; do not commit secrets.
