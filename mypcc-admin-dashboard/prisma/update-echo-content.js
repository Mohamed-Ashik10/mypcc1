const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Fetching all Echo issues...');
    const issues = await prisma.theEchoIssue.findMany();
    let updatedCount = 0;

    for (const issue of issues) {
        if (!issue.fullText || issue.fullText.includes('not yet added')) {
            const sampleText = `
                <h2>Welcome to ${issue.title}</h2>
                <p>This is a digital edition of our community newsletter. We are thrilled to share the latest updates, spiritual reflections, and community news from the PCC organization.</p>
                
                <h3>Community Impact</h3>
                <p>Over the past month, we have seen remarkable growth in our community engagement. From local outreach programs to digital worship services, the message of hope is reaching more hearts than ever before.</p>
                
                <h3>Wisdom from the Sanctuary</h3>
                <p>"Faith is the anchor that holds us steady in the storm." This month's message focuses on resilience and the power of collective prayer. We encourage all members to contribute their own stories of faith to the upcoming volumes.</p>
                
                <footer>Published by PCC Admin - ${issue.issueMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</footer>
            `.trim();

            await prisma.theEchoIssue.update({
                where: { id: issue.id },
                data: { fullText: sampleText }
            });
            updatedCount++;
        }
    }

    console.log(`Successfully updated ${updatedCount} issues with sample content.`);
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
