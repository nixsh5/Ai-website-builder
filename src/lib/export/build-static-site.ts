import { Prisma } from "@prisma/client";

type Section = {
  type: string;
  content: Prisma.JsonValue;
};

type Theme = "MODERN" | "ELEGANT" | "BOLD" | "MINIMAL";

type BuildStaticSiteInput = {
  businessName: string;
  heroImageUrl: string | null;
  sections: Section[];
  theme: Theme;
};

export function buildStaticSite(input: BuildStaticSiteInput) {
  const hero = input.sections.find((s) => s.type === "HERO")?.content as
    | { headline?: string; subheadline?: string; ctaText?: string }
    | undefined;

  const about = input.sections.find((s) => s.type === "ABOUT")?.content as
    | { title?: string; body?: string }
    | undefined;

  const services = input.sections.find((s) => s.type === "SERVICES")?.content as
    | { title?: string; items?: { name?: string; description?: string }[] }
    | undefined;

  const faq = input.sections.find((s) => s.type === "FAQ")?.content as
    | { title?: string; items?: { question?: string; answer?: string }[] }
    | undefined;

  const cta = input.sections.find((s) => s.type === "CTA")?.content as
    | { headline?: string; description?: string; buttonText?: string }
    | undefined;

  const themeMap: Record<
    Theme,
    {
      bg: string;
      surface: string;
      text: string;
      muted: string;
      border: string;
      accent: string;
    }
  > = {
    MODERN: {
      bg: "#f7f7f8",
      surface: "#ffffff",
      text: "#111111",
      muted: "#5f6368",
      border: "#e5e7eb",
      accent: "#111111",
    },
    ELEGANT: {
      bg: "#f8f5f1",
      surface: "#ffffff",
      text: "#2c241f",
      muted: "#6b625c",
      border: "#e7ddd3",
      accent: "#2c241f",
    },
    BOLD: {
      bg: "#fff7ed",
      surface: "#ffffff",
      text: "#111827",
      muted: "#5b6472",
      border: "#fed7aa",
      accent: "#ea580c",
    },
    MINIMAL: {
      bg: "#fafafa",
      surface: "#ffffff",
      text: "#18181b",
      muted: "#71717a",
      border: "#e4e4e7",
      accent: "#18181b",
    },
  };

  const theme = themeMap[input.theme];

  const imageMarkup = input.heroImageUrl
    ? `<img src="./assets/hero.png" alt="${escapeHtml(input.businessName)} hero image" class="hero-image" />`
    : `<div class="hero-image placeholder">Hero image</div>`;

  const servicesMarkup = (services?.items ?? [])
    .map(
      (item) => `
        <div class="card">
          <h3>${escapeHtml(item.name ?? "")}</h3>
          <p>${escapeHtml(item.description ?? "")}</p>
        </div>
      `
    )
    .join("");

  const faqMarkup = (faq?.items ?? [])
    .map(
      (item) => `
        <div class="faq-item">
          <h3>${escapeHtml(item.question ?? "")}</h3>
          <p>${escapeHtml(item.answer ?? "")}</p>
        </div>
      `
    )
    .join("");

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(input.businessName)}</title>
  <link rel="stylesheet" href="./styles.css" />
</head>
<body>
  <main>
    <section class="hero">
      <div class="container hero-grid">
        <div>
          <p class="eyebrow">AI Generated Website</p>
          <h1>${escapeHtml(hero?.headline ?? input.businessName)}</h1>
          <p class="lead">${escapeHtml(hero?.subheadline ?? "")}</p>
          <a href="#contact" class="button">${escapeHtml(hero?.ctaText ?? "Get Started")}</a>
        </div>
        <div>
          ${imageMarkup}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>${escapeHtml(about?.title ?? "About Us")}</h2>
        <p>${escapeHtml(about?.body ?? "")}</p>
      </div>
    </section>

    <section class="section alt">
      <div class="container">
        <h2>${escapeHtml(services?.title ?? "Services")}</h2>
        <div class="grid">
          ${servicesMarkup}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <h2>${escapeHtml(faq?.title ?? "Frequently Asked Questions")}</h2>
        <div class="faq-list">
          ${faqMarkup}
        </div>
      </div>
    </section>

    <section class="section cta" id="contact">
      <div class="container">
        <h2>${escapeHtml(cta?.headline ?? "Let’s Work Together")}</h2>
        <p>${escapeHtml(cta?.description ?? "")}</p>
        <a href="mailto:hello@example.com" class="button">${escapeHtml(cta?.buttonText ?? "Contact Us")}</a>
      </div>
    </section>
  </main>
</body>
</html>`;

  const css = `:root {
  --bg: ${theme.bg};
  --surface: ${theme.surface};
  --text: ${theme.text};
  --muted: ${theme.muted};
  --border: ${theme.border};
  --accent: ${theme.accent};
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  font-family: Inter, Arial, sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.6;
}

img {
  max-width: 100%;
  display: block;
}

main {
  min-height: 100vh;
}

.container {
  width: min(1120px, calc(100% - 32px));
  margin: 0 auto;
}

.hero,
.section {
  padding: 72px 0;
  border-bottom: 1px solid var(--border);
}

.alt {
  background: color-mix(in srgb, var(--bg) 70%, white 30%);
}

.hero-grid {
  display: grid;
  gap: 40px;
  align-items: center;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.eyebrow {
  margin: 0 0 12px;
  color: var(--muted);
  font-size: 14px;
  font-weight: 600;
}

h1, h2, h3 {
  margin: 0 0 16px;
  line-height: 1.15;
}

h1 {
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  max-width: 10ch;
}

h2 {
  font-size: 2rem;
}

.lead {
  max-width: 55ch;
  color: var(--muted);
  font-size: 1.1rem;
}

.button {
  display: inline-block;
  margin-top: 24px;
  background: var(--accent);
  color: white;
  text-decoration: none;
  padding: 14px 22px;
  border-radius: 12px;
  font-weight: 600;
}

.hero-image {
  width: 100%;
  border-radius: 24px;
  border: 1px solid var(--border);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  object-fit: cover;
}

.placeholder {
  min-height: 320px;
  background: #f1f5f9;
  display: grid;
  place-items: center;
  color: var(--muted);
}

.grid {
  display: grid;
  gap: 20px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.card,
.faq-item {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 20px;
}

.card p,
.faq-item p,
.section p {
  color: var(--muted);
}

.cta {
  text-align: left;
}

@media (max-width: 900px) {
  .hero-grid,
  .grid {
    grid-template-columns: 1fr;
  }

  .hero,
  .section {
    padding: 56px 0;
  }
}
`;

  return { html, css };
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}