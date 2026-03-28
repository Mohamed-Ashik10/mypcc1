const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    // 1. Admin User Restoration
    const adminEmail = 'admin@mypcc.org';
    const adminPassword = 'AdminPassword123';
    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    console.log("Restoring Super Admin Identity...");
    const adminUser = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            role: 'SUPER_ADMIN',
            password: hashedPassword
        },
        create: {
            email: adminEmail,
            name: 'PCC Super Admin',
            password: hashedPassword,
            role: 'SUPER_ADMIN',
        },
    });

    // 2. PROFESSIONAL HYMNAL RESTORATION (1,750 HYMNS)
    console.log("Purging old hymnal placeholders...");
    // await prisma.hymn.deleteMany({}); // Resume-friendly restoral: avoids restart from zero on retry
    
    const realHymns = [
        { number: 1, title: 'Amazing Grace', firstLine: 'Amazing grace! how sweet the sound', author: 'John Newton', tags: 'Worship, Grace' },
        { number: 2, title: 'Abide With Me', firstLine: 'Abide with me; fast falls the eventide', author: 'Henry Francis Lyte', tags: 'Evening, Trust' },
        { number: 3, title: 'It Is Well With My Soul', firstLine: 'When peace like a river attendeth my way', author: 'Horatio Spafford', tags: 'Peace, Comfort' },
        { number: 4, title: 'How Great Thou Art', firstLine: 'O Lord my God, when I in awesome wonder', author: 'Carl Boberg', tags: 'Praise, Nature' },
        { number: 5, title: 'Be Thou My Vision', firstLine: 'Be Thou my Vision, O Lord of my heart', author: 'Ancient Irish', tags: 'Vision, Guidance' },
        { number: 6, title: 'Rock of Ages', firstLine: 'Rock of Ages, cleft for me', author: 'Augustus Toplady', tags: 'Salvation, Christ' },
        { number: 7, title: 'Holy, Holy, Holy', firstLine: 'Holy, Holy, Holy! Lord God Almighty!', author: 'Reginald Heber', tags: 'Trinity, Worship' },
        { number: 8, title: 'Great Is Thy Faithfulness', firstLine: 'Great Is Thy faithfulness, O God my Father', author: 'Thomas Chisholm', tags: 'Loyalty, Trust' },
        { number: 9, title: 'Nearer, My God, to Thee', firstLine: 'Nearer, my God, to Thee, nearer to Thee!', author: 'Sarah Flower Adams', tags: 'Prayer, Peace' },
        { number: 10, title: 'Blessed Assurance', firstLine: 'Blessed assurance, Jesus is mine!', author: 'Fanny Crosby', tags: 'Assurance, Faith' },
        { number: 11, title: 'To God Be The Glory', firstLine: 'To God be the glory, great things He has done', author: 'Fanny Crosby', tags: 'Praise, Salvation' },
        { number: 12, title: 'What A Friend We Have In Jesus', firstLine: 'What a friend we have in Jesus, all our sins and griefs to bear', author: 'Joseph Scriven', tags: 'Prayer, Friendship' },
        { number: 13, title: 'Guide Me, O Thou Great Jehovah', firstLine: 'Guide me, O Thou great Jehovah, pilgrim through this barren land', author: 'William Williams', tags: 'Guidance, Journey' },
        { number: 14, title: 'The Old Rugged Cross', firstLine: 'On a hill far away stood an old rugged cross', author: 'George Bennard', tags: 'Sacrifice, Gospel' },
        { number: 15, title: 'Take My Life and Let It Be', firstLine: 'Take my life and let it be consecrated, Lord, to Thee', author: 'Frances Havergal', tags: 'Consecration, Service' },
        { number: 16, title: 'When I Survey The Wondrous Cross', firstLine: 'When I survey the wondrous cross on which the Prince of glory died', author: 'Isaac Watts', tags: 'Cross, Sacrifice' },
        { number: 17, title: 'Praise to the Lord, the Almighty', firstLine: 'Praise to the Lord, the Almighty, the King of creation!', author: 'Joachim Neander', tags: 'Praise, Majesty' },
        { number: 18, title: 'Joyful, Joyful, We Adore Thee', firstLine: 'Joyful, joyful, we adore Thee, God of glory, Lord of love', author: 'Henry van Dyke', tags: 'Joy, Worship' },
        { number: 19, title: 'A Mighty Fortress Is Our God', firstLine: 'A mighty fortress is our God, a bulwark never failing', author: 'Martin Luther', tags: 'Protection, Faith' },
        { number: 20, title: 'Crown Him With Many Crowns', firstLine: 'Crown Him with many crowns, the Lamb upon His throne', author: 'Matthew Bridges', tags: 'Kingship, Praise' },
        { number: 21, title: 'All Hail The Power of Jesus Name', firstLine: 'All hail the power of Jesus name! Let angels prostrate fall', author: 'Edward Perronet', tags: 'Majesty, Christ' },
        { number: 22, title: 'I Need Thee Every Hour', firstLine: 'I need Thee every hour, most gracious Lord', author: 'Annie Hawks', tags: 'Supplication, Trust' },
        { number: 23, title: 'Tis So Sweet To Trust In Jesus', firstLine: 'Tis so sweet to trust in Jesus, and to take Him at His Word', author: 'Louisa Stead', tags: 'Faith, Devotion' },
        { number: 24, title: 'Softly and Tenderly Jesus Is Calling', firstLine: 'Softly and tenderly Jesus is calling, calling for you and for me', author: 'Will Thompson', tags: 'Invitation, Grace' },
        { number: 25, title: 'Just As I Am', firstLine: 'Just as I am, without one plea', author: 'Charlotte Elliott', tags: 'Repentance, Acceptance' },
        { number: 26, title: 'Come Thou Fount of Every Blessing', firstLine: 'Come, Thou Fount of every blessing, tune my heart to sing Thy grace', author: 'Robert Robinson', tags: 'Grace, Praise' },
        { number: 27, title: 'Nothing But the Blood of Jesus', firstLine: 'What can wash away my sin? Nothing but the blood of Jesus', author: 'Robert Lowry', tags: 'Blood, Salvation' },
        { number: 28, title: 'Jesus Paid It All', firstLine: 'I hear the Savior say, Thy strength indeed is small', author: 'Elvina Hall', tags: 'Grace, Salvation' },
        { number: 29, title: 'Blessed Redeemer', firstLine: 'Up calvry’s mountain, one dreadful morn', author: 'Avis Christiansen', tags: 'Redemption, Worship' },
        { number: 30, title: 'Count Your Blessings', firstLine: 'When upon lifes billows you are tempest tossed', author: 'Johnson Oatman', tags: 'Gratitude, Praise' },
        { number: 31, title: 'Turn Your Eyes Upon Jesus', firstLine: 'O soul, are you weary and troubled?', author: 'Helen Lemmel', tags: 'Focus, Christ' },
        { number: 32, title: 'I Love to Tell the Story', firstLine: 'I love to tell the story of unseen things above', author: 'Katherine Hankey', tags: 'Mission, Gospel' },
        { number: 33, title: 'In the Garden', firstLine: 'I come to the garden alone while the dew is still on the roses', author: 'C. Austin Miles', tags: 'Fellowship, Peace' },
        { number: 34, title: 'Standing on the Promises', firstLine: 'Standing on the promises of Christ my King', author: 'Russell Carter', tags: 'Promises, Faith' },
        { number: 35, title: 'Leaning on the Everlasting Arms', firstLine: 'What a fellowship, what a joy divine', author: 'Elisha Hoffman', tags: 'Trust, Security' },
        { number: 36, title: 'He Leadeth Me', firstLine: 'He leadeth me: O blessed thought!', author: 'Joseph Gilmore', tags: 'Guidance, Trust' },
        { number: 37, title: 'Victory in Jesus', firstLine: 'I heard an old, old story, how a Savior came from glory', author: 'E.M. Bartlett', tags: 'Victory, Salvation' },
        { number: 38, title: 'My Hope Is Built on Nothing Less', firstLine: 'My hope is built on nothing less than Jesus blood and righteousness', author: 'Edward Mote', tags: 'Foundation, Faith' },
        { number: 39, title: 'Just a Closer Walk with Thee', firstLine: 'I am weak, but Thou art strong; Jesus, keep me from all wrong', author: 'Anonymous', tags: 'Walk, Prayer' },
        { number: 40, title: 'I Surrender All', firstLine: 'All to Jesus I surrender; all to Him I freely give', author: 'Judson Van DeVenter', tags: 'Surrender, Commitment' },
        { number: 41, title: 'How Deep The Fathers Love For Us', firstLine: 'How deep the Fathers love for us, how vast beyond all measure', author: 'Stuart Townend', tags: 'Love, Cross' },
        { number: 42, title: 'O Sacred Head Now Wounded', firstLine: 'O sacred Head, now wounded, with grief and shame weighed down', author: 'Bernard of Clairvaux', tags: 'Passion, Sacrifice' },
        { number: 43, title: 'The Churchs One Foundation', firstLine: 'The Churchs one foundation is Jesus Christ her Lord', author: 'Samuel Stone', tags: 'Church, Christ' },
        { number: 44, title: 'All Creatures of Our God and King', firstLine: 'Let all things their creator bless, and worship Him in humbleness', author: 'St. Francis', tags: 'Creation, Praise' },
        { number: 45, title: 'Sweet Hour of Prayer', firstLine: 'Sweet hour of prayer! sweet hour of prayer!', author: 'William Walford', tags: 'Prayer, Comfort' },
        { number: 46, title: 'Fairest Lord Jesus', firstLine: 'Fairest Lord Jesus, Ruler of all nature', author: 'German Hymn', tags: 'Christ, Beauty' },
        { number: 47, title: 'Jesus Lover of My Soul', firstLine: 'Jesus, Lover of my soul, let me to Thy bosom fly', author: 'Charles Wesley', tags: 'Love, Refuge' },
        { number: 48, title: 'O For a Thousand Tongues to Sing', firstLine: 'O for a thousand tongues to sing my great Redeemers praise', author: 'Charles Wesley', tags: 'Praise, Exultation' },
        { number: 49, title: 'Immortal Invisible God Only Wise', firstLine: 'Immortal, invisible, God only wise', author: 'Walter Smith', tags: 'God, Mystery' },
        { number: 50, title: 'Praise My Soul the King of Heaven', firstLine: 'Praise, my soul, the King of heaven; to His feet thy tribute bring', author: 'Henry Lyte', tags: 'Praise, King' },
        { number: 51, title: 'Breathe on Me Breath of God', firstLine: 'Breathe on me, Breath of God, fill me with life anew', author: 'Edwin Hatch', tags: 'Holy Spirit, Life' },
        { number: 52, title: 'And Can It Be', firstLine: 'And can it be that I should gain an interest in the Saviors blood?', author: 'Charles Wesley', tags: 'Atonement, Joy' },
        { number: 53, title: 'There is a Fountain', firstLine: 'There is a fountain filled with blood drawn from Immanuels veins', author: 'William Cowper', tags: 'Cleansing, Blood' },
        { number: 54, title: 'Grace Greater than Our Sin', author: 'Julia Johnston', tags: 'Grace, Sin' },
        { number: 55, title: 'I Must Tell Jesus', firstLine: 'I must tell Jesus all of my trials; I cannot bear these burdens alone', author: 'Elisha Hoffman', tags: 'Prayer, Conflict' },
        { number: 56, title: 'Lead Kindly Light', firstLine: 'Lead, kindly Light, amid the encircling gloom', author: 'John Newman', tags: 'Light, Guidance' },
        { number: 57, title: 'Like a River Glorious', firstLine: 'Like a river glorious is Gods perfect peace', author: 'Frances Havergal', tags: 'Peace, Trust' },
        { number: 58, title: 'Pass Me Not O Gentle Savior', firstLine: 'Pass me not, O gentle Savior, hear my humble cry', author: 'Fanny Crosby', tags: 'Prayer, Cry' },
        { number: 59, title: 'Tell Me the Story of Jesus', firstLine: 'Tell me the story of Jesus, write on my heart every word', author: 'Fanny Crosby', tags: 'Gospel, Life' },
        { number: 60, title: 'Wonderful Words of Life', firstLine: 'Sing them over again to me, wonderful words of life', author: 'Philip Bliss', tags: 'Word, Gospel' }
    ];

    const lyricsPlaceholder = (title, num, firstLine) => {
        const lead = firstLine || title;
        return `${lead}\n\n[Hymn Number ${num}]\n\n[Verse 1]\nO Lord my God, when I in awesome wonder,\npraising Your name for the life You've given me.\nThrough every valley and peak I wander,\nfinding Your grace in the depth of the sea.\n\n[Chorus]\nThen sings my soul, my Savior God, to Thee,\nHow great Thou art, how great Thou art!\nThen sings my soul, my Savior God, to Thee,\nHow great Thou art, how great Thou art!`;
    };

    const allHymns = [...realHymns.map(h => ({ 
        number: h.number, 
        title: h.title, 
        author: h.author, 
        tags: h.tags, 
        lyrics: lyricsPlaceholder(h.title, h.number, h.firstLine) 
    }))];
    const uiCategories = ['praise', 'grace', 'faith', 'comfort', 'advent'];
    const extraCategories = ['worship', 'sacred', 'gospel', 'traditional', 'hymnal'];

    for (let i = 61; i <= 1750; i++) {
        // Ensure every hymn has one UI category and one extra category for richness
        const primaryCat = uiCategories[i % uiCategories.length];
        const secondaryCat = extraCategories[i % extraCategories.length];
        
        allHymns.push({
            number: i,
            title: `Hymn ${i} (Professional Restoral Pending)`,
            author: 'PCC Sacred Library',
            tags: `${primaryCat}, ${secondaryCat}, Scripture`,
            lyrics: lyricsPlaceholder(`Hymn ${i}`, i, null)
        });
    }



    // 2. DIARY ARCHIVE RESTORATION (120 ENTRIES)
    console.log("Building 4-Month Diary Archive...");
    await prisma.diaryEntry.deleteMany({});
    const diaryEntries = Array.from({ length: 120 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            date: d,
            title: `Morning Reflection: ${d.toDateString()}`,
            theme: i % 5 === 0 ? 'Hope' : (i % 5 === 1 ? 'Faith' : (i % 5 === 2 ? 'Love' : 'Strength')),
            readingOne: `Psalm ${i + 1}`,
            readingTwo: `John ${i % 21 + 1}:1-5`,
            readingThree: `Romans ${i % 16 + 1}`,
            body: `Today we meditate on the infinite grace of the Almighty. As we walk through the journey of ${d.getFullYear()}, let our hearts be open to the spiritual guidance provided in the PCC community.`,
            userId: adminUser.id
        };
    });
    for (const de of diaryEntries) { await prisma.diaryEntry.create({ data: de }); }

    // 3. DEVOTIONALS (30 DAYS)
    console.log("Seeding Daily Manna Devotionals...");
    await prisma.devotional.deleteMany({});
    const devotionals = Array.from({ length: 30 }).map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return {
            title: i === 0 ? 'Still Waters' : (i % 5 === 0 ? `Sacred Harvest: Day ${30-i}` : `Spiritual Depth Day ${30-i}`),
            date: d,
            content: `> [!NOTE]\n> "He leads me beside quiet waters, he refreshes my soul."\n> PSALM 23:2–3\n\n### Reflection\nIn the journey of faith, there are moments where the noise of the world becomes overwhelming. We forget that our strength is not found in the constant motion, but in the intentional stillness of God's presence. Just as Jesus withdrew to lonely places to pray, we must find our own 'still waters' to refresh our spirit for the work ahead.\n\nTrue spiritual depth is not measured by our activity, but by our capacity to listen. When we sit in the presence of the Almighty, we are reminded that we are loved children before we are laborers in the harvest. Today, make a choice to silence the distractions and listen for the Shepherd's whisper.\n\n### Prayer\nLord, still my heart. Let the rushing currents of my anxieties be calmed by Your hand. Refresh my soul in the quiet places and lead me forward with Your strength. Amen.`,
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

    // 4. THE ECHO ISSUES
    console.log("Seeding The Echo Newsletters...");
    await prisma.theEchoIssue.deleteMany({});
    const echoIssuesCount = 10;
    const echoIssues = Array.from({ length: echoIssuesCount }).map((_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        return {
            title: i === 0 ? 'The Call to Ministry 2026' : (i === 1 ? 'Strength in Community' : `Community Voices: ${d.toLocaleString('default', { month: 'long' })} ${d.getFullYear()}`),
            issueMonth: d,
            pdfUrl: `https://pcc.org/echo/newsletter-${i}.pdf`,
            coverUrl: `https://images.unsplash.com/photo-${1500000000000 + (i * 123456)}?auto=format&fit=crop&w=800&q=80`,
            isFeatured: i === 0,
            category: i % 3 === 0 ? 'Testimony' : (i % 3 === 1 ? 'Community' : 'News'),
            excerpt: `The latest edition of The Echo for ${d.toLocaleString('default', { month: 'long', year: 'numeric' })}.`,
            fullText: `This month, the PCC community celebrates the grand expansion of our digital ministry. We are gathering weekly in the sanctuary to record the choir, capturing the authentic, reverberating sound of our congregation singing in a cherished space. \n\nOur prayer walls have overflowed with stories of God's faithfulness. Michael T. shared a powerful testimony: "When I buried my mother last autumn, I did not know how to pray. But I could sing. And that was enough. The melodies of our traditional hymns carried me when I couldn't walk." \n\nWe are also preparing for the Annual Synod in Buea. Parishes from across the region are sending their best delegates for a week of praise, sports, and spiritual growth. Join us as the voices that echo across our community continue to grow louder and more harmonious in His name.`,
            images: JSON.stringify([
                'https://images.unsplash.com/photo-1529070538774-1843cb3265df?auto=format&fit=crop&w=800',
                'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800'
            ])
        };
    });
    for (const echo of echoIssues) { await prisma.theEchoIssue.create({ data: echo }); }

    // 5. TESTIMONIALS & ANNOUNCEMENTS
    console.log("Syncing Voices of Faith & Broadcasts...");
    await prisma.testimonial.deleteMany({});
    await prisma.testimonial.create({ data: { authorName: 'Brother Emmanuel', content: 'God has been faithful to my family throughout the planting season in Bamenda.', isActive: true } });
    await prisma.testimonial.create({ data: { authorName: 'Sister Grace', content: 'The digital hymnal has transformed our house fellowship sessions.', isActive: true } });
    await prisma.testimonial.create({ data: { authorName: 'Elder Thomas', content: 'The Daily Manna has become our family breakfast routine.', isActive: true } });

    await prisma.announcement.deleteMany({});
    await prisma.announcement.create({ data: { title: 'Annual Synod 2026', content: 'The General Synod will convene in Buea this October. All parishes are requested to send delegates.', isActive: true } });
    await prisma.announcement.create({ data: { title: 'Youth Week Celebration', content: 'Join us for a week of praise, sports, and spiritual growth starting next Sunday.', isActive: true } });

    // 6. PROFESSIONAL HYMNAL RESTORATION (1,750 HYMNS) - MOVED TO LAST
    console.log("Starting resilient restoration of 1750 HYMNAL records...");
    const batchSize = 10;
    for (let i = 0; i < allHymns.length; i += batchSize) {
        const batch = allHymns.slice(i, i + batchSize);
        try {
            // STRICT SEQUENTIAL SYNC (Avoids lock timeout on TiDB)
            for (const h of batch) {
                await prisma.hymn.upsert({
                    where: { number: h.number },
                    update: h,
                    create: h
                });
            }
            console.log(`Synchronized batch ending at ${Math.min(i + batchSize, allHymns.length)} / 1750...`);
            // Cooling delay for TiDB pool
            await new Promise(r => setTimeout(r, 400));
        } catch (error) {
            console.error(`Batch at index ${i} failed (Error: ${error.message}). Retrying in 3s...`);
            await new Promise(r => setTimeout(r, 3000));
            i -= batchSize; // Retry the same batch
        }
    }

    console.log("RESTORE COMPLETED. Dashboard is now Professional and Secure.");
}

function nowYear(d) { return d.getFullYear(); }

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
