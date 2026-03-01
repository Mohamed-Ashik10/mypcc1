const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const user = await prisma.user.findFirst({ where: { email: "ashikmd78611@gmail.com" } });
        if (!user) return console.log("user not found");
        await prisma.user.delete({ where: { id: user.id } });
        console.log("Deletion successful");
    } catch (e) {
        console.error("Deletion failed:", e);
    }
}
main().finally(() => prisma.$disconnect());
