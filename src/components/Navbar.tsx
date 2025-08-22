"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/retroui/Button";
import { Menu, X } from "lucide-react";
import Logo from "./Logo";

// Common links
const navLinks = [
  { href: "/rooms", label: "Rooms" },
  { href: "/bookings", label: "My Bookings" },
  { href: "/profile", label: "Profile" },
];

// Desktop Layout
function DesktopNavbar() {
  return (
    <div className="hidden md:flex w-full h-16 items-center justify-between px-4 max-w-7xl mx-auto">
      {/* Left: Logo */}
      <div className="flex items-center min-w-[150px]">
        <Link href="/" className="flex items-center space-x-2">
          {<Logo className="h-16 w-16 text-foreground"/>}
        </Link>
      </div>

      {/* Center: Navigation */}
      <nav className="flex flex-1 justify-center items-center gap-6 text-sm font-medium">
        {navLinks.map((link) => (
          <Button variant="outline" key={link.href}>
            <Link
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground"
            >
              {link.label}
            </Link>
          </Button>
        ))}
      </nav>

      {/* Right: Auth buttons */}
      <div className="flex items-center justify-end min-w-[220px] space-x-2">
        <Button variant="secondary">Login</Button>
        <Button>Sign Up</Button>
      </div>
    </div>
  );
}

// Mobile Layout
function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex md:hidden flex-col w-full">
      {/* Top bar */}
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="font-bold">
          Hilbert&apos;s Hotel
        </Link>

        {/* Toggle button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </div>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="border-t">
          <div className="flex flex-col items-center gap-y-4 p-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="flex w-full gap-4 pt-4">
              <Button variant="secondary" className="flex-1">
                Login
              </Button>
              <Button className="flex-1">Sign Up</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Wrapper
export default function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <DesktopNavbar />
      <MobileNavbar />
    </header>
  );
}
