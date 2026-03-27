const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.devotional.create({
    data: {
      title: 'The Cost of Grace (Premium Example)',
      date: new Date(),
      content: '> [!NOTE]\n> "For by grace you have been saved through faith."\n> EPHESIANS 2:8\n\n### Reflection\nGrace is free, but it is not cheap. When we truly understand the cost of Grace, we realize it cost God everything. Our response should be a life of dedicated worship.\n\n### Prayer\nLord, thank you for your grace.\n\n### Companion Hymn\nAmazing Grace', 
      author: 'Rev. Smith', 
      isFree: false, 
      minPlan: 'PILGRIM', 
      excerpt: 'Grace is free, but it is not cheap. When we truly understand...'
    }
  });
  console.log('✅ Premium Devotional Added!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
