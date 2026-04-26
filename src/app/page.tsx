"use client";
import HeroPage from "@/components/Heropage";
import FeaturesSection from "@/components/FeaturesSection";
import FaqSection from "@/components/FaqSection";

// Data for the features section
const featuresData = [
  {
    imageSrc: "/f1.jpg",
    alt: "Fine Dining",
    title: "Fine Dining",
    description: "Exquisite dishes crafted by world-renowned chefs.",
  },
  {
    imageSrc: "/f2.png",
    alt: "Luxury Suites",
    title: "Luxury Suites",
    description: "Spacious rooms with breathtaking views and retro charm.",
  },
  {
    imageSrc: "/f3.jpg",
    alt: "Spa & Wellness",
    title: "Spa & Wellness",
    description: "Relax and rejuvenate with our exclusive spa treatments.",
  },
];

// Data for the FAQ section
const faqData = [
  {
    question: "What are the check-in and check-out times?",
    answer: "Check-in is from 3:00 PM, and check-out is until 11:00 AM.",
  },
  {
    question: "Is there parking available?",
    answer: "Yes, we offer complimentary valet parking for all our guests.",
  },
  {
    question: "Do you allow pets?",
    answer:
      "Unfortunately, pets are not allowed, with the exception of service animals.",
  },
  {
    question: "What is the cancellation policy?",
    answer:
      "Guests can cancel their reservation free of charge up to 24 hours before arrival.",
  },
  {
    question: "Is breakfast included?",
    answer:
      "Yes, we offer a complimentary breakfast buffet for all our guests.",
  },
];

export default function Home() {
  return (
    <main className="w-full bg-background p-6">
      <HeroPage />
      <FeaturesSection features={featuresData} />
      <FaqSection faqs={faqData} />
    </main>
  );
}
