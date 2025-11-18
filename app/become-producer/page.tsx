// app/become-producer/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerProducer, FormState } from './actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Створення магазину...' : 'Зареєструвати магазин'}
        </button>
    );
}

export default function BecomeProducerPage() {
    const initialState: FormState = { success: false, message: '' };
    const [state, formAction] = useActionState(registerProducer, initialState);

    return (
        <div className="container mx-auto p-8 max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Реєстрація виробника
            </h1>

            <p className="text-center text-gray-700 mb-6">
                Заповніть форму, щоб почати продавати ваші локальні товари.
            </p>

            <form action={formAction} className="bg-white p-6 border rounded-lg shadow-sm">

                <div className="mb-4">
                    <label htmlFor="shopName" className="block text-sm font-medium text-gray-700 mb-1">
                        Назва магазину / бренду
                    </label>
                    <input
                        type="text"
                        id="shopName"
                        name="shopName"
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                        Опис (Розкажіть про себе)
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        rows={4}
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Ваша адреса (місто, область)
                    </label>
                    <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                {/* Повідомлення про помилку */}
                {!state.success && state.message && (
                    <p className="mb-4 text-sm text-red-600">
                        {state.message}
                    </p>
                )}

                <SubmitButton />

            </form>
        </div>
    );
}