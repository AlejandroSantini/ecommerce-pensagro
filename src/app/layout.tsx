import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Pensagro - Agricultural Products & Supplies",
  description: "Premium agricultural products and supplies for sustainable farming. Quality seeds, tools, and organic solutions.",
  keywords: "agriculture, farming, seeds, organic, sustainable, rural supplies",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased bg-white text-gray-900">
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <Header />
            
            <main className="flex-1 flex flex-col">
              {children}
            </main>
            
            <Footer />
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
