"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "./retroui/Button";
import Logo from "./Logo";
import { Menu, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import FirebaseAuthUI from "./FirebaseAuthUI";

function AuthButtons() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Login / Sign Up</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold">
            Welcome
          </DialogTitle>
        </DialogHeader>
        <FirebaseAuthUI />
      </DialogContent>
    </Dialog>
  );
}

function DesktopNavbar() {
  return (
    <div className="hidden md:flex w-full h-16 items-center justify-between px-4 max-w-7xl mx-auto">
      {/* Left: Logo */}
      <div className="flex items-center min-w-[150px]">
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-8 text-foreground" />
          <span className="font-bold text-foreground">Hilbert's Hotel</span>
        </Link>
      </div>

      {/* Center: Navigation */}
      <div className="flex items-center space-x-6">
        <Link href="/rooms" className="text-sm font-medium hover:underline">
          Rooms
        </Link>
        <Link href="/about" className="text-sm font-medium hover:underline">
          About
        </Link>
        <Link href="/contact" className="text-sm font-medium hover:underline">
          Contact
        </Link>
      </div>

      {/* Right: Auth */}
      <div className="flex items-center justify-end min-w-[150px]">
        <AuthButtons />
      </div>
    </div>
  );
}

function MobileNavbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex md:hidden flex-col w-full">
      {/* Top bar */}
      <div className="flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Logo className="h-8 w-8 text-foreground" />
          <span className="font-bold text-foreground">Hilbert's Hotel</span>
        </Link>

        {/* Toggle button */}
        <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Collapsible menu */}
      {isOpen && (
        <div className="flex flex-col items-center space-y-4 py-4 border-t">
          <Link
            href="/rooms"
            className="text-lg"
            onClick={() => setIsOpen(false)}
          >
            Rooms
          </Link>
          <Link
            href="/about"
            className="text-lg"
            onClick={() => setIsOpen(false)}
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-lg"
            onClick={() => setIsOpen(false)}
          >
            Contact
          </Link>
          <AuthButtons />
        </div>
      )}
    </div>
  );
}

export default function Navbar() {
  return (
    <nav className="w-full border-b sticky top-0 bg-background/90 backdrop-blur-sm z-40">
      <DesktopNavbar />
      <MobileNavbar />
    </nav>
  );
}
