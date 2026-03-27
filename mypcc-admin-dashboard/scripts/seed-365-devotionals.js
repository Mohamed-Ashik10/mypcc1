const { PrismaClient } = require('@prisma/client');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

const prisma = new PrismaClient();

// A substantial collection of scriptures and themes to combine into 365 days
const scriptureBank = [
    { ref: "Psalm 23:1", text: "The Lord is my shepherd; I shall not want.", theme: "Provision" },
    { ref: "Proverbs 3:5", text: "Trust in the Lord with all your heart, and lean not on your own understanding.", theme: "Trust" },
    { ref: "Philippians 4:13", text: "I can do all things through Christ who strengthens me.", theme: "Strength" },
    { ref: "John 14:27", text: "Peace I leave with you, My peace I give to you.", theme: "Peace" },
    { ref: "Isaiah 40:31", text: "They that wait upon the Lord shall renew their strength.", theme: "Patience" },
    { ref: "Romans 8:28", text: "And we know that all things work together for good to those who love God.", theme: "Hope" },
    { ref: "Matthew 11:28", text: "Come to Me, all you who labor and are heavy laden, and I will give you rest.", theme: "Rest" },
    { ref: "Hebrews 11:1", text: "Faith is the substance of things hoped for, the evidence of things not seen.", theme: "Faith" },
    { ref: "1 Corinthians 13:13", text: "And now abide faith, hope, love, these three; but the greatest of these is love.", theme: "Love" },
    { ref: "Psalm 46:1", text: "God is our refuge and strength, a very present help in trouble.", theme: "Protection" },
    { ref: "Lamentations 3:22-23", text: "Through the Lord's mercies we are not consumed, because His compassions fail not. They are new every morning.", theme: "Faithfulness" },
    { ref: "Jeremiah 29:11", text: "For I know the thoughts that I think toward you, says the Lord, thoughts of peace and not of evil, to give you a future and a hope.", theme: "Purpose" },
    { ref: "James 1:5", text: "If any of you lacks wisdom, let him ask of God, who gives to all liberally and without reproach.", theme: "Wisdom" },
    { ref: "Joshua 1:9", text: "Be strong and of good courage; do not be afraid, nor be dismayed, for the Lord your God is with you wherever you go.", theme: "Courage" },
    { ref: "Ephesians 2:8", text: "For by grace you have been saved through faith, and that not of yourselves; it is the gift of God.", theme: "Grace" },
    { ref: "Psalm 119:105", text: "Your word is a lamp to my feet and a light to my path.", theme: "Guidance" },
    { ref: "Romans 12:2", text: "And do not be conformed to this world, but be transformed by the renewing of your mind.", theme: "Transformation" },
    { ref: "Galatians 5:22-23", text: "But the fruit of the Spirit is love, joy, peace, longsuffering, kindness, goodness, faithfulness, gentleness, self-control.", theme: "Character" },
    { ref: "Psalm 34:8", text: "Oh, taste and see that the Lord is good; Blessed is the man who trusts in Him!", theme: "Goodness" },
    { ref: "Micah 6:8", text: "He has shown you, O man, what is good; and what does the Lord require of you but to do justly, to love mercy, and to walk humbly with your God?", theme: "Humility" },
    // Adding more to ensure we have enough diversity for 365
    { ref: "Matthew 6:33", text: "But seek first the kingdom of God and His righteousness, and all these things shall be added to you.", theme: "Priorities" },
    { ref: "Psalm 121:1-2", text: "I will lift up my eyes to the hills—From whence comes my help? My help comes from the Lord.", theme: "Assistance" },
    { ref: "Colossians 3:2", text: "Set your mind on things above, not on things on the earth.", theme: "Perspective" },
    { ref: "Romans 15:13", text: "Now may the God of hope fill you with all joy and peace in believing.", theme: "Fullness" },
    { ref: "Psalm 27:1", text: "The Lord is my light and my salvation; Whom shall I fear?", theme: "Confidence" },
    { ref: "2 Timothy 1:7", text: "For God has not given us a spirit of fear, but of power and of love and of a sound mind.", theme: "Power" },
    { ref: "1 Peter 5:7", text: "Casting all your care upon Him, for He cares for you.", theme: "Care" },
    { ref: "Psalm 100:4", text: "Enter into His gates with thanksgiving, and into His courts with praise.", theme: "Gratitude" },
    { ref: "John 10:10", text: "I have come that they may have life, and that they may have it more abundantly.", theme: "Abundance" },
    { ref: "Philippians 4:6-7", text: "Be anxious for nothing, but in everything by prayer... let your requests be made known to God.", theme: "Prayer" }
    // In a real scenario, this list would be 365 items long. 
    // For this script, I will generate content by combining these scriptures with varying reflections.
];

const reflectionTemplates = [
    "Today, we consider how [Theme] plays a vital role in our walk with Christ. Looking at [Ref], we see that God's plan is always for our growth. When we face trials, we can remember that [Text]. This isn't just a suggestion; it is a promise we can hold onto in every circumstance.",
    "In the quiet moments of the morning, [Text] reminds us that our identity is found in Him alone. [Ref] is a beautiful reminder that [Theme] is not something we earn, but something He freely gives. Let this truth settle in your heart today.",
    "The journey of faith often requires [Theme]. As it says in [Ref], '[Text]'. This encourages us to look past our current struggles and see the eternal hope we have in Jesus. Walk today with the confidence that He is leading you.",
    "Let [Text] be your anchor as you navigate the day ahead. [Ref] shows us that [Theme] is the foundation of a peaceful life. No matter what comes your way, you are held by the Creator who loves you beyond measure.",
    "When we feel overwhelmed, the words of [Ref] offer a sanctuary: '[Text]'. We often try to carry burdens we were never meant to hold. Today, practice [Theme] by handing over your worries to the One who cares for you."
];

const prayerTemplates = [
    "Heavenly Father, thank You for the reminder of Your [Theme] today. Help me to trust [Ref] and live out [Text]. May my life reflect Your love to everyone I meet. Amen.",
    "Lord, I ask for Your guidance as I meditate on [Text]. Teach me the true meaning of [Theme] through Your word in [Ref]. Still my heart and lead me beside quiet waters. Amen.",
    "God, I am grateful for the truth found in [Ref]. Help me to remember that [Text] when I am tempted to doubt. Let Your [Theme] be my strength today and always. Amen.",
    "Father, thank You for Your presence. As I consider [Text] from [Ref], I pray that You would increase my capacity for [Theme]. Guide my steps and keep me in Your perfect peace. Amen."
];

async function seed365() {
    console.log("Starting 365-day devotional seed with chunking and retries...");
    const startDate = new Date("2026-03-03");
    const allData = [];

    for (let i = 0; i < 365; i++) {
        const currentDate = new Date(startDate);
        currentDate.setDate(startDate.getDate() + i);

        const sSource = scriptureBank[i % scriptureBank.length];
        const rTemplate = reflectionTemplates[i % reflectionTemplates.length];
        const pTemplate = prayerTemplates[i % prayerTemplates.length];
        const title = `${sSource.theme}: Day ${i + 1}`;
        const reflection = rTemplate.replace(/\[Theme\]/g, sSource.theme).replace(/\[Ref\]/g, sSource.ref).replace(/\[Text\]/g, sSource.text);
        const prayer = pTemplate.replace(/\[Theme\]/g, sSource.theme).replace(/\[Ref\]/g, sSource.ref).replace(/\[Text\]/g, sSource.text);
        const content = `> [!NOTE]\n> "${sSource.text}"\n> ${sSource.ref}\n\n### Reflection\n${reflection}\n\n### Prayer\n${prayer}\n\n### Companion Hymn\nBlessed Assurance`;

        allData.push({
            title,
            date: currentDate,
            content,
            author: "PCC Content Editor"
        });
    }

    const chunkSize = 30;
    for (let i = 0; i < allData.length; i += chunkSize) {
        const chunk = allData.slice(i, i + chunkSize);
        console.log(`Processing chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(allData.length / chunkSize)}...`);

        let success = false;
        let retries = 5;
        while (!success && retries > 0) {
            try {
                const result = await prisma.devotional.createMany({
                    data: chunk,
                    skipDuplicates: true
                });
                console.log(`  Added ${result.count} days.`);
                success = true;
            } catch (e) {
                retries--;
                console.error(`  Error in chunk ${i}: ${e.message}. Retries left: ${retries}`);
                if (retries > 0) {
                    console.log(`  Waiting 3s before retry...`);
                    await sleep(3000);
                } else {
                    console.error(`  Giving up on chunk ${i} after 5 attempts.`);
                }
            }
        }
    }

    await prisma.$disconnect();
    console.log("365-day seeding process finished.");
}

seed365();
