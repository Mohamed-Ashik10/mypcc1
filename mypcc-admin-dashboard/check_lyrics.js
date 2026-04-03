const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();
async function main() {
    const hymn = await p.hymn.findFirst({ select: { id: true, title: true, lyrics: true } });
    console.log(JSON.stringify(hymn, null, 2));
    await p.$disconnect();
}
main();
