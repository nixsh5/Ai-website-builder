"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type ProjectTheme = NonNullable<
  Parameters<typeof prisma.project.update>[0]["data"]
>["theme"];

export async function updateProjectTheme(
  projectId: string,
  theme: ProjectTheme
) {
  await prisma.project.update({
    where: { id: projectId },
    data: { theme },
  });

  revalidatePath(`/editor/${projectId}`);
}