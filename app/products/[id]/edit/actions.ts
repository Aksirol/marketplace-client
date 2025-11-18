// app/products/[id]/edit/actions.ts
'use server';

import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export interface FormState {
    success: boolean;
    message: string;
}

export async function updateProduct(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    const session = await getSession();
    if (!session.isLoggedIn) {
        return { success: false, message: 'Ви повинні увійти в акаунт.' };
    }

    // 1. Отримуємо дані з форми
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const stock = formData.get('stock') as string;
    const categoryId = formData.get('categoryId') as string;
    const productId = formData.get('productId') as string; // ID товару

    if (!name || !price || !stock || !categoryId || !productId) {
        return { success: false, message: 'Всі поля, окрім опису, є обовязковими.' };
    }

    try {
        // 2. **Критична перевірка:** Отримуємо producer_id залогіненого юзера
        const producerResult = await query<{ id: number }>(
            'SELECT id FROM Producers WHERE user_id = $1',
            [session.userId]
        );

        const producer = producerResult.rows[0];
        if (!producer) {
            return { success: false, message: 'Ви не зареєстровані як виробник.' };
        }
        const producerId = producer.id;

        // 3. Виконуємо UPDATE, прив'язаний до producer_id
        // Це гарантує, що виробник не може редагувати чужі товари
        const result = await query(
            `UPDATE Products 
       SET 
         name = $1, 
         description = $2, 
         price = $3, 
         stock_quantity = $4, 
         category_id = $5
       WHERE 
         id = $6 AND producer_id = $7`, // <-- Перевірка власності
            [name, description, parseFloat(price), parseInt(stock), categoryId, productId, producerId]
        );

        // 4. Перевіряємо, чи був рядок оновлений
        if (result.rowCount === 0) {
            // Це спрацює, якщо WHERE не знайшов збігу (чужий товар)
            return { success: false, message: 'Помилка: Товар не знайдено або у вас немає прав.' };
        }

    } catch (error) {
        console.error('Помилка оновлення товару:', error);
        return { success: false, message: 'Сталася помилка на сервері.' };
    }

    // 5. Очищуємо кеш (revalidate), щоб побачити зміни
    revalidatePath(`/products/${productId}`);
    // 6. Перенаправляємо назад на сторінку товару
    redirect(`/products/${productId}`);
}

// ... (вміст файлу actions.ts, функція updateProduct) ...

// НОВА ФУНКЦІЯ
export async function deleteProduct(
    prevState: FormState, // <-- 1. ДОДАЄМО 'prevState'
    formData: FormData
): Promise<FormState> {

    const session = await getSession();
    if (!session.isLoggedIn) {
        return { success: false, message: 'Ви повинні увійти в акаунт.' };
    }

    const productId = formData.get('productId') as string;
    if (!productId) {
        return { success: false, message: 'Не вдалося знайти ID товару.' };
    }

    try {
        // ... (решта логіки (перевірка producer_id, DELETE) залишається без змін) ...
        const producerResult = await query<{ id: number }>(
            'SELECT id FROM Producers WHERE user_id = $1',
            [session.userId]
        );

        const producer = producerResult.rows[0];
        if (!producer) {
            return { success: false, message: 'Ви не зареєстровані як виробник.' };
        }
        const producerId = producer.id;

        const result = await query(
            'DELETE FROM Products WHERE id = $1 AND producer_id = $2',
            [productId, producerId]
        );

        if (result.rowCount === 0) {
            return { success: false, message: 'Помилка: Товар не знайдено або у вас немає прав.' };
        }

    } catch (error) {
        console.error('Помилка видалення товару:', error);
        if ((error as Error).message.includes('violates foreign key constraint')) {
            return { success: false, message: 'Неможливо видалити товар, оскільки він вже є у замовленнях.' };
        }
        return { success: false, message: 'Сталася помилка на сервері.' };
    }

    revalidatePath('/profile');
    redirect('/profile');
}