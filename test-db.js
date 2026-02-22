const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const url = process.argv[2];
    console.log(`Testing connection with URL: ${url}`);

    // Prisma 7 style
    const prisma = new PrismaClient({
        datasourceUrl: url
    });

    try {
        await prisma.$connect();
        console.log("Success! Connected to the database.");
    } catch (e) {
        console.error("Connection failed!");
        console.error(e.message || e);
    } finally {
        // await prisma.$disconnect();
    }
}

testConnection();
