const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const devos = await prisma.devotional.findMany({
        orderBy: { date: 'desc' },
        take: 1
    });
    console.log(JSON.stringify(devos, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
