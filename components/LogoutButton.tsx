// components/LogoutButton.tsx
'use client';

import { logout } from './actions'; // Наш Server Action

export function LogoutButton() {
    // Ми використовуємо <form>, щоб викликати Server Action
    return (
        <form action={logout}>
            <button
                type="submit"
                className="text-gray-600 hover:text-gray-800"
            >
                Вийти
            </button>
        </form>
    );
}