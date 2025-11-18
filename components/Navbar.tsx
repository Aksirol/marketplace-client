// components/Navbar.tsx
import Link from 'next/link';
import { getSession } from '@/lib/session';
import { CartIcon } from './CartIcon';
import { LogoutButton } from './LogoutButton';

export async function Navbar() {
    const session = await getSession();

    return (
        // 1. ОНОВЛЕННЯ: Додаємо 'sticky top-0 z-50'
        <nav className="w-full bg-white shadow-md sticky top-0 z-50">
            <div className="container mx-auto p-4 flex justify-between items-center">

                <div className="flex items-center gap-6">
                    <Link href="/" className="text-2xl font-bold text-gray-900">
                        Маркетплейс
                    </Link>
                    <Link href="/products" className="text-lg font-medium text-gray-600 hover:text-blue-600">
                        Товари
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    <CartIcon />

                    {session.isLoggedIn ? (
                        <>
                            <Link
                                href="/profile"
                                className="text-base font-medium text-gray-600 hover:text-blue-600"
                            >
                                Мій кабінет
                            </Link>
                            <LogoutButton />
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-base font-medium text-gray-600 hover:text-blue-600"
                            >
                                Увійти
                            </Link>
                            <Link
                                href="/register"
                                // 2. ОНОВЛЕННЯ: Зробимо кнопку яскравішою
                                className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold text-sm hover:bg-blue-700 transition-colors"
                            >
                                Реєстрація
                            </Link>
                        </>
                    )}
                </div>

            </div>
        </nav>
    );
}