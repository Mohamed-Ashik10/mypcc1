const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
    try {
        const count = await prisma.theEchoIssue.count();
        console.log('Echo Issues Count:', count);
        if (count > 0) {
            const issues = await prisma.theEchoIssue.findMany({ take: 5 });
            console.log('Recent Echo Titles:', issues.map(i => i.title).join(', '));
        }
    } catch (e) {
        console.error(e);
    } finally {
        await prisma.$disconnect();
    }
}
main();
