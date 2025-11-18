// app/profile/DeleteStoreButton.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteStore, FormState } from './actions';
import { useEffect } from 'react';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Видалення...' : 'Так, видалити мій магазин'}
        </button>
    );
}

export function DeleteStoreButton() {
    const initialState: FormState = { success: false, message: '' };
    const [state, formAction] = useActionState(deleteStore, initialState);

    // Якщо сервер повернув помилку
    useEffect(() => {
        if (!state.success && state.message) {
            alert(state.message);
        }
    }, [state]);

    const handleConfirm = (event: React.FormEvent<HTMLFormElement>) => {
        // 1. Запитуємо подвійне підтвердження
        const confirmed = window.confirm(
            'ВИ ВПЕВНЕНІ?\n\nЦя дія видалить ваш магазин та ВСІ ваші товари. Цю дію неможливо скасувати.'
        );

        if (!confirmed) {
            event.preventDefault(); // Зупиняємо відправку
        }
        // Якщо так, форма відправляється
    };

    return (
        <form action={formAction} onSubmit={handleConfirm}>
            <SubmitButton />
        </form>
    );
}