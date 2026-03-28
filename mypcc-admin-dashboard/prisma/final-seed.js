const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("🚀 STARTING PREMIUM SEED V6 (HIGH-QUALITY IMAGES)...");

    const ids = [
        "photo-1544427920223-52fa316d259e", "photo-1518391846015-55a9cc003b25", 
        "photo-1507434965515-61970f2bd7c6", "photo-1529070538774-1843cb3265df",
        "photo-1438232992991-995b7058bbb3", "photo-1501167786227-4cba60f6d58f",
        "photo-1501281668745-f7f57925c3b4", "photo-1500382017468-9049fed747ef",
        "photo-1519315901367-f34ff9154487", "photo-1509021436665-8f07dbf5bf1d",
        "photo-1515091942623-587da79e2394", "photo-1516733725897-1aa73b87c8e8",
        "photo-1504052434569-70ad58ebb66b", "photo-1519074063912-ccc2fbf147d3",
        "photo-1498050108023-c5249f4df085", "photo-1521737711867-e3b97375f902",
        "photo-1517048676732-d65bc937f952", "photo-1460518451285-97b6aa3208cf",
        "photo-1522071823991-b1b571e94a47", "photo-1556761175-b413da4baf72"
    ];

    const getUrl = (idx) => `https://images.unsplash.com/${ids[idx % ids.length]}?auto=format&fit=crop&w=1200&q=80`;

    // 1. HYMNS (1750)
    console.log("Purging and Restoring 1,750 Hymns...");
    await prisma.hymn.deleteMany({});
    const prefixes = ["O", "Come", "Great", "Holy", "Sacred", "Faithful", "Divine", "Eternal", "Glorious", "Blessed", "Sweet", "Spirit of", "King of", "The Heart of", "Journey to", "Song of", "Voice of", "Light of", "Refuge of", "Fountain of", "Praise to", "Glory to", "Strength in", "Trust in"];
    const middle = ["Our", "The", "Thy", "Infinite", "Everlasting", "Victorious", "Radiant", "Boundless", "Sovereign", "Humble", "Ancient", "Modern", "Universal", "Heavenly"];
    const suffixes = ["Grace", "Mercy", "Worship", "Zion", "Praise", "Love", "Faith", "Hope", "Peace", "Light", "Savior", "Redeemer", "Creator", "Heavens", "The Cross", "The Morning", "The Kingdom", "The Way", "The Truth", "The Life", "The Resurrection"];

    const allHymns = Array.from({ length: 1750 }).map((_, i) => {
        const num = i + 1;
        const p = prefixes[i % prefixes.length];
        const m = middle[i % middle.length];
        const s = suffixes[i % suffixes.length];
        return {
            number: num,
            title: num === 1 ? 'Amazing Grace' : (num === 2 ? 'Abide With Me' : (num === 7 ? 'Holy, Holy, Holy' : `${p} ${m} ${s}`)),
            author: 'PCC Sacred Library',
            lyrics: `[Verse 1]\n${p} ${m} ${s} is our call...\n[Hymn #${num}]`
        };
    });
    await prisma.hymn.createMany({ data: allHymns });

    // 2. THE ECHO (12 UNIQUE STORIES)
    console.log("Purging and Seeding 12 Premium Echo Newsletters...");
    await prisma.theEchoIssue.deleteMany({});
    const stories = [
        { title: "The Strength in Our Community", excerpt: "How a small parish in the hills became a beacon of hope for thousands.", fullText: "Our community joined together to rebuild the local nursery, reflecting the love of Christ through practical service and persistent prayer. We saw the hand of God in every brick and every smile.\n\nPastor Joseph led the final prayer as the roof was completed, marking 12 months of collective effort. Over 500 families contributed their labor, ensuring that our children had a safe place to learn." },
        { title: "Echoes of the High Mountain", excerpt: "A spiritual retreat that changed the lives of 50 young worshippers.", fullText: "Last month, the youth ministry climbed Mount Cameroon, not just for the physical challenge, but for a spiritual awakening. Surrounded by the misty peaks, they gathered for sunrise prayers that echoed across the valleys.\n\nSister Lydia shared how the quietness of the summit allowed her to finally hear God's whisper. Many reported life-changing revelations." },
        { title: "Harmonies of the Heart", excerpt: "The restoration of our 100-year-old pipe organ and its first performance.", fullText: "For a decade, the grand organ sat silent. This February, after months of professional restoration, its pipes roared back to life during the Sunday service. The reverberation in the sanctuary was nothing short of divine.\n\nOrganist Samuel wept as he played 'The Old Rugged Cross'. The congregation sang with a renewed passion that filled every corner of the church." },
        { title: "Faith in the Digital Age", excerpt: "PCC's journey into the digital mission field and our global reach.", fullText: "The expansion of our digital ministry has connected PCC members from every continent. We are now recording our services to bridge the gap for those who cannot attend in person, ensuring our voices are never silent.\n\nOur prayer walls have overflowed with stories of God's faithfulness from across the globe. Michael T. shared a powerful testimony: 'When I buried my mother last autumn, I did not know how to pray. But I could sing.'" },
        { title: "The Annual Synod of Grace", excerpt: "Preparing for our largest gathering yet in the historic city of Buea.", fullText: "The General Synod will convene in Buea this October. All parishes are requested to send delegates for a week of praise, sports, and spiritual growth. The agenda focuses on our theme of 'Sustainable Faith'.\n\nJoin us as the voices that echo across our community continue to grow louder and more harmonious in His name." },
        { title: "The Morning Dew Reflections", excerpt: "A collection of short morning devotionals for the busy professional.", fullText: "In the rush of our modern lives, finding a moment for stillness is critical. Our 'Morning Dew' series provides concise, powerful reflections to ground your day in the Word.\n\nThis week's focus is on 'Quiet Waters'. Just as Jesus withdrew to lonely places to pray, we must find our own quiet places to refresh our spirit for the work ahead." },
        { title: "Voices from the Coastland", excerpt: "Ministry updates from our maritime parishes and their unique challenges.", fullText: "Our coastal ministry faces unique challenges, from monsoon seasons to the isolation of fishing villages. Yet, the faith of these communities remains as steady as the tide. We recently delivered 500 bibles to the island parishes.\n\nDeacon Mark reported that the hunger for the Word is greater than ever. The singing that rises from the beach-side services often drifts far out to sea." },
        { title: "The Legacy of Our Elders", excerpt: "Honoring the retired pastors who paved the way for our modern ministry.", fullText: "This month we celebrated the 'Elders Day', honoring over 50 retired ministers who served PCC for decades. Their wisdom remains our greatest asset as we navigate the complexities of the 21st century.\n\nElder Thomas shared stories of the early days, reminding us that while our tools change, the Message remains eternal." },
        { title: "Planting Seeds of Hope", excerpt: "The agricultural ministry's impact on food security in Bamenda.", fullText: "Our agricultural ministry in Bamenda has seen record harvests this year. Beyond feeding families, we are teaching sustainable farming practices rooted in the principle of stewardship of God's creation.\n\nBrother Peter noted that the shared labor in the fields has strengthened the parish bond. We are not just planting corn; we are planting hope." },
        { title: "The Healing Sanctuary", excerpt: "How our hospital visitation program is bringing light to the darkest hours.", fullText: "The hospital visitation program has grown to include 12 dedicated teams. Every day, they bring song, prayer, and presence to those in need. The results have been miraculous, both physically and spiritually.\n\nSister Maria shared a story of a patient who found peace through a simple hymn." },
        { title: "Music for the Soul", excerpt: "Our choir's first studio recording and the stories behind the songs.", fullText: "The choir has finally entered the studio to capture our traditional melodies for the digital hymnal. This project is about more than sound; it's about preserving the rhythm of our faith for the global community.\n\nEvery track was preceded by an hour of prayer. We want listeners to feel the presence of the Spirit in every note." },
        { title: "The Restoration of Faith", excerpt: "A look at our church's revitalization efforts following the recent storms.", fullText: "Following the devastating storms last autumn, several of our rural sanctuaries were left in ruins. But the church is not a building. Within weeks, the community rallied to restore what was lost, stronger than before.\n\nWe are now documenting the rebuilding process through photos and video. This story of resilience is a living parable of God's promise." }
    ];

    for (let i = 0; i < 12; i++) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const story = stories[i];
        const cats = ['testimony', 'news', 'music', 'community'];
        await prisma.theEchoIssue.create({
            data: {
                title: story.title, issueMonth: d, pdfUrl: 'pdf', excerpt: story.excerpt, fullText: story.fullText,
                category: cats[i % cats.length], isFeatured: i === 0,
                coverUrl: getUrl(i),
                images: JSON.stringify([getUrl(i+1), getUrl(i+2), getUrl(i+3)])
            }
        });
    }

    // 3. DEVOTIONALS (90)
    console.log("Purging and Seeding 90 Premium Devotionals...");
    await prisma.devotional.deleteMany({});
    const devotionals = Array.from({ length: 90 }).map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - i);
        return {
            title: i === 0 ? 'Spiritual Depth: Day 25' : `Sacred Journey Day ${90-i}`,
            date: d, author: i % 2 === 0 ? 'Pastor James' : 'Sister Martha',
            category: i % 3 === 0 ? 'FAITH' : 'GUIDANCE', excerpt: 'Deep reflections on the Word.', 
            image: getUrl(i + 5), reading: `Psalm 23:${(i % 15) + 1}`,
            isFree: i < 5, minPlan: i < 10 ? 'SEEKER' : (i < 30 ? 'PILGRIM' : 'SHEPHERD'),
            content: `### Reflection\nIn the journey of faith, Day ${90-i} reminds us that God's grace is not a one-time event but a consistent pursuit. He leads us to green pastures when we are weary and restores our soul when we are broken.\n\n### Prayer\nLord, help me to see Your hand today. Amen.`
        };
    });
    for (const dev of devotionals) { await prisma.devotional.create({ data: dev }); }

    console.log("🏆 PREMIUM SEED V6 COMPLETED.");
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });
