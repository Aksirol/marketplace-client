// components/actions.ts
'use server';

import { destroySession } from '@/lib/session';
import { redirect } from 'next/navigation';

export async function logout() {
    // Руйнуємо сесію (видаляємо cookie)
    await destroySession();
    // Перенаправляємо на головну сторінку
    redirect('/');
}