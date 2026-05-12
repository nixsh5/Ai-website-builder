"use server";

import { redirect } from "next/navigation";
import { getOrCreateCurrentDbUser } from "@/lib/current-user";
import { prisma } from "@/lib/prisma";

export async function createProject(formData: FormData) {
  const dbUser = await getOrCreateCurrentDbUser();

  if (!dbUser) {
    throw new Error("Unauthorized");
  }

  const title = String(formData.get("title") || "");
  const businessName = String(formData.get("businessName") || "");
  const category = String(formData.get("category") || "");
  const servicesRaw = String(formData.get("services") || "");
  const targetAudience = String(formData.get("targetAudience") || "");
  const tone = String(formData.get("tone") || "");

  const services = servicesRaw
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const project = await prisma.project.create({
    data: {
      userId: dbUser.id,
      title,
      businessName,
      category,
      targetAudience,
      tone,
      services: {
        create: services.map((name) => ({ name })),
      },
    },
  });

  redirect(`/editor/${project.id}`);
}