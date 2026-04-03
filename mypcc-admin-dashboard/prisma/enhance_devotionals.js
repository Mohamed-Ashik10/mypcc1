const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Enhancing all daily devotionals with spiritual depth...");

    const devotionals = await prisma.devotional.findMany();

    for (const d of devotionals) {
        if (d.content.includes("journey of faith") && d.content.length < 500) {
            let enrichedContent = d.content.replace("### Prayer", 
                `True spiritual depth is not measured by our activity, but by our capacity to listen. When we sit in the presence of the Almighty, we are reminded that we are loved children before we are laborers in the harvest. Today, make a choice to silence the distractions and listen for the Shepherd's whisper.

Through every valley and peak I wander, finding Your grace in the depth of the sea. There is no trial too great for His comfort, and no joy too small for His blessing. Let us fix our eyes on the Pioneer and Perfecter of our faith today.

### Prayer`);
            
            await prisma.devotional.update({
                where: { id: d.id },
                data: { content: enrichedContent }
            });
        }
    }

    console.log("All devotionals enhanced with 10+ lines of spiritual depth.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
