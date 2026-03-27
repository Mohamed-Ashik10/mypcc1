const { PrismaClient } = require('@prisma/client');
const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');

const prisma = new PrismaClient();

const newHymns = [
    {
        number: 101, // Starting from 101 to avoid overlaps
        title: "PCC Anthem",
        author: "Presbyterian Church in Cameroon",
        tags: "pcc, anthem, faith",
        lyrics: "Verse 1\nWith us in mind a better plan, he had\nWith us in mind a better plan, he had\nAlone he knew the secret plans he made\nHis secret plans and promises he keeps\nEven when centuries pass\nAlone he knew the secret plans he made\nEven when centuries pass\n\n[REFRAIN]\nPraise the Lord (praise the Lord)\nPraise the Lord (praise the Lord)\nWho takes care of you\nPraise the Lord (praise the Lord)\nPraise the Lord (praise the Lord)\nWho takes care of you\nHis secret plans and promises he keeps\nEven when centuries pass."
    },
    {
        number: 102,
        title: "A Mighty Fortress Is Our God",
        author: "Martin Luther",
        tags: "faith, strength, classic",
        lyrics: "Verse 1\nA mighty fortress is our God, a bulwark never failing;\nOur helper He, amid the flood of mortal ills prevailing:\nFor still our ancient foe doth seek to work us woe;\nHis craft and power are great, and, armed with cruel hate,\nOn earth is not his equal.\n\nVerse 2\nDid we in our own strength confide, our striving would be losing;\nWere not the right Man on our side, the Man of God's own choosing:\nDost ask who that may be? Christ Jesus, it is He;\nLord Sabaoth, His Name, from age to age the same,\nAnd He must win the battle.\n\nVerse 3\nAnd though this world, with devils filled, Should threaten to undo us,\nWe will not fear, for God hath willed His truth to triumph through us:\nThe Prince of Darkness grim, we tremble not for him;\nHis rage we can endure, for lo, his doom is sure,\nOne little word shall fell him.\n\nVerse 4\nThat word above all earthly powers, No thanks to them, abideth;\nThe Spirit and the gifts are ours Through Him who with us sideth:\nLet goods and kindred go, This mortal life also;\nThe body they may kill: God's truth abideth still,\nHis kingdom is forever."
    },
    {
        number: 103,
        title: "When I Survey the Wondrous Cross",
        author: "Isaac Watts",
        tags: "grace, cross, sacrifice",
        lyrics: "Verse 1\nWhen I survey the wondrous cross\nOn which the Prince of Glory died,\nMy richest gain I count but loss,\nAnd pour contempt on all my pride.\n\nVerse 2\nForbid it, Lord, that I should boast,\nSave in the death of Christ, my God!\nAll the vain things that charm me most,\nI sacrifice them to His blood.\n\nVerse 3\nSee, from His head, His hands, His feet,\nSorrow and love flow mingled down!\nDid e'er such love and sorrow meet,\nOr thorns compose so rich a crown?\n\nVerse 4\nWere the whole realm of nature mine,\nThat were a present far too small;\nLove so amazing, so divine,\nDemands my soul, my life, my all."
    },
    {
        number: 104,
        title: "Praise to the Lord, the Almighty",
        author: "Joachim Neander",
        tags: "praise, almighty, worship",
        lyrics: "Verse 1\nPraise to the Lord, the Almighty, the King of creation!\nO my soul, praise Him, for He is thy health and salvation!\nAll ye who hear, now to His temple draw near\nSing now in glad adoration!\n\nVerse 2\nPraise to the Lord, who o'er all things so wondrously reigneth,\nShelters thee under His wings, yea, so gently sustaineth!\nHast thou not seen how thy desires e'er have been\nGranted in what He ordaineth?\n\nVerse 3\nPraise to the Lord, who doth prosper thy work and defend thee;\nSurely His goodness and mercy here daily attend thee.\nPonder anew what the Almighty can do,\nIf with His love He befriend thee."
    },
    {
        number: 105,
        title: "Be Thou My Vision",
        author: "Dallán Forgaill",
        tags: "vision, faith, devotion",
        lyrics: "Verse 1\nBe Thou my vision, O Lord of my heart;\nNaught be all else to me, save that Thou art;\nThou my best thought, by day or by night,\nWaking or sleeping, Thy presence my light.\n\nVerse 2\nBe Thou my wisdom, and Thou my true word;\nI ever with Thee and Thou with me, Lord;\nThou my great Father, and I Thy true son,\nThou in me dwelling, and I with Thee one.\n\nVerse 3\nRiches I heed not, nor man’s empty praise,\nThou mine inheritance, now and always;\nThou and Thou only, first in my heart,\nHigh King of heaven, my treasure Thou art."
    },
    {
        number: 106,
        title: "Blessed Assurance",
        author: "Fanny Crosby",
        tags: "assurance, grace, salvation",
        lyrics: "Verse 1\nBlessed assurance, Jesus is mine!\nOh, what a foretaste of glory divine!\nHeir of salvation, purchase of God,\nBorn of His Spirit, washed in His blood.\n\n[REFRAIN]\nThis is my story, this is my song,\nPraising my Savior all the day long;\nThis is my story, this is my song,\nPraising my Savior all the day long.\n\nVerse 2\nPerfect submission, perfect delight,\nVisions of rapture now burst on my sight;\nAngels descending bring from above\nEchoes of mercy, whispers of love."
    },
    {
        number: 107,
        title: "How Great Thou Art",
        author: "Carl Boberg",
        tags: "praise, wonder, creation",
        lyrics: "Verse 1\nO Lord my God, When I in awesome wonder\nConsider all the worlds Thy Hands have made\nI see the stars, I hear the rolling thunder\nThy power throughout the universe displayed.\n\n[REFRAIN]\nThen sings my soul, My Savior God, to Thee,\nHow great Thou art, How great Thou art!\nThen sings my soul, My Savior God, to Thee,\nHow great Thou art, How great Thou art!\n\nVerse 2\nWhen through the woods, and forest glades I wander,\nAnd hear the birds sing sweetly in the trees.\nWhen I look down, from lofty mountain grandeur\nAnd see the brook, and feel the gentle breeze."
    },
    {
        number: 108,
        title: "It Is Well With My Soul",
        author: "Horatio Spafford",
        tags: "peace, comfort, faith",
        lyrics: "Verse 1\nWhen peace like a river, attendeth my way,\nWhen sorrows like sea billows roll;\nWhatever my lot, Thou hast taught me to know,\nIt is well, it is well, with my soul.\n\n[REFRAIN]\nIt is well, (it is well),\nWith my soul, (with my soul),\nIt is well, it is well, with my soul.\n\nVerse 2\nThough Satan should buffet, though trials should come,\nLet this blest assurance control,\nThat Christ has regarded my helpless estate,\nAnd hath shed His own blood for my soul."
    },
    {
        number: 109,
        title: "Great Is Thy Faithfulness",
        author: "Thomas Chisholm",
        tags: "faithfulness, grace, morning",
        lyrics: "Verse 1\nGreat is Thy faithfulness, O God my Father;\nThere is no shadow of turning with Thee;\nThou changest not, Thy compassions, they fail not;\nAs Thou hast been Thou forever wilt be.\n\n[REFRAIN]\nGreat is Thy faithfulness! Great is Thy faithfulness!\nMorning by morning new mercies I see;\nAll I have needed Thy hand hath provided;\nGreat is Thy faithfulness, Lord, unto me!\n\nVerse 2\nSummer and winter and springtime and harvest,\nSun, moon and stars in their courses above\nJoin with all nature in manifold witness\nTo Thy great faithfulness, mercy and love."
    },
    {
        number: 110,
        title: "Holy, Holy, Holy! Lord God Almighty!",
        author: "Reginald Heber",
        tags: "praise, trinity, worship",
        lyrics: "Verse 1\nHoly, holy, holy! Lord God Almighty!\nEarly in the morning our song shall rise to Thee;\nHoly, holy, holy! Merciful and mighty!\nGod in three Persons, blessed Trinity!\n\nVerse 2\nHoly, holy, holy! All the saints adore Thee,\nCasting down their golden crowns around the glassy sea;\nCherubim and seraphim falling down before Thee,\nWhich wert and art and evermore shalt be."
    }
];

async function seed() {
    console.log("Starting hymn seed...");
    for (const hymn of newHymns) {
        try {
            const existing = await prisma.hymn.findUnique({ where: { number: hymn.number } });
            if (existing) {
                console.log(`Hymn ${hymn.number} already exists, skipping.`);
                continue;
            }
            await prisma.hymn.create({ data: hymn });
            console.log(`Added: ${hymn.title} (No. ${hymn.number})`);
        } catch (e) {
            console.error(`Error adding ${hymn.title}:`, e.message);
        }
    }
    await prisma.$disconnect();
    console.log("Seeding complete.");
}

seed();
