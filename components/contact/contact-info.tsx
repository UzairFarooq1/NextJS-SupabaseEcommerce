import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

export default function ContactInfo() {
  return (
    <div className="space-y-8 flex flex-col h-full justify-center">
      <div>
        <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-muted-foreground">
                <a href="tel:+12125551234" className="hover:text-primary">
                  +254 791 495274
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-muted-foreground">
                <a href="uzairf2580@gmail.com" className="hover:text-primary">
                  uzairf2580@gmail.com
                </a>
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-full bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium">Business Hours</h3>
              <p className="text-muted-foreground">
                Monday - Friday: 9:00 AM - 4:00 PM
                <br />
                Saturday: 10:00 AM - 2:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-medium mb-3">Connect With Us</h3>
        <div className="flex gap-3">
          <a
            href="#"
            className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Facebook"
          >
            <Facebook className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Twitter"
          >
            <Twitter className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="Instagram"
          >
            <Instagram className="h-5 w-5" />
          </a>
          <a
            href="#"
            className="p-2 rounded-full bg-muted hover:bg-primary/10 hover:text-primary transition-colors"
            aria-label="LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
