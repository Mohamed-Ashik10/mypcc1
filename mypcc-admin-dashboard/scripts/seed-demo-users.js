const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  console.log('Generating demonstration accounts...');

  const hashedPwd = await bcrypt.hash('password123', 10);

  const demoAccounts = [
    {
      name: 'Daniel Logistics',
      email: 'dan.staff@mypcc.org',
      role: 'ADMIN_STAFF',
      password: hashedPwd 
    },
    {
      name: 'Sarah Editor',
      email: 'sarah.edit@mypcc.org',
      role: 'CONTENT_EDITOR',
      password: hashedPwd
    },
    {
      name: 'John Seeker',
      email: 'john.seeker@gmail.com',
      role: 'NORMAL_USER',
      password: hashedPwd
    }
  ];

  for (const acc of demoAccounts) {
    try {
      await prisma.user.upsert({
        where: { email: acc.email },
        update: { 
          role: acc.role,
          password: acc.password 
        },
        create: acc
      });
      console.log(`- Created: ${acc.name} (${acc.role})`);
    } catch (e) {
      console.log(`- Skipping ${acc.name} (already exists or error)`);
    }
  }

  console.log('Demonstration accounts populated successfully.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
