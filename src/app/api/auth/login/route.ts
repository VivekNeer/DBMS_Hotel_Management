import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type UserDocument } from "@/lib/db/schema";
import { loginSchema } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = loginSchema.safeParse(payload);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid request";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const normalizedEmail = parsed.data.email.trim().toLowerCase();

    const db = await getDb();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.users);
    const user = await usersCollection.findOne({ email: normalizedEmail });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const isPasswordValid = await verifyPassword(
      parsed.data.password,
      user.password_hash,
    );

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        name: user.name,
        email: user.email,
      },
    });

    response.cookies.set("hotel_user", user.email, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24,
    });

    return response;
  } catch (error) {
    console.error("Error during login:", error);
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
