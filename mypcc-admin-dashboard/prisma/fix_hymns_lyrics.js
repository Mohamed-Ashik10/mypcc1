const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log("Normalizing all hymns to exactly two verses for focused devotion...");

    const hymnsToUpdate = [
        {
            number: 1,
            title: "Amazing Grace",
            lyrics: `[Verse 1]
Amazing grace! how sweet the sound,
That saved a wretch; like me!
I once was lost, but now am found,
Was blind, but now I see.

[Verse 2]
'Twas grace that taught my heart to fear,
And grace my fears relieved;
How precious did that grace appear
The hour I first believed!`
        },
        {
            number: 2,
            title: "Abide With Me",
            lyrics: `[Verse 1]
Abide with me; fast falls the eventide;
The darkness deepens; Lord, with me abide;
When other helpers fail and comforts flee,
Help of the helpless, oh, abide with me.

[Verse 2]
Swift to its close ebbs out life’s little day;
Earth’s joys grow dim, its glories pass away;
Change and decay in all around I see—
O Thou who changest not, abide with me.`
        },
        {
            number: 3,
            title: "It Is Well With My Soul",
            lyrics: `[Verse 1]
When peace like a river attendeth my way,
When sorrows like sea billows roll;
Whatever my lot, Thou hast taught me to say,
It is well, it is well with my soul.

[Refrain]
It is well (it is well)
with my soul (with my soul),
It is well, it is well with my soul.`
        },
        {
            number: 4,
            title: "How Great Thou Art",
            lyrics: `[Verse 1]
O Lord my God, when I in awesome wonder
Consider all the worlds Thy hands have made,
I see the stars, I hear the rolling thunder,
Thy power throughout the universe displayed.

[Refrain]
Then sings my soul, my Savior God, to Thee,
How great Thou art, how great Thou art!
Then sings my soul, my Savior God, to Thee,
How great Thou art, how great Thou art!`
        },
        {
            number: 7,
            title: "Holy, Holy, Holy",
            lyrics: `[Verse 1]
Holy, holy, holy! Lord God Almighty!
Early in the morning our song shall rise to Thee;
Holy, holy, holy, merciful and mighty!
God in three Persons, blessed Trinity!

[Verse 2]
Holy, holy, holy! All the saints adore Thee,
Casting down their golden crowns around the glassy sea;
Cherubim and seraphim falling down before Thee,
Who wast, and art, and evermore shalt be.`
        },
        {
            number: 10,
            title: "Blessed Assurance",
            lyrics: `[Verse 1]
Blessed assurance, Jesus is mine!
Oh, what a foretaste of glory divine!
Heir of salvation, purchase of God,
Born of His Spirit, washed in His blood.

[Refrain]
This is my story, this is my song,
Praising my Savior all the day long;
This is my story, this is my song,
Praising my Savior all the day long.`
        }
    ];

    for (const h of hymnsToUpdate) {
        await prisma.hymn.updateMany({
            where: { number: h.number },
            data: { lyrics: h.lyrics }
        });
        console.log(`Updated Hymn ${h.number}: ${h.title} (Normalized to 2 segments)`);
    }

    console.log("Hymnal normalization completed.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
