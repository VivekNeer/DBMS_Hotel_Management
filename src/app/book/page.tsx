import React from "react";
import ClientBookingForm from "./ClientBookingForm";
import { getCurrentUser } from "@/lib/auth/session";

export default async function BookPage() {
  const user = await getCurrentUser();

  return (
    <main className="min-h-screen py-16 px-4">
      <ClientBookingForm initialUser={user} />
    </main>
  );
}
