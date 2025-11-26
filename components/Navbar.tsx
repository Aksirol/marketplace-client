import Link from 'next/link';
import { getSession } from '@/lib/session';
import { CartIcon } from './CartIcon';
import { LogoutButton } from './LogoutButton';

export async function Navbar() {
    const session = await getSession();

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-200/60 bg-white/80 backdrop-blur-md transition-all">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    
                    {/* Логотип */}
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-indigo-600 transition hover:opacity-80">
                            <span className="text-3xl">🛍️</span>
                            <span>Marketplace</span>
                        </Link>

                        {/* Навігація (десктоп) */}
                        <div className="hidden md:flex md:gap-6">
                            <NavLink href="/products">Всі товари</NavLink>
                            <NavLink href="/producers/1">Продавці</NavLink> {/* Тимчасово лінк */}
                        </div>
                    </div>

                    {/* Права частина */}
                    <div className="flex items-center gap-4">
                        <CartIcon />

                        <div className="h-6 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                        {session.isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/profile"
                                    className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                                >
                                    Кабінет
                                </Link>
                                <LogoutButton />
                            </div>
                        ) : (
                            <div className="flex items-center gap-3">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                                >
                                    Увійти
                                </Link>
                                <Link
                                    href="/register"
                                    className="rounded-full bg-indigo-600 px-5 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all transform active:scale-95"
                                >
                                    Реєстрація
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

// Допоміжний компонент для посилань
function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link 
            href={href} 
            className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors"
        >
            {children}
        </Link>
    );
}