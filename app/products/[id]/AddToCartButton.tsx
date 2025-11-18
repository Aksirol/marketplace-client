// app/products/[id]/AddToCartButton.tsx

// Директива, яка каже Next.js, що це - Клієнтський Компонент
'use client';

import { useCart } from '@/context/CartContext'; // Імпортуємо наш хук

// Тип даних, які потрібні кнопці
interface ProductData {
    id: number;
    name: string;
    price: string;
}

export function AddToCartButton({ product }: { product: ProductData }) {
    // Отримуємо функцію 'addToCart' з нашого глобального кошика
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        // Викликаємо функцію, передаючи їй дані про товар
        addToCart(product);

        // Показуємо просте повідомлення (пізніше це можна зробити гарнішим)
        alert(`"${product.name}" додано до кошика!`);
    };

    return (
        <button
            onClick={handleAddToCart}
            className="w-full bg-green-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-green-700 transition-colors"
        >
            Додати в кошик
        </button>
    );
}