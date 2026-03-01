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

    // 2. Hymns (Full 8 from preview)
    const hymns = [
        {
            number: 1,
            title: 'Amazing Grace',
            author: 'John Newton · 1779',
            tags: 'grace, faith',
            lyrics: `Amazing grace! How sweet the sound
That saved a wretch like me!
I once was lost, but now am found;
Was blind, but now I see.

'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed.

[REFRAIN]
My chains are gone, I have been set free
My God, my Savior has ransomed me
And like a flood His mercy rains
Unending love, Amazing Grace

Through many dangers, toils and snares,
I have already come;
'Tis grace hath brought me safe thus far,
And grace will lead me home.`
        },
        {
            number: 12,
            title: 'It Is Well With My Soul',
            author: 'Horatio Spafford · 1873',
            tags: 'comfort, peace, faith',
            lyrics: `When peace like a river attendeth my way,
When sorrows like sea billows roll;
Whatever my lot, Thou hast taught me to say,
It is well, it is well with my soul.

[REFRAIN]
It is well (it is well)
With my soul (with my soul)
It is well, it is well with my soul.

Though Satan should buffet, though trials should come,
Let this blest assurance control;
That Christ hath regarded my helpless estate,
And hath shed His own blood for my soul.`
        },
        {
            number: 34,
            title: 'How Great Thou Art',
            author: 'Carl Boberg · 1885',
            tags: 'praise, wonder',
            lyrics: `O Lord my God, when I in awesome wonder
Consider all the worlds Thy hands have made;
I see the stars, I hear the rolling thunder,
Thy power throughout the universe displayed.

[REFRAIN]
Then sings my soul, my Savior God, to Thee;
How great Thou art, how great Thou art!
Then sings my soul, my Savior God, to Thee;
How great Thou art, how great Thou art!`
        },
        {
            number: 47,
            title: 'Be Thou My Vision',
            author: 'Irish Hymn · 8th Century',
            tags: 'faith, devotion',
            lyrics: `Be Thou my vision, O Lord of my heart;
Nought be all else to me, save that Thou art;
Thou my best thought by day or by night,
Waking or sleeping, Thy presence my light.

Be Thou my wisdom, and Thou my true word;
I ever with Thee and Thou with me, Lord;
Thou my great Father, and I Thy true son,
Thou in me dwelling, and I with Thee one.`
        },
        {
            number: 58,
            title: 'Holy, Holy, Holy',
            author: 'Reginald Heber · 1826',
            tags: 'praise, advent',
            lyrics: `Holy, holy, holy! Lord God Almighty!
Early in the morning our song shall rise to Thee;
Holy, holy, holy! Merciful and mighty!
God in three Persons, blessed Trinity!

Holy, holy, holy! All the saints adore Thee,
Casting down their golden crowns around the glassy sea;
Cherubim and seraphim falling down before Thee,
Who wert and art and evermore shalt be.`
        },
        {
            number: 71,
            title: 'Blessed Assurance',
            author: 'Fanny Crosby · 1873',
            tags: 'comfort, grace',
            lyrics: `Blessed assurance, Jesus is mine!
O what a foretaste of glory divine!
Heir of salvation, purchase of God,
Born of His Spirit, washed in His blood.

[REFRAIN]
This is my story, this is my song,
Praising my Savior all the day long;
This is my story, this is my song,
Praising my Savior all the day long.`
        },
        {
            number: 85,
            title: 'Great Is Thy Faithfulness',
            author: 'Thomas O. Chisholm · 1923',
            tags: 'faith, praise',
            lyrics: `Great is Thy faithfulness, O God my Father,
There is no shadow of turning with Thee;
Thou changest not, Thy compassions, they fail not;
As Thou hast been, Thou forever wilt be.

[REFRAIN]
Great is Thy faithfulness! Great is Thy faithfulness!
Morning by morning new mercies I see;
All I have needed Thy hand hath provided;
Great is Thy faithfulness, Lord, unto me!`
        },
        {
            number: 93,
            title: 'Be Still, My Soul',
            author: 'Katharina von Schlegel · 1752',
            tags: 'comfort, peace, advent',
            lyrics: `Be still, my soul: the Lord is on thy side;
Bear patiently the cross of grief or pain;
Leave to thy God to order and provide;
In every change He faithful will remain.`
        }
    ];

    await prisma.hymn.deleteMany({});
    for (const h of hymns) {
        await prisma.hymn.create({ data: h });
    }

    // 3. Diary Entries (Full set from preview)
    const admin = await prisma.user.findUnique({ where: { email: adminEmail } });
    const diaryEntries = [
        {
            date: new Date('2026-02-25'),
            title: 'Morning of Quiet Grace',
            hymn: 'Great Is Thy Faithfulness',
            readingOne: 'Psalm 103',
            readingTwo: 'Ephesians 2:1-10',
            theme: 'Gratitude & Faithfulness',
            body: 'This morning I woke before sunrise and sat with this hymn for nearly an hour. The second verse felt like a letter written directly to me — "strength for today and bright hope for tomorrow." I have been carrying so much anxiety about the future, and those words settled something deep in me.'
        },
        {
            date: new Date('2026-02-20'),
            title: 'A Song in the Valley',
            hymn: 'It Is Well With My Soul',
            readingOne: 'Psalm 23',
            readingTwo: 'John 14:1-6',
            theme: 'Comfort & Trust',
            body: 'After receiving difficult news this week, I found myself returning to this hymn over and over. Spafford wrote it after losing his daughters — and yet those words. How can a man write "it is well" in that moment? I am beginning to understand.'
        },
        {
            date: new Date('2026-02-14'),
            title: 'Valentines Day Worship',
            hymn: 'Be Thou My Vision',
            readingOne: '1 Corinthians 13',
            theme: 'Worship & Devotion',
            body: 'We sang this at the special service today. The ancient simplicity of it moved me to tears - that a prayer so old can still be so entirely mine. Thou my best thought by day or by night. Yes. That.'
        }
    ];

    await prisma.diaryEntry.deleteMany({});
    for (const de of diaryEntries) {
        await prisma.diaryEntry.create({ data: { ...de } });
    }

    // 4. The Echo Issues (More articles to match preview)
    const echoIssues = [
        {
            title: 'From Doubt to Devotion: My Journey Back to the Church',
            category: 'testimony',
            author: 'Sarah M.',
            excerpt: 'For three years I stayed away. The questions felt too big, the silence too heavy. Then one Sunday morning, a single hymn changed everything…',
            fullText: 'I remember the day vividly. The sanctuary was filled with morning light, and as the congregation stood to sing "Amazing Grace," a profound sense of peace washed over my anxious heart...',
            issueMonth: new Date('2026-02-22'),
            pdfUrl: '/echo/2026-02.pdf',
            isFree: true,
            coverUrl: '✝'
        },
        {
            title: 'Why Ancient Hymns Still Speak to a Digital Generation',
            category: 'music',
            author: 'Pastor James L.',
            excerpt: 'In an age of worship anthems and streaming playlists, the old hymns are making a quiet, powerful comeback.',
            fullText: 'There is something grounding about singing the exact same words that believers sang three hundred years ago...',
            issueMonth: new Date('2026-02-19'),
            pdfUrl: '/echo/2026-02-hymns.pdf',
            isFree: true
        },
        {
            title: 'Community Choir Launches Hymn Recording Project',
            category: 'news',
            author: 'Admin',
            excerpt: 'Our beloved choir is preserving 100 classic hymns in studio-quality recordings for the Canticle library.',
            fullText: 'Over the next six months, the community choir will be gathering weekly in the sanctuary to record...',
            issueMonth: new Date('2026-02-15'),
            pdfUrl: '/echo/2026-02-choir.pdf',
            isFree: true
        },
        {
            title: 'Prayer Wall: Stories of Answered Prayer This Month',
            category: 'community',
            author: 'Community Team',
            excerpt: 'Seventeen members shared testimonies of answered prayers — from healing to provision to restored relationships.',
            fullText: 'This month, our digital and physical prayer walls have overflowed with stories of God\'s faithfulness...',
            issueMonth: new Date('2026-02-12'),
            pdfUrl: '/echo/2026-02-prayer.pdf',
            isFree: true
        },
        {
            title: 'The Hymn That Held Me Through Grief',
            category: 'testimony',
            author: 'Michael T.',
            excerpt: 'When I buried my mother last autumn, I did not know how to pray. But I could sing. And that was enough.',
            fullText: 'Grief has a way of silencing you. The traditional prayers felt hollow, and my own words wouldn\'t come out...',
            issueMonth: new Date('2026-02-08'),
            pdfUrl: '/echo/2026-02-grief.pdf',
            isFree: true
        }
    ];

    await prisma.theEchoIssue.deleteMany({});
    for (const issue of echoIssues) {
        await prisma.theEchoIssue.create({ data: issue });
    }

    // 5. Devotionals (Refined format)
    const devotionals = [
        {
            title: 'Still Waters',
            date: new Date('2026-02-25'),
            content: `> [!NOTE]
> "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul."
> PSALM 23:2–3

### Reflection
There are moments when the world demands more than we have to give. The noise becomes deafening — obligations pile up, anxieties whisper, and the pace of life never seems to slow. It is into precisely this moment that the Shepherd speaks: lie down.

The invitation to still waters is not passive surrender — it is an act of trust. To rest in God's provision is to declare, with your body and your breath, that He is enough. That today's worries are held. That you are known and guided.`,
            author: 'Pastor James L.'
        },
        {
            title: 'A Light Unto My Path',
            date: new Date('2026-02-24'),
            content: `> [!NOTE]
> "Your word is a lamp to my feet and a light to my path."
> PSALM 119:105

### Light in the Dark
In the darkest of times, the Word of God serves as our ultimate guide. It does not just illuminate the path but gives us the strength to walk it with confidence.`,
            author: 'Super Admin'
        }
    ];

    await prisma.devotional.deleteMany({});
    for (const d of devotionals) {
        await prisma.devotional.create({ data: d });
    }

    // 6. Announcements (Refined for Premium Look)
    const announcements = [
        {
            title: 'Annual Harvest Thanksgiving',
            content: 'Join us this Sunday for our Annual Harvest Thanksgiving service. We celebrate God\'s bountiful blessings over the past year with special musical offerings from the choir.',
            isActive: true
        },
        {
            title: 'Lenten Season Mid-week Services',
            content: 'Every Wednesday evening at 6:30 PM, we gather for a quiet service of reflection and prayer. Come find rest in the middle of your busy week.',
            isActive: true
        },
        {
            title: 'New Hymn Recording Project',
            content: 'Our beloved choir is preserving 100 classic hymns in studio-quality recordings. Volunteers needed for sound and logistics.',
            isActive: true
        }
    ];

    await prisma.announcement.deleteMany({});
    for (const a of announcements) {
        await prisma.announcement.create({ data: a });
    }

    console.log('✅ Extensive Data Restoration Complete!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
