import { MapPin, Phone, Mail } from "lucide-react";
import ContactForm from "@/components/ContactForm";

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl font-bold text-walnut mb-4">Get in Touch</h1>
          <p className="text-stone-500">We'd love to hear from you. Send us a message or visit us in Srinagar.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-stone-100">
              <h3 className="font-serif text-2xl font-bold text-walnut mb-6">Contact Information</h3>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-kashmir-red/10 text-kashmir-red rounded-full">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-walnut">Our Location</h4>
                    <p className="text-stone-600 mt-1">123 Dal Lake Boulevard,<br />Srinagar, Jammu & Kashmir 190001</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-kashmir-red/10 text-kashmir-red rounded-full">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-walnut">Phone Number</h4>
                    <p className="text-stone-600 mt-1">+91 99999 99999</p>
                    <p className="text-stone-400 text-sm">Mon - Sat, 9am - 6pm</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="p-3 bg-kashmir-red/10 text-kashmir-red rounded-full">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-walnut">Email Address</h4>
                    <p className="text-stone-600 mt-1">hello@bhaijankashmir.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
