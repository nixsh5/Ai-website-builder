import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";

const themeColors: Record<string, string> = {
  MODERN: "bg-zinc-800 text-zinc-200 border border-zinc-700",
  ELEGANT: "bg-amber-950/40 text-amber-300 border border-amber-900/50",
  BOLD: "bg-orange-950/40 text-orange-300 border border-orange-900/50",
  MINIMAL: "bg-slate-800 text-slate-200 border border-slate-700",
};

const statusColors: Record<string, string> = {
  DRAFT: "bg-zinc-800/80 text-zinc-300 border border-zinc-700",
  GENERATED: "bg-indigo-950/40 text-indigo-300 border border-indigo-900/50",
  PUBLISHED: "bg-emerald-950/40 text-emerald-300 border border-emerald-900/50",
};

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const clerkUser = await currentUser();
  if (!clerkUser) redirect("/sign-in");

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;

  if (!email) {
    throw new Error("Authenticated Clerk user has no email address.");
  }

  let user = await prisma.user.findUnique({
    where: { clerkId: userId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        clerkId: userId,
        email,
      },
    });
  }

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    include: {
      sections: {
        select: { id: true },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      {/* keep the rest of your existing JSX exactly the same */}
    </div>
  );
}