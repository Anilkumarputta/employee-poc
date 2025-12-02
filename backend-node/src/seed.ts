/**
 * Plain TS seed — creates test employees using fields
 * that exist in Prisma schema (no `position` or `salary` properties).
 *
 * Run locally:
 *   npx ts-node src/seed.ts
 * Or on Render Shell after build: node dist/seed.js  (or keep a JS seed.js if preferred)
 */

import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const items: Array<any> = [];
  const subjectsPool = [
    ["Math", "Physics"],
    ["English", "History"],
    ["CS", "Algorithms"],
    ["Art", "Design"],
    ["Biology", "Chemistry"]
  ];

  for (let i = 1; i <= 40; i++) {
    items.push({
      name: `Employee ${i}`,
      email: `employee+${i}@example.com`,
      age: 20 + (i % 20),
      class: `Class ${1 + (i % 5)}`,
      subjects: subjectsPool[i % subjectsPool.length],
      attendance: Number((Math.random() * 100).toFixed(2))
    });
  }

  // use createMany to bulk insert; skipDuplicates to avoid errors on rerun
  const res = await prisma.employee.createMany({
    data: items,
    skipDuplicates: true
  });

  console.log("Seed completed. createMany result:", res);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });