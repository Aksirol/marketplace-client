// lib/session.ts

import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';

// 1. Визначаємо, що ми будемо зберігати в сесії
export interface SessionData {
    userId: number;
    email: string;
    isLoggedIn: true; // Ми встановлюємо 'true', коли створюємо сесію
}

// 2. Налаштування сесії
const sessionOptions = {
    password: process.env.SESSION_SECRET as string,
    cookieName: 'marketplace-session',
    cookieOptions: {
        secure: process.env.NODE_ENV === 'production',
    },
};

// 3. Функція для отримання сесії (на Серверних Компонентах / Actions)
export async function getSession() {

    // --- ОСНОВНЕ ВИПРАВЛЕННЯ ТУТ ---
    // Ми додаємо 'await' до 'cookies()', тому що, згідно з вашою помилкою,
    // 'cookies()' повертає Promise.
    const session = await getIronSession<SessionData>(
        await cookies(), // <--- ДОДАНО AWAIT
        sessionOptions
    );
    return session;
}

// 4. Функція для створення/збереження сесії (після логіну)
export async function createSession(data: SessionData) {
    const session = await getSession();
    // Оновлюємо дані сесії
    session.userId = data.userId;
    session.email = data.email;
    session.isLoggedIn = true;
    // Зберігаємо (це встановить cookie у браузері)
    await session.save();
}

// 5. Функція для виходу (logout)
export async function destroySession() {
    const session = await getSession();
    // Руйнуємо сесію
    session.destroy();
}