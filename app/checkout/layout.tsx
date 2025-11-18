// app/checkout/layout.tsx
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';

// Цей layout автоматично перевірить сесію для всіх сторінок всередині /checkout
export default async function CheckoutLayout({
                                                 children,
                                             }: {
    children: React.ReactNode;
}) {
    const session = await getSession();

    if (!session.isLoggedIn) {
        // Якщо не залогінений, відправляємо на сторінку логіну
        redirect('/login?redirect=/checkout');
    }

    return <>{children}</>;
}