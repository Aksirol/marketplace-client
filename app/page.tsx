// app/page.tsx

import { query } from '@/lib/db';
import Link from 'next/link'; 

interface Producer {
    id: number;
    shop_name: string;
    description: string;
    address: string;
}

export default async function HomePage() {
    const { rows: producers } = await query<Producer>(
        'SELECT id, shop_name, description, address FROM Producers'
    );

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">
                Ласкаво просимо на Маркетплейс!
            </h1>

            <h2 className="text-2xl font-semibold mb-4">Наші виробники</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {producers.map((producer) => (
                    // 2. Обертаємо всю картку в <Link>
                    <Link
                        href={`/producers/${producer.id}`} // 3. Вказуємо динамічний шлях
                        key={producer.id}
                        // Покращено стилізацію картки: більш закруглені кути та м'якша тінь
                        className="block border border-gray-100 rounded-xl p-6 shadow-md bg-white
                                   hover:shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
                    >
                        {/* ЗМІНА КОЛЬОРУ: text-blue-600 */}
                        <h3 className="text-xl font-bold mb-2 text-blue-600 hover:text-blue-700">
                            {producer.shop_name}
                        </h3>
                        <p className="text-gray-700 mb-4">{producer.description}</p>
                        <p className="text-sm text-gray-500">{producer.address}</p>
                    </Link>
                ))}
            </div>

        </main>
    );
}