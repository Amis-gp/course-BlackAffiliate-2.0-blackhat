const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('Initializing the database...');
  
  // Check if the administrator exists
  const adminExists = await prisma.user.findFirst({
    where: { role: 'admin' }
  });

  if (!adminExists) {
    // Create an administrator
    await prisma.user.create({
      data: {
        email: 'stepan@advantage-agency.co',
        password: 'admin',
        name: 'Stepan Administrator',
        role: 'admin'
      }
    });
    console.log('✅ Administrator created: stepan@advantage-agency.co / admin');

    // Create a test user
    await prisma.user.create({
      data: {
        email: 'user@example.com',
        password: 'user123',
        name: 'Test User',
        role: 'user'
      }
    });
    console.log('✅ Test user created: user@example.com / user123');
  } else {
    console.log('ℹ️ Administrator already exists');
  }
  
  console.log('✅ The database is ready to work!');
}

main()
  .catch((e) => {
    console.error('❌ Initialization error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });