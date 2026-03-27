const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const devos = await prisma.devotional.findMany({
        orderBy: { date: 'desc' },
        take: 1
    });

    if (devos.length === 0) {
        console.log('No devotionals found');
        return;
    }

    const latest = devos[0];
    const newContent = `> [!NOTE]
> "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul."
> PSALM 23:2–3

### Reflection
There are moments when the world demands more than we have to give. The noise becomes deafening — obligations pile up, anxieties whisper, and the pace of life never seems to slow. It is into precisely this moment that the Shepherd speaks: lie down.

The invitation to still waters is not passive surrender — it is an act of trust. To rest in God's provision is to declare, with your body and your breath, that He is enough. That today's worries are held. That you are known and guided.

### Prayer
Lord, still the rushing waters of my mind today. Let me hear Your voice above the noise. Lead me to the quiet places where my soul is restored, and remind me that in Your presence, I lack nothing. Amen.

### Companion Hymn
Be Still, My Soul`;

    await prisma.devotional.update({
        where: { id: latest.id },
        data: { content: newContent }
    });

    console.log('Successfully updated devotional!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
