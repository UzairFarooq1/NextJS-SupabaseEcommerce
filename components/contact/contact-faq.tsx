"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How can I track my order?",
    answer:
      "You can track your order by logging into your account and visiting the 'Orders' section. Alternatively, you can use the tracking number provided in your shipping confirmation email.",
  },
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return policy for most items. Products must be in their original condition with all tags and packaging. Some items like personalized products or intimate goods may not be eligible for return.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping typically takes 3-5 business days within the continental US. Express shipping options are available at checkout for faster delivery. International shipping times vary by destination.",
  },
  {
    question: "Do you ship internationally?",
    answer:
      "Yes, we ship to most countries worldwide. International shipping rates and delivery times vary by location. You can see the shipping options available to your country during checkout.",
  },
  {
    question: "How can I change or cancel my order?",
    answer:
      "You can request changes or cancellation by contacting our customer service team within 1 hour of placing your order. Once an order has begun processing, we may not be able to make changes or cancel it.",
  },
  {
    question: "Do you offer gift wrapping?",
    answer:
      "Yes, we offer gift wrapping services for a small additional fee. You can select this option during checkout and even include a personalized message for the recipient.",
  },
];

export default function ContactFaq() {
  return (
    <section className="container px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <div className="mt-8 text-center">
          <p className="text-muted-foreground">
            Can't find what you're looking for? Contact our support team and
            we'll get back to you as soon as possible.
          </p>
        </div>
      </div>
    </section>
  );
}
