// components/ProductCard.tsx
import Link from 'next/link';

interface ProductCardProps {
    id: number;
    name: string;
    price: string;
    imageUrl?: string;
    shopName?: string;
}

// 👇 ДОДАНО: imageUrl у список параметрів
export function ProductCard({ id, name, price, imageUrl, shopName }: ProductCardProps) {
    return (
        <Link
            href={`/products/${id}`}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
            <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
                {imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={imageUrl} 
                        alt={name} 
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-300 transition-colors group-hover:bg-slate-200">
                        <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                )}
                
                {shopName && (
                    <div className="absolute bottom-2 left-2 rounded-md bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700 backdrop-blur-sm shadow-sm">
                        {shopName}
                    </div>
                )}
            </div>

            <div className="flex flex-1 flex-col p-5">
                <h3 className="mb-2 text-lg font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {name}
                </h3>
                
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs text-slate-500">Ціна</span>
                        <span className="text-xl font-bold text-slate-900">{price} ₴</span>
                    </div>
                    
                    <div className="rounded-full bg-slate-100 p-2 text-indigo-600 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}