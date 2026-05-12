import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

type GenerateHeroImageInput = {
  businessName: string;
  category: string;
  services: string[];
  targetAudience: string;
  tone: string;
};

export async function generateHeroImage(input: GenerateHeroImageInput) {
   const prompt = [
  `${input.businessName} website hero image`,
  `${input.category} business interior`,
  `for ${input.targetAudience}`,
  `tone: ${input.tone}`,
  "cinematic lighting",
  "premium modern brand photography",
  "clean composition with negative space for website hero text",
  "realistic, high detail, no text, no logo, 16:9",
].join(", ");

  const encodedPrompt = encodeURIComponent(prompt);
  const seed = Math.floor(Math.random() * 1_000_000_000);

  const imageUrl =
    `https://image.pollinations.ai/prompt/${encodedPrompt}` +
    `?width=1536&height=864&seed=${seed}&model=flux&nologo=true&enhance=true&private=true`;

  const response = await fetch(imageUrl, {
    method: "GET",
    headers: {
      Accept: "image/*",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Pollinations image generation failed: ${response.status}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const fileName = `hero-${randomUUID()}.png`;
  const outputDir = path.join(process.cwd(), "public", "generated");
  const outputPath = path.join(outputDir, fileName);

  await mkdir(outputDir, { recursive: true });
  await writeFile(outputPath, buffer);

  return {
    imageUrl: `/generated/${fileName}`,
    prompt,
  };
}