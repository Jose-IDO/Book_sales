import type { PrismaClient } from "@prisma/client";

type Db = Pick<PrismaClient, "book">;

function randomEightDigitString(): string {
  return String(Math.floor(10_000_000 + Math.random() * 90_000_000));
}

/**
 * Allocate a unique 8-digit numeric string for Firestore registry keys.
 */
export async function allocateRegistryEightDigitId(db: Db): Promise<string> {
  for (let attempt = 0; attempt < 40; attempt++) {
    const candidate = randomEightDigitString();
    const existing = await db.book.findUnique({
      where: { registryEightDigitId: candidate },
      select: { id: true },
    });
    if (!existing) return candidate;
  }
  throw new Error("Could not allocate a unique 8-digit registry id");
}
