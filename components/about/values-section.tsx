"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Shield, Truck, Users, Zap, Award } from "lucide-react";

const values = [
  {
    icon: <Heart className="h-6 w-6" />,
    title: "Customer First",
    description:
      "We prioritize our customers' needs in everything we do, striving to exceed expectations at every touchpoint.",
  },
  {
    icon: <Shield className="h-6 w-6" />,
    title: "Quality Assurance",
    description:
      "We carefully select and verify all products to ensure they meet our high standards of quality and performance.",
  },
  {
    icon: <Truck className="h-6 w-6" />,
    title: "Reliable Delivery",
    description:
      "We partner with trusted logistics providers to ensure your orders arrive safely and on time, every time.",
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Community",
    description:
      "We build meaningful relationships with our customers, suppliers, and team members to create a thriving community.",
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Innovation",
    description:
      "We continuously explore new technologies and approaches to improve your shopping experience.",
  },
  {
    icon: <Award className="h-6 w-6" />,
    title: "Integrity",
    description:
      "We operate with honesty and transparency in all our business practices and communications.",
  },
];

export default function ValuesSection() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="container px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Our Values</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          These core principles guide our decisions and shape our approach to
          business.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {values.map((value, index) => (
          <motion.div
            key={index}
            className="p-6 rounded-xl border bg-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            viewport={{ once: true }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
              borderColor: "rgba(var(--primary), 0.5)",
            }}
          >
            <div
              className={`p-3 rounded-full inline-flex mb-4 ${
                hoveredIndex === index
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {value.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
            <p className="text-muted-foreground">{value.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
