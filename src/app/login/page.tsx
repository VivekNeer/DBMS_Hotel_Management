"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

interface ApiResponse {
  message?: string;
  error?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createdMessage = useMemo(() => {
    return searchParams.get("created") === "1"
      ? "Account created successfully. Please login."
      : null;
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as ApiResponse;
      if (!response.ok) {
        throw new Error(data.error || "Failed to login");
      }

      router.push("/bookings");
      router.refresh();
    } catch (submitError: unknown) {
      const message =
        submitError instanceof Error ? submitError.message : "Failed to login";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="mx-auto min-h-screen w-full max-w-md px-6 py-16">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mt-2 text-muted-foreground">
        Access your account and bookings.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4 rounded border p-6"
      >
        {createdMessage ? (
          <p className="text-sm text-green-700">{createdMessage}</p>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            className="w-full rounded border px-3 py-2"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, email: e.target.value }))
            }
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            className="w-full rounded border px-3 py-2"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            required
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded bg-blue-600 px-4 py-2 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-4 text-sm text-muted-foreground">
        New here?{" "}
        <Link href="/signup" className="underline">
          Create an account
        </Link>
      </p>
    </main>
  );
}
