// app/products/[id]/edit/page.tsx

import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import { EditProductForm } from './EditProductForm';
// 1. Імпортуємо нову кнопку
import { DeleteProductButton } from './DeleteProductButton';

// ... (інтерфейси Product, Category, EditPageProps) ...
interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    category_id: number;
    producer_id: number;
}
interface Category {
    id: number;
    name: string;
}
interface EditPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage({ params }: EditPageProps) {
    const resolvedParams = await params;
    const { id: productId } = resolvedParams;

    // ... (код перевірки сесії та власності) ...
    const session = await getSession();
    if (!session.isLoggedIn) redirect('/login');

    const productResult = await query<Product>(
        'SELECT * FROM Products WHERE id = $1',
        [productId]
    );
    const product = productResult.rows[0];
    if (!product) redirect('/profile');

    const producerResult = await query<{ id: number }>(
        'SELECT id FROM Producers WHERE user_id = $1',
        [session.userId]
    );
    const producer = producerResult.rows[0];
    if (!producer || product.producer_id !== producer.id) {
        redirect('/profile');
    }

    const categoriesResult = await query<Category>('SELECT id, name FROM Categories');
    const categories = categoriesResult.rows;

    return (
        <div className="container mx-auto p-8 max-w-lg">
            <div className="mb-6">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Редагувати товар
                </h1>
                {/* Форма редагування */}
                <EditProductForm product={product} categories={categories} />
            </div>

            <hr className="my-8" />

            {/* 2. Додаємо секцію видалення */}
            <div>
                <h2 className="text-2xl font-bold text-red-700 mb-4">
                    Небезпечна зона
                </h2>
                <p className="text-gray-700 mb-4">
                    Видалення товару є незворотною дією.
                    (Примітка: ви не зможете видалити товар, якщо він вже є в замовленнях).
                </p>
                <DeleteProductButton productId={product.id} />
            </div>

        </div>
    );
}