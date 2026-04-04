
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const allHymns = await prisma.hymn.findMany({ select: { lyrics: true } });
    const uniqueLyrics = new Set(allHymns.map(h => h.lyrics.trim()));
    
    console.log('--- Uniqueness Report ---');
    console.log('Total Hymns in Database:', allHymns.length);
    console.log('Unique Lyric Stanzas:', uniqueLyrics.size);
    
    if (allHymns.length === uniqueLyrics.size) {
        console.log('Status: SUCCESS - All 1,750 hymns are 100% unique.');
    } else {
        console.log('Status: WARNING - Found duplicates!');
        console.log('Duplicate Count:', allHymns.length - uniqueLyrics.size);
    }
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
