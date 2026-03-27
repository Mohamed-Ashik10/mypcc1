const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Clearing old devotionals...');
  await prisma.devotional.deleteMany({});

  const today = new Date();
  const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
  const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);
  const threeDaysAgo = new Date(today); threeDaysAgo.setDate(today.getDate() - 3);
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

  console.log('Inserting fresh devotionals...');
  
  await prisma.devotional.create({
    data: {
      title: "Still Waters",
      date: today,
      author: "Rev. Michael Hayes",
      category: "Inspiration",
      reading: "Psalm 23:1-6",
      image: "https://images.unsplash.com/photo-1506544777-64cfbeaebae6?w=1600&q=80",
      isFree: true,
      minPlan: "SEEKER",
      excerpt: "The invitation to still waters is not passive surrender — it is an act of trust. To rest in God's provision is to declare that He is enough.",
      content: `> [!NOTE]
> "He makes me lie down in green pastures, he leads me beside quiet waters, he refreshes my soul."
> PSALM 23:2–3

### Reflection
There are moments when the world demands more than we have to give. The noise becomes deafening — obligations pile up, anxieties whisper, and the pace of life never seems to slow. It is into precisely this moment that the Shepherd speaks: lie down.

The invitation to still waters is not passive surrender — it is an act of trust. To rest in God's provision is to declare, with your body and your breath, that He is enough. That today's worries are held. That you are known and guided.

### Prayer
Lord, still the rushing waters of my mind today. Let me hear Your voice above the noise. Lead me to the quiet places where my soul is restored, and remind me that in Your presence, I lack nothing. Amen.

### Companion Hymn
Be Still, My Soul`
    }
  });

  await prisma.devotional.create({
    data: {
      title: "Moving Mountains",
      date: yesterday,
      author: "Pastor Sarah Jenkins",
      category: "Faith",
      reading: "Matthew 17:14-20",
      image: "https://images.unsplash.com/photo-1510250674488-8e6fcabdaaf3?w=1600&q=80",
      isFree: true,
      minPlan: "SEEKER",
      excerpt: "Faith is not about the size of our belief, but the size of our God. Even a seed is enough if planted in Him.",
      content: `> [!NOTE]
> "Truly I tell you, if you have faith as small as a mustard seed, you can say to this mountain, 'Move from here to there,' and it will move. Nothing will be impossible for you."
> MATTHEW 17:20

### Reflection
We often look at the mountains in our lives—illness, financial strain, broken relationships—and feel completely overwhelmed. We look inward to see if we have enough faith to overcome, and inevitably, we find ourselves lacking. But Jesus doesn't demand perfect, towering faith. He points to the mustard seed.

The power of faith doesn't lie in its quantity, but in its object. A small amount of faith placed in an all-powerful God is infinitely more potent than a massive amount of faith placed in ourselves.

### Prayer
Heavenly Father, take my mustard-seed faith today. I confess my doubts and fears, but I trust in Your limitless power. Move the mountains I cannot move. Amen.

### Companion Hymn
Great Is Thy Faithfulness`
    }
  });

  await prisma.devotional.create({
    data: {
      title: "The Balm of Gilead",
      date: twoDaysAgo,
      author: "PCC Community",
      category: "Healing",
      reading: "Jeremiah 8:18-22",
      image: "https://images.unsplash.com/photo-1499209974431-9dddcece7f88?w=1600&q=80",
      isFree: false,
      minPlan: "PILGRIM",
      excerpt: "Where do we turn when our wounds run deep? The prophet asks if there is a balm in Gilead. The cross answers with a resounding yes.",
      content: `> [!NOTE]
> "Is there no balm in Gilead? Is there no physician there? Why then is there no healing for the wound of my people?"
> JEREMIAH 8:22

### Reflection
Jeremiah wept for his people, recognizing a brokenness that no earthly remedy could fix. Sometimes we feel that same profound weeping—for our communities, for our families, and for our own deep wounds. We wonder if there is any true healing to be found in a world so fractured.

The cross is the ultimate answer to Jeremiah's plea. Because Christ suffered, our suffering is known. Because He bled, our spiritual wounds are washed clean by the greatest Physician. There is, indeed, a balm.

### Prayer
Lord Jesus, thank You for being the healer of my soul. Apply Your grace to my deepest hurts today. Let me find my peace in Your finished work. Amen.

### Companion Hymn
There Is a Balm in Gilead`
    }
  });

  await prisma.devotional.create({
    data: {
      title: "Unceasing Worship",
      date: threeDaysAgo,
      author: "Dr. William Roberts",
      category: "Praise",
      reading: "Psalm 150:1-6",
      image: "https://images.unsplash.com/photo-1510590337019-5ef8d3d32116?w=1600&q=80",
      isFree: false,
      minPlan: "SHEPHERD",
      excerpt: "True worship is not a weekly event, but a constant rhythm of the heart. Let everything that has breath praise the Lord.",
      content: `> [!NOTE]
> "Let everything that has breath praise the Lord. Praise the Lord."
> PSALM 150:6

### Reflection
The final Psalm does not offer a gentle suggestion; it commands total, uninhibited praise. Worship is often thought of as a Sunday activity, bounded by walls and times. Yet the Psalmist demands that our very breath become an instrument of praise.

When we realize the magnitude of God's grace, our response can be nothing less. Whether in joy or sorrow, in plenty or in want, true worship anchors our perspective to the heavens.

### Prayer
Almighty God, tune my heart to sing Thy grace. Let every moment of my day, every breath I take, be an offering of praise to Your glorious name. Amen.

### Companion Hymn
Come Thou Fount of Every Blessing`
    }
  });

  await prisma.devotional.create({
    data: {
      title: "The Body Together",
      date: tomorrow,
      author: "PCC Leadership",
      category: "Community",
      reading: "1 Corinthians 12:12-27",
      image: "https://images.unsplash.com/photo-1529156069898-49953eb1b5e4?w=1600&q=80",
      isFree: true,
      minPlan: "SEEKER",
      excerpt: "We were never meant to walk this journey alone. Discover the profound strength found in Christian community when we act as one body.",
      content: `> [!NOTE]
> "Now you are the body of Christ, and each one of you is a part of it."
> 1 CORINTHIANS 12:27

### Reflection
The world preaches independence, but the Gospel preaches interdependence. We are not just a collection of individuals who happen to believe the same things; we are intricately woven together into one spiritual organism. 

When one part suffers, every part suffers with it; when one part is honored, every part rejoices. To truly thrive in our faith, we must lean into the beautiful, messy reality of being the church together.

### Prayer
Father, thank You for the gift of Your church. Help me to serve selflessly, to love deeply, and to honor the varied gifts of those around me. Keep us united in Christ. Amen.

### Companion Hymn
Blest Be the Tie That Binds`
    }
  });

  console.log('✅ Successfully seeded fresh devotionals!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
