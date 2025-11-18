// app/become-producer/actions.ts
'use server';

import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

export interface FormState {
    success: boolean;
    message: string;
}

export async function registerProducer(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    // 1. Отримуємо сесію (щоб знати, ЯКОГО user_id прив'язати)
    const session = await getSession();

    if (!session.isLoggedIn) {
        return { success: false, message: 'Ви повинні увійти в акаунт.' };
    }

    // 2. Отримуємо дані з форми
    const shopName = formData.get('shopName') as string;
    const description = formData.get('description') as string;
    const address = formData.get('address') as string;

    // 3. Валідація
    if (!shopName || !description || !address) {
        return { success: false, message: 'Всі поля є обовязковими.' };
    }

    try {
        // 4. Перевіряємо, чи цей користувач ВЖЕ є виробником
        const existing = await query(
            'SELECT id FROM Producers WHERE user_id = $1',
            [session.userId]
        );

        if (existing.rows.length > 0) {
            return { success: false, message: 'Ви вже зареєстровані як виробник.' };
        }

        // 5. Створюємо нового виробника
        await query(
            'INSERT INTO Producers (user_id, shop_name, description, address) VALUES ($1, $2, $3, $4)',
            [session.userId, shopName, description, address]
        );

    } catch (error) {
        console.error('Помилка реєстрації виробника:', error);
        return { success: false, message: 'Сталася помилка на сервері.' };
    }

    // 6. Перенаправляємо на сторінку кабінету
    // (вона оновить себе і покаже, що він тепер виробник)
    redirect('/profile');
}