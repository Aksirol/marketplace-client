// app/add-product/actions.ts
'use server';

import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export interface FormState {
    success: boolean;
    message: string;
}

// Тип для 'Products', щоб отримати 'id' назад
interface Product {
    id: number;
}

export async function addProduct(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    // 1. Отримуємо сесію
    const session = await getSession();
    if (!session.isLoggedIn) {
        return { success: false, message: 'Ви повинні увійти в акаунт.' };
    }

    // 2. Перевіряємо, чи є користувач виробником і отримуємо його producer_id
    const producerResult = await query<{ id: number }>(
        'SELECT id FROM Producers WHERE user_id = $1',
        [session.userId]
    );

    const producer = producerResult.rows[0];
    if (!producer) {
        return { success: false, message: 'Ви не зареєстровані як виробник.' };
    }
    const producerId = producer.id;

    // 3. Отримуємо дані з форми
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;
    const categoryId = formData.get('categoryId') as string;

    // 4. Валідація
    if (!name || !price || !stock || !categoryId) {
        return { success: false, message: 'Назва, ціна, кількість та категорія є обовязковими.' };
    }

    let newProductId: number;

    try {
        // 5. Вставляємо новий товар в БД
        // 'RETURNING id' поверне нам ID нового товару
        const newProduct = await query<Product>(
            `INSERT INTO Products (producer_id, category_id, name, description, price, stock_quantity) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id`,
            [producerId, categoryId, name, description, parseFloat(price), parseInt(stock)]
        );

        newProductId = newProduct.rows[0].id;

    } catch (error) {
        console.error('Помилка додавання товару:', error);
        return { success: false, message: 'Сталася помилка на сервері.' };
    }

    // 6. Перенаправляємо на сторінку щойно створеного товару
    redirect(`/products/${newProductId}`);
}