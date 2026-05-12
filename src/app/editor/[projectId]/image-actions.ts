"use server";

import { revalidatePath } from "next/cache";
import { ImageType } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateHeroImage } from "@/lib/ai/generate-hero-image";

export async function generateProjectHeroImage(projectId: string) {
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      services: true,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  const result = await generateHeroImage({
    businessName: project.businessName,
    category: project.category,
    services: project.services.map((service) => service.name),
    targetAudience: project.targetAudience,
    tone: project.tone,
  });

  await prisma.generatedImage.create({
    data: {
      projectId: project.id,
      type: ImageType.HERO,
      prompt: result.prompt,
      imageUrl: result.imageUrl,
    },
  });

  await prisma.project.update({
    where: { id: project.id },
    data: {
      heroImageUrl: result.imageUrl,
    },
  });

  revalidatePath(`/editor/${projectId}`);

  return result.imageUrl;
}