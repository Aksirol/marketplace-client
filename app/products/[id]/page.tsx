// app/products/[id]/page.tsx

import { query } from '@/lib/db';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { AddReviewForm } from './AddReviewForm';
import { AddToCartButton } from './AddToCartButton';
import { getSession } from '@/lib/session'; // 1. Імпортуємо сесію

// ... (інтерфейси ProductDetails, Review, ProductPageProps) ...
interface ProductDetails {
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    image_url: string;
    producer_id: number;
    shop_name: string;
}
interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: Date;
    first_name: string;
    last_name: string;
}
interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}


export default async function ProductPage({ params }: ProductPageProps) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    if (!id) notFound();

    // 2. Отримуємо сесію
    const session = await getSession();

    // ... (Запит для 'product') ...
    const productResult = await query<ProductDetails>(
        `SELECT 
       p.id, p.name, p.description, p.price, p.stock_quantity, p.image_url,
       pr.id as producer_id, pr.shop_name
     FROM Products p
     JOIN Producers pr ON p.producer_id = pr.id
     WHERE p.id = $1`,
        [id]
    );
    const product = productResult.rows[0];
    if (!product) notFound();

    // 3. Отримуємо producer_id залогіненого користувача (якщо він є)
    let userProducerId: number | null = null;
    if (session.isLoggedIn) {
        const producerResult = await query<{ id: number }>(
            'SELECT id FROM Producers WHERE user_id = $1',
            [session.userId]
        );
        if (producerResult.rows.length > 0) {
            userProducerId = producerResult.rows[0].id;
        }
    }

    // 4. Перевіряємо, чи є користувач власником
    // `product.producer_id` - ID власника товару
    // `userProducerId` - ID залогіненого виробника
    const isOwner = product.producer_id === userProducerId;

    // ... (Запит для 'reviews') ...
    const reviewsResult = await query<Review>(
        `SELECT 
       r.id, r.rating, r.comment, r.created_at,
       u.first_name, u.last_name
     FROM Reviews r
     JOIN Users u ON r.user_id = u.id
     WHERE r.product_id = $1
     ORDER BY r.created_at DESC`,
        [id]
    );
    const reviews = reviewsResult.rows;

    const productDataForCart = {
        id: product.id,
        name: product.name,
        price: product.price,
    };

    return (
        <main className="container mx-auto p-8">
            {/* ... (Верхня частина: фото + інфо) ... */}
            <div className="flex flex-col md:flex-row gap-12">
                {/* ... (Ліва колонка: Фото) ... */}
                <div className="md:w-1/2">
                    <div className="w-full h-96 bg-gray-200 rounded-lg">
                        {/* <img src={product.image_url} alt={product.name} /> */}
                    </div>
                </div>

                {/* Права колонка (Інфо) */}
                <div className="md:w-1/2">
                    <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
                    {/* ... (Ціна, Опис, Продавець) ... */}
                    <div className="mb-6">
            <span className="text-3xl font-semibold text-green-600">
              {product.price} грн
            </span>
                        <span className="text-gray-500 ml-4">
              (В наявності: {product.stock_quantity})
            </span>
                    </div>
                    <p className="text-lg text-gray-700 mb-6">{product.description}</p>
                    <div className="mb-6">
                        <span>Продавець: </span>
                        <Link
                            href={`/producers/${product.producer_id}`}
                            className="text-blue-600 hover:underline font-semibold"
                        >
                            {product.shop_name}
                        </Link>
                    </div>

                    {/* 5. ОНОВЛЕНА ЛОГІКА КНОПКИ */}
                    {isOwner ? (
                        // Якщо власник - показуємо кнопку "Редагувати"
                        <Link
                            href={`/products/${product.id}/edit`}
                            className="w-full block text-center bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors"
                        >
                            Редагувати товар
                        </Link>
                    ) : (
                        // Якщо не власник - показуємо кнопку "Додати в кошик"
                        <AddToCartButton product={productDataForCart} />
                    )}

                </div>
            </div>

            {/* Секція Відгуків */}
            <hr className="my-12" />
            <div>
                <h2 className="text-3xl font-semibold mb-6">Відгуки покупців</h2>
                {/* ... (код відгуків) ... */}
                {reviews.length === 0 ? (
                    <p className="text-gray-500">На цей товар ще немає відгуків.</p>
                ) : (
                    <div className="space-y-6">
                        {reviews.map((review) => (
                            <div key={review.id} className="border rounded-lg p-6 bg-white shadow-sm">
                                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-lg">
                    {review.first_name} {review.last_name}
                  </span>
                                    <span className="text-gray-500 text-sm">
                    {new Date(review.created_at).toLocaleDateString('uk-UA')}
                  </span>
                                </div>
                                <p className="text-yellow-500 font-bold">Рейтинг: {review.rating}/5</p>
                                <p className="text-gray-700 mt-2">{review.comment}</p>
                            </div>
                        ))}
                    </div>
                )}

                {/* 6. Ховаємо форму відгуку від власника */}
                {!isOwner && (
                    <AddReviewForm productId={product.id} />
                )}

            </div>
        </main>
    );
}