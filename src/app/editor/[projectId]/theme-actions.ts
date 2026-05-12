"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

type Theme = "MODERN" | "ELEGANT" | "BOLD" | "MINIMAL";

export async function updateProjectTheme(projectId: string, theme: Theme) {
  await prisma.project.update({
    where: { id: projectId },
    data: {
      theme,
    },
  });

  revalidatePath(`/editor/${projectId}`);
}