import type { Metadata } from "next";
import ContactForm from "@/components/contact/contact-form";
import ContactInfo from "@/components/contact/contact-info";
import ContactFaq from "@/components/contact/contact-faq";

export const metadata: Metadata = {
  title: "Contact Us | Prime Picks",
  description:
    "Get in touch with our team for support, feedback, or business inquiries.",
};

export default function ContactPage() {
  return (
    <div className="flex flex-col gap-16 py-8 md:py-12">
      {/* Hero Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Get in Touch</h1>
          <p className="text-lg text-muted-foreground">
            Have questions, feedback, or need assistance? We're here to help!
            Fill out the form below or use our contact information to reach out.
          </p>
        </div>
      </section>

      {/* Contact Form and Info Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 max-w-6xl">
        <ContactFaq />
      </section>
    </div>
  );
}
