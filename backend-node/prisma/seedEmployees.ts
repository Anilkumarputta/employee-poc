import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create users
  const password = await bcrypt.hash('Password123', 10);
  await prisma.user.upsert({
    where: { username: 'admin' },
    update: {},
    create: { username: 'admin', passwordHash: password, role: 'admin' }
  });
  await prisma.user.upsert({
    where: { username: 'Anil' },
    update: {},
    create: { username: 'Anil', passwordHash: password, role: 'employee' }
  });

  // Create 40 employees
  const employees = Array.from({ length: 40 }).map((_, i) => ({
    fullName: `Employee ${i + 1}`,
    className: `Class ${((i % 5) + 1)}`,
    attendancePercentage: Math.round((60 + (i % 41)) * 100) / 100
  }));

  for (const emp of employees) {
    await prisma.employee.create({ data: emp });
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
