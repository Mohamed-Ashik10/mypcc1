const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    // 1. DEVOTIONALS (30 DAYS)
    console.log("Seeding Daily Manna Devotionals...");
    await prisma.devotional.deleteMany({});
    const devotionals = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            title: i === 0 ? 'Still Waters' : (i % 5 === 0 ? `Sacred Harvest: Day ${30-i}` : `Spiritual Depth Day ${30-i}`),
            date: d,
            content: `> [!NOTE]\n> "He leads me beside quiet waters, he refreshes my soul."\n> PSALM 23:2–3\n\n### Reflection\nIn the journey of faith, there are moments where the noise of the world becomes overwhelming. We forget that our strength is not found in the constant motion, but in the intentional stillness of God's presence. Just as Jesus withdrew to lonely places to pray, we must find our own 'still waters' to refresh our spirit for the work ahead.\n\n### Prayer\nLord, still my heart. Let the rushing currents of my anxieties be calmed by Your hand. Refresh my soul in the quiet places and lead me forward with Your strength. Amen.`,
            author: i % 3 === 0 ? 'Pastor James' : (i % 3 === 1 ? 'Sister Martha' : 'Deacon Elias'),
            excerpt: 'The Lord is my shepherd; I shall not want. He leads me to the quiet places...',
            image: `https://images.unsplash.com/photo-1518391846015-55a9cc003b25?auto=format&fit=crop&w=800&q=80`,
            reading: `Psalm 23:${(i % 150) + 1}`,
            category: i % 4 === 0 ? 'Inspiration' : (i % 4 === 1 ? 'Faith' : 'Guidance'),
            isFree: i < 5,
            minPlan: i < 15 ? 'SEEKER' : 'PILGRIM'
        };
    });
    for (const dev of devotionals) { await prisma.devotional.create({ data: dev }); }

    // 2. THE ECHO ISSUES (With "Music & Worship" mapping)
    console.log("Seeding The Echo Newsletters...");
    await prisma.theEchoIssue.deleteMany({});
    const echoCategories = ['Testimony', 'Church News', 'Music & Worship', 'Community'];
    const echoIssuesCount = 12;
    const echoIssues = Array.from({ length: echoIssuesCount }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const cat = echoCategories[i % echoCategories.length];
        return {
            title: i === 0 ? 'The Call to Ministry 2026' : (i === 1 ? 'Harmonies of Heaven' : `Community Voices: ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`),
            issueMonth: d,
            pdfUrl: `https://pcc.org/echo/newsletter-${i}.pdf`,
            coverUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 123456)}?auto=format&fit=crop&w=800&q=80`,
            isFeatured: i === 0,
            category: cat,
            excerpt: `The latest edition of The Echo for ${d.toLocaleString('default', { month: 'long', year: 'numeric' })}.`,
            fullText: `This month, the PCC community celebrates the grand expansion of our digital ministry. We are gathering weekly in the sanctuary to record the choir, capturing the authentic, reverberating sound of our congregation singing in a cherished space. \n\nOur prayer walls have overflowed with stories of God's faithfulness. Michael T. shared a powerful testimony: "When I buried my mother last autumn, I did not know how to pray. But I could sing. And that was enough. The melodies of our traditional hymns carried me when I couldn't walk." \n\nJoin us as the voices that echo across our community continue to grow louder and more harmonious in His name.`,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800'
            ])
        };
    });
    for (const echo of echoIssues) { await prisma.theEchoIssue.create({ data: echo }); }

    // 3. CHURCH DIARY (120 ENTRIES - GLOBAL)
    console.log("Seeding Global Church Diary...");
    await prisma.diaryEntry.deleteMany({ where: { userId: null } });
    const diaryEntries = Array.from({ length: 60 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            date: d,
            title: `Sacred Reading: ${d.toDateString()}`,
            theme: i % 4 === 0 ? 'Worship' : (i % 4 === 1 ? 'Comfort' : (i % 4 === 2 ? 'Faith' : 'Strength')),
            readingOne: `Psalm ${i + 1}`,
            readingTwo: `John ${i % 21 + 1}`,
            readingThree: `Romans ${i % 16 + 1}`,
            body: `Today's church-wide reflection focuses on the spiritual growth of the PCC community.`,
            userId: null
        };
    });
    for (const diary of diaryEntries) { await prisma.diaryEntry.create({ data: diary }); }

    // 4. TESTIMONIALS & ANNOUNCEMENTS
    console.log("Finalizing Community Data...");
    await prisma.testimonial.deleteMany({});
    await prisma.testimonial.create({ data: { authorName: 'Brother Emmanuel', content: 'God has been faithful to my family throughout the season.', isActive: true } });
    await prisma.testimonial.create({ data: { authorName: 'Sister Grace', content: 'The digital hymnal has transformed our house fellowship.', isActive: true } });

    await prisma.announcement.deleteMany({});
    await prisma.announcement.create({ data: { title: 'Annual Synod 2026', content: 'The General Synod will convene in Buea this October.', isActive: true } });

    console.log("FAST-TRACK SEED V2 COMPLETED. Echo Mapping & Diary Restoration Successful.");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
