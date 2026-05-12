import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const ai = new GoogleGenAI({ apiKey });

export type GeneratedWebsiteData = {
  hero: {
    headline: string;
    subheadline: string;
    ctaText: string;
  };
  about: {
    title: string;
    body: string;
  };
  services: {
    title: string;
    items: {
      name: string;
      description: string;
    }[];
  };
  faq: {
    title: string;
    items: {
      question: string;
      answer: string;
    }[];
  };
  cta: {
    headline: string;
    description: string;
    buttonText: string;
  };
};

export async function generateWebsiteContent(input: {
  businessName: string;
  category: string;
  services: string[];
  targetAudience: string;
  tone: string;
}): Promise<GeneratedWebsiteData> {
  const prompt = `
You are generating structured website content for a small business website.

Business name: ${input.businessName}
Category: ${input.category}
Services: ${input.services.join(", ")}
Target audience: ${input.targetAudience}
Preferred tone/style: ${input.tone}

Rules:
- Write clear, realistic small-business website copy.
- Keep it specific to the business.
- Do not use placeholders.
- Do not output markdown.
- Return only structured JSON matching the schema.
- Services should have 3 to 6 items.
- FAQ should have 4 to 6 items.
- CTA should feel action-oriented.
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          hero: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              subheadline: { type: Type.STRING },
              ctaText: { type: Type.STRING },
            },
            required: ["headline", "subheadline", "ctaText"],
          },
          about: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              body: { type: Type.STRING },
            },
            required: ["title", "body"],
          },
          services: {
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
          faq: {
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
          cta: {
            type: Type.OBJECT,
            properties: {
              headline: { type: Type.STRING },
              description: { type: Type.STRING },
              buttonText: { type: Type.STRING },
            },
            required: ["headline", "description", "buttonText"],
          },
        },
        required: ["hero", "about", "services", "faq", "cta"],
      },
    },
  });

  const text = response.text;

  if (!text) {
    throw new Error("Gemini returned an empty response");
  }

  return JSON.parse(text) as GeneratedWebsiteData;
}