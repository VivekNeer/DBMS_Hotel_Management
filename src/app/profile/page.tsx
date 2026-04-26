import { getCurrentUser } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-5xl px-6 py-16">
      <h1 className="text-3xl font-bold">Profile</h1>
      <div className="mt-6 space-y-4">
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Personal Information</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        <div className="p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Preferences</h2>
          <p className="text-muted-foreground">No specific preferences set yet.</p>
        </div>
      </div>
    </main>
  );
}
