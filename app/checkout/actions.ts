// app/checkout/actions.ts
'use server';

import { query } from '@/lib/db';
import { getSession } from '@/lib/session';
import { CartItem } from '@/context/CartContext';
import { redirect } from 'next/navigation';

export interface FormState {
    success: boolean;
    message: string;
}

export async function placeOrder(
    prevState: FormState,
    formData: FormData
): Promise<FormState> {

    // 1. Отримуємо сесію
    const session = await getSession();
    if (!session.isLoggedIn) {
        return { success: false, message: 'Ви не авторизовані.' };
    }

    // 2. Отримуємо дані
    const shippingAddress = formData.get('address') as string;
    const cartItemsJSON = formData.get('cartItems') as string;

    if (!shippingAddress || !cartItemsJSON) {
        return { success: false, message: 'Неповні дані замовлення.' };
    }

    let cartItems: CartItem[];
    try {
        cartItems = JSON.parse(cartItemsJSON);
    } catch (e) {
        return { success: false, message: 'Помилка обробки кошика.' };
    }

    if (cartItems.length === 0) {
        return { success: false, message: 'Ваш кошик порожній.' };
    }

    // Розраховуємо загальну суму на сервері (для безпеки)
    const totalAmount = cartItems.reduce((total, item) => {
        return total + (parseFloat(item.price) * item.quantity);
    }, 0);

    // 3. --- ПОЧАТОК ТРАНЗАКЦІЇ ---
    // Ми не можемо використовувати нашу утиліту query(),
    // оскільки нам потрібен ОДИН клієнт для всіх запитів
    const { Pool } = require('pg');
    const pool = new Pool({ connectionString: process.env.POSTGRES_URL });
    const client = await pool.connect();

    try {
        await client.query('BEGIN'); // Початок транзакції

        // Крок A: Створюємо замовлення
        const orderResult = await client.query(
            `INSERT INTO Orders (user_id, status, total_amount, shipping_address) 
       VALUES ($1, 'pending', $2, $3) 
       RETURNING id`,
            [session.userId, totalAmount.toFixed(2), shippingAddress]
        );

        const newOrderId = orderResult.rows[0].id;

        // Крок Б: Додаємо позиції замовлення (Order_Items)
        for (const item of cartItems) {
            // Спочатку перевіряємо, чи достатньо товару на складі
            const stockCheck = await client.query(
                'SELECT stock_quantity FROM Products WHERE id = $1 FOR UPDATE',
                [item.id]
            );

            const availableStock = stockCheck.rows[0].stock_quantity;
            if (availableStock < item.quantity) {
                throw new Error(`Недостатньо товару: ${item.name}`);
            }

            // Додаємо в Order_Items
            await client.query(
                `INSERT INTO Order_Items (order_id, product_id, quantity, price) 
         VALUES ($1, $2, $3, $4)`,
                [newOrderId, item.id, item.quantity, item.price]
            );

            // Крок В: Оновлюємо кількість (stock)
            await client.query(
                'UPDATE Products SET stock_quantity = stock_quantity - $1 WHERE id = $2',
                [item.quantity, item.id]
            );
        }

        // Якщо все добре - фіксуємо зміни
        await client.query('COMMIT');

    } catch (error: any) {
        // Якщо сталася помилка - відкочуємо всі зміни
        await client.query('ROLLBACK');
        console.error('Помилка транзакції замовлення:', error);
        return { success: false, message: error.message || 'Помилка при оформленні замовлення.' };
    } finally {
        // Завжди звільняємо клієнта
        client.release();
    }
    // --- КІНЕЦЬ ТРАНЗАКЦІЇ ---

    // 4. Перенаправляємо на сторінку успіху
    // Ми не можемо повернути 'success: true', бо нам потрібно очистити кошик на клієнті
    // Ми робимо редірект, а клієнт сам очистить кошик
    redirect('/checkout/success');
}