const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

// Core category keywords mapped to tag labels
const CATEGORY_RULES = [
    { tag: 'praise', keywords: ['praise', 'glory', 'hallelujah', 'holy', 'king', 'lord', 'glorious', 'majestic', 'great', 'sovereign', 'mighty'] },
    { tag: 'grace', keywords: ['grace', 'merciful', 'forgive', 'redeem', 'undeserving', 'salvation', 'saved', 'wretched', 'ransom', 'pardon', 'amazing'] },
    { tag: 'faith', keywords: ['faith', 'trust', 'believe', 'hope', 'vision', 'assurance', 'confidence', 'faithful', 'faithful', 'blessed', 'victory'] },
    { tag: 'comfort', keywords: ['comfort', 'peace', 'still', 'rest', 'sorrow', 'grief', 'healing', 'weary', 'burden', 'refuge', 'shelter', 'solace'] },
    { tag: 'advent', keywords: ['advent', 'christmas', 'birth', 'manger', 'savior', 'born', 'child', 'star', 'shepherd', 'angel', 'bethlehem', 'noel'] },
];

// Deterministic tag assignment for ALL hymns based on number + title
function assignTags(hymn) {
    const titleLower = (hymn.title || '').toLowerCase();
    const lyricsLower = (hymn.lyrics || '').toLowerCase();
    const combined = titleLower + ' ' + lyricsLower;

    let matched = [];
    for (const rule of CATEGORY_RULES) {
        if (rule.keywords.some(kw => combined.includes(kw))) {
            matched.push(rule.tag);
        }
    }

    // Every hymn must have at least 2 tags — use deterministic fallbacks
    if (matched.length < 2) {
        const allTags = CATEGORY_RULES.map(r => r.tag);
        const num = hymn.number || 1;
        const primary = allTags[num % allTags.length];
        const secondary = allTags[(num + 2) % allTags.length];
        if (!matched.includes(primary)) matched.push(primary);
        if (matched.length < 2 && !matched.includes(secondary)) matched.push(secondary);
    }

    return matched.join(', ');
}

async function main() {
    console.log("Assigning categories to all 1750 hymns...");
    const hymns = await p.hymn.findMany({ select: { id: true, number: true, title: true, lyrics: true } });
    console.log(`Found ${hymns.length} hymns. Processing in batches...`);

    const batchSize = 20;
    let updated = 0;
    for (let i = 0; i < hymns.length; i += batchSize) {
        const batch = hymns.slice(i, i + batchSize);
        await Promise.all(batch.map(h => {
            const tags = assignTags(h);
            return p.hymn.update({ where: { id: h.id }, data: { tags } });
        }));
        updated += batch.length;
        if (updated % 250 === 0) console.log(`  Tagged ${updated}/${hymns.length}...`);
    }
    console.log(`Done! All ${hymns.length} hymns now have category tags.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => p.$disconnect());
