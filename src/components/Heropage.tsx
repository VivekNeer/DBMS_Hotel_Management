"use client";
import Image from "next/image";
import { RetroGrid } from "@/components/magicui/retro-grid";
import { Button } from "@/components/retroui/Button";
import { Card } from "@/components/retroui/Card";

export default function HeroPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center bg-background overflow-hidden p-4">
      <RetroGrid />

      {/* --- Desktop Layout (Visible on large screens) --- */}
      <div className="hidden lg:flex relative z-10 w-full max-w-7xl mx-auto items-center">
        {/* Left Side */}
        <div className="flex flex-col justify-center items-start w-1/2 pr-8">
          <span className="bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-7xl font-bold leading-none tracking-tighter text-transparent text-left">
            Hilbert’s Hotel
          </span>
          <span className="text-xl text-muted-foreground mt-4 mb-8 text-left">
            A truly retro experience living here.
          </span>
          <Card className="w-full max-w-lg">
            <Card.Content>
              <p className="text-muted-foreground">
                Experience infinite luxury and comfort at our unique hotel that
                accommodates every guest, no matter how many there are.
              </p>
            </Card.Content>
          </Card>

          <Button className="mt-10">Book Now</Button>
        </div>
        {/* Right Side */}
        <div className="flex flex-col items-center w-1/2 pl-8">
          <Card className="w-full max-w-lg mb-6">
            <Image
              src="/landing.png"
              alt="Retro Hotel"
              width={500}
              height={300}
              className="w-full h-auto object-cover rounded-lg"
              priority
            />
          </Card>
        </div>
      </div>

      {/* --- Mobile Layout (Visible on small screens) --- */}
      <div className="flex lg:hidden flex-col items-center justify-center relative z-10 w-full text-center">
        <Card className="w-full max-w-md mb-6">
          <Image
            src="/landing.png"
            alt="Retro Hotel"
            width={350}
            height={200}
            className="w-full h-auto object-cover rounded-lg"
            priority
          />
        </Card>
        <span className="bg-gradient-to-b from-[#ffd319] via-[#ff2975] to-[#8c1eff] bg-clip-text text-5xl font-bold leading-none tracking-tighter text-transparent">
          Hilbert’s Grand Hotel
        </span>
        <span className="text-lg text-muted-foreground mt-4">
          A truly retro experience living here.
        </span>
        <Button className="mt-6">Book Now</Button>
        <Card className="w-full max-w-md mt-8">
          <Card.Content>
            <p className="text-muted-foreground">
              Experience infinite luxury and comfort at our unique hotel that
              accommodates every guest, no matter how many there are.
            </p>
          </Card.Content>
        </Card>
      </div>
    </div>
  );
}
