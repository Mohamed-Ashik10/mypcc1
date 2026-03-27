const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Restoring diverse images...');
  
  // Update Still Waters with a famously reliable bright nature Unsplash image
  await prisma.devotional.updateMany({
    where: { title: "Still Waters" },
    data: { image: "https://images.unsplash.com/photo-1470071131384-001b85755536?w=1600&q=80" } // Bright majestic mountains & water
  });

  // Update Moving Mountains with a beautiful vibrant mountain range
  await prisma.devotional.updateMany({
    where: { title: "Moving Mountains" },
    data: { image: "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=1600&q=80" } // Clear massive snowy mountains
  });

  // Restore the original gorgeous images for the other 3 that the user liked
  await prisma.devotional.updateMany({
    where: { title: "The Balm of Gilead" },
    data: { image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80" } 
  });

  await prisma.devotional.updateMany({
    where: { title: "Unceasing Worship" },
    data: { image: "https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?w=1600&q=80" } 
  });

  await prisma.devotional.updateMany({
    where: { title: "The Body Together" },
    data: { image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5e4?w=1600&q=80" } 
  });

  console.log('✅ Successfully restored individual Unsplash images!');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
