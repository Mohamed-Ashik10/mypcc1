const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function run() {
  const user = await prisma.user.findUnique({ where: { email: 'admin@mypcc.org' } });
  if (!user) throw new Error('User not found');
  
  await prisma.diaryEntry.create({
    data: {
      userId: user.id,
      title: 'Sacred Reflection: Standing in Grace',
      body: 'Today’s devotional on "Still Waters" reminded me that trust is a dynamic act. We do not just wait for the water to be calm; we trust the One who leads us there. My soul is finding its rhythm in this new digital space, and I am grateful for the "Sacred Mirror" of this journal to document the journey.',
      date: new Date()
    }
  });
  console.log('SUCCESS: Example Diary Entry Created.');
}
run().finally(() => prisma.$disconnect());
