import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.book.deleteMany();

  await prisma.book.createMany({
    data: [
      {
        title: "The Midnight Library",
        author: "Matt Haig",
        description:
          "Between life and death there is a library, and within that library, the shelves go on forever.",
        priceCents: 1699,
        coverImageUrl:
          "https://images.unsplash.com/photo-1544947950-fa07a98d2378?w=400&h=600&fit=crop",
        stock: 3,
      },
      {
        title: "Project Hail Mary",
        author: "Andy Weir",
        description:
          "A lone astronaut must save the earth from disaster in this propulsive interstellar adventure.",
        priceCents: 1899,
        coverImageUrl:
          "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=600&fit=crop",
        stock: 2,
      },
      {
        title: "Atomic Habits",
        author: "James Clear",
        description:
          "Tiny changes, remarkable results — an easy way to build good habits and break bad ones.",
        priceCents: 1599,
        coverImageUrl:
          "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=600&fit=crop",
        stock: 5,
      },
      {
        title: "Dune",
        author: "Frank Herbert",
        description:
          "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides.",
        priceCents: 1299,
        coverImageUrl:
          "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=400&h=600&fit=crop",
        stock: 1,
      },
    ],
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
