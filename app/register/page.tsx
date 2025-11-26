// app/register/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
// 👇 ВИПРАВЛЕНО: імпортуємо registerUser замість loginUser
import { registerUser, FormState } from './actions'; 
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
        >
            {pending ? 'Створення акаунту...' : 'Зареєструватися'}
        </button>
    );
}

export default function RegisterPage() {
    const initialState: FormState = { success: false, message: '' };
    // 👇 ВИПРАВЛЕНО: тут теж використовуємо registerUser
    const [state, formAction] = useActionState(registerUser, initialState); 

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
                        Створити акаунт
                    </h1>
                </div>

                <form action={formAction} className="mt-8 space-y-6 bg-white p-8 shadow-xl rounded-2xl border border-slate-100">
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                Email
                            </label>
                            <div className="mt-1">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Пароль (мін. 6 символів)
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    minLength={6}
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                                />
                            </div>
                        </div>
                    </div>

                    {!state.success && state.message && (
                        <div className="rounded-md bg-red-50 p-4 border border-red-100">
                            <p className="text-sm text-red-700">{state.message}</p>
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <p className="text-center text-sm text-slate-600">
                    Вже маєте акаунт?{' '}
                    <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Увійти
                    </Link>
                </p>
            </div>
        </div>
    );
}