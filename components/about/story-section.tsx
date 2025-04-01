import Image from "next/image";

export default function StorySection() {
  return (
    <section className="container px-4">
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
        <div className="order-2 md:order-1">
          <h2 className="text-3xl font-bold mb-4">Our Story</h2>
          <div className="space-y-4 text-muted-foreground">
            <p>
              Founded in 2020, Prime Pick began with a simple idea: to create an
              online shopping experience that puts customers first. What started
              as a small operation has grown into a thriving e-commerce platform
              offering thousands of products across multiple categories.
            </p>
            <p>
              Our journey hasn't always been smooth, but our commitment to
              quality and customer satisfaction has never wavered. Through the
              challenges of our early days and the global pandemic, we've
              adapted and evolved to better serve our growing community of
              shoppers.
            </p>
            <p>
              Today, we're proud to be a trusted destination for online
              shopping, connecting customers with the products they love and the
              service they deserve.
            </p>
          </div>
        </div>
        <div className="order-1 md:order-2 relative">
          <div className="aspect-square relative rounded-xl overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?q=80&w=1470"
              alt="Our journey"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-xl -z-10"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary/10 rounded-xl -z-10"></div>
        </div>
      </div>
    </section>
  );
}
