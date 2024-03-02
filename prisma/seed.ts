import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@calendsync.com",
      image: "https://avatars.githubusercontent.com/u/1?v=4",
    },
  });

  // insert providers
  await prisma.provider.create({
    data: {
      name: "google_calendar",
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit();
  });
