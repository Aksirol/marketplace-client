// app/cart/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
    // 1. Отримуємо нові функції з 'useCart'
    const { items, removeFromCart, updateQuantity } = useCart();

    const totalAmount = items.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);

    // 2. Функції-обробники для кнопок
    const handleIncrease = (id: number, quantity: number) => {
        updateQuantity(id, quantity + 1);
    };

    const handleDecrease = (id: number, quantity: number) => {
        updateQuantity(id, quantity - 1); // updateQuantity саме обробить випадок 0
    };

    const handleRemove = (id: number) => {
        removeFromCart(id);
    };

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">Ваш кошик</h1>

            {items.length === 0 ? (
                // ... (код для порожнього кошика) ...
                <div>
                    <p className="text-lg text-gray-700">Ваш кошик порожній.</p>
                    <Link href="/" className="text-blue-600 hover:underline mt-4 inline-block">
                        Повернутися до покупок
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                    <div className="md:col-span-2 space-y-4">
                        {items.map((item) => (
                            <div
                                key={item.id}
                                className="flex flex-col md:flex-row justify-between items-center border rounded-lg p-4 bg-white shadow-sm"
                            >
                                {/* Інфо про товар */}
                                <div className="flex-grow mb-4 md:mb-0">
                                    <h2 className="text-xl font-semibold">
                                        {item.name}
                                    </h2>
                                    <p className="text-gray-500">
                                        {item.price} грн за шт.
                                    </p>
                                    <span className="text-lg font-bold md:hidden">
                    Всього: {(parseFloat(item.price) * item.quantity).toFixed(2)} грн
                  </span>
                                </div>

                                {/* 3. ОНОВЛЕННЯ: Блок керування кількістю */}
                                <div className="flex items-center gap-4">
                                    {/* Кнопки +/- */}
                                    <div className="flex items-center border rounded">
                                        <button
                                            onClick={() => handleDecrease(item.id, item.quantity)}
                                            className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                                        >
                                            -
                                        </button>
                                        <span className="px-4 py-1">{item.quantity}</span>
                                        <button
                                            onClick={() => handleIncrease(item.id, item.quantity)}
                                            className="px-3 py-1 text-lg font-bold hover:bg-gray-100"
                                        >
                                            +
                                        </button>
                                    </div>

                                    {/* Загальна сума (для великих екранів) */}
                                    <span className="text-lg font-bold hidden md:block w-32 text-right">
                    {(parseFloat(item.price) * item.quantity).toFixed(2)} грн
                  </span>

                                    {/* Кнопка Видалити */}
                                    <button
                                        onClick={() => handleRemove(item.id)}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        Видалити
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Секція "До оплати" (без змін) */}
                    <div className="md:col-span-1">
                        <div className="border rounded-lg p-6 bg-white shadow-sm">
                            <h2 className="text-2xl font-semibold mb-4">Разом до оплати</h2>
                            <div className="flex justify-between text-xl font-bold mb-6">
                                <span>Всього:</span>
                                <span>{totalAmount.toFixed(2)} грн</span>
                            </div>
                            <Link
                                href="/checkout"
                                className="block text-center w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Перейти до оформлення
                            </Link>
                        </div>
                    </div>

                </div>
            )}
        </main>
    );
}