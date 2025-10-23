import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'sonner';
import Head from 'next/head';

export default function AppLayout({ children }) {
  return (
    <>
      <Head>
        <title>Pensagro - Agricultural Products & Supplies</title>
        <meta name="description" content="Premium agricultural products and supplies for sustainable farming." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div className="min-h-screen flex flex-col antialiased bg-white text-gray-900">
        <Toaster position="top-right" closeButton richColors />
        <Header />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
