// app/login/page.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { loginUser, FormState } from './actions';
import Link from 'next/link';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-slate-300 disabled:cursor-not-allowed transition-all"
        >
            {pending ? 'Вхід...' : 'Увійти в акаунт'}
        </button>
    );
}

export default function LoginPage() {
    const initialState: FormState = { success: false, message: '' };
    const [state, formAction] = useActionState(loginUser, initialState);

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900">
                        З поверненням!
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                        Увійдіть, щоб керувати замовленнями
                    </p>
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
                                    placeholder="you@example.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                Пароль
                            </label>
                            <div className="mt-1">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-lg border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm transition-all"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>
                    </div>

                    {!state.success && state.message && (
                        <div className="rounded-md bg-red-50 p-4 border border-red-100">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">Помилка</h3>
                                    <div className="mt-2 text-sm text-red-700">
                                        <p>{state.message}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <SubmitButton />
                </form>

                <p className="text-center text-sm text-slate-600">
                    Немає акаунту?{' '}
                    <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                        Зареєструватися
                    </Link>
                </p>
            </div>
        </div>
    );
}