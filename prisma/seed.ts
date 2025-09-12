import dotenv from 'dotenv';
dotenv.config({ debug: true });
import { PrismaClient } from '@prisma/client';
import * as argon from 'argon2';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL!;
  const adminPass = process.env.ADMIN_PASS!;
  if (!adminEmail || !adminPass) {
    throw new Error('ADMIN_EMAIL or ADMIN_PASS not defined in .env');
  }

  // Create / Upsert Admin
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

  // Dummy users (Pakistani names)
  const dummyUsers = [
    { firstName: 'Ali', lastName: 'Khan', email: 'ali.khan@example.com' },
    { firstName: 'Sara', lastName: 'Malik', email: 'sara.malik@example.com' },
    { firstName: 'Ahmed', lastName: 'Raza', email: 'ahmed.raza@example.com' },
    { firstName: 'Fatima', lastName: 'Sheikh', email: 'fatima.sheikh@example.com' },
    { firstName: 'Bilal', lastName: 'Ansari', email: 'bilal.ansari@example.com' },
    { firstName: 'Hina', lastName: 'Iqbal', email: 'hina.iqbal@example.com' },
    { firstName: 'Usman', lastName: 'Ali', email: 'usman.ali@example.com' },
    { firstName: 'Zainab', lastName: 'Akhtar', email: 'zainab.akhtar@example.com' },
    { firstName: 'Hamza', lastName: 'Farooq', email: 'hamza.farooq@example.com' },
    { firstName: 'Ayesha', lastName: 'Nawaz', email: 'ayesha.nawaz@example.com' },
  ];

  const hashedPass = await argon.hash('password123'); // default password for all
  await prisma.user.createMany({
    data: dummyUsers.map((u) => ({
      email: u.email,
      firstName: u.firstName,
      lastName: u.lastName,
      password: hashedPass,
      role: 'USER',
      provider: 'LOCAL',
      dateOfBirth: new Date('1998-01-01'),
    })),
    skipDuplicates: true,
  });
  console.log('10 dummy users created');

  // Articles instead of placeholder text
  const articles = [
    {
      title: 'The Rise of Tech in Pakistan',
      tagLine: 'Exploring innovation in South Asia',
      body: 'Pakistan’s tech industry has seen rapid growth over the past decade, with startups emerging across various sectors...',
    },
    {
      title: 'Cricket: More Than Just a Game',
      tagLine: 'The heartbeat of a nation',
      body: 'For millions of Pakistanis, cricket is not merely a sport but a unifying passion that transcends boundaries...',
    },
    {
      title: 'Karachi’s Food Street',
      tagLine: 'A taste of tradition',
      body: 'From spicy biryani to sizzling kebabs, Karachi’s streets offer flavors that tell stories of generations...',
    },
    {
      title: 'Youth and Freelancing',
      tagLine: 'The gig economy in Pakistan',
      body: 'Thousands of young Pakistanis are turning to freelancing as a means of financial independence...',
    },
    {
      title: 'Northern Beauty',
      tagLine: 'Travel and tourism boom',
      body: 'The valleys of Hunza and Skardu attract both local and foreign tourists with their breathtaking landscapes...',
    },
    {
      title: 'Digital Education',
      tagLine: 'How online platforms are shaping learning',
      body: 'E-learning is revolutionizing education in Pakistan, making knowledge more accessible than ever before...',
    },
    {
      title: 'Startup Culture in Lahore',
      tagLine: 'Innovation in Punjab’s capital',
      body: 'Lahore has become a hub for startups, with incubators supporting entrepreneurs in diverse industries...',
    },
    {
      title: 'Women in STEM',
      tagLine: 'Breaking barriers in Pakistan',
      body: 'More Pakistani women are entering the fields of science, technology, engineering, and mathematics...',
    },
    {
      title: 'The Future of Renewable Energy',
      tagLine: 'Green power initiatives',
      body: 'With increasing energy demands, Pakistan is investing in solar and wind projects for a sustainable future...',
    },
    {
      title: 'The Revival of Pakistani Cinema',
      tagLine: 'A new golden age',
      body: 'After years of decline, Pakistani cinema is experiencing a revival, with filmmakers producing stories that resonate...',
    },
  ];

  await prisma.post.createMany({
    data: articles,
    skipDuplicates: true,
  });
  console.log('10 real-looking posts created');

  // Likes generation (30–40 random likes)
  const users = await prisma.user.findMany({ where: { role: 'USER' } });
  const posts = await prisma.post.findMany();

  const likesData: { userId: string; postId: string }[] = [];
  const randomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  for (let i = 0; i < randomInt(70, 100); i++) {
    const user = users[randomInt(0, users.length - 1)];
    const post = posts[randomInt(0, posts.length - 1)];

    if (!likesData.find((l) => l.userId === user.id && l.postId === post.id)) {
      likesData.push({ userId: user.id, postId: post.id });
    }
  }

  await prisma.like.createMany({ data: likesData, skipDuplicates: true });
  console.log(`${likesData.length} random likes added`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
