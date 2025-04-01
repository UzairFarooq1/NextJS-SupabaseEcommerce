"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Linkedin, Twitter, User } from "lucide-react";

const teamMembers = [
  {
    name: "Sarah Johnson",
    role: "Founder & CEO",
    bio: "With over 15 years of retail experience, Sarah founded NextShop with a vision to revolutionize online shopping.",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1376&auto=format&fit=crop",
  },
  {
    name: "Uzair Farooq",
    role: "Co-Founder & CTO",
    bio: "Uzair leads our technology team, ensuring our platform delivers a seamless shopping experience for all customers.",
    image: null, // No image for Uzair as requested
  },
  {
    name: "Michael Chen",
    role: "Head of Operations",
    bio: "Michael oversees our supply chain and logistics, making sure products reach customers quickly and efficiently.",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop",
  },
  {
    name: "Priya Patel",
    role: "Creative Director",
    bio: "Priya brings our brand to life through compelling visuals and engaging content across all our platforms.",
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1522&auto=format&fit=crop",
  },
];

export default function TeamSection() {
  return (
    <section className="container px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          The passionate people behind NextShop who work tirelessly to bring you
          the best shopping experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {teamMembers.map((member, index) => (
          <motion.div
            key={index}
            className="group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
          >
            <div className="aspect-square relative rounded-xl overflow-hidden mb-4 bg-muted">
              {member.image ? (
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-primary/10">
                  <User className="h-24 w-24 text-primary/40" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                <div className="flex gap-3">
                  <a
                    href="#"
                    className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"
                  >
                    <Linkedin className="h-4 w-4 text-white" />
                  </a>
                  <a
                    href="#"
                    className="bg-white/20 p-2 rounded-full backdrop-blur-sm hover:bg-white/40 transition-colors"
                  >
                    <Github className="h-4 w-4 text-white" />
                  </a>
                </div>
              </div>
            </div>
            <h3 className="text-xl font-semibold">{member.name}</h3>
            <p className="text-sm text-primary mb-2">{member.role}</p>
            <p className="text-muted-foreground text-sm">{member.bio}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
