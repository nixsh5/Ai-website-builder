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
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-400">Welcome back</p>
          <h1 className="text-4xl font-semibold tracking-tight text-white">
            Your Projects
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Manage, edit, and export your AI-generated business websites.
          </p>
        </div>

        <Link
          href="/dashboard/new"
          className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 5v14M5 12h14" strokeLinecap="round" />
          </svg>
          New Project
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Total Projects
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {projects.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Draft Projects
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {projects.filter((project) => project.status === "DRAFT").length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-5">
          <p className="text-xs uppercase tracking-wide text-zinc-500">
            Generated Sections
          </p>
          <p className="mt-2 text-2xl font-semibold text-white">
            {projects.reduce((acc, project) => acc + project.sections.length, 0)}
          </p>
        </div>
      </div>

      {projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/40 px-8 py-24 text-center">
          <div className="mb-4 rounded-2xl bg-zinc-900 p-4">
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-white">No projects yet</h2>
          <p className="mt-2 max-w-md text-sm text-zinc-500">
            Create your first project and let AI generate a website structure,
            content, and visuals for your business.
          </p>
          <Link
            href="/dashboard/new"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            Create Project
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/editor/${project.id}`}
              className="group rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5 transition duration-200 hover:-translate-y-1 hover:border-zinc-700 hover:bg-zinc-900"
            >
              <div className="mb-6 flex items-start justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zinc-900 text-zinc-300 transition group-hover:bg-zinc-800">
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="3" />
                    <path d="M9 9h6M9 12h6M9 15h4" strokeLinecap="round" />
                  </svg>
                </div>

                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                    statusColors[project.status] ?? statusColors.DRAFT
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="space-y-1">
                <h2 className="text-xl font-semibold tracking-tight text-white">
                  {project.businessName}
                </h2>
                <p className="text-sm capitalize text-zinc-400">
                  {project.category}
                </p>
              </div>

              <div className="mt-6 border-t border-zinc-800 pt-4">
                <div className="mb-3 flex items-center justify-between">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                      themeColors[project.theme] ?? themeColors.MODERN
                    }`}
                  >
                    {project.theme}
                  </span>

                  <span className="text-xs text-zinc-500">
                    {formatDistanceToNow(project.updatedAt, {
                      addSuffix: true,
                    })}
                  </span>
                </div>

                <p className="text-sm text-zinc-400">
                  {project.sections.length} section
                  {project.sections.length !== 1 ? "s" : ""}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}