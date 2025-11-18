// app/layout.tsx

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { CartProvider } from '@/context/CartContext';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Маркетплейс Локальних Виробників',
    description: 'Курсовий проект з Баз Даних',
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="uk">
        {/* Додаємо 'suppressHydrationWarning={true}'
        Це скаже React ігнорувати невідповідності (як-от ті, що додані розширеннями)
        саме на цьому тезі.
      */}
        <body
            className={`${inter.className} min-h-screen flex flex-col bg-slate-100`}
            suppressHydrationWarning={true}  // <--- ДОДАЙТЕ ЦЕЙ РЯДОК
        >
        <CartProvider>
            <Navbar />
            <main className="flex-grow">
                {children}
            </main>
        </CartProvider>
        </body>
        </html>
    );
}