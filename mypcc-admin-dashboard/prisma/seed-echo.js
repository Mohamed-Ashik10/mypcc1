const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log("🗑️ Cleaning up old Echo issues...");
  await prisma.theEchoIssue.deleteMany({});

  console.log("🌱 Seeding 'The Echo' issues (10 per year from 2022 to 2026)...");

  const categories = ["news", "special", "youth", "community", "testimony", "music"];
  const years = [2026, 2025, 2024, 2023, 2022];
  const issues = [];

  const adjectives = ["Inspirational", "Community", "Faith", "Spiritual", "Monthly", "Annual", "Special", "Grace", "Worship", "Service"];
  const covers = [
    "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=400",
    "https://images.unsplash.com/photo-1543590433-0421a3641040?q=80&w=400",
    "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=400",
    "https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=400",
    "https://images.unsplash.com/photo-1491843331657-f750ecd29a4c?q=80&w=400",
    "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=400",
    "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400",
    "https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=400",
    "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?q=80&w=400"
  ];

  for (const year of years) {
    for (let i = 1; i <= 10; i++) {
        // Spread the 10 issues across the year roughly (1 per month for first 10 months)
        const month = i.toString().padStart(2, '0');
        const adj = adjectives[i-1];
        const cat = categories[Math.floor(Math.random() * categories.length)];
        
        issues.push({
            title: `The Echo: ${adj} Edition ${year} - Vol ${i}`,
            issueMonth: new Date(`${year}-${month}-01`),
            pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
            coverUrl: covers[i-1],
            isFree: i % 2 === 0, // Alternate free/paid
            category: cat,
            excerpt: `Exploring the ${adj.toLowerCase()} journey of our church in ${year}. Issue number ${i} for this collection.`
        });
    }
  }

  for (const issue of issues) {
    await prisma.theEchoIssue.create({ data: issue });
  }

  console.log(`✅ Seeded ${issues.length} The Echo issues successfully (10 per year).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
