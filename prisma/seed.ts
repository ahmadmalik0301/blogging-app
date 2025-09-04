import dotenv from 'dotenv';
dotenv.config();
import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPass = process.env.ADMIN_PASS!;
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASS) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASS not defined in .env');
  }

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      firstName: 'Muhammad',
      lastName: 'Ahmad',
      password: await argon.hash(adminPass),
      role: 'ADMIN',
      dateOfBirth: new Date('2002-12-28'),
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
