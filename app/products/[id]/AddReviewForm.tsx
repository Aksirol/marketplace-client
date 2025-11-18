// app/products/[id]/AddReviewForm.tsx
'use client';

// 1. Імпортуємо 'useActionState' з 'react',
//    а 'useFormStatus' залишається з 'react-dom'
import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import { addReview, FormState } from './actions';

// Компонент SubmitButton залишається без змін
function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Надсилання...' : 'Надіслати відгук'}
        </button>
    );
}

// Головний компонент форми
export function AddReviewForm({ productId }: { productId: number }) {
    const initialState: FormState = { success: false, message: '' };

    // 2. Перейменовуємо 'useFormState' на 'useActionState'
    const [state, formAction] = useActionState(addReview, initialState);

    return (
        <form action={formAction} className="border rounded-lg p-6 bg-white shadow-sm mt-6">
            <h3 className="text-xl font-semibold mb-4">Залишити відгук</h3>

            {/* ... (решта полів форми залишається без змін) ... */}
            <div className="mb-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700 mb-1">
                    Рейтинг (1-5)
                </label>
                <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="1"
                    max="5"
                    required
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Ваш коментар
                </label>
                <textarea
                    id="comment"
                    name="comment"
                    rows={4}
                    required
                    className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
            </div>

            <input type="hidden" name="productId" value={productId} />

            <SubmitButton />

            {/* Повідомлення про успіх або помилку */}
            {state.message && (
                <p className={`mt-4 text-sm ${state.success ? 'text-green-600' : 'text-red-600'}`}>
                    {state.message}
                </p>
            )}
        </form>
    );
}