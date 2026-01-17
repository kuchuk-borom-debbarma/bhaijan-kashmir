import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartInitializer from "@/components/CartInitializer";
import { auth } from "@/auth";

import NextTopLoader from 'nextjs-toploader';

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Bhaijan Kashmir | Authentic Kashmiri Saffron & Handicrafts",
    template: "%s | Bhaijan Kashmir",
  },
  description: "Experience the pure essence of Kashmir. Premium saffron, dry fruits, and traditional handicrafts delivered to your doorstep.",
  keywords: ["Kashmir", "Saffron", "Pashmina", "Dry Fruits", "Walnuts", "Organic", "Handicrafts"],
  authors: [{ name: "Bhaijan Kashmir" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://bhaijankashmir.com",
    siteName: "Bhaijan Kashmir",
    images: [
      {
        url: "/og-image.jpg", // You should add a default OG image to public/ folder
        width: 1200,
        height: 630,
        alt: "Bhaijan Kashmir - Nature's Finest Gifts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@bhaijankashmir", // Placeholder
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${playfair.variable} ${inter.variable} font-sans antialiased bg-stone-50 text-walnut flex flex-col min-h-screen`}>
        <NextTopLoader color="#c8102e" showSpinner={false} />
        <CartInitializer userId={session?.user?.id} />
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
