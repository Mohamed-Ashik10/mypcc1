const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  try {
    const count = await prisma.hymn.count();
    console.log('Total Hymns:', count);
  } catch (err) {
    console.error('Count Failed:', err.message);
  } finally {
    await prisma.$disconnect();
  }
}

test();
