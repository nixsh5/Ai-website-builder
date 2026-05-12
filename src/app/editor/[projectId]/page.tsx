import { prisma } from "@/lib/prisma";
import WebsiteEditor from "@/components/editor/website-editor";

type Props = {
  params: Promise<{ projectId: string }>;
};

export default async function EditorPage({ params }: Props) {
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
    return <div className="p-6 text-white">Project not found</div>;
  }

  const sections = project.sections.map((section) => ({
    id: section.id,
    label: section.label,
    type: section.type,
    content: section.content,
  }));

  return (
    <WebsiteEditor
      projectId={project.id}
      sections={sections}
      heroImageUrl={project.heroImageUrl}
      theme={project.theme}
    />
  );
}