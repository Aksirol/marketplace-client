// app/products/[id]/edit/EditProductForm.tsx
'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { updateProduct, FormState } from './actions';

// Типи, які ми отримуємо як props
interface Product {
    id: number;
    name: string;
    description: string;
    price: string;
    stock_quantity: number;
    category_id: number;
}
interface Category {
    id: number;
    name: string;
}
interface FormProps {
    product: Product;
    categories: Category[];
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors disabled:bg-gray-400"
        >
            {pending ? 'Оновлення...' : 'Оновити товар'}
        </button>
    );
}

export function EditProductForm({ product, categories }: FormProps) {
    const initialState: FormState = { success: false, message: '' };
    const [state, formAction] = useActionState(updateProduct, initialState);

    return (
        <form action={formAction} className="bg-white p-6 border rounded-lg shadow-sm">

            {/* Використовуємо 'defaultValue', щоб заповнити поля */}
            <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Назва товару
                </label>
                <input
                    type="text" id="name" name="name" required
                    defaultValue={product.name}
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Опис
                </label>
                <textarea
                    id="description" name="description" rows={4}
                    defaultValue={product.description}
                    className="w-full border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            <div className="mb-4">
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700 mb-1">
                    Категорія
                </label>
                <select
                    id="categoryId" name="categoryId" required
                    defaultValue={product.category_id}
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
                <div className="w-1/2">
                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Ціна (грн)
                    </label>
                    <input
                        type="number" id="price" name="price" required
                        step="0.01" min="0"
                        defaultValue={product.price}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                </div>

                <div className="w-1/2">
                    <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Кількість на складі
                    </label>
                    <input
                        type="number" id="stock" name="stock" required
                        step="1" min="0"
                        defaultValue={product.stock_quantity}
                        className="w-full border-gray-300 rounded-lg shadow-sm"
                    />
                </div>
            </div>

            {/* Приховане поле, щоб передати ID товару */}
            <input type="hidden" name="productId" value={product.id} />

            {!state.success && state.message && (
                <p className="mb-4 text-sm text-red-600">
                    {state.message}
                </p>
            )}

            <SubmitButton />
        </form>
    );
}