import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Libre_Bodoni, Libre_Franklin } from "next/font/google";
import "./globals.css";
import Analytics from "@/components/Analytics";
import { Providers } from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const libreBodoni = Libre_Bodoni({
  variable: "--font-libre-bodoni",
  subsets: ["latin"],
  weight: ["400"],
});

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Product Monk - Level up your PM stack with AI",
  description: "Level up your PM stack with AI in 60 minutes. For mid–senior PMs (3–10 yrs). No browsing. No decision fatigue. Just watch, learn, and apply it Monday morning.",
  icons: {
    icon: "/product-monk-logo.png",
    apple: "/product-monk-logo.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${libreBodoni.variable} ${libreFranklin.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
