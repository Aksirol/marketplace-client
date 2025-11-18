// app/add-product/page.tsx

import { getSession } from '@/lib/session';
import { query } from '@/lib/db';
import { redirect } from 'next/navigation';
import { AddProductForm } from './AddProductForm'; // Ми створимо це нижче

// Тип для категорій
interface Category {
    id: number;
    name: string;
}

// Це СЕРВЕРНИЙ компонент
export default async function AddProductPage() {

    // 1. Захист сторінки: перевіряємо, чи користувач увійшов
    const session = await getSession();
    if (!session.isLoggedIn) {
        redirect('/login');
    }

    // 2. Захист сторінки: перевіряємо, чи користувач є виробником
    const producerResult = await query(
        'SELECT id FROM Producers WHERE user_id = $1',
        [session.userId]
    );
    if (producerResult.rows.length === 0) {
        // Якщо він не виробник, відправляємо його на сторінку профілю
        redirect('/profile');
    }

    // 3. Завантажуємо категорії, щоб передати їх у форму
    const categoriesResult = await query<Category>('SELECT id, name FROM Categories');
    const categories = categoriesResult.rows;

    return (
        <div className="container mx-auto p-8 max-w-lg">
            <h1 className="text-3xl font-bold mb-6 text-center">
                Додати новий товар
            </h1>

            {/* 4. Рендеримо клієнтську форму, передаючи їй список категорій */}
            <AddProductForm categories={categories} />

        </div>
    );
}