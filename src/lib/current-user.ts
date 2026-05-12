import { auth, currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function getOrCreateCurrentDbUser() {
  const { userId } = await auth();

  if (!userId) return null;

  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? `${userId}@example.com`;

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
        name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null,
        imageUrl: clerkUser.imageUrl,
      },
    });
  }

  return user;
}