"use server";

import { revalidatePath } from "next/cache";
import { Prisma, SectionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { regenerateSingleSection } from "@/lib/ai/regenerate-section";

export async function regenerateSection(projectId: string, sectionId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      services: true,
      sections: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const section = project.sections.find((s) => s.id === sectionId);

  if (!section) {
    throw new Error("Section not found");
  }

  const content = await regenerateSingleSection({
    businessName: project.businessName,
    category: project.category,
    services: project.services.map((s) => s.name),
    targetAudience: project.targetAudience,
    tone: project.tone,
    sectionType: section.type as SectionType,
  });

  await prisma.websiteSection.update({
    where: { id: sectionId },
    data: {
      content: content as Prisma.InputJsonValue,
    },
  });

  revalidatePath(`/editor/${projectId}`);
}