import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Input } from "@/components/retroui/Input"; // Make sure you have this component

export default function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-12 px-4">
      <div className="container mx-auto grid max-w-7xl grid-cols-1 gap-10 md:grid-cols-3">
        {/* Column 1: About */}
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-foreground">
            Hilbert's Grand Hotel
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Experience infinite luxury and comfort in a truly retro setting
            where every room is always available.
          </p>
        </div>

        {/* Column 2: Links */}
        <div>
          <h3 className="text-lg font-bold text-foreground">Explore</h3>
          <nav className="mt-2 flex flex-col space-y-1">
            <Link
              href="/rooms"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Rooms
            </Link>
            <Link
              href="/bookings"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              My Bookings
            </Link>
            <Link
              href="/profile"
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Profile
            </Link>
          </nav>
        </div>

        {/* Column 3: Newsletter */}
        <div>
          <h3 className="text-lg font-bold text-foreground">Stay Updated</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Get the latest news and exclusive retro offers.
          </p>
          <form className="mt-4 flex gap-2">
            <Input
              type="email"
              placeholder="your.email@example.com"
              className="flex-1"
            />
            <Button>Subscribe</Button>
          </form>
        </div>
      </div>
      <div className="container mx-auto mt-12 max-w-7xl border-t border-border pt-8 text-center">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Hilbert's Grand Hotel. All Rights
          Reserved.
        </p>
      </div>
    </footer>
  );
}
