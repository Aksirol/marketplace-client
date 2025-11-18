// app/login/actions.ts
'use server';

import { query } from '@/lib/db';
import { createSession } from '@/lib/session';
import bcrypt from 'bcrypt';
import { redirect } from 'next/navigation';

export interface FormState {
    success: boolean;
    message: string;
}

interface User {
    id: number;
    email: string;
    password_hash: string;
}

export async function loginUser(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return { success: false, message: 'Email та пароль є обовязковими.' };
    }

    try {
        // 1. Знаходимо користувача за email
        const result = await query<User>(
            'SELECT id, email, password_hash FROM Users WHERE email = $1',
            [email]
        );

        const user = result.rows[0];

        // 2. Перевіряємо, чи існує користувач
        if (!user) {
            return { success: false, message: 'Неправильний email або пароль.' };
        }

        // 3. Порівнюємо наданий пароль з хешем у базі даних
        const passwordIsValid = await bcrypt.compare(password, user.password_hash);

        // 4. Якщо пароль не збігається
        if (!passwordIsValid) {
            return { success: false, message: 'Неправильний email або пароль.' };
        }

        // 5. Успіх! Створюємо сесію
        await createSession({
            userId: user.id,
            email: user.email,
            isLoggedIn: true,
        });

    } catch (error) {
        console.error('Помилка логіну:', error);
        return { success: false, message: 'Сталася помилка на сервері.' };
    }

    // 6. Перенаправляємо на головну сторінку
    redirect('/');
}