const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.devotional.updateMany({
    where: { reading: null },
    data: { reading: "John 3:16" }
  });
  
  await prisma.devotional.updateMany({
    where: { reading: "" },
    data: { reading: "Psalm 23:1-6" }
  });

  const latest = await prisma.devotional.findFirst({ orderBy: { date: 'desc' } });
  if (latest && !latest.reading) {
      await prisma.devotional.update({
          where: { id: latest.id },
          data: { reading: "Psalm 23:1-6" }
      });
  }
  
  console.log('✅ Added test scripture readings to all devotionals!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
