import dotenv from 'dotenv';
dotenv.config({ debug: true });
import { PrismaClient, Role, Provider } from '@prisma/client';
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

  // Create notification for admin
  await prisma.notification.create({
    data: {
      message: `User ${admin.firstName} ${admin.lastName} have joined our app with email "${admin.email}"`,
    },
  });

  // Dummy users (Pakistani names) - 14 more users to make total 15
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
    { firstName: 'Omar', lastName: 'Hassan', email: 'omar.hassan@example.com' },
    { firstName: 'Layla', lastName: 'Qureshi', email: 'layla.qureshi@example.com' },
    { firstName: 'Tariq', lastName: 'Mahmood', email: 'tariq.mahmood@example.com' },
    { firstName: 'Nadia', lastName: 'Rehman', email: 'nadia.rehman@example.com' },
  ];

  const hashedPass = await argon.hash('password123'); // default password for all

  // Create users and notifications
  for (const userData of dummyUsers) {
    const user = await prisma.user.create({
      data: {
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        password: hashedPass,
        role: 'USER',
        provider: 'LOCAL',
        dateOfBirth: new Date('1998-01-01'),
      },
    });

    // Create notification for each user
    await prisma.notification.create({
      data: {
        message: `User ${user.firstName} ${user.lastName} have joined our app with email "${user.email}"`,
      },
    });
  }

  console.log('14 dummy users created with notifications');

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
  console.log('10 posts created');

  // Get all users and posts
  const allUsers = await prisma.user.findMany();
  const allPosts = await prisma.post.findMany();

  // Ensure each user likes at least 8 posts
  const likesData: { userId: string; postId: string }[] = [];

  for (const user of allUsers) {
    // Create a set of post indices to ensure unique likes for this user
    const postIndices = new Set<number>();

    // Add at least 8 unique posts for this user
    while (postIndices.size < 8) {
      const randomIndex = Math.floor(Math.random() * allPosts.length);
      postIndices.add(randomIndex);
    }

    // Add these likes to our data
    for (const index of postIndices) {
      likesData.push({
        userId: user.id,
        postId: allPosts[index].id,
      });
    }

    // Add some additional random likes (between 0-5 more)
    const additionalLikes = Math.floor(Math.random() * 6);
    for (let i = 0; i < additionalLikes; i++) {
      const randomIndex = Math.floor(Math.random() * allPosts.length);
      // Check if this like already exists for this user
      if (!postIndices.has(randomIndex)) {
        postIndices.add(randomIndex);
        likesData.push({
          userId: user.id,
          postId: allPosts[randomIndex].id,
        });
      }
    }
  }

  // Create all likes
  await prisma.like.createMany({
    data: likesData,
    skipDuplicates: true,
  });

  console.log(`${likesData.length} likes added, each user likes at least 8 posts`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
