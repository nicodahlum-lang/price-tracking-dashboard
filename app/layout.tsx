import './globals.css';
import { Inter } from 'next/font/google';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const queryClient = new QueryClient();

export const metadata = {
  title: 'Fintech Masterpiece',
  description: 'High-end Financial Dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [client] = useState(() => new QueryClient());

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <QueryClientProvider client={client}>
          <div className="relative min-h-screen overflow-hidden bg-[#0B0E11]">
            {/* Ambient background glows */}
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-1/2 -right-24 w-80 h-80 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <main className="relative z-10">{children}</main>
          </div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
