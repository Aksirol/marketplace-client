import { query } from '@/lib/db';
import Link from 'next/link';

interface Producer {
    id: number;
    shop_name: string;
    description: string;
    address: string;
}

export default async function HomePage() {
    const { rows: producers } = await query<Producer>(
        'SELECT id, shop_name, description, address FROM Producers LIMIT 6'
    );

    return (
        <div className="flex flex-col gap-16 pb-16">
            
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-indigo-600 py-24 sm:py-32">
                {/* Декоративний фон */}
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-6xl mb-6 drop-shadow-sm">
                        Підтримуй <span className="text-indigo-200">локальних</span> виробників
                    </h1>
                    <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-indigo-100">
                        Купуйте свіжі продукти, крафтові вироби та унікальні товари прямо від українських фермерів та майстрів. Без посередників.
                    </p>
                    <div className="mt-10 flex items-center justify-center gap-x-6">
                        <Link
                            href="/products"
                            className="rounded-full bg-white px-8 py-3.5 text-sm font-bold text-indigo-600 shadow-lg hover:bg-indigo-50 transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                            Переглянути товари
                        </Link>
                        <Link href="/become-producer" className="text-sm font-semibold leading-6 text-white hover:text-indigo-100">
                            Стати продавцем <span aria-hidden="true">→</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Секція виробників */}
            <section className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900">Популярні магазини</h2>
                    <Link href="/products" className="text-indigo-600 font-medium hover:text-indigo-500">
                        Всі товари &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {producers.map((producer) => (
                        <Link
                            href={`/producers/${producer.id}`}
                            key={producer.id}
                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="h-32 bg-linear-to-r from-indigo-500 to-purple-500 group-hover:opacity-90 transition-opacity"></div>
                            <div className="p-6 pt-0">
                                <div className="-mt-10 mb-4 flex items-center justify-center">
                                    <div className="flex h-20 w-20 items-center justify-center rounded-full border-4 border-white bg-white text-3xl shadow-sm">
                                        🏪
                                    </div>
                                </div>
                                <div className="text-center">
                                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                                        {producer.shop_name}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-500 line-clamp-2">
                                        {producer.description}
                                    </p>
                                    <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
                                        📍 {producer.address}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}