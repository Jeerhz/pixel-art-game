import type React from "react";
import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Geist_Mono } from "next/font/google";
import "./globals.css";

const pressStart2P = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "The Mistral AI Incident - A Noir Interrogation",
  description: "A narrative pixel-art interrogation game powered by Mistral AI",
  authors: [{ name: "Adle Ben Salem" }],
};

export const viewport: Viewport = {
  themeColor: "#2a1f1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${pressStart2P.variable} ${geistMono.variable} font-mono antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
