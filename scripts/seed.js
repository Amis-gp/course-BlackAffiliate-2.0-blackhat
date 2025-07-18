const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Ініціалізація бази даних...');
  
  // Перевіряємо чи існує адміністратор
  const adminExists = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (!adminExists) {
    // Створюємо адміністратора
    await prisma.user.create({
      data: {
        email: 'stepan@advantage-agency.co',
        password: 'admin',
        name: 'Степан Адміністратор',
        role: 'admin'
      }
    });
    console.log('✅ Створено адміністратора: stepan@advantage-agency.co / admin');

    // Створюємо тестового користувача
    await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: 'user123',
        name: 'Тестовий користувач',
        role: 'user'
      }
    });
    console.log('✅ Створено тестового користувача: user@example.com / user123');
  } else {
    console.log('ℹ️ Адміністратор вже існує');
  }
  
  console.log('✅ База даних готова до роботи!');
}

main()
  .catch((e) => {
    console.error('❌ Помилка ініціалізації:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });