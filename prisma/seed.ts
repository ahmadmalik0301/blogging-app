import dotenv from 'dotenv';
dotenv.config({ debug: true });
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

  const postsData = Array.from({ length: 10 }).map((_, i) => ({
    title: `Sample Post ${i + 1}`,
    tagLine: `This is tagline for post ${i + 1}`,
    body: `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Post number ${
      i + 1
    } was generated as seed data for testing.`,
  }));

  await prisma.post.createMany({
    data: postsData,
  });

  console.log('10 random posts created ');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
