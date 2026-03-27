const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const counts = {
            comfort: await prisma.hymn.count({ where: { tags: { contains: 'comfort' } } }),
            advent: await prisma.hymn.count({ where: { tags: { contains: 'advent' } } }),
            praise: await prisma.hymn.count({ where: { tags: { contains: 'praise' } } }),
            grace: await prisma.hymn.count({ where: { tags: { contains: 'grace' } } }),
            faith: await prisma.hymn.count({ where: { tags: { contains: 'faith' } } }),
            total: await prisma.hymn.count()
        };
        console.log('Database Counts:', JSON.stringify(counts, null, 2));
    } catch (err) {
        console.error('Error counting hymns:', err);
    } finally {
        await prisma.$disconnect();
    }
}

main();
