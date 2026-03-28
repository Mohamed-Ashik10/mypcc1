const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    const h = await prisma.hymn.count();
    const e = await prisma.theEchoIssue.count();
    const d = await prisma.devotional.count();
    console.log(`Hymns: ${h}, Echo: ${e}, Devo: ${d}`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
