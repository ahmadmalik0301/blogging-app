import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = 'admin@myapp.com';

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      firstName: 'Super',
      lastName: 'Admin',
      password: await argon.hash('admin123'),
      role: 'ADMIN',
      dateOfBirth: new Date('1990-01-01'),
      provider: 'LOCAL',
    },
  });

  console.log('Admin user ready:', admin.email);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
