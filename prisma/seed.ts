import { PrismaClient } from "@prisma/client";
import { BOOK_FIXED_ID, STATIC_CATALOG_BOOKS } from "../lib/catalog";

const prisma = new PrismaClient();
const book = STATIC_CATALOG_BOOKS[0]!;

async function main() {
  await prisma.reservation.deleteMany();
  await prisma.book.deleteMany();

  await prisma.book.create({
    data: {
      id: BOOK_FIXED_ID,
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      description: book.description,
      priceCents: book.priceCents,
      stock: book.stock,
    },
  });
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
