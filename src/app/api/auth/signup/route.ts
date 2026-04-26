import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type UserDocument } from "@/lib/db/schema";
import { signupSchema } from "@/lib/auth/validation";
import { hashPassword } from "@/lib/auth/password";

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const parsed = signupSchema.safeParse(payload);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message || "Invalid request";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const { name, email, password } = parsed.data;
    const normalizedEmail = email.trim().toLowerCase();

    const db = await getDb();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.users);

    const existingUser = await usersCollection.findOne({
      email: normalizedEmail,
    });
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 },
      );
    }

    const password_hash = await hashPassword(password);
    const result = await usersCollection.insertOne({
      name,
      email: normalizedEmail,
      password_hash,
      created_at: new Date(),
    });

    return NextResponse.json(
      {
        message: "Account created successfully",
        userId: result.insertedId.toHexString(),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 },
    );
  }
}
