// app/add-product/AddProductForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addProduct, FormState } from './actions';

// Тип для категорій, які ми отримали
interface Category {
    id: number;
    name: string;
}

// Кнопка Submit
function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Додавання товару...' : 'Додати товар'}
        </button>
    );
}

// Наш компонент форми
export function AddProductForm({ categories }: { categories: Category[] }) {
    const initialState: FormState = { success: false, message: '' };
    const [state, formAction] = useActionState(addProduct, initialState);

    return (
        <form action={formAction} className="bg-white p-6 border rounded-lg shadow-sm">

            {/* Назва товару */}
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Назва товару
                </label>
                <input
                    type="text" id="name" name="name" required
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            {/* Опис */}
            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Опис
                </label>
                <textarea
                    id="description" name="description" rows={4}
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            {/* Категорія (Dropdown) */}
            <div className="mb-4">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Категорія
                </label>
                <select
                    id="categoryId" name="categoryId" required
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                >
                    <option value="">Оберіть категорію...</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex gap-4 mb-6">
                {/* Ціна */}
                <div className="w-1/2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Ціна (грн)
                    </label>
                    <input
                        type="number" id="price" name="price" required
                        step="0.01" min="0"
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                </div>

                {/* Кількість */}
                <div className="w-1/2">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Кількість на складі
                    </label>
                    <input
                        type="number" id="stock" name="stock" required
                        step="1" min="0"
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                </div>
            </div>

            {/* Повідомлення про помилку */}
            {!state.success && state.message && (
                <p className="mb-4 text-sm text-red-600">
                    {state.message}
                </p>
            )}

            <SubmitButton />
        </form>
    );
}