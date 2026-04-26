import { NextResponse } from "next/server";

export async function GET() {
  const results = {
    message: "Hello from the API route!",
  };
  return NextResponse.json(results);
}
