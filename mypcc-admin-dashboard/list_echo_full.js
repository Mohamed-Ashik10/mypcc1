const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Listing ALL Echo Issues:");
    const issues = await prisma.theEchoIssue.findMany();
    issues.forEach(i => {
        console.log(`- ${i.id} | ${i.title} | ${i.fullText?.substring(0, 30) || 'NULL'}`);
    });
}

main().finally(async () => { await prisma.$disconnect(); });
