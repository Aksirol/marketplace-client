// app/checkout/page.tsx
'use client';

import { useCart } from '@/context/CartContext';
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { placeOrder, FormState } from './actions';
import { useRouter } from 'next/navigation';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Оформлення...' : 'Підтвердити замовлення'}
        </button>
    );
}

export default function CheckoutPage() {
    const { items, clearCart } = useCart(); // Отримуємо 'clearCart'
    const router = useRouter();

    const totalAmount = items.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);

    const initialState: FormState = { success: false, message: '' };
    const [state, formAction] = useActionState(placeOrder, initialState);

    // Слідкуємо за станом Server Action
    useEffect(() => {
        // Якщо 'redirect' спрацював, 'state' не оновиться.
        // Але якщо 'redirect' НЕ спрацював, значить, була помилка.
        if (!state.success && state.message) {
            alert(`Помилка: ${state.message}`);
        }
    }, [state, router, clearCart]);

    // Якщо Server Action зробив 'redirect', ця сторінка вже не буде існувати,
    // але сторінка '/checkout/success' (куди ми потрапимо)
    // матиме НОВИЙ 'CartContext' (оскільки це новий рендер).
    // Нам потрібно очистити кошик ДО того, як ми туди потрапимо.
    // ... Насправді, 'redirect' перериває виконання,
    // тому ми очистимо кошик на сторінці УСПІХУ. Це надійніше.

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">Оформлення замовлення</h1>

            {items.length === 0 ? (
                <p>Ваш кошик порожній.</p>
            ) : (
                <form action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-12">

                    {/* Ліва колонка: Форма */}
                    <div className="bg-white p-6 border rounded-lg shadow-sm">
                        <h2 className="text-2xl font-semibold mb-4">Адреса доставки</h2>
                        <div className="mb-4">
                            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                                Адреса (Місто, вулиця, будинок)
                            </label>
                            <textarea
                                id="address"
                                name="address"
                                rows={4}
                                required
                                className="w-full border-gray-300 rounded-lg shadow-sm"
                                placeholder="м. Київ, вул. Хрещатик, 1"
                            />
                        </div>

                        {/* Передаємо кошик як JSON-рядок */}
                        <input
                            type="hidden"
                            name="cartItems"
                            value={JSON.stringify(items)}
                        />

                        {/* Повідомлення про помилку */}
                        {!state.success && state.message && (
                            <p className="mb-4 text-sm text-red-600">
                                {state.message}
                            </p>
                        )}

                        <SubmitButton />
                    </div>

                    {/* Права колонка: Підсумок */}
                    <div className="bg-white p-6 border rounded-lg shadow-sm h-fit">
                        <h2 className="text-2xl font-semibold mb-4">Ваше замовлення</h2>
                        <div className="space-y-4 mb-4">
                            {items.map((item) => (
                                <div key={item.id} className="flex justify-between">
                                    <span>{item.name} x {item.quantity}</span>
                                    <span>{(parseFloat(item.price) * item.quantity).toFixed(2)} грн</span>
                                </div>
                            ))}
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between text-xl font-bold">
                            <span>Всього:</span>
                            <span>{totalAmount} грн</span>
                        </div>
                    </div>

                </form>
            )}
        </main>
    );
}