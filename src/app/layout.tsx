import type { Metadata } from "next";
import { Outfit, Playfair_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
    variable: "--font-playfair",
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
  title: "JaapSeva - Japa Counter & Tracker",
  description: "A peaceful Japa counter for your daily spiritual practice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
