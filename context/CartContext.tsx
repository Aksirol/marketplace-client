// context/CartContext.tsx
'use client';

import {
    createContext,
    useContext,
    useState,
    ReactNode,
    useEffect,
    useCallback // <--- 1. ІМПОРТУЄМО useCallback
} from 'react';

// ... (інтерфейси CartItem та CartContextType) ...
export interface CartItem {
    id: number;
    name: string;
    price: string;
    quantity: number;
}
interface CartContextType {
    items: CartItem[];
    addToCart: (product: { id: number; name: string; price: string }) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, newQuantity: number) => void;
    clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {

    const [items, setItems] = useState<CartItem[]>([]);
    const [isHydrated, setIsHydrated] = useState(false);

    // ... (useEffect для завантаження та збереження в localStorage) ...
    useEffect(() => {
        try {
            const storedItems = window.localStorage.getItem('cartItems');
            if (storedItems) {
                setItems(JSON.parse(storedItems));
            }
        } catch (error) {
            console.error('Error parsing cart items from localStorage', error);
        }
        setIsHydrated(true);
    }, []);

    useEffect(() => {
        if (isHydrated) {
            window.localStorage.setItem('cartItems', JSON.stringify(items));
        }
    }, [items, isHydrated]);


    // --- 2. ОНОВЛЕННЯ: "Огортаємо" всі функції в useCallback ---

    // 'setItems' (функція-сетер зі 'useState') є стабільною,
    // тому ми можемо передати порожній масив залежностей [],
    // якщо ми використовуємо функціональне оновлення (currentItems => ...)

    const addToCart = useCallback((product: { id: number; name: string; price: string }) => {
        setItems((currentItems) => {
            const existingItem = currentItems.find((item) => item.id === product.id);
            if (existingItem) {
                return currentItems.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                return [...currentItems, { ...product, quantity: 1 }];
            }
        });
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setItems((currentItems) => {
            return currentItems.filter((item) => item.id !== productId);
        });
    }, []);

    const updateQuantity = useCallback((productId: number, newQuantity: number) => {
        // Оскільки 'updateQuantity' викликає 'removeFromCart',
        // 'removeFromCart' теж має бути обгорнутий в 'useCallback'.
        if (newQuantity <= 0) {
            removeFromCart(productId);
        } else {
            setItems((currentItems) => {
                return currentItems.map((item) =>
                    item.id === productId ? { ...item, quantity: newQuantity } : item
                );
            });
        }
    }, [removeFromCart]); // Додаємо 'removeFromCart' як залежність

    const clearCart = useCallback(() => {
        setItems([]);
    }, []);


    return (
        <CartContext.Provider
            value={{
                items,
                addToCart,
                removeFromCart,
                updateQuantity,
                clearCart
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}