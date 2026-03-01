const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('Admin@123', 10);

    const user = await prisma.user.update({
        where: { email: 'admin@mypcc.org' },
        data: { password: hashedPassword }
    });

    console.log('Password reset successfully for:', user.email);
    console.log('New password is: Admin@123');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
