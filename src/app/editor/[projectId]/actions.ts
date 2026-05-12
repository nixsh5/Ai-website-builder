"use server";

import { revalidatePath } from "next/cache";
import { SectionType } from "@prisma/client";
import { generateWebsiteContent } from "@/lib/ai/generate-website";
import { prisma } from "@/lib/prisma";

export async function generateSections(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { services: true },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const generated = await generateWebsiteContent({
    businessName: project.businessName,
    category: project.category,
    services: project.services.map((s) => s.name),
    targetAudience: project.targetAudience,
    tone: project.tone,
  });

  await prisma.websiteSection.deleteMany({
    where: { projectId },
  });

  await prisma.websiteSection.createMany({
    data: [
      {
        projectId,
        type: SectionType.HERO,
        label: "Hero Section",
        position: 1,
        content: generated.hero,
      },
      {
        projectId,
        type: SectionType.ABOUT,
        label: "About Section",
        position: 2,
        content: generated.about,
      },
      {
        projectId,
        type: SectionType.SERVICES,
        label: "Services Section",
        position: 3,
        content: generated.services,
      },
      {
        projectId,
        type: SectionType.FAQ,
        label: "FAQ Section",
        position: 4,
        content: generated.faq,
      },
      {
        projectId,
        type: SectionType.CTA,
        label: "CTA Section",
        position: 5,
        content: generated.cta,
      },
    ],
  });

  revalidatePath(`/editor/${projectId}`);
}