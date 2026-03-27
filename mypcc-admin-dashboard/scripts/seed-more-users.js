const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Generating additional demonstration accounts...');

  const moreDemoAccounts = [
    {
      name: 'James Presbyter',
      email: 'james.staff@mypcc.org',
      role: 'ADMIN_STAFF',
      password: 'password123' 
    },
    {
      name: 'Elena Curate',
      email: 'elena.edit@mypcc.org',
      role: 'CONTENT_EDITOR',
      password: 'password123'
    },
    {
      name: 'Mary Grace',
      email: 'mary.grace@member.com',
      role: 'CHURCH_USER',
      password: 'password123'
    }
  ];

  for (const acc of moreDemoAccounts) {
    try {
      await prisma.user.upsert({
        where: { email: acc.email },
        update: {},
        create: acc
      });
      console.log(`- Created: ${acc.name} (${acc.role})`);
    } catch (e) {
      console.log(`- Skipping ${acc.name} (already exists or error)`);
    }
  }

  console.log('Additional accounts populated successfully.');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
