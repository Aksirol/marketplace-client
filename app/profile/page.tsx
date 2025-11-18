// app/profile/page.tsx

import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import Link from 'next/link';
// 1. Імпортуємо нову кнопку
import { DeleteStoreButton } from './DeleteStoreButton';

interface Producer {
    id: number;
    shop_name: string;
}

export default async function ProfilePage() {
    const session = await getSession();

    if (!session.isLoggedIn) {
        redirect('/login');
    }

    const producerResult = await query<Producer>(
        'SELECT id, shop_name FROM Producers WHERE user_id = $1',
        [session.userId]
    );

    const producer = producerResult.rows[0];

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Мій кабінет
            </h1>

            <div className="bg-white p-6 border rounded-lg shadow-sm">
                <h2 className="text-2xl font-semibold mb-4">
                    Вітаємо, {session.email}!
                </h2>

                {producer ? (
                    // Якщо користувач ВЖЕ виробник
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <div>
                                <p className="text-lg">Ви є власником магазину:</p>
                                <p className="text-xl font-bold">{producer.shop_name}</p>
                            </div>

                            <Link
                                href="/add-product"
                                className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700"
                            >
                                + Додати новий товар
                            </Link>
                        </div>

                        <hr />

                        {/* 2. ДОДАЄМО НЕБЕЗПЕЧНУ ЗОНУ */}
                        <div>
                            <h3 className="text-2xl font-bold text-red-700 mb-4">
                                Небезпечна зона
                            </h3>
                            <p className="text-gray-700 mb-4">
                                Видалення магазину є незворотною дією. Це призведе до
                                видалення **всіх** ваших товарів з платформи.
                            </p>
                            <DeleteStoreButton />
                        </div>

                    </div>

                ) : (
                    // Якщо користувач ЩЕ НЕ виробник
                    <div>
                        <p className="text-lg mb-4">
                            Ви ще не зареєстровані як виробник.
                        </p>
                        <Link
                            href="/become-producer"
                            className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700"
                        >
                            Стати виробником
                        </Link>
                    </div>
                )}
            </div>
        </main>
    );
}