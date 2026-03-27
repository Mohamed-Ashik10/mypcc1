const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const latest = await prisma.theEchoIssue.findFirst({
    orderBy: { issueMonth: 'desc' }
  });

  if (latest) {
    await prisma.theEchoIssue.update({
      where: { id: latest.id },
      data: { isFeatured: true }
    });
    console.log(`Featured issue: ${latest.title}`);
  } else {
    console.log("No issues found to feature.");
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
