const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const issues = await prisma.theEchoIssue.findMany();
    console.log("Found Echo Issues:", issues.length);
    issues.forEach(i => {
        console.log(`- ${i.title} (${i.issueMonth}) | Images: ${i.images ? (typeof i.images === 'string' ? i.images.substring(0, 50) : JSON.stringify(i.images).substring(0, 50)) : 'NULL'}`);
    });
}

main().finally(async () => { await prisma.$disconnect(); });
