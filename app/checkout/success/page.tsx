// app/checkout/success/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CheckoutSuccessPage() {
    // Отримуємо 'clearCart'
    const { clearCart } = useCart();

    // Очищуємо кошик ОДИН РАЗ, коли користувач потрапляє на цю сторінку
    useEffect(() => {
        clearCart();
    }, [clearCart]); // 'clearCart' стабільний

    return (
        <main className="container mx-auto p-8 text-center">
            <div className="bg-white p-12 border rounded-lg shadow-sm max-w-lg mx-auto">
                <h1 className="text-4xl font-bold mb-4 text-green-600">
                    Дякуємо за замовлення!
                </h1>
                <p className="text-lg text-gray-700 mb-8">
                    Ваше замовлення успішно оформлено. Ми зв'яжемося з вами найближчим часом.
                </p>
                <Link
                    href="/"
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
                >
                    Повернутися на головну
                </Link>
            </div>
        </main>
    );
}