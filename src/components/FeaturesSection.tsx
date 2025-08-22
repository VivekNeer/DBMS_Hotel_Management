import Image from "next/image";
import { Card } from "@/components/retroui/Card";

interface Feature {
  imageSrc: string;
  alt: string;
  title: string;
  description: string;
}

interface FeaturesSectionProps {
  features: Feature[];
}

export default function FeaturesSection({ features }: FeaturesSectionProps) {
  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-12">
          Our World-Class Amenities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index}>
              <Image
                src={feature.imageSrc}
                alt={feature.alt}
                width={400}
                height={250}
                className="w-full h-48 object-cover"
              />
              <Card.Content>
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card.Content>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
