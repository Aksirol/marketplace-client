import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

// Тимчасові дані для прикладу (потім замінимо на db.product.findMany())
const featuredProducts = [
  { id: 1, title: "Бездротові навушники Pro", price: 2999, category: "Електроніка", image: "" },
  { id: 2, title: "Ергономічне крісло", price: 8500, category: "Меблі", image: "" },
  { id: 3, title: "Механічна клавіатура", price: 3200, category: "Геймінг", image: "" },
  { id: 4, title: "Смарт-годинник Series 5", price: 5400, category: "Гаджети", image: "" },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/20">
          <div className="container-width py-20 md:py-32 flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6">
              Купуйте розумно.<br />
              <span className="text-blue-600">Продавайте швидко.</span>
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mb-8">
              Найкращий майданчик для пошуку унікальних речей та гаджетів. 
              Приєднуйтесь до тисяч задоволених користувачів вже сьогодні.
            </p>
            <div className="flex gap-4">
              <Link 
                href="/products" 
                className="bg-foreground text-background px-6 py-3 rounded-full font-medium hover:opacity-90 transition flex items-center"
              >
                Переглянути каталог <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link 
                href="/sell" 
                className="px-6 py-3 rounded-full font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
              >
                Продати товар
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="container-width py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold">Популярні товари</h2>
            <Link href="/products" className="text-blue-600 hover:underline text-sm font-medium">
              Дивитись всі
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10">
            {featuredProducts.map((product) => (
              <ProductCard 
                key={product.id}
                title={product.title}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}