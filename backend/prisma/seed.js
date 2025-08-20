//backend\prisma\seed.js

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("Admin@123", 10);

  // Create admin if not exists
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {}, // if exists, do nothing
    create: {
      name: "Super Admin",
      email: "admin@example.com",
      password: hashedPassword,
      address: "block 44 13B USA",
      role: "ADMIN"
    }
  });

  console.log("Admin created/verified:", admin.email);
}

main()
  .catch((e) => {
    console.error("Error seeding admin:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
