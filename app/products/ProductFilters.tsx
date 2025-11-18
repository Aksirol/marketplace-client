// app/products/ProductFilters.tsx
'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useDebouncedCallback } from 'use-debounce';

// Тип для категорій, які прийшли з сервера
interface Category {
    id: number;
    name: string;
}

export function ProductFilters({ categories }: { categories: Category[] }) {
    // Хуки для роботи з URL
    const searchParams = useSearchParams(); // 'читає' поточні параметри
    const router = useRouter(); // 'записує' нові параметри
    const pathname = usePathname(); // поточний шлях (напр., '/products')

    // Функція для оновлення URL (з 'debouncing' для пошуку)
    const handleFilterChange = (name: string, value: string) => {
        const params = new URLSearchParams(searchParams);
        if (value) {
            params.set(name, value);
        } else {
            params.delete(name); // Видаляємо, якщо значення порожнє
        }
        // Замінюємо URL без перезавантаження сторінки
        router.push(`${pathname}?${params.toString()}`);
    };

    // Обгортаємо функцію в 'debounce' (300ms)
    // Це означає, що пошук спрацює лише через 300ms після того,
    // як користувач ПЕРЕСТАВ друкувати
    const debouncedSearch = useDebouncedCallback((value: string) => {
        handleFilterChange('search', value);
    }, 300);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white rounded-lg shadow-sm border">

            {/* 1. Пошук */}
            <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                    Пошук
                </label>
                <input
                    type="text"
                    id="search"
                    placeholder="Назва товару..."
                    // 'defaultValue' для синхронізації з URL
                    defaultValue={searchParams.get('search') || ''}
                    onChange={(e) => debouncedSearch(e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                />
            </div>

            {/* 2. Фільтр за категорією */}
            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Категорія
                </label>
                <select
                    id="category"
                    // 'value' для синхронізації з URL
                    value={searchParams.get('category') || ''}
                    onChange={(e) => handleFilterChange('category', e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                >
                    <option value="">Всі категорії</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* 3. Сортування */}
            <div>
                <label htmlFor="sort" className="block text-sm font-medium text-gray-700">
                    Сортування
                </label>
                <select
                    id="sort"
                    value={searchParams.get('sort') || ''}
                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                    className="mt-1 w-full border-gray-300 rounded-lg shadow-sm"
                >
                    <option value="">За замовчуванням</option>
                    <option value="price_asc">Спочатку дешевші</option>
                    <option value="price_desc">Спочатку дорожчі</option>
                    <option value="name_asc">За назвою товару (А-Я)</option>

                    {/* --- ДОДАЙТЕ ЦІ РЯДКИ --- */}
                    <option value="shop_asc">За магазином (А-Я)</option>
                    <option value="shop_desc">За магазином (Я-А)</option>
                    {/* --- КІНЕЦЬ ДОДАНИХ РЯДКІВ --- */}

                </select>
            </div>

        </div>
    );
}