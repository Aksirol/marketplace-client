// app/register/actions.ts
'use server';

import { query } from '@/lib/db';
import { createSession } from '@/lib/session';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

// Використовуємо той самий інтерфейс, що й для форми відгуків
export interface FormState {
    success: boolean;
    message: string;
}

// Тип для нашого користувача в БД
interface User {
    id: number;
    email: string;
    password_hash: string;
}

export async function registerUser(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // 1. Валідація
    if (!email || !password || password.length < 6) {
        return {
            success: false,
            message: 'Email та пароль (мінімум 6 символів) є обовязковими.',
        };
    }

    try {
        // 2. Перевіряємо, чи існує такий email
        const existingUser = await query<User>(
            'SELECT id FROM Users WHERE email = $1',
            [email]
        );

        if (existingUser.rows.length > 0) {
            return { success: false, message: 'Користувач з таким email вже існує.' };
        }

        // 3. Хешуємо пароль
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        // 4. Створюємо нового користувача в БД
        const newUser = await query<User>(
            'INSERT INTO Users (email, password_hash) VALUES ($1, $2) RETURNING id, email',
            [email, passwordHash]
        );

        const user = newUser.rows[0];

        // 5. Створюємо сесію (логінимо користувача одразу)
        await createSession({
            userId: user.id,
            email: user.email,
            isLoggedIn: true,
        });

    } catch (error) {
        console.error('Помилка реєстрації:', error);
        return { success: false, message: 'Сталася помилка на сервері.' };
    }

    // 6. Перенаправляємо на головну сторінку
    redirect('/');
}