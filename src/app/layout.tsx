import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CartInitializer from "@/components/CartInitializer";
import { auth } from "@/auth";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Bhaijan Kashmir | Authentic Kashmiri Saffron & Handicrafts",
  description: "Experience the pure essence of Kashmir. Premium saffron, dry fruits, and traditional handicrafts delivered to your doorstep.",
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
