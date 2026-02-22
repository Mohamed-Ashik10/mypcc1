const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const adminEmail = 'admin@mypcc.org';
    const adminPassword = 'AdminPassword123';

    const hashedPassword = await bcrypt.hash(adminPassword, 12);

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {},
        create: {
            email: adminEmail,
            name: 'PCC Admin',
            password: hashedPassword,
            role: 'ADMIN',
        },
    });

    console.log('✅ Initial Admin Account Created!');
    console.log('Email:', adminEmail);
    console.log('Password:', adminPassword);
    console.log('You can now use these credentials at /auth/login');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
