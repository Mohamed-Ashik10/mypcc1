const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const hymns = await prisma.hymn.findMany({ select: { id: true, title: true, tags: true, number: true }, take: 10 });
    console.log(JSON.stringify(hymns, null, 2));
}
main().finally(() => prisma.$disconnect());
