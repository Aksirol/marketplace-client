// app/register/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { registerUser, FormState } from './actions';
import Link from 'next/link';

// Кнопка, що показує статус "pending"
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Створення акаунту...' : 'Зареєструватися'}
        </button>
    );
}

export default function RegisterPage() {
    const initialState: FormState = { success: false, message: '' };
    const [state, formAction] = useActionState(registerUser, initialState);

    return (
        <div className="container mx-auto p-8 max-w-md">
            <h1 className="text-3xl font-bold mb-6 text-center">Створити акаунт</h1>

            <form action={formAction} className="bg-white p-6 border rounded-lg shadow-sm">

                <div className="mb-4">
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <div className="mb-6">
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                    >
                        Пароль (мін. 6 символів)
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        minLength={6}
                        required
                        className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                </div>

                <SubmitButton />

                {/* Повідомлення про помилку */}
                {!state.success && state.message && (
                    <p className="mt-4 text-sm text-red-600">
                        {state.message}
                    </p>
                )}
            </form>

            <p className="text-center mt-4">
                Вже маєте акаунт?{' '}
                <Link href="/login" className="text-blue-600 hover:underline">
                    Увійти
                </Link>
            </p>
        </div>
    );
}