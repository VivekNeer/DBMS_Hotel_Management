import { cookies } from "next/headers";
import { getDb } from "@/lib/mongodb";
import { COLLECTIONS, type UserDocument } from "@/lib/db/schema";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const email = cookieStore.get("hotel_user")?.value;
  
  if (!email) return null;

  try {
    const db = await getDb();
    const usersCollection = db.collection<UserDocument>(COLLECTIONS.users);
    const user = await usersCollection.findOne({ email });
    
    if (!user) return null;
    
    return {
      id: user._id?.toString() || "",
      name: user.name,
      email: user.email,
    };
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}
