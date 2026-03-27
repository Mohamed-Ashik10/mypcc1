const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Removing images for Still Waters and Moving Mountains...');
  
  await prisma.devotional.updateMany({
    where: { title: "Still Waters" },
    data: { image: null }
  });

  await prisma.devotional.updateMany({
    where: { title: "Moving Mountains" },
    data: { image: null }
  });

  console.log('✅ Successfully removed images for those two!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
