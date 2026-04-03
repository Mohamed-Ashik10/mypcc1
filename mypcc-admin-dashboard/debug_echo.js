const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Searching for issues with missing or default fullText...");
    const issues = await prisma.theEchoIssue.findMany();
    issues.forEach(i => {
        if (!i.fullText || i.fullText.includes("not yet added")) {
            console.log(`- FOUND: ${i.title} (ID: ${i.id}) | FullText: ${i.fullText?.substring(0, 50) || 'NULL'}`);
        }
    });
}

main().finally(async () => { await prisma.$disconnect(); });
