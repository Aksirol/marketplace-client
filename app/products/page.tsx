// app/products/page.tsx

import { query } from '@/lib/db';
import Link from 'next/link';
import { ProductFilters } from './ProductFilters';
import { ProductCard } from '@/components/ProductCard'; // <--- 1. ІМПОРТ

// Тип для наших товарів з JOIN
interface Product {
    id: number;
    name: string;
    price: string;
    image_url: string;
    shop_name: string; // Від виробника
}

// Тип для категорій (для фільтра)
interface Category {
    id: number;
    name: string;
}

// Тип для параметрів пошуку, які приходять з URL
interface SearchParams {
    search?: string;  // Пошуковий запит
    category?: string; // ID категорії
    sort?: string;     // Ключ сортування (napr. 'price_asc')
}

// 1. ОНОВЛЕННЯ: Вказуємо, що 'searchParams' - це Promise
export default async function ProductsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {

    // 2. ОНОВЛЕННЯ: "Розгортаємо" Promise за допомогою 'await'
    const resolvedSearchParams = await searchParams;

    // 1. Динамічне будівництво SQL-запиту
    const whereClauses: string[] = [];
    const queryParams: any[] = [];
    let paramIndex = 1;

    // 3. ОНОВЛЕННЯ: Використовуємо 'resolvedSearchParams'
    // -- Пошук --
    if (resolvedSearchParams.search) {
        whereClauses.push(`p.name ILIKE $${paramIndex}`);
        queryParams.push(`%${resolvedSearchParams.search}%`);
        paramIndex++;
    }

    // -- Фільтрація за категорією --
    if (resolvedSearchParams.category) {
        whereClauses.push(`p.category_id = $${paramIndex}`);
        queryParams.push(resolvedSearchParams.category);
        paramIndex++;
    }

    // -- Сортування --
    let orderByClause = 'ORDER BY p.created_at DESC'; // За замовчуванням
    if (resolvedSearchParams.sort) {
        if (resolvedSearchParams.sort === 'price_asc') {
            orderByClause = 'ORDER BY p.price ASC';
        } else if (resolvedSearchParams.sort === 'price_desc') {
            orderByClause = 'ORDER BY p.price DESC';
        } else if (resolvedSearchParams.sort === 'name_asc') {
            orderByClause = 'ORDER BY p.name ASC';

            // --- ДОДАЙТЕ ЦІ РЯДКИ ---
        } else if (resolvedSearchParams.sort === 'shop_asc') {
            // 'pr' - це псевдонім для таблиці Producers
            orderByClause = 'ORDER BY pr.shop_name ASC, p.name ASC';
        } else if (resolvedSearchParams.sort === 'shop_desc') {
            orderByClause = 'ORDER BY pr.shop_name DESC, p.name ASC';
            // --- КІНЕЦЬ ДОДАНИХ РЯДКІВ ---

        }
    }

    // ... (Решта коду) ...
    const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';

    const productsResult = await query<Product>(
        `SELECT
             p.id, p.name, p.price, p.image_url,
             pr.shop_name
         FROM Products p
                  JOIN Producers pr ON p.producer_id = pr.id
             ${whereSql}
                 ${orderByClause}`,
        queryParams
    );

    const products = productsResult.rows;

    const categoriesResult = await query<Category>('SELECT id, name FROM Categories');
    const categories = categoriesResult.rows;

    return (
        <main className="container mx-auto p-8">
            <h1 className="text-4xl font-bold mb-8">Всі товари</h1>

            {/* 2. ОНОВЛЕННЯ: Фільтри тепер мають кращий відступ */}
            <ProductFilters categories={categories} />

            {/* 3. ОНОВЛЕННЯ: Відступ 'mt-8' замість 'hr' */}
            <div className="mt-8">
                {products.length === 0 ? (
                    <p className="text-gray-500 text-lg">
                        Товарів за вашим запитом не знайдено.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                        {/* 4. ЗАМІНЮЄМО СТАРИЙ <Link> НА НОВИЙ <ProductCard> */}
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={product.price}
                                shopName={product.shop_name}
                                // imageUrl={product.image_url} // Можна додати, коли буде
                            />
                        ))}

                    </div>
                )}
            </div>
        </main>
    );
}