const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Updating Hymn titles to proper names...");

    const properHymns = [
        { num: 1, title: 'Holy, Holy, Holy! Lord God Almighty' },
        { num: 2, title: 'Come, Thou Fount of Every Blessing' },
        { num: 3, title: 'To God Be the Glory' },
        { num: 4, title: 'Great Is Thy Faithfulness' },
        { num: 5, title: 'A Mighty Fortress Is Our God' },
        { num: 6, title: 'Blessed Assurance' },
        { num: 7, title: 'The Old Rugged Cross' },
        { num: 8, title: 'How Great Thou Art' },
        { num: 9, title: 'Amazing Grace (My Chains Are Gone)' },
        { num: 10, title: 'It Is Well with My Soul' },
        { num: 64, title: 'Abide with Me' },
        { num: 69, title: 'Rock of Ages' },
        { num: 74, title: 'Just As I Am' },
        { num: 79, title: 'What a Friend We Have in Jesus' },
        { num: 84, title: 'Turn Your Eyes Upon Jesus' },
        { num: 89, title: 'Softly and Tenderly' },
        { num: 100, title: 'Praise God from Whom All Blessings Flow' }
    ];

    for (const h of properHymns) {
        await prisma.hymn.updateMany({
            where: { number: h.num },
            data: { title: h.title }
        });
        console.log(`Updated Hymn ${h.num}: ${h.title}`);
    }

    console.log("Hymn restoration completed.");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
