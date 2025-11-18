// app/profile/actions.ts
'use server';

import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// Тип для нашої відповіді
export interface FormState {
    success: boolean;
    message: string;
}

export async function deleteStore(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    const session = await getSession();
    if (!session.isLoggedIn) {
        return { success: false, message: 'Ви повинні увійти в акаунт.' };
    }

    try {
        // 1. Виконуємо DELETE. Нам не потрібен 'producer_id',
        // оскільки 'user_id' в таблиці Producers є УНІКАЛЬНИМ.
        // База даних автоматично видалить всі 'Products' (ON DELETE CASCADE)
        // і оновить 'Order_Items' (ON DELETE SET NULL).
        const result = await query(
            'DELETE FROM Producers WHERE user_id = $1', // <-- Захист на рівні сесії
            [session.userId]
        );

        if (result.rowCount === 0) {
            return { success: false, message: 'Помилка: Магазин не знайдено.' };
        }

    } catch (error) {
        console.error('Помилка видалення магазину:', error);
        return { success: false, message: 'Сталася помилка на сервері.' };
    }

    // 2. Очищуємо кеш сторінки профілю
    revalidatePath('/profile');
    // 3. Перенаправляємо (користувач побачить, що він знову не-виробник)
    redirect('/profile');
}