"use server";

import { revalidatePath } from "next/cache";
import { WebsiteTheme } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateProjectTheme(
  projectId: string,
  theme: WebsiteTheme
) {
  await prisma.project.update({
    where: { id: projectId },
    data: { theme },
  });

  revalidatePath(`/editor/${projectId}`);
}