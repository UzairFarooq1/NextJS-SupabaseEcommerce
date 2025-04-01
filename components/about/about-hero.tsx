import Image from "next/image";

export default function AboutHero() {
  return (
    <section className="container px-4">
      <div className="relative overflow-hidden rounded-xl">
        <div className="aspect-[21/9] w-full relative">
          <Image
            src="https://images.unsplash.com/photo-1556740738-b6a63e27c4df?q=80&w=2070"
            alt="Our team working together"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30" />
        </div>
        <div className="absolute inset-0 flex flex-col justify-center px-6 md:px-12 lg:px-20">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-4">
              About NextShop
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-xl">
              We're on a mission to provide quality products at affordable
              prices, with exceptional customer service.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
