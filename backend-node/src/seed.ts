import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.employee.createMany({
    data: [
      { name: "Alice Jones", email: "alice@example.com", position: "Engineer", salary: 90000 },
      { name: "Bob Smith", email: "bob@example.com", position: "Manager", salary: 110000 }
    ],
    skipDuplicates: true
  });
  console.log("Seeded initial employees");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
