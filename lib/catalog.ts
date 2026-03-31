/** Stable id shared by Prisma seed and GitHub Pages static export. */
export const BOOK_FIXED_ID = "book-sales-catalog";

export type StorefrontBook = {
  id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  priceCents: number;
  stock: number;
};

const DESCRIPTION = `This book explores the enduring value of relationships over material wealth in the life of a man at sixty and beyond. Drawing from philosophical, psychological, sociological, scriptural, and legal perspectives, it affirms that while money may attract people, only genuine relationships sustain a man through life's uncertainties, aging, and legacy transitions.

Central to this discourse is the author's original submission:

"Do not keep looking for money that everyone will spend with you, rather invest into a relationship that will carry you through when everyone might have left you."
— Idowu Moses Babajide`;

/** Source of truth for the single title when the database is not used (static hosting). */
export const STATIC_CATALOG_BOOKS: StorefrontBook[] = [
  {
    id: BOOK_FIXED_ID,
    title: "Enduring Relationships Beyond Sixty",
    author: "Idowu Moses Babajide",
    isbn: "978-1-0671569-4-7",
    description: DESCRIPTION,
    priceCents: 0,
    stock: 99,
  },
];
