const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
    console.log("Seeding tiered test accounts...");

    const users = [
        {
            email: 'seeker@mypcc.org',
            password: 'SeekerPassword123',
            name: 'Seeker Member',
            type: 'SEEKER'
        },
        {
            email: 'pilgrim@mypcc.org',
            password: 'PilgrimPassword123',
            name: 'Pilgrim Member',
            type: 'PILGRIM'
        },
        {
            email: 'shepherd@mypcc.org',
            password: 'ShepherdPassword123',
            name: 'Shepherd Partner',
            type: 'SHEPHERD'
        }
    ];

    for (const u of users) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        
        // Upsert user
        const user = await prisma.user.upsert({
            where: { email: u.email },
            update: {
                password: hashedPassword,
                name: u.name,
                role: 'USER'
            },
            create: {
                email: u.email,
                password: hashedPassword,
                name: u.name,
                role: 'USER'
            }
        });

        // Add subscription
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 year from now

        await prisma.subscription.upsert({
            where: { id: `sub_${u.type.toLowerCase()}_${user.id.substring(0, 8)}` },
            update: {
                type: u.type,
                status: 'ACTIVE',
                endDate: expiryDate
            },
            create: {
                id: `sub_${u.type.toLowerCase()}_${user.id.substring(0, 8)}`,
                userId: user.id,
                type: u.type,
                status: 'ACTIVE',
                endDate: expiryDate,
                billingCycle: 'ANNUAL'
            }
        });

        console.log(`Created/Updated account: ${u.email} (${u.type})`);
    }

    console.log("Tiered account seeding completed.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
