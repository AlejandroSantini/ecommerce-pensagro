import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pensagro - Agricultural Products & Supplies",
  description: "Premium agricultural products and supplies for sustainable farming. Quality seeds, tools, and organic solutions.",
  keywords: "agriculture, farming, seeds, organic, sustainable, rural supplies",
  icons: {
    icon: '/P.svg',
    apple: '/P.svg',
    shortcut: '/P.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-white text-gray-900">
        <Toaster position="top-right" closeButton richColors />
        {children}
      </body>
    </html>
  );
}
