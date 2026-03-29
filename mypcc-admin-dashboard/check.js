const { PrismaClient } = require('@prisma/client');
const p = new PrismaClient();

async function main() {
    const email = 'ashikmd78611@gmail.com';
    let u = await p.user.findUnique({where: {email}});
    if (!u) {
        u = await p.user.create({ data: { email, password: 'password123', name: 'Ashik' }});
        console.log('CREATED USER');
    } else {
        console.log('USER EXISTS');
    }
    await p.$disconnect();
}
main();
