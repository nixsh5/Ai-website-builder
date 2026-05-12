import JSZip from "jszip";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { prisma } from "@/lib/prisma";
import { buildStaticSite } from "@/lib/export/build-static-site";

type Props = {
  params: Promise<{ projectId: string }>;
};

export async function GET(_request: Request, { params }: Props) {
  const { projectId } = await params;

  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      sections: {
        orderBy: { position: "asc" },
      },
    },
  });

  if (!project) {
    return new Response("Project not found", { status: 404 });
  }

  const { html, css } = buildStaticSite({
    businessName: project.businessName,
    heroImageUrl: project.heroImageUrl,
    theme: project.theme,
    sections: project.sections.map((section) => ({
      type: section.type,
      content: section.content,
    })),
  });

  const zip = new JSZip();

  zip.file("index.html", html);
  zip.file("styles.css", css);

  if (project.heroImageUrl?.startsWith("/generated/")) {
    try {
      const relativePath = project.heroImageUrl.replace(/^\/+/, "");
      const imagePath = path.join(process.cwd(), "public", relativePath);
      const imageBuffer = await readFile(imagePath);
      zip.file("assets/hero.png", imageBuffer);
    } catch {
    }
  }

  const zipBuffer = await zip.generateAsync({ type: "arraybuffer" });
  const fileName = `${slugify(project.businessName)}-website.zip`;

  return new Response(zipBuffer, {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}