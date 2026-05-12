"use client";

import Image from "next/image";
import { useState, useTransition } from "react";
import { Prisma } from "@prisma/client";
import { updateSectionContent } from "@/app/editor/[projectId]/update-actions";
import { regenerateSection } from "@/app/editor/[projectId]/regenerate-actions";
import { generateProjectHeroImage } from "@/app/editor/[projectId]/image-actions";
import { updateProjectTheme } from "@/app/editor/[projectId]/theme-actions";

type Section = {
  id: string;
  label: string;
  type: string;
  content: Prisma.JsonValue;
};

type Theme = "MODERN" | "ELEGANT" | "BOLD" | "MINIMAL";

type Props = {
  projectId: string;
  sections: Section[];
  heroImageUrl: string | null;
  theme: Theme;
};

const themeOptions: {
  value: Theme;
  label: string;
  previewClass: string;
  surfaceClass: string;
  textClass: string;
  mutedClass: string;
  buttonClass: string;
  cardClass: string;
  canvasClass: string;
}[] = [
  {
    value: "MODERN",
    label: "Modern",
    previewClass: "bg-white",
    surfaceClass: "bg-white",
    textClass: "text-black",
    mutedClass: "text-gray-600",
    buttonClass: "bg-black text-white",
    cardClass: "border border-gray-200 bg-white",
    canvasClass: "bg-white",
  },
  {
    value: "ELEGANT",
    label: "Elegant",
    previewClass: "bg-stone-50",
    surfaceClass: "bg-stone-50",
    textClass: "text-stone-900",
    mutedClass: "text-stone-600",
    buttonClass: "bg-stone-900 text-stone-50",
    cardClass: "border border-stone-200 bg-white",
    canvasClass: "bg-stone-50",
  },
  {
    value: "BOLD",
    label: "Bold",
    previewClass: "bg-orange-50",
    surfaceClass: "bg-orange-50",
    textClass: "text-zinc-950",
    mutedClass: "text-zinc-700",
    buttonClass: "bg-orange-600 text-white",
    cardClass: "border border-orange-200 bg-white",
    canvasClass: "bg-orange-50",
  },
  {
    value: "MINIMAL",
    label: "Minimal",
    previewClass: "bg-zinc-50",
    surfaceClass: "bg-zinc-50",
    textClass: "text-zinc-900",
    mutedClass: "text-zinc-500",
    buttonClass: "bg-zinc-900 text-white",
    cardClass: "border border-zinc-200 bg-zinc-50",
    canvasClass: "bg-zinc-50",
  },
];

export default function WebsiteEditor({
  projectId,
  sections,
  heroImageUrl,
  theme,
}: Props) {
  const [localSections, setLocalSections] = useState(sections);
  const [localHeroImageUrl, setLocalHeroImageUrl] = useState(heroImageUrl);
  const [localTheme, setLocalTheme] = useState<Theme>(theme);
  const [isPending, startTransition] = useTransition();

  const activeTheme =
    themeOptions.find((item) => item.value === localTheme) ?? themeOptions[0];

  function updateLocalSection(sectionId: string, newContent: Prisma.JsonValue) {
    setLocalSections((prev) =>
      prev.map((section) =>
        section.id === sectionId ? { ...section, content: newContent } : section
      )
    );
  }

  function saveSection(sectionId: string, content: Prisma.InputJsonValue) {
    startTransition(async () => {
      await updateSectionContent(projectId, sectionId, content);
    });
  }

  function handleRegenerate(sectionId: string) {
    startTransition(async () => {
      await regenerateSection(projectId, sectionId);
      window.location.reload();
    });
  }

  function handleGenerateHeroImage() {
    startTransition(async () => {
      const imageUrl = await generateProjectHeroImage(projectId);
      setLocalHeroImageUrl(imageUrl);
      window.location.reload();
    });
  }

  function handleExport() {
    const url = `/api/export/${projectId}`;
    const link = document.createElement("a");
    link.href = url;
    link.download = "website.zip";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function handleThemeChange(nextTheme: Theme) {
    setLocalTheme(nextTheme);

    startTransition(async () => {
      await updateProjectTheme(projectId, nextTheme);
    });
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6">
      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="mb-2 text-sm font-medium text-zinc-400">AI Website Builder</p>
          <h1 className="text-3xl font-semibold tracking-tight text-white">
            Edit Your Website
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Customize sections, refresh visuals, switch themes, and preview changes live.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            Export ZIP
          </button>
          <button
            type="button"
            onClick={handleGenerateHeroImage}
            className="rounded-xl bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-zinc-200"
          >
            {isPending
              ? "Generating..."
              : localHeroImageUrl
                ? "Regenerate Hero Image"
                : "Generate Hero Image"}
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[460px_minmax(0,1fr)]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Theme</h2>
                <p className="text-xs text-zinc-500">Choose a visual direction</p>
              </div>
              <span className="text-xs text-zinc-500">
                {isPending ? "Saving..." : "Saved"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {themeOptions.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  onClick={() => handleThemeChange(item.value)}
                  className={`rounded-2xl border p-3 text-left transition ${
                    localTheme === item.value
                      ? "border-white bg-zinc-900 shadow-[0_0_0_1px_rgba(255,255,255,0.08)]"
                      : "border-zinc-800 bg-black hover:border-zinc-700 hover:bg-zinc-950"
                  }`}
                >
                  <div className={`mb-3 h-20 rounded-xl border ${item.previewClass}`} />
                  <p className="text-sm font-medium text-white">{item.label}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">Hero Image</h2>
                <p className="text-xs text-zinc-500">Main visual for the website</p>
              </div>
            </div>

            {localHeroImageUrl ? (
              <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-black">
                <Image
                  src={localHeroImageUrl}
                  alt="Generated hero image"
                  width={1600}
                  height={900}
                  className="h-auto w-full object-cover"
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-dashed border-zinc-800 bg-black/40 p-10 text-center text-sm text-zinc-500">
                No hero image generated yet.
              </div>
            )}
          </div>

          {localSections.map((section) => (
            <div
              key={section.id}
              className="rounded-3xl border border-zinc-800 bg-zinc-950/70 p-5"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-white">{section.label}</h2>
                  <p className="text-xs text-zinc-500">Structured editable content</p>
                </div>

                <button
                  type="button"
                  onClick={() => handleRegenerate(section.id)}
                  className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800"
                >
                  Regenerate
                </button>
              </div>

              <textarea
                className="min-h-[220px] w-full rounded-2xl border border-zinc-800 bg-black px-4 py-3 font-mono text-sm text-zinc-200 outline-none transition focus:border-zinc-700"
                value={JSON.stringify(section.content, null, 2)}
                onChange={(e) => {
                  try {
                    const parsed = JSON.parse(e.target.value) as Prisma.JsonValue;
                    updateLocalSection(section.id, parsed);
                  } catch {}
                }}
                onBlur={() => {
                  const current = localSections.find((s) => s.id === section.id);
                  if (current) {
                    saveSection(section.id, current.content as Prisma.InputJsonValue);
                  }
                }}
              />
            </div>
          ))}
        </div>

        <div className="xl:sticky xl:top-6 xl:h-[calc(100vh-3rem)]">
          <div className="flex h-full flex-col rounded-[32px] border border-zinc-800 bg-zinc-950/70 p-4 shadow-2xl shadow-black/30">
            <div className="mb-4 flex items-center justify-between px-2">
              <div>
                <h2 className="text-lg font-semibold text-white">Live Preview</h2>
                <p className="text-xs text-zinc-500">Changes appear instantly</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-auto rounded-[28px] border border-zinc-800 bg-black p-3">
              <div className={`overflow-hidden rounded-[24px] shadow-2xl ${activeTheme.canvasClass}`}>
                <WebsitePreview
                  sections={localSections}
                  heroImageUrl={localHeroImageUrl}
                  theme={activeTheme}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebsitePreview({
  sections,
  heroImageUrl,
  theme,
}: {
  sections: Section[];
  heroImageUrl: string | null;
  theme: {
    surfaceClass: string;
    textClass: string;
    mutedClass: string;
    buttonClass: string;
    cardClass: string;
  };
}) {
  const hero = sections.find((s) => s.type === "HERO")?.content as
    | { headline?: string; subheadline?: string; ctaText?: string }
    | undefined;

  const about = sections.find((s) => s.type === "ABOUT")?.content as
    | { title?: string; body?: string }
    | undefined;

  const services = sections.find((s) => s.type === "SERVICES")?.content as
    | { title?: string; items?: { name?: string; description?: string }[] }
    | undefined;

  const faq = sections.find((s) => s.type === "FAQ")?.content as
    | { title?: string; items?: { question?: string; answer?: string }[] }
    | undefined;

  const cta = sections.find((s) => s.type === "CTA")?.content as
    | { headline?: string; description?: string; buttonText?: string }
    | undefined;

  return (
    <div className={`min-h-full ${theme.surfaceClass} ${theme.textClass}`}>
      <section className="grid gap-10 border-b px-8 py-14 md:grid-cols-2 md:items-center">
        <div>
          <p className={`mb-3 text-sm font-medium ${theme.mutedClass}`}>
            AI Website Preview
          </p>
          <h1 className="max-w-xl text-5xl font-semibold tracking-tight">
            {hero?.headline}
          </h1>
          <p className={`mt-5 max-w-xl text-lg ${theme.mutedClass}`}>
            {hero?.subheadline}
          </p>
          <button className={`mt-7 rounded-xl px-5 py-3 text-sm font-medium ${theme.buttonClass}`}>
            {hero?.ctaText || "Get Started"}
          </button>
        </div>

        <div>
          {heroImageUrl ? (
            <Image
              src={heroImageUrl}
              alt="Business hero visual"
              width={1600}
              height={900}
              className="rounded-3xl border object-cover shadow-xl"
            />
          ) : (
            <div className={`flex min-h-[280px] items-center justify-center rounded-3xl border border-dashed text-sm ${theme.mutedClass}`}>
              Hero image will appear here
            </div>
          )}
        </div>
      </section>

      <section className="border-b px-8 py-12">
        <h2 className="text-3xl font-semibold tracking-tight">{about?.title}</h2>
        <p className={`mt-4 max-w-3xl text-base leading-7 ${theme.mutedClass}`}>
          {about?.body}
        </p>
      </section>

      <section className="border-b px-8 py-12">
        <h2 className="text-3xl font-semibold tracking-tight">{services?.title}</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {services?.items?.map((item, index) => (
            <div key={index} className={`rounded-2xl p-5 ${theme.cardClass}`}>
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <p className={`mt-2 text-sm leading-6 ${theme.mutedClass}`}>
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-b px-8 py-12">
        <h2 className="text-3xl font-semibold tracking-tight">{faq?.title}</h2>
        <div className="mt-6 space-y-4">
          {faq?.items?.map((item, index) => (
            <div key={index} className={`rounded-2xl p-5 ${theme.cardClass}`}>
              <h3 className="text-base font-semibold">{item.question}</h3>
              <p className={`mt-2 text-sm leading-6 ${theme.mutedClass}`}>
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="px-8 py-14">
        <h2 className="text-4xl font-semibold tracking-tight">{cta?.headline}</h2>
        <p className={`mt-4 max-w-2xl text-base leading-7 ${theme.mutedClass}`}>
          {cta?.description}
        </p>
        <button className={`mt-7 rounded-xl px-5 py-3 text-sm font-medium ${theme.buttonClass}`}>
          {cta?.buttonText || "Contact Us"}
        </button>
      </section>
    </div>
  );
}