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

    // 2. 50 HYMNS (Large Volume for Pagination Testing)
    await prisma.hymn.deleteMany({});
    const coreHymns = [
        { number: 1, title: 'Amazing Grace', author: 'Newton', tags: 'grace, faith' },
        { number: 12, title: 'It Is Well With My Soul', author: 'Spafford', tags: 'comfort, peace' },
        { number: 34, title: 'How Great Thou Art', author: 'Boberg', tags: 'praise' },
        { number: 47, title: 'Be Thou My Vision', author: 'Irish', tags: 'faith' },
        { number: 58, title: 'Holy, Holy, Holy', author: 'Heber', tags: 'praise' },
        { number: 71, title: 'Blessed Assurance', author: 'Crosby', tags: 'comfort' },
        { number: 85, title: 'Great Is Thy Faithfulness', author: 'Chisholm', tags: 'faith' },
        { number: 93, title: 'Be Still, My Soul', author: 'Schlegel', tags: 'peace' },
    ];

    const lyricsPlaceholder = (title) => `This is the lyrics for the beautiful hymn "${title}". \n\nIt contains words of praise, faith, and spiritual encouragement for all believers in the Presbyterian Church of Cameroon.\n\n[Verse 1]\nCome before Him with joyful singing.\n\n[Chorus]\nAlleluia, Praise His name!`;

    const bulkHymns = Array.from({ length: 42 }).map((_, i) => ({
        number: 100 + i,
        title: `Sacred Hymn ${100 + i}`,
        author: 'PCC Composer',
        tags: i % 2 === 0 ? 'praise, worship' : 'devotion, faith',
        lyrics: lyricsPlaceholder(`Sacred Hymn ${100 + i}`)
    }));

    const allHymns = [...coreHymns.map(h => ({ ...h, lyrics: lyricsPlaceholder(h.title) })), ...bulkHymns];

    for (const h of allHymns) {
        await prisma.hymn.create({ data: h });
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
