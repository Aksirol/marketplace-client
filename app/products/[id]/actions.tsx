// app/products/[id]/actions.ts

// Директива, яка каже Next.js, що це - Серверні Екшени
'use server';

import { query } from '@/lib/db';
import { revalidatePath } from 'next/cache'; // <--- Дуже важливо!

// Тип для стану відповіді (успіх або помилка)
export interface FormState {
    success: boolean;
    message: string;
}

// Наша головна дія
// prevState - попередній стан форми, formData - дані з <form>
export async function addReview(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    // 1. Отримуємо дані з форми
    const rating = formData.get('rating');
    const comment = formData.get('comment');
    const productId = formData.get('productId');

    // !!! ТИМЧАСОВО !!!
    // Оскільки у нас немає системи логіну, ми "вдаємо",
    // що відгук залишає користувач з ID = 1 (Іван Франко).
    const userId = 1;

    // 2. Валідація (перевірка) даних
    if (!rating || !comment || !productId) {
        return {
            success: false,
            message: 'Будь ласка, заповніть рейтинг та коментар.',
        };
    }

    try {
        // 3. Виконуємо SQL-запит INSERT
        await query(
            'INSERT INTO Reviews (user_id, product_id, rating, comment) VALUES ($1, $2, $3, $4)',
            [userId, productId, rating, comment]
        );

        // 4. Очищуємо кеш сторінки!
        // Це змусить Next.js заново завантажити список відгуків на сторінці товару
        revalidatePath(`/products/${productId}`);

        // 5. Повертаємо успішну відповідь
        return {
            success: true,
            message: 'Дякуємо за ваш відгук!',
        };

    } catch (error) {
        console.error('Помилка при додаванні відгуку:', error);
        return {
            success: false,
            message: 'Сталася помилка. Спробуйте пізніше.',
        };
    }
}