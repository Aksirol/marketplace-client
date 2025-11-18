// app/products/[id]/edit/DeleteProductButton.tsx
'use client';

// 1. Переконайтеся, що 'useActionState' імпортується з 'react'
import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteProduct, FormState } from './actions';

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Видалення...' : 'Так, видалити цей товар'}
        </button>
    );
}

export function DeleteProductButton({ productId }: { productId: number }) {
    const initialState: FormState = { success: false, message: '' };

    // 2. Використовуємо 'useActionState'
    const [state, formAction] = useActionState(deleteProduct, initialState);

    // Ефект для показу 'alert'
    useEffect(() => {
        if (!state.success && state.message) {
            alert(state.message);
        }
    }, [state]);

    // 3. ОНОВЛЕНА ЛОГІКА 'onSubmit'
    const handleConfirm = (event: React.FormEvent<HTMLFormElement>) => {
        // 1. Запитуємо підтвердження
        const confirmed = window.confirm(
            'Ви впевнені, що хочете видалити цей товар? Цю дію неможливо скасувати.'
        );

        // 2. Якщо користувач НЕ погодився,
        // ми зупиняємо відправку форми
        if (!confirmed) {
            event.preventDefault();
        }
        // Якщо користувач погодився, ми нічого не робимо,
        // і форма відправляється, викликаючи 'formAction'.
    };

    return (
        // 4. Передаємо 'formAction' в 'action'
        // і 'handleConfirm' в 'onSubmit'
        <form action={formAction} onSubmit={handleConfirm}>
            <input type="hidden" name="productId" value={productId} />
            <SubmitButton />
        </form>
    );
}