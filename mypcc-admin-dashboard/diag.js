const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function test() {
  console.log('--- DB DIAGNOSTIC START ---');
  const start = Date.now();
  try {
    const hymns = await prisma.hymn.findMany({ take: 1 });
    console.log('Result:', hymns.length > 0 ? 'Success' : 'No data');
    console.log('Time taken:', Date.now() - start, 'ms');
  } catch (err) {
    console.error('Diagnostic Failed:', err.message);
  } finally {
    await prisma.$disconnect();
    console.log('--- DB DIAGNOSTIC END ---');
  }
}

test();
