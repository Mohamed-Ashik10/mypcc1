const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Hymns:', await prisma.hymn.count());
    console.log('Diary:', await prisma.diaryEntry.count({where: {userId: null}}));
    console.log('Echo:', await prisma.theEchoIssue.count());
    console.log('Devotional:', await prisma.devotional.count());
}

main().catch(console.error).finally(() => prisma.$disconnect());
