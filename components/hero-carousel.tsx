"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselItem {
  id: number;
  title: string;
  description: string;
  image: string;
  link: string;
}

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  const items: CarouselItem[] = [
    {
      id: 1,
      title: "Summer Collection",
      description: "Discover our new summer styles with up to 30% off",
      image:
        "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=1200",
      link: "/products?category=clothing",
    },
    {
      id: 2,
      title: "Tech Essentials",
      description: "Upgrade your gadgets with the latest technology",
      image:
        "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1200",
      link: "/products?category=electronics",
    },
    {
      id: 3,
      title: "Home Makeover",
      description: "Transform your space with our home collection",
      image:
        "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1200",
      link: "/products?category=home-kitchen",
    },
  ];

  const next = () => {
    setCurrent((current + 1) % items.length);
  };

  const prev = () => {
    setCurrent((current - 1 + items.length) % items.length);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (autoplay) {
      interval = setInterval(() => {
        next();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoplay, current]);

  return (
    <div
      className="relative overflow-hidden rounded-lg"
      onMouseEnter={() => setAutoplay(false)}
      onMouseLeave={() => setAutoplay(true)}
    >
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {items.map((item) => (
          <div key={item.id} className="w-full flex-shrink-0 relative">
            <div className="aspect-[21/9] w-full relative">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={item.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70" />
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4 md:p-8">
              {/* Responsive text sizes */}
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-4 drop-shadow-md">
                {item.title}
              </h2>
              <p className="text-base sm:text-lg md:text-xl mb-4 md:mb-6 max-w-md mx-auto drop-shadow-md">
                {item.description}
              </p>
              <Link href={item.link}>
                <Button
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 text-sm sm:text-base"
                >
                  Shop Now
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Larger, more accessible navigation buttons */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full hover:bg-black/70 h-10 w-10 sm:h-12 sm:w-12"
        onClick={prev}
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="sr-only">Previous slide</span>
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white rounded-full hover:bg-black/70 h-10 w-10 sm:h-12 sm:w-12"
        onClick={next}
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
        <span className="sr-only">Next slide</span>
      </Button>

      {/* Larger, more visible indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {items.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full ${
              current === index ? "bg-white" : "bg-white/50"
            }`}
            onClick={() => setCurrent(index)}
          >
            <span className="sr-only">Go to slide {index + 1}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
