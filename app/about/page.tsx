import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Metadata } from "next";
import AboutHero from "@/components/about/about-hero";
import TeamSection from "@/components/about/team-section";
import ValuesSection from "@/components/about/values-section";
import StorySection from "@/components/about/story-section";

export const metadata: Metadata = {
  title: "About Us | NextShop",
  description:
    "Learn about our story, our team, and our mission to provide quality products.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <AboutHero />
      </section>

      {/* Our Story Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <StorySection />
      </section>

      {/* Our Values Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <ValuesSection />
      </section>

      {/* Team Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <TeamSection />
      </section>

      {/* Contact CTA Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="rounded-xl bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 p-8 md:p-12 lg:p-16 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get in Touch</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Have questions about our products or want to collaborate? We'd love
            to hear from you!
          </p>
          <Button size="lg" asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
