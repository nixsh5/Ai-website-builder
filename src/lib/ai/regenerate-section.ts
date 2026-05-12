import { GoogleGenAI, Type } from "@google/genai";
import { SectionType } from "@prisma/client";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

type RegenerateInput = {
  businessName: string;
  category: string;
  services: string[];
  targetAudience: string;
  tone: string;
  sectionType: SectionType;
};

export async function regenerateSingleSection(input: RegenerateInput) {
  const basePrompt = `
You are generating one section of a small business website.

Business name: ${input.businessName}
Category: ${input.category}
Services: ${input.services.join(", ")}
Target audience: ${input.targetAudience}
Preferred tone/style: ${input.tone}

Rules:
- Write realistic website copy.
- Keep it specific to the business.
- Do not use placeholders.
- Do not output markdown.
- Return only JSON matching the schema.
`;

  if (input.sectionType === SectionType.HERO) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${basePrompt}
Generate only the Hero section.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            ctaText: { type: Type.STRING },
          },
          required: ["headline", "subheadline", "ctaText"],
        },
      },
    });

    if (!response.text) throw new Error("Empty Hero response");
    return JSON.parse(response.text);
  }

  if (input.sectionType === SectionType.ABOUT) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${basePrompt}
Generate only the About section.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            body: { type: Type.STRING },
          },
          required: ["title", "body"],
        },
      },
    });

    if (!response.text) throw new Error("Empty About response");
    return JSON.parse(response.text);
  }

  if (input.sectionType === SectionType.SERVICES) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${basePrompt}
Generate only the Services section with 3 to 6 service items.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                },
                required: ["name", "description"],
              },
            },
          },
          required: ["title", "items"],
        },
      },
    });

    if (!response.text) throw new Error("Empty Services response");
    return JSON.parse(response.text);
  }

  if (input.sectionType === SectionType.FAQ) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${basePrompt}
Generate only the FAQ section with 4 to 6 question-answer items.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  question: { type: Type.STRING },
                  answer: { type: Type.STRING },
                },
                required: ["question", "answer"],
              },
            },
          },
          required: ["title", "items"],
        },
      },
    });

    if (!response.text) throw new Error("Empty FAQ response");
    return JSON.parse(response.text);
  }

  if (input.sectionType === SectionType.CTA) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `${basePrompt}
Generate only the CTA section.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            headline: { type: Type.STRING },
            description: { type: Type.STRING },
            buttonText: { type: Type.STRING },
          },
          required: ["headline", "description", "buttonText"],
        },
      },
    });

    if (!response.text) throw new Error("Empty CTA response");
    return JSON.parse(response.text);
  }

  throw new Error("Unsupported section type");
}