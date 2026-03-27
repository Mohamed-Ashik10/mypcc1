const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // 1. Admin User
    const adminEmail = 'admin@mypcc.org';
    const adminPassword = 'AdminPassword123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'PCC Admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    // 2. 1,750 HYMNS (Full Scale Database Test)
    await prisma.hymn.deleteMany({});
    const coreHymns = [
        { number: 1, title: 'Amazing Grace', author: 'Newton', tags: 'grace, faith' },
        { number: 12, title: 'It Is Well With My Soul', author: 'Spafford', tags: 'comfort, peace' },
        { number: 34, title: 'How Great Thou Art', author: 'Boberg', tags: 'praise' },
        { number: 47, title: 'Be Thou My Vision', author: 'Irish', tags: 'faith' },
        { number: 58, title: 'Holy, Holy, Holy', author: 'Heber', tags: 'praise' },
        { number: 71, title: 'Blessed Assurance', author: 'Crosby', tags: 'comfort' },
    ];

    const lyricsPlaceholder = (title, num) => `This is the sacred lyrics for hymn number ${num}: "${title}". \n\nIt is part of the comprehensive Presbyterian Church of Cameroon (PCC) digital hymnal collection.\n\n[Verse 1]\nLord of all creation, we lift our hearts to You.\n\n[Chorus]\nHallelujah, the Lord reigns forevermore!`;

    const bulkCount = 1744; // Total = 1750
    const allHymns = [...coreHymns.map(h => ({ ...h, lyrics: lyricsPlaceholder(h.title, h.number) }))];

    const authors = ['PCC Composer', 'Ancient Hymnology', 'Spiritual Heritage', 'Choir Master', 'Scriptural Melody'];
    const tagsPool = ['praise', 'worship', 'faith', 'hope', 'grace', 'comfort', 'advent', 'holy', 'devotion'];

    for (let i = 0; i < bulkCount; i++) {
        const num = 100 + i;
        allHymns.push({
            number: num,
            title: `Divine Hymn ${num}`,
            author: authors[i % authors.length],
            tags: `${tagsPool[i % tagsPool.length]}, ${tagsPool[(i + 2) % tagsPool.length]}`,
            lyrics: lyricsPlaceholder(`Divine Hymn ${num}`, num)
        });
    }

    console.log(`Starting bulk insert of ${allHymns.length} hymns...`);
    // Batching for performance
    for (let i = 0; i < allHymns.length; i += 100) {
        const batch = allHymns.slice(i, i + 100);
        await Promise.all(batch.map(h => prisma.hymn.create({ data: h })));
        console.log(`Seeded ${i + batch.length} hymns...`);
    }

    // 3. 20 DIARY ENTRIES
    await prisma.diaryEntry.deleteMany({});
    const bulkDiary = Array.from({ length: 20 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            date: d,
            title: `Faith Reflection - Day ${i + 1}`,
            readingOne: `Psalm ${23 + i}`,
            readingTwo: `Matthew ${5 + i % 10}:1-10`,
            theme: i % 3 === 0 ? 'Worship' : (i % 3 === 1 ? 'Gratitude' : 'Peace'),
            body: `Today we reflect on the goodness of the Lord. Experience the transformation through daily prayer and scripture meditation in the PCC community.`
        };
    });

    for (const de of bulkDiary) {
        await prisma.diaryEntry.create({ data: de });
    }

    // 4. THE ECHO ISSUES
    await prisma.theEchoIssue.deleteMany({});
    const issues = [
        { title: 'The Call to Ministry', category: 'testimony', issueMonth: new Date(), isFree: true, coverUrl: '✝', pdfUrl: '/echo/1.pdf' },
        { title: 'Grace in Everyday Life', category: 'music', issueMonth: new Date(), isFree: true, pdfUrl: '/echo/2.pdf' },
        { title: 'Youth Awakening', category: 'news', issueMonth: new Date(), isFree: true, pdfUrl: '/echo/3.pdf' },
        { title: 'The Path of the Disciple', category: 'community', issueMonth: new Date(), isFree: true, pdfUrl: '/echo/4.pdf' },
        { title: 'Healing the Wounded Soul', category: 'testimony', issueMonth: new Date(), isFree: true, pdfUrl: '/echo/5.pdf' },
    ];

    for (const issue of issues) {
        await prisma.theEchoIssue.create({ data: issue });
    }

    // 5. DEVOTIONALS
    await prisma.devotional.deleteMany({});
    const devos = [
        { title: 'Still Waters', date: new Date(), content: 'The Lord is my shepherd...', author: 'Pastor James' },
        { title: 'The Light of the World', date: new Date(), content: 'Walk in the light as He is in the light.', author: 'Admin' }
    ];

    for (const d of devos) {
        await prisma.devotional.create({ data: d });
    }

    // 6. ANNOUNCEMENTS
    await prisma.announcement.deleteMany({});
    await prisma.announcement.create({
        data: { title: 'Annual Harvest Thanksgiving', content: 'Join us this Sunday!', isActive: true }
    });
    await prisma.announcement.create({
        data: { title: 'New Digital Archive Launch', content: 'Explore the full hymnal library online now.', isActive: true }
    });

    console.log('✅ 50+ Hymns and 20+ Diary Entries Seeded Successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
