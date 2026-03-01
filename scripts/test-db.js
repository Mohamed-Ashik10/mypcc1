const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
    console.log('Testing connection to TiDB...');
    try {
        const result = await prisma.$queryRaw`SELECT 1`;
        console.log('Connection successful!', result);
    } catch (error) {
        console.error('Connection failed:', error.message);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
