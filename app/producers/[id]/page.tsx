// app/producers/[id]/page.tsx

import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link'; // <--- 1. Імпортуємо Link

// ... (інтерфейси Producer та Product залишаються без змін) ...
interface Producer {
    id: number;
    shop_name: string;
    description: string;
    address: string;
    logo_url: string;
}

interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    image_url: string;
}

interface ProducerPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProducerPage({ params }: ProducerPageProps) {
    const resolvedParams = await params;

    if (!resolvedParams || !resolvedParams.id) {
        console.error('ProducerPage: Не вдалося отримати params або params.id');
        notFound();
    }

    const { id } = resolvedParams;
    console.log(`ProducerPage: Завантаження даних для ID: ${id}`);

    const producerResult = await query<Producer>(
        'SELECT * FROM Producers WHERE id = $1',
        [id]
    );

    const producer = producerResult.rows[0];

    if (!producer) {
        console.log(`ProducerPage: Виробника з ID ${id} не знайдено.`);
        notFound();
    }

    const productsResult = await query<Product>(
        'SELECT id, name, description, price, stock_quantity, image_url FROM Products WHERE producer_id = $1',
        [id]
    );

    const products = productsResult.rows;

    return (
        <main className="container mx-auto p-8">
            {/* ... (код шапки профілю виробника) ... */}
            <div className="mb-12">
                <h1 className="text-5xl font-bold mb-4">{producer.shop_name}</h1>
                <p className="text-xl text-gray-700 mb-4">{producer.description}</p>
                <p className="text-md text-gray-500">{producer.address}</p>
            </div>

            <hr className="mb-8" />

            <h2 className="text-3xl font-semibold mb-6">Товари виробника</h2>

            {products.length === 0 ? (
                <p className="text-gray-500">Цей виробник ще не додав жодного товару.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        // 2. Обертаємо картку товару в <Link>
                        <Link
                            href={`/products/${product.id}`} // 3. Вказуємо шлях до сторінки товару
                            key={product.id}
                            className="block border rounded-lg p-4 shadow bg-white hover:shadow-lg transition-shadow"
                        >
                            <div className="h-40 bg-gray-200 rounded mb-4">
                                {/* <img src={product.image_url} alt={product.name} /> */}
                            </div>
                            <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                            <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                            <div className="flex justify-between items-center">
                <span className="text-xl font-semibold text-green-600">
                  {product.price} грн
                </span>
                                <span className="text-sm text-gray-500">
                  В наявності: {product.stock_quantity}
                </span>
                            </div>
                        </Link> // 4. Закриваємо <Link>
                    ))}
                </div>
            )}
        </main>
    );
}