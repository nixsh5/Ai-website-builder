"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export async function updateSectionContent(
  projectId: string,
  sectionId: string,
  content: Prisma.InputJsonValue
) {
  await prisma.websiteSection.update({
    where: { id: sectionId },
    data: {
      content: content as Prisma.InputJsonValue,
    },
  });

  revalidatePath(`/editor/${projectId}`);
}