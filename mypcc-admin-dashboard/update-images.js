const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.devotional.updateMany({
    where: { title: "Still Waters" },
    data: { image: "https://images.unsplash.com/photo-1542459955-46fd1b763ec8?w=1600&q=80" } // Extremely vibrant, sunset clouds over water
  });

  await prisma.devotional.updateMany({
    where: { title: "Moving Mountains" },
    data: { image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&q=80" } // Bright, crisp green mountains and colorful
  });
  
  console.log('✅ Updated to bright colourful images!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
