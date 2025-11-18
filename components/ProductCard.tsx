// components/ProductCard.tsx
import Link from 'next/link';

// Тип даних, який очікує наша картка
interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    imageUrl?: string; // (необов'язково)
    shopName?: string; // (необов'язково)
}

export function ProductCard({ id, name, price, shopName }: ProductCardProps) {
    return (
        <Link
            href={`/products/${id}`}
            className="group block bg-white border rounded-lg shadow-sm overflow-hidden
                 hover:shadow-lg transition-all duration-300"
        >
            {/* Секція зображення */}
            <div className="relative w-full h-48 bg-slate-200 overflow-hidden">
                {/* <img src={imageUrl} /> ... ми додамо це пізніше */}
                {/* Ефект 'Zoom' при наведенні */}
                <div
                    className="w-full h-full bg-gray-300
                     transition-transform duration-300 group-hover:scale-110"
                />
            </div>

            {/* Секція контенту */}
            <div className="p-4">
                {/* Назва магазину (якщо є) */}
                {shopName && (
                    <p className="text-sm font-medium text-blue-600 mb-1">
                        {shopName}
                    </p>
                )}

                {/* Назва товару */}
                <h3 className="text-lg font-bold text-gray-900 truncate" title={name}>
                    {name}
                </h3>

                {/* Ціна */}
                <p className="text-xl font-semibold text-green-700 mt-2">
                    {price} грн
                </p>
            </div>
        </Link>
    );
}