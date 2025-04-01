"use client";

import { useState } from "react";
import Image from "next/image";

export default function ContactMap() {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <section className="container px-4">
      <h2 className="text-2xl font-bold mb-6">Our Location</h2>
      <div className="rounded-xl overflow-hidden border h-[400px] relative bg-muted">
        <Image
          src="https://images.unsplash.com/photo-1577086664693-894d8405334a?q=80&w=2070"
          alt="Map of our location"
          fill
          className={`object-cover transition-opacity duration-700 ${
            isLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setIsLoaded(true)}
          sizes="100vw"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-background/90 backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-xs text-center">
            <h3 className="font-semibold mb-1">Prime Picks Headquarters</h3>
            <p className="text-sm text-muted-foreground">Westlands, Nairobi</p>
          </div>
        </div>
      </div>
    </section>
  );
}
