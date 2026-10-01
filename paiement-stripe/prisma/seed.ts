import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Produits initiaux (SQLite ne supporte pas skipDuplicates sur createMany)
async function main() {
  const existing = await prisma.product.count();
  if (existing > 0) return;

  await prisma.product.createMany({
    data: [
      {
        name: "T-shirt SecureBlog",
        description: "100% coton, logo brodé",
        price: 19.99,
        image: "/products/tshirt.svg",
      },
      {
        name: "Mug SecureBlog",
        description: "Céramique, 350ml",
        price: 9.99,
        image: "/products/mug.svg",
      },
      {
        name: "Pack d'autocollants",
        description: "5 autocollants holographiques",
        price: 4.99,
        image: "/products/stickers.svg",
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
