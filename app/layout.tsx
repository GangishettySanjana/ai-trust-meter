import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The AI Trust Meter — honest UI for AI uncertainty",
  description:
    "A confidence-state design system for AI responses in B2B SaaS tools. What if AI interfaces were honest about uncertainty? Designed & built by Sanjana Gangishetty.",
  openGraph: {
    title: "The AI Trust Meter",
    description: "What if AI interfaces were honest about uncertainty?",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
