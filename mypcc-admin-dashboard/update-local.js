const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.devotional.updateMany({
    data: { image: "/daily_devo.png" }
  });

  await prisma.devotional.updateMany({
    where: { title: "Moving Mountains" },
    data: { image: "/church_diary.png" } 
  });
  
  console.log('✅ Updated to guaranteed local static images!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
