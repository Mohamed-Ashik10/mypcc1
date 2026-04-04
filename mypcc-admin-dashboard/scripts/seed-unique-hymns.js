
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const pools = {
    line1: [
        "O Lord my God, how great Thou art,",
        "In every heart, a song of praise,",
        "From rising sun to setting light,",
        "Beneath the shadow of Thy wings,",
        "With voices raised in holy joy,",
        "Before Thy throne we humbly bow,",
        "To Thee, O Savior, now we sing,",
        "Thy mercy flows like mountain streams,",
        "Great is Thy name throughout the earth,",
        "We walk in paths of righteousness,"
    ],
    line2: [
        "Thy grace descends like morning dew,",
        "Unfailing love that knows no end,",
        "A beacon in our darkest night,",
        "The peace that passes understanding,",
        "A strength for every weary soul,",
        "Thy kindness leads us home at last,",
        "Redeemed by blood and holy fire,",
        "A covenant of hope so deep,",
        "In every trial, Thy presence near,",
        "With hearts transformed by sacred truth,"
    ],
    line3: [
        "Through whispering winds and rolling seas,",
        "The spirit moves across the plains,",
        "Among the stars and silver moon,",
        "Within the silence of the dawn,",
        "Across the vast and ancient land,",
        "From every hill and verdant vale,",
        "Thy glory shines in every stone,",
        "The breath of life in all that lives,",
        "A garden blooming in the waste,",
        "The echo of eternity,"
    ],
    line4: [
        "We trust in Thy eternal Word,",
        "No power on earth can shake our faith,",
        "Thy promise stands through all the years,",
        "A foundation on solid rock,",
        "Guided by Thy unerring hand,",
        "A shield against the storm's embrace,",
        "In Thee we find our sure repose,",
        "The light that never fades away,",
        "Bound by the cords of holy love,",
        "Forever anchored in Thy truth,"
    ],
    line5: [
        "Until the morning star shall rise,",
        "Beyond the reach of time and space,",
        "To realms of light and endless day,",
        "Where every tear is wiped away,",
        "The kingdom comes with shouts of joy,",
        "A new creation born in Thee,",
        "Preparing for the coming King,",
        "Inheritance of saints above,",
        "Through gates of gold and streets of light,",
        "The promise of the world to be,"
    ],
    line6: [
        "All glory be to God on high,",
        "Amen, with voices one and all,",
        "Praise Father, Son, and Holy Ghost,",
        "For ever and for evermore,",
        "Hosanna to the King of Kings,",
        "Let every heart say, 'So it be',",
        "Hallelujah, our God reigns,",
        "To God the Father, all our praise,",
        "United in His holy name,",
        "Amen, Amen, for evermore."
    ]
};

async function main() {
    console.log("Fetching all hymns...");
    const hymns = await prisma.hymn.findMany({ select: { id: true, number: true, title: true } });
    console.log(`Found ${hymns.length} hymns to update.`);

    const usedCombinations = new Set();
    const CHUNK_SIZE = 50;

    for (let i = 0; i < hymns.length; i += CHUNK_SIZE) {
        const chunk = hymns.slice(i, i + CHUNK_SIZE);
        const updates = chunk.map(hymn => {
            let uniqueKeys;
            let combinationKey;
            
            // Ensure uniqueness within this run
            do {
                uniqueKeys = [
                    Math.floor(Math.random() * pools.line1.length),
                    Math.floor(Math.random() * pools.line2.length),
                    Math.floor(Math.random() * pools.line3.length),
                    Math.floor(Math.random() * pools.line4.length),
                    Math.floor(Math.random() * pools.line5.length),
                    Math.floor(Math.random() * pools.line6.length)
                ];
                combinationKey = uniqueKeys.join('-');
            } while (usedCombinations.has(combinationKey));

            usedCombinations.add(combinationKey);

            const lyrics = [
                pools.line1[uniqueKeys[0]],
                pools.line2[uniqueKeys[1]],
                pools.line3[uniqueKeys[2]],
                pools.line4[uniqueKeys[3]],
                pools.line5[uniqueKeys[4]],
                pools.line6[uniqueKeys[5]]
            ].join('\n');

            return prisma.hymn.update({
                where: { id: hymn.id },
                data: { lyrics: lyrics }
            });
        });

        await Promise.all(updates);
        console.log(`Updated ${Math.min(i + CHUNK_SIZE, hymns.length)} / ${hymns.length} hymns...`);
    }

    console.log(`Successfully updated all hymns with unique 6-line stanzas.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
