// prisma/seed.ts
import 'dotenv/config'; // <--- 1. Додайте цей імпорт першим рядком!
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

// 2. Передаємо URL явно
const prisma = new PrismaClient({
  datasourceUrl: process.env.DATABASE_URL, 
});

async function main() {
  // ... далі ваш код без змін ...{
  console.log('🌱 Початок сідінгу (заповнення) бази даних...');

  // 1. Створення (або пошук) Категорій
  const categoriesData = [
    { name: 'Фрукти та Овочі' },
    { name: 'Сувеніри та Декор' },
    { name: 'Теслярські вироби' },
    { name: 'Будівельні матеріали' },
    { name: 'Крафтовий одяг' },
  ];

  const categories = [];
  for (const cat of categoriesData) {
    const category = await prisma.category.upsert({
      where: { name: cat.name }, // Перевіряємо по імені, щоб не дублювати
      update: {},
      create: { name: cat.name },
    });
    categories.push(category);
    console.log(`  - Категорія: ${category.name}`);
  }

  // Хеш пароля для всіх тестових юзерів (наприклад, "password123")
  const passwordHash = await bcrypt.hash('password123', 10);

  // 2. Створення Виробників (та пов'язаних Юзерів)
  const producersData = [
    {
      email: 'woodmaster@test.com',
      shopName: 'Карпатський Дуб',
      desc: 'Вироби з натурального дерева. Ручна робота з серця Карпат.',
      address: 'м. Яремче, вул. Свободи 12',
      products: [
        { name: 'Стіл обідній масивний', price: 15000, stock: 2, catIndex: 2, desc: 'Дубовий стіл, покритий масло-воском.' },
        { name: 'Дошка для подачі страв', price: 850, stock: 20, catIndex: 2, desc: 'Ясен, ідеально для ресторанів та дому.' },
        { name: 'Лавка садова', price: 4500, stock: 5, catIndex: 2, desc: 'Зручна лавка для вашого саду.' },
      ]
    },
    {
      email: 'souvenirs@test.com',
      shopName: 'Майстерня Чудес',
      desc: 'Унікальні українські сувеніри, ляльки-мотанки та кераміка.',
      address: 'м. Львів, пл. Ринок 45',
      products: [
        { name: 'Лялька-мотанка "Берегиня"', price: 1200, stock: 10, catIndex: 1, desc: 'Традиційний український оберіг.' },
        { name: 'Глиняний глечик розписний', price: 450, stock: 15, catIndex: 1, desc: 'Екологічний посуд для молока та води.' },
        { name: 'Набір свічок з вощини', price: 320, stock: 50, catIndex: 1, desc: 'Натуральний бджолиний віск, приємний аромат.' },
      ]
    },
    {
      email: 'builder@test.com',
      shopName: 'Прораб Іван',
      desc: 'Якісні будматеріали. Цегла, цемент, суміші. Доставка.',
      address: 'м. Київ, вул. Будівельників 1',
      products: [
        { name: 'Цемент М-500 (25кг)', price: 185, stock: 100, catIndex: 3, desc: 'Міцний цемент для фундаменту.' },
        { name: 'Шпаклівка фінішна', price: 420, stock: 30, catIndex: 3, desc: 'Ідеально біла стіна гарантована.' },
        { name: 'Цегла рядова (піддон)', price: 3500, stock: 10, catIndex: 3, desc: 'Червона цегла, 250 шт у піддоні.' },
      ]
    },
    {
      email: 'farmer@test.com',
      shopName: 'Еко-Ферма "Зелений Гай"',
      desc: 'Свіжі фрукти та овочі без пестицидів.',
      address: 'с. Вишневе, Фермерська 5',
      products: [
        { name: 'Яблука "Голден"', price: 25, stock: 500, catIndex: 0, desc: 'Солодкі та соковиті осінні яблука.' },
        { name: 'Мед квітковий (1л)', price: 300, stock: 40, catIndex: 0, desc: 'Натуральний мед з власної пасіки.' },
      ]
    }
  ];

  for (const pData of producersData) {
    // Створюємо (або знаходимо) Юзера
    const user = await prisma.user.upsert({
      where: { email: pData.email },
      update: {},
      create: {
        email: pData.email,
        password_hash: passwordHash,
      },
    });

    // Створюємо Виробника, якщо ще немає
    let producer = await prisma.producer.findFirst({
      where: { user_id: user.id }
    });

    if (!producer) {
      producer = await prisma.producer.create({
        data: {
          user_id: user.id,
          shop_name: pData.shopName,
          description: pData.desc,
          address: pData.address,
        }
      });
      console.log(`  - Створено магазин: ${pData.shopName}`);
    }

    // Створюємо Товари
    for (const prod of pData.products) {
      // Шукаємо категорію по індексу з нашого масиву categoriesData
      const categoryName = categoriesData[prod.catIndex].name;
      const category = categories.find(c => c.name === categoryName);

      if (category && producer) {
        await prisma.product.create({
          data: {
            name: prod.name,
            description: prod.desc,
            price: prod.price, // Prisma очікує Decimal або число, залежно від налаштувань
            stock_quantity: prod.stock,
            category_id: category.id,
            producer_id: producer.id,
            // image_url: можна додати посилання на плейсхолдери, якщо поле є в схемі
          }
        });
      }
    }
  }

  console.log('✅ База даних успішно заповнена!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });